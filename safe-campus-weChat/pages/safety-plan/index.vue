<template>
	<view class="home u-padd-20">
    <scroll-view scroll-y="true" class="scroll-h"  @scrolltolower="loadMore">
      <u-cell-group >
        <u-cell-item lable='' 
        v-for="(item,index) in lists"
        :key="index"
        @click="details(item)"
        class="u-mar-b20 u-main-color u-bg-fff" :arrow="true">
          <u-icon slot="icon" class="u-mar-r20" size="40" :name="`http://canpointtest.com/mobile-img/icon_${getIcon(item.type)}.png`"></u-icon>
          <view class="u-fx u-fx-ac" slot="title">
            <text class="u-bold u-font-1">{{item.name}}</text>
            <view class="starting u-mar-l10 u-fx-ac-jc">{{item.state === 0 ? '未启动' : '已启动'}}</view>
          </view>
          <view class="u-mar-r20 u-font-02 u-fx" slot="label">
            <view class="left">总指挥：{{item.command}}</view>
            <text class="u-mar-l20 ">副指挥：{{item.deputy}}</text>
          </view>
        </u-cell-item>
      </u-cell-group>
    </scroll-view>
	</view>
</template>
<script>
import { store, actions } from './store/index.js';
export default {
	components:{
	},
	computed: {
		isBZR: () => JSON.parse(uni.getStorageSync('protal')).isBZR,
		userInfo: () => store.userInfo,
		schoolYearId: () => store.schoolYear.schoolYearId
	},
	data() {
		return {
			arrow: true,
			current: 0,
			lists:[],
      pageList: {
        page: 1,
        size: 10,
      },
      morePage: false,
		};
	},
	async mounted() {
    this._getEmergencyPlan()
	},
	methods: {
    getIcon(text) {
      if (text === "01") {
        return "dizhen";
      } else if (text === "02") {
        return "huozai";
      } else if (text === "03") {
        return "chuanran";
      } else if (text === "04") {
        return "shiwu";
      } else if (text === "05") {
        return "caita";
      } else if (text === "06") {
        return "tufashijian";
      } else if (text === "07") {
        return "fangkongfangbao";
      } else if (text === "08") {
        return "nishui";
      } else if (text === "09") {
        return "fanxun";
      } else if (text === "10") {
        return "qita";
        // return "qiduantianqi"; //极端天气
        
      }
    },
    // 列表
    async _getEmergencyPlan(tag = false) {
      if (tag) {
        this.pageList.page += 1;
      } else {
        this.pageList.page = 1;
      }
      const req = {
        ...this.pageList,
        schoolCode: store.userInfo.schoolCode
      }
      const res = await actions.getEmergencyPlan(req)
      this.total = res.data.total
      if (tag) {
        this.lists = this.lists.concat(res.data.records);
      } else {
        this.lists = res.data.records;
      }
      this.morePage = res.data.pages > res.data.current;
    },
		loadMore() {
			if (!this.morePage) {
				this.$tools.toast('数据已加载完毕');
				return;
			}
			this.showList(true);
		},
		details(item){
			this.$tools.navTo({
        url: `./details?id=${item.id}&name=${item.name}&command=${item.command}&deputy=${item.deputy}&state=${item.state}`
			})
		},
	}
};
</script>

<style lang="scss" scoped>
.home {
	/deep/ .u-cell-item-box{
				background: transparent!important;
	}
	.starting{
		width: 88rpx;
		height: 36rpx;
		background: #EBF5FF;
		font-size: 20rpx;
		font-family: Source Han Sans CN;
		font-weight: 500;
		color: #0084FF;
	}
}
</style>
