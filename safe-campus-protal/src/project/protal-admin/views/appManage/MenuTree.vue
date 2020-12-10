<template>
  <div class="menu-tree">
    <p v-if="treeData.length === 0" style="padding: 10px">暂未分配菜单...</p>
    <a-tree
      v-if="treeData.length > 0"
      @select="select"
      :treeData="treeData"
      defaultExpandAll
      draggable
      @drop="onDrop"
    ></a-tree>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'MenuTree',
  data() {
    return {
      treeData: [],
      gradeId: '',
      classId: '',
      gradeList: [],
      applyId: '',
      plateformType: ''
    }
  },
  mounted() {
    this.appId = this.$route.query.id
    this.initMenu()
  },
  methods: {
    ...mapActions('home', ['getBindMenu', 'sortMenu']),
    // 节点拖拽
    onDrop(info) {
      const dragNode = info.dragNode.dataRef
      const dropNode = info.node.dataRef
      const dropPos = info.node.pos.split('-')
      if ((dragNode.nodeId && dropNode.url && !dropNode.nodeId) || (!dragNode.nodeId && dropNode.nodeId)) {
        this.$message.warning('只能同级移动菜单')
      }
      console.log(dragNode)
      // const req = {
      //   ...dragNode,
      //   orderNum: dragNode.nodeId ? dropPos[2] * 1 + 1 : dropPos[1] * 1 + 1,
      //   appId: this.appId,
      //   plateformType: this.plateformType,
      //   id: dragNode.key,
      //   name: dragNode.title,
      //   parentId: dragNode.nodeId,
      //   children: [],
      //   data: []
      // }
      const params = {
        appId: this.appId,
        menuId: dragNode.key,
        orderNum: dragNode.nodeId ? dropPos[2] * 1 + 1 : dropPos[1] * 1 + 1,
        parentId: dragNode.nodeId
      }
      this.sortMenu(params).then(() => {
        this.$message.success('操作成功')
        this.$tools.goNext(() => {
          this.initMenu()
        })
      })
    },
    onExpand() {},
    // 点击节点
    select(obj, tree) {
      if (obj.length === 0) {
        this.$emit('select', [])
      }
      if (tree.selectedNodes.length === 0) return
      const selectObj = {
        id: tree.selectedNodes[0].data.key,
        key: tree.selectedNodes[0].data.key,
        nodeId: tree.selectedNodes[0].data.props.nodeId,
        title: tree.selectedNodes[0].data.props.title,
        url: tree.selectedNodes[0].data.props.url,
        children: tree.selectedNodes[0].data.props.data
      }
      this.$emit('select', selectObj)
    },
    async initMenu() {
      const req = {
        appId: this.appId
      }
      const res = await this.getBindMenu(req)
      this.gradeList = res.data
      if (res.data.length !== 0) {
        this.treeData = res.data.map(item => this.filtersData(item))
      } else {
        this.treeData = []
      }
    },
    filtersData(record) {
      return {
        title: record.name,
        key: record.id,
        url: record.url,
        nodeId: record.parentId,
        data: record.children || [],
        children: record.children && record.children.length > 0 ? record.children.map(el => this.filtersData(el)) : []
      }
    }
  }
}
</script>

<style lang="less" scoped>
.menu-tree {
  width: 200px;
  min-height: 400px;
  max-height: 500px;
  overflow-y: auto;
}
</style>
