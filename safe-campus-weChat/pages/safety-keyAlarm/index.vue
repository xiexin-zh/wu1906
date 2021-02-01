<template>
	<view class="parent-manage u-page u-fx-ver ">
			<view class="red u-fx-ac-jc">
				若遇到危险，请向警方求助!
			</view>
			<view class="u-fx-ac-jc">
				谎报警情将可能被处以五日以上十日以下拘留
			</view>
      <view class="address u-fx-ac-jc u-padd u-font-1" @click="go">
				位置信息：{{address}}
			</view>
			<view class="u-fx-ac-jc" @click="call">
				<view class="img"></view>
				<view class="text u-mar-t20 u-bold u-font-2">呼叫110</view>
			</view>
			<div class="footer-text">
				<view class="u-mar-b10">点击警报按钮后</view>
				<view>将报警信息同步显示到安全大数据中心大屏</view>
			</div>
		</view>
</template>
<script>
  import vConsole from 'vconsole'
  import { store, actions } from './store/index.js';
	export default {
		data() {
			return {
        address: ''
			};
    },
    async mounted () {
      this.address = this.$route.query.adress
      if(!this.address){
        this.$tools.toast('请选择位置')
        this.$tools.goNext(() => {
          this.go()
        })
      }
    },
		methods: {
			call() {
				uni.makePhoneCall({
          phoneNumber: '110',
          success: (res) => {
            const req = {
              callPoliceAddr: this.address,
              callPoliceTime: this.$tools.getDateTime(),
              schoolCode: store.userInfo.schoolCode,
              userCode: store.userInfo.userCode,
              userName: store.userInfo.userName
            }
            actions.callPolice(req)
          }
        })
      },
      go(){
        this.$tools.navTo({
          url: './map'
        })
      }
		}
	}
</script>

<style lang="scss" scoped>
	.parent-manage {
		.red {
			margin-top: 85rpx;
			margin-bottom: 10rpx;
			font-size: 36rpx;
			font-family: PingFang SC;
			font-weight: bold;
			color: #EB0207;
    }
    .address {
      margin: 80rpx 50rpx 0 50rpx;
      background: #F2F2F2;
    }
		.img {
			margin-top: 185rpx;
			height: 327rpx;
			width: 328rpx;
			background: url('/mobile-img/big_button_hujiao110.png') center center no-repeat;
			background-size: 100% 100%;
		}
		.footer-text {
			position: absolute;
			bottom: 85rpx;
			margin-left: 50rpx;
			margin-right: 50rpx;
			background: #F2F2F2;
			padding: 30rpx 45rpx;
		}
	}
</style>
