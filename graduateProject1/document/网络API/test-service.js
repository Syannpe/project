const networkAPI = require('../../src/config/networkAPI.json');
const cors = require('cors'); // 引入 cors 中间件

// server.js
const express = require('express');
const app = express();
const port = 80; // 根据需求设置监听端口

// 使用 express 内置中间件解析 JSON 与 URL-encoded 数据
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

/**
 * 封装 API 请求对象（面向对象设计）
 */
class ApiRequest {
    constructor(apiData) {
        this.name = apiData.name;
        this.url = apiData.url;
        this.method = apiData.method.toUpperCase();
        this.desc = apiData.desc;
        this.options = apiData.options;
    }

    /**
     * 返回默认的响应文本
     */
    getDefaultResponse() {
        console.log(`请求【${this.name}】成功，返回默认信息`)
        return `请求【${this.name}】成功，返回默认信息`;
    }
}

/**
 * 封装路由注册类，通过 networkAPI 数组动态注册路由
 */
class RouterRegistrar {
    constructor(apiList) {
        // 将每个对象转换为 ApiRequest 实例
        this.apiList = apiList.map(item => new ApiRequest(item));
    }

    registerRoutes(appInstance) {
        this.apiList.forEach(api => {
            console.log(`注册路由：${api.method} ${api.url}`)
            if (api.method === 'GET') {
                appInstance.get(api.url, (req, res) => {
                    console.log(`收到 GET 请求：${api.url}`);
                    console.log('查询参数：', req.query);
                    res.send(api.getDefaultResponse());
                });
            } else if (api.method === 'POST') {
                appInstance.post(api.url, (req, res) => {
                    console.log(`收到 POST 请求：${api.url}`);
                    console.log('请求体：', req.body);
                    res.send(api.getDefaultResponse());
                });
            } else {
                // 对于其他 HTTP 方法使用通用处理
                appInstance.all(api.url, (req, res) => {
                    console.log(`收到 ${req.method} 请求：${api.url}`);
                    res.send(api.getDefaultResponse());
                });
            }
        });
    }
}

// 实例化路由注册器，并注册所有路由
const registrar = new RouterRegistrar(networkAPI);
registrar.registerRoutes(app);

// 启动服务器
app.listen(port, () => {
    console.log(`Express 服务器已启动，监听端口 ${port}`);
});
