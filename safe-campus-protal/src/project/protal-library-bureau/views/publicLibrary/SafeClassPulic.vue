<template>
  <div class="page-layout SafeClassItem qui-fx-ver">
    <div class="content pos-box bg-fff">
      <div class="qui-fx qui-fx-jsb" style="width:100%;height:100%">
        <div class="left u-padd-l30 u-padd-t30 u-padd-b40">
          <grade-tree @select="select" :treeData="treeData"></grade-tree>
        </div>
        <div class="right qui-fx-ver qui-fx-f1" style="padding-right: 10px">
          <search-form is-reset @search-form="searchForm" :search-label="safeClassItemLabel"> </search-form>
          <table-list
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
          <div class="number u-mar-b10">使用总数：{{ statisticsData.total }}</div>
          <div class="number u-mar-b20" v-if="statisticsData.records.length > 0">
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
// import { safeClassItemLabel } from '../../assets/js/searchLabel.js'
import { safeClassItemColumns } from '../../assets/js/tableColumns'
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
const safeClassItemLabel = [
  {
    value: 'section', // 表单属性
    type: 'select', // 表单类型
    label: '适用学段', // 表单label值
    list: [
      {
        key: '',
        val: '全部'
      },
      {
        key: '1',
        val: '幼儿园'
      },
      {
        key: '2',
        val: '小学低年级'
      },
      {
        key: '3',
        val: '小学高年级'
      },
      {
        key: '4',
        val: '初中'
      },
      {
        key: '5',
        val: '高中'
      }
    ]
  },
  {
    value: 'name', // 表单属性
    type: 'input', // 表单类型
    label: '课堂名称', // 表单label值
    placeholder: '请输入课堂名称' // 表单默认值(非必选字段)
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
  async mounted() {
    this.categoryId = ''
    await this._treeView()
    await this.showList()
  },
  methods: {
    ...mapActions('home', [
      'claroomPublicList',
      'pageClassStatistics',
      'claroomRemove',
      'claroomRemoves',
      'treeView',
      'statistics',
      'pageStatistics'
    ]),
    async showList() {
      const req = {
        categoryId: this.categoryId,
        ...this.pageList,
        ...this.searchList
      }
      const res = await this.claroomPublicList(req)
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

    // 选中categoryId
    select(id) {
      this.categoryId = id
      this.showList()
    },
    // 查看课堂详情
    preview(record) {
      this.$router.push({
        path: '/safeClassPulic/previewClass',
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
        source: '2'
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
