<template>
  <div class="device qui-fx">
    <choose-control
      ref="chooseUser"
      is-check
      v-model="userTag"
      v-if="userTag"
      :bind-list="deviceList"
      @submit="chooseUser"
      :schoolCode="userInfo.schoolCode"
      title="添加设备"
    ></choose-control>
    <div class="page-left">
      <org-tree
        :current-tab="0"
        :is-select="true"
        :is-tab="isTab"
        @tree-click="handleTreeClick"
        :is-room="false"
      ></org-tree>
    </div>
    <div class="qui-fx-f1 qui-fx-ver">
      <search-form is-reset @search-form="_searchForm" :search-label="searchLabel">
        <div slot="left">
          <a-button icon="plus" class="add-btn" @click="bind">绑定设备</a-button>
          <!-- <a-button icon="export" class="export-all-btn" @click="batchAdd(0)">批量设置</a-button> -->
          <!-- <a-button icon="delete" class="del-btn" @click="batchDelete(0)">批量解绑</a-button> -->
        </div>
      </search-form>
      <a-row id="table" class="table-top qui-fx-f1">
        <table-list
          is-zoom
          @clickRow="clickRow"
          v-model="chooseList"
          :page-list="pageList"
          :columns="columns"
          :table-list="deviceList"
        >
          <template v-slot:actions="action">
            <a-popconfirm
              placement="left"
              okText="确定"
              cancelText="取消"
              @confirm="batchDelete(action.record)"
            >
              <template slot="title">您确定删除吗?</template>
              <a-tooltip placement="topLeft" title="解绑">
                <a-button size="small" class="del-action-btn" icon="delete"></a-button>
              </a-tooltip>
            </a-popconfirm>
          </template>
        </table-list>
      </a-row>
      <page-num v-model="pageList" :total="total" @change-page="showList"></page-num>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import OrgTree from '../components/orgTree/OrgTree'
import TableList from '@c/TableList'
import SearchForm from '@c/SearchForm'
import PageNum from '@c/PageNum'
import ChooseControl from '@c/ChooseControl'
import mixins from '@u/mixins'
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
      },
      {
        key: 3,
        val: '班牌'
      }
    ],
    value: 'deviceType',
    type: 'select',
    label: '设备类型'
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
      },
      {
        key: 3,
        val: '无'
      }
    ],
    value: 'inOrOut',
    type: 'select',
    label: '控制类型'
  }
]
const columns = [
  {
    title: '序号',
    width: '14%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '设备名称',
    dataIndex: 'deviceName',
    width: '14%'
  },
  {
    title: '设备类型',
    dataIndex: 'deviceType',
    width: '14%',
    customRender: text => {
      return parseInt(text) === 1 ? '网络相机' : parseInt(text) === 2 ? '面板机' : '班牌'
    }
  },
  {
    title: '安装位置',
    dataIndex: 'snapSite',
    width: '14%'
  },
  {
    title: '设备SN码',
    dataIndex: 'deviceSn',
    width: '14%',
    align: 'center'
  },
  {
    title: '控制类型',
    dataIndex: 'inOrOut',
    width: '14%',
    customRender: text => {
      return parseInt(text) === 1 ? '进' : parseInt(text) === 2 ? '出' : '无'
    }
  },
  {
    title: '操作',
    width: '20%',
    scopedSlots: {
      customRender: 'action'
    }
  }
]
export default {
  name: 'DeviceManage',
  components: {
    TableList,
    SearchForm,
    PageNum,
    ChooseControl,
    OrgTree
  },
  mixins: [mixins],
  data() {
    return {
      columns,
      searchLabel,
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
      chooseType: 'dorm',
      searchList: {},
      isTab: false
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  methods: {
    ...mapActions('device', ['getDeviceList', 'addDeviceInfo', 'deleteDeviceInfo', 'updateDeviceInfo']),
    handleTreeClick(item) {
      this.searchList.buildingCode = item.buildingCode
      this.searchList.floorCode = item.floorCode
      this.searchList.buildName = item.buildName
      this.searchList.floorName = item.floorName
      this.showList()
    },
    async showList(searchObj = {}) {
      const req = {
        page: this.pageList.page,
        size: this.pageList.size,
        schoolCode: this.userInfo.schoolCode,
        ...searchObj,
        ...this.searchList
      }
      const res = await this.getDeviceList(req)
      this.deviceList = res.data.list
      this.total = res.data.total
    },
    _searchForm(values) {
      console.log(values)
      this.pageList.page = 1
      const searchObj = {
        snapSite: values.snapSite,
        inOrOut: values.inOrOut,
        deviceType: values.deviceType,
        deviceName: values.deviceName
      }
      this.showList(searchObj)
    },
    clickRow(id) {},
    async batchDelete(record) {
      const req = [record.id]
      await this.deleteDeviceInfo(req)
      this.$message.success('删除成功')
      this.$tools.goNext(() => {
        this.chooseList = []
        this.showList(this.keyword)
      })
    },
    bind() {
      this.userTag = true
    },
    // 添加设备
    chooseUser(value) {
      const req = {
        list: value,
        schoolCode: this.userInfo.schoolCode,
        ...this.searchList
      }
      try {
        this.addDeviceInfo(req)
          .then(() => {
            this.$message.success('添加成功')
            this.$tools.goNext(() => {
              this.$refs.chooseUser.reset()
              this.showList(this.keyword)
            })
          })
          .catch(() => {
            this.$refs.chooseUser.error()
          })
      } catch (err) {
        console.log(err)
      }
    }
  }
}
</script>
<style lang="less" scoped>
.device {
  flex: 1;
  overflow: hidden;
  background: #fff;
}
.search-form {
  margin-top: 0px;
  height: auto;
}
.page-left {
  background: #fff;
  margin-right: 10px;
  width: 250px;
}
.page-right {
  width: calc(100% - 270px);
}
</style>
