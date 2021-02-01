<template>
	<view class="footer-com u-fx u-bd-t">
		<view @click="switchTab(foot.id)" class="u-fx-f1 u-fx-ac-jc u-content-color animate__animated animate__bounceIn" :class="{ 'act': foot.id == tabIndex }" v-for="foot in footList" :key="foot.id">
			<view class="total" v-if="foot.id === -1 && total !== 0">
				<view class="small">{{ total }}</view>
			</view>
			<image :src="foot.id === tabIndex ? foot.iconAct : foot.icon" class="foot-img"></image>
			<text class="tip">{{ foot.name }}</text>
		</view>
	</view>
</template>

<script>
import { store, setStore } from '../store/index.js'
import eventBus from '@u/eventBus'
export default {
	data() {
		return {
			total: 0,
			footList: [
				{
					id: 0,
					name: '首页',
          icon: '/mobile-img/home-icon.png',
					iconAct: '/mobile-img/home-icon-act.png'
				},
				{
					id: 1,
					name: '应用',
					icon: '/mobile-img/shop-icon.png',
					iconAct: '/mobile-img/shop-icon-act.png'
				},
				{
					id: 2,
					name: '消息',
					icon: '/mobile-img/message-icon.png',
					iconAct: '/mobile-img/message-icon-act.png'
				},
				{
					id: 3,
					name: '我的',
					icon: '/mobile-img/mine-icon.png',
					iconAct: '/mobile-img/mine-icon-act.png'
				}
			]
		}
	},
  computed: {
    tabIndex: () => store.tabIndex
  },
	mounted () {
		eventBus.$on('showTotal', (data) => {
			if (data) {
				this.total = data
			} else {
				this.total = this.total - 1 <=0 ? 0 : this.total - 1
			}
		})
	},
	methods: {
		switchTab (index) {
			if (index !== 3 && store.userInfo.typeCode === '16' && store.childList.length === 0) {
				this.$tools.toast('请先绑定孩子')
				return
			}
			uni.setStorageSync('tabIndex', index)
      setStore({
        key: 'tabIndex',
        data: index
      })
		}
	}
}
</script>

<style lang="scss" scoped>
.footer-com {
	width: 100%;
	height: 100rpx;
	background-color: #ffffff;
	.total {
		position: absolute;
		width: 28rpx;
		height: 28rpx;
		background-color: #ff5454;
		border-radius: 100%;
		top: 10rpx;
		line-height: 28rpx;
		text-align: center;
		right: 28rpx;
		color:#fff;
	}
	.small {
		color:#fff;
		font-size: 24rpx;
		transform: scale(.8);
	}
  .tip {
    padding-top: 4rpx;
    font-size: 24rpx;
  }
  i {
    font-size: 40rpx;
  }
	.foot-img {
		width: 40rpx;
		height: 40rpx;
		display: block;
	}
	.act {
		color: $u-type-primary !important;
	}
}
</style>
