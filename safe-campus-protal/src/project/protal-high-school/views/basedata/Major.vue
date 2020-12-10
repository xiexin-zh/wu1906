<template>
  <div class="subject page-layout qui-fx">
    <submit-form
      ref="form"
      @submit-form="submitForm"
      :title="title"
      v-model="formStatus"
      :form-data="type === '2' ? 'formDatas' : formData"
    ></submit-form>
    <div class="qui-fx-ver qui-fx-f1">
      <search-form is-reset @search-form="searchForm" :search-label="searchLabel">
        <div slot="left">
          <a-button icon="plus" class="add-btn" @click="addSubject(0)">添加</a-button>
          <a-button icon="export" class="export-all-btn" @click.stop="addSubject(2)">批量添加</a-button>
          <a-button icon="delete" class="del-btn" @click.stop="dels">批量删除</a-button>
        </div>
      </search-form>
      <table-list
        is-check
        :columns="columns"
        :table-list="subjectList"
        :page-list="pageList"
        v-model="chooseList">
        <template v-slot:actions="action">
          <a-tooltip placement="topLeft" title="编辑">
            <a-button
              size="small"
              class="edit-action-btn"
              icon="form"
              @click.stop="addSubject(1, action.record)"
            ></a-button>
          </a-tooltip>
          <a-popconfirm
            placement="left"
            okText="确定"
            cancelText="取消"
            @confirm="del(action.record)"
          >
            <template slot="title">确定删除该专业吗?</template>
            <a-tooltip placement="topLeft" title="删除">
              <a-button size="small" class="del-action-btn" icon="delete"></a-button>
            </a-tooltip>
          </a-popconfirm>
        </template>
      </table-list>
      <page-num v-model="pageList" :total="total" @change-page="_getSubjectList"></page-num>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import TableList from '@c/TableList'
import SubmitForm from '@c/SubmitForm'
import SearchForm from '@c/SearchForm'
import PageNum from '@c/PageNum'
const searchLabel = [
  {
    value: 'subjectName',
    type: 'input',
    label: '专业名称',
    placeholder: '请输入'
  }
]
const columns = [
  {
    title: '序号',
    dataIndex: 'index',
    scopedSlots: {
      customRender: 'index'
    },
    width: '20%'
  },
  {
    title: '专业',
    dataIndex: 'subjectName',
    width: '40%'
  },
  {
    title: '操作',
    width: '40%',
    scopedSlots: {
      customRender: 'action'
    }
  }
]
const formData = [
  {
    value: 'subjectName',
    initValue: '',
    type: 'input',
    label: '专业名称',
    max: 10,
    placeholder: '请输入专业名称'
  }
]
const formDatas = [
  {
    value: 'subjectNames',
    initValue: '',
    type: 'textarea',
    label: '专业名称',
    placeholder: '请输入专业名称，如有多个请换行',
    minRows: 6,
    maxRows: 20,
    show: true
  }
]
export default {
  name: 'Major',
  components: {
    TableList,
    SubmitForm,
    SearchForm,
    PageNum
  },
  data() {
    return {
      columns,
      formData,
      formDatas,
      formStatus: false,
      title: '添加专业',
      subjectList: [],
      type: 0,
      id: '',
      searchLabel,
      pageList: {
        page: 1,
        size: 20
      },
      chooseList: [],
      searchList: {},
      total: 0
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  mounted() {
    this._getSubjectList()
  },
  methods: {
    ...mapActions('home', ['addHighSub', 'updateHighSub', 'getHighSub', 'delHighSub', 'delHighSubs', 'addHighSubs']),
    async _getSubjectList() {
      this.searchList.schoolCode = this.userInfo.schoolCode
      this.searchList = Object.assign(this.searchList, this.pageList)
      const res = await this.getHighSub(this.searchList)
      this.subjectList = res.data.records
      this.total = res.data.total
    },
    addSubject(type, record) {
      this.type = type
      this.formStatus = true
      if (type === 1) {
        this.title = '编辑专业'
        this.formData = this.$tools.fillForm(formData, record)
        this.id = record.id
      } else {
        if (type === 2) {
          this.formData = formDatas
        } else {
          this.formData = formData
        }
        this.title = '添加专业'
      }
    },
    searchForm(values) {
      this.pageList.page = 1
      this.pageList.size = 20
      this.searchList.subjectName = values.subjectName
      this._getSubjectList(this.searchList)
    },
    submitForm(values) {
      values.schoolCode = this.userInfo.schoolCode
      if (!this.type) {
        this.addHighSub(values)
          .then(res => {
            this.$message.success('添加成功')
            this.$tools.goNext(() => {
              this._getSubjectList()
              this.$refs.form.reset()
            })
          })
          .catch(() => {
            this.$refs.form.error()
          })
      } else {
        if (this.type === 1) {
          values.id = this.id
          this.updateHighSub(values)
            .then(res => {
              this.$message.success('编辑成功')
              this.$tools.goNext(() => {
                this._getSubjectList()
                this.$refs.form.reset()
              })
            })
            .catch(() => {
              this.$refs.form.error()
            })
        } else {
          values.subjectNames = (values.subjectNames.split('\n')).join(',')
          this.addHighSubs(values)
            .then(res => {
              this.$message.success('添加成功')
              this.$tools.goNext(() => {
                this._getSubjectList()
                this.$refs.form.reset()
              })
            })
            .catch(() => {
              this.$refs.form.error()
            })
        }
      }
    },
    async del(record) {
      this.delHighSub({ id: record.id }).then(res => {
        this.$message.success('操作成功')
        this.$tools.goNext(() => {
          this.pageList.page = 1
          this.pageList.size = 20
          this._getSubjectList()
          this.chooseList = []
        })
      })
    },
    dels() {
      if (this.chooseList.length === 0) {
        this.$message.warning('请选择要删除的专业')
        return false
      }
      this.$tools.delTip('确定删除选中的专业吗？', () => {
        this.delHighSubs({ ids: this.chooseList }).then(res => {
          this.$message.success('操作成功')
          this.$tools.goNext(() => {
            this.pageList.page = 1
            this.pageList.size = 20
            this._getSubjectList()
            this.chooseList = []
          })
        })
      })
    }
  }
}
</script>
<style lang="less" scoped>
</style>
