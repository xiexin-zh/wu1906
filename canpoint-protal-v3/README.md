### vue-web-pro

#### 安装依赖
```
> cnpm i or yarn install
```

### 多环境配置

```js
const ConfigEnv = process.env.VUE_APP_URL
let hostEnv = ''

if (ConfigEnv === 'test') {
  hostEnv = 'http://prod'
} else if (ConfigEnv === 'prod') {
  hostEnv = 'http://prod'
} else {
  hostEnv = 'http://dev'
}

export default hostEnv
```

#### 本地启动
```js
> npm run dev  // 启动开发环境

> npm run dev-test // 启动测试环境

> npm run dev-prod  //启动正式环境
```


#### 本地打包

```js
> npm run build // 打包开发环境

> npm run build-test // 打包测试环境

> npm run build-prod // 打包正式环境 
```
