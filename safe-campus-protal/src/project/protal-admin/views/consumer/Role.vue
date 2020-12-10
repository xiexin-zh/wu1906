<template>
  <div class="page-layout qui-fx-ver">
    <submit-form ref="form" @submit-form="submitForm" :title="title" v-model="formStatus" :form-data="formData"></submit-form>
    <div class="top-btn-group">
      <a-button icon="plus" class="add-btn" @click="addApp(0)">新增角色</a-button>
    </div>
    <table-list
      is-zoom
      :page-list="pageList"
      v-model="chooseList"
      :columns="columns"
      :table-list="userList">
      <template v-slot:totalNums="totalNum">
        <div class="table-total-num num-cursor" @click.stop="roleDetial('/role/list',totalNum)">{{ totalNum.record.userSum }}</div>
      </template>
      <template v-slot:actions="action">
        <a-tooltip placement="topLeft" title="菜单权限">
          <a-button size="small" class="power-action-btn" icon="lock" @click.stop="showDrawer(action)"></a-button>
        </a-tooltip>
        <a-tooltip placement="topLeft" title="员工列表">
          <a-button size="small" class="detail-action-btn" icon="team" @click.stop="roleDetial('/role/list',action)"></a-button>
        </a-tooltip>
        <a-tooltip placement="topLeft" title="编辑">
          <a-button size="small" class="edit-action-btn" icon="form" @click.stop="addApp(1, action)"></a-button>
        </a-tooltip>
        <a-popconfirm placement="left" okText="确定" cancelText="取消" @confirm="delClick(action)">
          <template slot="title">
            您确定删除吗?
          </template>
          <a-tooltip placement="topLeft" title="删除">
            <a-button size="small" class="del-action-btn" icon="delete"></a-button>
          </a-tooltip>
        </a-popconfirm>
      </template>
    </table-list>
    <page-num v-model="pageList" :total="total" @change-page="showList"></page-num>
    <menu-drawer ref="menuDrawer" :roleInfo="roleInfo" :visible="visible" @update="onClose"></menu-drawer>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import TableList from '@c/TableList'
import Tools from '@u/tools'
import PageNum from '@c/PageNum'
import SubmitForm from '@c/SubmitForm'
import MenuDrawer from './MenuDrawer'
const columns = [
  {
    title: '序号',
    width: '8%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '角色名称',
    dataIndex: 'name',
    width: '15%'
  },
  {
    title: '关联员工数',
    width: '15%',
    scopedSlots: {
      customRender: 'totalNum'
    }
  },
  {
    title: '备注',
    dataIndex: 'remark',
    width: '20%'
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: '15%',
    customRender: (text) => {
      return Tools.getDate(text).substring(0, 10)
    }
  },
  {
    title: '操作',
    width: '25%',
    scopedSlots: {
      customRender: 'action'
    }
  }
]
const formData = [
  {
    value: 'name',
    initValue: '',
    type: 'input',
    label: '角色名称',
    placeholder: '请输入角色名称'
  },
  {
    value: 'remark',
    initValue: '',
    type: 'input',
    label: '备注',
    placeholder: '请输入备注',
    required: false // 默认为true，不用填写
  }
]
export default {
  name: 'Role',
  components: {
    TableList,
    PageNum,
    SubmitForm,
    MenuDrawer
  },
  data () {
    return {
      fileList: [],
      title: '新增角色',
      formStatus: false,
      formData,
      chooseList: [],
      columns,
      total: 0,
      pageList: {
        page: 1,
        size: 20
      },
      userList: [],
      visible: false,
      roleId: '',
      searchValue: '',
      roleInfo: {}
    }
  },
  computed: {
    ...mapState('home', ['schoolCode'])
  },
  mounted () {
    this.showList()
  },
  methods: {
    ...mapActions('home', [
      'getRole', 'delRole', 'addRole', 'updateRole'
    ]),
    showDrawer (record) {
      this.roleInfo = record.record
      this.visible = true
    },
    onClose () {
      this.visible = false
      this.$refs.menuDrawer.searchValue = ''
      this.$refs.menuDrawer.nodeList = []
    },
    async submitForm (values) {
      values.schoolCode = this.schoolCode
      try {
        if (this.title === '编辑角色') {
          values.id = this.roleId
          await this.updateRole(values)
        } else {
          await this.addRole(values)
        }
        this.$message.success('操作成功')
        this.$tools.goNext(() => {
          this.$refs.form.reset()
          this.showList()
        })
      } catch (err) {
        this.$refs.form.error()
      }
    },
    addApp (type, record) {
      this.formStatus = true
      if (type) {
        this.title = '编辑角色'
        this.formData = this.$tools.fillForm(formData, record.record)
        this.roleId = record.record.id
      } else {
        this.title = '新增角色'
        this.formData = formData
      }
    },
    delClick (record) {
      this.delRole(record.record.id).then(res => {
        this.$message.success('删除成功')
        this.$tools.goNext(() => {
          this.showList()
        })
      })
    },
    async showList () {
      this.pageList.schoolCode = this.schoolCode
      const res = await this.getRole(this.pageList)
      this.userList = res.data.list
      this.total = res.data.total
    },
    roleDetial (path, record) {
      this.$router.push({
        path: path,
        query: {
          id: record.record.id
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.num-cursor{
  cursor: pointer;
}
</style>
