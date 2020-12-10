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
    >
      <a-col>
        <span>姓名：</span>
        <a-input v-model="userName" style="width: 120px; margin-right: 10px" placeholder="请输入" />
        <span>学号：</span>
        <a-input v-model="workNo" style="width: 120px; margin-right: 10px" placeholder="请输入" />
        <span>走住读类型：</span>
        <a-select style="width: 120px; margin-right: 10px" v-model="hasDorm">
          <a-select-option value>全部</a-select-option>
          <a-select-option value="1">住读</a-select-option>
          <a-select-option value="0">走读</a-select-option>
        </a-select>
        <a-button type="primary" @click="getStudentList(chooseType !== '')">查询</a-button>
        <a-button
          style="background:#e8e8e8;color:#999"
          type="default"
          class="u-mar-l10"
          @click="replace(chooseType !== '')">重置</a-button>
      </a-col>
      <a-col style="margin-left: 45px; line-height: 35px">
        <span>
          <a @click="newStudent">未找到学生?点击新建学生></a>
        </span>
      </a-col>
    </a-row>
    <div class="choose-user qui-fx">
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
            <a-tag :color="parseInt(other1.record.hasDorm) === 1 ? '#87d068' : '#2db7f5'">{{
              $tools.hasDorm(other1.record.hasDorm)
            }}</a-tag>
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
      <div class="user-box qui-fx-ver">
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
import { mapState, mapActions } from 'vuex'
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
    title: '学号',
    dataIndex: 'workNo',
    width: '20%'
  },
  {
    title: '入学年份',
    dataIndex: 'admissionTime',
    width: '20%'
  },
  {
    title: '走住读',
    width: '15%',
    scopedSlots: {
      customRender: 'other1'
    }
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
    TableList
  },
  props: {
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
    chooseType: {
      type: String,
      default: ''
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
    classList: {
      type: Array,
      default: () => {
        return []
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
  async mounted() {
    this.url = this.noBind
      ? '/userinfo/student/user/queryNoClassStudentInfos'
      : '/userinfo/student/user/queryStudentInfoList'
    if (this.chooseType === 'attendance') {
      const users = []
      users.forEach(item => {
        this.chooseList.push(item.userCode)
        this.totalList.push({
          id: item.userCode,
          userCode: item.userCode,
          userName: item.userName
        })
      })
      this.getStudentList(true)
    } else {
      this.getStudentList()
    }
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
      userName: '',
      workNo: '',
      hasPhoto: '',
      total: 0,
      columns,
      userList: [],
      totalList: [],
      searchList: {}
    }
  },
  methods: {
    ...mapActions('home', ['getHighStu']),
    changePage() {
      if (!this.chooseType) {
        this.getStudentList(false)
      } else {
        this.getStudentList(true)
      }
    },
    async getStudentList(type = false) {
      this.searchList.schoolCode = this.userInfo.schoolCode
      this.searchList.hasClass = '0'
      this.searchList.hasDorm = this.hasDorm
      this.searchList.userName = this.userName
      this.searchList.workNo = this.workNo
      this.searchList = Object.assign(this.searchList, this.pageList)
      const res = await this.getHighStu(this.searchList)
      this.userList = res.data.list.map(item => {
        return {
          ...item,
          id: type ? item.userCode : item.id
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
            gradeCode: item.gradeCode,
            gradeName: item.gradeName
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
      this.confirmLoading = true
      this.$emit('submit', this.totalList)
    },
    newStudent() {
      this.$emit('toAdd', true)
    },
    replace() {
      this.userName = ''
      this.workNo = ''
      this.hasDorm = ''
      this.getStudentList()
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
