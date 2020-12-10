<template>
  <div class="page-layout GradeRule qui-fx-ver u-padd-20">
    <div class="u-mar-b10">评分规则修改后，将影响学校的绩效考核统计，请谨慎操作!</div>
    <a-table :pagination="false" rowKey="ruleId" :columns="columns" :data-source="tableData" bordered>
      <template slot="ruleStatement" slot-scope="record">
        <span @click="ruleEidt(record)" class="u-type-primary">{{ record.ruleStatement }}</span>
      </template>
    </a-table>
    <rule-eidt ref="ruleEidt" v-model="ruleStatu"></rule-eidt>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import RuleEidt from './RuleEidt'

const columns = [
  {
    title: '指标类型',
    align: 'center',
    dataIndex: 'itemType',
    customRender: (value, row, index) => {
      const obj = {
        children: value,
        attrs: {}
      }
      // 基础建设
      if (index === 0) {
        obj.attrs.rowSpan = 3
      }
      if (index === 1 || index === 2) {
        obj.attrs.colSpan = 0
      }
      // 安全管理
      if (index === 3) {
        obj.attrs.rowSpan = 11
      }
      if (index === 4 || index === 5 || index === 6 ||
           index === 7 || index === 8 || index === 9 || index === 10 ||
          index === 11 || index === 12 || index === 13) {
        obj.attrs.colSpan = 0
      }
      // 主动防御
      if (index === 15) {
        obj.attrs.rowSpan = 4
      }
      if (index === 16 || index === 17 || index === 18) {
        obj.attrs.colSpan = 0
      }
      return obj
    }
  },
  {
    title: '指标描述',
    align: 'center',
    dataIndex: 'itemDescription',
    customRender: (value, row, index) => {
      const obj = {
        children: value,
        attrs: {}
      }
      // 安全档案建设
      if (index === 0) {
        obj.attrs.rowSpan = 3
      }
      if (index === 1 || index === 2) {
        obj.attrs.colSpan = 0
      }
      // 日常巡查
      if (index === 3) {
        obj.attrs.rowSpan = 2
      }
      if (index === 4) {
        obj.attrs.colSpan = 0
      }
      // 隐患管理
      if (index === 5) {
        obj.attrs.rowSpan = 4
      }
      if (index === 6 || index === 7 || index === 8) {
        obj.attrs.colSpan = 0
      }
      // 任务下发
      if (index === 10) {
        obj.attrs.rowSpan = 2
      }
      if (index === 11) {
        obj.attrs.colSpan = 0
      }
      // 安全演练
      if (index === 12) {
        obj.attrs.rowSpan = 2
      }
      if (index === 13) {
        obj.attrs.colSpan = 0
      }
      // 双重预防
      if (index === 15) {
        obj.attrs.rowSpan = 4
      }
      if (index === 16 || index === 17 || index === 18) {
        obj.attrs.colSpan = 0
      }
      return obj
    }
  },
  {
    title: '具体细则',
    align: 'center',
    dataIndex: 'specificContent'
  },
  {
    title: '计分规则',
    align: 'center',
    scopedSlots: {
      customRender: 'ruleStatement'
    }
  },
  {
    title: '最高分值',
    align: 'center',
    dataIndex: 'highestGrade'
  }
]
export default {
  name: 'GradeRule',
  components: {
    RuleEidt
  },
  data() {
    return {
      ruleStatu: false,
      tableData: [],
      columns,
      tableList: []
    }
  },
  computed: {
    ...mapState('home', ['userInfo', 'eduCode'])
  },
  mounted() {
    this.showList()
  },
  methods: {
    ...mapActions('home', ['gradeList']),
    async showList() {
      const res = await this.gradeList(this.userInfo.schoolCode)
      const arr = []
      res.data.forEach((el1, infex1) => {
        el1.descriptionList.forEach((el2, index2) => {
          el2.ruleList.forEach((el3, index3) => {
            arr.push({
              ...el3,
              itemDescription: el2.itemDescription,
              itemType: el1.itemType
            })
          })
        })
      })
      this.tableData = arr
    },
    // 修改规则弹框
    ruleEidt(record) {
      this.ruleStatu = true
      this.$refs.ruleEidt.setData(record)
    }
  }
}
</script>
<style lang="less" scoped>
@deep: ~'>>>';
.GradeRule{
    @{deep} .ant-table-bordered .ant-table-thead > tr > th{
    background-color: #f4f4f5;
  }
    @{deep} .ant-table-tbody > tr > td{
      padding: 5px 14px;
  }
}

</style>
