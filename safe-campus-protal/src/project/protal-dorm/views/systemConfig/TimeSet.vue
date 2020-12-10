<template>
  <div class="timePage">
    <div class="time-left">
      <!-- 统计周期 -->
      <div class="stat-period">
        <div class="period-title">每日统计周期</div>
        <div class="period-body">
          <div style="margin: 24px 0 24px 0;">
            <a-form ref="periodForm" :model="periodForm">
              <a-row
                :gutter="40"
                type="flex"
                align="middle"
                style="margin-top: 50px; padding-left: 38px;"
              >
                <a-col>
                  <a-form-item label="当日:" :label-col="{ span: 6 }" :wrapper-col="{ span: 8 }">
                    <a-time-picker
                      :allowEmpty="false"
                      :value="periodForm.currentDayVal"
                      v-model="periodForm.currentDayVal">
                    </a-time-picker>
                  </a-form-item>
                </a-col>
                <a-col>
                  <a-form-item label="次日:" :label-col="{ span: 6 }" :wrapper-col="{ span: 8 }">
                    <a-time-picker
                      :allowEmpty="false"
                      :value="periodForm.currentDayVal"
                      v-model="periodForm.currentDayVal">
                    </a-time-picker>
                  </a-form-item>
                </a-col>
                <a-col>
                  <a-form-item>
                    <a-button type="primary" @click="periodSave">保存</a-button>
                  </a-form-item>
                </a-col>
              </a-row>
            </a-form>
          </div>
        </div>
      </div>
      <!-- 预警设置 -->
      <div class="early-warning">
        <div class="warning-title">预警设置</div>
        <div class="early-warning">
          <a-form ref="warningForm" :model="warningForm" style="margin: 24px 0 24px 0;">
            <!-- <a-row type="flex">
              <a-col :span="24">
                <a-form-item label="查寝后未归提醒" :label-col="{span:8}" :wrapper-col="{span:16}">
                  <a-input-number
                    value=""
                    v-model="warningForm.noReturnNotice"
                    controls-position="right"
                    @change="handleChange"
                    :min="0"
                    :max="10"></a-input-number>
                </a-form-item>
              </a-col>
            </a-row>-->
            <a-row>
              <a-col :span="24">
                <a-form-item label="通知人员:" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
                  <a-checkbox-group v-model="warningForm.noticer">
                    <a-checkbox value="1" label="1">家长</a-checkbox>
                    <!-- <a-checkbox value="2" label="2">保安</a-checkbox>
                    <a-checkbox value="3" label="3">宿管</a-checkbox>
                    <a-checkbox value="4" label="4">班主任</a-checkbox>
                    <a-checkbox value="5" label="5">值日老师</a-checkbox>-->
                  </a-checkbox-group>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="12">
                <a-form-item label="深夜外出报警时间:" :label-col="{ span: 16 }" :wrapper-col="{ span: 4 }">
                  <a-time-picker
                    :allowEmpty="false"
                    :value="warningForm.warnStartDate"
                    v-model="warningForm.warnStartDate"
                    v-decorator="['time-picker', {
                      rules: [{ type: 'object', required: true }],
                    }]">
                  </a-time-picker>
                </a-form-item>
              </a-col>
              <a-col :span="4">
                <a-form-item label-width="72px">
                  <a-time-picker
                    :allowEmpty="false"
                    :value="warningForm.warnEndDate"
                    v-model="warningForm.warnEndDate"
                    v-decorator="['time-picker', {
                      rules: [{ type: 'object', required: true}],
                    }]">
                  </a-time-picker>
                </a-form-item>
              </a-col>
              <a-col :span="4">
                <a-form-item label="次日:" :label-col="{ span: 12 }" :wrapper-col="{ span: 12 }">
                  <a-checkbox
                    style="margin-left: 8px"
                    :checked="warningForm.hasNextDay"
                    @change="handleNextDayChange"
                  ></a-checkbox>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="24">
                <a-form-item label="是否启用预警设置:" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
                  <a-checkbox :checked="warningForm.hasEnable" @change="handleWarningChange"></a-checkbox>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="24">
                <a-form-item style="text-align:center">
                  <a-button type="primary" @click="warningSave">保存</a-button>
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </div>
      </div>
      <!-- 查寝计划 -->
      <div class="bedtime-plan">
        <div class="plan-title">查寝计划</div>
        <div class="plan-body">
          <a-form
            ref="planForm"
            :model="planForm"
            style="margin: 24px 0 24px 0;"
            label-width="120px"
          >
            <a-row>
              <a-col :span="6">
                <a-form-item label="午休签到时间:" :label-col="{ span: 12 }" :wrapper-col="{ span: 12 }">
                  <a-time-picker
                    :allowEmpty="false"
                    :value="planForm.noonStartTime"
                    v-model="planForm.noonStartTime"
                    v-decorator="['time-picker', {
                      rules: [{ type: 'object', required: true}],
                    }]"
                    placeholder="">
                  </a-time-picker>
                </a-form-item>
              </a-col>
              <a-col :span="4">
                <a-form-item
                  label-width="52px"
                  :label-col="{ span: 12 }"
                  :wrapper-col="{ span: 12 }"
                >
                  <a-time-picker
                    :allowEmpty="false"
                    :value="planForm.noonEndTime"
                    v-model="planForm.noonEndTime"
                    v-decorator="['time-picker', {
                      rules: [{ type: 'object', required: true}],
                    }]">
                  </a-time-picker>
                </a-form-item>
              </a-col>
              <a-col :span="2">
                <a-form-item label-width="0px">
                  <a-checkbox value :checked="planForm.noonStat" @change="handlePlanNoonChange">启用</a-checkbox>
                </a-form-item>
              </a-col>
              <a-col :span="4">
                <a-button type="primary" style="margin-top: 5px;" @click="planSave(1)">保存</a-button>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="6">
                <a-form-item label="晚间签到时间:" :label-col="{ span: 12 }" :wrapper-col="{ span: 12 }">
                  <a-time-picker
                    :allowEmpty="false"
                    :value="planForm.nightStartTime"
                    v-model="planForm.nightStartTime"
                    v-decorator="['time-picker', {
                      rules: [{ type: 'object', required: true}],
                    }]">
                  </a-time-picker>
                </a-form-item>
              </a-col>
              <a-col :span="4">
                <a-form-item
                  label-width="52px"
                  :label-col="{ span: 12 }"
                  :wrapper-col="{ span: 12 }"
                >
                  <a-time-picker
                    :allowEmpty="false"
                    :value="planForm.nightEndTime"
                    v-model="planForm.nightEndTime"
                    v-decorator="['time-picker', {
                      rules: [{ type: 'object', required: true}],
                    }]">
                  </a-time-picker>
                </a-form-item>
              </a-col>
              <a-col :span="2">
                <a-form-item label-width="0px">
                  <a-checkbox :checked="planForm.nightStat" @change="handlePlanNightChange">启用</a-checkbox>
                </a-form-item>
              </a-col>
              <a-col :span="4">
                <a-button type="primary" style="margin-top: 5px;" @click="planSave(2)">保存</a-button>
              </a-col>
            </a-row>
          </a-form>
        </div>
      </div>
    </div>
    <div class="time-right">
      <!-- 提示信息 -->
      <div class="time-tips">
        <div class="tips-title">提示:</div>
        <div class="tips-body">
          <p>1.每日统计周期指的是每天学生进出统计的时间范围，如果设置的时间超出晚上00:00，勾选“次日”再选择时间，此时间可不设置，默认自然日（00:00-次日0:00）；</p>
          <p>2.晚归时间：查寝时间到每日统计周期的截止时间回宿舍的学生都算晚归，每日统计周期截止时间没有回宿舍的学生为当天未归；</p>
          <p>3.设置深夜外出报警时间段，则这个时间段内出宿舍的学生，系统会进行声光报警，并推送给家长、保安、宿管和班主任、值日老师；</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import mixins from '@u/mixins'
