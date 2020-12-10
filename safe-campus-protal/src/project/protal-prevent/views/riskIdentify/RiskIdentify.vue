<template>
  <div class="page-layout qui-fx-ver">
    <search-form is-reset @search-form="searchForm" :search-label="identify.searchLabel">
      <div slot="left">
        <a-button type="primary" icon="plus" @click="add(0)">添加</a-button>
        <a-button icon="delete" class="del-btn mar-l10" @click="dels">批量删除</a-button>
      </div>
    </search-form>
    <table-list
      is-check
      :page-list="pageList"
      :columns="identify.columns"
      :table-list="classList"
      v-model="chooseList"
      @clickRow="clickRow"
      @selectAll="selectAll">
      <template v-slot:actions="action">
        <div>
          <a-tooltip placement="topLeft" title="编辑" v-if="action.record.status === '1'">
            <a-button size="small" class="edit-action-btn" icon="form" @click.stop="add(1, action)"></a-button>
          </a-tooltip>
          <a-popconfirm placement="left" okText="确定" cancelText="取消" @confirm="publish(action)" v-if="action.record.status === '1'">
            <template slot="title"> 发布以后不可编辑、删除，确认发布？ </template>
            <a-tooltip placement="topLeft" title="发布">
              <a-button size="small" class="play-action-btn" icon="play-circle" ></a-button>
            </a-tooltip>
          </a-popconfirm>
          <a-tooltip placement="topLeft" title="查看" v-if="action.record.status !== '1'" @click.stop="add(2, action)">
            <a-button size="small" class="copy-action-btn" icon="copy"></a-button>
          </a-tooltip>
          <a-popconfirm placement="left" okText="确定" cancelText="取消" @confirm="del(action)" v-if="action.record.status === '1'">
            <template slot="title"> 确定删除该风险辨识记录吗？ </template>
            <a-tooltip placement="topLeft" title="删除">
              <a-button size="small" class="del-action-btn" icon="delete"></a-button>
            </a-tooltip>
          </a-popconfirm>
        </div>
      </template>
    </table-list>
    <page-num v-model="pageList" :total="total" @change-page="showList"></page-num>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import TableList from '@c/TableList'
import PageNum from '@c/PageNum'
import SearchForm from '@c/SearchForm'
import identify from '../../assets/js/table/identify'

export default {
  name: 'RiskIdentify',
  components: {
    TableList,
    PageNum,
    SearchForm
  },
  data() {
    return {
      identify,
      total: 0,
      pageList: {
        page: 1,
        size: 20
      },
      classList: [],
      form: this.$form.createForm(this),
      chooseList: [],
      formStatus: false,
      title: '新增分类',
      taskSearch: {}
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  mounted() {
    this.showList()
  },
  methods: {
    ...mapActions('home', ['riskIdentifyList', 'delRiskIdentify', 'delsRiskIdentify', 'publishRiskIdentify']),
    async showList() {
      this.taskSearch.schoolCode = this.userInfo.schoolCode
      this.taskSearch = Object.assign(this.taskSearch, this.pageList)
      const res = await this.riskIdentifyList(this.taskSearch)
      this.classList = res.data.records
      this.total = res.data.total
    },
    changePage() {
      this.pageList.page = 1
      this.pageList.size = 20
      this.showList()
    },
    searchForm(values) {
      this.taskSearch = Object.assign(this.taskSearch, values)
      this.pageList.page = 1
      this.pageList.size = 20
      this.showList()
    },
    async add(type, record) {
      this.$router.push({
        path: '/riskIdentify/addIdentify',
        query: {
          id: record ? record.record.id : '',
          type: type
        }
      })
    },
    del(record) {
      this.delRiskIdentify(record.record.id).then(res => {
        this.$message.success('操作成功')
        this.$tools.goNext(() => {
          this.pageList.size = 20
          this.pageList.page = 1
          this.showList()
          this.chooseList = []
        })
      })
    },
    dels() {
      if (this.chooseList.length === 0) {
        this.$message.warning('请选择要删除的风险辨识记录')
        return false
      }
      this.$tools.delTip('确定删除选中的风险辨识记录吗？', () => {
        this.delsRiskIdentify(this.chooseList).then(res => {
          this.$message.success('操作成功')
          this.$tools.goNext(() => {
            this.showList()
            this.chooseList = []
          })
        })
      })
    },
    publish(record) {
      this.publishRiskIdentify(record.record.id).then(res => {
        this.$message.success('操作成功')
        this.$tools.goNext(() => {
          this.pageList.size = 20
          this.pageList.page = 1
          this.showList()
        })
      })
    },
    selectAll(item, type) {
      if (type) {
        this.totalList = this.totalList.concat(item)
      } else {
        item.forEach(item => {
          const index = this.totalList.findIndex(list => {
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
        const index = this.totalList.findIndex(list => list.id === item.id)
        this.totalList.splice(index, 1)
      }
    }
  }
}
</script>
<style lang="less" scoped></style>
