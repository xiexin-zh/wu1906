<template>
  <div class="detail-title-left">
    <div class="title">
      <slot></slot>
    </div>
  </div>
</template>
<script>
export default {
  name: 'DetailTitleLeft',
  props: {
    // 标题
    title: {
      type: String,
      default: '标题'
    }
  },
  data() {
    return {
      visible: this.visibleTrue
    }
  },
  created() {
  },
  mounted() {},
  methods: {
  }
}
</script>
<style lang="less" scoped>
.detail-title-left {
  height: 35px;
  border-bottom: 1px solid #ddd;
  .title {
    margin-left: 40px;
    position: relative;
    &::before{
      content: '';
      position: absolute;
      height: 20px;
      width: 5px;
      background-color: #4D4CAC;
      left: -20px;
    }
  }
}
</style>
