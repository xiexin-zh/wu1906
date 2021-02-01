<template>
  <a-radio-group v-model="status" :size="size" :button-style="buttonStyle" @change="change">
    <a-radio-button
      :class="[{'border':border}]"
      :style="{textAlign: 'center', width: width + 'px'}"
      :disabled="item.disabled"
      :value="item.value"
      v-for="item in itemList"
      :key="item.value"
    >{{ item.label }}</a-radio-button>
  </a-radio-group>
</template>
<script>
export default {
  name: 'URadio',
  props: {
    // 选项框库宽度
    width: {
      type: [String, Number],
      default: 80
    },
    // 单选框列表
    itemList: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 当前选中的项
    value: {
      type: [Number, String],
      default: ''
    },
    // radioButton风格样式
    buttonStyle: {
      type: String,
      default: 'solid'
    },
    // radioButton风格样式
    size: {
      type: String,
      default: 'default'
    },
    // 不选中是否带边框
    border: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    status: {
      get() {
        return this.value
      },
      set() {}
    }
  },
  data() {
    return {}
  },
  mounted() {},
  methods: {
    change(e) {
      this.$emit('input', e.target.value)
      this.$emit('change', e.target.value)
    }
  }
}
</script>

<style lang="less" scoped>
.border{
  border: 1px solid #36bfff;
  color: #36bfff;
  &.active{
    color: #fff;
  }
}
// .radiusFrist{
//     border-radius:  px 0px 0px 4px;
//   }
// .radiusLast{
//   border-radius: 0px 4px 4px 0px;
// }
</style>
