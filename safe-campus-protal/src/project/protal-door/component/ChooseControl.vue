<template>
  <a-modal
    width="1200px"
    title="绑定设备"
    v-model="status"
    @ok="submitOk"
    :maskClosable="false"
    :destroyOnClose="true"
    :confirmLoading="confirmLoading"
  >
    <a-row type="flex" justify="start" style="margin-bottom: 15px;">
      <a-col>
        <span>设备名称：</span>
        <a-input v-model="keyword" style="width: 120px;margin-right: 20px" placeholder="请输入设备名称" />
      </a-col>
      <a-col>
        <span>设备类型：</span>
        <a-select v-model="deviceType" style="width: 120px;margin-right: 20px">
          <a-select-option v-for="(item, i) in typeList" :key="i" :value="item.key">{{ item.val }}</a-select-option>
        </a-select>
      </a-col>
      <a-col>
        <a-button type="primary" @click="getStudentList(true)">查询</a-button>
        <a-button type="default" @click="resetBtn">重置</a-button>
      </a-col>
    </a-row>
    <div class="choose-user qui-fx">
      <div class="qui-fx-ver qui-fx-f1">
        <table-list
          is-check
          is-zoom
          :scroll-h="500"
          :page-list="pageList"
          v-model="chooseList"
          :columns="
            chooseType === 'door'
              ? doorColumns
              : chooseType === 'device'
              ? dormColumns
              : chooseType === 'doorGroup'
              ? doorGroupColumns
              : columns
          "
          @clickRow="clickRow"
          @selectAll="selectAll"
          :table-list="userList"
        >
          <template v-slot:other1="other1">
            <div>
              <a-switch
                @click.native.stop
                @change="inOrOutCilck($event, other1.record)"
                checked-children="出"
                un-checked-children="进"
                v-model="other1.record.inOrOut"
              />
            </div>
          </template>
          <template v-slot:other2="other2">
            <div>
              <a-switch
                @click.native.stop
                @change="controlTypeCilck($event, other2.record)"
                checked-children="是"
                un-checked-children="否"
                v-model="other2.record.controlType"
              />
            </div>
          </template>
        </table-list>
        <page-num
          :jumper="false"
          v-model="pageList"
          :mar-top="20"
          :mar-bot="0"
          size="small"
          :total="total"
          @change-page="changePage(false)"
        ></page-num>
      </div>
      <!-- <div class="user-box qui-fx-ver">
        <div class="title qui-fx-jsb">
          <span>已选择</span>
          <span>{{ totalList.length }}个</span>
        </div>
        <div class="qui-fx-f1" style="overflow: auto">
          <ul>
            <li v-for="(item, index) in totalList" :key="item.id" class="qui-fx-jsb qui-fx-ac">
              <span>{{ item.deviceName }}</span>
              <a-tag @click="delUser(item.id, index)" color="#f50">删除</a-tag>
            </li>
          </ul>
        </div>
      </div> -->
    </div>
  </a-modal>
</template>

