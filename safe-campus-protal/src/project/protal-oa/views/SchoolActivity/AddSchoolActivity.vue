<template>
  <div class="add-booking page-layout qui-fx-ver">
    <choose-control
      ref="chooseControl"
      is-check
      v-model="controlTag"
      v-if="controlTag"
      @submit="chooseDevice"
      :controlList="controlList"
      :schoolCode="userInfo.schoolCode"
      chooseType="common"
      title="添加设备"
    ></choose-control>
    <a-form :form="form" :style="{ maxHeight: maxHeight,overflow: 'auto' }">
      <a-form-item label="活动主题" :label-col="{ span: 3 }" :wrapper-col="{ span: 15 }">
        <a-input
          placeholder="请输入活动主题"
          :maxLength="20"
          :disabled="type === '1'"
          v-decorator="['remark', { initialValue: formData.remark, rules: [{ required: true, message: '请输入活动主题' }] }]"
        />
      </a-form-item>
      <a-form-item
        label="活动时间"
        :label-col="{ span: 3 }"
        :wrapper-col="{ span: 18 }"
        :required="true"
      >
        <div class="qui-fx-ac mar-b10">
          <a-range-picker
            :allowClear="false"
            :disabled-date="disabledDate"
            v-model="timeList"
            :show-time="{ format: 'HH:mm' }"
            format="YYYY-MM-DD HH:mm"
          />
        </div>
      </a-form-item>
      <a-form-item
        label="活动地点"
        :label-col="{ span: 3 }"
        :wrapper-col="{ span: 15 }"
        :required="true"
      >
        <a-input
          :maxLength="10"
          placeholder="请输入活动地点"
          :disabled="type === '1'"
          v-decorator="['placeName', { initialValue: formData.placeName, rules: [{ required: true, message: '请输入活动地点' }] }]"
        />
      </a-form-item>
      <a-form-item label="活动内容" :label-col="{ span: 3 }" :wrapper-col="{ span: 15 }">
        <a-textarea
          placeholder="请输入活动内容"
          :autoSize="{ minRows: 2, maxRows: 5 }"
          :maxLength="100"
          :disabled="type === '1'"
          v-decorator="['content', { initialValue: formData.content, rules: [{ required: false, message: '请输入活动内容' }] }]"
        />
      </a-form-item>
      <a-form-item
        label="活动发布"
        :label-col="{ span: 3 }"
        :wrapper-col="{ span: 15 }"
        :required="true"
      >
        <div>
          <a-tag
            v-if="type !== '1'"
            @click="controlSelect"
            style="background: #fff; borderStyle: dashed;"
          >
            <a-icon type="plus" />添加设备
          </a-tag>
          <template v-for="tag in controlList">
            <a-tag
              color="orange"
              :key="tag.deviceSn"
              :closable="type !== '1'"
              @close="() => controlClose(tag)"
            >{{ tag.deviceName }}</a-tag>
          </template>
        </div>
      </a-form-item>
      <a-form-item
        label="开启学生报名"
        :label-col="{ span: 3 }"
        :wrapper-col="{ span: 15 }"
      >
        <a-switch
          :disabled="type === '1'"
          @click="switchChange"
          v-model="formData.switch"
          v-decorator="['switch', { initialValue: formData.switch }]"
        />
      </a-form-item>
      <a-form-item
        v-if="formData.switch"
        label="报名截止时间"
        :label-col="{ span: 3 }"
        :wrapper-col="{ span: 18 }"
        :required="true"
      >
        <div class="qui-fx-ac mar-b10">
          <a-date-picker
            show-time
            :allowClear="false"
            v-model="formData.applyEnddate"
            :disabled="type === '1'"
            :disabled-date="disabledDate"
            valueFormat="YYYY-MM-DD HH:mm"
            format="YYYY-MM-DD HH:mm"
          />
        </div>
      </a-form-item>
      <a-form-item v-if="type !== '1'" :wrapper-col="{ span: 15, offset: 3 }">
        <a-button style="margin-right:50px;" @click="cancle">取消</a-button>
        <a-button type="primary" @click="handleSubmit">保存</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import ChooseControl from '../../component/ChooseCardcontrol'
