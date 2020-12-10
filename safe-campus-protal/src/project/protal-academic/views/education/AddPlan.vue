<template>
  <div class="add-booking page-layout qui-fx-ver">
    <a-form :form="form" :style="{ maxHeight: maxHeight, overflow: 'auto' }">
      <a-form-item label="教学计划" :label-col="{ span: 3 }" :wrapper-col="{ span: 5 }">
        <a-input
          placeholder="请输入任务名称，限20字符"
          :maxLength="20"
          v-decorator="[
            'planName',
            {
              initialValue: formData.planName,
              rules: [{ required: true, message: '请输入任务名称' }]
            }
          ]"
          @change="changePlanName"
        />
      </a-form-item>
      <a-form-item
        label="学年"
        :label-col="{ span: 3 }"
        :wrapper-col="{ span: 5 }"
        :required="true"
      >
        <a-select
          v-decorator="['schoolYear', { rules: [{ required: true, message: '请选择学年' }] }]"
          placeholder="请选择学年"
          @change="changeSchoolYear"
        >
          <a-select-option v-for="item in schoolYearList" :key="item.id">
            {{ item.schoolYear }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item
        v-if="isHighSchool"
        label="学期"
        :label-col="{ span: 3 }"
        :wrapper-col="{ span: 5 }"
        :required="true"
      >
        <a-select
          v-decorator="['semester', { rules: [{ required: true, message: '请选择学期' }] }]"
          placeholder="请选择学期"
        >
          <a-select-option v-for="item in semesterList" :value="item.semesterName" :key="item.id">
            {{ item.semesterName }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item
        label="开始日期"
        :label-col="{ span: 3 }"
        :wrapper-col="{ span: 5 }"
        :required="true"
      >
        <a-date-picker
          @change="onChangeStartDate"
          placeholder="年/月/日"
          v-decorator="[
            'startTime',
            {
              initialValue: formData.startTime,
              rules: [{ required: true, message: '请选择开始时间' }]
            }
          ]"
        />
      </a-form-item>
      <a-form-item
        label="结束日期"
        :label-col="{ span: 3 }"
        :wrapper-col="{ span: 5 }"
        :required="true"
      >
        <a-date-picker
          @change="onChangeEndDate"
          placeholder="年/月/日"
          :disabled-date="disabledDate1"
          v-decorator="[
            'endTime',
            {
              initialValue: formData.endTime,
              rules: [{ required: true, message: '请选择结束时间' }]
            }
          ]"
        />
      </a-form-item>
      <a-form-item
        :label="isHighSchool ? '适用专业' : '适用年级'"
        :label-col="{ span: 3 }"
        :wrapper-col="{ span: 10 }"
        :required="true"
      >
        <a-checkbox-group
          :options="gradeList"
          @change="onSelectGrade"
          v-decorator="[
            'selectGrade',
            {
              initialValue: formData.selectGrade,
              rules: [{ required: true, message: isHighSchool ? '请选择专业' : '请选择年级' }]
            }
          ]"
        >
          <span slot="label" slot-scope="{ value }" style="color: red">{{ value }}</span>
        </a-checkbox-group>
      </a-form-item>
      <a-form-item
        label="课程设置"
        :label-col="{ span: 3 }"
        :wrapper-col="{ span: 10 }"
        :required="true"
      >
        <div>
          <div><a-button type="primary" @click="addProject"> 添加 </a-button></div>
          <div>
            <a-table
              :columns="columns"
              :scroll="{ y: this.$tools.setScroll('tableList') }"
              :data-source="selectList"
              :rowKey="(record) => record.id"
              :pagination="false"
            >
              <template slot="index" slot-scope="text, record, index">
                {{ index | getPageIndex(pageList) }}
              </template>
              <template slot="action" slot-scope="text, record">
                <a-tooltip placement="topLeft" title="删除">
                  <a-button
                    size="small"
                    class="del-action-btn"
                    icon="delete"
                    @click="deleteSubject(record.id)"
                  ></a-button>
                </a-tooltip>
              </template>
            </a-table>
          </div>
        </div>
      </a-form-item>
      <a-form-item :wrapper-col="{ span: 8, offset: 3 }">
        <a-button
          type="primary"
          style="width: 100px; height: 40px; margin-top: 50px; margin-right: 50px"
          @click="handleCancel"
        >
          取消
        </a-button>
        <a-button
          type="primary"
          style="width: 100px; height: 40px; margin-top: 50px"
          @click="handleSubmit"
        >
          保存
        </a-button>
      </a-form-item>
    </a-form>
    <ClassHour
      :visible="classVisible"
      @cancelClass="cancelClass"
      @submitClass="submitClass"
      :subjectList="subjectList"
    />
  </div>
</template>

