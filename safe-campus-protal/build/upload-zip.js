/**
 *
 * @Description 压缩文件后上传服务器
 * @Author 张立
 * @Created 2019-06-21
 *
 */
const request = require('request')
const inquirer = require('inquirer')
const os = require('os')
const path = require('path')
const fs = require('fs')
const AdmZip = require('adm-zip')
var zip = new AdmZip()
const { logs } = require('./logs')
const buildModule = process.argv[process.argv.length - 1]
const env = process.env.VUE_APP_URL || 'dev'
const envHost = {
  prod: {
    url: 'http://39.97.164.4:8090/upload-zip',
    uploadPath: '/usr/local/nginx/html/pc-protal/',
    msg: '外网正式环境',
    env: 2
  },
  test: {
    url: 'http://112.125.89.37:8090/upload-zip',
    uploadPath: '/usr/local/openresty/nginx/html/pc-protal/',
    msg: '外网测试环境',
    env: 1
  },
  dev: {
    url: 'http://192.168.2.147:8090/upload-zip',
    uploadPath: '/usr/local/nginx/html/pc-protal/',
    msg: '内网测试环境',
    env: 0
  }
}

/**
 * @des 获取ip地址
 */
function getIPAdress() {
  var interfaces = os.networkInterfaces()

  for (var devName in interfaces) {
    var iface = interfaces[devName]
    for (var i = 0; i < iface.length; i++) {
      var alias = iface[i]
      if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
        return alias.address
      }
    }
  }
}
const promptList = [
  {
    type: 'input',
    message: '请输入用户名',
    name: 'userName',
    validate: function(val) {
      if (val !== '') {
        return true
      }
      return '请输入用户名'
    }
  },
  {
    type: 'input',
    message: '请输入详情的版本更新内容',
    name: 'des',
    validate: function(val) {
      if (val !== '') {
        return true
      }
      return '请输入详情的版本更新内容'
    }
  }
]
let formData
class uploadZip {
  apply(compiler) {
    compiler.hooks.done.tap('done', compilation => {
      logs(`${buildModule}模块打包完成`)
      setTimeout(() => {
        const msg = envHost[env].msg
        logs(
          `正准备上传${buildModule}模块到${msg}, 请输入更新内容，(发布时确保代码已经更新，避免每个人发布版本时把其他人修复的功能覆盖)`
        )
        inquirer.prompt(promptList).then(answers => {
          zip.addLocalFolder('dist')
          zip.writeZip(`${buildModule}.zip`)
          formData = {
            file: fs.createReadStream(path.resolve(__dirname, `../${buildModule}.zip`))
          }
          uploadFile('test', answers)
          uploadFile('prod', answers)
        })
      }, 500)
    })
  }
}

function uploadFile(env, answers) {
  const url = envHost[env].url + '?uploadPath=' + envHost[env].uploadPath
  console.log(url)
  try {
    request.post(
      {
        url: url,
        formData: formData
      },
      function(error, response, body) {
        if (!error && response.statusCode === 200) {
          console.log('发布成功')
          fs.unlink(path.resolve(__dirname, `../${buildModule}.zip`), function() {})
          // process.exit()
        }
      }
    )
  } catch (err) {}
}
module.exports = uploadZip
