<template>
  <div class="page-layout bg-fff qui-fx-ver">
    <search-form is-reset @search-form="searchForm" :search-label="searchLabelSupervise">
      <div slot="right">
        <a-button type="primary" class="u-mar-l10" @click="exportHazards">隐患导出</a-button>
        <a-button icon="export" class="u-mar-l10 export-btn" @click="reportDangers">上报隐患</a-button>
      </div>
    </search-form>
    <table-list
      is-check
      is-zoom
      :page-list="pageList"
      v-model="chooseList"
      :columns="SuperviseColumns"
      @clickRow="clickRow"
      @selectAll="selectAll"
      :table-list="userList"
    >
      <template v-slot:other1="other1">
        {{ other1.record }}
      </template>
      <template v-slot:actions="action" class="u-fx">
        <a-tooltip placement="topLeft" title="查看">
          <a-button size="small" class="detail-action-btn" icon="ellipsis" @click="goDetail(action.record)"></a-button>
        </a-tooltip>
        <a-popconfirm placement="topLeft" ok-text="确定" cancel-text="取消" @confirm="superviseEnd(action.record)">
          <template slot="title">
            确定结束督办该隐患任务吗？
          </template>
          <a-tooltip placement="topLeft" title="撤销">
            <a-button
              v-if="action.record.superviseState === '0' && action.record.superviseUserCode == userInfo.userCode"
              size="small"
              class="del-action-btn"
              icon="delete"
              >结束督办</a-button
            >
          </a-tooltip>
        </a-popconfirm>
      </template>
    </table-list>
    <page-num v-model="pageList" :total="total" @change-page="showList(searchObj)"></page-num>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import TableList from '@c/TableList'
import SearchForm from '@c/SearchForm'
import PageNum from '@c/PageNum'
import DropDown from '../../component/Dropdown'
import { searchLabelSupervise } from '../../assets/js/searchLabel'
import { SuperviseColumns } from '../../assets/js/tableColumns'
import hostEnv from '@config/host-env'
export default {
  components: {
    TableList,
    SearchForm,
    DropDown,
    PageNum
  },
  data() {
    this.schoolCodes = ''
    return {
      searchObj: {
        // sourceDanger: '',
        // DangerLevel: '',
        // DangerState: '',
        // streetCode: ''
      },
      searchLabelSupervise,
      SuperviseColumns,
      pageList: {
        page: 1,
        size: 10
      },
      userList: [],
      chooseList: [], // 当有选择项时，被选中的项，返回每项的唯一id
      searchList: [],
      total: 0
    }
  },
  computed: {
    ...mapState('home', ['schoolCode', 'schoolName', 'userInfo'])
  },
  created() {},
  async mounted() {
    await this._getEndSchools()
    await this.showList()
    // this._getStreet()
  },
  methods: {
    ...mapActions('home', [
      'getDangerList',
      'superviseDanger',
      'getStreet',
      'getGroup',
      'underSchoolList',
      'exportDanger'
    ]),
    // async _getStreet() {
    //   const req = {
    //     eduCode: this.schoolCode,
    //     pageNum: this.pageList.page,
    //     pageSize: this.pageList.size
    //   }
    //   const res = await this.getStreet(req)
    //   this.searchLabelSupervise[2].list = res.data.list.map(item => {
    //     return {
    //       key: item.streetCode,
    //       val: item.streetName
    //     }
    //   })
    // },
    // async _getSchools() {
    //   console.log(this.searchObj)
    //   const req = {
    //     eduCode: this.schoolCode,
    //     streetCode: this.searchObj.streetCode
    //   }
    //   const res = await this.getGroup(req)
    //   return res.data[0].memberList && res.data[0].memberList.map(v => v.eduCode)
    // },
    // 根据教育局查所有学校
    async _getEndSchools() {
      const req = {
        eduCode: this.schoolCode,
        areas: [],
        keyWord: '',
        page: 1,
        schoolStage: '',
        size: 20
      }
      const res = await this.underSchoolList(req)
      this.schoolCodes = res.data.list.map(v => v.schoolCode)
      // return res.data[0].memberList && res.data[0].memberList.map(v => v.eduCode)
    },
    async showList() {
      const req = {
        ...this.searchObj,
        ...this.pageList,
        schoolCodes: this.schoolCodes,
        hasSupervise: true
      }
      const res = await this.getDangerList(req)
      this.userList = res.data.records
      this.total = res.data.total
    },
    searchForm(value) {
      this.searchObj = value
      this.showList()
    },
    // 导出
    exportHazards() {
      var url = `${hostEnv.protal_api_8091}/dangerTask/export/edu`
      const req = {
        ...this.searchObj,
        ...this.pageList,
        schoolCodes: this.schoolCodes,
        hasSupervise: true
      }
      var xhr = new XMLHttpRequest()
      xhr.open('POST', url, true) // 也可以使用POST方式，根据接口
      xhr.responseType = 'blob'
      xhr.onload = function() {
        if (this.status === 200) {
          var content = this.response
          var aTag = document.createElement('a')
          var blob = new Blob([content])
          var headerName = xhr.getResponseHeader('Content-disposition')
          var fileName = decodeURIComponent(headerName).substring(20)
          aTag.download = fileName
          aTag.href = URL.createObjectURL(blob)
          aTag.click()
          URL.revokeObjectURL(blob)
        }
      }
      xhr.send(JSON.stringify(req))
    },
    // 上报隐患
    reportDangers(record) {
      this.$router.push({
        path: '/accountList/reportDangers',
        props: true
      })
    },
    // 查看隐患
    goDetail(record) {
      this.$router.push({
        path: '/accountList/viewDangers',
        props: true,
        query: {
          id: record.id
          // plateformType: record.record.plateformType,
          // platform: parseInt(record.record.platform)
        }
      })
    },
    // 结束督办
    async superviseEnd(record) {
      const req = {
        superviseState: '1',
        taskId: record.id,
        userCode: record.superviseUserCode,
        userName: record.superviseUserName
      }
      await this.superviseDanger(req)
      this.$tools.goNext(() => {
        this.$message.success(`操作成功`)
      })
      this.showList()
    },
    clickRow() {},
    selectAll() {},
    handleMenuClick() {}
  }
}
</script>
<style lang="less" scoed></style>
