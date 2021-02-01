<template>
  <a-modal
    :closable="closable"
    :width="width"
    :title="title"
    :visible="value"
    @cancel="handleCancel"
  >
    <slot></slot>
    <template slot="footer">
      <u-button type="default" @click="handleCancel">{{ cancelText }}</u-button>
      <u-button v-if="isOk" type="primary" :loading="confirmLoading" @click="handleOk">{{ okText }}</u-button>
    </template>
  </a-modal>
</template>

<script>
export default {
  name: 'UModal',
  props: {
    // 标题
    title: {
      type: String,
      default: ''
    },
    // 是否显示
    value: {
      type: Boolean,
      default: false
    },
    // 弹出层宽度
    width: {
      type: Number,
      default: 600
    },
    // 是否显示关闭按钮
    closable: {
      type: Boolean,
      default: false
    },
    // 是否显示确定按钮
    isOk: {
      type: Boolean,
      default: true
    },
    // 确认按钮文本
    okText: {
      type: String,
      default: '确定'
    },
    // 取消按钮文本
    cancelText: {
      type: String,
      default: '取消'
    },
    // 点击确定按钮后是否loading
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      confirmLoading: false
    }
  },
  mounted() {},
  methods: {
    reset() {
      this.confirmLoading = false
    },
    handleOk() {
      if (this.loading) {
        this.confirmLoading = true
      }
      this.$emit('confirm')
    },
    handleCancel() {
      this.$emit('cancel')
      this.$emit('input', false)
    }
  }
}
</script>

<style lang="less" scoped></style>
