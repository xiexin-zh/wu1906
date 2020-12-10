<template>
  <div class="total-table page-layout qui-fx-ver">
    <a-modal title="请选择导出月份(最近5个月)" :visible="dialogTag" @ok="downFile" @cancel="dialogTag = false">
      <a-radio-group v-model="downMonth">
        <a-radio :key="month" v-for="month in monthList" :style="radioStyle" :value="month">{{ month }}</a-radio>
      </a-radio-group>
    </a-modal>
    <a-row type="flex">
      <a-col class="tab-tree">
        <org-tree :current-tab="0" :is-select="true" @tree-click="treeSearch"></org-tree>
      </a-col>
      <a-col class="right-content qui-fx-ver">
        <a-row type="flex" justify="space-between" align="middle" class="search-form">
          <a-col>
            <a-button type="primary" @click="dialogTag = true" icon="download">导出数据</a-button>
          </a-col>
          <a-col>
            <span class="form-text">学号/姓名：</span>
            <a-input class="input-name" v-model="searchForm.keyWord" placeholder="请输入" />
            <span class="form-text">日期：</span>
            <a-range-picker v-model="dateTime" :format="formatDate" />
            <a-button type="primary" @click="showTableList" class="search-btn-mar">查询</a-button>
          </a-col>
        </a-row>
        <a-row id="table" class="table-top qui-fx-f1">
          <a-table
            :loading="loadTable"
            :pagination="false"
            :rowKey="(record, index) => index"
            :columns="columns"
            :dataSource="totalList"
            style="overflow:hidden"
            :scroll="{ y: this.$tools.setScroll('table') }"
          >
            <template slot="number" slot-scope="text, record, index">
              <span>{{ (pageList.page - 1) * pageList.size + (index + 1) }}</span>
            </template>
          </a-table>
        </a-row>
        <page-num v-model="pageList" :total="total" @change-page="changePage"></page-num>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import PageNum from '../components/common/PageNum'
import OrgTree from '../components/orgTree/OrgTree'
import { mapState, mapActions } from 'vuex'
import mixins from '@u/mixins'
import totalTable from '../../assets/js/table/totalTable'
import hostEnv from '@config/host-env'

export default {
  name: 'TotalTable',
  mixins: [mixins],
  components: {
    OrgTree,
    PageNum
  },
  data() {
    return {
      downType: 0,
      downTitle: '',
      downMonth: '',
      downTag: ['building', 'floor', 'room', 'stage', 'grade', 'class'],
      monthList: this.lastFiveMonth(),
      radioStyle: {
        display: 'block',
        height: '45px',
        lineHeight: '45px'
      },
      dialogTag: false,
      columns: totalTable,
      pageList: {
        page: 1,
        size: 20
      },
      searchForm: {
        startDate: null,
        endDate: null,
        schoolCode: window.sessionStorage.getItem('schoolScheme'),
        keyWord: '',
        buildingCode: '',
        classCode: '',
        floorCode: '',
        gradeCode: '',
        roomCode: '',
        stageCode: ''
      }
    }
  },
  computed: {
    ...mapState('totalTable', ['totalList', 'total'])
  },
  methods: {
    ...mapActions('totalTable', ['getTotalList']),
    downFile() {
      if (this.downMonth === '') {
        this.$message.warning('请选择月份')
        return
      }
      this.dialogTag = false
      var code = `${this.downTag[this.downType]}Code`
      var codeValue = this.searchForm[code]
      var name = `${this.downTag[this.downType]}Name`
      window.open(
        `${hostEnv.protal_api_11006}/dorm/check/result/download?schoolCode=${window.sessionStorage.getItem(
          'schoolScheme'
        )}&${code}=${codeValue}&${name}=${this.downTitle}&wMonth=${this.downMonth}`
      )
    },
    showTableList() {
      this.loadTable = true
      this.formDate()
      const req = {
        ...this.searchForm,
        ...this.pageList
      }
      this.getTotalList(req).then(() => {
        this.loadTable = false
      })
    }
  },
  mounted() {
    this.schoolType = JSON.parse(window.sessionStorage.getItem('loginInfo')).schoolType
    if ((this.schoolType === '8' || this.schoolType === '9') && this.columns[4].dataIndex !== 'gradeName') {
      this.columns[3] = {
        title: '年级',
        dataIndex: 'schoolYearId',
        width: '80px',
        customRender: text => {
          return text + '级'
        }
      }
      this.columns.splice(4, 0, {
        title: '专业',
        dataIndex: 'gradeName',
        width: '100px'
      })
    }
  }
}
</script>

<style lang="less" scoped></style>
