<template>
  <view>
    <scroll-view scroll-y="true" class="scroll-h">
      <view class="u-type-white-bg u-font-01 u-padd-l10">
        <view class="u-fx-ac u-bd-b u-padd-20">
          <view class="tip">值班员：</view>
          <view class="u-fx-f1 u-fx-je u-light-color" @click="add('1')">{{ formData.watch }}</view>
          <view class="rit-icon"></view>
        </view>
        <view class="u-fx-jsb u-bd-b u-padd">
          <view class="tip">值班员电话：</view>
          <view class="u-fx-f1 u-fx-je">
            <view class="u-fx-f1 u-fx-je u-light-color">{{ formData.watchPhone }}</view>
          </view>
        </view>
        <view class="u-fx-ac u-bd-b u-padd-20">
          <view class="tip">带班领导：</view>
          <view class="u-fx-f1 u-fx-je u-light-color" @click="add('2')">{{ formData.leader }}</view>
          <view class="rit-icon"></view>
        </view>
        <view class="u-fx-jsb u-bd-b u-padd">
          <view class="tip">带班领导电话：</view>
          <view class="u-fx-f1 u-fx-je">
            <view class="u-fx-f1 u-fx-je u-light-color">{{ formData.leaderPhone }}</view>
          </view>
        </view>
      </view>
    </scroll-view>
    <view class="footer-btn u-fx-ac">
      <u-button type="primary" class="u-fx-f1 u-mar-l u-mar-r u-type-primary-dark-bg" @click="submitForm"
        >开始值班</u-button
      >
    </view>
    <teacher-tree
      isRadio
      :teacherTag="teacherTag"
      v-show="teacherTag"
      :schoolInfo="schoolInfo"
      @close="teacherTag = false"
      @confirm="teacherSelcet"
      :classChecked="[]"
      ref="teacherTree"
      isClear
    ></teacher-tree>
  </view>
</template>

<script>
import teacherTree from '@/components/teacher-tree/teacher-tree'
import validateForm from '@u/validate'
import { store, actions } from './store/index.js'
const yzForm = {
  watch: '请选择值班员',
  leader: '请选择带班领导'
}
export default {
  components: {
    teacherTree
  },
  data() {
    return {
      detailInfo: {},
      formData: {
        watch: '请选择值班员',
        leader: '请选择带班领导'
      },
      teacherTag: false,
      causeNameList: [],
      schoolInfo: {
        schoolYearId: 0,
        schoolCode: ''
      },
      type: '1'
    }
  },
  created() {
    this.schoolInfo.schoolCode = store.userInfo.schoolCode
    this.schoolInfo.schoolYearId = store.schoolYear.schoolYearId
  },
  methods: {
    teacherSelcet(value) {
      if (value.length === 0) {
        this.$tools.toast('请选择人员')
        return
      }
      this.teacherTag = false
      if (this.type === '1') {
        this.formData.watch = value[0].name
        this.formData.watchAvatar = value[0].photoUrl
        this.formData.watchPhone = value[0].mobile
        this.formData.watchJob =  value[0].postDTOList ? value[0].postDTOList.map(el => el.postName) : [] //	值班人职务
      } else {
        this.formData.leader = value[0].name
        this.formData.leaderPhone = value[0].mobile
      }
    },
    add(type) {
      this.type = type
      this.teacherTag = true
    },
    submitForm() {
      validateForm(yzForm, this.formData, () => {
        let req = {
          ...this.formData,
          schoolCode: store.userInfo.schoolCode,
          reporterCode: store.userInfo.userCode,
          reporterName: store.userInfo.userName
        }
        actions.startDuty(req).then((res) => {
          this.$tools.goNext(() => {
            this.$tools.navTo({
              url: `./map?inspectId=${res.data}`
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
  height: calc(100vh - 120rpx);
  .content-title {
    height: 70rpx;
    background-color: #eee;
    align-items: center;
  }
  .add-item {
    align-items: center;
  }
}
.tip::before {
  position: absolute;
  z-index: 99;
  content: '*';
  top: 30rpx;
  color: red;
  font-weight: bold;
  left: 0;
}
.uni-input-placeholder {
  color: $u-light-color;
}
</style>
