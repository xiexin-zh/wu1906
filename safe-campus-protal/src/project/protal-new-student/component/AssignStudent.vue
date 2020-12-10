<template>
  <a-modal
    width="90%"
    :title="title"
    v-model="status"
    @ok="submitOk"
    :maskClosable="false"
    :destroyOnClose="true"
    :confirmLoading="confirmLoading"
  >
    <a-row type="flex" justify="end" style="margin-bottom: 15px; margin-right: 215px">
      <a-col>
        <span>申请专业：</span>
        <!-- <a-input v-model="ProjectName" style="width: 120px; margin-right: 10px" placeholder="请输入专业名称" /> -->
        <AutoComplete
          v-model="ProjectName"
          :data-source="dataSource"
          style="width: 120px; margin-right: 10px"
          placeholder="请输入专业名称"
          @select="onSelectSubject"
          @search="onSearchSubject"
          @change="onChangeSubject"
        />
        <span>学生姓名：</span>
        <a-input v-model="studentName" style="width: 120px; margin-right: 10px" placeholder="请输入学生姓名" />
        <span>报到状态：</span>
        <a-select v-model="reportStatus" style="width: 120px; margin-right: 10px" @change="handleChangeStatus">
          <a-select-option value="0"> 全部 </a-select-option>
          <a-select-option value="1"> 已报到 </a-select-option>
          <a-select-option value="2"> 未报到 </a-select-option>
        </a-select>
        <a-button type="primary" @click="getUserList">查询</a-button>
        <a-button style="margin-left: 5px; background: #e8e8e8; color: #999" type="default" @click="resetSearch"
          >重置</a-button
        >
      </a-col>
    </a-row>
    <div class="choose-user qui-fx">
      <div class="qui-fx-ver qui-fx-f1">
        <table-list
          :is-check="isCheck"
          :is-radio="isRadio"
          :scroll-h="500"
          :page-list="pageList"
          v-model="chooseList"
          :columns="columns"
          @clickRow="clickRow"
          @selectAll="selectAll"
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
      <div class="user-box qui-fx-ver" v-show="isTotal">
        <div class="title qui-fx-jsb">
          <span>已选择</span>
          <span>{{ totalList.length }}人</span>
        </div>
        <div class="qui-fx-f1" style="overflow: auto">
          <ul style="padding-left: 0">
            <li v-for="(item, index) in totalList" :key="item.id" class="qui-fx-jsb">
              <span>{{ item.studentName }}</span>
              <a-tag v-if="!item.hasCheckIn" @click="delUser(item.id, index)" color="#f50">删除</a-tag>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </a-modal>
</template>

