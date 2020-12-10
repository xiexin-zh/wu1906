<template>
  <div class="page-layout SafeClassItem qui-fx-ver">
    <div class="content pos-box bg-fff">
      <div class="qui-fx qui-fx-jsb" style="width:100%;height:100%">
        <div class="left u-padd-l30 u-padd-t30 u-padd-b40">
          <grade-tree @select="select" :treeData="treeData"></grade-tree>
        </div>
        <div class="right qui-fx-ver qui-fx-f1" style="padding-right: 10px">
          <search-form is-reset @search-form="searchForm" :search-label="safeClassItemLabel">
            <div slot="right">
              <a-button icon="del" class="add-action-btn u-mar-l20" @click="delBatchAll">批量删除</a-button>
              <a-button icon="plus" class="add-action-btn u-mar-l20" @click="add(0)">添加课堂</a-button>
            </div>
          </search-form>
          <table-list
            is-check
            is-zoom
            v-model="chooseList"
            :page-list="pageList"
            :columns="safeClassItemColumns"
            :table-list="findList"
          >
            <template v-slot:actions="action">
              <a-tooltip placement="topLeft" title="查看">
                <a-button
                  size="small"
                  class="detail-action-btn"
                  icon="ellipsis"
                  @click="preview(action.record)"
                ></a-button>
              </a-tooltip>
              <a-tooltip placement="topLeft" title="编辑">
                <a-button size="small" class="user-action-btn" icon="form" @click="add(1, action.record)"></a-button>
              </a-tooltip>
              <a-tooltip placement="topLeft" title="使用统计">
                <a-button
                  size="small"
                  class="export-all-btn"
                  icon="export"
                  @click="getStatistics(action.record)"
                ></a-button>
              </a-tooltip>
              <a-popconfirm placement="topLeft" ok-text="确定" cancel-text="取消" @confirm="delBatch(action.record)">
                <template slot="title">
                  确定删除该任务吗？
                </template>
                <a-tooltip placement="topLeft" title="删除">
                  <a-button size="small" class="del-action-btn" icon="delete"></a-button>
                </a-tooltip>
              </a-popconfirm>
            </template>
          </table-list>
          <page-num v-model="pageList" :total="total" @change-page="showList"></page-num>
        </div>
      </div>
      <a-modal width="600px" title="使用统计" v-model="visible" :footer="null" @cancel="close">
        <div class="qui-fx-ver statistic" v-if="Object.keys(statisticsData).length">
          <div class="number u-mar-b10">使用总数：{{ statisticsData.total }}</div>
          <div class="number u-mar-b20" v-if="statisticsData.records.length>0">
            最近一次使用记录：{{ statisticsData.records[0].time | gmtToDate }}-{{ statisticsData.records[0].name }}
          </div>
          <a-table
            :rowKey="(record, index) => index"
            :columns="columnsUrl"
            :pagination="false"
            :data-source="statisticsData.records"
            bordered
          >
            <template slot="index" slot-scope="text, record, index">
              {{ statisticsData.records.length-index }}
            </template>
          </a-table>
          <page-num
            v-model="statisticsPageList"
            :total="statisticsData.total"
            @change-page="_pageStatistics"
          ></page-num>
        </div>
      </a-modal>
    </div>
  </div>
</template>
<script>
import Tools from '@u/tools'
import { mapState, mapActions } from 'vuex'
import TableList from '@c/TableList'
import PageNum from '@c/PageNum'
import SearchForm from '@c/SearchForm'
import { safeClassItemLabel } from '../../../assets/js/searchLabel.js'
import { safeClassItemColumns } from '../../../assets/js/tableColumns'
import GradeTree from '../GradeTree'
const columnsUrl = [
  {
    title: '序号',
    align: 'center',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '使用人员',
    align: 'center',
    dataIndex: 'name'
  },
  {
    title: '使用时间',
    width: '40%',
    align: 'center',
    dataIndex: 'time',
    customRender: text => {
      return Tools.getDate(text)
    }
  }
]
export default {
  name: 'SafeClassItem',
  components: {
    TableList,
    PageNum,
    SearchForm,
    GradeTree
  },
  inject: ['reload'],
  data() {
    return {
      categoryId: '', // 树选择的id
      safeClassItemColumns,
      safeClassItemLabel,
      findList: [],
      chooseList: [], // 当有选择项时，被选中的项，返回每项的唯一id
      searchList: {},
      total: 0,
      treeData: [],
      pageList: {
        page: 1,
        size: 20
      },
      // 使用统计
      visible: false,
      columnsUrl,
      statisticsPageList: {
        page: 1,
        size: 10
      },
      statisticsData: {
        // record: [],
        // total: '20'
      }
    }
  },
  computed: {
    ...mapState('home', ['userInfo', 'eduCode'])
  },
  async created() {
    this.categoryId = ''
    await this._treeView()
    await this.showList()
  },
  methods: {
    ...mapActions('home', [
      'claroomLocalList',
      'claroomRemove',
      'claroomRemoves',
      'treeView',
      'statistics',
      'pageStatistics',
      'pageClassStatistics'
    ]),
    async showList() {
      const req = {
        categoryId: this.categoryId,
        ...this.pageList,
        ...this.searchList
      }
      const res = await this.claroomLocalList(req)
      this.findList = res.data.records
      this.total = res.data.total
    },
    async _treeView() {
      const res = await this.treeView()
      // this.categoryId = res.data[0].id
      this.treeData = res.data
    },
    searchForm(values) {
      this.searchList = values
      this.showList()
    },
    async delBatch(record) {
      await this.claroomRemove(record.id)
      this.showList()
    },
    async delBatchAll() {
      if (this.chooseList.length <= 0) return
      const that = this
      this.$confirm({
        title: '提示',
        content: '确定批量删除选中的课堂吗?',
        onOk() {
          that.claroomRemoves(that.chooseList).then(res => {
            that.$message.success('操作成功')
            that.reload()
          })
        },
        onCancel() {}
      })
    },
    add(type, record) {
      this.$router.push({
        path: '/safeClass/addClass',
        query: {
          id: record ? record.id : '',
          type: type
        }
      })
    },
    // 选中categoryId
    select(id) {
      this.categoryId = id
      this.showList()
    },
    // 查看课堂详情
    preview(record) {
      this.$router.push({
        path: '/safeClass/previewClass',
        query: {
          id: record ? record.id : ''
        }
      })
    },
    // 查看统计
    getStatistics(record) {
      this.visible = true
      this.StatisticsId = record.id
      this._pageStatistics()
    },
    // 统计数据分页table
    async _pageStatistics() {
      const req = {
        ...this.statisticsPageList,
        id: this.StatisticsId,
        schoolCode: this.userInfo.schoolCode,
        source: '1'
      }
      const res = await this.pageClassStatistics(req)
      this.statisticsData = Object.assign({}, this.statisticsData, res.data)
    },
    // 关闭重置数据
    close() {
      this.visible = false
      this.StatisticsId = ''
      this.statisticsData = {}
    }
  }
}
</script>
<style lang="less" scoped>
.SafeClassItem {
  height: 100%;
  width: 100%;
  .left {
    padding-bottom: 30px;
    .grade-tree {
      height: 100%;
    }
  }
}
@deep: ~'>>>';
.statistic {
  @{deep} .ant-table-thead > tr > th {
    background: #ecf5ff !important;
  }
}
</style>
