<template>
  <div class="page-layout qui-fx">
    <div class="page-left">
      <org-tree @select="select" @defaultCode="defaultCode"></org-tree>
    </div>
    <div class="qui-fx-f1 qui-fx-ver">
      <div class="search-form mar-t10 qui-fx-jsb">
        <div>
          <a-button icon="export" class="export-btn" @click="exportClick">导出</a-button>
        </div>
        <div>
          <span class="mar-r10">日期:</span>
          <a-date-picker @change="dateChange" :default-value="moment(new Date())" :allowClear="false" />
          <span v-if="tempList.length !== 0">
            <span class="mar-r10 mar-l10">测温计划:</span>
            <a-radio-group @change="typeChange" button-style="solid" :value="timeType">
              <a-radio-button
                v-for="list in tempList"
                :key="list.planCode"
                :value="`${list.startTime}+${list.endTime}`"
              >
                {{ list.planName }}
              </a-radio-button>
            </a-radio-group>
          </span>
          <span class="mar-r10 mar-l10">上报情况:</span>
          <a-radio-group @change="statusChange" button-style="solid" :defaultValue="statusType">
            <a-radio-button value="1"> 未上报 </a-radio-button>
            <a-radio-button value="2"> 已上报 </a-radio-button>
            <a-radio-button value="3"> 发热 </a-radio-button>
          </a-radio-group>
        </div>
      </div>
      <div class="qui-fx-f1 qui-fx-ver" style="margin-top:10px;">
        <table-list
          is-zoom
          :page-list="pageList"
          :columns="columns1"
          :table-list="userList"
          :rowKey="(record, index) => index"
        >
          <template slot="other5" slot-scope="text">
            <div :class="text.record.enableFever ? 'temp-color' : ''">{{ text.record.temperature }}</div>
          </template>
        </table-list>
        <page-num ref="pageNum" v-model="pageList" :total="total" @change-page="showList"></page-num>
      </div>
    </div>
  </div>
</template>

<script>
import hostEnv from '@config/host-env'
import OrgTree from '@c/OrgTree'
import { mapState, mapActions } from 'vuex'
import TableList from '@c/TableList'
import PageNum from '@c/PageNum'
import moment from 'moment'
const columns1 = [
  {
    title: '序号',
    width: '8%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '人像',
    dataIndex: 'photoUrl',
    width: '12%',
    scopedSlots: {
      customRender: 'photoPic'
    }
  },
  {
    title: '姓名',
    dataIndex: 'userName',
    width: '12%'
  },
  {
    title: '性别',
    dataIndex: 'sex',
    width: '12%',
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
    width: '12%'
  },
  {
    title: '工号',
    dataIndex: 'workNo',
    width: '12%'
  },
  {
    title: '最高温度',
    width: '10%',
    dataIndex: 'temperature',
    scopedSlots: {
      customRender: 'other5'
    }
  },
  {
    title: '是否发热',
    dataIndex: 'enableFever',
    width: '10%',
    customRender: text => {
      if (text) {
        return '是'
      } else {
        return '否'
      }
    }
  },
  {
    title: '上报次数',
    dataIndex: 'upRecordCount',
    width: '10%'
  }
]
const columns2 = [
  {
    title: '序号',
    width: '10%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '人像',
    dataIndex: 'photoUrl',
    width: '18%',
    scopedSlots: {
      customRender: 'photoPic'
    }
  },
  {
    title: '姓名',
    dataIndex: 'userName',
    width: '18%'
  },
  {
    title: '性别',
    dataIndex: 'sex',
    width: '15%',
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
    width: '20%'
  },
  {
    title: '工号',
    dataIndex: 'workNo',
    width: '18%'
  }
]
export default {
  name: 'TeacherDaily',
  components: {
    TableList,
    PageNum,
    OrgTree
  },
  data() {
    return {
      locale: {
        lang: {
          month: '月',
          year: '年'
        }
      },
      pageList: {
        page: 1,
        size: 20
      },
      searchList: {
        enableRecord: false, // 上报1，未上报2
        enableFever: '', // 1发烧2不发烧
        date: moment(moment(new Date())).format('YYYY-MM-DD'),
        userType: '4',
        schoolCode: ''
      },
      total: 0,
      columns1,
      columns2,
      userList: [],
      tabActive: '1',
      timeType: '',
      statusType: '1',
      tempList: [],
      thermometryDate: this.$tools.getDate(new Date(), 1)
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  mounted() {
    this.searchList.schoolCode = this.userInfo.schoolCode
    // this.dailyGet()
  },
  methods: {
    moment,
    ...mapActions('home', ['getUnReport', 'getDaily', 'getReport', 'getTempPlan']),
    defaultCode(item) {
      this.searchList.orgCode = item.code[0]
      this.planListGet()
    },
    async planListGet() {
      const req = {
        schoolCode: this.userInfo.schoolCode,
        thermometryDate: this.thermometryDate
      }
      const res = await this.getTempPlan(req)
      this.tempList = res.data
      if (res.data.length > 0) {
        this.timeType = `${res.data[0].startTime}+${res.data[0].endTime}`
        this.searchList.startTime = this.$tools.getDate(res.data[0].startTime, 2)
        this.searchList.endTime = this.$tools.getDate(res.data[0].endTime, 2)
        this.searchList.date = this.thermometryDate
        this.showList()
      } else {
        this.userList = []
        this.total = 0
      }
    },
    select(value) {
      this.pageList.page = 1
      this.pageList.size = 20
      this.searchList.orgCode = value.code
      if (this.tempList.length > 0) {
        this.showList()
      } else {
        this.userList = []
        this.total = 0
      }
    },
    async showList() {
      this.searchList = Object.assign(this.searchList, this.pageList)
      const res = await this.getReport(this.searchList)
      this.userList = res.data.list
      this.total = res.data.total
    },
    dateChange(e, date) {
      this.thermometryDate = date
      this.planListGet()
    },
    statusChange(e) {
      const value = e.target.value
      if (value === '1') {
        this.searchList.enableRecord = false
        this.searchList.enableFever = ''
      } else if (value === '2') {
        this.searchList.enableRecord = true
        this.searchList.enableFever = ''
      } else if (value === '3') {
        this.searchList.enableRecord = ''
        this.searchList.enableFever = true
      }
      this.pageList.page = 1
      this.pageList.size = 20
      this.showList()
    },
    typeChange(e) {
      this.timeType = e.target.value
      const time = e.target.value.split('+')
      this.searchList.startTime = this.$tools.getDate(Number(time[0]), 2)
      this.searchList.endTime = this.$tools.getDate(Number(time[1]), 2)
      this.showList()
    },
    async dailyGet() {
      const res = await this.getDaily(this.searchList)
      this.noNum = res.data.noNum
      this.allNum = res.data.allNum
      this.abnormalNum = res.data.abnormalNum
      this.feverNum = res.data.feverNum
    },
    exportClick() {
      var url = `${hostEnv.protal_api_11005}/day/report/export`
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
<style lang="less" scoped>
.page-left {
  background: #fff;
  margin-right: 10px;
}
.grade-tree {
  width: 220px;
  min-height: 400px;
  max-height: 800px;
  overflow-y: auto;
}
.temp-color {
  color: red;
}
</style>
