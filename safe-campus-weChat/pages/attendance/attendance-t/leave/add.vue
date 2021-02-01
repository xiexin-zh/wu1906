<template>
  <view class="add">
    <scroll-view scroll-y="true" class="scroll-h u-bg-fff">
      <view class="u-fx-ac u-bd-b item-list">
        <view class="tip">请假类型：</view>
        <view class="u-fx-f1 u-fx-je u-content-color">
          <picker mode="selector" :value="currentRole" :range="role" @change="chooseRole">
            {{role[currentRole]}}
          </picker>
        </view>
        <view class="rit-icon"></view>
      </view>
      <view class="u-fx-ac u-bd-b item-list">
        <view class="tip">开始时间：</view>
        <view class="u-fx-f1 u-fx-je"  @click="startShow = true">
          <u-picker mode="time" v-model="startShow" :params="params" @confirm="startConfirm"></u-picker>
          <view class="uni-input u-content-color">{{leaveInfo.startDate}}</view>
          <view class="rit-icon"></view>
        </view>
      </view>
      <view class="u-fx-ac u-bd-b item-list">
        <view class="tip">结束时间：</view>
        <view class="u-fx-f1 u-fx-je"  @click="endShow = true">
          <u-picker mode="time" v-model="endShow" :params="params" @confirm="endConfirm"></u-picker>
          <view class="uni-input u-content-color">{{leaveInfo.endDate}}</view>
          <view class="rit-icon"></view>
        </view>
      </view>
      <view class="u-fx-ac u-bd-b item-list">
        <view class="tip">请假时长：</view>
        <view class="u-fx-f1 u-fx-je u-content-color">{{ leaveInfo.duration }}小时</view>
      </view>
      <view class="u-fx u-bd-b item-list">
        <view>描述：</view>
        <view class="u-fx-f1 u-tx-r"><textarea v-model="leaveInfo.remark" class="item-input u-content-color" placeholder="请输入描述" /></view>
      </view>
      <view class="u-fx-ac u-bd-b item-list">
        <view class="tip">是否出校：</view>
        <view class="u-fx-f1 u-fx-je col-666">
          <radio-group @change="radioChange">
            <label><radio value="Y" :checked="leaveInfo.outSchool === 'Y'" />是</label>
            <label class="u-padd-l20"><radio :checked="leaveInfo.outSchool === 'N'" value="N" />否</label>
          </radio-group>
        </view>
      </view>
      <view class="u-fx-ver u-bd-b item-list">
			  <view class="tip">审批人：</view>
        <view class="u-fx-f1 u-mar-t20">
          <view v-if="JSON.stringify(this.leaveInfo.leaveApprovalAddDto) === '{}' " class="an-img-add u-mar-l20" @click="check(1)">+</view>
          <view v-else class="an-img u-mar-l20" @click="check(1)">
            <image class="upload-icon" :src="this.leaveInfo.leaveApprovalAddDto.photoUrl "></image>
            <div class="u-text-center">{{this.leaveInfo.leaveApprovalAddDto.userName}}</div>
		      </view>
			  </view>
			</view>
      <view class="u-fx-ac u-bd-b item-list">
			  <view>抄送人：</view>
        <view @click="check(2)" class="u-fx-f1 u-fx">
          <view class="copyer u-fx-f1 u-content-color u-tx-r">
            <u-tag 
              @close="tagClick(item)"
              v-for="(item,index) in leaveInfo.leaveCopyList"
              :key="index"
              :text="item.userName"
              mode="light" 
              type="info" 
              closeable 
              class="mar-l10" />
          </view>
          <view class="rit-icon"></view>
        </view>
			</view>
      <view class="u-bd-b item-list">
			  <view>上传附图：</view>
			  <view class="u-fx-f1">
					<an-upload-img total="3" v-model="leaveInfo.photoList" class="u-mar-20"></an-upload-img>
			  </view>
			</view>
    </scroll-view>
    <view class="submit-btn"><u-button type="primary" @click="submit">提交</u-button></view>
    <teacher-tree :isRadio="isRadio" :isCheck="isCheck" :teacherTag="teacherTag" v-if="teacherTag" :schoolInfo="schoolInfo" @close="teacherTag = false"
		 @confirm="teacherSelcet" :classChecked="[]">
		</teacher-tree>
  </view>
