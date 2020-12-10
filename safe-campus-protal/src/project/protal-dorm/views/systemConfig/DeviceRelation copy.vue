<template>
  <div class="device-page">
    <div class="device-left">
      <a-table
        :rowSelection="{type: 'radio',selectedRowKeys: buildSelectedRowKeys, onChange: buildSelectChange}"
        :customRow="setBuildRow"
        :rowKey="(record, index) => index"
        :pagination="false"
        :columns="buildColumns"
        :dataSource="buildTableData"
        :scroll="{ y: 540 }"
        ref="multipleLeftTable"
      >
        <template slot="addControl" slot-scope="text, record">
          <a-tag color="green" @click="addControl(record)">+</a-tag>
        </template>
      </a-table>

    </div>
    <div class="device-right">
      <a-table
        :rowKey="(record, index) => index"
        :columns="controlColumns"
        :dataSource="selectedGroupTableData"
        ref="multipleTable"
        :pagination="false"
      >
        <template slot="delControl" slot-scope="text, record">
          <a-tag color="pink" @click="deleteControl(record)">-</a-tag>
        </template>
      </a-table>
    </div>
    <a-modal
      title="控制组列表"
      v-model="controlDialogVisible"
      :destroyOnClose="true"
      width="1100px"
      @cancel="controlDialogVisible = false"
      @ok="bindControl"
    >
      <a-table
        :rowKey="(record, index) => index"
        :pagination="false"
        :columns="chooseControlColumns"
        :dataSource="controlGroupNewTableData"
        ref="multipleTable"
        :scroll="{ y: 540 }"
        :rowSelection="{selectedRowKeys: controlSelectedRowKeys, onChange: controlSelectChange}"
        :customRow="setControlRow">
        <template slot="typeCode" slot-scope="typeCode">
          <span>{{ getInOrOut(typeCode) }}</span>
        </template>
        <template slot="ext1" slot-scope="ext1">
          <span>{{ getCheck(ext1) }}</span>
        </template>
      </a-table>

    </a-modal>
  </div>
</template>

