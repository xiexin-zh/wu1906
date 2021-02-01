<template>
  <a-empty :imageStyle="imageStyle" :description="description" :image="image">
    <slot></slot>
  </a-empty>
</template>

<script>
export default {
  name: 'UEmpty',
  props: {
    // 内容描述
    description: {
      type: String,
      default: '暂无数据~'
    },
    // 图片地址
    image: {
      type: String,
      default: ''
    },
    // 图片样式
    imageStyle: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {}
  },
  mounted() {},
  methods: {}
}
</script>

<style lang="less" scoped>
/deep/ .ant-empty-description {
  color: @u-tips-color;
}
</style>
