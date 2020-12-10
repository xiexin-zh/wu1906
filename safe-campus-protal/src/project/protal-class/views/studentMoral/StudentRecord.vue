<template>
  <div class="page-layout qui-fx-ver">
    <no-data v-if="scoreList.length === 0"></no-data>
    <div v-else class="qui-fx-f1 qui-fx-ver">
      <a-tabs default-active-key="1" @change="callback" style="height:50px;">
        <a-tab-pane v-for="item in scoreList" :key="`${item.id}+${item.name}`" :tab="item.name"></a-tab-pane>
      </a-tabs>
      <div class="qui-fx-f1 qui-fx">
        <div class="grade-tree">
          <major-tree
            v-if="userInfo.schoolType === '8' || userInfo.schoolType === '9'"
            @select="select"
          ></major-tree>
          <grade-tree v-else @select="select"></grade-tree>
        </div>
        <div class="qui-fx-f1 qui-fx-ver">
          <search-form is-reset @search-form="searchForm" :search-label="searchLabel"></search-form>
          <table-list :page-list="pageList" :columns="columns" :table-list="recordList"></table-list>
          <page-num v-model="pageList" :total="total" @change-page="showList"></page-num>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import GradeTree from '@c/GradeTree'
import MajorTree from '@c/MajorTree'
import TableList from '@c/TableList'
import PageNum from '@c/PageNum'
import $tools from '@u/tools'
import SearchForm from '@c/SearchForm'
import NoData from '@c/NoData'
const searchLabel = [
  {
    value: 'beAssessedName',
    type: 'input',
    label: '学生姓名',
    placeholder: '请输入姓名'
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
    title: '学生姓名',
    dataIndex: 'beAssessedName',
    width: '15%'
  },
  {
    title: '检查项',
    dataIndex: 'itemName',
    width: '15%'
  },
  {
    title: '指标内容',
    dataIndex: 'indexName',
    width: '15%'
  },
  {
    title: '加分/扣分',
    dataIndex: 'score',
    width: '10%'
  },
  {
    title: '当前总分',
    dataIndex: 'sumscore',
    width: '10%'
  },
  {
    title: '德育员',
    dataIndex: 'assessedName',
    width: '12%'
  },
  {
    title: '评分时间',
    dataIndex: 'createTime',
    customRender: text => {
      return $tools.getDate(text).substring(0, 16)
    },
    width: '15%'
  }
]
export default {
  name: 'StudentRecord',
  components: {
    TableList,
    PageNum,
    SearchForm,
    GradeTree,
    MajorTree,
    NoData
  },
  data() {
    return {
      searchList: {
        beAssessedName: '',
        categoryName: '',
        categoryId: '',
        schoolCode: ''
      },
      pageList: {
        page: 1,
        size: 20
      },
      total: 0,
      columns,
      recordList: [],
      scoreList: [],
      noData: false,
      treeData: [],
      gradeList: [],
      defaultSelectedKeys: [],
      defaultExpandedKeys: [],
      categoryId: '',
      searchLabel
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  mounted() {
    this.categoryGet()
  },
  methods: {
    ...mapActions('home', ['getStuCategory', 'getStuCategoryList', 'getScoreClass']),
    searchForm(values) {
      this.pageList.page = 1
      this.pageList.size = 20
      this.searchList.beAssessedName = values.beAssessedName
      this.showList()
    },
    async categoryGet() {
      const req = {
        schoolCode: this.userInfo.schoolCode,
        size: 1000,
        page: 1
      }
      const res = await this.getStuCategory(req)
      if (res.data.list.length > 0) {
        this.scoreList = res.data.list
        this.categoryId = this.scoreList[0].id
        this.categoryName = this.scoreList[0].name
      } else {
        this.scoreList = []
      }
    },
    callback(record) {
      this.categoryId = record.split('+')[0]
      this.categoryName = record.split('+')[1]
      this.treeData = []
      this.pageList.page = 1
      this.pageList.size = 20
      this.showList()
    },
    async showList() {
      this.searchList.categoryId = this.categoryId
      this.searchList.categoryName = this.categoryName
      this.searchList.schoolCode = this.userInfo.schoolCode
      this.searchList = Object.assign(this.searchList, this.pageList)
      const res = await this.getStuCategoryList(this.searchList)
      this.recordList = res.data.list
      this.total = res.data.total
    },
    select(item) {
      if (!item.classCode) {
        return
      }
      this.pageList.page = 1
      this.pageList.size = 20
      this.searchList.schoolYearId = item.schoolYearId
      this.searchList.gradeCode = item.gradeCode
      this.searchList.classCode = item.classCode
      this.showList()
    }
  }
}
</script>
<style lang="less" scoped>
.grade-tree {
  padding: 0 10px;
  width: 200px;
  min-height: 400px;
  max-height: 800px;
  overflow-y: auto;
}
</style>
