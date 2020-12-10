<template>
	<view class="teacher-face">
		<view class="u-bd-b"><u-tabs :list="list" :is-scroll="false" font-size="28" :current="current" @change="change"></u-tabs></view>
		<one-card ref="oneCard" v-if="current === 0"></one-card>
		<bill-statist ref="billStatist" v-else></bill-statist>
	</view>
</template>

<script>
	import oneCard from './component/oneCard.vue'
	import billStatist from './component/billStatist.vue'
	export default {
		components: {
			billStatist,
			oneCard
		},
		data() {
			return {
				current: 0,
				list: [
					{
						name: '一卡通账户'
					},
					{
						name: '账单统计'
					}
				]
			}
		},
		onPullDownRefresh() {
			this.$refs.oneCard.pageList.page = 1
			this.$refs.oneCard._getAccountInfo()
			setTimeout(() => {
				uni.stopPullDownRefresh()
			}, 1500);
		},
		mounted () {
		},
		methods: {
			change (index) {
				this.current = index
			},
		}
	}
</script>

<style lang="scss" scoped>
</style>
