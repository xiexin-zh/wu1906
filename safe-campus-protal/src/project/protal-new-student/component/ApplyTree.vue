<template>
  <div class="grade-tree">
    <a-skeleton v-if="treeData.length == 0 && !noData" active :paragraph="{ rows: 10 }" />
    <no-data v-if="noData" msg="暂无数据~"></no-data>
    <a-tree
      :style="{ maxHeight: maxHeight + 'px' }"
      v-if="treeData.length > 0"
      @select="select"
      :treeData="treeData"
      :defaultExpandedKeys="defaultSelectedKeys"
      :defaultSelectedKeys="defaultSelectedKeys"
    ></a-tree>
  </div>
</template>

<script>
import NoData from './NoData'
import $ajax from '@u/ajax-serve'
import { mapActions, mapState } from 'vuex'
import hostEnv from '@config/host-env'
export default {
  name: 'HighGradeTree',
  props: {
    isOnlyNewSchoolYear: {
      type: Boolean,
      default: false
    },
    isChoose: {
      type: Boolean,
      default: false
    },
    school: {
      type: String,
      default: ''
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
      schoolYear: '',
      isNewYear: true,
      maxHeight: 0
    }
  },
  components: {
    NoData
  },
  computed: {
    ...mapState('home', ['schoolCode'])
  },
  mounted() {
    this.maxHeight = window.screen.height - 280
    this.getTree()
  },

  methods: {
    ...mapActions('home', ['getApplyTree']),
    // 获取树列表
    async getTree() {
      const res = await this.getApplyTree(this.schoolCode)
      if (res.data.length > 0) {
        this.defaultSelectedKeys = [res.data[0].grade]
        const searchObj = {
          grade: res.data[0].grade,
          majorCode: ''
        }
        this.$emit('showList', searchObj)
      }

      this.treeData = res.data.map((item) => {
        return {
          ...item,
          title: item.grade + '级',
          key: item.grade,
          isTop: true,
          children: item.majorList.map((child) => {
            return {
              ...child,
              title: child.majorName,
              key: item.grade + '_' + child.majorCode,
              grade: item.grade,
              isTop: false
            }
          })
        }
      })
    },
    // 点击节点
    select(item, obj) {
      if (obj.selected) {
        const isTop = obj.selectedNodes[0].data.props.isTop
        const searchObj = {
          grade: obj.selectedNodes[0].data.props.grade,
          majorCode: isTop ? '' : obj.selectedNodes[0].data.props.majorCode
        }
        this.$emit('showList', searchObj)
      }
    }
  }
}
</script>

<style lang="less" scoed>
.grade-tree {
  padding: 0 10px;
  width: 220px;
  overflow-y: auto;
}
</style>
