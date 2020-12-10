<template>
  <div class="page-layout qui-fx">
    <div class="qui-fx-f1 qui-fx-ver">
      <table-list :page-list="pageList" :columns="columns" :table-list="recordList">
        <template v-slot:other1="record">
          <a-tag :color="$tools.color(record.record.onState)" >{{ record.record.onState | onState }}</a-tag>
        </template>
        <template v-slot:other2="record">
          <a-tag :color="$tools.color(record.record.offState)" >{{ record.record.offState | onState }}</a-tag>
        </template>
        <template v-slot:actions="action">
          <a-tag color="#ccc" @click.stop="changeDetail(action.record)">详情</a-tag>
          <a-tag @click.stop="checkDetial(action.record)">充值</a-tag>
          <a-tag @click.stop="checkDetial(action.record)">发卡</a-tag>
        </template>
      </table-list>
      <page-num v-model="pageList" :total="total" @change-page="showList"></page-num>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import TableList from '@c/TableList'
import PageNum from '@c/PageNum'
const columns = [
  {
    title: '序号',
    width: '6%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '姓名',
    dataIndex: 'userName',
    width: '6%'
  },
  {
    title: '工号',
    dataIndex: 'orgName',
    width: '10%'
  },
  {
    title: '日期',
    dataIndex: 'dateTime',
    width: '8%'
  },
  {
    title: '所属组织',
    dataIndex: 'onTime',
    width: '10%'
  },
  {
    title: '状态',
    dataIndex: 'onState',
    width: '8%',
    scopedSlots: {
      customRender: 'other1'
    }
  },
  {
    title: '卡号',
    dataIndex: 'onTemperature',
    width: '8%'
  },
  {
    title: '卡类型',
    dataIndex: 'offTime',
    width: '10%'
  },
  {
    title: '账户余额',
    dataIndex: 'offState',
    width: '8%',
    scopedSlots: {
      customRender: 'other2'
    }
  },
  {
    title: '现金余额',
    dataIndex: 'offTemperature',
    width: '8%'
  },
  {
    title: '补助余额',
    dataIndex: 'temperature',
    width: '8%'
  },
  {
    title: '操作',
    width: '16%',
    scopedSlots: {
      customRender: 'action'
    }
  }
]
export default {
  name: 'Detail',
  components: {
    TableList,
    PageNum
  },
  data () {
    return {
      exportTag: false,
      exportTime: '',
      searchList: {
        orgCode: '',
        searchKey: '',
        startDay: '',
        endDay: '',
        onStatue: '',
        offStatue: '',
        schoolCode: ''
      },
      pageList: {
        page: 1,
        size: 20
      },
      total: 0,
      columns,
      recordList: []
    }
  },
  computed: {
    ...mapState('home', [
      'userInfo'
    ])
  },
  async mounted () {
  },
  methods: {
    ...mapActions('home', [
      'getTeacherRecord'
    ]),
    async showList () {
      this.searchList = Object.assign(this.searchList, this.pageList)
      const res = await this.getTeacherRecord(this.searchList)
      this.recordList = res.data.list
      this.total = res.data.total
    },
    checkDetial (record) {
      this.$refs.recordDetail.recordId = record.id
      this.$refs.recordDetail.showList()
      this.$refs.recordDetail.dialogTag = true
    },
    changeDetail (record) {
      this.$refs.recordChange.recordId = record.id
      this.$refs.recordChange.dialogTag = true
    }
  }
}
</script>
<style lang="less" scoped>
</style>
