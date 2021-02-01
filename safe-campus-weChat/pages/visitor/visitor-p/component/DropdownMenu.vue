<template>
	<view class="dropDown u-fx">
		<ms-dropdown-menu><ms-dropdown-item v-model="value0" :list="casueList"></ms-dropdown-item></ms-dropdown-menu>
		<ms-dropdown-menu><ms-dropdown-item v-model="value1" :list="dateList"></ms-dropdown-item></ms-dropdown-menu>
		<ms-dropdown-menu v-if="hasStatus"><ms-dropdown-item v-model="value2" :list="statusList"></ms-dropdown-item></ms-dropdown-menu>
	</view>
</template>

<script>
import msDropdownMenu from '@/components/ms-dropdown/dropdown-menu.vue';
import msDropdownItem from '@/components/ms-dropdown/dropdown-item.vue';
import { store, actions } from '../store/index.js';
export default {
	components: {
		msDropdownMenu,
		msDropdownItem
	},
	props: {
		hasStatus: {
			type: Boolean,
			default: true //是否显示状态选择
		},
		statusList: {
			type: Array,
			default: () => {
				return []
			}
		}
	},
	data() {
		return {
			value0: '0',
			value1: '0',
			value2: '0',
			casueList: [
				{
					text: '全部事由',
					value: '0'
				}
			],
			dateList: [
				{
					text: '全部时间',
					value: '0'
				},
				{
					text: '一周内',
					value: '1'
				},
				{
					text: '一个月内',
					value: '2'
				},
				{
					text: '六个月内',
					value: '3'
				}
			]
		};
	},
	watch: {
		value0(val, oldval) {
			if (val !== oldval) {
				this.$emit('value0Change', this.value0);
			}
		},
		value1(val, oldval) {
			if (val !== oldval) {
				this.$emit('value1Change', this.value1);
			}
		},
		value2(val, oldval) {
			if (val !== oldval) {
				this.$emit('value2Change', this.value2);
			}
		}
	},
	async mounted() {
		const req = {
			schoolCode: store.userInfo.schoolCode,
			pageNum: 1,
			pageSize: 100
		};
		const res = await actions.getCauseList(req);
		if (res.data.list.length === 0) {
			return;
		}
		res.data.list.forEach(ele => {
			this.casueList.push({
				text: ele.causeName,
				value: ele.id
			});
		});
	},
	methods: {}
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
	border: 1rpx solid $u-border-color;
	border-radius: 8rpx;
}
.dropdown-menu:first-child {
	border-top-right-radius: 0;
	border-bottom-right-radius: 0;
	border-right: none;
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
</style>
