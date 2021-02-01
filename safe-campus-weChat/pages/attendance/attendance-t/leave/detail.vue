<template>
  <view class="class-detail">
    <scroll-view scroll-y="true" class="scroll-h">
      <detail-show :detail="detail"></detail-show>
      <view class="u-padd">
        <approval-step :data-list="dataList"></approval-step>
      </view>
      <view class="u-padd">
        <approval-step :data-list="copyList"></approval-step>
      </view>
    </scroll-view>
    <view class="footer-btn u-fx-ac" v-if="show">
      <u-button
        class="u-fx-f1 u-mar-l u-mar-r u-type-info-dark-bg u-type-white"
        @click="operate(0)"
      >拒绝</u-button>
      <u-button type="primary" class="u-fx-f1 u-mar-r u-type-primary-dark-bg" @click="operate(1)">通过</u-button>
      <u-button type="primary" class="u-mar-r u-type-primary-dark-bg" @click="operate(2)">同意并转交</u-button>
    </view>
    <teacher-tree
      v-if="show"
      isRadio
      :teacherTag="teacherTag"
      v-show="teacherTag"
      :schoolInfo="schoolInfo"
      @close="teacherTag = false"
      @confirm="teacherSelcet"
      :classChecked="[]"
    ></teacher-tree>
  </view>
</template>

<script>
import DetailShow from '../../component/DetailShow.vue'
import eventBus from '@u/eventBus'
import { store, actions } from '../store/index.js'
import teacherTree from '@/components/teacher-tree/teacher-tree'
export default {
  components: {
    DetailShow,
    teacherTree
  },
  data() {
    return {
      detail: {},
      dataList: [],
      id: '',
      teacherTag: false,
      schoolInfo: {
        schoolYearId: 0,
        schoolCode: ''
      },
      show: false,
      copyList: []
    }
  },
  created() {
    this.schoolInfo.schoolCode = store.userInfo.schoolCode
    this.schoolInfo.schoolYearId = store.schoolYear.schoolYearId
  },
  mounted() {
    this.id = this.$tools.getQuery().get('id')
    this.getDetail()
  },
  methods: {
    async getDetail() {
      const req = {
        oddNumbers: this.id,
        userCode: store.userInfo.userCode
      }
      const res = await actions.getLeaveDetail(req)
      this.detail = res.data
      this.show = res.data.optState === '0' && this.$tools.getQuery().get('current') === '2'
      this.copyList = res.data.leaveCopyList.map((el) => {
        return {
          dateTime: el.readTime ? this.$tools.getDateTime(el.readTime, 'dateTime') : '',
          label: '抄送人',
          labelName: el.userName,
          statusName: el.state === '1' ? '已读' : '未读',
          state: el.state === '1' ? 1 : 0, // 此状态只有两种值，1：为已审批的  0：为其他状态
          photoUrl: el.photoUrl
        }
      })
      this.dataList = res.data.leaveApprovalAddDto.map((el) => {
        return {
          dateTime: el.updateTime ? this.$tools.getDateTime(el.updateTime, 'dateTime') : '',
          label: '审批人',
          labelName: el.userName,
          statusName:
            el.state === '0'
              ? '待审批'
              : el.state === '1'
              ? '审批通过'
              : el.state === '2'
              ? '审批未通过'
              : el.state === '4'
              ? '审批中'
              : '',
          state: el.state === '1' ? 1 : 0, // 此状态只有两种值，1：为已审批的  0：为其他状态
          photoUrl: el.photoUrl
        }
      })
    },
    teacherSelcet(value) {
      if (value.length === 0) {
        this.$tools.toast('请选择人员')
        return
      }
      if (value[0].userCode === store.userInfo.userCode) {
        this.$tools.toast('转交人不可选自己')
        return false
      }
      this.teacherTag = false
      this.approvalList = []
      this.approvalList = value.map((el) => {
        return {
          currentApproverCode: store.userInfo.userCode,
          oddNumbers: this.id,
          photoUrl: el.photoUrl, // 照片
          schoolCode: store.userInfo.schoolCode,
          approverCode: el.userCode,
          approverName: el.userName
        }
      })
      actions.forwardLeave(this.approvalList[0]).then((res) => {
        this.$tools.toast('操作成功')
        this.$tools.goNext(() => {
          eventBus.$emit('getList')
          this.$tools.goBack()
        })
      })
    },
    operate(type) {
      if (type === 1 || !type) {
        const title = type ? '通过' : '拒绝'
        const req = {
          oddNumbers: this.id,
          newState: type === 0 ? '2' : '1',
          schoolCode: store.userInfo.schoolCode,
          approverCode: store.userInfo.userCode
        }
        this.$tools.confirm(`确定${title}这条请假申请吗?`, () => {
          actions.approvalLeave(req).then((res) => {
            this.$tools.toast('操作成功')
            this.$tools.goNext(() => {
              eventBus.$emit('getList')
              this.$tools.goBack()
            })
          })
        })
      } else {
        this.teacherTag = true
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.class-detail {
  .scroll-h {
    height: calc(100vh - 100rpx);
  }
}
</style>
