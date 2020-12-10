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
    dataIndex: 'orgName',
    width: '15%'
  },
  {
    title: '发放金额',
    dataIndex: 'balanceSubsidy',
    width: '15%'
  },
  {
    title: '状态',
    dataIndex: 'isWhether',
    width: '10%',
    customRender: text => {
      if (text === 2) {
        return '未发放'
      } else if (text === 1) {
        return '已发放'
      }
    }
  },
  {
    title: '发放时间',
    dataIndex: 'createTime',
    width: '20%',
    customRender: text => {
      return Tools.getDate(text)
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
    list: [
      {
        key: '',
        val: '全部'
      },
      {
        key: 1,
        val: '已发放'
      },
      {
        key: 2,
        val: '未发放'
      },
      {
        key: 3,
        val: '已删除'
      }
    ],
    value: 'isWhether',
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
        manageId: ''
      }
    }
  },
  methods: {
    ...mapActions('home', ['subsidyInfoList']),
    async showList (record) {
      this.searchList.manageId = record
      this.searchList = Object.assign(this.searchList, this.pageList)
      const res = await this.subsidyInfoList(this.searchList)
      this.recordList = res.data.list.map(el => {
        return {
          ...el,
          id: el.userCode
        }
      })
      this.total = res.data.total
    },
    searchForm(values) {
      this.pageList.page = 1
      this.pageList.size = 20
      this.searchList = Object.assign(this.searchList, values)
      this.showList(this.searchList.manageId)
    }
  }
}
</script>
<style lang="less" scoped>
</style>
