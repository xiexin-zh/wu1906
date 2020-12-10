<template>
  <a-modal
    width="1200px"
    :title="title"
    v-model="status"
    @ok="submitOk"
    :maskClosable="false"
    :destroyOnClose="true"
    :confirmLoading="confirmLoading"
  >
    <div class="choose-user qui-fx">
      <div class="qui-fx-ver qui-fx-f1">
        <a-tabs v-model="activeKey" @change="tabChange">
          <a-tab-pane tab="学生" key="1" class="choose-user">
            <div class="qui-fx-f1">
              <search-form isReset @search-form="stuSearch" :search-label="searchLabel"></search-form>
            </div>
            <div class="qui-fx">
              <div class="org-box">
                <grade-tree isOnlyNewSchoolYear @select="classSelect"></grade-tree>
              </div>
              <div class="qui-fx-ver qui-fx-f1">
                <table-list
                  :minHeight="500"
                  :scroll-h="450"
                  is-check
                  :page-list="pageList"
                  v-model="stuChooseList"
                  :columns="columns1"
                  @clickRow="studentClickRow"
                  @selectAll="selectAllStudent"
                  :table-list="stuTableList"
                >
                </table-list>
              </div>
            </div>
          </a-tab-pane>
          <a-tab-pane tab="教职工" key="2" class="choose-user">
            <div class="qui-fx-f1">
              <search-form isReset @search-form="teaSearch" :search-label="searchLabel"></search-form>
            </div>
            <div class="qui-fx">
              <div class="org-box">
                <org-tree @select="teaSelect" @defaultCode="defaultCode"></org-tree>
              </div>
              <div class="qui-fx-ver qui-fx-f1">
                <table-list
                  :minHeight="500"
                  :scroll-h="450"
                  is-check
                  :page-list="pageList"
                  v-model="teaChooseList"
                  :columns="columns2"
                  @clickRow="teaClickRow"
                  @selectAll="selectAllTea"
                  :table-list="teaTableList"
                >
                </table-list>
              </div>
            </div>
          </a-tab-pane>
        </a-tabs>
      </div>
      <div class="user-box qui-fx-ver">
        <a-tabs v-model="activeKey">
          <a-tab-pane tab="学生" key="1">
            <div class="title qui-fx-jsb">
              <span>已选择</span>
              <span>{{ stuTotalList.length }}个</span>
            </div>
            <div class="choose-list qui-fx-f1" style="overflow: auto">
              <ul>
                <li v-for="(item, index) in stuTotalList" :key="item.userCode" class="qui-fx-jsb qui-fx-ac">
                  <span>{{ item.userName }}</span>
                  <a-tag @click="delStudent(item.userCode, index)" color="#f50">删除</a-tag>
                </li>
              </ul>
            </div>
          </a-tab-pane>
          <a-tab-pane tab="教职工" key="2">
            <div class="title qui-fx-jsb">
              <span>已选择</span>
              <span>{{ teaTotalList.length }}个</span>
            </div>
            <div class="choose-list qui-fx-f1" style="overflow: auto">
              <ul>
                <li v-for="(item, index) in teaTotalList" :key="item.userCode" class="qui-fx-jsb qui-fx-ac">
                  <span>{{ item.userName }}</span>
                  <a-tag @click="delTea(item.userCode, index)" color="#f50">删除</a-tag>
                </li>
              </ul>
            </div>
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
  </a-modal>
</template>

