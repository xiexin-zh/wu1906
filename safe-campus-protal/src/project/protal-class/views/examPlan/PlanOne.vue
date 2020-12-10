<template>
  <div class="plan-one qui-fx-f1">
    <a-row type="flex" align="middle" style="margin-top: 20px">
      <a-col :span="3" class="qui-tx-r">计划名称：</a-col>
      <a-col :span="10">
        <a-input placeholder="请输入计划名称" v-model="name" :disabled="isDetail" />
      </a-col>
    </a-row>
    <a-row type="flex" align="middle" style="margin-top: 20px">
      <a-col :span="3" class="qui-tx-r">考试年级：</a-col>
      <a-col :span="10">
        <a-select v-model="gradeCode" style="width: 150px" :disabled="isDetail">
          <a-select-option value>请选择</a-select-option>
          <a-select-option :value="grade.code" v-for="grade in gradeList" :key="grade.code">
            {{ grade.name }}
          </a-select-option>
        </a-select>
      </a-col>
    </a-row>
    <a-row type="flex" align="middle" style="margin-top: 20px">
      <a-col :span="3" class="qui-tx-r">考试学科：</a-col>
      <a-col :span="10">
        <a-checkbox-group :disabled="isDetail" v-model="checkedList" :options="plainOptions" />
      </a-col>
    </a-row>
    <a-row v-if="!isDetail" type="flex" align="middle" style="margin-top: 40px">
      <a-col :span="3"></a-col>
      <a-col :span="10">
        <a-button @click="submitPlan" type="primary">保存并进行下一步</a-button>
      </a-col>
    </a-row>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
export default {
  name: 'PlanOne',
  props: {
    isDetail: {
      type: Boolean,
      default: true
    },
    id: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      subjectList: [], // 所有学科
      name: '',
      gradeList: '',
      gradeCode: '',
      checkedList: [], // 当前选中学科
      plainOptions: [] // 所有学科
    }
  },
  computed: {
    ...mapState('home', ['userInfo', 'loginType'])
  },
  async mounted() {
    try {
      const res = await this.getSubject({ schoolCode: this.userInfo.schoolCode })
      this.subjectList = res.data
      this.plainOptions = res.data.map(item => {
        return item.subjectName
      })
      if (this.id) {
        this.showDetail(this.id)
      }
    } catch (err) {}
    const gradeRes = await this.getGradeData({ schoolCode: this.userInfo.schoolCode })
    this.gradeList = gradeRes.data.list
    const yearRes = await this.getYearId({
      schoolCode: this.userInfo.schoolCode
    })
    this.schoolYearId = yearRes.data.list.length > 0 ? yearRes.data.list[0].id : ''
  },
  methods: {
    ...mapActions('home', ['getplanDetail', 'addPlanExam', 'getSubject', 'getGradeData', 'getyearList', 'getYearId']),
    async submitPlan() {
      if (this.gradeCode === '' || this.name === '' || this.checkedList.length === 0) {
        this.$message.warning('请填写完整信息')
        return
      }
      const gradeName = this.gradeList.filter(item => {
        return item.code === this.gradeCode
      })[0].name
      const subjectDtoList = this.subjectList
        .filter(item => {
          return this.checkedList.indexOf(item.subjectName) > -1
        })
        .map(item => {
          return {
            id: '',
            subjectName: item.subjectName,
            subjectId: item.id,
            subjectCode: item.subjectCode
          }
        })
      try {
        const res = await this.addPlanExam({
          schoolYearId: this.schoolYearId,
          schoolCode: this.userInfo.schoolCode,
          createUserCode: this.loginType.userCode,
          createUserName: this.loginType.userName,
          id: this.id,
          name: this.name,
          gradeCode: this.gradeCode,
          gradeName: gradeName,
          subjectDtoList: subjectDtoList
        })
        window.sessionStorage.setItem('gradeCode', this.gradeCode)
        this.$emit('goNext', 1, res.data)
      } catch (err) {}
    },
    async showDetail(id) {
      const res = await this.getplanDetail(id)
      this.name = res.data.name
      this.gradeCode = res.data.gradeCode
      window.sessionStorage.setItem('gradeCode', res.data.gradeCode)
      this.checkedList = res.data.subjectDtoList.map(item => {
        return item.subjectName
      })
      // this.$emit('goNext', 1, id)
    }
  }
}
</script>
