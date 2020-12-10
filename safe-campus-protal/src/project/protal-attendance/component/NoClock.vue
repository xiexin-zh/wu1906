<template>
  <a-modal
    width="800px"
    title="不用打卡的日期"
    v-model="status"
    @ok="submitOk"
    :maskClosable="false"
    :destroyOnClose="true"
    :confirmLoading="confirmLoading"
  >
    <span class="u-mar-r20">选择日期:</span>
    <a-range-picker @change="onChange" :disabled-date="disabledDate" :allowClear="false"></a-range-picker>
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
    reset() {
      this.confirmLoading = false
      this.$emit('input', false)
    },
    submitOk() {
      if (this.current === '') {
        this.$message.warning('请选择日期')
        return
      }
      this.confirmLoading = true
      const data = { 'current': this.current }
      this.$emit('submit', data)
    }
  }
}
</script>

<style lang="less" scoped>
</style>
