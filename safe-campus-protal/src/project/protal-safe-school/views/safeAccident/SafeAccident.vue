<template>
  <div class="page-layout qui-fx-ver">
    <search-form is-reset @search-form="searchForm" :search-label="accident.searchLabel">
      <div slot="left">
        <a-button icon="plus" class="add-action-btn" @click="add">添加事故</a-button>
        <a-button icon="export" class="export-btn" @click="exportClick">导出</a-button>
      </div>
    </search-form>
    <table-list :page-list="pageList" :columns="accident.columns" :table-list="accidentList">
      <template v-slot:other1="other1">
        <a-tooltip placement="topLeft" title="续报" v-if="other1.record.status !== '3'">
          <a-button size="small" class="edit-action-btn" icon="form" @click="modify(other1)"></a-button>
        </a-tooltip>
      </template>
      <template v-slot:actions="action">
        <a-tooltip placement="topLeft" title="查看">
          <a-button size="small" class="detail-action-btn" icon="ellipsis" @click="goDetail(action)"></a-button>
        </a-tooltip>
      </template>
    </table-list>
    <page-num v-model="pageList" :total="total" @change-page="showList"></page-num>
    <submit-form
      ref="form"
      @submit-form="submitForm"
      title="续报信息"
      v-model="formStatus"
      :form-data="accident.formData"
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
import accident from '../../assets/js/table/accidentColumns'
export default {
  name: 'SafeAccident',
  components: {
    TableList,
    PageNum,
    SearchForm,
    SubmitForm
  },
  data() {
    return {
      accident,
      total: 0,
      formStatus: false,
      pageList: {
        page: 1,
        size: 20
      },
      accidentList: [],
      searchList: {},
      detailId: '',
      type: ''
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  mounted() {
    this.showList()
  },
  methods: {
    ...mapActions('home', [
      'getGroupDetail',
      'getGroupClass',
      'getAccident',
      'delDanger',
      'assignDanger',
      'transferDanger',
      'reportAccident'
    ]),
    async showList() {
      this.searchList.schoolCodeList = [this.userInfo.schoolCode]
      this.searchList = Object.assign(this.searchList, this.pageList)
      const res = await this.getAccident(this.searchList)
      this.accidentList = res.data.records
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
    // 导出
    exportClick(type) {
      const url = `${hostEnv.protal_api_8091}/accident/export`
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
    add() {
      this.$router.push({
        path: '/safeAccident/addAccident'
      })
    },
    goDetail(record) {
      this.$router.push({
        path: '/safeAccident/accidentDetail',
        query: {
          id: record.record.id
        }
      })
    },
    modify(record) {
      this.accidentId = record.record.id
      this.formStatus = true
    },
    submitForm(values) {
      const req = {
        type: '2',
        accidentId: this.accidentId,
        content: values.content,
        userName: this.userInfo.userName,
        userCode: this.userInfo.userCode
      }
      this.reportAccident(req)
        .then(res => {
          this.$refs.form.error()
          this.formStatus = false
          this.$message.success('操作成功')
          this.$tools.goNext(() => {
            this.showList()
            this.$refs.form.reset()
          })
        })
        .catch(() => {
          this.$refs.form.error()
        })
    }
  }
}
</script>
<style lang="less" scoped></style>
