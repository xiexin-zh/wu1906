<template>
  <div class="add-white">
    <a-modal
      :title="title"
      :visible="addVisible"
      @cancel="addWhiteCancel"
      :maskClosable="false"
      :destroyOnClose="true"
      :confirmLoading="confirmLoading"
      width="650px"
      @ok="addWhiteHandle"
    >
      <a-form :form="form">
        <a-form-item label="姓名" :label-col="{ span: 5 }" :wrapper-col="{ span: 18 }">
          <a-input
            @click="teacherSelect"
            placeholder="请点击选择人员"
            v-decorator="[
              'userName',
              { initialValue: userName, rules: [{ required: true, message: '请点击选择人员' }] }
            ]"
            readOnly
          />
        </a-form-item>
        <a-form-item label="学号" :label-col="{ span: 5 }" :wrapper-col="{ span: 18 }">
          <a-input
            :disabled="disabled"
            v-decorator="['workNo', { initialValue: workNo, rules: [{ disabled: true }] }]"
            readOnly
          />
        </a-form-item>
        <a-form-item label="班级" :label-col="{ span: 5 }" :wrapper-col="{ span: 18 }">
          <a-input
            :disabled="disabled"
            v-decorator="['gradeName', { initialValue: gradeName, rules: [{ disabled: true }] }]"
            readOnly
          />
        </a-form-item>
        <a-form-item label="温度" :label-col="{ span: 5 }" :wrapper-col="{ span: 18 }">
          <a-input-number
            placeholder="输入温度"
            :min="30"
            :max="40"
            v-decorator="[
              'temperature',
              { initialValue: temperature, rules: [{ required: true, message: '输入温度' }] }
            ]"
          />
        </a-form-item>
      </a-form>
    </a-modal>
    <u-choose-student
      is-radio
      ref="chooseUser"
      v-if="userTag"
      v-model="userTag"
      :schoolCode="schoolCode"
      :bindList="bindList"
      @submit="chooseUser"
    >
    </u-choose-student>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import moment from 'moment'
export default {
  components: {
  },
  props: {
    refBuildList: {
      type: Object,
      default: function() {
        return {}
      }
    },
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      disabled: true,
      userTag: false,
      confirmLoading: false,
      moment,
      userName: '',
      bindList: [],
      form: this.$form.createForm(this),
      addVisible: false,
      userCode: '',
      temperature: '',
      workNo: '',
      className: '',
      gradeName: '',
      groupList: []
    }
  },
  computed: {
    ...mapState('home', ['userInfo', 'loginInfo', 'schoolCode'])
  },
  mounted() {
  },
  methods: {
    ...mapActions('home', ['addReport']),
    teacherSelect() {
      this.userTag = true
    },
    async chooseUser(values) {
      this.$refs.chooseUser.reset()
      this.userName = values[0].userName
      this.workNo = values[0].workNo
      this.className = values[0].className
      this.gradeName = (this.loginInfo.schoolType === '8' || this.loginInfo.schoolType === '9') ? values[0].grade + '级' + values[0].subjectName + values[0].className : values[0].gradeName
      this.userCode = values[0].userCode
      this.groupList = []
      values.forEach(ele => {
        this.groupList.push({
          userCode: ele.userCode,
          userName: ele.userName
        })
      })
    },
    addWhiteCancel() {
      this.addVisible = false
    },
    addWhiteHandle(e) {
      e.preventDefault()
      this.form.validateFields((err, value) => {
        if (!err) {
          const req = {
            temperature: value.temperature,
            userCode: this.groupList[0].userCode,
            userName: this.groupList[0].userName,
            schoolCode: this.schoolCode,
            reportName: this.userInfo.userName,
            userType: '8'
          }
          this.addReport(req).then(res => {
            this.$message.success('添加成功')
            this.confirmLoading = false
            this.addVisible = false
            this.$tools.goNext(() => {
              this.$emit('updata')
            })
          })
        } else {
          this.confirmLoading = false
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
.ant-calendar-picker {
  width: 100% !important;
}
</style>
