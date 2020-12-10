<template>
  <div class="device-page page-layout">
    <div class="device-left qui-fx-ver">
      <div class="qui-fx-f1" id="table">
        <a-table
          :rowSelection="{type: 'radio',selectedRowKeys: buildSelectedKeys, onChange: buildSelectChange}"
          :customRow="setBuildRow"
          :rowKey="(record) => record.id"
          :pagination="false"
          :columns="buildColumns"
          :dataSource="buildTableData"
          ref="multipleLeftTable"
          @expand="openCategory"
          :scroll="{y: this.$tools.setScroll('table')}"
        >
          <template slot="addControl" slot-scope="text, record">
            <a-tag color="green" @click="getRelationControls(record,1)">+</a-tag>
          </template>
          <a-table
            class="level-table"
            slot="expandedRowRender"
            :columns="buildColumns"
            slot-scope="record"
            :rowKey="(record) => record.id"
            :dataSource="record.innerData"
            :pagination="false"
            :rowSelection="{type: 'radio',selectedRowKeys: buildSelectedKeys, onChange: floorSelectChange}"
            :customRow="setFloorRow"
          >
            <template slot="addControl" slot-scope="text,record">
              <a-tag color="green" @click="getRelationControls(record,1)">+</a-tag>
            </template>
          </a-table>
        </a-table>
      </div>
    </div>
    <div class="device-right qui-fx-ver">
      <div class="qui-fx-f1" id="rightTable">
        <a-table
          :rowKey="(record, index) => record.id"
          :columns="controlColumns"
          :dataSource="selectedGroupTableData"
          ref="multipleTable"
          :pagination="false"
          :scroll="{y: this.$tools.setScroll('rightTable')}"
        >
          <template slot="delControl" slot-scope="text, record">
            <a-tag color="pink" @click="deleteControl(record)">-</a-tag>
          </template>
        </a-table>
      </div>
    </div>
    <choose-control
      v-if="controlDialogVisible"
      ref="chooseUser"
      is-check
      chooseType="dorm"
      :bind-obj="bindObj"
      v-model="controlDialogVisible"
      @submit="chooseUser"
      :schoolCode="userInfo.schoolCode"
      title="添加控制组">
    </choose-control>
  </div>
</template>

