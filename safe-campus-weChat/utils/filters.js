/**
 * @description 注册全局过滤器
 */

import Vue from 'vue'

const filters = {
	// 去掉时间中的.0
	getFullDate: val => {
		return val.split('.').length > 0 ? val.split('.')[0] : val
	},
	// 日期转化
	gmtToDate(date, type = 'dateTime') {
		if (!date) {
			return '--'
		}
		const d = new Date(date)
		const time = d.getFullYear() + '-' + ((d.getMonth() + 1) > 9 ? d.getMonth() + 1 : '0' + (d.getMonth() + 1)) + '-' +
			(d.getDate() > 9 ? d.getDate() : '0' + d.getDate()) + ' ' +
			(d.getHours() > 9 ? d.getHours() : '0' + d.getHours()) + ':' + (d.getMinutes() > 9 ? d.getMinutes() : '0' +
				d.getMinutes()) +
			':' + (d.getSeconds() > 9 ? d.getSeconds() : '0' + d.getSeconds())
		if (type === 'dateTime') {
			return time
		} else if (type === 'no-second') {
			return time.substring(0, 16)
		} else if (type === 'date') {
			return time.substring(0, 10)
		} else if (type === 'time') {
			return time.substring(11, 16)
		}else if (type === 'second') {
			return time.substring(11, 19)
		}
	},
	// 日期转化
	getToDate(date, type = 'dateTime') {
		if (!date) {
			return '--'
		}
		const d = new Date(date)
		const time = d.getFullYear() + '-' + ((d.getMonth() + 1) > 9 ? d.getMonth() + 1 : '0' + (d.getMonth() + 1)) + '-' +
			(d.getDate() > 9 ? d.getDate() : '0' + d.getDate()) + ' ' +
			(d.getHours() > 9 ? d.getHours() : '0' + d.getHours()) + ':' + (d.getMinutes() > 9 ? d.getMinutes() : '0' +
				d.getMinutes())
		if (type === 'dateTime') {
			return time
		} else if (type === 'date') {
			return time.substring(0, 10)
		} else if (type === 'time') {
			return time.substring(11, 16)
		}
	},
	// 获取日期格式中的月和日
	getMonthDate(date, type) {
		if (!date) {
			return '--'
		}
		if (type === 'day') {
			return date.substring(8, 10)
		} else if (type === 'month') {
			return date[5] === '0' ? date.substring(6, 7) : date.substring(5, 7)
		} else {
			return date
		}
	},
	/**
	 * 时间戳转为多久之前
	 * @param String timestamp 时间戳
	 */
	timeFrom(timestamp = null) {
		if (timestamp == null) timestamp = Number(new Date());
		timestamp = parseInt(timestamp);
		// 判断用户输入的时间戳是秒还是毫秒,一般前端js获取的时间戳是毫秒(13位),后端传过来的为秒(10位)
		if (timestamp.toString().length == 10) timestamp *= 1000;
		var timer = (new Date()).getTime() - timestamp;
		timer = parseInt(timer / 1000);
		// 如果小于1分钟,则返回"刚刚",其他以此类推
		let tips = '';
		switch (true) {
			case timer < 60:
				tips = '刚刚';
				break;
			case timer >= 60 && timer < 3600:
				tips = parseInt(timer / 60) + '分钟前';
				break;
			case timer >= 3600 && timer < 86400:
				tips = parseInt(timer / 3600) + '小时前';
				break;
			case timer >= 86400 && timer < 2592000:
				tips = parseInt(timer / 86400) + '天前';
				break;
			case timer >= 2592000 && timer < 365 * 86400:
				tips = parseInt(timer / (86400 * 30)) + '个月前';
				break;
			case timer >= 365 * 86400:
				tips = this.getToDate(timestamp, 'date')
		}
		return tips;
	},
	// 获取性别
	setSex: val => {
		if (val === 1 || val === '1') {
			return '男'
		} else if (val === 2 || val === '2') {
			return '女'
		} else {
			return '未知'
		}
	},
	// 获取身份
	getUserType: val => {
		if (val === 4 || val === '4') {
			return '教职工'
		} else if (val === 8 || val === '8') {
			return '学生'
		} else if (val === 16 || val === '16') {
			return '家长'
		} else if (val === 32 || val === '32') {
			return '访客'
		} else if (val === '4,16') {
			return '教职工, 家长'
		}
	},
	// 获取日期对应的星期
	getDay: val => {
		let day = new Date(val).getDay()
		let num = ''
		switch (day) {
			case 0:
				num = '星期日'
				break
			case 1:
				num = '星期一'
				break
			case 2:
				num = '星期二'
				break
			case 3:
				num = '星期三'
				break
			case 4:
				num = '星期四'
				break
			case 5:
				num = '星期五'
				break
			case 6:
				num = '星期六'
				break
		}
		return num
	},
	chnNumChar: (val) => {
		let num = ''
		switch (val) {
			case '1':
				num = '星期一'
				break
			case '2':
				num = '星期二'
				break
			case '3':
				num = '星期三'
				break
			case '4':
				num = '星期四'
				break
			case '5':
				num = '星期五'
				break
			case '6':
				num = '星期六'
				break
			case '7':
				num = '星期日'
				break
		}
		return num
	},
	// 交易类型
	getTradeType: val => {
		if (val == '1') {
			return '消费'
		} else if (val == '2') {
			return '充值'
		} else if (val == '3') {
			return '补助'
		} else if (val == '4') {
			return '退款'
		} else if (val == '5') {
			return '余额清零'
		}
	},
	// 消费
	getTradeStatus: val => {
		if (val == '0') {
			return '已提交'
		} else if (val == '1') {
			return '处理中'
		} else if (val == '2') {
			return '已成功'
		} else if (val == '3') {
			return '已失败'
		} else if (val == '4') {
			return '已退款'
		}
	},
	// 消费方式
	getConsumeType: val => {
		if (val == '1') {
			return '刷卡'
		} else if (val == '2') {
			return '刷脸'
		}
	},
	// 访客状态
	visitState: val => {
		if (val == '0') {
			return '待访问'
		} else if (val == '1') {
			return '在访'
		} else if (val == '2') {
			return '签离'
		}
	},
	// 访客审批状态
	visitApproveState: val => {
		if (val == 0) {
			return '待审批'
		} else if (val == 1) {
			return '审批通过'
		} else if (val == 2) {
			return '审批未通过'
		} else if (val == 3) {
			return '撤销'
		} else if (val == 4) {
			return '失效'
		}
	},
	getRelationShip: val => {
		if (val == 1) {
			return '爸爸'
		} else if (val == 2) {
			return '妈妈'
		} else if (val == 3) {
			return '爷爷'
		} else if (val == 4) {
			return '奶奶'
		} else if (val == 5) {
			return '家长'
		}
	},
	// 调班 调舍审批状态
	approveState: val => {
		if (val == 1) {
			return '待审批'
		} else if (val == 2) {
			return '审批通过'
		} else if (val == 3) {
			return '审批未通过'
		} else if (val == 4) {
			return '审批中'
		}
	},
	// 审批状态
	changeClassApproveState: val => {
		if (val == 0) {
			return '待审批'
		} else if (val == 1) {
			return '同意'
		} else if (val == 2) {
			return '拒绝'
		} else if (val == 3) {
			return '撤销'
		} else if (val == 4) {
			return '失效'
		}
	},
	// 场地类型
	getPlaceType: val => {
		if (val == '100') {
			return '教室'
		} else if (val == '101') {
			return '宿舍'
		} else if (val == '102') {
			return '食堂'
		} else if (val == '103') {
			return '出入口'
		} else if (val == '104') {
			return '其它'
		}
	},
	getState: value => {
		if (value === 1) {
			return '迟到'
		} else if (value === 2) {
			return '早退'
		} else if (value === 3 || value === 6) {
			return '缺卡'
		} else if (value === 4) {
			return '请假'
		} else if (value === 5) {
			return '正常'
		} else if (value === 7) {
			return '缺勤'
		}
	},
	getRead: value => {
		if (value === '0') {
			return '未读'
		} else if (value === '1') {
			return '已读'
		}
	},
	getRovalState: value => {
		if (value === '0') {
			return '审批中'
		} else if (value === '1') {
			return '通过'
		} else if (value === '2') {
			return '拒绝'
		}
	},
	repairState: value => {
		if (value === '0') {
			return '待处理'
		} else if (value === '1') {
			return '处理中'
		} else if (value === '2') {
			return '未同意'
		} else if (value === '3') {
			return '已修复'
		} else if (value === '4') {
			return '未修复'
		} else if (value === '5') {
			return '已处理'
		} else if (value === '6') {
			return '已撤回'
		}
	},
	// 获取性别
	setSex: val => {
		if (val === 1 || val === '1') {
			return '男'
		} else if (val === 2 || val === '2') {
			return '女'
		} else {
			return '未知'
		}
	},
	// 请假审批状态
	leaveState: val => {
		if (val == '0') {
			return '待审批'
		} else if (val == '1') {
			return '审批通过'
		} else if (val == '2') {
			return '审批未通过'
		} else if (val == '3') {
			return '撤回'
		} else if (val == '4') {
			return '审批中'
		}
	},
	// 专项检查状态
	specialState: val => {
		if (val == '1') {
			return '未检查'
		} else if (val == '2') {
			return '检查待审核'
		} else if (val == '3') {
			return '小组已审核'
		} else if (val == '4') {
			return '督查完成'
		}
	},
	// 事故等级
	accidentLevel: val => {
		if (val === '1') {
			return '特大重大事故'
		} else if (val === '2') {
			return '重大事故'
		} else if (val === '3') {
			return '较大事故'
		} else if (val === '4') {
			return '一般事故'
		}
	},
	// 事故性质
	accidentNature: val => {
		if (val === '1') {
			return '责任事故'
		} else if (val === '2') {
			return '自然事故'
		} else if (val === '3') {
			return '技术事故'
		} else if (val === '4') {
			return '其它'
		}
	},
	// 事故类型
	accidentType: val => {
		if (val === '1') {
			return '交通事故'
		} else if (val === '2') {
			return '踩踏事故'
		} else if (val === '3') {
			return '溺水事故'
		} else if (val === '4') {
			return '火灾事故'
		} else if (val === '5') {
			return '触电事故'
		} else if (val === '6') {
			return '校园伤害'
		} else if (val === '7') {
			return '其它'
		}
	},
	// 事故状态
	accidentStatus: val => {
		if (val === '1') {
			return '新填报'
		} else if (val === '2') {
			return '处理中'
		} else if (val === '3') {
			return '已结案'
		}
	},
	//隐患转态
	getDangerState: val => {
		const text = parseInt(val)
		if (parseInt(text) === 1) {
			return '已上报'
		} else if (parseInt(text) === 2) {
			return '已指派'
		} else if (parseInt(text) === 3) {
			return '已处理'
		} else if (parseInt(text) === 4) {
			return '已验收'
		} else if (parseInt(text) === 5) {
			return '已撤销'
		}
	},
	//安全任务完成状态
	getSafetyState: val => {
		const text = parseInt(val)
		if (parseInt(text) === 1) {
			return '未填报'
		} else if (parseInt(text) === 2) {
			return '已填报、待提交'
		} else if (parseInt(text) === 3) {
			return '已提交'
		} else if (parseInt(text) === 4) {
			return '已补交'
		} else if (parseInt(text) === 5) {
			return '已打回、未重写'
		} else if (parseInt(text) === 6) {
			return '已重报、未提交'
		} else if (parseInt(text) === 7) {
			return '已重报、已提交'
		} else if (parseInt(text) === 8) {
			return '已重报、已补交'
		}
	},
	//安全任务完成状态
	completeStatusToText: val => {
		const text = parseInt(val)
		if (parseInt(text) === 3) {
			return '已提交'
		} else if (parseInt(text) === 1) {
			return '未提交'
		} else if (parseInt(text) === 2) {
			return '未提交'
		} else if (parseInt(text) === 4) {
			return '逾期填报'
		}
	},
	//安全任务完成状态
	stateToText: val => {
		const text = parseInt(val)
		if (parseInt(text) === 0) {
			return '未发布'
		} else if (parseInt(text) === 1) {
			return '未开始'
		} else if (parseInt(text) === 2) {
			return '进行中'
		} else if (parseInt(text) === 3) {
			return '已结束'
		}
	},
	// 安全任务状态
	safetyTaskToColor(text) {
    // text = parseInt(text)
		if (text === '未填报' || text === '未提交'||text === '未发布'||text === '未开始') {
			return '#FF5454'
		} else if (text === '已填报、待提交' || text === '已打回、未重写' || text === '逾期填报'|| text === '已重报、未提交') {
			return '#F5782E'
		} else if (text === '已重报、已提交' ||text === '已提交' || text === '已补交' || text === '已补交'||text === '进行中'||text === '已完成'||text === '已重报、已补交') {
			return '#00A460'
		}else if (text === '已结束' ){
      return '#cccccc'
    }
	},
	// 安全任务状态
	safetyTaskStatus(text) {
    text = parseInt(text)
    if (text === 1) {
      return '未完成'
    } else if (text === 2) {
      return '未完成'
    } else if (text === 3) {
      return '已完成'
    } else if (text === 4) {
      return '逾期填报'
    }
	},
	//文件大小转换
	dosizeformat(text) {
    text = Number(text)
    if (text < 1024) {
      return `${text}B`
    } else if (text < (1024 * 1024)) {
      return `${parseInt(text / 1024)}K`
    } else if (text < (1024 * 1024 * 1024)) {
      return `${parseInt(text / (1024 * 1024))}M`
    } else if (text < (1024 * 1024 * 1024 * 1024)) {
      return `${parseInt(text / (1024 * 1024 * 1024))}G`
    }
	},
	//资源名称格式化
	nameFormat(value){
		let a = value
		if(value.length>10){
			a = `${value.substring(0,10)}...`
		}
		return a
	},
	//时间戳转换为小时
	getHour(data) {
		return Math.ceil(data / 3600000)
	},
	//ios时间格式替换
	iosReplace(time) {
		return time.replace(/-/g, '/')
	},
	//时间戳转化为时分秒
	iosReplace(time) {
		var s;
		var hours = parseInt((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
		var minutes = parseInt((time % (1000 * 60 * 60)) / (1000 * 60));
		var seconds = (time % (1000 * 60)) / 1000;
		s = (hours < 10 ? ('0' + hours) : hours) + ':' + (minutes < 10 ? ('0' + minutes) : minutes) + ':' + (seconds < 10 ? ('0' + seconds) : seconds);
		return s;
	},
}
for (let key in filters) {
	Vue.filter(key, filters[key])
}
