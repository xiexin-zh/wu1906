<template>
  <div class="page-layout qui-fx-ver">
    <search-form is-reset @search-form="searchForm" :search-label="searchLabel"></search-form>
    <table-list
      is-zoom
      :page-list="pageList"
      v-model="chooseList"
      :columns="columns"
      :table-list="userList">
    </table-list>
    <page-num v-model="pageList" :total="total" @change-page="showList"></page-num>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import TableList from '@c/TableList'
import PageNum from '@c/PageNum'
import SearchForm from '@c/SearchForm'
const searchLabel = [
  {
    value: 'keyWord',
    type: 'selectInput',
    selectType: [
      {
        key: 1,
        val: '姓名'
      },
      {
        key: 2,
        val: '手机号'
      }
    ],
    placeholder: '请输入'
  }
]
const columns = [
  {
    title: '序号',
    width: '10%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '员工姓名',
    dataIndex: 'userName',
    width: '15%'
  },
  {
    title: '手机号',
    dataIndex: 'mobile',
    width: '15%'
  },
  {
    title: '注册日期',
    dataIndex: 'createTime',
    width: '15%',
    customRender: (text) => {
      return new Date(text).getFullYear() + '-' +
             ((new Date(text).getMonth() + 1) > 9 ? new Date(text).getMonth() + 1 : '0' + (new Date(text).getMonth() + 1)) + '-' +
             (new Date(text).getDate() > 9 ? new Date(text).getDate() : '0' + new Date(text).getDate())
    }
  },
  {
    title: '备注',
    dataIndex: 'remark',
    width: '15%'
  }
]
export default {
  name: 'RoleList',
  components: {
    TableList,
    PageNum,
    SearchForm
  },
  data () {
    return {
      searchLabel,
      chooseList: [],
      columns,
      total: 0,
      pageList: {
        page: 1,
        size: 20,
        roleId: '',
        keyWord: ''
      },
      userList: [],
      roleId: ''
    }
  },
  mounted () {
    this.pageList.roleId = this.$route.query.id
    this.showList()
  },
  methods: {
    ...mapActions('home', ['userRole']),
    searchForm (values) {
      this.pageList = Object.assign(this.pageList, values)
      this.showList()
    },
    async showList () {
      const res = await this.userRole(this.pageList)
      this.userList = res.data.list
      this.total = res.data.total
    }
  }
}
</script>
<style lang="less" scoped>
</style>
