
<template>
  <a-modal
    title="添加补助"
    v-model="visible"
    :destroyOnClose="true"
    :maskClosable="false"
    width="800px"
    @ok="addExamSubmit"
    okText="确定"
    :okButtonProps="{ props: {disabled: isLoad} }">
    <a-form :form="form">
      <a-form-item label="规则名称" v-bind="formItemLayout">
        <a-input
          v-decorator="[
            'subsidyName',
            {initialValue: cardInfo.subsidyName, rules: [{ required: true, message: '请输入规则名称' }]}
          ]"
          placeholder="请输入规则名称"
        />
      </a-form-item>
      <a-form-item label="发放对象" v-bind="formItemLayout">
        <a-radio-group
          @change="change"
          v-decorator="[
            'userType',
            {
              initialValue: cardInfo.userType,
              rules: [{ required: true, message: '请选择发放对象' }]
            }
          ]"
        >
          <a-radio value="4">教职工</a-radio>
          <a-radio value="8">学生</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="组织" v-bind="formItemLayout" v-if="defaultRadio === '4'">
        <a-tree-select
          placeholder="请选择组织机构"
          :treeData="treeData"
          :value="value"
          @change="onChange"
          treeCheckable
          :treeCheckStrictly="false"
          :treeDefaultExpandAll="false"
          labelInValue
          :dropdownStyle="{'max-height': '400px', 'overflow': 'auto'}"
          :show-checked-strategy="SHOW_PARENT"
        />
      </a-form-item>
      <a-form-item label="班级" v-bind="formItemLayout" v-if="defaultRadio === '8'">
        <a-tree-select
          placeholder="请选择班级"
          :treeData="treeData"
          :value="value"
          @change="onChange"
          treeCheckable
          :treeCheckStrictly="false"
          :treeDefaultExpandAll="false"
          labelInValue
          :loadData="onLoadData"
          :dropdownStyle="{'max-height': '400px', 'overflow': 'auto'}"
          :show-checked-strategy="SHOW_PARENT"
        />
      </a-form-item>
      <a-form-item label="人员" v-bind="formItemLayout">
        <div>
          <template v-for="tag in classList">
            <a-tag :key="tag.id" :closable="true" :afterClose="() => classClose(tag)">
              {{ tag.userName }}
            </a-tag>
          </template>
          <a-tag @click="add" style="background: #fff; borderStyle: dashed;">
            <a-icon type="plus" />添加
          </a-tag>
        </div>
      </a-form-item>
      <a-form-item label="发放人数" v-bind="formItemLayout">
        <a-input
          disabled
          v-decorator="[
            'grantNumber',
            {
              initialValue: cardInfo.grantNumber
            }
          ]"
        />
      </a-form-item>
      <a-form-item label="每人发放金额" v-bind="formItemLayout">
        <a-input-number
          :min="1"
          :max="999999999"
          @change="inputChange"
          v-decorator="[
            'grantBalance',
            {initialValue: cardInfo.grantBalance, rules: [{ required: true, message: '请输入每人发放金额' }]}
          ]"
          placeholder="请输入每人发放金额"
        />
      </a-form-item>
      <a-form-item label="总发放金额" v-bind="formItemLayout">
        <a-input
          disabled
          v-decorator="[
            'grantTotalBalance',
            {
              initialValue: cardInfo.grantTotalBalance
            }
          ]"
        />
      </a-form-item>
      <a-form-item label="发放时间" v-bind="formItemLayout">
        <a-radio-group
          v-decorator="[
            'status',
            {
              initialValue: cardInfo.status,
              rules: [{ required: true, message: '请选择发放时间' }]
            }
          ]"
        >
          <a-radio value="1">立即发放</a-radio>
          <a-radio value="2">稍后发放</a-radio>
        </a-radio-group>
      </a-form-item>
    </a-form>
    <choose-user
      ref="chooseUser"
      is-check
      v-if="teacherTag"
      v-model="teacherTag"
      @submit="chooseUser"
      title="选择教职工"
    >
    </choose-user>
    <choose-student
      ref="chooseStudent"
      is-check
      v-if="studentTag"
      v-model="studentTag"
      @submit="chooseStudent"
      title="添加学生">
    </choose-student>
  </a-modal>
