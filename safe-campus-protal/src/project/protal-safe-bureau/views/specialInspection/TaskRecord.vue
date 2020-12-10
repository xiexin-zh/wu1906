<template>
  <div class="page-layout qui-fx-ver">
    <search-form is-reset @search-form="searchForm" :search-label="taskSearchLabel">
      <div slot="right">
        <a-button icon="plus" class="add-action-btn u-mar-l20" @click="add(0)">添加专项检查</a-button>
      </div>
    </search-form>
    <table-list
      is-zoom
      :page-list="pageList"
      :columns="taskColumns"
      :table-list="findList">
      <template v-slot:actions="action">
        <a-tooltip placement="topLeft" title="查看">
          <a-button size="small" class="detail-action-btn" icon="ellipsis" @click="goDetail(action.record)"></a-button>
        </a-tooltip>
        <a-tooltip placement="topLeft" title="查看报告">
          <a-button size="small" class="export-all-btn" icon="export" @click="goReport(action.record.code)"></a-button>
        </a-tooltip>
      </template>
    </table-list>
    <page-num v-model="pageList" :total="total" @change-page="showList"></page-num>
  </div>
</template>

<script>
// import hostEnv from '@config/host-env'
import { mapState, mapActions } from 'vuex'
import TableList from '@c/TableList'
import PageNum from '@c/PageNum'
import SearchForm from '@c/SearchForm'
import { taskSearchLabel } from '../../assets/js/searchLabel.js'
import { taskColumns } from '../../assets/js/tableColumns'

export default {
  name: 'TaskRecord',
  components: {
    TableList,
    PageNum,
    SearchForm
  },
  data() {
    return {
      taskColumns,
      taskSearchLabel,
      total: 0,
      pageList: {
        page: 1,
        size: 20
      },
      findList: [],
      form: this.$form.createForm(this),
      formStatus: false,
      searchList: {},
      formItemLayout: {
        labelCol: { span: 6 },
        wrapperCol: { span: 16 }
      },
      detailId: '',
      type: ''
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  mounted() {
    this.showList()
  },
  methods: {
    ...mapActions('home', ['specialPage', 'getGroupClass', 'getDanger', 'delDanger', 'assignDanger', 'transferDanger']),
    async showList() {
      const req = {
        ...this.pageList,
        ...this.searchList,
        schoolCode: this.userInfo.schoolCode
      }
      const res = await this.specialPage(req)
      this.findList = res.data.records
      this.total = res.data.total
    },
    async add(type, record) {
      this.$router.push({
        path: '/specialInspection/AddSpecialItem',
        query: {
          type: type
          // id: record ? record.record.id : ''
        }
      })
    },
    searchForm(values) {
      this.searchList = values
      this.showList()
    },
    goDetail(record) {
      this.$router.push({
        path: '/specialInspection/views',
        query: {
          code: record.code,
          teamLeaderName: record.teamLeaderName
        }
      })
    },
    goReport(code) {
      this.$router.push({
        path: '/specialInspection/viewsReport',
        query: {
          code: code
        }
      })
    }
  }
}
</script>
<style lang="less" scoped></style>
