<template>
  <div class="WeChat page-layout u-fx-ver">
    <u-space direction="vertical">
      <div class="layout-padd u-type-white-bg ">
        <u-search-form :search-label="templateSetSearchLabel" is-reset @search="search">
          <div slot="left">
            <u-button type="primary" icon="plus" class="u-mar-r10" @click="add(0)">新增</u-button>
            <u-button type="danger" @click="delAll(0)">批量删除</u-button>
          </div>
        </u-search-form>
      </div>
    </u-space>
    <div class="u-fx u-fx-f1">
      <u-table :page-list="pageList" is-check v-model="chooseList" :columns="templateSet" :table-list="recordList">
        <template v-slot:slotOne="slotOne">
          <a-tooltip placement="topLeft" :title="slotOne.record.templateContent">
            <u-button type="default" >详情</u-button>
          </a-tooltip>
        </template>
        <template v-slot:actions="actions">
          <u-button type="link" @click="add(1, actions.record)">编辑</u-button>
          <u-button type="link" content="确定删除该模板吗？" @click="delBatch(actions.record)" delete >删除</u-button>
        </template>
      </u-table>
    </div>
    <div class="u-type-white-bg">
      <u-pagination justify="end" v-model="pageList" :total="total" @change="getList"></u-pagination>
    </div>
    <u-submit-form
      ref="form"
      @submit="submitForm"
      :title="title"
      v-model="formStatus"
      :formData="temSetFormData"
    >
    </u-submit-form>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import { templateSet } from '../../table-columns/tableColumns'
import { temSetFormData } from '../../submit-columns/submitColumns'
import { templateSetSearchLabel } from '../../search-columns/searchColumns'
export default {
  name: 'WeChat',
  components: {
  },
  data() {
    return {
      title: '添加',
      formStatus: false,
      temSetFormData,
      templateSet,
      templateSetSearchLabel,
      total: 0,
      pageList: {
        page: 1,
        size: 20
      },
      chooseList: [], // 当有选择项时，被选中的项，返回每项的唯一id
      recordList: [],
      searchObj: {}
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  async created() {
    await this.getTemplateType()
    await this.getList()
  },
  methods: {
    ...mapActions('home', [
      'addTemplate',
      'pageTemplate',
      'removeTemplate',
      'removeTemplates',
      'updateTemplate',
      'TempTypeBymsg'
    ]),
    async getList() {
      const req = {
        ...this.pageList,
        ...this.searchObj,
        messageType: '1'
      }
      const res = await this.pageTemplate(req)
      this.recordList = res.data.records
      this.total = res.data.total
    },
    async getTemplateType() {
      const res = await this.TempTypeBymsg('1')
      this.temSetFormData[0].list = res.data.map(v => {
        return {
          key: v.code,
          val: v.name
        }
      })
    },
    // 列表搜索
    search(values) {
      this.searchObj = values
      this.getList()
    },
    async submitForm(values) {
      values.state = !!values.state
      values.messageType = '1'
      try {
        if (this.title === '编辑') {
          values.id = this.id
          await this.updateTemplate(values)
        } else {
          await this.addTemplate(values)
        }
        this.$message.success(`${this.title}成功`)
        this.$refs.form.reset()
        this.$tools.goNext(this.getList)
      } catch (err) {
        this.$refs.form.error()
      }
    },
    async delBatch(record) {
      try {
        await this.removeTemplate(record.id)
        this.$message.success('删除成功')
        this.$tools.goNext(this.getList)
      } catch (err) {}
    },
    async delAll(record) {
      const that = this
      if (this.chooseList.length === 0) return this.$message.error('请先选择配置')
       try {
         this.$confirm({
        title: '提示',
        content: '确定批量删除选中的配置吗?',
        onOk () {
          that.removeTemplates(that.chooseList).then(v => {
             that.$message.success('删除成功')
             that.$tools.goNext(that.getList)
          })
        },
        onCancel () {
        }
      })
      } catch (err) {}
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
    }
  }
}
</script>
<style lang="less" scoped>
@deep: ~'>>>';
</style>
