<template>
  <a-modal
    width="70%"
    :title="title"
    v-model="status"
    @ok="submitOk"
    :maskClosable="false"
    :destroyOnClose="true"
    :confirmLoading="confirmLoading"
  >
    <a-row type="flex" justify="end" style="margin-bottom: 15px; margin-right: 215px">
      <a-col>
        <span>安装位置：</span>
        <a-input v-model="address" style="width: 120px; margin-right: 10px" placeholder="请输入安装位置" />
        <span>设备名称：</span>
        <a-input v-model="deviceName" style="width: 120px; margin-right: 10px" placeholder="请输入设备名称" />
        <a-button type="primary" @click="getDeviceList(chooseType !== '')">查询</a-button>
      </a-col>
    </a-row>
    <div class="choose-user qui-fx">
      <div class="qui-fx-ver qui-fx-f1">
        <table-list
          :is-check="isCheck"
          :is-radio="isRadio"
          :scroll-h="500"
          :page-list="pageList"
          v-model="chooseList"
          :columns="columns"
          @clickRow="clickRow"
          @selectAll="selectAll"
          :table-list="deviceList"
        ></table-list>
        <page-num
          :jumper="false"
          v-model="pageList"
          :mar-top="20"
          :mar-bot="0"
          size="small"
          :total="total"
          @change-page="changePage"
        ></page-num>
      </div>
      <div class="user-box qui-fx-ver" v-show="isTotal">
        <div class="title qui-fx-jsb">
          <span>已选择</span>
          <span>{{ totalList.length }}个</span>
        </div>
        <div class="qui-fx-f1" style="overflow: auto">
          <ul style="padding-left: 0">
            <li v-for="(item, index) in totalList" :key="item.id" class="qui-fx-jsb">
              <span>{{ item.deviceName }}</span>
              <a-tag @click="delUser(item.id, index)" color="#f50">删除</a-tag>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </a-modal>
</template>

<script>
import PageNum from '@c/PageNum'
import TableList from '@c/TableList'
import { mapActions, mapState } from 'vuex'
import Tools from '@u/tools'
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
    width: '15%'
  },
  {
    title: '设备类型',
    dataIndex: 'deviceType',
    width: '10%',
    customRender: (text) => {
      return Tools.deviceTypeName(text)
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
    title: '状态',
    dataIndex: 'deviceStatus',
    width: '8%',
    customRender: (text) => {
      return text === 1 ? '在线' : '离线'
    }
  }
]
export default {
  name: 'BindDevice',
  components: {
    PageNum,
    TableList
  },
  props: {
    isTotal: {
      type: Boolean,
      default: true
    },
    bindObj: {
      type: Object,
      default: () => {
        return {}
      }
    },
    chooseType: {
      type: String,
      default: ''
    },
    isRadio: {
      type: Boolean,
      default: false
    },
    isCheck: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: ''
    },
    value: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState('home', ['schoolCode', 'eduCode']),
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
      hasPhoto: '',
      address: '',
      deviceName: '',
      confirmLoading: false,
      orgCode: '',
      chooseList: [],
      pageList: {
        page: 1,
        size: 20
      },
      total: 0,
      columns,
      deviceList: [],
      totalList: []
    }
  },
  mounted() {
    this.getDeviceList()
  },
  methods: {
    ...mapActions('home', ['getBaseDevice', 'bindDevices', 'getDeviceBindList']),
    changePage() {
      if (!this.chooseType) {
        this.getDeviceList(false)
      } else {
        this.getDeviceList(true)
      }
    },
    // 获取所有设备列表
    async getDeviceList() {
      const req = {
        schoolCode: this.schoolCode,
        deviceName: this.deviceName,
        deviceType: '',
        ...this.pageList
      }
      // 获取所有设备列表
      const res = await this.getBaseDevice(req)
      if (res && res.code === 200) {
        const userList = res.data.list.map((item) => {
          return {
            ...item,
            id: item.deviceSn
          }
        })
        // 获取已绑定设备列表
        const result = await this.getDeviceBindList(this.schoolCode)
        if (result && result.code === 200 && result.data.length > 0) {
          const bindList = result.data.map((item) => {
            return item.deviceSn
          })
          this.chooseList = bindList
          // 如果有已绑定设备，将所有设备列表中相同的设备勾选并禁用
          this.deviceList = userList.map((item) => {
            return {
              ...item,
              disabled: bindList.indexOf(item.id) !== -1
            }
          })
        } else {
          this.deviceList = userList
        }
        this.total = res.data.total
      }
    },
    defaultCode(item) {
      this.orgCode = item.code[0]
    },
    reset() {
      this.confirmLoading = false
      this.$emit('input', false)
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
        item.forEach((item) => {
          const index = this.totalList.findIndex((list) => {
            return list.id === item.id
          })
          this.totalList.splice(index, 1)
        })
      }
    },
    // 监听选中或取消
    clickRow(item, type) {
      if (type) {
        if (this.isCheck) {
          this.totalList.push({
            address: item.snapSite,
            deviceIp: item.deviceIp,
            deviceName: item.deviceName,
            deviceType: item.deviceType,
            deviceSn: item.deviceSn,
            inOrOut: '',
            deviceState: item.deviceStatus
          })
        } else {
          this.totalList = [item]
        }
      } else {
        const index = this.totalList.findIndex((list) => list.id === item.id)
        this.totalList.splice(index, 1)
      }
    },
    async submitOk() {
      if (this.totalList.length === 0) {
        this.$message.warning('请选择设备')
        return
      }
      const req = {
        deviceList: this.totalList,
        schoolCode: this.schoolCode
      }
      const res = await this.bindDevices(req)
      this.$emit('submit')
    }
  }
}
</script>

<style lang="less" scoped>
.choose-user {
  height: 600px;
  .org-box {
    overflow-x: hidden;
    width: 240px;
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
