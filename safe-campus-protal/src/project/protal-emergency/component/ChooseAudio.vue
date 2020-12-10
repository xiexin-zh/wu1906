<template>
  <a-modal
    width="800px"
    title="选择音频"
    v-model="status"
    @ok="submitOk"
    :maskClosable="false"
    :destroyOnClose="true"
    :confirmLoading="confirmLoading"
  >
    <a-row
      type="flex"
      style="margin-bottom: 15px"
      :style="'margin-right:215px'"
    >
      <a-col>
        <div class="menu-top qui-fx mar-b10">
          <a-input-search v-model="searchValue" placeholder="请输入关键字" style="width: 260px" @search="onSearch" />
        </div>
      </a-col>
    </a-row>
    <div class="choose-user qui-fx">
      <div class="grade-tree">
        <a-skeleton v-if="treeData.length == 0 && !noData" active :paragraph="{rows: 10}" />
        <a-tree
          v-if="treeData.length > 0"
          @select="select"
          :treeData="treeData"
          :autoExpandParent="autoExpandParent"
          @expand="onExpand"
          :expandedKeys="expandedKeys"
        >
        </a-tree>
      </div>
      <div class="user-box qui-fx-ver qui-fx-f1">
        <div class="title qui-fx-jsb">
          <span>已选择</span>
          <span>{{ totalList.length }}</span>
        </div>
        <div class="qui-fx-f1" style="overflow: auto">
          <ul>
            <li v-for="(item, index) in totalList" :key="item.id" class="qui-fx-jsb">
              <div> {{ item.name }}</div>
              <a-tag @click="delUser(item.id, index)" color="#f50">删除</a-tag>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </a-modal>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  name: 'ChooseAudio',
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
    ...mapState('home', ['userInfo']),
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
      totalList: [],
      noData: false,
      treeData: [],
      defaultSelectedKeys: [],
      autoExpandParent: false,
      searchValue: '',
      expandedKeys: []
    }
  },
  mounted () {
    this.initMenu()
  },
  methods: {
    ...mapActions('home', [ 'generalRadioSource' ]),
    // 点击节点
    select (obj, tree) {
      this.totalList = tree.selectedNodes[0].data.props.isShow ? [tree.selectedNodes[0].data.props] : []
    },
    async initMenu () {
      const req = {
        name: '',
        schoolCode: this.userInfo.schoolCode
      }
      const res = await this.generalRadioSource(req)
      this.treeData = res.data.map(el => {
        return {
          ...el,
          title: el.categoryName,
          key: el.categoryName,
          code: el.categoryName,
          isShow: false,
          children: this.newOrgData(el.resourceList, el.categoryName)
        }
      })
    },
    // 深层递归
    newOrgData (data, name) {
      data.forEach(item => {
        item.categoryName = name
        item.title = item.name
        item.key = item.code
        item.isShow = true
      })
      return data
    },
    getkeyList (value, tree, keyList) {
      for (let i = 0; i < tree.length; i++) {
        const node = tree[i]
        if (node.title.indexOf(value) > -1) {
          keyList.push(node.key)
        }
        // 如果拥有子集继续遍历
        if (node.children) {
          this.getkeyList(value, node.children, keyList)
        }
      }
      return keyList
    },
    // 该递归主要用于获取key的父亲节点的key值
    getParentKey (key, tree) {
      let parentKey
      for (let i = 0; i < tree.length; i++) {
        const node = tree[i]
        if (node.children) {
          if (node.children.some(item => item.key === key)) {
            parentKey = node.key
          } else if (this.getParentKey(key, node.children)) {
            parentKey = this.getParentKey(key, node.children)
          }
        }
      }
      return parentKey
    },
    // 获取该节点的所有父亲节点
    getAllParentKey (key, tree) {
      var parentKey
      if (key) {
        parentKey = this.getParentKey(key, tree)
        if (parentKey) {
          // 如果父亲节点存在，判断是否已经存在于展开列表里，不存在就进行push
          if (!this.backupsExpandedKeys.some(item => item === parentKey)) {
            this.backupsExpandedKeys.push(parentKey)
          }
          // 一层一层进行获取
          this.getAllParentKey(parentKey, tree)
        }
      }
    },
    onExpand (expandedKeys) {
      // 用户点击展开时，取消自动展开效果
      this.expandedKeys = expandedKeys
      this.autoExpandParent = false
    },
    onSearch() {
      var vm = this
      if (vm.searchValue === '') {
        vm.expandedKeys = []
      } else {
        vm.expandedKeys = []
        vm.backupsExpandedKeys = []
        const candidateKeysList = vm.getkeyList(vm.searchValue, vm.treeData, [])
        candidateKeysList.map(item => {
          var key = vm.getParentKey(item, vm.treeData)
          if (key && !vm.backupsExpandedKeys.some(item => item === key)) {
            vm.backupsExpandedKeys.push(key)
          }
        })
        const length = this.backupsExpandedKeys.length
        for (let i = 0; i < length; i++) {
          vm.getAllParentKey(vm.backupsExpandedKeys[i], vm.treeData)
        }
        vm.expandedKeys = vm.backupsExpandedKeys.slice()
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
      this.totalList = []
    },
    submitOk() {
      if (this.totalList.length === 0) {
        this.$message.warning('请选择音频')
        return
      }
      this.confirmLoading = true
      this.$emit('submit', this.totalList)
    }
  }
}
</script>

<style lang="less" scoped>
.grade-tree {
  min-height: 400px;
  max-height: 800px;
  width: 300px;
  overflow-y: auto
}
.choose-user {
  height: 600px;
  .user-box {
    border: 1px #f5f5f5 solid;
    margin-left: 120px;
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
