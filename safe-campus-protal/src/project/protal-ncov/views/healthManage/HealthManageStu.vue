<template>
  <div class="page-layout qui-fx">
    <major-tree v-if="userInfo.schoolType === '8' || userInfo.schoolType === '9'" @select="select"></major-tree>
    <grade-tree v-else @select="select"></grade-tree>
    <div class="qui-fx-f1 qui-fx-ver">
      <search-form is-reset @search-form="searchForm" :search-label="searchLabel"></search-form>
      <table-list :page-list="pageList" :columns="columns" :table-list="userList">
        <template v-slot:actions="action">
          <a-tooltip placement="topLeft" title="查看健康档案">
            <a-button
              size="small"
              class="detail-action-btn"
              icon="ellipsis"
              @click="detail(action.record)"
            ></a-button>
          </a-tooltip>
        </template>
        <template v-slot:other4="action">
          <div>{{ (userInfo.schoolType === '8' || userInfo.schoolType === '9') ? action.record.schoolYearId + '级' : '' }} {{ action.record.gradeName + action.record.className }}</div>
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
import GradeTree from '@c/GradeTree'
import Tools from '@u/tools'
import MajorTree from '@c/MajorTree'

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
    title: '班级',
    width: '15%',
    scopedSlots: {
      customRender: 'other4'
    }
  },
  {
    title: '学号',
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
    GradeTree,
    MajorTree
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
        userType: '8',
        schoolCode: '',
        gradeCode: '',
        classCode: '',
        schoolYearId: ''
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
          userType: '8'
        }
      })
    },
    select(item) {
      this.pageList.page = 1
      this.pageList.size = 20
      this.searchList.schoolYearId = (this.userInfo.schoolType === '8' || this.userInfo.schoolType === '9') ? item.gradeName : item.schoolYearId
      this.searchList.gradeCode = (this.userInfo.schoolType === '8' || this.userInfo.schoolType === '9') ? item.subjectCode : item.gradeCode
      this.searchList.classCode = item.classCode
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
