<template>
  <div class="page-layout qui-fx">
    <org-tree @select="select"></org-tree>
    <div class="qui-fx-f1 qui-fx-ver">
      <search-form is-reset @search-form="searchForm" :search-label="searchLabel">
        <div slot="left">
          <a-button icon="export" class="export-btn" @click="exportClick">导出</a-button>
        </div>
      </search-form>
      <div class="stu-overview">
        <div class="view-item" v-for="item in viewList" :key="item.id">
          <div class="item-left">
            <img :src="item.icon" alt />
          </div>
          <div class="item-right">
            <span class="view-title">{{ item.title }}</span>
            <span class="view-count" :style="`color:${item.color}`">{{ item.count }}</span>
          </div>
        </div>
      </div>
      <table-list isZoom :page-list="pageList" :columns="columns" :table-list="recordList"></table-list>
      <page-num v-model="pageList" :total="total" @change-page="showList"></page-num>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import TableList from '@c/TableList'
import SearchForm from '@c/SearchForm'
import PageNum from '@c/PageNum'
import Tools from '@u/tools'
import OrgTree from '@c/OrgTree'
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
      }
    ],
    placeholder: '请输入'
  },
  {
    value: 'dateTime',
    type: 'singleTime',
    label: '日期',
    initialValue: true
  }
]
const columns = [
  {
    title: '序号',
    width: '15%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '姓名',
    dataIndex: 'userName',
    width: '15%'
  },
  {
    title: '性别',
    dataIndex: 'sex',
    width: '10%',
    customRender: text => {
      return Tools.getSex(text)
    }
  },
  {
    title: '部门',
    dataIndex: 'orgName',
    width: '15%'
  },
  {
    title: '手机号',
    dataIndex: 'mobile',
    width: '15%'
  },
  {
    title: '外出时间',
    dataIndex: 'outTime',
    width: '15%',
    customRender: text => {
      if (!text) {
        return '未记录'
      } else {
        return Tools.getDate(text)
      }
    }
  },
  {
    title: '回归时间',
    dataIndex: 'returnTime',
    width: '15%',
    customRender: text => {
      if (!text) {
        return '未归'
      } else {
        return Tools.getDate(text)
      }
    }
  }
]
export default {
  name: 'OutRecord',
  components: {
    TableList,
    SearchForm,
    PageNum,
    OrgTree
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
      userType: '',
      accessType: '',
      startTime: '',
      endTime: '',
      viewList: []
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  mounted() {
    this.showList()
  },
  methods: {
    ...mapActions('home', ['getrecordCoutn', 'getoutRecord', 'exportRecord']),
    exportClick() {
      this.exportRecord({
        ...this.searchList,
        name: '外出记录'
      })
    },
    async showList() {
      this.searchList = {
        ...this.pageList,
        searchKey: this.searchKey || '',
        date: this.date || this.$tools.getDate('', '-').substr(0, 10),
        schoolCode: this.userInfo.schoolCode,
        orgCode: this.orgCode || '',
        size: 5000
      }
      const res = await this.getoutRecord(this.searchList)
      const con = await this.getrecordCoutn(this.searchList)
      this.recordList = res.data.list
      this.total = res.data.total
      this.viewList = [
        {
          id: 'planCount',
          title: '上班中途外出（人）',
          count: con.data.sum === null ? 0 : con.data.sum,
          icon: require('../../assets/img/icon_shangbanzhongtuwaichu.png'),
          color: '#4D4CAC'
        },
        {
          id: 'applyCount',
          title: '外出已归（人）',
          count: con.data.returnNum === null ? 0 : con.data.returnNum,
          icon: require('../../assets/img/icon_waichuyigui.png'),
          color: '#00A35F'
        },
        {
          id: 'newStuCount',
          title: '外出未归（人）',
          count: con.data.unReturnNum === null ? 0 : con.data.unReturnNum,
          icon: require('../../assets/img/waichuweigui.png'),
          color: '#FF5454'
        }
      ]
    },
    searchForm(values) {
      this.searchKey = values.keyword
      this.date = values.dateTime
      this.showList()
    },
    select(item) {
      this.pageList.page = 1
      this.orgCode = item.code
      this.showList()
    }
  }
}
</script>
<style lang="less" scoped>
.stu-overview {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30px 30px;

  .view-item {
    display: flex;
    width: 460px;
    height: 108px;
    margin-left: 10px;
    padding: 0 10px;
    box-sizing: border-box;
    background-color: #fff;
    box-shadow: 0px 2px 9px 0px rgba(0, 0, 0, 0.06);
    border-radius: 9px;

    .item-left {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;

      img {
        width: 76px;
        height: 76px;
      }
    }

    .item-right {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      flex: 1;
      font-family: PingFang SC;
      color: #333333;

      .view-title {
        font-size: 16px;
        font-weight: 500;
      }

      .view-count {
        font-size: 35px;
        font-weight: bold;
      }
    }
  }
  .view-item:first-child {
    margin-left: 0;
  }
}
</style>
