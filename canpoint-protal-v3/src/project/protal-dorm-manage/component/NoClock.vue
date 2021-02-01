<template>
  <u-modal
    :width="800"
    title="不用打卡的日期"
    v-if="status"
    v-model="status"
    @confirm="submitOk"
  >
    <span class="u-mar-r20">选择日期:</span>
    <a-range-picker @change="onChange" :disabled-date="disabledDate" :allowClear="false"></a-range-picker>
  </u-modal>
</template>

<script>
import moment from 'moment'
import 'moment/locale/zh-cn'
export default {
  name: 'NoClock',
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
      current: ''
    }
  },
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    disabledDate(current) {
      return current && current < moment().endOf('day')
    },
    onChange(date, dateString) {
      console.log(date, dateString)
      this.current = dateString[0] === dateString[1] ? dateString[0] : `${dateString[0]}~${dateString[1]}`
    },
    submitOk() {
      if (this.current === '') {
        this.$message.warning('请选择日期')
        return
      }
      const data = { 'current': this.current }
      this.$emit('submit', data)
    }
  }
}
</script>

<style lang="less" scoped>
</style>
