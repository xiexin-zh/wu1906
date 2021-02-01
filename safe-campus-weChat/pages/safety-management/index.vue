<template>
	<view class="schedule">
		<scroll-view scroll-y="true" class="scroll-h"  @scrolltolower="loadMore">
			<view class="schedule-calendar">
        <lxCalendar :value="value" ref="lxCalendar" @change="change"></lxCalendar>
      </view>
			<view class="schedule-content u-fx-f1 u-fx-ver">
        <view class="u-font-01 row-2 u-mar-t30 u-mar-b30 u-mar-l30 u-fx">
          当前区域：
          <view class="u-fx-ac u-fx-jc " @click="show=!show">
            <text class='u-type-primary text-color'>{{selectItem}}</text>
            <view class="icon"></view>
          </view>
          <multiple-select
            v-model="show"
            :data="options"
            :default-selected="defaultSelected"
            @confirm="confirm"
          ></multiple-select>
          <!-- <u-select v-model="show" mode="single-column" :list="options" 
          @confirm="confirm"></u-select> -->
        </view>
				<no-data v-if="dataList.length === 0" msg="暂无数据~" ></no-data>
				<u-cell-group v-else>
					<u-cell-item lable='' 
            v-for="(item,index) in dataList"
            :key="index"
            @click="eidt(item)"
            class="u-mar-b10 u-main-color u-bg-fff" :arrow="false">
						<view class="u-fx" slot="title">
							<view class="left">{{item.playTime}}</view>
							<text class="u-mar-l20">{{item.audioName}}</text>
						</view>
						<view class="u-mar-r20 u-type-primary" @click.stop="play(item)" slot="right-icon">播放</view>
						<view class="u-mar-r20 u-font-02 u-fx" slot="label">
							<text class="u-mar-l20 u-type-primary" v-if="item.playState === '待播放'">{{item.playState}}</text>
              <text class="u-mar-l20" v-else>{{item.playState}}</text>
						</view>
					</u-cell-item>
				</u-cell-group>
			</view>
		</scroll-view>
		<view class="footer-btn u-fx-ac u-bg-color">
			<u-button type="primary" class="u-fx-f1 u-mar-l u-mar-r u-type-primary-dark-bg" @click="add">添加</u-button>
		</view>
		<u-popup v-model="showPopup" mode="bottom">
			<view class="audioCont u-bg-fff u-padd-40 u-fx-ver u-fx">
					<view class="u-fx-ac-jc  u-type-primary">{{name}}</view>
					<free-audio ref="audio" startPic='http://canpointtest.com/mobile-img/CANPOINT.png' 
					endPic='http://canpointtest.com/mobile-img/CANPOINT.png'  :url='path'></free-audio>
					<view class="icon u-fx-jc">
						<view class="list u-fx-ac-jc" :class="bofangActive?'u-type-primary':'u-tips-color'" @click="listening">
							<u-icon class="u-mar-b10"  name="http://canpointtest.com/mobile-img/icon_shiting.png"  size='30'></u-icon>
							试听
						</view>
						<view class="list open u-fx-ac-jc" @click="start">
							<u-icon name="http://canpointtest.com/mobile-img/icon_bofang.png"  size='120'></u-icon>
						</view>
						<view class="list u-fx-ac-jc " :class="bofangActive?'u-tips-color':'u-type-primary '" @click="stop">
							<u-icon class="u-mar-b10" name="http://canpointtest.com/mobile-img/icon_zanting.png"  size='30'></u-icon>
							暂停
						</view>
					</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
  import multipleSelect from "./component/multipleSelect";
	import freeAudio from './component/free-audio.vue'
	import lxCalendar from '../../components/lx-calendar/lx-calendar.vue'
	import {
		store,
		actions
	} from './store/index.js'
	export default {
		components: {
			lxCalendar,
      freeAudio,
      multipleSelect
		},
		data() {
			return {
				bofangActive:false,
        path: '',
        name: '',
				showPopup: false,
        value: '',
        date: '',
        pageList: {
					page: 1,
					size: 10,
        },
        morePage: false,
        dataList: [],
        show: false,
        selectItem:'',
        options:[],
        chooseList: [],
        areaList: [],
        defaultSelected: [] //默认选中项
			}
		},
		mounted() {
      this.date = this.$tools.getDateTime(new Date(), 'date')
      this._getRadioArea()
      this._getTodayRadio()
		},
		methods: {
      // 区域列表
      async _getRadioArea() {
        const res = await actions.getRadioArea(store.userInfo.schoolCode)
        this.areaList = res.data
        this.options = res.data.map(el => {
          return {
            ...el,
            label: el.name,
            value: el.code
          }
        })
        this.selectItem = this.options[0].label
        this.defaultSelected = [this.options[0].value]
        this.chooseList = [this.options[0].value]
      },
      confirm(e){ 
        this.selectItem = e.map((el) => el.label).join(",")
        this.chooseList = e.map((el) => el.code)
      },
      // 列表
      async _getTodayRadio(tag = false) {
        if (tag) {
					this.pageList.page += 1;
				} else {
					this.pageList.page = 1;
				}
        const req = {
          ...this.pageList,
          date: this.date,
          schoolCode: store.userInfo.schoolCode
        }
        const res = await actions.getTodayRadio(req)
        this.total = res.data.total
        if (tag) {
					this.dataList = this.dataList.concat(res.data.records);
				} else {
					this.dataList = res.data.records;
				}
				this.morePage = res.data.pages > res.data.current;
      },
      change(e) {
        this.date = e.fulldate === this.currentDate ? this.currentDate : e.fulldate
        this._getTodayRadio()
      },
      play(item) {
        console.log('item',item)
        this.path = item.audioUrl
        this.name = item.audioName
				this.showPopup = true
			},
			// 试听
			listening() {
				this.bofangActive = true
				this.$refs.audio.start()
			},
			// 暂停
			stop() {
				this.bofangActive = false
				this.$refs.audio.stop()
      },
      // 播放
      async start(){
        if (this.chooseList.length === 0) {
          this.$tools.toast('请选择区域')
          return
        }
        let tms = []
        for (let i = 0; i < this.areaList.length; i++) {
          for (let y = 0; y < this.chooseList.length; y++) {
            if (this.areaList[i].code === this.chooseList[y]) {
              tms = tms.concat(this.areaList[i].ipList)
            }
          }
        }
        const data = {
          level: '1',
          messageContents: [this.path],
          msgType: '1',
          tms: tms.filter((item, index) => {
            return tms.indexOf(item, 0) === index
          })
        }
        const req = {
          query: store.userInfo.schoolCode,
          data: data
        }
        await actions.playRadioSource(req)
        this.showPopup = false
        this.$tools.toast('播放成功')
      },
			// 编辑
			eidt(item){
        console.log(item)
				let {id} = item
				this.$tools.navTo({
					url: `./add?code=${item.taskCode}`,
				})
			},
			loadMore() {
				if (!this.morePage) {
					this.$tools.toast('数据已加载完毕');
					return;
				}
				this.showList(true);
			},
			add() {
				this.$tools.navTo({
					url: `./add`,
					title:"应急详情"
				})
			}
		}
	}
</script>
<style lang="scss" scoped>
	.schedule {
    .scroll-h {
      height: calc(100vh - 120rpx);
      .schedule-calendar {
        background-color: $u-type-primary;
        color: #fff;
      }
      .schedule-sub {
        padding: 0 180rpx;
      }
      .schedule-content {
        border-radius: $u-border-radius;
        /deep/ .u-cell-item-box{
          background: transparent!important;
        }
        .left{
          width: 100rpx;
        }
      }
    }
	.audioCont{
		.open{
			margin: 0 100rpx;
		}
	}
}
.row-2{
  .text-color{
    color: #0084FF;
  }
  .icon{
    margin-left: 15rpx;
    margin-top: 17rpx;
    display:inline-block;
    width:0;
    height:0;
    border-top:6rpx solid transparent;
    border-left:6rpx solid transparent;
    border-right:6rpx solid #0084FF;
    border-bottom:6rpx solid #0084FF;
    // transform:rotate(132deg); 
  }
}
</style>
