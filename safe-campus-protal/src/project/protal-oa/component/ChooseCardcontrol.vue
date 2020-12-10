<template>
  <a-modal
    width="1200px"
    :title="title"
    v-model="status"
    @ok="submitOk"
    :maskClosable="false"
    :destroyOnClose="true"
    :confirmLoading="confirmLoading"
  >
    <div class="choose-user qui-fx">
      <div class="qui-fx-ver qui-fx-f1">
        <table-list
          is-check
          is-zoom
          :scroll-h="500"
          :page-list="pageList"
          v-model="chooseList"
          :columns="columns"
          @clickRow="clickRow"
          @selectAll="selectAll"
          :table-list="userList"
        >
          <template v-slot:other1="other1">
            <span>{{ other1.record.gradeName }}{{ other1.record.className }}</span>
          </template>
        </table-list>
        <page-num
          :jumper="false"
          v-model="pageList"
          :mar-top="20"
          :mar-bot="0"
          size="small"
          :total="total"
          @change-page="getControlList"
        ></page-num>
      </div>
      <div class="user-box qui-fx-ver">
        <div class="title qui-fx-jsb">
          <span>已选择</span>
          <span>{{ totalList.length }}个</span>
        </div>
        <div class="qui-fx-f1" style="overflow: auto">
          <ul>
            <li v-for="(item, index) in totalList" :key="item.deviceSn" class="qui-fx-jsb qui-fx-ac">
              <span>{{ item.deviceName }}</span>
              <a-tag @click="delUser(item.deviceSn, index)" color="#f50">删除</a-tag>
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
    width: '10%'
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
    width: '10%'
  },
  {
    title: '设备IP',
    dataIndex: 'deviceIp',
    width: '10%'
  },
  {
    title: '关联数据',
    dataIndex: 'gradeName',
    width: '10%',
    scopedSlots: {
      customRender: 'other1'
    }
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
export default {
  name: 'ChooseControl',
  components: {
    PageNum,
    TableList
  },
  props: {
    schoolCode: {
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
    isCheck: {
      type: Boolean,
      default: false
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
      userList: [],
      totalList: []
    }
  },
  async mounted() {
    this.controlList.forEach(item => {
      this.chooseList.push(item.deviceSn)
      this.totalList.push({
        ...item,
        id: item.deviceSn
      })
    })
    this.getControlList()
  },
  methods: {
    async getControlList() {
      const res = await $ajax.post({
        url: `${hostEnv.protal_api_11009}/classcard/bind/list`,
        params: {
          bindStatus: '1',
          schoolCode: this.schoolCode,
          ...this.pageList
        }
      })
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
      this.getControlList()
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
            return list.deviceSn === item.deviceSn
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
          this.totalList.push(item)
          console.log(this.totalList)
        } else {
          this.totalList = [item]
        }
      } else {
        const index = this.totalList.findIndex(list => list.deviceSn === item.deviceSn)
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
