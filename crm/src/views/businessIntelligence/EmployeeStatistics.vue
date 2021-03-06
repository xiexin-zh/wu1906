<template>
  <div v-loading="loading"
       class="main-container">
    <div class="handle-bar">
      <el-date-picker v-model="dateSelect"
                      type="daterange"
                      :clearable="false"
                      range-separator="-"
                      format="yyyy-MM-dd"
                      value-format="yyyy-MM-dd"
                      :picker-options="pickerOptions"
                      start-placeholder="開始日期"
                      end-placeholder="結束日期">
      </el-date-picker>
      <el-select v-model="structuresSelectValue"
                 @change="structuresValueChange"
                 placeholder="選擇部門">
        <el-option v-for="item in deptList"
                   :key="item.id"
                   :label="item.name"
                   :value="item.id">
        </el-option>
      </el-select>

      <el-select v-model="userSelectValue"
                 :clearable="true"
                 placeholder="選擇員工">
        <el-option v-for="item in userOptions"
                   :key="item.id"
                   :label="item.realname"
                   :value="item.id">
        </el-option>
      </el-select>
      <el-button @click.native="handleClick('search')"
                 type="primary">搜索</el-button>
    </div>
    <div class="content">
      <el-table :data="list"
                :height="tableHeight"
                stripe
                border
                highlight-current-row>
        <el-table-column v-for="(item, index) in fieldList"
                         :key="index"
                         align="center"
                         header-align="center"
                         show-overflow-tooltip
                         :prop="item.field"
                         :label="item.name">
        </el-table-column>
      </el-table>
    </div>

  </div>
</template>

<script>
import { adminStructuresSubIndex, getSubUserByStructrue } from '@/api/common'
import { biCustomerStatistics } from '@/api/businessIntelligence/bi'
import { formatTimeToTimestamp } from '@/utils'
import moment from 'moment'

export default {
  /** 员工客户分析 */
  name: 'employee-statistics',
  components: {},
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      loading: false,
      tableHeight: document.documentElement.clientHeight - 170, // 表的高度

      dateSelect: [], // 选择的date区间
      /** 部门选择解析数据 */
      structuresProps: {
        children: 'children',
        label: 'label',
        value: 'id'
      },
      deptList: [], // 部门列表
      structuresSelectValue: '',
      /** 用户列表 */
      userOptions: [],
      userSelectValue: '',

      list: [],
      fieldList: [
        { field: 'realname', name: '員工姓名' },
        { field: 'customer_num', name: '戶口數' },
        { field: 'deal_customer_num', name: '成交戶口數' },
        { field: 'deal_customer_rate', name: '戶口成交率(%)' },
        { field: 'contract_money', name: '合同總金額' },
        { field: 'receivables_money', name: '回款金額' },
        { field: 'un_receivables_money', name: '未回款金額' },
        { field: 'deal_receivables_rate', name: '回款完成率(%)' }
      ]
    }
  },
  computed: {},
  mounted() {
    var self = this
    /** 控制table的高度 */
    window.onresize = function() {
      var offsetHei = document.documentElement.clientHeight
      self.tableHeight = offsetHei - 170
    }

    var endDate = moment(new Date()).format('YYYY-MM-DD')
    var times = endDate.split('-')
    var startDate = times[0] + '-' + times[1] + '-01'
    this.dateSelect = [startDate, endDate]

    this.getDeptList()
  },
  methods: {
    getDataList() {
      this.loading = true
      biCustomerStatistics({
        start_time: formatTimeToTimestamp(this.dateSelect[0]),
        end_time: formatTimeToTimestamp(this.dateSelect[1]),
        structure_id: this.structuresSelectValue,
        user_id: this.userSelectValue
      })
        .then(res => {
          this.list = res.data
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    /**
     * 获取部门列表
     */
    getDeptList() {
      this.loading = true
      adminStructuresSubIndex()
        .then(res => {
          this.deptList = res.data
          this.loading = false
          if (res.data.length > 0) {
            this.structuresSelectValue = res.data[0].id
            this.getUserList() // 更新员工列表
            this.getDataList()
          }
        })
        .catch(() => {
          this.loading = false
        })
    },
    /** 部门更改 */
    structuresValueChange(data) {
      this.userSelectValue = ''
      this.userOptions = []
      this.getUserList() // 更新员工列表
    },
    /** 部门下员工 */
    getUserList() {
      var params = {}
      params.structure_id = this.structuresSelectValue
      getSubUserByStructrue(params)
        .then(res => {
          this.userOptions = res.data
        })
        .catch(() => {})
    },
    /** 顶部操作 */
    handleClick(type) {
      if (type === 'search') {
        this.getDataList()
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import './styles/detail.scss';

.handle-bar {
  padding: 15px 20px 5px 20px;
  .el-date-editor {
    padding: 0px 10px;
    width: 240px;
    margin-right: 15px;
  }
  .el-select {
    width: 120px;
    margin-right: 15px;
  }
}

.content {
  padding: 10px 20px;
  flex: 1;
}
</style>
