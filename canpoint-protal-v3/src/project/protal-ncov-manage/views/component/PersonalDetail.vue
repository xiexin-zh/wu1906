<template>
  <div class="leave-detail page-layout u-fx-ver u-type-white-bg">
    <div class="content u-fx-ver">
      <u-space direction="vertical" class="layout-padd">
        <u-detail-show :detail-info="detailInfo" title="基本信息"></u-detail-show>
      </u-space>
      <a-menu :defaultSelectedKeys="['title']" mode="horizontal">
        <a-menu-item key="title">体温走势</a-menu-item>
      </a-menu>
      <!-- :style="{'height':chartHeight}" -->
      <div style="height:250px" >
        <u-charts
          v-if="userCategories.length>0"
          type="line"
          yTitle="温度"
          yTitleColor="#333"
          legendColor="#333"
          xColor="#333"
          yColor="#333"
          xLineColor="#d8dfe7"
          yGridColor="#d8dfe7"
          plotColor="#333"
          id="line-two"
          :key="1"
          :categories="userCategories"
          :series="userSeries"
          plotBorderWidth="3"
        ></u-charts>
      </div>
      <a-menu :defaultSelectedKeys="['title']" mode="horizontal">
        <a-menu-item key="title">疫情上报记录</a-menu-item>
      </a-menu>
      <div class="u-fx u-fx-f1">
        <u-table
          :width="40"
          :height="40"
          is-zoom
          :page-list="pageList"
          :columns="personalColumns"
          :table-list="detailList">
          <template v-slot:slotOne="slotOne">
            {{ slotOne.record.gradeName }}{{ slotOne.record.className }}
          </template>
          <template v-slot:slotTwo="slotTwo">
            <div v-if="slotTwo.record.enableFever === false">{{ slotTwo.record.enableFever ? '发热' : '未发热' }}</div>
            <u-tag type="error" v-else>{{ slotTwo.record.enableFever ? '发热' : '未发热' }}</u-tag>
          </template>
        </u-table>
      </div>
      <div class="u-type-white-bg">
        <u-pagination
          justify="end"
          v-model="pageList"
          :total="total"
          @change="getReportList"
        ></u-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import { getDataState } from '@u/libs/data-state'
import { personalColumns } from '../../table-columns/outInRecord'
import { mapState, mapActions } from 'vuex'
import moment from 'moment'
export default {
  name: 'PersonalDetail',
  components: {
    // ChartComponent,
  },
  data() {
    return {
      moment,
      noData: false,
      pageList: {
        userCode: '',
        page: 1,
        size: 20
      },
      userCategories: [],
      userSeries: [
          {
            name: '体温',
            color: 'rgb(0, 186, 255)',
            data: new Array(13).fill(0)
          }
      ],
      total: 0,
      personalColumns,
      detailList: [],
      detailInfo: {}
    }
  },
  computed: {
    ...mapState('home', ['userInfo', 'loginInfo'])
  },
  mounted() {
    this.schoolType = this.loginInfo.schoolType
    this.userType = this.$route.query.userType
    if (this.userType === '8') {
      this.personalColumns[3].title = '班级'
      this.personalColumns[3].dataIndex = 'className'
      this.personalColumns[4].title = '学号'
      this.personalColumns[3].scopedSlots = {
        customRender: 'slotOne'
      }
    }
    this.getTemperature()
    this.showList()
    this.getReportList()
  },
  created() {
    this.chartHeight = document.body.clientHeight * 0.25 + 'px'
  },
  methods: {
    ...mapActions('home', ['getReportInfo', 'getarchivesDetail', 'getTemperatureData']),
    // 详情数据
    async showList() {
      const userCode = this.$route.query.id
      const req = `${this.userType}/${userCode}`
      const res = await this.getarchivesDetail(req)
      const { userName, sex, orgName, gradeName, photoUrl, className, schoolYearId } = res.data
      this.detailInfo = {
      '姓名': userName,
      '性别': getDataState('sex', sex),
      '组织机构': orgName,
      '班级': this.schoolType === '8' || this.schoolType === '9' ? schoolYearId : '' + gradeName + className,
      '照片': `img=${photoUrl}`
      }
      this.userType === '4' ? delete this.detailInfo['班级'] : delete this.detailInfo['组织机构']
    },
    // 图表数据
    async getTemperature() {
      const req = {
        userCode: this.$route.query.id,
        startDate: this.$tools.getDate(new Date().getTime() - 15 * 24 * 60 * 60 * 1000, 1),
        endDate: this.$tools.getDate(new Date(), 1)
      }
      const res = await this.getTemperatureData(req)
      this.userCategories = new Array(14).fill(1).map((item, index) => {
        return this.$tools.getDate(new Date().getTime() - (index * 24 * 60 * 60 * 1000), 1)
      }).reverse()
      this.userSeries[0].data = res.data.map(el => el.temperature || 0)
    },
    // 表格数据
    async getReportList() {
      this.pageList.userCode = this.$route.query.id
      const res = await this.getReportInfo(this.pageList)
      this.detailList = res.data.list.map((el, index) => {
        return {
          ...el,
          id: index
        }
      })
      this.total = res.data.total
    }
  }
}
</script>
<style lang="less" scoped>
.leave-detail {
  .content{
    height: calc(100% - 10px);
    overflow-y: scroll;
  }
}
</style>
