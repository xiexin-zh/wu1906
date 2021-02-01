<template>
	<view class="check-total u-page u-fx-ver">
		<view class="banner-img"></view>
		<view class="mar-t20 u-fx u-fx-ver u-fx-f1">
			<view class="mar-b20 u-mar-l u-mar-r"><u-subsection mode="subsection" v-if="showTag" :list="typeList" :current="current" @change="changeMenu" active-color="#0084ff"></u-subsection></view>
			<search-time v-model="dormDate" @get-time="getTime">
				<view>合计：{{ totalNum }}人</view>
			</search-time>
			<view class="u-fx-f1">
				<view class="box u-fx">
					<scroll-view scroll-y="true" class="scroll-h">
						<toggle-list person-num :data-list="totalList" @get-num="getNum">
							<template v-slot:title="props">
								<view class="u-fx-jsb">
									<text>{{ props.list.userName }}</text>
									<text v-if="deptType == 1">{{ props.list.gender | setSex }}</text>
									<text v-if="deptType == 2">{{ props.list.roomName }}</text>
								</view>
							</template>
							<template v-slot:list="props">
								<view class="detail u-fx-ver">
									<text>性别：{{ props.list.gender | setSex }}</text>
									<text>班级：{{ props.list.className }}</text>
									<text>楼栋：{{ props.list.buildingName }}</text>
									<text>宿舍：{{ props.list.roomName }}</text>
								</view>
								<view class="detail u-type-primary"><text>本月签到异常次数</text></view>
								<view class="detail u-fx-ver">
									<text>午查寝：{{ personNum.NoonNum }}次</text>
									<text>晚查寝：{{ personNum.NightNum }}次</text>
								</view>
							</template>
						</toggle-list>
					</scroll-view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import SearchTime from '../component/SearchTime';
import ToggleList from '../component/ToggleList';
import { store, actions } from '../store/index.js';
export default {
	name: 'CheckTotal',
	components: {
		SearchTime,
		ToggleList
	},
	data() {
		return {
			totalNum: 0,
			currentCode: '',
			current: 0,
			showTag: false,
			typeList: [],
			totalList: [],
			dormDate: '',
			personNum: {
				NoonNum: '--',
				NightNum: '--'
			},
			deptType: '',
			deptCode: ''
		};
	},
	async created() {
		this.$tools.isBZR(store.userInfo).then(res => {
			if (res) {
				this.deptType = '1';
				this.deptCode = res[0].classCode;
			} else {
				this.$tools.isDormMamage(store.userInfo).then(res => {
					if (res) {
						this.deptType = '2';
						this.deptCode = res.buildingCode;
					}
				});
			}
		});
		this.dormDate = this.$tools.getDateTime(new Date().getTime() - 3600 * 24 * 1000).substring(0, 10);
		actions.checkTotalType({ schoolCode: store.userInfo.schoolCode }).then(res => {
			let list = res.data;
			if (list.length === 0) return;
			this.typeList = list.map(item => {
				return {
					key: item.taskType,
					name: item.taskName
				};
			});
			this.showTag = true;
			this.currentCode = list[0].taskType;
			this.$tools.goNext(() => {
				this.showStudent(this.currentCode);
			});
		});
	},
	async mounted() {},
	methods: {
		getNum(code) {
			actions
				.getPersonNum({
					schoolCode: store.userInfo.schoolCode,
					userCode: code,
					wdate: this.dormDate.replace(/-/g, '/')
				})
				.then(res => {
					if(res.data){
						this.personNum = res.data;
					}
				});
		},
		showStudent(code) {
			if(!this.deptCode){
				return
			}
			actions
				.checkTotalList({
					taskType: code,
					deptCode: this.deptCode,
					wdate: this.dormDate,
					schoolCode: store.userInfo.schoolCode
				})
				.then(res => {
					this.totalNum = res.data.length;
					this.totalList = res.data.map(item => {
						return {
							...item,
							toggle: false
						};
					});
				});
		},
		getTime() {
			this.showStudent(this.currentCode);
		},
		changeMenu(item) {
			console.log(item)
			this.current = item;
			this.currentCode = this.typeList[item].key;
			this.showStudent(this.currentCode);
		}
	}
};
</script>

<style lang="scss" scoped>
.check-total {
	.banner-img {
		width: 100%;
		height: 240rpx;
		background: url('http://canpointtest.com/mobile-img/kqtj.png') no-repeat;
		background-size: 100% 240rpx;
	}
}
.scroll-h {
	height: calc(100vh - 420rpx);
}
.detail {
	text {
		padding-left: 20rpx;
		line-height: 60rpx;
	}
}
.box {
	z-index: 99;
	position: absolute;
	width: 100%;
	height: 100%;
}
</style>
