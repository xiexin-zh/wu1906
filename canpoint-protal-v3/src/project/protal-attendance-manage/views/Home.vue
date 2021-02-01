<template>
  <div class="attendance-home page-layout u-fx">
    <div class="total-left u-fx-f1 u-fx-ver">
      <div class="u-fx-f1 u-fx-ver u-type-white-bg u-padd-10 u-border-radius">
        <div class="title">教职工考勤</div>
        <div class="u-fx-f1">
          <attend-box :total-list="oneList" title="上午上班" :list="['正常', '迟到', '缺卡']"></attend-box>
          <attend-box type="pm" :total-list="twoList" title="上午下班" :list="['正常', '早退', '缺卡']"></attend-box>
          <attend-box :total-list="threeList" title="下午上班" :list="['正常', '迟到', '缺卡']"></attend-box>
          <attend-box type="pm" :total-list="fourList" title="下午下班" :list="['正常', '早退', '缺卡']"></attend-box>
        </div>
      </div>
      <div class="u-fx-f1 u-type-white-bg u-padd-10 u-mar-t u-border-radius">
        <div class="title">学生考勤</div>
        <div class="u-auto">
          <attend-box :total-list="fiveList" title="上学" :list="['正常', '迟到', '缺卡']"></attend-box>
          <attend-box type="pm" :total-list="sixList" title="放学" :list="['正常', '早退', '缺卡']"></attend-box>
        </div>
      </div>
    </div>
    <div class="total-right u-border-radius u-type-white-bg u-mar-l u-padd-10">
      <div class="title">考勤日期({{ currentDate }})</div>
      <a-calendar :fullscreen="false" @change="changeDate" />
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import moment from 'moment'
import AttendBox from '../component/AttendBox'
export default {
  name: 'Home',
  components: { AttendBox },
  computed: {
    ...mapState('home', ['schoolCode'])
  },
  data() {
    return {
      currentDate: '',
      oneList: [],
      twoList: [],
      threeList: [],
      fourList: [],
      fiveList: [],
      sixList: []
    }
  },
  mounted() {
    this.currentDate = this.$tools.getDate(new Date().getTime(), 1)
    this._attendView()
  },
  methods: {
    ...mapActions('home', ['attendView']),
    /**
     * 考勤统计列表
     */
    async _attendView() {
      const res = await this.attendView({
        schoolCode: 'CANPOINTLIVE',
        date: this.currentDate
      })
      const data = res.data[0]
      this.oneList = [data.morningOnNormalCount, data.morningOnLateCount, data.morningOnNoRecordCount]
      this.twoList = [data.morningOffNormalCount, data.morningOffEarlyCount, data.morningOffNoRecordCount]
      this.threeList = [data.noonOnNormalCount, data.noonOnLateCount, data.noonOnNoRecordCount]
      this.fourList = [data.noonOffNormalCount, data.noonOffEarlyCount, data.noonOffNoRecordCount]
      this.fiveList = [data.onNormalCount, data.lateCount, data.onNoRecordCount]
      this.sixList = [data.offNormalCount, data.earlyCount, data.offNoRecordCount]
    },
    changeDate(item) {
      this.currentDate = moment(item).format('YYYY-MM-DD')
      this._attendView()
    }
  }
}
</script>
<style lang="less" scoped>
.attendance-home {
  .title {
    font-size: 16px;
    height: 40px;
  }
  .total-right {
    width: 332px;
    background: url(../assets/img/home-bg.png) no-repeat center bottom;
    background-size: contain;
  }
}
</style>
