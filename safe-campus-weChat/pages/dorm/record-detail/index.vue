<template>
  <view>
		<view>
			<view class="box-img u-type-primary-light-bg">
				<image class="userPhoto" :src="detail.snapSrc"></image>
			</view>
			<view :class="['status', {'bg-color1' : detail.checkStatus == '1', 'bg-color2' : detail.checkStatus == '2','bg-color3' : detail.checkStatus == '3','bg-color4' : detail.checkStatus == '4'}]">{{ getStatus(detail.checkStatus)}}</view>
			<view class="info">
				<view>
					学生：{{ detail.userName}}
				</view>
				<view>
					宿舍：{{ detail.buildingName}}
				</view>
				<view>
					出入时间：{{ $tools.getDateTime(detail.recordTime)}}
				</view>
				<view>
					出入类型：{{ detail.inOrOut === '1' ? '进' : '出'}}
				</view>
				<view>
					出入地点：{{ detail.snapSite}}
				</view>
			</view>
		</view>
  </view>
</template>

<script>
import $tools from '@u/tools'
import { actions } from '../store/index.js'
export default {
  name: 'RecordDetail',
  data () {
    return {
			detail: {}
    }
  },
	methods:{
		getStatus (type) {
			let msg
			switch (parseInt(type)) {
				case 1 : msg = '归寝'
				break;
				case 2 : msg = '外出'
				break
				case 3 : msg = '晚归'
				break;
				case 4 : msg = '深夜外出'
				break;
				default: msg = '未知'
				break
			}
			return msg
		}
	},
	async mounted () {
		const id = this.$tools.getQuery().get('id') || ''
		const res = await actions.getRecordDetail({
			id
		})
		this.detail = res.data || {}
	}
}
</script>

<style lang="scss">
	.box-img {
		padding: 20rpx 0;
	}
	.userPhoto {
		margin: 20rpx auto;
		width: 400rpx;
		height: 500rpx;
		display: block;
		border: 4px $u-border-color solid;
		box-shadow: 0 0 4px #ccc;
	}
	.status {
		width: 128rpx;
		padding: 10rpx 0px;
		border-radius: 4rpx;
		margin: 10rpx auto;
		text-align: center;
		color:#fff;
		background-color: #ccc;
	}
	.bg-color1 {
		background-color: $u-type-success;
	}
	.bg-color2 {
		background-color: $u-type-primary;
	}
	.bg-color3 {
		background-color: $u-type-warning;
	}
	.bg-color4 {
		background-color: $u-type-error;
	}
	.info {
		font-size: 30rpx;
		padding-left: 150rpx;
		line-height: 50rpx;
		color: $u-content-color;
	}
</style>
