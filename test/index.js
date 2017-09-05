//npm i wechat_interaction_jsapi
let Jsapi = require('wechat_interaction_jsapi');
let config = require("./config");

let http = require('http');
let Url = require('url');

http.createServer(function (req, res) {

    res.writeHead(200, {
        'Content-Type': 'text/plain; charset=utf-8',
        'Access-Control-Allow-origin': '*'
    });

    // 解析url
    let params = Url.parse(req.url, true).query;
    let url = decodeURIComponent(params.url) || false;

    // 判断传入参数
    if (!url) {
        res.end("参数不全");
        return;
    }

    const jsapi = new Jsapi(config.WECHAT_APPID, config.WECHAT_APPSECRET);

    // //1、获取 access_token, 返回promise对象，resolve回调返回string
    // jsapi.getAccessToken().then(
    //     re => res.end(re)
    // ).catch(err => console.error(err));

    // //2、获取 jsapi_ticket, 返回promise对象，resolve回调返回string
    // jsapi.getJsApiTicket().then(
    //     re => res.end(re)
    // ).catch(err => console.error(err));

    //3、获取 JS-SDK 权限验证的签名, 返回promise对象，resolve回调返回json
    jsapi.getSignPackage(url).then(
        re => res.end(JSON.stringify(re))
    ).catch(err => console.error(err));

}).listen(3000);

