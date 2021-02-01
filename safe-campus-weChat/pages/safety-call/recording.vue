<template>
		<view class="u-fx-ver recording  u-fx-f1 u-fx-ac">
				<view class="noData" v-if="itemList.length===0">
					<view class="img">
					</view>
				</view>
				<scroll-view v-else scroll-y="true" class="scroll-h" @scrolltolower="loadMore">
					<u-collapse class="u-fx-f1 " :arrow="arrow" :accordion="accordion" :body-style='bodyStyle' :head-style='headStyle'>
						<u-collapse-item class='u-bd-b u-mar-b10'
						:open='true' 
						:item-style="itemStyle"   v-for="(item, index) in itemList" :key="index">
							<view slot='title-all' class="title-all u-main-color">
								<view class="text-cont">
									<view class="open-icon u-fx u-fx-ac">
										<u-icon name="arrow-down-fill" class="u-tips-color" size='2'></u-icon>
										<view class="u-mar-l">
											<u-input @blur="item.showInput=false" 
											v-if="item.showInput" v-model="item.head" type="text" :border="true" />	
											<text v-else @click.stop="item.showInput=true" class="text" >{{item.head}}</text>
										</view>
									</view>
									<view class="u-tips-color u-font-02">
									</view>
								</view>
							</view>
							<view class="collapse-item u-fx-ac u-fx-jc u-fx-jsa">
								<view class="item1 u-fx-ver u-fx-ac-jc">
									<u-icon  size="35" name="/mobile-img/icon_shiting2.png"></u-icon>
									<text class="text u-mar-t10 u-type-primary">试听</text>
								</view>
								<view class="item1">
									<u-icon  size="80" name="/mobile-img/icon_bofang.png"></u-icon>
								</view>
								<view class="item1 u-fx-ver u-fx-ac-jc">
									<u-icon  size="35" name="/mobile-img/icon_shanchu.png"></u-icon>
									<text class="text u-mar-t10 u-type-error">删除</text>
								</view>
							</view>
						</u-collapse-item>
					</u-collapse>
				</scroll-view>
				{{footerActive}}
				<view v-if="footerActive" class="footer active u-fx-ver u-fx-jc u-fx-ac">
					<view class="title u-mar-t30">
						录音2019-12-13_11:11:00
					</view>
					<view class="time u-mar-t20 u-mar-b30">
						11:11:00
					</view>
					<view class="img-1">
					</view>
					<view class="img" @click="stopRecord"></view>
				</view>
				<view v-else class="footer u-fx-ver u-fx-jc u-fx-ac">
					<view class="title " >
						轻点录音按钮开始录制语音
					</view>
					<view class="img" @click="startRecord"></view>
				</view>
		</view>
</template>
<script>
import wx from 'weixin-js-sdk'
import { store, actions } from './store/index.js';
import noData from '@/components/no-data/no-data.vue';
import uniRequest from "uni-request";
export default {
	components:{
		noData,
	},
	name:'recording',
	computed: {
		isBZR: () => JSON.parse(uni.getStorageSync('protal')).isBZR,
		userInfo: () => store.userInfo,
		schoolYearId: () => store.schoolYear.schoolYearId
	},
	data() {
		return {
			flag:false,
			arrow: true,
			accordion: false,
			footerActive:false,
			itemStyle: {
				color: '#343434',
				marginTop: '5rpx',
				background: '#fff',
			},
			bodyStyle: {
				background: '#fff',
			},
			headStyle: {
				height:'98rpx',
				fontSize: '32rpx',
				// paddingLeft: '30rpx',
				// paddingRight: '30rpx',
				background: '#fff',
				// borderBottom:'1px solid red',
				padding:'0rpx'
			},
			notBZR: false,
			itemList: [],
		};
	},
	async mounted() {
	},
	methods: {
    startRecord () {
      this.footerActive = true
      wx.startRecord(
        console.log('startRecord',wx.startRecord)
      )
    },
    stopRecord(){
      console.log('stopRecord',wx.stopRecord)
      wx.stopRecord({
        success: function (res) {
          var localId = res.localId;
          console.log('localId',localId)
          wx.uploadVoice({
            localId: localId, // 需要上传的音频的本地ID，由stopRecord接口获得
            isShowProgressTips: 1, // 默认为1，显示进度提示
            success: function (res) {
              var serverId = res.serverId; // 返回音频的服务器端ID
							uniRequest
							.get('/uploadSound', {
								params: {
									access_token: uni.getStorageSync('access_token'),
									media_id: serverId
								}
							})
							.then(response => {
								console.log(response)
							})
            }
          });
        }
      })
    },
		loadMore() {
			if (!this.morePage) {
				this.$tools.toast('数据已加载完毕');
				return;
			}
			this.showList(true);
		},
	}
};
</script>

<style lang="scss" scoped>
	.recording{
		.noData{
			.img{
				margin-top: 154rpx;
				width: 580rpx;
				height: 460rpx;
				background: url('/mobile-img/chatu.png') center center no-repeat;
				background-size: 580rpx 460rpx;
			}
		}
		.scroll-h,.noData{
			height: calc(100vh - 220rpx);
			.title-all {
				width: 100%;
				height: 100%;
				padding: 0 32rpx;
				.text-cont{
					height: 100%;
					width:100%;
					border-bottom: 1px solid #eee;
					display: flex;
					justify-content: space-between;
					align-items: center;
				}
			}
			.collapse-item{
				height: 175rpx;
				.text{
					// margin-top: 20rpx;
				}
				.list{
					border-bottom: 1px solid #eee;
				}	
			}
			/deep/ .u-iconfont{
			}
		}
		.footer{
			position: absolute;
			bottom: 0;
			width: 100%;
			height: 300rpx;
			background: #333333;
			border-radius: 30rpx 30rpx 0rpx 0rpx;
			color: #fff;
			.img{
				margin-top: 32rpx;
				width:148rpx;
				height:148rpx;
				background: url('/mobile-img/icon_luying.png') center center no-repeat;
				background-size: 100% 100%;
			}
		}
		.active{
			height: 420rpx;
			.img-1{
				width:537rpx;
				height:40rpx;
				background: url('/mobile-img/yinpin.png') center center no-repeat;
				background-size: 100% 100%;
			}
			.img{
				background: url('/mobile-img/icon_luyingzhong.png') center center no-repeat;
				background-size: 100% 100%;
			}
		}
	}
</style>