</template>

<script>
  import eventBus from '@u/eventBus'
	import anUploadImg from '@/components/an-uploadImg/an-uploadImg'
  import { actions, store } from '../store/index'
  import teacherTree from "@/components/teacher-tree/teacher-tree"
	export default {
    components: {
      anUploadImg,
      teacherTree
		},
		data() {
			return {
        teacherTag: false,
        role: [],
        reasonList: [],
        currentRole: 0,
        leaveInfo: {
          startDate: this.$tools.getPhoneTime(new Date(), 'noSecond'),
          endDate: this.$tools.getPhoneTime(new Date(new Date().getTime() + 2 * 60 * 60 * 1000), 'noSecond'),
          duration: '2',
          outSchool: '',
          remark: '',
          photoList:[],
          reasonId: '',
          reason: '',
          leaveApprovalAddDto : {
            userName:''
          },
          leaveCopyList: []
        },
        oddNumbers: '',
        startShow: false,
        endShow: false,
        params: {
					year: true,
					month: true,
					day: true,
					hour: true,
					minute: true,
					second: false
				},
        current: '',
        schoolInfo: {
          schoolYearId: 0,
          schoolCode: "",
        },
        isCheck: false,
        isRadio: false
			}
    },
    created() {
      this.schoolInfo.schoolCode = store.userInfo.schoolCode
      this.schoolInfo.schoolYearId = store.schoolYear.schoolYearId
    },
    mounted () {
      this.oddNumbers = this.$tools.getQuery().get('oddNumbers')
      if (this.oddNumbers) {
        this.detailGet(this.oddNumbers)
      } else {
        this.dutyPersonGet()
        this.leaveReasonGet(0)
      }
    },
    methods: {
      //获取主管
      async dutyPersonGet () {
        const req = {
          schoolCode: store.userInfo.schoolCode,
          userCode: store.userInfo.userCode
        }
        const res = await actions.getDutyPerson(req)
        if (res.data) {
          this.leaveInfo.leaveApprovalAddDto.userName = res.data.dutyPersonName
          this.leaveInfo.leaveApprovalAddDto.userCode = res.data.dutyPersonCode
          this.leaveInfo.leaveApprovalAddDto.photoUrl = res.data.dutyPersonPhotoUrl
        } else {
          this.leaveInfo.leaveApprovalAddDto = {}
        }
      },
      async detailGet (id,code) {
        const req = {
          oddNumbers: id,
          userCode: store.userInfo.userCode
        }
        const res = await actions.getLeaveDetail(req)
        this.leaveInfo = res.data
        this.leaveInfo.startDate = this.$tools.getPhoneTime(new Date(this.leaveInfo.startTime), 'noSecond')
        this.leaveInfo.endDate = this.$tools.getPhoneTime(new Date(this.leaveInfo.endTime), 'noSecond')
        this.leaveInfo.leaveApprovalAddDto = this.leaveInfo.leaveApprovalAddDto[0]
        this.leaveReasonGet(1)
      },
      async leaveReasonGet (type) {
        const res = await actions.getLeaveReason()
        this.reasonList = res.data
        this.role = []
        res.data.forEach(el => {
          this.role.push(el.name)
        })
        if (type) {
          this.currentRole = this.role.indexOf(this.leaveInfo.reason)
        } else {
          this.leaveInfo.reasonId = this.reasonList[0].id
          this.leaveInfo.reason = this.reasonList[0].name
        }
      },
      teacherSelcet(value) {
        if (this.current === 1) {
          if(value.length === 0 ){
            this.$tools.toast("请选择人员")
            return
          }
          if (value[0].userCode === store.userInfo.userCode) {
            this.$tools.toast('审批人不可选自己')
            return false
          }
          this.leaveInfo.leaveApprovalAddDto.userCode = value[0].userCode
          this.leaveInfo.leaveApprovalAddDto.userName = value[0].userName
          this.leaveInfo.leaveApprovalAddDto.photoUrl = value[0].photoUrl
          this.teacherTag = false
        } else {
          this.leaveInfo.leaveCopyList = value.map(el=>{
            return {
              userCode: el.userCode,
              userName: el.userName,
              photoUrl : el.photoUrl
            }
          })
          this.teacherTag = false
        }
      },
      radioChange (e) {
        this.leaveInfo.outSchool = e.target.value
      },
      chooseRole (e) {
        this.currentRole = e.target.value
        this.leaveInfo.reasonId = this.reasonList[e.target.value].id
        this.leaveInfo.reason = this.reasonList[e.target.value].name
      },
      check (type) {
        this.current = type
        if (type === 1) {
          this.isRadio = true
          this.isCheck = false
        } else {
          this.isRadio = false
          this.isCheck = true
        }
        this.teacherTag =  true
      },
      tagClick(item) {
        this.leaveInfo.leaveCopyList = this.leaveInfo.leaveCopyList.filter(el => el !== item)
      },
      startConfirm (params) {
        this.leaveInfo.startDate = `${params.year}/${params.month}/${params.day} ${params.hour}:${params.minute}`
        this.leaveInfo.endDate =  this.leaveInfo.endDate.replace(/-/g, '/')
        const time = (new Date(new Date(this.leaveInfo.endDate).getTime()).getTime() 
                        - new Date(new Date(this.leaveInfo.startDate).getTime()).getTime()) / 1000 / 60 / 60
        if (time > 0) {
         this.leaveInfo.duration =  Math.ceil(time)
        } else {
          this.leaveInfo.duration =  Math.floor(time)
        }
        console.log('leaveInfo',this.leaveInfo.startDate)
      },
      endConfirm (params) {
        this.leaveInfo.endDate = `${params.year}/${params.month}/${params.day} ${params.hour}:${params.minute}`
        this.leaveInfo.startDate =  this.leaveInfo.startDate.replace(/-/g, '/')
        const time = (new Date(new Date(this.leaveInfo.endDate).getTime()).getTime() 
                        - new Date(new Date(this.leaveInfo.startDate).getTime()).getTime() )/ 1000 / 60 / 60
        if (time > 0) {
         this.leaveInfo.duration =  Math.ceil(time)
        } else {
          this.leaveInfo.duration =  Math.floor(time)
        }
      },
      async submit () {
        if (this.leaveInfo.outSchool === '') {
          this.$tools.toast('请选择是否出校')
          return false
        } else if (new Date(this.leaveInfo.endDate).getTime() <= new Date(this.leaveInfo.startDate).getTime()) {
          this.$tools.toast('请选择正确时间段')
          return false
        } else if (!this.leaveInfo.leaveApprovalAddDto.userCode) {
          this.$tools.toast('请选择审批人')
          return false
        }
        const photoList = this.leaveInfo.photoList.map(el => {
					return el.url
        })
        const req = {
          photoList: photoList,
          userName: store.userInfo.userName,
          userCode: store.userInfo.userCode,
          schoolCode: store.userInfo.schoolCode,
          startTime: new Date(this.leaveInfo.startDate).getTime(),
          endTime: new Date(this.leaveInfo.endDate).getTime()
        }
        if (this.oddNumbers) {
          await actions.updateTeacherLeave({
            ...this.leaveInfo,
            ...req
          })
            this.$tools.toast('操作成功')
            this.$tools.goNext(() => {
              eventBus.$emit('getLeaveList')
              this.$tools.goBack()
            })
        } else {
            await actions.addTeacherLeave({
            ...this.leaveInfo,
            ...req
          })  
            this.$tools.toast('操作成功')
            this.$tools.goNext(() => {
              eventBus.$emit('getLeaveList')
              this.$tools.goBack()
            })
        }
      }
    }
	}
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
			content: "*";
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
  }
  .scroll {
    height: 70vh;
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
.an-uploadImg-group {
	overflow: auto;
	height: 100%;
}
.an-img {
	float: left;
	position: relative;
}
.an-img-add {
	float: left;
	font-size: 50rpx;
	height: 80rpx;
	width: 80rpx;
	color:#666;
	text-align: center;
	line-height: 80rpx;
}
.upload-icon {
	height: 100rpx;
	width: 100rpx;
	display: block;
}
.u-text-center {
  text-align: center;
}
</style>
