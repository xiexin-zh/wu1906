<template>
	<view class="u-page u-bg-fff">
		<tree-drawer
			v-show="showTree"
			:show="showTree"
			:schoolInfo="schoolInfo"
			:disabled="type === '1'"
			@close="close"
			@confirm="selcet"
			:classChecked="classList"
			:teacherChecked="teacherList"
		></tree-drawer>
		<u-popup v-model="showPopTag" mode="center" border-radius="14" width="90%" height="80%">
			<choose-control :type="type" :bindList="controlList" :schoolCode="schoolInfo.schoolCode" @close="popclose" @confirm="popselcet"></choose-control>
		</u-popup>
		<u-select v-model="siteTag" :list="siteList" @confirm="confirm"></u-select>
		<scroll-view scroll-y="true" class="scroll-h">
			<view class="u-fx-ac u-bd-b item-list">
				<view class="tip">场地类型：</view>
				<view class="u-fx-f1 u-fx-je u-content-color" @click="changeSiteType([...arguments, 1])">{{ formData.type }}</view>
				<view class="rit-icon" v-if="type !== '1'"></view>
			</view>
			<view class="u-fx-ac u-bd-b item-list">
				<view class="tip">场地：</view>
				<view class="u-fx-f1 u-fx-je u-content-color" @click="changeSiteType([...arguments, 2])">{{ formData.building }}</view>
				<view class="rit-icon" v-if="type !== '1'"></view>
			</view>
			<view class="u-fx-ac u-bd-b item-list">
				<view class="tip">楼层：</view>
				<view class="u-fx-f1 u-fx-je u-content-color" @click="changeSiteType([...arguments, 3])">{{ formData.floor }}</view>
				<view class="rit-icon" v-if="type !== '1'"></view>
			</view>
			<view class="u-fx-ac u-bd-b item-list">
				<view class="tip">房间：</view>
				<view class="u-fx-f1 u-fx-je u-content-color" @click="changeSiteType([...arguments, 4])">{{ formData.room }}</view>
				<view class="rit-icon" v-if="type !== '1'"></view>
			</view>
			<view class="u-fx-ac u-bd-b item-list">
				<view class="tip">预订说明：</view>
				<view v-if="type !== '1'" class="u-fx-f1 mar-r20">
					<input :disabled="type === '1'" class="item-input" maxlength="20" v-model="remark" style="text-align: right;" placeholder="请输入" />
				</view>
				<view v-else class="u-fx-f1 u-fx-je">{{ remark }}</view>
			</view>
			<view v-show="formData.room !== '请选择' && type !== '1'" class="u-bd-b item-list">
				<view class="tip mar-b20">预订时间：</view>
				<view class="u-fx-jsa u-padd-t u-fx-ac" v-for="(item, index) in timeList" :key="index">
					<picker :disabled="type === '1'" mode="date" :value="item.date" :start="startDate" :end="endDate" @change="changeDate([...arguments, 1, index])">
						<view class="date u-fx-jc">
							<view class="uni-input">{{ item.date }}</view>
						</view>
					</picker>
					<picker :disabled="type === '1'" mode="time" :value="item.startTime" :start="startT" :end="endT" @change="changeDate([...arguments, 2, index])">
						<view class="date u-fx-jc">
							<view class="uni-input">{{ item.startTime }}</view>
						</view>
					</picker>
					<view class="">至</view>
					<picker :disabled="type === '1'" mode="time" :value="item.startTime" :start="startT" :end="endT" @change="changeDate([...arguments, 3, index])">
						<view class="date u-fx-jc">
							<view class="uni-input">{{ item.endTime }}</view>
						</view>
					</picker>
					<view class="action u-fx u-fx-ac">
						<view v-if="index === timeList.length - 1 && type === '0'" class="mar-lt10" @click="addTime(true, index)">
							<image class="u-icon-40" src="http://canpointtest.com/mobile-img/add.png"></image>
						</view>
						<view v-if="type === '0'" class="mar-lt10" @click="addTime(false, index)"><image class="u-icon-36" src="http://canpointtest.com/mobile-img/delete_2.png"></image></view>
					</view>
				</view>
				<view class="sign-list u-padd-t u-fx" v-for="(item, index) in signList" :key="index + 'a'">
					<view class="day u-fx-ac-jc">
						<view>{{ item.date | getMonthDate('day') }}</view>
						<view>{{ item.date | getMonthDate('month') }}月</view>
					</view>
					<view class="box" v-if="item.list.length > 0">
						<view class="list" v-for="(elem, index) in item.list" :key="index">
							<view>{{ elem.startTime }}-{{ elem.endTime }}</view>
							<view>{{ elem.createName }}</view>
							<view>{{ elem.description }}</view>
						</view>
					</view>
					<view class="box" v-else>
						<view class="list u-fx-ac-jc"><view class="">无预约记录</view></view>
					</view>
				</view>
			</view>
			<view v-show="type === '1'" class="u-fx-ac u-bd-b item-list">
				<view class="tip">预订时间：</view>
				<view class="u-fx-f1 u-fx-je" v-for="(item, index) in timeList" :key="index">{{ item.date }} {{ item.startTime }}至{{ item.endTime }}</view>
			</view>
			<view v-show="formData.room !== '请选择'" class="u-fx-ac u-bd-b item-list">
				<view>开启签到：</view>
				<view class="u-fx-f1 u-fx-je"><u-switch :disabled="type === '1'" v-model="formData.isSign"></u-switch></view>
			</view>
			<view v-if="formData.isSign" class="u-fx-ac u-bd-b item-list">
				<view class="tip">签到设备:</view>
				<view @click="showPopTag = true" class="u-fx-f1 u-fx-je u-content-color">{{ controlTitle }}</view>
				<view class="rit-icon"></view>
			</view>
			<view v-if="formData.isSign" class="u-fx-ac u-bd-b item-list">
				<view class="tip">签到对象:</view>
				<view @click="handleShowTree" class="u-fx-f1 u-fx-je u-content-color">{{ classTitle }}</view>
				<view class="rit-icon"></view>
			</view>
		</scroll-view>
		<view v-if="type !== '1'" class="submit-btn"><u-button type="primary" @click="submitForm">提交</u-button></view>
		<!-- <view v-else class="submit-btn"><u-button type="info" @click="goBack">关闭</u-button></view> -->
	</view>
