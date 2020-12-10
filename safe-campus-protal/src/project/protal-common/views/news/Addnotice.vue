<template>
  <div class="set-group page-layout qui-fx-ver">
    <a-form :form="form">
      <a-form-item label="公告标题：" :label-col="{ span: 5 }" :wrapper-col="{ span: 10 }">
        <a-input
          v-model="orders"
          maxlength="30"
          v-decorator="[
            'title',
            { initialValue: appForm.title, rules: [{ required: true, message: '请填写公告标题', whitespace: true }] }
          ]"
          placeholder="最多不超过30字"
        />
      </a-form-item>
      <a-form-item label="发布对象" :label-col="{ span: 5 }" :wrapper-col="{ span: 10 }" :required="true">
        <div>
          <a-tag @click="teacherSelect" style="background: #fff; borderStyle: dashed;">
            <a-icon type="plus" />添加教职工
          </a-tag>
          <template v-for="tag in teacherList">
            <a-tag color="cyan" :key="tag.userCode" :closable="true" :afterClose="() => userClose(tag)">
              {{ tag.userName }}
            </a-tag>
          </template>
        </div>
        <div>
          <a-tag @click="studentSelect" style="background: #fff; borderStyle: dashed;">
            <a-icon type="plus" />添加班级
          </a-tag>
          <template v-for="tag in classList">
            <a-tag color="blue" :key="tag.classCode" :closable="true" :afterClose="() => classClose(tag)">
              {{ tag.gradeName }}{{ userInfo.schoolType === '8' || userInfo.schoolType === '9' ? tag.subjectName : '' }}{{ tag.className }}
            </a-tag>
          </template>
        </div>
      </a-form-item>
      <a-form-item label="正文" :label-col="{ span: 5 }" :wrapper-col="{ span: 10 }">
        <a-textarea
          style="height:200px"
          v-model="count"
          maxlength="600"
          placeholder="请输入正文"
          v-decorator="[
            'content',
            { initialValue: appForm.content, rules: [{ required: true, message: '请输入正文', whitespace: true }] }
          ]"
        />
      </a-form-item>
      <a-form-item label="开启全屏通知" :label-col="{ span: 5 }" :wrapper-col="{ span: 10 }">
        <a-switch checked-children="开" un-checked-children="关" @change="change()" v-model="appForm.showFull" />
      </a-form-item>
      <a-form-item label="全屏日期" :label-col="{ span: 5 }" :wrapper-col="{ span: 10 }" v-if="isShow">
        <a-range-picker
          v-decorator="[
            'time',
            { initialValue: [appForm.startTime, appForm.endTime], rules: [{ required: true, message: '请选择时间' }] }
          ]"
          :showTime="{ format: 'HH:mm' }"
          format="YYYY-MM-DD HH:mm"
          @change="onChange"
          @ok="onOk"
        />
      </a-form-item>
      <a-form-item>
        <div :style="{ textAlign: 'center', marginTop: '-5px' }">
          <a-button style="margin-right:10px; background-color: #ccc; color:#fff" @click="cancle">取消</a-button>
          <a-button class="edit-action-btn" style="margin-right:10px" @click="previewClick">预览</a-button>
          <a-button class="add-btn" @click="handleSubmit" :loading="state.loginBtn" :disabled="state.loginBtn"
            >发布公告</a-button
          >
        </div>
      </a-form-item>
    </a-form>
    <a-modal v-model="previewVisible" :destroyOnClose="true" width="900px" :footer="null">
      <div style="text-align: center;">
        <h2>{{ appForm.title }}</h2>
        <p>发布时间：{{ this.getDateTime(new Date(), 1) }}</p>
        <div style="background-color: #ebeef5; height: 1px; border: none;"></div>
        <div style="min-height: 300px;">
          <p style="text-align: left; margin-top: 10px; text-indent: 30px;">
            {{ appForm.content }}
          </p>
        </div>
      </div>
    </a-modal>
    <choose-user
      chooseType="common"
      ref="chooseUser"
      :teacherList="teacherList"
      is-check
      v-if="userTag"
      v-model="userTag"
      @submit="chooseUser"
      title="添加教职工"
    >
    </choose-user>
    <choose-class
      ref="chooseClass"
      is-check
      v-model="studentTag"
      v-if="studentTag"
      @submit="chooseClass"
      :classList="classList"
      title="添加班级"
    ></choose-class>
  </div>
</template>

