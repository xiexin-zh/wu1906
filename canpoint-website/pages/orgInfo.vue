<template>
  <div class="case-detail">
    <img class="banner-top" src="../assets/img/banner_zxzx.png" alt="" />
    <div class="content-w">
      <div class="u-padd-b20 u-padd-t20">
        <ul class="org-list">
          <li v-for="(org, index) in orgList" :key="index" class="u-hand" @click="showDialog(org._id)">
            {{ org.title }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'OrgInfo',
  async asyncData({ $axios, query }) {
    const res = await $axios.get(
      `http://canpointtest.com:8090/videoApi/getOrgInfo?page=1&size=20&cityId=${query._id}&type=info`
    )
    return {
      orgList: res.data.data,
    }
  },
  data() {
    return {
      orgList: [],
      title: '',
      detail: '',
      dialogVisible: false,
    }
  },
  methods: {
    showDialog(_id) {
      this.$router.push({
        path: 'orgDes',
        query: {
          _id,
        },
      })
    },
  },
}
</script>
<style lang="scss" scoped>
.org-list {
  li {
    cursor: pointer;
    height: 80px;
    line-height: 80px;
    font-size: 16px;
    border-bottom: 1px #eee solid;
  }
}
</style>
