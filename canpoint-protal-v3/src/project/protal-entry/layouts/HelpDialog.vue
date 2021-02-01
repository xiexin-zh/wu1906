<template>
  <a-modal
    width="900px"
    :title="'操作指南：' + helpInfo.title"
    :visible="value"
    @cancel="closeTag"
    :footer="null"
  >
    <div style="height: 650px; overflow: auto">
      <div v-html="helpInfo.content"></div>
    </div>
  </a-modal>
</template>
<script>
export default {
  props: {
    value: {
      type: Boolean
    },
    helpInfo: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  methods: {
    closeTag() {
      this.$emit('input', false)
    }
  }
}
</script>
<style lang="less" scoped>
/deep/ .ant-modal-body {
  margin-top: 0px !important;
}
</style>
