<template>
  <div class="running-tab page-layout qui-fx-ver">
    <search-form is-reset @search-form="searchForm" :search-label="searchLabel">
      <div slot="left" class="qui-fx qui-fx-ac">
        <a-input addon-before="卡号" v-model="cardID" style="width: 160px;margin-right:10px"/>
        <a-button icon="search" class="add-btn" @click="readCard">读卡</a-button>
        <a-button icon="export" class="export-all-btn" @click.stop="goLead">导出</a-button>
      </div>
    </search-form>
    <table-list :page-list="pageList" :columns="columns" :table-list="dataList">
      <template v-slot:actions="action">
        <a-tooltip placement="topLeft" title="详情">
          <a-button size="small" class="detail-action-btn" icon="ellipsis" @click.stop="detail(action.record)"></a-button>
        </a-tooltip>
      </template>
    </table-list>
    <page-num v-model="pageList" :total="total" @change-page="showList(searchObj)"></page-num>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import TableList from '@c/TableList'
import SearchForm from '@c/SearchForm'
import PageNum from '@c/PageNum'
import 'moment/locale/zh-cn'
import Tools from '@u/tools'

const searchLabel = [
  {
    value: 'rangeTime', // 日期区间
    type: 'rangeTime',
    label: '交易时间'
  },
  {
    list: [
      // 选择列表项，select控件必传
      {
        key: '',
        val: '全部'
      },
      {
        key: '1',
        val: '食堂消费机01'
      },
      {
        key: '2',
        val: '食堂消费机02'
      },
      {
        key: '3',
        val: '食堂消费机03'
      },
      {
        key: '4',
        val: '食堂消费机04'
      }
    ],
    value: 'eq',
    type: 'select',
    label: '交易设备'
  },
  {
    list: [
      {
        key: '',
        val: '全部'
      },
      {
        key: '1',
        val: '充值'
      },
      {
        key: '2',
        val: '消费'
      },
      {
        key: '3',
        val: '补助'
      }
    ],
    value: 'status',
    type: 'select',
    label: '交易类别'
  }
]
const columns = [
  {
    title: '交易号',
    dataIndex: 'userName',
    width: '8%'
  },
  {
    title: '交易时间',
    dataIndex: 'orgName',
    width: '8%',
    customRender: (text) => {
      return Tools.getDate(text)
    }
  },
  {
    title: '交易卡号',
    dataIndex: 'reason1',
    width: '8%'
  },
  {
    title: '交易类别',
    dataIndex: 'outSchool',
    width: '8%',
    customRender: text => {
      return text
    }
  },
  {
    title: '交易设备号',
    dataIndex: 'reason2',
    width: '8%'
  },
  {
    title: '交易方式',
    dataIndex: 'reason3',
    width: '8%'
  },
  {
    title: '结算方式',
    dataIndex: 'reason4',
    width: '8%'
  },
  {
    title: '订单金额',
    dataIndex: 'reason5',
    width: '8%'
  },
  {
    title: '优惠金额',
    dataIndex: 'reason6',
    width: '8%'
  },
  {
    title: '实付金额',
    dataIndex: 'reason7',
    width: '8%'
  },
  {
    title: '账户余额',
    dataIndex: 'duration',
    width: '8%'
  },
  {
    title: '操作',
    width: '8%',
    scopedSlots: {
      customRender: 'action'
    }
  }
]
export default {
  name: 'RunningTab',
  components: {
    TableList,
    SearchForm,
    PageNum
  },
  data() {
    return {
      searchLabel,
      columns,
      cardID: '',
      total: 0,
      pageList: {
        page: 1,
        size: 20
      },
      dataList: [],
      searchObj: {
        startTime: '',
        endTime: '',
        userName: '',
        state: ''
      }
    }
  },
  async mounted() {
    // this.showList()
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  methods: {
    ...mapActions('home', ['getTeachersLeave']),
    async showList(searchObj = this.searchObj) {
      const req = {
        ...this.pageList,
        orgCode: this.orgCode,
        schoolCode: this.userInfo.schoolCode,
        ...searchObj
      }
      const res = await this.getTeachersLeave(req)
      if (!res.data) {
        return
      }
      this.dataList = res.data.list
      this.total = res.data.total
    },
    select(item) {
      this.orgCode = item.code
      this.showList(this.searchObj)
    },
    searchForm(values) {
      console.log(values)
      this.searchObj.userName = values.userName
      this.searchObj.startTime = values.rangeTime ? this.$tools.getDateTime(values.rangeTime[0]) : ''
      this.searchObj.endTime = values.rangeTime ? this.$tools.getDateTime(values.rangeTime[1]) : ''
      this.searchObj.state = values.state
      this.searchObj.outSchool = values.outSchool
      this.showList(this.searchObj)
    },
    detail(record) {
      console.log(record.id)
      this.$router.push({
        path: '',
        query: { id: record.id }
      })
    },
    readCard() {
    },
    goLead() {
    }
  }
}
</script>
<style lang="less" scoped>
</style>
