<!-- unitComponent 單位組建 （萬） -->
<template>
  <div class="unit">
    <span class="unit-w">(萬)</span>
    <span class="unit-HKD">HKD</span>
  </div>
</template>

<script>
export default {
  name: "UnitComponent",
  //import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    //这里存放数据
    return {};
  }
};
</script>
<style lang="scss" scoped>
.unit {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  font-size: 12px;
  font-weight: normal;
  margin-left: 5px;
}
.unit-w {
  height: 14px;
}
</style>
