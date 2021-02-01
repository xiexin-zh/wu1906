<template>
  <div>
    <a-cascader
      :change-on-select="select"
      :options="options"
      :placeholder="placeholder"
      :default-value="defaultValue"
      @click.stop="onFocus"
      @change="onChange"
      :disabled="disabled"
    />
  </div>
</template>

<script>
import $ajax from '@u/libs/ajax-serve'
export default {
  name: 'ChooseGrade',
  components: {},
  props: {
    // 学校code
    school: {
      type: String,
      required: true
    },
    schoolYearCode: {
      type: String,
      required: true
    },
    gradeCode: {
      type: String || Number,
      default: ''
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
      options: []
    }
  },
  methods: {
    async onFocus() {
      if (this.disabled) return
      const res = await $ajax.post({
        url: `/protal_v3_11101/canpointClass/menu/second/third/tree`,
        params: {
          schoolCode: this.school,
          schoolYearCode: this.schoolYearCode,
          gradeCode: this.gradeCode ? this.gradeCode : undefined
        }
      })
      if (res.data === null || res.data.length === 0) {
        this.noData = true
        this.options = []
        return
      } else {
        this.noData = false
      }
      this.options = res.data.map(item => {
        return {
          label: item.gradeName,
          value: item.gradeCode,
          children: item.classList.map(el => {
            return {
              label: el.className,
              value: el.classCode
            }
          })
        }
      })
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
