<template>
  <a-tag
    :style="{
      cursor: pointer ? 'pointer' : 'auto'
    }"
    @click.stop="change"
    @close.stop="close"
    :visible="visible"
    :closable="closable"
    :color="type ? colorList[type] : color"
  >
    <slot></slot>
  </a-tag>
</template>

<script>
export default {
  name: 'UTag',
  props: {
    // 标签类型
    type: {
      type: String,
      required: false,
      default: ''
    },
    // 标签色值
    color: {
      type: String,
      default: ''
    },
    // 是否有关闭标签
    closable: {
      type: Boolean,
      default: false
    },
    // 是否显示标签
    visible: {
      type: Boolean,
      default: true
    },
    // 是否可以点击
    pointer: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data() {
    return {
      colorList: {
        primary: '#a0cfff',
        'primary-bd': 'blue',
        success: '#71d5a1',
        'success-bd': 'green',
        error: '#fab6b6',
        'error-bd': 'red',
        warning: '#fcbd71',
        'warning-bd': 'orange',
        info: '#c8c9cc',
        'info-bd': '#c8c9cc'
      }
    }
  },
  mounted() {},
  methods: {
    change(e) {
      this.$emit('change')
    },
    close(e) {
      this.$emit('close')
    }
  }
}
</script>

<style lang="less" scoped></style>
