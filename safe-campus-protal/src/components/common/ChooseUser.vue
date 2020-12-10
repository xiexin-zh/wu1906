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
    <a-row type="flex" justify="end" style="margin-bottom: 15px; margin-right: 215px">
      <a-col>
        <span>姓名/工号：</span>
        <a-input v-model="keyword" style="width: 120px;margin-right: 10px" placeholder="请输入姓名" />
        <span>是否有人脸：</span>
        <a-select v-model="hasPhoto" style="width: 120px; margin-right: 10px">
          <a-select-option value>全部</a-select-option>
          <a-select-option :value="1">是</a-select-option>
          <a-select-option :value="0">否</a-select-option>
        </a-select>
        <a-button type="primary" @click="getUserList(chooseType !== '')">查询</a-button>
      </a-col>
    </a-row>
    <div class="choose-user qui-fx">
      <div class="org-box">
        <org-tree @select="select" @defaultCode="defaultCode" :type="type"></org-tree>
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
          @change-page="changePage"
        ></page-num>
      </div>
      <div class="user-box qui-fx-ver" v-show="isTotal">
        <div class="title qui-fx-jsb">
          <span>已选择</span>
          <span>{{ totalList.length }}人</span>
        </div>
        <div class="qui-fx-f1" style="overflow: auto">
          <ul style="padding-left:0">
            <li v-for="(item, index) in totalList" :key="item.id" class="qui-fx-jsb">
              <span>{{ item.userName }}</span>
              <a-tag @click="delUser(item.id, index)" color="#f50">删除</a-tag>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </a-modal>
</template>

