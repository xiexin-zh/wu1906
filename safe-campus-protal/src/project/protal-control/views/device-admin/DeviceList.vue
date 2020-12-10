<template>
  <div class="device-list page-layout qui-fx-ver">
    <div v-if="formStatus">
      <add-device
        ref="form"
        :is-sn="isSn"
        @submit-form="submitForm"
        :title="title"
        v-model="formStatus"
        :device-info="deviceInfo"
      ></add-device>
    </div>
    <search-form is-reset @search-form="searchForm" :search-label="searchLabel">
      <div slot="left">
        <a-button type="primary" @click="addDevice(false, {}, '新增设备')" icon="plus">新增设备</a-button>
      </div>
      <div slot="right"></div>
    </search-form>
    <table-list :page-list="pageList" :columns="deviceColumns" :table-list="deviceList">
      <template v-slot:actions="action">
        <a-tooltip placement="topLeft" title="编辑">
          <a-button
            size="small"
            class="edit-action-btn"
            icon="form"
            @click="addDevice(true, action.record, '编辑设备')"
          ></a-button>
        </a-tooltip>
        <a-popconfirm
          placement="left"
          okText="确定"
          cancelText="取消"
          @confirm="delList(action.record)"
        >
          <template slot="title">您确定删除吗?</template>
          <a-tooltip placement="topLeft" title="删除">
            <a-button size="small" class="del-action-btn" icon="delete"></a-button>
          </a-tooltip>
        </a-popconfirm>
      </template>
    </table-list>
    <page-num v-model="pageList" :total="total" @change-page="showList"></page-num>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import SearchForm from '@c/SearchForm'
import AddDevice from '../../component/AddDevice'
import TableList from '@c/TableList'
import PageNum from '@c/PageNum'
import deviceColumns from '../../assets/js/table/deviceColumns'
const searchLabel = [
  {
    value: 'deviceName',
    type: 'input',
    label: '设备名称',
    placeholder: '请输入设备名称'
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
    label: '进出类型'
  },
  {
    list: [
      {
        key: '',
        val: '全部'
      },
      {
        key: 1,
        val: '在线'
      },
      {
        key: 2,
        val: '离线'
      }
    ],
    value: 'deviceStatus',
    type: 'select',
    label: '设备状态'
  }
]
export default {
  name: 'DeviceList',
  components: {
    SearchForm,
    TableList,
    AddDevice,
    PageNum
  },
  data() {
    return {
      isSn: false,
      title: '',
      formStatus: false,
      total: 0,
      searchLabel,
      deviceColumns,
      deviceInfo: {},
      searchText: {
        deviceName: '',
        deviceType: '',
        deviceStatus: ''
      },
      pageList: {
        page: 1,
        size: 20
      },
      deviceList: []
    }
  },
  computed: {
    ...mapState('home', ['schoolCode'])
  },
  mounted() {
    this.showList()
  },
  methods: {
    ...mapActions('home', ['getDeviceList', 'addDeviceList', 'delDevice', 'updateDeviceList']),
    async showList() {
      const res = await this.getDeviceList({
        schoolCode: this.schoolCode,
        ...this.pageList,
        ...this.searchText
      })
      this.deviceList = res.data.list
      this.total = res.data.total
    },
    addDevice(type, record, msg) {
      this.isEdit = type
      this.title = msg
      this.formStatus = true
      if (type) {
        this.isSn = true
        this.funName = 'updateDeviceList'
        this.id = record.id
      } else {
        this.isSn = false
        this.funName = 'addDeviceList'
      }
      this.deviceInfo = record
    },
    submitForm(values) {
      if (this.isEdit) {
        values.id = this.id
      }
      values.schoolCode = this.schoolCode
      this[this.funName](values)
        .then(res => {
          this.$message.success('操作成功')
          this.$refs.form.reset()
          this.$tools.goNext(() => {
            this.showList()
          })
        })
        .catch(() => {
          this.$refs.form.error()
        })
    },
    searchForm(values) {
      this.searchText = values
      this.showList()
    },
    delList({ id }) {
      this.delDevice({
        id
      }).then(res => {
        this.$message.success('删除成功')
        this.$tools.goNext(() => {
          this.showList()
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
