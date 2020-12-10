<template>
  <div class="page-layout GradeRule qui-fx-ver u-padd-20">
    <div class="content pos-box">
      <div class="u-mar-b10">学校名称：{{ schoolName }}   系统得分：{{ totalSysGrade }}    最终得分：{{ ultimateGrade }} 绩效排名：第{{ rank }}名</div>
      <a-table :pagination="false" rowKey="gradeId" :columns="columns" :data-source="tableData" bordered>
        <template slot="ruleStatement" slot-scope="record">
          <span >{{ record.ruleStatement }}</span>
        </template>
      </a-table>
      <div class="form-box u-mar-t20">
        <a-form-model
          ref="ruleForm"
          :model="form"
          :rules="rules"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-form-model-item ref="name" label="教育局加/减分" prop="name">
            <div class="row1">
              <a-button type="primary" @click="addRow" class="u-mar-r20">新增加/减分</a-button>
              <span class="u-mar-r20" style="color:red">说明：每一项加(减分范围-20至20)</span>
              <!-- <span style="color:green">已{{ getMinute }}分</span> -->
            </div>
            <div
              class="add-row row2 u-fx u-fx-ac"
              v-for="(item,index) in addRowList"
              :key="index">
              <div class="select">
                <a-select
                  style="width:150px"
                  @change="value=>changeChenck1(value,index)"
                  placeholder="请选择指标类型">
                  <a-select-option
                    v-for="(item1,index1) in itemTypeList"
                    :key="index1"
                    :value="item1">
                    {{ item1 }}
                  </a-select-option>
                </a-select>
              </div>
              <div class="select u-mar-l20">
                <a-select
                  @change="value=>changeChenck2(value,index,item.check2options)"
                  style="width:180px"
                  placeholder="请选择具体细则">
                  <a-select-option
                    v-for="(item2,index2) in item.check2options"
                    :key="index2"
                    :value="item2.gradeId">
                    {{ item2.specificContent }}
                  </a-select-option>
                </a-select>
              </div>
              <span v-if="item.checkObj&&Object.keys(item.checkObj).length>0" class="bg-span u-bg-color">{{ item.checkObj.ruleStatement }}</span>
              <span v-else class="bg-span u-bg-color">选择筛选条件后，自动显示计分规则</span>
              <span class="bg-span u-bg-color">系统得分：{{ item.checkObj.sysGrade ||0 }}分</span>
              <span class="bg-span u-bg-color" style="color:red">已加/减：{{ item.checkObj.changeGrade || 0 }}分</span>
              <a-input-number
                :disabled="!item.checkObj.gradeId"
                :formatter="value=>(value+'').replace(/\./g, '')"
                :parser="value=>value.replace(/\./g, '')"
                @change="value=>changeNumber(value,index)"
                v-model.number="item.addfen"
                :max="Math.sign(item.checkObj.changeGrade)===1?20-item.checkObj.changeGrade:20+Math.abs(item.checkObj.changeGrade)"
                :min="Math.sign(item.checkObj.changeGrade)===1?-20-item.checkObj.changeGrade:-20+Math.abs(item.checkObj.changeGrade)"
                style="width:100px" />
              <a-input-number id="inputNumber" v-model="value" :min="0" />
              <!-- :formatter="value=>(value+'').replace(/^(0+)|[^\d]+/g, '')" -->
              <span @click="delRow" class="u-mar-l20" style="color:red">删除</span>
            </div>
          </a-form-model-item>
          <a-form-model-item label="加/减分说明" :wrapper-col="wrapperCol14" prop="des">
            <a-textarea placeholder="非必填项" v-model="form.des" :rows="3" />
          </a-form-model-item>
          <a-form-model-item label="加减分记录：" prop="date1">
            <span class="u-type-primary" @click="stepDetail">查看详情</span>
            <a-timeline>
              <a-timeline-item v-for="(item,index) in operations" :key="index">
                {{ item.operatedTime |gmtToDate }} 操作人：{{ item.operatorName }}
                <p v-for="(item1,index1) in item.itemList" :key="index1">{{ item1.itemType }}--{{ item1.specificContent }}---{{ item1.changeGrade }}分</p>
              </a-timeline-item>
            </a-timeline>
          </a-form-model-item>
          <a-form-model-item :wrapper-col="{ span: 14, offset: 4 }">
            <a-button type="primary" @click="onSubmit">
              确定
            </a-button>
            <a-button style="margin-left: 10px;">
              取消
            </a-button>
          </a-form-model-item>
        </a-form-model>
      </div>
    </div>
    <step-detail ref="stepstatus" :operations="operations" v-model="stepstatus"></step-detail>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import StepDetail from './StepDetail'
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
    title: '系统得分',
    align: 'center',
    dataIndex: 'sysGrade'
  }
]
export default {
  name: 'AssessDetail',
  components: {
    StepDetail
  },
  data() {
    return {
      value: 3,
      schoolName: this.$route.query.schoolName,
      rank: this.$route.query.rank,
      addRowList: [
        { addfen: 0, checkObj: {}, check2options: [] }
      ],
      rowrules: [],
      itemTypeList: [], // 指标类型基础数据
      ultimateGrade: '', // 最终得分
      totalSysGrade: '', // 系统得分
      tableData: [],
      columns,
      stepstatus: false, // 加减分记录详情
      operations: [], //	操作流水数据
      // 表单
      doneMinute: -10, // 已加减分
      operaMinute: 0, // 操作分
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },
      wrapperCol14: { span: 14 },
      other: '',
      form: {
        des: undefined
      },
      rules: {
        des: [{ required: false, message: '', trigger: 'change' }]
      }
    }
  },
  computed: {
    ...mapState('home', ['userInfo', 'eduCode']),
    getMinute() {
      if (this.doneMinute + this.operaMinute < -20) {
        this.$message.error('加/减分不能小于-20')
      } else if (this.doneMinute + this.operaMinute > 20) {
        this.$message.error('加/减分不能大于20')
      }
      return this.doneMinute + this.operaMinute
    }
  },
  created() {
    this.schoolCode = this.$route.query.schoolCode
    this.month = this.$route.query.month
    this.year = this.$route.query.year
    this.ultimateGrade = this.$route.query.ultimateGrade
    this.showList()
  },
  methods: {
    ...mapActions('home', ['GradeDetail', 'GradeOperation']),
    addRow() {
      this.addRowList.push({ addfen: 0, checkObj: {}, check2options: [] })
    },
    // 选择指标类型
    changeChenck1(value, index) {
      if (value) {
        const checkObj = this.treeRules.find(v => v.itemType === value)
        this.$set(this.addRowList[index], 'itemType', checkObj.itemType)
        this.$set(this.addRowList[index], 'check2options', checkObj.ruleList)
      } else {
        this.addRowList[index].check2options = []
      }
    },
    // 选择指具体细则
    changeChenck2(value, index, check2options) {
      if (value) {
        const checkObj = check2options.find(v => v.gradeId === value)
        this.$set(this.addRowList[index], 'checkObj', checkObj)
      } else {
        this.addRowList[index].checkObj = {}
      }
    },
    // 加减分
    changeNumber() {
      this.operaMinute = this.addRowList.map(v => v.addfen).reduce((a, b) => a + b, 0)
    },
    delRow(index) {
      this.addRowList.splice(index, 1)
      this.changeNumber()
    },
    async onSubmit() {
      if (this.addRowList.length === 0) return this.$message.error('请完善加/减分项1')
      const isGradeIdRows = this.addRowList.filter(v => v.addfen && v.checkObj.gradeId)
      if (isGradeIdRows.length === 0) return this.$message.error('请完善加/减分项2')
      console.log(isGradeIdRows)
      const itemList = isGradeIdRows.map(el => {
        return {
          changeGrade: el.addfen,
          itemType: el.itemType,
          gradeId: el.checkObj.gradeId,
          ruleStatement: el.checkObj.ruleStatement,
          specificContent: el.checkObj.specificContent,
          sysGrade: el.checkObj.sysGrade
        }
      })
      const req = {
        itemList: itemList,
        operatorCode: this.userInfo.userCode,
        operatorName: this.userInfo.userName,
        remark: this.form.des,
        schoolCode: this.schoolCode
      }
      await this.GradeOperation(req)
      this.$message.success('操作成功')
      this.$router.go(0)
    },
    resetForm() {
      this.$refs.ruleForm.resetFields()
    },
    async showList() {
      const req = {
        eduCode: this.userInfo.schoolCode,
        month: Number(this.month),
        schoolCode: this.schoolCode,
        year: Number(this.year)
      }
      const res = await this.GradeDetail(req)
      const { operations, rules, totalSysGrade } = res.data
      this.operations = operations
      this.totalSysGrade = totalSysGrade
      this.itemTypeList = rules.map(v => v.itemType)
      const tableArr = []
      const treeRules = []
      rules.forEach((el1, infex1) => {
        const Obj = {
          itemType: el1.itemType,
          ruleList: []
        }
        el1.descriptionList.forEach((el2, index2) => {
          el2.ruleList.forEach((el3, index3) => {
            Obj.ruleList.push(el3)
            tableArr.push({
              ...el3,
              itemDescription: el2.itemDescription,
              itemType: el1.itemType
            })
          })
        })
        treeRules.push(Obj)
      })
      this.treeRules = treeRules
      this.tableData = tableArr
    },
    stepDetail() {
      this.stepstatus = true
    }
  }
}
</script>
<style lang="less" scoped>
@deep: ~'>>>';
.GradeRule{
    height: calc(100% - 10px);
    overflow-y: scroll;
    @{deep} .ant-table-bordered .ant-table-thead > tr > th{
      background-color: #f4f4f5;
    }
    @{deep} .ant-table-tbody > tr > td{
      padding: 5px 14px;
    }
    .form-box{
      .row2{
        .bg-span{
          margin: 5px ;
          padding-left: 6px;
          padding-right: 6px;
          height: 31px;
          display: flex;
          align-items: center;
          // overflow: hidden;
        }
      }
    }

}

</style>
