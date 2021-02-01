<template>
  <div class="knowing-statis page-layout u-fx">
    <div class="left-tree u-type-white-bg">
      <u-class-tree
        class="u-mar-t10"
        :maxHeight="maxHeight"
        :school="schoolCode"
        @select="select">
      </u-class-tree>
    </div>
    <div class="u-fx-f1 u-fx-ver">
      <u-space direction="vertical" class="layout-padd u-bg-fff ">
        <u-search-form ref="searchForm" :search-label="TReportSearchLabel" @search="search">
          <div slot="left">
            <u-space>
              <u-button icon="plus" type="primary" @click="addApp">上报</u-button>
              <u-download :reqObj="reqObj" title="导出" fileName="学生" type="light"></u-download>
            </u-space>
          </div>
        </u-search-form>
      </u-space>
      <div class="u-fx u-fx-f1 ">
        <u-table
          is-zoom
          :page-list="pageList"
          :columns="SReportColums"
          :table-list="userList"
        >
          <template v-slot:slotOne="slotOne">
            <u-type type="sex">{{ getDataState('sex',slotOne.record.sex) }}</u-type>
          </template>
          <template v-slot:slotTwo="slotTwo">
            <div v-if="slotTwo.record.enableFever === false">{{ slotTwo.record.enableFever ? '发热' : '未发热' }}</div>
            <a-tag color="#e80000" v-else>{{ slotTwo.record.enableFever ? '发热' : '未发热' }}</a-tag>
          </template>
          <template v-slot:slotThree="slotThree">
            <div>{{ (schoolType === '8' || schoolType === '9') ? slotThree.record.schoolYearId + '级' : '' }} {{ slotThree.record.gradeName + slotThree.record.className }}</div>
          </template>
          <template v-slot:actions="actions">
            <u-button type="link" @click="goDetial(actions.record)">详情</u-button>
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
    <add-report-s ref="addWhite" :title="title" @updata="showList"></add-report-s>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { getDataState } from '@u/libs/data-state'
import { SReportColums } from '../../table-columns/outInRecord'
import { TReportSearchLabel } from '../../search-columns/ncovDaily'
import DormClassTree from '../../component/DormClassTree'
import AddReportS from '../component/AddReportS'
export default {
  name: 'StudentReport',
  components: {
    DormClassTree,
    AddReportS
  },
  data() {
    return {
      TReportSearchLabel,
      date: this.$tools.getDate(new Date(), 1),
      getDataState,
      maxHeight: document.body.clientHeight - 180,
      searchObj: {
        userType: '8', //	用户类型（4：教职工 ，8：学生）
        schoolCode: 'CANPOINTLIVE',
        orgCode: ''
      },
      reqObj: {
        url: '/protal_v3_11005/day/record/download',
        method: 'post'
      },
      userList: [],
      SReportColums,
      pageList: { page: 1, size: 20 },
      total: 0,
      title: ''
    }
  },
  computed: {
    ...mapState('home', ['schoolCode', 'loginInfo', 'userInfo', 'schoolYear']),
     schoolType() {
      return this.loginInfo.schoolType
    }
  },
  created() {
    this.searchObj.schoolCode = this.schoolCode
    this.searchObj.schoolCode = 'CANPOINTLIVE'
  },
  mounted() {
  },
  methods: {
    ...mapActions('home', ['getReportInfoList']),
    // 切换部门，职位树菜单选择机构编码orgCode 进入页面触发
    select(obj) {
      this.searchObj.gradeCode = obj.code
      this.searchObj.gradeCode = '01'
      this.reqObj.params = Object.assign(this.searchObj, this.pageList)
      this.showList()
    },
    // 获取列表
    async showList() {
      const req = {
        ...this.searchObj,
        ...this.pageList
      }
      const res = await this.getReportInfoList(req)
      this.userList = res.data.list.map((el, index) => {
        return {
          ...el,
          id: index
        }
      })
      this.total = res.data.total
    },
    search(values) {
      this.searchObj.startDate = values.rangeTime[0]
      this.searchObj.endDate = values.rangeTime[1]
      this.searchObj = Object.assign(this.searchObj, values)
      this.reqObj.params = Object.assign(this.searchObj, this.pageList)
      this.showList()
    },
    goDetial(record) {
      this.$router.push({
        path: '/component/personalDetail',
        query: {
          id: record.userCode,
          userType: '8'
        }
      })
    },
    addApp() {
      this.$refs.addWhite.temperature = ''
      this.$refs.addWhite.userName = ''
      this.$refs.addWhite.workNo = ''
      this.$refs.addWhite.orgName = ''
      this.title = '上报疫情'
      this.$refs.addWhite.addVisible = true
    }
  }

}
</script>
<style lang="less" scoped>
</style>
