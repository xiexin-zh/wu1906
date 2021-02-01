<template>
	<view class="home u-fx-f1  u-fx-ver">
			<div class="head u-fx-ac-jc">
				<view class="u-font-2 u-mar-b20 u-bold">
					{{name}}
				</view>
				<view class="">
					总指挥：{{command}}&nbsp;&nbsp;副指挥：{{deputy}}
				</view>
			</div>
			<scroll-view scroll-y="true" class="scroll-h u-padd-t20 u-padd-l20 u-padd-r20"  @scrolltolower="loadMore">
				<u-cell-group >
						<u-cell-item lable='' 
						v-for="(item,index) in lists"
						:key="index"
						@click="goItemPage(item)"
						class="u-mar-b20 u-main-color u-bg-fff" :arrow="true">
							<view class="u-fx" slot="title">
								<text class="u-bold u-font-1">{{item.name}}</text>
							</view>
						</u-cell-item>
					</u-cell-group>
			</scroll-view>
			<view class="footer u-fx-ac-jc">
        
				<view :class="['u-fx-ac-jc', 'u-bold', 'u-font-1', state === '0' ? 'start' : 'stop']" @click="start">
          <timer ref="timer"></timer>
					{{state === '0' ? '立即启动' : '立即停止'}}
				</view>
			</view>
	</view>
</template>
<script>
import timer from './component/timer.vue'
import { store, actions } from './store/index.js';
export default {
	components:{
    timer
	},
	computed: {
		userInfo: () => store.userInfo
	},
	data() {
		return {
			arrow: true,
			flag:false,
			lists:[
				{
					name:'应急监控',
					value:1,
				},
				{
					name:'应急广播',
					value:2
				},
				{
					name:'演练疏散路线图',
					value:3
				},
				{
					name:'应急队伍',
					value:4
				},
				{
					name:'应急演练器材',
					value:5
				},
				{
					name:'应急演练文件',
					value:6
				},
      ],
      name: '',
      command: '',
      deputy: '',
      state: 0
		};
	},
	async mounted() {
    this.detailId = this.$route.query.id
    this.state = this.$route.query.state
    this.name = this.$route.query.name
    this.command = this.$route.query.command
    this.deputy = this.$route.query.deputy
	},
	methods: {
		goItemPage(item){
			if(item.value===1){
				this.$tools.navTo({
					url: `./video?id=${this.detailId}`,
					title:"应急详情"
				})
			}else if (item.value===2){
				this.$tools.navTo({
					url: `./broadcast/index?id=${this.detailId}`,
					title:"应急广播/喊话"
				})
			} else if (item.value===3){
				this.$tools.navTo({
					url: `./routerMap?id=${this.detailId}`,
					title:"演练疏散路线图"
				})
			} else if (item.value===4){
				this.$tools.navTo({
					url: `./team?id=${this.detailId}`,
					title:"应急队伍"
				})
			} else if (item.value===5){
				this.$tools.navTo({
					url: `./equipment?id=${this.detailId}`,
					title:"应急演练器材"
				})
			} else if (item.value===6){
				this.$tools.navTo({
					url: `./file?id=${this.detailId}`,
					title:"应急演练文件"
				})
			} 
		},
		loadMore() {
			if (!this.morePage) {
				this.$tools.toast('数据已加载完毕');
				return;
			}
			this.showList(true);
		},
		details(item){
		},
		start(){
			this.$tools.confirm("启动预案讲可能触发广播警报,确定启动预案吗？", () => {
        this.flag = true
        const req = {
          emergencyId: this.detailId,
          schoolCode: store.userInfo.schoolCode,
          userCode: store.userInfo.userCode,
          userName: store.userInfo.userName,
        }
        actions.playCenterPlan(req).then(res => {
          this.$tools.toast('启动成功')
        })
			})
    },
    // 启动和结束预案
    async start() {
      if(this.state === '0') {
        this.$tools.confirm("启动预案讲可能触发广播警报,确定启动预案吗？", () => {
          this.state = '1'
          this.$refs.timer.start(1)
          const req = {
            emergencyId: this.detailId,
            schoolCode: store.userInfo.schoolCode,
            userCode: store.userInfo.userCode,
            userName: store.userInfo.userName,
          }
          actions.playCenterPlan(req).then(res => {
            this.$tools.toast('启动成功')
            this.rehearsalId = res.data
          })
        })
      } else {
        this.state = '0'
        this.$refs.timer.start(0)
        await actions.endCenterPlan(this.rehearsalId)
        this.$tools.toast('停止成功')
      }
    }
	}
};
</script>

<style lang="scss" scoped>
.home {
	width: 100%;
	height: 100%;
	.head{
		height: 248rpx;
		background: url('/mobile-img/header1.png') center center no-repeat;
		background-size: 100% 100%;
		color: #fff;
	}
	.scroll-h{
		height: calc(100vh - 515rpx);
		.u-cell{
      border: 1rpx solid #FAFBFD;
      box-shadow: 0rpx 10rpx 30rpx 0rpx rgba(9, 28, 62, 0.06);
      border-radius: 8rpx;
		}
		/deep/ .u-cell-item-box{
			background: transparent!important;
		}
	}
	.footer{
		height: 266rpx;
		.start{
			color: #fff;
			height: 256rpx;
			width: 256rpx;
			background: url('/mobile-img/lijiqidong.png') center center no-repeat;
			background-size: 256rpx 256rpx;
		}
		.stop{
			color: #fff;
			height: 256rpx;
			width: 256rpx;
			background: url('/mobile-img/button6.png') center center no-repeat;
			background-size: 256rpx 256rpx;
		}
	}
}
</style>
