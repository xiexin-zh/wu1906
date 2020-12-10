<template>
  <div class="health-file qui-page">
    <a-row :gutter="14">
      <a-col class="qui-fx-ver" :span="16">
        <a-row :gutter="14">
          <div class="top qui-fx">
            <a-col :span="8">
              <div class="gutter-box qui-fx-jsb">
                <div class="left">
                  <h1>{{ schoolData.schoolNum }}<span>所</span></h1>
                  <p>隶属学校</p>
                </div>
                <div class="right">
                  <img :src="xs1Img" alt="">
                </div>
              </div>
            </a-col>
            <a-col :span="8">
              <div class="gutter-box">
                <div class="gutter-box qui-fx-jsb">
                  <div class="left">
                    <h1>{{ schoolData.studentNum }}<span>人</span></h1>
                    <p>学生人数</p>
                  </div>
                  <div class="right">
                    <img :src="xx1Img" alt="">
                  </div>
                </div>
              </div>
            </a-col>
            <a-col :span="8">
              <div class="gutter-box">
                <div class="gutter-box qui-fx-jsb">
                  <div class="left">
                    <h1>{{ schoolData.teacherNum }}<span>人</span></h1>
                    <p>教职工人数</p>
                  </div>
                  <div class="right">
                    <img :src="jzg1Img" alt="">
                  </div>
                </div>
              </div>
            </a-col>
          </div>
          <div class="mid qui-fx-ver">
            <div class="gutter-box qui-fx-ver" :style="{height:midHeight}">
              <div class="title">
                <h3>体温异常史</h3>
              </div>
              <table-list
                :page-list="pageList1"
                :columns="heatColumns"
                :table-list="heatList">
              </table-list>
              <page-num :marTop="5" :marBot="5" v-model="pageList1" :total="heatTotal" @change-page="showTemperatureList"></page-num>
            </div>
          </div>
          <div class="mid qui-fx-ver">
            <div class="gutter-box qui-fx-ver" :style="{height:midHeight}">
              <div class="title">
                <h3>疫情人员接触史</h3>
              </div>
              <table-list
                :page-list="pageList2"
                :columns="touchColumns"
                :table-list="touchList">
              </table-list>
              <page-num :marTop="5" :marBot="5" v-model="pageList2" :total="touchTotal" @change-page="showTouchList"></page-num>
            </div>
          </div>
        </a-row>
      </a-col>
      <a-col :span="8">
        <div id="tableList1" class="gutter-box qui-fx-ver" :style="{ height:rightHeight,overflow:'hidden'}">
          <div class="title">
            <h3>填报统计</h3>
          </div>
          <a-table
            style="height: 400px"
            :scroll="{y: this.$tools.setScroll('tableList1') - 50}"
            :pagination="false"
            :columns="fillColumns"
            :dataSource="fillList"
          >
            <template slot="stucollect" slot-scope="text, record">
              <span>{{ record.realStudentNum }} / {{ record.totalStudentNum}}</span>
            </template>
            <template slot="teacollect" slot-scope="text, record">
              <span>{{ record.realTeacherNum }} / {{ record.totalTeacherNum }}</span>
            </template>
            <template slot="action" slot-scope="text, record">
              <a-tooltip placement="topLeft" title="详情">
                <a-button size="small" class="detail-action-btn" icon="ellipsis" @click="schoolDetail(record)"></a-button>
              </a-tooltip>
            </template>
          </a-table>
          <!-- <page-num :marTop="5" :marBot="5" v-model="pageList3" :total="fillTotal" @change-page="showStatisticsList"></page-num> -->
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import TableList from './components/TableList'
import PageNum from '@c/PageNum'
import xs1Img from '../../assets/img/organize/xs.png'
import xx1Img from '../../assets/img/organize/xx.png'
import jzg1Img from '../../assets/img/organize/jzg.png'
const heatColumns = [
  {
    title: '学校名称',
    dataIndex: 'schoolName',
    width: '20%'
  },
  {
    title: '姓名',
    dataIndex: 'userName',
    width: '20%'
  },
  {
    title: '人员类型',
    dataIndex: 'userType',
    width: '20%',
    customRender: (text) => {
      if (text === '1') {
        return '教职工'
      } else if (text === '2') {
        return '学生'
      }
    }
  },
  {
    title: '填报日期',
    dataIndex: 'reportTime',
    width: '20%',
    customRender: (text) => {
      return new Date(text).toLocaleDateString()
    }
  },
  {
    title: '联系电话',
    dataIndex: 'phone',
    width: '20%'
  }
]
const touchColumns = [
  {
    title: '学校名称',
    dataIndex: 'schoolName',
    width: '20%'
  },
  {
    title: '姓名',
    dataIndex: 'userName',
    width: '20%'
  },
  {
    title: '人员类型',
    dataIndex: 'userType',
    width: '20%',
    customRender: (text) => {
      if (text === '1') {
        return '教职工'
      } else if (text === '2') {
        return '学生'
      }
    }
  },
  {
    title: '填报日期',
    dataIndex: 'date',
    width: '20%',
    customRender: (text) => {
      return new Date(text).toLocaleDateString()
    }
  },
  {
    title: '联系电话',
    dataIndex: 'phone',
    width: '20%'
  }
]
const fillColumns = [
  {
    title: '学校',
    dataIndex: 'schoolName',
    width: '20%'
  },
  {
    title: '学生实上报/应上报',
    dataIndex: 'realStudentNum',
    width: '30%',
    scopedSlots: {
      customRender: 'stucollect'
    }
  },
  {
    title: '教职工实上报/应上报',
    dataIndex: 'realTeacherNum',
    width: '30%',
    scopedSlots: {
      customRender: 'teacollect'
    }
  },
  {
    title: '操作',
    width: '20%',
    scopedSlots: {
      customRender: 'action'
    }
  }
]
export default {
  name: 'HealthFile',
  components: {
    TableList,
    PageNum
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  data() {
    return {
      xs1Img,
      xx1Img,
      jzg1Img,
      heatColumns,
      touchColumns,
      fillColumns,
      midHeight: '300px',
      rightHeight: '600px',
      tabHeight: '400px',
      pageList1: {
        page: 1,
        size: 20
      },
      pageList2: {
        page: 1,
        size: 20
      },
      pageList3: {
        page: 1,
        size: 20
      },
      heatTotal: 1,
      touchTotal: 1,
      fillTotal: 1,
      heatList: [],
      touchList: [],
      fillList: [],
      schoolData: {
        schoolNum: 0,
        studentNum: 0,
        teacherNum: 0
      }
    }
  },
  created() {
    this.midHeight = (document.body.clientHeight - 265) / 2 + 'px'
    this.rightHeight = (document.body.clientHeight - 135) + 'px'
    this.tabHeight = (document.body.clientHeight - 400) + 'px'
    this.showBaseData()
  },
  mounted() {
    this.showTemperatureList()
    this.showTouchList()
    this.showStatisticsList()
  },
  methods: {
    ...mapActions('home', [
      'getTemperature', 'getBaseData', 'getTouch', 'getStatistics'
    ]),
    // 获取学校用户数量
    async showBaseData() {
      const req = {
        phone: this.userInfo.phone
      }
      const res = await this.getBaseData(req)
      this.schoolData.schoolNum = res.result.schoolCount
      this.schoolData.studentNum = res.result.studentCount
      this.schoolData.teacherNum = res.result.teacherCount
    },
    // 体温异常史
    async showTemperatureList() {
      const req = {
        phone: this.userInfo.phone,
        ...this.pageList1
      }
      const res = await this.getTemperature(req)
      this.heatList = res.result.list
      this.heatTotal = res.result.totalCount
    },
    // 疫情人员接触史
    async showTouchList() {
      const req = {
        phone: this.userInfo.phone,
        ...this.pageList2
      }
      const res = await this.getTouch(req)
      this.touchList = res.result.list
      this.touchTotal = res.result.totalCount
    },
    // 填报统计
    async showStatisticsList() {
      const req = {
        phone: this.userInfo.phone
      }
      const res = await this.getStatistics(req)
      this.fillList = res.result
      this.fillTotal = res.result.totalCount
    },
    schoolDetail(record) {
      console.log(record)
      this.$router.push({ path: '/overview', query: { schoolCode: record.schoolCode, schoolName: record.schoolName } })
    }
  }
}
</script>
<style lang="less" scoped>
.health-file{
  .title{
    padding: 5px 0 0 10px;
    height: 25px;
    line-height: 25px;
    margin-bottom: 10px;
    h3{
      background: url('../../assets/img/organize/li.png') no-repeat left center;
      text-indent: 15px;
      margin-bottom: 0;
    }
  }
  .gutter-box{
    background: #fff;
    border-radius: 4px;
  }
  .top{
    margin: 5px 5px 10px 5px;
    .gutter-box{
      .left{
        margin: 20px 0 20px 20px;
        h1{
          margin-bottom: 0;
          color: #2163da;
          span{
            margin-left: 10px;
            font-size: 12px;
          }
        }
        p{
          margin-bottom: 0;
          font-size: 12px;
          color: #999;
        }
      }
      .right{
        margin:20px 20px 20px 0;
        img{
          width: 66px;
          height: 66px;
        }
      }
    }
  }
  .mid{
    margin: 5px 12px 10px 12px;
    .gutter-box{
      padding: 5px;
    }
  }
}
</style>
