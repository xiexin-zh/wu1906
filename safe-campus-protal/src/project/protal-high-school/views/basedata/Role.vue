<template>
  <div class="role page-layout qui-fx-ver">
    <submit-form ref="form" @submit-form="submitForm" :title="title" v-model="formStatus" :form-data="formData">
    </submit-form>
    <menu-drawer v-if="visible" :title="menutitle" :visible="visible" @close="onClose" :menu-data="menuData">
    </menu-drawer>
    <no-data msg="添加角色后，您可以开始管理角色的权限范围。" v-if="false">
      <div slot="btn">
        <a-button type="primary" @click="addRole(0)"> <a-icon type="plus" />添加角色</a-button>
      </div>
    </no-data>
    <div v-else class="qui-fx qui-fx-ver qui-fx-f1">
      <div class="top-btn-group qui-fx">
        <a-button type="primary" @click="addRole(0)"> <a-icon type="plus" />添加角色</a-button>
      </div>
      <table-list
        :page-list="pageList"
        :columns="columns"
        :table-list="roleList">
        <template v-slot:totalNums="totalNum">
          <div class="table-total-num" @click.stop="goImpower('/basedata/roleImpower',totalNum.record)">{{ totalNum.record.userSum }}</div>
        </template>
        <template v-slot:actions="action">
          <a-tooltip placement="topLeft" title="菜单权限">
            <a-button size="small" class="power-action-btn" icon="lock" @click.stop="menuPower(action.record)"></a-button>
          </a-tooltip>
          <a-tooltip placement="topLeft" title="授权用户">
            <a-button size="small" class="user-action-btn" icon="team" @click.stop="goImpower('/basedata/roleImpower',action.record)"></a-button>
          </a-tooltip>
          <a-tooltip placement="topLeft" title="编辑">
            <a-button size="small" class="edit-action-btn" icon="form" @click.stop="addRole(1, action.record)"></a-button>
          </a-tooltip>
          <a-popconfirm placement="left" okText="确定" cancelText="取消" @confirm="deleteRole(action.record)">
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
    </div>
  </div>
</template>

<script>

import { mapState, mapActions } from 'vuex'
import TableList from '@c/TableList'
import PageNum from '@c/PageNum'
import SubmitForm from '@c/SubmitForm'
import menuDrawer from '../components/drawer'
import NoData from '@c/NoData'
import Tools from '@u/tools'

const columns = [
  {
    title: '序号',
    width: '10%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '角色名称',
    dataIndex: 'name',
    width: '10%'
  },
  {
    title: '授权用户数',
    width: '10%',
    scopedSlots: {
      customRender: 'totalNum'
    }
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: '20%',
    customRender: (text) => {
      return Tools.getDate(text).substring(0, 10)
    }
  },
  {
    title: '备注',
    dataIndex: 'remark',
    width: '20%'
  },
  {
    title: '操作',
    width: '30%',
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
    required: false,
    label: '备注',
    placeholder: '请输入备注'
  }
]

export default {
  name: 'Role',
  components: {
    NoData,
    TableList,
    PageNum,
    SubmitForm,
    menuDrawer
  },
  data () {
    return {
      title: '添加角色',
      menutitle: '菜单权限',
      formStatus: false,
      visible: false,
      formData,
      menuData: {},
      columns,
      type: 0,
      id: '',
      total: 0,
      pageList: {
        page: 1,
        size: 20
      },
      roleList: []
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },

  mounted () {
    this.showList()
  },
  methods: {
    ...mapActions('home', [
      'getRoleList', 'addRoleManage', 'editRoleManage', 'deleteRoleManage'
    ]),
    async submitForm (values) {
      console.log(values)
      const req = {
        ...values,
        ...this.userInfo
      }
      let res
      if (this.type) {
        req.id = this.id
        res = this.editRoleManage(req)
      } else {
        res = this.addRoleManage(req)
      }
      res.then(() => {
        const msg = this.type ? '编辑成功' : '添加成功'
        this.$message.success(msg)
        this.$tools.goNext(() => {
          this.showList()
          this.$refs.form.reset()
        })
      }).catch(() => {
        this.$refs.form.error()
      })
    },
    addRole (type, record) {
      this.formStatus = true
      if (type === 1) {
        this.title = '编辑角色'
        this.type = 1
        this.id = record.id
        this.formData = this.$tools.fillForm(formData, record)
      } else {
        this.type = 0
        this.title = '添加角色'
        this.formData = formData
      }
    },
    // 菜单权限
    menuPower (action) {
      console.log(action)
      this.menuData = action
      this.visible = true
    },
    onClose () {
      this.visible = false
      this.searchValue = ''
      this.expandedKeys = ['0-0']
    },
    async deleteRole (record) {
      await this.deleteRoleManage(record.id)
      this.$message.success('删除成功')
      this.$tools.goNext(() => {
        this.showList()
      })
    },
    async showList () {
      const req = {
        ...this.pageList,
        ...this.userInfo
      }
      const res = await this.getRoleList(req)
      if (!res.data) {
        this.roleList = []
        return
      }
      this.roleList = res.data.list
      this.total = res.data.total
    },
    clickRow (id) {
      console.log(id)
    },
    // 授权用户
    goImpower (path, record) {
      this.$router.push({ path, query: { id: record.id, name: record.name } })
    }
  }
}
</script>
<style lang="less" scoped>
.role{
  background: #fff;
  height: 100%;
  .top-btn-group{
    background: #f0f2f5;
  }
  .table-total-num{
    cursor: pointer;
  }
  .action{
    div{
      cursor: pointer;
      margin: 4px 20px 0 0;
      img{
        width: 20px;
        height: 20px;
      }
      span{
        font-size:12px;
      }
    }
  }
}
</style>