<script>
import PageNum from './PageNum'
import TableList from './TableList'
import OrgTree from './OrgTree'
import $ajax from '@u/ajax-serve'
import { mapState } from 'vuex'
import hostEnv from '@config/host-env'
const columns = [
  {
    title: '序号',
    width: '20%',
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
    title: '手机号',
    dataIndex: 'mobile',
    width: '30%'
  },
  {
    title: '工号',
    dataIndex: 'workNo',
    width: '30%'
  }
]
export default {
  name: 'ChooseUser',
  components: {
    PageNum,
    TableList,
    OrgTree
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
    // 选择人员业务类型
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
      code: ''
    }
  },
  created() {
    this.code = this.type === 'edu' ? this.eduCode : this.schoolCode
  },
  async mounted() {
    if (this.chooseType === 'attendance') {
      const res = await $ajax.get({
        url: `${hostEnv.protal_api_11004}/attendance/group/bind/user/query`,
        params: {
          attendanceUserId: this.bindObj.id
        }
      })
      const users = res.data
      users.forEach(item => {
        this.chooseList.push(item.userCode)
        this.totalList.push({
          userCode: item.userCode,
          userName: item.userName,
          id: item.userCode
        })
      })
      this.getUserList(true)
    } else if (this.chooseType === 'door') {
      const res = await $ajax.post({
        url: `${hostEnv.protal_api_10162}/setting/rule/user/list`,
        params: {
          pageNum: 1,
          pageSize: 5000,
          ruleGroupCode: this.bindObj.ruleGroupCode,
          schoolCode: this.bindObj.schoolCode,
          userGroupCode: this.bindObj.userGroupCode
        }
      })
      const users = res.data.list
      users.forEach(item => {
        this.chooseList.push(item.userCode)
        this.totalList.push({
          id: item.userCode,
          userCode: item.userCode,
          userName: item.userName
        })
      })
      this.getUserList(true)
    } else if (this.chooseType === 'organize') {
      const res = await $ajax.get({
        url: `${hostEnv.protal_api_11002}/userjob/query/by/schoolcode/and/jobcode`,
        params: {
          pageNum: 1,
          pageSize: 5000,
          schoolCode: this.bindObj.eduCode,
          jobCode: this.bindObj.jobCode
        }
      })
      const users = res.data
      users.forEach(item => {
        this.chooseList.push(item.userCode)
        this.totalList.push({
          id: item.userCode,
          userCode: item.userCode,
          userName: item.userName
        })
      })
      this.getUserList(true)
    } else if (this.chooseType === 'school') {
      const res = await $ajax.get({
        url: `${hostEnv.protal_api_11002}/userjob/query/by/schoolcode/and/jobcode`,
        params: {
          pageNum: 1,
          pageSize: 5000,
          schoolCode: this.bindObj.schoolCode,
          jobCode: this.bindObj.jobCode
        }
      })
      const users = res.data
      users.forEach(item => {
        this.chooseList.push(item.userCode)
        this.totalList.push({
          id: item.userCode,
          userCode: item.userCode,
          userName: item.userName
        })
      })
      this.getUserList(true)
    } else if (this.chooseType === 'dorm') {
      const res = await $ajax.postJsonQuery({
        url: `${hostEnv.protal_api_11006}/dorm/staff/building/list`,
        params: {
          page: 1,
          size: 5000,
          buildingCode: this.bindObj.buildingCode,
          schoolCode: this.bindObj.schoolCode
        }
      })
      const users = res.data.list
      users.forEach(item => {
        this.chooseList.push(item.staffCode)
        this.totalList.push({
          id: item.id,
          userCode: item.staffCode,
          userName: item.staffName
        })
      })
      this.getUserList(true)
    } else if (this.chooseType === 'ncov') {
      this.pageList.size = 5000
      const res = await $ajax.get({
        url: `${hostEnv.protal_api_11005}/epidemic/group/bind/user/query`,
        params: {
          groupCode: this.bindObj.groupCode
        }
      })
      const users = res.data
      users.forEach(item => {
        this.chooseList.push(item.userCode)
        this.totalList.push({
          id: item.userCode,
          userCode: item.userCode,
          userName: item.userName
        })
      })
      this.getUserList(true)
    } else if (this.chooseType === 'common') {
      this.teacherList.forEach(item => {
        this.chooseList.push(item.userCode || item.key)
        this.totalList.push({
          id: item.userCode || item.key,
          userCode: item.userCode || item.key,
          userName: item.userName || item.label
        })
      })
      this.getUserList(true)
    } else if (this.chooseType === 'class') {
      const res = await $ajax.get({
        url: `${hostEnv.protal_api_11012}/appraise/item/user/list/${this.bindObj.groupCode}`
      })
      const users = res.data
      users.forEach(item => {
        this.chooseList.push(item.userCode)
        this.totalList.push({
          id: item.userCode,
          userCode: item.userCode,
          userName: item.userName
        })
      })
      this.getUserList(true)
    } else if (this.chooseType === 'role') {
      // 基础数据角色管理
      const res = await $ajax.post({
        url: `${hostEnv.protal_api_10060}/role/manage/user/list`,
        params: {
          page: 1,
          size: 5000,
          schoolCode: this.bindObj.schoolCode,
          roleId: this.bindObj.roleId
        }
      })
      const users = res.data ? res.data.list : []
      users.forEach(item => {
        this.chooseList.push(item.id)
        this.totalList.push({
          id: item.id,
          userCode: item.userCode,
          userName: item.userName
        })
      })
      this.getUserList(true)
    } else {
      this.getUserList()
    }
    this.managerList.forEach(item => {
      this.chooseList.push(item.userCode)
      this.totalList.push({
        ...item,
        id: item.userCode
      })
    })
  },
  methods: {
    /**
     * @description 门禁已绑定人查询
     */
    doorBindUser(page) {},
    changePage() {
      if (!this.chooseType) {
        this.getUserList(false)
      } else {
        this.getUserList(true)
      }
    },
    async getUserList(type = false) {
      console.log(33)
      const res = await $ajax.post({
        url: `${hostEnv.protal_api_11002}/userinfo/teacher/user/queryTeacherInfo`,
        params: {
          orgCode: this.orgCode,
          keyword: this.keyword,
          hasPhoto: this.hasPhoto,
          schoolCode: this.code,
          ...this.pageList
        }
      })
      this.userList = res.data.list.map(item => {
        let id = item.id
        if (type) id = item.userCode
        if (type && (this.chooseType === 'rule' || this.chooseType === 'role')) {
          id = item.id
        }
        return {
          ...item,
          id
        }
      })
      this.total = res.data.total
    },
    defaultCode(item) {
      this.orgCode = item.code[0]
    },
    select(item) {
      this.pageList.page = 1
      this.orgCode = item.code
      if (this.chooseType) {
        this.getUserList(true)
      } else {
        this.getUserList()
      }
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
