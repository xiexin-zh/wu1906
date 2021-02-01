<template>
  <div class="set-group page-layout layout-padd u-fx-ver u-type-white-bg u-auto">
    <set-group-tea v-if="ruleGroupType === '1'" :groupId="groupId"></set-group-tea>
    <set-group-stu v-else :groupId="groupId"></set-group-stu>
  </div>
</template>

<script>
import SetGroupStu from '../../component/SetGroupStu'
import SetGroupTea from '../../component/SetGroupTea'

export default {
  name: 'SetGroup',
  components: {
    SetGroupStu,
    SetGroupTea
  },
  computed: {
  },
  data() {
    return {
      ruleGroupType: '1',
      groupId: ''
    }
  },
  created() {
    console.log(this.$route.query)
    this.groupId = this.$route.query.id ? this.$route.query.id.toString() : ''
    this.ruleGroupType = this.$route.query.ruleGroupType
  },
  methods: {
  }
}
</script>

<style lang="less" scoped>
</style>
