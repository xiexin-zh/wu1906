<template>
	<view>
		<view class="search-time u-fx u-fx-jsb">
			<view class="u-fx-f1"><slot></slot></view>
			<view @click="timeTag = true">{{ date }}</view>
			<view class="mar-l20"><u-icon name="arrow-right" size="24"></u-icon></view>
		</view>
		<u-picker v-model="timeTag" mode="time" :params="params" :end-year="maxDate" :start-year=minDate @confirm="getTime"></u-picker>
	</view>
</template>

<script>
export default {
	name: 'SearchTime',
	props: {
		type: {
			type: String,
			default: 'date'
		},
		value: {
			type: String,
			default: ''
		}
	},
	data() {
		return {
			timeTag: false,
			params: {
				year: true,
				month: true,
				day: true,
				hour: false,
				minute: false,
				second: false
			},
			minDate: new Date().getFullYear() - 10,
			maxDate: new Date().getFullYear(),
		};
	},
	computed: {
		date() {
			return this.value;
		}
	},
	methods: {
		getTime(time) {
			let date = '';
			date = time.year + "-" + time.month + "-" + time.day
			this.$emit('input', date);
			this.$emit('get-time');
		}
	},
	mounted() {
	}
};
</script>

<style lang="scss" scoped>
.search-time {
	font-size: 30rpx;
	padding: 15rpx 30rpx 20rpx 30rpx;
	color: #999;
}
</style>
