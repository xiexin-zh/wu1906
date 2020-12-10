<template>
	<view class="see-notice">
		<view class="see-tab u-bd-b"><u-tabs :list="list" :is-scroll="false" font-size="28" :current="current" @change="change"></u-tabs></view>
		<view class="u-padd-40 u-tips-color u-bg-fff" v-if="resultList.length === 0">{{ tips }}</view>
		<view class="see-result u-fx-ac u-padd-10" v-for="(result, index) in resultList" :key="result.userCode">
			<view>{{ index + 1 }}.</view>
			<view class="u-mar-l10">{{ result.userName }}</view>
		</view>
		<view class="see-info u-padd-30 u-tips-color u-font-01">
			这里的已查看和未查看是指学生数，如果一个学生有多个家长在这个班级里面，只要其中一个家长查看了通知，则算作'已查看'
		</view>
	</view>
</template>

<script>
import { actions } from '@store'	
export default {
	data() {
		return {
			current: 0,
			resultList: [],
			tips: '',
			list: [
				{
					name: `已查看`
				},
				{
					name: `未查看`
				}
			]
		};
	},
	onLoad (option) {
		this.noticeCode = option.noticeCode
		this._getNoticeStatusUser(1)
	},
	mounted () {
	},
	methods: {
		async _getNoticeStatusUser (type) {
			const res = await actions.getNoticeStatusUser({
				markFlag: 1,
				noticeCode: this.noticeCode,
				noticeStatus: type
			})
			this.resultList = res.data
			this.tips = type === 1 ? '暂未有人查看通知消息' : '所有人都已查看消息'
		},
		change (index) {
			this.current = index
			const type = index === 0 ? 1 : 2
			this._getNoticeStatusUser(type)
		}
	}
};
</script>

<style lang="scss" scoped>
.see-notice {
	.see-result {
		background-color: #fff;
		padding: 20rpx 20rpx;
		color: $u-content-color;
	}
}
</style>
