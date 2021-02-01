<template>
  <div class="knowing-statis page-layout u-fx">
    <div class="left-tree u-type-white-bg">
      <u-org-tree
        class="u-mar-t10"
        :maxHeight="maxHeight"
        :school="schoolCode"
        @select="select">
      </u-org-tree>
    </div>
    <div class="u-fx-f1 u-fx-ver">
      <u-space direction="vertical" class="layout-padd u-bg-fff ">
        <u-search-form ref="searchForm" :search-label="TDailysearchLabel" @search="search">
          <div slot="left" v-if="tempList.length>0" class="u-mar-l10">
            测温计划：
            <u-radio
              v-model="timeType"
              button-style="solid"
              :item-list="tempList"
              @change="changeType"
            ></u-radio>
          </div>
          <div slot="right" class="u-mar-l10">
            <u-download :reqObj="reqObj" title="导出" fileName="教职工" type="light"></u-download>
          </div>
        </u-search-form>
      </u-space>
      <div class="u-fx u-fx-f1 ">
        <u-table
          :width="40"
          :height="40"
          is-zoom
          :page-list="pageList"
          :columns="TDailyColums"
          :table-list="userList"
        >
          <template v-slot:slotOne="slotOne">
            <u-type type="sex">{{ getDataState('sex',slotOne.record.sex) }}</u-type>
          </template>
          <template v-slot:slotTwo="slotTwo">
            <u-type >{{ getDataState('enableFever',slotTwo.record.enableFever) }}</u-type>
          </template>
        </u-table>
      </div>
      <div class="u-type-white-bg">
        <u-pagination
          justify="end"
          v-model="pageList"
          :total="total"
          @change="showList"
        ></u-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { getDataState } from '@u/libs/data-state'
import { TDailyColums } from '../../table-columns/outInRecord'
import { TDailysearchLabel } from '../../search-columns/ncovDaily'
import DormClassTree from '../../component/DormClassTree'
import moment from 'moment'
export default {
  name: 'TeacherDaily',
  components: {
    DormClassTree
  },
  data() {
    return {
      timeType: '',
      tempList: [],
      TDailysearchLabel,
      date: this.$tools.getDate(new Date(), 1),
      getDataState,
      maxHeight: document.body.clientHeight - 180,
      searchObj: {
        enableFever: '', // 是否发热(true:发热，false：未发热)
        enableRecord: '', // 是否上报（true：已上报，false：未上报）
        orgCode: '', // 组织编码
        userType: '4', //	用户类型（4：教职工 ，8：学生）
        date: moment(moment(new Date())).format('YYYY-MM-DD'),
        schoolCode: 'CANPOINTLIVE'
        // gradeCode: '', //	基教版-年级编码 高教版-专业编码
      },
      reqObj: {
        url: '/protal_v3_11005/day/report/export',
        method: 'post'
      },
      userList: [],
      TDailyColums,
      pageList: { page: 1, size: 20 },
      total: 0
    }
  },
  computed: {
    ...mapState('home', ['schoolCode', 'loginInfo', 'schoolYear'])
  },
  created() {
    // this.searchObj.schoolCode = this.schoolCode
    this.searchObj.schoolCode = 'CANPOINTLIVE'
    this.reqObj.params = Object.assign(this.searchObj, this.pageList)
  },
  mounted() {
    this.$refs.searchForm.form.setFieldsValue({ 'dateTime': moment(new Date()) })
  },
  methods: {
    ...mapActions('home', [ 'getReport', 'getTempPlan' ]),
    // 切换部门，职位树菜单选择机构编码orgCode 进入页面触发
    select(obj) {
      console.log(obj)
      if (obj.type === '1') {
        this.searchObj.orgCode = obj.code
        this.searchObj.orgCode = 'CANPOINTLIVE'
      } else {
        this.searchObj.jobCode = obj.code
      }
      this.reqObj.params = Object.assign(this.searchObj, this.pageList)
      this.planListGet()
    },
    // 获取测温计划时间列表
    async planListGet(time) {
      const req = {
        schoolCode: 'CANPOINTLIVE',
        thermometryDate: time || this.$tools.getDate(new Date(), 1)
      }
      const res = await this.getTempPlan(req)
      this.tempList = res.data.map(el => {
        return {
          label: el.planName,
          value: `${el.startTime}+${el.endTime}`
        }
      })
      if (res.data.length > 0) {
        this.timeType = `${res.data[0].startTime}+${res.data[0].endTime}`
        this.searchObj.startTime = this.$tools.getDate(res.data[0].startTime, 2, 's')
        this.searchObj.endTime = this.$tools.getDate(res.data[0].endTime, 2, 's')
        this.showList()
      } else {
        this.userList = []
        this.total = 0
      }
    },
    // 切换测温计划
    changeType(value) {
      console.log(value)
      this.timeType = value
      const time = value.split('+')
      this.searchObj.startTime = this.$tools.getDate(Number(time[0]), 2, 's')
      this.searchObj.endTime = this.$tools.getDate(Number(time[1]), 2, 's')
      this.showList()
    },
    // 获取列表
    async showList() {
      const req = {
        ...this.searchObj,
        ...this.pageList,
        date: this.date
      }
      const res = await this.getReport(req)
      this.userList = res.data.list.map((el, index) => {
        return {
          ...el,
          id: index
        }
      })
      this.total = res.data.total
    },
    search(values) {
      this.searchObj.date = values.dateTime
      this.searchObj.enableFever = values.enableFever === '0' ? false : values.enableFever === '1' ? true : ''
      this.searchObj.enableRecord = values.enableRecord === '0' ? false : values.enableRecord === '1' ? true : ''
      this.reqObj.params = Object.assign(this.searchObj, this.pageList)
      this.planListGet(this.searchObj.date)
    }
  }

}
</script>
<style lang="less" scoped>
</style>
