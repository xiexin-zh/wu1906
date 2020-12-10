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
    <a-row type="flex" justify="start" style="margin-bottom: 15px">
      <a-col>
        <span>设备名称：</span>
        <a-input v-model="keyword" style="width: 120px; margin-right: 20px" placeholder="请输入设备名称" />
      </a-col>
      <a-col>
        <span>设备类型：</span>
        <a-select v-model="deviceType" style="width: 120px; margin-right: 20px">
          <a-select-option v-for="(item, i) in typeList" :key="i" :value="item.key">{{ item.val }}</a-select-option>
        </a-select>
      </a-col>
      <a-col>
        <span>安装位置：</span>
        <a-input v-model="snapSite" style="width: 120px; margin-right: 20px" placeholder="请输入安装位置" />
      </a-col>
      <a-col>
        <span>控制类型：</span>
        <a-select v-model="inOrOut" style="width: 120px; margin-right: 20px">
          <a-select-option v-for="(item, i) in inOrOutList" :key="i" :value="item.key">{{ item.val }}</a-select-option>
        </a-select>
      </a-col>
      <a-col>
        <a-button type="primary" @click="getStudentList()">查询</a-button>
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
          :columns="chooseType === 'visitorGroup' ? doorColumns : columns"
          @clickRow="clickRow"
          @selectAll="selectAll"
          :table-list="userList"
        >
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
      <div class="user-box qui-fx-ver">
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
      </div>
    </div>
  </a-modal>
</template>

<script>
import PageNum from '@c/PageNum'
import { Switch } from 'ant-design-vue'
import TableList from '@c/TableList'
import $ajax from '@u/ajax-serve'
import hostEnv from '@config/host-env'

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
    width: '15%'
  },
  {
    title: '设备SN码',
    dataIndex: 'deviceSn',
    width: '15%'
  },
  {
    title: '设备类型',
    dataIndex: 'deviceType',
    width: '15%',
    customRender: text => {
      return parseInt(text) === 1 ? '相机' : parseInt(text) === 2 ? '面板机' : '班牌'
    }
  },
  {
    title: '控制类型',
    dataIndex: 'inOrOut',
    width: '15%',
    customRender: text => {
      return parseInt(text) === 1 ? '进' : parseInt(text) === 2 ? '出' : '无'
    }
  },
  {
    title: '安装位置',
    dataIndex: 'snapSite',
    width: '15%'
  },
  {
    title: '设备IP',
    dataIndex: 'deviceIp',
    width: '15%'
  },
  {
    title: '设备状态',
    dataIndex: 'deviceStatus',
    width: '15%',
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
    width: '15%'
  },
  {
    title: '设备类型',
    dataIndex: 'deviceType',
    width: '15%',
    customRender: text => {
      return parseInt(text) === 1 ? '相机' : parseInt(text) === 2 ? '面板机' : '班牌'
    }
  },
  {
    title: '安装位置',
    dataIndex: 'snapSite',
    width: '15%'
  },
  {
    title: '设备SN码',
    dataIndex: 'deviceSn',
    width: '15%',
    align: 'center'
  },
  {
    title: '控制类型',
    dataIndex: 'inOrOut',
    width: '15%',
    customRender: text => {
      return parseInt(text) === 1 ? '进' : parseInt(text) === 2 ? '出' : '无'
    }
  },
  {
    title: '是否校门门禁',
    dataIndex: 'controlType',
    width: '15%',
    customRender: text => {
      return parseInt(text) === 1 ? '是' : '否'
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
    recordList: {
      type: Array,
      default: () => {
        return []
      }
    },
    groupList: {
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
      snapSite: '',
      deviceType: '',
      inOrOut: '',
      typeList: [
        {
          key: '',
          val: '全部'
        },
        {
          key: 1,
          val: '相机'
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
      inOrOutList: [
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
          val: '空'
        }
      ],
      keyword: '',
      total: 0,
      columns,
      doorColumns,
      userList: [],
      totalList: []
    }
  },
  async mounted() {
    console.log(this.chooseType)
    if (this.chooseType === 'common') {
      this.controlList.forEach(item => {
        this.chooseList.push(item.deviceSn)
        this.totalList.push({
          id: item.deviceSn,
          deviceSn: item.deviceSn,
          deviceName: item.deviceName
        })
      })
    } else if (this.chooseType === 'ncovGroup') {
      this.recordList.forEach(item => {
        this.chooseList.push(item.deviceSn)
        this.totalList.push({
          id: item.deviceSn,
          deviceSn: item.deviceSn,
          deviceName: item.deviceName
        })
      })
    } else if (this.chooseType === 'visitorGroup') {
      this.groupList.forEach(item => {
        this.chooseList.push(item.deviceSn)
        this.totalList.push({
          id: item.deviceSn,
          deviceSn: item.deviceSn,
          deviceName: item.deviceName
        })
      })
    }
    this.getStudentList()
  },
  methods: {
    changePage() {
      this.getStudentList()
    },
    async getStudentList() {
      let res = null
      if (this.chooseType === 'visitorGroup') {
        res = await $ajax.post({
          url: `${hostEnv.protal_api_10162}/setting/device/info/query`,
          params: {
            deviceName: this.keyword,
            deviceType: this.deviceType,
            schoolCode: this.schoolCode,
            inOrOut: this.inOrOut,
            snapSite: this.snapSite,
            pageNum: this.pageList.page,
            pageSize: this.pageList.size
          }
        })
      } else {
        res = await $ajax.post({
          url: `${hostEnv.protal_api_10090}/device/info/queryDeviceInfos`,
          params: {
            deviceName: this.keyword,
            deviceType: this.deviceType,
            inOrOut: this.inOrOut,
            snapSite: this.snapSite,
            schoolCode: this.schoolCode,
            ...this.pageList
          }
        })
      }
      this.userList = res.data.list.map(item => {
        return {
          ...item,
          id: item.deviceSn
        }
      })
      this.total = res.data.total
    },
    reset() {
      this.confirmLoading = false
      this.$emit('input', false)
    },
    resetBtn() {
      this.keyword = ''
      this.deviceType = ''
      this.snapSite = ''
      this.inOrOut = ''
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
            ...item
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
