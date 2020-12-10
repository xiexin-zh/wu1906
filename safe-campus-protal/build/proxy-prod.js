const proxyProd = {
  '/oss_upload': {
    target: 'http://canpoint-photo.oss-cn-beijing.aliyuncs.com/',
    changeOrigin: true,
    ws: true,
    pathRewrite: {
      '^/oss_upload': ''
    }
  },
  '/protal_api_10060': {
    target: 'http://canpointtest.com/protal_api_10060', // 平台应用系统
    changeOrigin: true,
    pathRewrite: {
      '^/protal_api_10060': ''
    }
  },
  '/protal_api_10162': {
    target: 'http://canpointtest.com/protal_api_10162', // 门禁系统
    changeOrigin: true,
    pathRewrite: {
      '^/protal_api_10162': ''
    }
  },
  '/protal_api_11004': {
    target: 'http://canpointtest.com/protal_api_11004', // 考勤系统
    changeOrigin: true,
    pathRewrite: {
      '^/protal_api_11004': ''
    }
  },
  '/protal_api_10160': {
    target: 'http://canpointtest.com/protal_api_10160', // 访客系统
    changeOrigin: true,
    pathRewrite: {
      '^/protal_api_10160': ''
    }
  },
  '/protal_api_11005': {
    target: 'http://canpointtest.com/protal_api_11005', // 疫情系统
    changeOrigin: true,
    pathRewrite: {
      '^/protal_api_11005': ''
    }
  },
  '/protal_api_11006': {
    target: 'http://canpointtest.com/protal_api_11006', // 宿管系统
    changeOrigin: true,
    pathRewrite: {
      '^/protal_api_11006': ''
    }
  },
  '/protal_api_11011': {
    target: 'http://canpointtest.com/protal_api_11011', // 信息发布
    changeOrigin: true,
    pathRewrite: {
      '^/protal_api_11011': ''
    }
  },
  '/protal_api_11009': {
    target: 'http://canpointtest.com/protal_api_11009', // 班牌管理
    changeOrigin: true,
    pathRewrite: {
      '^/protal_api_11009': ''
    }
  },
  '/protal_api_11010': {
    target: 'http://canpointtest.com/protal_api_11010', // 课表管理
    changeOrigin: true,
    pathRewrite: {
      '^/protal_api_11010': ''
    }
  },
  '/protal_api_11012': {
    target: 'http://canpointtest.com/protal_api_11012', // 德育评分
    changeOrigin: true,
    pathRewrite: {
      '^/protal_api_11012': ''
    }
  },
  '/protal_api_11013': {
    target: 'http://canpointtest.com/protal_api_11013', // 考试计划
    changeOrigin: true,
    pathRewrite: {
      '^/protal_api_11013': ''
    }
  },
  '/protal_api_11014': {
    target: 'http://canpointtest.com/protal_api_11014', // OA办公系统
    changeOrigin: true,
    pathRewrite: {
      '^/protal_api_11014': ''
    }
  },
  '/protal_api_10090': {
    target: 'http://canpointtest.com/protal_api_10090', // 控制中心
    changeOrigin: true,
    pathRewrite: {
      '^/protal_api_10090': ''
    }
  },
  '/protal_api_11002': {
    target: 'http://canpointtest.com/protal_api_11002', // 用户中心
    changeOrigin: true,
    pathRewrite: {
      '^/protal_api_11002': ''
    }
  },
  '/protal_api_8092': {
    target: 'http://canpointtest.com/protal_api_8092', // 基础数据-高教
    changeOrigin: true,
    pathRewrite: {
      '^/protal_api_8092': ''
    }
  },
  '/protal_api_10050': {
    target: 'http://canpointtest.com/protal_api_10050', // 学校管理服务
    changeOrigin: true,
    pathRewrite: {
      '^/protal_api_10050': ''
    }
  },
  '/protal_api_10166': {
    target: 'http://canpointtest.com/protal_api_10166', // 移动端用户系统
    changeOrigin: true,
    pathRewrite: {
      '^/protal_api_10166': ''
    }
  },
  '/protal_api_10097': {
    target: 'http://canpointtest.com/protal_api_10097', // 缴费系统
    changeOrigin: true,
    pathRewrite: {
      '^/protal_api_10097': ''
    }
  },
  '/protal_api_11031': {
    target: 'http://canpointtest.com/protal_api_11031', // 一卡通服务
    changeOrigin: true,
    pathRewrite: {
      '^/protal_api_11031': ''
    }
  },
  '/protal_api_10054': {
    target: 'http://canpointtest.com/protal_api_10054', // 校历请假服务
    changeOrigin: true,
    pathRewrite: {
      '^/protal_api_10054': ''
    }
  },
  '/protal_api_11025': {
    target: 'http://canpointtest.com/protal_api_11025', // 交易系统
    changeOrigin: true,
    pathRewrite: {
      '^/protal_api_11025': ''
    }
  },
  '/protal_api_11022': {
    target: 'http://canpointtest.com/protal_api_11022', // 授权服务
    changeOrigin: true,
    pathRewrite: {
      '^/protal_api_11022': ''
    }
  },
  '/protal_api_8091': {
    target: 'http://canpointtest.com/protal_api_8091', // 安防系统
    changeOrigin: true,
    pathRewrite: {
      '^/protal_api_8091': ''
    }
  },
  '/protal_api_18090': {
    target: 'http://canpointtest.com/protal_api_18090', // 小程序服务
    changeOrigin: true,
    pathRewrite: {
      '^/protal_api_18090': ''
    }
  },
  '/hpb_face': {
    target: 'http://39.97.213.205:8092/', // 人脸验证
    changeOrigin: true,
    pathRewrite: {
      '^/hpb_face': ''
    }
  },
  '/protal_api_8095': {
    target: 'http://canpointtest.com/protal_api_8095', // 招生迎新
    changeOrigin: true,
    pathRewrite: {
      '^/protal_api_8095': ''
    }
  },
  '/protal_api_10086': {
    target: 'http://canpointtest.com/protal_api_10086', // 桂雄-消息管理
    changeOrigin: true,
    pathRewrite: {
      '^/protal_api_10086': ''
    }
  }
}

module.exports = proxyProd
