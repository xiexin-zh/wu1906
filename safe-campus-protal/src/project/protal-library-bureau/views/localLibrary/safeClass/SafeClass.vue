<template>
  <div class="safe-class page-layout bg-fff u-padd-10">
    <a-tabs v-model="activeKey" class="a-tab" @change="callback">
      <a-tab-pane key="1" tab="安全课堂">
      </a-tab-pane>
      <a-tab-pane key="2" tab="课堂习题" force-render>
      </a-tab-pane>
      <a-tab-pane key="3" tab="课堂资源" force-render>
      </a-tab-pane>
    </a-tabs>
    <div class="conter">
      <safe-class-item v-if="activeKey==='1'"></safe-class-item>
      <safety-exercises v-if="activeKey==='2'"></safety-exercises>
      <class-resources v-if="activeKey==='3'"></class-resources>
    </div>
  </div>
</template>
<script>
// import eventBus from '@u/eventBus'
export default {
  name: 'SafeClass',
  components: {
    SafeClassItem: () => import('./SafeClassItem'),
    safetyExercises: () => import('./SafetyExercises'),
    classResources: () => import('./ClassResources')
  },
  data() {
    return {
      activeKey: '1'
    }
  },
  created() {
    this.activeKey = this.$route.query.activeKey || '1'
  },
  mounted() {
  },
  methods: {
    callback(key) {
    }
  }
}
</script>
<style lang="less" scoped>
@deep: ~'>>>';
.safe-class{
  .conter{
    width: 100%;
    height: calc(100% - 60px);
  }
}
</style>
