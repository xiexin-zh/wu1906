<template>
  <div class="subject page-layout qui-fx">
    <div class="qui-fx-ver qui-fx-f1">
      <search-form is-reset @search-form="searchForm" :search-label="searchLabel">
        <div slot="left">
          <a-button icon="plus" class="add-btn" @click="addSubject(0)">添加</a-button>
        </div>
      </search-form>
      <table-list :columns="columns" :table-list="subjectList" :page-list="pageList">
        <template v-slot:actions="action">
          <a-tooltip placement="topLeft" title="编辑" v-if="action.record.state !== '3'">
            <a-button
              size="small"
              class="edit-action-btn"
              icon="form"
              @click.stop="addSubject(1, action.record)"
            ></a-button>
          </a-tooltip>
          <a-popconfirm
            v-if="action.record.state === '1'"
            placement="left"
            okText="确定"
            cancelText="取消"
            @confirm="del(action.record)"
          >
            <template slot="title">确定删除该学年吗?</template>
            <a-tooltip placement="topLeft" title="删除">
              <a-button size="small" class="del-action-btn" icon="delete"></a-button>
            </a-tooltip>
          </a-popconfirm>
        </template>
        <template v-slot:other1="other1">
          <a-tag :color="other1.record.state === '1' ? '#f50' : other1.record.state === '2' ? '#87d068' : '#ccc'">{{ other1.record.state | majorState }}</a-tag>
        </template>
      </table-list>
      <page-num v-model="pageList" :total="total" @change-page="_getHighTerm"></page-num>
      <add-year ref="addYear" v-model="visible" :title="title" @update="_getHighTerm"></add-year>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import TableList from '@c/TableList'
import SearchForm from '@c/SearchForm'
import PageNum from '@c/PageNum'
import AddYear from '../components/AddYear'
import Tools from '@u/tools'
import moment from 'moment'
const searchLabel = [
  {
    value: 'semesterName',
    type: 'input',
    label: '学期名称',
    placeholder: '请输入'
  },
  {
    list: [
      {
        key: '',
        val: '全部'
      },
      {
        key: '1',
        val: '未开始'
      },
      {
        key: '2',
        val: '使用中'
      },
      {
        key: '3',
        val: '已结束'
      }
    ],
    value: 'state',
    type: 'select',
    label: '状态'
  }
]
const columns = [
  {
    title: '序号',
    dataIndex: 'index',
    scopedSlots: {
      customRender: 'index'
    },
    width: '10%'
  },
  {
    title: '学期名称',
    dataIndex: 'semesterName',
    width: '30%',
    customRender: (text, record) => {
      return record.schoolYearName + record.semesterName
    }
  },
  {
    title: '开始日期',
    dataIndex: 'startDate',
    width: '15%',
    customRender: text => {
      return text ? Tools.getDate(text, 1) : ''
    }
  },
  {
    title: '结束日期',
    dataIndex: 'endDate',
    width: '15%',
    customRender: text => {
      return text ? Tools.getDate(text, 1) : ''
    }
  },
  {
    title: '状态',
    width: '10%',
    scopedSlots: {
      customRender: 'other1'
    }
  },
  {
    title: '操作',
    width: '20%',
    scopedSlots: {
      customRender: 'action'
    }
  }
]
export default {
  name: 'HighYear',
  components: {
    TableList,
    SearchForm,
    PageNum,
    AddYear
  },
  data() {
    return {
      columns,
      title: '添加学期',
      subjectList: [],
      type: 0,
      id: '',
      searchLabel,
      pageList: {
        page: 1,
        size: 20
      },
      searchList: {},
      total: 0,
      visible: false
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  mounted() {
    this._getHighTerm()
  },
  methods: {
    ...mapActions('home', ['getHighTerm', 'delHighTerm']),
    async _getHighTerm() {
      this.searchList = Object.assign(this.searchList, this.pageList)
      this.searchList.schoolCode = this.userInfo.schoolCode
      const res = await this.getHighTerm(this.searchList)
      this.subjectList = res.data.records
      this.total = res.data.total
    },
    addSubject(type, record) {
      if (type) {
        this.$refs.addYear.appForm = record
        this.$refs.addYear.appForm.startDate = moment(new Date(record.startDate), 'YYYY-MM-DD')
        this.$refs.addYear.appForm.endDate = moment(new Date(record.endDate), 'YYYY-MM-DD')
        this.$refs.addYear.limit = `${record.schoolYearName.split('-')[0]}-${(parseInt(record.schoolYearName.split('-')[0]) + 1)}`
        this.$refs.addYear.detailId = record.id
        this.$refs.addYear.disabled = true
      } else {
        this.$refs.addYear.appForm = {}
        this.$refs.addYear.limit = ''
        this.$refs.addYear.detailId = ''
        this.$refs.addYear.disabled = false
      }
      this.visible = true
    },
    searchForm(values) {
      this.pageList.page = 1
      this.pageList.size = 20
      this.searchList = Object.assign(this.searchList, values)
      this._getHighTerm(this.searchList)
    },
    async del(record) {
      this.delHighTerm({ id: record.id }).then(res => {
        this.$message.success('操作成功')
        this.$tools.goNext(() => {
          this._getHighTerm()
        })
      })
    }
  }
}
</script>
<style lang="less" scoped>
</style>
