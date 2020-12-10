<template>
  <a-modal
    width="800px"
    title="必须打卡的日期"
    v-model="status"
    @ok="submitOk"
    :maskClosable="false"
    :destroyOnClose="true"
    :confirmLoading="confirmLoading"
  >
    <div class="u-mar-b20">
      <span class="u-mar-r20">选择日期:</span>
      <a-date-picker
        :allowClear="false"
        :default-value="defaultValue"
        :disabled-date="disabledDate"
        @change="onChange"
      />
    </div>
    <div>
      <span class="u-mar-r20">考勤时间:</span>
      <a-time-picker
        format="HH:mm"
        :defaultValue="moment(startTime, 'HH:mm')"
        @change="(val, dateStrings) => changeTime(val, dateStrings, 'startTime')"
      />
      <span class="u-mar-l20 u-mar-r20">至</span>
      <a-time-picker
        format="HH:mm"
        :disabledHours="(val) => getDisabledHours(val)"
        :disabledMinutes="(val) => getDisabledMinutes(val)"
        :defaultValue="moment(endTime, 'HH:mm')"
        @change="(val, dateStrings) => changeTime(val, dateStrings, 'endTime')"
      />
    </div>
  </a-modal>
</template>

<script>
import moment from 'moment'
import 'moment/locale/zh-cn'
export default {
  name: 'AddClass',
  computed: {
    status: {
      get() {
        return this.value
      },
      set() {
        this.$emit('input', false)
      }
    }
  },
  data() {
    return {
      moment,
      confirmLoading: false,
      defaultValue: '',
      current: '',
      id: '',
      startTime: '00:00',
      endTime: '00:00'
    }
  },
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    reset() {
      this.confirmLoading = false
      this.current = ''
      this.id = ''
      this.startTime = '00:00'
      this.endTime = '00:00'
      this.$emit('input', false)
    },
    disabledDate(current) {
      return current && current < moment().endOf('day')
    },
    onChange(date, dateString) {
      this.current = dateString
    },
    changeTime(val, dateStrings, type) {
      if (type === 'startTime') {
        this.startTime = dateStrings
      } else {
        this.endTime = dateStrings
      }
    },
    getDisabledHours(val) {
      const hours = []
      const timeArr = this.startTime.split(':')
      for (var i = 0; i < parseInt(timeArr[0]); i++) {
        hours.push(i)
      }
      return hours
    },
    getDisabledMinutes(selectedHour) {
      const timeArr = this.startTime.split(':')
      const minutes = []
      if (selectedHour === parseInt(timeArr[0])) {
        for (var i = 0; i <= parseInt(timeArr[1]); i++) {
          minutes.push(i)
        }
      }
      return minutes
    },
    submitOk() {
      if (this.current === '') {
        this.$message.warning('请选择日期')
        return
      }
      if (this.startTime === '') {
        this.$message.warning('请选择考勤时间')
        return
      }
      if (
        parseInt(this.startTime.split(':')[0]) * 60 + parseInt(this.startTime.split(':')[1]) >=
        parseInt(this.endTime.split(':')[0]) * 60 + parseInt(this.endTime.split(':')[1])
      ) {
        this.$message.warning('考勤开始时间不能晚于结束时间')
        return
      }
      this.confirmLoading = true
      const data = { current: this.current, startTime: this.startTime, endTime: this.endTime, id: this.id || new Date().getTime() }
      this.$emit('submit', data)
    }
  }
}
</script>

<style lang="less" scoped>
</style>
