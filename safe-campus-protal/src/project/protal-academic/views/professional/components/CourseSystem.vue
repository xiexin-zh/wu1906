<template>
  <div class="course-system">
    <sub-form
      ref="form"
      @submit-form="submitForm"
      :title="formTitle"
      v-model="formStatus"
      :form-data="formData"
      :yearCount="yearCount"
      :scoreList="scoreList"
      yearTitle="周学时"
    ></sub-form>
    <div>
      <div class="table-item" v-for="item in dataList" :key="item.courseType">
        <div class="table-title">
          <div class="title-left">
            <a-icon type="caret-down" />
            <span class="title-name">{{ item.courseTypeStr }}</span>
            <span class="title-hour">学时分配：{{ item.totalNum }}</span>
            <span>所占比例：{{ item.ratio }}</span>
          </div>
          <div class="title-right">
            <a-button type="primary" icon="setting" @click="courseSet(item.courseType)">
              课程设置
            </a-button>
          </div>
        </div>
        <div class="table-list">
          <course-table
            :tableList="item.subjectList"
            :yearCount="yearCount"
            :courseType="item.courseType"
            @courseSet="courseSet"
            @delCourse="delCourse"
          ></course-table>
          <!-- <div v-else class="no-data"></div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Tools from '@/utils/tools'
import TableList from '@c/TableList'
import SubForm from '../../../component/SubForm.vue'
import CourseTable from './CourseTable.vue'
import { mapState, mapActions } from 'vuex'
const formData = [
  {
    value: 'subjectCode',
    initValue: '',
    type: 'select',
    label: '课程名称',
    placeholder: '请选择课程名称',
    list: []
  },
  {
    value: 'activityId',
    initValue: '',
    type: 'select',
    label: '教学活动',
    placeholder: '请选择教学活动',
    list: []
  },
  {
    value: 'courseProperty',
    initValue: '',
    type: 'select',
    label: '课程性质',
    placeholder: '请选择课程性质',
    list: [
      {
        key: 1,
        val: '必修'
      },
      {
        key: 2,
        val: '选修'
      }
    ]
  },
  {
    value: 'checkType',
    initValue: '',
    type: 'select',
    label: '考查类型',
    placeholder: '请选择考查类型',
    list: [
      {
        key: 1,
        val: '考试'
      },
      {
        key: 2,
        val: '考查'
      }
    ]
  },
  {
    value: 'timeList',
    type: 'yearPanel',
    placeholder: '',
    list: []
  }
]

export default {
  name: 'CourseSystem',
  components: {
    TableList,
    CourseTable,
    SubForm
  },
  props: {
    yearCount: {
      type: Number,
      default: 0
    },
    courseList: {
      type: Array,
      default: () => []
    },
    programId: {
      required: true
    }
  },
  data() {
    return {
      formTitle: '课程设置',
      formStatus: false,
      formData,
      courseType: '',
      courseItemId: '',
      scoreList: [],
      subjectList: []
    }
  },
  computed: {
    ...mapState('home', ['userInfo']),
    dataList() {
      if (this.courseList.length === 0) {
        return []
      }
      return this.courseList.map((list) => {
        return {
          ...list,
          subjectList: list.subjectList.map((item) => {
            return {
              ...item,
              ...item.numList
            }
          })
        }
      })
    }
  },
  created() {
    this.getSubject()
    this.getActivity()
  },
  mounted() {},
  methods: {
    ...mapActions('home', [
      'getSubjectList',
      'getSchemeActivity',
      'addSchemeCourse',
      'editSchemeCourse',
      'delSchemeCourse'
    ]),
    async getSubject() {
      const res = await this.getSubjectList({
        schoolCode: this.userInfo.schoolCode
      })
      if (res && res.code === 200) {
        this.subjectList = res.data
        this.formData[0].list = res.data.map((item) => {
          return {
            ...item,
            key: item.subjectCode,
            val: item.subjectName
          }
        })
      }
    },
    async getActivity() {
      const res = await this.getSchemeActivity({ schemeId: this.programId })
      if (res && res.code === 200) {
        this.formData[1].list = res.data
          .map((item) => {
            return {
              ...item,
              key: item.id,
              val: item.title
            }
          })
          .filter((item) => item.title !== '合计')
      }
    },
    courseSet(type, id, record) {
      this.courseType = type
      this.courseItemId = id || ''
      if (id) {
        const { itemObj, subjectCode, activityId, courseProperty, checkType } = record
        this.formData[0].initValue = subjectCode
        this.formData[1].initValue = String(activityId)
        this.formData[2].initValue = courseProperty
        this.formData[3].initValue = checkType
        const scoreList = []
        for (let val in itemObj) {
          scoreList.push(itemObj[val])
        }
        this.scoreList = scoreList
      } else {
        this.formData[0].initValue = ''
        this.formData[1].initValue = ''
        this.formData[2].initValue = ''
        this.formData[3].initValue = ''
        const list = []
        for (let i = 0; i < this.yearCount; i++) {
          list.push(0)
        }
        this.scoreList = list
      }
      this.formStatus = true
    },
    async submitForm(values) {
      let subjectName = ''
      const subList = this.subjectList.filter((item) => {
        return item.subjectCode === values.subjectCode
      })
      if (subList.length > 0) {
        subjectName = subList[0].subjectName
      }
      const numList = []
      values.yearTimeList.forEach((item) => {
        item.list.forEach((el) => {
          numList.push(el.count)
        })
      })
      const req = {
        activityId: values.activityId,
        checkType: values.checkType,
        courseProperty: values.courseProperty,
        courseType: this.courseType,
        numList,
        schemeId: this.programId,
        subjectCode: values.subjectCode,
        subjectName
      }
      if (this.courseItemId) {
        req.id = this.courseItemId
        delete req.courseType
      }
      const res = this.courseItemId
        ? await this.editSchemeCourse(req)
        : await this.addSchemeCourse(req)
      if (res && res.code === 200) {
        this.$emit('showList')
        this.formStatus = false
      }
    },
    async delCourse(id) {
      await this.delSchemeCourse(id)
      this.$emit('showList')
    }
  }
}
</script>

<style lang="less" scoped>
.course-system {
  padding: 20px;
  box-sizing: border-box;
}
.table-item {
  border: solid 1px #ccc;
  border-bottom: none;
  .table-title {
    height: 40px;
    background-color: #f5f5f5f5;
    display: flex;
    justify-content: space-between;
    padding: 0 20px;
    box-sizing: border-box;

    .title-left {
      display: flex;
      align-items: center;

      .title-name {
        width: 100px;
      }
      .title-hour {
        margin-right: 40px;
      }
    }
    .title-right {
      display: flex;
      justify-content: flex-end;
      align-items: center;
    }
  }
  .table-list {
    padding: 20px;
    box-sizing: border-box;

    .no-data {
      height: 50px;
    }
  }
}
.table-item:last-child {
  border-bottom: 1px solid #ccc;
}
</style>