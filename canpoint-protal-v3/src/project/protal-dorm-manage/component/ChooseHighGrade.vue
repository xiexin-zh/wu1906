<template>
  <div>
    <a-cascader
      :allowClear="false"
      :change-on-select="select"
      :options="options"
      v-model="value"
      :placeholder="placeholder"
      :default-value="defaultValue"
      @change="onChange"
      @click.stop="onFocus"
      :loadData="loadData"
      :disabled="disabled"
    />
  </div>
</template>

<script>
import $ajax from '@u/libs/ajax-serve'
export default {
  name: 'ChooseHighGrade',
  components: {},
  props: {
    // 学校code
    school: {
      type: String,
      required: true
    },
    // 是否允许只选中父级选项
    select: {
      type: Boolean,
      default: true
    },
    placeholder: {
      type: String,
      default: '请选择班级'
    },
    // 默认选择
    defaultValue: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 是否可选
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      options: [],
      value: []
    }
  },
  methods: {
    async onFocus() {
      if (this.disabled) return
      this.options = []
      const req = {
        schoolCode: this.school
      }
      const res = await $ajax.get({
        url: `/protal_v3_11101/canpointClass/menu/first/list`,
        params: req
      })
      this.options = res.data.list
      this.options.forEach(el => {
        el.label = el.gradeName
        el.value = el.gradeCode
        el.isLeaf = false
      })
    },
    async loadData(selectedOptions) {
      const targetOption = selectedOptions[selectedOptions.length - 1]
      targetOption.loading = true
      const res = await $ajax.post({
        url: `/protal_v3_11101/canpointClass/menu/second/third/tree`,
        params: {
          schoolCode: targetOption.schoolCode,
          schoolYearCode: targetOption.schoolYearCode,
          gradeCode: targetOption.gradeCode
        }
      })
      targetOption.loading = false
      targetOption.children = res.data
      targetOption.children.forEach(el => {
        el.label = el.majorName
        el.value = el.majorCode
        el.isLeaf = el.classList.length === 0 // 处理第三层没有子节点的情况
        el.children = el.classList.map(item => {
          return {
            ...item,
            label: item.className,
            value: item.classCode,
            isLeaf: true
          }
        })
      })
      this.options = [...this.options]
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
