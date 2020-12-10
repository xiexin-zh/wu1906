<template>
  <div class="page-layout qui-fx-ver">
    <choose-control
      ref="chooseUser"
      is-check
      v-show="userTag"
      v-model="userTag"
      :chooseType="chooseType"
      :schoolCode="userInfo.schoolCode"
      @submit="chooseUser"
      title="添加控制组"
    ></choose-control>
    <a-tabs v-model="autoKey" style="margin-left: 10px">
      <a-tab-pane tab="来访事由" key="1" forceRender>
        <div class="u-mar-r10 u-padd-b10">
          <a-alert
            message="说明：访客填写预约申请单时，需选择来访事由，平台已为您预设若干来访事由，可根据您的实际需求进行新增、编辑哦~"
            type="info"
            closable
          />
        </div>
        <div>
          <a-input
            maxlength="10"
            v-model="causeName"
            style="width: 300px; margin-right: 10px;"
            placeholder="请输入来访事由进行录入"
          />
          <a-button type="primary" @click="addReason">添加事由</a-button>
        </div>
        <div style="width: 600px; margin-top: 20px">
          <table-list :columns="columns" :table-list="reasonList">
            <template v-slot:actions="action">
              <div>
                <a-popconfirm
                  placement="left"
                  okText="确定"
                  cancelText="取消"
                  @confirm="del(action.record)"
                >
                  <template slot="title">您确定删除吗?</template>
                  <a-tooltip placement="topLeft" title="删除">
                    <a-button size="small" class="del-action-btn" icon="delete"></a-button>
                  </a-tooltip>
                </a-popconfirm>
              </div>
            </template>
          </table-list>
        </div>
      </a-tab-pane>
      <a-tab-pane tab="通行权限" key="2" forceRender>
        <a-row>
          <search-form is-reset @search-form="searchForm" :search-label="searchLabel">
            <div slot="left">
              <a-button
                style="margin-top: 5px; margin-right: 10px"
                v-if="autoKey === '2'"
                slot="tabBarExtraContent"
                icon="plus"
                class="add-btn"
                @click="bindControl"
              >绑定设备</a-button>
            </div>
          </search-form>
          <a-col>
            <table-list :page-list="pageList" :columns="columnss" :table-list="groupList">
              <template v-slot:actions="action">
                <a-popconfirm
                  placement="left"
                  okText="确定"
                  cancelText="取消"
                  @confirm="delControl(action.record)"
                >
                  <template slot="title">您确定删除吗?</template>
                  <a-tooltip placement="topLeft" title="删除">
                    <a-button size="small" class="del-action-btn" icon="delete"></a-button>
                  </a-tooltip>
                </a-popconfirm>
              </template>
            </table-list>
          </a-col>
        </a-row>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>
