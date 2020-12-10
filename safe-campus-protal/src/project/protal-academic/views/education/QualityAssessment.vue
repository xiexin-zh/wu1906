<template>
  <div class="table-page page-layout qui-fx">
    <div class="qui-fx qui-fx-jsb" style="width: 100%">
      <div class="right qui-fx-ver qui-fx-f1" style="padding-right: 10px">
        <search-form isReset @search-form="searchForm" :search-label="searchLabel">
          <div slot="left">
            <a-button class="add-btn" @click="addMark(1)">教师评价</a-button>
          </div>
        </search-form>
        <table-list is-zoom :page-list="pageList" :columns="columns" :table-list="userList">
          <template v-slot:actions="action">
            <a-tooltip placement="topLeft" title="查看详情">
              <a-button
                size="small"
                class="detail-action-btn"
                icon="ellipsis"
                @click.stop="addMark(2, action.record)"
              ></a-button>
            </a-tooltip>
            <a-tooltip
              placement="topLeft"
              title="编辑"
              v-if="userInfo.userCode === action.record.userCode"
            >
              <a-button
                size="small"
                class="edit-action-btn"
                icon="form"
                @click.stop="addMark(3, action.record)"
              ></a-button>
            </a-tooltip>
            <a-popconfirm
              placement="left"
              okText="确定"
              cancelText="取消"
              @confirm="deleteList(action.record)"
              v-if="userInfo.userCode === action.record.userCode"
            >
              <template slot="title"> 您确定删除吗? </template>
              <a-tooltip placement="topLeft" title="删除">
                <a-button size="small" class="del-action-btn" icon="delete"></a-button>
              </a-tooltip>
            </a-popconfirm>
          </template>
        </table-list>
        <page-num v-model="pageList" :total="total" @change-page="showList"></page-num>
        <Estimate
          :title="formTitle"
          :userMsg="userMsg"
          v-model="formStatus"
          v-if="formStatus"
          :type="type"
          @submitForm="submitForm"
          @changeUserInfo="changeUserInfo"
        ></Estimate>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import TableList from '@c/TableList'
