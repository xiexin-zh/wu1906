<template>
  <div class="page-layout qui-fx">
    <div class="calendar">
      <a-calendar :fullscreen="false" @select="select" />
    </div>
    <div class="qui-fx-f1 qui-fx-ver" style="margin-top:10px;">
      <a-tabs defaultActiveKey="1" @change="tabChange" style="height:50px;" type="card">
        <a-tab-pane tab="未上报" key="1"></a-tab-pane>
        <a-tab-pane tab="已上报" key="2"></a-tab-pane>
        <a-tab-pane tab="发热人数" key="3"></a-tab-pane>
      </a-tabs>
      <table-list
        is-zoom
        :page-list="pageList"
        :columns="tabActive === '1' ? columns2: columns1"
        :table-list="userList"
        :rowKey="(record,index) => index"
      >
        <template slot="other5" slot-scope="text">
          <div :class="text.record.enableFever ? 'temp-color' : ''"> {{ text.record.temperature }}</div>
        </template>
      </table-list>
      <page-num ref="pageNum" v-model="pageList" :total="total" @change-page="showList"></page-num>
    </div>
  </div>
</template>

<script>
import 'moment/locale/zh-cn'
import { mapState, mapActions } from 'vuex'
import TableList from '@c/TableList'
import PageNum from '@c/PageNum'
import moment from 'moment'
const columns1 = [
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
    width: '15%',
    scopedSlots: {
      customRender: 'photoPic'
    }
  },
  {
    title: '姓名',
    dataIndex: 'userName',
    width: '15%'
  },
  {
    title: '性别',
    dataIndex: 'sex',
    width: '10%',
    customRender: (text) => {
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
    width: '15%'
  },
  {
    title: '工号',
    dataIndex: 'workNo',
    width: '15%'
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
    customRender: (text) => {
      if (text) {
        return '是'
      } else {
        return '否'
      }
    }
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
    customRender: (text) => {
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
    PageNum
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
      tabActive: '1'
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  mounted() {
    this.searchList.schoolCode = this.userInfo.schoolCode
    this.showList()
    // this.dailyGet()
  },
  methods: {
    ...mapActions('home', ['getUnReport', 'getDaily', 'getReport']),
    select(value) {
      this.pageList.page = 1
      this.pageList.size = 20
      this.searchList.date = moment(value).format('YYYY-MM-DD')
      this.showList()
    },
    async showList() {
      this.searchList = Object.assign(this.searchList, this.pageList)
      const res = await this.getReport(this.searchList)
      this.userList = res.data.list
      this.total = res.data.total
    },
    async dailyGet() {
      const res = await this.getDaily(this.searchList)
      this.noNum = res.data.noNum
      this.allNum = res.data.allNum
      this.abnormalNum = res.data.abnormalNum
      this.feverNum = res.data.feverNum
    },
    tabChange(key) {
      this.tabActive = key
      if (this.tabActive === '1') {
        this.searchList.enableRecord = false
        this.searchList.enableFever = ''
      } else if (this.tabActive === '2') {
        this.searchList.enableRecord = true
        this.searchList.enableFever = ''
      } else if (this.tabActive === '3') {
        this.searchList.enableRecord = ''
        this.searchList.enableFever = true
      }
      this.pageList.page = 1
      this.pageList.size = 20
      this.showList()
    }
  }
}
</script>
<style lang="less" scoped>
.page-layout{
  .calendar{
    width: 300px;
    background-color: #fff;
    margin-right: 10px;
  }
}
.temp-color {
  color: red;
}
</style>
