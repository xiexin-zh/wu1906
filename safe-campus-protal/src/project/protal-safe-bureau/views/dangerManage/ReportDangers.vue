<template>
  <div class="page-layout bg-fff qui-fx-ver">
    <a-row class="u-mar-t40" type="flex" justify="center" >
      <a-col :span="20" >
        <a-form :form="form">
          <a-form-item v-bind="formItemLayout" label="指定学校" >
            <a-input
              @click="scoloolChange"
              placeholder="请指定学校"
              v-decorator="[
                'schoolName',
                { initialValue: appForm.schoolName, rules: [ {required: true, message: '请指定学校' } ]}
              ]"
            />
          </a-form-item>
          <a-form-item v-bind="formItemLayout" label="指定负责人" >
            <a-select
              v-decorator="[
                'leaderName',
                { initialValue: appForm.leaderName, rules: [{ required: true, message: '请选择负责人' }] },
              ]"
              placeholder="请选择负责人"
            >
              <a-select-option v-for="list in userList" :key="`${list.name}+${list.code}`">
                {{ list.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item v-bind="formItemLayout" label="隐患位置" >
            <a-input
              placeholder="请输入隐患位置"
              v-decorator="[
                'address',
                { initialValue: appForm.address, rules: [{max: 30,required: true, message: '请输入机构名称限30字' } ]}
              ]"
            />
          </a-form-item>

          <a-form-item v-bind="formItemLayout" label="隐患描述" >
            <a-textarea
              placeholder="请输入隐患描述"
              v-decorator="[
                'description',
                { initialValue: appForm.description, rules: [ {max: 300, required: true, message: '请输入隐患描述限300字' } ]}
              ]"
            />
          </a-form-item>
          <a-form-item v-bind="formItemLayout" label="隐患图片上传" >
            <a-row :gutter="[50,100]" >
              <a-col :span="24" >
                <upload-multi
                  :length="9"
                  v-model="photoUrl"
                  :fileInfo="fileInfo"
                ></upload-multi>
              </a-col>
              <a-col :span="8" >
                备注：限上传9张照片
              </a-col>
            </a-row>
          </a-form-item>
          <a-form-item v-bind="formItemLayout">
            <a-row :gutter="[50,100]" type="flex" justify="center" >
              <a-col >
                <a-button type="primary" class="u-mar-r10" @click="submitOk" >
                  上报
                </a-button>
                <a-button type="primary" @click="callBack">
                  返回
                </a-button>
              </a-col>
            </a-row>
          </a-form-item>
        </a-form>
      </a-col>
    </a-row>
    <choose-school
      type="edu"
      is-radio
      :teacherList="chooseTeachersDeatil"
      ref="ChooseSchool"
      v-if="schoolTag"
      v-model="schoolTag"
      @submit="submitSchool"
      title="选择学校"
    >
    </choose-school>
    <!-- <choose-user
      type="edu"
      is-radio
      ref="form"
      v-if="userTag"
      v-model="userTag"
      @submit="submitUser"
      title="选择负责人">
    </choose-user> -->
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import SearchForm from '@c/SearchForm'
import UploadMulti from '@c/UploadMulti'
import ChooseSchool from '@c/choose/ChooseSchool'
import { reportDangerForm } from '../../assets/js/submitLable.js'
// import hostEnv from '@config/host-env'

export default {
  name: 'ReportDangers',
  components: {
    SearchForm,
    UploadMulti,
    ChooseSchool
    // ChooseUser
  },
  data() {
    return {
      confirmLoading: false,
      form: this.$form.createForm(this),
      formItemLayout: {
        labelCol: { span: 4 },
        wrapperCol: { span: 20 }
      },
      reportDangerForm,
      fileInfo: {
        tip: '上传图片',
        h: 120, // 高度
        w: 120 // 宽度
      },
      photoUrl: [],
      appForm: {},
      userList: {}, // 负责人
      // 选择学校，指定人
      schoolCode: '', // 指定学校
      schoolName: '', // 指定学校
      schoolTag: false,
      chooseTeachersDeatil: []
    }
  },
  computed: {
    ...mapState('home', ['userInfo', 'eduName', 'eduCode'])
  },
  created() {
  },
  mounted() {
    // this.showList()
    // this.getUserList() // 获取指定人
  },
  methods: {
    ...mapActions('home', ['addDangerTask', 'subsidy', 'getSchool', 'getGroupDetail']),
    // 获取指定人
    async getUserList(schoolCode) {
      const res = await this.getGroupDetail({ schoolCode: schoolCode })
      this.userList = res.data.leaders
    },
    reset() {
      this.confirmLoading = false
      this.$emit('input', false)
    },
    callBack() {
      this.$router.go(-1)
    },
    async  submitOk(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          if (this.photoUrl.length === 0) {
            this.$message.warning('请上传图片')
            return
          }
          // console.log(values)
          const req = {
            address: values.address,
            description: values.description,
            leaderCode: values.leaderName.split('+')[1], // 负责人编码
            leaderName: values.leaderName.split('+')[0],
            photoUrl: this.photoUrl.map(item => item.url),
            reporterCode: this.userInfo.userCode, // 上报人编码
            reporterName: this.userInfo.userName,
            reporterPhotoUrl: '', // 上报人图片地址
            schoolCode: this.schoolCode, // 学校编码
            schoolName: this.schoolName
          }
          this.addDangerTask(req).then(res => {
            // console.log(res)
            this.$message.success(`上报${res.data},已通知负责人`)
            this.$tools.goNext(() => {
              this.callBack()
            })
          })
        }
      })
    },
    // 选择学校，负责人
    scoloolChange(value) {
      this.schoolTag = true
    },
    async submitSchool(values) {
      this.schoolCode = values[0].schoolCode
      this.schoolName = values[0].schoolName
      this.appForm.schoolName = this.schoolName
      this.getUserList(values[0].schoolCode)
      this.$refs.ChooseSchool.reset()
    }
  }
}
</script>

<style lang="less" scoed>
.grade-tree {

}
</style>
