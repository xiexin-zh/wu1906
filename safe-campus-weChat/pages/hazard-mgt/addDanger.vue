<template>
	<view>
		<scroll-view scroll-y="true" class="scroll-h" >
			<view class="log">
				<view class="item-list">
					<textarea v-model="formData.description" maxlength="600" class="item-text-area u-main-color u-font-01 u-padd-t20"
					 placeholder="请描述您发现的隐患" />
					<an-upload-img v-model="formData.photoUrl" total="9" style="margin: 20rpx">
          </an-upload-img>
				</view>
			</view>
      <view class="">
        <view class="u-fx-ac u-bd-b item-list">
          <view >隐患地点：</view>
          <view class="u-fx-f1 u-fx-je">
            <input  class="item-input u-light-color al-r" 
             v-model="formData.address" placeholder="请填写您发现的隐患地点" />
          </view>
        </view>
        <view class="u-fx-ac u-bd-b item-list">
          <view >负责人：</view>
          <view class="u-fx-f1 u-fx-je ">
            <picker class="u-light-color" 
              mode="selector" 
              :range-key="'name'" 
              :value="courseIndex" 
              :range="causeNameList" 
              @change="changeLeader">
              {{courseIndex=='-1'?'请选择隐患处理负责人': causeNameList[courseIndex].name}}
            </picker>
          </view>
          <view class="rit-icon" ></view>
        </view>
        <view class="u-fx-ac u-bd-b item-list">
          <view >是否已处理：</view>
          <view class="u-fx-f1 u-fx-je ">
            <view >否</view>
            <u-switch size='40' class="u-mar-l10 u-mar-r10" v-model="formData.hasComplete"></u-switch>
            <view >是</view>
          </view>
        </view>
      </view>
		</scroll-view>
    <view class="footer-btn u-fx-ac u-bg-color">
      <u-button
        type="primary"
        class="u-fx-f1 u-mar-l u-mar-r "
        @click="submitForm"
      >
        上报隐患
      </u-button>
    </view>
  </view>
</template>

<script>
  import eventBus from '@u/eventBus'
  import validateForm from '@u/validate';
  import anUploadImg from '@/components/an-uploadImg/an-uploadImg'
  import { store, actions } from './store/index.js'
  import hostEnv from '../../config/index.js';
  const yzForm = {
    description: '请输入你的隐患描述',
    address: '请填写您发现的隐患地点',
    courseIndex: '请选择隐患处理负责人',
  }
  export default {
    components: {
      anUploadImg
    },
    data () {
      this.leaderName=''
      this.leaderCode=''
      this.uploadUrl = `${hostEnv.protal_api_10050}/file/freeUpload?schoolCode=${this.schoolCode}`
      return {
        causeNameList: [],
        courseIndex:-1,
        //图片上传
        type: 'image',
        dataList: [],
        uploadCount: 9,
        formData: {
          description:"",
          address:'',
          hasComplete: false,
          photoUrl: [],
        },
       
      }
    },
    mounted () {
      this.getUserList()
    },
    methods: {
      //获取负责人数据
      async getUserList() {
        const res = await actions.getGroupDetail({ schoolCode: store.userInfo.schoolCode })
        this.causeNameList = res.data.leaders
      },
      changeLeader(e){
        if(this.causeNameList.length==1){
          this.courseIndex = 0
        }else{
          this.courseIndex = e.target.value
        }
        this.leaderName = this.causeNameList[this.courseIndex].name
        this.leaderCode = this.causeNameList[this.courseIndex].code
      },
      
      submitForm () {
         validateForm(yzForm, this.formData, () => {
           if (this.leaderCode==''&&this.leaderCode==''){
             return this.$tools.toast('请选择负责人');
           }
           if (this.formData.photoUrl.length===0){
             return this.$tools.toast('请上传隐患图片');
           }
          const photoUrl= this.formData.photoUrl.map(el => {
              return el.url
          })
          this.$tools.confirm("确定上报隐患吗？", () => {
             let req = {
              ...this.formData,
              leaderName: this.leaderName,
              leaderCode: this.leaderCode,
              // photoUrl: [], //隐患图片
              reporterCode: store.userInfo.userCode,
              reporterName: store.userInfo.userName,
              reporterPhotoUrl: store.userInfo.logoUrl,
              schoolCode: store.userInfo.schoolCode,
              schoolName: store.userInfo.schoolName,
              photoUrl:photoUrl
            }
            actions.reportDanger(req).then(res=>{
              this.$tools.toast(`上报${res.data}`, "success");
              this.$tools.goNext(() => {
                eventBus.$emit('getList');
                this.$tools.navTo({
                  url: `./index?state=1`,
                })
              });
            })
          });
         })
      }
    }
  }
</script>

<style lang="scss" scoped>
.tip::before {
	position: absolute;
	content: '*';
	color: red;
	left: 10rpx;
	width: 10rpx;
	height: 10rpx;
}
.item-list {
	padding: 25rpx 10rpx 25rpx 30rpx;
	background: $uni-bg-color;
}
.item-input {
	width: 100%;
	font-size: 26rpx;
	color: $u-tips-color;
}
.log {
	background: $uni-bg-color;
	padding: 20rpx 0rpx;
	margin: 0rpx 0 30rpx 0;
	border-bottom: 1px solid $u-border-color;
}
.al-r {
	text-align: right;
}
.scroll-h {
  height: calc(100vh - 120rpx);
  .add-top {
    height: 200rpx;
  }
  .item-text-area {
		height: 120rpx;
		width: 100%;
		line-height: 40rpx;
		color: $u-content-color;
  }
}
</style>
