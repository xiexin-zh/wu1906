<template>
	<scroll-view  scroll-y="true" class="scroll-h detail">
    我是详情页
    <view @click="changeColor" class="btn">改变文字</view>
  </scroll-view>
</template>

<script>
  import eventBus from '@u/eventBus.js'
	export default {
		data() {
			return {
			}
		},
    components: {
    },
    mounted() {
    },
		methods: {
      changeColor () {
        eventBus.$emit('change')
      }
    },
	}
</script>

<style lang="scss" scoped>
  .scroll-h {
    height: 100vh;
  }
  .btn {
    background-color: $u-type-primary;
    height: 60rpx;
    text-align: center;
    line-height: 60rpx;
    color:#fff;
  }
  .detail {
    padding: 25rpx 20rpx;
    line-height: 46rpx;
  }
</style>
