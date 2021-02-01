<template>
  <div class="u-dorm-tree">
    <a-skeleton v-if="treeData.length == 0 && !noData" active :paragraph="{ rows: 10 }" />
    <u-empty v-if="noData" description="什么也没有~"></u-empty>
    <a-tree
      :style="{ maxHeight: maxHeight + 'px' }"
      v-if="treeData.length > 0"
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
  name: 'UDormTree',
  props: {
    // 学校编码
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
      const data = tree.selectedNodes[0].data.props
      const selectObj = {
        title: data.title,
        code: data.code,
        key: data.code,
        pCode: data.pCode,
        buildCode: data.type === '1' ? data.code : data.type === '2' ? tree.node.$parent.eventKey : data.type === '3' ? tree.node.$parent.$parent.eventKey : '',
        floorCode: data.type === '2' ? data.code : data.type === '3' ? tree.node.$parent.eventKey : '',
        roomCode: data.type === '3' ? data.code : ''
      }
      this.$emit('select', selectObj)
    },
    async initMenu() {
      const res = await $ajax.postForm({
        url: `/protal_v3_11102/canpointDormManage/getDormTree`,
        params: {
          schoolCode: this.school
        }
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
        this.defaultSelectedKeys = [res.data[0].code]
         this.defaultKey = [res.data[0].code]
         selectObj = {
          title: res.data[0].name,
          code: res.data[0].code,
          key: res.data[0].code,
          buildCode: res.data[0].code,
          floorCode: '',
          roomCode: '',
          pCode: ''
        }
      } else if (this.showAllTag === '2') {
        this.defaultSelectedKeys = [res.data[0].children[0].code]
        this.defaultKey = this.isChoose ? [res.data[0].code] : [res.data[0].children[0].code]
        selectObj = {
          title: res.data[0].children[0].name,
          code: res.data[0].children[0].code,
          key: res.data[0].children[0].code,
          buildCode: res.data[0].code,
          floorCode: res.data[0].children[0].code,
          roomCode: '',
          pCode: res.data[0].code
        }
      } else if (this.showAllTag === '3') {
        this.defaultSelectedKeys = [res.data[0].children[0].children[0].code]
        this.defaultKey = [res.data[0].children[0].code]
        selectObj = {
          title: res.data[0].children[0].children[0].name,
          code: res.data[0].children[0].children[0].code,
          key: res.data[0].children[0].children[0].code,
          buildCode: res.data[0].code,
          floorCode: res.data[0].children[0].code,
          roomCode: res.data[0].children[0].children[0].code,
          pCode: res.data[0].children[0].code
        }
      } else if (this.showAllTag === '0') {
        this.defaultSelectedKeys = []
        this.defaultKey = []
        selectObj = {}
      }
      this.$emit('select', selectObj)
    },
    // 深层递归
    newOrgData(data) {
      data.forEach(item => {
        item.children = item.childList || null
        item.title = item.name
        item.key = item.code
        item.pCode = item.parentCode
        item.isLeaf = item.type === '3' ? true : item.type === '2' ? this.isChoose : false
        if (item.childList && item.childList.length > 0) {
          this.newOrgData(item.childList)
        }
      })
      return data
    }
  }
}
</script>

<style lang="less" scoed>
.u-dorm-tree {
  padding: 0 10px;
  width: 220px;
  overflow-y: auto;
}
</style>
