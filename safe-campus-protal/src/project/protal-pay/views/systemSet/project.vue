<template>
  <div class="page-layout qui-fx-ver">
    <search-form is-reset @search-form="searchForm" :search-label="searchLabel">
      <div slot="left">
        <a-button icon="plus" class="add-btn" @click="addType(0)">添加</a-button>
      </div>
    </search-form>
    <submit-form
      ref="form"
      @submit-form="submitForm"
      :title="title"
      v-model="formStatus"
      :form-data="formData"
    ></submit-form>
    <table-list isZoom :page-list="pageList" :columns="columns" :table-list="recordList">
      <template v-slot:actions="action">
        <a-tooltip placement="topLeft" title="编辑">
          <a-button
            size="small"
            class="edit-action-btn"
            icon="form"
            @click.stop="addType(1, action.record)"
          ></a-button>
        </a-tooltip>
        <a-popconfirm
          placement="left"
          okText="确定"
          cancelText="取消"
          @confirm.stop="deleteList(action.record.id)"
        >
          <template slot="title">您确定删除吗?</template>
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
import TableList from '@c/TableList'
import SearchForm from '@c/SearchForm'
import PageNum from '@c/PageNum'
import SubmitForm from '@c/SubmitForm'
const formData = [
  {
    value: 'itemName',
    initValue: '',
    type: 'input',
    label: '收费项名称',
    placeholder: '请输入收费项名称'
  },
  {
    value: 'itemPrice',
    initValue: '',
    type: 'input',
    label: '单价',
    placeholder: '请输入单价'
  }
]
const columns = [
  {
    title: '序号',
    width: '15%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '收费项名称',
    dataIndex: 'itemName',
    width: '15%'
  },
  {
    title: '单价',
    dataIndex: 'itemPrice',
    width: '15%'
  },
  {
    title: '创建人',
    dataIndex: 'createUserCode',
    width: '15%'
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: '20%'
  },
  {
    title: '操作',
    width: '20%',
    scopedSlots: {
      customRender: 'action'
    }
  }
]
const searchLabel = [
  {
    value: 'itemName',
    type: 'input',
    label: '名称',
    placeholder: '请输入收费项名称'
  }
]
export default {
  name: 'Project',
  components: {
    TableList,
    SearchForm,
    PageNum,
    SubmitForm
  },
  data() {
    return {
      columns,
      searchLabel,
      total: 0,
      pageList: {
        page: 1,
        size: 20
      },
      recordList: [],
      searchList: {
        schoolCode: ''
      },
      formData,
      formStatus: false,
      title: '添加',
      roleId: ''
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  mounted() {
    this.showList()
  },
  methods: {
    ...mapActions('home', ['getSelect', 'addSelect', 'delSelect', 'updateSelect', 'getInfoSelect']),
    async showList(searchObj = {}) {
      this.searchList.pageNum = this.pageList.page
      this.searchList.pageSize = this.pageList.size
      this.searchList.schoolCode = this.userInfo.schoolCode
      this.searchList = Object.assign(this.searchList, searchObj)
      const res = await this.getSelect(this.searchList)
      this.recordList = res.data.records
      this.total = res.data.total
    },
    searchForm(values) {
      this.pageList.page = 1
      this.itemName = values.itemName
      const searchObj = {
        itemName: this.itemName
      }
      this.showList(searchObj)
    },
    async deleteList(id) {
      await this.delSelect(id)
      this.$message.success('删除成功')
      this.$tools.goNext(() => {
        this.showList()
      })
    },
    addType(type, record) {
      if (type === 0) {
        this.formData[0].initValue = ''
        this.formData[1].initValue = ''
        this.title = '添加'
        this.formData = this.formData
        this.type = 0
      } else if (type === 1) {
        this.title = '编辑'
        this.formData = this.$tools.fillForm(formData, record)
        this.type = 1
        this.roleId = record.id
      }
      this.formStatus = true
    },
    submitForm(values) {
      const req = {
        ...values,
        schoolCode: this.userInfo.schoolCode,
        itemStatus: '1',
        createUserCode: this.userInfo.userCode,
        id: this.roleId
      }
      let res = null
      if (this.type === 0) {
        res = this.addSelect(req)
      } else {
        res = this.updateSelect(req)
      }
      res
        .then(() => {
          if (this.type === 0) {
            this.$message.success('添加成功')
          } else {
            this.$message.success('编辑成功')
          }
          this.$tools.goNext(() => {
            this.showList()
            this.$refs.form.reset()
          })
        })
        .catch(() => {
          this.$refs.form.error()
        })
    }
  }
}
</script>
<style lang="less" scoped></style>
