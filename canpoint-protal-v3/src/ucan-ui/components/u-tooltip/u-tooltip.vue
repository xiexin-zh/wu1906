<template>
  <a-tooltip :mouseLeaveDelay="mouseLeaveDelay" :placement="placement">
    <template slot="title">
      <span>{{ newTitle }}</span>
    </template>
    <span :class="className">{{ newLabel }}</span>
  </a-tooltip>
</template>

<script>
export default {
  name: 'UTag',
  props: {
    // 文本样式
    className: {
      type: String,
      default: ''
    },
    // 移出鼠标多少秒隐藏
    mouseLeaveDelay: {
      type: Number,
      default: 0
    },
    // 截取长度
    slice: {
      type: Number,
      default: 0
    },
    // 提示框位置
    placement: {
      type: String,
      default: 'top'
    },
    // 文本
    label: {
      type: String,
      default: ''
    },
    // 提示文本
    title: {
      type: String,
      default: ''
    }
  },
  computed: {
    newLabel() {
      let str
      if (this.slice) {
        if (this.label === '') {
          str = '--'
        } else if (this.label.length < this.slice) {
          str = this.label
        } else {
          str = this.label.substr(0, this.slice) + '...'
        }
      }
      return str
    },
    newTitle() {
      return this.title || this.label
    }
  },
  mounted() {},
  methods: {}
}
</script>

<style lang="less" scoped></style>
