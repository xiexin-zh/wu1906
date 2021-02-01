<template>
  <div class="u-table-action">
    <u-space :size="0" class="u-fx-ac">
      <span @click.stop="onLabel">{{ label }}</span>
      <a-tooltip placement="top">
        <template slot="title">{{ iconTip }}</template>
        <a-icon
          @click.stop="onAction"
          :type="icon"
          v-if="label || parseInt(label) === 0 || label === null"
          style="padding-left: 8px; cursor: pointer;"
        ></a-icon>
      </a-tooltip>
      <u-button
        v-if="!label && parseInt(label) !== 0 && label !== null"
        @click="onButton"
        size="small"
        type="light"
      >{{ buttonValue }}</u-button>
    </u-space>
  </div>
</template>

<script>
export default {
  name: 'UTableAction',
  props: {
    // 显示的值
    label: {
      type: [String, Number],
      default: ''
    },
    // 操作图标
    icon: {
      type: String,
      default: ''
    },
    // icon的提示文本
    iconTip: {
      type: String,
      default: ''
    },
    // 按钮显示的值，包括单个和两个
    // 两个时，第一个为新增类型，第二个为删除类型
    buttonValue: {
      type: String,
      default: ''
    }
  },
  computed: {
    // eslint-disable-next-line vue/return-in-computed-property
    type() {
      if (this.buttonValue.length === 1) {
        return 'light'
      } else {
        return this.label ? 'default' : 'light'
      }
    },
    currentValue() {
      if (this.buttonValue.length === 1) {
        return this.buttonValue[0]
      } else {
        return this.label ? this.buttonValue[1] : this.buttonValue[0]
      }
    }
  },
  data() {
    return {}
  },
  mounted() {},
  methods: {
    // 点击button事件
    onButton() {
      this.$emit('button')
    },
    // 点击图标事件
    onAction() {
      this.$emit('action')
    },
    // 点击文本事件
    onLabel() {
      this.$emit('label')
    }
  }
}
</script>

<style lang="less" scoped></style>
