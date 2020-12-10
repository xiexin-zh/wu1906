<template>
  <a-dropdown>
    <a-menu slot="overlay" @click="handleMenuClick">
      <a-menu-item :key="item.key" v-for="(item) in data.list"> <a-icon type="user" />{{ item.val }} </a-menu-item>
      <!-- <a-menu-item key="2"> <a-icon type="user" />2nd menu item </a-menu-item>
      <a-menu-item key="3"> <a-icon type="user" />3rd item </a-menu-item> -->
    </a-menu>
    <a-button style="margin-left: 8px"> {{ data.label }} <a-icon type="down" /> </a-button>
  </a-dropdown>
</template>

<script>
export default {
  name: 'Dropdown',
  components: {

  },
  props: {
    data: {
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
    handleMenuClick(value) {
      this.$emit()
    },
    callback(key) {
    }
  }
}
</script>
<style lang="less" scoped></style>
