<template>
  <div class="knowing-statis page-layout u-fx">
    <div class="left-tree u-type-white-bg">
      <dorm-class-tree
        ref="tree"
        :maxHeight="maxHeight"
        @changeTab="changeTab"
        @select="select"
      >
      </dorm-class-tree>
    </div>
    <div class="u-fx-f1 u-fx-ver">
      <u-space direction="vertical" class="layout-padd u-bg-fff ">
        <u-search-form ref="searchForm" :search-label="searchLabel" @search="search">
          <div slot="left">
            类型：
            <u-space>
              <u-radio
                v-model="type"
                button-style="solid"
                :item-list="itemList"
                @change="changeType"
              ></u-radio>
            </u-space>
          </div>
          <div slot="right" class="u-mar-l10">
            <u-download :reqObj="reqObj" title="导出" fileName="教职工" type="light"></u-download>
          </div>
        </u-search-form>
      </u-space>
      <u-space direction="vertical" class="u-bg-fff  u-padd-b20">
        <div class="charts-box" v-if="userCategories.length>0">
          <u-charts
            type="line"
            yTitle="人员数"
            yTitleColor="#333"
            legendColor="#333"
            xColor="#333"
            yColor="#333"
            xLineColor="#d8dfe7"
            yGridColor="#d8dfe7"
            plotColor="#333"
            id="line-one"
            :key="userTag"
            :categories="userCategories"
            :series="userSeries"
            plotBorderWidth="3"
          ></u-charts>
        </div>
        <!-- <line-rbga
          style="height:200px"
          id="KnowingStatis1"
          :data="lineChart"
          :legendData="[
            { name: '出寝', value: 'outNum', color: '#F5B111FF' },
            { name: '未出寝', value: 'unOutNum', color: '#00A35F' }
          ]"
        ></line-rbga> -->
      </u-space>
      <div class="u-fx u-fx-f1 ">
        <u-table
          :width="40"
          :height="40"
          is-zoom
          :page-list="pageList"
          :columns="columns"
          :table-list="userList"
        >
          <template>
            <span slot="customTitle">{{ currentActiveTab === 0 ? '宿舍' : currentActiveTab === 1?'班级':'' }}</span>
          </template>
          <template v-slot:slotThree="slotThree">
            <div @click="detail(slotThree.record)">
              {{ currentActiveTab === 0 ? slotThree.record.roomName : slotThree.record.gradeName + slotThree.record.specilaName + slotThree.record.className }}
            </div>
          </template>
          <template v-slot:slotFour="slotFour">
            <u-tag type="primary">{{ slotFour.record.total }}</u-tag>
          </template>
          <template v-slot:slotOne="slotOne">
            <u-tag type="primary-bd" pointer @change="detail('MO-1',slotOne.record)">{{ slotOne.record.outNum }}</u-tag>
          </template>
          <template v-slot:slotTwo="slotTwo">
            <u-tag type="warning-bd" pointer @change="detail('MO-0',slotTwo.record)">{{ slotTwo.record.unOutNum }}</u-tag>
          </template>
        </u-table>
      </div>
      <div class="u-type-white-bg">
        <u-pagination
          justify="end"
          v-model="pageList"
          :total="total"
          @change="getList"
        ></u-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import { columns } from '../../table-columns/KnowingStatis'
