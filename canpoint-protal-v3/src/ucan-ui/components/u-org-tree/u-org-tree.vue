<template>
  <div class="u-org-tree">
    <a-skeleton v-if="treeData.length == 0 && !noData" active :paragraph="{ rows: 10 }" />
    <u-empty v-if="noData" description="什么也没有~"></u-empty>
    <a-tree
      :style="{ maxHeight: maxHeight + 'px' }"
      v-if="treeData.length > 0"
      @select="select"
      :treeData="treeData"
      :defaultExpandedKeys="defaultKey"
      :defaultSelectedKeys="defaultKey"
      showLine
    ></a-tree>
  </div>
</template>

<script>
import $ajax from '@u/libs/ajax-serve'
export default {
  name: 'UOrgTree',
  data() {
    return {
      noData: false,
      treeData: [],
      defaultKey: []
    }
  },
  props: {
    // 判断是局端(edu)还是校端
    type: {
      type: String,
      default: ''
    },
    // 学校code
    school: {
      type: String,
      default: ''
    },
    // 树组件最高高度
    maxHeight: {
      type: Number,
      default: document.body.clientHeight - 80
    }
  },
  mounted() {
    this.initMenu()
  },
  methods: {
    select(selectedKeys, info) {
      this.$emit('select', {
        name: info.node.title,
        title: info.node.title,
        code: info.node.eventKey,
        treeData: this.treeData,
        pos: info.node.pos,
        id: info.selectedNodes[0] ? info.selectedNodes[0].data.props.id : this.treeData[0].id
      })
    },
    async initMenu() {
      const res = await $ajax.get({
        url: '/protal_v3_11101/canpointOrg/tree',
        params: {
          schoolCode: this.school
        }
      })
      if (res.data === null || res.data.length === 0) {
        this.noData = true
        this.orgData = []
        return
      } else {
        this.noData = false
      }
      const data = this.newOrgData([res.data])
      this.defaultKey = [data[0].key]
      this.treeData = data
      const selectObj = {
        title: res.data.orgName,
        code: res.data.orgCode,
        key: res.data.orgCode
      }
      this.$emit('select', selectObj)
    },
    // 深层递归
    newOrgData(data) {
      data.forEach(item => {
        item.children = item.children || null
        item.title = item.orgName
        item.key = item.orgCode
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
.u-org-tree {
  padding: 0 10px;
  width: 220px;
  overflow-y: auto;
}
</style>
