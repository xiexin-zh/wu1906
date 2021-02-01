import { store, setStore, actions } from './index.js'
const apiFun = {
	// 获取菜单权限
	async getMenuList () {
		const res = await actions.getMenuList({
			plateformType: 1,
			schoolCode: store.userInfo.schoolCode,
			userId: store.userInfo.userId,
			userType: store.userInfo.typeCode
		})
		setStore({
			key: 'appList',
			data: res.data
		})
		// 初次进入默认显示前7个菜单
		let allApp = []
		res.data.forEach((item, index) => {
			if (item.children) {
				item.children.forEach((it, ind) => {
					allApp.push(it)
				})
			}
		})
		allApp = allApp.slice(0,7)
		const autoData = JSON.parse(uni.getStorageSync('protal'))
		if (store.userInfo.typeCode === '16' && !autoData.enjoyParentApp) {
			this.setAppData('enjoyApp', allApp)
			this.setAppData('enjoyParentApp', allApp)
		}
		if (store.userInfo.typeCode === '4' && !autoData.enjoyTeacherApp) {
			this.setAppData('enjoyApp', allApp)
			this.setAppData('enjoyTeacherApp', allApp)
		}
	},
	// 存储值
	setAppData (key, data) {
		setStore({
			key: key,
			data: data
		})
	},
	// 获取绑定的孩子
	async getChildList () {
		const {schoolCode, userCode, typeCode} = store.userInfo
		const res = await actions.getChildList({
			schoolCode,
			userCode,
			userType: typeCode
		})
		setStore({
			key: 'childList',
			data: res.data.filter(item => {
				return item.userCode !== ''
			})
		})
	},
	// 获取学校schoolType
	async _getschoolType () {
		const {schoolCode} = store.userInfo
		const res = await actions.getSchoolType(schoolCode)
		setStore({
			key: 'userInfo',
			data: {
				...store.userInfo,
				schoolType: res.data.schoolType
			}
		})
	},
	// 判断是否有菜单权限
	isRoleApp (url) {
		const menuStr = JSON.stringify(store.appList)
		const tag = menuStr.indexOf(url) > -1 ? true : false
		return tag
	}
}

export default apiFun