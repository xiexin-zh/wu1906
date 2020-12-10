<template>
  <div class="page-layout qui-fx-ver">
    <search-form is-reset @search-form="searchForm" :search-label="searchLabel">
      <div slot="left">
        <a-button icon="export" class="export-btn" @click="exportClick">导出</a-button>
      </div>
    </search-form>
    <a-drawer
      width="400"
      title="详情"
      placement="right"
      :closable="true"
      @close="detailTag = false"
      :visible="detailTag"
    >
      <p>访客姓名：{{ recordDetail.visitorName }}</p>
      <p>访客手机号：{{ recordDetail.visitorMobile }}</p>
      <p>来访事由：{{ recordDetail.causeName }}</p>
      <p>审批状态：{{ recordDetail.state }}</p>
      <p>
        访问状态：{{ recordDetail.visitState == '0' ? '待访问' : recordDetail.visitState == '1' ? '在访' : '签离' }}
      </p>
      <p>预计到达时间：{{ getDateTime(recordDetail.accessStartTime) }}</p>
      <p v-if="recordDetail.inTime != null">进入时间：{{ getDateTime(recordDetail.inTime) }}</p>
      <p v-else>通行开始时间：{{ getDateTime(recordDetail.accessStartTime) }}</p>
      <p v-if="recordDetail.outTime != null">签离时间：{{ getDateTime(recordDetail.outTime) }}</p>
      <p v-else>通行结束时间：{{ getDateTime(recordDetail.accessEndTime) }}</p>
      <p>来访时长：{{ recordDetail.duration }}</p>
      <p>进入地点：{{ recordDetail.inPlace }}</p>
      <p>离开地点：{{ recordDetail.outPlace }}</p>
      <p>被访人类型：{{ recordDetail.respondentType == '1' ? '教职工' : '学生' }}</p>
      <p>被访人姓名：{{ recordDetail.respondentName }}</p>
      <p>组织/班级:{{ recordDetail.orgName }}/{{ recordDetail.gradeName }}{{ recordDetail.clazzName }}</p>
    </a-drawer>
    <table-list isZoom :page-list="pageList" :columns="columns" :table-list="recordList">
      <template v-slot:actions="action">
        <a-tooltip placement="topLeft" title="详情">
          <a-button size="small" class="detail-action-btn" icon="ellipsis" @click="goDetail(action.record)"></a-button>
        </a-tooltip>
      </template>
      <template v-slot:other3="action">
        <a-tag color="#D3D3D3" v-if="action.record.state == '0'">待审批</a-tag>
        <a-tag color="#108ee9" v-if="action.record.state == '1'">同意</a-tag>
        <a-tag color="#e80000" v-if="action.record.state == '2'">不同意</a-tag>
        <a-tag color="#FF0000" v-if="action.record.state == '3'">撤销</a-tag>
        <a-tag color="#DCDCDC" v-if="action.record.state == '4'">失效</a-tag>
      </template>
      <template v-slot:other4="action">
        <a-tag color="#D3D3D3" v-if="action.record.visitState == '0'">待访问</a-tag>
        <a-tag color="#1E90FF" v-if="action.record.visitState == '1'">在访</a-tag>
        <a-tag color="#FF0000" v-if="action.record.visitState == '2'">签离</a-tag>
      </template>
      <template v-slot:other5="action">
        <div>{{ action.record.inTime ? action.record.inTime : action.record.accessStartTime | gmtToDate }}</div>
      </template>
    </table-list>
    <page-num v-model="pageList" :total="total" @change-page="showList"></page-num>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import TableList from '@c/TableList'
