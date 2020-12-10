<template>
  <div class="page-layout qui-fx-ver">
    <div class="u-fx-je u-mar-20">
      <a-button type="danger" class="del-action-btn u-mar-l20" @click="delAll(0)">批量删除</a-button>
      <a-button icon="plus" class="add-action-btn " @click="add(0)">新增</a-button>
    </div>
    <table-list
      is-check
      is-zoom
      v-model="chooseList"
      :page-list="pageList"
      :columns="wechart"
      :table-list="findList"
    >
      <template v-slot:other1="other1">
        <a-tooltip placement="topLeft" title="编辑">
          <a-switch v-model="other1.record.state" checked-children="是" un-checked-children="否" />
        </a-tooltip>
      </template>
      <template v-slot:actions="action">
        <a-tooltip placement="topLeft" title="编辑">
          <a-button size="small" class="user-action-btn" icon="form" @click="add(1, action.record)"></a-button>
        </a-tooltip>
        <a-popconfirm placement="topLeft" ok-text="确定" cancel-text="取消" @confirm="delBatch(action.record)">
          <template slot="title">
            确定删除该参数配置吗？
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
      :form-data="wechatFormData"
      @closeModal="closeModal"
    >
    </submit-form>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import TableList from '@c/TableList'
import SubmitForm from '@c/SubmitForm'
import PageNum from '@c/PageNum'
import { wechart } from '../../assets/js/tableColumns'
import { wechatFormData } from '../../assets/js/submitLable'

export default {
  name: 'WeChat',
  components: {
    TableList,
    PageNum,
    SubmitForm
  },
  inject: ['reload'],
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
      'addWechat',
      'pageWechat',
      'removeWechat',
      'removeWechats',
      'updateWechats'
    ]),
    async showList() {
      const req = {
        ...this.pageList
      }
      const res = await this.pageWechat(req)
      this.findList = res.data.records
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
      await this.removeWechat(record.id)
      this.showList()
    },
    async delAll(record) {
      const that = this
      if (this.chooseList.length === 0) return this.$message.error('请先选择配置')
      this.$confirm({
        title: '提示',
        content: '确定批量删除选中的配置吗?',
        onOk () {
          that.removeWechats(that.chooseList).then(v => {
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
        this.wechatFormData = this.$tools.fillForm(this.wechatFormData, newRecord)
      } else {
        this.title = '添加'
        this.wechatFormData = this.$tools.fillForm(this.wechatFormData, {})
      }
    },
    // 关闭重置数据
    closeModal() {
      console.log(2)
      this.$refs.form.reset()
    }
  }
}
</script>
<style lang="less" scoped>
@deep: ~'>>>';
</style>
