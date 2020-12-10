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
      if (buildModule !== 'protal-class' && buildModule !== 'protal-oa') {
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
        target: 'http://canpoint-photo.oss-cn-beijing.aliyuncs.com',
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/oss_upload': ''
        }
      },
      '/ljj_dorm': {
        target: 'http://ps.canpointlive.com/ljj_dorm', // 柳继杰-宿管
        changeOrigin: true,
        pathRewrite: {
          '^/ljj_dorm': ''
        }
      },
      '/ljj_user_center': {
        target: 'http://canpointtest.com/ljj_user_center', // 柳继杰-局端基础数据
        changeOrigin: true,
        pathRewrite: {
          '^/ljj_user_center': ''
        }
      },
      '/ljj_edu': {
        target: 'http://canpointtest.com/ljj_edu', // 柳继杰-局端学校管理
        changeOrigin: true,
        pathRewrite: {
          '^/ljj_edu': ''
        }
      },
      '/wxz_control': {
        target: 'http://canpointtest.com/wxz_control', // 王选章-控制中心
        changeOrigin: true,
        pathRewrite: {
          '^/wxz_control': ''
        }
      },
      '/zk_school': {
        target: 'http://canpointtest.com/zk_school', //  张坤-学校管理
        changeOrigin: true,
        pathRewrite: {
          '^/zk_school': ''
        }
      },
      '/zk_leave': {
        target: 'http://canpointtest.com/zk_leave', // 张坤-校历请假
        changeOrigin: true,
        pathRewrite: {
          '^/zk_leave': ''
        }
      },
      '/zx_protal': {
        target: 'http://canpointtest.com/zx_protal', // 朱旭-平台应用系统
        changeOrigin: true,
        pathRewrite: {
          '^/zx_protal': ''
        }
      },
      '/lz_protal': {
        target: 'http://canpointtest.com/lz_protal', // 吕卓-平台应用系统
        changeOrigin: true,
        pathRewrite: {
          '^/lz_protal': ''
        }
      },
      '/zx_door': {
        target: 'http://canpointtest.com/zx_door', // 朱旭-门禁系统
        changeOrigin: true,
        pathRewrite: {
          '^/zx_door': ''
        }
      },
      '/zx_subject': {
        target: 'http://canpointtest.com/zx_subject', // 朱旭-平台-学校学科教师管理
        changeOrigin: true,
        pathRewrite: {
          '^/zx_subject': ''
        }
      },
      '/ljj_door': {
        target: 'http://canpointtest.com/ljj_door', // 柳继杰-门禁系统
        changeOrigin: true,
        pathRewrite: {
          '^/ljj_door': ''
        }
      },
      '/zx_visitor': {
        target: 'http://canpointtest.com/zx_visitor', // 朱旭-访客系统
        changeOrigin: true,
        pathRewrite: {
          '^/zx_visitor': ''
        }
      },
      '/ljj_visitor': {
        target: 'http://canpointtest.com/ljj_visitor', // 柳继杰-访客系统
        changeOrigin: true,
        pathRewrite: {
          '^/ljj_visitor': ''
        }
      },
      '/lz_attendance': {
        target: 'http://canpointtest.com/lz_attendance', // 吕卓-考勤
        changeOrigin: true,
        pathRewrite: {
          '^/lz_attendance': ''
        }
      },
      '/ljj_attendance': {
        target: 'http://canpointtest.com/ljj_attendance', // 柳继杰-考勤
        changeOrigin: true,
        pathRewrite: {
          '^/ljj_attendance': ''
        }
      },
      '/lz_user_center': {
        target: 'http://canpointtest.com/lz_user_center', // 吕卓-用户中心
        changeOrigin: true,
        pathRewrite: {
          '^/lz_user_center': ''
        }
      },
      '/lz_ncov': {
        target: 'http://canpointtest.com/lz_ncov', // 吕卓-疫情防控
        changeOrigin: true,
        pathRewrite: {
          '^/lz_ncov': ''
        }
      },
      // 电子班牌
      '/zq_news': {
        target: 'http://canpointtest.com/zq_news', // 张琦-信息发布
        changeOrigin: true,
        pathRewrite: {
          '^/zq_news': ''
        }
      },
      '/zq_schedule': {
        target: 'http://canpointtest.com/zq_schedule', // 张琦-课程表
        changeOrigin: true,
        pathRewrite: {
          '^/zq_schedule': ''
        }
      },
      '/zk_moral': {
        target: 'http://canpointtest.com/zk_moral', // 张坤-德育管理
        changeOrigin: true,
        pathRewrite: {
          '^/zk_moral': ''
        }
      },
      '/zq_class': {
        target: 'http://canpointtest.com/zq_class', // 张琦-班牌管理
        changeOrigin: true,
        pathRewrite: {
          '^/zq_class': ''
        }
      },
      '/zk_examplan': {
        target: 'http://canpointtest.com/zk_examplan', // 张坤-考试计划
        changeOrigin: true,
        pathRewrite: {
          '^/zk_examplan': ''
        }
      },
      '/ljj_admin': {
        target: 'http://canpointtest.com/ljj_admin', // 柳继杰-局端模块
        changeOrigin: true,
        pathRewrite: {
          '^/ljj_admin': ''
        }
      },
      '/zq_oa': {
        target: 'http://canpointtest.com/zq_oa', // 张琦-oa系统
        changeOrigin: true,
        pathRewrite: {
          '^/zq_oa': ''
        }
      },
      '/hpb_card': {
        target: 'http://canpointtest.com/hpb_card', //  胡鹏奔-消费
        changeOrigin: true,
        pathRewrite: {
          '^/hpb_card': ''
        }
      },
      '/hpb_consume': {
        target: 'http://canpointtest.com/hpb_consume', //  胡鹏奔-一卡通
        changeOrigin: true,
        pathRewrite: {
          '^/hpb_consume': ''
        }
      },
      '/zx_center': {
        target: 'http://canpointtest.com/zx_center', // 王选章-平台人员统计
        changeOrigin: true,
        pathRewrite: {
          '^/zx_center': ''
        }
      },
      '/ljj_ncov': {
        target: 'http://canpointtest.com/ljj_ncov', // 柳继杰-测温计划
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
        target: 'http://canpointtest.com/zk_oa', // 张坤-报修
        changeOrigin: true,
        pathRewrite: {
          '^/zk_oa': ''
        }
      },
      '/lz_safe': {
        target: 'http://canpointtest.com/lz_safe', // 吕卓-安防
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
