<template>
  <view class="detail u-page">
		<view class="detail-box u-fx-ac">
			<view class="u-fx-f1 u-fx-ac detail-info">
				<image :src="studentInfo.studentUrl" mode=""></image>
				<view class="u-fx-f1 u-fx-jsb"> 
					<view> {{ studentInfo.studentName }} {{ studentInfo.studentNo }} {{ isHighSchool ? studentInfo.schoolYearId + '级' : '' }} {{ studentInfo.gradeName }} {{ studentInfo.className }} </view>
				</view>
			</view>
		</view>
		<view class="item-list">
			<view class="tip u-mar-l">{{ studentInfo.appraiseItemName }}：</view>
			<scroll-view scroll-y="true" class="detail-content">
				<image class="detail-photo u-fx-jsb" v-for="(item,index) in studentInfo.urlList" :key="index" :src="item" mode=""></image>
				<view class="detail-word">{{ studentInfo.content }}</view>
			</scroll-view>
    </view>
	</view>
</template>

<script>
import { store, actions } from './store/index.js'
export default {
  data () {
    return {
			isHighSchool: false,
			studentInfo: {},
			detailId: ''
    }
  },
  mounted () {
		this.isHighSchool = store.userInfo.schoolType === '8' || store.userInfo.schoolType === '9'
    this.detailId = this.$tools.getQuery().get('id')
		this.recordGet()
  },
  methods: {
		async recordGet () {
			const res = await actions.getBehaviorDetail(this.detailId)
			this.studentInfo = res.data
		}
  }
}
</script>

<style lang="scss" scoped>
 
.u-page {
  background-color: #F4F7FC;
  color: $u-main-color;
}
.detail-word {
	clear: both;
	text-indent: 2em;
	color: $u-content-color;
}
.detail {
	.detail-box {
    text-align: center;
    height: 100rpx;
    background-color: #fff;
    margin: 20rpx;
    border-radius: 15rpx;
    padding: 0 20rpx;
    .detail-info {
      margin-top: 10rpx;
		}
		image {
      width: 80rpx;
      height: 80rpx;
      margin-right: 20rpx;
    }
	}
	.item-list {
		background-color: #fff;
		margin: 20rpx;
		padding: 20rpx;
		.tip::before {
			position: absolute;
			z-index: 99;
			content: "|";
			color: $u-type-primary;
			font-weight: bolder;
			left: 40rpx;
		}
		.detail-content {
			height: calc(100vh - 250rpx);
			margin-top: 20rpx;
			:nth-child(3n) {
				border-right: none;
			}
			.detail-photo {
				width: 28%;
				height: 20%;
				float: left;  
				margin-bottom: 30rpx;
				margin: 2% 2.5%;
				padding: 15rpx;
				border-radius: 15rpx;
			}
		}
  }
}
</style>