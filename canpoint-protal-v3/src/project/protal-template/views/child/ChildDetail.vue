<template>
  <div class="page-layout layout-padd u-type-white-bg">
    <u-space direction="vertical">
      我是详情界面
      <u-button type="primary" @click="goPath">二级详情</u-button>
    </u-space>
  </div>
</template>

<script>
export default {
  name: 'ChildDetail',
  components: {},
  data() {
    return {}
  },
  mounted() {},
  methods: {
    goPath () {
      this.$router.push('/childOne/detial/info')
    }
  }
}
</script>
<style lang="less" scoped>
.child-detail {
}
</style>