<script>
import GradeTree from '@c/GradeTree'
import OrgTree from '@c/OrgTree'
import SearchForm from '@c/SearchForm'
import TableList from '@c/TableList'
import { mapState } from 'vuex'
import $ajax from '@u/ajax-serve'
import hostEnv from '@config/host-env'
const searchLabel = [
  {
    value: 'userName',
    type: 'input',
    label: '姓名',
    placeholder: '请输入姓名'
  }
]
const columns1 = [
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
      return parseInt(text) === 1 ? '男' : '女'
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
    width: '10%'
  },
  {
    title: '人脸照片',
    dataIndex: 'photoUrl',
    width: '20%',
    scopedSlots: {
      customRender: 'photoPic'
    }
  }
]
const columns2 = [
  {
    title: '序号',
    width: '10%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '教职工姓名',
    dataIndex: 'userName',
    width: '10%'
  },
  {
    title: '性别',
    dataIndex: 'sex',
    width: '10%',
    customRender: text => {
      return parseInt(text) === 1 ? '男' : '女'
    }
  },
  {
    title: '组织机构',
    dataIndex: 'orgName',
    width: '10%'
  },
  {
    title: '手机号',
    dataIndex: 'mobile',
    width: '20%'
  },
  {
    title: '工号',
    dataIndex: 'workNo',
    width: '10%'
  },
  {
    title: '人脸照片',
    dataIndex: 'photoUrl',
    width: '20%',
    scopedSlots: {
      customRender: 'photoPic'
    }
  }
]
export default {
  name: 'ChoosePeople',
  components: {
    TableList,
    SearchForm,
    GradeTree,
    OrgTree
  },
  props: {
    isCheck: {
      type: Boolean,
      default: true
    },
    chooseType: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    value: {
      type: Boolean,
      default: false
    },
    bindObj: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  computed: {
    ...mapState('home', ['userInfo']),
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
      confirmLoading: false,
      activeKey: '1',
      keyword: '',
      stuChooseList: [],
      teaChooseList: [],
      pageList: {
        page: 1,
        size: 999999
      },
      searchLabel,
      columns1,
      columns2,
      searchList: {},
      stuTableList: [],
      teaTableList: [],
      stuTotalList: [],
      teaTotalList: [],
      buildList: [],
      stuList: []
    }
  },
  created() {
    if (!this.bindObj.stuList) {
      return
    }
    this.bindObj.stuList.forEach(item => {
      this.stuChooseList.push(item.userCode)
      this.stuTotalList.push({
        ...item,
        userId: item.id
      })
    })
    if (!this.bindObj.teaList) {
      return
    }
    this.bindObj.teaList.forEach(item => {
      this.teaChooseList.push(item.userCode)
      this.teaTotalList.push({
        ...item,
        userId: item.id
      })
    })
  },
  async mounted() {
    this.showList('student')
  },
  methods: {
    tabChange(val) {
      this.keyword = ''
      if (val === '1') {
        this.showList('student')
      } else if (val === '2') {
        this.showList('teachers')
      }
    },
    async showList(type) {
      if (type === 'student') {
        const res = await $ajax.post({
          url: `${hostEnv.protal_api_11002}/userinfo/student/user/queryStudentInfoList`,
          params: {
            schoolYearId: this.schoolYearId,
            gradeId: this.gradeCode,
            classId: this.classCode,
            keyword: this.keyword,
            schoolCode: this.userInfo.schoolCode,
            ...this.pageList
          }
        })
        this.stuTableList = res.data.list.map(item => {
          return {
            ...item,
            id: item.userCode
          }
        })
      } else if (type === 'teachers') {
        const res = await $ajax.post({
          url: `${hostEnv.protal_api_11002}/userinfo/teacher/user/queryTeacherInfo`,
          params: {
            orgCode: this.orgCode,
            keyword: this.keyword,
            schoolCode: this.userInfo.schoolCode,
            ...this.pageList
          }
        })
        this.teaTableList = res.data.list.map(item => {
          return {
            ...item,
            id: item.userCode
          }
        })
      }
    },
    teaSearch(values) {
      this.keyword = values.userName
      this.showList('teachers')
    },
    stuSearch(values) {
      this.keyword = values.userName
      this.showList('student')
    },
    reset() {
      this.confirmLoading = false
      this.$emit('input', false)
    },
    error() {
      this.confirmLoading = false
    },
    delStudent(id, index) {
      this.stuTotalList.splice(index, 1)
      this.stuChooseList.splice(this.stuChooseList.indexOf(id), 1)
    },
    delTea(id, index) {
      this.teaTotalList.splice(index, 1)
      this.teaChooseList.splice(this.teaChooseList.indexOf(id), 1)
    },
    selectAllStudent(item, type) {
      if (type) {
        this.stuTotalList = this.stuTotalList.concat(item)
      } else {
        item.forEach(item => {
          const index = this.stuTotalList.findIndex(list => {
            return list.userCode === item.userCode
          })
          this.stuTotalList.splice(index, 1)
        })
      }
    },
    selectAllTea(item, type) {
      if (type) {
        this.teaTotalList = this.teaTotalList.concat(item)
      } else {
        item.forEach(item => {
          const index = this.teaTotalList.findIndex(list => {
            return list.userCode === item.userCode
          })
          this.teaTotalList.splice(index, 1)
        })
      }
    },
    // 监听选中或取消
    studentClickRow(item, type) {
      if (type) {
        if (this.isCheck) {
          this.stuTotalList.push(item)
        } else {
          this.stuTotalList = [item]
        }
      } else {
        const index = this.stuTotalList.findIndex(list => list.userCode === item.usersCode)
        this.stuTotalList.splice(index, 1)
      }
    },
    teaClickRow(item, type) {
      if (type) {
        if (this.isCheck) {
          this.teaTotalList.push(item)
        } else {
          this.teaTotalList = [item]
        }
      } else {
        const index = this.teaTotalList.findIndex(list => list.userCode === item.userCode)
        this.teaTotalList.splice(index, 1)
      }
    },
    submitOk() {
      if (this.teaTotalList.length === 0 && this.stuTotalList.length === 0) {
        this.$message.warning('请选择发布对象')
        return
      }
      this.confirmLoading = true
      this.$emit('submit', {
        stuList: this.stuTotalList,
        teaList: this.teaTotalList
      })
    },
    classSelect(item) {
      this.gradeCode = item.gradeCode
      this.classCode = item.classCode
      this.schoolYearId = item.schoolYearId
      this.showList('student')
    },
    teaSelect(item) {
      this.orgCode = item.code
      this.showList('teachers')
    },
    defaultCode(item) {
      this.orgCode = item.code[0]
    }
  }
}
</script>

<style lang="less" scoped>
.choose-user {
  height: 600px;
  .org-box {
    width: 200px;
  }
  .user-box {
    border: 1px #f5f5f5 solid;
    margin-left: 15px;
    width: 280px;
    .title {
      padding: 0 10px;
      background-color: #f5f5f5;
      height: 41px;
      line-height: 41px;
      border-bottom: 1px #f5f5f5 solid;
    }
    .choose-list {
      height: 520px;
    }
    li {
      border-bottom: 1px #f5f5f5 solid;
      padding: 6px 0px 6px 8px;
    }
  }
}
/deep/ .ant-modal-body {
  padding: 14px;
}
/deep/ .ant-tabs-bar {
  margin-bottom: 0;
}
.search-form {
  padding-bottom: 5px;
}
</style>
