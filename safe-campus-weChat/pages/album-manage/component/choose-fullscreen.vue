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
			<scroll-view scroll-y="true" class="scroll-h">
				<no-data v-if="dataList.length === 0" msg="没有可用的班牌设备"></no-data>
				<u-checkbox-group v-else class="u-fx-ver" width="100%">
					<label class="tbody u-bd-b u-fx-jsa" v-for="(item, index) in dataList" :key="index">
						<u-checkbox :disabled="type === '1'" @change="checkBox" v-model="item.checked" class="u-fx-jsb" :name="`${item.deviceName}^${item.deviceSn}`">
							<text>{{ item.deviceName }}</text>
							<text class=" u-fx-ac-jc">{{ item.category === 1 ? item.placeName : item.buildingName }}</text>
							<text v-if="item.category === 1" class=" u-fx-ac-jc">{{ item.gradeName }}{{ item.professionName || '' }}{{ item.className }}</text>
							<text v-else class=" u-fx-ac-jc">{{ item.buildingName }}</text>
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
import { store, actions } from '../store/index.js';
import noData from '@/components/no-data/no-data.vue';
export default {
	components: {
		noData
	},
	props: {
		type: {
			type: String,
			default: ''
		},
		albumCode: {
			type: String,
			default: ''
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
		async showList() {
			const req = {
				mediaCode: this.albumCode
			};
			const res = await actions.getDeviceData(req)
			res.data.list.forEach(ele => {
				ele.disabled = this.type === '1';
				this.bindList.forEach(item => {
					if (ele.deviceSn === item.deviceSn) {
						ele.checked = true;
					}
				});
			});
			this.dataList = res.data.list;
			this.allcheckedTag = this.dataList.every(ele => { return ele.checked })
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