import PageNum from '@c/PageNum'
import SearchForm from '@c/SearchForm'
import Estimate from './components/Estimate'
import Tools from '@/utils/tools'
const columns = [
  {
    title: '序号',
    width: '8%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '教师姓名',
    dataIndex: 'userName',
    width: '10%'
  },
  {
    title: '工号',
    dataIndex: 'workNo',
    width: '10%'
  },
  {
    title: '手机号',
    dataIndex: 'mobile',
    width: '15%'
  },
  {
    title: '组织结构',
    dataIndex: 'orgName',
    width: '15%'
  },
  {
    title: '学期',
    dataIndex: 'semester',
    width: '15%'
  },
  {
    title: '评价得分',
    dataIndex: 'totalScore',
    width: '10%'
  },
  {
    title: '评价人',
    dataIndex: 'commentPerson',
    width: '10%'
  },
  {
    title: '评价时间',
    dataIndex: 'commentTime',
    width: '15%',
    customRender: (text) => {
      return Tools.getDate(text, 5)
    }
  },
  {
    title: '操作',
    width: '10%',
    scopedSlots: {
      customRender: 'action'
    }
  }
]
const searchLabel = [
  {
    value: 'semester',
    type: 'select',
    label: '学期',
    placeholder: '',
    list: [],
    style: 'width: 200px'
  },
  {
    value: 'userName',
    type: 'input',
    label: '教师姓名',
    placeholder: '请输入教师姓名'
  },
  {
    value: 'time',
    type: 'rangeTime',
    label: '评价日期'
  }
]
export default {
  name: 'PracticeTask',
  components: {
    TableList,
    PageNum,
    SearchForm,
    Estimate
  },
  data() {
    return {
      formTitle: '',
      formStatus: false,
      columns,
      searchLabel,
      total: 0,
      pageList: {
        page: 1,
        size: 20
      },
      userMsg: { userName: '', userId: '', userCode: '' },
      type: 1,
      userList: [],
      searchObj: {},
      schoolYearList: []
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  created() {
    this.getSchoolYear()
  },
  mounted() {
    this.showList()
  },
  methods: {
    ...mapActions('home', [
      'getScoreList',
      'delScoreList',
      'editTeacherScore',
      'addTeacherScore',
      'getTeacherScore',
      'getHighYearList'
    ]),
    // 获取学年
    async getSchoolYear() {
      const req = {
        schoolCode: this.userInfo.schoolCode,
        page: 1,
        size: 9999
      }
      const res = await this.getHighYearList(req)
      this.schoolYearList = this.searchLabel[0].list = res.data.records
        .map((item) => {
          return {
            ...item,
            key: item.id,
            val: `${item.schoolYearName} ${item.semesterName}`
          }
        })
        .reverse()
    },
    // 搜索
    searchForm(values) {
      let semester = ''
      const semesterList = this.schoolYearList.filter((item) => item.id === values.semester)
      if (semesterList.length > 0) {
        semester = semesterList[0].val
      }
      this.searchObj = {
        semester,
        userName: values.userName,
        startDate: new Date(`${values.time[0]} 00:00:00`).getTime(),
        endDate: new Date(`${values.time[1]} 23:59:59`).getTime()
      }
      this.showList()
    },
    // 列表
    async showList(obj = {}) {
      const req = {
        ...this.pageList,
        ...this.searchObj,
        schoolCode: this.userInfo.schoolCode
      }
      const res = await this.getScoreList(req)
      if (!res.data.records) {
        this.userList = []
        return
      }
      this.userList = res.data.records
      this.total = res.data.total
    },
    // 删除按钮
    async deleteList(record) {
      await this.delScoreList(record.id)
      this.showList()
    },
    // 添加/编辑/详情按钮
    addMark(type, record) {
      this.type = type
      if (type === 1) {
        this.userMsg = {
          userName: '',
          id: ''
        }
      } else {
        this.userMsg = record
      }
      this.formTitle = '教师评价'
      this.formStatus = true
    },
    changeUserInfo(userInfo) {
      this.userMsg = userInfo
    },
    // 提交保存
    async submitForm(list) {
      const yearList = this.schoolYearList.filter((item) => item.state === '2')
      if (yearList.length === 0) {
        this.$message.warning('请确认当前学年是否已启用！')
        return
      }
      const { mobile, orgCode, orgName, userName, workNo } = this.userMsg
      const req = {
        mobile,
        orgCode,
        orgName,
        userName,
        workNo,
        commentPerson: this.userInfo.userName,
        userCode: this.userInfo.userCode,
        schoolCode: this.userInfo.schoolCode,
        semester: `${yearList[0].schoolYearName} ${yearList[0].semesterName}`,
        quotaScoreList: list
      }
      const editReq = list.map((item) => {
        return {
          ...item,
          teacherId: this.userMsg.id
        }
      })
      const res =
        this.type === 1 ? await this.addTeacherScore(req) : await this.editTeacherScore(editReq)
      if (res && res.code === 200) {
        this.formStatus = false
        this.showList()
      }
    }
  }
}
</script>
<style lang="less" scoped>
.table-page {
  background: #fff;
  height: 100%;
  .left {
    padding: 10px;
  }
  .right {
    padding: 0 10px;
    border-left: 1px solid @bor-color;
    .action {
      div {
        cursor: pointer;
        margin: 4px 30px 0 0;
        img {
          width: 20px;
          height: 20px;
        }
        span {
          font-size: 12px;
        }
      }
    }
  }
}
.modal {
  padding: 0 40px;
  .line {
    margin-bottom: 20px;
  }
  .title {
    font-size: 14px;
    font-weight: bold;
    margin-right: 20px;
    min-width: 70px;
  }
  .download {
    color: #6882da;
    cursor: pointer;
  }
  /deep/ .ant-upload-list-item-info {
    padding: 0 22px 0 4px;
  }
}
</style>