<script>
import ChooseControl from '@c/ChooseControl'
import mixins from '@u/mixins'
import { mapState, mapActions } from 'vuex'
const buildColumns = [{
  title: '序号',
  dataIndex: 'index',
  width: '15%',
  align: 'center',
  customRender: function (text, row, index) {
    text = index + 1
    return text
  }
}, {
  title: '楼栋名称',
  dataIndex: 'categoryName',
  width: '45%'
}, {
  title: '添加',
  dataIndex: 'addControl',
  width: '40%',
  scopedSlots: {
    customRender: 'addControl'
  }
}]
const controlColumns = [{
  title: '序号',
  dataIndex: 'index',
  width: '15%',
  align: 'center',
  customRender: function (text, row, index) {
    text = index + 1
    return text
  }
}, {
  title: '设备名称',
  dataIndex: 'controllerName',
  width: '45%'
}, {
  title: '删除',
  dataIndex: 'delControl',
  width: '40%',
  scopedSlots: {
    customRender: 'delControl'
  }
}]
export default {
  name: 'DeviceRelation',
  mixins: [mixins],
  components: {
    ChooseControl
  },
  data () {
    return {
      tableHeight: 0,
      buildColumns,
      controlColumns,
      controlDialogVisible: false,
      buildTableData: [],
      controlGroupTableData: [],
      controlGroupNewTableData: [],
      selectedGroupTableData: [],
      selectIds: [],
      buildDeviceMap: {},
      currentActiveRow: {},
      lastActiveRow: {},
      controlSelectedKeys: [],
      buildSelectedKeys: [],
      floorSelectedKeys: [],
      controlSelectedRows: [],
      radio: '',
      buildSelectedRows: [],
      floorSelectedRows: [],
      searchForm: {
        schoolCode: sessionStorage.getItem('schoolScheme'),
        schoolName: sessionStorage.getItem('schoolName'),
        pCode: ''
      },
      floorList: [],
      buildingCode: '',
      floorCode: '',
      bindObj: []
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  methods: {
    ...mapActions('orgTree',
      ['getBuildNode', 'getBuildChildNode']),
    ...mapActions('deviceRelation', ['getNewGroup',
      'bindControlHandle', 'getControlList', 'deleteControlHandle']),
    getInOrOut (type) {
      if (type === '1') {
        return '进'
      } else if (type === '2') {
        return '出'
      } else {
        return '未知'
      }
    },
    getCheck (type) {
      if (type === '1') {
        return '校验'
      } else {
        return '不校验'
      }
    },
    openCategory (tag, record) {
      if (tag) {
        this.searchForm.pCode = record.categoryCode
        this.getBuildChildNode(this.searchForm).then(res => {
          // this.floorList = res.data
          this.floorList = res.data
          record.innerData = this.floorList
        })
      } else {
      }
    },
    // 左侧楼栋点击
    buildSelectChange (selectedRowKeys, selectedRows) {
      this.buildSelectedKeys = selectedRowKeys
      this.buildSelectedRows = selectedRows
    },
    // 左侧楼栋点击
    floorSelectChange (selectedRowKeys, selectedRows) {
      this.floorSelectedKeys = selectedRowKeys
      this.floorSelectedRows = selectedRows
    },
    // 楼栋点击选择一行
    setBuildRow (record, index) {
      return {
        on: {
          click: () => {
            this.currentActiveRow = record
            this.buildSelectedKeys = [record.id]
            this.getRelationControls(record)
          }
        }
      }
    },
    // 楼层点击选择一行
    setFloorRow (record, index) {
      return {
        on: {
          click: () => {
            this.currentActiveRow = record
            this.buildSelectedKeys = [record.id]
            this.getRelationControls(record)
          }
        }
      }
    },
    // 获取左侧楼栋
    buildListGet () {
      this.getBuildNode(sessionStorage.getItem('schoolScheme')).then(res => {
        const repayLogItems = res.data
        repayLogItems.forEach(item => {
          item.innerData = []
          this.$set(item, 'active', false)
        })
        this.buildTableData = repayLogItems
        this.$nextTick(function () {
          if (this.buildTableData[0]) {
            this.buildTableData[0].active = true
            this.lastActiveRow = this.buildTableData[0]
            this.currentActiveRow = res.data[0]
            this.buildSelectedKeys = [this.buildTableData[0].id]
            this.getRelationControls(res.data[0])
          }
        })
      })
    },
    // 获取右侧控制组
    async getRelationControls (data, type) {
      if (data.pCode === '') {
        this.buildingCode = data.categoryCode
        this.floorCode = ''
      } else {
        this.buildingCode = data.pCode
        this.floorCode = data.categoryCode
      }
      const res = await this.getControlList('?buildingCode=' + this.buildingCode + '&floorCode=' + this.floorCode + '&schoolCode=' + sessionStorage.getItem('schoolScheme'))
      this.selectedGroupTableData = res.data.list
      this.bindObj = this.selectedGroupTableData
      if (type) {
        this.controlSelectedKeys = []
        this.controlSelectedRows = []
        this.currentActiveRow = data
        this.controlDialogVisible = true
      }
    },
    // 右侧控制组解绑
    deleteControl (row) {
      this.$tools.delTip('确定要解除控制组的绑定吗', () => {
        this.deleteControlHandle(row.id).then(res => {
          this.$message.success('解绑成功')
          this.$tools.goNext(() => {
            this.getRelationControls(this.currentActiveRow)
          })
        })
      })
    },
    // 提价添加控制组
    chooseUser (value) {
      this.userTag = false
      this.$refs.chooseUser.reset()
      this.groupList = []
      value.forEach(ele => {
        this.groupList.push({
          controllerCode: ele.deviceSn,
          controllerName: ele.deviceName
        })
      })
      const req = {
        buildingCode: this.buildingCode,
        controllerList: this.groupList,
        floorCode: this.floorCode,
        schoolCode: sessionStorage.getItem('schoolScheme')
      }
      this.bindControlHandle(req).then(res => {
        this.$message.success('绑定成功!')
        this.controlDialogVisible = false
        this.$tools.goNext(() => {
          this.getRelationControls(this.currentActiveRow)
        })
      })
    }
  },
  mounted () {
    this.tableHeight = document.querySelector('#app').offsetHeight - 575
    this.buildListGet()
  }
}
</script>
<style lang="less" scope>
.device-page {
  height: 100%;
  background-color: #f6f5fa;
  display: flex;
  .level-table {
    .ant-table-thead {
      display: none !important
    }
  }
  .device-left {
    width: 50%;
  }
  .device-right {
    width: calc(50% - 5px);
  }
  .el-divider--vertical {
    height: 100%;
  }
  .el-table-column--selection.is-leaf .cell {
    display: none;
  }
  .control-dialog .el-table-column--selection.is-leaf .cell {
    display: inline-block;
  }
  .abnormal_title {
    height: 80px;
    padding-left: 25px;
    display: flex;
    justify-content: space-between;
    border-bottom: solid 1px #d2d2d2;
  }
  .abnormal_title.fix {
    justify-content: flex-end;
    align-items: center;
  }
}

</style>
