<template>
  <div class="accout-record page-layout qui-fx">
    <div class="qui-fx-f1 qui-fx-ver">
      <search-form isReset @search-form="searchForm" :search-label="searchLabel">
        <div slot="left">
          <a-button @click="handleTplDownload" icon="export" class="export-btn">导出</a-button>
        </div>
      </search-form>
      <table-list :page-list="pageList" :columns="columns" :table-list="recordList">
        <template v-slot:other1="record">
          <a-tag :color="$tools.color(record.record.onState)">{{ record.record.onState | onState }}</a-tag>
        </template>
        <template v-slot:other2="record">
          <a-tag
            :color="$tools.color(record.record.offState)"
          >{{ record.record.offState | onState }}</a-tag>
        </template>
      </table-list>
      <page-num v-model="pageList" :total="total" @change-page="_getAccountRecord"></page-num>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import SearchForm from '@c/SearchForm'
import TableList from '@c/TableList'
import PageNum from '@c/PageNum'
import Tools from '@u/tools'
const columns = [
  {
    title: '序号',
    width: '8%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '姓名',
    dataIndex: 'userName',
    width: '10%'
  },
  {
    title: '学号/工号',
    dataIndex: 'workNo',
    width: '10%'
  },
  {
    title: '班级/部门',
    dataIndex: 'classBoards',
    width: '22%'
  },
  {
    title: '操作类型',
    dataIndex: 'operType',
    width: '10%'
  },
  {
    title: '操作人员',
    dataIndex: 'createBy',
    width: '10%'
  },
  {
    title: '操作时间',
    dataIndex: 'createTime',
    width: '20%',
    customRender: text => {
      return Tools.getDate(text)
    }
  },
  {
    title: '备注',
    width: '10%',
    dataIndex: 'reamk'
  }
]
const searchLabel = [
  {
    value: 'userName',
    type: 'input',
    label: '姓名',
    placeholder: '请输入姓名'
  },
  {
    value: 'workNo',
    type: 'input',
    label: '学号/工号',
    placeholder: '请输入卡号'
  },
  {
    list: [
      {
        key: '',
        val: '全部'
      }
    ],
    value: 'operType',
    type: 'select',
    label: '操作类型'
  },
  {
    value: 'rangeTime',
    type: 'rangeTime',
    label: '时间'
  }
]
export default {
  name: 'OperateRecord',
  components: {
    SearchForm,
    TableList,
    PageNum
  },
  data() {
    return {
      searchLabel,
      searchList: {
        workNo: '',
        operType: '',
        userName: ''
      },
      pageList: {
        page: 1,
        size: 20
      },
      total: 0,
      columns,
      recordList: [],
      exportTime: ''
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  created() {
    this._getDictList('account_oper_type', 'operType')
  },
  mounted() {
    this.searchList.userName = this.$route.query.userName
    this._getAccountRecord()
  },
  methods: {
    ...mapActions('home', ['getAccountRecord', 'exportAccountRecord', 'getDictList']),
    /**
     * @description 数据字典
     */
    async _getDictList(type, text) {
      const i = this.searchLabel.findIndex((list) => list.value === text)
      if (i !== -1) this.searchLabel[i].list = []
      const res = await this.getDictList({
        pageNum: 1,
        pageSize: 100,
        dictType: type
      })
      const list = []
      res.rows.forEach((ele) => {
        list.push({
          key: ele.dictValue,
          val: ele.dictLabel
        })
      })
      if (i !== -1) {
        this.searchLabel[i].list = list
      }
      window.localStorage.setItem(type, JSON.stringify(list))
      const index = this.columns.findIndex((list) => list.dataIndex === text)
      if (index !== -1) {
        this.columns[index].customRender = (text) => {
          return res.rows.filter((ele) => ele.dictValue === text).length > 0
            ? res.rows.filter((ele) => ele.dictValue === text)[0].dictLabel
            : ''
        }
      }
    },
    /**
     * @description 导出操作记录
     */
    async handleTplDownload() {
      await this.exportAccountRecord({
        name: '账户操作记录',
        ...this.searchList
      })
      this.$message.success('导出成功')
    },
    /**
     * @description 查询账户操作记录
     */
    async _getAccountRecord() {
      const res = await this.getAccountRecord({
        pageNum: this.pageList.page,
        pageSize: this.pageList.size,
        ...this.searchList
      })
      this.recordList = res.rows
      this.total = res.total
    },
    searchForm(values) {
      this.pageList.page = 1
      const date = values.rangeTime ? { beginTime: values.rangeTime[0], endTime: values.rangeTime[1] } : {}
      this.searchList = {
        ...values,
        ...date
      }
      delete this.searchList.rangeTime
      this._getAccountRecord()
    }
  }
}
</script>
<style lang="less" scoped>
.accout-record {
  padding: 20px 20px 0;
}
</style>
