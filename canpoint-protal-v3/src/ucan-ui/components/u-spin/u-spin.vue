<template>
  <a-spin :delay="delay" :spinning="spinning" :tip="tip">
    <a-icon slot="indicator" type="loading" style="font-size: 24px; color:#999" spin />
  </a-spin>
</template>

<script>
export default {
  name: 'USpinCom',
  props: {
    // 延迟显示加载效果的时间（防止闪烁）
    delay: {
      type: Number,
      default: 300
    },
    // 组件大小
    size: {
      type: String,
      default: 'default'
    },
    // 是否加载中
    spinning: {
      type: Boolean,
      default: true
    },
    // 当作为包裹元素时，可以自定义描述文案
    tip: {
      type: String,
      default: '加载中'
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
/deep/ .ant-spin-text {
  padding-top: 5px;
  letter-spacing: 1px;
  color: @u-tips-color;
}
</style>
