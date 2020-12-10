<template>
  <div class="teacher-tree u-fx-f1">
    <a-skeleton v-if="treeData.length == 0 && !noData" active :paragraph="{ rows: 10 }" />
    <no-data v-if="noData" msg="暂无数据~"></no-data>
    <a-tree
      v-if="treeData.length > 0"
      @select="select"
      :loadData="onLoadData"
      :treeData="treeData"
      showLine
      :defaultSelectedKeys="type === '1' ? defaultSelectedKeys : []"
      :defaultExpandedKeys="type === '1' ? defaultExpandedKeys : []"
    />
  </div>
</template>

<script>
import NoData from '@c/NoData'
import { mapState, mapActions } from 'vuex'
export default {
  name: 'TeacherMenu',
  props: {
    type: {
      type: String,
      default: '0'
    },
    value: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  components: {
    NoData
  },
  data() {
    return {
      noData: false,
      treeData: [],
      subList: [],
      defaultSelectedKeys: [],
      defaultExpandedKeys: []
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  mounted() {
    this.initMenu()
  },
  methods: {
    ...mapActions('home', ['getSubject', 'getTeacherList']),
    // 点击节点
    select(obj, tree) {
      if (tree.selectedNodes.length === 0) return
      const selectObj = {
        key: tree.selectedNodes[0].key,
        title: tree.selectedNodes[0].data.props.title,
        courseName: tree.selectedNodes[0].data.props.courseName,
        courseId: tree.selectedNodes[0].data.props.courseId,
        teacherId: tree.selectedNodes[0].data.props.teacherId
      }
      this.$emit('select', selectObj)
    },
    initMenu() {
      this.getSubject({
        ...this.userInfo,
        enable: '1'
      }).then(res => {
        if (res.data === null || res.data.length === 0) {
          this.noData = true
          return
        } else {
          this.noData = false
        }
        this.subList = res.data
        this.getTeacherList({
          pageNum: 1,
          pageSize: 9999,
          ...this.userInfo,
          subjectCode: res.data[0].subjectCode
        }).then(res => {
          if (!res.data.list || res.data.list.length === 0) {
            this.treeData = this.subList.map(item => {
              return {
                title: item.subjectName,
                key: item.subjectCode
              }
            })
            return
          }
          const selectObj = {
            key: res.data.list[0].teacherCode + '&' + res.data.list[0].subjectCode,
            title: res.data.list[0].teacherName,
            courseName: this.subList.filter(item => {
              return item.subjectCode === res.data.list[0].subjectCode
            })[0].subjectName,
            courseId: res.data.list[0].subjectCode,
            teacherId: res.data.list[0].teacherCode
          }
          this.defaultExpandedKeys = [this.subList[0].subjectCode]
          this.defaultSelectedKeys = [res.data.list[0].teacherCode + '&' + res.data.list[0].subjectCode]
          this.treeData = this.subList.map(item => {
            return {
              title: item.subjectName,
              key: item.subjectCode
            }
          })
          if (this.type === '1') {
            this.$emit('select', selectObj)
          }
        })
      })
    },
    onLoadData(treeNode) {
      return new Promise(resolve => {
        if (treeNode.dataRef.children) {
          resolve()
          return
        }
        const req = {
          pageNum: 1,
          pageSize: 9999,
          ...this.userInfo,
          subjectCode: treeNode.dataRef.key
        }
        this.getTeacherList(req).then(res => {
          if (!res.data) {
            resolve()
            return
          }
          treeNode.dataRef.children = res.data.list.map(item => {
            return {
              title: item.teacherName,
              teacherId: item.teacherCode,
              key: item.teacherCode + '&' + item.subjectCode || '',
              isLeaf: true,
              courseName: this.subList.filter(ele => {
                return item.subjectCode === ele.subjectCode
              })[0].subjectName,
              courseId: item.subjectCode
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

<style lang="less" scoped>
.teacher-tree {
  overflow-y: auto;
}
</style>