import { mapActions } from 'vuex'
import moment from 'moment'
export default {
  name: 'TimeSet',
  mixins: [mixins],
  data() {
    return {
      planForm: {
        noonStartTime: null,
        noonEndTime: null,
        nightStartTime: null,
        nightEndTime: null,
        noonStat: false,
        nightStat: false
      },
      warningForm: {
        // noReturnNotice: 0,
        hasEnable: false,
        warnStartDate: null,
        warnEndDate: null,
        noticer: [],
        hasNextDay: false
      },
      periodForm: {
        currentDayVal: null
      }
    }
  },
  mounted() {
    this.loadDailyPeriodData()
    this.loadWarningData()
    this.loadPlanData()
  },
  methods: {
    ...mapActions('timeSet', [
      'getCycleList',
      'getWarningSetDetail',
      'getSignTaskInfoList',
      'updateSignTaskInfo',
      'updateWarningSet',
      'updateStatCycle'
    ]),
    handleChange() {},
    handlePlanNoonChange(e) {
      // console.log('night', e)
      this.planForm.noonStat = e.target.checked
    },
    handlePlanNightChange(e) {
      // console.log('night', e)
      this.planForm.nightStat = e.target.checked
    },
    handleWarningChange(e) {
      this.warningForm.hasEnable = e.target.checked
    },
    handleNextDayChange(e) {
      this.warningForm.hasNextDay = e.target.checked
    },
    loadDailyPeriodData() {
      this.getCycleList({
        schoolCode: sessionStorage.getItem('schoolScheme')
      }).then(res => {
        if (res.data) {
          this.periodForm.currentDayVal = moment(new Date(res.data.startTime), 'HH:mm:ss')
        }
      })
    },
    loadWarningData() {
      this.getWarningSetDetail({ schoolCode: sessionStorage.getItem('schoolScheme') }).then(res => {
        if (res.data) {
          this.warningForm.hasEnable = res.data.state
          this.warningForm.hasNextDay = res.data.warningNextDay
          this.warningForm.noticer = res.data.warningPersonType.split(',')
          // this.warningForm.noticer = res.data.persons
          // this.warningForm.noReturnNotice = res.data.notReturnRemind
          this.warningForm.warnStartDate = moment(new Date(res.data.startWarning), 'HH:mm:ss')
          this.warningForm.warnEndDate = moment(new Date(res.data.endWarning), 'HH:mm:ss')
        }
      })
    },
    loadPlanData() {
      this.getSignTaskInfoList({ schoolCode: sessionStorage.getItem('schoolScheme') }).then(res => {
        if (res.data.length > 0) {
          res.data.forEach(item => {
            if (item.taskType === '1') {
              // 午休查寝
              this.planForm.noonStartTime = moment(new Date(item.startTime), 'HH:mm:ss')
              this.planForm.noonEndTime = moment(new Date(item.endTime), 'HH:mm:ss')
              this.planForm.noonStat = item.taskState
            } else {
              // 晚间查寝
              this.planForm.nightStartTime = moment(new Date(item.startTime), 'HH:mm:ss')
              this.planForm.nightEndTime = moment(new Date(item.endTime), 'HH:mm:ss')
              this.planForm.nightStat = item.taskState
            }
          })
        }
      })
    },
    planSave(type) {
      const noonEndTime = this.$tools.getDate(new Date(), 1) + ' ' + moment(this.planForm.noonEndTime).format('HH:mm:ss')
      const nightEndTime = this.$tools.getDate(new Date(), 1) + ' ' + moment(this.planForm.nightEndTime).format('HH:mm:ss')
      const noonStartTime = this.$tools.getDate(new Date(), 1) + ' ' + moment(this.planForm.noonStartTime).format('HH:mm:ss')
      const nightStartTime = this.$tools.getDate(new Date(), 1) + ' ' + moment(this.planForm.nightStartTime).format('HH:mm:ss')
      const noonStat = !!this.planForm.noonStat
      const nightStat = !!this.planForm.nightStat
      if (type === 1) {
        // valid noon time
        if (noonStartTime >= noonEndTime) {
          this.$message.warning('午休签到结束时间必须大于开始时间')
          return
        }
        if (noonEndTime >= nightStartTime) {
          this.$message.warning('午休签到结束时间必须小于晚间签到开始时间')
          return
        }
      } else {
        // valid night time
        if (nightStartTime < noonEndTime) {
          this.$message.warning('晚间签到开始时间必须大于午休结束时间')
          return
        }
        if (nightStartTime >= nightEndTime) {
          this.$message.warning('晚间签到结束时间必须大于开始时间')
          return
        }
      }
      const req = {
        endTime: type === 1 ? noonEndTime : nightEndTime,
        schoolCode: sessionStorage.getItem('schoolScheme'),
        schoolName: sessionStorage.getItem('schoolName'),
        startTime: type === 1 ? noonStartTime : nightStartTime,
        stat: type === 1 ? noonStat : nightStat,
        taskName: type === 1 ? '午休查寝' : '晚间查寝',
        taskType: type.toString()
      }
      this.updateSignTaskInfo(req).then(res => {
        this.$message.success('保存成功!')
      })
    },
    warningSave() {
      // 次日不生效，校验结束时间大于开始时间
      const warnStartDate = this.$tools.getDate(new Date(), 1) + ' ' + moment(this.warningForm.warnStartDate).format('HH:mm:ss')
      const warnEndDate = this.$tools.getDate(new Date(), 1) + ' ' + moment(this.warningForm.warnEndDate).format('HH:mm:ss')
      if (!this.warningForm.hasNextDay && warnStartDate >= warnEndDate) {
        this.$message.warning('预警结束时间必须大于开始时间！')
        return false
      }
      const date = {
        warnStartDate: warnStartDate,
        warnEndDate: warnEndDate
      }
      const req = Object.assign({}, this.warningForm, date, {
        schoolCode: sessionStorage.getItem('schoolScheme')
      })
      this.updateWarningSet(req).then(res => {
        this.$message.success('预警设置成功!')
      })
    },
    periodSave () {
      const currentDayVal = this.$tools.getDate(new Date(), 1) + ' ' + moment(this.periodForm.currentDayVal).format('HH:mm:ss')
      const req = {
        startTime: currentDayVal,
        endTime: currentDayVal,
        schoolCode: sessionStorage.getItem('schoolScheme')
      }
      this.updateStatCycle(req).then(res => {
        this.$message.success('保存成功!')
      })
    }
  }
}
</script>
<style lang="less" scoped>
/* 时间设置页面 */
.timePage {
  width: 100%;
  height: 100%;
  background-color: #f6f5fa;
  padding: 10px 0px 0px 12px;
  display: flex;
}
.time-left {
  margin-bottom: 10px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.time-right {
  border-radius: 4px;
  width: 400px;
  margin-left: 10px;
  margin-bottom: 1px;
  padding: 15px;
  background-color: #fff;
}

.stat-period {
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 10px 10px 15px #e8ecf3;
}

.early-warning {
  flex: 1;
  margin: 10px 0;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 10px 10px 15px #e8ecf3;
}

.bedtime-plan {
  flex: 1;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 10px 10px 15px #e8ecf3;
}

.period-title,
.warning-title,
.plan-title,
.tips-title {
  font-size: 17px;
  color: #409eff;
  font-weight: 600;
  border-bottom: 1px solid rgb(241, 241, 241);
}

.period-title {
  height: 55px;
  padding: 10px 0px 0px 25px;
}

.warning-title {
  height: 47px;
  padding: 12px 0px 0px 25px;
}

.plan-title {
  height: 47px;
  padding: 10px 0px 0px 25px;
}
.time-tips {
  height: 100%;
}
.tips-title {
  height: 34px;
}
.tips-body {
  padding-top: 24px;
}
.tips-body p {
  margin-bottom: 10px;
  line-height: 22px;
  color: #666;
  font-size: 14px;
  font-family: '微软雅黑';
}
</style>
