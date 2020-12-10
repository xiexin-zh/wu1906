<template>
  <div class="page-layout qui-fx">
    <org-tree @select="select"></org-tree>
    <div class="qui-fx-f1 qui-fx-ver">
      <search-form is-reset @search-form="searchForm" :search-label="searchLabel"></search-form>
      <table-list :page-list="pageList" :columns="columns" :table-list="userList">
        <template v-slot:actions="action">
          <a-tooltip placement="topLeft" title="查看健康档案">
            <a-button size="small" class="detail-action-btn" icon="ellipsis" @click="detail(action.record)"></a-button>
          </a-tooltip>
        </template>
        <template v-slot:actions="action">
          <a-tooltip placement="topLeft" title="查看健康档案">
            <a-button size="small" class="detail-action-btn" icon="ellipsis" @click="detail(action.record)"></a-button>
          </a-tooltip>
        </template>
      </table-list>
      <page-num v-model="pageList" :total="total" @change-page="showList"></page-num>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import TableList from '@c/TableList'
import PageNum from '@c/PageNum'
import SearchForm from '@c/SearchForm'
import Tools from '@u/tools'
import OrgTree from '@c/OrgTree'

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
        key: 'false',
        val: '未建档'
      },
      {
        key: 'true',
        val: '已建档'
      }
    ],
    value: 'state',
    type: 'select',
    label: '状态'
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
    title: '姓名',
    dataIndex: 'userName',
    width: '10%'
  },
  {
    title: '性别',
    dataIndex: 'sex',
    width: '10%',
    customRender: text => {
      if (text === '1') {
        return '男'
      } else if (text === '2') {
        return '女'
      } else {
        return '未知'
      }
    }
  },
  {
    title: '组织机构',
    dataIndex: 'orgName',
    width: '15%'
  },
  {
    title: '工号',
    dataIndex: 'workNo',
    width: '10%'
  },
  {
    title: '状态',
    dataIndex: 'state',
    width: '15%',
    customRender: text => {
      if (text === false) {
        return '未建档'
      } else if (text === true) {
        return '已建档'
      }
    }
  },
  {
    title: '建档时间',
    dataIndex: 'createTime',
    width: '15%',
    customRender: text => {
      return Tools.getDate(text)
    }
  },
  {
    title: '操作',
    width: '15%',
    scopedSlots: {
      customRender: 'action'
    }
  }
]
export default {
  name: 'HealthManageTea',
  components: {
    TableList,
    SearchForm,
    PageNum,
    OrgTree
  },
  data() {
    return {
      columns,
      searchLabel,
      pageList: {
        page: 1,
        size: 20
      },
      searchList: {
        userType: '4',
        schoolCode: '',
        orgCode: ''
      },
      total: 0,
      userList: []
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  mounted() {
    this.showList()
  },
  methods: {
    ...mapActions('home', ['getarchivesList', 'getarchivesDetail']),
    async showList(searchObj = {}) {
      this.searchList.schoolCode = this.userInfo.schoolCode
      this.searchList = Object.assign(this.searchList, this.pageList, searchObj)
      const res = await this.getarchivesList(this.searchList)
      this.userList = res.data.list
      this.total = res.data.total
    },
    searchForm(values) {
      this.pageList.page = 1
      const searchObj = {
        userName: values.userName,
        state: values.state
      }
      this.showList(searchObj)
    },
    detail(record) {
      this.$router.push({
        path: '/component/detail',
        query: {
          id: record.userCode,
          userType: '4'
        }
      })
    },
    select(item) {
      this.pageList.page = 1
      this.pageList.size = 20
      this.searchList.orgCode = item.code
      this.showList()
    }
  }
}
</script>
<style lang="less" scoped>
.top {
  margin-bottom: 10px;
}
</style>
