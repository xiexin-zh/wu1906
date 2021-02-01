<template>
	<view class="broadcast home u-page">
		<view class="nav-tab">
      <view
        :class="['nav-item',{'active':item.id === currentIndex}]"
        v-for="item in navs"
        :key="item.id"
        @click="tabChange(item.id)"
      >
			<view class="text u-bold">
				{{item.name}}
			</view>
			</view>
    </view>
		<view class="u-font-01 select u-fx u-padd-l30"
		:class="{'margin':currentTabComponent==='cast','u-fx-jc':currentTabComponent!=='cast'}">
				当前区域：
				<view class="u-fx-ac u-fx-jc " @click="show=!show">
					<text class=' text-color' :class="selectItem?'u-type-primary':'u-tips-color'">{{selectItem||'请选择'}}</text>
					<view class="icon"></view>
				</view>
				 <multiple-select
					v-model="show"
					:data="options"
					:default-selected="defaultSelected"
					@confirm="confirm"
				></multiple-select>
		</view>
		<keep-alive>
			<component :is="currentTabComponent" :chooseList="chooseList" :areaList="areaList"></component>
		</keep-alive>
	</view>
</template>
<script>
import multipleSelect from "../component/multipleSelect";
import { store, actions } from '../store/index.js';
import  cast  from './cast';
import  call from './call';
import phone from './phone';
export default {
	components:{
		cast,
		call,
		phone,
		multipleSelect
	},
	computed: {
		isBZR: () => JSON.parse(uni.getStorageSync('protal')).isBZR,
		userInfo: () => store.userInfo,
		schoolYearId: () => store.schoolYear.schoolYearId
	},
	data() {
		return {
			arrow: true,
			currentIndex: '1',
			navs: [
        {
          id: '1',
          name: '应急广播'
        },
        {
          id: '2',
          name: '应急喊话'
        },
        {
          id: '3',
          name: '电话喊话'
        }
      ],
			show: false,
			selectItem:'',
			info: "",
			defaultSelected: [], //默认选中项
			options:[],
      currentTabComponent:'cast',
      areaList: [],
      chooseList: []
		};
	},
	async mounted() {
    this._getRadioArea()
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
		tabChange(type) {
      this.currentIndex = type
      if (type === '1') {
				this.currentTabComponent = 'cast'
      } else if (type === '2') {
				this.currentTabComponent = 'call'
      } else if (type === '3') {
				this.currentTabComponent = 'phone'
      }
		},
		// 确定事件
		confirm(data) {
			this.selectItem = data.map((el) => el.label).join(",");
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
		start(){},
	}
};
</script>

<style lang="scss" scoped>
.home {
	.nav-tab {
    height: 80rpx;
    line-height: 80rpx;
    text-align: center;
    background-color: $uni-bg-color;
    margin-bottom: 15rpx;
    .nav-item {
      width: 30%;
      float: left;
      &:nth-of-type(2) {
        margin: 0 37rpx;
      }
    }
    .active {
			color:$u-type-primary;
			.text{
      	border-bottom: 4rpx solid $u-type-primary;
			}
    }
	}
	.select{
		margin-top: 60rpx;
		margin-bottom: 60rpx;
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
	.margin{
		margin-top: 20rpx;
		margin-bottom: 10rpx;
	}
	.scroll-h{
		height: calc(100vh - 100rpx);
		.u-cell{
    box-shadow: 0rpx 10rpx 30rpx 0rpx rgba(9, 28, 62, 0.06);
    border-radius: 8rpx;
		}
		/deep/ .u-cell-item-box{
					// background: transparent!important;
		}
	}
	
}
</style>
