<template>
  <div class="page-layout qui-fx">
    <div class="qui-fx-f1 qui-fx-ver">
      <search-form
        isReset
        @search-form="searchForm"
        :search-label="searchLabel">
        <!-- <div slot="left">
          <a-button icon="export" type="primary">数据同步</a-button>
        </div> -->
      </search-form>
      <table-list
        is-zoom
        :page-list="pageList"
        :columns="columns"
        :table-list="recordList"
      >
        <template v-slot:other1="record">
          <a-tag :color="$tools.color(record.record.onState)" >{{ record.record.onState | onState }}</a-tag>
        </template>
        <template v-slot:other2="record">
          <a-tag :color="$tools.color(record.record.offState)" >{{ record.record.offState | onState }}</a-tag>
        </template>
        <template v-slot:actions="action">
          <a-tag @click.stop="operate(action.record, 1)" color="#2db7f5" v-if="action.record.status === -1 || action.record.status === 2">发卡</a-tag>
          <a-tag @click.stop="operate(action.record, 2)" color="#f50" v-if="action.record.status === 0">挂失</a-tag>
          <a-tag @click.stop="operate(action.record, 3)" color="#f0ad4e" v-if="action.record.status === 0 || action.record.status === 1">换卡</a-tag>
          <a-tag @click.stop="operate(action.record, 4)" color="#87d068" v-if="action.record.status === 1">解挂</a-tag>
          <a-tag @click.stop="operate(action.record, 5)" color="#8ba3e5" v-if="action.record.status === 0 || action.record.status === 1">销卡</a-tag>
        </template>
      </table-list>
      <page-num
        v-model="pageList"
        :total="total"
        @change-page="showList"></page-num>
      <card-operate
        ref="cardOperate"
        v-if="cardTag"
        v-model="cardTag"
        :okText="okText"
        :title="title"
        :cardInfo="cardInfo"
        @update="showList"
      ></card-operate>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import CardOperate from '../component/CardOperate'
import SearchForm from '@c/SearchForm'
import TableList from '@c/TableList'
import PageNum from '@c/PageNum'
const columns = [
  {
    title: '序号',
    width: '6%',
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
    title: '学号/工号',
    dataIndex: 'workNo',
    width: '10%'
  },
  {
    title: '身份',
    dataIndex: 'userIdentity',
    width: '8%',
    customRender: text => {
      if (text === 4) {
        return '教职工'
      } else if (text === 8) {
        return '学生'
      } else {
        return '未知'
      }
    }
  },
  {
    title: '班级/部门',
    dataIndex: 'orgName',
    width: '10%'
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: '8%',
    customRender: text => {
      if (text === -1) {
        return '未发卡'
      } else if (text === 0) {
        return '已发卡'
      } else if (text === 1) {
        return '已挂失'
      } else if (text === 2) {
        return '已销卡'
      }
    }
  },
  {
    title: '卡号',
    dataIndex: 'card',
    width: '10%'
  },
  {
    title: '卡类型',
    dataIndex: 'cardName',
    width: '8%'
  },
  {
    title: '账户余额',
    dataIndex: 'balance',
    width: '8%'
  },
  {
    title: '人脸照片',
    dataIndex: 'photoUrl',
    width: '8%',
    scopedSlots: {
      customRender: 'photoPic'
    }
  },
  {
    title: '操作',
    width: '15%',
    scopedSlots: {
      customRender: 'action'
    }
  }
]
const searchLabel = [
  {
    value: 'card', // 表单属性
    type: 'input', // 表单类型
    label: '卡号', // 表单label值
    placeholder: '请输入卡号' // 表单默认值(非必选字段)
  },
  {
    value: 'userName', // 表单属性
    type: 'input', // 表单类型
    label: '姓名', // 表单label值
    placeholder: '请输入姓名' // 表单默认值(非必选字段)
  },
  {
    list: [ // 选择列表项，select控件必传
      {
        key: '',
        val: '全部'
      },
      {
        key: 8,
        val: '学生'
      },
      {
        key: 4,
        val: '教职工'
      }
    ],
    value: 'userIdentity',
    type: 'select',
    label: '身份'
  },
  {
    list: [ // 选择列表项，select控件必传
      {
        key: '',
        val: '全部'
      },
      {
        key: -1,
        val: '未发卡'
      },
      {
        key: 0,
        val: '已发卡'
      },
      {
        key: 1,
        val: '已挂失'
      },
      {
        key: 2,
        val: '已销卡'
      }
    ],
    value: 'status',
    type: 'select',
    label: '状态'
  },
  {
    list: [ ],
    value: 'cardType',
    type: 'select',
    label: '卡类型'
  }
]
export default {
  name: 'AccountMge',
  components: {
    CardOperate,
    SearchForm,
    TableList,
    PageNum
  },
  data () {
    return {
      searchLabel,
      searchList: {
        card: '',
        endTime: '',
        createTime: '',
        status: '',
        userName: ''
      },
      pageList: {
        page: 1,
        size: 20
      },
      total: 0,
      columns,
      recordList: [],
      exportTag: false,
      exportTime: '',
      cardTag: false,
      okText: '确认发卡',
      title: '发卡',
      cardInfo: {}
    }
  },
  computed: {
    ...mapState('home', [
      'userInfo'
    ])
  },
  mounted () {
    // this.searchList.schoolCode = this.userInfo.schoolCode
    this.showList()
    this.cardTypeGet()
  },
  methods: {
    ...mapActions('home', [
      'getCardList', 'getCardType'
    ]),
    async cardTypeGet () {
      const res = await this.getCardType()
      this.searchLabel[4].list = this.filterSearch(res.data)
      this.searchLabel[4].list.unshift({ key: '', val: '全部' })
    },
    filterSearch (data) {
      data.forEach(el => {
        this.$set(el, 'key', el.cardType)
        this.$set(el, 'val', el.cardName)
      })
      return data
    },
    async showList () {
      this.searchList = Object.assign(this.searchList, this.pageList)
      const res = await this.getCardList(this.searchList)
      if (res.data.list.length > 0) {
        this.recordList = res.data.list.map(el => {
          return {
            ...el,
            id: el.userId
          }
        })
      }
      this.total = res.data.total
    },
    searchForm (values) {
      console.log('value', values)
      this.pageList.page = 1
      this.pageList.size = 20
      this.searchList = Object.assign(this.searchList, values)
      this.showList()
    },
    operate (record, type) {
      this.cardInfo = record
      if (type === 1) {
        this.title = '发卡'
        this.okText = '确认发卡'
      } else if (type === 2) {
        this.title = '挂失'
        this.okText = '确认挂失'
      } else if (type === 3) {
        this.title = '换卡'
        this.okText = '确认换卡'
      } else if (type === 4) {
        this.title = '解挂'
        this.okText = '确认解挂'
      } else if (type === 5) {
        this.title = '销卡'
        this.okText = '确认销卡'
      }
      this.cardTag = true
      setTimeout(() => {
        this.$refs.cardOperate.type = type
        if (type === 1) {
          this.$refs.cardOperate.ruleGet(record.userIdentity)
        }
      }, 100)
    }
  }
}
</script>
<style lang="less" scoped>

</style>
