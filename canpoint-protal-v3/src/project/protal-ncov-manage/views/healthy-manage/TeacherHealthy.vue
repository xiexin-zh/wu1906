<template>
  <div class="knowing-statis page-layout u-fx">
    <div class="left-tree u-type-white-bg">
      <u-org-post
        :maxHeight="maxHeight"
        :school="schoolCode"
        @select="select">
      </u-org-post>
    </div>
    <div class="u-fx-f1 u-fx-ver">
      <u-space direction="vertical" class="layout-padd u-bg-fff ">
        <u-search-form ref="searchForm" :search-label="ThealthySearchLabel" @search="search">
        </u-search-form>
      </u-space>
      <div class="u-fx u-fx-f1 ">
        <u-table
          is-zoom
          :page-list="pageList"
          :columns="ThealthyColums"
          :table-list="userList"
        >
          <template v-slot:slotOne="slotOne">
            <u-type type="sex">{{ getDataState('sex',slotOne.record.sex) }}</u-type>
          </template>
          <template v-slot:actions="actions">
            <u-button type="link" @click="goDetial(actions.record)">详情</u-button>
          </template>
        </u-table>
      </div>
      <div class="u-type-white-bg">
        <u-pagination
          justify="end"
          v-model="pageList"
          :total="total"
          @change="showList"
        ></u-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { getDataState } from '@u/libs/data-state'
import { ThealthyColums } from '../../table-columns/outInRecord'
import { ThealthySearchLabel } from '../../search-columns/ncovDaily'
import DormClassTree from '../../component/DormClassTree'
export default {
  name: 'TeacherHealthy',
  components: {
    DormClassTree
  },
  data() {
    return {
      ThealthySearchLabel,
      date: this.$tools.getDate(new Date(), 1),
      getDataState,
      maxHeight: document.body.clientHeight - 180,
      searchObj: {
        userType: '4', //	用户类型（4：教职工 ，8：学生）
        schoolCode: 'CANPOINTLIVE',
        orgCode: ''
      },
      userList: [],
      ThealthyColums,
      pageList: { page: 1, size: 20 },
      total: 0
    }
  },
  computed: {
    ...mapState('home', ['schoolCode', 'loginInfo', 'schoolYear'])
  },
  created() {
    this.searchObj.schoolCode = this.schoolCode
    this.searchObj.schoolCode = 'CANPOINTLIVE'
  },
  mounted() {
  },
  methods: {
    ...mapActions('home', ['getarchivesList']),
    // 切换部门，职位树菜单选择机构编码orgCode 进入页面触发
    select(obj) {
      this.searchObj.orgCode = obj.code
      this.searchObj.orgCode = 'CANPOINTLIVE'
      this.showList()
    },
    // 获取列表
    async showList() {
      const req = {
        ...this.searchObj,
        ...this.pageList
      }
      const res = await this.getarchivesList(req)
      this.userList = res.data.list.map((el, index) => {
        return {
          ...el,
          id: index
        }
      })
      this.total = res.data.total
    },
    search(values) {
      this.searchObj = Object.assign(this.searchObj, values)
      this.showList()
    },
    goDetial(record) {
      this.$router.push({
        path: '/component/personalDetail',
        query: {
          id: record.userCode,
          userType: '4'
        }
      })
    }
  }

}
</script>
<style lang="less" scoped>
</style>
