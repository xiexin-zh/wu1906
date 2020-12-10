<template>
  <div class="job-statis qui-fx">
    <div class="left">
      <major-tree
        v-if="userInfo.schoolType === '8' || userInfo.schoolType === '9'"
        @select="select"
      ></major-tree>
      <grade-tree v-else @select="select"></grade-tree>
    </div>
    <div class="right qui-fx-ver">
      <search-form isReset @search-form="searchForm" :search-label="searchLabel">
        <div slot="left">
          <a-button icon="export" class="export-btn" @click="exportClick">导出</a-button>
        </div>
      </search-form>
      <table-list :page-list="pageList" :columns="columns" :table-list="dataList">
        <template
          v-slot:other1="record"
        >{{ record.record.grade_name }}{{ record.record.class_name }}</template>
        <template
          v-slot:other2="record"
        >{{ record.record.count - (record.record.unsubmit_count || 0) }}</template>
      </table-list>
      <page-num v-model="pageList" :total="total" @change-page="showList"></page-num>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import GradeTree from '@c/GradeTree'
import MajorTree from '@c/MajorTree'
import TableList from '@c/TableList'
import PageNum from '@c/PageNum'
import SearchForm from '@c/SearchForm'
import $tools from '@u/tools'

const columns = [
  {
    title: '序号',
    width: '10%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '班级',
    dataIndex: 'class_name',
    width: '10%',
    scopedSlots: {
      customRender: 'other1'
    }
  },
  {
    title: '日期',
    dataIndex: 'create_time',
    width: '10%',
    customRender: text => {
      return $tools.getDate(text, 1)
    }
  },
  {
    title: '学科',
    dataIndex: 'subject_name',
    width: '10%'
  },
  {
    title: '总人数',
    dataIndex: 'count',
    width: '10%'
  },
  {
    title: '已交',
    dataIndex: 'class_code',
    width: '10%',
    scopedSlots: {
      customRender: 'other2'
    }
  },
  {
    title: '未交',
    dataIndex: 'unsubmit_count',
    width: '10%',
    customRender: text => {
      return text || 0
    }
  }
]
const searchLabel = [
  {
    value: 'createTime',
    type: 'singleTime',
    label: '时间'
  },
  {
    list: [],
    value: 'subjectCode',
    type: 'select',
    label: '学科',
    placeholder: '请选择学科'
  }
]
export default {
  name: 'Homework',
  components: {
    GradeTree,
    TableList,
    PageNum,
    SearchForm,
    MajorTree
  },
  data() {
    return {
      columns,
      searchLabel,
      total: 0,
      pageList: {
        page: 1,
        size: 20
      },
      dataList: [],
      searchList: {},
      classInfo: {}
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  mounted() {
    this.getSubject({ schoolCode: this.userInfo.schoolCode }).then(res => {
      this.searchLabel[1].list = res.data.map(el => {
        return {
          key: el.subjectCode,
          val: el.subjectName
        }
      })
    })
  },
  methods: {
    ...mapActions('home', ['getHomeworkList', 'exportHomework', 'getSubject']),
    // 选中年级
    select(item) {
      console.log(item)
      if (!item.classCode) {
        return
      }
      this.classInfo = item
      this.showList()
    },
    async showList() {
      const req = {
        ...this.classInfo,
        ...this.searchList,
        ...this.pageList,
        schoolCode: this.userInfo.schoolCode
      }
      const res = await this.getHomeworkList(req)
      this.dataList = res.data.list
      this.total = res.data.total
    },
    searchForm(values) {
      this.searchList = values
      this.showList()
    },
    exportClick() {
      this.exportHomework({
        ...this.classInfo,
        ...this.searchList,
        schoolCode: this.userInfo.schoolCode,
        name: '作业统计'
      })
    }
  }
}
</script>

<style lang="less" scoped>
.job-statis {
  flex: 1;
  overflow: hidden;
  .left {
    background: #fff;
    margin-right: 10px;
    padding: 10px;
    width: 200px;
  }
  .right {
    position: relative;
    flex: 1;
    background: #fff;
    padding: 10px;
    width: calc(100% - 210px);
  }
}
</style>
