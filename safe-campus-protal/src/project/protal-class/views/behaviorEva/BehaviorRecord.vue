<template>
  <div class="page-layout qui-fx record">
    <div class="grade-tree">
      <major-tree
        v-if="userInfo.schoolType === '8' || userInfo.schoolType === '9'"
        @select="select"
      ></major-tree>
      <grade-tree v-else @select="select"></grade-tree>
    </div>
    <div class="qui-fx-f1 qui-fx-ver">
      <search-form is-reset @search-form="searchForm" :search-label="searchLabel"></search-form>
      <div class="qui-fx-f1 record-box" style="overflow-y:scroll">
        <div class="pos-box">
          <no-data v-if="recordList.length === 0" msg="暂无数据~"></no-data>
          <div
            class="qui-fx record-content"
            v-for="(list,i) in recordList"
            :key="i"
            @click="goDetail(list)"
          >
            <img class="record-img" :src="list.urlList[0]" />
            <div class="qui-fx-f1 qui-fx-ver record-word">
              <div class="record-title">{{ list.appraiseItemName }}</div>
              <div class="qui-fx record-person">
                <div>{{ list.studentName }}</div>
                <div class="mar-l10">{{ list.studentNo }}</div>
                <div class="mar-l10">{{ list.gradeName }} ({{ list.className }})</div>
              </div>
              <div class="qui-fx-f1 record-news">{{ list.content }}</div>
              <div class="qui-fx-jsb record-info">
                <div>评价人：{{ list.appraiserName }} {{ list.createTime | gmtToDate('date') }}</div>
                <a-button
                  v-if="isShow"
                  size="small"
                  class="del-action-btn"
                  icon="delete"
                  @click.stop="del(list)"
                ></a-button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <page-num v-model="pageList" :total="total" @change-page="showList"></page-num>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import GradeTree from '@c/GradeTree'
import TableList from '@c/TableList'
import PageNum from '@c/PageNum'
import $tools from '@u/tools'
import MajorTree from '@c/MajorTree'
import SearchForm from '@c/SearchForm'
import NoData from '@c/NoData'
const searchLabel = [
  {
    value: 'studentNoOrName', // 分类查询
    type: 'selectInput', // 表单类型
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
    placeholder: '请输入' // 表单默认值(非必选字段)
  },
  {
    value: 'appraiserName',
    type: 'input',
    label: '评价人',
    placeholder: '请输入'
  },
  {
    list: [],
    value: 'appraiseItemId',
    type: 'select',
    label: '评价指标'
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
    dataIndex: 'userName',
    width: '10%'
  },
  {
    title: '检查项',
    dataIndex: 'itemName',
    width: '10  %'
  },
  {
    title: '指标内容',
    dataIndex: 'indexName',
    width: '25%'
  },
  {
    title: '加分/扣分',
    dataIndex: 'score',
    width: '10%'
  },
  {
    title: '当前总分',
    dataIndex: 'total',
    width: '10%'
  },
  {
    title: '德育员',
    dataIndex: 'assessedName',
    width: '10%'
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
  name: 'BehaviorRecord',
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
        studentNoOrName: '',
        appraiserName: '',
        appraiseItemId: '',
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
      gradeList: [],
      categoryId: '',
      searchLabel,
      isShow: false
    }
  },
  computed: {
    ...mapState('home', ['userInfo', 'loginType'])
  },
  mounted() {
    this.categoryGet()
    this.isUserGet()
  },
  methods: {
    ...mapActions('home', [
      'getIndexScore',
      'getIndex',
      'delAppraise',
      'getCategory',
      'getScoreRecord',
      'getScoreClass',
      'getIsAuthorize'
    ]),
    async isUserGet() {
      const res = await this.getIsAuthorize(this.loginType.userCode)
      this.isShow = res.data
    },
    async categoryGet() {
      const req = {
        schoolCode: this.userInfo.schoolCode,
        page: 1,
        size: 999999
      }
      const res = await this.getIndex(req)
      this.searchLabel[2].list = res.data.list.map(el => {
        return {
          val: el.name,
          key: el.id
        }
      })
      this.searchLabel[2].list.unshift({ key: '', val: '全部' })
    },
    searchForm(values) {
      this.searchList = Object.assign(this.searchList, values)
      this.showList()
    },
    callback(record) {
      this.categoryId = record.split('+')[0]
      this.categoryName = record.split('+')[1]
      this.treeData = []
    },
    async showList() {
      this.searchList.schoolCode = this.userInfo.schoolCode
      this.searchList = Object.assign(this.searchList, this.pageList)
      const res = await this.getIndexScore(this.searchList)
      this.recordList = res.data.list
      this.total = res.data.total
    },
    select(item) {
      this.pageList.page = 1
      this.pageList.size = 20
      this.searchList.schoolYearId = item.schoolYearId
      this.searchList.classCode = item.classCode
      this.showList()
    },
    del(record) {
      this.$tools.delTip('确定删除吗？', () => {
        this.delAppraise(record.id).then(res => {
          this.$message.success('删除成功')
          this.$tools.goNext(() => {
            this.showList()
          })
        })
      })
    },
    goDetail(item) {
      console.log('ity', item)
      this.$router.push({
        path: '/recordDetail',
        query: {
          id: item.id
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.record {
  .grade-tree {
    padding: 0 10px;
    width: 220px;
    min-height: 400px;
    max-height: 800px;
    overflow-y: auto;
  }
  .record-box {
    .record-content {
      width: 48%;
      height: 230px;
      float: left;
      margin-left: 1.2%;
      margin-bottom: 15px;
      border-radius: 10px;
      padding: 15px;
      background-color: #f5f5f5;
      .record-img {
        width: 240px;
      }
      .record-word {
        margin-left: 20px;
        .record-title {
          margin-bottom: 5px;
          font-size: 18px;
          font-weight: bolder;
          color: @title-color;
        }
        .record-person {
          color: #666;
          font-weight: bold;
        }
        .record-news {
          margin: 5px 0;
          overflow: scroll;
          color: #888;
          text-indent: 2em;
        }
        .record-info {
          font-size: 10px;
          color: @des-color;
        }
      }
    }
  }
}
</style>
