<template>
  <div class="page-layout qui-fx-ver">
    <submit-form
      ref="form"
      @submit-form="submitForm"
      :title="title"
      v-model="formStatus"
      :form-data="source.formData"
    ></submit-form>
    <div class="top-btn-group">
      <a-button icon="plus" class="add-btn" @click="add(0)">添加分类</a-button>
      <a-button icon="delete" class="del-btn" @click="dels">批量删除</a-button>
    </div>
    <table-list
      is-check
      :page-list="pageList"
      :columns="source.columns"
      :table-list="userList"
      v-model="chooseList"
    >
      <template v-slot:actions="action">
        <a-tooltip
          placement="topLeft"
          title="编辑"
        >
          <a-button size="small" class="edit-action-btn" icon="form" @click="add(1,action)"></a-button>
        </a-tooltip>
        <a-popconfirm
          placement="left"
          okText="确定"
          cancelText="取消"
          @confirm="del(action)"
        >
          <template slot="title">确定删除该分类吗？</template>
          <a-tooltip placement="topLeft" title="删除">
            <a-button size="small" class="del-action-btn" icon="delete"></a-button>
          </a-tooltip>
        </a-popconfirm>
      </template>
    </table-list>
    <page-num v-model="pageList" :total="total" @change-page="_getSourceClassify"></page-num>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import TableList from '@c/TableList'
import PageNum from '@c/PageNum'
import SubmitForm from '@c/SubmitForm'
import source from '../assets/js/table/source.js'
export default {
  name: 'SourceClassify',
  components: {
    TableList,
    PageNum,
    SubmitForm
  },
  data() {
    return {
      source,
      total: 0,
      pageList: {
        page: 1,
        size: 20
      },
      searchList: {},
      userList: [],
      form: this.$form.createForm(this),
      chooseList: [],
      title: '添加分类',
      formStatus: false,
      detailId: ''
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  mounted() {
    this._getSourceClassify()
  },
  methods: {
    ...mapActions('home', ['getSourceClassify', 'delSourceClassify', 'delSourceClassifies', 'addSourceClassify', 'updateSourceClassify']),
    // 分类列表
    async _getSourceClassify() {
      this.searchList.schoolCode = this.userInfo.schoolCode
      this.searchList = Object.assign(this.searchList, this.pageList)
      const res = await this.getSourceClassify(this.searchList)
      this.userList = res.data.records.map(el => {
        return {
          ...el,
          id: el.code
        }
      })
      this.total = res.data.total
    },
    // 添加编辑分类
    add(type, record) {
      if (type) {
        this.title = '编辑分类'
        this.source.formData = this.$tools.fillForm(source.formData, record.record)
        this.detailId = record.record.code
      } else {
        this.title = '添加分类'
        this.source.formData = this.$tools.fillForm(source.formData, {})
      }
      this.formStatus = true
    },
    // 删除单条记录
    async del(record) {
      await this.delSourceClassify(record.record.code)
      this.$message.success('操作成功')
      this.$tools.goNext(() => {
        this._getSourceClassify()
        this.chooseList = []
      })
    },
    // 批量删除
    dels(record) {
      if (this.chooseList.length === 0) {
        this.$message.warning('请选择要删除的分类')
        return false
      }
      this.$tools.delTip('确定删除选中的分类吗？', () => {
        this.delSourceClassifies(this.chooseList).then((res) => {
          this.$message.success('操作成功')
          this.$tools.goNext(() => {
            this._getSourceClassify()
            this.chooseList = []
          })
        })
      })
    },
    // 分类提交
    submitForm(values) {
      values.schoolCode = this.userInfo.schoolCode
      if (this.title === '添加分类') {
        this.addSourceClassify(values)
          .then(res => {
            this.$message.success('添加成功')
            this.$tools.goNext(() => {
              this._getSourceClassify()
              this.$refs.form.reset()
            })
          })
          .catch(() => {
            this.$refs.form.error()
          })
      } else {
        values.code = this.detailId
        this.updateSourceClassify(values)
          .then(res => {
            this.$message.success('编辑成功')
            this.$tools.goNext(() => {
              this._getSourceClassify()
              this.$refs.form.reset()
            })
          })
          .catch(() => {
            this.$refs.form.error()
          })
      }
    }
  }
}
</script>
<style lang="less" scoped>
</style>