</template>

<script>
import eventBus from '@u/eventBus';
import validateForm from '@u/validate';
import TreeDrawer from '@/components/tree-drawer/tree-drawer.vue';
import ChooseControl from '@/components/choose-control/choose-control.vue';
import { store, actions } from './store/index.js';
const yzForm = {
	room: '请选择房间',
	floor: '请选择楼层',
	building: '请选择场地',
	type: '请选择场地类型'
};
export default {
	components: {
		TreeDrawer,
		ChooseControl
	},
	data() {
		return {
			remark: '',
			canClick: true,
			siteTag: false,
			showTree: false,
			showPopTag: false,
			siteType: 1,
			formData: {
				site: '请选择',
				type: '请选择',
				typeCode: '',
				buildingCode: '',
				roomCode: '',
				floorCode: '',
				building: '请选择',
				floor: '请选择',
				room: '请选择',
				isSign: false,
				date: '请选择日期',
				placeName: '',
				placeId: ''
			},
			dateList: [],
			siteList: [],
			typeList: [
				{
					value: '100',
					label: '教室'
				},
				{
					value: '101',
					label: '宿舍'
				},
				{
					value: '102',
					label: '食堂'
				},
				{
					value: '103',
					label: '出入口'
				},
				{
					value: '104',
					label: '其它'
				}
			],
			timeList: [],
			signList: [],
			classList: [],
			controlList: [],
			teacherList: [],
			startT: '08:00',
			endT: '20:00',
			type: '', // 0新增 1查看 2编辑
			id: '',
			controlTitle: '请选择',
			classTitle: '请选择',
			classChecked: [],
			teacherChecked: [],
			schoolInfo: {
				schoolYearId: 0,
				schoolCode: ''
			}
		};
	},
	computed: {
		startDate() {
			return this.getDate('start');
		},
		endDate() {
			return this.getDate('end');
		}
	},
	watch: {
		formData: {
			handler(newValue, oldValue) {
				if (newValue.roomCode !== '') {
					this.signList = [];
					this.dateList.map(el => {
						this.showReserveList(el, value => {
							this.signList.push({
								date: el,
								list: value
							});
						});
					});
				}
			},
			deep: true
		},
		timeList: {
			handler(newValue, oldValue) {
				if (this.type !== '1') {
					this.dateList = [];
					newValue.map(el => {
						this.dateList.push(el.date);
					});
					this.dateList = [...new Set(this.dateList)];
				}
			},
			deep: true
		},
		dateList: {
			handler(newValue, oldValue) {
				if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
					this.signList = [];
					if (this.formData.placeId !== '') {
						newValue.map(el => {
							this.showReserveList(el, value => {
								this.signList.push({
									date: el,
									list: value
								});
							});
						});
					}
				}
			},
			deep: true
		}
	},
	created() {
		this.schoolInfo.schoolType = store.userInfo.schoolType;
		this.schoolInfo.schoolCode = store.userInfo.schoolCode;
		this.schoolInfo.schoolYearId = store.schoolYear ? store.schoolYear.schoolYearId : '';
		this.type = this.$tools.getQuery().get('type');
		this.id = this.$tools.getQuery().get('id');
		if (this.type !== '0') {
			this.showData();
		}
	},
	methods: {
		// 表单回填
		async showData() {
			const res = await actions.reserveDetail(this.id);
			console.log(res.data);
			this.formData.placeId = res.data.placeId;
			this.formData.placeName = res.data.placeName;
			this.formData.typeCode = res.data.placeType;
			this.formData.type = this.typeList.filter(ele => ele.value === res.data.placeType)[0].label;
			this.formData.building = res.data.placeName.split(',')[0];
			this.formData.floor = res.data.placeName.split(',')[1];
			this.formData.room = res.data.placeName.split(',')[2];
			this.formData.buildingCode = res.data.placeId.split(',')[0];
			this.formData.floorCode = res.data.placeId.split(',')[1];
			this.formData.roomCode = res.data.placeId.split(',')[2];
			this.timeList = [
				{
					date: this.$tools.getDateTime(res.data.reserveDate, 'date'),
					startTime: res.data.startTime,
					endTime: res.data.endTime
				}
			];
			this.remark = res.data.description;
			this.formData.isSign = res.data.openSign === '1';
			this.teacherList = res.data.teacherList;
			this.classList = res.data.classList;
			this.controlList = res.data.placeReserveDeviceList;
			this.controlTitle = `已选择${this.controlList.length}个设备`;
			this.classTitle = `已选择${this.classList.length}个班，${this.teacherList.length}个教职工`;
		},
		handleShowTree() {
			this.showTree = !this.showTree;
		},
		close() {
			this.showTree = false;
		},
		selcet(classInfo, teacherInfo) {
			console.log(teacherInfo);
			this.classList = classInfo;
			this.teacherList = teacherInfo;
			this.classTitle = `已选择${this.classList.length}个班，${this.teacherList.length}个教职工`;
			this.showTree = false;
		},
		popclose() {
			this.showPopTag = false;
		},
		popselcet(data) {
			this.controlList = data.map(el => {
				return {
					deviceName: el.deviceName,
					deviceSn: el.deviceSn
				};
			});
			this.controlTitle = `已选择${this.controlList.length}个设备`;
			this.showPopTag = false;
		},
		getDate(type) {
			const date = new Date();
			let year = date.getFullYear();
			let month = date.getMonth() + 1;
			let day = date.getDate();

			if (type === 'start') {
				year = year;
			} else if (type === 'end') {
				year = year + 2;
			}
			month = month > 9 ? month : '0' + month;
			day = day > 9 ? day : '0' + day;
			return `${year}-${month}-${day}`;
		},
		changeDate([e, type, index]) {
			if (type === 1) {
				this.timeList[index].date = e.target.value;
			} else {
				console.log(this.timeList[index].date);
				console.log(this.$tools.getDateTime(new Date(), 'date'));
				if (
					this.timeList[index].date === this.$tools.getDateTime(new Date(), 'date') &&
					new Date(this.timeList[index].date + ' ' + e.target.value).getTime() < new Date().getTime()
				) {
					e.target.value = this.$tools.getDateTime(new Date(), 'time');
				}
				if (type === 2) {
					this.timeList[index].startTime = e.target.value;
				} else if (type === 3) {
					this.timeList[index].endTime = e.target.value;
				}
			}
		},
		confirm(e) {
			if (!e) {
				return;
			}
			if (this.siteType === 1) {
				this.formData.type = e[0].label;
				this.formData.typeCode = e[0].value;
				this.formData.building = '请选择';
				this.formData.floor = '请选择';
				this.formData.room = '请选择';
				this.formData.buildingCode = '';
				this.formData.floorCode = '';
				this.formData.roomCode = '';
			} else if (this.siteType === 2) {
				this.formData.building = e[0].label;
				this.formData.buildingCode = e[0].value;
				this.formData.floor = '请选择';
				this.formData.room = '请选择';
				this.formData.floorCode = '';
				this.formData.roomCode = '';
			} else if (this.siteType === 3) {
				this.formData.floor = e[0].label;
				this.formData.floorCode = e[0].value;
				this.formData.room = '请选择';
				this.formData.roomCode = '';
			} else if (this.siteType === 4) {
				this.formData.room = e[0].label;
				this.formData.roomCode = e[0].value;
				this.formData.placeId = this.formData.buildingCode + ',' + this.formData.floorCode + ',' + this.formData.roomCode;
				this.formData.placeName = this.formData.building + ',' + this.formData.floor + ',' + this.formData.room;
				this.timeList = [{ date: this.$tools.getDateTime(new Date(), 'date'), startTime: '请选择时间', endTime: '请选择时间' }];
				console.log(this.formData.typeCode);
				console.log(this.formData.placeName);
				console.log(this.formData.placeId);
			}
		},
		async showReserveList(date, cb) {
			const req = {
				schoolCode: store.userInfo.schoolCode,
				placeId: this.formData.placeId,
				reserveDate: date,
				orderBy: 'reserve_date ASC, start_time ASC'
			};
			const res = await actions.getReserveList(req);
			cb(res.data.list);
		},
		changeSiteType([e, type]) {
			if (this.type !== '0') {
				return;
			}
			this.siteType = type;
			if (type === 1) {
				this.siteTag = true;
				this.siteList = this.typeList;
			} else if (type === 2) {
				this.siteList = [];
				if (this.formData.typeCode === '') {
					this.$tools.toast('请选择场地类型');
					return;
				}
				const req = {
					category: this.formData.typeCode,
					schoolCode: store.userInfo.schoolCode
				};
				actions.getSiteList(req).then(res => {
					if (res.data.length !== 0) {
						this.siteTag = true;
						res.data.forEach(ele => {
							this.siteList.push({
								label: ele.name,
								value: ele.id
							});
						});
					} else {
						this.$tools.toast('该类型场地列表为空');
					}
				});
			} else if (type === 3) {
				this.siteList = [];
				if (this.formData.buildingCode === '') {
					this.$tools.toast('请选择场地');
					return;
				}
				const req = {
					parentId: this.formData.buildingCode,
					schoolCode: store.userInfo.schoolCode
				};
				actions.getChildSite(req).then(res => {
					if (res.data.list.length !== 0) {
						this.siteTag = true;
						res.data.list.forEach(ele => {
							this.siteList.push({
								label: ele.name + '楼',
								value: ele.id
							});
						});
					} else {
						this.$tools.toast('该场地楼层列表为空');
					}
				});
			} else if (type === 4) {
				this.siteList = [];
				if (this.formData.floorCode === '') {
					this.$tools.toast('请选择楼层');
					return;
				}
				const req = {
					parentId: this.formData.floorCode,
					schoolCode: store.userInfo.schoolCode
				};
				actions.getChildSite(req).then(res => {
					if (res.data.list.length !== 0) {
						this.siteTag = true;
						res.data.list.forEach(ele => {
							this.siteList.push({
								label: ele.name,
								value: ele.id
							});
						});
					} else {
						this.$tools.toast('该楼层房间列表为空');
					}
				});
				console.log(this.formData.placeId);
			}
		},
		// 验证时间是否重叠
		yzTime(data) {
			const arr = [];
			let isOverLap = 1;
			data.forEach(ele => {
				if (ele.startTime === '请选择时间' || ele.endTime === '请选择时间') {
					isOverLap = 4;
					return false;
				}
				arr.push({
					startTime: new Date(`${ele.date} ${ele.startTime}`),
					endTime: new Date(`${ele.date} ${ele.endTime}`)
				});
			});
			const tempList = [];
			arr.forEach((item, index) => {
				// 转换为时间戳
				const startTimeStamp = item.startTime.getTime();
				const endTimeStamp = item.endTime.getTime();
				if (startTimeStamp >= endTimeStamp) {
					isOverLap = 3;
					return false;
				}
				// 将时段数据处理后存入数组
				tempList.push([
					{
						flag: index,
						value: startTimeStamp
					},
					{
						flag: index,
						value: endTimeStamp
					}
				]);
			});
			// 对数组进行扁平处理后 从小到大排序
			const timeFiledList = [].concat(...tempList);
			timeFiledList.sort((a, b) => a.value - b.value);
			console.log(timeFiledList);
			// 是否重叠标志
			for (let i = 0; i < timeFiledList.length; i += 2) {
				if (i > 0) {
					// 存在相同值时(排序中三个连续值) => 时间重叠
					if (timeFiledList[i].value === timeFiledList[i - 1].value || timeFiledList[i - 1].value === timeFiledList[i - 2].value) {
						isOverLap = 2;
						break;
					}
				}
				// 相邻两个标记不同，则为重叠
				if (timeFiledList[i].flag !== timeFiledList[i + 1].flag) {
					isOverLap = 2;
					break;
				}
			}
			return isOverLap;
		},
		submitForm() {
			if (!this.canClick) {
				return;
			}
			validateForm(yzForm, this.formData, async () => {
				if (this.remark === '') {
					this.$tools.toast('请输入预定说明');
					return
				}
				this.canClick = false;
				console.log(1, this.formData);
				console.log(1, this.timeList);
				let yzRes = await this.yzTime(this.timeList);
				if (yzRes === 4) {
					this.$tools.toast('请选择时间');
					this.canClick = true;
				} else if (yzRes === 3) {
					this.$tools.toast('开始时间不能大于结束时间');
					this.canClick = true;
				} else if (yzRes === 2) {
					this.$tools.toast('预订时间段重复，请重新选择');
					this.canClick = true;
				} else {
					const dateList = [];
					const checkTagList = [];
					this.timeList.forEach((ele, index) => {
						dateList.push({
							reserveDate: ele.date,
							startTime: ele.startTime,
							endTime: ele.endTime
						});
						actions
							.checkReserve({
								placeId: this.formData.placeId,
								startTime: ele.startTime,
								endTime: ele.endTime,
								reserveDate: ele.date,
								id: this.type === '2' ? this.id : undefined
							})
							.then(res => {
								console.log(res);
								checkTagList.push(res.message);
							});
					});
					this.classList = this.classList.map(el => {
						return {
							classCode: el.classCode,
							className: el.className,
							gradeName: el.gradeName,
							gradeCode: el.gradeCode,
							classId: el.id,
							schoolYearId: el.schoolYearId
						};
					});
					this.teacherList = this.teacherList.map(el => {
						return {
							workNo: el.mobile,
							userCode: el.userCode,
							userName: el.userName,
							orgCode: el.orgCode,
							orgName: el.orgName
						};
					});
					this.$tools.goNext(() => {
						console.log(checkTagList);
						if (checkTagList.length !== dateList.length) {
							this.canClick = true;
							return;
						}
						const req = {
							schoolCode: store.userInfo.schoolCode,
							createName: store.userInfo.userName,
							createCode: store.userInfo.userCode,
							placeId: this.formData.placeId,
							placeType: this.formData.typeCode,
							placeName: this.formData.placeName,
							description: this.remark,
							placeReserveDateDtoList: dateList,
							openSign: this.formData.isSign ? '1' : '2',
							type: '1'
						};
						if (this.formData.isSign) {
							if (this.controlList.length === 0 || (this.classList.length === 0 && this.teacherList.length === 0)) {
								this.$tools.toast('请完善签到信息');
								this.canClick = true;
								return;
							}
							req.classList = this.classList;
							req.teacherList = this.teacherList;
							req.placeReserveDeviceList = this.controlList;
						} else {
							req.placeReserveDeviceList = [];
							req.classList = [];
							req.teacherList = [];
						}
						if (this.type === '2') {
							req.id = this.id;
							req.placeReserveDateDtoList = undefined;
							req.reserveDate = dateList[0].reserveDate;
							req.startTime = dateList[0].startTime;
							req.endTime = dateList[0].endTime;
						}
						console.log(req);
						this.$tools.goNext(() => {
							this.canClick = true;
							actions.addReserve(req).then(res => {
								this.$tools.toast('发布成功', 'success');
								this.$tools.goNext(() => {
									eventBus.$emit('getList');
									this.$tools.goBack();
								});
							});
						});
					});
				}
			});
		},
		goBack() {
			eventBus.$emit('getList');
			this.$tools.goBack();
		},
		addTime(tag, index) {
			console.log(index);
			if (tag) {
				if (index > 1) {
					this.$tools.toast('最多添加三个时段');
					return;
				}
				this.timeList.push({ date: this.$tools.getDateTime(new Date(), 'date'), startTime: '请选择时间', endTime: '请选择时间' });
			} else {
				if (this.timeList.length === 1) {
					this.$tools.toast('已经是最后一项了');
					return;
				}
				this.timeList.splice(index, 1);
				console.log(this.timeList);
			}
		}
	}
};
</script>