<script>
import mixins from '@u/mixins'
import { mapActions } from 'vuex'
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
  title: '控制组名称',
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
const chooseControlColumns = [{
  title: '序号',
  dataIndex: 'index',
  width: '8%',
  align: 'center',
  customRender: function (text, row, index) {
    text = index + 1
    return text
  }
}, {
  title: '控制组名称',
  dataIndex: 'groupName',
  width: '18%'
}, {
  title: '控制组编号',
  dataIndex: 'groupCode',
  width: '15%'
}, {
  title: '进出',
  dataIndex: 'typeCode',
  width: '10%',
  scopedSlots: {
    customRender: 'typeCode'
  }
}, {
  title: '校验规则',
  dataIndex: 'ext1',
  width: '10%',
  scopedSlots: {
    customRender: 'ext1'
  }
}, {
  title: '创建时间',
  dataIndex: 'createTime',
  width: '20%'
}, {
  title: '备注',
  dataIndex: 'remark',
  width: '20%'
}]
export default {
  name: 'DeviceRelation',
  mixins: [mixins],
  data () {
    return {
      tableHeight: 0,
      buildColumns,
      controlColumns,
      chooseControlColumns,
      controlDialogVisible: false,
      buildTableData: [],
      controlGroupTableData: [],
      controlGroupNewTableData: [],
      selectedGroupTableData: [],
      selectIds: [],
      buildDeviceMap: {},
      currentActiveRow: {},
      lastActiveRow: {},
      controlSelectedRowKeys: [],
      buildSelectedRowKeys: [],
      controlSelectedRows: [],
      radio: '',
      buildSelectedRows: []
    }
  },
  methods: {
    ...mapActions('orgTree',
      ['getBuildNode']),
    ...mapActions('deviceRelation', ['getGroupList',
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
    // 左侧楼栋点击
    buildSelectChange (selectedRowKeys, selectedRows) {
      this.buildSelectedRowKeys = selectedRowKeys
      this.buildSelectedRows = selectedRows
    },
    // 弹框控制组点击
    controlSelectChange (selectedRowKeys, selectedRows) {
      this.controlSelectedRowKeys = selectedRowKeys
      this.controlSelectedRows = selectedRows
    },
    // 楼栋点击选择一行
    setBuildRow (record, index) {
      return {
        on: {
          click: () => {
            // console.log('select', record, index)
            this.currentActiveRow = record
            this.buildSelectedRowKeys = [index]
            this.getRelationControls(record.categoryCode)
          }
        }
      }
    },
    // 弹框控制组点击选择一行
    setControlRow (record, index) {
      return {
        on: {
          click: () => {
            let flag = false
            let keys = []
            keys = this.controlSelectedRowKeys
            if (keys.indexOf(index) >= 0) {
              flag = true
            }
            if (flag) {
              keys.splice(keys.findIndex(item => item === index), 1)
              this.controlSelectedRows.splice(this.controlSelectedRows.findIndex(item => item === record), 1)
            } else {
              keys.push(index)
              this.controlSelectedRows.push(record)
            }
          }
        }
      }
    },
    // 获取左侧楼栋
    buildListGet () {
      const _self = this
      _self.getBuildNode(sessionStorage.getItem('schoolScheme')).then(res => {
        _self.buildTableData = res.data
        _self.buildTableData.forEach(function (item) {
          _self.$set(item, 'active', false)
        })
        _self.$nextTick(function () {
          if (_self.buildTableData[0]) {
            _self.buildTableData[0].active = true
            _self.lastActiveRow = _self.buildTableData[0]
            _self.currentActiveRow = res.data[0]
            _self.getRelationControls(res.data[0].categoryCode)
          }
        })
      }).catch(err => {
        _self.$message.error(err.message)
      })
    },
    // 获取右侧控制组
    getRelationControls (data) {
      var _self = this
      _self.getControlList('?buildingCode=' + data + '&schoolCode=' + sessionStorage.getItem('schoolScheme')).then(res => {
        _self.selectedGroupTableData = res.data.list
      }).catch(err => {
        _self.$message.error(err.message)
      })
    },
    // 右侧控制组解绑
    deleteControl (row) {
      var _self = this
      _self.$confirm({
        title: '确定要解除控制组的绑定吗?',
        okText: '确认',
        cancelText: '取消',
        onOk () {
          _self.deleteControlHandle(row.id).then(res => {
            _self.$message.success('解绑成功')
            _self.goNext(() => {
              _self.getRelationControls(_self.currentActiveRow.categoryCode)
            })
          }).catch(err => {
            _self.$message.error(err.message)
          })
        }
      })
    },
    // 添加弹窗
    addControl (row) {
      const _self = this
      _self.controlSelectedRowKeys = []
      _self.controlSelectedRows = []
      _self.currentActiveRow = row
      _self.getControlList('?schoolCode=' + sessionStorage.getItem('schoolScheme')).then(res => {
        _self.controlGroupNewTableData = res.data.list
        _self.selectIds = res.data.list.map(function (elem) {
          return elem.controllerCode
        })
        // if (_self.controlGroupTableData.length === 0) {
        _self.getControlGroupList()
        // } else {
        //   _self.controlGroupNewTableData = _self.controlGroupTableData.filter(function (v) {
        //     return _self.selectIds.indexOf(v.groupCode) === -1
        //   })
        //   _self.controlDialogVisible = true
        // }
      })
    },
    // 获取弹框控制组筛选
    getControlGroupList () {
      var _self = this
      const req = {
        schoolScheme: sessionStorage.getItem('schoolScheme'),
        page: 1,
        start: 0,
        size: 20
      }
      _self.getGroupList(req).then(res => {
        _self.controlGroupTableData = res.data.list
        _self.controlGroupTableData.forEach(function (elem) {
          elem.createTime = _self.getdate(elem.createTime).split(' ')[0]
        })
        _self.controlGroupNewTableData = _self.controlGroupTableData.filter(function (v) {
          return _self.selectIds.indexOf(v.groupCode) === -1
        })
        _self.controlDialogVisible = true
      })
    },
    // 提价添加控制组
    bindControl () {
      var _self = this
      const filterControlList = this.controlSelectedRows.map(function (item) {
        return {
          controllerCode: item.groupCode,
          controllerName: item.groupName
        }
      })
      const req = {
        buildingCode: this.currentActiveRow.categoryCode,
        controllerList: filterControlList,
        // "floorCode": "string",
        schoolCode: sessionStorage.getItem('schoolScheme')
      }
      if (this.controlSelectedRowKeys.length === 0 && this.controlGroupNewTableData.length > 0) {
        this.$message.warning('请选择控制组')
      } else {
        _self.bindControlHandle(req).then(res => {
          _self.$message.success('绑定成功!')
          _self.controlDialogVisible = false
          _self.goNext(() => {
            _self.getRelationControls(_self.currentActiveRow.categoryCode)
          })
        }).catch(err => {
        })
      }
    }
  },
  mounted () {
    this.tableHeight = document.querySelector('#app').offsetHeight - 575
    this.buildListGet()
  }
}
</script>
<style lang="less" scoped>
.device-page {
    width: 100%;
    height: 100%;
    background-color: #f6f5fa;
    padding: 10px 10px 0px 12px;
    display: flex;
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

.abnormal-left {
    width: 265px;
    height: 100%;
    background-color: #fff;
    display: flex;
    flex-direction: column;
}

.abnormal-right {
    flex: 1;
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 0 10px;
    width: calc(100% - 265px);
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
</style>
