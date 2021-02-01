<template>
	<view class="choose-control">
		<view class="list">
			<view class="th u-fx-jsa u-fx-ac u-fx-jc title_">
				<u-checkbox-group width="100%">
					<label class="u-fx">
						<u-checkbox @change="checkboxChange" v-model="allcheckedTag" name="全选">
						</u-checkbox>
					</label>
				</u-checkbox-group>
				<view class="u-checkbox__label">
					<text>设备名称</text>
					<text>绑定场地</text>
					<text>关联数据</text>
				</view>
			</view>
			<scroll-view scroll-y="true" class="scroll-h" @scrolltolower="loadMore">
				<no-data v-if="dataList.length === 0" msg="没有可用的班牌设备"></no-data>
				<u-checkbox-group v-else class="u-fx-ver" width="100%">
					<label class="tbody u-bd-b u-fx-jsa" v-for="(item, index) in dataList" :key="index">
						<u-checkbox :disabled="type === '1'" @change="checkBox" v-model="item.checked" class="u-fx-jsb" :name="`${item.deviceName}^${item.deviceSn}`">
							<text>{{ item.deviceName }}</text>
							<text class=" u-fx-ac-jc">{{ item.placeName }}</text>
							<text class=" u-fx-ac-jc">{{ item.gradeName }}{{ item.professionName || '' }}{{ item.className }}</text>
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
import noData from '@/components/no-data/no-data.vue';
import hostEnv from '../../config/index.js';
export default {
	components: {
		noData
	},
	props: {
		type: {
			type: String,
			default: ''
		},
		schoolCode: {
			type: String,
			default: ''
		},
		classInfo: {
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
			allcheckedTag: false,
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
		checkboxChange(e) {
			if(e.value){
				this.dataList = this.dataList.map(ele => {
					return {
						...ele,
						checked: true
					}
				})
				this.checkList = this.dataList.map(ele => {
					return {
						...ele,
						checked: true
					}
				})
			} else {
				this.dataList = this.dataList.map(ele => {
					return {
						...ele,
						checked: false
					}
				})
				this.checkList = []
			}
		},
		async showList(tag = false) {
			if (tag) {
				this.pageList.page += 1;
			} else {
				this.pageList.page = 1;
			}
			const req = {
				...this.pageList,
				...this.classInfo,
				bindStatus: '1',
				schoolCode: this.schoolCode
			};
			const res = await $ajax.post({
				url: `${hostEnv.protal_api_11009}/classcard/bind/list`,
				params: req
			});
			res.data.list.forEach(ele => {
				ele.disabled = this.type === '1';
				this.bindList.forEach(item => {
					if (ele.deviceSn === item.deviceSn) {
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
			this.allcheckedTag = this.dataList.every(ele => { return ele.checked })
			if (e.value) {
				const index = this.dataList.findIndex(list => list.deviceSn === e.name.split('^')[1])
				this.checkList.push({
					... this.dataList[index]
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
.choose-control {
	position: relative;
	height: 100%;
}
.scroll-h {
	height: calc(100vh - 480rpx);
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
