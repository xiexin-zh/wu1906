/**
 * @description 基础数据
 */
import $ajax from '@u/request.js'
import hostEnv from '../config/index.js'
import { setStore } from '../pages/protal/store'

const baseData = {
	// 更新人员头像
	async updatePhoto (code, url, type) {
		if (type) {
			
		} else {
		
		}
	},
	// 获取绑定的班级
	async getClassInfo(cb) {
		const userInfo = uni.setStorageSync('protal').userInfo
		const isHightSchool = userInfo.schoolType === '8' || userInfo.schoolType === '9'
		if (isHightSchool) {
			const res = await $ajax.get({
				url: `${hostEnv.protal_api_8092}/class/manage/query/by/teachercode#get#false`,
				params: {
					schoolCode: userInfo.schoolCode,
					teacherCode: userInfo.userCode
				}
			})
			if (!res.data || res.data.length === 0) {
				this.classList = [];
				setStore({
					key: 'isBZR',
					data: null
				});
				setStore({
					key: 'teachClassList',
					data: null
				});
			} else {
				this.classList = res.data.map((el, index) => {
					return {
						...el,
						isBZR: true,
						value: el.classCode,
						classId: el.id,
						text: el.gradeName + el.subjectName + el.className
					};
				});
				if (res.data && res.data.length > 0) {
					if (parseInt(this.currentClass) > this.classList.length - 1) {
						this.classInfo = this.classList[0];
					} else {
						this.classInfo = this.classList[this.currentClass];
					}
					setStore({
						key: 'currentBindClass',
						data: this.classInfo
					});
					setStore({
						key: 'teachClassList',
						data: this.classList
					});
				}
			}
		} else {
			// 获取当前班主任的班级
			const res = await $ajax.get({
				url: `${hostEnv.protal_api_10166}/mobile/user/info/bind/clazz/info#get#false`,
				params: {
					schoolCode: this.userInfo.schoolCode,
					userType: this.userInfo.typeCode,
					userCode: this.userInfo.userCode
				}
			})
			const bzrList = (res.data.classInfos || []).map(item => {
				return {
					isBZR: true,
					...item
				};
			});
			// 获取当前任课老师的班级
			const resTea = await $ajax.get({
				url: `${hostEnv.protal_api_11002}/userinfo/teacher/user/classinfo#get#false`,
				params: {
					schoolCode: this.userInfo.schoolCode,
					userCode: this.userInfo.userCode
				}
			})
			this.classList = [...bzrList, ...resTea.data];
			this.classInfo = this.classList.length > 0 ? this.classList[0] : {}
			setStore({
				key: 'currentBindClass',
				data: this.classInfo
			});
			setStore({
				key: 'isBZR',
				data: (this.classList[0] || {}).isBZR ? this.classList[0] : null
			});
		}
	},
}

export default baseData