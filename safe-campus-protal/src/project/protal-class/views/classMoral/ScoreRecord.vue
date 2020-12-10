<template>
  <div class="page-layout qui-fx-ver">
    <no-data v-if="scoreList.length === 0"></no-data>
    <div v-else class="qui-fx-f1 qui-fx-ver">
      <a-tabs default-active-key="1" @change="callback" style="height:50px;">
        <a-tab-pane v-for="item in scoreList" :key="`${item.id}+${item.name}`" :tab="item.name"></a-tab-pane>
      </a-tabs>
      <div class="qui-fx-f1 qui-fx">
        <major-tree
          v-if="userInfo.schoolType === '8' || userInfo.schoolType === '9'"
          @select="classSelect"
        ></major-tree>
        <div class="grade-tree" v-else>
          <a-skeleton v-if="treeData.length == 0 && !noData" active :paragraph="{rows: 10}" />
          <no-data v-if="noData" msg="暂无数据~"></no-data>
          <a-tree
            v-if="treeData.length > 0"
            @select="select"
            :treeData="treeData"
            :defaultSelectedKeys="defaultSelectedKeys"
            :defaultExpandedKeys="defaultExpandedKeys"
          ></a-tree>
        </div>
        <div class="qui-fx-f1 qui-fx-ver">
          <table-list :page-list="pageList" :columns="columns" :table-list="recordList"></table-list>
          <page-num v-model="pageList" :total="total" @change-page="showList"></page-num>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import NoData from '@c/NoData'
import TableList from '@c/TableList'
import PageNum from '@c/PageNum'
import MajorTree from '@c/MajorTree'
import $tools from '@u/tools'
const columns = [
  {
    title: '序号',
    width: '8%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '检查项',
    dataIndex: 'itemName',
    width: '15%'
  },
  {
    title: '指标内容',
    dataIndex: 'indexName',
    width: '25%'
  },
  {
    title: '加分/扣分',
    dataIndex: 'score',
    width: '15%'
  },
  {
    title: '德育员',
    dataIndex: 'assessedName',
    width: '15%'
  },
  {
    title: '评分时间',
    dataIndex: 'createTime',
    customRender: text => {
      return $tools.getDate(text).substring(0, 16)
    },
    width: '20%'
  }
]
export default {
  name: 'ScoreRecord',
  components: {
    TableList,
    PageNum,
    NoData,
    MajorTree
  },
  data() {
    return {
      searchList: {
        beAssessedCode: '',
        categoryName: '',
        categoryId: ''
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
      categoryId: ''
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  mounted() {
    this.categoryGet()
  },
  methods: {
    ...mapActions('home', ['getCategory', 'getScoreRecord', 'getScoreClass']),
    async categoryGet() {
      const req = {
        schoolCode: this.userInfo.schoolCode,
        size: 1000,
        page: 1
      }
      const res = await this.getCategory(req)
      if (res.data.list.length > 0) {
        this.scoreList = res.data.list
        this.categoryId = this.scoreList[0].id
        this.categoryName = this.scoreList[0].name
        this.initMenu()
      } else {
        this.scoreList = []
      }
    },
    callback(record) {
      this.categoryId = record.split('+')[0]
      this.categoryName = record.split('+')[1]
      this.treeData = []
      this.initMenu()
    },
    async showList() {
      this.searchList = Object.assign(this.searchList, this.pageList)
      const res = await this.getScoreRecord(this.searchList)
      this.recordList = res.data.list
      this.total = res.data.total
    },
    classSelect(value) {
      if (!value.classCode) {
        return
      }
      this.searchList.beAssessedCode = value.classCode
      this.searchList.beAssessedName = value.clazzName
      this.showList()
    },
    select(obj, tree) {
      const gradeIds = []
      this.gradeList.forEach(el => {
        return gradeIds.push(el.gradeCode)
      })
      if (obj.length > 0) {
        if (gradeIds.indexOf(obj[0]) === -1) {
          this.searchList.beAssessedCode = obj[0]
          this.searchList.beAssessedName = tree.code
            ? tree.code
            : tree.selectedNodes[0].data.props.title
          this.searchList.schoolYearId = tree.schoolYearId
            ? tree.schoolYearId
            : tree.selectedNodes[0].data.props.schoolYearId
          this.searchList.schoolCode = this.userInfo.schoolCode
          this.searchList.categoryId = this.categoryId
          this.searchList.categoryName = this.categoryName
          this.showList()
        } else {
          this.recordList = []
          this.total = 0
        }
      }
    },
    async initMenu() {
      const res = await this.getScoreClass(this.categoryId)
      if (res.data === null || res.data.length === 0) {
        this.noData = true
      } else {
        this.noData = false
      }
      this.gradeList = res.data
      if (this.gradeList.length > 0) {
        this.treeData = this.gradeList.map(item => {
          return {
            title: item.gradeName,
            code: item.gradeCode,
            key: item.gradeCode,
            children: item.classDtoList.map(el => {
              return {
                title: el.className,
                code: el.classCode,
                key: el.classCode,
                schoolYearId: el.schoolYearId
              }
            })
          }
        })
        this.defaultExpandedKeys = [this.gradeList[0].gradeCode]
        if (this.treeData[0].children.length > 0) {
          this.defaultSelectedKeys = [this.treeData[0].children[0].code]
        } else {
          this.defaultSelectedKeys = [this.treeData[0].code]
        }
        this.select(this.defaultSelectedKeys, this.treeData[0].children[0])
      } else {
        this.treeData = []
      }
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
