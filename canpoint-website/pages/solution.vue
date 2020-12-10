<template>
  <div class="video">
    <img class="banner-top" src="../assets/img/banner_jjfa.png" alt />
    <div class="content-w">
      <div class="u-padd-b20 u-padd-t20">
        <el-row :gutter="40">
          <el-col
            v-for="(solution, index) in solutionList"
            :key="index"
            :xs="12"
            :sm="8"
            :lg="8"
            class="box-shadow u-hand"
            @click.native="goDetail(solution._id)"
          >
            <div class="solution-img u-of hand-hover">
              <img class="solution-img" :src="solution.url" alt />
            </div>
            <div class="u-fx u-fx-ac u-padd-l10 u-padd-t20">
              <ul class="u-fx-f1">
                <li class="u-te font-title">{{ solution.title }}</li>
                <li class="u-te level-title">{{ solution.levelTitle }}</li>
              </ul>
              <div class="rit-arrow"></div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Solution',
  async asyncData({ $axios }) {
    const res = await $axios.get(`http://canpointtest.com:8090/videoApi/getSolution?page=1&size=20`)
    return { solutionList: res.data.data }
  },
  data() {
    return {
      solutionList: [],
    }
  },
  methods: {
    goDetail(_id) {
      this.$router.push({
        path: 'solutionDetail',
        query: {
          _id,
        },
      })
    },
  },
}
</script>