import LineRbga from '@/components/echarts/line/LineRbga'
import DormClassTree from '../../component/DormClassTree'
const searchLabel = [
  {
    value: 'rangeTime', // 日期区间
    type: 'rangeTime',
    label: '日期'
  }
]
export default {
  name: 'KnowingStatis',
  components: {
    DormClassTree,
    LineRbga
  },
  data() {
    return {
      type: 'MO',
      itemList: [
        {
          label: '早查寝',
          value: 'MO'
        },
        {
          label: '午查寝',
          value: 'NI,NO',
          disables: true
        },
        {
          label: '晚查寝',
          value: 'EI'
        }
      ],
      userTag: 0,
      userCategories: [],
      userSeries: [
          {
            name: '出寝',
            color: 'rgb(0, 186, 255)',
            data: [12, 34, 56, 78]
          },
          {
            name: '未出寝',
            color: 'rgba(245, 177, 17, 1)',
            data: [16, 24, 16, 38]
          }
      ],
      searchLabel,
      currentActiveTab: 0,
      maxHeight: document.body.clientHeight - 180,
      showAllTag: '1', // 宿舍默认选中第一层第一项
      searchObj: {
        buildingCode: '', // 楼栋编码
        classCode: '', // 班级编码
        floorCode: '', // 楼层编码
        gradeCode: '', //	年级编码
        planCodes: ['MO'], // 计划编码 MO早查寝出宿舍 NI午查寝进宿舍 NO午查寝出宿舍 EI晚查寝进宿舍
        roomCode: '', //	房间编码
        specilaCode: '', // 专业编码
        startDate: this.$tools.getDate(new Date() - (86400000 * 31), 1),
        endDate: this.$tools.getDate(new Date(), 1)
      },
      reqObj: {
        url: '/protal_v3_11102/canpointCheckStatic/list/export',
        method: 'post'
      },
      lineChart: [], // 统计图
      userList: [],
      columns,
      pageList: { page: 1, size: 20 },
      total: 0
    }
  },
  computed: {
    ...mapState('home', ['schoolCode', 'loginInfo', 'schoolYear'])
  },
  created() {
    this.searchObj.schoolCode = this.schoolCode
    this.reqObj.params = Object.assign(this.searchObj, this.pageList)
  },
  mounted() {
    this.$refs.searchForm.form.setFieldsValue({ 'rangeTime': [this.$tools.getDate(new Date() - (86400000 * 31), 1), this.$tools.getDate(new Date(), 1)] })
  },
  methods: {
    ...mapActions('home', [ 'checkStatiList', 'delTeacher', 'delTeachers' ]),
    // 切换早，午，晚查寝
    changeType(value) {
      this.type = value
      this.searchObj.planCodes = this.type.split(',')
      this.reqObj.params = Object.assign(this.searchObj, this.pageList)
      this.getList()
    },
    // 切换宿舍，班级树
    changeTab(value) {
      this.currentActiveTab = value
      this.$set(this.userList)
    },
    // 切换宿舍，班级树菜单
    select(obj) {
      this.searchObj = Object.assign(this.searchObj, obj.data)
      this.reqObj.params = Object.assign(this.searchObj, this.pageList)
      this.getList()
    },
    async getList() {
      const req = {
        ...this.searchObj,
        ...this.pageList
      }
      const res = await this.checkStatiList(req)
      this.userList = res.data.records
      this.userCategories = res.data.records.map(el => this.$tools.getDate(el.wdate, 1))
      this.userSeries[0].data = res.data.records.map(el => el.outNum)
      this.userSeries[1].data = res.data.records.map(el => el.unOutNum)
      // this.lineChart = res.data.records.map(el => {
      //   return {
      //     yearMonth: this.$tools.getDate(el.wdate, 1),
      //     outNum: el.outNum,
      //     unOutNum: el.unOutNum
      //   }
      // })
      this.total = res.data.total
    },
    search(values) {
      this.searchObj.startDate = values.rangeTime && values.rangeTime[0]
      this.searchObj.endDate = values.rangeTime && values.rangeTime[1]
      this.reqObj.params = Object.assign(this.searchObj, this.pageList)
      this.getList()
    },
    // 详情
    detail(type, record) {
      this.$router.push({
        path: '/knowingStatis/statisDetail',
        query: {
            activeTab: type,
            record: JSON.stringify(record),
            planCodes: this.type,
            infoKey: this.currentActiveTab === 0 ? '宿舍' : '班级'
          }
      })
    }
  }
}
</script>
<style lang="less" scoped>
@deep: ~'>>>';
.knowing-statis{
  // .ant-radio-button-wrapper{
  //   border: 1px solid #36bfff;
  //   color: #36bfff;
  //   &.active{
  //     color: #fff;
  //   }
  // }
  .charts-box {
    width: 98%;
    height: 200px;
    margin: 0 auto;
  }
  // @{deep} .ant-radio-button-wrapper:nth-of-type(1){
  //   border-radius: 4px 0px 0px 4px;
  // }
  //  @{deep} .ant-radio-button-wrapper:nth-of-type(3){
  //   border-radius: 0px 4px 4px 0px;
  // }
}

</style>