import { Switch } from 'ant-design-vue'
import moment from 'moment'
export default {
  name: 'AddSchoolActivity',
  components: {
    moment,
    ASwitch: Switch,
    ChooseControl
  },
  data() {
    return {
      formData: {
        remark: '',
        content: '',
        placeName: '',
        switch: false,
        applyEnddate: moment(new Date(), 'YYYY-MM-DD HH:mm')
      },
      controlTag: false,
      switchTag: false,
      form: this.$form.createForm(this),
      maxHeight: 0,
      id: 0,
      type: 0, // 0新增 1查看 2编辑
      timeList: [moment(new Date(), 'YYYY-MM-DD HH:mm'), moment(new Date(new Date().getTime() + (24 * 60 * 60 * 1000)), 'YYYY-MM-DD HH:mm')],
      controlList: []
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  mounted() {
    this.maxHeight = window.screen.height - 280 + 'px'
    this.type = this.$route.query.type
    this.getSchoolYear({ schoolCode: this.userInfo.schoolCode }).then(res => {
      if (!res.data) {
        return
      }
      this.schoolYearId = res.data.list[0].id
    })
    if (this.type !== '0') {
      this.showData()
    }
  },
  methods: {
    ...mapActions('home', [
      'addSchoolActivity',
      'schoolActivityDetail',
      'editSchoolActivity',
      'getSchoolYear'
    ]),
    switchChange(val) {
    },
    // 表单回填
    async showData() {
      const res = await this.schoolActivityDetail(this.$route.query.id)
      console.log(res.data)
      this.formData.placeName = res.data.placeName
      this.timeList = [moment(new Date(res.data.startTime), 'YYYY-MM-DD HH:mm'), moment(new Date(res.data.endTime), 'YYYY-MM-DD HH:mm')]
      this.formData.remark = res.data.description
      this.formData.content = res.data.content
      this.formData.switch = res.data.openSign === '1'
      if (this.formData.switch) {
        this.formData.applyEnddate = moment(new Date(res.data.stopDatetime), 'YYYY-MM-DD HH:mm')
      }
      this.controlList = res.data.deviceList
    },
    // 提交权限组
    handleSubmit(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          if (this.controlList.length === 0) {
            this.$message.error('请选择活动发布设备')
            return
          }
          if (values.switch && !this.formData.applyEnddate) {
            this.$message.error('请选择报名截止时间')
            return
          }
          if (values.switch && new Date(this.formData.applyEnddate).getTime() >= new Date(this.timeList[0]).getTime()) {
            this.$message.error('报名截止时间不能晚于活动开始时间')
            return
          }
          const req = {
            schoolCode: this.userInfo.schoolCode,
            createName: this.userInfo.userName,
            createCode: this.userInfo.userCode,
            description: values.remark,
            content: values.content,
            startTime: this.timeList[0],
            endTime: this.timeList[1],
            openSign: values.switch ? '1' : '0',
            placeName: values.placeName,
            deviceList: this.controlList.map(el => {
              return {
                deviceName: el.deviceName,
                deviceSn: el.deviceSn,
                deviceIp: el.deviceIp,
                schoolCode: el.schoolCode,
                activityId: this.$route.query.id,
                classCode: el.classCode,
                gradeCode: el.gradeCode,
                schoolYearId: this.schoolYearId
              }
            })
          }
          if (values.switch) {
            req.stopDatetime = this.formData.applyEnddate
          } else {
            req.stopDatetime = undefined
          }
          console.log(req)
          if (this.type === '2') {
            req.id = this.$route.query.id
            this.editSchoolActivity(req).then(res => {
              this.$message.success('编辑成功')
              this.$tools.goNext(() => {
                this.$router.push({ path: '/schoolActivity' })
              })
            })
          } else if (this.type === '0') {
            this.addSchoolActivity(req).then(res => {
              this.$message.success('添加成功')
              this.$tools.goNext(() => {
                this.$router.push({ path: '/schoolActivity' })
              })
            })
          }
        }
      })
    },
    // 添加签到设备
    chooseDevice(value) {
      this.controlList = value
      this.$refs.chooseControl.reset()
    },
    controlClose(removedTag) {
      this.controlList = this.controlList.filter(tag => tag !== removedTag)
    },
    controlSelect() {
      this.controlTag = true
    },
    cancle() {
      this.$router.push({ path: '/schoolActivity' })
    },
    disabledDate(current) {
      return current && current < moment().startOf('day')
    }
  }
}
</script>

<style lang="less" scoped>
.add-booking {
  padding-top: 30px;
  /deep/ .ant-form-item {
    margin-bottom: 14px;
  }
}
</style>
