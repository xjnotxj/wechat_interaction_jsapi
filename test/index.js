let Jssdk = require("./Jssdk");
let config = require("./config");

let http = require('http');
let Url = require('url');

http.createServer(function (req, res) {

    res.writeHead(200, {
        'Content-Type': 'text/plain; charset=utf-8',
        'Access-Control-Allow-origin': '*'
    });

    // 解析 url 参数
    let params = Url.parse(req.url, true).query;

    let url = decodeURIComponent(params.url) || false;

    // 判断传入参数
    if (!url) {
        res.end("参数不全");
        return;
    }

    const jssdk = new Jssdk(config.WECHAT_APPID, config.WECHAT_APPSECRET);

    jssdk.getSignPackage(url).then(re => res.end(JSON.stringify(re)));


}).listen(3000);

