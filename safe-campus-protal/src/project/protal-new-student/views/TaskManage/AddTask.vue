<template>
  <div class="add-booking page-layout qui-fx-ver">
    <a-form :form="form" :style="{ maxHeight: maxHeight, overflow: 'auto' }">
      <a-form-item label="任务名称" :label-col="{ span: 3 }" :wrapper-col="{ span: 5 }">
        <a-input
          placeholder="请输入任务名称，限50字符"
          :maxLength="50"
          v-decorator="[
            'taskName',
            { initialValue: formData.taskName, rules: [{ required: true, message: '请输入任务名称' }] }
          ]"
          @change="changeTaskName"
        />
      </a-form-item>
      <a-form-item label="年级" :label-col="{ span: 3 }" :wrapper-col="{ span: 8 }" :required="true">
        <div style="display: flex">
          <a-select
            v-decorator="['grade', { rules: [{ required: true, message: '请选择年级' }] }]"
            placeholder="请选择年级"
            @change="handleChangeGrade"
            style="width: 150px; margin-right: 20px"
          >
            <a-select-option v-for="item in options" :key="item.id"> {{ item.gradeName }} </a-select-option>
          </a-select>
          <span class="grade-warning">*确定已在基础数据中添加新学年及专业</span>
        </div>
      </a-form-item>
      <a-form-item label="招生专业" :label-col="{ span: 3 }" :wrapper-col="{ span: 5 }" :required="true">
        <a-button type="primary" @click="selectProject"> 选择专业 </a-button>
        <a-table :columns="columns" :data-source="selectList" :pagination="false">
          <template slot="inputCount" slot-scope="count, record">
            <a-input
              :value="count"
              type="number"
              min="0"
              @change="(e) => handleChangeCount(e.target.value, record.subjectCode)"
            />
          </template>
        </a-table>
      </a-form-item>
      <a-form-item label="招生截止时间" :label-col="{ span: 3 }" :wrapper-col="{ span: 5 }" :required="true">
        <a-date-picker
          @change="onChangeDate"
          placeholder="年/月/日"
          :disabled-date="disabledDate"
          v-decorator="[
            'endTime',
            { initialValue: formData.endTime, rules: [{ required: true, message: '请选择截止时间' }] }
          ]"
        />
      </a-form-item>
      <a-form-item :wrapper-col="{ span: 15, offset: 3 }">
        <a-button type="primary" style="width: 100px; height: 40px; margin-top: 50px" @click="handleSubmit">
          保存
        </a-button>
      </a-form-item>
    </a-form>
    <select-project
      :title="title"
      :visible="showProjectList"
      :projectList="projectList"
      :grade="grade"
      @submit="getProjectList"
      @cancel="cancelProject"
      @clickSelect="clickSelect"
    ></select-project>
  </div>
</template>

