<template>
  <div class="course-system">
    <div class="table-list">
      <table-list isBorder :table-list="dataList" :columns="columns"></table-list>
    </div>
  </div>
</template>

<script>
import Tools from '@/utils/tools'
import TableList from '../../../component/TableList'
import { mapState, mapActions } from 'vuex'
const columns = [
  {
    title: '课程类别',
    dataIndex: 'courseTypeStr',
    key: 'courseTypeStr',
    width: 100,
    align: 'center',
    customRender: (value, row, index) => {
      const { indexArr } = row
      const obj = {
        children: value,
        attrs: {}
      }
      indexArr.forEach((item) => {
        if (index !== item) {
          obj.attrs.rowSpan = 0
        }
      })
      indexArr.forEach((item, i) => {
        if (index === item) {
          if (i < indexArr.length) {
            obj.attrs.rowSpan = indexArr[i + 1] - indexArr[i]
          }
        }
      })
      return obj
    }
  },
  {
    title: '序号',
    dataIndex: 'number',
    key: 'number',
    width: 70,
    align: 'center'
  },
  {
    title: '课程名称',
    dataIndex: 'subjectName',
    key: 'subjectName',
    width: 100,
    align: 'center'
  },
  {
    title: '课时',
    dataIndex: 'totalNum',
    key: 'totalNum',
    width: 70,
    align: 'center'
  },
  {
    title: '周学时安排',
    dataIndex: 'semester',
    key: 'semester',
    align: 'center',
    children: []
  },
  {
    title: '占课时总比例',
    dataIndex: 'ratio',
    key: 'ratio',
    width: 100,
    align: 'center',
    customRender: (value, row, index) => {
      const { indexArr } = row
      const obj = {
        children: value,
        attrs: {}
      }
      indexArr.forEach((item) => {
        if (index !== item) {
          obj.attrs.rowSpan = 0
        }
      })
      indexArr.forEach((item, i) => {
        if (index === item) {
          if (i < indexArr.length) {
            obj.attrs.rowSpan = indexArr[i + 1] - indexArr[i]
          }
        }
      })
      return obj
    }
  }
]
export default {
  name: 'PlanProcess',
  components: {
    TableList
  },
  props: {
    yearCount: {
      type: Number,
      default: 0
    },
    courseList: {
      type: Array,
      default: () => []
    },
    programId: {
      required: true
    }
  },
  data() {
    return {
      dataList: [],
      columns
    }
  },
  watch: {
    courseList(newList) {
      const list = []
      newList.forEach((item, index) => {
        item.subjectList.forEach((el, i) => {
          const obj = {
            number: el.subjectName === '合计' ? '合计' : i + 1,
            courseType: item.courseType,
            courseTypeStr: item.courseTypeStr,
            ratio: item.ratio,
            id: `${item.courseType}-${i}`,
            subjectName: el.subjectName === '合计' ? '' : el.subjectName,
            activityName: el.activityName,
            subjectType: el.subjectType,
            testType: el.testType,
            numList: el.numList,
            totalNum: el.totalNum
          }
          list.push(obj)
        })
      })
      const arrSingle = Array.from(new Set(list.map((item) => item.courseType)))
      const typeArr = list.map((item) => item.courseType)
      let indexArr = [0]
      arrSingle.forEach((item) => {
        const res = this.searchRange(typeArr, item)
        if (res[0] === -1 || res[1] === -1) {
          return
        }
        indexArr.push(res[1] + 1)
      })
      this.dataList = list.map((item) => {
        return {
          ...item,
          ...item.numList,
          indexArr
        }
      })
    }
  },
  created() {
    if (this.yearCount > 0) {
      const children = []
      for (let i = 0; i < this.yearCount * 2; i++) {
        const obj = {
          title: `第${Tools.getLargeNumber(i + 1)}学期`,
          dataIndex: `item${i + 1}`,
          align: 'center'
        }
        children.push(obj)
      }
      this.columns[4].children = children
    }
  },
  mounted() {
  },
  methods: {
    searchRange(nums, target) {
      var targetRange = [-1, -1]
      for (let i = nums.length - 1; i >= 0; i--) {
        if (nums[i] == target) {
          targetRange[0] = i
        }
      }
      if (targetRange[0] == -1) {
        return targetRange
      }
      for (let j = 0; j < nums.length; j++) {
        if (nums[j] == target) {
          targetRange[1] = j
        }
      }
      return targetRange
    }
  }
}
</script>

<style lang="less" scoped>
.course-system {
  padding: 20px;
  box-sizing: border-box;
}
</style>