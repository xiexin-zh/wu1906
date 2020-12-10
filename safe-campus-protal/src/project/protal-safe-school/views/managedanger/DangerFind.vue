<template>
  <div class="page-layout qui-fx-ver">
    <search-form is-reset @search-form="searchForm" :search-label="findColumn.searchLabel">
      <div slot="left">
        <a-button icon="export" class="export-btn" @click="exportClick">导出隐患详情</a-button>
        <a-button icon="plus" class="add-action-btn" @click="add(0)">上报隐患</a-button>
      </div>
    </search-form>
    <table-list is-zoom :page-list="pageList" :columns="findColumn.columns" :table-list="findList">
      <template v-slot:actions="action">
        <a-tooltip placement="topLeft" title="查看">
          <a-button size="small" class="detail-action-btn" icon="ellipsis" @click="goDetail(0, action)"></a-button>
        </a-tooltip>
        <a-tooltip
          placement="topLeft"
          title="验收"
          v-if="action.record.leaderCode === userInfo.userCode && action.record.state === '3'"
        >
          <a-button size="small" class="power-action-btn" icon="lock" @click="goDetail(2, action)"></a-button>
        </a-tooltip>
        <a-tooltip
          placement="topLeft"
          title="指派"
          v-if="action.record.leaderCode === userInfo.userCode && action.record.state === '1'"
        >
          <a-button size="small" class="add-action-btn" icon="plus" @click="modify('1', action)"></a-button>
        </a-tooltip>
        <a-tooltip
          placement="topLeft"
          title="转派"
          v-if="
            action.record.handlerCode === userInfo.userCode &&
              action.record.state === '2' &&
              action.record.hasDispense === '1'
          "
        >
          <a-button size="small" class="edit-action-btn" icon="team" @click="modify('2', action)"></a-button>
        </a-tooltip>
        <a-tooltip
          placement="topLeft"
          title="处理"
          v-if="action.record.handlerCode === userInfo.userCode && action.record.state === '2'"
        >
          <a-button size="small" class="user-action-btn" icon="form" @click.stop="goDetail(1, action)"></a-button>
        </a-tooltip>
        <a-tooltip placement="topLeft" title="整改通知书" v-if="action.record.notificationUrl">
          <a-button size="small" class="edit-action-btn" icon="form" @click.stop="go(action)"></a-button>
        </a-tooltip>
        <a-tooltip
          placement="topLeft"
          title="撤销"
          v-if="action.record.state === '1' || action.record.state === '2' || action.record.state === '3'"
        >
          <a-button size="small" class="del-action-btn" icon="delete" @click.stop="modify('3', action)"></a-button>
        </a-tooltip>
      </template>
    </table-list>
    <page-num v-model="pageList" :total="total" @change-page="showList"></page-num>
    <submit-form
      width="1000px"
      ref="form"
      @submit-form="submitForm"
      :title="title"
      v-model="formStatus"
      :form-data="type === '1' ? dangerForm.formData1 : type === '2' ? dangerForm.formData2 : dangerForm.formData3"
      :formItemLayout="formItemLayout"
    >
    </submit-form>
  </div>
</template>

