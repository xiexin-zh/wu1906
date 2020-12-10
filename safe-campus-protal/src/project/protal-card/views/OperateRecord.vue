<template>
  <div class="page-layout qui-fx">
    <div class="qui-fx-f1 qui-fx-ver">
      <search-form
        isReset
        @search-form="searchForm"
        :search-label="searchLabel">
        <div slot="left">
          <a-button icon="export" class="export-all-btn" @click="handleTplDownload">导出</a-button>
        </div>
      </search-form>
      <table-list
        :page-list="pageList"
        :columns="columns"
        :table-list="recordList">
        <template v-slot:other1="record">
          <a-tag :color="$tools.color(record.record.onState)" >{{ record.record.onState | onState }}</a-tag>
        </template>
        <template v-slot:other2="record">
          <a-tag :color="$tools.color(record.record.offState)" >{{ record.record.offState | onState }}</a-tag>
        </template>
      </table-list>
      <page-num
        v-model="pageList"
        :total="total"
        @change-page="showList"></page-num>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import SearchForm from '@c/SearchForm'
import TableList from '@c/TableList'
import PageNum from '@c/PageNum'
import Tools from '@u/tools'
import hostEnv from '@config/host-env'
const columns = [
  {
    title: '序号',
    width: '8%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '姓名',
    dataIndex: 'userName',
    width: '10%'
  },
  {
    title: '学号/工号',
    dataIndex: 'workNo',
    width: '10%'
  },
  {
    title: '班级/部门',
    dataIndex: 'orgName',
    width: '10%'
  },
  {
    title: '操作类型',
    dataIndex: 'status',
    width: '10%',
    customRender: text => {
      if (text === -1) {
        return '未发卡'
      } else if (text === 0) {
        return '已发卡'
      } else if (text === 1) {
        return '已挂失'
      } else if (text === 2) {
        return '已销卡'
      }
    }
  },
  {
    title: '卡号',
    dataIndex: 'card',
    width: '10%'
  },
  {
    title: '账户余额',
    dataIndex: 'balance',
    width: '10%'
  },
  {
    title: '操作人员',
    dataIndex: 'updateUser',
    width: '10%'
  },
  {
    title: '操作时间',
    dataIndex: 'updateTime',
    width: '10%',
    customRender: text => {
      return Tools.getDate(text)
    }
  },
  {
    title: '备注',
    width: '10%',
    dataIndex: 'reamk'
  }
]
const searchLabel = [
  {
    value: 'rangeTime',
    type: 'rangeTime',
    label: '时间'
  },
  {
    value: 'card',
    type: 'input',
    label: '卡号',
    placeholder: '请输入卡号'
  },
  {
    value: 'userName',
    type: 'input',
    label: '姓名',
    placeholder: '请输入姓名'
  },
  {
    list: [
      {
        key: '',
        val: '全部'
      },
      {
        key: -1,
        val: '未发卡'
      },
      {
        key: 0,
        val: '已发卡'
      },
      {
        key: 1,
        val: '已挂失'
      },
      {
        key: 2,
        val: '已销卡'
      }
    ],
    value: 'status',
    type: 'select',
    label: '操作类型'
  }
]
export default {
  name: 'OperateRecord',
  components: {
    SearchForm,
    TableList,
    PageNum
  },
  data () {
    return {
      searchLabel,
      searchList: {
        card: '',
        endTime: '',
        createTime: '',
        status: '',
        userName: ''
      },
      pageList: {
        page: 1,
        size: 20
      },
      total: 0,
      columns,
      recordList: [],
      exportTime: ''
    }
  },
  computed: {
    ...mapState('home', [
      'userInfo'
    ])
  },
  mounted () {
    // this.searchList.schoolCode = this.userInfo.schoolCode
    this.showList()
  },
  methods: {
    ...mapActions('home', [
      'getOperateCard', 'exportOptRecord'
    ]),
    handleTplDownload () {
      var url = `${hostEnv.hpb_consume}/card/record/exportCardInfoList`
      var xhr = new XMLHttpRequest()
      xhr.open('POST', url, true) // 也可以使用POST方式，根据接口
      xhr.responseType = 'blob'
      xhr.onload = function () {
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
    async showList () {
      this.searchList = Object.assign(this.searchList, this.pageList)
      const res = await this.getOperateCard(this.searchList)
      this.recordList = res.data.list
      this.total = res.data.total
    },
    searchForm (values) {
      console.log('value', values)
      this.pageList.page = 1
      this.pageList.size = 20
      this.searchList.createTime = values.rangeTime[0]
      this.searchList.endTime = values.rangeTime[1]
      this.searchList = Object.assign(this.searchList, values)
      this.showList()
    }
  }
}
</script>
<style lang="less" scoped>
</style>
