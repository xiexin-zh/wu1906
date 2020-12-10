<template>
  <div class="menu-tree">
    <a-tree
      @select="select"
      :loadData="onLoadData"
      :treeData="treeData"
      showLine
    />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  name: 'ClassTree',
  props: {
    value: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data () {
    return {
      treeData: [],
      gradeId: '',
      classId: '',
      gradeList: []
    }
  },
  computed: {
    ...mapState('home', [
      'authWebUserInfo'
    ])
  },
  mounted () {
    this.initMenu()
  },
  methods: {
    ...mapActions('home', [
      'getGrade',
      'gradeClass'
    ]),
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
      const selectObj = {
        gradeId: this.gradeId,
        key: this.classId,
        code: tree.selectedNodes[0].data.props.pCode,
        title: tree.selectedNodes[0].data.props.title,
        year: tree.selectedNodes[0].data.props.year
      }
      this.$emit('select', selectObj)
    },
    initMenu () {
      this.getGrade({
        schoolScheme: this.authWebUserInfo.exts.schoolScheme
      }).then(res => {
        const selectObj = {
          gradeId: res.data[0].gradeId,
          key: '',
          code: '',
          title: res.data[0].gradeName,
          year: ''
        }
        this.gradeList = res.data
        this.treeData = res.data.map(item => {
          return {
            title: item.gradeName,
            key: item.gradeId,
            pCode: item.gradeCode
          }
        })
        this.onLoadData({
          dataRef: {
            pCode: res.data[0].gradeCode,
            key: res.data[0].gradeId
          }
        })
        this.$emit('select', selectObj)
      })
    },
    onLoadData (treeNode) {
      return new Promise((resolve) => {
        if (treeNode.dataRef.children) {
          resolve()
          return
        }
        this.gradeId = treeNode.dataRef.key
        this.gradeClass({
          gradeId: this.gradeId
        }).then(res => {
          treeNode.dataRef.children = res.data.map(item => {
            return {
              title: item.className,
              key: item.id,
              pCode: item.code,
              year: item.year,
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
</style>