<script>
import PageNum from '@c/PageNum'
import { Switch } from 'ant-design-vue'
import TableList from '@c/TableList'
import $ajax from '@u/ajax-serve'
import hostEnv from '@config/host-env'
const doorGroupColumns = [
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
    width: '20%'
  },
  {
    title: '设备类型',
    dataIndex: 'deviceType',
    width: '10%',
    customRender: text => {
      return parseInt(text) === 1 ? '网络相机' : '面板机'
    }
  },
  {
    title: '安装位置',
    dataIndex: 'snapSite',
    width: '20%'
  },
  {
    title: '设备IP',
    dataIndex: 'deviceIp',
    width: '10%'
  },
  {
    title: '设备状态',
    dataIndex: 'deviceStatus',
    width: '10%',
    customRender: text => {
      return parseInt(text) === 1 ? '在线' : '离线'
    }
  },
  {
    title: '控制类型',
    dataIndex: 'inOrOut',
    width: '10%',
    customRender: text => {
      return parseInt(text) === 1 ? '进' : '出'
    }
  } /* ,
  {
    title: '是否校门门禁',
    dataIndex: 'controlType',
    width: '10%',
    customRender: text => {
      return parseInt(text) === 1 ? '是' : '否'
    }
  } */
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
    title: '设备名称',
    dataIndex: 'deviceName',
    width: '30%'
  },
  {
    title: '设备类型',
    dataIndex: 'deviceType',
    width: '10%',
    customRender: text => {
      return parseInt(text) === 1 ? '网络相机' : '面板机'
    }
  },
  {
    title: '安装位置',
    dataIndex: 'snapSite',
    width: '25%'
  },
  {
    title: '设备IP',
    dataIndex: 'deviceIp',
    width: '15%'
  },
  {
    title: '设备状态',
    dataIndex: 'deviceStatus',
    width: '10%',
    customRender: text => {
      return parseInt(text) === 1 ? '在线' : '离线'
    }
  }
]
const doorColumns = [
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
    width: '20%'
  },
  {
    title: '设备类型',
    dataIndex: 'deviceType',
    width: '10%',
    customRender: text => {
      return parseInt(text) === 1 ? '网络相机' : '面板机'
    }
  },
  {
    title: '安装位置',
    dataIndex: 'snapSite',
    width: '20%'
  },
  {
    title: '设备IP',
    dataIndex: 'deviceIp',
    width: '10%'
  },
  {
    title: '设备状态',
    dataIndex: 'deviceStatus',
    width: '10%',
    customRender: text => {
      return parseInt(text) === 1 ? '在线' : '离线'
    }
  },
  {
    title: '控制类型',
    dataIndex: 'inOrOut',
    width: '10%',
    scopedSlots: {
      customRender: 'other1'
    }
  },
  {
    title: '是否校门门禁',
    dataIndex: 'controlType',
    width: '10%',
    scopedSlots: {
      customRender: 'other2'
    }
  }
]
const dormColumns = [
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
    width: '20%'
  },
  {
    title: '设备类型',
    dataIndex: 'deviceType',
    width: '15%',
    customRender: text => {
      return parseInt(text) === 1 ? '网络相机' : '面板机'
    }
  },
  {
    title: 'SN码',
    dataIndex: 'deviceSn',
    width: '15%'
  },
  {
    title: '状态',
    dataIndex: 'deviceStatus',
    width: '10%',
    customRender: text => {
      return parseInt(text) === 1 ? '在线' : '离线'
    }
  },
  {
    title: '安装位置',
    dataIndex: 'snapSite',
    width: '15%'
  },
  {
    title: '控制类型',
    dataIndex: 'inOrOut',
    width: '10%',
    scopedSlots: {
      customRender: 'other1'
    }
  }
]
export default {
  name: 'ChooseControl',
  components: {
    PageNum,
    TableList,
    ASwitch: Switch
  },
  props: {
    isAll: {
      type: Boolean,
      default: false
    },
    schoolCode: {
      type: String,
      default: ''
    },
    groupCode: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    value: {
      type: Boolean,
      default: false
    },
    isRadio: {
      type: Boolean,
      default: false
    },
    bindList: {
      type: Array,
      default: () => {
        return []
      }
    },
    isCheck: {
      type: Boolean,
      default: false
    },
    bindObj: {
      type: Array,
      default: () => {
        return []
      }
    },
    controlList: {
      type: Array,
      default: () => {
        return []
      }
    },
    chooseType: {
      type: String,
      default: ''
    },
    bindCode: {
      type: String,
      default: ''
    }
  },
  computed: {
    status: {
      get() {
        return this.value
      },
      set() {
        this.$emit('input', false)
      }
    }
  },
  data() {
    return {
      confirmLoading: false,
      chooseList: [],
      pageList: {
        page: 1,
        size: 40
      },
      deviceType: '',
      typeList: [
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
      keyword: '',
      total: 0,
      columns,
      doorColumns,
      dormColumns,
      doorGroupColumns,
      userList: [],
      totalList: []
    }
  },
  async mounted() {
    if (this.chooseType === 'dorm') {
      console.log('dorm')
      this.bindObj.forEach(item => {
        this.chooseList.push(item.controllerCode)
        this.totalList.push({
          id: item.controllerCode,
          deviceSn: item.controllerCode,
          deviceName: item.controllerName
        })
      })
      this.getStudentList(true)
    } else if (this.chooseType === 'ncov') {
      this.pageList.size = 200
      if (!this.bindCode) {
        this.getStudentList()
        return
      }
      const res = await $ajax.get({
        url: `${hostEnv.protal_api_11005}/epidemic/group/detail`,
        params: {
          groupId: this.bindCode
        }
      })
      const users = res.data.controllerGroups
      users.forEach(item => {
        this.chooseList.push(item.deviceSn)
        this.totalList.push({
          id: item.deviceSn,
          deviceSn: item.deviceSn,
          deviceName: item.deviceName,
          snapSite: item.snapSite,
          deviceType: item.deviceType
        })
      })
      this.getStudentList(true)
    } else if (this.chooseType === 'attendance') {
      if (!this.bindCode) {
        this.getStudentList()
        return
      }
      this.pageList.size = 200
      const res = await $ajax.get({
        url: `${hostEnv.protal_api_11004}/attendance/group/detail`,
        params: {
          groupId: this.bindCode
        }
      })
      const users = res.data.controllerGroups
      users.forEach(item => {
        this.chooseList.push(item.deviceSn)
        this.totalList.push({
          id: item.deviceSn,
          deviceSn: item.deviceSn,
          deviceName: item.deviceName,
          snapSite: item.address,
          deviceType: item.type
        })
      })
      this.getStudentList(true)
    } else if (this.chooseType === 'doorGroup') {
      if (!this.groupCode) {
        this.getStudentList()
        return
      }
      this.pageList.size = 200
      const res = await $ajax.get({
        url: `${hostEnv.protal_api_10162}/setting/rule/group/detail`,
        params: {
          schoolCode: this.schoolCode,
          ruleGroupCode: this.groupCode
        }
      })
      const users = res.data.controlGroupList
      users.forEach(item => {
        this.chooseList.push(item.controlGroupCode)
        this.totalList.push({
          id: item.controlGroupCode,
          deviceSn: item.controlGroupCode,
          deviceName: item.controlGroupName,
          snapSite: item.snapSite,
          deviceType: item.deviceType,
          inOrOut: item.controlGroupType
        })
      })
      this.getStudentList(true)
    } else if (this.chooseType === 'common') {
      this.controlList.forEach(item => {
        this.chooseList.push(item.deviceSn)
        this.totalList.push({
          id: item.deviceSn,
          deviceSn: item.deviceSn,
          deviceName: item.deviceName
        })
      })
      this.getStudentList(true)
    } else {
      this.getStudentList()
    }
    // else if (this.chooseType === 'door') {
    //   this.pageList.size = 200
    //   const res = await $ajax.post({
    //     url: `${hostEnv.protal_api_10162}/setting/device/info/query`,
    //     params: {
    //       schoolCode: this.schoolCode,
    //       pageNum: this.pageList.page,
    //       pageSize: this.pageList.size
    //     }
    //   })
    //   const users = res.data.list
    //   users.forEach(item => {
    //     this.chooseList.push(item.deviceSn)
    //     console.log('door', item)
    //     this.totalList.push({
    //       id: item.deviceSn,
    //       deviceSn: item.deviceSn,
    //       deviceName: item.deviceName,
    //       snapSite: item.snapSite,
    //       deviceType: item.deviceType,
    //       deviceIp: item.deviceIp
    //     })
    //   })
    //   this.getStudentList(true)
    // }
  },
  methods: {
    changePage() {
      if (!this.chooseType) {
        this.getStudentList(false)
      } else {
        this.getStudentList(true)
      }
    },
    async getStudentList(type = false) {
      console.log(this.chooseType)
      if (this.chooseType === 'doorGroup') {
        const res = await $ajax.post({
          url: `${hostEnv.protal_api_10162}/setting/device/info/query`,
          params: {
            deviceName: this.keyword,
            deviceType: this.deviceType,
            schoolCode: this.schoolCode,
            pageNum: this.pageList.page,
            pageSize: this.pageList.size
          }
        })
        this.userList = res.data.list.map(item => {
          return {
            ...item,
            id: type ? item.deviceSn : item.id
          }
        })
        this.total = res.data.total
      } else {
        const res = await $ajax.post({
          url: `${hostEnv.protal_api_10090}/device/info/queryDeviceInfos`,
          params: {
            deviceName: this.keyword,
            deviceType: this.deviceType,
            schoolCode: this.schoolCode,
            ...this.pageList
          }
        })
        console.log(this.bindList)
        const quchongList = res.data.list.filter(item => {
          return (
            this.bindList.findIndex(it => {
              return item.deviceSn === it.deviceSn
            }) === -1
          )
        })
        this.userList = quchongList.map(item => {
          if (this.chooseType === 'door' || this.chooseType === 'device') {
            item.inOrOut = false
            item.controlType = false
          }
          return {
            ...item,
            id: type ? item.deviceSn : item.id
          }
        })
        console.log(this.userList)
        this.total = res.data.total
      }
    },
    inOrOutCilck(value, e) {
      const index = this.totalList.findIndex(list => list.id === e.id)
      if (index !== -1) {
        this.totalList[index].inOrOut = value
      }
    },
    controlTypeCilck(value, e) {
      const index = this.totalList.findIndex(list => list.id === e.id)
      if (index !== -1) {
        this.totalList[index].controlType = value
      }
    },
    reset() {
      if (this.chooseType === 'door' || this.chooseType === 'device') {
        this.chooseList = []
        this.totalList = []
        this.userList.forEach(ele => {
          ele.inOrOut = false
          ele.controlType = false
        })
      }
      this.confirmLoading = false
      this.$emit('input', false)
    },
    resetBtn() {
      this.keyword = ''
      this.deviceType = ''
      this.getStudentList()
    },
    error() {
      this.confirmLoading = false
    },
    delUser(id, index) {
      this.totalList.splice(index, 1)
      this.chooseList.splice(this.chooseList.indexOf(id), 1)
    },
    selectAll(item, type) {
      if (type) {
        this.totalList = this.totalList.concat(item)
      } else {
        item.forEach(item => {
          const index = this.totalList.findIndex(list => {
            return list.id === item.id
          })
          this.totalList.splice(index, 1)
        })
      }
    },
    // 监听选中或取消
    clickRow(item, type) {
      console.log(item)
      if (type) {
        if (this.isCheck) {
          this.totalList.push({
            controlType: item.controlType,
            id: item.id,
            deviceSn: item.deviceSn,
            deviceName: item.deviceName,
            snapSite: item.snapSite,
            deviceType: item.deviceType,
            deviceIp: item.deviceIp,
            inOrOut: item.inOrOut,
            schoolCode: item.schoolCode,
            deviceStatus: item.deviceStatus,
            deviceId: item.deviceId
          })
          console.log(this.totalList)
        } else {
          this.totalList = [item]
        }
      } else {
        const index = this.totalList.findIndex(list => list.id === item.id)
        this.totalList.splice(index, 1)
      }
    },
    submitOk() {
      if (this.totalList.length === 0) {
        this.$message.warning('请选择设备')
        return
      }
      this.confirmLoading = true
      if (this.chooseType === 'door' || this.chooseType === 'device') {
        this.totalList.forEach(ele => {
          ele.inOrOut = ele.inOrOut ? 2 : 1
          ele.controlType = ele.controlType ? 1 : 0
        })
      }
      this.$emit('submit', this.totalList)
    }
  }
}
</script>

<style lang="less" scoped>
.choose-user {
  height: 600px;
  .org-box {
    width: 200px;
  }
  .user-box {
    border: 1px #f5f5f5 solid;
    margin-left: 15px;
    width: 200px;
    .title {
      padding: 0 10px;
      background-color: #f5f5f5;
      height: 41px;
      line-height: 41px;
      border-bottom: 1px #f5f5f5 solid;
    }
    li {
      border-bottom: 1px #f5f5f5 solid;
      padding: 6px 0px 6px 8px;
    }
  }
}
</style>
