<template>
	<view class="create-class">
		<u-select v-model="isShowGrade" :list="gradeList" @confirm="confirm"></u-select>
		<view class="form-item u-fx-ac">
			<view>所属年级</view>
			<view class="u-fx-f1 u-content-color u-tx-r" @tap="isShowGrade = true" >
				{{ formData.gradeName }}
			</view>
			<view class="rit-arrow"></view>
		</view>
		<view class="form-item u-fx-ac">
			<view>班级名称</view>
			<view class="u-fx-f1">
				<u-input input-align="right" v-model="formData.className" placeholder="请输入班级名称" trim ></u-input>
			</view>
			<view class="rit-arrow"></view>
		</view>
		<view class="u-mar-t40 u-tips-color u-font-01 tips-icon">温馨提示：创建班级成功后，您默认有管理该班级的权限，可以添加老师和学生，也可转让和解散班级</view>
		<view class="u-padd u-mar-t40 u-fx-ac">
			<view class="second-btn u-fx-f1" @tap="quit">取消</view>
			<view class="primary-btn u-fx-f1 u-mar-l40" @tap="_addClass">创建班级</view>
		</view>
	</view>
</template>

<script>
	import { store, actions, setStore } from '@store'
	import baseData from '@u/base-data'
	export default {
		data () {
			return {
				baseData,
				isShowGrade: false,
				gradeList: [],
				formData: {
					gradeCode: '',
					gradeName: '请选择年级',
					className: '',
				}
			}
		},
		mounted () {
			this.baseData.getGradeList(data => {
				this.gradeList = data.map(item => {
					return {
						label: item.name,
						value: item.code
					}
				})
			})
		},
		methods: {
			confirm (item) {
				this.formData.gradeName = item[0].label
				this.formData.gradeCode = item[0].value
			},
			async _addClass () {
				if (this.formData.gradeCode === '') {
					this.$tools.toast('请选择年级')
					return
				} else if (this.formData.className === '') {
					this.$tools.toast('请输入班级名称')
					return
				}
				this.$tools.showLoading('创建中...')
				const res = await actions.addClass({
					...this.formData,
					schoolCode: store.userInfo.schoolCode,
					schoolName: store.userInfo.schoolName,
					userCode: store.userInfo.userCode,
					schoolYearId: store.schoolYear.id
				})
				await actions.setTeacherBzr({
					schoolCode: store.userInfo.schoolCode,
					schoolId: store.schoolYear.schoolId,
					id: res.data.id,
					teacherName: store.userInfo.userName,
					teacherId: store.userInfo.userId,
					placeId: '',
					schoolYearId: store.schoolYear.id
				})
				this.baseData.getClassList((data) => {
					const newClass = data.find(item => {
						return item.classId === res.data.id
					})
					setStore({
						currentBindClass: newClass
					})
					this.$tools.toast('创建成功')
					this.$tools.goNext(() => {
						this.$emit('close')
					})
				})
			},
			quit () {
				this.$emit('close')
			}
		}
	}
</script>

<style lang="scss" scoped>
	.create-class {
		padding: 10rpx 20rpx;
	}
</style>
