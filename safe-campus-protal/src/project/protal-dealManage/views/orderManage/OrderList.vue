<template>
  <div class="card-account page-layout qui-fx-ver">
    <search-form is-reset @search-form="searchForm" :search-label="searchLabel"></search-form>
    <div class="qui-fx-f1 qui-fx">
      <table-list :page-list="pageList" :columns="columns" :table-list="orderList">
        <template v-slot:actions="action">
          <a-tag color="#2db7f5" @click="toDetail(action.record, 'orderDetail')">详情</a-tag>
        </template>
      </table-list>
    </div>
    <page-num v-model="pageList" :total="total" @change-page="_getOrderList"></page-num>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import SearchForm from '@c/SearchForm'
import TableList from '@c/TableList'
import PageNum from '@c/PageNum'
import Tools from '@u/tools'
const searchLabel = [
  {
    value: 'rangeTime',
    type: 'rangeTime',
    label: '时间'
  },
  {
    value: 'orderId',
    type: 'input',
    label: '订单号',
    placeholder: '请输入订单号'
  },
  {
    list: [],
    value: 'status',
    type: 'select',
    label: '交易状态'
  },
  {
    value: 'source',
    type: 'input',
    label: '订单来源',
    placeholder: '请输入订单来源'
  }
]
const columns = [
  {
    title: '序号',
    scopedSlots: {
      customRender: 'index'
    },
    width: '7%'
  },
  {
    title: '订单号',
    dataIndex: 'orderId',
    width: '7%'
  },
  {
    title: '订单时间',
    dataIndex: 'orderSuccTime',
    width: '7%',
    customRender: (text) => {
      return Tools.getDate(text)
    }
  },
  {
    title: '订单详情',
    dataIndex: 'remark',
    width: '7%'
  },
  {
    title: '用户id',
    dataIndex: 'userCode',
    width: '7%'
  },
  {
    title: '订单金额',
    dataIndex: 'orderAmount',
    width: '7%'
  },
  {
    title: '优惠金额',
    dataIndex: 'discountAmount',
    width: '7%'
  },
  {
    title: '应付金额',
    dataIndex: 'payAmount',
    width: '7%'
  },
  {
    title: '订单来源',
    dataIndex: 'source',
    width: '7%'
  },
  {
    title: '交易状态',
    dataIndex: 'status',
    width: '7%'
  },
  {
    title: '支付状态',
    dataIndex: 'payStatus',
    width: '7%'
  },
  {
    title: '支付流水号',
    dataIndex: 'paySerial',
    width: '7%'
  },
  {
    title: '操作',
    key: 'action',
    width: '10%',
    scopedSlots: {
      customRender: 'action'
    }
  }
]
export default {
  name: 'OrderList',
  components: {
    SearchForm,
    TableList,
    PageNum
  },
  data() {
    return {
      searchLabel,
      searchObj: {},
      columns,
      pageList: {
        page: 1,
        size: 20
      },
      total: 0,
      orderList: [],
      rangeTime: []
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  mounted() {
    this._getDictList('trade_status', 'status')
    this._getDictList('pay_status', 'payStatus')
    this._getOrderList()
  },
  methods: {
    ...mapActions('home', ['getOrderList', 'getDictList']),
    /* *
     * @description 获取数据字典 type:字典类型，text:字段值
     */
    async _getDictList(type, text) {
      const i = this.searchLabel.findIndex((list) => list.value === text)
      if (i !== -1) this.searchLabel[i].list = []
      const res = await this.getDictList(type)
      const list = []
      res.data.forEach((ele) => {
        list.push({
          key: ele.dictValue,
          val: ele.dictLabel
        })
      })
      if (i !== -1) {
        this.searchLabel[i].list = list
        this.searchLabel[i].list.unshift({
          key: '',
          val: '全部'
        })
      }
      window.localStorage.setItem(type, JSON.stringify(list))
      const index = this.columns.findIndex((list) => list.dataIndex === text)
      if (index !== -1) {
        this.columns[index].customRender = (text) => {
          return res.data.filter((ele) => ele.dictValue === text).length > 0
            ? res.data.filter((ele) => ele.dictValue === text)[0].dictLabel
            : ''
        }
      }
    },
    /**
     * @description 获取订单列表
     */
    async _getOrderList() {
      const res = await this.getOrderList({
        page: this.pageList.page,
        size: this.pageList.size,
        beginTime: this.rangeTime[0] || '',
        endTime: this.rangeTime[1] || '',
        status: this.searchObj.status || '',
        orderId: this.searchObj.orderId || '',
        source: this.searchObj.source || ''
      })
      this.orderList = res.data.records
      this.total = res.data.total
    },
    /**
     * @description 搜索列表
     */
    searchForm(values) {
      this.pageList.page = 1
      this.searchObj = values
      this.rangeTime = values.rangeTime
      this._getOrderList()
    },
    toDetail(record, name) {
      this.$router.push({ name, query: { id: record.orderId } })
    }
  }
}
</script>

<style lang="less" scoped>
.card-account {
  padding: 20px 20px 0;
}
</style>
