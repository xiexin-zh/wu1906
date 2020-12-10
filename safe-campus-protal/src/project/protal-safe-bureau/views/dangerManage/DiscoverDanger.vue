<template>
  <div class="page-layout qui-fx-ver">
    <search-form is-reset @search-form="searchForm" :search-label="dangerFindSearchLabel">
      <div slot="left">
        <a-button icon="plus" class="u-mar-l10 add-action-btn" @click="exportHazards">导处隐患详情</a-button>
        <a-button icon="export" class="u-mar-l10 export-btn" @click="reportDangers">上报隐患</a-button>
      </div>
    </search-form>
    <!-- is-check
    v-model="chooseList"
    @selectAll="selectAll" -->
    <table-list is-zoom :page-list="pageList" :columns="hiddenDangerColumns" :table-list="userList">
      <template v-slot:other1="other1">
        {{ other1.record }}
      </template>
      <template v-slot:actions="action">
        <a-tooltip placement="topLeft" title="查看">
          <a-button size="small" class="detail-action-btn" icon="ellipsis" @click="goDetail(action.record)"></a-button>
        </a-tooltip>
        <a-tooltip
          placement="topLeft"
          title="已经下发整改通知书"
          @click="seeNotice(action.record)"
          v-if="action.record.hasSendNotification"
        >
          <a-button size="small" class="power-action-btn">已经下发整改通知书</a-button>
        </a-tooltip>
        <a-tooltip placement="topLeft" v-else @click="rectificationNotice(action.record)" title="整改通知书">
          <a-button size="small" class="user-action-btn">整改通知书</a-button>
        </a-tooltip>
        <a-tooltip placement="topLeft" v-if="action.record.superviseState === '0'">
          <a-button size="small" class="user-action-btn">{{ action.record.superviseUserName }}正在督办</a-button>
        </a-tooltip>
        <a-tooltip placement="topLeft" v-if="action.record.superviseState === '1'" title="督办完成">
          <a-button size="small" class="user-action-btn">督办完成</a-button>
        </a-tooltip>
        <a-tooltip
          placement="topLeft"
          v-if="!action.record.superviseState"
          @click="supervise(action.record.id)"
          title="督办完成"
        >
          <a-button size="small" class="user-action-btn">督办</a-button>
        </a-tooltip>
      </template>
    </table-list>
    <page-num v-model="pageList" :total="total" @change-page="showList(searchObj)"></page-num>
    <choose-post
      type="edu"
      ref="choosePost"
      :teacherList="chooseUserList"
      isRadio
      v-if="userTag"
      v-model="userTag"
      @submit="choosePost"
      title="选择督办员"
    ></choose-post>
  </div>
</template>

