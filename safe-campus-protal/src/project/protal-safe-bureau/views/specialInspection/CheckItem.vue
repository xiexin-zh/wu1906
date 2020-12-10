<template>
  <div class="page-layout qui-fx-ver">
    <search-form is-reset @search-form="searchForm" :search-label="checkSearchLabel">
      <div slot="right">
        <a-button icon="plus" class="add-action-btn u-mar-l20" @click="goDetail(0)">添加检查项目</a-button>
      </div>
    </search-form>
    <table-list
      is-zoom
      :page-list="pageList"
      :columns="checkColumns"
      :table-list="findList">
      <template v-slot:actions="action">
        <a-tooltip placement="topLeft" title="查看">
          <a-button size="small" class="detail-action-btn" icon="ellipsis" @click="goDetail(1, action.record.id)"></a-button>
        </a-tooltip>
        <a-tooltip placement="topLeft" title="编辑" v-if="action.record.canEdit">
          <a-button size="small" class="user-action-btn" icon="form" @click="goDetail(2,action.record.id)"></a-button>
        </a-tooltip>
        <a-popconfirm
          placement="left"
          okText="确定"
          cancelText="取消"
          @confirm="delMenu(action.record.id)"
          v-if="action.record.canEdit"
        >
          <template slot="title">您确定删除吗?</template>
          <a-tooltip placement="topLeft" title="删除">
            <a-button size="small" class="del-action-btn" icon="delete"></a-button>
          </a-tooltip>
        </a-popconfirm>
      </template>
    </table-list>
    <page-num v-model="pageList" :total="total" @change-page="showList"></page-num>
    <add-check-item
      width="1000px"
      ref="addCheck"
    >
    </add-check-item>
  </div>
</template>

<script>
// import hostEnv from '@config/host-env'
import { mapState, mapActions } from 'vuex'
import TableList from '@c/TableList'
import PageNum from '@c/PageNum'
import SearchForm from '@c/SearchForm'
import AddCheckItem from './AddCheckItem'
import { checkSearchLabel } from '../../assets/js/searchLabel.js'
import { checkColumns } from '../../assets/js/tableColumns'

export default {
  name: 'CheckItem',
  components: {
    TableList,
    PageNum,
    SearchForm,
    AddCheckItem
  },
  data() {
    return {
      count: 0,
      checkColumns,
      checkSearchLabel,
      total: 0,
      pageList: {
        page: 1,
        size: 20
      },
      findList: [],
      searchList: {},
      detailId: '',
      type: ''
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  mounted() {
    this.showList()
  },
  methods: {
    ...mapActions('home', ['getItemPageList', 'delItem']),
    async showList() {
      this.searchList.schoolCode = this.userInfo.schoolCode
      this.searchList = Object.assign(this.searchList, this.pageList)
      const res = await this.getItemPageList(this.searchList)
      this.findList = res.data.records
      this.total = res.data.total
    },
    async delMenu(id) {
      await this.delItem(id)
      this.$message.success('删除成功')
      this.showList()
    },
    searchForm(values) {
      this.searchList = values
      this.showList()
    },
    // 打开子组件传给子组件的数据
    async goDetail(type, id) {
      // this.$refs.addCheck.reset()
      this.$refs.addCheck.$refs.modal.visible = true
      this.$refs.addCheck.detailId = id
      this.$refs.addCheck.type = type
      if (type === 1 || type === 2) {
        this.$refs.addCheck.showDetail()
      } else if (type === 0) {
      }
    }
  }
}
</script>
<style lang="less" scoped></style>
