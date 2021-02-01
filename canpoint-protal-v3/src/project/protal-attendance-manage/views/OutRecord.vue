<template>
  <div class="out-record page-layout u-fx u-type-white-bg">
    <div class="left-tree layout-padd-t">
      <u-org-tree @select="select" :school="schoolCode"></u-org-tree>
    </div>
    <div class="u-fx-f1 u-fx-ver">
      <div class="layout-padd">
        <u-search-form :search-label="searchLabel" @search="search">
          <div slot="left">
            <u-space>
              <u-download title="导出" fileType="xls" fileName="出入记录" :reqObj="reqObj"></u-download>
            </u-space>
          </div>
        </u-search-form>
      </div>
      <div class="u-fx-ac u-fx-jsa record-count">
        <div
          class="u-fx-ac u-fx-jc u-padd-20 u-shadow"
          v-for="(record, index) in totalList"
          :key="index"
        >
          <div class="u-mar-r20">
            <img class="record-icon" :src="record.icon" alt />
          </div>
          <div class="u-fx-ac-jc">
            <div class="u-bold">{{ record.title }}</div>
            <div class="u-font-2 u-mar-t5 u-bold">{{ record.total || 0 }}</div>
          </div>
        </div>
      </div>
      <u-table :page-list="pageList" :columns="recordTable" :table-list="userList">
        <template v-slot:slotOne="slotOne">
          <u-type>{{ getDataState('sex', slotOne.record.sex) }}</u-type>
        </template>
      </u-table>
      <u-pagination :total="total" v-model="pageList" @change="_getRecordList"></u-pagination>
    </div>
  </div>
</template>

<script>
import { getDataState } from '@u/libs/data-state'
import searchLabel from '../search-columns/record'
import recordTable from '../table-columns/record'
import { mapState, mapActions } from 'vuex'
import sbwc from '../assets/img/icon_sbwc.png'
import wcyg from '../assets/img/icon_wcyg.png'
import wcwg from '../assets/img/icon_wcwg.png'
export default {
  name: 'OutRecord',
  components: {},
  computed: {
    ...mapState('home', ['schoolCode'])
  },
  data() {
    return {
      getDataState,
      searchLabel,
      recordTable,
      userList: [],
      total: 0,
      pageList: {
        page: 1,
        size: 20
      },
      reqObj: {
        url: '',
        method: 'post',
        params: {}
      },
      totalList: [
        {
          icon: sbwc,
          title: '上班中途外出(人)',
          total: '--'
        },
        {
          icon: wcyg,
          title: '外出已归(人)',
          total: '--'
        },
        {
          icon: wcwg,
          title: '外出未归(人)',
          total: '--'
        }
      ],
      searchKey: '',
      date: '',
      orgCode: ''
    }
  },
  mounted() {},
  methods: {
    ...mapActions('home', ['recordCount', 'getRecordList']),
    /**
     * 统计数量
     */
    async _recordCount() {
      const parmas = {
        page: 1,
        size: 5000,
        searchKey: this.searchKey,
        date: this.date,
        schoolCode: this.schoolCode,
        orgCode: this.orgCode
      }
      const res = await this.recordCount(parmas)
      this.reqObj = {
        url: '/protal_v3_11004/out/record/export',
        method: 'post',
        params: parmas
      }
      this.totalList[0].total = res.data.sum
      this.totalList[1].total = res.data.returnNum
      this.totalList[2].total = res.data.unReturnNum
    },
    /**
     * 统计列表
     */
    async _getRecordList() {
      const res = await this.getRecordList({
        ...this.pageList,
        searchKey: this.searchKey,
        date: this.date,
        schoolCode: this.schoolCode,
        orgCode: this.orgCode
      })
      this.userList = res.data.list
      this.total = res.data.total
    },
    // 搜索
    search(values) {
      this.searchKey = values.keyword
      this.date = values.dateTime
      this._recordCount()
      this._getRecordList()
    },
    select(item) {
      this.date = this.$tools.getDate(new Date().getTime(), 1)
      this.orgCode = this.orgCode === this.schoolCode ? '' : item.code
      this._recordCount()
      this._getRecordList()
    }
  }
}
</script>
<style lang="less" scoped>
.record-count {
  height: 120px;
  margin: 20px 0;
  & > div {
    width: 300px;
  }
}
.record-icon {
  width: 50px;
  height: 50px;
  display: block;
}
</style>
