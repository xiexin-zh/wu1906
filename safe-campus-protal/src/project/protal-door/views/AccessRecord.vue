<template>
  <div class="page-layout qui-fx-ver">
    <search-form is-reset @search-form="searchForm" :search-label="searchLabel">
      <div slot="left">
        <a-button icon="export" class="export-btn" @click="exportClick">导出</a-button>
      </div>
    </search-form>
    <table-list isZoom :page-list="pageList" :columns="columns" :table-list="recordList">
      <template v-slot:other3="action">
        <a-tag color="#87d068" v-if="action.record.accessType == '1'">进</a-tag>
        <a-tag color="#666666" v-if="action.record.accessType == '2'">出</a-tag>
      </template>
    </table-list>
    <page-num v-model="pageList" :total="total" @change-page="showList"></page-num>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import TableList from '@c/TableList'
import SearchForm from '@c/SearchForm'
import PageNum from '@c/PageNum'
import Tools from '@u/tools'
const searchLabel = [
  {
    value: 'keyword',
    initValue: '',
    type: 'selectInput',
    selectType: [
      {
        key: 'userName',
        val: '姓名'
      },
      {
        key: 'mobile',
        val: '手机号'
      },
      {
        key: 'userNo',
        val: '学号/工号'
      }
    ],
    placeholder: '请输入'
  },
  {
    list: [
      // 选择列表项，select控件必传
      {
        key: '',
        val: '全部'
      },
      {
        key: 4,
        val: '教职工'
      },
      {
        key: 8,
        val: '学生'
      },
      // {
      //   key: 16,
      //   val: '家长'
      // },
      {
        key: 32,
        val: '访客'
      }
    ],
    value: 'userType',
    type: 'select',
    label: '人员类型',
    scopedSlots: {
      customRender: 'other5'
    }
  },
  {
    value: 'placeName', // 表单属性
    type: 'input', // 表单类型
    label: '出入地点', // 表单label值
    placeholder: '请输入出入地点' // 表单默认值(非必选字段)
  },
  {
    list: [
      // 选择列表项，select控件必传
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
    value: 'accessType',
    type: 'select',
    label: '出入类型'
  },
  {
    value: 'rangeTime', // 日期区间
    type: 'rangeTime',
    label: '起始时间'
  }
]
const columns = [
  {
    title: '序号',
    width: '5%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '姓名',
    dataIndex: 'userName',
    width: '8%'
  },
  {
    title: '性别',
    dataIndex: 'gender',
    width: '5%',
    customRender: text => {
      return Tools.getSex(text)
    }
  },
  {
    title: '人员类型',
    dataIndex: 'userType',
    width: '10%',
    customRender: text => {
      let arr = text.split(',')
      arr = arr.map(el => {
        if (el === '1') {
          return '超级管理员'
        } else if (el === '2') {
          return '管理员'
        } else if (el === '4') {
          return '教职工'
        } else if (el === '8') {
          return '学生'
        } else if (el === '16') {
          return '家长'
        } else if (el === '32') {
          return '访客'
        }
      })
      return arr.join(',')
    }
  },
  {
    title: '学号/工号',
    dataIndex: 'userNo',
    width: '8%'
  },
  {
    title: '手机号',
    dataIndex: 'mobile',
    width: '10%'
  },
  {
    title: '温度',
    dataIndex: 'temperature',
    width: '8%'
  },
  {
    title: '出入地点',
    dataIndex: 'accessPlace',
    width: '8%'
  },
  // {
  //   title: '出入类型',
  //   dataIndex: 'accessType',
  //   width: '8%',
  //   customRender: text => {
  //     return parseInt(text) === 1 ? '进' : '出'
  //   }
  // },
  {
    title: '出入类型',
    width: '8%',
    scopedSlots: {
      customRender: 'other3'
    }
  },
  {
    title: '出入时间',
    dataIndex: 'accessTime',
    width: '10%',
    customRender: text => {
      return Tools.getDate(text)
    }
  },
  {
    title: '底照',
    dataIndex: 'userPhoto',
    width: '10%',
    scopedSlots: {
      customRender: 'photoPic'
    }
  },
  {
    title: '抓拍照',
    dataIndex: 'snapPhoto',
    width: '10%',
    scopedSlots: {
      customRender: 'snapPic'
    }
  }
]
export default {
  name: 'AccessRecord',
  components: {
    TableList,
    SearchForm,
    PageNum
  },
  data() {
    return {
      columns,
      searchLabel,
      total: 0,
      pageList: {
        page: 1,
        size: 20
      },
      recordList: [],
      searchList: {
        pageNum: '',
        pageSize: '',
        schoolCode: ''
      },
      keyword: '',
      userType: '',
      accessType: '',
      startTime: '',
      endTime: ''
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  mounted() {
    this.showList()
  },
  methods: {
    ...mapActions('home', ['getrecordList', 'downRecord']),
    exportClick() {
      this.downRecord({
        schoolCode: this.userInfo.schoolCode,
        keyword: this.keyword,
        userType: this.userType,
        accessType: this.accessType,
        startTime: this.startTime,
        endTime: this.endTime,
        name: '出入记录'
      })
    },
    async showList(searchObj = {}) {
      this.searchList.pageNum = this.pageList.page
      this.searchList.pageSize = this.pageList.size
      this.searchList.schoolCode = this.userInfo.schoolCode
      this.searchList = Object.assign(this.searchList, searchObj)
      const res = await this.getrecordList(this.searchList)
      this.recordList = res.data.list
      this.total = res.data.total
    },
    searchForm(values) {
      this.pageList.pageNum = 1
      this.keyword = values.keyword
      this.userType = values.userType
      this.accessType = values.accessType
      this.placeName = values.placeName
      this.startTime = values.rangeTime[0]
      this.endTime = values.rangeTime[1]
      const searchObj = {
        placeName: this.placeName,
        keyword: this.keyword,
        userType: this.userType,
        accessType: this.accessType,
        startTime: this.startTime,
        endTime: this.endTime
      }
      this.showList(searchObj)
    }
  }
}
</script>
<style lang="less" scoped></style>