<script>
import TableList from '@c/TableList'
import SelectProject from '../../component/SelectProject.vue'
import { mapState, mapActions } from 'vuex'
import moment from 'moment'
import Tools from '@u/tools'
const columns = [
  {
    title: '专业',
    dataIndex: 'subjectName'
  },
  {
    title: '招生人数',
    dataIndex: 'count',
    scopedSlots: {
      customRender: 'inputCount'
    }
  }
]
export default {
  name: 'AddTask',
  components: {
    moment,
    TableList,
    SelectProject
  },
  data() {
    return {
      formData: {
        taskName: '',
        siteName: '请选择年级',
        endTime: moment(new Date(), 'YYYY/MM/DD')
      },
      form: this.$form.createForm(this),
      maxHeight: 0,
      showProjectList: false,
      title: '选择专业',
      grade: '',
      projectList: [],
      selectList: [],
      columns,
      gradeList: []
    }
  },
  created() {
    this.gradeList = JSON.parse(sessionStorage.getItem('gradeList') || '[]')
  },
  computed: {
    ...mapState('home', ['userInfo']),
    options() {
      return JSON.parse(sessionStorage.getItem('gradeList') || '[]')
    }
  },
  async mounted() {
    this.maxHeight = window.screen.height - 280 + 'px'
    const taskId = Number(this.$route.query.id)
    if (taskId) {
      const res = await this.taskDetailById(taskId)
      if (res && res.data) {
        this.grade = res.data.gradeNum
        this.form.setFieldsValue({
          taskName: res.data.taskName,
          grade: res.data.gradeNum,
          endTime: moment(res.data.closingDate)
        })
        this.formData.endTime = moment(res.data.closingDate)
        const selectList = res.data.majorList.map((item) => {
          return {
            ...item,
            subjectCode: item.majorCode,
            subjectName: item.majorName,
            count: item.studentNum,
            checked: true
          }
        })
        this.selectList = selectList
        this.getGrade(selectList)
      }
    } else {
      this.getGrade()
    }
  },
  methods: {
    ...mapActions('home', ['addTask', 'getAllGrade', 'taskDetailById', 'editTask']),
    handleChangeCount(val, subjectCode) {
      if (!subjectCode) {
        return
      }
      this.selectList = this.selectList.map((item) => {
        if (item.subjectCode === subjectCode) {
          return {
            ...item,
            count: Number(val)
          }
        }
        return item
      })
    },
    changeTaskName(e) {
      this.formData.taskName = e.target.value
    },
    // 切换年级
    handleChangeGrade(val) {
      this.form.setFieldsValue({
        grade: val
      })
      const gradeName = Tools.getGradeName(val, this.gradeList)
      this.grade = gradeName
    },
    selectProject() {
      this.showProjectList = true
    },
    getProjectList(list) {
      this.selectList = list
      this.showProjectList = false
    },
    cancelProject() {
      this.showProjectList = false
    },
    // 选择专业
    clickSelect(majorCode) {
      this.projectList = this.projectList.map((item) => {
        if (item.subjectCode === majorCode) {
          return {
            ...item,
            checked: !item.checked
          }
        }
        return item
      })
    },
    // 改变时间
    onChangeDate(time) {
      this.formData.endTime = time
    },
    // 获取专业列表
    async getGrade(selectList = []) {
      const req = {
        schoolCode: this.userInfo.schoolCode,
        subjectName: '',
        page: 1,
        size: 9999
      }
      const res = await this.getAllGrade(req)
      if (res && res.code === 200) {
        const list =
          res.data.records.length === 0
            ? []
            : res.data.records.map((item) => {
                return {
                  ...item,
                  count: 0,
                  checked: false
                }
              })
        if (list.length === 0) {
          this.projectList = list
        } else {
          this.projectList = [
            ...list.map((item) => {
              return {
                ...item,
                checked: this.filterData(item.subjectCode, selectList).checked || false,
                count: this.filterData(item.subjectCode, selectList).studentNum || 0
              }
            })
          ]
        }
      }
    },
    filterData(subjectCode, list) {
      if (!subjectCode || list.length === 0) {
        return []
      }
      const arr = list.filter((item) => {
        return item.subjectCode === subjectCode
      })
      if (arr.length > 0) {
        return arr[0]
      }
      return []
    },
    // 提交
    handleSubmit(e) {
      e.preventDefault()
      this.form.validateFields(async (err, values) => {
        if (!err) {
          if (this.formData.taskName.length > 50) {
            this.$message.error('任务名称限制在50字符以内')
            return
          }
          if (this.selectList.length === 0) {
            this.$message.error('请选择专业')
            return
          }
          const taskId = Number(this.$route.query.id)
          if (taskId) {
            const params = {
              closingDate: new Date(`${Tools.getDate(new Date(this.formData.endTime), 1)} 23:59:59`).getTime(),
              gradeNum: Tools.getGradeName(this.form.getFieldValue('grade'), [...this.gradeList]) || this.grade,
              id: taskId,
              majorList: this.selectList.map((item) => {
                return {
                  majorCode: item.subjectCode,
                  majorName: item.subjectName,
                  studentNum: item.count
                }
              }),
              taskName: this.form.getFieldValue('taskName')
            }
            const result = await this.editTask(params)
            if (result.code === 200) {
              this.$message.success('修改成功')
              this.$router.push({
                path: '/taskManage'
              })
            } else {
              this.$message.error(res.message || '修改失败')
            }
            return
          }
          const req = {
            schoolCode: this.userInfo.schoolCode,
            taskName: this.formData.taskName,
            closingDate: new Date(`${Tools.getDate(new Date(this.formData.endTime), 1)} 23:59:59`).getTime(),
            createUserCode: this.userInfo.userCode,
            createUserName: this.userInfo.userName,
            gradeNum: Tools.getGradeName(this.form.getFieldValue('grade'), [...this.gradeList]),
            majorList: this.selectList.map((item) => {
              return {
                majorCode: item.subjectCode,
                majorName: item.subjectName,
                studentNum: item.count
              }
            })
          }
          const res = await this.addTask(req)
          if (res && res.code === 200) {
            this.$message.success('添加成功')
            this.$router.push({
              path: '/taskManage'
            })
          } else {
            this.$message.error(res.message || '添加失败')
          }
        }
      })
    },
    // 禁止选择已过时间
    disabledDate(current) {
      return current && current < moment().endOf('day')
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
