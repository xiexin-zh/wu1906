<template>
  <div class="page-layout qui-fx-ver">
    <div class="content pos-box bg-fff">
      <div class="qui-fx qui-fx-jsb" style="width:100%;height:100%">
        <div class="left u-padd-l30 u-padd-t30 u-padd-b40">
          <grade-tree @select="select" :treeData="treeData"></grade-tree>
        </div>
        <div class="right qui-fx-ver qui-fx-f1" style="padding-right: 10px">
          <search-form is-reset @search-form="searchForm" :search-label="knowledgeSearchLabel"> </search-form>
          <table-list
            is-zoom
            v-model="chooseList"
            :page-list="pageList"
            :columns="knowledgeColumns"
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
              <a-tooltip placement="topLeft" title="使用统计">
                <a-button
                  size="small"
                  class="export-all-btn"
                  icon="export"
                  @click="getStatistics(action.record)"
                ></a-button>
              </a-tooltip>
            </template>
          </table-list>
          <page-num v-model="pageList" :total="total" @change-page="showList"></page-num>
        </div>
      </div>
      <a-modal width="600px" title="使用统计" v-model="visible" :footer="null" @cancel="close">
        <div class="qui-fx-ver statistic" v-if="Object.keys(statisticsData).length">
          <div class="number u-mar-b10">使用总数：{{ statisticsData.count }}</div>
          <div class="number u-mar-b20">最近一次使用记录：{{ statisticsData.recent }}</div>
          <a-table
            :rowKey="(record, index) => index"
            :columns="columnsUrl"
            :pagination="false"
            :data-source="statisticsData.records"
            bordered
          >
            <template slot="index" slot-scope="text, record, index">
              {{ statisticsData.records.length - index }}
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
import { knowledgeSearchLabel } from '../../assets/js/searchLabel.js'
import { knowledgeColumns } from '../../assets/js/tableColumns'
import GradeTree from '../../component/GradeTree'
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
  name: 'Knowledge',
  components: {
    TableList,
    PageNum,
    SearchForm,
    GradeTree
  },
  data() {
    return {
      columnsUrl,
      visible: false,
      categoryId: '', // 树选择的id
      knowledgeSearchLabel,
      knowledgeColumns: [],
      total: 0,
      treeData: [],
      pageList: {
        page: 1,
        size: 20
      },
      chooseList: [], // 当有选择项时，被选中的项，返回每项的唯一id
      findList: [],
      searchList: {},
      // 使用统计弹框
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
    ...mapState('home', ['userInfo'])
  },
  async created() {
    this._treeView()
    this.eduCode = ''
    const newColumnsArr = JSON.parse(JSON.stringify(knowledgeColumns))
    newColumnsArr.splice(5, 0, { title: '机构来源', dataIndex: 'sourceUnit', width: '10%' })
    this.knowledgeColumns = newColumnsArr
    this.categoryId = ''
    await this.getEducode()
    await this.showList()
  },
  async mounted() {},
  methods: {
    ...mapActions('home', [
      'klgGreatList',
      'batchRemove',
      'batchRemoveAll',
      'treeView',
      'statistics',
      'pageStatistics',
      'cancelBoutique',
      'getEduCode'
    ]),
    // 获取上级教育局code
    async getEducode() {
      const res = await this.getEduCode({ schoolCode: this.userInfo.schoolCode })
      this.eduCode = res.data.schoolCode
    },
    async showList() {
      const req = {
        categoryId: this.categoryId,
        ...this.pageList,
        ...this.searchList,
        eduCode: this.eduCode
      }
      const res = await this.klgGreatList(req)
      this.findList = res.data.records
      this.total = res.data.total
    },
    async _treeView() {
      const res = await this.treeView()
      this.treeData = res.data
    },
    searchForm(values) {
      this.searchList = values
      this.showList()
    },
    async delBatch(record) {
      await this.batchRemove(record.id)
      this.showList()
    },

    // 选中categoryId
    select(id) {
      this.categoryId = id
      this.showList()
    },
    // 查看预览
    preview(record) {
      this.$router.push({
        path: '/knowledgeBout/preview',
        query: {
          id: record ? record.id : ''
        }
      })
    },
    // 查看统计
    getStatistics(record) {
      this.visible = true
      this.StatisticsId = record.id
      this.getStatisticsData(record.id)
    },
    // 获取查看统计数据 总数，最近一次记录数据
    async getStatisticsData(id) {
      const req = {
        id: id,
        schoolCode: this.userInfo.schoolCode,
        source: '3'
      }
      const res1 = await this.statistics(req)
      this.statisticsData = res1.data
      this._pageStatistics()
    },
    // 获取查看统计数据分页table数据
    async _pageStatistics() {
      const req = {
        ...this.statisticsPageList,
        id: this.StatisticsId,
        schoolCode: this.userInfo.schoolCode,
        source: '3'
      }
      const res = await this.pageStatistics(req)
      this.statisticsData = Object.assign({}, this.statisticsData, res.data)
    },
    //
    async refining(record) {
      await this.cancelBoutique(record.id)
      this.$message.success('操作成功')
      this.showList()
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
@deep: ~'>>>';
.statistic {
  @{deep} .ant-table-thead > tr > th {
    background: #ecf5ff !important;
  }
}
</style>
