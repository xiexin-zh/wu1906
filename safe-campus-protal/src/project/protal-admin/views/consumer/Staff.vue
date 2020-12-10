<template>
  <div class="page-layout qui-fx-ver">
    <submit-form ref="form" @submit-form="submitForm" :title="title" v-model="formStatus" :form-data="formData"></submit-form>
    <search-form is-reset @search-form="searchForm" :search-label="searchLabel">
      <div slot="left">
        <a-button icon="plus" type="primary" @click="addApp(0)">新增员工</a-button>
      </div>
    </search-form>
    <table-list
      is-zoom
      :page-list="pageList"
      v-model="chooseList"
      :columns="columns"
      :table-list="userList">
      <template v-slot:actions="action">
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
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import Tools from '@u/tools'
import TableList from '@c/TableList'
import PageNum from '@c/PageNum'
import SubmitForm from '@c/SubmitForm'
import SearchForm from '@c/SearchForm'
const searchLabel = [
  {
    value: 'userName',
    type: 'input',
    label: '姓名',
    placeholder: '请输入姓名'
  },
  {
    value: 'mobile',
    type: 'input',
    label: '手机号',
    placeholder: '请输入手机号'
  }
]
const columns = [
  {
    title: '序号',
    width: '8%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '员工姓名',
    dataIndex: 'userName',
    width: '15%'
  },
  {
    title: '手机号',
    dataIndex: 'mobile',
    width: '15%'
  },
  {
    title: '角色',
    dataIndex: 'roleNames',
    width: '15%',
    customRender: (text) => {
      return text.length > 0 ? text.join(',') : ''
    }
  },
  {
    title: '备注',
    dataIndex: 'remark',
    width: '15%'
  },
  {
    title: '注册日期',
    dataIndex: 'createTime',
    width: '15%',
    customRender: (text) => {
      return Tools.getDate(text).substring(0, 10)
    }
  },
  {
    title: '操作',
    width: '15%',
    scopedSlots: {
      customRender: 'action'
    }
  }
]
const formData = [
  {
    value: 'userName',
    initValue: '',
    type: 'input',
    label: '员工姓名',
    placeholder: '请输入员工姓名'
  },
  {
    value: 'mobile',
    initValue: '',
    type: 'input',
    label: '员工手机号',
    placeholder: '请输入员工手机号',
    regular: 'phone'
  },
  {
    value: 'roleId',
    initValue: [],
    list: [
      {
        key: 1,
        val: '管理员'
      },
      {
        key: 2,
        val: '运营人员'
      },
      {
        key: 3,
        val: '运维人员'
      }
    ],
    type: 'select',
    label: '角色',
    placeholder: '请选择角色'
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
  name: 'Staff',
  components: {
    TableList,
    PageNum,
    SubmitForm,
    SearchForm
  },
  data () {
    return {
      searchLabel,
      title: '新增员工',
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
      staffId: ''
    }
  },
  computed: {
    ...mapState('home', [
      'schoolCode'
    ])
  },
  mounted () {
    this.showList()
    this.roleList()
  },
  methods: {
    ...mapActions('home', [
      'getStaff', 'delStaff', 'addStaff', 'getRole', 'updateStaff'
    ]),
    searchForm (values) {
      this.pageList = Object.assign(this.pageList, values)
      this.showList()
    },
    async roleList () {
      const res = await this.getRole({ schoolCode: this.schoolCode })
      if (res.data.list === 0) return
      const data = res.data.list.map(el => {
        return {
          key: el.id,
          val: el.name
        }
      })
      this.formData[2].list = data
    },
    async submitForm (values) {
      try {
        if (this.title === '编辑员工') {
          values.userId = this.staffId
          await this.updateStaff(values)
        } else {
          await this.addStaff(values)
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
        this.title = '编辑员工'
        this.staffId = record.record.userId
        record.record.roleId = record.record.roleIds[0]
        this.formData = this.$tools.fillForm(formData, record.record)
      } else {
        this.title = '新增员工'
        this.formData = formData
      }
    },
    async showList () {
      const res = await this.getStaff(this.pageList)
      if (res.data.list.length !== 0) {
        this.userList = res.data.list.map(item => this.filterUser(item))
      } else {
        this.userList = []
      }
      this.total = res.data.total
    },
    filterUser (data) {
      return {
        ...data,
        id: data.userId
      }
    },
    delClick (record) {
      this.delStaff({ userId: record.record.userId }).then(res => {
        this.$message.success('删除成功')
        this.$tools.goNext(() => {
          this.showList()
        })
      })
    }
  }
}
</script>
<style lang="less" scoped>
</style>
