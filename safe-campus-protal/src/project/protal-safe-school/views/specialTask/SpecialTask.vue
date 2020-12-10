<template>
  <div class="page-layout qui-fx-ver">
    <search-form is-reset @search-form="searchForm" :search-label="searchLabel">
      <div slot="left">
        <a-button icon="export" class="export-btn" @click="exportClick">导出</a-button>
      </div>
    </search-form>
    <table-list is-zoom :page-list="pageList" :columns="columns" :table-list="findList">
      <template v-slot:actions="action">
        <a-tooltip placement="topLeft" title="查看">
          <a-button size="small" class="detail-action-btn" icon="ellipsis" @click="goDetail('3', action)"></a-button>
        </a-tooltip>
        <a-tooltip
          placement="topLeft"
          title="自查"
          v-if="action.record.state === '1' && action.record.schoolCode === userInfo.schoolCode"
        >
          <a-button size="small" class="user-action-btn" icon="form" @click="goDetail('1', action)"></a-button>
        </a-tooltip>
        <a-tooltip
          placement="topLeft"
          title="审核"
          v-if="
            action.record.state === '2' &&
              action.record.teamLeaderCode === userInfo.userCode &&
              action.record.schoolCode === userInfo.schoolCode
          "
        >
          <a-button size="small" class="power-action-btn" icon="lock" @click="goDetail('2', action)"></a-button>
        </a-tooltip>
      </template>
    </table-list>
    <page-num v-model="pageList" :total="total" @change-page="showList"></page-num>
  </div>
</template>

<script>
import hostEnv from '@config/host-env'
import { mapState, mapActions } from 'vuex'
import TableList from '@c/TableList'
import PageNum from '@c/PageNum'
import SearchForm from '@c/SearchForm'
import $tools from '@u/tools'
const columns = [
  {
    title: '序号',
    scopedSlots: {
      customRender: 'index'
    },
    width: '8%'
  },
  {
    title: '任务名称',
    dataIndex: 'taskName',
    width: '12%'
  },
  {
    title: '学校名称',
    dataIndex: 'schoolName',
    width: '12%'
  },
  {
    title: '开始时间',
    dataIndex: 'beginTime',
    width: '15%',
    customRender: text => {
      return $tools.getDate(text, 1)
    }
  },
  {
    title: '结束时间',
    dataIndex: 'endTime',
    width: '15%',
    customRender: text => {
      return $tools.getDate(text, 1)
    }
  },
  {
    title: '检查人',
    dataIndex: 'checkerName',
    width: '10%'
  },
  {
    title: '小组长',
    dataIndex: 'teamLeaderName',
    width: '10%'
  },
  {
    title: '任务状态',
    dataIndex: 'state',
    width: '10%',
    customRender: text => {
      if (text === '1') {
        return '未检查'
      } else if (text === '2') {
        return '检查待审核'
      } else if (text === '3') {
        return '小组已审核'
      } else if (text === '4') {
        return '督查完成'
      }
    }
  },
  {
    title: '操作',
    width: '15%',
    scopedSlots: {
      customRender: 'action'
    }
  }
]
const searchLabel = [
  {
    list: [
      {
        key: '',
        val: '全部'
      },
      {
        key: '1',
        val: '未检查'
      },
      {
        key: '2',
        val: '检查待审核'
      },
      {
        key: '3',
        val: '小组已审核'
      },
      {
        key: '4',
        val: '督查完成'
      }
    ],
    value: 'state',
    type: 'select',
    label: '任务状态'
  },
  {
    value: 'name',
    type: 'input',
    label: '任务姓名',
    placeholder: '请输入'
  }
]
export default {
  name: 'SpecialTask',
  components: {
    TableList,
    PageNum,
    SearchForm
  },
  data() {
    return {
      columns,
      searchLabel,
      total: 0,
      pageList: {
        page: 1,
        size: 20
      },
      findList: [],
      searchList: {},
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
    ...mapActions('home', [
      'getGroupDetail',
      'getGroupClass',
      'getSpecialTask',
      'delDanger',
      'assignDanger',
      'transferDanger'
    ]),
    async showList() {
      this.searchList.schoolCode = this.userInfo.schoolCode
      this.searchList.userCode = this.userInfo.userCode
      this.searchList = Object.assign(this.searchList, this.pageList)
      const res = await this.getSpecialTask(this.searchList)
      this.findList = res.data.records
      this.total = res.data.total
    },
    searchForm(values) {
      this.pageList.page = 1
      this.pageList.size = 20
      this.searchList.startDate = values.rangeTime ? `${values.rangeTime[0]} 00:00:00` : ''
      this.searchList.endDate = values.rangeTime ? `${values.rangeTime[1]} 23:59:59` : ''
      this.searchList = Object.assign(this.searchList, values)
      this.showList()
    },
    // 导出
    exportClick(type) {
      const url = `${hostEnv.protal_api_8091}/specialTask/export`
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
      xhr.send(JSON.stringify(this.searchList))
    },
    goDetail(type, record) {
      this.$router.push({
        path: '/specialTask/specialDetail',
        query: {
          state: record.record.state,
          id: record.record.id,
          type: type
        }
      })
    }
  }
}
</script>
<style lang="less" scoped></style>
