<template>
  <div class="leave-table">
    <a-row type="flex">
      <a-col class="tab-tree">
        <org-tree :current-tab="1" :is-tab="false" :is-select="true" @tree-click="treeSearch"></org-tree>
      </a-col>
      <a-col class="right-content">
        <a-row type="flex" justify="end" align="middle" class="search-form">
          <a-col>
            <span class="form-text">姓名：</span>
            <a-input v-model="searchForm.keyWord" class="input-name" placeholder="请输入" />
            <!-- <span class="form-text">请假类型：</span>
            <a-select v-model="searchForm.vacateType" class="select-type">
              <a-select-option :key="item.value" v-for="item in leaveTypes" :value="item.value">{{ item.label }}</a-select-option>
            </a-select> -->
            <span class="form-text">日期：</span>
            <a-range-picker v-model="searchTime"/>
            <a-button type="primary" @click="showTableList" class="search-btn-mar">查询</a-button>
          </a-col>
        </a-row>
        <a-row class="table-top">
          <a-table
            :loading="loadTable"
            :pagination="false"
            :rowKey="record => record.userNo + record.endTime"
            :columns="columns"
            :dataSource="leaveList"
            :scroll="{ y: tableHeight }"
          >
            <template slot="number" slot-scope="text, record, index">
              <span>{{ (searchForm.page - 1) * (searchForm.size) + (index + 1) }}</span>
            </template>
            <!-- <template slot="type" slot-scope="type">
              <span>{{ getType(type) }}</span>
            </template> -->
            <template slot="beginTime" slot-scope="beginTime">
              <span>{{ getDateTime(beginTime, 1) }}</span>
            </template>
            <template slot="endTime" slot-scope="endTime">
              <span>{{ getDateTime(endTime, 1) }}</span>
            </template>
          </a-table>
          <a-row class="pagination-com" type="flex" justify="end" align="middle">
            <span class="page-total">一共{{ total }}条</span>
            <a-pagination
              :pageSize.sync="searchForm.size"
              :total="total"
              showSizeChanger
              showQuickJumper
              @change="changePage"
              @showSizeChange="changeSize" />
          </a-row>
        </a-row>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import mixins from '@u/mixins'
import leaveTable from '../../assets/js/table/leaveSearch'
import OrgTree from '../components/orgTree/OrgTree'
import moment from 'moment'
export default {
  name: 'LeaveSearch',
  mixins: [mixins],
  components: {
    OrgTree
  },
  data () {
    return {
      loadTable: false,
      columns: leaveTable,
      // leaveTypes: [
      //   {
      //     value: '',
      //     label: '全部'
      //   }, {
      //     value: '1',
      //     label: '事假'
      //   }, {
      //     value: '2',
      //     label: '病假'
      //   }],
      searchForm: {
        page: 1,
        beginTime: null,
        endTime: null,
        schoolCode: window.sessionStorage.getItem('schoolScheme'),
        keyWord: '',
        vacateType: '',
        buildingCode: '',
        classCode: '',
        floorCode: '',
        gradeCode: '',
        roomCode: '',
        stageCode: ''
      },
      searchTime: null
    }
  },
  computed: {
    ...mapState('leaveSearch', [
      'leaveList',
      'total'
    ])
  },
  methods: {
    ...mapActions('leaveSearch', [
      'getLeaveList'
    ]),
    getType (type) {
      if (type === '1') {
        return '事假'
      } else if (type === '2') {
        return '病假'
      } else {
        return '全部'
      }
    },
    showTableList () {
      this.loadTable = true
      this.formDate()
      if (this.searchTime == null || this.searchTime.length === 0) {
        this.searchForm.startTime = this.getCurrentTimeAndOneMonth(0)
        this.searchForm.endTime = this.getCurrentTimeAndOneMonth(1)
      } else {
        this.searchForm.startTime = moment(this.searchTime[0]).format('YYYY-MM-DD HH:ss:mm')
        this.searchForm.endTime = moment(this.searchTime[1]).format('YYYY-MM-DD HH:ss:m')
      }
      this.getLeaveList(this.searchForm).then(() => {
        this.loadTable = false
      })
    }
  },
  mounted () {
  }
}
</script>

<style lang="less" scoped>
.pagination-com {
  padding: 35px 0 26px 0;
  .page-total {
    font-size: 14px;
    margin-right: 10px;
  }
}
</style>
