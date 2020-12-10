<template>
  <a-modal
    width="1400px"
    :title="title"
    v-model="status"
    :maskClosable="false"
    :destroyOnClose="true"
    :confirmLoading="confirmLoading"
    :footer="null"
  >
    <search-form v-if="isSearch" isReset @search-form="searchForm" :search-label="searchLabel">
    </search-form>
    <table-list
      :scroll-h="600"
      :page-list="pageList"
      :columns="columns"
      :table-list="dataList"
    >
    </table-list>
    <page-num v-model="pageList" :total="total" @change-page="showList"></page-num>
  </a-modal>
</template>

<script>
import PageNum from '@c/PageNum'
import TableList from '@c/TableList'
import SearchForm from '@c/SearchForm'
import { mapActions } from 'vuex'
import moment from 'moment'
export default {
  name: 'ChooseStudent',
  components: {
    PageNum,
    TableList,
    SearchForm
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    value: {
      type: Boolean,
      default: false
    },
    isSearch: {
      type: Boolean,
      default: false
    },
    columns: {
      type: Array,
      default: () => {
        return []
      }
    },
    searchLabel: {
      type: Array,
      default: () => {
        return []
      }
    },
    userId: {
      type: String,
      default: ''
    },
    rangeTime: {
      type: Array,
      default: () => {
        return []
      }
    },
    chooseType: {
      type: String,
      default: '1' // 1消费 2充值 3补助 4扣款 5退款
    }
  },
  computed: {
    status: {
      get() {
        return this.value
      },
      set() {
        this.$emit('input', false)
      }
    }
  },
  async mounted() {
    this.showList()
  },
  data() {
    return {
      confirmLoading: false,
      pageList: {
        page: 1,
        size: 20
      },
      searchObj: {},
      rangeTimes: [],
      total: 0,
      dataList: []
    }
  },
  methods: {
    ...mapActions('home', ['getConsumeDetail', 'getRechargeDetail', 'getSubsidyDetail', 'getDeducDetail', 'getRefundDetail', 'getDealRecordList']),
    async showList() {
      const req = {
        ...this.pageList,
        createTime: this.rangeTime[0] || moment(new Date()).format('YYYY-MM-DD'),
        endTime: this.rangeTime[1] || moment(new Date()).format('YYYY-MM-DD')
      }
      let res
      if (this.chooseType === '1') {
        res = await this.getConsumeDetail(req)
      } else if (this.chooseType === '2') {
        res = await this.getRechargeDetail(req)
      } else if (this.chooseType === '3') {
        res = await this.getSubsidyDetail(req)
      } else if (this.chooseType === '4') {
        res = await this.getDeducDetail(req)
      } else if (this.chooseType === '5') {
        res = await this.getRefundDetail(req)
      } else if (this.chooseType === '6') {
        const data = {
          ...this.pageList,
          ...this.searchObj,
          createTime: this.rangeTimes[0] || undefined,
          endTime: this.rangeTimes[1] || undefined,
          userId: this.userId
        }
        res = await this.getDealRecordList(data)
      }
      this.dataList = res.data.list
      this.total = res.data.total
    },
    searchForm(values) {
      console.log(values)
      this.searchObj = values
      this.rangeTimes = values.rangeTime
      this.showList()
    },
    reset() {
      this.confirmLoading = false
      this.$emit('input', false)
    },
    error() {
      this.confirmLoading = false
    }
  }
}
</script>

<style lang="less" scoped>
.choose-user {
  height: 600px;
  .org-box {
    width: 200px;
  }
  .user-box {
    border: 1px #f5f5f5 solid;
    margin-left: 15px;
    width: 200px;
    .title {
      padding: 0 10px;
      background-color: #f5f5f5;
      height: 41px;
      line-height: 41px;
      border-bottom: 1px #f5f5f5 solid;
    }
    li {
      border-bottom: 1px #f5f5f5 solid;
      padding: 6px 0px 6px 8px;
    }
  }
}
</style>
