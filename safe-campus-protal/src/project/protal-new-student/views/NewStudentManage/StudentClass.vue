<template>
  <div class="page-layout qui-fx goods">
    <assign-student
      type="edu"
      chooseType="organize"
      :assign-obj="assignStudent"
      :grade="grade"
      :classCode="classCode"
      :className="className"
      :subjectCode="subjectCode"
      :subjectName="subjectName"
      is-check
      ref="form"
      v-if="studentTag"
      v-model="studentTag"
      @submit="submitUser"
      title="分配学生"
    ></assign-student>
    <div class="page-left">
      <major-tree @select="select"></major-tree>
    </div>
    <div class="qui-fx-f1 qui-fx-ver">
      <table-list isZoom v-model="chooseList" :page-list="pageList" :columns="columns" :table-list="userList">
        <template v-slot:actions="action">
          <a-tooltip placement="topLeft" title="分配学生">
            <a-button
              size="small"
              class="edit-action-btn"
              icon="form"
              @click.stop="assignStuClick(action.record)"
            ></a-button>
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
import MajorTree from '../../component/MajorTree'
import AssignStudent from '../../component/AssignStudent.vue'

const columns = [
  {
    title: '序号',
    width: '5%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '年级',
    width: '8%',
    dataIndex: 'gradeName'
  },
  {
    title: '专业',
    dataIndex: 'subjectName',
    width: '10%'
  },
  {
    title: '班级',
    dataIndex: 'className',
    width: '10%'
  },
  {
    title: '辅导员',
    dataIndex: 'teacherName',
    width: '10%'
  },
  {
    title: '教室',
    dataIndex: 'placeName',
    width: '15%'
  },
  {
    title: '班级学生',
    dataIndex: 'count',
    width: '10%'
  },
  {
    title: '操作',
    width: '5%',
    scopedSlots: {
      customRender: 'action'
    }
  }
]
export default {
  name: 'StudentClass',
  components: {
    TableList,
    PageNum,
    MajorTree,
    AssignStudent
  },
  data() {
    return {
      issueVisible: false,
      studentTag: false,
      assignStudent: {},
      columns,
      pageList: {
        page: 1,
        size: 20
      },
      searchList: {
        schoolCode: ''
      },
      total: 0,
      userList: [],
      chooseList: [],
      totalList: [],
      detailList: {},
      grade: '',
      classCode: '',
      className: '',
      subjectCode: '',
      subjectName: '',
      studentList: [],
      studentCount: 0
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  mounted() {
    // this.showList()
  },
  methods: {
    ...mapActions('home', ['getHighClass', 'recordDetail', 'downRecord', 'getStudentList', 'getStudentCount']),
    async showList(searchObj = {}) {
      this.searchList.schoolCode = this.userInfo.schoolCode
      this.searchList = Object.assign(this.searchList, this.pageList, searchObj)
      const res = await this.getHighClass(this.searchList)
      this.userList = res.data.records || []
      this.total = res.data.length

      // 插入学生数量
      this.$nextTick(() => {
        this.userList.forEach(async (item, index) => {
          const result = await this.getStudentCount(item.classCode)
          this.userList[index].count = result.data || 0
        })
      })
    },
    searchForm(values) {
      this.pageList.page = 1
      const searchObj = {
        date: values.date,
        state: values.state
      }
      this.showList(searchObj)
    },
    // 选择树形列表
    select(item) {
      this.pageList.page = 1
      this.pageList.size = 20
      this.searchList.gradeCode = item.gradeCode
      this.searchList.gradeName = item.gradeName
      this.searchList.grade = item.gradeName
      this.searchList.subjectCode = item.subjectCode || ''
      this.searchList.classCode = item.classCode || ''
      this.$nextTick(() => {
        this.showList()
      })
    },
    submitForm() {
      if (this.totalList.length === 0) {
        this.$message.warning('请选择学生')
        return
      }
    },
    // 点击分班按钮
    async assignStuClick(item) {
      const { gradeName, classCode, className, subjectCode, subjectName } = item
      this.grade = gradeName
      this.classCode = classCode
      this.className = className
      this.subjectCode = subjectCode
      this.subjectName = subjectName
      this.studentTag = true
    },
    submitUser() {
      this.showList()
      this.studentTag = false
    }
  }
}
</script>
<style lang="less" scoped>
.goods {
  .page-left {
    background: #fff;
    margin-right: 10px;
    width: 150px;
  }
}
</style>
