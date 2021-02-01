<template>
	<view class="" style="padding-top: 4px;">
		<no-data v-if="dataList.length === 0" msg="暂无记录"></no-data>
		<view class="toggle-list div-shadow" v-for="(list, index) in dataList" :key="index" @click="checkList(list, index)">
			<view class="toggle-title u-fx u-fx-ac" @click="toggle(list, index)">
				<view class="u-fx-f1 mar-r20"><slot name="title" :list="list"></slot></view>
				<view v-if="isIcon" :class="{ 'rot-icon': list.toggle }"><u-icon name="arrow-right" size="24"></u-icon></view>
			</view>
			<view v-if="list.toggle" class="toggle-info u-bd-t u-bg-fff"><slot name="list" :list="list"></slot></view>
		</view>
	</view>
</template>

<script>
import noData from '@/components/no-data/no-data.vue';
import mixins from '../../../utils/mixins.js';
export default {
	name: 'ToggleList',
	components: {
		noData
	},
	mixins: [mixins],
	props: {
		dataList: {
			type: Array,
			default: () => {
				return [];
			},
			required: true
		},
		isChoose: {
			type: Boolean,
			default: false
		},
		personNum: {
			type: Boolean,
			default: false
		},
		isToggle: {
			type: Boolean,
			default: true
		},
		isIcon: {
			type: Boolean,
			default: true
		}
	},
	methods: {
		toggle(list, index) {
			if (!this.isToggle) return;
			if (this.isChoose) return;
			if (this.personNum && !list.toggle) {
				this.$emit('get-num', list.userCode);
			}
			this.$emit('refresh');
			if (!this.dataList[index].toggle) {
				this.dataList.forEach(item => {
					item.toggle = false;
				});
			}
			this.dataList[index].toggle = !this.dataList[index].toggle;
		},
		checkList(list, index) {
			this.$emit('check-list', list);
		}
	}
};
</script>
<style lang="scss">
.toggle-list {
	margin: 20rpx 15rpx;
	&:first-child {
		margin-top: 0rpx;
	}
	.rot-icon {
		transform: rotate(90deg);
	}
	line-height: 90rpx;
	.toggle-title {
		padding: 0 20rpx;
		color: $u-main-color;
		i {
			color: $u-light-color;
		}
	}
	.toggle-info {
		max-height: 1000rpx;
		overflow: hidden;
		color: $u-content-color;
	}
	.toggle-enter,
	.toggle-leave-to {
		max-height: 0rpx;
	}
	.toggle-enter-to {
		max-height: 1000rpx;
	}
	.toggle-enter-active {
		transition: all 1s ease;
	}
	.toggle-leave-active {
		transition: all 0.5s ease;
	}
}
	.div-shadow {
	  box-shadow: 2rpx 2rpx 8rpx $u-light-color;
	  overflow: hidden;
	}
</style>
