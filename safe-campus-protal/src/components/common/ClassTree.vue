<template>
  <div class="grade-tree">
    <a-skeleton v-if="treeData.length == 0 && !noData" active :paragraph="{ rows: 10 }" />
    <no-data v-if="noData" msg="暂无数据~"></no-data>
    <a-tree
      showLine
      :style="{ maxHeight: maxHeight + 'px' }"
      v-if="treeData.length > 0"
      @select="select"
      :loadData="onLoadData"
      :treeData="treeData"
      :defaultSelectedKeys="defaultSelectedKeys"
      :defaultExpandedKeys="defaultExpandedKeys"
    ></a-tree>
  </div>
</template>

<script>
import NoData from './NoData'
import $ajax from '@u/ajax-serve'
import { mapState } from 'vuex'
import hostEnv from '@config/host-env'
export default {
  name: 'GradeTree',
  props: {
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
      defaultExpandedKeys: [],
      schoolYearId: '',
      schoolYear: '',
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
      console.log(tree)
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
      if (tree.selectedNodes.length === 0) return
      const selectObj = {
        schoolYearId: this.schoolYearId,
        schoolYear: this.schoolYear,
        title: tree.selectedNodes[0].data.props.title,
        gradeName: tree.selectedNodes[0].data.props.gradeName,
        clazzName: tree.selectedNodes[0].data.props.clazzName,
        gradeCode: tree.selectedNodes[0].data.props.gradeCode,
        classCode: tree.selectedNodes[0].data.props.classCode,
        teacherName: tree.selectedNodes[0].data.props.teacherName,
        placeName: tree.selectedNodes[0].data.props.placeName
      }
      this.$emit('select', selectObj)
    },
    async initMenu() {
      const req = {
        schoolCode: this.schoolCode
      }
      const res = await $ajax.postForm({
        url: `${hostEnv.protal_api_11002}/schoolYearSemester/list`,
        params: req
      })
      if (res.data.list === null || res.data.list.length === 0) {
        this.noData = true
        return
      } else {
        this.noData = false
      }
      this.schoolYearId = res.data.list[0].id
      this.schoolYear = res.data.list[0].schoolYear
      $ajax
        .postForm({
          url: `${hostEnv.protal_api_11002}/grade/manage/list`,
          params: req
        })
        .then(res => {
          this.gradeList = res.data.list
          $ajax
            .post({
              url: `${hostEnv.protal_api_11002}/classManage/list`,
              params: {
                schoolCode: this.schoolCode,
                schoolYearId: this.schoolYearId,
                gradeCode: this.gradeList[0].code
              }
            })
            .then(res => {
              if (res.data.list === null || res.data.list.length === 0) {
                this.treeData = this.gradeList.map(item => {
                  return {
                    title: item.name,
                    code: item.code,
                    key: item.id
                  }
                })
                return
              }
              const selectObj = {
                schoolYearId: this.schoolYearId,
                schoolYear: this.schoolYear,
                gradeName: this.gradeList[0].name,
                clazzName: res.data.list[0].className,
                gradeCode: this.gradeList[0].code,
                classCode: res.data.list[0].classCode,
                teacherName: res.data.list[0].teacherName,
                placeName: res.data.list[0].placeName
              }
              this.defaultExpandedKeys = [this.gradeList[0].id]
              this.defaultSelectedKeys = [res.data.list[0].id]
              this.treeData = this.gradeList.map(item => {
                return {
                  title: item.name,
                  code: item.code,
                  key: item.id
                }
              })
              this.$emit('select', selectObj)
            })
        })
    },
    async onLoadData(treeNode) {
      return new Promise(resolve => {
        if (treeNode.dataRef.children) {
          resolve()
          return
        }
        const req = {
          schoolCode: this.schoolCode,
          schoolYearId: this.schoolYearId,
          gradeCode: treeNode.dataRef.code
        }
        $ajax
          .post({
            url: `${hostEnv.protal_api_11002}/classManage/list`,
            params: req
          })
          .then(res => {
            treeNode.dataRef.children = res.data.list.map(item => {
              return {
                title: item.className,
                schoolYearId: this.schoolYearId,
                schoolYear: this.schoolYear,
                gradeName: item.gradeName,
                clazzName: item.className,
                gradeCode: treeNode.dataRef.code,
                classCode: item.classCode,
                teacherName: item.teacherName,
                key: item.id,
                placeName: item.placeName,
                isLeaf: true
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
  min-height: 600px;
  overflow-y: auto;
}
</style>
