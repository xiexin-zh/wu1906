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
      <search-form @search-form="searchForm" :search-label="assess.searchLabel"></search-form>
      <table-list :page-list="pageList" :columns="assess.columns" :table-list="scoreList">
        <template v-slot:other1="other1">
          <div class="risk" @click="modify(other1)">{{ other1.record.riskContent }}</div>
        </template>
        <template v-slot:actions="action">
          <div>
            <a-tooltip placement="topLeft" title="审核" v-if="action.record.riskLevel && action.record.auditStatus === '1'">
              <a-button size="small" class="edit-action-btn" icon="form" @click.stop="check(1, action)"></a-button>
            </a-tooltip>
            <a-tooltip placement="topLeft" title="审核详情" v-if="action.record.auditStatus !== '1'" @click="check(1, action)">
              <a-button size="small" class="copy-action-btn" icon="copy"></a-button>
            </a-tooltip>
            <a-tooltip placement="topLeft" title="上报隐患">
              <a-button size="small" icon="plus" class="add-btn" @click.stop="check(0, action.record.id)"></a-button>
            </a-tooltip>
          </div>
        </template>
        <template v-slot:other2="other2">
          <a-tag
            :color="other2.record.riskLevel === '1' ? '#ff5454'
              : other2.record.riskLevel === '2' ? '#f5772d'
                : other2.record.riskLevel === '3' ? '#f5b111'
                  :other2.record.riskLevel === '4' ? '#0084ff' :
                    ''">{{ other2.record.riskLevel | levelType }}</a-tag>
        </template>
      </table-list>
      <page-num v-model="pageList" :total="total" @change-page="_riskAssessList"></page-num>
    </div>
    <check-assess
      ref="checkAssess"
      is-radio
      v-if="checkTag"
      v-model="checkTag"
      :methodCode="methodCode"
      :auditStatus="auditStatus"
      :id="id"
      @updata="checkAssess"
    ></check-assess>
  </div>
</template>

<script>
import SearchForm from '@c/SearchForm'
import TableList from '@c/TableList'
import PageNum from '@c/PageNum'
import { mapState, mapActions } from 'vuex'
import assess from '../../assets/js/table/assess'
import CheckAssess from '../../component/CheckAssess'
export default {
  name: 'RiskAssess',
  components: {
    SearchForm,
    TableList,
    PageNum,
    CheckAssess
  },
  data() {
    return {
      assess,
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
      scoreList: [],
      pageList: {
        page: 1,
        size: 20
      },
      searchText: {
        riskContent: ''
      },
      subjectName: [],
      checkTag: false,
      methodCode: '',
      auditStatus: '',
      id: ''
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  mounted() {
    this.showList()
  },
  methods: {
    ...mapActions('home', ['riskCategory', 'riskAssessList']),
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
      this._riskAssessList()
    },
    async _riskAssessList () {
      this.searchText = Object.assign(this.searchText, this.pageList)
      this.searchText.schoolCode = this.userInfo.schoolCode
      const res = await this.riskAssessList(this.searchText)
      this.scoreList = res.data.records
      this.total = res.data.total
    },
    async select(item) {
      this.selectedKeys = item
      this.pageList.page = 1
      this.pageList.size = 20
      this.searchText.categoryCode = item[0]
      this._riskAssessList()
    },
    searchForm(values) {
      this.searchText.riskContent = values.riskContent
      this.pageList.page = 1
      this.pageList.size = 20
      this._riskAssessList()
    },
    check(type, record) {
      console.log('record', record)
      if (type) {
        this.checkTag = true
        this.id = record.record.id
        this.methodCode = record.record.methodCode
        this.auditStatus = record.record.auditStatus
      } else {
        this.$router.push({
          path: '/riskAssess/addFind'
        })
      }
    },
    checkAssess() {
      this.checkTag = false
      this.selectedKeys = [this.orgData[0].children[0].key]
      this.showList()
    },
    modify (record) {
      console.log('record', record)
      this.$router.push({
        path: '/riskAssess/addAssess',
        query: {
          id: record.record.id,
          riskLevel: record.record.riskLevel,
          accidentType: record.record.accidentType,
          checkObject: record.record.checkObject,
          riskContent: record.record.riskContent,
          name: record.record.name,
          methodCode: record.record.methodCode,
          auditStatus: record.record.auditStatus
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.tree-box {
  width: 240px;
  margin-top: 10px;
}
.risk {
  color: #9698d6;
  cursor: pointer;
}
</style>
