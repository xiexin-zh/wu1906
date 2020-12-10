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
	// 交易状态
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
	//ios时间格式替换
	iosReplace(time) {
		return time.replace(/-/g, '/')
	},
}
for (let key in filters) {
	Vue.filter(key, filters[key])
}
