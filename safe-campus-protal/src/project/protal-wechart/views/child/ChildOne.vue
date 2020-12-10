<template>
  <div class="child-one page-layout u-type-white-bg">
    我是第一个子界面
    <a-button type="primary" @click="goDetail">详情</a-button>
  </div>
</template>

<script>
export default {
  name: 'ChildOne',
  components: {},
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
.child-one {
}
</style>
