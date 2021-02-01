<template>
  <div class="Note page-layout u-fx-ver u-type-white-bg">
    <u-space direction="vertical" class="layout-padd">
      <u-search-form :search-label="templateTypeSearchLabel" @search="search">
        <div slot="left" class="layout-padd-r">
          <u-button type="primary" icon="plus" class="u-mar-r10" @click="add(0)">新增</u-button>
          <u-button type="danger" @click="delAll(0)">批量删除</u-button>
        </div>
      </u-search-form>
    </u-space>
    <div class="u-fx u-fx-f1">
      <u-table
        :page-list="pageList"
        is-check
        v-model="chooseList"
        :columns="template"
        :table-list="recordList"
      >
        <template v-slot:slotOne="slotOne">
          <a-tooltip placement="topLeft" title="编辑">
            <a-switch v-model="slotOne.record.state" checked-children="是" un-checked-children="否" />
          </a-tooltip>
        </template>
        <template v-slot:actions="actions">
          <!-- <u-button type="link" @click="add(1, actions.record)">编辑</u-button> -->
          <u-button type="link" content="确定删除该模板类型吗？" @click="delBatch(actions.record)" delete>删除</u-button>
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
      :formData="TemTypeFormData"
    ></u-submit-form>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import { template } from '../table-columns/tableColumns'
import { TemTypeFormData } from '../submit-columns/submitColumns'
import { templateTypeSearchLabel } from '../search-columns/searchColumns'
export default {
  name: 'TemplateType',
  components: {},
  data() {
    return {
      title: '添加',
      formStatus: false,
      TemTypeFormData,
      templateTypeSearchLabel,
      template,
      total: 0,
      pageList: {
        page: 1,
        size: 20
      },
      chooseList: [],
      searchObj: {},
      recordList: []
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  async created() {
    await this.getList()
  },
  methods: {
    ...mapActions('home', ['addTempType', 'pageTempType', 'removeTempType', 'removeTempTypes', 'updatemsgConfig']),
    async getList() {
      const req = {
        ...this.pageList,
        ...this.searchObj
      }
      const res = await this.pageTempType(req)
      this.recordList = res.data.records
      this.total = res.data.total
    },
    search(values) {
      this.searchObj = values
      this.getList()
    },
    async submitForm(values) {
      values.state = !!values.state
      try {
        if (this.title === '编辑') {
          values.id = this.id
          await this.updatemsgConfig(values)
        } else {
          await this.addTempType(values)
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
        await this.removeTempType(record.id)
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
          onOk() {
            that.removeTempTypes(that.chooseList).then(v => {
              that.$message.success('删除成功')
              that.$tools.goNext(that.getList)
            })
          },
          onCancel() {}
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
        this.TemTypeFormData = this.$tools.fillForm(this.TemTypeFormData, newRecord)
      } else {
        this.title = '添加'
        this.TemTypeFormData = this.$tools.fillForm(this.TemTypeFormData, {})
      }
    }
  }
}
</script>
<style lang="less" scoped>
@deep: ~'>>>';
</style>
