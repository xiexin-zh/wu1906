<template>
  <div class="WeChat page-layout u-fx-ver">
    <u-space direction="vertical">
      <div class="layout-padd u-type-white-bg ">
        <u-button type="primary" icon="plus" class="u-mar-r10" @click="add(0)">新增</u-button>
        <u-button type="danger" @click="delAll(0)">批量删除</u-button>
      </div>
    </u-space>
    <div class="u-fx u-fx-f1">
      <u-table :page-list="pageList" is-check v-model="chooseList" :columns="wechart" :table-list="recordList">
        <template v-slot:slotOne="slotOne">
          <a-switch disabled v-model="slotOne.record.state" checked-children="是" un-checked-children="否" />
        </template>
        <template v-slot:actions="actions">
          <u-button type="link" @click="add(1, actions.record)">编辑</u-button>
          <u-button type="link" content="确定删除该参数配置吗？" @click="delBatch(actions.record)" delete >删除</u-button>
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
      :formData="wechatFormData"
    >
    </u-submit-form>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import { wechart } from '../../table-columns/tableColumns'
import { wechatFormData } from '../../submit-columns/submitColumns'
export default {
  name: 'WeChat',
  components: {
  },
  data() {
    return {
      title: '添加',
      formStatus: false,
      wechatFormData,
      wechart,
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
    ...mapActions('home', [
      'addWechat',
      'pageWechat',
      'removeWechat',
      'removeWechats',
      'updateWechats'
    ]),
    async getList() {
      const req = {
        ...this.pageList
      }
      const res = await this.pageWechat(req)
      this.recordList = res.data.records
      this.total = res.data.total
    },
    async submitForm(values) {
      values.state = !!values.state
      try {
        if (this.title === '编辑') {
          values.id = this.id
          await this.updateWechats(values)
        } else {
          await this.addWechat(values)
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
        await this.removeWechat(record.id)
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
          that.removeWechats(that.chooseList).then(v => {
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
        this.wechatFormData = this.$tools.fillForm(this.wechatFormData, newRecord)
      } else {
        this.title = '添加'
        this.wechatFormData = this.$tools.fillForm(this.wechatFormData, {})
      }
    }
    // changeState(value) {
    //   console.log(value)

    // }
  }
}
</script>
<style lang="less" scoped>
@deep: ~'>>>';
</style>
