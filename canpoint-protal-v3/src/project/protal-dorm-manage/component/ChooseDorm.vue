<template>
  <div>
    <a-cascader
      :allowClear="false"
      :change-on-select="select"
      :options="options"
      v-model="value"
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
    // 是否允许只选中父级选项
    select: {
      type: Boolean,
      default: true
    },
    placeholder: {
      type: String,
      default: '请选择宿舍'
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
      console.log(this.value)
      if (this.disabled) return
      const res = await $ajax.postForm({
        url: `/protal_v3_11102/canpointDormManage/getDormTree`,
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
      this.options = res.data.map(item => {
        return {
          label: item.name,
          value: item.code,
          valueName: 'buildingCode',
          children: item.childList.map(el => {
            return {
              label: el.name,
              value: el.code,
              valueName: 'floorCode',
              children: el.childList.map(ele => {
                return {
                  label: ele.name,
                  value: ele.code,
                  valueName: 'roomCode'
                }
              })
            }
          })
        }
      })
    },
    onChange(value, info) {
      this.$emit('choose', info)
      try {
        this.$emit('input', value)
      } catch (err) {}
    }
  }
}
</script>

<style lang="less" scoped>
</style>