<script>
import PageNum from '@c/PageNum'
import TableList from '@c/TableList'
import GradeTree from '@c/MajorTree'
import { mapState, mapActions } from 'vuex'
import { AutoComplete } from 'ant-design-vue'
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
    dataIndex: 'studentName',
    width: '8%'
  },
  {
    title: '身份证号码',
    dataIndex: 'idNumber',
    width: '15%'
  },
  {
    title: '性别',
    dataIndex: 'gender',
    width: '8%',
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
    dataIndex: 'grade',
    width: '8%',
    customRender: (text) => {
      return `${text}级`
    }
  },
  {
    title: '申请专业',
    dataIndex: 'majorName',
    width: '15%'
  },
  {
    title: '班级',
    dataIndex: 'className',
    width: '10%'
  },
  {
    title: '报到状态',
    dataIndex: 'hasCheckIn',
    width: '8%',
    customRender: (text) => {
      return text ? '已报到' : '未报到'
    }
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
  name: 'AssignStudent',
  components: {
    PageNum,
    TableList,
    GradeTree,
    AutoComplete
  },
  props: {
    isTotal: {
      type: Boolean,
      default: true
    },
    bindObj: {
      type: Object,
      default: () => {
        return {}
      }
    },
    chooseType: {
      type: String,
      default: ''
    },
    isRadio: {
      type: Boolean,
      default: false
    },
    isCheck: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: ''
    },
    value: {
      type: Boolean,
      default: false
    },
    grade: {
      type: [String, Number],
      default: ''
    },
    classCode: {
      type: String,
      default: ''
    },
    className: {
      type: String,
      default: ''
    },
    subjectCode: {
      type: String,
      default: ''
    },
    subjectName: {
      type: String,
      default: ''
    }
  },
  computed: {
    ...mapState('home', ['schoolCode', 'eduCode']),
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
      hasPhoto: '',
      ProjectName: '',
      studentName: '',
      hasCheckIn: '',
      reportStatus: '0',
      gradeList: [],
      dataSource: [],
      confirmLoading: false,
      orgCode: '',
      chooseList: [],
      pageList: {
        page: 1,
        size: 20
      },
      total: 0,
      columns,
      userList: [],
      totalList: [],
      code: ''
    }
  },
  created() {
    this.getGrade()
  },
  mounted() {
    this.getUserList()
    this.getClassStu()
  },
  methods: {
    ...mapActions('home', ['getStudentList', 'assignClass', 'getClassStudent', 'getAllGrade']),
    // 查询学生列表
    async getUserList() {
      const req = {
        grade: this.grade,
        state: 3,
        hasCheckIn: this.hasCheckIn,
        schoolCode: this.schoolCode,
        majorName: this.ProjectName,
        studentName: this.studentName,
        ...this.pageList
      }
      const res = await this.getStudentList(req)
      if (res && res.code === 200) {
        this.userList = res.data.records.map((item) => {
          return {
            ...item,
            disabled: item.hasCheckIn
          }
        })
        this.total = res.data.total
      }
    },
    // 重置搜索条件
    resetSearch() {
      this.ProjectName = ''
      this.studentName = ''
      this.reportStatus = '0'
      this.hasCheckIn = ''
      this.getUserList()
    },
    // 获取班级已有学生列表
    async getClassStu() {
      const res = await this.getClassStudent(this.classCode)
      if (res && res.code === 200) {
        this.totalList = res.data
        this.chooseList = res.data.map((item) => {
          return item.id
        })
      }
    },
    delUser(id, index) {
      this.totalList.splice(index, 1)
      this.chooseList.splice(this.chooseList.indexOf(id), 1)
    },
    selectAll(item, type) {
      if (type) {
        this.totalList = this.totalList.concat(item)
      } else {
        item.forEach((item) => {
          const index = this.totalList.findIndex((list) => {
            return list.id === item.id
          })
          this.totalList.splice(index, 1)
        })
      }
    },
    // 监听选中或取消
    clickRow(item, type) {
      if (type) {
        if (this.isCheck) {
          this.totalList.push({
            id: item.id,
            userCode: item.userCode,
            studentName: item.studentName,
            orgCode: item.orgCode,
            orgName: item.orgName,
            photoUrl: item.photoUrl,
            sex: item.sex,
            mobile: item.mobile
          })
        } else {
          this.totalList = [item]
        }
      } else {
        const index = this.totalList.findIndex((list) => list.id === item.id)
        this.totalList.splice(index, 1)
      }
    },
    // 获取专业列表
    async getGrade() {
      const req = {
        schoolCode: this.schoolCode,
        subjectName: '',
        page: 1,
        size: 9999
      }
      const res = await this.getAllGrade(req)
      const list = res.data.records.map((item) => {
        return item.subjectName
      })
      this.gradeList = list
      this.dataSource = list
    },
    // 自动完成输入框
    onSelectSubject(value) {
      this.ProjectName = value
    },
    onSearchSubject(value) {
      this.dataSource = this.gradeList.filter((item) => {
        return item.includes(value)
      })
    },
    onChangeSubject() {},
    // 更改报到状态
    handleChangeStatus(val) {
      let status = ''
      if (val === '1') {
        status = true
      }
      if (val === '2') {
        status = false
      }
      this.reportStatus = val
      this.hasCheckIn = status
    },
    async submitOk() {
      if (this.totalList.length === 0) {
        this.$message.warning('请选择人员')
        return
      }
      this.confirmLoading = true
      const req = {
        classCode: this.classCode,
        className: this.className,
        finalMajorCode: this.subjectCode,
        finalMajorName: this.subjectName,
        ids: this.totalList.map((item) => {
          return item.id
        })
      }
      const res = await this.assignClass(req)
      this.$emit('submit')
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
