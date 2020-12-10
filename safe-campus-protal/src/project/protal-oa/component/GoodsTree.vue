<template>
  <div class="grade-tree">
    <a-skeleton v-if="treeData.length == 0 && !noData" active :paragraph="{ rows: 10 }" />
    <no-data v-if="noData" msg="暂无数据~"></no-data>
    <a-tree
      showLine
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
  name: 'GoodsTree',
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
      gradeList: [],
      defaultSelectedKeys: [],
      defaultExpandedKeys: [],
      pageList: {
        page: 1,
        size: 20
      }
    }
  },
  components: {
    NoData
  },
  computed: {
    ...mapState('home', ['schoolCode'])
  },
  mounted() {
    this.initMenu()
  },
  methods: {
    onExpand() {},
    // 点击节点
    select(obj, tree) {
      if (tree.selectedNodes.length === 0) return
      const selectObj = {
        typeName: tree.selectedNodes[0].data.props.title,
        materialTypeId: tree.selectedNodes[0].data.props.code
      }
      this.$emit('select', selectObj)
    },
    async initMenu() {
      const req = {
        schoolCode: this.schoolCode,
        ...this.pageList
      }
      $ajax
        .post({
          url: `${hostEnv.protal_api_11014}/material/type/getPage`,
          params: req
        })
        .then(res => {
          if (!res.data || res.data.list.length === 0) {
            this.gradeList = []
            return
          }
          this.gradeList = res.data.list
          $ajax
            .post({
              url: `${hostEnv.protal_api_11014}/material/name/getPage`,
              params: {
                schoolCode: this.schoolCode,
                ...this.pageList,
                typeId: this.gradeList[0].id
              }
            })
            .then(res => {
              if (res.data.list === null || res.data.list.length === 0) {
                this.treeData = this.gradeList.map(item => {
                  return {
                    title: item.typeName,
                    code: item.id,
                    key: item.id
                  }
                })
                return
              }
              const selectObj = {
                typeName: this.gradeList[0].typeName
                // materialTypeId: this.gradeList[0].id
              }
              this.defaultExpandedKeys = [this.gradeList[0].id]
              this.defaultSelectedKeys = [res.data.list[0].id]
              this.treeData = this.gradeList.map(item => {
                return {
                  title: item.typeName,
                  key: item.id,
                  id: item.id,
                  code: item.id
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
          ...this.pageList,
          schoolCode: this.schoolCode,
          typeId: treeNode.dataRef.key
        }
        $ajax
          .post({
            url: `${hostEnv.protal_api_11014}/material/name/getPage`,
            params: req
          })
          .then(res => {
            treeNode.dataRef.children = res.data.list.map(item => {
              return {
                title: item.materialName,
                key: item.typeId + '^' + item.id,
                code: item.typeId + '^' + item.id,
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
  max-height: 1000px;
  overflow-y: auto;
}
</style>
