<template>
  <div class="set-up page-layout qui-fx-ver">
    <a-form :form="form" :style="{ maxHeight: maxHeight }">
      <div>
        <div class="title-box" style="margin-bottom:10px;">
          <span class="title-icon"></span>
          <span class="title-text">温度设置</span>
        </div>
        <a-form-item label="发热温度值" :label-col="{ span: 5 }" :wrapper-col="{ span: 5 }">
          <a-input-number
            @blur="tempChange"
            :step="0.1"
            v-decorator="[
              'temperature',
              { initialValue: tempList.temperatureLimit, rules: [{ required: true, message: '请填写发热温度值' }] }
            ]"
          />
        </a-form-item>
      </div>
      <div>
        <div class="title-box" style="margin-bottom:10px;">
          <span class="title-icon"></span>
          <span class="title-text">校医人员设置</span>
        </div>
        <a-form-item label="校医人员" v-bind="formItemLayout">
          <!-- <a-tag closable v-for="item in appForm.teacher" @close="del(item.id)" :key="item.id">
            {{ item.userName }}
          </a-tag> -->
          <a-tag v-for="item in appForm.teacher" :key="item.id">
            {{ item.userName }}
          </a-tag>
          <a-tag @click="chooseDoctor" style="background: #fff; borderStyle: dashed;">
            <a-icon type="plus" /> 添加
          </a-tag>
        </a-form-item>
      </div>
      <div>
        <div class="title-box" style="margin-bottom:10px;">
          <span class="title-icon"></span>
          <span class="title-text">发热通知设置</span>
        </div>
        <a-form-item v-bind="formItemLayout" label="教职工发热通知" required>
          <a-checkbox-group @change="teacherChange" v-model="teacherNoticer">
            <a-checkbox value="0">本人</a-checkbox>
            <a-checkbox value="1">校医</a-checkbox>
          </a-checkbox-group>
        </a-form-item>
        <a-form-item v-bind="formItemLayout" label="学生发热通知" required>
          <a-checkbox-group @change="studentChange" v-model="studentNoticer">
            <a-checkbox value="2">家长</a-checkbox>
            <a-checkbox value="3">班主任</a-checkbox>
            <a-checkbox value="1">校医</a-checkbox>
          </a-checkbox-group>
        </a-form-item>
        <!-- <a-form-item v-bind="formItemLayout" label="通知方式" required>
          <a-checkbox-group @change="weChatChange" v-model="weChat">
            <a-checkbox value="MSG01">公众号</a-checkbox>
          </a-checkbox-group>
          <a-checkbox-group @change="messageChange" v-model="messageDoc">
            <a-checkbox value="MSG02">短信</a-checkbox>
          </a-checkbox-group>
        </a-form-item> -->
      </div>
    </a-form>
    <choose-doctor is-check ref="chooseUser" v-if="userTag" v-model="userTag" @submit="choose" title="选择校医">
    </choose-doctor>
  </div>
</template>

