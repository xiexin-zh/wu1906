## 技术栈

后端框架：ThinkPHP 5.0.2
前端MVVM框架：Vue.JS 2.5.x 
路由：Vue-Router 3.x 
数据交互：Axios 
UI框架：Element-UI 2.6.3 

## 开发依赖

### 数据交互 
数据交互通过axios以及RESTful架构来实现 
用户校验通过登录返回的auth_key放在header 

### 前端部署
安装node.js 前端部分是基于node.js上运行的，所以必须先安装`node.js`，版本要求为6.0以上

> npm install

- 修改内部配置 修改请求地址或域名：config/dev.env.js里修改BASE_API
- 开发环境服务端地址，默认localhost 
- 修改自定义端口：config/index.js里面的dev对象的port参数（默认8080，不建议修改）

### 运行前端
> npm run dev
