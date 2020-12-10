<template>
  <div class="page-layout qui-fx-ver">
    <div class="top-btn-group">
      <a-button icon="plus" class="add-btn" @click="modify(0)">新增评分方案</a-button>
    </div>
    <table-list
      :page-list="pageList"
      :columns="columns"
      :table-list="scorePlanList"
    >
      <template v-slot:actions="action">
        <a-popconfirm placement="left" okText="确定" cancelText="取消" @confirm="del(1,action.record)">
          <template slot="title">您确定{{ action.record.state === '1' ? '禁用' : '启用' }}吗?</template>
          <a-tooltip placement="topLeft" :title="action.record.state === '1' ? '禁用' : '启用' " >
            <a-button size="small" class="play-action-btn" icon="play-circle" ></a-button>
          </a-tooltip>
        </a-popconfirm>
        <a-tooltip placement="topLeft" title="详情">
          <a-button
            size="small"
            class="detail-action-btn"
            icon="ellipsis"
            @click.stop="detail(action.record)"
          ></a-button>
        </a-tooltip>
        <a-tooltip placement="topLeft" title="编辑" >
          <a-button
            size="small"
            class="edit-action-btn"
            icon="form"
            @click="modify(2,action.record)"
          ></a-button>
        </a-tooltip>
        <a-popconfirm placement="left" okText="确定" cancelText="取消" @confirm="del(0,action.record)">
          <template slot="title">您确定删除吗?</template>
          <a-tooltip placement="topLeft" title="删除">
            <a-button size="small" class="del-action-btn" icon="delete"></a-button>
          </a-tooltip>
        </a-popconfirm>
        <a-tooltip placement="topLeft" title="复用" >
          <a-button
            size="small"
            class="copy-action-btn"
            icon="copy"
            @click="modify(3,action.record)"
          ></a-button>
        </a-tooltip>
      </template>
    </table-list>
    <page-num v-model="pageList" :total="total" @change-page="changePage"></page-num>
    <add-score ref="addScore" :title="title" @update="categoryGet"></add-score>
    <score-detail ref="scoreDetail"></score-detail>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import TableList from '@c/TableList'
import AddScore from '../../component/StudentComponents/AddScore'
import ScoreDetail from '../../component/StudentComponents/ScoreDetail'
import PageNum from '@c/PageNum'
const columns = [{
  title: '序号',
  scopedSlots: {
    customRender: 'index'
  },
  width: '10%'
},
{
  title: '方案名称',
  dataIndex: 'name',
  width: '30%'
},
{
  title: '状态',
  dataIndex: 'state',
  width: '25%',
  customRender: (text) => {
    if (text === '1') {
      return '启用'
    } else {
      return '禁用'
    }
  }
},
{
  title: '操作',
  dataIndex: 'action',
  width: '35%',
  scopedSlots: { customRender: 'action' }
}]
export default {
  name: 'StudentScore',
  components: {
    AddScore,
    PageNum,
    TableList,
    ScoreDetail
  },
  data () {
    return {
      title: '新增评分方案',
      scorePlanList: [],
      loading: false,
      isTag: true, // true为添加 false为编辑
      columns,
      pageList: {
        page: 1,
        size: 20
      },
      total: 0,
      examPlanId: ''
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  mounted () {
    this.categoryGet()
  },
  methods: {
    ...mapActions('home',
      [
        'getStuCategory', 'delStuCategory', 'stuCategoryDetail',
        'changeStuCategory'
      ]),
    // 操作分页组件回调, 更新searchForm的值
    changePage () {
      this.categoryGet()
    },
    filterSearch (data) {
      data.forEach((el, index) => {
        this.$set(el, 'code', index)
      })
      return data
    },
    async modify (type, text) {
      if (type) {
        const res = await this.stuCategoryDetail(text.id)
        const data = res.data
        const eduItemsDtos = res.data.eduItemsDtos
        this.$refs.addScore.scoreId = data.id
        this.$refs.addScore.appForm = data
        this.$refs.addScore.teacherList = data.eduUserDtoList
        this.$refs.addScore.zbCount = eduItemsDtos.length
        this.$refs.addScore.project = eduItemsDtos
        this.$refs.addScore.project.map((el, index) => {
          el.key = index
          el.indexDtoList.map((item, i) => {
            item.key = i
          })
        })
        if (type === 2) {
          this.title = '编辑评分方案'
          this.$refs.addScore.disabled = true
        } else {
          this.title = '新增评分方案'
          this.$refs.addScore.disabled = false
        }
      } else {
        this.title = '新增评分方案'
        this.$refs.addScore.teacherList = []
        this.$refs.addScore.project = []
        this.$refs.addScore.appForm = {}
        this.$refs.addScore.zbCount = 0
        this.$refs.addScore.disabled = false
      }
      this.$refs.addScore.addVisible = true
    },
    detail(text) {
      this.$refs.scoreDetail.getDetail(text.id)
      this.$refs.scoreDetail.addVisible = true
    },
    categoryGet () {
      this.pageList.schoolCode = this.userInfo.schoolCode
      this.getStuCategory(this.pageList).then(res => {
        this.scorePlanList = res.data.list
        this.total = res.data.total
      })
    },
    del (type, text) {
      if (type) {
        // 启用禁用
        const req = {
          state: text.state === '1' ? '0' : '1',
          id: text.id
        }
        this.changeStuCategory(req).then(res => {
          this.$message.success('操作成功')
          this.$tools.goNext(() => {
            this.categoryGet()
          })
        })
      } else {
        // 删除
        this.delStuCategory(text.id).then(res => {
          this.$message.success('删除成功')
          this.$tools.goNext(() => {
            this.categoryGet()
          })
        })
      }
    }
  }
}
</script>
<style lang="less" scoped>
.qui-fx-f3 {
  min-width: 0px;
  flex: 3;
  position: relative;
}
.score-info{
  display: inline-block;
  width: 75px;
  color: #000;
}
</style>
