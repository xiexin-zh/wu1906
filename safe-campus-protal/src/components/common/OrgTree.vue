<template>
  <div class="grade-tree u-scroll-y">
    <a-skeleton v-if="orgData.length == 0 && !noData" active :paragraph="{ rows: 10 }" />
    <no-data v-if="noData" msg="暂无组织机构~"></no-data>
    <a-tree
      v-if="orgData.length > 0"
      :style="{ maxHeight: maxHeight + 'px' }"
      @select="select"
      :treeData="orgData"
      :defaultExpandedKeys="defaultKey"
      :defaultSelectedKeys="defaultKey"
      showLine
    ></a-tree>
  </div>
</template>

<script>
import NoData from './NoData'
import $ajax from '@u/ajax-serve'
import { mapState } from 'vuex'
import hostEnv from '@config/host-env'
export default {
  name: 'OrgTree',
  data() {
    return {
      noData: false,
      orgData: [],
      defaultKey: [],
      code: '',
      maxHeight: 0
    }
  },
  props: {
    type: {
      type: String,
      default: ''
    },
    school: {
      type: String,
      default: ''
    }
  },
  components: {
    NoData
  },
  computed: {
    ...mapState('home', ['schoolCode', 'eduCode'])
  },
  created() {
    this.code = this.type === 'edu' ? this.eduCode : this.schoolCode
    if (this.school) {
      this.code = this.school
    }
    this.showList()
  },
  methods: {
    select(selectedKeys, info) {
      this.$emit('select', {
        name: info.node.title,
        code: info.node.eventKey,
        treeData: this.orgData,
        pos: info.node.pos,
        id: info.selectedNodes[0] ? info.selectedNodes[0].data.props.id : this.orgData[0].id
      })
    },
    async showList() {
      const res = await $ajax.get({
        url: `${hostEnv.protal_api_11002}/school/org/getSchoolRoot/${this.code}`
      })
      if (res.data === null || res.data.length === 0) {
        this.noData = true
        return
      } else {
        this.noData = false
      }
      const data = this.newOrgData([res.data])
      this.defaultKey = [data[0].key]
      this.$emit('defaultCode', { code: this.defaultKey, name: data[0].title })
      this.orgData = data
    },
    // 深层递归
    newOrgData(data) {
      data.forEach(item => {
        item.children = item.orgChilds || null
        item.title = item.name
        item.key = item.code
        if (item.orgChilds && item.orgChilds.length > 0) {
          this.newOrgData(item.orgChilds)
        }
      })
      return data
    }
  }
}
</script>

<style lang="less" scoped>
.grade-tree {
  padding: 0 10px;
  width: 240px;
  min-height: 600px;
  overflow-y: auto;
}
</style>
