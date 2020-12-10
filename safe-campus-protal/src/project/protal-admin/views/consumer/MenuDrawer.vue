<template>
  <a-drawer
    title="菜单授权"
    :width="720"
    @close="onClose"
    :visible="visible"
    :wrapStyle="{height: 'calc(100% - 108px)',overflow: 'auto',paddingBottom: '108px'}"
    :destroyOnClose="true"
  >
    <a-input-search v-model="searchValue" style="margin-bottom: 8px" placeholder="请输入菜单名称" @change="onSearch" />
    <a-tree
      v-if="treeData.length>0"
      checkable
      @expand="onExpand"
      :expandedKeys="expandedKeys"
      v-model="checkedKeys"
      :treeData="treeData"
      @check="onCheck"
    >
      <template slot="title" slot-scope="item">
        <span v-if="item.title.indexOf(searchValue) > -1">
          {{ item.title.substr(0, item.title.indexOf(searchValue)) }}
          <span style="color: #f50">{{ searchValue }}</span>
          {{ item.title.substr(item.title.indexOf(searchValue) + searchValue.length) }}
        </span>
        <span v-else>{{ item.title }}</span>
      </template>
    </a-tree>
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
      <a-button :style="{marginRight: '8px'}" @click="onClose"> 取消 </a-button>
      <a-button @click="onDefine" type="primary">确定</a-button>
    </div>
  </a-drawer>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import NoData from '@c/NoData'
export default {
  name: 'MenuDrawer',
  components: {
    NoData
  },
  props: {
    roleInfo: {
      type: Object,
      default: () => {
        return {}
      }
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      fileList: [],
      title: '新增角色',
      formStatus: false,
      chooseList: [],
      total: 0,
      pageList: {
        page: 1,
        size: 20
      },
      userList: [],
      treeData: [],
      roleId: '',
      applyList: [],
      nodeList: [],
      applyId: '',
      oldObj: [],
      newObj: [],
      checkedKeys: [],
      checkedArr: [],
      expandedKeys: [],
      searchValue: ''
    }
  },
  watch: {
    roleInfo: {
      handler (newVal, oldVal) {
        this.checkedKeys = []
        this.getRoleMenu(newVal)
      },
      deep: true
    }
  },
  computed: {
    ...mapState('home', ['schoolCode'])
  },
  mounted () {
    this.applyGet()
  },
  methods: {
    ...mapActions('home', [
      'userBindMenu', 'queryApply', 'roleBindMenu', 'getBindMenu'
    ]),
    onExpand (expandedKeys) {
      this.expandedKeys = expandedKeys
    },
    // 根据学校查询应用以及应用下绑定的菜单
    async applyGet () {
      const res = await this.queryApply({ plateformType: '2', schoolCode: this.schoolCode, category: '01' })
      if (res.data.length !== 0) {
        this.treeData = res.data.list.map(item => {
          return {
            title: item.name,
            key: item.id + '-' + item.id,
            nodeId: item.id,
            url: item.url,
            appId: item.id,
            plateformType: item.plateformType,
            scopedSlots: { title: 'title' }
          }
        })
        this.treeData.forEach(el => {
          const req = {
            appId: el.appId,
            plateformType: el.plateformType,
            nodeId: el.appId === el.key ? '' : el.key.split('-')[0]
          }
          this.getBindMenu(req).then(res => {
            el.children = res.data.map(org => this.mapTree(org))
            this.treeData = [...this.treeData]
          })
        })
      }
    },
    mapTree (org) {
      const haveChildren = Array.isArray(org.children) && org.children.length > 0
      return {
        title: org.name,
        key: org.id + '-' + (org.parentId ? org.parentId : (org.appId ? org.appId : org.id)),
        data: { ...org },
        scopedSlots: { title: 'title' },
        children: haveChildren ? org.children.map(i => this.mapTree(i)) : []
      }
    },
    // 点击节点
    onCheck (obj, tree) {
      this.nodeList = this.checkedKeys.concat(tree.halfCheckedKeys)
    },
    onDefine () {
      const data = []
      Array.from(new Set(this.checkedKeys.concat(this.nodeList))).forEach(el => {
        data.push({
          nodeId: el.split('-')[0],
          app: el.split('-')[0] === el.split('-')[1]
        })
      })
      if (data.length === 0) {
        this.$message.warning('请选择菜单')
        return
      }
      const req = {
        nodeList: data,
        roleId: this.roleInfo.id,
        plateformType: '2'
      }
      this.userBindMenu(req).then(res => {
        this.$message.success('操作成功')
        this.$tools.goNext(() => {
          this.$emit('update')
        })
      })
    },
    // 查询角色所拥有的菜单
    async getRoleMenu (record) {
      const req = {
        plateformType: '2',
        roleId: record.id
      }
      const res = await this.roleBindMenu(req)
      if (res.data.length === 0) {
        this.checkedKeys = []
      } else {
        res.data = res.data.map(org => this.mapTree(org))
        this.checkedArr = []
        this.mapBind(res.data)
        this.checkedKeys = this.checkedArr.filter(ele => {
          return (ele !== null) && ele.split('-')[0] !== ele.split('-')[1]
        })
      }
    },
    mapBind (org) {
      org.forEach(el => {
        this.checkedArr.push(el.key)
        if (el.children.length > 0) {
          this.mapBind(el.children)
        }
      })
    },
    onClose () {
      this.$emit('update')
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
    }
  }
}
</script>
<style lang="less" scoped>
</style>
