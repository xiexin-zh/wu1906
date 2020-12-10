<template>
  <div class="page-layout qui-fx-ver">
    <search-form isReset @search-form="searchForm" :search-label="task.searchLabel">
      <div slot="left">
        <a-button icon="plus" class="add-btn" @click="add(0)">添加广播任务</a-button>
        <a-button icon="delete" class="del-btn" @click.stop="dels">批量删除</a-button>
      </div>
    </search-form>
    <table-list
      is-check
      :page-list="pageList"
      :columns="task.columns"
      :table-list="radioList"
      v-model="chooseList"
    >
      <template v-slot:actions="action">
        <a-tooltip
          placement="topLeft"
          title="编辑"
        >
          <a-button size="small" class="edit-action-btn" icon="form" @click="add(1,action)"></a-button>
        </a-tooltip>
        <a-popconfirm placement="left" okText="确定" cancelText="取消" @confirm="change(action.record)">
          <template slot="title">您确定{{ action.record.state === '1' ? '禁用' : '启用' }}吗?</template>
          <a-tooltip placement="topLeft" :title="action.record.state === '1' ? '禁用' : '启用' " >
            <a-button size="small" class="play-action-btn" icon="play-circle" v-if="action.record.state === '1'"></a-button>
            <a-button size="small" class="stop-action-btn" icon="stop" v-if="action.record.state === '0'"></a-button>
          </a-tooltip>
        </a-popconfirm>
        <a-popconfirm
          placement="left"
          okText="确定"
          cancelText="取消"
          @confirm="del(action)"
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
import TableList from '@c/TableList'
import PageNum from '@c/PageNum'
import task from '../../assets/js/table/task'
import SearchForm from '@c/SearchForm'
export default {
  name: 'RadioTask',
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
      radioList: [],
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
    this._getRestByCode()
    this.showList()
  },
  methods: {
    ...mapActions('home', ['getRadioTask', 'delRadioTask', 'delRadioTasks', 'changeRadioTask', 'getRestByCode']),
    // 作息分类列表
    async _getRestByCode() {
      const res = await this.getRestByCode(this.userInfo.schoolCode)
      this.task.searchLabel[1].list = res.data.map(el => {
        return {
          key: el.code,
          val: el.name
        }
      })
      this.task.searchLabel[1].list.unshift({ key: '', val: '全部' })
    },
    // 任务列表
    async showList() {
      this.searchList.schoolCode = this.userInfo.schoolCode
      this.searchList = Object.assign(this.searchList, this.pageList)
      const res = await this.getRadioTask(this.searchList)
      this.radioList = res.data.records.map(el => {
        return {
          ...el,
          id: el.code
        }
      })
      this.total = res.data.total
    },
    // 查询
    searchForm(values) {
      this.pageList.page = 1
      this.pageList.size = 20
      this.searchList = Object.assign(this.searchList, values)
      this.showList()
    },
    add(type, record) {
      this.$router.push({
        path: '/radioTask/addRadioTask',
        query: {
          id: record ? record.record.code : ''
        }
      })
    },
    // 删除单条记录
    async del(record) {
      await this.delRadioTask(record.record.id)
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
        this.delRadioTasks(this.chooseList).then((res) => {
          this.$message.success('操作成功')
          this.$tools.goNext(() => {
            this.showList()
            this.chooseList = []
          })
        })
      })
    },
    // 启用禁用
    async change(record) {
      const req = {
        code: record.code,
        state: record.state === '1' ? '0' : '1'
      }
      await this.changeRadioTask(req)
      this.$message.success('操作成功')
      this.$tools.goNext(() => {
        this.showList()
        this.chooseList = []
      })
    }
  }
}
</script>
<style lang="less" scoped>
</style>
