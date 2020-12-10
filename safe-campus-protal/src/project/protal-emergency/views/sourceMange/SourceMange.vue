<template>
  <div class="page-layout qui-fx-ver">
    <a-tabs default-active-key="1" @change="callback">
      <a-tab-pane key="1" tab="广播资源管理">
      </a-tab-pane>
      <a-tab-pane key="2" tab="资源分类设置">
      </a-tab-pane>
    </a-tabs>
    <radio-source v-if="show"></radio-source>
    <source-classify v-if="!show"></source-classify>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import SourceClassify from '../../component/SourceClassify'
import RadioSource from '../../component/RadioSource'
export default {
  name: 'SourceMange',
  components: {
    SourceClassify,
    RadioSource
  },
  data() {
    return {
      show: true
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  mounted() {
  },
  methods: {
    callback(key) {
      this.show = key === '1'
    }
  }
}
</script>
<style lang="less" scoped>
</style>
