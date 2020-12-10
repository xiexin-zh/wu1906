<template>
  <div class="page-layout qui-fx-ver">
    <a-tabs default-active-key="1" @change="change">
      <a-tab-pane key="1" tab="巡检任务"> </a-tab-pane>
      <a-tab-pane key="2" tab="巡检记录"> </a-tab-pane>
    </a-tabs>
    <search-form is-reset @search-form="searchForm" :search-label="searchLabel1" v-if="tabActive === '1'">
      <div slot="left">
        <a-button icon="plus" class="add-action-btn" @click="addApp(0)">添加巡检任务</a-button>
        <a-button icon="play-circle" class="play-action-btn" @click="changeState(0)">批量启用</a-button>
        <a-button icon="copy" class="copy-action-btn" @click="changeState(1)">批量禁用</a-button>
        <a-button icon="delete" class="del-btn" @click="dels">批量删除</a-button>
      </div>
    </search-form>
    <search-form is-reset @search-form="searchForm" :search-label="searchLabel2" v-if="tabActive === '2'">
      <div slot="left">
        <a-button icon="export" class="export-btn" @click="exportClick(0)">导出检查人任务详情</a-button>
        <a-button icon="export" class="export-all-btn" @click="exportClick(1)">导出巡查任务详情</a-button>
      </div>
    </search-form>
    <table-list
      is-check
      :page-list="pageList"
      :columns="tabActive === '1' ? dailyColumns.task : dailyColumns.record"
      :table-list="userList"
      v-model="chooseList"
      @clickRow="clickRow"
      @selectAll="selectAll"
    >
      <template v-slot:actions="action">
        <a-tooltip placement="topLeft" title="复用">
          <a-button size="small" class="copy-action-btn" icon="copy" @click.stop="addApp(3, action)"></a-button>
        </a-tooltip>
        <a-tooltip placement="topLeft" title="编辑">
          <a-button size="small" class="edit-action-btn" icon="form" @click.stop="addApp(1, action)"></a-button>
        </a-tooltip>
        <a-popconfirm placement="left" okText="确定" cancelText="取消" @confirm="del(0, action)">
          <template slot="title"> 确定删除该巡检任务吗? </template>
          <a-tooltip placement="topLeft" title="删除">
            <a-button size="small" class="del-action-btn" icon="delete"></a-button>
          </a-tooltip>
        </a-popconfirm>
        <a-popconfirm placement="left" okText="确定" cancelText="取消" @confirm="del(1, action)">
          <template slot="title">您确定{{ action.record.state === '1' ? '禁用' : '启用' }}吗?</template>
          <a-tooltip placement="topLeft" :title="action.record.state === '1' ? '禁用' : '启用'">
            <a-button size="small" class="play-action-btn" icon="play-circle"></a-button>
          </a-tooltip>
        </a-popconfirm>
      </template>
      <template v-slot:other1="other1">
        <div v-if="other1.record.taskTimeType === '1'">
          {{ other1.record.dates.map(el => el.substr(0, 10)).join(',') }}
        </div>
        <div v-if="other1.record.timeType === '1' && other1.record.taskTimeType === '2'">
          {{ other1.record.dates | getWeeks }}
        </div>
        <div v-if="other1.record.timeType === '1' && other1.record.taskTimeType === '3'">
          {{ other1.record.dates.map(el => (el > 9 ? `${el}日` : `0${el}日`)).join(',') }}
        </div>
        <div v-if="other1.record.timeType === '2' && other1.record.taskTimeType === '2'">
          {{ other1.record.dates.map(el => `${other1.record.year}-第${el}周`).join(',') }}
        </div>
        <div v-if="other1.record.timeType === '2' && other1.record.taskTimeType === '3'">
          {{
            other1.record.dates
              .map(el => (el > 9 ? `${other1.record.year}-${el}月` : `${other1.record.year}-0${el}月`))
              .join(',')
          }}
        </div>
        <div v-if="other1.record.taskTimeType === '4'">
          {{ other1.record.dates.map(el => `${other1.record.year}-第${el}季度`).join(',') }}
        </div>
      </template>
      <template v-slot:other2="other2">
        <a-tag v-if="other2.record.state === '1'" color="#87d068">启用</a-tag>
        <a-tag v-if="other2.record.state === '2'" color="#f50">禁用</a-tag>
      </template>
      <template v-slot:other3="other3">
        <a-tooltip placement="topLeft" title="查看">
          <a-button
            size="small"
            class="detail-action-btn"
            icon="ellipsis"
            @click="goDetail(other3.record.taskId)"
          ></a-button>
        </a-tooltip>
      </template>
      <template v-slot:other4="other4">
        <div v-if="other4.record.taskTimeType === '1'">
          {{ other4.record.startTime | getDate(2) }}({{ other4.record.startTime | getDate(3) }} -
          {{ other4.record.endTime | getDate(3) }})
        </div>
        <div v-if="other4.record.timeType === '1' && other4.record.taskTimeType === '2'">
          {{ other4.record.dateNum | getWeekDay }}
        </div>
        <div v-if="other4.record.timeType === '1' && other4.record.taskTimeType === '3'">
          {{ other4.record.dateNum > 9 ? `${other4.record.dateNum}日` : `0${other4.record.dateNum}日` }}
        </div>
        <div v-if="other4.record.timeType === '2' && other4.record.taskTimeType === '2'">
          {{ other4.record.startTime | getDate(2) }}({{ other4.record.startTime | getDate(2) }} -
          {{ other4.record.endTime | getDate(2) }})
        </div>
        <div v-if="other4.record.timeType === '2' && other4.record.taskTimeType === '3'">
          {{ other4.record.year }}年-{{ other4.record.dateNum }}月({{ other4.record.startTime | getDate(2) }} -
          {{ other4.record.endTime | getDate(2) }})
        </div>
        <div v-if="other4.record.taskTimeType === '4'">
          {{ other4.record.year }}年-第{{ other4.record.dateNum }}季度
        </div>
      </template>
    </table-list>
    <page-num v-if="tabActive === '1'" v-model="pageList" :total="total" @change-page="showList"></page-num>
    <page-num v-else v-model="recordPage" :total="recordTotal" @change-page="taskRecordGet"></page-num>
  </div>
