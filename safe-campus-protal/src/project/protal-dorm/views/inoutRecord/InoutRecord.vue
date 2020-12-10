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
            :dataSource="recordList"
            :scroll="{ y: tableHeight }"
          >
            <template slot="number" slot-scope="text, record, index">
              <span>{{ (pageList.page - 1) * pageList.size + (index + 1) }}</span>
            </template>
            <template slot="gender" slot-scope="gender">
              <span>{{ getSex(gender) }}</span>
            </template>
            <template slot="inOrOut" slot-scope="inOrOut">
              <span>{{ getInOrOut(inOrOut) }}</span>
            </template>
            <template slot="recordType" slot-scope="recordType">
              <span>{{ getRecord(recordType) }}</span>
            </template>
            <template slot="recordTime" slot-scope="recordTime">
              <span>{{ getDateTime(recordTime, 1) }}</span>
            </template>
            <template slot="photoSrc" slot-scope="photoSrc">
              <div class="person-bg-img">
                <img :src="photoSrc" class="photo-bg-img" alt="" />
              </div>
            </template>
            <template slot="snapSrc" slot-scope="snapSrc">
              <a-popover placement="left">
                <template slot="content">
                  <img :src="snapSrc" alt="" style="height:300px;width:300px" />
                </template>
                <div class="person-bg-img">
                  <img :src="snapSrc" class="photo-bg-img" alt="" />
                </div>
              </a-popover>
            </template>
          </a-table>
        </a-row>
        <page-num v-model="pageList" :total="total" @change-page="showTableList"></page-num>
      </a-col>
    </a-row>
  </div>
</template>
<script>
import SearchForm from '../components/common/SearchForm'
import { mapState, mapActions } from 'vuex'
import mixins from '@u/mixins'
import inoutTable from '../../assets/js/table/inoutTable'
import OrgTree from '../components/orgTree/OrgTree'
import PageNum from '../components/common/PageNum'
const searchLabel = [
  {
    value: 'userName',
    type: 'input',
    label: '姓名',
    placeholder: '请输入姓名'
  },
  {
    list: [
      {
        key: '',
        val: '全部'
      },
      {
        key: 1,
        val: '进'
      },
      {
        key: 2,
        val: '出'
      }
    ],
    value: 'inOrOut',
    type: 'select',
    label: '出入类型'
  },
  {
    list: [
      {
        key: '',
        val: '全部'
      },
      {
        key: '1',
        val: '抓拍'
      },
      {
        key: '100',
        val: '宿管补卡'
      },
      {
        key: '2',
        val: '班牌签到'
      }
    ],
    value: 'recordType',
    type: 'select',
    label: '记录类型'
  },
  {
    value: 'rangeTime',
    type: 'rangeTime',
    label: '起始时间'
  }
]
export default {
  name: 'InoutRecord',
  mixins: [mixins],
  components: {
    OrgTree,
    SearchForm,
    PageNum
  },
  data() {
    return {
      searchLabel,
      columns: inoutTable,
      pageList: {
        page: 1,
        size: 20
      },
      searchList: {
        schoolCode: '',
        userName: '',
        inOrOut: '',
        recordType: '',
        startDate: '',
        endDate: '',
        buildingCode: '',
        classCode: '',
        floorCode: '',
        gradeCode: '',
        roomCode: '',
        stageCode: null
      },
      total: 0,
      recordList: [],
      isTab: true
    }
  },
  computed: {
    ...mapState('home', 'userInfo')
  },
  mounted() {
    // this.showTableList()
    this.schoolType = JSON.parse(window.sessionStorage.getItem('loginInfo')).schoolType
    if ((this.schoolType === '8' || this.schoolType === '9') && this.columns[5].dataIndex !== 'gradeName') {
      this.columns.splice(5, 0,
        {
          title: '专业',
          dataIndex: 'gradeName',
          width: '8%'
        })
    }
  },
  methods: {
    ...mapActions('inoutRecord', ['getRecordList']),
    async showTableList() {
      this.searchList.schoolCode = sessionStorage.getItem('schoolScheme')
      const res = await this.getRecordList({
        ...this.searchList,
        ...this.pageList
      })
      this.total = res.data.total
      this.recordList = res.data.list
    },
    search(values) {
      this.pageList.page = 1
      this.searchList.userName = values.userName
      this.searchList.inOrOut = values.inOrOut
      this.searchList.startDate = values.rangeTime ? values.rangeTime[0] : ''
      this.searchList.endDate = values.rangeTime ? values.rangeTime[1] : ''
      this.searchList.recordType = values.recordType
      this.showTableList(this.searchList)
    },
    handleTreeClick(item) {
      console.log('itemitemitem',item)
      this.searchList = this.concatObj(this.searchList, item)
      // this.searchList.buildingCode = item.buildingCode
      // this.searchList.classCode = item.classCode
      // this.searchList.floorCode = item.floorCode
      // this.searchList.gradeCode = item.gradeCode
      // this.searchList.roomCode = item.roomCode
      // this.searchList.stageCode = item.stageCode ? item.stageCode : ''
      this.showTableList()
    },
    getInOrOut(type) {
      if (type === '1') {
        return '进'
      } else if (type === '2') {
        return '出'
      } else {
        return '全部'
      }
    },
    getRecord(type) {
      if (type === '1') {
        return '抓拍'
      } else if (type === '2') {
        return '班牌签到'
      } else if (type === '100') {
        return '宿管补卡'
      } else {
        return '全部'
      }
    }
  }
}
</script>

<style lang="less" scoped>
.search-form {
  height: 60px;
}
</style>
