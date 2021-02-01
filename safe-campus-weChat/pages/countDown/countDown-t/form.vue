<template>
	<view class="add">
		<class-tree
			isCheck
			:isHighSchool="isHighSchool"
			v-show="classTag"
			:classTag="classTag"
			:schoolInfo="schoolInfo"
			@close="classClose"
			@confirm="classSelcet"
			:classChecked="classList"
		></class-tree>
		<dormcard-tree isCheck v-show="dormTag" :classTag="dormTag" :schoolInfo="schoolInfo" @close="dormClose" @confirm="dormSelcet" :classChecked="dormList"></dormcard-tree>
		<scroll-view scroll-y="true" class="scroll-h u-bg-fff">
			<view class="u-fx-ac u-bd-b item-list">
				<view class="tip">事件名称：</view>
				<view class="u-fx-f1"><input v-model="formData.name" class="item-input" /></view>
			</view>
			<view class="u-fx-ac u-bd-b item-list">
				<view class="tip">提示语：</view>
				<view class="u-fx-f1"><input v-model="formData.tips" class="item-input" /></view>
			</view>
			<view class="u-fx-ac u-bd-b item-list">
				<view class="tip">截至日期：</view>
				<view class="u-fx-f1 u-fx-je">
					<picker mode="date" :value="formData.startDate" :start="startDate" :end="endDate" @change="changeDate([...arguments])">
						<view class="date u-fx-jc">
							<view class="uni-input">{{ formData.startDate }}</view>
						</view>
					</picker>
					<view class="rit-icon"></view>
				</view>
			</view>
			<view class="u-fx-ac u-bd-b item-list">
				<view class="tip">选择班级:</view>
				<view @click="chooseClass" class="u-fx-f1 u-fx">
					<view class="copyer u-fx-f1 u-content-color u-tx-r">
						<text v-if="classList.length === 0">请选择</text>
						<text v-if="classList.length > 2">已选{{ classList.length }}个班级</text>
						<u-tag
							v-if="classList.length <= 2"
							v-for="(item, index) in classList"
							:key="index"
							:text="isHighSchool ? item.gradeName + item.subjectName + item.className : item.gradeName + item.className"
							mode="light"
							type="info"
							class="mar-l10"
						/>
					</view>
					<view class="rit-icon"></view>
				</view>
			</view>
			<view class="u-fx-ac u-bd-b item-list">
				<view class="tip">选择宿舍班牌:</view>
				<view @click="chooseDorm" class="u-fx-f1 u-fx">
					<view class="copyer u-fx-f1 u-content-color u-tx-r">
						<text v-if="dormList.length === 0">请选择</text>
						<text v-if="dormList.length > 2">已选{{ dormList.length }}个宿舍班牌</text>
						<u-tag v-if="dormList.length <= 2" v-for="(item, index) in dormList" :key="index" :text="item.buildingName" mode="light" type="info" class="mar-l10" />
					</view>
					<view class="rit-icon"></view>
				</view>
			</view>
		</scroll-view>
		<view class="footer-btn u-fx-ac"><u-button type="primary" class="u-fx-f1 u-mar-l u-mar-r u-type-primary-dark-bg" @click="submit">提交</u-button></view>
	</view>
</template>

