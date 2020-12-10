<template>
  <div class="page-layout qui-fx-ver">
    <submit-form ref="form" @submit-form="submitForm" :title="title" v-model="formStatus" :form-data="formData"></submit-form>
    <div class="top-btn-group">
      <a-button icon="plus" class="add-btn" @click="addApp(0)">添加学科</a-button>
    </div>
    <table-list
      is-zoom
      :page-list="pageList"
      :columns="columns"
      :table-list="subList">
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
import TableList from '@c/TableList'
import PageNum from '@c/PageNum'
import SubmitForm from '@c/SubmitForm'
const columns = [
  {
    title: '序号',
    width: '25%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '学科名称',
    dataIndex: 'dictionaryName',
    width: '25%'
  },
  {
    title: '备注',
    dataIndex: 'remarks',
    width: '25%'
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
    value: 'dictionaryName',
    initValue: '',
    type: 'input',
    label: '学科名称',
    placeholder: '请输入学科名称'
  },
  {
    value: 'remarks',
    initValue: '',
    type: 'input',
    label: '备注',
    placeholder: '请输入备注',
    required: false
  }
]
export default {
  name: 'Subject',
  components: {
    TableList,
    PageNum,
    SubmitForm
  },
  data () {
    return {
      title: '添加学科',
      formStatus: false,
      formData,
      columns,
      total: 0,
      pageList: {
        page: 1,
        size: 20
      },
      subList: [],
      subId: ''
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
      'getSubject', 'delSubject', 'addSubject', 'updateSubject'
    ]),
    async submitForm (values) {
      values.categoryCode = 'SUBJECT'
      // values.dictionaryValue = Math.random().toString(36).slice(-10)
      try {
        if (this.title === '编辑学科') {
          values.id = this.subId
          await this.updateSubject(values)
        } else {
          await this.addSubject(values)
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
        this.title = '编辑学科'
        this.formData = this.$tools.fillForm(formData, record.record)
        this.subId = record.record.id
      } else {
        this.title = '添加学科'
        this.formData = formData
      }
    },
    delClick (record) {
      this.delSubject({ id: record.record.id }).then(res => {
        this.$message.success('删除成功')
        this.$tools.goNext(() => {
          this.showList()
        })
      })
    },
    async showList () {
      const req = {
        categoryCode: 'SUBJECT',
        pageNum: this.pageList.page,
        pageSize: this.pageList.size
      }
      const res = await this.getSubject(req)
      this.subList = res.data.list
      this.total = res.data.total
    }
  }
}
</script>
<style lang="less" scoped>
.num-cursor{
  cursor: pointer;
}
</style>
