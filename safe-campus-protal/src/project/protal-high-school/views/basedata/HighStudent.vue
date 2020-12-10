<template>
  <div class="students page-layout qui-fx">
    <div class="qui-fx qui-fx-jsb" style="width:100%;">
      <div class="left">
        <major-tree @select="select"></major-tree>
      </div>
      <div class="right qui-fx-ver qui-fx-f1" style="padding-right: 10px">
        <search-form isReset @search-form="searchForm" :search-label="manage.searchLabel">
          <div slot="left">
            <a-button icon="plus" class="add-btn" @click="addClick(0)">添加</a-button>
            <a-button icon="export" class="export-all-btn" @click.stop="addClick(2)">批量导入</a-button>
          </div>
        </search-form>
        <table-list
          is-check
          is-zoom
          :page-list="pageList"
          v-model="chooseList"
          :columns="manage.columns"
          :table-list="studentsList"
        >
          <template v-slot:actions="action">
            <a-tooltip placement="topLeft" title="详情">
              <a-button
                size="small"
                class="detail-action-btn"
                icon="ellipsis"
                @click.stop="goLead('/basedata/highStuDetail',action.record)"
              ></a-button>
            </a-tooltip>
            <a-tooltip placement="topLeft" title="编辑">
              <a-button
                size="small"
                class="edit-action-btn"
                icon="form"
                @click.stop="addClick(1, action.record)"
              ></a-button>
            </a-tooltip>
          </template>
          <template v-slot:other1="other1">
            <a-tag
              :color="other1.record.hasDorm === '1' ? '#87d068' : other1.record.hasDorm === '0' ? '#2db7f5' : 'purple'"
            >{{ other1.record.hasDorm === '1' ? '住读' : other1.record.hasDorm === '0' ? '走读' : '未知' }}</a-tag>
          </template>
        </table-list>
        <page-num v-model="pageList" :total="total" @change-page="showList"></page-num>
        <add-stu v-model="formStatus" :title="title" @update="showList" ref="addStu"></add-stu>
      </div>
    </div>
  </div>
</template>

<script>

import { mapState, mapActions } from 'vuex'
import TableList from '@c/TableList'
import NoData from '@c/NoData'
import PageNum from '@c/PageNum'
import SubForm from '../components/SubForm'
import SearchForm from '@c/SearchForm'
import UploadMulti from '@c/UploadFace'
import ShowDialog from '@c/ShowDialog'
import manage from '../../assets/js/table/highStudent.js'
import MajorTree from '@c/MajorTree'
import AddStu from '../components/AddStu'
export default {
  name: 'Manage',
  components: {
    TableList,
    PageNum,
    SubForm,
    UploadMulti,
    SearchForm,
    NoData,
    ShowDialog,
    MajorTree,
    AddStu
  },
  data() {
    return {
      manage,
      dialogTag: false,
      confirmLoading: false,
      fileInfo: {
        tip: '上传图片',
        h: 120, // 高度
        w: 120 // 宽度
      },
      fileList: [],
      uploadFile: [],
      title: '添加学生',
      formStatus: false,
      chooseList: [],
      type: 0,
      total: 0,
      pageList: {
        page: 1,
        size: 20
      },
      studentsList: [],
      userId: '',
      highSubTerm: [],
      highClass: [],
      searchList: {},
      userDetail: {},
      gradeName: ''
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  methods: {
    ...mapActions('home', [
      'getHighTerm', 'getHighGradeSub', 'getHighClass', 'addHighStu',
      'getHighStu', 'updateHighStu', 'getHighGrade'
    ]),
    // 获取列表
    async showList() {
      this.searchList.schoolCode = this.userInfo.schoolCode
      this.searchList = Object.assign(this.searchList, this.pageList)
      const res = await this.getHighStu(this.searchList)
      if (!res.data.list) {
        this.studentsList = []
        return
      }
      this.studentsList = res.data.list
      this.total = res.data.total
    },
    // tree选择
    select(item) {
      this.searchList.gradeCode = item.gradeCode
      this.searchList.gradeName = item.gradeName
      this.searchList.grade = item.gradeName
      this.searchList.subjectCode = item.subjectCode || ''
      this.searchList.classCode = item.classCode || ''
      this.showList()
    },
    // 搜索
    searchForm(values) {
      this.pageList.page = 1
      this.pageList.size = 20
      this.searchList = Object.assign(this.searchList, values)
      this.showList()
    },
    addClick(type, record) {
      this.type = type
      if (type === 1) {
        this.title = '编辑学生'
        this.$refs.addStu._getHighStuDetail(record.id)
        this.formStatus = true
      } else if (type === 2) {
        const path = '/basedata/bulkImport'
        this.$router.push({
          path,
          query: {
            type: 'students',
            state: 1
          }
        })
      } else {
        this.title = '添加学生'
        this.$refs.addStu.appForm = {}
        this.$refs.addStu.fileList = []
        this.$refs.addStu.disabled = false
        this.formStatus = true
      }
    },
    deleteList(type, record) {
      if (type) {
      } else {
        if (this.chooseList.length === 0) {
          this.$message.warning('请选择删除项')
        }
      }
    },
    goLead(path, record) {
      if (record) {
        this.$router.push({
          path,
          query: { userCode: record.userCode, id: record.id }
        })
      } else {
        this.$router.push({ path, query: { type: 'students' } })
      }
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
</style>
