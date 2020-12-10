<template>
  <div class="grade-tree">
    <a-skeleton v-if="treeData.length == 0 && !noData" active :paragraph="{ rows: 10 }" />
    <no-data v-if="noData" msg="暂无数据~"></no-data>
    <a-tree
      :style="{ maxHeight: maxHeight + 'px' }"
      v-if="treeData.length > 0"
      @select="select"
      :loadData="onLoadData"
      :treeData="treeData"
      :defaultExpandedKeys="defaultSelectedKeys"
      :defaultSelectedKeys="defaultSelectedKeys"
    ></a-tree>
  </div>
</template>

<script>
import NoData from './NoData'
import $ajax from '@u/ajax-serve'
import { mapState } from 'vuex'
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
    this.initMenu()
  },
  methods: {
    onExpand() {},
    // 点击节点
    select(obj, tree) {
      if (obj.length === 0) {
        return
      }
      const gradeIds = []
      this.gradeList.forEach(el => {
        return gradeIds.push(el.gradeId)
      })
      if (gradeIds.indexOf(obj[0]) === -1) {
        this.classId = obj[0]
      } else {
        this.gradeId = obj[0]
        this.classId = ''
      }
      let isTopLevel = false
      this.gradeList.forEach(item => {
        if (item.id === obj[0]) {
          isTopLevel = true
        }
      })
      if (tree.selectedNodes.length === 0) return
      const nowGrade = this.gradeList.filter(item => {
        return item.id === tree.selectedNodes[0].data.props.schoolYearId
      })
      const gradeName = nowGrade.length === 0 ? '' : nowGrade[0].gradeName
      const selectObj = {
        schoolYearId: tree.selectedNodes[0].data.props.schoolYearId,
        schoolYearName: gradeName,
        title: isTopLevel ? '' : tree.selectedNodes[0].data.props.title,
        gradeCode: isTopLevel ? '' : tree.selectedNodes[0].data.props.gradeCode,
        classCode: tree.selectedNodes[0].data.props.classCode,
        isNewYear: tree.selectedNodes[0].data.props.schoolYearId === this.schoolYear
      }
      this.$emit('select', selectObj)
    },

    async initMenu() {
      const req = {
        schoolCode: this.school ? this.school : this.schoolCode
      }
      // 查询年级
      const res = await $ajax.get({
        url: `${hostEnv.protal_api_8092}/class/manage/query/grade`,
        params: req
      })
      if (res.data === null || res.data.length === 0) {
        this.noData = true
        return
      } else {
        this.noData = false
      }
      this.gradeList = res.data
      this.defaultSelectedKeys = [this.gradeList[0].id]
      this.schoolYear = this.gradeList[0].id
      this.schoolYearName = this.gradeList[0].gradeName
      const selectObj = {
        schoolYearName: this.gradeList[0].gradeName,
        title: '',
        gradeCode: '',
        classCode: '',
        isNewYear: true
      }
      this.treeData = this.gradeList.map(item => {
        return {
          title: item.gradeName + '级',
          code: item.gradeCode,
          key: item.id,
          schoolYearId: item.id
        }
      })
      this.$emit('select', selectObj)
    },
    async onLoadData(treeNode) {
      return new Promise(resolve => {
        if (treeNode.dataRef.children) {
          resolve()
          return
        }
        const req = {
          schoolCode: this.school ? this.school : this.schoolCode,
          gradeName: 2020
        }
        $ajax
          .get({
            url: `${hostEnv.protal_api_8092}/class/manage/query/subject/by/grade`,
            params: req
          })
          .then(res => {
            treeNode.dataRef.children = res.data.map(item => {
              return {
                title: item.subjectName,
                schoolYearId: treeNode.dataRef.schoolYearId,
                isLeaf: true,
                gradeCode: item.subjectCode
              }
            })
            this.treeData = [...this.treeData]
            resolve()
          })
      })
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