<script>
import hostEnv from '@config/host-env'
import { mapState, mapActions } from 'vuex'
import TableList from '@c/TableList'
import PageNum from '@c/PageNum'
import SearchForm from '@c/SearchForm'
import SubmitForm from '@c/SubmitForm'
import findColumn from '../../assets/js/table/findColumn'
import dangerForm from '../../assets/js/table/dangerForm'
export default {
  name: 'DangerFind',
  components: {
    TableList,
    PageNum,
    SearchForm,
    SubmitForm
  },
  data() {
    return {
      findColumn,
      dangerForm,
      total: 0,
      pageList: {
        page: 1,
        size: 20
      },
      findList: [],
      form: this.$form.createForm(this),
      formStatus: false,
      searchList: {
        hasSupervise: false
      },
      title: '指派',
      formItemLayout: {
        labelCol: { span: 6 },
        wrapperCol: { span: 16 }
      },
      detailId: '',
      type: ''
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  mounted() {
    this.showList()
    this.getUserList()
    this.getDangerList()
  },
  methods: {
    ...mapActions('home', [
      'getGroupDetail',
      'getGroupClass',
      'getDanger',
      'delDanger',
      'assignDanger',
      'transferDanger'
    ]),
    async getUserList() {
      const res = await this.getGroupDetail({ schoolCode: this.userInfo.schoolCode })
      this.dangerForm.formData1[2].list = this.dangerForm.formData2[0].list = res.data.users.map(el => {
        return {
          ...el,
          val: el.name,
          key: el.code
        }
      })
    },
    async getDangerList() {
      const req = {
        schoolCode: this.userInfo.schoolCode,
        page: 1,
        size: 99999999
      }
      const res = await this.getGroupClass(req)
      this.dangerForm.formData1[0].list = res.data.records.map(el => {
        return {
          ...el,
          val: el.name,
          key: el.code
        }
      })
    },
    async showList() {
      this.searchList.schoolCode = this.userInfo.schoolCode
      this.searchList = Object.assign(this.searchList, this.pageList)
      const res = await this.getDanger(this.searchList)
      this.findList = res.data.records
      this.total = res.data.total
    },
    searchForm(values) {
      this.pageList.page = 1
      this.pageList.size = 20
      this.searchList.startDate = values.rangeTime ? `${values.rangeTime[0]} 00:00:00` : ''
      this.searchList.endDate = values.rangeTime ? `${values.rangeTime[1]} 23:59:59` : ''
      this.searchList = Object.assign(this.searchList, values)
      this.showList()
    },
    modify(type, record) {
      this.type = type
      this.detailId = record.record.id
      this.formStatus = true
    },
    async add(type, record) {
      this.$router.push({
        path: '/dangerFind/addFind',
        query: {
          type: type,
          id: record ? record.record.id : ''
        }
      })
    },
    go(record) {
      this.$router.push({
        path: '/dangerFind/rectificationNotice',
        query: {
          id: record ? record.record.id : ''
        }
      })
    },
    // 导出
    exportClick(type) {
      const url = `${hostEnv.protal_api_8091}/dangerTask/export/school`
      var xhr = new XMLHttpRequest()
      xhr.open('POST', url, true) // 也可以使用POST方式，根据接口
      xhr.responseType = 'blob'
      xhr.onload = function() {
        if (this.status === 200) {
          var content = this.response
          var aTag = document.createElement('a')
          var blob = new Blob([content])
          var headerName = xhr.getResponseHeader('Content-disposition')
          var fileName = decodeURIComponent(headerName).substring(20)
          aTag.download = fileName
          aTag.href = URL.createObjectURL(blob)
          aTag.click()
          URL.revokeObjectURL(blob)
        }
      }
      xhr.send(JSON.stringify(this.searchList))
    },
    goDetail(type, record) {
      const url = type ? '/dangerFind/dangerDeal' : '/dangerFind/dangerDetail'
      this.$router.push({
        path: url,
        query: {
          id: record ? record.record.id : '',
          type: type
        }
      })
    },
    async submitForm(values) {
      values.optCode = this.userInfo.userCode
      try {
        if (this.type === '1') {
          values.id = this.detailId
          await this.assignDanger(values)
        } else if (this.type === '2') {
          this.dangerForm.formData2[0].list.map(el => {
            values.taskId = this.detailId
            if (el.code === values.handlerCode) {
              values.handlerName = el.name
            }
          })
          await this.transferDanger(values)
        } else {
          values.dangerTaskId = this.detailId
          values.optUserName = this.userInfo.userName
          await this.delDanger(values)
        }
        this.$message.success('操作成功')
        this.$tools.goNext(() => {
          this.$refs.form.reset()
          this.showList()
        })
      } catch {
        this.$refs.form.reset()
      }
    }
  }
}
</script>
<style lang="less" scoped></style>
