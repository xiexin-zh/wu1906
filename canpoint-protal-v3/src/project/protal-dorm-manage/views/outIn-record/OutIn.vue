<template>
  <div class="knowing-statis page-layout u-fx">
    <div class="left-tree u-type-white-bg">
      <dorm-class-tree :maxHeight="maxHeight" @changeTab="changeTab" @select="select" class=""></dorm-class-tree>
    </div>
    <div class="u-fx-f1 u-fx-ver">
      <u-space direction="vertical" class="layout-padd u-bg-fff ">
        <u-search-form :search-label="outInsearchLabel" @search="search">
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
          :columns="outInColumns"
          :table-list="userList"
        >
          <template v-slot:slotOne="slotOne">
            <u-type >{{ getDataState('recordType',slotOne.record.recordType) }}</u-type>
          </template>
          <template v-slot:slotTwo="slotTwo">
            <u-type >{{ getDataState('inOrOut',slotTwo.record.inOrOut) }}</u-type>
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
import { getDataState } from '@u/libs/data-state'
import { outInColumns } from '../../table-columns/outInRecord'
import { outInsearchLabel } from '../../search-columns/outInRecord'
import DormClassTree from '../../component/DormClassTree'
export default {
  name: 'OutIn',
  components: {
    DormClassTree
  },
  data() {
    return {
      outInsearchLabel,
      currentActiveTab: '0',
      getDataState,
      maxHeight: document.body.clientHeight - 180,
      type: 'MO',
      searchObj: {
        // buildingCode: '', // 楼栋编码
        // classCode: '', // 班级编码
        // floorCode: '', // 楼层编码
        // gradeCode: '', //	年级编码
        // roomCode: '', //	房间编码
        // specilaCode: '', // 专业编码
        schoolCode: '',
        startTime: '',
        endTime: ''
      },
      reqObj: {
        url: '/protal_v3_11102/canpointDormAccess/record/export',
        method: 'post'
      },
      lineChart: [], // 统计图
      userList: [],
      outInColumns,
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
  },
  methods: {
    ...mapActions('home', [ 'outInList' ]),
    // 切换宿舍，班级树
    changeTab(value) {
      this.currentActiveTab = value
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
      const res = await this.outInList(req)
      this.userList = res.data.records
      this.total = res.data.total
    },
    search(values) {
      this.searchObj.startTime = values.rangeTime && values.rangeTime[0]
      this.searchObj.endTime = values.rangeTime && values.rangeTime[1]
      this.searchObj = Object.assign(this.searchObj, values)
      this.reqObj.params = Object.assign(this.searchObj, this.pageList, values)
      this.getList()
    }
  }
}
</script>
<style lang="less" scoped>
</style>
