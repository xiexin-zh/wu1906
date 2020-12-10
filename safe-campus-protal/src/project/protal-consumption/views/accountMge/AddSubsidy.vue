<template>
  <div class="add-subsidy page-layout">
    <choose-user
      ref="chooseUser"
      is-check
      v-if="teacherTag"
      v-model="teacherTag"
      @submit="chooseUser"
      :chooseorgList="value"
      :teacherList="classList"
      title="选择教职工"
    >
    </choose-user>
    <choose-student
      ref="chooseStudent"
      is-check
      v-if="studentTag"
      v-model="studentTag"
      @submit="chooseStudent"
      :chooseClassList="value"
      :studentList="classList"
      title="添加学生"
    >
    </choose-student>
    <a-form id="components-form-demo-validate-other" :form="form" v-bind="formItemLayout" @submit="handleSubmit">
      <a-form-item label="补助名称">
        <a-input
          :disabled="readOnlyTag"
          @change="setSubsidyName"
          v-decorator="[
            'subsidyName',
            { initialValue: detail.subsidyName, rules: [{ required: true, message: '请输入补助名称!' }] }
          ]"
        />
      </a-form-item>
      <a-form-item label="发放对象">
        <a-radio-group
          :disabled="readOnlyTag"
          @change="change"
          v-decorator="['userType', { initialValue: detail.userType }]"
        >
          <a-radio value="2">教职工</a-radio>
          <a-radio value="1">学生</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="组织" v-bind="formItemLayout" v-if="detail.userType === '2'">
        <a-tree-select
          placeholder="请选择组织机构"
          :treeData="treeData"
          :disabled="readOnlyTag"
          v-model="value"
          @change="onChange"
          treeCheckable
          :treeCheckStrictly="false"
          :treeDefaultExpandAll="false"
          labelInValue
          :dropdownStyle="{ 'max-height': '400px', overflow: 'auto' }"
          :show-checked-strategy="SHOW_PARENT"
        />
      </a-form-item>
      <a-form-item label="班级" v-bind="formItemLayout" v-if="detail.userType === '1'">
        <a-tree-select
          placeholder="请选择班级"
          :treeData="treeData"
          v-model="value"
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
      <a-form-item label="人员" v-bind="formItemLayout">
        <div>
          <template v-for="tag in classList">
            <a-tag :key="tag.id" :closable="!readOnlyTag" @close="() => classClose(tag)">
              {{ tag.userName }}
            </a-tag>
          </template>
          <a-tag v-if="!readOnlyTag" @click="add" style="background: #fff; borderstyle: dashed">
            <a-icon type="plus" />添加
          </a-tag>
        </div>
      </a-form-item>
      <a-form-item label="发放人数">
        <span class="ant-form-text">{{ detail.grantNumber }}人</span>
      </a-form-item>
      <a-form-item label="每人发放金额">
        <a-input
          type="number"
          :min="1"
          :max="99999"
          :disabled="readOnlyTag"
          v-decorator="[
            'grantBalance',
            { initialValue: detail.grantBalance, rules: [{ required: true, message: '请输入发放金额!' }] }
          ]"
          addon-before="￥"
          addon-after="RMB"
          @change="setTotal"
        />
      </a-form-item>
      <a-form-item label="总发放金额">
        <span class="ant-form-text">{{ detail.grantTotalBalance }}</span>
      </a-form-item>

      <a-form-item label="发放时间">
        <a-radio-group :disabled="readOnlyTag" v-decorator="['grantStatus', { initialValue: detail.grantStatus }]">
          <a-radio value="1">立即发放</a-radio>
          <a-radio value="0">稍后发放</a-radio>
        </a-radio-group>
      </a-form-item>

      <a-form-item :wrapper-col="{ span: 12, offset: 6 }">
        <a-button class="u-mar-r" @click="$router.back()">取消</a-button>
        <a-button type="primary" :loading="loading" html-type="submit">确定</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>
