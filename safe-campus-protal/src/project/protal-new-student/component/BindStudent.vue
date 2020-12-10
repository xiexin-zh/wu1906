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
        <span>学生姓名：</span>
        <a-input v-model="keyword" style="width: 120px; margin-right: 10px" placeholder="请输入姓名" />
        <a-button type="primary" @click="getUserList">查询</a-button>
      </a-col>
    </a-row>
    <div class="choose-user qui-fx">
      <div class="org-box">
        <grade-tree @select="select" @defaultCode="defaultCode" :type="type"></grade-tree>
      </div>
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
              <a-tag @click="delUser(item.id, index)" color="#f50">删除</a-tag>
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
import GradeTree from './MajorTree'
import $ajax from '@u/ajax-serve'
import { mapState, mapActions } from 'vuex'
import hostEnv from '@config/host-env'
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
    width: '10%'
  },
  {
    title: '身份证号码',
    dataIndex: 'idNumber',
    width: '20%'
  },
  {
    title: '性别',
    dataIndex: 'gender',
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
    title: '申请专业',
    dataIndex: 'majorName',
    width: '20%'
  },
  {
    title: '年级',
    dataIndex: 'grade',
    width: '8%'
  },
  {
    title: '班级',
    dataIndex: 'className',
    width: '8%'
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
  name: 'BindStudent',
  components: {
    PageNum,
    TableList,
    GradeTree
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
    checkData: {
      type: Array,
      default: () => {
        return []
      }
    },
    teacherList: {
      type: Array,
      default: () => {
        return []
      }
    },
    managerList: {
      type: Array,
      default: () => {
        return []
      }
    },
    deviceId: {
      type: Number,
      default: ''
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
      hasPhoto: '',
      keyword: '',
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
      code: '',
      searchList: {},
      searchObj: {}
    }
  },
  created() {},
  mounted() {
    this.getBindList()
  },
  methods: {
    ...mapActions('home', ['getGlList', 'bindStudent', 'getBindStudent']),
    // 获取学生列表
    async getUserList(searchObj = {}) {
      this.searchList.schoolCode = this.schoolCode
      const req = {
        studentName: this.keyword,
        grade: this.grade, // 年级
        finalMajorCode: this.subjectCode, // 分配专业code
        classCode: this.classCode, // 分配班级code
        state: 3 // 必须是申请成功的学生
      }
      this.searchList = Object.assign(this.searchList, this.pageList, searchObj, req)
      const res = await this.getGlList(this.searchList)
      this.userList = res.data.records
      this.total = res.data.total
    },
    // 获取已绑定的学生列表
    async getBindList() {
      const res = await this.getBindStudent(this.deviceId)
      if (res && res.code === 200) {
        res.data.forEach((item) => {
          this.chooseList.push(item.id)
        })
        this.totalList = res.data
      }
    },
    defaultCode(item) {
      this.orgCode = item.code[0]
    },
    select(item) {
      this.pageList.page = 1
      const { classCode, gradeName, subjectCode } = item
      this.grade = Number(gradeName)
      this.subjectCode = subjectCode
      this.classCode = classCode
      this.getUserList()
    },
    reset() {
      this.confirmLoading = false
      this.$emit('input', false)
    },
    error() {
      this.confirmLoading = false
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
    async submitOk() {
      // if (this.totalList.length === 0) {
      //   this.$message.warning('请选择学生')
      //   return
      // }
      const req = {
        deviceId: this.deviceId,
        userIds:
          this.totalList.length === 0
            ? []
            : this.totalList.map((item) => {
                return item.id
              })
      }
      const res = await this.bindStudent(req)
      if (res && res.code === 200) {
        this.$emit('submit')
      }
      // this.confirmLoading = true
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
