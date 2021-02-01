<template>
	<view>
		<scroll-view scroll-y="true" :class="isScroll">
			<view class="u-bd-b u-padd-20 u-bg-fff">
				<view class="u-line2">{{detailInfo.description}}</view>
				<view class="u-mar-t20 u-mar-b10">
					<image class="img u-mar-r20" @click='perviewImg(img)' v-for="(img,index) in detailInfo.dangerPhotoUrls" :key="index"
					 :src="img" mode="">
					</image>
				</view>
			</view>
			<view class="u-mar-t20">
				<view class="u-fx-ac u-bd-b item-list">
					<view>隐患地点：</view>
					<view class="u-fx-f1 u-fx-je ">{{detailInfo.address}}</view>
				</view>
				<view class="u-fx-ac u-bd-b item-list">
					<view>负责人：</view>
					<view class="u-fx-f1 u-fx-je ">{{detailInfo.leaderName}}</view>
				</view>
				<view class="u-fx-ac u-bd-b item-list u-mar-b20">
        
					<view>现隐患状态：</view>
					<view class="u-fx-f1 u-fx-je ">{{detailInfo.state | getDangerState}}</view>
				</view>
				<view v-if="(state==='1'&&leaderCode==userCode)||state==='2'||(state==='3'&&this.detailInfo.categoryName)||state==='4'" 
          class="u-fx-ac  u-bd-b item-list">
					<view class="tip">隐患类别：</view>
					<view class="u-fx-f1 u-fx-je ">
						<!-- :disabled="!!state" -->
						<picker class="u-light-color" mode="selector" 
             :disabled="state!=='1'" :range-key="'name'" :value="categoryIndex"
						 :range="dangerCategoryList" @change="chooseCategory">
							{{categoryIndex=='-1'?'请选择隐患类别':dangerCategoryList[categoryIndex].name }}
						</picker>
					</view>
					<view class="rit-icon" v-if="state=='1'"></view>
				</view>
				<view v-if="(state=='1'&& leaderCode==userCode)||state==='2'||(state==='3'&&this.detailInfo.level)||state==='4'" class="u-fx-ac u-bd-b item-list">
					<view class="tip">隐患严重等级：</view>
					<view class="u-fx-f1 u-fx-je ">
						<picker class="u-light-color " mode="selector" :disabled="state!=='1'" :range-key="'label'" :value="levelIndex"
						 :range="dangerLevelList" @change="chooseLevel">
							<view class="" :style="{color:levelIndex==0?'#ff5454':levelIndex==1?'#f5772d':levelIndex==2?'#f5b111':levelIndex==3?'#00a35f':''}">
								{{levelIndex=='-1'?'请选择隐患等级':dangerLevelList[levelIndex].label }}
							</view>
						</picker>
					</view>
					<view class="rit-icon" v-if="state=='1'"></view>
				</view>
				<view v-if="(state=='1'&& leaderCode==userCode)||state==='2'||(state==='3'&&this.detailInfo.handerName)||state==='4'" 
         class="u-fx-ac u-bd-b item-list">
					<view class="tip">隐患指派：</view>
					<view class="u-fx-f1 u-fx-je ">
						<picker :disabled="isDisabledAssigned" class="u-light-color" mode="selector" :range-key="'name'" :value="handerIndex"
						 :range="dangerHanderList" @change="chooseHander">
							{{handerIndex=='-1'?'请选择隐患处理人':dangerHanderList[handerIndex].name }}
						</picker>
					</view>
					<view class="rit-icon" v-show="!isDisabledAssigned"></view>
				</view>
				<view v-if="state=='1'&& leaderCode==userCode" class="u-fx-ac u-bd-b item-list">
					<view>是否允许转派：</view>
					<view class="u-fx-f1 u-fx-je ">
						<u-switch size='40' class="u-mar-l10 u-mar-r10" 
            active-value="1" inactive-value="0" v-model="detailInfo.hasDispense">
						</u-switch>
					</view>
				</view>
				<view v-if="(state==='1'&& leaderCode===userCode)||state==='2'||(state==='3'&&this.detailInfo.handleDuration)||state==='4'" 
         class="u-fx-ac u-bd-b item-list">
					<view class="tip">要求处理完成时间：</view>
					<view class="u-fx-f1 u-fx-je u-light-color">
						<input :disabled="state!=='1'" class="item-input u-light-color al-r" type="number" v-model="detailInfo.handleDuration"
						 placeholder="1-72" />
					</view>
					<view class="hour u-mar-l10">
						小时
					</view>
				</view>
				<view v-if="state==='1'&&leaderCode===userCode" class="u-fx u-bd-b  item-list">
					<view>指派备注：</view>
					<view class="u-fx-f1 mar-r20">
						<textarea :auto-height="true" class="item-input u-light-color" maxlength="600" 
            v-model="detailInfo.assignRemark" style="text-align: right;height:120rpx"
						 placeholder="请填写指派的意见或建议" />
						</view>
			  </view>
        <!-- 上传整改照片 -->
        <view  v-if="state==='2'&&!isTransfer&&handlerCode===userCode" class="u-fx-ver u-bd-b item-list">
          <view class="u-line2">整改照片:</view>
          <view class="u-mar-t20 u-mar-b10">
            <an-upload-img v-model="completePhotoUrls" total="9" style="margin: 20rpx"></an-upload-img>
          </view>
			  </view>
        <view v-if="state==='2'&&!isTransfer&&handlerCode===userCode" class="u-fx u-bd-b  item-list">
					<view>整改备注：</view>
					<view class="u-fx-f1 mar-r20">
          <textarea :auto-height="true"  class="item-input u-light-color" maxlength="600" 
            v-model="detailInfo.rectifyRemark"
            style="text-align: right;height:120rpx" placeholder="请填写整改备注" />
          </view>
			  </view>
        <!-- 验收详情展示整改照片 -->
        <view  v-if="state==='3'&&handlerCode===userCode||state==='4'" class="u-fx-ver u-bd-b item-list">
          <view class="u-line2">整改照片:</view>
          <view class="u-mar-t20 u-mar-b10">
            <image class="img u-mar-r20" @click='perviewImg(img)' v-for="(img,index) in detailInfo.completePhotoUrls" :key="index"
              :src="img" mode="">
            </image>
          </view>
			  </view>
        <view v-if="state==='3'&&leaderCode===userCode" class="u-fx u-bd-b  item-list">
					<view>验收备注：</view>
					<view class="u-fx-f1 mar-r20">
          <textarea :auto-height="true"  class="item-input u-light-color" maxlength="600" 
            v-model="detailInfo.acceptanceRemark"
            style="text-align: right;height:120rpx" placeholder="请填写验收备注" />
          </view>
			  </view>
        <view class="u-padd u-mar-t20 u-bg-fff">
          <view class="u-mar-b10">
            处理流水：
          </view>
          <approval-step1 :data-list="processesList"></approval-step1>
        </view>
      </view>
		</scroll-view>
    <view class="footer-btn u-fx-ac u-bg-color">
      <u-button v-if="state==='1'&& leaderCode===userCode" type="primary" class="u-fx-f1 u-mar-l u-mar-r " 
        @click="submitForm('1')">
        指派隐患
      </u-button>
      <u-button v-else-if="state==='2'&&handlerCode===userCode" type="primary" class="u-fx-f1 u-mar-l u-mar-r " 
        @click="submitForm('2')">
        {{isTransfer?'转派':'处理隐患'}}
      </u-button>
      <u-button v-else-if="state==='3'&& leaderCode===userCode" type="primary" class="u-fx-f1 u-mar-l u-mar-r " 
        @click="submitForm('3')">
        验收隐患
      </u-button>
    </view>
    <u-select v-model="showAcceptanceSelect" :list="list" @confirm="confirm"></u-select>
  </view>
