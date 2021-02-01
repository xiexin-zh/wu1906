<template>
	<scroll-view scroll-y="true" class="scroll-h u-bg-fff">
		<view v-if="isSchool" class="u-fx-ac u-bd-b item-list">
			<view>学校：</view>
			<picker class="u-fx-f1 u-tx-r col-666" mode="selector" :value="schoolName" :range="schoolList" @change="chooseSchool">
				<span class="u-content-color">{{ schoolName }}</span>
			</picker>
			<view class="rit-icon"></view>
		</view>
		<view class="u-fx-ac u-bd-b item-list" v-if="false">
			<view>年级：</view>
			<picker class="u-fx-f1 u-tx-r col-666" mode="selector" :value="gradeName" :range="gradeList" @change="chooseGrade">
				<span class="u-content-color">{{ gradeName }}</span>
			</picker>
			<view class="rit-icon"></view>
		</view>
		<view v-if="false" class="u-fx-ac u-bd-b item-list">
			<view>专业：</view>
			<picker class="u-fx-f1 u-tx-r col-666" mode="selector" :value="subjectName" :range="subjectList" @change="chooseSubject">
				<span class="u-content-color">{{ subjectName }}</span>
			</picker>
			<view class="rit-icon"></view>
		</view>
		<view class="u-fx-ac u-bd-b item-list" v-if="false">
			<view>班级：</view>
			<picker class="u-fx-f1 u-tx-r col-666" mode="selector" :value="className" :range="classList" @change="chooseClass">
				<span class="u-content-color">{{ className }}</span>
			</picker>
			<view class="rit-icon"></view>
		</view>
		<view class="u-fx-ac u-bd-b item-list">
			<view>孩子姓名：</view>
			<view class="u-fx-f1"><input class="item-input" v-model="formData.userName" placeholder="请输入姓名" /></view>
		</view>
		<view v-if="false" class="u-fx-ac u-bd-b item-list">
			<view>孩子性别：</view>
			<view class="u-fx-f1 u-fx-je col-666">
				<radio-group @change="changeRadio">
					<label>
						<radio value="1" checked="true" />
						男
					</label>
					<label class="radio">
						<radio value="2" />
						女
					</label>
				</radio-group>
			</view>
		</view>
		<view class="u-fx-ac u-bd-b item-list">
			<view>孩子学号：</view>
			<view class="u-fx-f1 u-fx-je"><input class="item-input" v-model="formData.workNo" placeholder="请输入学号" /></view>
		</view>
		<view class="u-fx-ac u-bd-b item-list">
			<view>亲属关系：</view>
			<picker class="u-fx-f1 u-tx-r col-666" mode="selector" :value="relationShip" :range="relationShipList" @change="chooseRelation">
				<span class="u-content-color">{{ relationShip }}</span>
			</picker>
			<view class="rit-icon"></view>
		</view>
		<view class="u-fx-ac u-bd-b item-list">
			<view>家长姓名：</view>
			<view class="u-fx-f1 u-fx-je"><input class="item-input" v-model="formData.parentName" placeholder="请输入姓名" /></view>
		</view>
		<view class="u-fx-ac u-bd-b item-list">
			<view>手机号：</view>
			<view class="u-fx-f1 u-fx-je"><input class="item-input" v-model="formData.mobile" placeholder="请输入手机号" /></view>
		</view>
		<view class="u-fx-ac u-bd-b item-list">
			<view>验证码：</view>
			<view class="u-fx-f1 u-fx-je"><input class="item-input" v-model="formData.captchaCode" placeholder="请输入验证码" /></view>
			<view :class="['yzm-btn', {'act': total !== 60 }]" @tap="getCode">{{ total === 60 ? '获取验证码' : total + 'S' }}</view>
		</view>
		<view class="u-bd-b item-list">
			<view>上传头像：</view>
			<view class="u-fx-f1 u-mar-t">
				<div class="upload-user-img" @click="chooseImg">
					<image v-if="formData.photoUrl" :src="formData.photoUrl" class="upload-user-img"></image>
					<view v-if="!formData.photoUrl" class="upload-user-img">+</view>
				</div>
			</view>
		</view>
		<view class="btn-mar"><u-button type="primary" @click="register">注册</u-button></view>
		<view class="go-login u-font-01" @click="goLogin">
			已有账号,
			<span class="act">直接登录></span>
		</view>
	</scroll-view>
</template>

