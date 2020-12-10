<template>
  <div class="table-page page-layout qui-fx">
    <a-tabs default-active-key="1" @change="tabChange" v-model="tabValue">
      <a-tab-pane key="0" tab="基本信息">
        <div class="content qui-fx-ver qui-fx-f1 u-auto">
          <base-form :programId="programId" :programInfo="programInfo"></base-form>
        </div>
      </a-tab-pane>
      <a-tab-pane key="1" tab="教学活动">
        <no-data msg="暂无数据~" v-if="!programId"></no-data>
        <div v-else class="content qui-fx-ver qui-fx-f1">
          <Activity :yearCount="yearCount" :programId="programId"></Activity>
        </div>
      </a-tab-pane>
      <a-tab-pane key="2" tab="课程体系">
        <no-data msg="暂无数据~" v-if="!programId"></no-data>
        <div v-else class="content qui-fx-ver qui-fx-f1">
          <course-system
            :yearCount="yearCount"
            :programId="programId"
            :courseList="courseList"
            @showList="showList"
          ></course-system>
        </div>
      </a-tab-pane>
      <a-tab-pane key="3" tab="课程设置与教学时间安排进程表">
        <no-data msg="暂无数据~" v-if="!programId"></no-data>
        <div v-else class="content qui-fx-ver qui-fx-f1">
          <plan-process
            :yearCount="yearCount"
            :programId="programId"
            :courseList="courseList"
            @showList="showList"
          ></plan-process>
        </div>
      </a-tab-pane>
      <a-tab-pane key="4" tab="实践任务">
        <no-data msg="暂无数据~" v-if="!programId"></no-data>
        <div v-else class="content qui-fx-ver qui-fx-f1">
          <Practice
            :yearCount="yearCount"
            :programId="programId"
            :dataList="taskList"
            @showList="showList"
          ></Practice>
        </div>
      </a-tab-pane>
      <a-tab-pane key="5" tab="附件信息">
        <no-data msg="暂无数据~" v-if="!programId"></no-data>
        <div v-else class="content qui-fx-ver qui-fx-f1">
          <file-msg :programId="programId"></file-msg>
        </div>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import NoData from '@c/NoData'
import BaseForm from './components/BaseForm.vue'
import Activity from './components/Activity.vue'
import CourseSystem from './components/CourseSystem.vue'
import PlanProcess from './components/PlanProcess.vue'
import Practice from './components/Practice.vue'
import FileMsg from './components/FileMsg.vue'
import Tools from '@/utils/tools'

export default {
  name: 'AddProgram',
  components: {
    NoData,
    BaseForm,
    Activity,
    CourseSystem,
    PlanProcess,
    Practice,
    FileMsg
  },
  data() {
    return {
      tabValue: '0',
      programId: '',
      yearCount: 0,
      programInfo: {},
      courseList: [],
      taskList: []
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  created() {
    this.programId = this.$route.query.id
  },
  mounted() {
    this.showList()
  },
  methods: {
    ...mapActions('home', ['getSchemeInfo', 'getSchemeCourse', 'getSchemeTask']),
    tabChange() {
      this.showList()
    },
    async showList() {
      if (this.tabValue === '0') {
        if (!this.programId) {
          return
        }
        const res = await this.getSchemeInfo(this.programId)
        if (res && res.code === 200) {
          this.programInfo = res.data
          this.yearCount = res.data.systemType
        }
        return
      }
      if (this.tabValue === '2') {
        this.getCourseList(1)
        return
      }
      if (this.tabValue === '3') {
        this.getCourseList(2)
        return
      }
      if (this.tabValue === '4') {
        const res = await this.getSchemeTask({ schemeId: this.programId })
        if (res && res.code === 200) {
          this.taskList = res.data.map(item => {
            return {
              ...item,
              id: item.id,
              taskName: item.taskName,
              activityName: item.activityTitle,
              totalNum: item.totalNum,
              ...item.itemObj
            }
          })
        }
      }
    },
    async getCourseList(type) {
      const req = {
        action: type,
        schemeId: this.programId
      }
      const res = await this.getSchemeCourse(req)
      if (res && res.code === 200) {
        this.courseList = res.data.map(item => {
          return {
            ...item,
            subjectList: !item.subjectList
              ? []
              : item.subjectList.map(el => {
                  return {
                    ...el,
                    id: el.id,
                    subjectName: el.subjectName,
                    activityName: el.activityTitle,
                    subjectType: el.courseProperty === 1 ? '必修 ' : '选修',
                    testType: el.checkType === 1 ? '考试 ' : '考查',
                    totalNum: el.totalNum,
                    numList: el.itemObj
                  }
                }),
            totalNum: item.totalNum || 0
          }
        })
      }
    }
  }
}
</script>
<style lang="less" scoped>
.table-page {
  background: #fff;
  height: 100%;
  overflow: hidden;
  padding: 0 20px 20px;
  box-sizing: border-box;
  .left {
    padding: 10px;
  }
  .right {
    padding: 0 10px;
    border-left: 1px solid @bor-color;
    .action {
      div {
        cursor: pointer;
        margin: 4px 30px 0 0;
        img {
          width: 20px;
          height: 20px;
        }
        span {
          font-size: 12px;
        }
      }
    }
  }

  /deep/ .ant-tabs {
    display: flex;
    flex: 1;
    flex-direction: column;

    .ant-tabs-content {
      flex: 1;
    }
  }

  .content {
    height: calc(100vh - 150px);
    overflow-y: auto;
  }
}
.modal {
  padding: 0 40px;
  .line {
    margin-bottom: 20px;
  }
  .title {
    font-size: 14px;
    font-weight: bold;
    margin-right: 20px;
    min-width: 70px;
  }
  .download {
    color: #6882da;
    cursor: pointer;
  }
  /deep/ .ant-upload-list-item-info {
    padding: 0 22px 0 4px;
  }
}
</style>
