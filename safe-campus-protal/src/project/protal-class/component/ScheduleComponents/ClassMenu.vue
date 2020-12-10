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
  name: 'ClassMenu',
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
      treeData: []
    }
  },
  computed: {
    ...mapState('home', [
      'userInfo'
    ])
  },
  mounted () {
    this.initMenu()
  },
  methods: {
    ...mapActions('home', [
      'getGradeData',
      'getClassData'
    ]),
    // 点击节点
    select (obj, tree) {
      if (obj.length === 0) return
      const selectObj = {
        key: tree.selectedNodes[0].key,
        code: tree.selectedNodes[0].data.props.pCode,
        title: tree.selectedNodes[0].data.props.title
      }
      this.$emit('select', selectObj)
    },
    initMenu () {
      this.getGradeData({
        schoolCode: this.userInfo.schoolCode
      }).then(res => {
        this.treeData = res.data.list.map(item => {
          return {
            title: item.name,
            key: item.code,
            pCode: item.code
          }
        })
        this.onLoadData({
          dataRef: {
            pCode: res.data.list[0].code,
            key: res.data.list[0].code
          }
        })
      })
    },
    onLoadData (treeNode) {
      return new Promise((resolve) => {
        if (treeNode.dataRef.children) {
          resolve()
          return
        }
        this.getClassData({
          schoolCode: this.userInfo.schoolCode,
          gradeId: treeNode.dataRef.key
        }).then(res => {
          treeNode.dataRef.children = res.data.list.map(item => {
            return {
              title: item.className,
              key: item.id,
              pCode: item.code,
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
