<template>
  <a-drawer
    :title="title"
    :width="480"
    placement="right"
    :closable="true"
    @close="onClose"
    :visible="visible"
  >
    <div class="menu-top qui-fx mar-b10">
      <a-input-search v-model="searchValue" placeholder="请输入权限名称" style="width: 260px" @search="onSearch" />
    </div>
    <div class="menu-content" :style="{height: `${height}px`,overflow:'auto'}">
      <a-tree
        checkable
        v-model="checkedKeys"
        :treeData="treeData"
        :selectedKeys="selectedKeys"
        :expandedKeys="expandedKeys"
        @expand="onExpand"
        :autoExpandParent="autoExpandParent"
        @check="onCheck"
      >
        <template slot="title" slot-scope="item">
          <div class="custom qui-fx-ac">
            <img v-if="item.icon" :style="{width: '18px',height: '18px',marginRight:'5px'}" :src="item.icon" alt="">
            <span v-if="item.title.indexOf(searchValue) > -1">
              {{ item.title.substr(0, item.title.indexOf(searchValue)) }}
              <span style="color: #e81515">{{ searchValue }}</span>
              {{ item.title.substr(item.title.indexOf(searchValue) + searchValue.length) }}
            </span>
            <span v-else>{{ item.title }}</span>
          </div>
        </template>
      </a-tree>
    </div>
    <div
      :style="{
        position: 'absolute',
        left: 0,
        bottom: 0,
        width: '100%',
        borderTop: '1px solid #e9e9e9',
        padding: '10px 16px',
        background: '#fff',
        textAlign: 'right',
      }"
    >
      <a-button :style="{marginRight: '8px'}" @click="onClose">
        取消
      </a-button>
      <a-button @click="submitOk" type="primary">确定</a-button>
    </div>
  </a-drawer>
</template>

<script>
import { mapActions } from 'vuex'
import { Drawer } from 'ant-design-vue'
const smStyle = {
  fontSize: '12px', float: 'left'
}
const mdStyle = {
  fontSize: '14px'
}
const lgStyle = {
  fontSize: '16px'
}
export default {
  name: 'MenuDrawer',
  components: {
    [Drawer.name]: Drawer
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    visible: {
      type: Boolean,
      default: false
    },
    menuData: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      treeData: [],
      checkedKeys: [],
      searchValue: '',
      height: 500,
      menuList: [],
      type: 1,
      backupsExpandedKeys: [],
      autoExpandParent: false,
      selectedKeys: [],
      expandedKeys: [],
      finalCheck: []
    }
  },
  watch: {
    menuData: {
      handler (newVal, oldVal) {
        console.log(newVal)
        this.checkedKeys = []
        this.getRoleMenu(newVal)
      },
      deep: true
    },
    finalCheck: {
      handler (newVal, oldVal) {
        console.log(newVal)
      },
      deep: true
    }
  },
  mounted () {
    this.height = document.body.clientHeight - 200
    this.initMenu()
  },
  methods: {
    ...mapActions('home', [
      'queryApply', 'getBindMenu', 'userBindMenu', 'roleBindMenu'
    ]),
    onCheck (checkedKeys, e) {
      this.finalCheck = checkedKeys.concat(e.halfCheckedKeys)
      console.log('onCheck', this.finalCheck)
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
    onSearch () {
      var vm = this
      if (vm.searchValue === '') {
        vm.expandedKeys = []
      } else {
        vm.expandedKeys = []
        vm.backupsExpandedKeys = []
        const candidateKeysList = vm.getkeyList(vm.searchValue, vm.treeData, [])
        candidateKeysList.map(
          item => {
            var key = vm.getParentKey(item, vm.treeData)
            if (key && !vm.backupsExpandedKeys.some(item => item === key)) { vm.backupsExpandedKeys.push(key) }
          }
        )
        const length = this.backupsExpandedKeys.length
        for (let i = 0; i < length; i++) {
          vm.getAllParentKey(vm.backupsExpandedKeys[i], vm.treeData)
        }
        vm.expandedKeys = vm.backupsExpandedKeys.slice()
      }
    },
    async getRoleMenu (data) {
      const req = {
        roleId: data.id,
        plateformType: '2'
      }
      const res = await this.roleBindMenu(req)
      if (res.data.length === 0) return
      const arr = res.data.map(item => {
        return this.dealValue(item)
      })
      const arr2 = arr.map(item => {
        return this.manageData(item)
      })
      if (res.data.length > 0) {
        this.flatten(arr2)
        this.checkedKeys = this.flatten(arr2).filter(ele => { return ele !== null })
        console.log(2222, this.checkedKeys)
      }
    },
    async initMenu () {
      const req = {
        plateformType: 2
      }
      const res = await this.queryApply(req)
      this.menuList = res.data.list
      this.treeData = this.menuList
        .map(item => {
          return {
            key: 0 + '-' + item.id,
            id: item.id,
            title: item.name,
            plateformType: item.plateformType,
            scopedSlots: { title: 'title' },
            appId: item.appId,
            style: lgStyle,
            children: [],
            type: 0
          }
        })
      this.treeData.forEach(ele => {
        const req = {
          appId: ele.id,
          plateformType: ele.plateformType
        }
        this.getBindMenu(req).then(res => {
          ele.children = res.data
          ele.children = ele.children.map(item => {
            return this.addValue(item)
          })
        })
      })
      this.treeData = [...this.treeData]
      console.log(111, this.treeData)
    },
    dealValue (item) {
      return {
        key: item.id ? (item.menuType === null ? 0 : item.menuType) + '-' + item.id : null,
        children: item.children
          ? item.children.map(itemes => {
            return this.dealValue(itemes)
          })
          : ''
      }
    },
    manageData (item) {
      return [
        item.children.length > 0 ? item.children.map(itemes => {
          return this.manageData(itemes)
        }) : item.key
      ]
    },
    flatten (arr) {
      const str = JSON.stringify(arr).replace(/\[|\]/g, '')
      return JSON.parse(Array.of('[' + str + ']')[0])
    },
    addValue (item) {
      return {
        key: (item.menuType === null ? 0 : item.menuType) + '-' + item.id,
        plateformType: item.plateformType,
        appId: item.appId,
        title: item.name,
        scopedSlots: { title: 'title' },
        style: item.menuType === 3 ? smStyle : mdStyle,
        children: item.children
          ? item.children.map(itemes => {
            return this.addValue(itemes)
          })
          : ''
      }
    },
    onClose () {
      this.$emit('close', false)
      this.getRoleMenu(this.menuData)
    },
    submitOk () {
      const nodeList = []
      Array.from(new Set(this.checkedKeys.concat(this.finalCheck))).forEach(ele => {
        nodeList.push({
          app: ele.split('-')[0] === '0',
          nodeId: ele.split('-')[1]
        })
      })
      const req = {
        roleId: this.menuData.id,
        nodeList,
        plateformType: 2
      }
      this.userBindMenu(req).then(res => {
        this.$message.success('设置成功')
        this.$tools.goNext(() => {
          this.$emit('close', false)
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
/deep/ .ant-tree li{
  margin:3px 0;
}
/deep/ .ant-tree li ul{
  height: 100%;
  overflow: hidden;
}
/deep/ .ant-btn{
  border-radius: 4px;
}
</style>
