<template>
  <div class="page-layout layout-padd u-fx-ver u-type-white-bg">
    <u-space direction="vertical">
      <u-alert closable type="error" message="温馨提示" description="这是我的模块功能"></u-alert>
      <u-button @click="goDetail" type="primary">详情</u-button>
    </u-space>
  </div>
</template>

<script>
export default {
  name: 'ChildOneCom',
  data() {
    return {}
  },
  mounted() {},
  methods: {
    goDetail() {
      this.$router.push('/childOne/detial')
    }
  }
}
</script>
<style lang="less" scoped>
</style>
