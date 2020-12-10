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
  name: 'GradeTree',
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
      console.log(obj)
      if (obj.length === 0) {
        return
      }
      console.log('1111111', obj, tree.selectedNodes[0].data.props)
      const gradeIds = []
      this.gradeList.forEach((el) => {
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
        schoolYearId: tree.selectedNodes[0].data.props.schoolYearId,
        title: tree.selectedNodes[0].data.props.title,
        gradeCode: tree.selectedNodes[0].data.props.gradeCode,
        classCode: tree.selectedNodes[0].data.props.classCode,
        isNewYear: tree.selectedNodes[0].data.props.schoolYearId === this.schoolYear
      }
      console.log(selectObj)
      this.$emit('select', selectObj)
    },
    async initMenu() {
      const req = {
        schoolCode: this.school ? this.school : this.schoolCode
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
      this.gradeList = res.data.list
        .filter((item) => {
          return item.semester === '下学期'
        })
        .filter((item) => {
          return item.valid === '1'
        })
      if (res.data.list[0].semester === '上学期') {
        this.gradeList.unshift({
          id: res.data.list[0].id,
          semester: res.data.list[0].semester,
          schoolYear: res.data.list[0].schoolYear
        })
      }
      this.schoolYear = this.gradeList[0].id
      this.schoolYearName = this.gradeList[0].schoolYear
      const selectObj = {
        schoolYearId: this.gradeList[0].id,
        title: this.gradeList[0].schoolYear,
        gradeCode: this.gradeList[0].gradeCode,
        classCode: this.gradeList[0].classCode,
        isNewYear: true
      }
      this.defaultSelectedKeys = [this.gradeList[0].id]
      if (this.isOnlyNewSchoolYear) {
        this.treeData = [
          {
            title: this.gradeList[0].schoolYear + '学年',
            code: this.gradeList[0].id,
            key: this.gradeList[0].id,
            schoolYearId: this.gradeList[0].id
          }
        ]
      } else {
        this.treeData = this.gradeList.map((item) => {
          return {
            title: item.schoolYear + '学年',
            code: item.id,
            key: item.id,
            schoolYearId: item.id
          }
        })
      }
      this.$emit('select', selectObj)
    },
    async onLoadData(treeNode) {
      return new Promise((resolve) => {
        if (treeNode.dataRef.children) {
          resolve()
          return
        }
        const req = {
          schoolCode: this.school ? this.school : this.schoolCode
        }
        $ajax
          .postForm({
            url: `${hostEnv.protal_api_11002}/grade/manage/list`,
            params: req
          })
          .then((res) => {
            treeNode.dataRef.children = res.data.list.map((item) => {
              return {
                title: item.name,
                schoolYearId: treeNode.dataRef.schoolYearId,
                isLeaf: this.isChoose,
                gradeCode: item.code
              }
            })
            treeNode.dataRef.children.forEach((item) => {
              const data = {
                schoolCode: this.schoolCode,
                schoolYearId: treeNode.dataRef.schoolYearId,
                gradeCode: item.gradeCode
              }
              $ajax
                .post({
                  url: `${hostEnv.protal_api_11002}/classManage/list`,
                  params: data
                })
                .then((res) => {
                  item.children = res.data.list.map((ele) => {
                    return {
                      title: ele.className,
                      schoolYearId: item.schoolYearId,
                      gradeCode: item.gradeCode,
                      classCode: ele.classCode,
                      isLeaf: true
                    }
                  })
                  this.treeData = [...this.treeData]
                })
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
