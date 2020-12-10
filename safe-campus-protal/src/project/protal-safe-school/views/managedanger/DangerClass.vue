<template>
  <div class="page-layout qui-fx-ver">
    <div class="top-btn-group">
      <a-button icon="plus" class="add-btn" @click="add(0)">新增分类</a-button>
      <a-button icon="delete" class="del-btn" @click="dels">批量删除</a-button>
    </div>
    <table-list
      is-check
      :page-list="pageList"
      :columns="columns"
      :table-list="classList"
      v-model="chooseList"
      @clickRow="clickRow"
      @selectAll="selectAll">
      <template v-slot:actions="action">
        <div v-if="action.record.hasDel === '0'"> 系统预设 </div>
        <div v-else>
          <a-tooltip placement="topLeft" title="编辑">
            <a-button size="small" class="edit-action-btn" icon="form" @click.stop="add(1, action.record)"></a-button>
          </a-tooltip>
          <a-popconfirm placement="left" okText="确定" cancelText="取消" @confirm="del(action)">
            <template slot="title"> 确定删除该隐患分类吗? </template>
            <a-tooltip placement="topLeft" title="删除">
              <a-button size="small" class="del-action-btn" icon="delete"></a-button>
            </a-tooltip>
          </a-popconfirm>
        </div>
      </template>
    </table-list>
    <page-num v-model="pageList" :total="total" @change-page="showList"></page-num>
    <submit-form ref="form" @submit-form="submitForm" :title="title" v-model="formStatus" :form-data="formData"></submit-form>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import TableList from '@c/TableList'
import PageNum from '@c/PageNum'
import SubmitForm from '@c/SubmitForm'
import $tools from '@u/tools'
const columns = [
  {
    title: '序号',
    scopedSlots: {
      customRender: 'index'
    },
    width: '15%'
  },
  {
    title: '分类名称',
    dataIndex: 'name',
    width: '27%'
  },
  {
    title: '发布时间',
    dataIndex: 'createTime',
    width: '28%',
    customRender: text => {
      return $tools.getDate(text)
    }
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
    label: '分类名称',
    placeholder: '请输入分类名称'
  }
]
export default {
  name: 'DangerClass',
  components: {
    TableList,
    PageNum,
    SubmitForm
  },
  data() {
    return {
      columns,
      formData,
      total: 0,
      pageList: {
        page: 1,
        size: 20
      },
      classList: [],
      form: this.$form.createForm(this),
      chooseList: [],
      formStatus: false,
      title: '新增分类',
      taskSearch: {}
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  mounted() {
    this.showList()
  },
  methods: {
    ...mapActions('home', ['getGroupClass', 'delGroupClass', 'delsGroupClass', 'modifyGroupClass', 'addGroupClass']),
    async showList() {
      this.taskSearch.schoolCode = this.userInfo.schoolCode
      this.taskSearch = Object.assign(this.taskSearch, this.pageList)
      const res = await this.getGroupClass(this.taskSearch)
      this.classList = res.data.records
      this.total = res.data.total
    },
    changePage() {
      this.pageList.page = 1
      this.pageList.size = 20
      this.showList()
    },
    async add(type, record) {
      if (type) {
        this.classId = record.id
        this.title = '编辑分类'
        this.formData = this.$tools.fillForm(formData, record)
      } else {
        this.title = '新增分类'
        this.formData = formData
      }
      this.formStatus = true
    },
    del(record) {
      this.delGroupClass(record.record.id).then(res => {
        this.$message.success('操作成功')
        this.$tools.goNext(() => {
          this.pageList.size = 20
          this.pageList.page = 1
          this.showList()
          this.chooseList = []
        })
      })
    },
    dels() {
      if (this.chooseList.length === 0) {
        this.$message.warning('请选择要删除的隐患分类')
        return false
      }
      this.$tools.delTip('确定删除选中的隐患分类吗？', () => {
        this.delsGroupClass(this.chooseList).then(res => {
          this.$message.success('操作成功')
          this.$tools.goNext(() => {
            this.pageList.size = 20
            this.pageList.page = 1
            this.showList()
            this.chooseList = []
          })
        })
      })
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
          this.totalList.push(item)
        } else {
          this.totalList = [item]
        }
      } else {
        const index = this.totalList.findIndex(list => list.id === item.id)
        this.totalList.splice(index, 1)
      }
    },
    async submitForm (values) {
      values.schoolCode = this.userInfo.schoolCode
      try {
        if (this.title === '编辑分类') {
          values.id = this.classId
          await this.modifyGroupClass(values)
        } else {
          await this.addGroupClass(values)
        }
        this.$message.success('操作成功')
        this.$tools.goNext(() => {
          this.$refs.form.reset()
          this.showList()
        })
      } catch (err) {
        this.$refs.form.error()
      }
    }
  }
}
</script>
<style lang="less" scoped></style>
