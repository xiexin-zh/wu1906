<template>
  <div class="students page-layout qui-fx">
    <div class="qui-fx qui-fx-jsb" style="width: 100%">
      <div class="right qui-fx-ver qui-fx-f1" style="padding-right: 10px">
        <search-form isReset @search-form="searchForm" :search-label="searchLabel">
          <div slot="left">
            <a-button icon="plus" class="add-btn" @click="addPlan">添加</a-button>
          </div>
        </search-form>
        <table-list
          is-zoom
          @clickRow="clickRow"
          :page-list="pageList"
          v-model="chooseList"
          :columns="columns"
          :table-list="planList"
        >
          <template v-slot:actions="action">
            <a-tooltip placement="topLeft" title="查看详情">
              <a-button
                size="small"
                class="detail-action-btn"
                icon="ellipsis"
                @click.stop="toDetail(action.record.id)"
              ></a-button>
            </a-tooltip>
            <a-tooltip placement="topLeft" title="编辑">
              <a-button
                size="small"
                class="edit-action-btn"
                icon="form"
                @click.stop="addPlan(action.record.id)"
              ></a-button>
            </a-tooltip>
            <a-popconfirm
              placement="left"
              okText="确定"
              cancelText="取消"
              @confirm="deleteList(action.record)"
            >
              <template slot="title"> 您确定删除吗? </template>
              <a-tooltip placement="topLeft" title="删除">
                <a-button size="small" class="del-action-btn" icon="delete"></a-button>
              </a-tooltip>
            </a-popconfirm>
          </template>
        </table-list>
        <page-num v-model="pageList" :total="total" @change-page="showList"></page-num>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import TableList from '@c/TableList'
