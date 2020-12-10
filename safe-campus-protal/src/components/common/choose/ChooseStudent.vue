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
    <a-row
      type="flex"
      justify="end"
      style="margin-bottom: 15px"
      :style="hasAdd ? 'margin-right:0' : 'margin-right:215px'"
    >
      <a-col>
        <span>姓名/学号：</span>
        <a-input v-model="keyword" style="width: 120px; margin-right: 10px" placeholder="请输入关键字" />
        <span>性别：</span>
        <a-select style="width: 120px; margin-right: 10px" v-model="sex">
          <a-select-option value>全部</a-select-option>
          <a-select-option value="1">男</a-select-option>
          <a-select-option value="2">女</a-select-option>
        </a-select>
        <span>是否有人脸：</span>
        <a-select v-model="hasPhoto" style="width: 120px; margin-right: 10px">
          <a-select-option value>全部</a-select-option>
          <a-select-option :value="1">是</a-select-option>
          <a-select-option :value="0">否</a-select-option>
        </a-select>
        <span>走住读类型：</span>
        <a-select style="width: 120px; margin-right: 10px" v-model="hasDorm">
          <a-select-option value>全部</a-select-option>
          <a-select-option value="1">住读</a-select-option>
          <a-select-option value="0">走读</a-select-option>
        </a-select>
        <a-button type="primary" @click="getStudentList()">查询</a-button>
      </a-col>
      <a-col v-if="hasAdd" style="margin-left: 45px; line-height: 35px">
        <span>
          <a @click="newStudent">未找到学生?点击新建学生></a>
        </span>
      </a-col>
    </a-row>
    <div class="choose-user qui-fx">
      <major-tree
        v-if="userInfo.schoolType === '8' || userInfo.schoolType === '9'"
        @select="select"
      ></major-tree>
      <grade-tree v-else isOnlyNewSchoolYear @select="select"></grade-tree>
      <div class="qui-fx-ver qui-fx-f1">
        <table-list
          :is-check="isCheck"
          :is-radio="isRadio"
          is-zoom
          :scroll-h="500"
          :page-list="pageList"
          v-model="chooseList"
          :columns="columns"
          @clickRow="clickRow"
          @selectAll="selectAll"
          :table-list="userList"
        >
          <template v-slot:other1="other1">
            <a-tag :color="parseInt(other1.record.hasDorm) === 1 ? '#87d068' : '#2db7f5'">
              {{
              $tools.hasDorm(other1.record.hasDorm)
              }}
            </a-tag>
          </template>
        </table-list>
        <page-num
          :jumper="false"
          v-model="pageList"
          :mar-top="20"
          :mar-bot="0"
          size="small"
          :total="total"
          @change-page="changePage"
        ></page-num>
      </div>
      <div class="user-box qui-fx-ver" v-if="isTotal">
        <div class="title qui-fx-jsb">
          <span>已选择</span>
          <span>{{ totalList.length }}人</span>
        </div>
        <div class="qui-fx-f1" style="overflow: auto">
          <ul>
            <li v-for="(item, index) in totalList" :key="item.id" class="qui-fx-jsb">
              <div>{{ item.userName }}</div>
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
import $ajax from '@u/ajax-serve'
import { mapState } from 'vuex'
import GradeTree from '@c/GradeTree'
import MajorTree from '@c/MajorTree'
import hostEnv from '@config/host-env'
const columns = [
  {
    title: '序号',
    width: '10%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '姓名',
    dataIndex: 'userName',
    width: '15%'
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
    title: '走住读',
    width: '15%',
    scopedSlots: {
      customRender: 'other1'
    }
  },
  {
    title: '学号',
    dataIndex: 'workNo',
    width: '20%'
  },
  {
    title: '照片',
    dataIndex: 'photoUrl',
    width: '20%',
    scopedSlots: {
      customRender: 'photoPic'
    }
  }
]
export default {
  name: 'ChooseStudent',
  components: {
    PageNum,
    TableList,
    GradeTree,
    MajorTree
  },
  props: {
    isTotal: {
      type: Boolean,
      default: true
    },
    noBind: {
      type: Boolean,
      default: false
    },
    bindObj: {
      type: Object,
      default: () => {
        return {}
      }
    },
    isAll: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    value: {
      type: Boolean,
      default: false
    },
    isRadio: {
      type: Boolean,
      default: false
    },
    isCheck: {
      type: Boolean,
      default: false
    },
    hasAdd: {
      type: Boolean,
      default: false
    },
    classList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  computed: {
    ...mapState('home', ['schoolCode', 'userInfo']),
    status: {
      get() {
        return this.value
      },
      set() {
        this.$emit('input', false)
      }
    }
  },
  async mounted() {
    console.log('sss', this.userInfo)
    this.url =
      this.userInfo.schoolType === '8' || this.userInfo.schoolType === '9'
        ? `/student/manage/list`
        : this.noBind
          ? `/userinfo/student/user/queryNoClassStudentInfos`
          : `/userinfo/student/user/queryStudentInfoList`
    this.getStudentList()
  },
  data() {
    return {
      confirmLoading: false,
      chooseList: [],
      pageList: {
        page: 1,
        size: 20
      },
      sex: '',
      hasDorm: '',
      keyword: '',
      hasPhoto: '',
      total: 0,
      columns,
      userList: [],
      totalList: [],
      schoolYear: '',
      treeObj: {}
    }
  },
  methods: {
    changePage() {
      this.getStudentList()
    },
    async select(obj) {
      this.treeObj = obj
      this.getStudentList()
    },
    async getStudentList() {
      if (!this.treeObj.schoolYearId) {
        return
      }
      const res = await $ajax.post({
        url: `${hostEnv.protal_api_11002}` + this.url,
        params: {
          hasDorm: this.hasDorm,
          keyword: this.keyword,
          hasPhoto: this.hasPhoto,
          sex: this.sex,
          schoolCode: this.schoolCode,
          gradeId: this.treeObj ? this.treeObj.gradeCode : '',
          classId: this.treeObj ? this.treeObj.classCode : '',
          schoolYearId: this.treeObj ? this.treeObj.schoolYearId : '',
          subjectCode:
            this.userInfo.schoolType === '8' || this.userInfo.schoolType === '9' ? this.treeObj.subjectCode : '',
          gradeCode: this.userInfo.schoolType === '8' || this.userInfo.schoolType === '9' ? this.treeObj.gradeCode : '',
          grade: this.userInfo.schoolType === '8' || this.userInfo.schoolType === '9' ? this.treeObj.gradeName : '',
          classCode: this.userInfo.schoolType === '8' || this.userInfo.schoolType === '9' ? this.treeObj.classCode : '',
          ...this.pageList
        }
      })
      this.userList = res.data.list.map(item => {
        return {
          ...item,
          id: item.userCode
        }
      })
      this.total = res.data.total
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
        item.forEach(item => {
          const index = this.totalList.findIndex(list => {
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
            userName: item.userName,
            hasDorm: item.hasDorm,
            photoUrl: item.photoUrl,
            classCode: item.classCode,
            className: item.className,
            gradeCode: this.userInfo.schoolType === '8' || this.userInfo.schoolType === '9' ? item.grade : item.gradeCode,
            gradeName: this.userInfo.schoolType === '8' || this.userInfo.schoolType === '9' ? item.grade : item.gradeName,
            schoolYearId: JSON.parse(window.sessionStorage.getItem('schoolYear')).schoolYearId,
            subjectCode: this.userInfo.schoolType === '8' || this.userInfo.schoolType === '9' ? item.subjectCode : '',
            subjectName: this.userInfo.schoolType === '8' || this.userInfo.schoolType === '9' ? item.subjectName : ''
          })
        } else {
          this.totalList = [item]
        }
      } else {
        const index = this.totalList.findIndex(list => list.id === item.id)
        this.totalList.splice(index, 1)
      }
    },
    submitOk() {
      if (this.totalList.length === 0 && this.bindId === -1) {
        this.$message.warning('请选择人员')
        return
      }
      console.log('this.totalList', this.totalList)
      this.confirmLoading = true
      this.$emit('submit', this.totalList)
    },
    newStudent() {
      this.$emit('toAdd', true)
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
