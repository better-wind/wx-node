var webpack = require('webpack')
var path = require('path')
var webpackConfig = require('./webpack.config')
var express = require('express')
var request = require('request')
Object.keys(webpackConfig.entry).forEach(function (name) {
    webpackConfig.entry[name] = [path.resolve(__dirname,'./dev-client.js')].concat(webpackConfig.entry[name])
})
var app = express()
var compiler = webpack(webpackConfig)

var devMiddleware = require('webpack-dev-middleware')(compiler, {
    publicPath: webpackConfig.output.publicPath,
    quiet: true
})
var hotMiddleware = require('webpack-hot-middleware')(compiler,{
        log:()=>{}
})
compiler.plugin('compilation', function (compilation) {
    compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
        console.log('------------')
        hotMiddleware.publish({ action: 'reload' })
        cb()
    })
})
app.use(devMiddleware)
app.use(hotMiddleware)

// app.use(express.static(path.resolve(__dirname,'../')));
app.listen('80')
var router = express.Router();
var AppID = 'wx5dfca9518cfe8b50';
var AppSecret = '4ca865d65fdb9600ae5dd0f5dabcbbca';
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    if(req.method=="OPTIONS") res.send(200);/*让options请求快速返回*/
    else  next();
});
// router.get('/wx_login', function(req,res, next){
//     console.log("oauth - login")
//
//     // 第一步：用户同意授权，获取code
//     var router = 'getWX';
//     // 这是编码后的地址
//     var return_uri = 'http%3A%2F%2F127.0.0.1%2F'+router;
//     var scope = 'snsapi_userinfo';
//     // request.get({
//     //     url:'https://open.weixin.qq.com/connect/oauth2/authorize?appid='+AppID+'&redirect_uri='+return_uri+'&response_type=code&scope='+scope+'&state=STATE#wechat_redirect',
//     //     headers:{'Access-Control-Allow-Origin':'*'}
//     // },function(error, response, body){
//     //     res.send(body);
//     //     console.log(body)
//     // })
//     // res.header({'Access-Control-Allow-Origin':'*',
//     //     'Origin':'https://127.0.0.1'});
//     res.redirect('https://open.weixin.qq.com/connect/oauth2/authorize?appid='+AppID+'&redirect_uri='+return_uri+'&response_type=code&scope='+scope+'&state=STATE#wechat_redirect');
//
// });
app.get('/wx_login', function(req,res, next){
    console.log("oauth - login")

    // 第一步：用户同意授权，获取code
    var router = 'getWX';
    // 这是编码后的地址
    var return_uri = 'http%3A%2F%2F127.0.0.1%2F'+router;
    var scope = 'snsapi_userinfo';
    // request.get({
    //     url:'https://open.weixin.qq.com/connect/oauth2/authorize?appid='+AppID+'&redirect_uri='+return_uri+'&response_type=code&scope='+scope+'&state=STATE#wechat_redirect',
    //     headers:{'Access-Control-Allow-Origin':'*'}
    // },function(error, response, body){
    //     res.send(body);
    //     console.log(body)
    // })
    // res.header({'Access-Control-Allow-Origin':'*',
    //     'Origin':'https://127.0.0.1'});
    res.redirect('https://open.weixin.qq.com/connect/oauth2/authorize?appid='+AppID+'&redirect_uri='+return_uri+'&response_type=code&scope='+scope+'&state=STATE#wechat_redirect');

});
router.get('/getWX', function(req,res, next){
    console.log("code_return: "+req.query.code)
    var code = req.query.code;
    request.get(
        {
            url:'https://api.weixin.qq.com/sns/oauth2/access_token?appid='+AppID+'&secret='+AppSecret+'&code='+code+'&grant_type=authorization_code',
        },
        function(error, response, body){
            if(response.statusCode == 200){

                // 第三步：拉取用户信息(需scope为 snsapi_userinfo)
                console.log(JSON.parse(body));
                var data = JSON.parse(body);
                var access_token = data.access_token;
                var openid = data.openid;

                request.get(
                    {
                        url:'https://api.weixin.qq.com/sns/userinfo?access_token='+access_token+'&openid='+openid+'&lang=zh_CN',
                    },
                    function(error, response, body){
                        if(response.statusCode == 200){

                            // 第四步：根据获取的用户信息进行对应操作
                            var userinfo = JSON.parse(body);
                            //console.log(JSON.parse(body));
                            console.log('获取微信信息成功！');

                            // 小测试，实际应用中，可以由此创建一个帐户
                            res.send("\
                                <h1>"+userinfo.nickname+" 的个人信息</h1>\
                                <p><img src='"+userinfo.headimgurl+"' /></p>\
                                <p>"+userinfo.city+"，"+userinfo.province+"，"+userinfo.country+"</p>\
                            ");

                        }else{
                            console.log(response.statusCode);
                        }
                    }
                );
            }else{
                console.log(response.statusCode);
            }
        }
    );
})
router.get('/get_wx_access_token', function(req,res, next){
    console.log("get_wx_access_token")
    console.log("code_return: "+req.query.code)

    return false
    // 第二步：通过code换取网页授权access_token
    var code = req.query.code;
    request.get(
        {
            url:'https://api.weixin.qq.com/sns/oauth2/access_token?appid='+AppID+'&secret='+AppSecret+'&code='+code+'&grant_type=authorization_code',
        },
        function(error, response, body){
            if(response.statusCode == 200){

                // 第三步：拉取用户信息(需scope为 snsapi_userinfo)
                console.log(JSON.parse(body));
                var data = JSON.parse(body);
                var access_token = data.access_token;
                var openid = data.openid;

                request.get(
                    {
                        url:'https://api.weixin.qq.com/sns/userinfo?access_token='+access_token+'&openid='+openid+'&lang=zh_CN',
                    },
                    function(error, response, body){
                        if(response.statusCode == 200){

                            // 第四步：根据获取的用户信息进行对应操作
                            var userinfo = JSON.parse(body);
                            //console.log(JSON.parse(body));
                            console.log('获取微信信息成功！');

                            // 小测试，实际应用中，可以由此创建一个帐户
                            res.send("\
                                <h1>"+userinfo.nickname+" 的个人信息</h1>\
                                <p><img src='"+userinfo.headimgurl+"' /></p>\
                                <p>"+userinfo.city+"，"+userinfo.province+"，"+userinfo.country+"</p>\
                            ");

                        }else{
                            console.log(response.statusCode);
                        }
                    }
                );
            }else{
                console.log(response.statusCode);
            }
        }
    );
});
app.use(router)