<script>
import { store, actions } from './store/index.js'
import $ajax from '@u/request.js'
import hostEnv from '@config/index.js'
import wxApi from '@u/wxApi'
export default {
	data() {
		return {
			wxApi,
			isGX: false,
			total: 60,
			isSchool: false,
			schoolList: [],
			schoolName: '请选择学校',
			gradeList: [],
			gradeName: '请选择年级',
			subjectName: '请选择专业',
			subjectList: [],
			classList: [],
			className: '请选择班级',
			relationShip: '请选择关系',
			formInfo: {},
			formData: {
				captchaCode: '',
				userName: '',
				workNo: '',
				parentName: '',
				mobile: '',
				schoolCode: '',
				relationShip: '',
				photoUrl: ''
			}
		};
	},
	computed: {
		openid: () => store.openid,
		relationShipList: () => store.relationShipList.map(item => item.relationShip)
	},
	async mounted() {
		const schoolCode = uni.getStorageSync('schoolCode');
		if (schoolCode) {
			this.chooseSchool(schoolCode);
		} else {
			this.isSchool = true;
			const res = await actions.getSchoolList({
				page: 1,
				size: 100
			});
			this.schoolTotal = res.data.list;
			this.schoolList = res.data.list.map(item => {
				return item.schoolName;
			});
		}
		uni.$on('uAvatarCropper', path => {
			this.$tools.checkPhoto(path, url => {
				this.$tools.toast('上传成功', 1)
				this.formData.photoUrl = url;
			})
		})
	},
	methods: {
		// 获取学校schoolType
		async _getschoolType(schoolCode) {
			const res = await actions.getSchoolType(schoolCode);
			this.schoolType = res.data.schoolType;
		},
		// 上传图片
		chooseImg() {
			this.wxApi.wxChoosePhoto(null, true)
		},
		// 返回登录
		goLogin() {
			this.$tools.navTo({
				url: './index',
				title: '智慧校园'
			});
		},
		// 选择学校
		async chooseSchool(item) {
			if (typeof item === 'string') {
				this.formData.schoolCode = item;
			} else {
				if (this.schoolList.length === 0) return;
				const index = item.target.value;
				this.schoolName = this.schoolList[index];
				this.formData.schoolCode = this.schoolTotal[index].schoolCode;
			}
		},
		// 选择关系
		chooseRelation(item) {
			if (this.relationShipList.length === 0) return;
			const index = item.target.value;
			this.relationShip = this.relationShipList[index];
			this.formData.relationShip = index + 1;
		},
		async getCode() {
			if (!this.formData.mobile || !/^1[3456789]\d{9}$/.test(this.formData.mobile)) {
				this.$tools.toast('请输入正确手机号');
				return;
			}
			if (this.total != 60) return;
			try {
				const schoolCode = uni.getStorageSync('_schoolCode')
				await $ajax.getUrl({
					url: `${hostEnv.protal_api_10166}/mobile/user/info/code/send/${this.formData.mobile}?schoolCode=${schoolCode}`
				})
				this.$tools.toast('获取成功', 1)
				this.timer = setInterval(() => {
					this.total--;
					if (this.total <= 0) {
						this.total = 60;
						clearInterval(this.timer);
					}
				}, 1000);
			} catch (err) {
				this.$tools.toast('获取失败');
			}
		},
		// 注册
		async register() {
			console.log(this.formData)
			for (let key in this.formData) {
				if (!this.formData[key]) {
					this.$tools.toast('请填写完整信息');
					return;
				}
			}
			var reg = /^1[3456789]\d{9}$/;
			if (!reg.test(this.formData.mobile)) {
				this.$tools.toast('请输入正确手机号');
				return;
			}
			await actions.parentAdd({
				...this.formData,
				gradeCode: '',
				classCode: '',
				photoUrl: this.formData.photoUrl,
				openid: this.openid || ''
			});
			this.$tools.toast('注册成功', 1);
			this.$tools.goNext(() => {
				this.$tools.goBack();
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.scroll-h {
	height: 100vh;
}
.item-list {
	padding: 28rpx 15rpx;
}
.item-input {
	width: 100%;
	font-size: 26rpx;
	text-align: right;
	color: $u-content-color;
}
.radio {
	padding-left: 25rpx;
}
.checkbox {
	padding: 30rpx 10px 10px 2px;
}
.yzm-btn {
	background-color: $u-type-primary;
	height: 60rpx;
	line-height: 60rpx;
	padding: 0 20rpx;
	color: #fff;
	margin-left: 30rpx;
	text-align: center;
	font-size: 24rpx;
	border-radius: 100rpx;
	opacity: 1;
	&.act {
		opacity: .6;
	}
}
.btn-mar {
	margin: 40rpx 20rpx;
}
.go-login {
	text-align: center;
	color: #666;
	padding-bottom: 40rpx;
	letter-spacing: 2rpx;
	.act {
		padding-left: 6rpx;
		color: $u-type-primary;
	}
}
</style>
