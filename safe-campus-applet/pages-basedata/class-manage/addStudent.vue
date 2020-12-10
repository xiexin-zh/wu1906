<template>
	<view class="add-student">
		<view class="form-item u-fx-ac">
			<view>学生姓名</view>
			<view class="u-fx-f1 u-fx-je">
				<text v-if="!isEdit" class="u-tips-color">{{formData.userName}}</text>
				<u-input v-if="isEdit" input-align="right" v-model="formData.userName" placeholder="请输入姓名" trim ></u-input>
			</view>
			<view class="rit-arrow"></view>
		</view>
		<view class="form-item u-fx-ac">
			<view class="u-fx-f1">性别</view>
			<view class="u-fx-je">
				<text v-if="!isEdit" class="u-tips-color">{{ formData.sex == 1 ? '男' : '女'}}</text>
				<u-radio-group v-if="isEdit" v-model="formData.sex">
					<u-radio 
						class="u-mar-l40"
						v-for="(item, index) in sexList" :key="index" 
						:name="item.name"
					>
						{{item.name}}
					</u-radio>
				</u-radio-group>
			</view>
			<view class="rit-arrow"></view>
		</view>
		<view class="form-item u-fx-ac">
			<view>学号</view>
			<view class="u-fx-f1 u-fx-je">
				<text v-if="!isEdit" class="u-tips-color">{{ formData.workNo }}</text>
				<u-input v-if="isEdit" input-align="right" v-model="formData.workNo" placeholder="请输入学号" trim ></u-input>
			</view>
			<view class="rit-arrow"></view>
		</view>
		<view class="form-item u-fx-ac">
			<view class="u-fx-f1">走住读</view>
			<view class="u-fx-je">
				<text v-if="!isEdit" class="u-tips-color">{{ formData.hasDorm == 1 ? '住读' : '走读'}}</text>
				<u-radio-group v-if="isEdit" v-model="formData.hasDorm">
					<u-radio 
						class="u-mar-l40"
						v-for="(item, index) in dormList" :key="index" 
						:name="item.name"
					>
						{{item.name}}
					</u-radio>
				</u-radio-group>
			</view>
			<view class="rit-arrow"></view>
		</view>
		<view class="form-item u-fx-ac">
			<view class="u-fx-f1">入学年份</view>
			<view class="u-fx-je">
				<text v-if="!isEdit" class="u-tips-color">{{ formData.admissionTime }}</text>
				<u-radio-group v-if="isEdit" v-model="formData.admissionTime">
					<u-radio 
						class="u-mar-l40"
						v-for="(item, index) in yearList" :key="index" 
						:name="item.name"
					>
						{{item.name}}
					</u-radio>
				</u-radio-group>
			</view>
			<view class="rit-arrow"></view>
		</view>
		<view class="u-fx-ac u-padd-t u-padd-b u-bd-b">
			<view class="u-fx-f1">头像</view>
			<view class="u-fx-ac u-mar-l40 u-fx-je">
				<view @tap="uploadPhoto">
					<view class="add-photo" v-if="!photoUrl"></view>
					<u-image v-if="photoUrl" border-radius="10rpx" width="120rpx" height="120rpx" :src="photoUrl || 'http://canpointtest.com/mini-img/add-icon.png'"></u-image>
				</view>
			</view>
			<view class="rit-arrow"></view>
		</view>
		<view class="u-padd-b30 u-fx-ac" v-if="isDetail && !isEdit">
			<view class="second-btn u-fx-f1 u-mar-t40" @tap="editBtn">编辑</view>
			<view class="primary-btn u-fx-f1 u-mar-t40 u-mar-l40 del-bg" @tap="_removeStudent">移出班级</view>
		</view>
		<view class="u-padd-b30 u-fx-ac" v-if="isEdit">
			<view class="second-btn u-fx-f1 u-mar-t40" @tap="quit">取消</view>
			<view class="primary-btn u-fx-f1 u-mar-t40 u-mar-l40" @tap="_addStudent">保存</view>
		</view>
	</view>
</template>

