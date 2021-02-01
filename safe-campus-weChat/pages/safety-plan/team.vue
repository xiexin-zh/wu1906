<template>
	<view class="home u-fx-f1   u-fx-ver">
		<scroll-view scroll-y="true" class="scroll-h" >
			<view class="fatherList" v-for="(item,index) in list" :key="index">
				<view class="team u-padd-20">
					{{item.name}}
				</view>
				<view v-for="(el,index1) in item.children" :key="index1" class="sonList u-padd-l30 u-padd-r30 u-bg-fff ">
					<view class="cont u-bd-b u-fx-ac u-fx-jsb">
						<view class="left u-fx u-fx-ac ">
							<view class="img">
								<u-image :src="el.img" width="100%" height="80rpx" shape="circle" mode="widthFix"></u-image>
							</view>
							<view class="wenzi u-mar-l20">
								<view class="name u-mar-b10 u-bold">{{el.userName}}</view>
								<view class="u-font-02 u-tips-color">{{el.mobile}}</view>
							</view>
						</view>
						<u-icon size='40' @click="call(el.mobile)" class="right" name="http://canpointtest.com/mobile-img/icon_hujiao.png"></u-icon>
					</view>
				</view>
			</view>
		</scroll-view>
		<u-popup v-model="showPopup" mode="bottom" length="18%">
			<view class="item u-border-radius-middle u-mar-b20 u-bg-fff phone u-fx-ac u-fx-jc">
				<u-icon size='45' @click="showPopup=true" class="u-mar-r10" name="http://canpointtest.com/mobile-img/icon_hujiao.png"></u-icon>
				1458455888
			</view>
			<view class="item u-border-radius-middle u-bg-fff u-fx-ac u-fx-jc">
				取消
			</view>
		</u-popup>
	</view>
</template>
<script>
	import { actions } from './store/index.js'
	export default {
		data() {
			return {
				showPopup: false,
				list: [{
						name: '总指挥',
						children: []
					},
					{
						name: '副指挥',
						children: []
					},
					{
						name: '应急队伍',
						children: []
					}
				]
			}
		},
		async mounted() {
      this.detailId = this.$route.query.id
      this._getTemplateDetail()
    },
		methods: {
      async _getTemplateDetail() {
        const res = await actions.getTemplateDetail(this.detailId)
        this._getUserPhone(0,res.data.commandUsers)
        this._getUserPhone(1,res.data.deputyCommandUsers)
        this._getUserPhone(2,res.data.users)
      },
      async _getUserPhone(index,data) {
         const userCode = data.map(el => {
          return el.userCode
        })
        const result = await actions.getUserPhone(userCode)
        this.list[index].children = result.data
      },
      call(iphone) {
        uni.makePhoneCall({
            phoneNumber: iphone
        })
      }
    }
	};
</script>
<style lang="scss" scoped>
	.home {
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
				height: 134rpx;
			}
			.img {
				width: 80rpx;
				height: 80rpx;
			}
		}
	}
</style>
