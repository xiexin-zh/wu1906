<template>
  <div class="class page-layout u-type-white-bg">我是模板界面</div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'Template',
  computed: {
    ...mapState('home', ['loginInfo', 'loginType'])
  }
}
</script>
<style lang="less" scoped>
</style>
