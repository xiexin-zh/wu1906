<template>
  <div class="card mar-b10 mar-t10" id="card">
    <div class="top">
      <slot name="title" ></slot>
    </div>
    <!-- <a-divider /> -->
    <slot name="content" class="process qui-fx-jsb qui-fx-ac"></slot>
  </div>
</template>

<script>
// import hostEnv from '@config/host-env'
export default {
  name: 'Crad',
  props: {
  },
  data() {
    return {
    }
  },
  components: {
  },
  computed: {
  },
  mounted() {
  },
  methods: {
  }
}
</script>
<style lang="less" scoed>
#card {
  border: 1px solid #e2e2e2;
  /deep/.top{
    padding-left: 20px;
    line-height: 50px;
    background-color: #ececec;
    border-bottom: 1px solid #e2e2e2;
  }
}
</style>
