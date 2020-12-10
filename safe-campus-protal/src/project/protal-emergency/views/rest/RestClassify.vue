<template>
  <div class="page-layout qui-fx-ver">
    <submit-form
      ref="form"
      @submit-form="submitForm"
      :title="title"
      v-model="formStatus"
      :form-data="rest.formData"
    ></submit-form>
    <div class="top-btn-group">
      <a-button icon="plus" class="add-btn" @click="add(0)">添加作息分类</a-button>
      <a-button icon="delete" class="del-btn" @click="dels">批量删除</a-button>
    </div>
    <table-list
      is-check
      :page-list="pageList"
      :columns="rest.columns"
      :table-list="userList"
      v-model="chooseList"
    >
      <template v-slot:other1="other1">
        <a-popconfirm placement="left" okText="确定" cancelText="取消" @confirm="change(other1.record)">
          <template slot="title">您确定{{ other1.record.state === '1' ? '禁用' : '启用' }}吗?</template>
          <a-tooltip placement="topLeft" :title="other1.record.state === '1' ? '禁用' : '启用' " >
            <a-button size="small" class="play-action-btn" icon="play-circle" v-if="other1.record.state === '1'"></a-button>
            <a-button size="small" class="stop-action-btn" icon="stop" v-if="other1.record.state === '0'"></a-button>
          </a-tooltip>
        </a-popconfirm>
      </template>
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
          <template slot="title">确定删除该作息类型吗？</template>
          <a-tooltip placement="topLeft" title="删除">
            <a-button size="small" class="del-action-btn" icon="delete"></a-button>
          </a-tooltip>
        </a-popconfirm>
      </template>
    </table-list>
    <page-num v-model="pageList" :total="total" @change-page="_getRestClassify"></page-num>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import TableList from '@c/TableList'
import PageNum from '@c/PageNum'
import rest from '../../assets/js/table/rest.js'
import SubmitForm from '@c/SubmitForm'
export default {
  name: 'RestClassify',
  components: {
    TableList,
    PageNum,
    SubmitForm
  },
  data() {
    return {
      rest,
      bodyStyle: {
        padding: 0
      },
      visible: false,
      total: 0,
      pageList: {
        page: 1,
        size: 20
      },
      searchList: {},
      userList: [],
      form: this.$form.createForm(this),
      areaList: [],
      disabled: false,
      chooseList: [],
      area: '',
      formStatus: false,
      title: '添加作息类型',
      detailId: ''
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  mounted() {
    this._getRestClassify()
  },
  methods: {
    ...mapActions('home', [
      'getRestClassify', 'delRestClassify', 'delRestClassifies',
      'addRestClassify', 'updateRestClassify', 'changeRestClassify'
    ]),
    async _getRestClassify() {
      this.searchList.schoolCode = this.userInfo.schoolCode
      this.searchList = Object.assign(this.searchList, this.pageList)
      const res = await this.getRestClassify(this.searchList)
      this.userList = res.data.records.map(el => {
        return {
          ...el,
          id: el.code
        }
      })
      this.total = res.data.total
    },
    add(type, record) {
      if (type) {
        this.rest.formData = this.$tools.fillForm(rest.formData, record.record)
        this.title = '编辑作息类型'
        this.detailId = record.record.code
      } else {
        this.rest.formData = this.$tools.fillForm(rest.formData, {})
        this.title = '添加作息类型'
        this.detailId = ''
      }
      this.formStatus = true
    },
    // 删除单条记录
    async del(record) {
      await this.delRestClassify(record.record.code)
      this.$message.success('操作成功')
      this.$tools.goNext(() => {
        this._getRestClassify()
        this.chooseList = []
      })
    },
    // 批量删除
    dels(record) {
      if (this.chooseList.length === 0) {
        this.$message.warning('请选择要删除的作息类型')
        return false
      }
      this.$tools.delTip('确定删除选中的作息类型吗？', () => {
        this.delRestClassifies(this.chooseList).then((res) => {
          this.$message.success('操作成功')
          this.$tools.goNext(() => {
            this._getRestClassify()
            this.chooseList = []
          })
        })
      })
    },
    // 启用禁用
    async change(record) {
      const req = {
        code: record.code,
        state: record.state === '1' ? '0' : '1'
      }
      await this.changeRestClassify(req)
      this.$message.success('操作成功')
      this.$tools.goNext(() => {
        this._getRestClassify()
        this.chooseList = []
      })
    },
    // 分类提交
    submitForm(values) {
      values.schoolCode = this.userInfo.schoolCode
      if (this.title === '添加作息类型') {
        this.addRestClassify(values)
          .then(res => {
            this.$message.success('添加成功')
            this.$tools.goNext(() => {
              this._getRestClassify()
              this.$refs.form.reset()
            })
          })
          .catch(() => {
            this.$refs.form.error()
          })
      } else {
        values.code = this.detailId
        this.updateRestClassify(values)
          .then(res => {
            this.$message.success('编辑成功')
            this.$tools.goNext(() => {
              this._getRestClassify()
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
