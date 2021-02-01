<template>
  <class-manage-h v-if="loginInfo.schoolType === '8' || loginInfo.schoolType === '9'"></class-manage-h>
  <class-manage-s v-else></class-manage-s>
</template>

<script>
import { mapState } from 'vuex'
import ClassManageS from '../component/ClassManageS.vue'
import ClassManageH from '../component/ClassManageH.vue'
export default {
  name: 'ClassManage',
  components: {
    ClassManageS,
    ClassManageH
  },
  data() {
    return {}
  },
  computed: {
    ...mapState('home', ['loginInfo'])
  },
  methods: {}
}
</script>
<style lang="less" scoped>
</style>
