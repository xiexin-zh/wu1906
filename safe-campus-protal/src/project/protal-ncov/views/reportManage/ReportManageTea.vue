<template>
  <div class="page-layout qui-fx">
    <div class="page-left">
      <org-tree @select="select"></org-tree>
    </div>
    <div class="qui-fx-f1 qui-fx-ver">
      <search-form is-reset @search-form="searchForm" :search-label="searchLabel">
        <div slot="left">
          <a-button icon="plus" class="add-btn" @click.stop="addApp">上报</a-button>
          <a-button icon="export" class="export-btn" @click="downFile">导出</a-button>
        </div>
      </search-form>
      <table-list :page-list="pageList" :columns="columns" :table-list="userList">
        <template v-slot:actions="action">
          <a-tooltip placement="topLeft" title="查看健康档案">
            <a-button size="small" class="detail-action-btn" icon="ellipsis" @click="detail(action.record)"></a-button>
          </a-tooltip>
        </template>
        <template v-slot:other5="action">
          <div v-if="action.record.enableFever === false">{{ action.record.enableFever ? '发热' : '未发热' }}</div>
          <a-tag color="#e80000" v-else>{{ action.record.enableFever ? '发热' : '未发热' }}</a-tag>
        </template>
      </table-list>
      <page-num v-model="pageList" :total="total" @change-page="showList"></page-num>
      <add-Report ref="addWhite" :title="title" @updata="showList"></add-Report>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import hostEnv from '@/config/host-env'
import TableList from '@c/TableList'
import PageNum from '@c/PageNum'
import SearchForm from '@c/SearchForm'
import OrgTree from '@c/OrgTree'
import Tools from '@u/tools'
import AddReport from '../component/AddReport'
const columns = [
  {
    title: '序号',
    width: '6%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '姓名',
    dataIndex: 'userName',
    width: '8%'
  },
  {
    title: '性别',
    dataIndex: 'sex',
    width: '8%',
    customRender: text => {
      if (text === '1') {
        return '男'
      } else if (text === '2') {
        return '女'
      } else {
        return '未知'
      }
    }
  },
  {
    title: '组织机构',
    dataIndex: 'orgName',
    width: '8%'
  },
  {
    title: '工号',
    dataIndex: 'workNo',
    width: '8%'
  },
  {
    title: '温度',
    dataIndex: 'temperature',
    width: '8%'
  },
  {
    title: '发热状态',
    width: '8%',
    scopedSlots: {
      customRender: 'other5'
    }
  },
  {
    title: '上报人',
    dataIndex: 'upReporter',
    width: '8%'
  },
  {
    title: '上报地点',
    dataIndex: 'upReportAddress',
    width: '8%'
  },
  {
    title: '上报时间',
    dataIndex: 'upTime',
    width: '10%',
    customRender: text => {
      return Tools.getDate(text)
    }
  },
  {
    title: '抓拍照片',
    dataIndex: 'snacpUrl',
    width: '8%',
    scopedSlots: {
      customRender: 'snapPic'
    }
  },
  {
    title: '操作',
    width: '10%',
    scopedSlots: {
      customRender: 'action'
    }
  }
]
const searchLabel = [
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
        key: 'false',
        val: '未发热'
      },
      {
        key: 'true',
        val: '发热'
      }
    ],
    value: 'enableFever',
    type: 'select',
    label: '状态'
  },
  {
    value: 'rangeTime',
    type: 'rangeTime',
    label: '上报时间',
    customRender: text => {
      return Tools.getDate(text)
    }
  }
]
export default {
  name: 'ReportManageTea',
  components: {
    TableList,
    SearchForm,
    PageNum,
    OrgTree,
    AddReport
  },
  data() {
    return {
      columns,
      searchLabel,
      searchList: {
        userType: '4',
        schoolCode: '',
        orgCode: ''
      },
      pageList: {
        page: 1,
        size: 20
      },
      total: 0,
      userList: [],
      title: '上报疫情'
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  mounted() {
    this.showList()
  },
  methods: {
    ...mapActions('home', ['getReportInfoList', 'addReport']),
    addApp() {
      this.$refs.addWhite.temperature = ''
      this.$refs.addWhite.userName = ''
      this.$refs.addWhite.workNo = ''
      this.$refs.addWhite.orgName = ''
      this.title = '上报疫情'
      this.$refs.addWhite.addVisible = true
    },
    async showList(searchObj = {}) {
      this.searchList.orgCode = this.orgCode
      this.searchList.schoolCode = this.userInfo.schoolCode
      this.searchList = Object.assign(this.searchList, this.pageList, searchObj)
      const res = await this.getReportInfoList(this.searchList)
      this.userList = res.data.list
      this.total = res.data.total
    },
    searchForm(values) {
      this.pageList.page = 1
      this.startDate = values.rangeTime[0]
      this.endDate = values.rangeTime[1]
      const searchObj = {
        userName: values.userName,
        enableFever: values.enableFever,
        startDate: values.rangeTime[0],
        endDate: values.rangeTime[1]
      }
      this.showList(searchObj)
    },
    select(item) {
      this.pageList.page = 1
      this.pageList.size = 20
      this.orgCode = item.code
      this.showList()
    },
    // downFile() {
    //   this.startDate = '2020-01-01'
    //   this.endDate = '2020-10-01'
    //   this.schoolCode = this.userInfo.schoolCode
    //   window.open(
    //     `${hostEnv.protal_api_11005}/day/record/download/4?startDate=${this.startDate}&endDate=${this.endDate}&schoolCode=${this.schoolCode}`
    //   )
    // },
    downFile() {
      var url = `${hostEnv.protal_api_11005}/day/record/download`
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
      const req = {
        ...this.searchList,
        startDate: this.startDate,
        endDate: this.endDate
      }
      xhr.send(JSON.stringify(req))
    },
    detail(record) {
      this.$router.push({
        path: '/component/detail',
        query: {
          id: record.userCode,
          userType: '4'
        }
      })
    },
    getDateTime(date) {
      if (date === '' || date === null) {
        return '--'
      }
      const d = new Date(date)
      return (
        d.getFullYear() +
        '-' +
        (d.getMonth() + 1 > 9 ? d.getMonth() + 1 : '0' + (d.getMonth() + 1)) +
        '-' +
        (d.getDate() > 9 ? d.getDate() : '0' + d.getDate()) +
        ' ' +
        (d.getHours() > 9 ? d.getHours() : '0' + d.getHours()) +
        ':' +
        (d.getMinutes() > 9 ? d.getMinutes() : '0' + d.getMinutes()) +
        ':' +
        (d.getSeconds() > 9 ? d.getSeconds() : '0' + d.getSeconds())
      )
    }
  }
}
</script>
<style lang="less" scoped>
.top {
  margin-bottom: 10px;
}
</style>
