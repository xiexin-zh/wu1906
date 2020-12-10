<template>
  <div class="class page-layout qui-fx">
    <choose-control
      ref="chooseUser"
      is-check
      v-if="userTag"
      v-model="userTag"
      @submit="chooseUser"
      :chooseType="chooseType"
      :schoolCode="userInfo.schoolCode"
      title="添加设备"
    ></choose-control>
    <submit-form
      ref="form"
      @submit-form="submitForm"
      :title="title"
      v-model="formStatus"
      :form-data="formData"
    ></submit-form>
    <div class="qui-fx qui-fx-jsb" style="width:100%">
      <div class="left">
        <div class="control-tab">
          <service-list @change="changeTab" @getList="showService"></service-list>
        </div>
      </div>
      <div class="right qui-fx-ver qui-fx-f1">
        <search-form is-reset @search-form="searchForm" :search-label="searchLabel"></search-form>
        <div style="text-align: right;">
          <a-button icon="plus" class="add-btn" @click="userTag = true">绑定设备</a-button>
          <a-button icon="export" class="export-all-btn" @click="batchAdd(0)">批量设置</a-button>
          <a-button icon="delete" class="del-btn" @click="batchDelete(0)">批量解绑</a-button>
        </div>
        <table-list
          is-check
          is-zoom
          @clickRow="clickRow"
          v-model="chooseList"
          :page-list="pageList"
          :columns="columns"
          :table-list="deviceList"
        >
          <template v-slot:actions="action">
            <a-tooltip placement="topLeft" title="设置">
              <a-button
                size="small"
                class="edit-action-btn"
                icon="form"
                @click.stop="batchAdd(1, action.record)"
              ></a-button>
            </a-tooltip>
            <a-popconfirm placement="left" okText="确定" cancelText="取消" @confirm="batchDelete(1, action.record)">
              <template slot="title">您确定删除吗?</template>
              <a-tooltip placement="topLeft" title="解绑">
                <a-button size="small" class="del-action-btn" icon="delete"></a-button>
              </a-tooltip>
            </a-popconfirm>
          </template>
          <template v-slot:other3="action">
            <a-popover title="移动至分组" placement="right">
              <template slot="content">
                <div v-for="(item, i) in serviseList" :key="i">
                  <a-radio-group @change="onChange(action.record, item)" :default-value="action.record.deviceGroupCode">
                    <a-radio :value="item.deviceGroupCode">{{ item.deviceGroupName }}</a-radio>
                  </a-radio-group>
                </div>
              </template>
              <span class="content">
                <a-tag color="purple">{{ action.record.deviceGroupName }}</a-tag>
                <a-icon type="caret-down" />
              </span>
            </a-popover>
          </template>
        </table-list>
        <page-num v-model="pageList" :total="total" @change-page="showList"></page-num>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import TableList from '@c/TableList'