import SearchForm from '@c/SearchForm'
import PageNum from '@c/PageNum'
const searchLabel = [
  {
    value: 'keyword',
    type: 'selectInput',
    label: '访客姓名',
    selectType: [
      {
        key: 'visitorName',
        val: '访客姓名'
      },
      {
        key: 'visitorMobile',
        val: '访客电话'
      }
    ],
    placeholder: '请输入'
  },
  {
    list: [
      {
        key: '',
        val: '全部'
      },
      {
        key: 0,
        val: '待审批'
      },
      {
        key: 1,
        val: '同意'
      },
      {
        key: 2,
        val: '不同意'
      },
      {
        key: 3,
        val: '撤销'
      },
      {
        key: 4,
        val: '失效'
      }
    ],
    value: 'state',
    type: 'select',
    label: '审批状态'
  },
  {
    list: [
      {
        key: '',
        val: '全部'
      },
      {
        key: 0,
        val: '待访问'
      },
      {
        key: 1,
        val: '在访'
      },
      {
        key: 2,
        val: '签离'
      }
    ],
    value: 'visitState',
    type: 'select',
    label: '访问状态'
  },
  {
    value: 'rangeTime',
    type: 'rangeTime',
    label: '日期'
  }
]
const columns = [
  {
    title: '序号',
    width: '6%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '访客姓名',
    dataIndex: 'visitorName',
    width: '8%'
  },
  {
    title: '访客手机号',
    dataIndex: 'visitorMobile',
    width: '10%'
  },
  {
    title: '访客照片',
    dataIndex: 'registPhoto',
    width: '10%',
    scopedSlots: {
      customRender: 'photoPic'
    }
  },
  {
    title: '来访事由',
    dataIndex: 'causeName',
    width: '8%'
  },
  {
    title: '进入时间',
    width: '8%',
    scopedSlots: {
      customRender: 'other5'
    }
  },
  {
    title: '进入地点',
    dataIndex: 'inPlace',
    width: '8%'
  },
  {
    title: '被访人姓名',
    dataIndex: 'respondentName',
    width: '10%'
  },
  {
    title: '被访人类型',
    dataIndex: 'respondentType',
    width: '10%',
    customRender: text => {
      if (text === 1) {
        return '教职工'
      } else if (text === 2) {
        return '学生'
      }
    }
  },
  {
    title: '审批状态',
    width: '8%',
    scopedSlots: {
      customRender: 'other3'
    }
  },
  {
    title: '访问状态',
    width: '8%',
    scopedSlots: {
      customRender: 'other4'
    }
  },

  {
    title: '详情',
    key: 'action',
    width: '8%',
    scopedSlots: {
      customRender: 'action'
    }
  }
]
export default {
  name: 'VisitorRecord',
  components: {
    TableList,
    SearchForm,
    PageNum
  },
  data() {
    return {
      detailTag: false,
      searchLabel,
      columns,
      total: 0,
      pageList: {
        page: 1,
        size: 20
      },
      recordList: [],
      recordDetail: {},
      searchList: {
        pageNum: '',
        pageSize: '',
        schoolCode: ''
      },
      keyword: '',
      state: '',
      visitState: '',
      accessType: '',
      inStartTime: '',
      inEndTime: ''
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  mounted() {
    this.showList()
  },
  methods: {
    ...mapActions('home', ['getappointList', 'getappointDetail', 'downAppoint']),
    exportClick() {
      this.downAppoint({
        schoolCode: this.userInfo.schoolCode,
        keyword: this.keyword ? this.keyword : undefined,
        visitState: this.visitState ? this.visitState : undefined,
        accessType: this.accessType ? this.accessType : undefined,
        inStartTime: this.inStartTime ? this.inStartTime : undefined,
        inEndTime: this.inEndTime ? this.inEndTime : undefined,
        name: '访客记录',
        state: this.state
      })
    },
    async showList(searchObj = {}) {
      this.searchList.pageNum = this.pageList.page
      this.searchList.pageSize = this.pageList.size
      this.searchList.schoolCode = this.userInfo.schoolCode
      this.searchList = Object.assign(this.searchList, searchObj)
      const res = await this.getappointList(this.searchList)
      this.recordList = res.data.list
      this.total = res.data.total
    },
    async goDetail(record) {
      this.detailTag = true
      const req = {
        id: record.id
      }
      const res = await this.getappointDetail(req)
      this.recordDetail = res.data
      if (this.recordDetail.state === 0) {
        this.recordDetail.state = '待审批'
      } else if (this.recordDetail.state === 1) {
        this.recordDetail.state = '同意'
      } else if (this.recordDetail.state === 2) {
        this.recordDetail.state = '不同意'
      } else if (this.recordDetail.state === 3) {
        this.recordDetail.state = '撤销'
      } else {
        this.recordDetail.state = '失效'
      }
    },
    searchForm(values) {
      this.pageList.page = 1
      this.keyword = values.keyword
      this.state = values.state
      this.visitState = values.visitState
      this.accessType = values.accessType
      this.inStartTime = values.rangeTime[0]
      this.inEndTime = values.rangeTime[1]
      const searchObj = {
        keyword: this.keyword,
        state: this.state,
        visitState: this.visitState,
        accessType: this.accessType,
        inStartTime: this.inStartTime,
        inEndTime: this.inEndTime
      }
      this.showList(searchObj)
    },
    // 获取时间日期
    getDateTime(t, tag = true) {
      if (!t) {
        return ''
      }
      var today = new Date(t)
      var hou = today.getHours() < 0 ? '0' + today.getHours() : today.getHours()
      var getMinutes = today.getMinutes() < 0 ? '0' + today.getMinutes() : today.getMinutes()
      var getSeconds = today.getSeconds() < 10 ? '0' + today.getSeconds() : today.getSeconds()
      if (
        '' + hou + getMinutes + getSeconds === '080000' ||
        '' + hou + getMinutes + getSeconds === '120000' ||
        '' + hou + getMinutes + getSeconds === '180000' ||
        '' + hou + getMinutes + getSeconds === '220000'
      ) {
        window.location.reload()
      }
      return (
        today.getFullYear() +
        '年' +
        (today.getMonth() + 1) +
        '月' +
        today.getDate() +
        '日 ' +
        hou +
        ':' +
        getMinutes +
        ':' +
        getSeconds
      )
    }
  }
}
</script>
<style lang="less" scoped></style>
