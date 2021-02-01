{
	"name": "智慧校园",
	"appid": "",
	"description": "",
	"versionName": "1.0.0",
	"versionCode": "100",
	"transformPx": false,
	/* 5+App特有相关 */
	"app-plus": {
		"usingComponents": true,
		"nvueCompiler": "uni-app",
		"compilerVersion": 3,
		"splashscreen": {
			"alwaysShowBeforeRender": true,
			"waiting": true,
			"autoclose": true,
			"delay": 0
		},
		/* 模块配置 */
		"modules": {},
		/* 应用发布信息 */
		"distribute": {
			/* android打包配置 */
			"android": {
				"permissions": [
					"<uses-permission android:name=\"android.permission.CHANGE_NETWORK_STATE\"/>",
					"<uses-permission android:name=\"android.permission.MOUNT_UNMOUNT_FILESYSTEMS\"/>",
					"<uses-permission android:name=\"android.permission.READ_CONTACTS\"/>",
					"<uses-permission android:name=\"android.permission.VIBRATE\"/>",
					"<uses-permission android:name=\"android.permission.READ_LOGS\"/>",
					"<uses-permission android:name=\"android.permission.ACCESS_WIFI_STATE\"/>",
					"<uses-feature android:name=\"android.hardware.camera.autofocus\"/>",
					"<uses-permission android:name=\"android.permission.WRITE_CONTACTS\"/>",
					"<uses-permission android:name=\"android.permission.ACCESS_NETWORK_STATE\"/>",
					"<uses-permission android:name=\"android.permission.CAMERA\"/>",
					"<uses-permission android:name=\"android.permission.RECORD_AUDIO\"/>",
					"<uses-permission android:name=\"android.permission.GET_ACCOUNTS\"/>",
					"<uses-permission android:name=\"android.permission.MODIFY_AUDIO_SETTINGS\"/>",
					"<uses-permission android:name=\"android.permission.READ_PHONE_STATE\"/>",
					"<uses-permission android:name=\"android.permission.CHANGE_WIFI_STATE\"/>",
					"<uses-permission android:name=\"android.permission.WAKE_LOCK\"/>",
					"<uses-permission android:name=\"android.permission.CALL_PHONE\"/>",
					"<uses-permission android:name=\"android.permission.FLASHLIGHT\"/>",
					"<uses-permission android:name=\"android.permission.ACCESS_COARSE_LOCATION\"/>",
					"<uses-feature android:name=\"android.hardware.camera\"/>",
					"<uses-permission android:name=\"android.permission.ACCESS_FINE_LOCATION\"/>",
					"<uses-permission android:name=\"android.permission.WRITE_SETTINGS\"/>"
				]
			},
			/* ios打包配置 */
			"ios": {},
			/* SDK配置 */
			"sdkConfigs": {}
		}
	},
	/* 快应用特有相关 */
	"quickapp": {},
	/* 小程序特有相关 */
	"mp-weixin": {
		"appid": "wx02c23d5ba971d7b8",
		"setting": {
			"urlCheck": false,
			"es6": true,
			"minified": true
		},
		"usingComponents": true
	},
	"mp-alipay": {
		"usingComponents": true
	},
	"mp-baidu": {
		"usingComponents": true
	},
	"mp-toutiao": {
		"usingComponents": true
	},
	"h5": {
		"title": "",
		"domain": "ai.canpoint.net",
		"router": {
			"mode": "hash",
			"base": "/mobile-protal/protal/"
		},
		"devServer": {
			"https": false,
			"port": "",
			"proxy": {
				"/oss_upload": {
					"target": "http://canpoint-photo.oss-cn-beijing.aliyuncs.com", // 阿里云上传图片
					"changeOrigin": true,
					"pathRewrite": {
						"^/oss_upload": ""
					}
				},
				"getSchoolCode": {
					"target": "http://canpointtest.com/getSchoolCode/", // 通过域名获取学校code
					"changeOrigin": true,
					"pathRewrite": {
						"^/getSchoolCode": ""
					}
				},
				"/protal_api_10060": {
					"target": "http://canpointtest.com/protal_api_10060/", // 平台应用系统
					"changeOrigin": true,
					"pathRewrite": {
						"^/protal_api_10060": ""
					}
				},
				"/protal_api_10162": {
					"target": "http://canpointtest.com/protal_api_10162/", // 门禁系统
					"changeOrigin": true,
					"pathRewrite": {
						"^/protal_api_10162": ""
					}
				},
				"/protal_api_11004": {
					"target": "http://canpointtest.com/protal_api_11004/", // 考勤系统
					"changeOrigin": true,
					"pathRewrite": {
						"^/protal_api_11004": ""
					}
				},
				"/protal_api_10160": {
					"target": "http://canpointtest.com/protal_api_10160/", // 访客系统
					"changeOrigin": true,
					"pathRewrite": {
						"^/protal_api_10160": ""
					}
				},
				"/protal_api_11005": {
					"target": "http://canpointtest.com/protal_api_11005/", // 疫情系统
					"changeOrigin": true,
					"pathRewrite": {
						"^/protal_api_11005": ""
					}
				},
				"/protal_api_11006": {
					"target": "http://canpointtest.com/protal_api_11006/", // 宿管系统
					"changeOrigin": true,
					"pathRewrite": {
						"^/protal_api_11006": ""
					}
				},
				"/protal_api_11011": {
					"target": "http://canpointtest.com/protal_api_11011/", // 信息发布
					"changeOrigin": true,
					"pathRewrite": {
						"^/protal_api_11011": ""
					}
				},
				"/protal_api_11009": {
					"target": "http://canpointtest.com/protal_api_11009/", // 班牌管理
					"changeOrigin": true,
					"pathRewrite": {
						"^/protal_api_11009": ""
					}
				},
				"/protal_api_11014": {
					"target": "http://canpointtest.com/protal_api_11014/", // 课表管理
					"changeOrigin": true,
					"pathRewrite": {
						"^/protal_api_11014": ""
					}
				},
				"/protal_api_11012": {
					"target": "http://canpointtest.com/protal_api_11012/", // 德育评分
					"changeOrigin": true,
					"pathRewrite": {
						"^/protal_api_11012": ""
					}
				},
				"/protal_api_11002": {
					"target": "http://canpointtest.com/protal_api_11002/", // 考试计划
					"changeOrigin": true,
					"pathRewrite": {
						"^/protal_api_11002": ""
					}
				},
				"/protal_api_11014": {
					"target": "http://canpointtest.com/protal_api_11014/", // OA办公系统
					"changeOrigin": true,
					"pathRewrite": {
						"^/protal_api_11014": ""
					}
				},
				"/protal_api_10090": {
					"target": "http://192.168.2.235/protal_api_10090/", // 控制中心
					"changeOrigin": true,
					"pathRewrite": {
						"^/protal_api_10090": ""
					}
				},
				"/protal_api_11002": {
					"target": "http://canpointtest.com/protal_api_11002/", // 用户中心
					"changeOrigin": true,
					"pathRewrite": {
						"^/protal_api_11002": ""
					}
				},
				"/protal_api_8092": {
					"target": "http://canpointtest.com/protal_api_8092/", // 基础数据-高教
					"changeOrigin": true,
					"pathRewrite": {
						"^/protal_api_8092": ""
					}
				},
				"/protal_api_10050": {
					"target": "http://canpointtest.com/protal_api_10050/", // 学校管理服务
					"changeOrigin": true,
					"pathRewrite": {
						"^/protal_api_10050": ""
					}
				},
				"/protal_api_10166": {
					"target": "http://canpointtest.com/protal_api_10166/", // 移动端用户系统
					"changeOrigin": true,
					"pathRewrite": {
						"^/protal_api_10166": ""
					}
				},
				"/protal_api_10097": {
					"target": "http://canpointtest.com/protal_api_10097/", // 缴费系统
					"changeOrigin": true,
					"pathRewrite": {
						"^/protal_api_10097": ""
					}
				},
				"/protal_api_11031": {
					"target": "http://canpointtest.com/protal_api_11031/", // 一卡通服务
					"changeOrigin": true,
					"pathRewrite": {
						"^/protal_api_11031": ""
					}
				},
				"/protal_api_10054": {
					"target": "http://canpointtest.com/protal_api_10054/", // 校历请假服务
					"changeOrigin": true,
					"pathRewrite": {
						"^/protal_api_10054": ""
					}
				},
				"/protal_api_11025": {
					"target": "http://canpointtest.com/protal_api_11025/", // 交易系统
					"changeOrigin": true,
					"pathRewrite": {
						"^/protal_api_11025": ""
					}
				},
				"/protal_api_11022": {
					"target": "http://canpointtest.com/protal_api_11022/", // 授权服务
					"changeOrigin": true,
					"pathRewrite": {
						"^/protal_api_11022": ""
					}
				},
				"/protal_api_8091": {
					"target": "http://canpointtest.com/protal_api_8091/", // 安防系统
					"changeOrigin": true,
					"pathRewrite": {
						"^/protal_api_8091": ""
					}
				},
				"/protal_api_8093": {
					"target": "http://canpointtest.com/protal_api_8093/", // 教务系统
					"changeOrigin": true,
					"pathRewrite": {
						"^/protal_api_8093": ""
					}
				},
				"/protal_api_18090": {
					"target": "http://canpointtest.com/protal_api_18090/", // 小程序服务
					"changeOrigin": true,
					"pathRewrite": {
						"^/protal_api_18090": ""
					}
				},
				"/mobile-protal/protal/mobile-img": {
					"target": "http://canpointtest.com/mobile-protal/protal/mobile-img", // 图片代理
					"changeOrigin": true,
					"pathRewrite": {
						"^/mobile-protal/protal/mobile-img": ""
					}
				},
				"/img-download": {
					"target": "http://canpoint-file.oss-cn-beijing.aliyuncs.com/", // 图片代理
					"changeOrigin": true,
					"pathRewrite": {
						"^/img-download": ""
					}
				},
				"/mobile-img": {
					"target": "http://canpointtest.com/mobile-protal/protal/mobile-img", // 图片代理
					"changeOrigin": true,
					"pathRewrite": {
						"^/mobile-img": ""
					}
				},
				"/hpb_face": {
					"target": "http://39.97.213.205:8092/",
					"changeOrigin": true,
					"pathRewrite": {
						"^/hpb_face": ""
					}
				}
			}
		},
		"optimization": {
			"treeShaking": {
				"enable": true
			}
		},
		"template": "template.html"
	}
}
