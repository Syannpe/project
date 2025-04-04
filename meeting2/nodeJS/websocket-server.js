// 1：安装nodeJS
// 2：在cmd中输入 npm install nodejs-websocket 从而安装nodejs-websocket
// 3: 用nodeJS运行此代码从而开启服务器
// 4: 用websocket API访问相应接口

var http = require("http");
var ws = require("nodejs-websocket");
var httpserver = new http.Server();
httpserver.on("request",function (req,res){
    if(req.url === "/"){
        res.writeHead(200,{"Content-type":"text/html"});
        res.end();
    }
});
var wsserver = ws.createServer({server:httpserver},function (con){
    con.on("text",function (str){
        console.log("ontext: "+str);
        this.sendText(str);
    })
    con.on("error",function (code,reason){
        console.log("error code: " + code + "reason: " + reason);
    })
    con.on("close",function (){
        console.log("closed");
    });
    con.on("message",function (m) {
        console.log("onmessage :"+m);
    });
});
wsserver.on("connection",function (s){
    console.log("connection");
    s.on("message",function (m) {
        console.log("onmessage :"+m);
    });

});
wsserver.listen(3000);