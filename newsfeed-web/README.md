# newsfeed-web

- 框架： [React](https://github.com/facebook/react)、[dva](https://github.com/dvajs/dva)

## Getting Started

- Install:

```bash
npm install
```

- Start:

```bash
npm start
```

## Build

```bash
npm run build
```

配置信息存储在 `package.json`
> 其中：
> 版本号由 version 控制
> clientId 设备 ID 用于登录时判断设备，web 同一使用一个

webpack 配置 `.webpackrc.js`
  BASE_URL proxy 配置

- docker 打包相关：
  [create-image](https://github.com/cityfruit/sunpeople-web/blob/dev-ui/create-image)、[docker config](https://github.com/cityfruit/sunpeople-web/tree/dev-ui/docker)

## Others

- 文件上传需要设置请求头 Content-Disposition 和 Content-Type，而且上传文件涉及跨越，需要配置代理，让代理服务器在请求头中增加相应 Host 头部，相关设置 [.webpackrc.js](https://github.com/cityfruit/sunpeople-web/blob/dev-ui/.webpackrc.js)
- 项目构建测试 [Travis CI](https://www.travis-ci.com/)、[travis config](https://github.com/cityfruit/sunpeople-web/blob/dev-ui/.travis.yml)
- 代码风格 [editorconfig](https://github.com/cityfruit/sunpeople-web/blob/dev-ui/.editorconfig)
- 上传附件需先获取上传路径和匹配的下载路径，在用上传路径上传附件，需要设置请求头

- 登录

```

```

## web 端放棄使用的 API

### API 11.1 所有群组列表 `/nf_api/all_group_list`

>原因是該接口分頁會帶上已經追蹤的群組數據

### API 9 发布动态可选择的群组列表 `/nf_api/post_by_group_list`

>原因是該接口數據都可以在 `/nf_api/your_group` 獲取到
  且加入、退出群组是在实时变动的，如果本地不维护数据，就得每次发帖都请求这个接口 loading 数据
  在 web 端来说这不是特别好的体验，所以处理成本地维护所有群组的数据，废弃该接口
  优点：响应及时，初始化完成后随时打开发贴，都能里面选择群组，不需要 loading
  缺点：当业务修改，比如允许粉丝发帖时，需要修改代码部署更新

### API 3. 个人主页追踪中的用户 `/nf_api/follow_user_list`

>原因是由于 web 端存在一个页面中多个地方使用追踪数据需要数据源的唯一，
所以当前登录用户的追踪信息只从 user_list userId 传自己这一个地方获取
其他任意一个地方（自己主页粉丝追踪、搜索、通知、其他人主页粉丝追踪等等）修改都更新一份数据
⚠️web 中，帖子、通知、他人页面粉丝列表、追踪列表、搜索等等任意地方，判断自己有没有追踪这个用户，都应该使用这一个地方的数据

### API 7. 追踪更多群组列表 `/nf_api/follow_group_list`

>改用 API 文檔 54 `/nf_api/your_group` 的数据，通过 identity 是否等于 2 来判断
原因和上面两个接口一样

### API 8. 发布动态可标记的用户列表 `/nf_api/mention_user_list`

>其中，個人貼時使用 6. 追踪更多个人用户 `/nf_api/user_list` 獲取並本地維護的個人追蹤信息
群組貼時使用 32. 群组成员 `/nf_api/group_member` 接口獲取
