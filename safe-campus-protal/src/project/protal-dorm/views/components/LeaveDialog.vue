<template>
  <a-modal
    title="请假"
    :destroyOnClose="true"
    v-model="leaveTag"
    @ok="leaveSubmit"
  >
    <a-form
      :form="form"
    >
      <a-form-item
        label="请假类型"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 18 }"
      >
        <a-select
          v-decorator="[
            'leaveType',
            {rules: [{ required: true, message: '请选择请假类型!' }]}
          ]"
          placeholder="请选择请假类型"
        >
          <a-select-option value="1">
            事假
          </a-select-option>
          <a-select-option value="2">
            病假
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 18 }"
        label="请假日期"
      >
        <a-range-picker
          v-decorator="['range-time-picker', rangeConfig]"
          show-time
          format="YYYY-MM-DD HH:mm:ss"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import mixins from '@u/mixins'
export default {
  name: 'LeaveDialog',
  mixins: [mixins],
  props: {
  },
  computed: {
  },
  data () {
    return {
      leaveTag: false,
      form: this.$form.createForm(this),
      rangeConfig: {
        rules: [{ type: 'array', required: true, message: '请选择日期!' }]
      }
    }
  },
  methods: {
    leaveSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          const startTime = this.getDateTime(values['range-time-picker'][0]._d, 1)
          const endTime = this.getDateTime(values['range-time-picker'][1]._d, 1)
          this.$emit('leave-submit', {
            leaveType: values.leaveType,
            startTime,
            endTime
          })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>

</style>
