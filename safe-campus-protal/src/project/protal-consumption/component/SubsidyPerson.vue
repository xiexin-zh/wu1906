<template>
  <a-modal
    width="900px"
    title="发放人员名单"
    v-model="dialogTag"
    :maskClosable="false"
    :destroyOnClose="true"
    :footer="null"
  >
    <search-form is-reset @search-form="searchForm" :search-label="searchLabel"> </search-form>
    <table-list
      :scroll-h="350"
      :columns="columns"
      :table-list="recordList">
    </table-list>
    <page-num v-model="pageList" :total="total" @change-page="showList"></page-num>
  </a-modal>
</template>

<script>
import { mapActions } from 'vuex'
import TableList from '@c/TableList'
import Tools from '@u/tools'
import PageNum from '@c/PageNum'
import SearchForm from '@c/SearchForm'
const columns = [
  {
    title: '序号',
    scopedSlots: {
      customRender: 'index'
    },
    width: '10%'
  },
  {
    title: '姓名',
    dataIndex: 'userName',
    width: '15%'
  },
  {
    title: '学号/工号',
    dataIndex: 'workNo',
    width: '15%'
  },
  {
    title: '班级/组织',
    dataIndex: 'classBoards',
    width: '15%'
  },
  {
    title: '发放金额',
    dataIndex: 'grantBalance',
    width: '15%'
  },
  {
    title: '状态',
    dataIndex: 'grantStatus',
    width: '10%'
  },
  {
    title: '发放时间',
    dataIndex: 'grantTime',
    width: '20%',
    customRender: text => {
      return text ? Tools.getDate(text) : '--'
    }
  }
]
const searchLabel = [
  {
    value: 'userName',
    type: 'input',
    label: '姓名',
    placeholder: '请输入'
  },
  {
    value: 'workNo',
    type: 'input',
    label: '学号/工号',
    placeholder: '请输入'
  },
  {
    list: [],
    value: 'grantStatus',
    type: 'select',
    label: '状态'
  }
]
export default {
  name: 'SubsidyPerson',
  components: {
    TableList,
    PageNum,
    SearchForm
  },
  data () {
    return {
      searchLabel,
      dialogTag: false,
      columns,
      recordList: [],
      recordId: '',
      pageList: {
        page: 1,
        size: 20
      },
      total: 0,
      searchList: {
        subsidyId: ''
      }
    }
  },
  mounted() {
    this._getDictList('grant_status', 'grantStatus')
  },
  methods: {
    ...mapActions('home', ['subsidyInfoList', 'getDictList']),
    async showList (record) {
      this.searchList.subsidyId = record
      const res = await this.subsidyInfoList({
        ...this.searchList,
        pageNum: this.pageList.page,
        pageSize: this.pageList.size
      })
      this.recordList = res.rows
      this.total = res.total
    },
    /**
     * @description 数据字典
     */
    async _getDictList(type, text) {
      const i = this.searchLabel.findIndex((list) => list.value === text)
      if (i !== -1) this.searchLabel[i].list = []
      const res = await this.getDictList({
        pageNum: 1,
        pageSize: 100,
        dictType: type
      })
      const list = []
      res.rows.forEach((ele) => {
        list.push({
          key: ele.dictValue,
          val: ele.dictLabel
        })
      })
      if (i !== -1) {
        this.searchLabel[i].list = list
      }
      window.localStorage.setItem(type, JSON.stringify(list))
      const index = this.columns.findIndex((list) => list.dataIndex === text)
      if (index !== -1) {
        this.columns[index].customRender = (text) => {
          return res.rows.filter((ele) => ele.dictValue === text).length > 0
            ? res.rows.filter((ele) => ele.dictValue === text)[0].dictLabel
            : ''
        }
      }
    },
    searchForm(values) {
      this.searchList = Object.assign(this.searchList, values)
      this.showList(this.searchList.subsidyId)
    }
  }
}
</script>
<style lang="less" scoped>
</style>
