<template>
  <a-cascader
    :disabled="disabled"
    :allowClear="allowClear"
    :options="areaList"
    @click.stop="onFocus"
    @change="onChange"
    :loadData="loadData"
    :placeholder="placeholder"
  />
</template>

<script>
import $http from '@u/libs/ajax-serve'
export default {
  name: 'UChooseArea',
  props: {
    // 绑定的值
    value: {
      type: Array,
      default: () => {
        return []
      }
    },
    /**
     * 默认选择的的区域
     */
    placeholder: {
      type: String,
      default: '请选择地区'
    },
    /**
     * 是否支持清除
     */
    allowClear: {
      type: Boolean,
      default: true
    },
    /**
     * 是否可用
     */
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return { areaList: [] }
  },
  mounted() {},
  methods: {
    async loadData(selectedOptions) {
      const targetOption = selectedOptions[selectedOptions.length - 1]
      targetOption.loading = true
      const res = await $http.get({
        url: '/protal_v3_11101/canpointProvinces/list',
        params: {
          parentCode: targetOption.code
        }
      })
      targetOption.loading = false
      targetOption.children = res.data
      targetOption.children.forEach(el => {
        el.label = el.name
        el.value = el.code
        el.isLeaf = selectedOptions.length === 2 // 处理第三层没有子节点的情况
      })
      this.areaList = [...this.areaList]
    },
    onChange(value, obj) {
      this.$emit('input', value)
      try {
        this.$emit('change', value)
      } catch (err) {}
    },
    async onFocus(value) {
      this.areaList = []
      this.isNotEdited = false
      const res = await $http.get({
        url: '/protal_v3_11101/canpointProvinces/list'
      })
      this.areaList = res.data
      this.areaList.forEach(el => {
        el.label = el.name
        el.value = el.code
        el.isLeaf = false
      })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
