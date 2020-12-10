<template>
  <div class="orgTree">
    <div class="tree-wrapper" :key="treeKey" :style="{'height':tableHeight+'px','maxHeight':tableHeight+'px'}">
      <a-tree
        v-if="treeShow"
        :loadData="onLoadData"
        :treeData="rawTree"
        :defaultExpandAll="true"
        :showIcon="false"
        :draggable="true"
        @select="handleTreeNodeSelect"
        @expand="onExpand"
        :expandedKeys="expandedKeys"
        :defaultSelectedKeys="defaultSelectedKeys"
      >
      </a-tree>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  data () {
    return {
      treeShow: true,
      treeData: [],
      rawTree: [],
      title: '',
      currentSelectNodeId: [],
      currentSelectNode: {},
      confirmLoading: false,
      expandedKeys: [],
      defaultSelectedKeys: [],
      treeKey: Math.random(),
      schoolRootInfo: {}
    }
  },
  computed: {
    ...mapState('home', [
      'userInfo'
    ])
  },
  props: {
    scene: {
      type: Number,
      default: 0
    },
    tableHeight: {
      type: Number,
      default: 0
    },
    isDefaultSelect: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    ...mapActions('orgTree',
      ['getSchoolRoot', 'getTreeList']),
    onExpand (expandedKeys) {
      this.expandedKeys = expandedKeys
      this.autoExpandParent = false
    },
    handleTreeNodeSelect (ids, treeNode) {
      this.currentSelectNode = treeNode.node.dataRef
      this.currentSelectNodeId = ids
      this.$emit('tree-click', treeNode.node.dataRef.levelCode)
    },
    onLoadData (treeNode) {
      return new Promise((resolve) => {
        // console.log('onload')
        this.getTreeInfo(treeNode, treeNode.dataRef)
        resolve()
      })
    },
    getSchoolInfo () {
      this.getSchoolRoot(sessionStorage.getItem('schoolScheme')).then(res => {
        this.rootId = res.data.id
        this.schoolRootInfo = res.data
        this.treeShow = true
        this.rawTree = []
        this.rawTree.push(this.schoolRootInfo)
        this.rawTree[0].title = this.rawTree[0].value
        this.rawTree[0].key = this.rawTree[0].id
        this.$nextTick(() => {
          this.expandedKeys = [this.rawTree[0].id]
          if (this.isDefaultSelect) {
            this.defaultSelectedKeys = [this.rawTree[0].id]
            this.currentSelectNodeId = [this.rawTree[0].id]
            this.currentSelectNode = this.rawTree[0]
            this.treeKey = Math.random()
            this.$emit('tree-click', this.rawTree[0].levelCode)
          }
        })
        this.onLoadData({ dataRef: this.rawTree[0] })
      })
    },
    async getTreeInfo (treeNode, data) {
      const req = {
        isValid: data.isValid === 1,
        pCode: data.code,
        schoolCode: data.schoolCode,
        node: data.id
      }
      const res = await this.getTreeList(req)
      res.data.forEach(el => {
        el.title = el.value
        el.key = el.id
        if (el.childSize > 0) {
          el.isLeaf = false// 非叶子节点
        } else {
          el.isLeaf = true// 叶子节点
        }
      })
      if (treeNode) {
        treeNode.dataRef.children = res.data
        this.rawTree = [...this.rawTree]
      }
    }
  },
  mounted () {
  }
}
</script>

<style lang="less" scoped>
.orgTree{
  min-width: 250px;
  .tree-wrapper{
    padding: 12px 0 0 12px;
    border-radius: 5px;
    background-color: #fff;
    overflow: auto;
  }
}
</style>
<style scoped>
</style>