<script>
import { actions, store } from './store/index';
import eventBus from '@u/eventBus';
import validateForm from '@u/validate';
import classTree from '@/components/class-tree/class-tree';
import dormcardTree from '@/components/dormcard-tree/dormcard-tree';
export default {
	components: { classTree, dormcardTree },
	data() {
		return {
			isHighSchool: false,
			schoolInfo: {
				schoolYearId: 0,
				schoolCode: ''
			},
			id: '',
			pageList: {
				page: 1,
				size: 15
			},
			classList: [],
			dormList: [],
			formData: {
				startDate: '请选择',
				name: '',
				tips: ''
			},
			classTag: false,
			dormTag: false
		};
	},
	created() {
		this.isHighSchool = store.userInfo.schoolType === '8' || store.userInfo.schoolType === '9';
		this.schoolInfo.schoolCode = store.userInfo.schoolCode;
		this.schoolInfo.schoolYearId = store.schoolYear ? store.schoolYear.schoolYearId : '';
	},
	watch: {},
	computed: {
		startDate() {
			return this.getDate('start');
		},
		endDate() {
			return this.getDate('end');
		}
	},
	async mounted() {
		this.id = this.$tools.getQuery().get('id');
		if (this.id) {
			this.detailGet(this.id);
		}
	},
	methods: {
		getDate(type) {
			const date = new Date();
			let year = date.getFullYear();
			let month = date.getMonth() + 1;
			let day = date.getDate() + 1;

			if (type === 'start') {
				year = year;
			} else if (type === 'end') {
				year = year + 2;
			}
			month = month > 9 ? month : '0' + month;
			day = day > 9 ? day : '0' + day;
			return `${year}-${month}-${day}`;
		},
		changeDate([e]) {
			this.formData.startDate = e.target.value;
		},
		classClose() {
			this.classTag = false;
		},
		dormClose() {
			this.dormTag = false;
		},
		chooseClass() {
			this.classTag = true;
		},
		chooseDorm() {
			this.dormTag = true;
		},
		classSelcet(value) {
			this.classTag = false;
			this.classList = value;
		},
		dormSelcet(value) {
			if(value.length === 0){
				this.$tools.toast('请选择宿管班牌')
				return
			}
			this.dormTag = false;
			this.dormList = value;
			console.log(this.dormList)
		},
		async detailGet(id) {
			const res = await actions.getcountDetail(id);
			this.formData.startDate = this.$tools.getPhoneTime(new Date(res.data.endTime), 'date');
			this.formData.tips = res.data.tips;
			this.formData.name = res.data.name;
			this.classList = res.data.outCountDownClassDtoList.filter(el => el.category === 1);
			this.dormList = res.data.outCountDownClassDtoList.filter(el => el.category === 2);
		},
		async submit() {
			if (this.formData.name === '') {
				this.$tools.toast('请输入事件名称');
				return false;
			} else if (this.formData.endTime === '') {
				this.$tools.toast('请输入截至日期');
				return false;
			} else if (this.classList.length === 0 && this.dormList.length === 0) {
				this.$tools.toast('请选择发布对象');
				return;
			}
			const classList = [];
			this.classList.forEach(ele => {
				classList.push({
					category: 1,
					classCode: ele.classCode
				});
			});
			this.dormList.forEach(ele => {
				classList.push({
					category: 2,
					deviceSn: ele.deviceSn
				});
			});
			const req = {
				schoolCode: store.userInfo.schoolCode,
				schoolYearId: store.schoolYear.schoolYearId,
				classList,
				createUsername: store.userInfo.userName,
				createUsercode: store.userInfo.userCode,
				endTime: this.formData.startDate
			};
			if (this.id) {
				await actions.updateCount({
					...this.formData,
					...req,
					id: this.id,
					schoolYearId: store.schoolYear.schoolYearId
				});
				this.$tools.toast('提交成功', 'success');
				this.$tools.goNext(() => {
					eventBus.$emit('getList');
					this.$tools.goBack();
				});
			} else {
				await actions.addCount({
					...this.formData,
					...req,
					schoolYearId: store.schoolYear.schoolYearId
				});
				this.$tools.toast('提交成功', 'success');
				this.$tools.goNext(() => {
					eventBus.$emit('getList');
					this.$tools.goBack();
				});
			}
		}
	}
};
</script>

<style lang="scss">
.add {
	position: relative;
	.scroll-h {
		height: calc(100vh - 100rpx);
	}
	.item-list {
		padding: 25rpx 15rpx 25rpx 25rpx;
		.tip::before {
			position: absolute;
			z-index: 99;
			content: '*';
			top: 30rpx;
			color: $u-type-error;
			font-weight: bold;
			left: 8rpx;
		}
		.item-input {
			width: 100%;
			font-size: 26rpx;
			color: $u-tips-color;
		}
		.radio {
			padding-left: 25rpx;
		}
		.upload {
			margin: 20rpx;
		}
	}
	.submit-box {
		height: 100rpx;
		.btn {
			height: 80rpx;
			line-height: 80rpx;
			text-align: center;
			letter-spacing: 8rpx;
			margin: 0 20rpx;
			background-color: $u-type-primary;
			color: $uni-bg-color;
			border-radius: $u-border-radius;
		}
	}
	.search {
		padding: 20rpx;
	}
	.scroll {
		height: 70vh;
		// padding-bottom: 10vh;
		.list {
			padding: 15rpx 25rpx;
			image {
				width: 60rpx;
				height: 60rpx;
			}
		}
		.u-checkbox-group {
			display: flex;
			flex-direction: column;
		}
	}
}
.copyer {
	.u-size-default {
		padding: 10rpx 5rpx;
	}
}
.mar-l10 {
	margin-left: 10rpx;
	margin-top: 10rpx;
}
.submit-btn {
	height: 80rpx;
	justify-content: center;
	.btn {
		letter-spacing: 8rpx;
		margin: 0 20rpx;
	}
}
</style>
