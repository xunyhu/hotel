// src/routes/pay.js
const express = require("express");
const crypto = require("crypto");
const axios = require("axios");
const qs = require("qs");
const { appid, mch_id, apiKey, notify_url } = require("../config/wechatPay");

const router = express.Router();

// 生成随机字符串
const getNonceStr = () => Math.random().toString(36).substring(2, 15);

// 生成签名
function generateSign(params) {
  const stringA = Object.keys(params)
    .filter(
      (key) => params[key] !== undefined && params[key] !== "" && key !== "sign"
    )
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");
  const stringSignTemp = stringA + `&key=${apiKey}`;
  return crypto
    .createHash("md5")
    .update(stringSignTemp, "utf8")
    .digest("hex")
    .toUpperCase();
}

// 转成 XML
function buildXML(params) {
  let xml = "<xml>";
  for (let key in params) {
    xml += `<${key}><![CDATA[${params[key]}]]></${key}>`;
  }
  xml += "</xml>";
  return xml;
}

// 解析 XML
const parseString = require("xml2js").parseString;

// 微信支付统一下单接口
router.post("/createOrder", async (req, res) => {
  const { openid, total_fee, out_trade_no, body } = req.body;

  const params = {
    appid,
    mch_id,
    nonce_str: getNonceStr(),
    body: body || "测试订单",
    out_trade_no,
    total_fee, // 分为单位
    spbill_create_ip: req.ip.replace("::ffff:", ""), // 客户端IP
    notify_url,
    trade_type: "JSAPI", // JSAPI 小程序/公众号支付
    openid,
  }; /*  */

  params.sign = generateSign(params); // 生成签名

  const xmlData = buildXML(params);

  try {
    const { data } = await axios.post(
      "https://api.mch.weixin.qq.com/pay/unifiedorder",
      xmlData,
      {
        headers: { "Content-Type": "text/xml" },
      }
    );

    parseString(data, { explicitArray: false, trim: true }, (err, result) => {
      if (err) return res.status(500).json({ message: "XML解析失败" });
      const response = result.xml;

      if (
        response.return_code === "SUCCESS" &&
        response.result_code === "SUCCESS"
      ) {
        // 返回前端调用支付所需参数
        const prepay_id = response.prepay_id;
        const timeStamp = Math.floor(Date.now() / 1000).toString();
        const paySignParams = {
          appId: appid,
          timeStamp,
          nonceStr: getNonceStr(),
          package: `prepay_id=${prepay_id}`,
          signType: "MD5",
        };
        paySignParams.paySign = generateSign(paySignParams);

        res.json({
          code: 0,
          data: paySignParams,
        });
      } else {
        res.json({
          code: 1,
          message: response.return_msg || response.err_code_des,
        });
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "统一下单失败", err });
  }
});

module.exports = router;
