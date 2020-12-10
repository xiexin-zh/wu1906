<template>
  <div class="video">
    <img class="banner-top" src="../assets/img/banner_khal.png" alt="" />
    <div class="content-w">
      <div class="u-padd-b20 u-padd-t20">
        <el-row :gutter="40">
          <el-col
            v-for="(item, index) in caseList"
            :key="index"
            :xs="12"
            :sm="8"
            :lg="6"
            class="box-shadow u-hand"
            @click.native="goDetail(item._id)"
          >
            <div class="case-img u-of hand-case">
              <div class="show-info">
                <div class="u-pos-box u-fx-ac-jc">
                  <div class="case-name">{{ item.schoolName }}</div>
                  <div class="case-system">{{ item.systemName }}</div>
                  <div class="case-info">{{ item.systemDes }}</div>
                  <div>
                    <el-button type="primary" size="small">详情</el-button>
                  </div>
                </div>
              </div>
              <img class="case-img" :src="item.url" alt />
            </div>
            <div class="u-fx u-fx-ac u-padd-l10 u-padd-t20">
              <ul class="u-fx-f1">
                <li class="u-te font-title">{{ item.schoolName }}</li>
                <li class="u-te level-title">{{ item.systemName }}</li>
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
  name: 'Case',
  async asyncData({ $axios }) {
    const res = await $axios.get(`http://canpointtest.com:8090/videoApi/getCase?page=1&size=20`)
    return { caseList: res.data.data }
  },
  data() {
    return {
      caseList: [],
    }
  },
  methods: {
    goDetail(_id) {
      this.$router.push({
        path: 'caseDetail',
        query: {
          _id,
        },
      })
    },
  },
}
</script>