<script>
import TableList from '@c/TableList'
import ChooseControl from '@c/ChooseControl'
import { mapState, mapActions } from 'vuex'
import SearchForm from '@c/SearchForm'
const searchLabel = [
  {
    value: 'deviceName',
    type: 'input',
    label: '设备名称',
    placeholder: '输入设备名称'
  },
  {
    value: 'snapSite',
    type: 'input',
    label: '安装位置',
    placeholder: '输入安装位置'
  },
  {
    list: [
      {
        key: '',
        val: '全部'
      },
      {
        key: 1,
        val: '网络相机'
      },
      {
        key: 2,
        val: '面板机'
      },
      {
        key: 3,
        val: '班牌'
      }
    ],
    value: 'deviceType',
    type: 'select',
    label: '设备类型'
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
      },
      {
        key: 3,
        val: '无'
      }
    ],
    value: 'inOrOut',
    type: 'select',
    label: '控制类型'
  }
]
const columnss = [
  {
    title: '序号',
    width: '10%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '设备名称',
    dataIndex: 'deviceName',
    width: '15%'
  },
  {
    title: '设备类型',
    dataIndex: 'deviceType',
    width: '15%',
    customRender: text => {
      return parseInt(text) === 1 ? '网络相机' : parseInt(text) === 2 ? '面板机' : '班牌'
    }
  },
  {
    title: '安装位置',
    dataIndex: 'snapSite',
    width: '15%'
  },
  {
    title: '设备SN码',
    dataIndex: 'deviceSn',
    width: '15%',
    align: 'center'
  },
  {
    title: '控制类型',
    dataIndex: 'inOrOut',
    width: '15%',
    customRender: text => {
      return parseInt(text) === 1 ? '进' : parseInt(text) === 2 ? '出' : '无'
    }
  },
  {
    title: '是否校门门禁',
    dataIndex: 'controlType',
    width: '15%',
    customRender: text => {
      return parseInt(text) === 1 ? '是' : '否'
    }
  },
  {
    title: '操作',
    key: 'action',
    width: '15%',
    scopedSlots: {
      customRender: 'action'
    }
  }
]
const columns = [
  {
    title: '序号',
    width: '30%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '来访事由',
    dataIndex: 'causeName',
    width: '50%'
  },
  {
    title: '操作',
    key: 'action',
    width: '20%',
    scopedSlots: {
      customRender: 'action'
    }
  }
]
export default {
  name: 'VisitorSet',
  components: {
    TableList,
    ChooseControl,
    SearchForm
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  data() {
    return {
      searchLabel,
      autoKey: '1',
      columns,
      columnss,
      causeName: '',
      controlList: [],
      reasonList: [],
      chooseTag: false,
      userTag: false,
      userGroupCode: '',
      pageList: {
        page: 1,
        size: 20
      },
      total: 0,
      groupList: [],
      chooseType: 'visitorGroup'
    }
  },
  created() {
    this.init()
  },
  mounted() {
    this.showControl()
  },
  methods: {
    ...mapActions('home', [
      'addcause',
      'delcause',
      'getcauseList',
      'addcontrolgroup',
      'delcontrolgroup',
      'getcontrolgroupsList',
      'initcauseList'
    ]),
    /// 初始
    async init() {
      const req = {
        schoolCode: this.userInfo.schoolCode
      }
      await this.initcauseList(req)
      this.showReason()
    },
    async showReason(ids = []) {
      const req = {
        pageNum: this.pageList.page,
        pageSize: this.pageList.size,
        schoolCode: this.userInfo.schoolCode
      }
      const res = await this.getcauseList(req)
      this.reasonList = res.data.list.map(item => {
        return {
          ...item,
          isAuto: ids.indexOf(item.id) > -1
        }
      })
      this.total = res.data.total
    },
    async addReason() {
      if (!this.causeName) {
        this.$message.warning('请输入来访事由')
      } else {
        await this.addcause({
          ...this.pageList,
          schoolCode: this.userInfo.schoolCode,
          causeName: this.causeName
        })
        this.$message.success('添加成功')
        this.$tools.goNext(() => {
          this.causeName = ''
          this.showReason()
        })
      }
    },
    async del(record) {
      await this.delcause({
        id: record.id
      })
      this.$message.success('删除成功')
      this.$tools.goNext(() => {
        this.showReason()
      })
    },
    async showControl(searchObj = {}) {
      const req = {
        pageNum: this.pageList.page,
        pageSize: this.pageList.size,
        schoolCode: this.userInfo.schoolCode,
        ...searchObj
      }
      const res = await this.getcontrolgroupsList(req)
      this.groupList = res.data.list
      this.total = res.data.total
    },
    searchForm(values) {
      this.pageList.pageNum = 1
      const searchObj = {
        deviceName: values.deviceName,
        snapSite: values.snapSite,
        inOrOut: values.inOrOut,
        deviceType: values.deviceType
      }

      this.showControl(searchObj)
    },
    async delControl(record) {
      this.del = [record.id]
      await this.delcontrolgroup(this.del)
      this.$message.success('删除成功')
      this.$tools.goNext(() => {
        this.showControl()
      })
    },
    async chooseUser(value) {
      this.controlArr = []
      this.$refs.chooseUser.reset()
      value.forEach(ele => {
        this.controlArr.push({
          controlType: ele.controlType,
          deviceIp: ele.deviceIp,
          deviceName: ele.deviceName,
          deviceSn: ele.deviceSn,
          deviceStatus: ele.deviceStatus,
          deviceType: ele.deviceType,
          inOrOut: ele.inOrOut,
          schoolCode: ele.schoolCode,
          snapSite: ele.snapSite
        })
      })
      try {
        await this.addcontrolgroup(this.controlArr)
        this.$message.success('添加成功')
        this.$tools.goNext(() => {
          this.showControl()
        })
      } catch (err) {}
    },
    bindControl() {
      this.$refs.chooseUser.chooseList = []
      this.$refs.chooseUser.totalList = []
      this.groupList.forEach(item => {
        this.$refs.chooseUser.chooseList.push(item.deviceSn)
        this.$refs.chooseUser.totalList.push({
          ...item,
          id: item.deviceSn
        })
      })
      this.userTag = true
    }
  }
}
</script>
<style lang="less" scoped>
.control-list {
  display: inline-block;
  margin-right: 20px;
  margin-bottom: 20px;
}
</style>
