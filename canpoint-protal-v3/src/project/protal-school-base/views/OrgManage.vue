<template>
  <div class="org-manage page-layout u-fx-ver u-type-white-bg">
    <u-org-menu :type="school" :school-code="schoolCode"></u-org-menu>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'OrgManage',
  data() {
    return { school: 'school' }
  },
  computed: {
    ...mapState('home', ['schoolCode'])
  },
  mounted() {},
  methods: {}
}
</script>
<style lang="less" scoped>
</style>
