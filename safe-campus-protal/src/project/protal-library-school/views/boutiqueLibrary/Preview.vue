<template>
  <div class="page-layout qui-fx-ver">
    <div class="content pos-box">
      <h2 class="u-fx-ac-jc u-type-primary u-mar-t40 u-mar-b20">{{ detailInfo.name }}</h2>
      <a-row type="flex" justify="center" class="u-tips-color" >
        <a-col :span="4" class="u-fx" >
          <div class="text u-fx-ac-jc">发布人：{{ detailInfo.publisherName }}</div>
        </a-col>
        <a-col :span="6" class="u-fx" >
          <div class="text u-fx-ac-jc">知识库分类：{{ detailInfo.category }}</div>
        </a-col>
        <a-col :span="3" class="u-fx" >
          <div class="text u-fx-ac-jc">文件分类：{{ detailInfo.fileTypeName }}</div>
        </a-col>
        <a-col :span="4" class="u-fx" >
          <div class="text u-fx-ac-jc">发布时间：{{ detailInfo.createTime | gmtToDate('date') }}</div>
        </a-col>
      </a-row>
      <a-row type="flex" justify="center" >
        <a-col :span="8" class="u-fx u-mar-40" >
          <img style="width:100%" :src="detailInfo.thumbnailUrl" alt="">
        </a-col>
      </a-row>
      <a-row type="flex" justify="center" >
        <a-col :span="20" class="u-fx u-mar-40" >
          <div class="cont u-mar-40" v-html="detailInfo.des"></div>
        </a-col>
      </a-row>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import moment from 'moment'
export default {
  name: 'Preview',
  components: {
  },
  data() {
    return {
      detailInfo: {}
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  created() {
    this.id = this.$route.query.id
    this.showDetail()
  },
  methods: {
    ...mapActions('home', ['klgInfo']),
    moment,
    // 获取详情
    async showDetail() {
      const req = {
        'id': this.id,
        'schoolCode': this.userInfo.schoolCode,
        source: '3',
        'userName': this.userInfo.userName
      }
      const res = await this.klgInfo(req)
      this.detailInfo = res.data
      this.docName = 'res.data.docName'
      this.show = !res.data.docUrl
      this.flag = !res.data.docUrl
    }
  }
}
</script>
<style lang="less" scoped>
.content {
  height: calc(100% - 10px);
  overflow-y: scroll;
}
</style>
