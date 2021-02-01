<template>
	<view class="dropDown u-fx">
		<ms-dropdown-menu><ms-dropdown-item v-model="valueStatu" :list="typeList"></ms-dropdown-item></ms-dropdown-menu>
		<ms-dropdown-menu><ms-dropdown-item v-model="valueOptStatu" :list="typeListStatus"></ms-dropdown-item></ms-dropdown-menu>
		<ms-dropdown-menu><ms-dropdown-item v-model="valueTime" :list="typeListTime"></ms-dropdown-item></ms-dropdown-menu>
	</view>
</template>

<script>
import MxDatePicker from '@/components/mx-datepicker/mx-datepicker.vue';
import msDropdownMenu from '@/components/ms-dropdown/dropdown-menu.vue';
import msDropdownItem from '@/components/ms-dropdown/dropdown-item.vue';
import { store, actions } from '../store/index.js';
export default {
	components: {
		msDropdownMenu,
		msDropdownItem,
		MxDatePicker
	},
	props: {
		statusList: {
			type: Array,
			default: () => {
				return [];
			}
		}
	},
	data() {
		return {
			valueOptStatu: '0',
			valueStatu:'0',
			valueTime:'0',
			dateValue: '',
			showPicker: false,
			searchObj: {},
			typeList: [
				{
					text: '审批状态',
					value: ''
				},
				{
					text: '待审批',
					value: '1'
				},
				{
					text: '审批通过',
					value: '2'
				},
				{
					text: '审批未通过',
					value: '3'
				},
				{
					text: '审批中',
					value: '4'
				}
			],
			typeListStatus: [
				{
					text: '操作状态',
					value: ''
				},
				{
					text: '待审批',
					value: '1'
				},
				{
					text: '已审批',
					value: '2'
				},
			],
			typeListTime: [
				{
					text: '全部时间',
					value: '0'
				},
				{
					text: '一周内',
					value: '7'
				},
				{
					text: '1个月内',
					value: '30'
				},
				{
					text: '3个月内',
					value: '180'
				},
				{
					text: '6个月内',
					value: '360'
				},
			]
		};
	},
	watch: {
		valueOptStatu(val, oldval) {
			if (val !== oldval) {
				if(val==0){
					this.value0 = ''
				}
				this.$emit('valueOptStatu', this.valueOptStatu);
			}
		},
		valueStatu(val, oldval) {
			if (val !== oldval) {
				if(val==0){
					this.valueStatu = ''
				}
				this.$emit('valueStatu', this.valueStatu);
			}
		},
		valueTime(val, oldval) {
			if (val !== oldval) {
				if(val==0){
					this.valueTime = ''
				}
				this.$emit('valueTime', this.valueTime);
			}
		},
		searchObj(val, oldval) {
			if (val !== oldval) {
				this.$emit('searchChange', this.searchObj);
			}
		}
	},
	async mounted() {},
	methods: {
		onShowDatePicker() {
			this.showPicker = !this.showPicker;
		},
		cancelAll(e) {
			this.showPicker = false;
			this.searchObj = {};
		},
		onSelected(e) {
			console.log(e);
			this.showPicker = false;
			if (!e) {
				return;
			}
			/* 			this.title = e.value; */
			this.searchObj = {
				startTime: this.$tools.getDateTime(new Date(e.value[0])),
				endTime: this.$tools.getDateTime(new Date(e.value[1]))
			};
		}
	}
};
</script>

<style lang="scss" scoped>
.dropdown {
	padding: 4rpx 18rpx 18rpx 18rpx;
	background: #fff;
	font-size: 12px;
}
.dropdown-menu {
	width: 50%;
	padding: 2rpx 0;
	border-bottom: 1rpx solid #ddd;
	border-radius: 8rpx;
}
.dropdown-menu:first-child {
	// border-right: 1rpx solid #ddd;
	border-top-right-radius: 0;
	border-bottom-right-radius: 0;
}
.dropdown-menu:last-child {
	border-top-left-radius: 0;
	border-bottom-left-radius: 0;
}
.dropdown-item__selected {
	padding: 10rpx;
}
.icon {
	margin-left: 10rpx;
}
.down {
	transition: transform 0.3s;
	transform: rotateZ(0);
}
.up {
	transition: transform 0.3s;
	transform: rotateZ(-180deg);
}
button {
	font-size: 28upx;
}
.dropdown-item {
	width: 100%;
	flex: 1;
	position: relative;
	&__selected {
		position: relative;
		display: flex;
		align-items: center;
		background: #fff;
		padding: 20rpx;
		box-sizing: border-box;
		justify-content: center;
		.selected__name {
			font-size: 28rpx;
		}
		.selected__icon {
			margin-left: 20rpx;
			&.down {
				transition: transform 0.3s;
				transform: rotateZ(0);
			}
			&.up {
				transition: transform 0.3s;
				transform: rotateZ(-180deg);
			}
		}
	}
}
@font-face {
	font-family: 'iconfont'; /* project id 1564327 */
	src: url('https://at.alicdn.com/t/font_1564327_fcszez4n5i.eot');
	src: url('https://at.alicdn.com/t/font_1564327_fcszez4n5i.eot?#iefix') format('embedded-opentype'), url('https://at.alicdn.com/t/font_1564327_fcszez4n5i.woff2') format('woff2'),
		url('https://at.alicdn.com/t/font_1564327_fcszez4n5i.woff') format('woff'), url('https://at.alicdn.com/t/font_1564327_fcszez4n5i.ttf') format('truetype'),
		url('https://at.alicdn.com/t/font_1564327_fcszez4n5i.svg#iconfont') format('svg');
}
.iconfont {
	font-family: 'iconfont' !important;
	font-size: 24rpx;
	font-style: normal;
	-webkit-font-smoothing: antialiased;
	-webkit-text-stroke-width: 0.2px;
	-moz-osx-font-smoothing: grayscale;
}
</style>
