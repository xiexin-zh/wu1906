<template>
	<view v-if="childList.length > 1" class="choose-child u-fx-ac-jc" @click="changeChild">
		{{ childList[index].userName }}
	</view>
</template>
<script>
	export default {
    props: {
    },
		data() {
			return {
				index: 0,
				childList: JSON.parse(uni.getStorageSync('protal')).childList
			}
		},
		mounted () {
			
		},
		methods: {
			changeChild () {
				const arr = this.childList.map(item => {
					return item.userName
				})
				this.$tools.actionsheet(arr, (index) => {
					this.index = index
					this.$emit('change', this.childList[index])
				})
			}
		}
	}
</script>
<style lang="scss">
  .choose-child {
		position: fixed;
		width: 200rpx;
		border-radius: 10rpx;
		height: 80rpx;
		background-color: $u-type-primary-dark;
		color:#fff;
		bottom: 20rpx;
		left: -10rpx;
		z-index: 99;
		line-height: 80rpx;
  }
</style>
