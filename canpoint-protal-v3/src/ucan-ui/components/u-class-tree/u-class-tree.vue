<template>
  <div class="u-class-tree">
    <a-skeleton v-if="treeData.length == 0 && !noData" active :paragraph="{ rows: 10 }" />
    <u-empty v-if="noData" description="什么也没有~"></u-empty>
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
import $ajax from '@u/libs/ajax-serve'
export default {
  name: 'UClassTree',
  props: {
    // 判断是高职还是基教
    isHigh: {
      type: Boolean,
      default: false
    },
    // 是否只看当前学年
    isOnlyNewSchoolYear: {
      type: Boolean,
      default: false
    },
    // 是否展示班级
    isChoose: {
      type: Boolean,
      default: false
    },
    // 学校编码
    school: {
      type: String,
      default: ''
    },
    // 默认选中第一条数据
    showAllTag: {
      type: Boolean,
      default: true
    },
    // 树组件最高高度
    maxHeight: {
      type: Number,
      default: document.body.clientHeight - 80
    }
  },
  data() {
    return {
      noData: false,
      treeData: [],
      defaultSelectedKeys: []
    }
  },
  mounted() {
    this.initMenu()
  },
  methods: {
    // 点击节点
    select(obj, tree) {
      if (obj.length === 0) {
        return
      }
      if (tree.selectedNodes.length === 0) return
      const selectObj = {
        code: tree.selectedNodes[0].data.props.code.split('-')[1],
        title: tree.selectedNodes[0].data.props.title,
        className: tree.selectedNodes[0].data.props.dataRef.className,
        classCode: tree.selectedNodes[0].data.props.dataRef.classCode,
        gradeName: tree.selectedNodes[0].data.props.dataRef.gradeName,
        gradeCode: tree.selectedNodes[0].data.props.dataRef.gradeCode,
        majorName: tree.selectedNodes[0].data.props.dataRef.majorName,
        majorCode: tree.selectedNodes[0].data.props.dataRef.majorCode,
        schoolYearId: tree.selectedNodes[0].data.props.dataRef.schoolYearId,
        schoolYearName: tree.selectedNodes[0].data.props.dataRef.schoolYearName,
        schoolYearCode: tree.selectedNodes[0].data.props.dataRef.schoolYearCode
      }
      this.$emit('select', selectObj)
    },
    async initMenu() { // version 1:基教2:高教
      let selectObj = {}
      const req = {
        schoolCode: this.school
      }
      const res = await $ajax.get({
        url: `/protal_v3_11101/canpointClass/menu/first/list`,
        params: req
      })
      if (res.data.list === null || res.data.list.length === 0) {
        this.noData = true
        return
      } else {
        this.noData = false
      }
      const data = res.data.list[0]
      const flag = res.data.version === '1' // 基教
      selectObj = {
        title: flag ? data.name : data.gradeName,
        code: flag ? data.code : data.gradeCode,
        key: flag ? data.code : data.gradeCode,
        schoolYearId: data.id,
        schoolYearName: flag ? data.name : data.gradeName,
        schoolYearCode: flag ? data.code : data.schoolYearCode,
        gradeCode: flag ? '' : data.gradeCode
      }
      if (this.isOnlyNewSchoolYear) {
        this.treeData = [{
          title: flag ? data.name : data.gradeName,
          code: flag ? `${data.code}-${data.code}` : `${data.gradeCode}-${data.gradeCode}`,
          key: flag ? `${data.code}-${data.code}` : `${data.gradeCode}-${data.gradeCode}`,
          schoolYearId: data.id,
          schoolYearName: flag ? data.name : data.gradeName,
          schoolYearCode: flag ? data.code : data.schoolYearCode,
          gradeCode: flag ? '' : data.gradeCode
        }]
      } else {
        this.treeData = res.data.list.map(item => {
          return {
            title: flag ? item.name : item.gradeName,
            code: flag ? `${item.code}-${item.code}` : `${item.gradeCode}-${item.gradeCode}`,
            key: flag ? `${item.code}-${item.code}` : `${item.gradeCode}-${item.gradeCode}`,
            schoolYearId: item.id,
            schoolYearName: flag ? item.name : item.gradeName,
            schoolYearCode: flag ? item.code : item.schoolYearCode,
            gradeCode: flag ? '' : item.gradeCode
          }
        })
      }
      this.defaultSelectedKeys = [this.treeData[0].code]
      this.$emit('select', selectObj)
    },
    async onLoadData(treeNode) {
      return new Promise(resolve => {
        if (treeNode.dataRef.children) {
          resolve()
          return
        }
        const req = {
          schoolCode: this.school,
          schoolYearCode: treeNode.dataRef.schoolYearCode,
          gradeCode: treeNode.dataRef.gradeCode
        }
        $ajax
          .post({
            url: `/protal_v3_11101/canpointClass/menu/second/third/tree`,
            params: req
          })
          .then(res => {
            treeNode.dataRef.children = res.data.map(item => {
              return {
                title: item.gradeName ? item.gradeName : item.majorName,
                code: item.id ? `${treeNode.dataRef.schoolYearCode}-${item.gradeCode}` : `${treeNode.dataRef.schoolYearCode}-${item.majorCode}`,
                key: item.id ? `${treeNode.dataRef.schoolYearCode}-${item.gradeCode}` : `${treeNode.dataRef.schoolYearCode}-${item.majorCode}`,
                gradeName: item.id ? item.gradeName : treeNode.dataRef.schoolYearName,
                gradeCode: item.id ? item.gradeCode : treeNode.dataRef.gradeCode,
                majorName: item.majorName,
                majorCode: item.majorCode,
                schoolYearId: treeNode.dataRef.schoolYearId,
                schoolYearName: treeNode.dataRef.schoolYearName,
                schoolYearCode: treeNode.dataRef.schoolYearCode,
                isLeaf: this.isChoose,
                children: item.classList.map(el => {
                  return {
                    title: el.className,
                    code: el.code ? `${treeNode.dataRef.schoolYearCode}-${el.code}` : `${treeNode.dataRef.schoolYearCode}-${el.classCode}`,
                    key: el.code ? `${treeNode.dataRef.schoolYearCode}-${el.code}` : `${treeNode.dataRef.schoolYearCode}-${el.classCode}`,
                    className: el.className,
                    classCode: el.classCode,
                    gradeName: item.id ? item.gradeName : treeNode.dataRef.schoolYearName,
                    gradeCode: item.id ? item.gradeCode : treeNode.dataRef.gradeCode,
                    majorName: item.majorName,
                    majorCode: item.majorCode,
                    schoolYearId: treeNode.dataRef.schoolYearId,
                    schoolYearName: treeNode.dataRef.schoolYearName,
                    schoolYearCode: treeNode.dataRef.schoolYearCode,
                    isLeaf: true
                  }
                })
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
.u-class-tree {
  padding: 0 10px;
  width: 220px;
  overflow-y: auto;
}
</style>
