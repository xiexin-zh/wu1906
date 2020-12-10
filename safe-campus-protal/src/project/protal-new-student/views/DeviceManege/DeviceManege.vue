<template>
  <div class="home page-layout qui-fx-ver">
    <!-- <IssueRecord
      :visible="issueVisible"
      v-if="issueVisible"
      :title="title"
      :deviceId="deviceId"
      @cancel="issueVisible = false"
    /> -->
    <down-record v-if="issueVisible" :device-sn="bussCode" buss-code="recruit-student" v-model="issueVisible"></down-record>
    <bind-student
      type="edu"
      chooseType="organize"
      :bind-obj="bindStudent"
      is-check
      ref="form"
      v-if="studentTag"
      v-model="studentTag"
      :deviceId="device_stu_Id"
      @submit="submitUser"
      title="绑定学生"
    >
    </bind-student>
    <bind-device
      type="edu"
      chooseType="organize"
      :bind-obj="bindDevice"
      is-check
      ref="form"
      v-if="deviceTag"
      v-model="deviceTag"
      @submit="submitDevice"
      title="绑定设备"
    >
    </bind-device>
    <search-form is-reset @search-form="searchForm" :search-label="searchLabel">
      <div slot="left">
        <a-button icon="plus" class="add-btn" @click.stop="bindDevClick">绑定设备</a-button>
      </div>
    </search-form>
    <table-list isZoom :page-list="pageList" :columns="columns" :table-list="deviceList">
      <template v-slot:other1="other1">
        <span>{{ other1.record.studentNum }}</span>
        <a-button
          size="small"
          type="primary"
          icon="plus"
          style="margin-left: 10px"
          @click="bindStuClick(other1.record.id)"
        ></a-button>
      </template>
      <template v-slot:actions="action">
        <a-popconfirm placement="left" okText="确定" cancelText="取消" @confirm="deleteDevice(action.record)">
          <template slot="title"> 确定解绑设备吗? </template>
          <a-tooltip placement="topLeft" title="解绑设备">
            <a-button size="small" class="del-action-btn" icon="unlock"></a-button>
          </a-tooltip>
        </a-popconfirm>
        <a-tooltip placement="topLeft" title="下发记录">
          <a-button size="small" class="export-btn" icon="file" @click.stop="handelIssue(action.record)"></a-button>
        </a-tooltip>
      </template>
    </table-list>
    <page-num v-model="pageList" :total="total" @change-page="showList"></page-num>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import TableList from '@c/TableList'
import PageNum from '@c/PageNum'
import SearchForm from '@c/SearchForm'
import DownRecord from '@c/DownRecord'
// import IssueRecord from '../../component/IssueRecord.vue'
import BindStudent from '../../component/BindStudent.vue'
import BindDevice from '../../component/BindDevice.vue'
// import Tools from '@u/tools'
const columns = [
  {
    title: '序号',
    width: '8%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '设备名称',
    dataIndex: 'deviceName',
    width: '20%'
  },
  {
    title: '绑定学生',
    dataIndex: 'bindStudent',
    width: '10%',
    scopedSlots: {
      customRender: 'other1'
    }
  },
  {
    title: '设备类型',
    dataIndex: 'deviceType',
    width: '10%',
    customRender: (text) => {
      if (text === '2') {
        return '面板机'
      }
      if (text === '1') {
        return '网络相机'
      }
      return ''
    }
  },
  {
    title: 'SN码',
    dataIndex: 'snCode',
    width: '10%'
  },
  {
    title: '安装位置',
    dataIndex: 'address',
    width: '20%'
  },
  {
    title: '操作',
    width: '10%',
    scopedSlots: {
      customRender: 'action'
    }
  }
]
const searchLabel = [
  {
    value: 'deviceName',
    type: 'input',
    label: '设备名称',
    placeholder: '请输入设备名称'
  },
  {
    value: 'snCode',
    type: 'input',
    label: 'SN码',
    placeholder: '请输入SN码'
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
      }
    ],
    value: 'deviceType',
    type: 'select',
    label: '设备类型'
  }
]
export default {
  name: 'DeviceManage',
  components: {
    SearchForm,
    PageNum,
    TableList,
    DownRecord,
    BindStudent,
    BindDevice
  },
  data() {
    return {
      title: '下发记录',
      issueVisible: false,
      studentTag: false,
      bindStudent: {},
      deviceTag: false,
      bindDevice: {},
      columns,
      searchLabel,
      searchList: {},
      pageList: {
        page: 1,
        size: 20
      },
      total: 0,
      deviceList: [],
      signTag: false,
      searchObj: {},
      deviceId: '',
      device_stu_Id: '',
      bussCode: ''
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  mounted() {
    this.showList()
  },
  methods: {
    ...mapActions('home', ['getDeviceList', 'bindDevices', 'unbindDevices', 'getDeviceRecord']),
    async showList() {
      const req = {
        ...this.searchObj,
        ...this.pageList,
        schoolCode: this.userInfo.schoolCode
      }
      const res = await this.getDeviceList(req)
      this.deviceList = res.data.records.map(item => {
        return {
          ...item,
          snCode: item.deviceSn
        }
      })
      this.total = res.data.total
    },
    searchForm(values) {
      this.searchObj = {
        deviceName: values.deviceName || '',
        deviceType: values.deviceType || '',
        snCode: values.snCode
      }
      this.showList()
    },
    addTask() {
      this.$router.push({ path: '/taskManage/addTask' })
    },
    // 点击下发记录
    async handelIssue(record) {
      this.deviceId = record.id
      this.bussCode = record.snCode
      this.issueVisible = true
    },
    // 解绑设备
    async deleteDevice(record) {
      await this.unbindDevices(record.id)
      this.$message.success('解绑成功')
      this.$tools.goNext(() => {
        this.showList()
      })
    },
    showRecord(record) {
      this.signTag = true
      this.id = record.id
    },
    submitForm(values) {
    },
    bindStuClick(id) {
      this.device_stu_Id = id
      this.studentTag = true
    },
    // 表头绑定设备按钮
    bindDevClick() {
      this.deviceTag = true
    },
    submitUser() {
      this.studentTag = false
      this.showList()
    },
    submitDevice() {
      this.deviceTag = false
      this.showList()
    }
  }
}
</script>
<style lang="less" scoped></style>