<script>
import moment from 'moment'
import { mapState, mapActions } from 'vuex'
import ChooseClass from '@c/choose/ChooseClass'
import ChooseUser from '@c/ChooseUser'
import { Switch } from 'ant-design-vue'
export default {
  name: 'Addnotice',
  components: {
    ChooseClass,
    ChooseUser,
    ASwitch: Switch
  },
  data() {
    return {
      moment,
      form: this.$form.createForm(this),
      appForm: {
        schoolCode: '',
        title: '',
        content: '',
        createBy: '',
        name: '',
        showFull: false,
        startTime: '',
        endTime: ''
      },
      previewVisible: false,
      state: {
        time: 60,
        loginBtn: false,
        loginType: 0,
        smsSendBtn: false
      },
      loading: false,
      placeholder: '请选择班级',
      detailInfo: {},
      userTag: false,
      teacherList: [],
      classList: [],
      studentTag: false,
      userList: [],
      classCodeList: [],
      orders: '',
      count: '',
      schoolYearId: '',
      openWarn: false,
      openWarnEnd: false,
      isShow: false
    }
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
  created() {
    this.getDetail()
  },
  watch: {
    orders(val) {
      if (val.length >= 30) {
        this.$message.warning('标题字数不能超过30!')
      }
    },
    count(val) {
      if (val.length >= 600) {
        this.$message.warning('正文字数不能超过600!')
      }
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  methods: {
    ...mapActions('home', ['addNotice', 'updateNotice', 'getNoticeDetail', 'getTeaList', 'getStuList']),
    change() {
      if (this.appForm.showFull === false) {
        this.isShow = false
      } else {
        this.isShow = true
      }
    },
    chooseUser(teacherList) {
      this.teacherList = teacherList
      this.$refs.chooseUser.reset()
    },
    chooseClass(classInfo) {
      this.classList = classInfo.map(el => {
        return {
          classCode: el.classCode,
          className: el.className,
          gradeName: el.gradeName,
          gradeCode: el.gradeCode,
          schoolYearId: el.schoolYearId,
          subjectName: el.subjectName,
          subjectCode: el.subjectCode
        }
      })
      this.$refs.chooseClass.reset()
    },

    userClose(removedTag) {
      this.teacherList = this.teacherList.filter(tag => tag !== removedTag)
    },
    classClose(removedTag) {
      this.classList = this.classList.filter(tag => tag !== removedTag)
    },
    teacherSelect() {
      this.userTag = true
      setTimeout(() => {
        this.$refs.chooseUser.chooseList = this.teacherList.map(el => {
          return el.userCode
        })
        this.$refs.chooseUser.totalList = this.teacherList.map(el => {
          return {
            ...el
          }
        })
      }, 100)
    },
    studentSelect() {
      this.studentTag = true
    },
    onChange(value, dateString) {
      this.appForm.startTime = dateString[0]
      this.appForm.endTime = dateString[1]
    },
    onOk(value) {
      this.appForm.startTime = moment(value[0]).format('YYYY-MM-DD HH:mm')
      this.appForm.endTime = moment(value[1]).format('YYYY-MM-DD HH:mm')
    },
    handleSubmit(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          if (this.teacherList.length === 0 && this.classList.length === 0) {
            this.$message.warning('请选择发布对象')
            return
          }
          if (this.classList.length !== 0) {
            this.schoolYearId = this.classList[0].schoolYearId
          }
          this.classCodeList = []
          this.classList.forEach(el => {
            this.classCodeList.push(el.classCode)
          })
          this.userList = []
          this.teacherList.forEach(el => {
            this.userList.push(el.userCode)
          })
          if (Number(this.$route.query.type) === 1) {
            const req = {
              schoolCode: this.userInfo.schoolCode,
              createBy: this.userInfo.userName,
              content: values.content,
              title: values.title,
              id: this.detailInfo.id,
              userCodes: this.userList,
              classCodes: this.classCodeList,
              schoolYearId: this.schoolYearId,
              showFull: this.appForm.showFull === true ? 1 : 2,
              fullEnd: this.appForm.endTime,
              fullStart: this.appForm.startTime,
              creatorCode: this.userInfo.userCode
            }
            this.updateNotice(req).then(res => {
              this.$message.success('修改成功')
              this.$tools.goNext(() => {
                this.$router.push({
                  path: '/SchoolNotice'
                })
              })
            })
          } else {
            const req = {
              schoolCode: this.userInfo.schoolCode,
              createBy: this.userInfo.userName,
              content: values.content,
              title: values.title,
              userCodes: this.userList,
              classCodes: this.classCodeList,
              schoolYearId: this.schoolYearId,
              showFull: this.appForm.showFull === true ? 1 : 2,
              fullEnd: this.appForm.endTime,
              fullStart: this.appForm.startTime,
              creatorCode: this.userInfo.userCode
            }
            this.addNotice(req).then(res => {
              this.$message.success('添加成功')
              this.$tools.goNext(() => {
                this.$router.push({
                  path: '/SchoolNotice'
                })
              })
            })
          }
        }
      })
    },
    async getDetail() {
      const id = this.$route.query.id
      if (Number(this.$route.query.type) === 1) {
        const res = await this.getNoticeDetail(id)
        this.detailInfo = res.data
        this.teacherList = res.data.noticeUserList
        this.classList = res.data.noticeClassList
        this.appForm.title = this.detailInfo.title
        this.appForm.content = this.detailInfo.content
        if (this.detailInfo.showFull === '1') {
          this.appForm.showFull = true
          this.isShow = true
        } else {
          this.appForm.showFull = false
          this.isShow = false
        }
        if (res.data.fullStart != null) {
          this.appForm.startTime = moment(new Date(res.data.fullStart), 'YYYY-MM-DD HH:ss')
        }
        if (res.data.fullEnd != null) {
          this.appForm.endTime = moment(new Date(res.data.fullEnd), 'YYYY-MM-DD HH:ss')
        }
      }
    },
    cancle() {
      this.$router.push({
        path: '/SchoolNotice'
      })
    },
    // 点击预览
    previewClick() {
      this.form.validateFields((err, values) => {
        if (!err) {
          this.appForm.title = values.title
          this.appForm.content = values.content
          this.previewVisible = true
        }
      })
    },
    getDateTime(date) {
      if (date === '' || date === null) {
        return '--'
      }
      const d = new Date(date)
      return (
        d.getFullYear() +
        '-' +
        (d.getMonth() + 1 > 9 ? d.getMonth() + 1 : '0' + (d.getMonth() + 1)) +
        '-' +
        (d.getDate() > 9 ? d.getDate() : '0' + d.getDate()) +
        ' ' +
        (d.getHours() > 9 ? d.getHours() : '0' + d.getHours()) +
        ':' +
        (d.getMinutes() > 9 ? d.getMinutes() : '0' + d.getMinutes()) +
        ':' +
        (d.getSeconds() > 9 ? d.getSeconds() : '0' + d.getSeconds())
      )
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
