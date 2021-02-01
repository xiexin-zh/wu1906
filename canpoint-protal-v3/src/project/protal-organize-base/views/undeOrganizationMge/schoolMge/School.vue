<template>
  <div class="school page-layout u-fx-ver u-type-white-bg">
    <u-space direction="vertical" class="layout-padd">
      <u-search-form :search-label="searchSchool" @search="search">
      </u-search-form>
    </u-space>
    <div class="u-fx u-fx-f1">
      <u-table
        :page-list="pageList"
        :columns="tableSchool"
        :table-list="postList">
        <template v-slot:actions="actions">
          <u-button
            type="link"
            @click="detail(actions.record.schoolCode)"
            v-if="!actions.record.hasPreinstall"
          >详情</u-button>
        </template>
      </u-table>
    </div>
    <div class="u-type-white-bg">
      <u-pagination justify="end" v-model="pageList" :total="total" @change="getList"></u-pagination>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { tableSchool } from '../../../table-columns/schoolMge'
import { searchSchool } from '../../../search-columns/searchColumns'

export default {
  name: 'School',
  components: {},
  data() {
    return {
      bindList: [],
      searchSchool,
      postList: [],
      tableSchool,
      pageList: { page: 1, size: 20 },
      total: 0,
      searchObj: {}
    }
  },
  computed: {
    ...mapState('home', ['schoolCode'])
  },
  mounted() {
    this.getList()
  },
  methods: {
    ...mapActions('home', ['getSchool', 'getPostUser']),
    // 获取数据列表
    async getList() {
      const req = {
        ...this.searchObj,
        ...this.pageList,
        schoolCode: this.schoolCode
      }
      const res = await this.getSchool(req)
      this.postList = res.data.records.map(el => {
        return {
          ...el,
          id: el.schoolCode
        }
      })
      this.total = res.data.total
    },
    // 搜索列表
    search(values) {
      this.pageList.page = 1
      this.pageList.size = 20
      this.searchObj.provinceCode = values.areaList[0]
      this.searchObj.cityCode = values.areaList[1]
      this.searchObj.areaCode = values.areaList[2]
      this.searchObj = Object.assign(this.searchObj, values)
      this.getList()
    },
    detail(schoolCode) {
      this.$router.push({
        path: '/school/schoolDetail',
        query: {
          schoolCode: schoolCode
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
</style>
