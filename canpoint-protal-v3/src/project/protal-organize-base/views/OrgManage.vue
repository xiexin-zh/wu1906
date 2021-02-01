<template>
  <div class="org-manage page-layout u-fx-ver u-type-white-bg">
    <u-org-menu :type="school" :school-code="schoolCode"></u-org-menu>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'OrgManage',
  computed: {
    ...mapState('home', ['schoolCode'])
  },
  data() {
    return { school: 'school' }
  },
  mounted() {},
  methods: {}
}
</script>
<style lang="less" scoped>
</style>
