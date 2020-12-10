<template>
  <div class="page-layout qui-fx-ver">
    <div class="tips u-padd-l10 u-mar-10">
      温馨提示：应急预案的演练记录将会保留12个月，过程中的音视频文件将会保留6个月，请用户及时查看！
    </div>
    <table-list
      :page-list="pageList"
      :columns="columns"
      :table-list="userList"
    >
      <template v-slot:actions="action">
        <a-tooltip placement="topLeft" title="试听">
          <a-button size="small" class="copy-action-btn" icon="copy" @click="check(action.record)"></a-button>
        </a-tooltip>
        <a-popconfirm
          placement="left"
          okText="确定"
          cancelText="取消"
          @confirm="del(action)"
        >
          <template slot="title">确定删除该演练记录吗？</template>
          <a-tooltip placement="topLeft" title="删除">
            <a-button size="small" class="del-action-btn" icon="delete"></a-button>
          </a-tooltip>
        </a-popconfirm>
      </template>
    </table-list>
    <page-num v-model="pageList" :total="total" @change-page="_getRehearsal"></page-num>
    <drill-detail v-model="previewTag" :obj="obj"></drill-detail>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import TableList from '@c/TableList'
import PageNum from '@c/PageNum'
import DrillDetail from '../../component/DrillDetail'
import $tools from '@u/tools'
const columns = [
  {
    title: '序号',
    scopedSlots: {
      customRender: 'index'
    },
    width: '10%'
  },
  {
    title: '预案名称',
    dataIndex: 'emergencyName',
    width: '15%'
  },
  {
    title: '开始时间',
    dataIndex: 'startTime',
    width: '20%',
    customRender: text => {
      return $tools.getDate(text, 6)
    }
  },
  {
    title: '演练时长',
    dataIndex: 'duration',
    width: '15%'
  },
  {
    title: '预案启动者',
    dataIndex: 'starterName',
    width: '15%'
  },
  {
    title: '操作',
    width: '20%',
    scopedSlots: {
      customRender: 'action'
    }
  }
]
export default {
  name: 'DrillProcess',
  components: {
    TableList,
    PageNum,
    DrillDetail
  },
  data() {
    return {
      columns,
      total: 0,
      pageList: {
        page: 1,
        size: 20
      },
      userList: [],
      previewTag: false,
      playTag: false,
      searchList: {},
      obj: {}
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  mounted() {
    this.searchList.emergencyId = this.$route.query.id
    this._getRehearsal()
  },
  methods: {
    ...mapActions('home', ['getRehearsal', 'delRehearsal', 'getRehearsalDetail']),
    // 列表
    async _getRehearsal() {
      this.searchList = Object.assign(this.searchList, this.pageList)
      const res = await this.getRehearsal(this.searchList)
      this.userList = res.data.records
      this.total = res.data.total
    },
    async _getRehearsalDetail(record) {
      const res = await this.getRehearsalDetail(record.id)
      this.obj.desList = res.data
    },
    async check(record) {
      this.obj = record
      await this._getRehearsalDetail(record)
      this.previewTag = true
    },
    // 删除单条记录
    async del(record) {
      await this.delRehearsal(record.record.id)
      this.$message.success('操作成功')
      this.$tools.goNext(() => {
        this._getRehearsal()
      })
    }
  }
}
</script>
<style lang="less" scoped>
.tips {
  line-height: 36px;
  background-color: #ffffcc;
}
</style>
