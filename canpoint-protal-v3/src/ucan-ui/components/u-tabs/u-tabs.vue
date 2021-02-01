<template>
  <a-tabs :type="type" :default-active-key="value" @change="callback">
    <a-tab-pane :disabled="tab.disabled" :key="tab.key" :tab="tab.title" v-for="tab in tabList"></a-tab-pane>
    <div slot="tabBarExtraContent">
      <slot></slot>
    </div>
  </a-tabs>
</template>

<script>
export default {
  name: 'UTabs',
  props: {
    // 标签项列表 [{ key: '', title: ''}]
    tabList: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 当前标签项
    value: {
      type: [String || Number],
      default: ''
    },
    // 页签基本样式
    type: {
      type: String,
      default: 'line'
    }
  },
  data() {
    return {}
  },
  mounted() {},
  methods: {
    callback(key) {
      this.$emit('input', key)
      this.$emit('change', key)
    }
  }
}
</script>

<style lang="less" scoped>
/deep/ .ant-tabs-extra-content {
  line-height: 20px !important;
}
</style>
