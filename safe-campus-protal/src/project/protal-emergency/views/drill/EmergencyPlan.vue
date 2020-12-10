<template>
  <div class="page-layout qui-fx-ver">
    <a-tabs v-model="activeTab" @change="callback" >
      <a-tab-pane key="1" tab="应急预案"> </a-tab-pane>
      <a-tab-pane key="2" tab="预案模板"> </a-tab-pane>
    </a-tabs>
    <plan-emergency v-if="activeTab === '1'"></plan-emergency>
    <plan-template v-if="activeTab === '2'"></plan-template>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import PlanEmergency from '../../component/PlanEmergency'
import PlanTemplate from '../../component/PlanTemplate'
export default {
  name: 'SourceMange',
  components: {
    PlanEmergency,
    PlanTemplate
  },
  data() {
    return {
      activeTab: '1'
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  mounted() {
    this.activeTab = this.$route.query.activeTab ? this.$route.query.activeTab : '1'
  },
  methods: {
    callback(key) {
      this.activeTab = key
    }
  }
}
</script>
<style lang="less" scoped>
</style>
