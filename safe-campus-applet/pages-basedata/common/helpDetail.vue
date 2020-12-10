<template>
	<view class="app-help">
		<no-data top="200" width="128" height="128" autoImg="http://canpointtest.com/mini-img/auto-help.png" msg="数据正在整理中..."></no-data>
	</view>
</template>

<script>
	import NoData from '../component//NoData.vue'
	export default {
		components: {
			NoData
		},
		data () {
			return {}
		}
	}
</script>

<style lang="scss" scoped>
	.app-help {
	}
</style>
