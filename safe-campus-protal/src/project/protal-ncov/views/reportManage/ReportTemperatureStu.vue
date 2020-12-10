<template>
  <div class="set-group page-layout qui-fx-ver">
    <choose-student
      ref="chooseUser"
      is-radio
      chooseType="door"
      v-if="userTag"
      v-model="userTag"
      @submit="chooseUser"
      title="添加学生"
    ></choose-student>
    <a-form :form="form">
      <a-form-item label="温度" :label-col="{ span: 3 }" :wrapper-col="{ span: 15 }">
        <a-input-number
          style="width: 80%"
          placeholder="输入温度"
          :min="30"
          :max="40"
          v-decorator="['temperature', { initialValue: temperature, rules: [{ required: true, message: '输入温度' }] }]"
        />
      </a-form-item>
      <a-form-item label="人员姓名" :label-col="{ span: 3 }" :wrapper-col="{ span: 15 }" :required="true">
        <a-tag color="#108ee9" v-for="(item, i) in groupList" :key="i">{{ item.userName }}</a-tag>
        <div>
          <a-button type="primary" @click="userTag = true">选择人员</a-button>
          <div></div>
        </div>
      </a-form-item>
      <a-form-item :wrapper-col="{ span: 15, offset: 3 }">
        <a-button style="margin-right:50px;" @click="cancle">取消</a-button>
        <a-button type="primary" @click="handleSubmit">保存</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import moment from 'moment'
import { mapState, mapActions } from 'vuex'
import ChooseStudent from '@c/ChooseStudent'
export default {
  name: 'ReportTemperatureStu',
  components: {
    ChooseStudent
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  data() {
    return {
      moment,
      userTag: false,
      form: this.$form.createForm(this),
      groupList: [],
      temperature: ''
    }
  },
  created() {},
  methods: {
    ...mapActions('home', ['addReport']),
    handleSubmit(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log(values)
          console.log(this.groupList)
          if (this.groupList.length === 0) {
            this.$message.warning('请选择人员')
            return
          }
          const req = {
            temperature: values.temperature,
            userCode: this.groupList[0].userCode,
            schoolCode: this.userInfo.schoolCode,
            reportName: this.userInfo.userName,
            userType: this.$route.query.userType
          }
          this.addReport(req).then(res => {
            this.$message.success('添加成功')
            this.$tools.goNext(() => {
              this.$router.push({
                path: '/ReportManageStu'
              })
            })
          })
        }
      })
    },
    chooseUser(values) {
      this.userTag = false
      this.$refs.chooseUser.reset()
      this.groupList = []
      values.forEach(ele => {
        this.groupList.push({
          userCode: ele.userCode,
          userName: ele.userName
        })
      })
      console.log(this.groupList)
    },

    cancle() {
      this.$router.push({
        path: '/ReportManageStu'
      })
    }
  }
}
</script>

<style lang="less" scoped>
.set-group {
  background: #fff;
  padding-top: 20px;
  .table {
    max-height: 380px;
    overflow: auto;
  }
  .action {
    margin: 5px 0;
    span {
      margin: 0 5px;
    }
    .right {
      img {
        width: 24px;
        height: 24px;
        margin: 0 10px;
        cursor: pointer;
      }
    }
  }
  .control-list {
    display: inline-block;
    margin: 0 10px 10px 0;
    line-height: 25px;
  }
}
</style>
