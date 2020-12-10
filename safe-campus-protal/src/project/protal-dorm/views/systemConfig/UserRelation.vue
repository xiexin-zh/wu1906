<template>
  <div class="device-page page-layout">
    <div class="device-left qui-fx-ver">
      <div class="qui-fx-f1" id="table">
        <a-table
          :rowSelection="{type: 'radio',selectedRowKeys: buildSelectedRowKeys, onChange: buildSelectChange}"
          :customRow="setBuildRow"
          :rowKey="(record, index) => index"
          :pagination="false"
          :columns="buildColumns"
          :dataSource="buildTableData"
          :scroll="{y: this.$tools.setScroll('table')}"
          ref="multipleLeftTable"
        >
          <template slot="addControl" slot-scope="text, record">
            <a-tag color="green" @click="addControl(record)">+</a-tag>
          </template>
        </a-table>
      </div>
    </div>
    <div class="device-right qui-fx-ver">
      <div class="qui-fx-f1" id="rightTable">
        <a-table
          :rowKey="(record, index) => index"
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
    <choose-user
      ref="chooseUser"
      is-check
      chooseType="dorm"
      :bind-obj="bindObj"
      v-if="controlDialogVisible"
      v-model="controlDialogVisible"
      @submit="bindControl"
      title="添加宿管员">
    </choose-user>
  </div>
</template>

<script>
import ChooseUser from '@c/ChooseUser'
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
  title: '宿管员名称',
  dataIndex: 'staffName',
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
  width: '6%',
  align: 'center',
  customRender: function (text, row, index) {
    text = index + 1
    return text
  }
}, {
  title: '姓名',
  dataIndex: 'userName',
  width: '10%'
}, {
  title: '性别',
  dataIndex: 'sex',
  width: '8%',
  scopedSlots: {
    customRender: 'sex'
  }
}, {
  title: '工号',
  dataIndex: 'schoolNumber',
  width: '16%'
}, {
  title: '手机号',
  dataIndex: 'mobile',
  width: '18%'
}, {
  title: '邮箱',
  dataIndex: 'email',
  width: '18%'
}, {
  title: '头像',
  dataIndex: 'photoSrc',
  width: '18%',
  scopedSlots: {
    customRender: 'photoSrc'
  }
}]
export default {
  name: 'UserRelation',
  mixins: [mixins],
  components: {
    ChooseUser
  },
  data () {
    return {
      tableHeight: 0,
      buildColumns,
      controlColumns,
      chooseControlColumns,
      controlDialogVisible: false,
      buildTableData: [],
      selectedGroupTableData: [],
      currentActiveRow: {},
      lastActiveRow: {},
      buildSelectedRowKeys: [0],
      buildSelectedRows: [],
      bindObj: {}
    }
  },
  methods: {
    ...mapActions('orgTree',
      ['getBuildNode']),
    ...mapActions('userRelation', ['deleteUserHandle', 'addUserHandle', 'getStaffBuild']),
    // 左侧楼栋点击
    buildSelectChange (selectedRowKeys, selectedRows) {
      this.buildSelectedRowKeys = selectedRowKeys
      this.buildSelectedRows = selectedRows
    },
    // 楼栋点击选择一行
    setBuildRow (record, index) {
      return {
        on: {
          click: () => {
            this.currentActiveRow = record
            this.buildSelectedRowKeys = [index]
            this.getRelationControls(record.categoryCode)
          }
        }
      }
    },
    // 获取楼栋
    buildListGet () {
      this.getBuildNode(sessionStorage.getItem('schoolScheme')).then(res => {
        this.buildTableData = res.data
        if (this.buildTableData.length > 0) {
          this.$nextTick(function () {
            this.buildTableData[0].active = true
            this.lastActiveRow = this.buildTableData[0]
            this.currentActiveRow = res.data[0]
            this.getRelationControls(res.data[0].categoryCode)
          })
        }
      })
    },
    // 获取右侧绑定完成的控制组
    getRelationControls (data) {
      this.getStaffBuild('?buildingCode=' + data + '&schoolCode=' + sessionStorage.getItem('schoolScheme')).then(res => {
        this.selectedGroupTableData = res.data.list
      })
    },
    // 右侧控制组解绑
    deleteControl (row) {
      this.$tools.delTip('确定要解除宿管员的绑定吗?', () => {
        this.deleteUserHandle(row.id).then(res => {
          this.$message.success('解绑成功')
          this.$tools.goNext(() => {
            this.getRelationControls(this.currentActiveRow.categoryCode)
          })
        })
      })
    },
    // 添加弹窗
    addControl (row) {
      this.bindObj.buildingCode = row.categoryCode
      this.bindObj.schoolCode = sessionStorage.getItem('schoolScheme')
      this.controlDialogVisible = true
    },
    // 添加选择项
    bindControl (item) {
      const filterStaffList = item.map(el => {
        return {
          staffCode: el.userCode,
          staffName: el.userName
        }
      })
      const req = {
        buildingName: this.currentActiveRow.categoryName,
        buildingCode: this.currentActiveRow.categoryCode,
        staffList: filterStaffList,
        schoolCode: sessionStorage.getItem('schoolScheme'),
        schoolName: sessionStorage.getItem('schoolName')
      }
      if (item.length === 0) {
        this.$message.warning('请选择宿管员！')
      } else {
        this.addUserHandle(req).then(res => {
          this.$message.success('绑定成功!')
          this.controlDialogVisible = false
          this.$tools.goNext(() => {
            this.getRelationControls(this.currentActiveRow.categoryCode)
          })
        }).catch(() => {
          this.$refs.chooseUser.error()
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
  display: flex;
  background-color: #f6f5fa;
  height: 100%;
}
.device-left {
  width: 50%;
}
.device-right {
  margin-left: 10px;
  width: calc(50% - 15px);
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
