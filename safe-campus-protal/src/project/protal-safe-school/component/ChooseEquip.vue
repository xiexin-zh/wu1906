<template>
  <a-modal
    width="1200px"
    title="选择巡检设备"
    v-model="status"
    @ok="submitOk"
    :maskClosable="false"
    :destroyOnClose="true"
    :confirmLoading="confirmLoading"
  >
    <a-row
      type="flex"
      justify="end"
      style="margin-bottom: 15px"
      :style="'margin-right:215px'"
    >
      <a-col>
        <span>类型：</span>
        <a-input v-model="keyword" style="width: 120px;margin-right: 10px" placeholder="请输入" />
        <a-button type="primary" @click="searchForm">查询</a-button>
      </a-col>
    </a-row>
    <div class="choose-user qui-fx">
      <grade-tree @select="select"></grade-tree>
      <div class="qui-fx-ver qui-fx-f1">
        <table-list
          :is-check="isCheck"
          :is-radio="isRadio"
          is-zoom
          :scroll-h="500"
          :page-list="pageList"
          v-model="chooseList"
          :columns="treeObj === 'mht'? mhtColumns :treeObj === 'aqtd'?aqtdColumns :treeObj === 'xc'?xcColumns:(treeObj === 'mhq' || treeObj === 'xhs')?mhqColumns:qtColumns"
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
          @change-page="showList"
        ></page-num>
      </div>
      <div class="user-box qui-fx-ver">
        <div class="title qui-fx-jsb">
          <span>已选择</span>
          <span>{{ totalList.length }}</span>
        </div>
        <div class="qui-fx-f1" style="overflow: auto">
          <ul>
            <li v-for="(item, index) in totalList" :key="item.id" class="qui-fx-jsb">
              <div> {{ item.device }}</div>
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
import { mapState, mapActions } from 'vuex'
import GradeTree from './GradeTree'
const mhqColumns = [
  {
    title: '序号',
    width: '12%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '型号',
    dataIndex: 'type',
    width: '20%'
  },
  {
    title: '类型',
    dataIndex: 'deviceName',
    width: '35%'
  },
  {
    title: '地点',
    dataIndex: 'address',
    width: '30%'
  }
]
const mhtColumns = [
  {
    title: '序号',
    width: '15%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '型号',
    dataIndex: 'type',
    width: '40%'
  },
  {
    title: '地点',
    dataIndex: 'address',
    width: '40%'
  }
]
const aqtdColumns = [
  {
    title: '序号',
    width: '15%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '地点',
    dataIndex: 'address',
    width: '75%'
  }
]
const qtColumns = [
  {
    title: '序号',
    width: '15%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '型号',
    dataIndex: 'name',
    width: '40%'
  },
  {
    title: '地点',
    dataIndex: 'address',
    width: '40%'
  }
]
const xcColumns = [
  {
    title: '序号',
    width: '15%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '牌照',
    dataIndex: 'licensePlate',
    width: '40%'
  },
  {
    title: '车型',
    dataIndex: 'type',
    width: '40%'
  }
]
export default {
  name: 'ChooseEquip',
  components: {
    PageNum,
    TableList,
    GradeTree
  },
  props: {
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
    }
  },
  computed: {
    ...mapState('home', ['schoolCode']),
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
      mhqColumns,
      mhtColumns,
      aqtdColumns,
      qtColumns,
      xcColumns,
      confirmLoading: false,
      chooseList: [],
      pageList: {
        page: 1,
        size: 20
      },
      searchList: {},
      keyword: '',
      total: 0,
      userList: [],
      totalList: [],
      treeObj: ''
    }
  },
  methods: {
    ...mapActions('home', ['getFireArchive', 'getSafeArchive', 'getOtherArchive', 'getSchoolArchive']),
    async select(obj) {
      this.treeObj = obj
      if (!this.treeObj || this.treeObj === 'aq' || this.treeObj === 'xf') {
        this.userList = []
        return
      }
      this.showList()
    },
    searchForm() {
      if (!this.treeObj || this.treeObj === 'aq' || this.treeObj === 'xf') return
      this.showList()
    },
    async showList() {
      this.searchList.schoolCode = this.schoolCode
      this.searchList.deviceType = this.treeObj === 'mhq' ? '1' : this.treeObj === 'mht' ? '2' : this.treeObj === 'xhs' ? '3' : undefined
      this.searchList.type = this.treeObj === 'qt' ? '1' : this.treeObj === 'qx' ? '2' : this.keyword
      this.searchList.name = this.treeObj === 'qt' ? this.keyword : undefined
      this.searchList = Object.assign(this.searchList, this.pageList)
      if (this.treeObj === 'aqtd') {
        const res = await this.getSafeArchive(this.searchList)
        this.userList = res.data.records.map(el => {
          return {
            ...el,
            device: `安全通道(${el.address})`,
            code: '4',
            id: `4-${el.id}`
          }
        })
        this.total = res.data.total
      } else if (this.treeObj === 'qt' || this.treeObj === 'qx') {
        const res = await this.getOtherArchive(this.searchList)
        this.userList = res.data.records.map(el => {
          return {
            ...el,
            device: `${el.name}(${el.address})`,
            code: this.treeObj === 'qt' ? '5' : '7',
            id: `${this.treeObj === 'qt' ? '5' : '7'}-${el.id}`
          }
        })
        this.total = res.data.total
      } else if (this.treeObj === 'xc') {
        const res = await this.getSchoolArchive(this.searchList)
        this.userList = res.data.records.map(el => {
          return {
            ...el,
            device: `校车（${el.licensePlate}）`,
            code: '6',
            id: `6-${el.id}`
          }
        })
        this.total = res.data.total
      } else {
        const res = await this.getFireArchive(this.searchList)
        this.userList = res.data.records.map(el => {
          return {
            ...el,
            code: this.treeObj === 'mhq' ? '1' : this.treeObj === 'mht' ? '2' : '3',
            device: this.treeObj === 'mht' ? `灭火毯-${el.type}(${el.address})` : `${el.deviceName}-${el.type}(${el.address})`,
            id: `${this.treeObj === 'mhq' ? '1' : this.treeObj === 'mht' ? '2' : '3'}-${el.id}`
          }
        })
        this.total = res.data.total
      }
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
      if (type) {
        if (this.isCheck) {
          this.totalList.push(item)
        } else {
          this.totalList = [item]
        }
      } else {
        const index = this.totalList.findIndex(list => list.id === item.id)
        this.totalList.splice(index, 1)
      }
    },
    submitOk() {
      if (this.totalList.length === 0 && this.bindId === -1) {
        this.$message.warning('请选择人员')
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
    width: 300px;
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