import PageNum from '@c/PageNum'
import SearchForm from '@c/SearchForm'
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
    title: '教学计划',
    dataIndex: 'title',
    width: '10%'
  },
  {
    title: '学年',
    dataIndex: 'schoolYear',
    width: '10%'
  },
  {
    title: '学期',
    dataIndex: 'semester',
    width: '10%'
  },
  {
    title: '开始时间',
    dataIndex: 'startDate',
    width: '15%',
    customRender: (text) => {
      return Tools.getDate(text, 1)
    }
  },
  {
    title: '结束时间',
    dataIndex: 'endDate',
    width: '15%',
    customRender: (text) => {
      return Tools.getDate(text, 1)
    }
  },
  {
    title: '年级',
    dataIndex: 'gradeNameStr',
    width: '10%'
  },
  {
    title: '总课时',
    dataIndex: 'allNum',
    width: '10%'
  },
  {
    title: '创建人',
    dataIndex: 'createName',
    width: '10%'
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
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
    value: 'title',
    type: 'input',
    label: '教学计划',
    placeholder: '请输入教学计划'
  },
  {
    list: [
      {
        key: '',
        val: '全部'
      }
    ],
    value: 'schoolYear',
    type: 'select',
    label: '学年'
  },
  {
    list: [
      {
        key: '',
        val: '全部'
      },
      {
        key: '上学期',
        val: '上学期'
      },
      {
        key: '下学期',
        val: '下学期'
      }
    ],
    value: 'semester',
    type: 'select',
    label: '学期'
  },
  {
    list: [],
    value: 'grade',
    type: 'select',
    label: '年级'
  }
]
export default {
  name: 'TaskPlan',
  components: {
    TableList,
    PageNum,
    SearchForm
  },
  data() {
    return {
      isHighSchool: false,
      columns,
      searchLabel,
      title: '添加',
      chooseList: [],
      total: 0,
      pageList: {
        page: 1,
        size: 20
      },
      planList: [],
      schoolYear: '',
      schoolYearId: ''
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  created() {
    const loginInfo = JSON.parse(window.sessionStorage.getItem('loginInfo') || '{}')
    const isHighSchool = loginInfo.schoolType === '8' || loginInfo.schoolType === '9'
    this.isHighSchool = isHighSchool
    if (isHighSchool) {
      this.searchLabel = [
        {
          value: 'title',
          type: 'input',
          label: '教学计划',
          placeholder: '请输入教学计划'
        },
        {
          list: [],
          value: 'semester',
          type: 'select',
          label: '学期'
        },
        {
          list: [],
          value: 'subjectCode',
          type: 'select',
          label: '专业'
        }
      ]
    }
    this.columns[6].title = isHighSchool ? '专业' : '年级'
    !isHighSchool && this.getSchoolYearList()
    !isHighSchool && this.getGrade()
  },
  mounted() {
    this.showList()
    this.getHighSemester()
    this.getMajorList()
  },
  methods: {
    ...mapActions('home', [
      'getPlanList',
      'getPlanListHigh',
      'getSchoolYear',
      'getGradeList',
      'delPlan',
      'getHighYearList',
      'getHighMajorAll'
    ]),
    // 中高职-获取学期列表
    async getHighSemester() {
      const req = {
        page: 1,
        size: 9999,
        schoolCode: this.userInfo.schoolCode,
        state: '',
        semesterName: ''
      }
      const res = await this.getHighYearList(req)
      if (res && res.code === 200) {
        this.searchLabel[1].list = [{ key: '', val: '全部' }].concat(
          res.data.records
            .map((item) => {
              return {
                key: `${item.schoolYearName} ${item.semesterName}`,
                val: `${item.schoolYearName} ${item.semesterName}`
              }
            })
            .reverse()
        )
      }
    },
    // 中高职-获取专业
    async getMajorList() {
      const req = {
        schoolCode: this.userInfo.schoolCode,
        gradeName: '',
        page: 1,
        size: 9999
      }
      const res = await this.getHighMajorAll(req)
      if (res && res.code === 200) {
        this.searchLabel[2].list = [{ key: '', val: '全部' }].concat(
          res.data.records.map((item) => {
            return {
              val: item.subjectName,
              key: item.subjectCode
            }
          })
        )
      }
    },
    // 获取学年列表
    async getSchoolYearList() {
      const req = {
        schoolCode: this.userInfo.schoolCode
      }
      const res = await this.getSchoolYear(req)
      if (res.data.list.length === 0) return
      const list = res.data.list
        .filter((item) => {
          return item.semester === '下学期'
        })
        .map((item) => {
          return {
            ...item,
            key: item.schoolYear,
            val: item.schoolYear
          }
        })
      this.searchLabel[1].list = [
        {
          key: '',
          val: '全部'
        },
        ...list
      ]
    },
    // 获取年级列表
    async getGrade() {
      const req = {
        schoolCode: this.userInfo.schoolCode
      }
      const res = await this.getGradeList(req)
      if (res.data.list.length === 0) return
      const list = res.data.list.map((item) => {
        return {
          ...item,
          val: item.name,
          key: item.code
        }
      })
      this.searchLabel[3].list = [
        {
          key: '',
          val: '全部'
        },
        ...list
      ]
    },
    searchForm(values) {
      const req = {
        title: values.title,
        schoolYear: values.schoolYear,
        schoolCode: this.userInfo.schoolCode,
        semester: values.semester,
        gradeCode: values.grade
      }
      const reqHigh = {
        title: values.title,
        semester: values.semester,
        gradeCode: values.subjectCode,
        schoolCode: this.userInfo.schoolCode
      }
      this.searchObj = this.isHighSchool ? reqHigh : req
      this.showList()
    },
    async showList(obj = {}) {
      const req = {
        ...this.pageList,
        ...this.searchObj,
        schoolCode: this.userInfo.schoolCode
      }
      const res = this.isHighSchool ? await this.getPlanListHigh(req) : await this.getPlanList(req)
      if (!res.data.list) {
        this.planList = []
        return
      }
      this.planList = res.data.list
      this.total = res.data.total
    },
    async deleteList(record) {
      await this.delPlan({ id: record.id })
      this.showList()
    },
    clickRow(id) {
      console.log(id)
    },
    showSelectPanel() {
      this.panelStatus = true
    },
    // 详情
    toDetail(id) {
      if (!id) {
        return
      }
      this.$router.push({
        path: `/taskPlan/planDetails`,
        query: {
          id
        }
      })
    },
    // 添加
    addPlan(id) {
      this.$router.push({
        path: `/taskPlan/addPlan`,
        query: { id }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.students {
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
