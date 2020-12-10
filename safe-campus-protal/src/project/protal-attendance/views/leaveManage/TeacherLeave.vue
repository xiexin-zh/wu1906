<template>
  <div class="teacher-leave page-layout qui-fx">
    <div class="page-left">
      <org-tree @select="select"></org-tree>
    </div>
    <div class="qui-fx-f1 qui-fx-ver">
      <search-form is-reset @search-form="searchForm" :search-label="searchLabel">
        <div slot="left">
          <a-button icon="export" class="export-btn" @click="exportClick">导出</a-button>
        </div>
      </search-form>
      <no-data msg="暂无应用列表" v-if="false">
        <div slot="btn">
          <a-button type="primary">添加应用</a-button>
        </div>
      </no-data>
      <table-list :page-list="pageList" :columns="columns" :table-list="userList">
        <template v-slot:other1="other1">
          <a-tag :color="$tools.getApprovalColor(other1.record.state)">{{
            other1.record.state | getApprovalState
          }}</a-tag>
        </template>
        <template v-slot:actions="action">
          <a-tooltip placement="topLeft" title="详情">
            <a-button
              size="small"
              style="margin-right: 5px; background: #909399; color:#fff"
              icon="ellipsis"
              @click="detail(action.record)"
            ></a-button>
          </a-tooltip>
        </template>
      </table-list>
      <page-num v-model="pageList" :total="total" @change-page="showList(searchObj)"></page-num>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import TableList from '@c/TableList'
import SearchForm from '@c/SearchForm'
import OrgTree from '@c/OrgTree'
import PageNum from '@c/PageNum'
import 'moment/locale/zh-cn'

const searchLabel = [
  {
    value: 'userName', // 表单属性
    type: 'input', // 表单类型
    label: '姓名', // 表单label值
    placeholder: '请输入姓名' // 表单默认值(非必选字段)
  },
  {
    value: 'rangeTime', // 日期区间
    type: 'rangeTime',
    label: '请假时间'
  },
  {
    list: [
      // 选择列表项，select控件必传
      {
        key: '',
        val: '全部'
      },
      {
        key: '0',
        val: '待审批'
      },
      {
        key: '1',
        val: '审批通过'
      },
      {
        key: '2',
        val: '审批不通过'
      },
      {
        key: '4',
        val: '审批中'
      }
    ],
    value: 'state',
    type: 'select',
    label: '状态'
  },
  {
    list: [
      {
        key: '',
        val: '全部'
      },
      {
        key: 'Y',
        val: '是'
      },
      {
        key: 'N',
        val: '否'
      }
    ],
    value: 'outSchool',
    type: 'select',
    label: '是否出校'
  }
]
const columns = [
  {
    title: '序号',
    width: '8%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '姓名',
    dataIndex: 'userName',
    width: '8%'
  },
  {
    title: '组织机构',
    dataIndex: 'orgName',
    width: '8%'
  },
  {
    title: '事由',
    dataIndex: 'reason',
    width: '8%'
  },
  {
    title: '是否出校',
    dataIndex: 'outSchool',
    width: '8%',
    customRender: text => {
      if (text === 'Y') {
        return '是'
      } else if (text === 'N') {
        return '否'
      }
    }
  },
  {
    title: '发起时间',
    dataIndex: 'updateTime',
    width: '8%',
    customRender: text => {
      if (text) {
        const d = new Date(text)
        return (
          d.getFullYear() +
          '-' +
          (d.getMonth() + 1 > 9 ? d.getMonth() + 1 : '0' + (d.getMonth() + 1)) +
          '-' +
          (d.getDate() > 9 ? d.getDate() : '0' + d.getDate()) +
          ' ' +
          (d.getHours() > 9 ? d.getHours() : '0' + d.getHours()) +
          ':' +
          (d.getMinutes() > 9 ? d.getMinutes() : '0' + d.getMinutes()) +
          ':' +
          (d.getSeconds() > 9 ? d.getSeconds() : '0' + d.getSeconds())
        )
      }
    }
  },
  {
    title: '开始时间',
    dataIndex: 'startTime',
    width: '12%',
    customRender: text => {
      if (text) {
        const d = new Date(text)
        return (
          d.getFullYear() +
          '-' +
          (d.getMonth() + 1 > 9 ? d.getMonth() + 1 : '0' + (d.getMonth() + 1)) +
          '-' +
          (d.getDate() > 9 ? d.getDate() : '0' + d.getDate()) +
          ' ' +
          (d.getHours() > 9 ? d.getHours() : '0' + d.getHours()) +
          ':' +
          (d.getMinutes() > 9 ? d.getMinutes() : '0' + d.getMinutes()) +
          ':' +
          (d.getSeconds() > 9 ? d.getSeconds() : '0' + d.getSeconds())
        )
      }
    }
  },
  {
    title: '结束时间',
    dataIndex: 'endTime',
    width: '12%',
    customRender: text => {
      if (text) {
        const d = new Date(text)
        return (
          d.getFullYear() +
          '-' +
          (d.getMonth() + 1 > 9 ? d.getMonth() + 1 : '0' + (d.getMonth() + 1)) +
          '-' +
          (d.getDate() > 9 ? d.getDate() : '0' + d.getDate()) +
          ' ' +
          (d.getHours() > 9 ? d.getHours() : '0' + d.getHours()) +
          ':' +
          (d.getMinutes() > 9 ? d.getMinutes() : '0' + d.getMinutes()) +
          ':' +
          (d.getSeconds() > 9 ? d.getSeconds() : '0' + d.getSeconds())
        )
      }
    }
  },
  {
    title: '时长',
    dataIndex: 'duration',
    width: '8%',
    customRender: text => {
      return text + '小时'
    }
  },
  {
    title: '状态',
    dataIndex: 'state',
    width: '8%',
    scopedSlots: {
      customRender: 'other1'
    }
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
  name: 'TeacherLeave',
  components: {
    OrgTree,
    TableList,
    SearchForm,
    PageNum
  },
  data() {
    return {
      searchLabel,
      columns,
      total: 1,
      pageList: {
        page: 1,
        size: 20
      },
      userList: [],
      orgCode: '',
      searchObj: {
        startTime: '',
        endTime: '',
        userName: '',
        state: ''
      }
    }
  },
  async mounted() {
    this.showList()
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  methods: {
    ...mapActions('home', ['getTeachersLeave', 'exportTeaLea']),
    exportClick() {
      this.exportTeaLea({
        schoolCode: this.userInfo.schoolCode,
        name: '教职工请假',
        userName: this.searchObj.userName ? this.searchObj.userName : undefined,
        state: this.searchObj.state ? this.searchObj.state : undefined,
        endTime: this.searchObj.endTime ? this.searchObj.endTime : undefined,
        startTime: this.searchObj.startTime ? this.searchObj.startTime : undefined,
        outSchool: this.searchObj.outSchool ? this.searchObj.outSchool : undefined,
        orgCode: this.orgCode ? this.orgCode : undefined
      })
    },
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
      this.userList = res.data.list
      this.total = res.data.total
    },
    select(item) {
      this.orgCode = item.code
      this.showList(this.searchObj)
    },
    searchForm(values) {
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
        path: '/teacherLeave/detail',
        query: { id: record.id }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.teacher-leave {
  .page-left {
    background: #fff;
    margin-right: 10px;
    width: 200px;
  }
  .page-right {
    width: calc(100% - 210px);
  }
}
</style>
