<template>
	<view class="container">
		<!-- v-if="detail === ''" -->
		<no-data v-if="detail === ''||detail === []||detail === null" msg="暂无数据"></no-data>
		<view class="set_box">
			<view class="set_time">
				<view>{{ detail.createTime | gmtToDate("dateTime") }}</view>
			</view>
			<!-- <view class="set-1">
				<view class="set-2">
					<view class="right u-fx-ver">
						<text class="detail">申请人： {{ detail.approverName }} </text>
					</view>
				</view>
			</view> -->
		</view>
		<view class="set_box">
			<view class="set_time">
				<view></view>
			</view>
			<view class="set-1">
				<view class="set-2">
					<view class="right u-fx-ver">
						<view class="u-fx">
							<view> 审批人：</view>
							<view>
								<view class="u-fx" v-for="(item, index) in detail" :key="index">
									<view class="set-width"> {{ item.approverName }} </view>
									<view class="set-width"> {{ item.approvalTime }} </view>
									<text class="set-state" v-if="item.optStatus !== '3'">{{ item.optStatus | getRovalState }}
									</text>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- v-if="detail.outApproverDtoList.length&&detail.repairCopyList.length !== 0" -->
		<view class="set_box" >
			<view class="set_time">
				<view></view>
			</view>
			<view class="set-1">
				<view class="set-2">
					<view class="right u-fx-ver">
						<view class="u-fx">
							<view> 抄送人：</view>
							<view>
								<view class="" v-for="(item, index) in detail.repairCopyList" :key="index">
									{{ item.copyUserName }}
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="set_box" v-for="(item, index) in detail.pointRepairApprovalList" :key="index">
			<view class="set_time">
				<view>{{ item.createTime | gmtToDate("dateTime") }}</view>
			</view>
			<view class="set-1">
				<view class="set-2">
					<view class="right u-fx-ver">
						<text class="detail">处理人： {{ item.previousUserName }}
							<text class="set-state">
								已指定
							</text>
						</text>
					</view>
					<view class="detail u-padd-60">
						指定人：{{ item.approvalUserName
            }}<text class="set-state">
							代审批
						</text></view>
				</view>
			</view>
		</view>
		<view class="set_box" v-for="(item, index) in detail.repairStateRecordList" :key="index">
			<view class="set_time">
				<view>{{ item.createTime | gmtToDate("dateTime") }}</view>
			</view>
			<view class="set-1">
				<view class="set-2">
					<view class="right u-fx-ver">
						<text class="detail">处理人： {{ item.handleUserName }}
							<text class="set-state">{{ item.repairState | repairState }}
							</text>
						</text>
						<view v-if="item.remark !== ''">退回理由：{{ item.remark }}</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>
<script>
	import {
		store,
		actions
	} from "../store/index.js";
	export default {
		props: {
			detail: {
				// type: obej,
				default: () => {
					return [];
				},
			},
		},
		data() {
			return {};
		},
		created(){
			
		},
		watch: {
			detail(){
			}
		},
		mounted() {},
		methods: {},
	};
</script>

