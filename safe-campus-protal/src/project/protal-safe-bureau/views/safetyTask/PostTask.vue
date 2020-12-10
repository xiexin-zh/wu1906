<template>
  <div class="post-task page-layout bg-fff qui-fx-ver">
    <a-form :form="form">
      <a-form-item v-bind="formItemLayout" label="任务名称" required>
        <a-input
          placeholder="请输入任务名称"
          :disabled="true"
          v-decorator="[
            'taskName',
            { initialValue: taskName, rules: [{max: 20,required: false, message: '临时任务' } ]}
          ]"
        />
      </a-form-item>
      <a-form-item label="接受学校：" v-bind="formItemLayout" required>
        <a-input
          @click="scoloolChange"
          placeholder="请选择接受学校"
          v-decorator="[
            'specificIndicators',
            { initialValue: specificIndicators, rules: [ {required: true, message: '请选择专项指标' } ]}
          ]"
        />
      </a-form-item>
      <a-form-item v-bind="formItemLayout" label="限定职务：" required>
        <a-select
          mode="multiple"
          v-decorator="[
            'checkJobList',
            { initialValue: appForm.leaderName, rules: [{ required: true, message: '请选择负责人' }] },
          ]"
          @change="handleChange"
          placeholder="请选择您要限定的职务，可多选"
        >
          <a-select-option v-for="list in jobList" :key="`${list.jobName}`">
            {{ list.jobName }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item v-bind="formItemLayout" :style="{ textAlign: 'center' }">
        <a-button @click="cancel">取消</a-button>
        <a-button class="mar-l10" type="primary" @click="submitOk" :disabled="isLoad">确定</a-button>
      </a-form-item>
    </a-form>
    <!-- 选择接受学校 -->
    <choose-school
      type="edu"
      is-check
      :teacherList="chooseTeachersDeatil"
      ref="ChooseSchool"
      v-if="schoolTag"
      v-model="schoolTag"
      @submit="submitSchool"
      title="选择学校"
    >
    </choose-school>

  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import ChooseSchool from '../../component/ChooseSchool'
export default {
  name: 'PostTask',
  components: {
    ChooseSchool
  },
  data() {
    this.peopleList = []

    return {
      taskName: this.$route.query.taskName,
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
        supervisionTeam: ''
      },
      specificIndicators: ''
    }
  },
  computed: {
    ...mapState('home', ['userInfo', 'eduCode'])
  },
  async created() {
    this.taskId = this.$route.query.id
    this.publisherCode = this.$route.query.publisherCode
    this.publisherName = this.$route.query.publisherName
    this.taskCode = this.$route.query.taskCode
  },
  async mounted() {
  },
  methods: {
    ...mapActions('home', ['taskPublish', 'getQueryjob', 'schoolorJobSearchPeople', 'testTask']),
    // 选择学校，负责人
    scoloolChange(value) {
      this.schoolTag = true
    },
    async submitSchool(values) {
      this.chooseTeachersDeatil = values
      const names = values.map(v => v.schoolName) + ''
      this.form.setFieldsValue({ specificIndicators: names })
      this.SchoolAll = values
      this.$refs.ChooseSchool.reset()
      if (values.length === 0) return
      this._getJobAll(values[0].schoolCode) // 用第一个学校查所有的学校预设职务
    },
    // 获取职务基础数据
    async _getJobAll(schoolCode) {
      const req = {
        eduCode: schoolCode,
        category: '03' // 平台03-校端 04-局端
      }
      const res = await this.getQueryjob(req)
      this.jobList = res.data
    },
    // 选中职务
    handleChange(values) {
      if (values.length <= 0) return
      this.searchPeople(values, this.SchoolAll)
    },
    // 根据选中的学校职务找人
    async searchPeople(JobNames, SchoolCodes) {
      const req = {
        schoolCodes: SchoolCodes.map(v => v.schoolCode).join(','),
        jobNames: JobNames.join(',')
      }
      const res = await this.schoolorJobSearchPeople(req)
      this.peopleList = res.data
    },
    submitOk(e) {
      e.preventDefault()
      this.form.validateFields((error, values) => {
        this.isLoad = false
        if (!error) {
          const req = {
            publisherCode: this.publisherCode,
            publisherName: this.publisherName,
            taskId: this.taskId,
            users: this.peopleList
          }
          this.isLoad = true
          this.taskPublish(req)
            .then(res => {
              this.$message.success('操作成功')
              // this._testTask()
              this.$tools.goNext(() => {
                this.$router.go(-1)
              })
            })
            .catch(res => {
              this.isLoad = false
            })
        }
      })
    },
    // 生成任务
    _testTask() {
      this.testTask(this.taskCode)
    },
    cancel() {
      this.$router.go(-1)
    }
  }
}
</script>
<style lang="less" scoped>
.post-task {
  padding: 20px;
}
</style>
