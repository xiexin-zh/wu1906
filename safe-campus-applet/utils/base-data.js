/**
 * @description 获取用户相关的基础数据
 */
import hostEnv from '@api/host-env'
import $ajax from '@u/ajax-serve'
import {
	actions,
	setStore,
	store
} from '@store'
const baseData = {
	// 获取用户基本信息
	async getUserInfo (callback) {
		const user = await actions.getUserInfoByMini({
			appletsOpenid: uni.getStorageSync('smallOpenId')
		})
		console.log('用户信息1111')
		console.log(user)
		if (!user.data) {
			setStore({
				userType: []
			})
		}
		setStore({
			currentUserType: user.data ? user.data.typeCode : '',
			userInfo: user.data || {},
		})
		if (callback)callback(user.data)
	},
	// 获取用户学年，和用户身份
	async getBaseInfo(callback) {
		try {
			console.log(uni.getStorageSync('smallOpenId'))
			const user = await actions.getUserInfoByMini({
				appletsOpenid: uni.getStorageSync('smallOpenId')
			})
			console.log('获取用户信息')
			console.log(user)
			// 获取学年信息
			const yearInfo = await actions.getSchoolYear({
				schoolCode: user.data.schoolCode
			})
			console.log('获取学年信息')
			console.log(yearInfo)
			// // 用户身份
			const type = await actions.getUserType({
				schoolCode: user.data.schoolCode,
				userCode: user.data.userCode
			})
			console.log('用户身份')
			console.log(type)
			setStore({
				currentUserType: user.data.typeCode,
				userInfo: user.data,
				schoolYear: yearInfo.data.list[0],
				userType: type.data,
			})
			this.getSubjectList()
			if(callback)callback()
		} catch (err) {}
	},
	// 获取老师所绑定的班级
	async getClassList(callback) {
		const resBzr = await actions.getBzrClass({
			schoolCode: store.userInfo.schoolCode,
			userType: 4,
			userCode: store.userInfo.userCode
		})
		console.log('获取所在班级的班主任')
		console.log(resBzr)
		const bzr = (resBzr.data.classInfos || []).map(item => {
			return {
				...item,
				isBzr: true
			}
		})
		const resTea = await actions.getTeaClass({
			schoolCode: store.userInfo.schoolCode,
			userCode: store.userInfo.userCode
		})
		console.log('获取所在班级的教职工')
		console.log(resTea)
		const classAll = [
			...bzr,
			...resTea.data
		]
		if (classAll.length === 0) {
			setStore({
				teacherTotal: 0,
				studentTotal: 0,
				bindClassList: [],
				currentBindClass: {}
			})
		}
		if (callback) {
			callback(classAll)
			return
		}
		// 保存所有班级
		setStore({
			bindClassList: classAll,
			currentBindClass: classAll[0] || {}
		})
		this.getClassUserTotal()
	},
	// 获取绑定的孩子列表
	async getChildList(callback) {
		const res = await actions.getChildList({
			schoolCode: store.userInfo.schoolCode,
			userType: 16,
			userCode: store.userInfo.userCode
		})
		console.log('获取绑定的孩子列表')
		console.log(res)
		// 数据为空时没有绑定孩子
		if (res.data.length == 0) {
			setStore({
				teacherTotal: 0,
				studentTotal: 0,
				bindStudentList: [],
				currentBindStudent: {}
			})
		}
		if (callback) {
			callback(res.data)
			return
		}
		setStore({
			bindStudentList: res.data,
			currentBindStudent: res.data[0]
		})
		this.getClassUserTotal()
	},
	// 获取班级教职工列表
	async getTeacherList(callback) {
		if (store.currentUserType === '4') {
			if (!store.currentBindClass.classId) {
				callback([])
				return
			}
		} else {
			if (!store.currentBindStudent.classId) {
				callback([])
				return
			}
		}
		const res = await actions.getTeacherList({
			classId: store.currentUserType === '4' ? store.currentBindClass.classId : store.currentBindStudent.classId,
			subjectCode: '',
			pageNum: 1,
			pageSize: 30,
			schoolCode: store.userInfo.schoolCode,
		})
		callback(res.data.list)
	},
	// 获取班级学生
	async getStudentList(callback) {
		if (store.currentUserType === '4') {
			if (!store.currentBindClass.classId) {
				if (callback)callback([])
				callback([])
				return
			}
		} else {
			if (!store.currentBindStudent.classId) {
				if (callback)callback([])
				return
			}
		}
		const res = await actions.getStudentList({
			classCode: store.currentUserType === '4' ? store.currentBindClass.classCode : store.currentBindStudent.classCode,
			gradeCode: store.currentUserType === '4' ? store.currentBindClass.gradeCode : store.currentBindStudent.gradeCode,
			schoolYearId: store.schoolYear.id,
			page: 1,
			size: 150,
			schoolCode: store.userInfo.schoolCode
		})
		callback(res.data.list)
	},
	// 获取班级老师和学生总数
	async getClassUserTotal() {
		console.log(store.currentUserType,1234)
		let classCode, gradeCode
		if (store.currentUserType === '4') {
			classCode = store.currentBindClass.classCode
			gradeCode = store.currentBindClass.gradeCode
		} else {
			classCode = store.currentBindStudent.classCode
			gradeCode = store.currentBindStudent.gradeCode
		}
		if (!classCode) {
			setStore({
				studentTotal: 0,
				teacherTotal: 0
			})
			return
		}
		const res = await actions.getClassManage({
			page: 1,
			size: 2,
			schoolCode: store.userInfo.schoolCode,
			schoolId: store.schoolYear.schoolId,
			schoolYearId: store.schoolYear.id,
			classCode,
			gradeCode,
			userCode: store.userInfo.userCode
		})
		setStore({
			teacherTotal: res.data.list[0].teacherTotal || 0,
			studentTotal: res.data.list[0].count || 0
		})
	},
	// 切换用户身份
	async changeUserType(typeCode, typeName, callback) {
		const res = await actions.changeUserType({
			id: store.userInfo.id,
			openid: '',
			appletsOpenid: uni.getStorageSync('smallOpenId'),
			schoolCode: store.userInfo.schoolCode,
			schoolName: store.userInfo.schoolName,
			typeCode: typeCode,
			typeName: typeName,
			userCode: store.userInfo.userCode,
			userName: store.userInfo.userName,
		})
		if (callback)callback()
	},
	// 获取学科列表
	async getSubjectList () {
		const res = await actions.getSubjectList({
			schoolId: store.schoolYear.schoolId,
			schoolCode: store.userInfo.schoolCode,
			schoolName: store.userInfo.schoolName,
			userCode: ""
		})
		setStore({
			subjectList: res.data
		})
	},
	// 获取老师和家长关联的班级名称
	getClassName() {
		if (store.currentUserType === '4') {
			return `${store.currentBindClass.gradeName || '尚未加入班级'}${store.currentBindClass.className || ''}`
		} else {
			return `${store.currentBindStudent.gradeName || '暂未绑定孩子'}${store.currentBindStudent.className || ''}`
		}
	},
	// 获取当前绑定班级的Code
	getClassCode() {
		if (store.currentUserType === '4') {
			return `${store.currentBindClass.classCode}`
		} else {
			return `${store.currentBindStudent.classCode}`
		}
	},
	// 获取当前绑定年级的Code
	getGradeCode() {
		if (store.currentUserType === '4') {
			return `${store.currentBindClass.gradeCode}`
		} else {
			return `${store.currentBindStudent.gradeCode}`
		}
	},
	// 获取当前用户的userCode(家长为学生的code)
	getUserCode() {
		if (store.currentUserType === '4') {
			return `${store.userInfo.userCode}`
		} else {
			return `${store.currentBindStudent.userCode}`
		}
	},
	// 获取当前学校班级列表
	async getClassListByGrade(gradeCode, callback) {
		const res = await actions.getClassList({
			schoolCode: store.userInfo.schoolCode,
			page: 1,
			size: 100,
			gradeCode,
			schoolYearId: ''
		});
		if (callback) callback(res.data.list)
	},
	// 获取当前学校年级列表
	async getGradeList(callback) {
		const res = await actions.getGradeList({
			schoolCode: store.userInfo.schoolCode,
			page: 1,
			size: 100
		});
		if (callback) callback(res.data.list)
	},
	// 获取家属类型列表
	getParentTypeList() {
		return [{
			value: 1,
			label: '爸爸'
		},{
			value: 2,
			label: '妈妈'
		},{
			value: 3,
			label: '爷爷'
		},{
			value: 4,
			label: '奶奶'
		},{
			value: 5,
			label: '其他'
		},
		{
			value: '',
			label: '其他'
		}]
	},
	// 获取家长类型
	getParentType(type) {
		let msg = ''
		switch (parseInt(type)) {
			case 1:
				msg = '爸爸'
				break
			case 2:
				msg = '妈妈'
				break
			case 3:
				msg = '爷爷'
				break
			case 4:
				msg = '奶奶'
				break
			case 5:
				msg = '其他'
				break
			default:
				msg = '其他'
				break
		}
		return msg
	},
	// 获取通知类型
	getNoticeTypeName(type) {
		if (type === 1) {
			return '普通通知'
		} else if (type === 2) {
			return '重要通知'
		} else if (type === 3) {
			return '回执通知'
		} else {
			return '公告'
		}
	},
	// 上传人脸图片转换
	uploadFace (path, callback) {
		//#ifdef H5
		const base64 = path.split(',')[1]
		this.checkFace(base64, (url) => {
			callback(url)
		})
		//#endif
		//#ifdef MP-WEIXIN
		let newbase64 = ''
		uni.getFileSystemManager().readFile({
			filePath: path,  
			encoding: 'base64',
			success: v=> { 
				newbase64 = v.data
				this.checkFace(newbase64, (url) => {
					callback(url)
				})
			}  
		})  
		//#endif
	},
	// 人员上传验证
	async checkFace (base64, callbak) {
		try {
			uni.showLoading({
				title: '人脸上传中...'
			});
			const res = await $ajax.postForm({
				url: `${hostEnv.host}${hostEnv.hpb_face}/facePhoto`,
				params: {
					userCode: Math.floor(Math.random() * 100000),
					file: base64
				}
			})
			if (res.data.result) {
				callbak(res.data.url)
			} else {
				uni.showToast({
					title: '人脸照片不符合规范，请重新上传',
					icon: 'none'
				})
			}
		} catch (err) {
			uni.hideLoading()
		}
	}
}

export default baseData
