<template>
  <div class="page-layout qui-fx-ver">
    <search-form isReset @search-form="searchForm" :search-label="plan.searchLabel">
      <div slot="left">
        <a-button icon="plus" class="add-btn" @click="add(0)">添加预案</a-button>
        <a-button icon="delete" class="del-btn" @click.stop="dels">批量删除</a-button>
      </div>
    </search-form>
    <table-list
      is-check
      :page-list="pageList"
      :columns="plan.columns"
      :table-list="userList"
      v-model="chooseList"
    >
      <template v-slot:other1="other1">
        <a-tag color="green">
          <div @click="goView(other1.record.id)"> {{ other1.record.name }} </div>
        </a-tag>
      </template>
      <template v-slot:actions="action">
        <a-tooltip placement="topLeft" title="查看演练记录">
          <a-button size="small" class="detail-action-btn" icon="ellipsis" @click="add(2,action)"></a-button>
        </a-tooltip>
        <a-tooltip
          placement="topLeft"
          title="编辑"
        >
          <a-button size="small" class="edit-action-btn" icon="form" @click="add(1,action)"></a-button>
        </a-tooltip>
        <a-popconfirm
          placement="left"
          okText="确定"
          cancelText="取消"
          @confirm="del(action)"
        >
          <template slot="title">确定删除该应急预案吗？</template>
          <a-tooltip placement="topLeft" title="删除">
            <a-button size="small" class="del-action-btn" icon="delete"></a-button>
          </a-tooltip>
        </a-popconfirm>
      </template>
    </table-list>
    <page-num v-model="pageList" :total="total" @change-page="_getEmergencyPlan"></page-num>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import TableList from '@c/TableList'
import PageNum from '@c/PageNum'
import SearchForm from '@c/SearchForm'
import plan from '../assets/js/table/plan.js'
export default {
  name: 'PlanEmergency',
  components: {
    TableList,
    PageNum,
    SearchForm
  },
  data() {
    return {
      plan,
      total: 0,
      pageList: {
        page: 1,
        size: 20
      },
      searchList: {},
      userList: [],
      chooseList: [],
      detailId: ''
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  mounted() {
    if (this.plan.columns[5].title !== '演练状态') {
      this.plan.columns.splice(5, 0,
        {
          title: '演练状态',
          dataIndex: 'state',
          width: '12%',
          customRender: text => {
            if (text === 0) {
              return '未启动'
            } else if (text === 1) {
              return '已启动'
            } else {
              return ''
            }
          }
        })
    }
    this._getEmergencyPlan()
  },
  methods: {
    ...mapActions('home', ['getEmergencyPlan', 'delTemplatePlan', 'delTemplatePlans', 'addSourceClassify', 'updateSourceClassify']),
    // 分类列表
    async _getEmergencyPlan() {
      this.searchList.schoolCode = this.userInfo.schoolCode
      this.searchList = Object.assign(this.searchList, this.pageList)
      const res = await this.getEmergencyPlan(this.searchList)
      this.userList = res.data.records
      this.total = res.data.total
    },
    // 查询
    searchForm(values) {
      this.pageList.page = 1
      this.pageList.size = 20
      this.searchList = Object.assign(this.searchList, values)
      this._getEmergencyPlan()
    },
    // 添加编辑分类
    add(type, record) {
      const url = type === 2 ? '/emergencyPlan/drillProcess' : '/emergencyPlan/addTemplate'
      this.$router.push({
        path: url,
        query: {
          tempId: type ? record.record.id : '',
          id: type ? record.record.id : ''
        }
      })
    },
    // 删除单条记录
    async del(record) {
      await this.delTemplatePlan(record.record.id)
      this.$message.success('操作成功')
      this.$tools.goNext(() => {
        this._getEmergencyPlan()
        this.chooseList = []
      })
    },
    // 批量删除
    dels(record) {
      if (this.chooseList.length === 0) {
        this.$message.warning('请选择要删除的应急预案')
        return false
      }
      this.$tools.delTip('确定删除选中的应急预案吗？', () => {
        this.delTemplatePlans(this.chooseList).then((res) => {
          this.$message.success('操作成功')
          this.$tools.goNext(() => {
            this._getEmergencyPlan()
            this.chooseList = []
          })
        })
      })
    },
    goView(id) {
      if (process.env.NODE_ENV === 'production') {
        window.open(
          `/pc-protal/emergency-view#/?schoolCode=${this.userInfo.schoolCode}&userCode=${this.userInfo.userCode}&userName=${this.userInfo.userName}&id=${id}`
        )
      } else {
        window.open(
          `http://192.168.1.47:8080/emergency-view.html#/?schoolCode=${this.userInfo.schoolCode}&userCode=${this.userInfo.userCode}&userName=${this.userInfo.userName}&id=${id}`
        )
      }
    }
  }
}
</script>
<style lang="less" scoped>
</style>