</template>

<script>
import ChooseUser from '@c/ChooseUser'
import ChooseStudent from '@c/ChooseStudent'
import { mapState, mapActions } from 'vuex'
import { TreeSelect } from 'ant-design-vue'
const SHOW_PARENT = TreeSelect.SHOW_PARENT
export default {
  name: 'ExportStudent',
  components: {
    ChooseUser,
    ChooseStudent
  },
  data () {
    return {
      defaultRadio: '4',
      value: [],
      treeData: [],
      form: this.$form.createForm(this),
      visible: false,
      isLoad: false,
      total: 0,
      formItemLayout: {
        labelCol: { span: 4 },
        wrapperCol: { span: 20 }
      },
      cardInfo: {
        grantNumber: 0,
        grantBalance: 0,
        grantTotalBalance: 0,
        userType: '4',
        status: '1'
      },
      grantBalance: 0,
      teacherTag: false,
      studentTag: false,
      classList: [],
      SHOW_PARENT,
      schoolYearId: '',
      grantNumber: 0
      // sendNum: 0
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])

  },
  watch: {
    classList: {
      handler (newVal, oldVal) {
        console.log('111', newVal.length)
        this.cardInfo.grantNumber = newVal.length + this.grantNumber
        this.cardInfo.grantTotalBalance = this.cardInfo.grantNumber * this.cardInfo.grantBalance
        console.log('=', this.cardInfo.grantTotalBalance)
      },
      deep: true
    }
  },
  mounted () {
    this.getSchoolInfo()
  },
  methods: {
    ...mapActions('home', ['getOrgBySchool', 'getSchoolYear', 'getGradeList',
      'getClassList', 'addSubsidy', 'getStudentSum', 'getTeacherSum'
    ]),
    inputChange(value) {
      this.cardInfo.grantBalance = value
      this.cardInfo.grantTotalBalance = this.cardInfo.grantNumber * value
    },
    // tree节点的选中
    onChange (value) {
      this.value = value
      if (value.length === 0) {
        this.grantNumber = 0
        this.cardInfo.grantNumber = this.classList.length
        this.cardInfo.grantTotalBalance = this.cardInfo.grantNumber * this.cardInfo.grantBalance
      } else {
        if (this.defaultRadio === '8') {
          let studentCounts = []
          value.map(el => {
            const clazz = el.value.split('=')[0]
            const grade = el.value.split('=')[1]
            const clazzCode = clazz.split('/')[1]
            const gradeCode = grade.split('?')[1]
            if (clazz.split('/')[0] === 'schoolYear') {
              studentCounts = []
            } else if (clazzCode === gradeCode) {
              studentCounts.push({
                'gradeCode': gradeCode
              })
            } else {
              studentCounts.push({
                'classCodes': clazzCode,
                'gradeCode': gradeCode
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
            this.cardInfo.grantNumber = this.grantNumber + this.classList.length
            this.cardInfo.grantTotalBalance = this.cardInfo.grantNumber * this.cardInfo.grantBalance
          })
        } else {
          const orgCodes = []
          value.map(el => {
            orgCodes.push(el.value)
          })
          const req = {
            schoolCode: this.userInfo.schoolCode,
            organCodes: orgCodes
          }
          this.getTeacherSum(req).then(res => {
            this.grantNumber = res.data
            this.cardInfo.grantNumber = this.grantNumber + this.classList.length
            this.cardInfo.grantTotalBalance = this.cardInfo.grantNumber * this.cardInfo.grantBalance
          })
        }
      }
    },
    change(e) {
      this.grantNumber = 0
      this.cardInfo.grantNumber = 0
      this.defaultRadio = e.target.value
      if (this.defaultRadio === '4') {
        this.value = []
        this.treeData = []
        this.classList = []
        this.getSchoolInfo()
      } else {
        this.value = []
        this.treeData = []
        this.classList = []
        this.initMenu()
      }
    },
    // 获取学校信息
    async getSchoolInfo () {
      const res = await this.getOrgBySchool(this.userInfo.schoolCode)
      if (res.data === null || res.data.length === 0) {
        this.noData = true
        return
      } else {
        this.noData = false
      }
      const data = this.newOrgData([res.data])
      this.defaultKey = [data[0].key]
      this.treeData = data
    },
    async initMenu () {
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
      this.treeData = this.gradeList
        .map(item => {
          return {
            title: item.schoolYear + '学年',
            code: item.id,
            schoolYearId: item.id,
            value: 'schoolYear' + '/' + item.id + '=' + item.schoolYear,
            key: 'schoolYear' + '/' + item.id + '=' + item.schoolYear
          }
        })
      this.defaultSelectedKeys = [this.gradeList[0].id]
      this.onLoadData({
        dataRef: {
          schoolYearId: this.treeData[0].code
        }
      })
    },
    async onLoadData (treeNode) {
      return new Promise((resolve) => {
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
              value: 'gradeCode' + '/' + item.code + '=' + 'gradeCode' + '?' + item.code,
              key: 'gradeCode' + '/' + item.code + '=' + 'gradeCode' + '?' + item.code
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
                  value: 'classCode' + '/' + ele.classCode + '=' + 'gradeCode' + '?' + item.gradeCode,
                  key: 'classCode' + '/' + ele.classCode + '=' + 'gradeCode' + '?' + item.gradeCode,
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
    newOrgData (data) {
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
    add() {
      if (this.defaultRadio === '4') {
        this.teacherTag = true
      } else {
        this.studentTag = true
      }
    },
    chooseUser(classInfo) {
      this.classList = classInfo
      this.$refs.chooseUser.reset()
    },
    chooseStudent(values) {
      this.classList = values
      this.$refs.chooseStudent.reset()
    },
    classClose(removedTag) {
      this.classList = this.classList.filter(tag => tag !== removedTag)
    },
    addExamSubmit (e) {
      e.preventDefault()
      this.form.validateFields((error, values) => {
        if (!error) {
          if (this.classList.length === 0 && this.value.length === 0) {
            this.$message.warning('请选择组织或人员')
            return false
          }
          values.grantTime = values.status === '1' ? this.$tools.getDate(new Date()) : ''
          // values.status = values.status === '1' ? '1' : '2'
          values.userCodeList = this.classList.map(el => {
            return {
              userCode: el.userCode
            }
          })
          values.userCodeList = this.classList.map(el => {
            return {
              'userCode': el.userCode
            }
          })
          // 学生
          if (values.userType === '8') {
            let studentCounts = []
            values.classCodeList.map(el => {
              const clazz = el.value.split('=')[0]
              const grade = el.value.split('=')[1]
              const clazzCode = clazz.split('/')[1]
              const gradeCode = grade.split('?')[1]
              if (clazz.split('/')[0] === 'schoolYear') {
                studentCounts = []
              } else if (clazzCode === gradeCode) {
                studentCounts.push({
                  'gradeCode': gradeCode
                })
              } else {
                studentCounts.push({
                  'classCodes': clazzCode,
                  'gradeCode': gradeCode
                })
              }
            })
          } else {
            // 老师
            values.teacherCode = this.value.map(el => {
              return {
                'teacherCode': el.value
              }
            })
          }
          this.isLoad = true
          this.addSubsidy(values).then(res => {
            this.visible = false
            this.isLoad = false
            this.$message.success('操作成功')
            this.$tools.goNext(() => {
              this.$emit('updata')
            })
          }).catch(res => {
            this.isLoad = false
          })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.ant-input-number {
  width: 100%;
}
</style>
