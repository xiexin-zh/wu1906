<template>
	<view class="choose-students">
		<view class="list">
			<view class="th u-fx-jsa u-fx-ac u-fx-jc title_">
				<text class="left"></text>
				<view class="u-checkbox__label">
					<text></text>
					<text>姓名</text>
					<text>学号</text>
				</view>
			</view>
			<scroll-view scroll-y="true" class="scroll-h" @scrolltolower="loadMore">
				<u-checkbox-group class="u-fx-ver" width="100%">
					<label class="tbody u-bd-b u-fx-jsa" v-for="(item, index) in dataList" :key="index">
						<u-checkbox :disabled="type === '1'" @change="checkBox" v-model="item.checked" class="u-fx-jsb" :name="`${item.userName}^${item.userCode}^${item.workNo}^${item.photoUrl}`">
							<image class="u-border-radius u-mar-l30" :src="item.photoUrl || '/mobile-img/Default_touxiang@2x.png'"></image>
							<text class="u-fx-ac-jc">{{ item.userName }}</text>
							<text class="u-fx-ac-jc u-te">{{ item.workNo }}</text>
						</u-checkbox>
					</label>
				</u-checkbox-group>
			</scroll-view>
			<view class="submit-box u-fx">
				<view class="btn1" @click="cancel()">取消</view>
				<view class="btn2" @click="addInfo()">确定</view>
			</view>
		</view>
	</view>
</template>

<script>
import $ajax from '@u/request.js';
import hostEnv from '../../../config/index.js';
export default {
	components: {},
	props: {
		type: {
			type: String,
			default: ''
		},
		schoolInfo: {
			type: Object,
			default: () => {
				return {};
			}
		},
		bindList: {
			type: Array,
			default: () => {
				return [];
			}
		}
	},
	data() {
		return {
			dataList: [],
			pageList: {
				page: 1,
				size: 20
			},
			morePage: false,
			checkList: []
		};
	},
	async mounted() {
		this.bindList.map(el => {
			this.checkList.push(el);
		});
		this.showList();
	},
	methods: {
		async showList(tag = false) {
			if (tag) {
				this.pageList.page += 1;
			} else {
				this.pageList.page = 1;
			}
			const req = {
				...this.pageList,
				...this.schoolInfo
			};
			const res = await $ajax.post({
				url: `${hostEnv.protal_api_11002}/userinfo/student/user/queryStudentInfoList`,
				params: req
			});
			res.data.list.forEach(ele => {
				ele.disabled = this.type === '1';
				this.bindList.forEach(item => {
					if (ele.userCode === item.userCode) {
						ele.checked = true;
					}
				});
			});
			if (tag) {
				this.dataList = this.dataList.concat(res.data.list);
			} else {
				this.dataList = res.data.list;
			}
			this.morePage = res.data.hasNextPage;
		},
		loadMore() {
			if (!this.morePage) {
				this.$tools.toast('数据已加载完毕');
				return;
			}
			this.showList(true);
		},
		cancel() {
			this.userInfoList = [];
			this.checkList = [];
			this.$emit('close', true);
		},
		checkBox(e) {
			if (e.value) {
				this.checkList.push({
					userName: e.name.split('^')[0],
					userCode: e.name.split('^')[1],
					workNo: e.name.split('^')[2],
					photoUrl: e.name.split('^')[3]
				});
			} else {
				this.checkList.splice(this.checkList.indexOf(e.name), 1);
			}
		},
		addInfo() {
			this.$emit('confirm', this.checkList);
		}
	}
};
</script>

<style lang="scss">
.choose-students {
	position: relative;
	height: 100%;
}
.scroll-h {
	height: calc(100vh - 530rpx);
}
.head {
	height: 100rpx;
}
.submit-box {
	height: 100rpx;
	width: calc(100% - 20rpx);
	position: absolute;
	bottom: 0;
	.btn1 {
		width: 50%;
		line-height: 100rpx;
		text-align: center;
		letter-spacing: 8rpx;
		background-color: #fff;
		color: #000;
		border-radius: $u-border-radius;
	}
	.btn2 {
		width: 50%;
		line-height: 100rpx;
		text-align: center;
		letter-spacing: 8rpx;
		background-color: $u-type-primary;
		color: #fff;
		border-radius: $u-border-radius;
	}
}
.title_ {
	height: 80rpx;
}
.list {
	padding: 25rpx 20rpx;
	font-size: 28rpx;
	.th {
		background: #7b92f5;
		padding: 20rpx;
		border-radius: 8rpx;
		color: #fff;
	}
	.tbody {
		position: relative;
		padding: 25rpx 20rpx;
		background: $uni-bg-color;
	}
	.tbody:nth-child(even) {
		background: $u-bg-color;
	}
	.left {
		width: 10%;
		text-align: center;
	}
}
image {
	width: 100rpx;
	height: 100rpx;
}
.u-checkbox-group,
.u-checkbox {
	width: 100%;
}
/deep/ .u-checkbox__label {
	width: 90%;
	margin: 0;
	display: flex;
	justify-content: space-between;
	text {
		text-align: center;
		vertical-align: middle;
	}
	text:nth-child(1) {
		width: 30%;
	}
	text:nth-child(2) {
		width: 30%;
	}
	text:nth-child(3) {
		width: 40%;
	}
}
/deep/ .u-checkbox__icon-wrap {
	width: 10%;
}
/deep/ .u-checkbox__icon {
	margin: 0 auto;
}
</style>