<style lang="scss" scoped>
	.set-state {
		color: $u-type-success;
	}

	.set-width {
		width: 50px;
	}

	.set_box {
		width: 100%;
		display: flex;
		flex-direction: row;
	}

	/* 左侧时间 */
	.set_time {
		width: 56%;
		position: relative;
		margin-top: 30rpx;

		view {
			width: 100%;
			position: absolute;
			margin: 30rpx 0 0 20rpx;
			color: $uni-text-color-grey;
		}
	}

	/* 右侧内容 */
	.set-1 {
		width: 80%;
		margin-top: 60upx;
	}

	.set-2 {
		margin-left: 80rpx;
		position: relative;

		.right {
			.detail {
				font-size: 28rpx;
				margin-bottom: 10rpx;
			}
		}
	}

	.set-2::after {
		content: "";
		/* 必须存在如果没有图标就留空 */
		top: 0rpx;
		/* 定位 距离*/
		border-left: #c6c6c6 1px solid;
		/* 横线颜色 */
		left: -44rpx;
		/* 定位 距离*/
		height: 120%;
		/* 高度 */
		position: absolute;
		/* 定位 */
	}

	.set-2::before {
		content: "\e64d";
		/* 必须存在如果没有图标就留空 */
		color: $u-type-primary;
		/* 设置颜色 */
		position: absolute;
		/* 定位 */
		left: -60upx;
		top: -30upx;
		/* 移动到左边 */
		font-weight: bold;
		/* 图标样式在复制的图标文件中复制相对应的图标样式必须存在 */
		font-family: "iconfont" !important;
		/* 图标样式在复制的图标文件中复制相对应的图标样式必须存在 */
		font-size: 34upx;
		/* 图标大小 */
		font-style: normal;
		/* 图标样式在复制的图标文件中复制相对应的图标样式必须存在 */
		-webkit-font-smoothing: antialiased;
		/* 图标样式在复制的图标文件中复制相对应的图标样式必须存在 */
		-moz-osx-font-smoothing: grayscale;
		/* 图标样式在复制的图标文件中复制相对应的图标样式必须存在 */
		z-index: 1;
	}

	@font-face {
		font-family: "iconfont";
		src: url("//at.alicdn.com/t/font_1337773_f06f5a7las.eot?t=1565581133395");
		/* IE9 */
		src: url("//at.alicdn.com/t/font_1337773_f06f5a7las.eot?t=1565581133395#iefix") format("embedded-opentype"),
			/* IE6-IE8 */
			url("data:application/x-font-woff2;charset=utf-8;base64,d09GMgABAAAAAAOIAAsAAAAAB8QAAAM7AAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHEIGVgCDMgqCRIIjATYCJAMUCwwABCAFhG0HZhvNBsiemjwJqJERRCC3tX4YOM4iqNbCnr29uw8wKGBUsUAKqDyCjY5HcEzCALron1wr8wDk8hKBFpIc5yaXfWZJoIBIQkF1KlvVqWuFfZ3c/CBw0p8fcMJJsQY6uIuEMk8188LgXgfHTJceiXlrm0tGajTgaMCz2T6yyf5BXh+Ef9BdxMSIS9cTaKmvYGbzFhRXA1sZ2C0QO7cRAdhadnmkNTSEqufYLM4qNdKx9AJn+M/Hb2OiQVIWwL6rNufIIP1bj29voaZspAiK/byITqLAaEAmdvX6d7KQ+dEstCw2tjQL0FJDkvZald8e//3y+WglCIaW0E/e5R8vERWvuTWY5RYy3/ywXBtKXBEF395EBN++FCQ8V5CWsmEt4CBgHMz1Ad8rde7s2LbD7oUhT3l+eWHbhxwOB+LFrfkVL7I3FIAWdpdWvfHiYt8FltYWdzy1Pz/WfPhQ/elT7efPvUJiVlRsIj8+18X3az7+5Wb48vVrbnvo7OndVe1cPc55k2ebWG7OmMgYX01bT3vJnNlJWtemes0mn3vI/PJl80NQQqVErfcH/Ys5Fy3evrVoyyZNDLSq/cp5EyYsKTbb69bD/+5fmPs/cFwxG9ABoCNdTY+AKrwdi2npHk0Xu4vMH/Q7Wl+4+Yftkv83kMHXTiVutOlsnh68ZYPZit+hmDmRSxVwlDnvxvI8WOq3gz4VCy3xE8Id/d7H2GV2M6Ghi4ak1gcKDYORGTsaSq2Mg0rDTGhplLyTW+mEsRC5BUYadyC0dwpJWw+h0N53ZMb+glJX/6DSPgpoaUN4nLOVobGtZdYuJHAkQ7EbqiVqwMjF7UVrJSKKTmCmitNrETOpUzAiNLxZykMGxPY4wNRBIjnHEDOqh7nOzZBOR6GRUQ2SeKiKc2NiWBju+6JQieqBvbkYRMAhMkjUDVKTUAaYzufsW99fCSEUOgI20rMQr4UwJurloQihwmcg8/SGWT3v8hKTDkQkjsMgjKH0oFzHi+hgnoKM/VtpIBIulGpF1ihRmDcLz9WHnm/Uv0BZNAD40zJSFJGjjEq77dsEg1ahKoF2qbupYvP0KNS2e69WbmucSNZAOpEa5XpUagAAAA==") format("woff2"),
			url("//at.alicdn.com/t/font_1337773_f06f5a7las.woff?t=1565581133395") format("woff"),
			url("//at.alicdn.com/t/font_1337773_f06f5a7las.ttf?t=1565581133395") format("truetype"),
			/* chrome, firefox, opera, Safari, Android, iOS 4.2+ */
			url("//at.alicdn.com/t/font_1337773_f06f5a7las.svg?t=1565581133395#iconfont") format("svg");
		/* iOS 4.1- */
	}

	.iconfont {
		font-family: "iconfont" !important;
		font-size: 16px;
		font-style: normal;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}

	.icon-yuandian:before {
		content: "\e64d";
	}

	.icon-dingweiweizhi:before {
		content: "\e619";
	}
</style>
