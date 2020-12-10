<template>
  <div class="grade-tree">
    <a-tree
      @select="select"
      :loadData="onLoadData"
      :treeData="treeData"
      :defaultSelectedKeys="defaultSelectedKeys"
    >
    </a-tree>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  name: 'GradeTree',
  props: {
  },
  data () {
    return {
      treeData: [],
      gradeId: '',
      classId: '',
      gradeList: [],
      defaultSelectedKeys: [],
      schoolYear: '',
      isNewYear: true
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  mounted () {
    this.initMenu()
  },
  methods: {
    ...mapActions('home', [
      'getSchoolYear', 'getGradeList', 'getClassList'
    ]),
    onExpand () {},
    // 点击节点
    select (obj, tree) {
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
        schoolYearId: tree.selectedNodes[0].data.props.schoolYearId,
        title: tree.selectedNodes[0].data.props.title,
        gradeCode: tree.selectedNodes[0].data.props.gradeCode,
        classCode: tree.selectedNodes[0].data.props.classCode,
        isNewYear: tree.selectedNodes[0].data.props.schoolYearId === this.schoolYear
      }
      this.$emit('select', selectObj)
    },
    async initMenu () {
      const req = {
        schoolCode: this.userInfo.schoolCode
      }
      const res = await this.getSchoolYear(req)
      if (res.data.list.length === 0) return
      this.gradeList = res.data.list.filter(item => {
        return item.semester === '下学期'
      })
      if (res.data.list[0].semester === '上学期') {
        this.gradeList.unshift({
          id: res.data.list[0].id,
          semester: res.data.list[0].semester,
          schoolYear: res.data.list[0].schoolYear
        })
      }
      this.schoolYear = this.gradeList[0].id
      const selectObj = {
        schoolYearId: this.gradeList[0].id,
        title: this.gradeList[0].schoolYear + '学年',
        gradeCode: this.gradeList[0].gradeCode,
        classCode: this.gradeList[0].classCode,
        isNewYear: true
      }
      this.treeData = this.gradeList
        .map(item => {
          return {
            title: item.schoolYear + '学年',
            code: item.id,
            schoolYearId: item.id
          }
        })
      this.defaultSelectedKeys = [this.gradeList[0].id]
      this.onLoadData({
        dataRef: {
          schoolYearId: this.treeData[0].code
        }
      })
      this.$emit('select', selectObj)
    },
    async onLoadData (treeNode) {
      return new Promise((resolve) => {
        if (treeNode.dataRef.children) {
          resolve()
          return
        }
        const req = {
          schoolCode: this.userInfo.schoolCode
        }
        this.getGradeList(req).then(res => {
          treeNode.dataRef.children = res.data.list.map(item => {
            return {
              title: item.name,
              schoolYearId: treeNode.dataRef.schoolYearId,
              isLeaf: false,
              gradeCode: item.code
            }
          })
          treeNode.dataRef.children.forEach(item => {
            const data = {
              schoolCode: this.userInfo.schoolCode,
              schoolYearId: treeNode.dataRef.schoolYearId,
              gradeCode: item.gradeCode
            }
            this.getClassList(data).then(res => {
              item.children = res.data.list.map(ele => {
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
    min-height: 400px;
    max-height: 800px;
    overflow-y: auto
  }
</style>
