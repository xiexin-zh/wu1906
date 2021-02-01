<template>
  <div class="u-fx-ac">
    <div
      :style="{borderRadius: '100%', marginRight: '5px', width: '8px', height: '8px', backgroundColor: setColor()}"
    ></div>
    <div>
      <slot></slot>
    </div>
  </div>
</template>

<script>
import colorList from './color'
export default {
  name: 'UType',
  props: {
    // 状态类型
    type: {
      type: String,
      required: false,
      default: ''
    }
  },
  data() {
    return {
      colorList
    }
  },
  mounted() {},
  methods: {
    setColor() {
      const text = this.$slots.default[0].text.trim()
      return this.colorList[text] || '#0074e0'
    }
  }
}
</script>

<style lang="less" scoped></style>
