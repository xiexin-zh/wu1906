<template>
  <div class="down">
    <img class="banner-top" src="../assets/img/banner_down.png" alt="" />
    <div class="content-w">
      <div class="u-padd-b20 u-padd-t20">
        <el-row :gutter="40">
          <el-col
            v-for="(down, index) in downList"
            :key="index"
            :xs="24"
            :sm="12"
            :lg="12"
            class="u-fx box-shadow down-list"
          >
            <div>
              <img class="down-img" :src="down.pic" alt="" />
            </div>
            <div class="u-fx-f1 u-fx u-fx-ver">
              <div class="title">{{ down.title }}</div>
              <div class="info u-fx-f1">{{ down.levelTitle }}</div>
              <div class="u-tx-r">
                <el-button type="primary" size="small" @click="downFile(down.url)">点击下载</el-button>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Down',
  async asyncData({ $axios }) {
    const res = await $axios.get(`http://canpointtest.com:8090/videoApi/getDownFile?page=1&size=20`)
    return { downList: res.data.data }
  },
  data() {
    return {
      downList: [],
    }
  },
  methods: {
    downFile(url) {
      window.location.href = url
    },
  },
}
</script>
<style lang="scss" scoped>
.down-list {
  padding: 30px;
  .title {
    font-size: 18px;
    font-weight: bold;
  }
  .info {
    padding: 15px 0;
    color: #666;
    line-height: 24px;
  }
  img {
    margin-right: 15px;
    width: 2.5rem;
    height: auto;
    display: block;
  }
}
</style>
