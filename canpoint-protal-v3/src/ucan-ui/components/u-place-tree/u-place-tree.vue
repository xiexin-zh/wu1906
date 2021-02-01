<template>
  <div class="u-place-tree">
    <a-skeleton v-if="treeData.length == 0 && !noData" active :paragraph="{ rows: 10 }" />
    <u-empty v-if="noData" description="什么也没有~"></u-empty>
    <a-tree
      v-if="treeData.length > 0"
      :style="{ maxHeight: maxHeight + 'px' }"
      @select="select"
      :treeData="treeData"
      :defaultExpandedKeys="defaultKey"
      :defaultSelectedKeys="defaultSelectedKeys"
    ></a-tree>
  </div>
</template>

<script>
import $ajax from '@u/libs/ajax-serve'
export default {
  name: 'PlaceTree',
  props: {
    // 学校code
    school: {
      type: String,
      default: ''
    },
    // 树组件最高高度
    maxHeight: {
      type: Number,
      default: document.body.clientHeight - 80
    },
    // 是否展示房间
    isChoose: {
      type: Boolean,
      default: false
    },
    // 是否默认选中第一个
    isSelect: {
      type: Boolean,
      default: true
    },
    // 默认选中第几层首条数据
    showAllTag: {
      type: String,
      default: '1'
    }
  },
  data() {
    return {
      noData: false,
      treeData: [],
      gradeId: '',
      classId: '',
      gradeList: [],
      defaultSelectedKeys: [],
      defaultKey: []
    }
  },
  mounted() {
    this.initMenu()
  },
  methods: {
    onExpand() {},
    // 点击节点
    select(obj, tree) {
      if (tree.selectedNodes.length === 0) return
      const selectObj = {
        title: tree.selectedNodes[0].data.props.title,
        code: tree.selectedNodes[0].data.props.code,
        key: tree.selectedNodes[0].data.props.code,
        currentCode: tree.selectedNodes[0].data.props.currentCode,
        parentId: tree.selectedNodes[0].data.props.parentId,
        parentName: tree.node.$parent.title
      }
      this.$emit('select', selectObj)
    },
    async initMenu() {
      const req = {
        schoolCode: this.school
      }
      const res = await $ajax.get({
        url: `/protal_v3_11101/canpointPlace/child/nodes`,
        params: req
      })
      if (res.data === null || res.data.length === 0) {
        this.noData = true
        return
      } else {
        this.noData = false
      }
      const data = this.newOrgData(res.data)
      this.treeData = data
      let selectObj = {}
      if (this.showAllTag === '1') {
        this.defaultKey = [res.data[0].id]
        this.defaultSelectedKeys = [res.data[0].id]
        selectObj = {
          code: res.data[0].id,
          key: res.data[0].id,
          title: res.data[0].placeName,
          parentId: '',
          parentName: '',
          currentCode: res.data[0].code
        }
      } else if (this.showAllTag === '2') {
        this.defaultKey = [res.data[0].children[0].id]
        this.defaultKey = this.isChoose ? [res.data[0].id] : [res.data[0].children[0].id]
        selectObj = {
          code: res.data[0].children[0].id,
          key: res.data[0].children[0].id,
          title: res.data[0].children[0].placeName,
          parentId: res.data[0].id,
          parentName: '',
          currentCode: res.data[0].children[0].code
        }
      } else if (this.showAllTag === '3') {
        this.defaultKey = [res.data[0].children[0].id]
        this.defaultSelectedKeys = [res.data[0].children[0].children[0].id]
        selectObj = {
          code: res.data[0].children[0].children[0].id.id,
          key: res.data[0].children[0].children[0].id.id,
          title: res.data[0].children[0].children[0].id.placeName,
          parentId: res.data[0].children[0].id,
          parentName: '',
          currentCode: res.data[0].children[0].children[0].id.code
        }
      } else if (this.showAllTag === '0') {
        this.defaultKey = []
        this.defaultSelectedKeys = []
        selectObj = {}
      }
      this.$emit('select', selectObj)
    },
    // 深层递归
    newOrgData(data) {
      data.forEach(item => {
        item.key = item.id
        item.title = `${item.placeName}${item.placeType === '2' ? '楼' : ''}`
        item.currentCode = item.code
        item.parentId = item.parentCode
        item.isLeaf = item.placeType === '3' ? true : item.placeType === '2' ? this.isChoose : false
        item.children = item.children || null
        if (item.children && item.children.length > 0) {
          this.newOrgData(item.children)
        }
      })
      return data
    }
  }
}
</script>

<style lang="less" scoed>
.u-place-tree {
  width: 240px;
  padding: 0 10px;
  overflow-y: auto;
}
</style>
