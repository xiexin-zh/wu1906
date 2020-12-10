/* eslint-disable space-infix-ops */
<template>
  <div class="students page-layout qui-fx">
    <div class="qui-fx qui-fx-jsb" style="width:100%; ">
      <div class="left">
        <grade-tree @select="select" :school="school"></grade-tree>
      </div>
      <div class="right qui-fx-ver qui-fx-f1" style="padding-right: 10px">
        <search-form isReset @search-form="searchForm" :search-label="searchLabel">
        </search-form>
        <table-list
          is-zoom
          :scrollH="350"
          :page-list="pageList"
          :columns="columns"
          :table-list="studentsList"
        >
        </table-list>
        <page-num v-model="pageList" :total="total" @change-page="showMore"></page-num>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import TableList from '@c/TableList'
import GradeTree from '@c/GradeTree'
import PageNum from '@c/PageNum'
import SearchForm from '@c/SearchForm'
import Tools from '@u/tools'
const columns = [
  {
    title: '序号',
    width: '10%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '学生姓名',
    dataIndex: 'userName',
    width: '10%'
  },
  {
    title: '性别',
    dataIndex: 'sex',
    width: '10%',
    customRender: text => {
      return Tools.getSex(text)
    }
  },
  {
    title: '学号',
    dataIndex: 'workNo',
    width: '10%'
  },
  {
    title: '年级',
    dataIndex: 'gradeName',
    width: '10%'
  },
  {
    title: '班级',
    dataIndex: 'className',
    width: '10%'
  },
  {
    title: '入学年份',
    dataIndex: 'admissionTime',
    width: '10%',
    customRender: text => {
      return new Date(text).getFullYear()
    }
  },
  {
    title: '人脸照片',
    dataIndex: 'photoUrl',
    width: '20%',
    scopedSlots: {
      customRender: 'photoPic'
    }
  },
  {
    title: '备注',
    dataIndex: 'remark',
    width: '10%'
  }
]
const searchLabel = [
  {
    value: 'keywords',
    initValue: '',
    type: 'selectInput',
    selectType: [
      {
        key: 1,
        val: '姓名'
      },
      {
        key: 2,
        val: '学号'
      }
    ],
    placeholder: '请输入'
  }
]
export default {
  name: 'Students',
  components: {
    TableList,
    GradeTree,
    PageNum,
    SearchForm
  },
  props: {
    school: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      dialogTag: false,
      confirmLoading: false,
      columns,
      searchLabel,
      gradeList: [],
      classList: [],
      gradeId: '',
      classId: '',
      classChoose: '',
      type: 0,
      total: 0,
      pageList: {
        page: 1,
        size: 20
      },
      studentsList: [],
      schoolYear: '',
      schoolYearId: '',
      gradeCode: '',
      classCode: '',
      userId: ''
    }
  },
  created() {
  },
  mounted() {},
  methods: {
    ...mapActions('home', [
      'studentList'
    ]),
    select(item) {
      this.schoolYear = item.title
      this.schoolYearId = item.schoolYearId
      this.gradeCode = item.gradeCode
      this.classCode = item.classCode
      const req = {
        ...this.pageList,
        schoolCode: this.school,
        schoolYearId: item.schoolYearId,
        gradeId: item.gradeCode || '',
        classId: item.classCode || '',
        keyword: this.keywords
      }
      console.log(req)
      this.showList(req)
    },
    searchForm(values) {
      console.log(values)
      this.keywords = values.keywords
      const req = {
        ...this.pageList,
        schoolCode: this.school,
        schoolYearId: this.schoolYearId,
        gradeId: this.gradeCode || '',
        classId: this.classCode || '',
        keyword: this.keywords
      }
      this.showList(req)
    },
    async showList(req) {
      const res = await this.studentList(req)
      if (!res.data.list) {
        this.studentsList = []
        return
      }
      this.studentsList = res.data.list
      this.total = res.data.total
    },
    showMore() {
      const req = {
        ...this.pageList,
        schoolCode: this.school,
        schoolYearId: this.schoolYearId,
        gradeId: this.gradeCode || '',
        classId: this.classCode || '',
        keyword: this.keywords
      }
      this.showList(req)
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
