# Wechat JS-API接口 

[![npm version](https://badge.fury.io/js/wechat_interaction_jsapi.svg)](http://badge.fury.io/js/wechat_interaction_jsapi)

## 功能： 
用于管理和获取微信 JSSDK 生产的*access_token*、*jsapi_ticket*和签名（*signature*）

## Installation
```
npm i wechat_interaction_jsapi
```

## Init
```
let Jsapi = require("wechat_interaction_jsapi"); 
```

## Usage

WECHAT_APPID, WECHAT_APPSECRET 分别为开发者 id 和密码，在微信公众平台->开发->基本配置里可找到
```
const jssdk = new Jsapi(WECHAT_APPID, WECHAT_APPSECRET);
```

1、获取 access_token, 返回promise对象，resolve回调返回string
```
jssdk.getAccessToken().then(
    re => console.log(re)
).catch(err => console.error(err));
```

2、获取 jsapi_ticket, 返回promise对象，resolve回调返回string
```
jssdk.getJsApiTicket().then(
    re => console.log(re)
).catch(err => console.error(err));
```

3、获取 JS-SDK 权限验证的签名, 返回promise对象，resolve回调返回json
```
jssdk.getSignPackage(url).then(
    re => console.log(JSON.stringify(re))
).catch(err => console.error(err));
```

## 流程图

1、第一种方式（参数重复出现，条理清楚）

![](http://images2017.cnblogs.com/blog/896608/201709/896608-20170905172919851-1784537047.png)

2、第二种方式（参数不重复出现，条理不清楚）

![](http://images2017.cnblogs.com/blog/896608/201709/896608-20170905172931819-1662613866.png)

## 前端调用方法

### 1、参考官方文档
> https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421141115

### 2、注意事项：

（1）确认白名单已配置：微信公众平台->开发->基本配置->ip白名单 

（2）确认JS接口安全域名已配置：微信公众平台->设置->公众号配置->JS接口安全域名
