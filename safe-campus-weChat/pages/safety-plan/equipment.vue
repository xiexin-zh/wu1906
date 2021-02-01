<template>
	<view class="home u-fx-f1   u-fx-ver">
		<scroll-view scroll-y="true" class="scroll-h" >
      <view v-for="(item,index2) in list" :key="index2" 
        class="sonList u-padd-l30  u-padd-r30 u-mar-b20 u-bg-fff ">
        <view class="cont u-bd-b u-fx-ac u-fx-jsb">
          <view class="wenzi u-fx ">
            <view class="name u-mar-b10 u-content-color">器材名称：</view>
            <view class="u-font-1 u-main-color">{{item.name}}</view>
          </view>
        </view>
        <view class="cont u-bd-b u-fx-ac u-fx-jsb">
          <view class="wenzi u-fx ">
            <view class="name u-mar-b10 u-content-color">器材数量：</view>
            <view class="u-font-1 u-main-color">{{item.amount}}</view>
          </view>
        </view>
        <view class="cont u-bd-b u-fx-ac u-fx-jsb">
          <view class="wenzi u-fx ">
            <view class="name u-mar-b10 u-content-color">存放位置：</view>
            <view class="u-font-1 u-main-color">{{item.address}}</view>
          </view>
        </view>
      </view>
		</scroll-view>
	</view>
</template>
<script>
	import { actions } from './store/index.js'
	export default {
		data() {
			return {
				showPopup: false,
				list: []
			}
		},
		async mounted() {
      this.detailId = this.$route.query.id
      this._getTemplateEquip()
    },
		methods: {
      async _getTemplateEquip() {
        const res = await actions.getTemplateEquip({emergencyId: this.detailId})
        this.list = res.data
      }
    }
	};
</script>
<style lang="scss" scoped>
	.home {
		.scroll-h{
			height: calc(100vh - 0rpx);
		}
		/deep/ .u-drawer-bottom {
			// background-color: rgba(0, 0, 0, 0.5)!important;
			background-color: transparent;
			padding: 20rpx;
			.item {
				height: 90rpx;
				width: 100%;
			}
		}
		.sonList {
			.cont {
				height: 100rpx;
			}
		}
	}
</style>
