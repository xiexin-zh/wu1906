<template>
  <a-modal
    :title="title"
    v-model="addVisible"
    :destroyOnClose="true"
    :maskClosable="false"
    width="840px"
    @ok="addSubmit"
    :okButtonProps="{ props: { disabled: isLoad } }"
    :cancel-button-props="{ props: { disabled: isView } }"
  >
    <a-form :form="form">
      <a-form-item label="收费项" v-bind="formItemLayout" required>
        <table-list isZoom :columns="columns" :table-list="recordList"> </table-list>
        <a-row>
          <a-col :span="2" :offset="17"> 共计：</a-col>
          <a-col :span="5">{{ this.totalMoney == '' ? '0' : this.totalMoney }}元 </a-col>
        </a-row>
        <a-row>
          <a-col :span="2" :offset="17"> 优惠 :</a-col>
          <a-col :span="5">
            <a-input placeholder="输入优惠金额" v-model="amount" />
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="2" :offset="17"> 应收：</a-col>
          <a-col :span="5">{{ this.receivable == '' ? '0' : this.receivable }}元 </a-col>
        </a-row>
      </a-form-item>
      <a-form-item label="收费对象" v-bind="formItemLayout" required>
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
  </a-modal>
</template>
<script>
import { InputNumber } from 'ant-design-vue'
import moment from 'moment'
import { mapState, mapActions } from 'vuex'
import ChooseStudent from '@c/ChooseStudent'
import TableList from '@c/TableList'
const columns = [
  {
    title: '序号',
    width: '20%',
    scopedSlots: {
      customRender: 'index'
    }
  },
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
    dataIndex: 'moneySum',
    width: '20%'
  }
]
export default {
  name: 'SubForm',
  components: {
    ChooseStudent,
    TableList
  },
  data() {
    return {
      moment,
      form: this.$form.createForm(this),
      loading: false,
      userTag: false,
      classList: [],
      recordList: [],
      columns,
      formItemLayout: {
        labelCol: { span: 3 },
        wrapperCol: { span: 21 }
      },
      totalMoney: '',
      amount: 0,
      receivable: '',
      chargeObject: {
        chargeGrades: []
      },
      addVisible: false,
      isView: false,
      isLoad: false,
      detailList: {},
      getYearList: []
    }
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    popTaskCode: {
      type: String,
      default: ''
    },
    popTaskId: {
      type: Number,
      default: 0
    }
  },
  created() {},
  watch: {
    amount(val) {
      if (Number(val) > Number(this.totalMoney)) {
        this.$message.warning('优惠金额不能大于总金额!')
        return
      }
      this.receivable = this.addNum(this.totalMoney, val)
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  mounted() {
    this.init()
    this.getSchoolYearId()
  },
  methods: {
    ...mapActions('home', ['getCharge', 'addBillInfo', 'getchargeTaskInfo', 'getSchoolYear']),
    async init() {
      const res = await this.getCharge(this.popTaskCode)
      const tas = await this.getchargeTaskInfo(this.popTaskId)
      this.detailList = tas.data
      this.recordList = res.data
      const array = []
      this.recordList.forEach(ele => {
        array.push(ele.moneySum)
      })
      this.totalMoney = this.sum(array)
    },
    sum(array) {
      return eval(array.join('+'))
    },
    teacherSelect() {
      this.userTag = true
    },
    userClose(removedTag) {
      this.classList = this.classList.filter(tag => tag !== removedTag)
    },
    chooseUser(values) {
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
    },
    async getSchoolYearId() {
      const req = {
        schoolCode: this.userInfo.schoolCode
      }
      const res = await this.getSchoolYear(req)
      this.getYearList = res.data.list
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
    addSubmit(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          if (this.recordList.length === 0) {
            this.$message.warning('请选择收费项!')
            return
          }
          if (this.classList.length === 0) {
            this.$message.warning('请选择收费对象!')
            return
          }
          const req = {
            schoolCode: this.userInfo.schoolCode,
            preMoney: this.amount,
            taskCode: this.detailList.taskCode,
            taskName: this.detailList.billMoneySum,
            taskMoney: this.totalMoney,
            itemVOList: this.recordList,
            chargeObject: this.chargeObject,
            cutOffTime: this.detailList.cutOffTime
          }
          this.addBillInfo(req).then(res => {
            this.$message.success('添加成功')
            this.addVisible = false
            this.isLoad = false
            this.$tools.goNext(() => {
              this.$emit('update')
            })
          })
        }
      })
    },
    cancle() {
      this.$router.push({
        path: '/chargingTask'
      })
    }
  }
}
</script>
<style lang="less" scoped>
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
.addTask {
  background: #fff;
  padding-top: 20px;
  overflow: auto;
}
</style>
