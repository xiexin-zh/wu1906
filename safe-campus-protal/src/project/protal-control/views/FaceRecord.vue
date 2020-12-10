<template>
  <div class="device-list page-layout qui-fx-ver">
    <search-form is-reset @search-form="searchForm" :search-label="searchLabel"> </search-form>
    <table-list is-zoom :page-list="pageList" :columns="faceRecordColumns" :table-list="identifyList">
      <template v-slot:actions="action">
        <a-tooltip placement="topLeft" title="编辑">
          <a-button size="small" class="edit-action-btn" icon="form"></a-button>
        </a-tooltip>
        <a-tooltip placement="topLeft" title="删除">
          <a-button size="small" class="del-action-btn" icon="delete"></a-button>
        </a-tooltip>
      </template>
    </table-list>
    <page-num v-model="pageList" :total="total" @change-page="showTableList"></page-num>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import SearchForm from '@c/SearchForm'
import TableList from '@c/TableList'
import PageNum from '@c/PageNum'
import faceRecordColumns from '../assets/js/table/faceRecordColumns'
const searchLabel = [
  {
    value: 'userName',
    type: 'input',
    label: '姓名',
    placeholder: '请输入姓名'
  }
]
export default {
  name: 'DistinguishServe',
  components: {
    SearchForm,
    TableList,
    PageNum
  },
  computed: {
    ...mapState('home', ['schoolCode'])
  },
  data() {
    return {
      total: 0,
      searchLabel,
      faceRecordColumns,
      pageList: {
        page: 1,
        size: 20
      },
      identifyList: [],
      searchText: {
        userName: '',
        controlGroupCode: ''
      },
      bussCode: ''
    }
  },
  methods: {
    ...mapActions('home', ['getIdentify', 'getControlGroupList']),
    showTableList() {
      this.getIdentify({
        ...this.pageList,
        ...this.searchText,
        schoolCode: this.schoolCode,
        bussCode: this.bussCode
      }).then(res => {
        this.identifyList = res.data.list
        this.total = res.data.total
      })
    },
    searchForm(values) {
      this.searchText = values
      this.showTableList()
    }
  },
  mounted() {
    this.showTableList()
  }
}
</script>

<style lang="less" scoped></style>
