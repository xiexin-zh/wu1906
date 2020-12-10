<template>
  <div class="page-layout bg-fff qui-fx u-padd">
    <div class="tree-box">
      <a-tree
        v-if="orgData.length > 0"
        :treeData="orgData"
        :expanded-keys="expandedKeys"
        :selected-keys="selectedKeys"
        @select="select"
      >
      </a-tree>
    </div>
    <div class="qui-fx-f1 qui-fx-ver">
      <search-form @search-form="searchForm" :search-label="searchLabel"></search-form>
      <table-list :page-list="pageList" :columns="columns" :table-list="scoreList">
        <template v-slot:other1="other1">
          <a-tag
            :color="other1.record.riskLevel === '1' ? '#ff5454'
              : other1.record.riskLevel === '2' ? '#f5772d'
                : other1.record.riskLevel === '3' ? '#f5b111'
                  :other1.record.riskLevel === '4' ? '#0084ff' :
                    ''">{{ other1.record.riskLevel | levelType }}</a-tag>
        </template>
      </table-list>
      <page-num :jumper="false" v-model="pageList" :total="total" @change-page="_riskModelList"></page-num>
    </div>
  </div>
</template>

<script>
import SearchForm from '@c/SearchForm'
import TableList from '@c/TableList'
import PageNum from '@c/PageNum'
import { mapActions } from 'vuex'
const searchLabel = [
  {
    value: 'riskContent',
    type: 'input',
    label: '潜在风险',
    placeholder: '请输入'
  }
]
const columns = [
  {
    title: '序号',
    width: '8%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '所属区域',
    dataIndex: 'area',
    width: '15%'
  },
  {
    title: '风险分类',
    dataIndex: 'categoryName',
    width: '15%'
  },
  {
    title: '检查对象',
    dataIndex: 'checkObject',
    width: '10%'
  },
  {
    title: '潜在风险',
    dataIndex: 'riskContent',
    width: '15%'
  },
  {
    title: '风险等级',
    dataIndex: 'riskLevel',
    width: '10%',
    scopedSlots: {
      customRender: 'other1'
    }
  },
  {
    title: '事故类型',
    dataIndex: 'riskType',
    width: '15%'
  }
]
export default {
  name: 'RiskModel',
  components: {
    SearchForm,
    TableList,
    PageNum
  },
  data() {
    return {
      expandedKeys: ['0'],
      selectedKeys: [],
      noData: false,
      orgData: [{
        title: '风险清单',
        key: '0',
        children: []
      }],
      isLoad: false,
      total: 0,
      columns,
      scoreList: [],
      pageList: {
        page: 1,
        size: 20
      },
      searchText: {
        riskContent: ''
      },
      searchLabel,
      subjectName: []
    }
  },
  mounted() {
    this.showList()
  },
  methods: {
    ...mapActions('home', ['riskCategory', 'riskModelList']),
    async showList () {
      const res = await this.riskCategory()
      const data = res.data.map(el => {
        return {
          title: el.categoryName,
          key: el.categoryCode
        }
      })
      this.orgData[0].children = data
      this.selectedKeys[0] = data[0].key
      this.searchText.categoryCode = data[0].key
      this._riskModelList()
    },
    async _riskModelList () {
      this.searchText = Object.assign(this.searchText, this.pageList)
      const res = await this.riskModelList(this.searchText)
      this.scoreList = res.data.records
      this.total = res.data.total
    },
    async select(item) {
      console.log(item)
      this.selectedKeys = item
      this.pageList.page = 1
      this.pageList.size = 20
      this.searchText.categoryCode = item[0]
      this._riskModelList()
    },
    searchForm(values) {
      this.searchText.riskContent = values.riskContent
      this.pageList.page = 1
      this.pageList.size = 20
      this._riskModelList()
    }
  }
}
</script>

<style lang="less" scoped>
.tree-box {
  width: 240px;
  margin-top: 10px;
}
</style>
