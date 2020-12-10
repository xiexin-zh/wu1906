<template>
  <a-modal
    width="1200px"
    :title="title"
    v-model="showTag"
    :footer="null"
    :maskClosable="false"
    :destroyOnClose="true"
  >
    <div class="sign-record qui-fx-ver">
      <a-tabs v-if="type === 'site' || type === 'activity'" v-model="autoKey" @change="tabChange">
        <a-tab-pane key="2" :tab="type === 'activity' ? '其他人员' : '教职工'"></a-tab-pane>
        <a-tab-pane key="1" tab="班级"></a-tab-pane>
        <div slot="tabBarExtraContent" class="qui-fx-ac mar-r10">
          <a-radio-group v-model="state" @change="stateChange" buttonStyle="solid">
            <a-radio-button value>全部</a-radio-button>
            <a-radio-button value="2">已签到</a-radio-button>
            <a-radio-button value="1">未签到</a-radio-button>
          </a-radio-group>
        </div>
      </a-tabs>
      <div class="mar-b10" v-if="type === 'meeting'">
        <a-radio-group v-model="state" @change="stateChange" buttonStyle="solid">
          <a-radio-button value>全部</a-radio-button>
          <a-radio-button value="2">已签到</a-radio-button>
          <a-radio-button value="1">未签到</a-radio-button>
        </a-radio-group>
      </div>
      <div class="qui-fx-ver qui-fx-f1">
        <table-list :scroll-h="450" :page-list="pageList" :columns="columns" :table-list="dataList">
          <template v-slot:other1="other1">
            <a-tag
              :color="other1.record.signStatus === '2' ? '#87d068' : '#f50'"
            >{{ other1.record.signStatus === '2' ? '已签到' : '未签到' }}</a-tag>
          </template>
          <template v-slot:other2="other2">
            <span>{{ other2.record.signStatus === '1' ? '--' : other2.record.deviceName }}</span>
          </template>
          <template v-slot:other3="other3">
            <span>{{ other3.record.signTime | gmtToDate }}</span>
          </template>
          <template v-slot:other4="other4">
            <span>{{ other4.record.type === '1' ? (other4.record.gradeName + other4.record.className) : (other4.record.orgName) }}</span>
          </template>
        </table-list>
        <page-num
          :jumper="false"
          v-model="pageList"
          :mar-top="20"
          :mar-bot="0"
          size="small"
          :total="total"
          @change-page="getList"
        ></page-num>
      </div>
    </div>
  </a-modal>
</template>

<script>
import PageNum from '@c/PageNum'
import { mapState, mapActions } from 'vuex'
import TableList from '@c/TableList'
const columns = [
  {
    title: '序号',
    width: '10%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '姓名',
    dataIndex: 'userName',
    width: '10%'
  },
  {
    title: '手机号',
    dataIndex: 'workNo',
    width: '10%'
  },
  {
    title: '所属部门',
    dataIndex: 'orgName',
    width: '10%',
    scopedSlots: {
      customRender: 'other4'
    }
  },
  {
    title: '签到状态',
    dataIndex: 'signStatus',
    width: '10%',
    scopedSlots: {
      customRender: 'other1'
    }
  },
  {
    title: '签到设备',
    dataIndex: 'deviceSn',
    width: '10%',
    scopedSlots: {
      customRender: 'other2'
    }
  },
  {
    title: '签到时间',
    dataIndex: 'signTime',
    width: '10%',
    scopedSlots: {
      customRender: 'other3'
    }
  }
]
export default {
  name: 'SignRecord',
  components: {
    TableList,
    PageNum
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: ''
    },
    value: {
      type: Boolean,
      default: false
    },
    id: {
      type: Number,
      default: 0
    }
  },
  computed: {
    ...mapState('home', ['userInfo']),
    showTag: {
      get() {
        return this.value
      },
      set() {
        this.$emit('input', false)
      }
    }
  },
  data() {
    return {
      keyword: '',
      pageList: {
        page: 1,
        size: 20
      },
      total: 0,
      columns,
      dataList: [],
      state: '',
      autoKey: '2'
    }
  },
  mounted() {
    console.log(this.id)
    this.getList()
  },
  methods: {
    ...mapActions('home', ['getSignDetail']),
    async getList() {
      const req = {
        ...this.pageList,
        id: this.id,
        type: this.autoKey,
        signStatus: this.state
      }
      const res = await this.getSignDetail(req)
      console.log(res.data)
      this.dataList = res.data.list.list
      this.total = res.data.list.total
    },
    error() {
      this.confirmLoading = false
    },
    tabChange(key) {
      console.log(key)
      if (key === '1') {
        this.columns[2].title = '学号'
        this.columns[3].title = '所属班级'
        this.columns[3].dataIndex = 'className'
      } else {
        this.columns[2].title = '手机号'
        this.columns[3].title = '所属部门'
        this.columns[3].dataIndex = 'orgName'
      }
      this.getList()
    },
    stateChange() {
      console.log(this.state)
      this.getList()
    }
  }
}
</script>

<style lang="less" scoped>
.sign-record {
  height: 600px;
}
</style>
