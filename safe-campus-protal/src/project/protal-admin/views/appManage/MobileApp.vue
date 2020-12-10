<template>
  <div class="page-layout qui-bg-fff qui-fx">
    <app-manage plateformType="1"></app-manage>
  </div>
</template>

<script>
import AppManage from './AppManage'
export default {
  name: 'MobileApp',
  components: { AppManage },
  data() {
    return {}
  },
  mounted() {},
  methods: {}
}
</script>
<style lang="less" scoped>
.menu-left {
  width: 200px;
}
</style>
