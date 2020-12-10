<template>
  <div class="post-task page-layout bg-fff qui-fx-ver">
    <a-form :form="form">
      <a-form-item v-bind="formItemLayout" label="任务名称" required>
        <a-input
          :disabled="true"
          v-decorator="[
            'taskName',
            { initialValue: taskName}
          ]"
        />
      </a-form-item>
      <a-form-item label="接收人员" v-bind="formItemLayout" required>
        <div>
          <template v-for="tag in userList">
            <a-tag :key="tag.userCode" :closable="true" :close="() => userClose(tag,'adminList')">
              {{ tag.userName }}
            </a-tag>
          </template>
          <a-tag style="background: #fff; borderStyle: dashed;" @click="addTag" > <a-icon type="plus" />添加 </a-tag>
        </div>
      </a-form-item>
      <a-form-item v-bind="formItemLayout" :style="{ textAlign: 'center'}">
        <a-button @click="cancel">取消</a-button>
        <a-button class="mar-l10" type="primary" @click="submitOk" :disabled="isLoad">保存</a-button>
      </a-form-item>
    </a-form>
    <choose-user
      ref="chooseUser"
      is-check
      v-if="userTag"
      v-model="userTag"
      @submit="chooseUser"
      :teacherList="chooseTeachersDeatil"
      title="添加人员">
    </choose-user>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import SubmitForm from '../../component/SubmitForm'
import ChooseUser from '@c/choose/ChooseUser'
export default {
  name: 'PostTask',
  components: {
    SubmitForm,
    ChooseUser
  },
  data() {
    this.peopleList = []
    return {
      taskName: '',
      form: this.$form.createForm(this),
      SchoolAll: [],
      jobList: [], // 职务集合
      formItemLayout: {
        labelCol: { span: 6 },
        wrapperCol: { span: 16 }
      },
      // 选择学校
      schoolTag: false,
      chooseTeachersDeatil: [],
      // xiaozuData,
      isLoad: false,
      appForm: {
        supervisionTeam: '',
        specificIndicators: ''
      },
      adminList: [],
      userTag: false,
      userList: []
    }
  },
  computed: {
    ...mapState('home', ['userInfo', 'eduCode'])
  },
  async created() {
  },
  async mounted() {
    this.taskId = this.$route.query.id
    this.taskName = this.$route.query.name
  },
  methods: {
    ...mapActions('home', ['postSchoolTask']),
    // 授权查看人删除
    userClose(removedTag) {
      this.userList = this.userList.filter(tag => tag !== removedTag)
    },
    // 点击添加人员
    addTag() {
      this.userTag = true
      setTimeout(() => {
        this.$refs.chooseUser.chooseList = this.userList.map(el => {
          return el.userId ? el.userId : el.id
        })
        this.$refs.chooseUser.totalList = this.userList.map(el => {
          return {
            ...el,
            detailId: el.id,
            id: el.userId ? el.userId : el.id
          }
        })
      }, 100)
    },
    // 授权查看人选择
    chooseUser(userList) {
      this.userList = userList
      this.chooseTeachersDeatil = userList
      this.$refs.chooseUser.reset()
    },
    // 提交
    submitOk(e) {
      e.preventDefault()
      this.form.validateFields((error, values) => {
        this.isLoad = false
        if (!error) {
          if (this.userList.length === 0) {
            this.$message.warning('请选择接收人员')
            return false
          }
          values.publisherCode = this.userInfo.userCode
          values.publisherName = this.userInfo.userName
          values.users = this.userList.map(el => {
            return {
              ...el,
              schoolCode: this.userInfo.schoolCode,
              schoolName: this.userInfo.schoolName
            }
          })
          values.taskId = this.taskId
          this.isLoad = true
          this.postSchoolTask(values)
            .then((res) => {
              this.$message.success('操作成功')
              this.$tools.goNext(() => {
                this.$router.go(-1)
              })
            })
            .catch((res) => {
              this.isLoad = false
            })
        }
      })
    },
    cancel() {
      this.$router.go(-1)
    }
  },
  watch: {
    chooseTeachersDeatil(val) {
      console.log(val)
    }
  }
}
</script>
<style lang="less" scoped>
.post-task {
  padding: 20px;
}
</style>
