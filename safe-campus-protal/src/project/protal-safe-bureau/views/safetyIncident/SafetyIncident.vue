<template>
  <div class="page-layout qui-fx-ver">
    <search-form is-reset @search-form="searchForm" :search-label="IncidentSearchLabel">
    </search-form>
    <table-list
      is-zoom
      :page-list="pageList"
      :columns="incidentColumns"
      :table-list="findList">
      <template v-slot:other1="other1">
        <a-tooltip placement="topLeft" title="批示" v-if="other1.record.status !== '3'">
          <a-button size="small" class="edit-action-btn" icon="form" @click="instructions(other1.record)"></a-button>
        </a-tooltip>
      </template>
      <template v-slot:actions="action">
        <a-tooltip placement="topLeft" title="查看">
          <a-button size="small" class="detail-action-btn" icon="ellipsis" @click="goDetail(action.record)"></a-button>
        </a-tooltip>
      </template>
    </table-list>
    <page-num v-model="pageList" :total="total" @change-page="showList"></page-num>
    <submit-form
      ref="form"
      @submit-form="submitForm"
      title="批示信息"
      v-model="formStatus"
      :form-data="accidentFormData"
    >
    </submit-form>
  </div>
</template>

<script>
// import hostEnv from '@config/host-env'
import { mapState, mapActions } from 'vuex'
import TableList from '@c/TableList'
import PageNum from '@c/PageNum'
import SearchForm from '@c/SearchForm'
import SubmitForm from '@c/SubmitForm'
import { IncidentSearchLabel } from '../../assets/js/searchLabel.js'
import { incidentColumns } from '../../assets/js/tableColumns'
import { accidentFormData } from '../../assets/js/submitLable'

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
      incidentColumns,
      IncidentSearchLabel,
      accidentFormData,
      total: 0,
      pageList: {
        page: 1,
        size: 20
      },
      findList: [],
      form: this.$form.createForm(this),
      formStatus: false,
      searchList: {},
      detailId: '',
      type: '',
      schoolCodes: []
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  async created() {
    await this.getUnderSchools()
    await this.showList()
  },
  mounted() {
  },
  methods: {
    ...mapActions('home', [
      'getAccident',
      'delDanger',
      'assignDanger',
      'transferDanger',
      'reportAccident',
      'underSchoolList'
    ]),
    // 根据教育局查所有学校
    async getUnderSchools() {
      const req = {
        eduCode: this.userInfo.schoolCode,
        areas: [],
        keyWord: '',
        page: 1,
        schoolStage: '',
        size: 20
      }
      const res = await this.underSchoolList(req)
      this.schoolCodes = res.data.list.map(v => v.schoolCode)
    },
    async showList() {
      this.searchList.schoolCodeList = this.schoolCodes
      this.searchList = Object.assign(this.searchList, this.pageList)
      const res = await this.getAccident(this.searchList)
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
    // 批示
    instructions(record) {
      this.accidentId = record.id
      this.formStatus = true
    },
    submitForm(values) {
      const req = {
        type: '1',
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
    },
    goDetail(record) {
      this.$router.push({
        path: '/safetyIncident/accidentDetail',
        query: {
          id: record.id,
          state: record.state
        }
      })
    }
  }
}
</script>
<style lang="less" scoped></style>
