<template>
  <div>
    <a-cascader
      :allowClear="allowClear"
      :change-on-select="select"
      :options="options"
      :placeholder="placeholder"
      :default-value="defaultValue"
      @change="onChange"
    />
  </div>
</template>

<script>
import $ajax from '@u/libs/ajax-serve'
export default {
  name: 'ChooseOrg',
  components: {},
  props: {
    /**
     * 是否有清除按钮
     */
    allowClear: {
      type: Boolean,
      default: true
    },
    // 学校code
    school: {
      type: String,
      required: true
    },
    // 占位文本
    placeholder: {
      type: String,
      default: '请选择组织机构'
    },
    // 是否允许只选中父级选项
    select: {
      type: Boolean,
      default: true
    },
    // 默认选择
    defaultValue: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      options: []
    }
  },
  async mounted() {
    this.initMenu()
  },
  methods: {
    async initMenu() {
      const res = await $ajax.get({
        url: '/protal_v3_11101/canpointOrg/tree',
        params: {
          schoolCode: this.school
        }
      })
      if (res.data === null || res.data.length === 0) {
        this.noData = true
        this.options = []
        return
      } else {
        this.noData = false
      }
      const data = this.newOrgData([res.data])
      this.options = data
    },
    // 深层递归
    newOrgData(data) {
      data.forEach(item => {
        item.children = item.children || null
        item.label = item.orgName
        item.value = item.orgCode
        if (item.children && item.children.length > 0) {
          this.newOrgData(item.children)
        } else {
          item.children = null
        }
      })
      return data
    },
    onChange(value, info) {
      this.$emit('choose', value, info)
      try {
        this.$emit('input', value)
      } catch (err) {}
    }
  }
}
</script>

<style lang="less" scoped>
</style>
