let fs = require("fs");
let https = require('https');
let crypto = require('crypto');

class Jssdk {

    constructor(appId, appSecret) {
        this.appId = appId;
        this.appSecret = appSecret;
    }


    //生成16位随机字符串
    _createNonceStr(length = 16) {
        let chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let str = "";
        for (let i = 0; i < length; i++) {
            str += chars.charAt(Math.round(Math.random() * 16));
        }
        return str;
    }

    // access_token 应该全局存储与更新，这里写入到文件中
    _setAccessToken(filename) {

        return new Promise((resolve, reject) => {


            let url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${this.appId}&secret=${this.appSecret}`;

            //向微信服务器发送请求
            https.get(url, function (res) {
                res.setEncoding('utf8');
                res.on('data', function (data) {

                    if (data) {

                        data = JSON.parse(data);

                        const access_token = data.access_token;

                        if (!access_token) {
                            return reject(new Error("getAccessToken 请求返回数据没有access_token"));
                        }

                        let insert_data = {
                            "expire_time": new Date().getTime() + 7000 * 1000,
                            "access_token": access_token
                        };

                        //获得的access_token写入文件
                        fs.writeFile(filename, JSON.stringify(insert_data), function (err) {
                            if (err) {
                                return reject(new Error("getAccessToken 获取的access_token写入文件失败"));
                            }
                            //成功后返回access_token
                            return resolve(access_token);
                        });

                    } else {
                        return reject(new Error("getAccessToken 请求返回数据为空"));
                    }

                });
            }).on("error", function (err) {
                return resolve(err);
            });

        })

    }

    //获取access_token
    getAccessToken() {

        let that = this;

        return new Promise(function (resolve, reject) {

            let filename = 'access_token.json';

            //判断access_token.json是否存在
            fs.exists(filename, async function (exist) {

                //不存在,去获取access_token
                if (!exist) {
                    try {

                        let access_token = await that._setAccessToken(filename);
                        return resolve(access_token);

                    } catch (err) {
                        return reject(err);
                    }

                } else {//存在，直接读取access_token.json

                    fs.readFile(filename, async function (err, data) {

                        let access_token;

                        if (err) {
                            return reject(err);
                        }

                        data = JSON.parse(data);

                        if (data && data.expire_time) {

                            if (data.expire_time < new Date().getTime()) {
                                try {
                                    access_token = await that._setAccessToken(filename);
                                } catch (err) {
                                    return reject(err);
                                }
                            } else {
                                access_token = data.access_token;
                            }

                        } else {
                            try {
                                access_token = await that._setAccessToken(filename);
                            } catch (err) {
                                return reject(err);
                            }
                        }

                        return resolve(access_token);

                    });

                }

            });
        })
    }

    // jsapi_ticket 应该全局存储与更新，这里写入到文件中
    _setJsApiTicket(filename) {

        let that = this;

        return new Promise(async function (resolve, reject) {

            let access_token;

            try {
                access_token = await that.getAccessToken();
            } catch (err) {
                throw err;
            }

            let url = `https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${access_token}&type=jsapi`;

            https.get(url, function (res) {
                res.setEncoding('utf8');
                res.on('data', function (data) {

                    if (data) {

                        data = JSON.parse(data);

                        const jsapi_ticket = data.ticket;

                        if (!jsapi_ticket) {
                            return reject(new Error("getJsApiTicket 请求返回数据没有jsapi_ticket"));
                        }

                        let insert_data = {
                            "expire_time": new Date().getTime() + 7000 * 1000,
                            "jsapi_ticket": jsapi_ticket
                        };

                        //获得的access_token写入文件
                        fs.writeFile(filename, JSON.stringify(insert_data), function (err) {
                            if (err) {
                                return reject(new Error("getJsApiTicket 获取的jsapi_ticket写入文件失败"));
                            }
                            //成功后返回access_token
                            return resolve(jsapi_ticket);
                        });


                    } else {
                        return reject(new Error("getJsApiTicket 请求返回数据为空"));
                    }

                });
            }).on("error", function (err) {
                return resolve(err);
            });
        });

    }

    //获取jsapi_ticket
    getJsApiTicket() {

        let that = this;

        return new Promise(async function (resolve, reject) {

            let filename = 'jsapi_ticket.json';

            //获取jsapi_ticket.json是否存在
            fs.exists(filename, async function (exist) {

                //不存在,获取jsapi_ticket
                if (!exist) {

                    let jsapi_ticket;

                    try {
                        jsapi_ticket = await that._setJsApiTicket(filename);
                        return resolve(jsapi_ticket);
                    } catch (err) {
                        return reject(err);
                    }

                } else {//存在，直接读取jsapi_ticket.json

                    // 异步读取
                    fs.readFile(filename, async function (err, data) {

                        let jsapi_ticket = "";

                        if (err) {
                            return reject(err);
                        }

                        data = JSON.parse(data);

                        if (data && data.expire_time) {

                            if (data.expire_time < new Date().getTime()) {

                                try {
                                    jsapi_ticket = await that._setJsApiTicket(filename);
                                } catch (err) {
                                    reject(err);
                                }

                            } else {
                                jsapi_ticket = data.jsapi_ticket;
                            }

                        } else {

                            try {
                                jsapi_ticket = await that._setJsApiTicket(filename);
                            } catch (err) {
                                reject(err);
                            }
                        }

                        return resolve(jsapi_ticket);

                    });

                }
            });
        });

    }

    //获取
    async getSignPackage(url) {

        let jsapiTicket;

        try {
            jsapiTicket = await this.getJsApiTicket();
        } catch (err) {
            throw err;
        }

        let timestamp = Math.round(new Date().getTime() / 1000);
        let nonceStr = this._createNonceStr();

        // 这里参数的顺序要按照 key 值 ASCII 码升序排序
        let string = `jsapi_ticket=${jsapiTicket}&noncestr=${nonceStr}&timestamp=${timestamp}&url=${url}`;

        var sha1 = crypto.createHash('sha1');
        sha1.update(string, 'utf8');
        let signature = sha1.digest('hex');

        let signPackage = {
            "appId": this.appId,
            "nonceStr": nonceStr,
            "timestamp": timestamp,
            "signature": signature,
            "url": url,
            "string": string
        };

        return signPackage;

    }

}


module.exports = Jssdk;