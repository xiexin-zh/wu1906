<template>
  <div class="table-page page-layout qui-fx">
    <sub-form
      ref="form"
      @submit-form="submitForm"
      :title="formTitle"
      v-model="formStatus"
      :form-data="formData"
    >
      <template slot="selectPanel">
        <a-input
          placeholder="请选择"
          :read-only="true"
          @focus="showSelectPanel(true)"
          v-model="leaderMsg.teacherName"
        >
          <a-icon slot="suffix" type="right" />
        </a-input>
      </template>
      <template slot="selectPanel_group">
        <a-input
          placeholder="请选择"
          :read-only="true"
          @focus="showSelectPanel(false)"
          v-model="memberMsg.teacherName"
        >
          <a-icon slot="suffix" type="right" />
        </a-input>
      </template>
    </sub-form>
    <div class="qui-fx qui-fx-jsb" style="width: 100%">
      <div class="right qui-fx-ver qui-fx-f1" style="padding-right: 10px">
        <search-form isReset @search-form="searchForm" :search-label="searchLabel">
          <div slot="left">
            <a-button icon="plus" class="add-btn" @click="addTask('')">添加</a-button>
          </div>
        </search-form>
        <table-list is-zoom :page-list="pageList" :columns="columns" :table-list="groupList">
          <template v-slot:actions="action">
            <a-tooltip placement="topLeft" title="编辑">
              <a-button
                size="small"
                class="edit-action-btn"
                icon="form"
                @click.stop="addTask(action.record)"
              ></a-button>
            </a-tooltip>
            <a-popconfirm
              placement="left"
              okText="确定"
              cancelText="取消"
              @confirm="deleteList(action.record)"
            >
              <template slot="title"> 您确定删除吗? </template>
              <a-tooltip placement="topLeft" title="删除">
                <a-button size="small" class="del-action-btn" icon="delete"></a-button>
              </a-tooltip>
            </a-popconfirm>
          </template>
        </table-list>
        <page-num v-model="pageList" :total="total" @change-page="showList"></page-num>
      </div>
    </div>
    <teacher-panel
      :isRadio="isRadio"
      :isCheck="isCheck"
      title="选择教师"
      v-if="panelStatus"
      v-model="panelStatus"
      @submit="confirmSelect"
      :selectList="selectList"
    ></teacher-panel>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import TableList from '@c/TableList'
