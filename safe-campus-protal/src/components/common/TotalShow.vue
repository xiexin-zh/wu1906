<template>
  <div class="total-show">
    <a-tag color="green">
      {{ total }}
    </a-tag>
    <a-tag color="#6882da" style="cursor: pointer">
      <span style="font-weight: bold; font-size: 14px">+</span>
    </a-tag>
  </div>
</template>
<script>
export default {
  props: {
    total: {
      type: [Number || String],
      default: 0
    }
  },
  methods: {}
}
</script>
<style lang="less" scoped></style>
