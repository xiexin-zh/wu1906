<template>
  <div class="Danger page-layout bg-fff">
    <a-tabs default-active-key="1" class="a-tab" @change="callback">
      <a-tab-pane key="1" tab="发现隐患">
        <discover-danger></discover-danger>
      </a-tab-pane>
      <a-tab-pane key="2" tab="隐患督办" force-render>
        <danger-supervision></danger-supervision>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
export default {
  name: 'Danger',
  components: {
    DiscoverDanger: () => import('./DiscoverDanger'),
    DangerSupervision: () => import('./DangerSupervision')
  },
  data() {
    return {}
  },
  mounted() {},
  methods: {
    callback(key) {
    }
  }
}
</script>
<style lang="less" scoped>
@deep: ~'>>>';
.Danger{
  .ant-tabs{
    height: 100%;
    @{deep} .ant-tabs-top-content.ant-tabs-content-animated{
       height: calc(100% - 50px);
    }
  }
}
</style>
