<template>
  <div class="student-record page-layout u-fx u-type-white-bg">
    <div class="layout-padd-t left-tree">
      <u-class-tree :school="schoolCode" @select="select" :key="index"></u-class-tree>
    </div>
    <div class="u-fx-f1 u-fx-ver">
      <u-space direction="vertical" class="layout-padd">
        <u-search-form ref="searchForm" :search-label="searchLabel.record" @search="search" @reset="reset">
          <div slot="left">
            <u-space>
              <u-download hasIcon :reqObj="reqObj" title="导出" fileName="学生考勤记录导出" type="light"></u-download>
            </u-space>
          </div>
        </u-search-form>
      </u-space>
      <div class="u-fx u-fx-f1">
        <u-table
          is-zoom
          :page-list="pageList"
          :columns="columns.record"
          :table-list="studentList"
        >
          <template v-slot:slotFour="slotFour">
            <a-popconfirm
              placement="left"
              okText="确定"
              cancelText="取消"
              @confirm="change('onState', slotFour.record.id, slotFour.record.onState)"
            >
              <template slot="title">
                确定要将该状态修改为正常吗?
              </template>
              <a-tooltip placement="topLeft" title="修改">
                <u-type v-if="slotFour.record.onState">{{ getDataState('onState', slotFour.record.onState) }}</u-type>
              </a-tooltip>
            </a-popconfirm>
          </template>
          <template v-slot:slotFive="slotFive">
            <a-popconfirm
              placement="left"
              okText="确定"
              cancelText="取消"
              @confirm="change('offState', slotFive.record.id, slotFive.record.offState)"
            >
              <template slot="title">
                确定要将该状态修改为正常吗?
              </template>
              <a-tooltip placement="topLeft" title="修改">
                <u-type v-if="slotFive.record.offState">{{ getDataState('offState', slotFive.record.offState) }}</u-type>
              </a-tooltip>
            </a-popconfirm>
          </template>
        </u-table>
      </div>
      <div class="u-type-white-bg">
        <u-pagination justify="end" v-model="pageList" :total="total" @change="_getStuRecord"></u-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { getDataState } from '@u/libs/data-state'
import { mapState, mapActions } from 'vuex'
import columns from '../../table-columns/student'
import searchLabel from '../../search-columns/student'
export default {
  name: 'StudentRecord',
  components: {
  },
  data() {
    return {
      getDataState,
      columns,
      searchLabel,
      studentList: [],
      pageList: { page: 1, size: 20 },
      total: 0,
      searchObj: {
        startDay: '',
        endDay: '',
        searchKey: '',
        classCode: '',
        onStatue: '',
        offStatue: ''
      },
      visible: false,
      title: '',
      roleId: '1',
      roleTag: false,
      index: 0,
      reqObj: {
        url: '/protal_v3_11004/student/static/record/list/export',
        method: 'get'
      }
    }
  },
  computed: {
    ...mapState('home', ['schoolCode', 'loginInfo', 'userInfo'])
  },
  mounted() {
    this.schoolType = this.loginInfo.schoolType === '8' || this.loginInfo.schoolType === '9'
  },
  methods: {
    ...mapActions('home', ['getStuRecord', 'delTeacher', 'delTeachers', 'updateStuState']),
    select(value) {
      this.pageList.page = 1
      this.pageList.size = 20
      this.searchObj = Object.assign(this.searchObj, value)
      this.reqObj.url =
      `/protal_v3_11004/student/static/record/list/export?schoolCode=${this.schoolCode}&schoolYearCode=${this.schoolType ? this.searchObj.gradeCode : this.searchObj.schoolYearCode}&gradeCode=${this.schoolType ? this.searchObj.majorCode : this.searchObj.gradeCode}&startDay=${this.searchObj.startDay}&endDay=${this.searchObj.endDay}&searchKey=${this.searchObj.searchKey}&classCode=${this.searchObj.classCode}&onStatue=${this.searchObj.onStatue}&offStatue=${this.searchObj.offStatue}`
      this._getStuRecord()
    },
    // 获取数据列表
    async _getStuRecord() {
      this.searchObj.schoolCode = this.schoolCode
      this.searchObj = Object.assign(this.searchObj, this.pageList)
      const res = await this.getStuRecord(this.searchObj)
      this.studentList = res.data.list
      this.total = res.data.total
    },
    // 列表搜索
    search(values) {
      this.pageList.page = 1
      this.pageList.size = 20
      values.startDay = values.rangeTime[0]
      values.endDay = values.rangeTime[1]
      this.searchObj = Object.assign(this.searchObj, values)
      this.reqObj.url =
      `/protal_v3_11004/student/static/record/list/export?schoolCode=${this.schoolCode}&schoolYearCode=${this.schoolType ? this.searchObj.gradeCode : this.searchObj.schoolYearCode}&gradeCode=${this.schoolType ? this.searchObj.majorCode : this.searchObj.gradeCode}&startDay=${this.searchObj.startDay}&endDay=${this.searchObj.endDay}&searchKey=${this.searchObj.searchKey}&classCode=${this.searchObj.classCode}`
      this._getStuRecord()
    },
    // 状态改变
    change(string, id, state) {
      if (state === '' || state === '5') {
        this.$message.warning('不能修改')
        return
      }
      const req = {
        optName: this.userInfo.userName,
        recordId: id,
        remark: ''
      }
      req[string] = '5'
      this.updateStuState(req).then(res => {
        this.$message.success('操作成功')
        this.$tools.goNext(() => {
          this.showList()
        })
      })
    },
    reset() {
      this.index++
    }
  }
}
</script>
<style lang="less" scoped>
</style>
