<template>
  <a-dropdown>
    <a-menu slot="overlay" @click="handleMenuClick">
      <a-menu-item v-for="(item, index) in list" :key="index">{{ item }}</a-menu-item>
    </a-menu>
    <u-button type="light">
      <slot></slot>
      <a-icon type="down" />
    </u-button>
  </a-dropdown>
</template>

<script>
export default {
  name: 'UDropdown',
  props: {
    // 下面菜单列表
    list: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {}
  },
  mounted() {},
  methods: {
    handleMenuClick(e) {
      console.log(e)
    }
  }
}
</script>

<style lang="less" scoped>
.u-dropdown {
}
</style>
