<template>
	<view class="join-class">
		<view class="u-fx-ac u-padd">
			<view class="u-type-primary">年级</view>
			<view class="u-fx-wp u-fx-f1 u-mar-l40">
				<view @tap="getClassList(grade.code)" :class="['item-list', {'act': gradeCode === grade.code}]" v-for="grade in gradeList" :key="grade.code">{{ grade.name }}</view>
			</view>
		</view>
		<view class="u-fx-ac u-bd-b u-padd u-padd-b40" v-if="gradeCode">
			<view class="u-type-primary">班级</view>
			<view class="u-fx-wp u-fx-f1 u-mar-l40">
				<view v-if="classList.length === 0" class="u-mar-l u-tips-color">暂无班级数据~</view>
				<view @tap="getClassId(item.classId)" :class="['item-list', {'act': classId === item.classId}]" v-for="item in classList" :key="item.classId">{{ item.className }}</view>
			</view>
		</view>
		<view class="u-mar-t40 u-mar-l u-tips-color u-font-01 tips-icon">温馨提示：加入班级后，你可以参与班级的管理</view>
		<view class="u-padd u-mar-t40 u-fx-ac">
			<view class="second-btn u-fx-f1" @tap="quit">取消</view>
			<view class="primary-btn u-fx-f1 u-mar-l40" @tap="_joinClass">加入班级</view>
		</view>
	</view>
</template>

<script>
	import baseData from '@u/base-data'
	import { store, actions, setStore } from '@store'
	export default {
		data () {
			return {
				baseData,
				gradeCode: '',
				classId: '',
				gradeList: [],
				classList: []
			}
		},
		mounted () {
			this.baseData.getGradeList(data => {
				this.gradeList = data
			})
		},
		methods: {
			quit () {
				this.$emit('close')
			},
			getClassList (code) {
				this.gradeCode = code
				this.classId = ''
				this.baseData.getClassListByGrade(code, data => {
					this.classList = data
				})
			},
			getClassId (classId) {
				this.classId = classId
			},
			async _joinClass () {
				if (this.classId === '') {
					this.$tools.toast('请选择班级')
					return
				}
				this.$tools.showLoading('加入中...')
				await actions.joinClass([{
					classId: this.classId,
					schoolCode: store.userInfo.schoolCode,
					subjectCode: '',
					teacherCode: store.userInfo.userCode
				}])
				this.baseData.getClassList((data) => {
					console.log(data)
					const newClass = data.find(item => {
						return parseInt(item.classId) === parseInt(this.classId)
					})
					console.log('111', newClass)
					setStore({
						currentBindClass: newClass
					})
					this.$tools.toast('加入成功')
					this.$tools.goNext(() => {
						this.$emit('close')
					})
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.join-class {
		margin: 0rpx 20rpx;
		.item-list {
			width: 22.5%;
			float: left;
			margin-left: 2%;
			margin-top: 20rpx;
			line-height: 56rpx;
			text-align: center;
			border-radius: 100rpx;
			height: 56rpx;
			color: $u-type-primary;
			border: 1px $u-type-primary solid;
			&.act {
				background-color: $u-type-primary;
				color:#fff;
			}
		}
	}
</style>