<script>
import TableList from '@c/TableList'
import { mapState, mapActions } from 'vuex'
import moment from 'moment'
import Tools from '@u/tools'
import ClassHour from '../../component/ClassHour.vue'
const columns = [
  {
    title: '序号',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '课程名称',
    dataIndex: 'subjectName'
  },
  {
    title: '周课时(节)',
    dataIndex: 'count'
  },
  {
    title: '学期总课时(节)',
    dataIndex: 'allCount'
  },
  {
    title: '操作',
    width: '10%',
    scopedSlots: {
      customRender: 'action'
    }
  }
]
export default {
  name: 'AddPlan',
  components: {
    moment,
    TableList,
    ClassHour
  },
  filters: {
    // 获取表格索引
    getPageIndex: (val, obj) => {
      if (JSON.stringify(obj) === '{}') {
        return val + 1
      } else {
        return (obj.page - 1) * obj.size + val + 1
      }
    }
  },
  data() {
    return {
      formData: {
        planName: '',
        schoolYearId: '',
        schoolYear: '',
        semester: '',
        selectGrade: [],
        startTime: moment(new Date(), 'YYYY/MM/DD'),
        endTime: moment(new Date(), 'YYYY/MM/DD')
      },
      gradeList: [],
      columns,
      pageList: {
        page: 1,
        size: 999
      },
      subjectList: [],
      schoolYearList: [],
      semesterList: [],
      selectList: [],
      form: this.$form.createForm(this),
      maxHeight: 0,
      classVisible: false,
      planId: '',
      isHighSchool: false
    }
  },
  created() {
    const loginInfo = JSON.parse(window.sessionStorage.getItem('loginInfo') || '{}')
    const isHighSchool = loginInfo.schoolType === '8' || loginInfo.schoolType === '9'
    this.isHighSchool = isHighSchool
    this.getSubject()
    this.getHighSemester()
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  async mounted() {
    this.maxHeight = window.screen.height - 280 + 'px'
    const planId = Number(this.$route.query.id)
    if (planId) {
      this.planId = planId
      this.getDetails(planId)
    }
    this.getSchoolYearList(this.isHighSchool)
    !this.isHighSchool && this.getGrade()
  },
  methods: {
    ...mapActions('home', [
      'addPlan',
      'editPlan',
      'getSchoolYear',
      'getGradeList',
      'getSubjectList',
      'getPlanDetails',
      'getHighGradeList',
      'getHighMajorList',
      'getHighYearList',
      'getPlanDetailsHigh'
    ]),
    handleCancel() {
      this.$router.go(-1)
    },
    // 获取计划详情
    async getDetails(id) {
      const res = this.isHighSchool
        ? await this.getPlanDetailsHigh({ id })
        : await this.getPlanDetails({ id })
      const { title, startDate, endDate, schoolYear, semester, gradeCodeStr, courseList } = res.data
      this.form.setFieldsValue({
        planName: title,
        schoolYear,
        semester,
        startTime: moment(new Date(startDate), 'YYYY/MM/DD'),
        endTime: moment(new Date(endDate), 'YYYY/MM/DD'),
        selectGrade: gradeCodeStr.split(',')
      })
      this.selectList = courseList.map((item) => {
        return {
          ...item,
          id: item.subjectCode,
          allCount: item.totalNum,
          count: item.weekNum
        }
      })
      if (this.isHighSchool && schoolYear) {
        this.getHighMajor(schoolYear)
      }
    },
    // 获取学科
    async getSubject() {
      const req = {
        ...this.userInfo
      }
      const res = await this.getSubjectList(req)
      if (res.data) {
        this.subjectList = res.data.map((item) => {
          return {
            ...item,
            id: item.subjectCode
          }
        })
      }
    },
    // 获取学年列表
    async getSchoolYearList(isHighSchool) {
      // 中高职
      if (isHighSchool) {
        const res = await this.getHighGradeList({ schoolCode: this.userInfo.schoolCode })
        if (res && res.code === 200) {
          this.schoolYearList = res.data
            .map((item) => {
              return {
                ...item,
                schoolYear: item.gradeName
              }
            })
            .reverse()
        }
        this.schoolYearList = res.data
          .map((item) => {
            return {
              ...item,
              schoolYear: item.gradeName
            }
          })
          .reverse()
        return
      }
      // 小初高
      const req = {
        schoolCode: this.userInfo.schoolCode
      }
      const res = await this.getSchoolYear(req)
      if (res.data.list.length === 0) return
      this.schoolYearList = res.data.list.map((item) => {
        return {
          ...item,
          schoolYear: `${item.schoolYear}(${item.semester})`
        }
      })
    },
    // 获取年级列表
    async getGrade() {
      if (this.isHighSchool) {
        return
      }
      const req = {
        schoolCode: this.userInfo.schoolCode
      }
      const res = await this.getGradeList(req)
      if (res.data.list.length === 0) return
      this.gradeList = res.data.list.map((item) => {
        return {
          ...item,
          label: item.name,
          value: item.code
        }
      })
    },
    // 获取中高职学年-学期
    async getHighSemester() {
      const req = {
        page: 1,
        size: 9999,
        schoolCode: this.userInfo.schoolCode,
        state: '',
        semesterName: ''
      }
      const res = await this.getHighYearList(req)
      if (res && res.code === 200) {
        this.semesterList = res.data.records
          .map((item) => {
            return {
              ...item,
              semesterName: `${item.schoolYearName} ${item.semesterName}`
            }
          })
          .reverse()
      }
    },
    // 提交
    handleSubmit(e) {
      e.preventDefault()
      this.form.validateFields(async (err, values) => {
        if (!err) {
          if (this.formData.planName.length > 50) {
            this.$message.error('任务名称限制在50字符以内')
            return
          }
          if (this.selectList.length === 0) {
            this.$message.error('请选择课程')
            return
          }
          const selectGrade = this.gradeList.filter((item) => {
            return (
              values.selectGrade.indexOf(item[this.isHighSchool ? 'subjectCode' : 'code']) !== -1
            )
          })
          let gradeCodeStr = ''
          let gradeNameStr = ''
          if (selectGrade.length !== 0) {
            gradeCodeStr = selectGrade
              .map((item) => item[this.isHighSchool ? 'subjectCode' : 'code'])
              .join(',')
            gradeNameStr = selectGrade
              .map((item) => item[this.isHighSchool ? 'subjectName' : 'name'])
              .join(',')
          }
          const schoolYear = this.planId
            ? values.schoolYear
            : this.schoolYearList.filter((item) => item.id === values.schoolYear)[0].schoolYear
          const req = {
            courseList: this.selectList.map((item) => {
              return {
                subjectCode: item.subjectCode,
                subjectName: item.subjectName,
                totalNum: item.allCount,
                weekNum: item.count
              }
            }),
            title: values.planName,
            createName: this.userInfo.userName,
            schoolCode: this.userInfo.schoolCode,
            startDate: new Date(values.startTime).getTime(),
            endDate: new Date(values.endTime).getTime(),
            gradeCodeStr,
            gradeNameStr,
            schoolYearId: this.schoolYearId,
            semester: this.isHighSchool ? values.semester : ''
          }
          if (this.planId) {
            req.id = this.planId
            const res = await this.editPlan(req)
            if (res && res.code === 200) {
              this.$router.go(-1)
            }
            return
          }
          const res = await this.addPlan(req)
          if (res && res.code === 200) {
            this.$router.go(-1)
          }
        }
      })
    },
    // 计划名称
    changePlanName(e) {
      this.formData.planName = e.target.value
    },
    // 修改学年
    changeSchoolYear(id) {
      this.form.setFieldsValue({
        schoolYear: id
      })
      this.schoolYearId = id
      if (this.isHighSchool) {
        this.form.setFieldsValue({
          selectGrade: []
        })
        const list = this.schoolYearList.filter((item) => {
          return item.id === id
        })
        this.schoolYearId = list[0].gradeName
        this.getHighMajor(list[0].gradeName)
      }
    },
    // 获取高职专业
    async getHighMajor(gradeName) {
      if (!gradeName) {
        return
      }
      const req = {
        schoolCode: this.userInfo.schoolCode,
        gradeName
      }
      const res = await this.getHighMajorList(req)
      if (res && res.code === 200) {
        this.gradeList = res.data.map((item) => {
          return {
            ...item,
            label: item.subjectName,
            value: item.subjectCode
          }
        })
      }
    },
    // 开始日期
    onChangeStartDate(time) {
      this.formData.startTime = time
      this.formData.endTime = ''
    },
    // 结束日期
    onChangeEndDate(time) {
      this.formData.endTime = time
    },
    // // 禁止选择已过时间
    // disabledDate(current) {
    //   return current && current < moment().endOf('day')
    // },
    disabledDate1(current) {
      return current && current < moment(this.formData.startTime).endOf('day')
    },
    // 选择年级（专业）
    onSelectGrade(item) {
      this.formData.selectGrade = item
    },
    cancelClass() {
      this.classVisible = false
    },
    submitClass(value) {
      const hasList = this.selectList.filter((item) => {
        return item.id === value.subject
      })
      if (hasList.length > 0) {
        this.selectList = this.selectList.map((item) => {
          if (item.id === value.subject) {
            return {
              ...item,
              allCount: Number(value.allCount),
              count: Number(value.count)
            }
          }
          return item
        })
      } else {
        const list = this.subjectList
          .filter((item) => {
            return item.id === value.subject
          })
          .map((item) => {
            return {
              ...item,
              allCount: Number(value.allCount),
              count: Number(value.count)
            }
          })
        this.selectList = [...this.selectList, ...list]
      }
      this.classVisible = false
    },
    // 添加课程按钮
    addProject() {
      this.classVisible = true
    },
    // 删除课时
    deleteSubject(id) {
      this.selectList = this.selectList.filter((item) => {
        return item.id !== id
      })
    }
  }
}
</script>

<style lang="less" scoped>
.add-booking {
  padding-top: 30px;
  img {
    width: 24px;
    height: 24px;
    margin: 0 10px;
    cursor: pointer;
  }
  /deep/ .ant-form-item {
    margin-bottom: 14px;
  }
}

.grade-warning {
  color: rgb(250, 16, 16);
}
</style>
