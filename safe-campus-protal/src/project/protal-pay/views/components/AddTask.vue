<template>
  <div class="addTask page-layout qui-fx-ver">
    <a-form :form="form">
      <a-form-item label="任务名称：" v-bind="formItemLayout">
        <a-input
          v-decorator="[
            'taskName',
            { initialValue: appForm.taskName, rules: [{ required: true, message: '请填写任务名称', whitespace: true }] }
          ]"
          placeholder="请输入任务名称"
        />
      </a-form-item>
      <a-form-item label="收费截止日期" v-bind="formItemLayout">
        <a-date-picker
          format="YYYY-MM-DD"
          v-decorator="[
            'endTime',
            {
              initialValue: appForm.endTime,
              rules: [{ required: true, message: '请选择截止日期' }]
            }
          ]"
        />
      </a-form-item>
      <a-form-item label="收费项" v-bind="formItemLayout" required>
        <a-button icon="plus" class="add-btn" @click="add">添加</a-button>
        <a-table
          :bordered="true"
          :scroll-h="400"
          :columns="columns"
          :data-source="recordList"
          :pagination="false"
          class="table"
        >
          <template slot="action" slot-scope="text, record">
            <a-popconfirm placement="left" okText="确定" cancelText="取消" @confirm.stop="deleteList(record)">
              <template slot="title">您确定删除吗?</template>
              <a-tooltip placement="topLeft" title="删除">
                <a-button size="small" class="del-action-btn" icon="delete"></a-button>
              </a-tooltip>
            </a-popconfirm>
          </template>
        </a-table>
        <a-row>
          <a-col :span="2" :offset="17"> 共计：</a-col>
          <a-col :span="5">{{ this.totalMoney == '' ? '0' : this.totalMoney }}元 </a-col>
        </a-row>
        <a-row>
          <a-col :span="2" :offset="17"> 优惠 :</a-col>
          <a-col :span="5"> <a-input placeholder="输入优惠金额" v-model="amount" /> </a-col>
        </a-row>
        <a-row>
          <a-col :span="2" :offset="17"> 应收：</a-col>
          <a-col :span="5">{{ this.receivable == '' ? '0' : this.receivable }}元 </a-col>
        </a-row>
      </a-form-item>
      <a-form-item label="班级" v-bind="formItemLayout">
        <a-tree-select
          placeholder="请选择班级"
          :treeData="treeData"
          :value="value"
          :disabled="readOnlyTag"
          @change="onChange"
          treeCheckable
          :treeCheckStrictly="false"
          :treeDefaultExpandAll="false"
          labelInValue
          :loadData="onLoadData"
          :dropdownStyle="{ 'max-height': '400px', overflow: 'auto' }"
          :show-checked-strategy="SHOW_PARENT"
        />
      </a-form-item>
      <a-form-item label="收费对象" v-bind="formItemLayout">
        <div class="choose-input" @click="teacherSelect">
          <div class="p" v-if="classList.length === 0">请点击选择收费对象</div>
          <template v-for="tag in classList">
            <a-tag
              color="purple"
              @click.stop.prevent
              :key="tag.userCode"
              :closable="true"
              @close.stop="() => userClose(tag)"
              >{{ tag.userName }}</a-tag
            >
          </template>
        </div>
      </a-form-item>
      <a-form-item label="收费人数" v-bind="formItemLayout">
        <span class="ant-form-text">{{ this.grantNumber }}人</span>
      </a-form-item>
      <div class="u-type-warning-disabled" style="padding-left: 10%;">*下班时间发起收费会获得更高缴费率哦！</div>
      <a-form-item :wrapper-col="{ span: 15, offset: 3 }">
        <a-button style="margin-right:50px;" @click="cancle">取消</a-button>
        <a-button type="primary" :loading="loading" @click="handleSubmit">保存</a-button>
      </a-form-item>
    </a-form>
    <choose-student
      ref="chooseUser"
      is-check
      chooseType="pay"
      v-if="userTag"
      v-model="userTag"
      @submit="chooseUser"
      title="选择学生"
      :classList="classList"
    ></choose-student>
    <add-charge ref="addCharge" :title="title" @getList="getCharge"></add-charge>
  </div>