import PageNum from '@c/PageNum'
import SearchForm from '@c/SearchForm'
import SubForm from '../../component/SubForm'
import TeacherPanel from '../../component/TeacherPanel'
import Tools from '@/utils/tools'
const columns = [
  {
    title: '序号',
    width: '8%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '教研备课组名称',
    dataIndex: 'groupName',
    width: '15%'
  },
  {
    title: '小组长',
    dataIndex: 'leaderName',
    width: '10%'
  },
  {
    title: '小组成员',
    dataIndex: 'memberNameSet',
    width: '30%'
  },
  {
    title: '创建人',
    dataIndex: 'createUserName',
    width: '10%'
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: '15%',
    customRender: text => {
      return Tools.getDate(text, 5)
    }
  },
  {
    title: '操作',
    width: '10%',
    scopedSlots: {
      customRender: 'action'
    }
  }
]
const searchLabel = [
  {
    value: 'groupName',
    type: 'input',
    label: '教研备课组名称',
    placeholder: '请输入教研备课组名称'
  },
  {
    value: 'groupType',
    type: 'select',
    label: '小组类型',
    placeholder: '请选择',
    list: [
      { key: '1', val: '教研组' },
      { key: '2', val: '备课组' }
    ]
  },
  {
    value: 'leaderName',
    type: 'input',
    label: '小组长',
    placeholder: '请输入小组长姓名'
  },
  {
    value: 'memberName',
    type: 'input',
    label: '小组成员',
    placeholder: '请输入小组成员'
  }
]
const formData = [
  {
    value: 'groupName',
    initValue: '',
    type: 'input',
    max: 15,
    label: '教研组名称',
    placeholder: '请输入教研组名称(限15字内)'
  },
  {
    value: 'groupType',
    initValue: '',
    type: 'radio',
    label: '小组类型',
    placeholder: '请选择小组类型',
    list: [
      {
        key: '1',
        val: '教研组'
      },
      {
        key: '2',
        val: '备课组'
      }
    ]
  },
  {
    value: 'leader',
    initValue: 'leader',
    type: 'selectPanel',
    label: '小组长',
    readonly: true,
    placeholder: '请选择'
  },
  {
    value: 'member',
    initValue: 'member',
    type: 'selectPanel_group',
    label: '小组成员',
    readonly: true,
    placeholder: '请选择'
  }
]
export default {
  name: 'PracticeTask',
  components: {
    TableList,
    PageNum,
    SearchForm,
    SubForm,
    TeacherPanel
  },
  data() {
    return {
      formTitle: '添加',
      formStatus: false,
      formData,
      columns,
      searchLabel,
      total: 0,
      pageList: {
        page: 1,
        size: 20
      },
      groupList: [],
      searchObj: {},
      listId: '',
      panelStatus: false,
      isRadio: true,
      isCheck: false,
      selectList: [],
      selectList1: [],
      selectList2: [],
      leaderMsg: {
        userName: '',
        userId: '',
        userCode: ''
      },
      memberMsg: {
        userName: '',
        userId: '',
        userCode: ''
      }
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  created() {},
  mounted() {
    this.showList()
  },
  methods: {
    ...mapActions('home', ['getGroupList', 'addGroup', 'delGroup', 'editGroup']),
    // 搜索
    searchForm(values) {
      this.searchObj = values
      this.showList()
    },
    // 任务列表
    async showList(obj = {}) {
      const req = {
        ...this.pageList,
        ...this.searchObj,
        schoolCode: this.userInfo.schoolCode
      }
      const res = await this.getGroupList(req)
      if (!res.data.records) {
        this.groupList = []
        return
      }
      this.groupList = res.data.records
      this.total = res.data.total
    },
    // 删除按钮
    async deleteList(record) {
      await this.delGroup({ id: record.id })
      this.showList()
    },
    // 添加/编辑教研组按钮
    addTask(record) {
      this.formData = record ? this.$tools.fillForm(formData, record) : formData
      this.formTitle = record ? '编辑' : '添加'
      this.listId = record.id || ''
      if (record) {
        this.leaderMsg = {
          teacherName: record.leaderName,
          userId: '',
          userCode: record.leaderCode
        }
        this.memberMsg = {
          teacherName: record.memberList.map(item => item.userName).join(','),
          userId: '',
          userCode: record.memberList.map(item => item.userCode).join(',')
        }
        this.memberList = record.memberList
      } else {
        this.leaderMsg = this.memberMsg = {
          teacherName: '',
          userId: '',
          userCode: ''
        }
        this.memberList = []
      }
      this.formStatus = true
    },
    showSelectPanel(val) {
      this.isRadio = val
      this.isCheck = !val
      this.selectList = val ? this.selectList1 : this.selectList2
      this.panelStatus = true
    },
    confirmSelect(msgObj) {
      this.panelStatus = false
      if (this.isRadio) {
        const { userName, id, userCode } = msgObj
        this.leaderMsg = {
          teacherName: userName || '',
          userId: id,
          userCode: userCode
        }
        this.selectList1 = [id]
      } else {
        this.memberMsg = {
          teacherName: msgObj.map(item => item.userName).join(','),
          userId: msgObj.map(item => item.id).join(','),
          userCode: msgObj.map(item => item.userCode).join(',')
        }
        this.memberList = msgObj
        this.selectList2 = msgObj.map(item => item.id)
      }
    },
    // 提交保存
    async submitForm(values) {
      if (!this.leaderMsg.userCode) {
        this.$message.error('请选择小组长')
        return
      }
      if (!this.memberMsg.userCode) {
        this.$message.error('请选择小组成员')
        return
      }
      const req = {
        ...values,
        createUserName: this.userInfo.userName,
        schoolCode: this.userInfo.schoolCode,
        leaderCode: this.leaderMsg.userCode,
        leaderName: this.leaderMsg.teacherName,
        memberList: this.memberList.map(item => {
          return {
            userName: item.userName,
            userCode: item.userCode
          }
        })
      }
      if (this.listId) {
        req.id = this.listId
        delete req.createUserName
        delete req.schoolCode
      }
      const res = this.listId ? await this.editGroup(req) : await this.addGroup(req)
      if (res && res.code === 200) {
        this.formStatus = false
        this.showList()
      }
    }
  }
}
</script>
<style lang="less" scoped>
.table-page {
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
.modal {
  padding: 0 40px;
  .line {
    margin-bottom: 20px;
  }
  .title {
    font-size: 14px;
    font-weight: bold;
    margin-right: 20px;
    min-width: 70px;
  }
  .download {
    color: #6882da;
    cursor: pointer;
  }
  /deep/ .ant-upload-list-item-info {
    padding: 0 22px 0 4px;
  }
}
</style>
