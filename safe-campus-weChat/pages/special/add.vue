<template>
	<view>
    <u-select v-model="userTag" :list="causeNameList" @confirm="confirm"></u-select>
		<scroll-view scroll-y="true" class="scroll-h ">
			<view class="u-type-white-bg">
				<view class="u-fx u-padd-20">
          <view >检查项：</view>
          <input class="u-fx-f1 u-font-01" v-model="formData.description" />
				</view>
        	<an-upload-img v-model="formData.photoUrl" total="9" style="margin: 20rpx"></an-upload-img>
			</view>
      <view class="u-type-white-bg u-mar-t20">
        <view class="u-fx-ac u-bd-b u-padd-20">
          <view >隐患地点：</view>
          <view class="u-fx-f1 u-fx-je u-light-color u-tx-r">
            <input class="u-font-01 " v-model="formData.address" placeholder="请填写您发现的隐患地点" />
          </view>
        </view>
        <view class="u-fx-ac u-bd-b u-padd-20">
          <view>负责人：</view>
          <view class="u-fx-f1 u-fx-je u-light-color" @click="userTag =  true">
            {{formData.leaderName}}
          </view>
          <view class="rit-icon"></view>
        </view>
        <view class="u-fx-ac u-bd-b u-padd-20">
          <view >是否已处理：</view>
          <view class="u-fx-f1 u-fx-je ">
            <view >否</view>
            <u-switch size='40' class="u-mar-l10 u-mar-r10" v-model="formData.hasDispose"></u-switch>
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
  import validateForm from '@u/validate';
  import anUploadImg from '@/components/an-uploadImg/an-uploadImg'
  import { store, actions } from './store/index.js'
  const yzForm = {
    description: '请输入你的隐患描述',
    address: '请填写您发现的隐患地点'
  }
  export default {
    components: {
      anUploadImg
    },
    data () {
      return {
        causeNameList: [],
        formData: {
          description:"",
          address:'',
          hasDispose: false,
          photoUrl: [],
          leaderName: '请选择隐患处理负责人',
        },
        specialResultId: '',
        userTag: false,
        state: '',
        spcialId: ''
      }
    },
    mounted () {
      this.formData.description = this.$tools.getQuery().get('name')
      this.specialResultId = this.$tools.getQuery().get('id')
      this.state = this.$tools.getQuery().get('state')
      this.spcialId = this.$tools.getQuery().get('spcialId')
      this.getUserList()
    },
    methods: {
      //获取负责人数据
      async getUserList () {
        const res = await actions.getGroupDetail({ schoolCode: store.userInfo.schoolCode })
        this.causeNameList = res.data.leaders.map(el=>{
          return {
            ...el,
            value: el.code,
            label: el.name
          }
        })
      },
      confirm(e) {
        this.formData.leaderCode = e[0].value
        this.formData.leaderName = e[0].label
      },
      submitForm () {
        validateForm(yzForm, this.formData, () => {
          if (!this.formData.leaderCode) {
            return this.$tools.toast('请选择负责人')
          }
          this.$tools.confirm("确定上报隐患吗？", () => {
             let req = {
              ...this.formData,
              schoolCode: store.userInfo.schoolCode,
              schoolName: store.userInfo.schoolName,
              reporterCode: store.userInfo.userCode,
              reporterName: store.userInfo.userName,
              reporterPhotoUrl: store.userInfo.photoUrl,
              specialResultId: this.specialResultId
            }
            req.photoUrl = this.formData.photoUrl.map(el => {
              if (el.indexOf('http') === -1) {
                return el.split(',')[1]
              } else {
                return el
              }
            })
            actions.reportDanger(req).then(res => {
              this.$tools.toast('上报成功')
              this.$tools.goNext(() => {
                // eventBus.$emit('getList')
                this.$tools.navTo({
                  url: `./submit?id=${this.spcialId}&state=${this.state}`
                })
              })
            })
          })
         })
      }
    }
  }
</script>

<style lang="scss" scoped>
.scroll-h {
  height: calc(100vh - 120rpx)
}
.uni-input-placeholder {
  color: $u-light-color;
}
</style>
