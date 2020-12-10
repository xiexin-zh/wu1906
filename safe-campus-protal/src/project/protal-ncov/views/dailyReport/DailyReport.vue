<template>
  <div class="page-layout qui-fx">
    <div class="calendar">
      <a-calendar :fullscreen="false" @select="select" />
    </div>
    <div class="qui-fx-f1 qui-fx-ver">
      <a-tabs defaultActiveKey="1" @change="tabChange" style="height:50px;" type="card">
        <a-tab-pane tab="未上报" key="1"></a-tab-pane>
        <a-tab-pane tab="已上报" key="2"></a-tab-pane>
        <a-tab-pane tab="异常人数" key="3"></a-tab-pane>
        <a-tab-pane tab="发热人数" key="4"></a-tab-pane>
      </a-tabs>
      <table-list
        :page-list="pageList"
        :columns="columns"
        :table-list="userList">
        <template v-slot:totalNums="temperature">
          <a-tag v-if="temperature.record.temperature && temperature.record.feverMark === '1'" color="red">{{ temperature.record.temperature }}</a-tag>
          <a-tag v-if="temperature.record.temperature && temperature.record.feverMark === '2'" >{{ temperature.record.temperature }}</a-tag>
          <a-tag v-if="!temperature.record.temperature" >暂无</a-tag>

        </template>
      </table-list>
      <page-num ref="pageNum" v-model="pageList" :total="total" @change-page="showList"></page-num>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import TableList from '@c/TableList'
import PageNum from '@c/PageNum'
import moment from 'moment'
const columns = [
  {
    title: '序号',
    width: '15%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '姓名',
    dataIndex: 'userName',
    width: '30%'
  },
  // {
  //   title: '性别',
  //   dataIndex: 'gender',
  //   width: '10%',
  //   customRender: (text) => {
  //     if (text === 1) {
  //       return '男'
  //     } else if (text === 2) {
  //       return '女'
  //     } else {
  //       return '未知'
  //     }
  //   }
  // },
  {
    title: '温度',
    width: '25%',
    scopedSlots: {
      customRender: 'totalNum'
    }
  },
  // {
  //   title: '测温部位',
  //   dataIndex: 'bodyParts',
  //   width: '20%'
  // },
  {
    title: '测温地点',
    dataIndex: 'site',
    width: '30%'
  }
  // {
  //   title: '所属班级',
  //   dataIndex: 'class',
  //   width: '12%'
  // },
  // {
  //   title: '联系方式',
  //   dataIndex: 'phone',
  //   width: '12%'
  // },
  // {
  //   title: '照片',
  //   dataIndex: 'photoPic',
  //   width: '12%',
  //   scopedSlots: {
  //     customRender: 'photoPic'
  //   }
  // }
]
export default {
  name: 'DailyReport',
  components: {
    TableList,
    PageNum
  },
  data() {
    return {
      pageList: {
        page: 1,
        size: 20,
        reportState: '2', // 上报1，未上报2
        feverMark: '', // 1发烧2不发烧
        mark02: '', // 1异常
        reportTime: moment(moment(new Date())).format('YYYY-MM-DD HH:mm:ss')
      },
      total: 0,
      columns,
      userList: [],
      tabActive: '1'
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  mounted() {
    this.showList()
    // this.dailyGet()
  },
  methods: {
    ...mapActions('home', ['getUnReport', 'getDaily', 'getReport']),
    select(value) {
      this.pageList.page = 1
      this.pageList.size = 20
      this.pageList.reportTime = moment(value).format('YYYY-MM-DD HH:mm:ss')
      this.showList()
    },
    async showList() {
      this.pageList.schoolCode = this.userInfo.orgCode
      const res = await this.getReport(this.pageList)
      this.userList = res.result.list
      this.total = res.result.totalCount
    },
    async dailyGet() {
      const res = await this.getDaily(this.pageList)
      this.noNum = res.data.noNum
      this.allNum = res.data.allNum
      this.abnormalNum = res.data.abnormalNum
      this.feverNum = res.data.feverNum
    },
    tabChange(key) {
      this.tabActive = key
      if (this.tabActive === '1') {
        this.pageList.reportState = '2'
        this.pageList.feverMark = ''
        this.pageList.mark02 = ''
      } else if (this.tabActive === '2') {
        this.pageList.reportState = '1'
        this.pageList.feverMark = ''
        this.pageList.mark02 = ''
      } else if (this.tabActive === '3') {
        this.pageList.reportState = ''
        this.pageList.feverMark = ''
        this.pageList.mark02 = '1'
      } else if (this.tabActive === '4') {
        this.pageList.reportState = ''
        this.pageList.feverMark = '1'
        this.pageList.mark02 = ''
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

</style>
