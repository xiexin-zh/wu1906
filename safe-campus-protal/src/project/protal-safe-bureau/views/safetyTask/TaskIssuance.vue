<template>
  <div class="page-layout qui-fx-ver">
    <search-form is-reset @search-form="searchForm" :search-label="issuanceSearchLabel">
      <div slot="right">
        <a-button icon="del" class="add-action-btn u-mar-l20" @click="delTaskAll">批量删除</a-button>
        <a-button icon="plus" class="add-action-btn u-mar-l20" @click="add(0)">添加任务</a-button>
      </div>
    </search-form>
    <table-list
      is-check
      is-zoom
      v-model="chooseList"
      @selectAll="selectAll"
      :page-list="pageList"
      :columns="issuanceColumns"
      :table-list="findList">
      <template v-slot:actions="action">
        <a-tooltip v-if="action.record.state==='0'" placement="topLeft" title="编辑">
          <a-button size="small" class="edit-action-btn" icon="form" @click="add(1,action.record)"></a-button>
        </a-tooltip>
        <a-tooltip v-if="action.record.state==='0' && action.record.endDate >= new Date(new Date().setHours(0, 0, 0, 0)).getTime()" placement="topLeft" title="发布">
          <a-button size="small" class="play-action-btn" icon="play-circle" @click="release(action.record)"></a-button>
        </a-tooltip>
        <a-popconfirm
          v-if="action.record.state==='0'"
          placement="topLeft"
          ok-text="确定"
          cancel-text="取消"
          @confirm="delTask(action.record)">
          <template slot="title">
            确定删除该任务吗？
          </template>
          <a-tooltip placement="topLeft" title="删除">
            <a-button size="small" class="del-action-btn" icon="delete" ></a-button>
          </a-tooltip>
        </a-popconfirm>
        <a-tooltip placement="topLeft" v-if="action.record.state!=='0'" title="复用">
          <a-button size="small" class="copy-action-btn" icon="copy" @click="add(2,action.record)"></a-button>
        </a-tooltip>
        <a-tooltip placement="topLeft" v-if="action.record.state!=='0'" title="预览">
          <a-button size="small" class="detail-action-btn" icon="ellipsis" @click="preview(action.record)"></a-button>
        </a-tooltip>
        <a-tooltip placement="topLeft" v-if="action.record.state!=='0'" title="查看统计">
          <a-button size="small" class="export-all-btn" icon="export" @click="viewStatistics(action.record)"></a-button>
        </a-tooltip>
        <a-tooltip placement="topLeft" v-if="action.record.state!=='0'" title="查看完成情况">
          <a-button size="small" class="edit-action-btn" icon="edit" @click="checkCompletion(action.record)"></a-button>
        </a-tooltip>
      </template>
    </table-list>
    <page-num v-model="pageList" :total="total" @change-page="showList"></page-num>
  </div>
</template>

<script>
// import hostEnv from '@config/host-env'
import { mapState, mapActions } from 'vuex'
import TableList from '@c/TableList'
import PageNum from '@c/PageNum'
import SearchForm from '@c/SearchForm'
import { issuanceSearchLabel } from '../../assets/js/searchLabel.js'
import { issuanceColumns } from '../../assets/js/tableColumns'

export default {
  name: 'TaskRecord',
  components: {
    TableList,
    PageNum,
    SearchForm
  },
  data() {
    return {
      issuanceColumns,
      issuanceSearchLabel,
      total: 0,
      pageList: {
        page: 1,
        size: 20
      },
      findList: [],
      chooseList: [], // 当有选择项时，被选中的项，返回每项的唯一id
      searchList: {}
    }
  },
  computed: {
    ...mapState('home', ['userInfo', 'eduCode'])
  },
  mounted() {
    this.showList()
  },
  methods: {
    ...mapActions('home', ['getTaskList', 'removeTask', 'removeTaskAll']),
    async showList() {
      const req = {
        ...this.pageList,
        ...this.searchList,
        userCode: this.userInfo.userCode,
        schoolCode: this.userInfo.schoolCode

      }
      const res = await this.getTaskList(req)
      this.findList = res.data.records
      this.total = res.data.total
    },
    searchForm(values) {
      this.searchList = values
      this.showList()
    },
    selectAll() {},
    async delTask(record) {
      await this.removeTask(record.id)
      this.showList()
    },
    async delTaskAll() {
      this.chooseList.filter(v => v === '1')
      if (this.chooseList.length <= 0) return
      const that = this
      this.$confirm({
        title: '提示',
        content: '确定删除该任务吗?',
        onOk () {
          that.removeTaskAll(that.chooseList).then(res => {
            that.$message.success('操作成功')
            that.showList()
          })
        },
        onCancel () {
        }
      })
    },
    add(type, record) {
      this.$router.push({
        path: '/taskIssuance/addTask',
        query: {
          id: record ? record.id : '',
          type: type
        }
      })
    },
    // 预览
    preview(record) {
      this.$router.push({
        path: '/taskIssuance/preview',
        query: {
          id: record ? record.id : ''
          // type: type
        }
      })
    },
    // 发布
    release(record) {
      this.$router.push({
        path: '/taskIssuance/postTask',
        query: {
          id: record ? record.id : '',
          taskName: record ? record.taskName : '',
          publisherCode: record.publisherCode ? record.publisherCode : '',
          publisherName: record.publisherName ? record.publisherName : '',
          taskCode: record.taskCode ? record.taskCode : ''
          // type: type
        }
      })
    },
    // 任务完成情况
    checkCompletion(record) {
      this.$router.push({
        path: '/taskIssuance/checkCompletion',
        query: {
          id: record ? record.id : '',
          state: record ? record.state : '',
          taskCode: record ? record.taskCode : '',
          taskType: record ? record.taskType : '',
          taskName: record ? record.taskName : ''
        }
      })
    },
    // 查看统计
    viewStatistics(record) {
      this.$router.push({
        path: '/taskIssuance/viewStatistics',
        query: {
          taskCode: record ? record.taskCode : '',
          publishDate: record ? record.publishDate : '',
          taskName: record ? record.taskName : '',
          taskType: record ? record.taskType : ''
        }
      })
    },
    goReport(code) {
      this.$router.push({
        path: '/specialInspection/viewsReport',
        query: {
          code: code
        }
      })
    }
  }
}
</script>
<style lang="less" scoped></style>
