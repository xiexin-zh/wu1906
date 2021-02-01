<template>
  <a-row class="u-alert">
    <a-alert
      @close="close"
      :description="description"
      :close-text="closeText"
      :closable="closable"
      :type="type"
      :message="title"
      :show-icon="showIcon"
    ></a-alert>
  </a-row>
</template>

<script>
export default {
  name: 'UAlert',
  props: {
    // 提示框类型
    // 成功:success 警告:warning 失败:error 信息:info
    type: {
      type: String,
      default: 'info'
    },
    // 警告标题
    message: {
      type: [Boolean, String],
      default: false
    },
    // 警告详情
    description: {
      type: String,
      default: ''
    },
    // 是否显示关闭按钮
    closable: {
      type: Boolean,
      default: false
    },
    // 是否显示关闭文本
    closeText: {
      type: String,
      default: ''
    },
    // 是否显示图标
    showIcon: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {}
  },
  computed: {
    title() {
      if (this.message && typeof this.message === 'string') {
        return this.message
      } else if (this.message) {
        return '温馨提示'
      } else {
        return ''
      }
    }
  },
  mounted() {},
  methods: {
    close() {
      this.$emit('close')
    }
  }
}
</script>

<style lang="less" scoped>
/deep/ .ant-alert-success,
.ant-alert-info,
.ant-alert-error,
.ant-alert-warning {
  border: none !important;
}
</style>
