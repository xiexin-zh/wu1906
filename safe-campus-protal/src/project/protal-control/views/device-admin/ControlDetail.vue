<template>
  <div class="control-detail page-layout qui-fx-ver">
    <div v-if="deviceStatus">
      <bind-device-group :group-code="groupCode" v-model="deviceStatus"></bind-device-group>
    </div>
    <div v-if="busStatus">
      <bind-bus-module :group-code="groupCode" v-model="busStatus"></bind-bus-module>
    </div>
    <div v-if="serverStatus">
      <bind-server :group-code="groupCode" v-model="serverStatus"></bind-server>
    </div>
    <detail-show :detail-info="detailInfo"></detail-show>
    <div class="qui-fx-f1 bg-fff">
      <a-tabs :defaultActiveKey="autoKey" @change="changeTab">
        <a-tab-pane tab="设备组列表" key="1">
          <a-row>
            <a-col :span="8">
              <table-list
                is-radio
                @clickRow="clickRow"
                v-model="chooseList"
                :columns="deviceGroupColumns"
                :table-list="deviceGroupList">
                <template v-slot:actions="action">
                  <a-popconfirm placement="left" okText="确定" cancelText="取消" @confirm="delDeviceList(action.record, '1')">
                    <template slot="title">
                      您确定删除吗?
                    </template>
                    <a-tooltip placement="topLeft" title="移除">
                      <a-button @click.stop="" size="small" class="del-action-btn" icon="delete"></a-button>
                    </a-tooltip>
                  </a-popconfirm>
                </template>
              </table-list>
            </a-col>
            <a-col :span="16">
              <table-list
                :columns="bindDeviceColumns"
                :table-list="deviceList">
                <template v-slot:actions="action">
                  <a-select defaultValue="0" style="width: 120px">
                    <a-select-option value="0">关机</a-select-option>
                    <a-select-option value="1">重启</a-select-option>
                    <a-select-option value="2">重置</a-select-option>
                  </a-select>
                </template>
              </table-list>
            </a-col>
          </a-row>
        </a-tab-pane>
        <a-tab-pane tab="识别服务" key="2" forceRender>
          <table-list
            :columns="serverColumns"
            :table-list="serverList">
            <template v-slot:actions="action">
              <a-popconfirm placement="left" okText="确定" cancelText="取消" @confirm="delDeviceList(action.record, '2')">
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
        <a-tab-pane tab="业务规则" key="3" forceRender>
          <table-list
            :columns="busColumns"
            :table-list="busList">
            <template v-slot:actions="action">
              <a-popconfirm placement="left" okText="确定" cancelText="取消" @confirm="delDeviceList(action.record, '3')">
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
        <a-button slot="tabBarExtraContent" icon="plus" class="add-btn" v-if="autoKey === '1'" @click="bindDevice">绑定设备组</a-button>
        <a-button slot="tabBarExtraContent" icon="plus" class="add-btn" v-if="autoKey === '2'" @click="bindServer">新增识别服务</a-button>
        <a-button slot="tabBarExtraContent" icon="plus" class="add-btn" v-if="autoKey === '3'" @click="bindBus">新增业务规则</a-button>
      </a-tabs>
    </div>
  </div>
</template>

