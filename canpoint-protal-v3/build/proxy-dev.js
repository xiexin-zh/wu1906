const proxyDev = {
  '/oss_upload': {
    target: 'http://canpoint-photo.oss-cn-beijing.aliyuncs.com/',
    changeOrigin: true,
    ws: true,
    pathRewrite: {
      '^/oss_upload': ''
    }
  },
  '/protal_v3_11101': {
    target: 'http://192.168.2.190:11101/', // 云平台v3-基础数据
    // target: 'http://192.168.1.5:11101/',
    // target: 'http://192.168.1.76:11101/',
    changeOrigin: true,
    pathRewrite: {
      '^/protal_v3_11101': ''
    }
  },
  '/protal_v3_11102': {
    target: 'http://192.168.2.190:11102/', // 云平台v3-宿管系统
    // target: 'http://192.168.1.5:11102/', // 云平台v3-宿管系统
    changeOrigin: true,
    pathRewrite: {
      '^/protal_v3_11102': ''
    }
  },
  '/protal_v3_10087': {
    target: 'http://192.168.2.235:10087/', // 桂雄-消息管理
    changeOrigin: true,
    pathRewrite: {
      '^/protal_v3_10087': ''
    }
  },
  '/protal_api_10090': {
    // target: 'http://192.168.2.235:10090/', // 王选章-控制中心
    target: 'http://canpointtest.com/protal_api_10090',
    changeOrigin: true,
    pathRewrite: {
      '^/protal_api_10090': ''
    }
  },
  '/protal_v3_10162': {
    // target: 'http://canpointtest.com/protal_api_10162', // 门禁系统
    target: 'http://192.168.2.242:10162/',
    changeOrigin: true,
    pathRewrite: {
      '^/protal_v3_10162': ''
    }
  },
  '/protal_v3_11004': {
    target: 'http://canpointtest.com/protal_api_11004', // 考勤系统
    changeOrigin: true,
    pathRewrite: {
      '^/protal_v3_11004': ''
    }
  },
  '/protal_v3_10160': {
    // target: 'http://canpointtest.com/protal_api_10160', // 访客系统
    target: 'http://192.168.2.242:10160/', // 访客系统
    changeOrigin: true,
    pathRewrite: {
      '^/protal_v3_10160': ''
    }
  },
  '/protal_v3_11005': {
    target: 'http://canpointtest.com/protal_api_11005', // 疫情系统
    changeOrigin: true,
    pathRewrite: {
      '^/protal_v3_11005': ''
    }
  },
  '/face_upload': {
    target: 'http://39.97.213.205:8092/', // 人脸验证
    changeOrigin: true,
    pathRewrite: {
      '^/face_upload': ''
    }
  }
}

module.exports = proxyDev