</template>

<script>
import eventBus from '@u/eventBus'
import validateForm from '@u/validate';
import anUploadImg from '@/components/an-uploadImg/an-uploadImg'
import { store, actions } from './store/index.js'
import ApprovalStep1 from './components/approval-step'
const yzForm = {
    handleDuration: '请输入你的处理完成时间',
  }
export default {
  components: {
    anUploadImg,
    ApprovalStep1
  },
  computed:{
    //是否是当前负责人
    isLeader(){
      return this.leaderCode===store.userInfo.userCode
    },
    //是否是当前处理人
    ishandler(){
      return this.handlerCode===store.userInfo.userCode
    },
    isDisabledAssigned(){
      if(this.state ==='1'){
        return false
      }else if(this.state==='2'){
        //处理的时候允许转派
        // console.log(this.detailInfo.hasDispense+'111')
        if(this.detailInfo.hasDispense&&this.handlerCode==this.userCode){
         return false
        }else{
          return true
        }
      }else{
        return true
      }
    },
    isScroll(){
      if(this.state==='1'&& this.leaderCode==this.userCode){
        return 'scroll-h'
      }else if(this.state==='2'&&this.handlerCode==this.userCode){
        return 'scroll-h'
      }else if(this.state==='3'&& this.leaderCode==this.userCode){
        return 'scroll-h'
      }else{
        return ''
      }
    }
  },
  data () {
    this.id = this.$tools.getQuery().get('id')
    return {
      state:this.$tools.getQuery().get('state'),
      leaderCode:this.$tools.getQuery().get('leaderCode'), 
      handlerCode:this.$tools.getQuery().get('handlerCode'),
      userCode:store.userInfo.userCode,
      completePhotoUrls:[],
      detailInfo:{
          PhotoUrls:[
            {img:'/mobile-img/safe-rcywc.png'},
            {img:'/mobile-img/safe-rcdwc.png'},
            {img:'/mobile-img/safe-sbywc.png'},
            {img:'/mobile-img/safe-sbywc.png'},
          ]
      },
      dangerCategoryList: [],
      categoryIndex:-1,
      dangerLevelList: [
        {label:'重大风险',level:'4',color:'red'},
        {label:'较大风险',level:'3',color:'green'},
        {label:'一般风险',level:'3',color:'pink'},
        {label:'低风险',level:'1',color:'black'},
      ],
      levelIndex:-1,
      dangerHanderList: [],
      handerIndex:-1,
      processesList: [
        {
          photoUrl: '',
					dateTime: '',
					label: '处理人',
					labelName: '', // 如果是多个用逗号隔开
					statusName:  '', // 如果是多个用逗号隔开
					status: ''
        },
      ],
      list: [
        {
          value: '0',
          label: '不通过'
        },
        {
          value: '1',
          label: '通过'
        }
      ],
      showAcceptanceSelect:false,
      acceptanceState:'1',
      schoolNameList: [],
      isTransfer:false,
    }
  },
  async mounted () {
   await this._getGroupClass()
   await this._getGroupDetail()
    this.showDetail()
    
  },
  
  methods: {
     //获取隐患级别基础数据
    async _getGroupClass() {
      let req = {
        page:"1",
        schoolCode:store.userInfo.schoolCode,
        size:'50'
      }
      const res = await actions.getGroupClass(req)
      this.dangerCategoryList = res.data.records||[]
    },
    //获取隐患处理人基础数据
    async _getGroupDetail() {
      let req = {
        schoolCode:store.userInfo.schoolCode,
      }
      const res = await actions.getGroupDetail(req)
      this.dangerHanderList = res.data.users||[]
    },
    async showDetail() {
      const res = await actions.dangerDetail(this.id)
      this.detailInfo = res.data
      //下拉选择赋值
      this.detailInfo.hasDispense = res.data.hasDispense==='1'?true:false
      this.categoryIndex = this.dangerCategoryList.findIndex(v=>v.name===this.detailInfo.categoryName)
      this.levelIndex = this.dangerLevelList.findIndex(v=>v.level===this.detailInfo.level)
      this.handerIndex = this.dangerHanderList.findIndex(v=>v.name===this.detailInfo.handerName)
      this.processesList = res.data.processes
    },
    //选择隐患类别
    chooseCategory(e){
      if(e.target.value===-1) return
      this.categoryIndex = e.target.value
      this.detailInfo.categoryCode = this.dangerCategoryList[this.categoryIndex].code
    },
    //选择等级
    chooseLevel(e){
      this.levelIndex = e.target.value
      this.detailInfo.level = this.dangerLevelList[this.levelIndex].level
    },
    //选择处理人
    chooseHander(e){
      if(e.target.value===-1) return
      //处理隐患转派
      this.handerIndex = e.target.value
      let selectName = this.dangerHanderList[this.handerIndex].name
      this.detailInfo.handlerCode = this.dangerHanderList[this.handerIndex].code
      this.detailInfo.handlerName = selectName
      if(this.state==='2'&&(store.userInfo.userName!==selectName)){
        this.isTransfer = true
      }else{
        this.isTransfer=false
      }
    },
    //验收下拉框
    confirm(e) {
      this.acceptanceState = e[0].value
      this._checkDanger()
    },
    async _checkDanger(){
      let text = this.acceptanceState==='1'?'验收':"不验收"
      this.$tools.confirm(`确定提交${text}结果吗？`, () => {
        let req = {
          optCode: store.userInfo.userCode,
          remark: this.detailInfo.acceptanceRemark,
          state: this.acceptanceState,
          taskId: this.id
        }
        actions.checkDanger(req).then(res=>{
          this.$tools.toast("验收操作成功", "success");
          this.$tools.goNext(() => {
            // eventBus.$emit('getList');
            this.$tools.navTo({
              url: `./index?state=${this.acceptanceState==='1'?'4':'2'}`,
            })
          });
        })
      })
    },
    async submitForm (type) {
      validateForm(yzForm, this.detailInfo, () => {
        if(type==='1'){ //为指派的时候需校验
          if(this.categoryIndex==-1){
            return this.$tools.toast('请选择隐患类别');
          }
          if(this.levelIndex==-1){
            return this.$tools.toast('请选择隐患等级');
          }
          if(this.handerIndex==-1){
            return this.$tools.toast('请选择隐患的处理人');
          }
          if(this.detailInfo.handleDuration===''||this.detailInfo.handleDuration===null||this.detailInfo.handleDuration>=72){
            return this.$tools.toast('处理完时间为72以内的数字');
          }
          this.$tools.confirm("确定指派该隐患吗？", () => {
            let req = {
              categoryCode: this.detailInfo.categoryCode, 
              countHourse: this.detailInfo.handleDuration,
              handlerCode: this.detailInfo.handlerCode,
              hasDispense: this.detailInfo.hasDispense?'1':'0',
              remark:this.detailInfo.assignRemark,
              id: this.id,
              level: this.detailInfo.level,
              optCode: store.userInfo.userCode,
            }
            actions.assignDanger(req).then(res=>{
              this.$tools.toast("指派成功", "success");
              this.$tools.goNext(() => {
                // eventBus.$emit('getList');
                this.$tools.navTo({
                  url: `./index?state=2`,
                })
              });
            })
          });
        }else if (type==='2'){
          let req = {
            handlerCode: this.detailInfo.handlerCode,
              handlerName: this.detailInfo.handlerName,
              optCode: store.userInfo.userCode,
              taskId: this.id
          }
          if(this.isTransfer){
          //转派
          this.$tools.confirm("确定转派隐患？", () => {
            actions.transferDanger(req).then(res=>{
              this.$tools.toast("转派成功", "success");
              this.$tools.goNext(() => {
                // eventBus.$emit('getList');
                this.$tools.navTo({
                  url: `./index?state=2`,
                })
              });
            })
          })
          }else{
            if(this.completePhotoUrls.length==0) return  this.$tools.toast('整改照片不能为空');
            //处理隐患
            let req = {
              completePhotos: this.completePhotoUrls.map(el => {
								return el.url
							}),
              optCode: store.userInfo.userCode,
              remark: this.detailInfo.rectifyRemark,
              taskId:  this.id
            }
            this.$tools.confirm("确定处理隐患？", () => {
              actions.dealDanger(req).then(res=>{
                this.$tools.toast("处理成功", "success");
                this.$tools.goNext(() => {
                  // eventBus.$emit('getList');
                  this.$tools.navTo({
                    url: `./index?state=3`,
                  })
                });
              })
            })
          }
        }else if (type==='3'){
          this.showAcceptanceSelect = true
        }
      })
     
      // this.$tools.navTo({
			// 		url: `./addDanger`,
			// 		title: ''
		  // })
    },
    perviewImg(img){
      uni.previewImage({
				urls: [img]
			});
    }
  }
}
</script>

<style lang="scss" scoped>
.scroll-h {
	height: calc(100vh - 88rpx);
}
.img{
    height: 150rpx;
    width: 156rpx;
  }
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
.radio {
	padding-left: 25rpx;
}
.checkbox {
	padding: 30rpx 10px 10px 2px;
}
.log {
	background: $uni-bg-color;
	padding: 20rpx 0rpx;
	margin: 20rpx 0 30rpx 0;
	border-bottom: 1px solid $u-border-color;
}
.al-r {
	text-align: right;
}
.scroll-h {
  height: calc(100vh - 120rpx);
  //  :nth-of-type(1)
  
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