<script>
import DetailShow from '@c/DetailShow'
import TableList from '@c/TableList'
import SubmitForm from '@c/SubmitForm'
import bindDeviceColumns from '../../assets/js/table/bindDeviceColumns'
import BindBusModule from '../../component/BindBusModule'
import BindServer from '../../component/BindServer'
import BindDeviceGroup from '../../component/BindDeviceGroup'
import { mapState, mapActions } from 'vuex'
const busColumns = [{
  title: '序号',
  scopedSlots: {
    customRender: 'index'
  },
  width: '10%'
}, {
  title: '业务名称',
  dataIndex: 'relationName',
  width: '70%'
}, {
  title: '操作',
  key: 'action',
  width: '20%',
  scopedSlots: {
    customRender: 'action'
  }
}]
const deviceGroupColumns = [{
  title: '序号',
  scopedSlots: {
    customRender: 'index'
  },
  width: '20%'
}, {
  title: '设备组名称',
  dataIndex: 'relationName',
  width: '50%'
}, {
  title: '操作',
  key: 'action',
  width: '20%',
  scopedSlots: {
    customRender: 'action'
  }
}]
const serverColumns = [{
  title: '序号',
  scopedSlots: {
    customRender: 'index'
  },
  width: '20%'
}, {
  title: '识别服务名称',
  dataIndex: 'relationName',
  width: '30%'
}, {
  title: '备注',
  dataIndex: 'remarks',
  width: '30%'
}, {
  title: '操作',
  key: 'action',
  width: '20%',
  scopedSlots: {
    customRender: 'action'
  }
}]
export default {
  name: 'ControlDetail',
  components: {
    DetailShow,
    TableList,
    SubmitForm,
    BindServer,
    BindDeviceGroup,
    BindBusModule
  },
  computed: {
    ...mapState('home', [
      'schoolCode'
    ])
  },
  data () {
    return {
      chooseList: [],
      autoKey: '1',
      deviceStatus: false,
      busStatus: false,
      groupCode: '',
      detailInfo: [],
      busColumns,
      serverColumns,
      deviceGroupColumns,
      bindDeviceColumns,
      deviceGroupList: [],
      busList: [],
      deviceList: [],
      serverList: [],
      serverStatus: false
    }
  },
  async mounted () {
    this.gruopId = this.$route.query.id
    const res = await this.controlGroupDetail({
      id: this.gruopId
    })
    this.groupCode = res.data.controlGroupCode
    this.detailInfo = [
      {
        key: '控制组名称',
        val: res.data.controlGroupName
      },
      {
        key: '控制组类型',
        val: this.$tools.controlTypeName(res.data.controlGroupType)
      },
      {
        key: '控制组备注',
        val: res.data.remarks
      }
    ]
    this.getDeviceGroup()
  },
  methods: {
    ...mapActions('home', [
      'controlGroupDetail',
      'controlGroupRelations',
      'getDeviceListByDeviceGroup',
      'unBindControlInfo'
    ]),
    /**
     * @description 查询关联的设备组
     */
    async getDeviceGroup () {
      const res = await this.controlGroupRelations({
        controlGroupCode: this.groupCode,
        relationType: this.autoKey,
        schoolCode: this.schoolCode
      })
      const data = res.data.list
      if (this.autoKey === '1') {
        this.deviceGroupList = data
        this.chooseList = [data[0].id]
        this.getDeviceList(data[0].relationCode, data[0].relationType)
      } else if (this.autoKey === '2') {
        this.serverList = data
      } else {
        this.busList = data
      }
    },
    changeTab (val) {
      this.autoKey = val
      this.getDeviceGroup()
    },
    bindDevice () {
      this.deviceStatus = true
    },
    bindServer () {
      this.serverStatus = true
    },
    bindBus () {
      this.busStatus = true
    },
    clickRow ({ relationCode }) {
      this.getDeviceList(relationCode, 1)
    },
    async delDeviceList (record, type) {
      await this.unBindControlInfo({
        id: record.id,
        schoolCode: this.schoolCode,
        relationType: type,
        deviceSns: record.deviceSns,
        relationCode: record.relationCode,
        controlGroupCode: record.controlGroupCode
      })
      this.$message.success('删除成功')
      this.$tools.goNext(() => {
        this.autoKey = type
        this.getDeviceGroup()
      })
    },
    /**
     * @description 查询设备组关联的设备
     */
    async getDeviceList (code, type) {
      const res = await this.getDeviceListByDeviceGroup({
        deviceGroupCode: code,
        deviceGroupType: type,
        schoolCode: this.schoolCode,
        page: 1,
        size: 20
      })
      this.deviceList = res.data.list
    }
  }
}
</script>

<style lang="less" scoped>
  .control-detail {
  }
</style>
