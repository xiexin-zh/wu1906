<template>
  <div class="page-layout qui-fx-ver">
    <search-form isReset @search-form="searchForm" :search-label="searchLabel">
      <div slot="left">
        <a-button icon="plus" class="add-btn" @click="actionPlan(0)">添加</a-button>
      </div>
    </search-form>
    <table-list
      :page-list="pageList"
      :columns="columns"
      :table-list="planList">
      <template v-slot:actions="action">
        <a-tooltip placement="topLeft" title="编辑">
          <a-button size="small" class="edit-action-btn" icon="form" @click.stop="actionPlan(1, action.record)"></a-button>
        </a-tooltip>
        <a-popconfirm placement="left" okText="确定" cancelText="取消" @confirm="deletePlan(action.record)">
          <template slot="title">
            您确定删除吗?
          </template>
          <a-tooltip placement="topLeft" title="删除">
            <a-button size="small" class="del-action-btn" icon="delete"></a-button>
          </a-tooltip>
        </a-popconfirm>
      </template>
    </table-list>
    <page-num v-model="pageList" :total="total" @change-page="showList"></page-num>
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
    title: '计划名称',
    dataIndex: 'userName',
    width: '15%'
  },
  {
    title: '计划模式',
    dataIndex: 'mobile',
    width: '15%'
  },
  {
    title: '应用班牌',
    dataIndex: 'workNo',
    width: '30%'
  },
  {
    title: '发布时间',
    dataIndex: 'sex',
    width: '20%',
    customRender: (text) => {
      return Tools.getDate(text)
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
const searchLabel = [
  {
    value: 'userName',
    initValue: '',
    type: 'input',
    label: '计划名称',
    placeholder: '请输入计划名称'
  },
  {
    list: [
      {
        key: '',
        val: '全部'
      },
      {
        key: 1,
        val: '每天相同'
      },
      {
        key: 2,
        val: '5+2模式'
      },
      {
        key: 3,
        val: '自定义'
      }
    ],
    value: 'hasPhoto',
    type: 'select',
    label: '计划模式'
  }
]
export default {
  name: 'UpDownPlan',
  components: {
    SearchForm,
    TableList,
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
      planList: [{ id: 1 }]
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  mounted() {},
  methods: {
    ...mapActions('home', [
      'getTeacherList'
    ]),
    searchForm (values) {
      console.log(values)
    },
    showList() {

    },
    actionPlan(type, record) {
      let path = ''
      if (type) {
        path = `/upDownPlan/addPlan?id=${record.id}`
      } else {
        path = `/upDownPlan/addPlan`
      }
      this.$router.push({ path })
    },
    deletePlan(record) {

    }
  }
}
</script>
<style lang="less" scoped></style>
