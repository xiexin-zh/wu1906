<template>
	<view>
		<noData msg="暂无数据~" v-if="dataList.length === 0"></noData>
		<view class="u-auto">
			<view @click="goDetail(item.userCode)" class="u-padd-20  u-mar-l20 u-mar-r20 u-bg-fff u-border-radius" v-for="(item, i) in dataList" :key="i">
				<view class="u-fx-jsb u-fx-ac">
					<view class="u-fx u-fx-ac">
						<image :src="item.photoUrl || '/mobile-img/Default_touxiang@2x.png'" class="img u-border-radius-all u-mar-r20"></image>
						<view class="title u-main-color u-bold">{{ item.userName }}</view>
					</view>
					<view class="tag"><view class="rit-icon"></view></view>
				</view>
				<view class="u-bd-x u-mar-t20 u-mar-b20"></view>
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
	methods: {
		goDetail(id) {
			this.$emit('goDetail', id);
		}
	}
};
</script>

<style lang="scss" scoped>
.img {
	width: 82rpx;
	height: 84rpx;
}
.u-bd-x {
	border-top: 1px solid #f2f2f2;
}
</style>