<script>
import ChooseUser from '../../component/ChooseTeacher'
import ChooseStudent from '../../component/ChooseStudent'
import { mapState, mapActions } from 'vuex'
import { TreeSelect } from 'ant-design-vue'
import md5 from 'js-md5'
const SHOW_PARENT = TreeSelect.SHOW_PARENT
export default {
  name: 'AddSubsidy',
  components: {
    ChooseUser,
    ChooseStudent
  },
  data() {
    return {
      readOnlyTag: false,
      detail: {
        grantNumber: 0, // 补助人数
        grantBalance: 0, // 补助金额
        grantTotalBalance: 0,
        userType: '2',
        grantStatus: '1',
        subsidyName: ''
      },
      loading: false,
      formItemLayout: {
        labelCol: { span: 6 },
        wrapperCol: { span: 14 }
      },
      SHOW_PARENT,
      teacherTag: false,
      studentTag: false,
      classList: [],
      treeData: [],
      value: [],
      grantNumber: 0
    }
  },
  watch: {
    classList: {
      handler(newVal, oldVal) {
        this.detail.grantNumber = newVal.length + this.grantNumber
        this.detail.grantTotalBalance = this.detail.grantNumber * this.detail.grantBalance
      },
      deep: true
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  beforeCreate() {
    this.form = this.$form.createForm(this, { name: 'validate_other' })
  },
  async mounted() {
    this.type = this.$route.query.type
    if (this.type === 'edit' || this.type === 'detail') {
      this.showDetail()
      this.readOnlyTag = this.type === 'detail'
    } else {
      this.getSchoolInfo()
    }
  },
  methods: {
    ...mapActions('home', [
      'getOrgBySchool',
      'getSchoolYear',
      'getGradeList',
      'getStudentSum',
      'getTeacherSum',
      'getClassList',
      'grantSubsidy',
      'saveSubsidy',
      'getSubsidyDetail',
      'getTeacherAccountList',
      'getSubsidyPerNum'
    ]),
    /**
     * @description 补助详情
     */
    async showDetail() {
      const res = await this.getSubsidyDetail(this.$route.query.id)
      this.detail = res.data
      this.value = res.data.userOrgList
      if (this.detail.userType === '1') {
        await this.initMenu()
      } else if (this.detail.userType === '2') {
        await this.getSchoolInfo()
      }
      if (res.data.userOrgList.length === 0) {
        this.classList = res.data.userInfoList
      } else {
        const req = {
          userType: this.detail.userType
        }
        if (this.detail.userType === '1') {
          let studentCounts = []
          this.value.map((el) => {
            const clazz = el.value.split('=')[0]
            const grade = el.value.split('=')[1]
            const clazzCode = clazz.split('/')[1]
            const gradeCode = grade.split('?')[1]
            if (clazz.split('/')[0] === 'schoolYear') {
              studentCounts = [`${this.schoolYear},null,null`]
            } else if (clazzCode === gradeCode) {
              studentCounts.push(`${this.schoolYear},${gradeCode},null`)
            } else {
              studentCounts.push(`${this.schoolYear},${gradeCode},${clazzCode}`)
            }
          })
          req.stuClass = studentCounts
        } else {
          req.teaOrg = this.value.map((el) => {
            return el.value
          })
        }
        this.getSubsidyPerNum(req).then((result) => {
          this.grantNumber = result.data.length
          res.data.userInfoList.forEach((ele) => {
            const index = result.data
              .map((el) => {
                return el.userCode
              })
              .findIndex((list) => {
                return list === ele.userCode
              })
            if (index === -1) {
              this.classList.push(ele)
            }
          })
        })
      }
    },
    /**
     * @description 计算总发放金额
     */
    setTotal(event) {
      this.detail.grantBalance = event.target.value
      this.detail.grantTotalBalance = this.detail.grantNumber * event.target.value
    },
    setSubsidyName(event) {
      this.detail.subsidyName = event.target.value
    },
    // tree节点的选中
    onChange(value) {
      console.log(value)
      this.value = value
      if (value.length === 0) {
        this.grantNumber = 0
        this.detail.grantNumber = this.classList.length
        this.detail.grantTotalBalance = this.detail.grantNumber * this.detail.grantBalance
      } else {
        const req = {
          userType: this.detail.userType
        }
        if (this.detail.userType === '1') {
          let studentCounts = []
          value.map((el) => {
            const clazz = el.value.split('=')[0]
            const grade = el.value.split('=')[1]
            const clazzCode = clazz.split('/')[1]
            const gradeCode = grade.split('?')[1]
            if (clazz.split('/')[0] === 'schoolYear') {
              studentCounts = [`${this.schoolYear},null,null`]
            } else if (clazzCode === gradeCode) {
              studentCounts.push(`${this.schoolYear},${gradeCode},null`)
            } else {
              studentCounts.push(`${this.schoolYear},${gradeCode},${clazzCode}`)
            }
          })
          req.stuClass = studentCounts
        } else {
          req.teaOrg = value.map((el) => {
            return el.value
          })
        }
        this.getSubsidyPerNum(req).then((res) => {
          this.grantNumber = res.data.length
          if (this.detail.userType === '1') {
            this.classStuList = res.data.map((el) => {
              return el.userCode
            })
          } else {
            this.orgTeaList = res.data.map((el) => {
              return el.userCode
            })
          }
          if (this.classList.length > 0) {
            res.data.map(el => {
              const index = this.classList.findIndex(list => { return list.userCode === el.userCode })
              if (index !== -1) {
                this.classList.splice(index, 1)
              }
            })
          }
          this.detail.grantNumber = this.grantNumber + this.classList.length
          this.detail.grantTotalBalance = this.detail.grantNumber * this.detail.grantBalance
        })
      }
    },
    // 修改发放对象
    change(e) {
      this.grantNumber = 0
      this.detail.grantNumber = 0
      this.detail.userType = e.target.value
      this.value = []
      this.treeData = []
      this.classList = []
      if (e.target.value === '2') {
        this.getSchoolInfo()
      } else {
        this.initMenu()
      }
    },
    // 获取学校信息
    async getSchoolInfo() {
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
    async initMenu() {
      const req = {
        schoolCode: this.userInfo.schoolCode
      }
      const res = await this.getSchoolYear(req)
      if (res.data.list.length === 0) return
      this.gradeList = res.data.list.filter((item) => {
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
      return new Promise((resolve) => {
        if (treeNode.dataRef.children) {
          resolve()
          return
        }
        const req = {
          schoolCode: this.userInfo.schoolCode
        }
        this.getGradeList(req).then((res) => {
          treeNode.dataRef.children = res.data.list.map((item) => {
            return {
              title: item.name,
              schoolYearId: treeNode.dataRef.schoolYearId,
              isLeaf: false,
              gradeCode: item.code,
              value: 'gradeCode' + '/' + item.code + '=' + 'gradeCode' + '?' + item.code,
              key: 'gradeCode' + '/' + item.code + '=' + 'gradeCode' + '?' + item.code
            }
          })
          treeNode.dataRef.children.forEach((item) => {
            const data = {
              schoolCode: this.userInfo.schoolCode,
              schoolYearId: treeNode.dataRef.schoolYearId,
              gradeCode: item.gradeCode
            }
            this.getClassList(data).then((res) => {
              item.children = res.data.list.map((ele) => {
                return {
                  title: ele.gradeName + ele.className,
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
    newOrgData(data) {
      data.forEach((item) => {
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
    async add() {
      if (this.detail.userType === '2') {
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
      this.classList = this.classList.filter((tag) => tag !== removedTag)
    },
    /**
     * @description 发送补助
     */
    async _grantSubsidy() {
      if (this.readOnlyTag) {
        this.$router.back()
        return
      }
      console.log(this.detail)
      console.log(this.value)
      if (this.classList.length === 0 && this.value.length === 0) {
        this.$message.warning('请选择补助发放对象')
        return
      }
      if (this.detail.grantTotalBalance <= 0) {
        this.$message.warning('请输入有效的补助金额')
        return
      }
      this.loading = true
      const params = {
        accounts: this.classList.map((ele) => {
          return ele.userCode
        }),
        grantBalance: this.detail.grantBalance,
        grantNumber: this.detail.grantNumber,
        grantStatus: this.grantInfo.grantStatus,
        grantTotalBalance: this.detail.grantTotalBalance,
        id: this.type === 'edit' ? this.detail.id : '',
        schoolCode: this.userInfo.schoolCode,
        stuClass: [],
        subsidyName: this.detail.subsidyName,
        teaOrg: [],
        timeStamp: parseInt(new Date().getTime() / 1000),
        userOrgList: this.value,
        userType: this.detail.userType,
        key: 'M86l522AV6q613Ii4W6u8K48uW8vM1N6bFgyv769220MdYe9u37N4y7rI5mQ'
      }
      if (this.detail.userType === '1') {
        this.value.map((el) => {
          const clazz = el.value.split('=')[0]
          const grade = el.value.split('=')[1]
          const clazzCode = clazz.split('/')[1]
          const gradeCode = grade.split('?')[1]
          if (clazz.split('/')[0] === 'schoolYear') {
            params.stuClass = [`${this.schoolYear},null,null`]
          } else if (clazzCode === gradeCode) {
            params.stuClass.push(`${this.schoolYear},${gradeCode},null`)
          } else {
            params.stuClass.push(`${this.schoolYear},${gradeCode},${clazzCode}`)
          }
        })
        params.accounts = params.accounts.concat(this.classStuList)
      } else if (this.detail.userType === '2') {
        params.teaOrg = this.value.map((el) => {
          return el.value
        })
        params.accounts = params.accounts.concat(this.orgTeaList)
      }
      let actFun = ''
      if (parseInt(this.grantInfo.grantStatus) === 1) {
        // 立即发放
        actFun = 'grantSubsidy'
      } else {
        // 延迟发放
        actFun = 'saveSubsidy'
      }
      params.sign = this.getSign(params)
      params.accounts = JSON.parse(params.accounts)
      params.stuClass = JSON.parse(params.stuClass)
      params.userOrgList = JSON.parse(params.userOrgList)
      params.teaOrg = JSON.parse(params.teaOrg)
      params.key = undefined
      try {
        await this[actFun](params)
        this.$message.success('发放成功')
        this.$tools.goNext(() => {
          this.loading = false
          this.$router.back()
        })
      } catch (err) {
        this.loading = false
      }
    },
    // 生成签名
    getSign(params) {
      console.log(params)
      const arr = []
      for (const i in params) {
        if (params[i]) {
          if (typeof (params[i]) !== 'string') {
            params[i] = JSON.stringify(params[i])
          }
          arr.push(i + '=' + params[i])
        }
      }
      const urlStr = arr.join('&')
      return md5(urlStr).toUpperCase()
    },
    /**
     * @description 表单验证
     */
    handleSubmit(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          this.grantInfo = values
          this._grantSubsidy()
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.add-subsidy {
  padding: 40px 0;
}
</style>
