<template>
  <div class="card-account page-layout qui-fx-ver">
    <submit-form
      ref="form"
      @submit-form="submitForm"
      title="编辑应用"
      v-model="formStatus"
      :form-data="formData"
      @onSearch="onSearch"
    ></submit-form>
    <search-form is-reset @search-form="searchForm" :search-label="searchLabel"></search-form>
    <div class="qui-fx-f1 qui-fx">
      <table-list :page-list="pageList" :columns="columns" :table-list="applyList">
        <template v-slot:actions="action">
          <a-tooltip placement="topLeft" title="编辑">
            <a-button size="small" class="edit-action-btn" icon="form" @click.stop="edit(action.record)"></a-button>
          </a-tooltip>
          <!-- <a-popconfirm placement="left" okText="确定" cancelText="取消" @confirm="del(action.record)">
            <template slot="title">您确定删除吗?</template>
            <a-tooltip placement="topLeft" title="删除">
              <a-button size="small" class="del-action-btn" icon="delete"></a-button>
            </a-tooltip>
          </a-popconfirm> -->
        </template>
      </table-list>
    </div>
    <page-num v-model="pageList" :total="total" @change-page="_getApplyList"></page-num>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import SearchForm from '@c/SearchForm'
import SubmitForm from '@c/SubmitForm'
import TableList from '@c/TableList'
import PageNum from '@c/PageNum'
// import Tools from '@u/tools'
const formData = [
  {
    value: 'appName',
    initValue: '',
    type: 'input',
    label: '应用名称',
    placeholder: '请输入应用名称'
  },
  {
    value: 'clientId',
    initValue: '',
    type: 'input',
    label: 'AppKey',
    disabled: true
  },
  {
    value: 'clientSecret',
    initValue: '',
    type: 'input-button',
    label: 'AppSecret',
    readonly: true,
    buttonText: '重置'
  }
]
const searchLabel = [
  {
    value: 'appName',
    type: 'input',
    label: '应用名称',
    placeholder: '请输入应用名称'
  },
  {
    list: [
      {
        key: '',
        val: '全部'
      },
      {
        key: '1',
        val: '已启用'
      },
      {
        key: '2',
        val: '已禁用'
      }
    ],
    value: 'status',
    type: 'select',
    label: '启用状态'
  }
]
const columns = [
  {
    title: '序号',
    scopedSlots: {
      customRender: 'index'
    },
    width: '12%'
  },
  {
    title: '应用名称',
    dataIndex: 'appName',
    width: '12%'
  },
  {
    title: 'AppKey',
    dataIndex: 'clientId',
    width: '12%'
  },
  {
    title: 'AppSecret',
    dataIndex: 'clientSecret',
    width: '12%'
  },
  /* {
    title: '添加人',
    dataIndex: 'userCode',
    width: '12%'
  },
  {
    title: '添加时间',
    dataIndex: 'orderAmount',
    width: '12%',
    customRender: (text) => {
      return Tools.getDate(text)
    }
  },
  {
    title: '启用状态',
    dataIndex: 'discountAmount',
    width: '12%'
  }, */
  {
    title: '操作',
    key: 'action',
    width: '12%',
    scopedSlots: {
      customRender: 'action'
    }
  }
]
export default {
  name: 'ApplyManage',
  components: {
    SearchForm,
    TableList,
    PageNum,
    SubmitForm
  },
  data() {
    return {
      formData,
      formStatus: false,
      searchLabel,
      searchObj: {},
      columns,
      pageList: {
        page: 1,
        size: 20
      },
      total: 0,
      applyList: []
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  mounted() {
    this._getApplyList()
  },
  methods: {
    ...mapActions('home', ['getApplyList', 'editApply']),
    /**
     * @description 获取列表
     */
    async _getApplyList() {
      const res = await this.getApplyList({
        ...this.pageList,
        status: this.searchObj.status || '',
        appName: this.searchObj.appName || ''
      })
      this.applyList = res.data.records
      this.total = res.data.total
    },
    /**
     * @description 搜索列表
     */
    searchForm(values) {
      this.pageList.page = 1
      this.searchObj = values
      this._getOrderList()
    },
    edit(record) {
      this.formStatus = true
      this.appId = record.appId
      this.formData = this.$tools.fillForm(formData, record)
      this.record = record
    },
    del(record) {
      this.delRule(record.id).then((res) => {
        this.$message.success('删除成功')
        this.$tools.goNext(() => {
          this.showList()
        })
      })
    },
    submitForm(values) {
      console.log(values)
      const req = {
        ...values,
        appId: this.appId
      }
      this.editApply(req)
        .then(() => {
          this.$message.success('编辑成功')
          this.$tools.goNext(() => {
            this._getApplyList()
            this.$refs.form.reset()
          })
        })
        .catch(() => {
          this.$refs.form.error()
        })
    },
    /**
     * @description 重置AppSecret
     */
    onSearch(value) {
      this.formData[2].initValue = this.randomString(16)
      console.log(this.formData[2].initValue)
    },
    /**
     * @description 生成随机序列号
     */
    randomString(n) {
      const str = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ9876543210'
      let tmp = ''
      let i = 0
      const l = str.length
      for (i = 0; i < n; i++) {
        tmp += str.charAt(Math.floor(Math.random() * l))
      }
      return tmp
    }
  }
}
</script>

<style lang="less" scoped>
.card-account {
  padding: 20px 20px 0;
}
</style>
