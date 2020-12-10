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
          <a-button size="small" class="detail-action-btn" icon="ellipsis" @click="goDetail(0, action)"></a-button>
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
    width: '5%'
  },
  {
    title: '隐患图片',
    dataIndex: 'dangerPhotoUrl',
    width: '8%',
    scopedSlots: {
      customRender: 'photoPic'
    }
  },
  {
    title: '整改图片',
    dataIndex: 'completePhotoUrl',
    width: '8%',
    scopedSlots: {
      customRender: 'photoPic'
    }
  },
  {
    title: '隐患描述',
    dataIndex: 'description',
    width: '8%'
  },
  {
    title: '隐患来源',
    dataIndex: 'source',
    width: '8%',
    customRender: text => {
      if (text === '1') {
        return '隐患排查'
      } else if (text === '2') {
        return '日常巡查'
      } else if (text === '3') {
        return '专项检查'
      } else if (text === '4') {
        return '社会监督'
      }
    }
  },
  {
    title: '隐患类型',
    dataIndex: 'categoryName',
    width: '8%'
  },
  {
    title: '上报人',
    dataIndex: 'reportName',
    width: '8%'
  },
  {
    title: '隐患状态',
    dataIndex: 'state',
    width: '8%',
    customRender: text => {
      if (text === '1') {
        return '已上报'
      } else if (text === '2') {
        return '已指派'
      } else if (text === '3') {
        return '已处理'
      } else if (text === '4') {
        return '已验收'
      } else if (text === '5') {
        return '已撤销'
      }
    }
  },
  {
    title: '隐患等级',
    dataIndex: 'level',
    width: '8%',
    customRender: text => {
      if (text === '1') {
        return '低风险'
      } else if (text === '2') {
        return '一般风险'
      } else if (text === '3') {
        return '较大风险'
      } else if (text === '4') {
        return '重大风险'
      }
    }
  },
  {
    title: '处理人',
    dataIndex: 'handerName',
    width: '8%'
  },
  {
    title: '最近操作时间',
    dataIndex: 'optTime',
    width: '10%',
    customRender: text => {
      return $tools.getDate(text)
    }
  },
  {
    title: '督办状态',
    dataIndex: 'superviseState',
    width: '8%',
    customRender: (text, record) => {
      if (text === '1') {
        return `督办完成(督办员：${record.superviseUserName})`
      } else if (text === '0') {
        return `正在督办(督办员：${record.superviseUserName})`
      }
    }
  },
  {
    title: '操作',
    width: '12%',
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
        val: '已上报'
      },
      {
        key: '2',
        val: '已指派'
      },
      {
        key: '3',
        val: '已处理'
      },
      {
        key: '4',
        val: '已验收'
      },
      {
        key: '5',
        val: '已撤销'
      }
    ],
    value: 'state',
    type: 'select',
    label: '隐患状态'
  },
  {
    list: [
      {
        key: '',
        val: '全部'
      },
      {
        key: '1',
        val: '督办完成'
      },
      {
        key: '0',
        val: '正在督办'
      }
    ],
    value: 'superviseState',
    type: 'select',
    label: '督办状态'
  },
  {
    value: 'superviseUserName',
    type: 'input',
    label: '督办员姓名',
    placeholder: '请输入'
  }
]
export default {
  name: 'DangerSupervise',
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
      searchList: {
        hasSupervise: true
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
    ...mapActions('home', [
      'getGroupDetail',
      'getGroupClass',
      'getDanger',
      'delDanger',
      'assignDanger',
      'transferDanger'
    ]),
    async getUserList() {
      const res = await this.getGroupDetail({ schoolCode: this.userInfo.schoolCode })
      this.dangerForm.formData1[2].list = this.dangerForm.formData2[0].list = res.data.users.map(el => {
        return {
          ...el,
          val: el.name,
          key: el.code
        }
      })
    },
    async getDangerList() {
      const req = {
        schoolCode: this.userInfo.schoolCode,
        page: 1,
        size: 99999999
      }
      const res = await this.getGroupClass(req)
      this.dangerForm.formData1[0].list = res.data.records.map(el => {
        return {
          ...el,
          val: el.name,
          key: el.code
        }
      })
    },
    async showList() {
      this.searchList.schoolCode = this.userInfo.schoolCode
      this.searchList = Object.assign(this.searchList, this.pageList)
      const res = await this.getDanger(this.searchList)
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
      const url = `${hostEnv.protal_api_8091}/dangerTask/export/school`
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
      const url = type ? '/dangerFind/dangerDeal' : '/dangerFind/dangerDetail'
      this.$router.push({
        path: url,
        query: {
          id: record ? record.record.id : '',
          type: type || undefined
        }
      })
    }
  }
}
</script>
<style lang="less" scoped></style>
