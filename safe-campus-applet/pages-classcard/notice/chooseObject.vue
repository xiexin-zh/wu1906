<template>
	<view class="choose-object u-type-white-bg">
		<view class="u-padd-10">
			<u-alert-tips type="primary" :description="description"></u-alert-tips>
		</view>
		<view class="u-padd-t20 u-padd-l u-padd-r">
			<view class="u-fx-ac choose-item">
				<view class="u-fx-ac u-fx-f1" @tap="chooseItem()">
					<view>全选/反选</view>
				</view>
				<view class="u-mar-r u-content-color">已选择{{ chooseList.length }}人</view>
				<view class="choose-btn" @tap="chooseOk">确定</view>
			</view>
			<view @tap="chooseItem(student.userName, student.userCode)" class="u-fx-ac choose-item" v-for="student in studentList" :key="student.id">
				<view :class="['check-box', {'act' : chooseList.findIndex(item => item.userCode === student.userCode) > -1}]"></view>
				<view class="user-icon u-mar-l30">
					<image class="user-icon" :src="student.photoUrl"></image>
				</view>
				<view class="u-fx-f1 u-mar-l30">{{ student.userName }}</view>
				<view class="rit-arrow"></view>
			</view>
		</view>
		
		
	</view>
</template>

<script>
	import eventBus from '@u/eventBus'
	import baseData from '@u/base-data'
	export default {
		data () {
			return {
				description: '您可选择发布的学生，将发送给对应学生所绑定的家长',
				chooseList: uni.getStorageSync('chooseStudent') || [],
				studentList: []
			}
		},
		mounted () {
			console.log(this.chooseList, this.studentList)
			baseData.getStudentList(res => {
				this.studentList = res
			})
		},
		methods: {
			/**
			 * @description 选择人员
			 * @param {id：string} 人员id
			 */
			chooseItem (userName, userCode) {
				if (!userName) {
					this.chooseList = this.chooseList.length < this.studentList.length ? this.studentList.map(item => {
						return {
							userCode: item.userCode,
							userName: item.userName
						}
					}) : [],
					console.log(this.chooseList)
					return
				}
				const index = this.chooseList.findIndex(item => item.userCode === userCode)
				if (index === -1) {
					this.chooseList.push({
						userCode,
						userName
					})
				} else {
					this.chooseList.splice(index, 1)
				}
			},
			/**
			 * @description 提交人员
			 */
			chooseOk () {
				if (this.chooseList.length === 0) {
					this.$tools.toast('请选择成员')
					return
				}
				// 如果全选则返回空，如果选择部分则返回对应的信息
				const result = this.chooseList.length === this.studentList.length ? [] :this.chooseList
				eventBus.$emit('chooseOk', result)
				this.$tools.goBack()
			}
		}	}
</script>

<style lang="scss" scoped>
	.choose-object {
		.choose-item {
			padding: 0 10rpx;
			height: 100rpx;
			border-bottom: 1px $u-border-color solid;
		}
		.check-box {
			width: 48rpx;
			height: 48rpx;
			border-radius: 100%;
			background-color: #fff;
			border: 1px $u-border-color solid;
			&.act {
				background: url(http://canpointtest.com/mini-img/choose-ok.png) no-repeat center;
				background-size: 48rpx 48rpx;
			}
		}
		.user-icon {
			width: 48rpx;
			height: 48rpx;
			display: block;
			border-radius: 100%;
			background-color: $u-bg-color;
		}
		.choose-btn {
			width: 120rpx;
			height: 66rpx;
			line-height: 66rpx;
			text-align: center;
			background-color: $u-type-primary;
			color:#fff;
			border-radius: $u-border-radius;
		}
	}
</style>
