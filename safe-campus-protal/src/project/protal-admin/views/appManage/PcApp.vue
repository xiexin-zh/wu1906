<template>
  <div class="page-layout qui-bg-fff qui-fx">
    <app-manage plateformType="2"></app-manage>
  </div>
</template>

<script>
import AppManage from './AppManage'
export default {
  name: 'PcApp',
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