<style lang="scss">
.u-bg-fff {
	background-color: $uni-bg-color;
}
.scroll-h {
	height: calc(100vh - 120rpx);
}
.item-list {
	padding: 25rpx 15rpx 25rpx 25rpx;
	.tip::before {
		position: absolute;
		z-index: 99;
		content: '*';
		top: 30rpx;
		color: red;
		font-weight: bold;
		left: 8rpx;
	}
}
.item-input {
	width: 100%;
	font-size: 26rpx;
	color: $u-content-color;
}
.radio-mar {
	padding-left: 35rpx;
}
.item-text-area {
	height: 120rpx;
	width: 100%;
	line-height: 40rpx;
	padding-top: 15rpx;
	color: $u-content-color;
	font-size: 24rpx;
}
.checkbox {
	padding: 30rpx 10px 10px 2px;
}
.submit-btn {
	height: 120rpx;
	padding: 20rpx;
}
.date {
	padding: 10rpx 20rpx;
	border: 1rpx solid $u-border-color;
	border-radius: 8rpx;
	margin: 10rpx 0;
}
.action {
	width: 100rpx;
}
.sign-list {
	margin: 20rpx 0 0 0;
	.day {
		border-radius: 8rpx;
		width: 100rpx;
		height: 100rpx;
		background-color: $u-type-primary;
		color: $uni-bg-color;
		font-size: 24rpx;
		view:first-child {
			font-size: 34rpx;
		}
	}
	.box {
		width: calc(100% - 120rpx);
		margin-left: 18rpx;
		.list {
			font-size: 24rpx;
			padding: 10rpx 20rpx;
			border: 1rpx solid $u-border-color;
			border-radius: 8rpx;
			margin: 0 10rpx 20rpx 10rpx;
			float: left;
			min-height: 110rpx;
			min-width: 176rpx;
		}
	}
}
.mar-lt10 {
	margin: 10rpx 0 0 10rpx;
}
.u-icon-40 {
	width: 40rpx;
	height: 40rpx;
}
.u-icon-36 {
	width: 36rpx;
	height: 36rpx;
}
</style>
