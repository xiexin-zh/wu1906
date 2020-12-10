<template>
  <div class="production-detail">
    <img class="banner-top" src="../assets/img/banner_cpzx.png" alt />
    <div class="content-w">
      <div class="u-padd-b20 u-padd-t20">
        <div class="detail-title">{{ title }}</div>
        <div class="content-show" v-html="detail"></div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'ProductionDetail',
  async asyncData({ $axios, query }) {
    const res = await $axios.get(`http://canpointtest.com:8090/videoApi/getProductDetail?_id=${query._id}`)
    return {
      title: res.data.data.title,
      detail: res.data.data.content,
    }
  },
  data() {
    return {
      title: '',
      detail: '',
    }
  },
}
</script>
