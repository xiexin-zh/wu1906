<template>
  <div class="page-layout qui-fx-ver">
    <search-form is-reset @search-form="searchForm" :search-label="task.assignSearchLabel">
      <div slot="left">
        <!-- <a-button type="primary" icon="plus" @click="check">完成情况</a-button> -->
        <a-button type="primary" icon="plus" @click="add(0)">添加任务</a-button>
        <a-button icon="delete" class="del-btn mar-l10" @click="dels">批量删除</a-button>
      </div>
    </search-form>
    <table-list
      is-check
      :page-list="pageList"
      :columns="task.assignColumns"
      :table-list="userList"
      v-model="chooseList"
      @clickRow="clickRow"
      @selectAll="selectAll"
    >
      <template v-slot:actions="action">
        <a-tooltip placement="topLeft" title="预览" v-if="action.record.state !== '0' ">
          <a-button size="small" class="detail-action-btn" icon="ellipsis" @click="add(1,action)"></a-button>
        </a-tooltip>
        <a-tooltip
          placement="topLeft"
          title="编辑"
          v-if="action.record.state === '0'"
        >
          <a-button size="small" class="edit-action-btn" icon="form" @click="add(2,action)"></a-button>
        </a-tooltip>
        <a-tooltip
          placement="topLeft"
          title="发布"
          v-if="action.record.state === '0' && new Date(new Date().setHours(0, 0, 0, 0)).getTime() <= action.record.endDate"
        >
          <a-button
            size="small"
            class="play-action-btn"
            icon="play-circle"
            @click="check(2, action)"
          ></a-button>
        </a-tooltip>
        <a-tooltip
          placement="topLeft"
          title="查看完成情况"
          v-if="action.record.state !== '0' "
          @click="check(0, action)"
        >
          <a-button size="small" class="copy-action-btn" icon="copy"></a-button>
        </a-tooltip>
        <a-tooltip placement="topLeft" title="查看统计" v-if="action.record.state !== '0' " @click="check(1, action)">
          <a-button size="small" class="export-all-btn" icon="export"></a-button>
        </a-tooltip>
        <a-popconfirm
          placement="left"
          okText="确定"
          cancelText="取消"
          @confirm="del(action)"
          v-if="action.record.state === '0'"
        >
          <template slot="title">确定删除该任务吗？</template>
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
import task from '../../assets/js/table/task'
export default {
  name: 'AssignTask',
  components: {
    TableList,
    PageNum,
    SearchForm
  },
  data() {
    return {
      task,
      bodyStyle: {
        padding: 0
      },
      visible: false,
      total: 0,
      pageList: {
        page: 1,
        size: 20
      },
      searchList: {},
      userList: [],
      form: this.$form.createForm(this),
      areaList: [],
      disabled: false,
      chooseList: [],
      area: ''
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  mounted() {
    this.showList()
  },
  methods: {
    ...mapActions('home', ['getSafeTask', 'delSafeTask', 'delSafeTasks']),
    check(type, record) {
      const url = type === 0 ? '/assignTask/taskComplete' : type === 1 ? '/assignTask/taskStatistics' : '/assignTask/postTask'
      this.$router.push({
        path: url,
        query: {
          id: record ? record.record.id : '',
          code: record ? record.record.taskCode : '',
          taskType: record ? record.record.taskType : '',
          name: record ? record.record.taskName : ''
        }
      })
    },
    async showList() {
      this.searchList.schoolCode = this.userInfo.schoolCode
      this.searchList.publisherCode = this.userInfo.userCode
      this.searchList = Object.assign(this.searchList, this.pageList)
      const res = await this.getSafeTask(this.searchList)
      this.userList = res.data.records
      this.total = res.data.total
    },
    searchForm(values) {
      this.searchList = Object.assign(this.searchList, values)
      this.pageList.page = 1
      this.pageList.size = 20
      this.showList()
    },
    add(type, record) {
      const path = type === 1 ? '/assignTask/taskDetail' : '/assignTask/addTask'
      this.$router.push({
        path: path,
        query: {
          id: record ? record.record.id : '',
          state: record ? record.record.state : ''
        }
      })
    },
    // 删除单条记录
    async del(record) {
      await this.delSafeTask(record.record.id)
      this.$message.success('操作成功')
      this.$tools.goNext(() => {
        this.showList()
        this.chooseList = []
      })
    },
    // 批量删除
    dels(record) {
      if (this.chooseList.length === 0) {
        this.$message.warning('请选择要删除的任务')
        return false
      }
      this.$tools.delTip('确定删除选中的任务吗？', () => {
        this.delSafeTasks(this.chooseList).then((res) => {
          this.$message.success('操作成功')
          this.$tools.goNext(() => {
            this.showList()
            this.chooseList = []
          })
        })
      })
    },
    selectAll(item, type) {
      if (type) {
        this.totalList = this.totalList.concat(item)
      } else {
        item.forEach((item) => {
          const index = this.totalList.findIndex((list) => {
            return list.id === item.id
          })
          this.totalList.splice(index, 1)
        })
      }
    },
    // 监听选中或取消
    clickRow(item, type) {
      if (type) {
        if (this.isCheck) {
          this.totalList.push(item)
        } else {
          this.totalList = [item]
        }
      } else {
        const index = this.totalList.findIndex((list) => list.id === item.id)
        this.totalList.splice(index, 1)
      }
    }
  }
}
</script>
<style lang="less" scoped>
</style>
