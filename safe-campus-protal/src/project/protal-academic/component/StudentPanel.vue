<template>
  <a-modal
    width="70%"
    :title="title"
    v-model="status"
    @ok="submitOk"
    :maskClosable="false"
    :destroyOnClose="true"
    :confirmLoading="confirmLoading"
  >
    <a-row type="flex" justify="end" style="margin-bottom: 15px">
      <a-col>
        <a-select v-model="searchType" @change="changeType">
          <a-select-option v-for="(item, index) in searchTypeList" :key="index" :value="item.val">{{
            item.title
          }}</a-select-option>
        </a-select>
        <a-input v-model="keyword" style="width: 130px; margin-right: 10px" :placeholder="placeholder" />
        <a-button type="primary" style="margin-right: 10px" @click="getUserList">查询</a-button>
        <a-button type="default" style="background: #e8e8e8; color: #999" @click="resetSearch">重置</a-button>
      </a-col>
    </a-row>
    <div class="choose-user qui-fx">
      <div class="org-box">
        <major-tree @select="select" v-if="isHighSchool"></major-tree>
        <grade-tree @select="select" v-else></grade-tree>
      </div>
      <div class="qui-fx-ver qui-fx-f1">
        <table-list
          isCheck
          isRadio
          :scroll-h="500"
          :page-list="pageList"
          v-model="chooseList"
          :columns="columns"
          @clickRow="clickRow"
          :table-list="userList"
        ></table-list>
        <page-num
          :jumper="false"
          v-model="pageList"
          :mar-top="20"
          :mar-bot="0"
          size="small"
          :total="total"
          @change-page="getUserList"
        ></page-num>
      </div>
    </div>
  </a-modal>
</template>

<script>
import PageNum from '@c/PageNum'
import TableList from '@c/TableList'
import GradeTree from './GradeTree'
import MajorTree from '@c/MajorTree'
import { mapState, mapActions } from 'vuex'
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
    title: '性别',
    dataIndex: 'sex',
    width: '10%',
    customRender: (text) => {
      if (text === 1 || text === '1') {
        return '男'
      }
      if (text === 2 || text === '2') {
        return '女'
      }
      return '未知'
    }
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
    title: '学号',
    dataIndex: 'workNo',
    width: '15%'
  },
  {
    title: '人脸照片',
    dataIndex: 'photoUrl',
    width: '10%',
    scopedSlots: {
      customRender: 'photoPic'
    }
  }
]
export default {
  name: 'StudentPanel',
  components: {
    PageNum,
    TableList,
    GradeTree,
    MajorTree
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    value: {
      type: Boolean,
      default: false
    },
    studentStatus: {
      type: String,
      default: ''
    },
    isHighSchool: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState('home', ['schoolCode']),
    status: {
      get() {
        return this.value
      },
      set() {
        this.$emit('input', false)
      }
    }
  },
  data() {
    return {
      searchType: '1',
      keyword: '',
      placeholder: '请输入学生姓名',
      searchTypeList: [
        {
          val: '1',
          title: '学生姓名'
        },
        {
          val: '2',
          title: '学号'
        }
      ],
      confirmLoading: false,
      chooseList: [],
      pageList: {
        page: 1,
        size: 20
      },
      total: 0,
      columns,
      userList: [],
      totalList: [],
      schoolYearId: '',
      gradeCode: '',
      classCode: '',
      gradeName: '',
      subjectCode: ''
    }
  },
  created() {},
  mounted() {
    this.columns[3].title = this.isHighSchool ? '专业' : '年级'
    this.columns[3].dataIndex = this.isHighSchool ? 'subjectName' : 'gradeName'
  },
  methods: {
    ...mapActions('home', ['studentList', 'getHighStudentList']),
    // 获取学生列表
    async getUserList(searchObj = {}) {
      const req = {
        ...this.pageList,
        ...searchObj,
        keyword: this.keyword,
        schoolCode: this.schoolCode,
        schoolYearId: this.schoolYearId,
        gradeCode: this.gradeCode || '',
        classCode: this.classCode || '',
        status: this.studentStatus
      }
      const highReq = {
        ...this.pageList,
        ...searchObj,
        schoolCode: this.schoolCode,
        keyword: this.keyword,
        grade: this.gradeName,
        gradeCode: this.gradeCode,
        gradeName: this.gradeName,
        subjectCode: this.subjectCode,
        classCode: this.classCode,
        status: this.studentStatus
      }
      const res = this.isHighSchool ? await this.getHighStudentList(highReq) : await this.studentList(req)
      this.userList = res.data.list
      this.total = res.data.total
    },
    select(item) {
      this.pageList.page = 1
      this.pageList.size = 20
      this.schoolYearId = item.schoolYearId
      this.gradeCode = item.gradeCode
      this.classCode = item.classCode
      this.gradeName = item.gradeName || ''
      this.subjectCode = item.subjectCode || ''
      this.$nextTick(() => {
        this.getUserList()
      })
    },
    // 监听选中或取消
    clickRow(item, type) {
      if (type) {
        if (this.isCheck) {
          this.totalList.push({
            ...item
          })
        } else {
          this.totalList = [item]
        }
      } else {
        const index = this.totalList.findIndex((list) => list.id === item.id)
        this.totalList.splice(index, 1)
      }
    },
    changeType(val) {
      this.searchType = val
      this.placeholder = val === '1' ? '请输入学生姓名' : '请输入学号'
    },
    resetSearch() {
      this.keyword = ''
      this.getUserList()
    },
    async submitOk() {
      if (this.totalList.length === 0) {
        this.$message.warning('请选择学生')
        return
      }
      const list = this.totalList.map((item) => {
        return {
          ...item,
          gradeName: this.isHighSchool ? item.subjectName : item.gradeName,
          gradeCode: this.isHighSchool ? item.subjectCode : item.gradeCode,
          schoolYearId: this.isHighSchool ? Number(item.grade) : item.schoolYearId
        }
      })
      this.$emit('submit', list[0])
    }
  }
}
</script>

<style lang="less" scoped>
.choose-user {
  height: 600px;
  .org-box {
    overflow-x: hidden;
    width: 240px;
  }
  .user-box {
    border: 1px #f5f5f5 solid;
    margin-left: 15px;
    width: 200px;
    .title {
      padding: 0 10px;
      background-color: #f5f5f5;
      height: 41px;
      line-height: 41px;
      border-bottom: 1px #f5f5f5 solid;
    }
    li {
      border-bottom: 1px #f5f5f5 solid;
      padding: 6px 0px 6px 8px;
    }
  }
}
</style>
