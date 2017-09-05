# Wechat JS-SDK接口 

## 功能： 
用于管理和获取微信 JSSDK 的*access_token*、*jsapi_ticket*和根据参数生成签名（*signature*）

## Install
```
npm i wechat_interaction_jsapi
```

## Init
```
let Jssdk = require("./Jssdk"); 
```

## Usage
```
//WECHAT_APPID, WECHAT_APPSECRET 分别为开发者 id 和密码，在微信公众平台->开发->基本配置里可找到
const jssdk = new Jssdk(WECHAT_APPID, WECHAT_APPSECRET);

//获取 access_token
jssdk.getAccessToken().then(re => JSON.stringify(re));

//获取 jsapi_ticket
jssdk.getJsApiTicket().then(re => JSON.stringify(re));

//获取 JS-SDK 权限验证的签名
jssdk.getSignPackage(url).then(re => JSON.stringify(re));
```

## 具体介绍（官方文档）
> https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421140183

## 流程图
