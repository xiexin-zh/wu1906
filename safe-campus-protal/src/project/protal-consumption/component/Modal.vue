<template>
  <div>
    <a-modal
      :title="title"
      :visible="visible"
      @ok="handleOk"
      @cancel="close"
      :maskClosable="false"
      :width="width">
      <slot></slot>
    </a-modal>
  </div>
</template>
<script>
export default {
  name: 'Modal',
  props: {
    // 标题
    title: {
      type: String,
      default: '标题'
    },
    // 宽度
    width: {
      type: Number,
      default: 640
    }
  },
  data() {
    return {
      visible: false
    }
  },
  created() {
    // if (this.width > this.$config.modalWidth.large) {
    //   this.width = this.$config.modalWidth.large
    // }
    // if (this.width < this.$config.modalWidth.small) {
    //   this.width = this.$config.modalWidth.small
    // }
  },
  mounted() {},
  methods: {
    show() {
      this.visible = true
    },
    close() {
      this.visible = false
      this.$emit('close')
    },
    handleOk() {
      this.$emit('ok')
    }
  }
}
</script>
<style lang="less"></style>
