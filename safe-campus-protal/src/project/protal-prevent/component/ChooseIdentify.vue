<template>
  <a-modal
    width="1200px"
    title="选择检查对象"
    v-model="status"
    @ok="submitOk"
    :maskClosable="false"
    :destroyOnClose="true"
    :confirmLoading="confirmLoading"
  >
    <div class="choose-user qui-fx">
      <div class="tree-box">
        <a-tree
          v-if="orgData.length > 0"
          :treeData="orgData"
          :expanded-keys="expandedKeys"
          :selected-keys="selectedKeys"
          @select="select"
        >
        </a-tree>
      </div>
      <div class="qui-fx-ver qui-fx-f1">
        <table-list
          is-check
          :scroll-h="500"
          :page-list="pageList"
          v-model="chooseList"
          :columns="columns"
          @clickRow="clickRow"
          @selectAll="selectAll"
          :table-list="identifyList"
        >
        </table-list>
        <page-num
          :jumper="false"
          v-model="pageList"
          :mar-top="20"
          :mar-bot="0"
          size="small"
          :total="total"
          @change-page="_riskModelList"
        ></page-num>
      </div>
      <!-- <div class="user-box qui-fx-ver">
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
      </div> -->
    </div>
  </a-modal>
</template>

<script>
import PageNum from '@c/PageNum'
import TableList from '@c/TableList'
import { mapState, mapActions } from 'vuex'
const columns = [
  {
    title: '序号',
    width: '12%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '检查对象',
    dataIndex: 'checkObject',
    width: '20%'
  },
  {
    title: '潜在风险',
    dataIndex: 'riskContent',
    width: '35%'
  },
  {
    title: '事故类型',
    dataIndex: 'riskType',
    width: '30%'
  }
]
export default {
  name: 'ChooseIdentify',
  components: {
    PageNum,
    TableList
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    isCheck: {
      type: Boolean,
      default: false
    },
    teacherList: {
      type: Array,
      default: () => {
        return []
      }
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
      columns,
      confirmLoading: false,
      chooseList: [],
      pageList: {
        page: 1,
        size: 20
      },
      riskContent: '',
      total: 0,
      identifyList: [],
      totalList: [],
      treeObj: '',
      expandedKeys: ['0'],
      selectedKeys: [],
      noData: false,
      orgData: [{
        title: '风险清单',
        key: '0',
        children: []
      }],
      categoryCode: '',
      searchText: {}
    }
  },
  async mounted() {
    this.teacherList.forEach(item => {
      console.log('item',item)
      this.chooseList.push(item.id)
      this.totalList.push({
        ...item
        // detailId: item.id,
        // id: item.userCode
      })
    })
    this._riskCategory()
  },
  methods: {
    ...mapActions('home', ['getFireArchive', 'getSafeArchive', 'getOtherArchive', 'getSchoolArchive', 'riskCategory', 'riskModelList']),
    async _riskCategory () {
      const res = await this.riskCategory()
      const data = res.data.map(el => {
        return {
          title: el.categoryName,
          key: el.categoryCode
        }
      })
      this.orgData[0].children = data
      this.selectedKeys[0] = data[0].key
      this.searchText.categoryCode = data[0].key
      this._riskModelList()
    },
    async _riskModelList () {
      this.searchText = Object.assign(this.searchText, this.pageList)
      const res = await this.riskModelList(this.searchText)
      this.identifyList = res.data.records
      this.total = res.data.total
    },
    async select(item) {
      this.selectedKeys = item
      this.pageList.page = 1
      this.pageList.size = 20
      this.searchText.categoryCode = item[0]
      this._riskModelList()
    },
    searchForm () {
      this.searchText.riskContent = this.riskContent
      this._riskCategory()
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
      if (this.totalList.length === 0) {
        this.$message.warning('请选择对象')
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
