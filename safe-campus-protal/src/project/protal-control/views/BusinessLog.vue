<template>
  <div class="class page-layout qui-fx">
    <div class="qui-fx qui-fx-jsb" style="width:100%">
      <div class="left">
        <div class="control-tab">
          <vertical-tab title="业务系统" v-model="kzValue" :tab-list="tabList"></vertical-tab>
        </div>
      </div>
      <div class="right qui-fx-ver qui-fx-f1">
        <search-form is-reset @search-form="searchForm" :search-label="searchLabel">
          <div slot="left" class="left_">
            <a-row
              class="tip-banner"
              style="position: absolute; z-index: 99; min-width: 660px; margin:-18px 0 0 10px"
            >
              <a-col :span="6">业务类型：{{ parseInt(kzValue.plateformType) === 1 ? '数据回写' : '识别校验' }}</a-col>
              <a-col :span="16">业务地址：{{ kzValue.bussUrl || '' }}</a-col>
            </a-row>
          </div>
        </search-form>
        <table-list
          isZoom
          :page-list="pageList"
          :columns="BusinessLogColumns"
          :table-list="businessList"
        >
          <template v-slot:actions="action">
            <a-popconfirm placement="left" okText="确定" cancelText="取消" @confirm="resubmit(action)">
              <template slot="title">您确定重试吗?</template>
              <a-tooltip placement="topLeft" title="重试" v-if="action.record.succMark === 2">
                <a-button size="small" class="del-action-btn">重试</a-button>
              </a-tooltip>
            </a-popconfirm>
          </template>
        </table-list>
        <page-num v-model="pageList" :total="total" @change-page="recordList"></page-num>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import SearchForm from '@c/SearchForm'
import TableList from '@c/TableList'
import PageNum from '@c/PageNum'
import BusinessLogColumns from '../assets/js/table/BusinessLogColumns'
import VerticalTab from '@c/VerticalTab'
const searchLabel = [
  {
    value: 'userName',
    type: 'input',
    label: '姓名',
    placeholder: '请输入姓名'
  },
  {
    list: [
      {
        key: '',
        val: '全部'
      },
      {
        key: 1,
        val: '成功'
      },
      {
        key: 2,
        val: '失败'
      }
    ],
    value: 'succMark',
    type: 'select',
    label: '状态'
  }
]
export default {
  name: 'BusinessLog',
  components: {
    SearchForm,
    TableList,
    PageNum,
    VerticalTab
  },
  computed: {
    ...mapState('home', ['schoolCode'])
  },
  data() {
    return {
      total: 0,
      searchLabel,
      BusinessLogColumns,
      pageList: {
        page: 1,
        size: 20
      },
      tabList: [],
      kzValue: {},
      businessList: [],
      searchText: {
        userName: '',
        succMark: '',
        controlGroupCode: ''
      }
    }
  },
  watch: {
    kzValue(nVal, oVal) {
      if (JSON.stringify(nVal) === JSON.stringify(oVal)) return
      this.recordList()
    }
  },
  async mounted() {
    this.getBussList({
      schoolCode: this.schoolCode
    }).then(res => {
      this.tabList = res.data
        .map(item => {
          return {
            ...(item || {}),
            key: (item || {}).appCode,
            val: (item || {}).appName
          }
        })
        .filter(item => {
          return item.bussUrl && item.bussUrl !== 'http://127.0.0.1'
        })
      if (this.tabList.length !== 0) {
        this.kzValue = this.tabList[0]
      }
    })
  },
  methods: {
    ...mapActions('home', [
      'getAllBusiness',
      'getBussList',
      'resubmitBussRecord',
      'getControlGroupList'
    ]),
    recordList() {
      this.getAllBusiness({
        ...this.pageList,
        ...this.searchText,
        bussCode: this.kzValue.appCode,
        schoolCode: this.schoolCode
      }).then(res => {
        this.businessList = res.data.list
        this.total = res.data.total
      })
    },
    searchForm(values) {
      this.searchText = values
      this.recordList()
    },
    async resubmit(action) {
      this.resubmitBussRecord({
        ...this.pageList,
        ...this.searchText,
        bussCode: this.kzValue.appCode,
        schoolCode: this.schoolCode
      })
      this.$message.success('成功')
      this.$tools.goNext(() => {
        this.recordList()
      })
    }
  }
}
</script>
<style lang="less" scoped>
.control-tab {
  width: 250px;
  background-color: #fff;
}

.qui-fx-f1 {
  padding-left: 10px;
}
</style>
