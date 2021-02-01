<template>
	<view class="">
		<web-view :src="fileSrc"></web-view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			fileSrc: ''
		};
	},
	created() {
		this.fileSrc = 'https://docview.mingdao.com/op/embed.aspx?src=' + encodeURIComponent(this.$tools.getQuery().get('url'));
	},
	methods: {}
};
</script>

<style lang="scss" scoped></style>
