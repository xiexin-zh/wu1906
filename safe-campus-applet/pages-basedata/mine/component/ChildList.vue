<template>
	<view class="child-list">
		<view v-for="(item, index) in childList" :key="item.userCode" class="u-fx-ac child-item">
			<view class="u-border-radius-all u-of">
				<u-image border-radius="100%" width="100rpx" height="100rpx" :src="item.photoUrl"></u-image>
			</view>
			<view class="u-fx-f1 u-mar-l30">
				<view class="u-bold u-font-2">{{item.gradeName}}{{ item.className }}</view>
				<view class="u-content-color u-mar-t10">
					{{ item.userName }}
				</view>
			</view>
			<view class="unbind-btn" @tap="_unbind(item.userCode, index)">解绑</view>
		</view>
	</view>
</template>

<script>
	import { store, actions } from '@store'
	import baseData from '@u/base-data'
	export default {
		computed: {
			userInfo: () => store.userInfo
		},
		data () {
			return {
				baseData,
				childList: []
			}
		},
		mounted () {
			this.baseData.getChildList(data => {
				this.childList = data
			})
		},
		methods: {
			quit () {
				this.$emit('close')
			},
			_unbind (childCode, index) {
				this.$tools.delTip('您确定解绑该孩子吗', async () => {
					await actions.unbindChild({
						childCode,
						parentCode: this.userInfo.userCode
					})
					this.$tools.toast('解绑成功')
					this.childList.splice(index, 1)
					this.baseData.getChildList()
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.child-list {
		padding: 40rpx;
		.child-item {
			border-radius: $u-border-radius;
			margin-bottom: 30rpx;
			border: 2px $u-type-primary solid;
			padding: 30rpx;
		}
		.unbind-btn {
			text-align: center;
			line-height: 60rpx;
			width: 100rpx;
			height: 60rpx;
			font-size: 24rpx;
			background-color: $u-type-error-dark;
			color:#fff;
			border-radius: 100rpx;
		}
	}
</style>
