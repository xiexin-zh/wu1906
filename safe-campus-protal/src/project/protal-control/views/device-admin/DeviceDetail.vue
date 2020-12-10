<template>
  <div class="device-detail page-layout qui-fx-ver">
    <div v-if="deviceStatus">
      <bind-device :group-code="groupCode" :device-type="deviceGroupType" v-model="deviceStatus"></bind-device>
    </div>
    <detail-show :detail-info="detailInfo"></detail-show>
    <div class="qui-fx-f1 bg-fff">
      <a-tabs :defaultActiveKey="autoKey" @change="changeTab">
        <a-tab-pane tab="设备列表" key="1">
          <table-list
            :columns="deviceColumns"
            :table-list="deviceList">
            <template v-slot:actions="action">
              <a-popconfirm placement="left" okText="确定" cancelText="取消" @confirm="delDeviceList(action.record)">
                <template slot="title">
                  您确定删除吗?
                </template>
                <a-tooltip placement="topLeft" title="移除">
                  <a-button size="small" class="del-action-btn" icon="delete"></a-button>
                </a-tooltip>
              </a-popconfirm>
            </template>
          </table-list>
        </a-tab-pane>
        <a-tab-pane tab="所属控制组" key="2">
          <table-list
            :columns="controlGroupColumns"
            :table-list="controlList">
          </table-list>
        </a-tab-pane>
        <a-button slot="tabBarExtraContent" icon="plus" class="add-btn" v-if="autoKey === '1'" @click="bindDevice">绑定设备</a-button>
      </a-tabs>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import DetailShow from '@c/DetailShow'
import TableList from '@c/TableList'
import BindDevice from '../../component/BindDevice'
import deviceColumns from '../../assets/js/table/deviceColumns'
import controlGroupColumns from '../../assets/js/table/controlGroupColumns'
export default {
  name: 'DeviceDetail',
  components: {
    DetailShow,
    TableList,
    BindDevice
  },
  computed: {
    ...mapState('home', [
      'schoolCode'
    ])
  },
  data () {
    return {
      autoKey: '1',
      deviceGroupType: '',
      groupCode: '',
      detailInfo: [],
      deviceStatus: false,
      deviceColumns,
      controlGroupColumns: controlGroupColumns.slice(0, controlGroupColumns.length - 1),
      controlList: [],
      deviceList: []
    }
  },
  async mounted () {
    deviceColumns.splice(deviceColumns.length - 2, 1)
    this.gruopId = this.$route.query.id
    const res = await this.deviceGroupDetail({
      id: this.gruopId
    })
    this.groupCode = res.data.deviceGroupCode
    this.deviceGroupType = res.data.deviceGroupType
    this.deviceSn = res.data.deviceSn
    this.detailInfo = [
      {
        key: '设备组名称',
        val: res.data.deviceGroupName
      },
      {
        key: '设备组类型',
        val: this.$tools.deviceTypeName(res.data.deviceGroupType)
      },
      {
        key: '阈值',
        val: res.data.threshold
      },
      {
        key: '设备组备注',
        val: res.data.remarks
      }
    ]
    this.getDeviceList()
  },
  methods: {
    ...mapActions('home', [
      'deviceGroupDetail',
      'unBindDevice',
      'getControlInfoByCode',
      'getDeviceListByDeviceGroup'
    ]),
    /**
     * @description 查询关联的设备
     */
    async getDeviceList () {
      const res = await this.getDeviceListByDeviceGroup({
        deviceGroupCode: this.groupCode,
        schoolCode: this.schoolCode,
        deviceGroupType: this.deviceGroupType,
        page: 1,
        size: 20
      })
      this.deviceList = res.data.list
    },
    changeTab (val) {
      this.autoKey = val
      if (this.autoKey === '1') {
        this.getDeviceList()
      } else {
        this.getControlList()
      }
    },
    async delDeviceList ({ id, deviceSn }) {
      await this.unBindDevice({
        id,
        deviceGroupCode: this.groupCode,
        schoolCode: this.schoolCode,
        deviceSn: deviceSn
      })
      this.$message.success('解绑成功')
      this.$tools.goNext(() => {
        this.getDeviceList()
      })
    },
    async getControlList () {
      const res = await this.getControlInfoByCode({
        schoolCode: this.schoolCode,
        relationCode: this.groupCode
      })
      this.controlList = res.data
    },
    bindDevice () {
      this.deviceStatus = true
    }
  }
}
</script>

<style lang="less" scoped>
</style>
