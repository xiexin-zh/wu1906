<template>
  <div class="home page-layout bg-fff">
    <no-data msg="什么也没有~">
      <a-button @click="goLogin" type="primary" slot="btn">新增</a-button>
    </no-data>
  </div>
</template>

<script>
import NoData from '@c/NoData'
export default {
  name: 'Home',
  components: {
    NoData
  },
  data() {
    return {}
  },
  mounted() {},
  methods: {
    goLogin() {
      parent.location.href = 'http://localhost:8001'
    }
  }
}
</script>
<style lang="less" scoped></style>
