<template>
	<view class="face-student u-bg-fff">
		<u-popup v-model="dialogShow" mode="bottom"></u-popup>
		<u-popup v-model="photoShow" mode="bottom">
			<view class="padd-t20">
				<view class="photo-div" @click="chooseImg">
					<view class="click-photo">点击拍照</view>
					<image :src="baseImg" class="photo-img"></image>
				</view>
				<div class="padd-t20 padd-b20">
					<view class="info">
						<view class="tip"><text>注意事项</text></view>
						<view>1. 请确认照片是本人</view>
						<view>2. 请确认露出清晰完整人脸部位</view>
						<view v-if="false">3. 保持光线充足，不要戴眼镜</view>
						<view v-if="false">4. 正对摄像头，不要戴帽子</view>
						<view v-if="false">5. 拍照时不要晃动，保证照片清晰度</view>
					</view>
					<view class="u-fx-ac u-fx-jsa">
						<view class="rule-list u-fx-ac-jc">
							<image class="rule-img" src="/mobile-img/zdsj.png"></image>
							<view>正对手机</view>
						</view>
						<view class="rule-list u-fx-ac-jc">
							<image class="rule-img" src="/mobile-img/gxcz.png"></image>
							<view>光线充足</view>
						</view>
						<view class="rule-list u-fx-ac-jc">
							<image class="rule-img" src="/mobile-img/fmdz.png"></image>
							<view>放慢动作</view>
						</view>
					</view>
				</div>
				<view class="mar-t20 mar-b20 u-fx-jc">
					<u-button @click="photoShow = false">取消</u-button>
				</view>
			</view>
		</u-popup>
		<div class="u-padd u-tips-color u-font-01">点击学生头像进行上传和更新操作</div>
		<scroll-view scroll-y="true" class="scroll-h u-bg-fff">
			<no-data v-if="studentList.length === 0"></no-data>
			<view @click="showPhoto(list)" class="student-list u-bd-r u-fx-ac-jc" v-for="list in studentList" :key="list.userCode">
				<view><image :src="list.photoUrl || '/mobile-img/child-auto-icon.png'" class="student-img"></image></view>
				<view class="name u-font-01 u-te">{{ list.userName }}</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
import { actions, store } from '../store/index.js'
import wxApi from '@u/wxApi'
export default {
	data() {
		return {
			wxApi,
			isGX: false,
			oldUrl: '',
			baseImg: '',
			dialogShow: false,
			photoShow: false,
			studentList: []
		}
	},
	components:{
	},
	computed: {
		userInfo: () => store.userInfo,
		schoolYear: () => store.schoolYear,
		currentBindClass: () => store.currentBindClass
	},
	async created () {
		this.isGX = this.userInfo.schoolType === '8' || this.userInfo.schoolType === '9'
	},
	mounted () {
		if (this.currentBindClass && this.currentBindClass.classCode) {
			this.confirmClass()
		}
	},
	methods: {
		async uploadImg () {
			try {
				const { userCode } = this.currentStudent
				await actions.updatePhoto({
					schoolCode: this.userInfo.schoolCode,
					userCode,
					photoUrl: this.baseImg
				})
				this.$tools.toast('上传成功', 1)
				this.photoShow = false
				this.oldUrl = this.baseImg
				this.$tools.goNext(() => {
					const index = this.studentList.findIndex(item => {
						return item.userCode === userCode
					})
					this.studentList[index].photoUrl = this.baseImg
					this.$forceUpdate()
				})
			} catch(err) {}
		},
		showPhoto (item) {
			this.photoShow = true
			this.currentStudent = item
			this.oldUrl = item.photoUrl || ''
			this.baseImg = item.photoUrl || ''
		},
		chooseImg () {
			this.wxApi.wxChoosePhoto(null, true, (url) => {
				this.baseImg = url
				this.uploadImg()
			})
		},
		async confirmClass () {
			if(this.isGX){
				const res = await actions.highSchoolStudentList({
					schoolCode: this.userInfo.schoolCode,
					page: 1,
					size: 1000,
					grade: this.currentBindClass.gradeCode,
					classCode: this.currentBindClass.classCode
				})
				this.studentList = res.data.list
			}else{
				const res = await actions.studentList({
					schoolCode: this.userInfo.schoolCode,
					page: 1,
					size: 1000,
					gradeId: this.currentBindClass.gradeCode,
					classId: this.currentBindClass.classCode,
					schoolYearId: this.schoolYear.schoolYearId
				})
				this.studentList = res.data.list
			}
			
		}
	}
}
</script>

<style lang="scss">
.tab-select {
	height: 80rpx;
	text-align: center;
	color: $u-tips-color;
	.tip {
		width: 38rpx;
		height: 38rpx;
		display: block;
		margin: 0 20rpx;
	}
}
.block {
	text-align: center;
	line-height: 75rpx;
	color: $u-tips-color;
	height: 75rpx;
	border-bottom: 1px $u-border-color solid;
}
.scroll-h {
	height: calc(100vh - 62rpx);
}
.student-list {
	border: 1px $u-border-color solid;
	float: left;
	width: 18%;
	margin-left: 1.66%;
	padding: 10rpx;
	margin-top: 20rpx;
	border-radius: 4px;
	.student-img {
		width: 100rpx;
		height: 100rpx;
		display: block;
	}
	.name {
		color: $u-content-color;
		padding-top: 5rpx;
		font-size: 24rpx;
	}
}
.photo-div {
	width: 450rpx;
	height: 450rpx;
	margin: 0 auto;
	position: relative;
	background-color: #ccc;
	.click-photo {
		position: absolute;
		width: 100%;
		height: 80rpx;
		line-height: 80rpx;
		color: $u-border-color;
		bottom: 0px;
		letter-spacing: 4rpx;
		z-index: 99;
		text-align: center;
		background: rgba(0, 0, 0, 0.4);
	}
	.photo-img {
		width: 450rpx;
		height: 450rpx;
		display: block;
	}
}
.rule-list {
	margin-top: 30rpx;
	width: 160rpx;
	padding: 10px 0;
	color: #666;
	font-weight: bold;
	background-color: $u-type-primary-light;
	.rule-img {
		width: 40rpx;
		height: 50rpx;
		display: block;
		margin-bottom: 20rpx;
	}
}
.info {
	color: $u-content-color;
	line-height: 60rpx;
	font-size: 24rpx;
	text-indent: 30rpx;
	.tip {
		color: $u-type-error;
		font-size: 34rpx;
		font-weight: bold;
	}
	.tip-demo {
		font-size: 28rpx;
		color: $u-type-warning;
		font-weight: bold;
	}
}
</style>
