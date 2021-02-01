<template>
  <view class="message">
    <view class="message-top u-bg-fff">
      <view class="tab-title u-fx">
        <view v-for="(tab, index) in tabList" :key="tab.id" @click="changeTab(tab)" :class="{'act': tabIndex === tab.id}" class="tab u-fx-f1 u-tx-c">
     <!--     <view class="tips" v-if="noticeTotal.length > 0 && noticeTotal[index] > 0">
						<view class="small">{{noticeTotal[index]}}</view>
					</view> -->
					{{ tab.title }}
        </view>
      </view>
    </view>
		<scroll-view scroll-y="true" class="scroll-h u-mar-t10">
			<app-message :data-list="appMessageList" v-if="tabIndex===0"></app-message>
			<system-message :notice-index="tabIndex" :data-list="systemMessageList" v-if="tabIndex!==0"></system-message>
		</scroll-view>
  </view>
</template>

<script>
	import {store, actions} from './store/index.js'
	import appMessage from './component/app-message.vue'
	import systemMessage from './component/system-message.vue'
  export default {
		computed: {
			noticeTotal: () => store.noticeTotal,
			userInfo: () => store.userInfo
		},
		components:{
			appMessage,
			systemMessage
		},
    data () {
      return {
				appMessageList: [],
				systemMessageList: [],
        tabIndex: 0,
        tabList: [
          {
            id: 0,
            title: '应用消息',
          },
          {
            id: 1,
            title: '通知公告',
          },
          {
            id: 2,
            title: '平台消息',
          }
        ]
      }
    },
		mounted () {
			console.log(this.noticeTotal)
			this.systemList(0)
		},
    methods: {
      changeTab (tab) {
        this.tabIndex = tab.id
				this.systemList(tab.id)
      },
			/**
			 * @description  消息分类
			 */
			async systemList (type) {
				if (type === 0 ) {
					this.fun = 'searchPersonApp'
				} else if (type === 1 ){
					this.fun = 'searchPersonTz'
				} else {
					this.fun = 'searchPersonNotice'
				}
				const res = await actions[this.fun]({
					page: 1,
					size: 20,
					userCode: this.userInfo.userCode,
					eduCode: this.userInfo.schoolCode
				})
				if (type === 0) {
					this.appMessageList = res.data.list
				} else if (type === 1) {
					this.systemMessageList = res.data.list.map(item => {
						return {
							noticeCode: item.noticeCode,
							title: item.title,
							content: item.content,
							creatTime: item.creatTime,
							readStatus: item.readStatus,
							publisherName: item.publisherName
						}
					})
				} else {
					this.systemMessageList = res.data.list.map(item => {
						return {
							noticeCode: item.noticeCode,
							title: item.title,
							content: item.content,
							creatTime: item.creatTime,
							readStatus: item.readStatus,
							publisherName: item.publisherName
						}
					})
				}
			}
    }
  }
</script>

<style lang="scss" scoped>
  .message {
		.message-top {
			height: 80rpx;
			.tab-title {
				.tips {
					position: absolute;
					width: 28rpx;
					height: 28rpx;
					line-height: 28rpx;
					background-color: #ff5454;
					top: 10rpx;
					z-index: 99;
					right: -20rpx;
					border-radius: 100%;
				}
				.small {
					color:#fff;
					font-size: 24rpx;
					transform: scale(.8);
				}
			  .tab {
			    line-height: 76rpx;
			    height: 76rpx;
					margin: 0 50rpx;
			  }
			  .act {
					color: $u-type-primary;
					border-bottom: 4rpx $u-type-primary solid;
					font-weight: bold;
					font-size: 30rpx;
			  }
			}
		}
		.scroll-h {
			height: calc(100vh - 190rpx);
		}
  }

</style>
