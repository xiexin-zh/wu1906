<template>
  <div class="major-tree">
    <a-skeleton v-if="treeData.length == 0 && !noData" active :paragraph="{ rows: 10 }" />
    <no-data v-if="noData" msg="暂无数据~"></no-data>
    <a-tree
      :style="{ maxHeight: maxHeight + 'px' }"
      v-if="treeData.length > 0"
      @select="select"
      :treeData="treeData"
      :defaultSelectedKeys="defaultSelectedKeys"
      defaultExpandAll
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
    },
    isClass: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      noData: false,
      treeData: [],
      defaultSelectedKeys: [],
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
      if (tree.selectedNodes.length === 0) return
      const selectObj = {
        schoolYearId: JSON.parse(window.sessionStorage.getItem('schoolYear')).schoolYearId,
        schoolYear: JSON.parse(window.sessionStorage.getItem('schoolYear')).schoolYearName,
        title: tree.selectedNodes[0].data.props.title,
        code: tree.selectedNodes[0].data.props.code,
        gradeName: tree.selectedNodes[0].data.props.gradeName,
        gradeCode: tree.selectedNodes[0].data.props.gradeCode,
        subjectCode: tree.selectedNodes[0].data.props.subjectCode,
        subjectName: tree.selectedNodes[0].data.props.subjectName,
        classCode: tree.selectedNodes[0].data.props.classCode,
        clazzName: tree.selectedNodes[0].data.props.clazzName
      }
      console.log(selectObj)
      this.$emit('select', selectObj)
    },
    // 获取节点数据
    async initMenu() {
      const req = {
        schoolCode: this.school ? this.school : this.schoolCode
      }
      const res = await $ajax.get({
        url: `${hostEnv.protal_api_8092}/class/manage/node`,
        params: req
      })
      if (res.data === null || res.data.length === 0) {
        this.noData = true
        return
      } else {
        this.noData = false
      }
      const selectObj = {
        schoolYearId: JSON.parse(window.sessionStorage.getItem('schoolYear')).schoolYearId,
        schoolYear: JSON.parse(window.sessionStorage.getItem('schoolYear')).schoolYearName,
        title: this.isClass ? res.data[0].subjectNodeDtos[0].classNodeDtos[0].className : res.data[0].gradeName,
        code: this.isClass ? res.data[0].subjectNodeDtos[0].classNodeDtos[0].classCode : res.data[0].gradeCode,
        key: this.isClass ? res.data[0].subjectNodeDtos[0].classNodeDtos[0].classCode : res.data[0].gradeCode,
        gradeName: res.data[0].gradeName,
        gradeCode: res.data[0].gradeCode,
        subjectCode: this.isClass ? res.data[0].subjectNodeDtos[0].subjectCode : '',
        subjectName: this.isClass ? res.data[0].subjectNodeDtos[0].subjectName : '',
        classCode: this.isClass ? res.data[0].subjectNodeDtos[0].classNodeDtos[0].classCode : '',
        clazzName: this.isClass ? res.data[0].subjectNodeDtos[0].classNodeDtos[0].className : ''
      }
      this.defaultSelectedKeys = this.isClass ? [res.data[0].subjectNodeDtos[0].classNodeDtos[0].classCode] : [res.data[0].gradeCode]
      this.treeData = res.data.map(item => {
        return {
          title: item.gradeName + '级',
          code: item.gradeCode,
          key: item.gradeCode,
          children: item.subjectNodeDtos ? this.filterSub(item.subjectNodeDtos) : [],
          ...item
        }
      })
      console.log('this.defaultSelectedKeys', this.defaultSelectedKeys)
      this.$emit('select', selectObj)
    },
    // 处理专业节点
    filterSub(data) {
      const newData = data.map(el => {
        return {
          title: el.subjectName,
          code: el.subjectCode,
          key: `${el.gradeName}-${el.subjectCode}`,
          ...el,
          children:
            el.classNodeDtos && this.isClass
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
          clazzName: el.className,
          title: el.className,
          code: el.classCode,
          key: el.classCode,
          ...el
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
