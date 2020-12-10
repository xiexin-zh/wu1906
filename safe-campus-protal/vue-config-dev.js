const path = require('path')
const utils = require('./build/utils')
const theme = require('./src/theme')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const webpack = require('webpack')
const uploadZip = require('./build/upload-zip')

function resolve(dir) {
  return path.join(__dirname, dir)
}
const isProduction = process.env.NODE_ENV === 'production'
const isCdn = process.env.VUE_APP_URL === 'prod'
// vue.config.js
module.exports = {
  devtool: 'source-map', // 代码调试
  pages: {
    ...utils.entries()
  },
  publicPath: isProduction ? '././' : '/',
  chainWebpack: config => {
    const types = ['vue-modules', 'vue', 'normal-modules', 'normal']
    types.forEach(type => addStyleResource(config.module.rule('less').oneOf(type)))
    config.resolve.alias
      .set('@$', resolve('src'))
      .set('@store', resolve('src/store'))
      .set('@a', resolve('src/assets'))
      .set('@c', resolve('src/components/common'))
      .set('@coms', resolve('src/components'))
      .set('@u', resolve('src/utils'))
      .set('@api', resolve('src/api'))
      .set('@config', resolve('src/config'))
      .set('@views', resolve('src/views'))
      .set('@layout', resolve('src/layout'))
      .set('@static', resolve('src/static'))
      .set('@ant-design/icons/lib/dist$', resolve('src/antd-icons.js'))
    const svgRule = config.module.rule('svg')
    svgRule.uses.clear()
    svgRule
      .oneOf('inline')
      .resourceQuery(/inline/)
      .use('vue-svg-icon-loader')
      .loader('vue-svg-icon-loader')
      .end()
      .end()
      .oneOf('external')
      .use('file-loader')
      .loader('file-loader')
      .options({
        name: 'assets/[name].[hash:8].[ext]'
      })
  },
  configureWebpack: config => {
    // 忽略moment其它语言库
    config.plugins.push(new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/))
    // 配置cdn模块
    if (isProduction) {
      // config.plugins.push(
      //   new BundleAnalyzerPlugin({
      //     analyzerPort: 8891
      //   })
      // )
      config.plugins.push(new uploadZip())
      config.externals = {
        vue: 'Vue',
        'vue-router': 'VueRouter',
        vuex: 'Vuex',
        axios: 'axios',
        moment: 'moment'
      }
      // 压缩代码 电子班牌特殊处理
      const buildModule = process.argv[process.argv.length - 1]
      if (buildModule !== 'protal-class' && buildModule !== 'protal-oa' && buildModule !== 'protal-common') {
        config.optimization = {
          minimizer: [
            new UglifyJsPlugin({
              uglifyOptions: {
                compress: {
                  drop_console: true
                }
              }
            })
          ]
        }
      }
    }
  },
  css: {
    extract: true,
    loaderOptions: {
      less: {
        modifyVars: theme,
        javascriptEnabled: true
      }
    }
  },
  devServer: {
    port: 8001,
    open: true,
    proxy: {
      '/oss_upload': {
        target: 'http://canpoint-photo.oss-cn-beijing.aliyuncs.com/',
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/oss_upload': ''
        }
      },
      '/ljj_dorm': {
        target: 'http://192.168.2.242:11006/', // 柳继杰-宿管
        changeOrigin: true,
        pathRewrite: {
          '^/ljj_dorm': ''
        }
      },
      '/ljj_user_center': {
        // target: 'http://192.168.1.125:11002/', // 柳继杰-局端基础数据
        target: 'http://192.168.2.242:11002/', // 柳继杰-
        changeOrigin: true,
        pathRewrite: {
          '^/ljj_user_center': ''
        }
      },
      '/ljj_edu': {
        // target: 'http://192.168.1.125:10050/', // 柳继杰-局端学校管理
        target: 'http://192.168.2.242:10050/',
        changeOrigin: true,
        pathRewrite: {
          '^/ljj_edu': ''
        }
      },
      '/wxz_control': {
        target: 'http://192.168.2.235:10090/',
        // target: 'http://192.168.1.123:10090/', // 王选章-控制中心
        changeOrigin: true,
        pathRewrite: {
          '^/wxz_control': ''
        }
      },
      '/zk_school': {
        target: 'http://192.168.2.242:10050/',
        // target: 'http://192.168.1.23:10050/', //  张坤-学校管理
        changeOrigin: true,
        pathRewrite: {
          '^/zk_school': ''
        }
      },
      '/zk_leave': {
        // target: 'http://192.168.1.23:10054/', // 张坤-校历请假
        target: 'http://192.168.2.242:10054/', // 张坤-校历请假
        changeOrigin: true,
        pathRewrite: {
          '^/zk_leave': ''
        }
      },
      '/zx_protal': {
        target: 'http://192.168.2.242:10060/', // 朱旭-平台应用系统
        changeOrigin: true,
        pathRewrite: {
          '^/zx_protal': ''
        }
      },
      '/zx_subject': {
        target: 'http://192.168.2.242:10050/',
        // target: 'http://192.168.1.24:10050/', // 朱旭-平台-学校学科教师管理
        changeOrigin: true,
        pathRewrite: {
          '^/zx_subject': ''
        }
      },
      '/lz_protal': {
        target: 'http://192.168.2.242:10060/', // 吕卓-平台应用系统
        // target: 'http://192.168.1.46:10060/', // 吕卓-平台应用系统
        changeOrigin: true,
        pathRewrite: {
          '^/lz_protal': ''
        }
      },
      '/zx_door': {
        target: 'http://192.168.2.242:10162/', // 朱旭-门禁系统
        changeOrigin: true,
        pathRewrite: {
          '^/zx_door': ''
        }
      },
      '/ljj_door': {
        target: 'http://192.168.2.242:10162/', // 朱旭-门禁系统
        changeOrigin: true,
        pathRewrite: {
          '^/ljj_door': ''
        }
      },
      '/zx_visitor': {
        target: 'http://192.168.2.242:10160/', // 朱旭-访客系统
        changeOrigin: true,
        pathRewrite: {
          '^/zx_visitor': ''
        }
      },
      '/ljj_visitor': {
        // target: 'http://192.168.1.125:10160//', // 柳继杰-访客系统
        target: 'http://192.168.2.242:10160/', // 柳继杰-访客系统
        changeOrigin: true,
        pathRewrite: {
          '^/ljj_visitor': ''
        }
      },
      '/lz_attendance': {
        target: 'http://192.168.2.242:11004/', // 吕卓-考勤
        changeOrigin: true,
        pathRewrite: {
          '^/lz_attendance': ''
        }
      },
      '/ljj_attendance': {
        target: 'http://192.168.2.242:11004/', // 柳继杰-考勤
        changeOrigin: true,
        pathRewrite: {
          '^/ljj_attendance': ''
        }
      },
      '/lz_user_center': {
        target: 'http://192.168.2.242:11002/',
        // target: 'http://192.168.1.125:11002/', // 吕卓-用户中心
        changeOrigin: true,
        pathRewrite: {
          '^/lz_user_center': ''
        }
      },
      '/lz_ncov': {
        target: 'http://192.168.2.242:11005/', // 吕卓-疫情防控
        // target: 'http://192.168.1.23:11005/',
        changeOrigin: true,
        pathRewrite: {
          '^/lz_ncov': ''
        }
      },
      // 电子班牌
      '/zq_news': {
        // target: 'http://192.168.1.241:11005/', // 张琦-信息发布
        target: 'http://192.168.2.242:11011/',
        changeOrigin: true,
        pathRewrite: {
          '^/zq_news': ''
        }
      },
      '/zk_news': {
        target: 'http://192.168.2.242:11011/', // 张坤-信息发布
        // target: 'http://192.168.1.23:11011/',
        changeOrigin: true,
        pathRewrite: {
          '^/zk_news': ''
        }
      },
      '/zq_schedule': {
        // target: 'http://192.168.1.241:11008/', // 张琦-课程表
        target: 'http://192.168.2.242:11010/',
        changeOrigin: true,
        pathRewrite: {
          '^/zq_schedule': ''
        }
      },
      '/zk_moral': {
        // target: 'http://192.168.1.23:11012/', // 张坤-德育管理
        target: 'http://192.168.2.242:11012/',
        changeOrigin: true,
        pathRewrite: {
          '^/zk_moral': ''
        }
      },
      '/zq_class': {
        target: 'http://192.168.2.242:11009/', // 张琦-班牌管理
        // target: 'http://192.168.1.23:11009/',
        changeOrigin: true,
        pathRewrite: {
          '^/zq_class': ''
        }
      },
      '/zk_class': {
        target: 'http://192.168.2.242:11009/', // 张琦-班牌管理
        // target: 'http://192.168.1.23:11009/',
        changeOrigin: true,
        pathRewrite: {
          '^/zk_class': ''
        }
      },
      '/zk_examplan': {
        target: 'http://192.168.1.23:11013/', // 张坤-考试计划
        // target: 'http://192.168.2.242:11013/',
        changeOrigin: true,
        pathRewrite: {
          '^/zk_examplan': ''
        }
      },
      '/ljj_admin': {
        target: 'http://192.168.2.242:10050/', // 柳继杰-局端模块
        changeOrigin: true,
        pathRewrite: {
          '^/ljj_admin': ''
        }
      },
      '/zq_oa': {
        // target: 'http://192.168.1.210:11014/', // 张琦-oa系统
        target: 'http://192.168.2.242:11014/',
        changeOrigin: true,
        pathRewrite: {
          '^/zq_oa': ''
        }
      },
      '/hpb_card': {
        target: 'http://192.168.2.242:11008/', // 胡鹏奔-消费
        // target: 'http://192.168.2.134:11008/', // 胡鹏奔-消费
        changeOrigin: true,
        pathRewrite: {
          '^/hpb_card': ''
        }
      },
      '/hpb_consume': {
        // target: 'http://192.168.2.134:11007/', // 胡鹏奔-一卡通
        target: 'http://192.168.2.242:11007/', // 胡鹏奔-一卡通
        changeOrigin: true,
        pathRewrite: {
          '^/hpb_consume': ''
        }
      },
      '/zx_center': {
        target: 'http://192.168.2.147:11002/', // 王选章-平台人员统计
        changeOrigin: true,
        pathRewrite: {
          '^/zx_center': ''
        }
      },
      '/ljj_ncov': {
        // target: 'http://192.168.2.242:11005/', // 柳继杰-测温计划
        target: 'http://192.168.1.76:11005/', // 柳继杰-测温计划
        changeOrigin: true,
        pathRewrite: {
          '^/ljj_ncov': ''
        }
      },
      '/hpb_face': {
        target: 'http://39.97.213.205:8092/',
        changeOrigin: true,
        pathRewrite: {
          '^/hpb_face': ''
        }
      },
      '/zk_oa': {
        target: 'http://192.168.2.242:11014/', // 张坤-报修
        changeOrigin: true,
        pathRewrite: {
          '^/zk_oa': ''
        }
      },
      '/lz_safe': {
        // target: 'http://192.168.1.46:8091/', // 吕卓-安防
        target: 'http://192.168.2.242:8091/', // 吕卓-安防
        changeOrigin: true,
        pathRewrite: {
          '^/lz_safe': ''
        }
      },
      '/ljj_people': {
        // target: 'http://192.168.1.76:11002/', // 刘继杰-局端安全任务根据选中的学校职务查人
        target: 'http://192.168.2.242:11002/',
        changeOrigin: true,
        pathRewrite: {
          '^/ljj_people': ''
        }
      },
      '/wxz_pay': {
        target: 'http://192.168.1.123:10097/', // 王选章-缴费系统
        changeOrigin: true,
        pathRewrite: {
          '^/wxz_pay': ''
        }
      },
      '/img_download': {
        target: 'http://canpoint-file.oss-cn-beijing.aliyuncs.com/', // 图片代理
        changeOrigin: true,
        pathRewrite: {
          '^/img_download': ''
        }
      },
      '/hzz_ecard': {
        target: 'http://192.168.2.242:11031/', // 胡周志-一卡通消费
        changeOrigin: true,
        pathRewrite: {
          '^/hzz_ecard': ''
        }
      },
      '/hzz_deal': {
        target: 'http://192.168.2.242:11025/', // 胡周志-交易管理系统
        changeOrigin: true,
        pathRewrite: {
          '^/hzz_deal': ''
        }
      },
      '/hzz_tooken': {
        target: 'http://192.168.2.242:11022/', // 胡周志-tooken
        changeOrigin: true,
        pathRewrite: {
          '^/hzz_tooken': ''
        }
      },
      '/hzz_apply': {
        target: 'http://192.168.2.242:11022/', // 胡周志-应用管理
        changeOrigin: true,
        pathRewrite: {
          '^/hzz_apply': ''
        }
      },
      '/wxz_notice': {
        target: 'http://canpointtest.com/protal_api_18090/', // 王选章-通知公告
        changeOrigin: true,
        pathRewrite: {
          '^/wxz_notice': ''
        }
      },
      '/ljj_high': {
        target: 'http://192.168.2.242:8092/', // 柳继杰-高校
        // target: 'http://192.168.1.76:8092/', // 柳继杰-高校
        changeOrigin: true,
        pathRewrite: {
          '^/ljj_high': ''
        }
      },
      '/wq_school': {
        // target: 'http://192.168.1.236:8095/', // 王齐-招生迎新系统
        target: 'http://192.168.2.242:8095/',
        changeOrigin: true,
        pathRewrite: {
          '^/wq_school': ''
        }
      },
      '/gx_message': {
        // target: 'http://192.168.1.5:8091/', // 桂雄-消息管理
        target: 'http://192.168.2.242:10086/',
        changeOrigin: true,
        pathRewrite: {
          '^/gx_message': ''
        }
      }
    }
  },
  productionSourceMap: false,
  lintOnSave: true,
  transpileDependencies: []
}

function addStyleResource(rule) {
  rule
    .use('style-resource')
    .loader('style-resources-loader')
    .options({
      patterns: [path.resolve(__dirname, 'src/assets/css/variables.less')]
    })
}
