<template>
	<view class="footer u-fx">
		<view @tap="changeIndex(index)" class="u-fx-f1 u-fx-ac-jc" v-for="(footer,index) in footerList" :key="index">
			<u-image width="44rpx" height="44rpx" :src="current === index ? footer.activeIcon : footer.autoIcon"></u-image>
			<text :class="['u-tips-color u-font-02', {'act': current === index}]">{{ footer.title }}</text>
		</view>
	</view>
</template>

<script>
	export default {
		data () {
			return {
				current: 0,
				footerList: [
					{
						title: '班级空间',
						autoIcon: 'http://canpointtest.com/mini-img/index-icon.png',
						activeIcon: 'http://canpointtest.com/mini-img/index-icon-act.png'
					},
					{
						title: '班级成员',
						autoIcon: 'http://canpointtest.com/mini-img/contact-icon.png',
						activeIcon: 'http://canpointtest.com/mini-img/contact-icon-act.png'
					},
					{
						title: '个人空间',
						autoIcon: 'http://canpointtest.com/mini-img/mine-icon.png',
						activeIcon: 'http://canpointtest.com/mini-img/mine-icon-act.png'
					}
				]
			}
		},
		methods: {
			changeIndex (index) {
				this.current = index
				this.$emit('change', index)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.footer {
		height: 100rpx;
		position: fixed;
		width: 100%;
		left: 0rpx;
		background-color: #fff;
		border-top: 1px #f5f5f5 solid;
		bottom: 0rpx;
		.act {
			color: $u-type-primary;
		}
	}
</style>
