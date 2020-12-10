<template>
  <div class="card-set page-layout qui-fx-ver">
    <submit-form
      ref="form"
      @submit-form="submitForm"
      :title="title"
      v-model="formStatus"
      :form-data="formData">
    </submit-form>
    <div class="qui-fx qui-fx-ver qui-fx-f1">
      <div class="top-btn-group qui-fx">
        <a-button type="primary" @click="add(0)"> <a-icon type="plus" />添加</a-button>
      </div>
      <table-list
        :columns="columns"
        :table-list="dataList"
      >
        <template v-slot:other1="other1">
          <a-switch
            :defaultChecked="other1.record.status === 1 ? true :false"
            checked-children="已启用"
            un-checked-children="已停用"
            @change="change($event,other1.record)"/>
        </template>
        <template v-slot:actions="action">
          <a-tooltip placement="topLeft" title="编辑" >
            <!-- <a-tooltip placement="topLeft" title="编辑" v-if="action.record.cardName !== '教职工卡' && action.record.cardName !== '学生卡'"> -->
            <a-button size="small" class="edit-action-btn" icon="form" @click.stop="add(1, action.record)"></a-button>
          </a-tooltip>
        </template>
      </table-list>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import TableList from '@c/TableList'
import SubmitForm from '@c/SubmitForm'
import { Switch } from 'ant-design-vue'
import NoData from '@c/NoData'
import PageNum from '@c/PageNum'
const columns = [
  {
    title: '序号',
    width: '15%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '名称',
    dataIndex: 'cardName',
    width: '20%'
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: '15%',
    scopedSlots: {
      customRender: 'other1'
    }
  },
  {
    title: '备注',
    dataIndex: 'remake',
    width: '20'
  },
  {
    title: '操作',
    width: '20%',
    scopedSlots: {
      customRender: 'action'
    }
  }
]
const formData = [
  {
    value: 'cardName',
    initValue: '',
    type: 'input',
    label: '卡名称',
    placeholder: '请输入卡名称'
  },
  {
    value: 'remake',
    initValue: '',
    type: 'input',
    label: '备注',
    placeholder: '请输入备注',
    required: false
  }
]
export default {
  name: 'TypeMge',
  components: {
    TableList,
    PageNum,
    NoData,
    SubmitForm,
    ASwitch: Switch
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  data() {
    return {
      columns,
      formData,
      formStatus: false,
      title: '添加卡类型',
      pageList: {
        page: 1,
        size: 20
      },
      type: 0,
      dataList: [],
      typeId: ''
    }
  },
  mounted() {
    this.showList()
  },
  methods: {
    ...mapActions('home', [
      'getCardType', 'addCardType', 'updateCardType'
    ]),
    async showList () {
      const res = await this.getCardType()
      this.dataList = res.data
    },
    add(type, record) {
      this.formStatus = true
      if (type) {
        this.type = 1
        this.title = '编辑卡类型'
        this.formData = this.$tools.fillForm(formData, record)
        this.typeId = record.id
      } else {
        this.type = 0
        this.title = '添加卡类型'
        this.formData = formData
      }
    },
    async change(e, record) {
      record.status = e ? 1 : 2
      await this.updateCardType(record)
      this.$message.success('操作成功')
      this.$tools.goNext(() => {
        this.showList()
      })
    },
    submitForm (values) {
      const req = {
        status: 1,
        ...values
      }
      let res = null
      if (this.type === 0) {
        res = this.addCardType(req)
      } else {
        req.id = this.typeId
        res = this.updateCardType(req)
      }
      res.then(() => {
        this.$message.success('操作成功')
        this.$tools.goNext(() => {
          this.showList()
          this.$refs.form.reset()
        })
      }).catch(() => {
        this.$refs.form.error()
      })
    }
  }
}
</script>
<style lang="less" scoped></style>