</template>
<script>
import moment from 'moment'
import { mapState, mapActions } from 'vuex'
import ChooseStudent from '@c/ChooseStudent'
import TableList from '@c/TableList'
import AddCharge from './AddCharge'
import { TreeSelect } from 'ant-design-vue'
const SHOW_PARENT = TreeSelect.SHOW_PARENT

const columns = [
  {
    title: '收费项',
    dataIndex: 'itemName',
    width: '20%'
  },
  {
    title: '收费标准',
    dataIndex: 'itemPrice',
    width: '20%'
  },
  {
    title: '数量',
    dataIndex: 'itemNum',
    width: '20%'
  },
  {
    title: '总金额',
    dataIndex: 'totalMoneySum',
    width: '20%'
  },
  {
    title: '操作',
    width: '20%',
    scopedSlots: {
      customRender: 'action'
    }
  }
]
export default {
  name: 'AddTask',
  components: {
    ChooseStudent,
    TableList,
    AddCharge
  },
  data() {
    return {
      moment,
      form: this.$form.createForm(this),
      appForm: {
        taskName: '',
        endTime: ''
      },
      loading: false,
      userTag: false,
      classList: [],
      recordList: [],
      columns,
      title: '新增',
      formItemLayout: {
        labelCol: { span: 2 },
        wrapperCol: { span: 10 }
      },
      totalMoney: '',
      amount: 0,
      receivable: '',
      chargeObject: {
        chargeGrades: []
      },
      getYearList: [],
      treeData: [],
      value: [],
      readOnlyTag: false,
      SHOW_PARENT,
      grantNumber: 0
    }
  },
  created() {},
  watch: {
    amount(val) {
      if (val > this.totalMoney) {
        this.$message.warning('优惠金额不能大于总金额!')
        return
      } else {
        this.receivable = this.addNum(this.totalMoney, val)
      }
    },
    recordList(val) {
      const array = []
      val.forEach(ele => {
        array.push(ele.totalMoneySum)
      })
      this.totalMoney = this.sum(array)
      this.receivable = this.totalMoney
      this.amount = ''
    },
    classList: {
      handler(newVal, oldVal) {
        this.grantNumber = newVal.length
      },
      deep: true
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  mounted() {
    this.getSchoolYearId()
    this.initMenu()
  },
  methods: {
    ...mapActions('home', [
      'addChargetask',
      'getSchoolYear',
      'getGradeList',
      'getStudentSum',
      'getTeacherSum',
      'getClassList'
    ]),
    getCharge(item) {
      this.recordList = item
    },
    sum(array) {
      var s = 0
      for (var i = array.length - 1; i >= 0; i--) {
        s += array[i]
      }
      return s
    },
    deleteList(removedTag) {
      this.recordList = this.recordList.filter(tag => tag !== removedTag)
      this.$refs.addCharge.itemVOList = this.recordList
    },
    teacherSelect() {
      this.userTag = true
    },
    userClose(removedTag) {
      this.classList = this.classList.filter(tag => tag !== removedTag)
    },
    chooseUser(values) {
      // console.log(values)
      this.$refs.chooseUser.reset()
      this.classList = values
      this.chargeObject.schoolYearId = values[0].schoolYearId
      this.chargeObject.schoolYearName = this.getYearList[0].schoolYear
      this.chargeObject.chargeGrades = values.map(el => {
        return {
          chargeClasses: [],
          gradeCode: el.gradeCode,
          gradeName: el.gradeName,
          classCode: el.classCode,
          className: el.className,
          userCode: el.userCode
        }
      })
      this.chargeObject.chargeGrades.forEach(item => {
        item.chargeClasses.push({
          classCode: item.classCode,
          className: item.className,
          userCodes: [item.userCode]
        })
      })
      console.log(this.chargeObject)
    },
    add() {
      this.title = '新增'
      this.$refs.addCharge.itemName = ''
      this.$refs.addCharge.value = ''
      this.$refs.addCharge.unitPrice = ''
      this.$refs.addCharge.totalPrice = ''
      this.$refs.addCharge.addVisible = true
    },
    // tree节点的选中
    onChange(value) {
      console.log(value)
      this.value = value
      if (value.length === 0) {
        this.grantNumber = 0
        this.grantNumber = this.classList.length
      } else {
        let studentCounts = []
        this.chargeObject.schoolYearId = this.getYearList[0].id
        this.chargeObject.schoolYearName = this.getYearList[0].schoolYear
        value.map(el => {
          const clazz = el.value.split('=')[0]
          const grade = el.value.split('=')[1]
          const cname = el.value.split('=')[2]
          const gname = el.value.split('=')[3]
          const clazzCode = clazz.split('/')[1]
          const gradeCode = grade.split('?')[1]
          const gradeName = gname.split(',')[1]
          const className = cname.split('*')[1]
          this.chargeObject.chargeGrades = []
          this.chargeObject.chargeGrades.push({
            gradeCode: gradeCode,
            gradeName: gradeName,
            chargeClasses: []
          })
          this.chargeObject.chargeGrades.forEach(ele => {
            ele.chargeClasses = []
            ele.chargeClasses.push({
              classCode: clazzCode,
              className: className,
              userCodes: []
            })
          })
          console.log(this.chargeObject)
          if (clazz.split('/')[0] === 'schoolYear') {
            studentCounts = []
          } else if (clazzCode === gradeCode) {
            studentCounts.push({
              gradeCode: gradeCode
            })
          } else {
            studentCounts.push({
              classCodes: clazzCode,
              gradeCode: gradeCode
            })
          }
        })
        const req = {
          schoolCode: this.userInfo.schoolCode,
          schoolYearId: this.schoolYear,
          studentCounts: studentCounts
        }
        this.getStudentSum(req).then(res => {
          this.grantNumber = res.data
          this.grantNumber = this.grantNumber + this.classList.length
        })
      }
    },
    async initMenu() {
      const req = {
        schoolCode: this.userInfo.schoolCode
      }
      const res = await this.getSchoolYear(req)
      if (res.data.list.length === 0) return
      this.gradeList = res.data.list.filter(item => {
        return item.semester === '下学期'
      })
      if (res.data.list[0].semester === '上学期') {
        this.gradeList.unshift({
          id: res.data.list[0].id,
          semester: res.data.list[0].semester,
          schoolYear: res.data.list[0].schoolYear,
          value: res.data.list[0].id,
          key: res.data.list[0].id
        })
      }
      this.schoolYear = this.gradeList[0].id
      this.treeData = [
        {
          title: this.gradeList[0].schoolYear + '学年',
          code: this.gradeList[0].id,
          schoolYearId: this.gradeList[0].id,
          value: 'schoolYear' + '/' + this.gradeList[0].id + '=' + this.gradeList[0].schoolYear,
          key: 'schoolYear' + '/' + this.gradeList[0].id + '=' + this.gradeList[0].schoolYear
        }
      ]
      this.defaultSelectedKeys = [this.gradeList[0].id]
      this.onLoadData({
        dataRef: {
          schoolYearId: this.treeData[0].code
        }
      })
    },
    async onLoadData(treeNode) {
      return new Promise(resolve => {
        if (treeNode.dataRef.children) {
          resolve()
          return
        }
        const req = {
          schoolCode: this.userInfo.schoolCode
        }
        this.getGradeList(req).then(res => {
          treeNode.dataRef.children = res.data.list.map(item => {
            return {
              title: item.name,
              schoolYearId: treeNode.dataRef.schoolYearId,
              isLeaf: false,
              gradeCode: item.code,
              gradeName: item.name,
              value:
                'gradeCode' +
                '/' +
                item.code +
                '=' +
                'gradeCode' +
                '?' +
                item.code +
                '=' +
                'gradeName' +
                '?' +
                item.name,
              key:
                'gradeCode' +
                '/' +
                item.code +
                '=' +
                'gradeCode' +
                '?' +
                item.code +
                '=' +
                'gradeName' +
                '*' +
                item.name
            }
          })
          treeNode.dataRef.children.forEach(item => {
            const data = {
              schoolCode: this.userInfo.schoolCode,
              schoolYearId: treeNode.dataRef.schoolYearId,
              gradeCode: item.gradeCode
            }
            this.getClassList(data).then(res => {
              item.children = res.data.list.map(ele => {
                return {
                  title: ele.className,
                  schoolYearId: item.schoolYearId,
                  gradeCode: item.gradeCode,
                  classCode: ele.classCode,
                  value:
                    'classCode' +
                    '/' +
                    ele.classCode +
                    '=' +
                    'gradeCode' +
                    '?' +
                    item.gradeCode +
                    '=' +
                    'className' +
                    '*' +
                    ele.className +
                    '=' +
                    'gradeName' +
                    ',' +
                    item.gradeName,
                  key:
                    'classCode' +
                    '/' +
                    ele.classCode +
                    '=' +
                    'gradeCode' +
                    '?' +
                    item.gradeCode +
                    '=' +
                    'className' +
                    '*' +
                    ele.className +
                    '=' +
                    'gradeName' +
                    ',' +
                    item.gradeName,
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
    // 深层递归
    newOrgData(data) {
      data.forEach(item => {
        item.children = item.orgChilds || null
        item.title = item.name
        item.key = item.code
        item.value = item.code
        if (item.orgChilds && item.orgChilds.length > 0) {
          this.newOrgData(item.orgChilds)
        }
      })
      return data
    },
    handleSubmit(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          if (this.recordList.length === 0) {
            this.$message.warning('请选择收费项!')
            return
          }
          if (this.classList.length === 0 && this.value.length === 0) {
            this.$message.warning('请选择收费对象!')
            return
          }
          values.endTime = moment(values.endTime).format('YYYY-MM-DD HH:mm:ss')
          const req = {
            schoolCode: this.userInfo.schoolCode,
            taskName: values.taskName,
            itemVOList: this.recordList,
            cutOffTime: values.endTime,
            createUserCode: this.userInfo.userCode,
            createUserName: this.userInfo.userName,
            preMoney: this.amount,
            taskMoney: this.totalMoney,
            chargeObject: this.chargeObject
          }
          this.addChargetask(req).then(res => {
            this.$message.success('添加成功')
            this.$tools.goNext(() => {
              this.$router.push({
                path: '/chargingTask'
              })
            })
          })
        }
      })
    },
    cancle() {
      this.$router.push({
        path: '/chargingTask'
      })
    },
    addNum(num1, num2) {
      let sq1, sq2, multiple
      try {
        sq1 = num1.toString().split('.')[1].length
      } catch (e) {
        sq1 = 0
      }
      try {
        sq2 = num2.toString().split('.')[1].length
      } catch (e) {
        sq2 = 0
      }
      multiple = Math.pow(10, Math.max(sq1, sq2) + 1)
      return (num1 * multiple - num2 * multiple) / multiple
    },
    async getSchoolYearId() {
      const req = {
        schoolCode: this.userInfo.schoolCode
      }
      const res = await this.getSchoolYear(req)
      this.getYearList = res.data.list
    }
  }
}
</script>
<style lang="less" scoped>
.addTask {
  background: #fff;
  padding-top: 20px;
  overflow: auto;
  .table {
    max-height: 300px;
    overflow: auto;
  }
}
.choose-input {
  border: 1px solid @bor-color;
  border-radius: @radius;
  width: 100%;
  min-height: 32px;
  line-height: 32px;
  padding: 0 10px;
  .p {
    height: 30px;
    line-height: 30px;
    color: @dark-color;
  }
}
</style>
