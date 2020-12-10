<template>
  <div class="page-layout qui-fx-ver">
    <search-form is-reset @search-form="searchForm" :search-label="searchLabel"> </search-form>
    <table-list isZoom :page-list="pageList" :columns="columns" :table-list="recordList">
      <template v-slot:other3="action">
        <div v-for="(ele, index) in action.record.collectNaterialNameList" :key="index">
          {{ ele.materialTypeName }}-{{ ele.materialName }}-{{ ele.number }}份
        </div>
      </template>
      <template v-slot:actions="action">
        <a-tooltip placement="topLeft" title="查看详情">
          <a-button size="small" class="detail-action-btn" icon="ellipsis" @click="detail(action.record.id)"></a-button>
        </a-tooltip>
      </template>
      <template v-slot:other5="other5">
        <a-tag :color="$tools.stateColor(other5.record.state)">{{ $tools.getType(other5.record.state) }}</a-tag>
      </template>
    </table-list>
    <page-num v-model="pageList" :total="total" @change-page="showList"></page-num>
    <a-modal v-model="previewVisible" width="900px" :footer="null">
      <p>
        <a-tag :color="$tools.stateColor(detailList.state)">{{ $tools.getType(detailList.state) }}</a-tag>
      </p>
      <div style="text-align:center">
        <div style="background-color:#EBEEF5;height:1px;border:none;"></div>
        <div style="min-height:300px;">
          <p style="text-align:left;margin-top:10px;text-indent:30px;">申领人：{{ detailList.applicantName }}</p>
          <p style="text-align:left;margin-top:10px;text-indent:30px;">
            领用物品：
            <span v-for="(ele, index) in detailList.collectNaterialNameList" :key="index">
              {{ ele.materialTypeName }}-{{ ele.materialName }}-{{ ele.number }}份
            </span>
          </p>
          <p style="text-align:left;margin-top:10px;text-indent:30px;">
            申请时间：{{ detailList.createTime | getDate(1) }}
          </p>
          <p style="text-align:left;margin-top:10px;text-indent:30px;" v-if="detailList.state === '2'">
            退回原因：{{ detailList.remark }}
          </p>
          <p style="text-align:left;margin-top:10px;text-indent:30px;">审批人：{{ detailList.approvalUserName }}</p>
          <p style="text-align:left;margin-top:10px;text-indent:30px;">
            审批时间：{{ detailList.approvalTime | getDate(1) }}
          </p>
          <p style="text-align:left;margin-top:10px;text-indent:30px;">发放人：{{ detailList.grantUserName }}</p>
          <p style="text-align:left;margin-top:10px;text-indent:30px;">
            发放时间：{{ detailList.grantTime | getDate(1) }}
          </p>
          <a-button type="primary" v-if="detailList.state === '1'" @click="change">
            发放
          </a-button>
          <template> </template>
        </div>
      </div>
    </a-modal>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import TableList from '@c/TableList'
import SearchForm from '@c/SearchForm'
import PageNum from '@c/PageNum'
import $tools from '@u/tools'
const columns = [
  {
    title: '序号',
    width: '15%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '申请人',
    dataIndex: 'applicantName',
    width: '15%'
  },
  ,
  {
    title: '申请时间',
    dataIndex: 'createTime',
    width: '15%',
    customRender: text => {
      return $tools.getDate(text)
    }
  },
  {
    title: '领用物品',
    width: '20%',
    scopedSlots: {
      customRender: 'other3'
    }
  },
  {
    title: '审批状态',
    width: '20%',
    scopedSlots: {
      customRender: 'other5'
    }
  },
  {
    title: '操作',
    width: '15%',
    scopedSlots: {
      customRender: 'action'
    }
  }
]
const searchLabel = [
  // {
  //   value: 'name',
  //   type: 'input',
  //   label: '申请人',
  //   placeholder: '请输入申请人'
  // },
  {
    value: 'date',
    type: 'singleTime',
    label: '申请时间'
  },
  {
    list: [
      {
        key: '',
        val: '全部状态'
      },
      {
        key: '0',
        val: '待审批'
      },
      {
        key: '1',
        val: '待发放'
      },
      {
        key: '2',
        val: '已退回'
      },
      {
        key: '3',
        val: '已发放'
      }
    ],
    value: 'state',
    type: 'select',
    label: '状态'
  }
]
export default {
  name: 'Collect',
  components: {
    TableList,
    SearchForm,
    PageNum
  },
  data() {
    return {
      columns,
      searchLabel,
      total: 0,
      pageList: {
        page: 1,
        size: 20
      },
      recordList: [],
      searchList: {
        schoolCode: ''
      },
      previewVisible: false,
      detailList: {}
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  mounted() {
    this.showList()
  },
  methods: {
    ...mapActions('home', ['getcollectionList', 'getcollectionDetail', 'addCollection', 'updateState']),
    async showList(searchObj = {}) {
      this.searchList.page = this.pageList.page
      this.searchList.size = this.pageList.size
      this.searchList.schoolCode = this.userInfo.schoolCode
      this.searchList = Object.assign(this.searchList, searchObj)
      const res = await this.getcollectionList(this.searchList)
      this.recordList = res.data.list
      this.total = res.data.total
    },
    searchForm(values) {
      this.pageList.page = 1
      this.date = values.date
      this.state = values.state
      const searchObj = {
        state: this.state,
        date: this.date
      }
      this.showList(searchObj)
    },
    async detail(id) {
      this.previewVisible = true
      const res = await this.getcollectionDetail(id)
      this.detailList = res.data
    },
    async change() {
      const req = {
        userCode: this.userInfo.userCode,
        userName: this.userInfo.userName,
        formId: this.detailList.id,
        remark: '',
        state: '3'
      }
      await this.updateState(req)
      this.$message.success('发放成功')
      this.previewVisible = false
      this.$tools.goNext(() => {
        this.showList()
      })
    }
  }
}
</script>
<style lang="less" scoped></style>
