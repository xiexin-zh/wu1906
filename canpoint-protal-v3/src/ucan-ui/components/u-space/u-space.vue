<template>
  <a-space :direction="direction" :size="direction === 'vertical' ? vSize : size">
    <slot></slot>
  </a-space>
</template>

<script>
export default {
  name: 'USpaceCom',
  props: {
    // 对齐方式
    align: {
      type: String,
      required: false,
      default: 'baseline'
    },
    // 间距方向
    direction: {
      type: String,
      default: 'horizontal'
    },
    // 间距大小
    size: {
      type: Number,
      default: 8
    },
    // 垂直间距
    vSize: {
      type: Number,
      default: 10
    }
  },
  computed: {},
  data() {
    return {}
  },
  mounted() {},
  methods: {}
}
</script>

<style lang="less" scoped>
</style>
