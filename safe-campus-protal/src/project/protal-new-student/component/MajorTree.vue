<template>
  <div class="major-tree">
    <a-skeleton v-if="treeData.length == 0 && !noData" active :paragraph="{ rows: 10 }" />
    <no-data v-if="noData" msg="暂无数据~"></no-data>
    <a-tree
      :style="{ maxHeight: maxHeight + 'px' }"
      v-if="treeData.length > 0"
      @select="select"
      :treeData="treeData"
      :load-data="onLoadData"
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
  name: 'MajorTree',
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
      if (tree.selectedNodes.length === 0) return
      const selectObj = {
        title: tree.selectedNodes[0].data.props.title,
        code: tree.selectedNodes[0].data.props.code,
        gradeName: tree.selectedNodes[0].data.props.gradeName,
        gradeCode: tree.selectedNodes[0].data.props.gradeCode,
        subjectCode: tree.selectedNodes[0].data.props.subjectCode,
        classCode: tree.selectedNodes[0].data.props.classCode
      }
      this.$emit('select', selectObj)
    },
    // 获取节点数据
    async initMenu() {
      const req = {
        schoolCode: this.schoolCode,
        page: 1,
        size: 9999
      }
      const res = await $ajax.post({
        url: `${hostEnv.protal_api_8092}/school/year/manage/list`,
        params: req
      })
      if (res.data.records === null || res.data.records.length === 0) {
        this.noData = true
        return
      } else {
        this.noData = false
      }
      const newRes = new Map()
      const gradeList = res.data.records
        .reverse()
        .filter(item => !newRes.has(item.schoolYearCode) && newRes.set(item.schoolYearCode, 1))
      const selectObj = {
        title: gradeList[0].schoolYearName.substr(0, 4) + '级',
        code: gradeList[0].schoolYearCode,
        key: gradeList[0].schoolYearCode,
        gradeName: Number(gradeList[0].schoolYearName.substr(0, 4)),
        gradeCode: gradeList[0].schoolYearCode,
        subjectCode: '',
        classCode: ''
      }
      this.defaultSelectedKeys = [gradeList[0].schoolYearCode]
      this.treeData = gradeList.map(item => {
        return {
          gradeName: Number(item.schoolYearName.substr(0, 4)),
          gradeCode: item.schoolYearCode,
          subjectCode: '',
          classCode: '',
          title: item.schoolYearName.substr(0, 4) + '级',
          code: item.schoolYearCode,
          key: item.schoolYearCode
        }
      })
      this.$emit('select', selectObj)
    },
    // 加载子节点
    onLoadData(treeNode) {
      return new Promise(resolve => {
        if (treeNode.dataRef.children) {
          resolve()
          return
        }
        const gradeName = treeNode.$vnode.data.props.gradeName
        const gradeCode = treeNode.$vnode.data.props.gradeCode
        const req = {
          gradeName: gradeName,
          schoolCode: this.school ? this.school : this.schoolCode
        }
        $ajax
          .get({
            url: `${hostEnv.protal_api_8092}/class/manage/query/subject/by/grade`,
            params: req
          })
          .then(res => {
            treeNode.dataRef.children = res.data.map(item => {
              return {
                gradeName: gradeName,
                gradeCode: gradeCode,
                subjectCode: item.subjectCode,
                classCode: item.classCode,
                title: item.subjectName,
                code: item.subjectCode,
                key: gradeCode + '_' + item.subjectCode,
                isLeaf: this.isChoose
              }
            })
            treeNode.dataRef.children.forEach(item => {
              const data = {
                schoolCode: this.schoolCode,
                gradeName: gradeName,
                subjectCode: item.subjectCode
              }
              $ajax
                .get({
                  url: `${hostEnv.protal_api_8092}/class/manage/query/class/by/subject`,
                  params: data
                })
                .then(clas => {
                  item.children = clas.data.map(ele => {
                    return {
                      gradeName: gradeName,
                      gradeCode: gradeCode,
                      subjectCode: item.subjectCode,
                      classCode: ele.classCode,
                      title: ele.className,
                      code: ele.classCode,
                      key: gradeCode + '_' + item.subjectCode + '_' + ele.classCode,
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
    },
    // 处理专业节点
    filterSub(data) {
      const newData = data.map(el => {
        return {
          gradeName: el.gradeName,
          gradeCode: el.gradeCode,
          subjectCode: el.subjectCode,
          classCode: '',
          title: el.subjectName,
          code: el.subjectCode,
          key: `${el.gradeName}-${el.subjectCode}`,
          children: el.classNodeDtos
            ? this.filterClass(el.classNodeDtos, el.gradeCode, el.gradeName, el.subjectCode)
            : []
        }
      })
      return newData
    },
    // 处理班级节点
    filterClass(data, gradeCode, gradeName, subjectCode) {
      const newData = data.map(el => {
        return {
          gradeName: gradeName,
          gradeCode: gradeCode,
          subjectCode: subjectCode,
          classCode: el.classCode,
          title: el.className,
          code: el.classCode,
          key: el.classCode
        }
      })
      return newData
    }
  }
}
</script>

<style lang="less" scoed>
.major-tree {
  padding: 0 10px;
  width: 220px;
  overflow-y: auto;
}
</style>
