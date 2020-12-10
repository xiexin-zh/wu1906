<template>
  <a-modal
    title="补卡"
    :destroyOnClose="true"
    v-model="dkTag"
    @ok="bkSubmit"
  >
    <a-form
      :form="form"
    >
      <a-form-item
        label="补卡类型"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 18 }"
      >
        <a-select
          v-decorator="[
            'taskType',
            {rules: [{ required: true, message: '请选择补卡类型!' }]}
          ]"
          placeholder="请选择补卡类型"
        >
          <a-select-option value="1">
            午间查寝
          </a-select-option>
          <a-select-option value="2">
            晚间查寝
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item
        label="进出方向"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 18 }"
      >
        <a-select
          :defaultValue="value === 5 ? '进' : '出'"
          disabled
          placeholder="请选择进出方向"
        >
          <a-select-option value="1">
            进
          </a-select-option>
          <a-select-option value="2">
            出
          </a-select-option>
        </a-select>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
export default {
  name: 'SignDialog',
  props: {
    value: {
      type: Number,
      default: 0
    }
  },
  computed: {
  },
  data () {
    return {
      dkTag: false,
      form: this.$form.createForm(this)
    }
  },
  methods: {
    bkSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          const data = {
            ...values,
            inOrOut: this.value === 5 ? 1 : 2
          }
          this.$emit('bk-submit', data)
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>

</style>
