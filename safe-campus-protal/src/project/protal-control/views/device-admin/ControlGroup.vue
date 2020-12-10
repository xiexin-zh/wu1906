<template>
  <div class="device-list page-layout qui-fx-ver">
    <submit-form ref="form" @submit-form="submitForm" :title="title" v-model="formStatus" :form-data="formData">
    </submit-form>
    <search-form is-reset @search-form="searchForm" :search-label="searchLabel">
      <div slot="left">
        <a-button type="primary" icon="plus" @click="addControlGroup(false, '新增控制组')">新增控制组</a-button>
      </div>
      <div slot="right">
      </div>
    </search-form>
    <table-list
      :page-list="pageList"
      :columns="controlGroupColumns"
      :table-list="controlGroupList">
      <template v-slot:actions="action">
        <a-tooltip placement="topLeft" title="详情">
          <a-button @click="goDetail(action.record)" size="small" class="detail-action-btn" icon="ellipsis"></a-button>
        </a-tooltip>
        <a-tooltip placement="topLeft" title="编辑">
          <a-button @click="addControlGroup(true, '编辑控制组', action.record)" size="small" class="edit-action-btn" icon="form"></a-button>
        </a-tooltip>
        <a-popconfirm placement="left" okText="确定" cancelText="取消" @confirm="delControlList(action)">
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
import { mapState, mapActions } from 'vuex'
import SearchForm from '@c/SearchForm'
import SubmitForm from '@c/SubmitForm'
import TableList from '@c/TableList'
import PageNum from '@c/PageNum'
import controlGroupColumns from '../../assets/js/table/controlGroupColumns'
const searchLabel = [
  {
    value: 'controlGroupName',
    type: 'input',
    label: '控制组名称',
    placeholder: '请输入控制组名称'
  },
  {
    list: [
      {
        key: '',
        val: '全部'
      },
      {
        key: 1,
        val: '进控制组'
      },
      {
        key: 2,
        val: '出控制组'
      },
      {
        key: 3,
        val: '数据采集控制组'
      }
    ],
    value: 'controlGroupType',
    type: 'select',
    label: '类型'
  }
  // {
  //   list: [
  //     {
  //       key: '',
  //       val: '全部'
  //     },
  //     {
  //       key: 1,
  //       val: '启用'
  //     },
  //     {
  //       key: 2,
  //       val: '禁用'
  //     }
  //   ],
  //   value: 'status',
  //   type: 'select',
  //   label: '状态'
  // }
]
const formData = [
  {
    value: 'controlGroupName',
    initValue: '',
    type: 'input',
    label: '控制组名称',
    placeholder: '请输入控制组名称'
  },
  {
    value: 'controlGroupType',
    initValue: [],
    list: [
      {
        key: 1,
        val: '进控制组'
      },
      {
        key: 2,
        val: '出控制组'
      },
      {
        key: 3,
        val: '数据采集控制组'
      }
    ],
    type: 'select',
    label: '控制组类型',
    placeholder: '请选择控制组类型'
  },
  {
    value: 'remarks',
    initValue: '',
    required: false,
    type: 'input',
    label: '备注',
    placeholder: '请输入备注'
  }
]
export default {
  name: 'ControlGroup',
  components: {
    SearchForm,
    TableList,
    PageNum,
    SubmitForm
  },
  computed: {
    ...mapState('home', [
      'schoolCode'
    ])
  },
  data () {
    return {
      title: '',
      total: 0,
      searchLabel,
      formStatus: false,
      formData,
      controlGroupColumns,
      searchText: {
        controlGroupName: '',
        controlGroupType: ''
      },
      pageList: {
        page: 1,
        size: 20
      },
      controlGroupList: []
    }
  },
  mounted () {
    this.showList()
  },
  methods: {
    ...mapActions('home', [
      'getControlGroupList',
      'addContrlGroup',
      'updateControlGroup',
      'delControlGroup'
    ]),
    goDetail ({ id }) {
      this.$router.push({
        path: '/controlGroup/controlDetail',
        query: {
          id
        }
      })
    },
    async showList () {
      const res = await this.getControlGroupList({
        schoolCode: this.schoolCode,
        ...this.pageList,
        ...this.searchText
      })
      this.controlGroupList = res.data.list
      this.total = res.data.total
    },
    addControlGroup (type, title, record) {
      this.title = title
      this.isEdit = type
      if (type) {
        this.id = record.id
        this.controlGroupCode = record.controlGroupCode
        this.formData = this.$tools.fillForm(formData, record)
      } else {
        this.formData = formData
      }
      this.formStatus = true
    },
    async submitForm (values) {
      try {
        if (this.isEdit) {
          await this.updateControlGroup({
            id: this.id,
            controlGroupCode: this.controlGroupCode,
            schoolCode: this.schoolCode,
            ...values
          })
        } else {
          await this.addContrlGroup({
            schoolCode: this.schoolCode,
            ...values
          })
        }
        this.$refs.form.reset()
        this.$message.success('操作成功')
        this.$tools.goNext(() => {
          this.showList()
        })
      } catch (err) {
        this.$refs.form.error()
      }
    },
    async delControlList (action) {
      await this.delControlGroup({
        id: action.record.id
      })
      this.$message.success('删除成功')
      this.$tools.goNext(() => {
        this.showList()
      })
    },
    searchForm (values) {
      this.searchText = values
      this.showList()
    }
  }
}
</script>

<style lang="less" scoped>
</style>
