<template>
  <div class="page-layout qui-fx-ver">
    <search-form is-reset @search-form="searchForm" :search-label="task.taskSearchLabel"></search-form>
    <table-list :page-list="pageList" :columns="task.taskColumns" :table-list="taskList">
      <template v-slot:actions="action">
        <a-tooltip
          placement="topLeft"
          title="预览"
          v-if="action.record.state === '2' || action.record.state === '3' || action.record.state === '4' || action.record.state === '6'"
        >
          <a-button
            size="small"
            class="detail-action-btn"
            icon="ellipsis"
            @click="add(0, action.record)"
          ></a-button>
        </a-tooltip>
        <a-tooltip
          placement="topLeft"
          title="填报"
          v-if="action.record.state === '1' && new Date().getTime() <= action.record.endDate"
        >
          <a-button size="small" class="add-action-btn" icon="plus" @click="add(1, action.record)"></a-button>
        </a-tooltip>
        <a-tooltip placement="topLeft" title="修改" v-if="action.record.state === '2' || action.record.state === '6'">
          <a-button size="small" class="edit-action-btn" icon="form" @click="add(2, action.record)"></a-button>
        </a-tooltip>
        <a-popconfirm
          placement="left"
          okText="确定"
          cancelText="取消"
          v-if="action.record.state === '2' || action.record.state === '5' || action.record.state === '6'"
          @confirm="submit(action)"
        >
          <template slot="title">提交之后不允许再次编辑内容，确定提交么？</template>
          <a-tooltip placement="topLeft" title="提交">
            <a-button size="small" class="play-action-btn" icon="play-circle"></a-button>
          </a-tooltip>
        </a-popconfirm>
        <a-tooltip
          placement="topLeft"
          title="补填"
          v-if="action.record.state === '1' && new Date().getTime() >action.record.endDate"
        >
          <a-button size="small" class="copy-action-btn" icon="copy" @click="add(3, action.record)"></a-button>
        </a-tooltip>
        <a-tooltip placement="topLeft" title="重报" v-if="action.record.state === '5'">
          <a-button
            size="small"
            class="export-all-btn"
            icon="export"
            @click="add(4, action.record)"
          ></a-button>
        </a-tooltip>
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
import task from '../../assets/js/table/task'
export default {
  name: 'MyTask',
  components: {
    TableList,
    PageNum,
    SearchForm
  },
  data() {
    return {
      task,
      total: 0,
      pageList: {
        page: 1,
        size: 20
      },
      searchList: {},
      taskList: []
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  mounted() {
    this.showList()
  },
  methods: {
    ...mapActions('home', ['getMySafeTask', 'submitMyTask']),
    async showList() {
      this.searchList.schoolCode = this.userInfo.schoolCode
      this.searchList.userCode = this.userInfo.userCode
      this.searchList = Object.assign(this.searchList, this.pageList)
      const res = await this.getMySafeTask(this.searchList)
      this.taskList = res.data.records
      this.total = res.data.total
    },
    searchForm(values) {
      this.searchList = Object.assign(this.searchList, values)
      this.pageList.page = 1
      this.pageList.size = 20
      this.showList()
    },
    add(type, record) {
      const url = type === 0 || type === 2 || type === 4 ? '/myTask/taskPreview' : '/myTask/fillTask'
      this.$router.push({
        path: url,
        query: {
          id: record ? record.id : '',
          taskCode: record ? record.taskCode : '',
          taskTemplateCode: record ? record.taskTemplateCode : '',
          state: type,
          status: record.state
        }
      })
    },
    async addApp(type, record) {
      this.$router.push({
        path: '/inspectArea/areaAdd',
        query: {
          id: record ? record.record.id : ''
        }
      })
    },
    async submit(record) {
      await this.submitMyTask({ id: record.record.id })
      this.$message.success('操作成功')
      this.$tools.goNext(() => {
        this.showList()
      })
    }
  }
}
</script>
<style lang="less" scoped>
</style>
