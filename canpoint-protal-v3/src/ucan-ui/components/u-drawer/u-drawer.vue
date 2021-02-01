<template>
  <a-drawer
    :closable="closable"
    :title="title"
    :width="width"
    :visible="value"
    :body-style="{ overflow: 'hidden', paddingBottom: '80px' }"
    @close="onClose"
  >
    <div class="drawer-box">
      <slot></slot>
    </div>
    <div
      :style="{
        position: 'absolute',
        right: 0,
        bottom: 0,
        width: '100%',
        borderTop: '1px solid #e9e9e9',
        padding: '10px 16px',
        background: '#fff',
        textAlign: 'right',
        zIndex: 1
      }"
    >
      <u-space>
        <u-button type="default" @click="onClose">取消</u-button>
        <u-button :loading="loading" v-if="isConfirm" type="primary" @click="confirm">确定</u-button>
      </u-space>
    </div>
  </a-drawer>
</template>

<script>
export default {
  name: 'UDrawer',
  props: {
    // 是否显示抽屉
    value: {
      type: Boolean,
      default: false
    },
    // 抽屉宽度
    width: {
      type: Number,
      default: 500
    },
    // 抽屉标题
    title: {
      type: String,
      default: ''
    },
    // 是否显示确定按钮
    isConfirm: {
      type: Boolean,
      default: true
    },
    // 是否显示关闭按钮
    closable: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      loading: false
    }
  },
  methods: {
    reset() {
      this.loading = false
    },
    onClose() {
      this.$emit('cancel')
      this.$emit('input', false)
    },
    confirm() {
      this.loading = true
      this.$emit('confirm')
    }
  }
}
</script>

<style lang="less" scoped>
.drawer-box {
  height: calc(100vh - 160px);
  overflow-y: scroll;
}
</style>
