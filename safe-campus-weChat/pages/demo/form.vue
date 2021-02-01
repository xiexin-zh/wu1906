<template>
  <view>
		<class-tree isCheck v-show="classTag" :classTag="classTag" :schoolInfo="schoolInfo" @close="classClose" @confirm="classSelcet" :classChecked="[]"></class-tree>
		<teacher-tree isClear v-show="teacherTag" :teacherTag="teacherTag" :schoolInfo="schoolInfo" @close="teacherClose" @confirm="teacherSelcet" :classChecked="[]"></teacher-tree>
		<u-picker @confirm="changeTime" v-model="birthdayTag" mode="time"></u-picker>
		<cp-select-item :items="roleList" @confirm="changeRole" v-model="roleTag"></cp-select-item>
    <scroll-view scroll-y="true"  class="scroll-h u-bg-fff">
      <view class="u-fx-ac u-bd-b item-list">
        <view class="tip">姓名：</view>
        <view class="u-fx-f1"><input class="item-input" v-model="formData.userName" style="text-align: right;" placeholder="请输入姓名" /></view>
      </view>
      <view class="u-fx-ac u-bd-b item-list">
        <view class="tip">性别：</view>
        <view class="u-fx-f1 u-fx-je">
          <u-radio-group v-model="formData.value" @change="changeSex">
						<u-radio 
							shape="circle"
							class="radio-mar"
							v-for="(item, index) in sexList" :key="index" 
							:name="item.key"
						>
							{{item.name}}
						</u-radio>
					</u-radio-group>
        </view>
      </view>
      <view class="u-fx-ac u-bd-b item-list">
        <view>是否已婚：</view>
        <view class="u-fx-f1 u-fx-je">
          <u-switch v-model="formData.isMarry"></u-switch>
        </view>
      </view>
      <view class="u-fx-ac u-bd-b item-list">
        <view class="tip">出生日期：</view>
        <view class="u-fx-f1 u-fx-je u-content-color" @click="birthdayTag =  true">
					{{formData.birthday}}
        </view>
        <view class="rit-icon"></view>
      </view>
      <view class="u-fx-ac u-bd-b item-list">
        <view class="tip">角色：</view>
        <view class="u-fx-f1 u-fx-je u-content-color" @click="roleTag =  true">
					{{ formData.role }}
        </view>
        <view class="rit-icon"></view>
      </view>
			<view class="u-fx-ac u-bd-b item-list">
			  <view class="tip">类型：</view>
			  <view class="u-fx-f1 u-fx-je u-content-color" @click="changeAction">
					{{ formData.type }}
			  </view>
			  <view class="rit-icon"></view>
			</view>
			<view class="u-fx-ac u-bd-b item-list">
				<view class="tip">选择班级:</view>
				<view @click="chooseClass" class="u-fx-f1 u-fx-je u-content-color">请选择</view>
				<view class="rit-icon"></view>
			</view>
			<view class="u-fx-ac u-bd-b item-list">
				<view class="tip">选择教职工1:</view>
				<view @click="chooseTeacher(1)" class="u-fx-f1 u-fx-je u-content-color">请选择</view>
				<view class="rit-icon"></view>
			</view>
			<view class="u-fx-ac u-bd-b item-list">
				<view class="tip">选择教职工2:</view>
				<view @click="chooseTeacher(2)" class="u-fx-f1 u-fx-je u-content-color">请选择</view>
				<view class="rit-icon"></view>
			</view>
      <view class="u-bd-b item-list">
        <view class="tip">身体状况：</view>
        <view class="u-fx-f1 u-padd-t">
          <u-checkbox-group @change="changeHealth">
						<u-checkbox 
							v-model="item.checked" 
							v-for="(item, index) in healthyList" :key="index" 
							:name="item.key"
						>{{item.name}}</u-checkbox>
					</u-checkbox-group>
        </view>
      </view>
			<view class="u-bd-b item-list">
			  <view class="tip">上传图片：</view>
			  <view class="u-fx-f1">
					<an-upload-img total="3" v-model="formData.imgList" style="margin: 20rpx"></an-upload-img>
			  </view>
			</view>
			<view class="u-bd-b item-list">
			  <view>备注：</view>
			  <view class="u-fx-f1"><textarea class="item-text-area" v-model="formData.mark" placeholder="请输入备注" /></textarea></view>
			</view>
			<view class="u-fx-f1 u-bd-b item-list u-mar-b20">
				<view class="u-fx tip">充值金额（元）：</view>
				<view class="u-fx u-fx-ac u-mar-10 u-bd-b u-padd-10 u-font-3">
					<view>￥</view>
					<input @input="orderAmountInput" v-model="payMoney" class="u-mar-l10" type="digit" placeholder="" />
				</view>
				<view class="u-fx u-mar-t20">到账：{{ payMoney || 0 }}元</view>
			</view>
			<view class="u-bd-b item-list">
				<view class="tip">支付方式：</view>
				<view class="u-fx-f1 u-padd-t">
					<radio-group @change="changePayMode">
						<label v-for="(item, index) in payModeList" :key="item.value">
							<view :class="index === 0 ? 'uni-radio u-mar-b10 u-padd-b20 u-padd-t10 u-bd-b u-fx' : 'uni-radio u-padd-t10 u-fx'">
								<image class="icon u-mar-r20" :src="item.value === 'WXPAY_JSAPI' ? '/mobile-img/wx.png' : '/mobile-img/ali.png'" mode=""></image>
								<radio :value="item.value" :checked="item.checked" />
								<view>{{ item.name }}</view>
							</view>
						</label>
					</radio-group>
				</view>
			</view>
    </scroll-view>
		<go-pay title="立即缴费" :actionUrl="actionUrl" :payInfoUrl="payInfoUrl" :payStatusUrl="payStatusUrl" :payType="payType" :params ="params"></go-pay>
		<!-- <view class="submit-btn">
			<u-button type="primary" @click="submitForm">提交</u-button>
		</view> -->
  </view>
