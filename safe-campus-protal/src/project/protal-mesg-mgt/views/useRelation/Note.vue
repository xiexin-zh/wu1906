<template>
  <div class="page-layout qui-fx-ver">
    <div class="u-padd-10 u-type-success-light-bg u-mar-10">说明：每个学校只能使用1个微信主体。</div>
    <div class="btn u-fx-je u-padd-r10">
      <a-button type="danger" class="del-action-btn u-mar-l10" @click="delAll(0)">批量删除</a-button>
      <a-button icon="plus" class="add-action-btn " @click="add(0)">新增</a-button>
    </div>
    <table-list
      is-check
      is-zoom
      v-model="chooseList"
      :page-list="pageList"
      :columns="user"
      :table-list="findList"
    >
      <template v-slot:other1="other1">
        <a-tooltip placement="topLeft" :title="other1.record.templateContent">
          <a-button class="add-action-btn" @click="add(0)">详情</a-button>
        </a-tooltip>
      </template>
      <template v-slot:actions="action">
        <a-popconfirm placement="topLeft" ok-text="确定" cancel-text="取消" @confirm="delBatch(action.record)">
          <template slot="title">
            确定删除该关系吗？
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
      :form-data="userFormData"
    >
    </submit-form>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import SearchForm from '@c/SearchForm'
import TableList from '@c/TableList'
import SubmitForm from './SubmitForm'
import PageNum from '@c/PageNum'
import { user } from '../../assets/js/tableColumns'
import { userFormData } from '../../assets/js/submitLable'
import { templateSetSearchLabel } from '../../assets/js/searchLabel'
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
      templateSetSearchLabel,
      userFormData,
      TemplateTypes: [],
      user,
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
      'addUse',
      'pageUse',
      'removeUse',
      'removeUses'
    ]),
    async showList() {
      const req = {
        ...this.pageList,
        ...this.searchObj,
        messageType: '1'
      }
      const res = await this.pageUse(req)
      this.findList = res.data.records
      this.total = res.data.total
    },
    async submitForm(values) {
      values.messageType = '1'
      try {
        await this.addUse(values)
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
      await this.removeUse(record.id)
      this.showList()
    },
    async delAll() {
      const that = this
      if (this.chooseList.length === 0) return this.$message.error('请选择')
      this.$confirm({
        title: '提示',
        content: '确定批量删除选中的资源吗?',
        onOk () {
          that.removeUses(that.chooseList).then(v => {
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
        newRecord.state = record.state ? 1 : 0
        this.temSetFormData = this.$tools.fillForm(this.temSetFormData, newRecord)
      } else {
        this.title = '添加'
        this.temSetFormData = this.$tools.fillForm(this.temSetFormData, {})
      }
    },
    searchForm(values) {
      this.searchObj = values
      this.showList()
    }
  }
}
</script>
<style lang="less" scoped>
@deep: ~'>>>';
</style>
