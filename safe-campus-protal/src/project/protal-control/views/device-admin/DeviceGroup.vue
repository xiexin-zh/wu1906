<template>
  <div class="device-list page-layout qui-fx-ver">
    <submit-form ref="form" @submit-form="submitForm" :title="title" v-model="formStatus" :form-data="formData">
    </submit-form>
    <search-form is-reset @search-form="searchForm" :search-label="searchLabel">
      <div slot="left">
        <a-button type="primary" @click="addDevice(false, '', '新增设备组')" icon="plus" >新增设备组</a-button>
      </div>
      <div slot="right">
      </div>
    </search-form>
    <table-list
      :page-list="pageList"
      :columns="deviceGroupColumns"
      :table-list="deviceGroupList">
      <template v-slot:actions="action">
        <a-tooltip placement="topLeft" title="详情">
          <a-button @click="goDetail(action.record)" size="small" class="detail-action-btn" icon="ellipsis"></a-button>
        </a-tooltip>
        <a-tooltip placement="topLeft" title="编辑">
          <a-button size="small" class="edit-action-btn" icon="form" @click.stop="addDevice(true, action.record, '编辑设备组')"></a-button>
        </a-tooltip>
        <a-popconfirm placement="left" okText="确定" cancelText="取消" @confirm="delDevice(action.record)">
          <template slot="title">
            您确定删除吗?
          </template>
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
import SubmitForm from '@c/SubmitForm'
import SearchForm from '@c/SearchForm'
import TableList from '@c/TableList'
import PageNum from '@c/PageNum'
import deviceGroupColumns from '../../assets/js/table/deviceGroupColumns'
const formData = [
  {
    value: 'deviceGroupName',
    initValue: '',
    type: 'input',
    label: '设备组名称',
    placeholder: '请输入设备组名称'
  },
  {
    value: 'deviceGroupType',
    initValue: [],
    type: 'select',
    label: '设备组类型',
    list: [
      {
        key: 1,
        val: '网络相机'
      },
      {
        key: 2,
        val: '面板机'
      }
    ],
    placeholder: '请选择设备组类型'
  },
  {
    value: 'threshold',
    initValue: '',
    type: 'numberInput',
    min: 60,
    max: 99,
    label: '识别阈值',
    placeholder: '请输入60-99范围的识别阈值'
  },
  {
    value: 'remarks',
    initValue: '',
    type: 'input',
    label: '备注',
    placeholder: '请输入备注',
    required: false
  }
]
const searchLabel = [
  {
    value: 'deviceGroupName',
    type: 'input',
    label: '设备组名称',
    placeholder: '请输入设备组名称'
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
    value: 'deviceGroupType',
    type: 'select',
    label: '设备类型'
  }
]
export default {
  name: 'DeviceList',
  components: {
    SearchForm,
    TableList,
    PageNum,
    SubmitForm
  },
  computed: {
    ...mapState('home', [
      'schoolCode'
    ])
  },
  data () {
    return {
      total: 0,
      formStatus: false,
      title: '',
      searchLabel,
      formData,
      deviceGroupColumns,
      searchText: {
        deviceGroupName: '',
        deviceGroupType: ''
      },
      pageList: {
        page: 1,
        size: 20
      },
      deviceGroupList: []
    }
  },
  mounted () {
    this.showList()
  },
  methods: {
    ...mapActions('home', [
      'getDeviceGroupList',
      'addDeviceGroup',
      'updateDeviceGroup',
      'delDeviceGroup'
    ]),
    async showList () {
      const res = await this.getDeviceGroupList({
        schoolCode: this.schoolCode,
        ...this.pageList,
        ...this.searchText
      })
      this.deviceGroupList = res.data.list
      this.total = res.data.total
    },
    addDevice (type, record, msg) {
      this.formStatus = true
      this.isEdit = type
      this.title = msg
      if (type) {
        this.id = record.id
        this.deviceGroupCode = record.deviceGroupCode
        this.funName = 'updateDeviceGroup'
        this.formData = this.$tools.fillForm(formData, record)
      } else {
        this.funName = 'addDeviceGroup'
        this.formData = formData
      }
    },
    searchForm (values) {
      this.searchText = values
      this.showList()
    },
    submitForm (values) {
      if (this.isEdit) {
        values.id = this.id
        values.deviceGroupCode = this.deviceGroupCode
      }
      this[this.funName]({
        ...values,
        schoolCode: this.schoolCode
      }).then(res => {
        this.$message.success('操作成功')
        this.$refs.form.reset()
        this.$tools.goNext(() => {
          this.showList()
        })
      }).catch(() => {
        this.$refs.form.error()
      })
    },
    async delDevice ({ id }) {
      await this.delDeviceGroup(id)
      this.$message.success('删除成功')
      this.$tools.goNext(() => {
        this.showList()
      })
    },
    goDetail ({ id }) {
      this.$router.push({
        path: '/deviceGroup/deviceDetail',
        query: {
          id
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