<script>
	import validateForm from '@u/validate'
	import { store, actions } from '@store'
	import eventBus from '@u/eventBus'
	import baseData from '@u/base-data'
	const yzForm = {
		userName: '请输入学生名字',
	  sex: '请选择性别',
	  workNo: '请输入学生学号',
	  hasDorm: '请选择是否住宿',
		admissionTime: '请选择入学年份',
	}
	export default {
		computed: {
			userInfo: () => store.userInfo,
			userType: () => store.userType
		},
		mounted () {
			uni.$on('uAvatarCropper', path => {
				this.baseData.uploadFace(path, url => {
					this.photoUrl = url
				})
			})
		},
		data () {
			return {
				yearList: [
					{
						name: '2021'
					},
					{
						name: '2020'
					},
					{
						name: '2019'
					}
				],
				isEdit: false,
				isDetail: false,
				sexList: [
					{
						name: '男'
					},
					{
						name: '女'
					}
				],
				dormList: [
					{
					 name: '走读'	
					},
					{
						name: '住读'
					}
				],
				photoUrl: '',
				formData: {
					userName: '',
					sex: '男',
					workNo: '',
					hasDorm: '走读',
					admissionTime: '2020'
				},
				baseData
			}
		},
		mounted () {
			const userDetail = uni.getStorageSync('classUserInfo')
			if (userDetail) {
				this.isDetail = true
				this.id = userDetail.id
				this.userId = userDetail.userId
				this.disabled = true
				this.photoUrl = userDetail.photoUrl
				this.formData.userName = userDetail.userName
				this.formData.sex = userDetail.sex === 1 ? '男' : '女'
				this.formData.hasDorm = userDetail.hasDorm === 1 ? '住读' : '走读'
				this.formData.admissionTime = userDetail.admissionTime
				this.formData.workNo = userDetail.workNo
			} else {
				this.isEdit = true
			}
		},
		methods: {
			uploadPhoto () {
				if (!this.isEdit) {
					uni.previewImage({
						urls: [this.photoUrl]
					})
				} else {
					this.$u.route({
						// 关于此路径，请见下方"注意事项"
						url: '/uview-ui/components/u-avatar-cropper/u-avatar-cropper',
						// 内部已设置以下默认参数值，可不传这些参数
						params: {
							// 输出图片宽度，高等于宽，单位px
							destWidth: 400,
							// 裁剪框宽度，高等于宽，单位px
							rectWidth: 300,
							// 输出的图片类型，如果'png'类型发现裁剪的图片太大，改成"jpg"即可
							fileType: 'jpg',
						}
					})
				}
			},
			_removeStudent () {
				this.$tools.delTip('您确定把该学生移出班级吗?', async () => {
					this.$tools.showLoading('移除中...')
					await actions.removeStudent(this.id)
					this.$tools.toast('移出成功')
					this.$tools.goNext(() => {
						eventBus.$emit('initClass', 1)
						this.$tools.goBack()
					})
				})
			},
			quit () {
				if (this.isEdit) {
					if (this.isDetail) {
						this.isEdit = false
					} else {
						this.$tools.goBack()
					}
				}
			},
			editBtn () {
				this.isEdit = true
			},
			_addStudent () {
				validateForm(yzForm, this.formData, async () => {
					console.log(this.formData)
					this.$tools.showLoading('保存中...')
					const params = {
						...this.formData,
						hasDorm: this.formData.hasDorm === '住读' ? 1 : 2,
						sex: this.formData.sex === '男' ? 1 : 2,
						classId: store.currentBindClass.classId,
						gradeId: store.currentBindClass.gradeCode,
						photoUrl: this.photoUrl,
						remark: '',
						schoolCode: this.userInfo.schoolCode,
						schoolId: store.schoolYear.id,
					}
					if (this.isDetail) {
						await actions.updateStudent({
							...params,
							userId: this.userId
						})
					} else {
						await actions.addStudent(params)
					}
					this.$tools.toast('操作成功')
					this.$tools.goNext(() => {
						eventBus.$emit('initClass', 1)
						this.$tools.goBack()
					})
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.add-student {
		background-color: #fff;
		padding: 20rpx 20rpx;
		.add-photo {
			width: 120rpx;
			height: 120rpx;
			background: $u-bg-color url(http://canpointtest.com/mini-img/add-icon.png) no-repeat center;
			background-size: 60rpx 60rpx;
		}
		.del-bg {
			border: 1px $u-type-error-disabled solid;
			background-color: $u-type-error-dark;
			color:#fff;
		}
	}
</style>
