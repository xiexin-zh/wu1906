<template>
  <a-popover placement="bottomRight" trigger="click" v-model="visible" arrow-point-at-center>
    <template slot="content">
      <div class="u-padd-t10 u-padd-b10 u-fx-ver">
        <div class="u-fx">
          <img
            class="photo u-mar-r20"
            :src="studentInfo.photoUrl"
            alt=""
          />
          <u-space direction="vertical" :vSize="10">
            <span>姓名：{{ studentInfo.userName }}</span>
            <span>班级：{{ studentInfo.gradeName }}{{ studentInfo.className }}</span>
            <span>学号：{{ studentInfo.workNo }}</span>
            <span>性别：{{ studentInfo.gender | getSex }}</span>
            <span>班主任：{{ studentInfo.teacherNameMobile }}</span>
            <span>家长：{{ studentInfo.parentNameMobile }}</span>
          </u-space>
        </div>
        <div slot="action" class="u-fx-jc">
          <u-button
            v-if="canEdit"
            type="light"
            class="u-mar-r20 u-mar-t20"
            @click="studentAction(0)"
            delete
            content="确定将选中人员退宿吗？"
          >退宿</u-button
          >
          <u-button
            v-if="canEdit"
            type="primary"
            class="u-mar-t20"
            @click="studentAction(1, studentInfo)"
          >调宿</u-button
          >
          <u-button
            v-if="realCheckTag"
            type="primary"
            class="u-mar-t20"
            @click="studentAction(2, studentInfo)"
          >补卡</u-button
          >
        </div>
      </div>
    </template>
    <slot name="button"></slot>
  </a-popover>
</template>

<script>
// import autoUser from '@a/img/auto-user.png'
import { mapState, mapActions } from 'vuex'
export default {
  name: 'StudentCard',
  props: {
    // 是否可编辑
    canEdit: {
      type: Boolean,
      default: false
    },
    // 实时查寝补卡
    realCheckTag: {
      type: Boolean,
      default: false
    },
    // 宿舍code
    roomCode: {
      type: String,
      default: ''
    },
    // 学生信息
    student: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      visible: false,
      studentInfo: {}
    }
  },
  watch: {
    visible: {
      handler(n, o) {
        if (n) this._getStudentInfo()
      },
      immediate: true
    }
  },
  computed: {
    ...mapState('home', ['schoolCode'])
  },
  methods: {
    ...mapActions('home', ['getStudentInfo']),
    // 查询学生详细信息
    async _getStudentInfo() {
      const res = await this.getStudentInfo({
        schoolCode: this.schoolCode,
        schoolYearCode: this.student.schoolYearCode,
        userCode: this.student.userCode,
        gradeCode: this.student.gradeCode
      })
      this.studentInfo = res.data
    },
    /**
     * 学生操作
     * @param { type } Number 操作类型： 0.退宿 1.调宿 2.补卡
     * @param { item } Object 操作对象
     */
    studentAction(type) {
      this.visible = false
      this.studentInfo.roomCode = this.roomCode
      this.$emit('studentAction', type, this.studentInfo)
    }
  }
}
</script>

<style lang="less" scoped>
.photo {
  width: 120px;
  height: 160px;
}
</style>
