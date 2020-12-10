<template>
  <div class="home page-layout qui-fx-ver">
    <sign-record
      title="签到统计"
      type="site"
      ref="signRecord"
      :id="id"
      v-model="signTag"
      v-if="signTag"
    ></sign-record>
    <search-form is-reset @search-form="searchForm" :search-label="searchLabel">
      <div slot="left">
        <a-button icon="plus" class="add-btn" @click.stop="addBooking('0')">预订</a-button>
      </div>
    </search-form>
    <table-list :page-list="pageList" :columns="columns" :table-list="bookingList">
      <template v-slot:actions="action">
        <a-tooltip placement="topLeft" title="查看" v-if="action.record.status !== '未使用'">
          <a-button
            size="small"
            class="detail-action-btn"
            icon="ellipsis"
            @click.stop="addBooking('1', action.record)"
          ></a-button>
        </a-tooltip>
        <a-tooltip placement="topLeft" title="编辑" v-if="action.record.status === '未使用'">
          <a-button
            size="small"
            class="edit-action-btn"
            icon="form"
            @click.stop="addBooking('2', action.record)"
          ></a-button>
        </a-tooltip>
        <!-- <a-popconfirm placement="left" okText="确定" cancelText="取消" @confirm="deleteList(action.record)" v-if="action.record.status !== '使用中'">
          <template slot="title">
            确定删除吗?
          </template>
          <a-tooltip placement="topLeft" title="删除">
            <a-button size="small" class="del-action-btn" icon="delete"></a-button>
          </a-tooltip>
        </a-popconfirm> -->
      </template>
      <template v-slot:other3="other3">
        <span>{{ other3.record.reserveDate | gmtToDate('date') }} {{ other3.record.startTime }}-{{ other3.record.endTime }}</span>
      </template>
      <template v-slot:other2="other2">
        <a-tag v-if="other2.record.openSign === '1'" color="green" @click="showRecord(other2.record)">{{ other2.record.signNum }} / {{ other2.record.totalNum }}</a-tag>
        <span v-else>--</span>
      </template>
      <template v-slot:other1="other1">
        <a-tag
          :color="other1.record.status === '使用中' ? '#87d068' : other1.record.status === '未使用' ? '#2db7f5' : 'purple'"
        >{{ other1.record.status }}</a-tag>
      </template>
    </table-list>
    <page-num v-model="pageList" :total="total" @change-page="showList"></page-num>
  </div>
</template>

<script>
import SignRecord from '../../component/siteBooking/SignRecord'
import { mapState, mapActions } from 'vuex'
import TableList from '@c/TableList'
import PageNum from '@c/PageNum'
import SearchForm from '@c/SearchForm'
import Tools from '@u/tools'
const columns = [
  {
    title: '序号',
    width: '8%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '场地',
    dataIndex: 'placeName',
    width: '10%'
  },
  {
    title: '预订时间',
    dataIndex: 'reserveDate',
    width: '20%',
    scopedSlots: {
      customRender: 'other3'
    }
  },
  {
    title: '预订说明',
    dataIndex: 'description',
    width: '10%'
  },
  {
    title: '预订人',
    dataIndex: 'createName',
    width: '10%'
  },
  {
    title: '场地类型',
    dataIndex: 'placeType',
    width: '8%',
    customRender: text => {
      if (text === '100') {
        return '教室'
      } else if (text === '101') {
        return '宿舍'
      } else if (text === '102') {
        return '食堂'
      } else if (text === '103') {
        return '出入口'
      } else if (text === '104') {
        return '其它'
      }
    }
  },
  {
    title: '使用状态',
    dataIndex: 'status',
    width: '10%',
    scopedSlots: {
      customRender: 'other1'
    }
  },
  {
    title: '签到统计',
    dataIndex: 'openSign',
    width: '10%',
    scopedSlots: {
      customRender: 'other2'
    }
  },
  {
    title: '操作',
    width: '14%',
    scopedSlots: {
      customRender: 'action'
    }
  }
]
const searchLabel = [
  {
    value: 'rangeTime',
    type: 'rangeTime',
    label: '预订日期',
    customRender: text => {
      return Tools.getDate(text)
    }
  },
  {
    list: [
      {
        key: '',
        val: '全部'
      },
      {
        key: '1',
        val: '未使用'
      },
      {
        key: '2',
        val: '使用中'
      },
      {
        key: '3',
        val: '已结束'
      }
    ],
    value: 'status',
    type: 'select',
    label: '使用状态'
  },
  {
    value: 'description',
    type: 'input',
    label: '预订说明',
    placeholder: '请输入预订说明'
  }
]
export default {
  name: 'SiteBooking',
  components: {
    SearchForm,
    PageNum,
    TableList,
    SignRecord
  },
  data() {
    return {
      columns,
      searchLabel,
      searchList: {},
      pageList: {
        page: 1,
        size: 20
      },
      total: 0,
      bookingList: [],
      title: '添加预订',
      signTag: false,
      searchObj: {},
      id: 0
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  mounted() {
    this.showList()
  },
  methods: {
    ...mapActions('home', ['getReserveList', 'delReserve']),
    async showList() {
      const req = {
        ...this.searchObj,
        ...this.pageList,
        schoolCode: this.userInfo.schoolCode,
        type: '1'
      }
      const res = await this.getReserveList(req)
      this.bookingList = res.data.list
      this.bookingList.map(el => {
        el.placeName = el.placeName.replace(/,/g, '-')
      })
      this.total = res.data.total
    },
    searchForm(values) {
      console.log(values)
      this.searchObj = {
        startDate: values.rangeTime ? values.rangeTime[0] : undefined,
        endDate: values.rangeTime ? values.rangeTime[1] : undefined,
        status: values.status,
        description: values.description
      }
      this.showList()
    },
    addBooking(type, record) {
      if (type !== '0') {
        this.$router.push({ path: '/siteBooking/addBooking', query: { id: record.id, type } })
      } else {
        this.$router.push({ path: '/siteBooking/addBooking', query: { type } })
      }
    },
    goDetail(record) {
    },
    async deleteList(record) {
      await this.delReserve(record.id)
      this.$message.success('删除成功')
      this.$tools.goNext(() => {
        this.showList()
      })
    },
    showRecord(record) {
      this.signTag = true
      this.id = record.id
    }
  }
}
</script>
<style lang="less" scoped></style>
