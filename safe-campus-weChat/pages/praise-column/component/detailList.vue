<template>
	<view>
		<noData msg="暂无数据~" v-if="dataList.length === 0"></noData>
		<view class="u-auto  u-bg-fff">
			<view class="detail u-border-radius u-padd-40">
				<u-row gutter="16">
					<u-col span="4" v-for="(item, i) in dataList" :key="i" class="u-padd-l0">
						<view class="count u-type-primary-dark-bg u-type-white u-border-radius-all">{{ item.count }}</view>
						<u-lazy-load class="img u-border-radius-all" :image="item.photoUrl"></u-lazy-load>
						<view class="title u-main-color u-bold u-padd-l0 u-mar-t20 u-mar-b20">{{ item.label }}</view>
					</u-col>
				</u-row>
			</view>
		</view>
	</view>
</template>
<script>
import noData from '@/components/no-data/no-data.vue';
import index from '../../../config';
export default {
	components: {
		noData
	},
	props: {
		dataList: {
			type: Array,
			default: () => {
				return [];
			}
		}
	},
	data() {
		return {};
	},
	methods: {}
};
</script>

<style lang="scss" scoped>
.detail {
	margin-left: 40rpx;
	.u-padd-l0 {
		padding-left: 10rpx;
	}
	.count {
		position: fixed;
		width: 40rpx;
		height: 40rpx;
		text-align: center;
		margin-left: 110rpx;
		z-index: 9;
	}
}
.img {
	width: 140rpx;
	height: 140rpx;
}
</style>
