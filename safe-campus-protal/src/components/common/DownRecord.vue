<template>
  <a-modal width="1200px" title="下发记录" v-model="status" :footer="null" :maskClosable="false">
    <search-form is-reset @search-form="searchForm" :search-label="searchLabel">
      <div slot="left">
        <a-button icon="export" @click="againSend('')" class="export-all-btn">批量重发</a-button>
      </div>
    </search-form>
    <div class="down-record qui-fx qui-fx-ver">
      <div class="qui-fx qui-fx-f1">
        <table-list
          is-check
          :scroll-h="460"
          :page-list="pageList"
          :columns="recordColumns"
          @clickRow="clickRow"
          v-model="chooseList"
          @selectAll="selectAll"
          :table-list="userList"
        >
          <template v-slot:other2="other2">
            <a-tag :color="other2.record.opeType == 1 ? 'green' : 'red'">
              {{ other2.record.opeType == 1 ? '新增' : '删除' }}
            </a-tag>
          </template>
          <template v-slot:other1="other1">
            <a-tag :color="other1.record.succStatus == 1 ? '#87d068' : '#f50'">
              {{ other1.record.succStatus == 1 ? '成功' : '失败' }}
            </a-tag>
          </template>
          <template v-slot:actions="action">
            <a-tag v-if="parseInt(action.record.succStatus) !== 1" @click="againSend(action.record)">重发</a-tag>
          </template>
        </table-list>
      </div>
      <page-num v-model="pageList" :total="total" @change-page="showList"></page-num>
    </div>
  </a-modal>
</template>

<script>
import $tools from '@u/tools'
import SearchForm from '@c/SearchForm'
import PageNum from './PageNum'
import TableList from '@c/TableList'
import $ajax from '@u/ajax-serve'
import hostEnv from '@config/host-env'
const searchLabel = [
  {
    value: 'userName', // 表单属性
    type: 'input', // 表单类型
    label: '姓名', // 表单label值
    placeholder: '请输入姓名' // 表单默认值(非必选字段)
  },
  {
    list: [
      {
        key: '',
        val: '全部'
      },
      {
        key: 1,
        val: '成功'
      },
      {
        key: 2,
        val: '失败'
      }
    ],
    value: 'succStatus',
    type: 'select',
    label: '下发结果'
  },
  {
    value: 'issuedTime', // 日期区间
    type: 'singleTime',
    label: '下发时间'
  }
]
const recordColumns = [
  {
    title: '序号',
    width: '10%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '人员',
    dataIndex: 'userName',
    width: '15%'
  },
  {
    title: '下发时间',
    dataIndex: 'issuedTime',
    width: '20%',
    customRender: text => {
      return $tools.getDate(text)
    }
  },
  {
    title: '类型操作',
    width: '10%',
    scopedSlots: {
      customRender: 'other2'
    }
  },
  {
    title: '下发结果',
    width: '10%',
    scopedSlots: {
      customRender: 'other1'
    }
  },
  {
    title: '失败原因',
    dataIndex: 'errorMsg',
    width: '15%'
  },
  {
    title: '操作',
    width: '10%',
    scopedSlots: {
      customRender: 'action'
    }
  }
]

export default {
  name: 'RecordColumns',
  components: {
    TableList,
    SearchForm,
    PageNum
  },
  props: {
    bussCode: {
      type: String,
      default: ''
    },
    value: {
      type: Boolean,
      default: false
    },
    deviceSn: {
      type: String,
      default: ''
    }
  },
  computed: {
    status: {
      get() {
        return this.value
      },
      set() {
        this.$emit('input', false)
      }
    }
  },
  data() {
    return {
      pageList: {
        page: 1,
        size: 20
      },
      total: 0,
      chooseUserList: [],
      chooseList: [],
      recordColumns,
      searchLabel,
      userList: [],
      searchText: { issuedTime: '', userName: '', succStatus: '' }
    }
  },
  async mounted() {
    this.showList()
  },
  methods: {
    async showList() {
      const res = await $ajax.post({
        url: `${hostEnv.protal_api_10090}/record/info/queryIssuedUserRecordInfos`,
        params: {
          bussCode: this.bussCode,
          contentType: '',
          deviceSn: this.deviceSn,
          errorMsg: '',
          id: 0,
          libCode: '',
          opeType: '',
          schoolCode: JSON.parse(window.sessionStorage.getItem('loginInfo')).schoolCode,
          serialNum: '',
          userCode: '',
          ...this.pageList,
          ...this.searchText
        }
      })
      this.userList = res.data.list.map(item => {
        return {
          ...item
        }
      })
      this.total = res.data.total
    },
    async againSend(item) {
      let userArr = []
      if (item) {
        userArr = [item]
      } else {
        userArr = this.chooseUserList
      }
      if (userArr.length === 0) {
        this.$message.warning('请选择下发人员')
        return
      }
      await $ajax.post({
        url: `${hostEnv.protal_api_10090}/record/info/resubmitIssuedUserRecordInfos`,
        params: userArr
      })
      this.$message.success('下发成功')
    },
    searchForm(values) {
      this.searchText = values
      this.showList()
    },
    selectAll(item, type) {
      this.chooseUserList = item
      this.chooseList = item.map(item => {
        return item.id
      })
    },
    clickRow(item, type) {
      if (type) {
        this.chooseUserList.push(item)
      } else {
        this.chooseUserList.splice(
          this.chooseUserList.findIndex(it => it.id === item.id),
          1
        )
      }
    }
  }
}
</script>

<style lang="less" scoped>
.down-record {
  height: 600px;
}
</style>
