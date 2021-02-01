<template>
	<view class="parent-manage u-page u-fx-ver u-auto ">
		<!-- <view class="u-padd-l30 u-padd-r30 u-padd-t20">
			<u-subsection @change="change" active-color="#2979ff" :list="typeList" 
			mode="subsection" :current="current"></u-subsection>
		</view> -->
		<no-data msg="暂无数据" v-if="notBZR"></no-data>
		<view v-if="!notBZR" class="u-fx-ver u-border-radius tab-box u-fx-f1">
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
			<view class="u-font-01 u-fx-ac u-fx-jc row-3">
				<keep-alive>
					<component :is="currentTabComponent" :chooseList="chooseList" :areaList="areaList"></component>
				</keep-alive>
			</view>
		</view>
	</view>
</template>
<script>
import multipleSelect from "./component/multipleSelect";
import { store, actions } from './store/index.js';
import call from './call';
import recording from './recording';
export default {
	components:{
		call,
		recording,
		multipleSelect
	},
	computed: {
		userInfo: () => store.userInfo
	},
	data() {
		return {
			notBZR: false,
			current: 0,
			typeList: [
				{
					name: '应急广播'
				},
				{
					name: '录音播报'
				},
			],
			show: false,
			selectItem:'',
			options:[],
      currentTabComponent:'call',
      chooseList: [],
      areaList: [],
      defaultSelected: [] //默认选中项
		}
	},
	async mounted() {
		// wxApi.getConfig(uni.getStorageSync('_schoolCode'));
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
		confirm(e){ 
      this.selectItem = e.map((el) => el.label).join(",")
      this.chooseList = e.map((el) => el.code)
		},
		change(index) {
      console.log('index',index)
			if(index===0){
				this.currentTabComponent = 'call'
			}else if (index===1){
				this.currentTabComponent = 'recording'
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.parent-manage {
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
}
</style>