</template>

<script>
	import validateForm from '@u/validate'
	import hostEnv from '../../config/index.js';
	import goPay from '@/components/go-pay/go-pay'
	import classTree from '@/components/class-tree/class-tree'
	import teacherTree from '@/components/teacher-tree/teacher-tree'
	import anUploadImg from '@/components/an-uploadImg/an-uploadImg'
	const yzForm = {
		userName: '请输入用户名',
		sex: '请选择性别',
		birthday: '请选择出生日期',
		role: '请选择角色',
		type: '请选择类型',
		healthy: '请选择身体状况',
		imgList: '请上传图片'
	}
	export default {
		data() {
			return {
				classTag: false,
				teacherTag: false,
				roleTag: false,
				birthdayTag: false,
				healthyList: [
					{
						key: 1,
						name: '健康'
					},
					{
						key: 2,
						name: '咳嗽'
					},
					{
						key: 3,
						name: '感冒'
					}
				],
				sexList: [
					{
						name: '男',
						key: 1
					}, {
						name: '女',
						key: 2
					}
				],
				roleList: [
					{
						key: 1,
						label: '爸爸'
					},
					{
						key: 2,
						label: '妈妈'
					},
					{
						key: 3,
						label: '爷爷'
					}
				],
				typeList: [
					{
						key: 1,
						label: '超级管理员'
					},
					{
						key: 2,
						label: '管理员'
					}
				],
				schoolInfo: {
					schoolYearId: 53,
					schoolCode: 'CANPOINTAI'
				},
				formData: {
					userName: '',
					healthy: [],
					sex: '',
					birthday: '请选择',
					isMarry: true,
					role: '请选择',
					type: '请选择',
					imgList: [],
				},
				payMoney: 0,
				actionUrl: '',
				payInfoUrl: '',
				payStatusUrl: '',
				payModeList: [
					{
						value: 'WXPAY_JSAPI',
						name: '微信支付',
						checked: true
					},
					{
						value: 'ALIPAY_WAP',
						name: '支付宝支付'
					}
				],
				payType: 'WXPAY_JSAPI',
				params: {}
			}
		},
		components: {
			anUploadImg,
			classTree,
			teacherTree,
			goPay
		},
		created() {
			this.actionUrl = `${hostEnv.protal_api_11031}/api/mobile/createRecharge`
			this.payInfoUrl = `${hostEnv.protal_api_11031}/api/mobile/continueRechargeByOrderNo`
			this.payStatusUrl = `${hostEnv.protal_api_11031}/api/mobile/queryRecordInfoByOrderNo`
			this.params = {
				extra: this.payType === 'WXPAY_JSAPI' ? JSON.stringify({ openId: 'oySYu1C-UApZFua3iSgffQ8lif8Q' }) : JSON.stringify({}),
				payType: this.payType,
				rechargeAmount: this.payMoney.toFixed(2),
				timeStamp: parseInt(new Date().getTime() / 1000),
				userCode: 'U14jy659ovp4s0',
				key: 'M86l522AV6q613Ii4W6u8K48uW8vM1N6bFgyv769220MdYe9u37N4y7rI5mQ'
			}
		},
    methods: {
			orderAmountInput(e) {
				this.payMoney = Math.floor(e.target.value * 100) / 100;
				this.params.rechargeAmount = this.payMoney.toFixed(2)
			},
			changePayMode(e) {
				this.payType = e.target.value;
				console.log(this.payType)
				this.params.extra = this.payType === 'WXPAY_JSAPI' ? JSON.stringify({ openId: 'oySYu1C-UApZFua3iSgffQ8lif8Q' }) : JSON.stringify({})
				this.params.payType = this.payType
			},
			classSelcet(value){
				this.classTag = false
				console.log(value)
			},
			classClose(){
				this.classTag = false
			},
			teacherSelcet(value){
				this.teacherTag = false
				console.log(123, value)
			},
			teacherClose(){
				this.teacherTag = false
			},
			changeHealth (item) {
				this.formData.healthy = item
			},
			chooseTeacher (type) {
				this.teacherTag = true
			},
			chooseClass () {
				this.classTag = true
			},
			changeSex (item) {
				this.formData.sex = item
			},
			changeRole(item) {
				this.formData.role = item.label
			},
      changeTime (item) {
				this.formData.birthday = `${item.year}-${item.month}-${item.day}`
      },
      changeAction () {
        this.$tools.actionsheet(this.typeList, (item) => {
					console.log(item)
					this.formData.type = item.label
        })
      },
			submitForm () {
				validateForm(yzForm, this.formData, () => {
					console.log(this.formData)
				})
			}
    }
	}
</script>

<style lang="scss">
  .scroll-h {
    height: calc(100vh - 100rpx);
  }
  .item-list {
    padding: 25rpx 15rpx 25rpx 25rpx;
		.tip::before {
			position: absolute;
			z-index: 99;
			content: "*";
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
    padding-left: 35rpx
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
		padding: 20rpx
  }
	.icon {
		width: 42rpx;
		height: 42rpx;
	}
	/deep/ .uni-radio {
		position: relative;
		uni-radio {
			position: absolute;
			right: 10rpx;
			.uni-radio-input {
				width: 40rpx;
				height: 40rpx;
			}
		}
	}
</style>
