<template>
  <div class="score-detail page-layout u-fx">
    <div class="u-mar score-tree">
      <class-tree @select="select"></class-tree>
    </div>
    <div class="u-fx-f1 u-fx-ver">
      <search-form @search-form="searchForm" :search-label="searchLabel"></search-form>
      <table-list :page-list="pageList" :columns="columns" :table-list="scoreList"></table-list>
      <page-num v-model="pageList" :total="total" @change-page="showList"></page-num>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import SearchForm from '@c/SearchForm'
import ClassTree from '@c/ClassTree'
import TableList from '@c/TableList'
import PageNum from '@c/PageNum'
const searchLabel = [
  {
    value: 'userName', // 表单属性
    type: 'input', // 表单类型
    label: '学生姓名', // 表单label值
    placeholder: '请输入姓名' // 表单默认值(非必选字段)
  },
  {
    value: 'workNo', // 表单属性
    type: 'input', // 表单类型
    label: '学号', // 表单label值
    placeholder: '请输入学号' // 表单默认值(非必选字段)
  }
]
const columns = [
  {
    title: '序号',
    width: '5%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '班级',
    dataIndex: 'className',
    width: '10%'
  },
  {
    title: '学生姓名',
    dataIndex: 'userName',
    width: '10%'
  },
  {
    title: '学号',
    dataIndex: 'workNo',
    width: '20%'
  }
]
export default {
  name: 'ScoreDetail',
  components: { ClassTree, SearchForm, TableList, PageNum },
  props: {},
  data() {
    return {
      total: 0,
      columns,
      scoreList: [],
      pageList: {
        page: 1,
        size: 20
      },
      searchText: {
        userName: '',
        workNo: ''
      },
      searchLabel,
      subjectName: []
    }
  },
  created() {},
  mounted() {
    this.planId = this.$route.query.planId
    this._getSubjectByPlan()
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  methods: {
    ...mapActions('home', ['getScoreShow', 'getSubjectByPlan']),
    /**
     * @deprecated 查询考试科目
     */
    async _getSubjectByPlan() {
      const res = await this.getSubjectByPlan(this.planId)
      const subjectName = res.data.map(item => {
        return {
          title: item.subjectName,
          dataIndex: item.subjectCode
        }
      })
      subjectName.push({
        title: '总分',
        dataIndex: 'sumscore'
      })
      this.columns = this.columns.concat(subjectName)
    },
    async select(item) {
      this.selectItem = item
      this.showList()
    },
    searchForm(values) {
      this.searchText = values
      this.pageList.page = 1
      this.showList()
    },
    async showList() {
      const { classCode, gradeCode, schoolYearId } = this.selectItem
      const res = await this.getScoreShow({
        ...this.pageList,
        classCode: classCode,
        gradeCode: gradeCode,
        planId: this.planId,
        schoolCode: this.userInfo.schoolCode,
        schoolYearId: schoolYearId,
        subjectCode: '',
        userCode: '',
        ...this.searchText
      })
      this.scoreList = res.data.list.map(item => {
        return {
          id: item.workNo,
          ...item
        }
      })
      this.total = res.data.total
    }
  }
}
</script>
<style lang="less" scoped>
.score-detail {
  .score-tree {
    overflow: hidden;
    width: 160px;
  }
}
</style>
