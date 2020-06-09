<template>
  <div class="main">
    <router-view/>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  components: {}
};
</script>

<style scoped lang="less">
.main {
  flex: 1;
  overflow: hidden;
  height: 100%;
  display: flex;
}
</style>
