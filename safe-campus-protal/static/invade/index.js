var express = require('express')
var proxy = require('express-http-proxy')

var proxyMiddleWare = require('http-proxy-middleware')
var app = express()
var proxyPath = 'http://192.168.1.24:10080/' // 目标后端服务地址
var proxyOption = {
  target: proxyPath,
  changeOrigoin: true,
  ws: true,
  pathRewrite: {
    '^/control': '/'
  }
}
app.use(express.static(__dirname + '/'))
app.use('/control', proxyMiddleWare(proxyOption))
app.listen(4000) // 4000是我要启动的端口
