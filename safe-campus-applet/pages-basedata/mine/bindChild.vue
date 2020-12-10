<template>
	<view class="bind-child">
		<u-select v-model="isShow" :list="getParentTypeList" @confirm="confirm"></u-select>
		<view class="u-font-01 u-tips-color tips-icon">请输入相关信息绑定，您可以从孩子那里知晓学号，如不确定请直接联系孩子班主任。</view>
		<view class="form-item u-fx-ac">
			<view>所在学校</view>
			<view class="u-fx-f1 u-content-color u-tx-r" @tap="showSchool" >
				{{ formData.schoolName }}
			</view>
			<view class="rit-arrow"></view>
		</view>
		<view class="form-item u-fx-ac">
			<view>孩子姓名</view>
			<view class="u-fx-f1">
				<u-input input-align="right" v-model="formData.userName" placeholder="请输入姓名" trim ></u-input>
			</view>
			<view class="rit-arrow"></view>
		</view>
		<view class="form-item u-fx-ac">
			<view>孩子学号</view>
			<view class="u-fx-f1">
				<u-input input-align="right" v-model="formData.workNo" placeholder="请输入学号" trim ></u-input>
			</view>
			<view class="rit-arrow"></view>
		</view>
		<view class="form-item u-fx-ac">
			<view>家属姓名</view>
			<view class="u-fx-f1">
				<u-input input-align="right" v-model="formData.parentName" placeholder="请输入家属姓名" trim ></u-input>
			</view>
			<view class="rit-arrow"></view>
		</view>
		<view class="form-item u-fx-ac">
			<view>亲属关系</view>
			<view class="u-fx-f1 u-content-color u-tx-r" @tap="isShow = true" >
				{{ formData.relationShipName }}
			</view>
			<view class="rit-arrow"></view>
		</view>
		<view class="u-padd-b30">
			<view class="primary-btn u-mar-t40" @tap="parentBindChild">绑定</view>
		</view>
	</view>
</template>

<script>
	import { store, actions } from '@store'
	import eventBus from '@u/eventBus'
	import baseData from '@u/base-data'
	export default {
		components: {
		},
		computed: {
			userInfo: () => store.userInfo,
			userType: () => store.userType
		},
		mounted () {
			// 如果第一次进行绑定
			if (this.userType.length === 0) {
				this.getSchoolList()
				this.isShowParent = true
			} else {
				this.formData.parentName = this.userInfo.userName || ''
				this.formData.mobile = this.userInfo.mobile
				this.formData.schoolCode = this.userInfo.schoolCode
				this.formData.schoolName = this.userInfo.schoolName
			}
		},
		data () {
			return {
				isSchool: false,
				schoolList: [],
				isShowParent: false,
				formData: {
					captchaCode: '',
					classCode: '',
					gradeCode: '',
					userName: '',
					schoolCode: '',
					workNo: '',
					parentName: '',
					mobile: '',
					schoolName: '请选择学校',
					relationShipName: '请选择家属关系',
				},
				isShow: false,
				getParentTypeList: baseData.getParentTypeList(),
				fileList: [],
				codeMsg: '获取验证码',
				baseData
			}
		},
		methods: {
			/**
			 * @description 获取学校
			 */
			async getSchoolList () {
				const res = await actions.getSchoolList({
					page: 1,
					size: 100
				})
				this.schoolList = res.data.list
			},
			showSchool () {
				if (this.userType.length === 0) {
					this.isSchool = true
				}
			},
			chooseSchool (item) {
				this.formData.schoolCode = item.schoolCode
				this.formData.schoolName = item.schoolName
				this.isSchool = false
			},
			confirm (item) {
				this.relationship = item[0].value
				this.formData.relationShipName = item[0].label
			},
			// 家长注册或绑定孩子
			parentBindChild () {
				if (this.isShowParent) {
					this.bindChild()
				} else {
					this._parentAdd()
				}
			},
			formYz (callback) {
				console.log(this.formData.relationShip)
				if (this.formData.schoolName === '请选择学校') {
					this.$tools.toast('请选择学校')
					return
				} else if (this.formData.userName === '') {
					this.$tools.toast('请输入孩子姓名')
					return
				} else if (this.formData.workNo === '') {
					this.$tools.toast('请输入孩子学号')
					return
				} else if (this.formData.parentName === '') {
					this.$tools.toast('请输入家属姓名')
					return
				} else if (this.formData.relationShipName === '请选择家属关系') {
					this.$tools.toast('请选择家属关系')
					return
				}
				callback()
			},
			bindChild () {
				this.formYz( async () => {
					if (this.formData.mobile === '') {
						this.$tools.toast('请输入手机号')
						return
					} else if (this.formData.captchaCode === '') {
						this.$tools.toast('请输入验证码')
						return
					} else if (this.fileList.length === 0) {
						this.$tools.toast('请上传头像')
						return
					}
					var reg = /^1[3456789]\d{9}$/;
					if (!reg.test(this.formData.mobile)) {
						this.$tools.toast('请输入正确手机号')
						return
					}
					if (this.isLoading) return
					this.isLoading = true
					this.$tools.showLoading('绑定中...')
					try {
						// 家长注册绑定， 需要验证码
						await actions.parentAdd({
							...this.formData,
							photoUrl: this.fileList[0],
							relationship: this.relationship,
							appletsOpenid: uni.getStorageSync('smallOpenId') || 'oMukd5OePI28cpr0-qX9VVjkO9ig',
							openid: ''
						})
						this.$tools.toast('绑定成功')
						this.$tools.goNext(() => {
							this.$tools.showLoading('跳转中...')
							this.baseData.getUserInfo(res => {
								this.$tools.redirectTo({
									url: '/pages-basedata/index/home'
								})
							})
						})
					} catch(err) {
						this.isLoading = false
					}
				})
			},
			// 家长注册绑定， 不需要验证码
			 _parentAdd () {
				this.formYz(async () => {
					this.$tools.showLoading('注册绑定中...')
					await actions.parentRegister({
						...this.formData,
						photoUrl: this.userInfo.photoUrl,
						relationship: this.relationship,
						appletsOpenid: uni.getStorageSync('smallOpenId') || 'oMukd5OePI28cpr0-qX9VVjkO9ig',
						openid: ''
					})
					this.$tools.toast('绑定成功')
					this.$tools.goNext(() => {
						this.baseData.getChildList()
						this.$tools.goBack()
					})
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.bind-child {
		background-color: #fff;
		padding: 20rpx 20rpx;
	}
</style>
