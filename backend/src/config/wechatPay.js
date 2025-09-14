// src/config/wechatPay.js
module.exports = {
  appid: "你的公众号或小程序appid",
  mch_id: "你的商户号",
  apiKey: "商户API密钥", // 用于签名
  notify_url: "https://yourdomain.com/api/pay/notify", // 微信支付回调地址
};
