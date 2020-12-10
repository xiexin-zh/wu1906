<template>
  <div class="page-layout qui-fx-ver">
    <search-form @search-form="searchForm" is-reset :search-label="templateTypeSearchLabel">
      <div slot="right">
        <a-button type="danger" class="del-action-btn u-mar-l10" @click="delAll(0)">批量删除</a-button>
        <a-button icon="plus" class="add-action-btn " @click="add(0)">新增</a-button>
      </div>
    </search-form>
    <table-list
      is-check
      is-zoom
      v-model="chooseList"
      :page-list="pageList"
      :columns="template"
      :table-list="findList"
    >
      <template v-slot:actions="action">
        <a-popconfirm placement="topLeft" ok-text="确定" cancel-text="取消" @confirm="delBatch(action.record)">
          <template slot="title">
            确定删除该模板类型吗？
          </template>
          <a-tooltip placement="topLeft" title="删除">
            <a-button size="small" class="del-action-btn" icon="delete"></a-button>
          </a-tooltip>
        </a-popconfirm>
      </template>
    </table-list>
    <page-num v-model="pageList" :total="total" @change-page="showList"></page-num>
    <submit-form
      ref="form"
      v-if="formStatus"
      @submit-form="submitForm"
      :title="title"
      v-model="formStatus"
      :form-data="TemTypeFormData"
    >
    </submit-form>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import SearchForm from '@c/SearchForm'
import TableList from '@c/TableList'
import SubmitForm from '@c/SubmitForm'
import PageNum from '@c/PageNum'
import { template } from '../assets/js/tableColumns'
import { TemTypeFormData } from '../assets/js/submitLable'
import { templateTypeSearchLabel } from '../assets/js/searchLabel'

export default {
  name: 'WeChat',
  components: {
    TableList,
    PageNum,
    SubmitForm,
    SearchForm
  },
  inject: ['reload'],
  data() {
    return {
      title: '添加',
      formStatus: false,
      templateTypeSearchLabel,
      TemTypeFormData,
      template,
      total: 0,
      pageList: {
        page: 1,
        size: 20
      },
      searchObj: {},
      chooseList: [], // 当有选择项时，被选中的项，返回每项的唯一id
      findList: []
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  async created() {
    await this.showList()
  },
  methods: {
    ...mapActions('home', [
      'addTempType',
      'pageTempType',
      'removeTempType',
      'removeTempTypes'
    ]),
    async showList() {
      const req = {
        ...this.pageList,
        ...this.searchObj
      }
      const res = await this.pageTempType(req)
      this.findList = res.data.records
      this.total = res.data.total
    },
    async submitForm(values) {
      try {
        if (this.title === '编辑') {
          values.id = this.id
          await this.updateWechats(values)
        } else {
          await this.addTempType(values)
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
    async delBatch(record) {
      await this.removeTempType(record.id)
      this.showList()
    },
    async delAll(record) {
      const that = this
      if (this.chooseList.length === 0) return this.$message.error('请先选择模板类型')
      this.$confirm({
        title: '提示',
        content: '确定批量删除选中的模板类型吗?',
        onOk () {
          that.removeTempTypes(that.chooseList).then(v => {
            that.showList()
          })
        },
        onCancel () {
        }
      })
    },
    add(type, record) {
      this.formStatus = true
      if (type) {
        this.title = '编辑'
        this.id = record.id
        const newRecord = JSON.parse(JSON.stringify(record))
        newRecord.type = record.type ? 1 : 0
        this.TemTypeFormData = this.$tools.fillForm(this.TemTypeFormData, newRecord)
      } else {
        this.title = '添加'
        this.TemTypeFormData = this.$tools.fillForm(this.TemTypeFormData, {})
      }
    },
    searchForm(values) {
      this.searchObj = values
      this.showList()
    },
    // 关闭重置数据
    close() {
      this.visible = false
      this.StatisticsId = ''
      this.statisticsData = {}
    }
  }
}
</script>
<style lang="less" scoped>
@deep: ~'>>>';
</style>
