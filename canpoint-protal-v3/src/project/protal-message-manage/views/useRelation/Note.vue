<template>
  <div class="WeChat page-layout u-fx-ver">
    <u-space direction="vertical">
      <div class="layout-padd u-type-white-bg">
        <u-alert message description="说明：每个学校只能使用1个短信主体。"></u-alert>
        <div class="u-padd-t10">
          <u-button type="primary" icon="plus" class="u-mar-r10" @click="add(0)">新增</u-button>
          <u-button type="danger" @click="delAll(0)">批量删除</u-button>
        </div>
      </div>
    </u-space>
    <div class="u-fx u-fx-f1">
      <u-table
        :page-list="pageList"
        is-check
        v-model="chooseList"
        :columns="user"
        :table-list="recordList"
      >
        <template v-slot:actions="actions">
          <u-button type="link" content="确定删除该关系吗？" @click="delBatch(actions.record)" delete>删除</u-button>
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
      :formData="userFormData"
    ></u-submit-form>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import { user } from '../../table-columns/tableColumns'
import { userFormData } from '../../submit-columns/submitColumns'
export default {
  name: 'WeChat',
  components: {},
  data() {
    return {
      title: '添加',
      formStatus: false,
      userFormData,
      user,
      total: 0,
      pageList: {
        page: 1,
        size: 20
      },
      chooseList: [], // 当有选择项时，被选中的项，返回每项的唯一id
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
    ...mapActions('home', ['addUse', 'pageUse', 'removeUse', 'removeUses']),
    async getList() {
      const req = {
        ...this.pageList,
        ...this.searchObj,
        messageType: '1'
      }
      const res = await this.pageUse(req)
      this.recordList = res.data.records
      this.total = res.data.total
    },

    async submitForm(values) {
      values.state = !!values.state
      values.messageType = '1'
      try {
        if (this.title === '编辑') {
          values.id = this.id
          await this.updateTemplate(values)
        } else {
          await this.addUse(values)
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
        await this.removeUse(record.id)
        this.$message.success('删除成功')
        this.$tools.goNext(this.getList)
      } catch (err) {}
    },
    async delAll(record) {
      const that = this
      if (this.chooseList.length === 0) return this.$message.error('请先选择关系')
      try {
        this.$confirm({
          title: '提示',
          content: '确定批量删除选中的配置吗?',
          onOk() {
            that.removeUses(that.chooseList).then(v => {
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
        this.userFormData = this.$tools.fillForm(this.userFormData, newRecord)
      } else {
        this.title = '添加'
        this.userFormData = this.$tools.fillForm(this.userFormData, {})
      }
    }
  }
}
</script>
<style lang="less" scoped>
@deep: ~'>>>';
</style>