<script>
// import hostEnv from '@config/host-env'
import { mapState, mapActions } from 'vuex'
import TableList from '@c/TableList'
import SearchForm from '@c/SearchForm'
import PageNum from '@c/PageNum'
import DropDown from '../../component/Dropdown'
import { dangerFindSearchLabel } from '../../assets/js/searchLabel'
import { hiddenDangerColumns } from '../../assets/js/tableColumns'
import ChoosePost from '@c/choose/ChoosePost'
import hostEnv from '@config/host-env'
export default {
  components: {
    TableList,
    SearchForm,
    DropDown,
    PageNum,
    ChoosePost
  },
  data() {
    return {
      taskId: '',
      searchObj: {},
      dangerFindSearchLabel,
      hiddenDangerColumns,
      pageList: {
        page: 1,
        size: 10
      },
      userList: [],
      chooseList: [], // 当有选择项时，被选中的项，返回每项的唯一id
      total: 0,
      // 选择督办人
      supervisorList: [],
      userTag: false,
      chooseUserList: [],
      // 学校code集合
      eduSchoolCodes: [], // 根据教育局查的所有的学校
      streetSchoolCodes: [],
      SchoolCodes: []
    }
  },
  computed: {
    ...mapState('home', ['userInfo', 'schoolCode'])
  },
  created() {},
  async mounted() {
    await this._getStreet()
    await this._getEndSchools()
    await this.showList()
  },
  methods: {
    ...mapActions('home', ['getDangerList', 'superviseDanger', 'getStreet', 'getGroup', 'underSchoolList']),
    // 查询所有街道
    async _getStreet() {
      const req = {
        eduCode: this.schoolCode,
        pageNum: 1,
        pageSize: 50
      }
      const res = await this.getStreet(req)
      this.dangerFindSearchLabel[2].list = res.data.list.map(item => {
        return {
          key: item.streetCode,
          val: item.streetName
        }
      })
    },
    // 根据街道查所有学校
    async _getSchools() {
      const req = {
        eduCode: this.userInfo.schoolCode,
        streetCode: this.searchObj.streetCode
      }
      const res = await this.getGroup(req)
      if (res.data.length > 0) {
        return res.data[0].memberList && res.data[0].memberList.map(v => v.eduCode)
      } else {
        return []
      }
    },
    // 根据教育局查所有学校
    async _getEndSchools() {
      const req = {
        eduCode: this.userInfo.schoolCode,
        areas: [],
        keyWord: '',
        page: 1,
        schoolStage: '',
        size: 20
      }
      const res = await this.underSchoolList(req)
      this.eduSchoolCodes = res.data.list.map(v => v.schoolCode)
      // return res.data[0].memberList && res.data[0].memberList.map(v => v.eduCode)
    },
    async showList() {
      if (this.searchObj.streetCode) {
        const streetSchoolCodes = await this._getSchools()
        this.streetSchoolCodes = streetSchoolCodes
      }
      const req = {
        ...this.searchObj,
        ...this.pageList,
        schoolCode: this.userInfo.schoolCode,
        // 有选择的街道根据街道查学校否则根据教育局查学校
        schoolCodes: this.searchObj.streetCode ? this.streetSchoolCodes : this.eduSchoolCodes,
        hasSupervise: false
      }
      if (req.schoolCodes.length === 0) {
        this.userList = []
        this.total = 0
        return
      }
      const res = await this.getDangerList(req)
      this.userList = res.data.records
      this.total = res.data.total
    },
    searchForm(value) {
      this.searchObj = value
      this.showList()
    },
    // 导出
    async exportHazards(type) {
      var url = `${hostEnv.protal_api_8091}/dangerTask/export/edu`
      if (this.searchObj.streetCode) {
        const streetSchoolCodes = await this._getSchools()
        this.streetSchoolCodes = streetSchoolCodes
      }
      const req = {
        ...this.searchObj,
        ...this.pageList,
        schoolCode: this.schoolCode,
        // schoolName: this.schoolName,
        schoolCodes: this.searchObj.streetCode ? this.streetSchoolCodes : this.eduSchoolCodes,
        hasSupervise: false
      }
      console.log(req)
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
      xhr.send(JSON.stringify(req))
    },
    // 上报隐患
    reportDangers(record) {
      this.$router.push({
        path: '/accountList/reportDangers',
        props: true
      })
    },
    // 查看隐患
    goDetail(record) {
      this.$router.push({
        path: '/accountList/viewDangers',
        props: true,
        query: {
          id: record.id
          // platform: parseInt(record.record.platform)
        }
      })
    },
    // 查看整改通知书
    seeNotice(record) {
      this.$router.push({
        path: '/accountList/rectificationNotice',
        props: true,
        query: {
          id: record.id
        }
      })
    },
    // 整改通知书
    rectificationNotice(record) {
      this.$router.push({
        path: '/accountList/eidtRectificationNotice',
        props: true,
        query: {
          id: record.id
        }
      })
    },
    // 督办弹框
    supervise(taskId) {
      this.taskId = taskId
      this.userTag = true
      // this.$refs.modal.visible = true
    },
    // 选择督办人
    choosePost(list) {
      this.chooseUserList = list
      this.$refs.choosePost.reset()
      if (list.length === 0) return
      this.submit()
    },
    // 督办
    async submit() {
      const req = {
        taskId: this.taskId,
        superviseState: '0',
        userCode: this.chooseUserList[0].userCode || '',
        userName: this.chooseUserList[0].userName || ''
      }
      await this.superviseDanger(req)
      this.$tools.goNext(() => {
        this.$message.success(`督办操作成功`)
      })
      this.showList()
    },
    selectAll() {}
  }
}
</script>

<style lang="less" scoed>
.page-layout {
  height: 100% !important;
}
</style>
