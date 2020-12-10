<template>
	<view class="notice-type">
		<view @tap="chooseType(index)" :class="['notice-list u-fx-ac', {'act' : index === current }]" v-for="(notice, index) in noticeList" :key="index">
			<view class="type-img-box u-fx-ac-jc">
				<u-image :src="notice.src" width="60rpx" height="60rpx" ></u-image>
			</view>
			<view class="u-fx-f1 u-mar-l40">
				<view class="u-font-2 u-bold">{{ notice.title }}</view>
				<view class="u-content-color u-padd-t10 u-padd-b10">{{ notice.des }}</view>
				<view class="u-tips-color u-font-01">{{ notice.tip }}</view>
			</view>
		</view>
		<view class="primary-btn choose-btn" @click="goNotice">确定</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			current: 0,
			noticeList: [
				{
					noticeType: 1,
					title: '普通通知-可统计已读未读',
					des: '适用于告知类通知',
					tip: '例如：御寒加衣，每日食谱等',
					src: 'http://canpointtest.com/mini-img/putong-icon.png'
				},
				{
					noticeType: 2,
					title: '重要通知-需家长确认收到',
					des: '适用于需家长明确告知已确认收到',
					tip: '例如：家长会，学生到家报平安',
					src: 'http://canpointtest.com/mini-img/zhongyao-icon.png'
				},
				{
					noticeType: 3,
					title: '回执通知-可收集回执内容',
					des: '适用于家长收到通知后反馈信息',
					tip: '例如：家长签名，收集意见等',
					src: 'http://canpointtest.com/mini-img/huizhi-icon.png'
				},
				{
					noticeType: 4,
					title: '公告-学校和班级的重要事项',
					des: '可在班牌全屏展示',
					tip: '例如：领导视察，放假通知等',
					src: 'http://canpointtest.com/mini-img/gonggao-icon.png'
				}
			]
		};
	},
	methods: {
		chooseType (index) {
			this.current = index
		},
		goNotice () {
			uni.setStorageSync('chooseNoticeType', this.current)
			this.$tools.redirectTo({
				url: '/pages-classcard/notice/createNotice',
			})
		}
	}
};
</script>

<style lang="scss" scoped>
	.notice-type {
		margin: 0rpx 30rpx;
		.notice-list {
			padding: 0 20rpx;
			border-radius: $u-border-radius;
			margin-bottom: 30rpx;
			height: 195rpx;
			background-color: #fff;
			border: 2px #fff solid;
			&.act {
				border: 2px $u-type-primary solid;
			}
			.type-img-box {
				height: 130rpx;
				width: 130rpx;
				border-radius: 100%;
				background-color: #f5f7ff;
			}
		}
		.choose-btn {
			width: 80%;
			margin: 50rpx auto;
		}
	}
</style>
