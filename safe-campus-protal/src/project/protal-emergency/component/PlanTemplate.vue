<template>
  <div class="page-layout qui-fx-ver">
    <table-list :columns="plan.columns" :table-list="templateList">
      <template v-slot:actions="action">
        <a-tooltip placement="topLeft" title="预览">
          <a-button size="small" class="detail-action-btn" icon="ellipsis" @click="goDetail(0,action)"></a-button>
        </a-tooltip>
        <a-tooltip placement="topLeft" title="引用" >
          <a-button size="small" class="edit-action-btn" icon="form" @click="goDetail(1,action)"></a-button>
        </a-tooltip>
      </template>
    </table-list>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import TableList from '@c/TableList'
import plan from '../assets/js/table/plan.js'
export default {
  name: 'PlanTemplate',
  components: {
    TableList
  },
  data() {
    return {
      plan,
      templateList: []
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  mounted() {
    if (this.plan.columns[5].title === '演练状态') {
      this.plan.columns.splice(5, 1)
    }
    this._getSourceClassify()
  },
  methods: {
    ...mapActions('home', ['getPlanTemplate']),
    // 分类列表
    async _getSourceClassify() {
      const res = await this.getPlanTemplate()
      this.templateList = res.data
      this.total = res.data.total
    },
    goDetail(type, record) {
      const path = type ? '/emergencyPlan/addTemplate' : '/emergencyPlan/previewTemplate'
      this.$router.push({
        path: path,
        query: {
          tempId: record.record.id
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
</style>
