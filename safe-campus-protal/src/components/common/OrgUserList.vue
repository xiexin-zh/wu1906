<template>
  <a-modal width="1000px" title="人员列表" :visible="value" @ok="handleOk" @cancel="handleOk">
    <search-form is-reset @search-form="searchForm" :search-label="searchLabel"></search-form>
    <div style="height: 500px" class="u-fx">
      <table-list :scrollH="450" :page-list="pageList" :columns="columns" :table-list="userList"></table-list>
    </div>
    <page-num v-model="pageList" :total="total" @change-page="showList"></page-num>
  </a-modal>
</template>

<script>
import $ajax from '@u/ajax-serve'
import { mapState } from 'vuex'
import hostEnv from '@config/host-env'
import $tools from '@u/tools'
import SearchForm from './SearchForm'
import TableList from './TableList'
import PageNum from './PageNum'
const searchLabel = [
  {
    value: 'userName', // 表单属性
    type: 'input', // 表单类型
    label: '姓名', // 表单label值
    placeholder: '请输入姓名' // 表单默认值(非必选字段)
  }
]
const columns = [
  {
    title: '序号',
    width: '10%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '姓名',
    dataIndex: 'userName',
    width: '20%'
  },
  {
    title: '手机号',
    dataIndex: 'mobile',
    width: '20%'
  },
  {
    title: '工号',
    dataIndex: 'workNo',
    width: '15%'
  },
  {
    title: '性别',
    dataIndex: 'sex',
    width: '15%',
    customRender: text => {
      return $tools.getSex(text)
    }
  },
  {
    title: '底照',
    dataIndex: 'photoUrl',
    width: '20%',
    scopedSlots: {
      customRender: 'photoPic'
    }
  }
]
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },
    orgCode: {
      type: String,
      default: ''
    }
  },
  components: {
    TableList,
    PageNum,
    SearchForm
  },
  computed: {
    ...mapState('home', ['schoolCode'])
  },
  data() {
    return {
      searchLabel,
      columns,
      total: 0,
      pageList: {
        page: 1,
        size: 20
      },
      userList: [],
      searchText: {
        userName: ''
      }
    }
  },
  mounted() {
    this.showList()
  },
  methods: {
    searchForm(values) {
      this.searchText = values
      this.showList()
    },
    handleOk() {
      this.$emit('input', false)
    },
    async showList() {
      const res = await $ajax.post({
        url: `${hostEnv.protal_api_11002}/userinfo/teacher/user/queryTeacherInfo`,
        params: {
          orgCode: this.orgCode || this.schoolCode,
          ...this.pageList,
          ...this.searchText,
          schoolCode: this.schoolCode
        }
      })
      this.userList = res.data.list
      this.total = res.data.total
    }
  }
}
</script>

<style lang="less" scoped></style>