</template>

<script>
import hostEnv from '@config/host-env'
import { mapState, mapActions } from 'vuex'
import SearchForm from '@c/SearchForm'
import TableList from '@c/TableList'
import PageNum from '@c/PageNum'
import dailyColumns from '../assets/js/table/dailyColumns'
const searchLabel1 = [
  {
    value: 'taskName',
    type: 'input',
    label: '任务名称',
    placeholder: '请输入'
  },
  {
    value: 'address',
    type: 'input',
    label: '检查地点',
    placeholder: '请输入'
  }
]
const searchLabel2 = [
  {
    list: [
      {
        key: '',
        val: '全部'
      },
      {
        key: '1',
        val: '已巡查'
      },
      {
        key: '0',
        val: '未巡查'
      }
    ],
    value: 'state',
    type: 'select',
    label: '巡查状态'
  },
  {
    value: 'addressName',
    type: 'input',
    label: '巡查地点',
    placeholder: '请输入'
  },
  {
    value: 'userName',
    type: 'input',
    label: '巡查人',
    placeholder: '请输入'
  },
  {
    value: 'rangeTime', // 日期区间
    type: 'rangeTime',
    label: '巡查时间'
  }
]
export default {
  name: 'Inspect',
  components: {
    TableList,
    PageNum,
    SearchForm
  },
  props: {
    url: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      dailyColumns,
      searchLabel1,
      searchLabel2,
      total: 0,
      recordTotal: 0,
      pageList: {
        page: 1,
        size: 20
      },
      taskSearch: {
        taskType: '',
        taskName: '',
        address: ''
      },
      userList: [],
      form: this.$form.createForm(this),
      areaList: [],
      disabled: false,
      title: '添加巡检任务',
      chooseList: [],
      tabActive: '1',
      recordPage: {
        page: 1,
        size: 20
      },
      searchList: {
        taskType: '',
        addressName: '',
        endTime: '',
        startTime: '',
        state: '',
        userName: ''
      }
    }
  },
  filters: {
    getYear(date, type = 'year') {
      if (!date) {
        return '--'
      }
      const d = new Date(date)
      const time =
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
      if (type === 'dateTime') {
        return time
      } else if (type === 'date') {
        return time.substring(0, 10)
      } else if (type === 'time') {
        return time.substring(11, 15)
      }
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  mounted() {
    this.taskSearch.taskType = this.type
    this.searchList.taskType = this.type
    this.showList()
  },
  methods: {
    ...mapActions('home', [
      'getTaskList',
      'delTask',
      'delTasks',
      'getSubNodes',
      'inspectDetail',
      'changeTask',
      'changeTasks',
      'getTaskRecord',
      'exportUser',
      'exportTask'
    ]),
    async showList() {
      this.taskSearch.schoolCode = this.userInfo.schoolCode
      this.taskSearch = Object.assign(this.taskSearch, this.pageList)
      const res = await this.getTaskList(this.taskSearch)
      this.userList = res.data.records
      this.total = res.data.total
    },
    // 巡检记录
    async taskRecordGet() {
      this.searchList.schoolCode = this.userInfo.schoolCode
      this.searchList = Object.assign(this.searchList, this.recordPage)
      const res = await this.getTaskRecord(this.searchList)
      this.userList = res.data.records
      this.recordTotal = res.data.total
    },
    // tab切换
    change(key) {
      this.tabActive = key
      if (key === '1') {
        this.pageList.page = 1
        this.pageList.size = 20
        this.taskSearch.taskName = ''
        this.taskSearch.address = ''
        this.showList()
      } else {
        this.searchList.state = ''
        this.searchList.addressName = ''
        this.searchList.userName = ''
        this.searchList.startTime = ''
        this.searchList.endTime = ''
        this.recordPage.page = 1
        this.recordPage.size = 20
        this.taskRecordGet()
      }
    },
    changePage() {
      if (this.tabActive === '1') {
        this.pageList.page = 1
        this.pageList.size = 20
        this.showList()
      } else {
        this.recordPage.page = 1
        this.recordPage.size = 20
        this.taskRecordGet()
      }
    },
    searchForm(values) {
      if (this.tabActive === '1') {
        this.pageList.page = 1
        this.pageList.size = 20
        this.taskSearch = Object.assign(this.taskSearch, values)
        this.showList()
      } else {
        this.recordPage.page = 1
        this.recordPage.size = 20
        this.searchList.startTime = values.rangeTime ? `${values.rangeTime[0]} 00:00:00` : ''
        this.searchList.endTime = values.rangeTime ? `${values.rangeTime[1]} 23:59:59` : ''
        this.searchList = Object.assign(this.searchList, values)
        this.taskRecordGet()
      }
    },
    async addApp(type, record) {
      this.$router.push({
        path: '/inspectDaily/inspectAdd',
        query: {
          id: record ? record.record.id : '',
          type: type,
          url: this.url
        }
      })
    },
    goDetail(id) {
      this.$router.push({
        path: '/inspectDaily/inspectDetail',
        query: {
          id: id
        }
      })
    },
    del(type, record) {
      if (type) {
        const req = {
          id: record.record.id,
          state: record.record.state === '1' ? '2' : '1'
        }
        this.changeTask(req).then(res => {
          this.$message.success('操作成功')
          this.$tools.goNext(() => {
            this.showList()
            this.chooseList = []
          })
        })
      } else {
        this.delTask(record.record.id).then(res => {
          this.$message.success('操作成功')
          this.$tools.goNext(() => {
            this.showList()
            this.chooseList = []
          })
        })
      }
    },
    dels() {
      if (this.chooseList.length === 0) {
        this.$message.warning('请选择要删除的巡检任务')
        return false
      }
      this.$tools.delTip('确定删除选中的巡检任务吗？', () => {
        this.delTasks(this.chooseList).then(res => {
          this.$message.success('操作成功')
          this.$tools.goNext(() => {
            this.showList()
            this.chooseList = []
          })
        })
      })
    },
    selectAll(item, type) {
      if (type) {
        this.totalList = this.totalList.concat(item)
      } else {
        item.forEach(item => {
          const index = this.totalList.findIndex(list => {
            return list.id === item.id
          })
          this.totalList.splice(index, 1)
        })
      }
    },
    // 监听选中或取消
    clickRow(item, type) {
      if (type) {
        if (this.isCheck) {
          this.totalList.push(item)
        } else {
          this.totalList = [item]
        }
      } else {
        const index = this.totalList.findIndex(list => list.id === item.id)
        this.totalList.splice(index, 1)
      }
    },
    // 批量启用/禁用
    changeState(type) {
      if (this.chooseList.length === 0) {
        this.$message.warning('请选择要操作的巡检任务')
        return false
      }
      const req = {
        ids: this.chooseList,
        state: ''
      }
      if (type) {
        req.state = '2'
      } else {
        req.state = '1'
      }
      this.$tools.delTip(`确定要${type ? '禁用' : '启用'}选中的巡检任务吗？`, () => {
        this.changeTasks(req).then(res => {
          this.$message.success('操作成功')
          this.$tools.goNext(() => {
            this.chooseList = []
            this.showList()
          })
        })
      })
    },
    // 导出
    exportClick(type) {
      let url = ''
      if (type) {
        url = `${hostEnv.protal_api_8091}/userTask/export/user/task/static`
      } else {
        url = `${hostEnv.protal_api_8091}/userTask/export/user/static`
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
      xhr.send(JSON.stringify(this.searchList))
    }
  }
}
</script>
<style lang="less" scoped></style>
