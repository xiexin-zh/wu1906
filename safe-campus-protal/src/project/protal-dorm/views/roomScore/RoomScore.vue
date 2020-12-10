<template>
  <div class="total-table page-layout qui-fx-ver">
    <a-row type="flex">
      <a-col class="tab-tree">
        <org-tree :current-tab="0" :is-select="true" :is-tab="isTab" @tree-click="handleTreeClick"></org-tree>
      </a-col>
      <a-col class="right-content qui-fx-ver">
        <search-form @search-form="search" :search-label="searchLabel"></search-form>
        <a-row id="table" class="table-top qui-fx-f1">
          <a-table
            :pagination="false"
            :rowKey="record => record.id"
            :columns="columns"
            :dataSource="scoreList"
            :scroll="{ y: tableHeight }"
          >
            <template slot="number" slot-scope="text, record, index">
              <span>{{ (pageList.page - 1) * pageList.size + (index + 1) }}</span>
            </template>
            <template slot="createDate" slot-scope="createDate">
              <span>{{ getDateTime(createDate, 1) }}</span>
            </template>
          </a-table>
        </a-row>
        <page-num v-model="pageList" :total="total" @change-page="showTableList"></page-num>
      </a-col>
    </a-row>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import mixins from '@u/mixins'
import scoreTable from '../../assets/js/table/dormScore'
import OrgTree from '../components/orgTree/OrgTree'
import PageNum from '../components/common/PageNum'
import SearchForm from '../components/common/SearchForm'
const searchLabel = [
  {
    value: 'rangeTime',
    type: 'rangeTime',
    label: '起始时间'
  }
]
export default {
  name: 'DormScore',
  components: {
    OrgTree,
    PageNum,
    SearchForm
  },
  mixins: [mixins],
  data() {
    return {
      columns: scoreTable,
      pageList: {
        page: 1,
        size: 20
      },
      searchList: {
        schoolCode: '',
        startDate: '',
        endDate: '',
        buildingCode: '',
        classCode: '',
        floorCode: '',
        gradeCode: '',
        roomCode: '',
        stageCode: ''
      },
      total: 0,
      searchLabel,
      scoreList: [],
      isTab: false
    }
  },
  computed: {},
  mounted() {},
  methods: {
    ...mapActions('dormScore', ['getScoreList']),
    async showTableList() {
      this.searchList.schoolCode = sessionStorage.getItem('schoolScheme')
      const res = await this.getScoreList({
        ...this.searchList,
        ...this.pageList
      })
      this.total = res.data.total
      this.scoreList = res.data.list
    },
    search(values) {
      this.pageList.page = 1
      this.searchList.startDate = values.rangeTime ? values.rangeTime[0] : ''
      this.searchList.endDate = values.rangeTime ? values.rangeTime[1] : ''
      this.showTableList(this.searchList)
    },
    handleTreeClick(item) {
      this.searchList.buildingCode = item.buildingCode
      this.searchList.classCode = item.classCode
      this.searchList.floorCode = item.floorCode
      this.searchList.gradeCode = item.gradeCode
      this.searchList.roomCode = item.roomCode
      this.searchList.stageCode = item.stageCode ? item.stageCode : ''
      this.showTableList()
    }
  }
}
</script>
<style lang="less" scoped></style>
