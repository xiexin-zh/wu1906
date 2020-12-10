<template>
  <div class="add-white">
    <a-modal
      :title="title"
      @cancel="cancel"
      :maskClosable="false"
      destroyOnClose
      width="850px"
      footer=""
      v-model="status"
    >
      <search-form is-reset @search-form="searchForm" :search-label="searchLabel"> </search-form>
      <a-tabs v-model="autoKey" @change="showList">
        <a-tab-pane tab="教职工" key="1">
          <div class="choose-user qui-fx">
            <div class="qui-fx-ver qui-fx-f1">
              <table-list :scroll-h="300" :page-list="pageList" :columns="columnss" :table-list="userList">
                <template v-slot:other1="other1">
                  {{ other1.record.outUserInfoDto ? other1.record.outUserInfoDto.userName : '--' }}
                </template>
                <template v-slot:other2="other2">
                  {{ other2.record.outUserInfoDto ? other2.record.outUserInfoDto.workNo : '--' }}</template
                >
                <template v-slot:other3="action">
                  <a-tag color="#FF0000" v-if="action.record.readStatus == '0'">未读</a-tag>
                  <a-tag color="#87d068" v-if="action.record.readStatus == '1'">已读</a-tag>
                </template>
              </table-list>
              <div>已有{{ this.readList.readCount }}位教职工已读，{{ this.readList.unReadCount }}位教职工未读</div>
              <page-num
                :jumper="false"
                v-model="pageList"
                :mar-top="20"
                :mar-bot="0"
                size="small"
                :total="total"
                @change-page="showList"
              ></page-num>
            </div>
          </div>
        </a-tab-pane>
        <a-tab-pane tab="家长" key="2">
          <div class="choose-user qui-fx">
            <div class="qui-fx-ver qui-fx-f1">
              <table-list :scroll-h="300" :page-list="pageList" :columns="columns" :table-list="userList">
                <template v-slot:other3="other3">
                  {{
                    other3.record.outParentQuery ? other3.record.outParentQuery.studentInfo[0].stuName : '--'
                  }}</template
                >
                <template v-slot:other4="other4">
                  {{
                    other4.record.outParentQuery ? other4.record.outParentQuery.studentInfo[0].userNo : '--'
                  }}</template
                >
                <template v-slot:other5="other5">
                  <div v-if="other5.record.readStatus != 0">
                    {{ other5.record.outParentQuery ? other5.record.outParentQuery.parentName : '--' }}
                  </div>
                </template>
                <template v-slot:other2="other2">
                  {{ other2.record.outParentQuery ? other2.record.outParentQuery.studentInfo[0].gradeName : '--' }}
                  {{ other2.record.outParentQuery ? other2.record.outParentQuery.studentInfo[0].clazzName : '--' }}
                </template>
                <template v-slot:other1="action">
                  <a-tag color="#FF0000" v-if="action.record.readStatus == '0'">未读</a-tag>
                  <a-tag color="#87d068" v-if="action.record.readStatus == '1'">已读</a-tag>
                </template>
              </table-list>
              <div>已有{{ this.readList.readCount }}位家长已读，{{ this.readList.unReadCount }}位家长未读</div>
              <page-num
                :jumper="false"
                v-model="pageList"
                :mar-top="20"
                :mar-bot="0"
                size="small"
                :total="total"
                @change-page="showList"
              ></page-num>
            </div>
          </div>
        </a-tab-pane>
      </a-tabs>
    </a-modal>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import moment from 'moment'
import PageNum from '@c/PageNum'
import TableList from '@c/TableList'
import SearchForm from '@c/SearchForm'
import Tools from '@u/tools'
const columnss = [
  {
    title: '序号',
    width: '20%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '教职工姓名',
    width: '20%',
    scopedSlots: {
      customRender: 'other1'
    }
  },
  {
    title: '工号',
    width: '20%',
    scopedSlots: {
      customRender: 'other2'
    }
  },
  {
    title: '阅读状态',
    width: '20%',
    scopedSlots: {
      customRender: 'other3'
    }
  },
  {
    title: '阅读时间',
    dataIndex: 'readTime',
    width: '20%',
    customRender: text => {
      if (text === null) {
        return '--'
      } else {
        return Tools.getDate(text)
      }
    }
  }
]
const columns = [
  {
    title: '序号',
    width: '10%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '学生姓名',
    dataIndex: 'stuName',
    width: '15%',
    scopedSlots: {
      customRender: 'other3'
    }
  },
  {
    title: '学号',
    dataIndex: 'userNo',
    width: '15%',
    scopedSlots: {
      customRender: 'other4'
    }
  },
  {
    title: '家长姓名',
    dataIndex: 'parentName',
    width: '15%',
    scopedSlots: {
      customRender: 'other5'
    }
  },
  {
    title: '所在班级',
    dataIndex: 'clazzName',
    width: '15%',
    scopedSlots: {
      customRender: 'other2'
    }
  },
  {
    title: '阅读状态',
    width: '15%',
    scopedSlots: {
      customRender: 'other1'
    }
  },
  {
    title: '阅读时间',
    dataIndex: 'readTime',
    width: '15%',
    customRender: text => {
      if (text === null) {
        return '--'
      } else {
        return Tools.getDate(text)
      }
    }
  }
]
const searchLabel = [
  {
    list: [
      {
        key: '',
        val: '全部'
      },
      {
        key: '1',
        val: '已读'
      },
      {
        key: '0',
        val: '未读'
      }
    ],
    value: 'readStatus',
    type: 'select',
    label: '阅读状态'
  }
]
export default {
  components: {
    TableList,
    PageNum,
    SearchForm
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    id: {
      type: Number,
      default: 0
    }
  },
  watch: {
    id(val) {
      this.showList()
    }
  },
  data() {
    return {
      moment,
      autoKey: '1',
      total: 0,
      pageList: {
        page: 1,
        size: 20
      },
      userList: [],
      columns,
      columnss,
      searchLabel,
      readList: {}
    }
  },
  computed: {
    ...mapState('home', ['userInfo']),
    status: {
      get() {
        return this.value
      },
      set() {
        this.$emit('input', false)
      }
    }
  },
  created() {
    this.showList()
  },
  methods: {
    ...mapActions('home', ['getReadStatus']),
    async showList(searchObj = {}) {
      let req = null
      if (this.autoKey === '1') {
        req = {
          ...this.pageList,
          ...searchObj,
          schoolCode: this.userInfo.schoolCode,
          type: '2',
          noticeId: this.id
        }
      } else {
        req = {
          ...this.pageList,
          schoolCode: this.userInfo.schoolCode,
          type: '1',
          noticeId: this.id,
          ...searchObj
        }
      }
      const res = await this.getReadStatus(req)
      this.userList = res.data.list.list
      this.readList = res.data
      this.total = res.data.list.total
    },
    searchForm(values) {
      this.pageList.page = 1
      const searchObj = {
        readStatus: values.readStatus
      }
      this.showList(searchObj)
    },
    cancel() {
      this.$emit('input', false)
    }
  }
}
</script>
<style lang="less" scoped>
.ant-input-number {
  width: 100%;
}
.ant-calendar-picker {
  width: 100% !important;
}
</style>