<script>
import ChooseDoctor from './ChooseDoctor'
// import ChooseStudent from './ChooseStudent'
import moment from 'moment'
import { mapActions, mapState } from 'vuex'
export default {
  name: 'SetUp',
  components: {
    ChooseDoctor
    // ChooseStudent
  },
  data() {
    return {
      form: this.$form.createForm(this),
      formItemLayout: {
        labelCol: { span: 5 },
        wrapperCol: { span: 14 }
      },
      teacherOptions: [
        { label: '本人', value: 'PERSON01' },
        { label: '校医', value: 'PERSON02' }
      ],
      studentOptions: [
        { label: '家长', value: 'PERSON03' },
        { label: '班主任', value: 'PERSON04' },
        { label: '校医', value: 'PERSON02' }
      ],
      infoOptions: [
        { label: '公众号', value: 'MSG01' },
        { label: '短信', value: 'MSG02' }
      ],
      maxHeight: 0,
      timeList: [1, 2],
      userTag: false,
      appForm: {
        armpit: '',
        mouth: '',
        head: '',
        teacher: '',
        switch: ''
      },
      tempList: {},
      userList: [],
      infoCheck: [],
      teacherCheck: [],
      studentCheck: [],
      teacherSelfCheck: 'PERSON01',
      teacherDocCheck: 'PERSON02',
      studentSelfCheck: 'PERSON03',
      studentTeacherCheck: 'PERSON04',
      studentDocCheck: 'PERSON02',
      weChatCheck: 'MSG01',
      messageDocCheck: 'MSG02',
      teacherNoticer: [],
      studentNoticer: [],
      studentDoc: [],
      weChat: [],
      messageDoc: []
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  mounted() {
    this.tmpListGet()
    this.doctorList()
    this.noticerGet()
    // this.informWayGet()
  },
  methods: {
    moment,
    ...mapActions('home', [
      'gettmpList',
      'addDoctor',
      'getInfoDoctor',
      'getInformWay',
      'updateTmpList',
      'updateInformWay',
      'unBindDoc',
      'updateNoticer',
      'noticerList'
    ]),
    // 温度设置列表
    async tmpListGet() {
      const res = await this.gettmpList(this.userInfo.schoolCode)
      if (res.data) {
        this.tempList = res.data
      }
    },
    // list发热通知设置
    async noticerGet() {
      const res = await this.noticerList({ schoolCode: this.userInfo.schoolCode })
      res.data.map(el => {
        if (el.feverType === '0') {
          this.teacherNoticer = el.noticerType ? el.noticerType : []
        } else {
          this.studentNoticer = el.noticerType ? el.noticerType : []
        }
      })
    },
    // update发热通知设置
    teacherChange(e) {
      this.noticeChange(0, e)
    },
    studentChange(e) {
      this.noticeChange(1, e)
    },
    noticeChange(type, e) {
      const req = {
        schoolCode: this.userInfo.schoolCode,
        feverType: type,
        noticerType: e
      }
      this.updateNoticer(req).then(() => {
        this.$message.success('操作成功')
      })
    },
    // 已选校医
    async doctorList() {
      const userData = await this.getInfoDoctor(this.userInfo.schoolCode)
      this.userList = userData.data
      this.appForm.teacher = this.userList
      // this.appForm.teacher = this.userList.map(el => el.userName).join(',')
    },
    // 选择校医
    chooseDoctor() {
      this.userTag = true
    },
    async choose(values) {
      const users = []
      values.forEach(ele => {
        users.push({
          userName: ele.userName,
          userCode: ele.userCode
        })
      })
      const req = {
        schoolCode: this.userInfo.schoolCode,
        users
      }
      try {
        await this.addDoctor(req)
        this.$message.success('添加成功')
        this.$refs.chooseUser.reset()
        this.$tools.goNext(() => {
          this.doctorList()
        })
      } catch (err) {
        this.$refs.chooseUser.error()
      }
    },
    // 删除校医
    del(e) {
      this.unBindDoc({ id: e }).then(() => {
        this.$message.success('操作成功')
      })
    },
    // update温度
    tempChange(e) {
      if (e.target.value && this.tempList.temperatureLimit !== e.target.value) {
        const req = {
          schoolCode: this.userInfo.schoolCode,
          temperature: e.target.value
        }
        this.updateTmpList(req).then(res => {
          this.$message.success('操作成功')
        })
      }
    },
    // 通知方式：微信、短信
    async informWayGet() {
      const res = await this.getInformWay({
        schoolCode: this.userInfo.schoolCode
      })
      this.infoCheck = res.data.filter(item => {
        if (item.informState === '1') {
          return item.informWayCode
        }
      })
      if (this.infoCheck.length > 0) {
        this.weChat = this.infoCheck.some(v => v.informWayCode === this.weChatCheck) ? ['MSG01'] : []
        this.messageDoc = this.infoCheck.some(v => v.informWayCode === this.messageDocCheck) ? ['MSG02'] : []
      }
    },
    // 通知方式更新
    wayChange(code, checked) {
      const req = {
        informWayCode: code,
        schoolCode: this.userInfo.orgCode,
        informState: checked ? '1' : '2'
      }
      this.updateInformWay(req).then(res => {
        this.$message.success('操作成功')
      })
    },
    weChatChange(e) {
      this.wayChange('MSG01', e.length > 0 ? 1 : 0)
    },
    messageChange(e) {
      this.wayChange('MSG02', e.length > 0 ? 1 : 0)
    }
  }
}
</script>
<style lang="less" scoped>
.set-up {
  background: #fff;
  padding: 10px 40px;
  overflow: auto;
  .title-box {
    height: 28px;
    border-bottom: 1px solid #ccc;
    position: relative;
    .title-icon {
      display: inline-block;
      height: 20px;
      width: 6px;
      background-color: #0086ff;
      position: absolute;
      top: 0%;
      left: 0;
    }
    .title-text {
      margin-left: 12px;
    }
  }
}
.ant-input-number {
  width: 100%;
}
</style>