import SearchForm from '@c/SearchForm'
import PageNum from '@c/PageNum'
import SubmitForm from '@c/SubmitForm'
import ChooseControl from '../component/ChooseControl'
import ServiceList from '../component/ServiceList'
const searchLabel = [
  {
    value: 'snapSite',
    initValue: '',
    type: 'input',
    label: '安装位置',
    placeholder: '请输入安装位置'
  },
  {
    value: 'deviceName',
    initValue: '',
    type: 'input',
    label: '设备名称',
    placeholder: '请输入设备名称'
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
        val: '网络相机'
      },
      {
        key: 2,
        val: '面板机'
      }
    ],
    value: 'deviceType',
    type: 'select',
    label: '设备类型',
    scopedSlots: {
      customRender: 'other5'
    }
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
    value: 'inOrOut',
    type: 'select',
    label: '控制类型'
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
        val: '是'
      },
      {
        key: 0,
        val: '否'
      }
    ],
    value: 'controlType',
    type: 'select',
    label: '是否校门门禁'
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
    title: '设备分组',
    width: '14%',
    scopedSlots: {
      customRender: 'other3'
    }
  },
  {
    title: '安装位置',
    dataIndex: 'snapSite',
    width: '12%'
  },
  {
    title: '设备名称',
    dataIndex: 'deviceName',
    width: '15%'
  },
  {
    title: '设备类型',
    dataIndex: 'deviceType',
    width: '14%',
    customRender: text => {
      return parseInt(text) === 1 ? '网络相机' : '面板机'
    }
  },
  {
    title: '控制类型',
    dataIndex: 'inOrOut',
    width: '12%',
    customRender: text => {
      return parseInt(text) === 1 ? '进' : '出'
    }
  },
  {
    title: '是否校门门禁',
    dataIndex: 'controlType',
    width: '12%',
    customRender: text => {
      return parseInt(text) === 1 ? '是' : '否'
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
const formData = [
  {
    value: 'inOrOut',
    initValue: 1,
    list: [
      {
        key: 1,
        val: '进'
      },
      {
        key: 2,
        val: '出'
      }
    ],
    type: 'radio',
    label: '控制类型',
    placeholder: '请选择控制类型'
  },
  {
    value: 'controlType',
    initValue: 1,
    list: [
      {
        key: 1,
        val: '是'
      },
      {
        key: 0,
        val: '否'
      }
    ],
    type: 'radio',
    label: '是否校门门禁',
    placeholder: '请选择是否校门门禁'
  }
]
export default {
  name: 'DeviceManage',
  components: {
    TableList,
    SearchForm,
    PageNum,
    SubmitForm,
    ChooseControl,
    ServiceList
  },
  data() {
    return {
      columns,
      searchLabel,
      formData,
      formStatus: false,
      userTag: false,
      title: '设置',
      total: 0,
      pageList: {
        page: 1,
        size: 20
      },
      deviceList: [],
      chooseList: [],
      type: 0,
      record: {},
      chooseType: 'door',
      value: 1,
      serviseList: [],
      groupCode: '',
      groupName: ''
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  mounted() {
    this.showList()
  },
  methods: {
    ...mapActions('home', ['getDeviceList', 'addDeviceInfo', 'deleteDeviceInfo', 'groupList']),
    async changeTab(item) {
      this.groupCode = item.deviceGroupCode
      this.groupName = item.deviceGroupName
      this.code = item.key
      this.showList()
    },
    async showService(item) {
      this.serviseList = item
    },
    onChange(a, b) {
      const req = []
      req.push({
        controlType: a.controlType,
        inOrOut: a.inOrOut,
        schoolCode: this.userInfo.schoolCode,
        deviceIp: a.deviceIp,
        deviceName: a.deviceName,
        deviceSn: a.deviceSn,
        deviceStatus: a.deviceStatus,
        deviceType: a.deviceType,
        snapSite: a.snapSite,
        deviceGroupCode: b.deviceGroupCode,
        deviceGroupName: b.deviceGroupName,
        id: a.id
      })
      this.addDeviceInfo(req).then(() => {
        this.$message.success('添加成功')
        this.$tools.goNext(() => {
          this.showList(this.keyword)
          this.$refs.chooseUser.reset()
        })
      })
    },
    async showList(searchObj = {}) {
      const req = {
        pageNum: this.pageList.page,
        pageSize: this.pageList.size,
        deviceGroupCode: this.code,
        schoolCode: this.userInfo.schoolCode,
        ...searchObj
      }
      const res = await this.getDeviceList(req)
      this.deviceList = res.data.list
      this.total = res.data.total
    },
    searchForm(values) {
      this.pageList.pageNum = 1
      const searchObj = {
        snapSite: values.snapSite,
        inOrOut: values.inOrOut,
        deviceType: values.deviceType,
        deviceName: values.deviceName,
        controlType: values.controlType
      }
      this.showList(searchObj)
    },
    addDevice() {},
    batchAdd(type, record) {
      this.formStatus = true
      if (type) {
        this.type = 1
        this.record = record
        this.formData = this.$tools.fillForm(formData, record)
      } else {
        console.log(this.chooseList)
        this.type = 0
        this.record = {}
        this.formData = formData
      }
    },
    clickRow(id) {},
    async batchDelete(type, record) {
      if (type) {
        console.log(record.id)
        const req = [record.id]
        await this.deleteDeviceInfo(req)
        this.$message.success('删除成功')
        this.$tools.goNext(() => {
          this.chooseList = []
          this.showList(this.keyword)
        })
      } else {
        if (this.chooseList.length === 0) {
          this.$message.warning('请选择删除项')
          return
        }
        const req = this.chooseList
        this.$tools.delTip('您确定删除吗?', () => {
          this.deleteDeviceInfo(req).then(res => {
            this.$message.success('删除成功')
            this.$tools.goNext(() => {
              this.chooseList = []
              this.showList(this.keyword)
            })
          })
        })
      }
    },
    submitForm(values) {
      console.log(values)
      let req = []
      if (this.type) {
        req = [
          {
            ...this.record,
            ...values,
            schoolCode: this.userInfo.schoolCode
          }
        ]
      } else {
        if (this.chooseList.length === 0) {
          this.$message.warning('请选择设置项')
          this.$refs.form.reset()
          return
        }
        this.chooseList.forEach(ele => {
          req.push({
            id: ele,
            schoolCode: this.userInfo.schoolCode,
            ...values
          })
        })
      }
      this.addDeviceInfo(req)
        .then(() => {
          this.$message.success('设置成功')
          this.$tools.goNext(() => {
            this.showList()
            this.$refs.form.reset()
          })
        })
        .catch(() => {
          this.$refs.form.error()
        })
    },
    // 添加设备
    chooseUser(value) {
      this.userTag = false
      this.$refs.chooseUser.reset()
      const req = []
      value.forEach(ele => {
        req.push({
          controlType: ele.controlType,
          inOrOut: ele.inOrOut,
          schoolCode: this.userInfo.schoolCode,
          deviceIp: ele.deviceIp,
          deviceName: ele.deviceName,
          deviceSn: ele.deviceSn,
          deviceStatus: ele.deviceStatus,
          deviceType: ele.deviceType,
          snapSite: ele.snapSite,
          deviceGroupCode: this.groupCode,
          deviceGroupName: this.groupName
        })
      })
      this.addDeviceInfo(req).then(() => {
        this.$message.success('添加成功')
        this.$tools.goNext(() => {
          this.showList(this.keyword)
          this.$refs.chooseUser.reset()
        })
      })
    }
  }
}
</script>
<style lang="less" scoped>
.control-tab {
  width: 250px;
  background-color: #fff;
}
</style>
