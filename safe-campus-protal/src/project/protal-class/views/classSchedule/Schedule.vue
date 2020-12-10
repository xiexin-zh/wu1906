<template>
  <div class="page-layout qui-fx-ver" id="courseManage">
    <div>
      <a-tabs default-active-key="1" @change="tabChange">
        <a-tab-pane key="1" tab="班级课表"></a-tab-pane>
        <a-tab-pane key="2" tab="教师课表"></a-tab-pane>
        <a-tab-pane key="3" tab="教室课表"></a-tab-pane>
      </a-tabs>
    </div>
    <div class="qui-fx">
      <div class="left-menu qui-fx-ver">
        <div class="qui-fx-f1 box-scroll">
          <div :style="{height: $tools.setScroll('courseManage') - 30 + 'px'}">
            <div v-if="actiontab === '1'">
              <major-tree
                v-if="userInfo.schoolType === '8' || userInfo.schoolType === '9'"
                @select="selectClass"
              ></major-tree>
              <class-tree v-else @select="selectClass"></class-tree>
            </div>
            <teacher-menu v-if="actiontab === '2'" type="1" @select="selectTree"></teacher-menu>
            <room-tree v-if="actiontab === '3'" @select="selectRoom"></room-tree>
          </div>
        </div>
      </div>
      <div class="qui-fx-ver qui-fx-f1">
        <div class="course-tab">
          <div class="qui-fx">
            <a-button
              icon="download"
              class="export-all-btn"
              style="margin: 0 10px 0 0;"
              @click="educe(1)"
            >导出当前{{ title }}课表</a-button>
            <a-button icon="download" class="del-btn" @click="educe(2)">导出所有{{ title }}课表</a-button>
          </div>
        </div>
        <div class="qui-fx-f1 qui-fx-ver" style="margin: 5px 10px; border-left: 1px #ccc solid">
          <ul class="time-ul qui-fx">
            <li class="time-step" style="border-right: none">时段</li>
            <li class="class-step" style="border-left: 1px #ccc solid">课节</li>
            <li class="day-li" v-for="i in weekDays" :key="i">{{ i | getWeek }}</li>
          </ul>
          <div class="qui-fx-f1 qui-fx">
            <ul class="time-step qui-fx-ver">
              <li class="qui-fx-ac-jc" :style="{flex: courseTime.morningNum}">早上</li>
              <li class="qui-fx-ac-jc" :style="{flex: courseTime.forenoonNum}">上午</li>
              <li class="qui-fx-ac-jc" :style="{flex: courseTime.afternoonNum}">下午</li>
              <li class="qui-fx-ac-jc" :style="{flex: courseTime.nightNum}">晚上</li>
            </ul>
            <ul class="class-step qui-fx-ver class-num">
              <li v-for="(i, index) in classNum" :key="i">第{{ index + 1 }}节</li>
            </ul>
            <div class="class-list qui-fx-ver qui-fx-f1">
              <div
                class="qui-fx-f1 qui-fx"
                v-for="(i, index) in courseTime.morningNum"
                :key="'1' + index"
              >
                <ul class="qui-fx qui-fx-f1">
                  <a-popover
                    trigger="hover"
                    v-for="(box, ind) in weekDays"
                    :key="10 + ind"
                    @visibleChange="hover('class10' + box + (index + 1))"
                  >
                    <template slot="content">{{ contentHTML }}</template>
                    <li :id="'class10' + box + (index + 1)" class="qui-fx-f1 qui-fx-ac-jc"></li>
                  </a-popover>
                </ul>
              </div>
              <div
                class="qui-fx-f1 qui-fx"
                v-for="(i, index) in courseTime.forenoonNum"
                :key="'2' + index"
              >
                <ul class="qui-fx qui-fx-f1">
                  <a-popover
                    trigger="hover"
                    v-for="(box, ind) in weekDays"
                    :key="20 + ind"
                    @visibleChange="hover('class20' + box + (courseTime.morningNum + index + 1))"
                  >
                    <template slot="content">{{ contentHTML }}</template>
                    <li
                      :id="'class20' + box + (courseTime.morningNum + index + 1)"
                      class="qui-fx-f1 qui-fx-ac-jc"
                    ></li>
                  </a-popover>
                </ul>
              </div>
              <div
                class="qui-fx-f1 qui-fx"
                v-for="(i, index) in courseTime.afternoonNum"
                :key="'3' + index"
              >
                <ul class="qui-fx qui-fx-f1">
                  <a-popover
                    trigger="hover"
                    v-for="(box, ind) in weekDays"
                    :key="30 + ind"
                    @visibleChange="hover('class30' + box + (courseTime.morningNum + courseTime.forenoonNum + index + 1))"
                  >
                    <template slot="content">{{ contentHTML }}</template>
                    <li
                      :id="'class30' + box + (courseTime.morningNum + courseTime.forenoonNum + index + 1)"
                      class="qui-fx-f1 qui-fx-ac-jc"
                    ></li>
                  </a-popover>
                </ul>
              </div>
              <div
                class="qui-fx-f1 qui-fx"
                v-for="(i, index) in courseTime.nightNum"
                :key="'4' +index"
              >
                <ul class="qui-fx qui-fx-f1">
                  <a-popover
                    trigger="hover"
                    v-for="(box, ind) in weekDays"
                    :key="40 + ind"
                    @visibleChange="hover('class40' + box + (courseTime.morningNum + courseTime.forenoonNum + courseTime.afternoonNum + index + 1))"
                  >
                    <template slot="content">{{ contentHTML }}</template>
                    <li
                      :id="'class40' + box+ (courseTime.morningNum + courseTime.forenoonNum + courseTime.afternoonNum + index + 1)"
                      class="qui-fx-f1 qui-fx-ac-jc"
                    ></li>
                  </a-popover>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import TeacherMenu from '../../component/ScheduleComponents/TeacherMenu'
import ClassTree from '@c/ClassTree'
import MajorTree from '@c/MajorTree'
import RoomTree from '@c/RoomTree'
export default {
  name: 'CourseManage',
  components: {
    ClassTree,
    RoomTree,
    TeacherMenu,
    MajorTree
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  data() {
    return {
      actiontab: '1',
      actionTag: false,
      title: '班级',
      contentHTML: '',
      form: this.$form.createForm(this),
      formItemLayout: {
        labelCol: { span: 4 },
        wrapperCol: { span: 12 }
      },
      chooseTree: {},
      isEdit: false, // 编辑状态
      tabPosition: 'class',
      weekDays: [], // 每周上课天数
      classNum: 0, // 课程节数
      courseTime: {
        morningNum: 0,
        forenoonNum: 0,
        afternoonNum: 0,
        nightNum: 0
      },
      currentIndex: 0,
      classesList: [],
      gradeCode: '',
      clazzName: '',
      teacherName: '',
      classCode: '',
      placeName: '',
      schoolYearId: '',
      placeId: '',
      userCode: '',
      chooseCourseInfo: {} // 保存已排课程信息
    }
  },
  mounted() {
    this.getClassNum({
      schoolCode: this.userInfo.schoolCode
    }).then(res => {
      if (!res.data) {
        this.$message.warning('请先设置课时')
        return
      }
      const data = res.data
      this.courseTime = data
      this.weekDays = data.week.split(',')
      this.classNum = data.morningNum + data.forenoonNum + data.afternoonNum + data.nightNum
    })
  },
  methods: {
    ...mapActions('home', ['getClassNum', 'getClassList', 'educeSchedule', 'educeAllSchedule']),
    tabChange(key) {
      this.actiontab = key
      this.title = key === '1' ? '班级' : key === '2' ? '教师' : '教室'
      const allClass = document.querySelector('.class-list').querySelectorAll('li')
      allClass.forEach(item => {
        item.innerHTML = ''
        item.style.background = '#fff'
      })
    },
    educe(type) {
      if (this.actiontab === '1') {
        if (type === 1) {
          if (!this.classCode) {
            this.$message.warning('请先选择班级')
            return
          }
          this.educeSchedule({
            schoolCode: this.userInfo.schoolCode,
            classCode: this.classCode,
            schoolYearId: this.schoolYearId,
            name: this.clazzName
          })
        } else if (type === 2) {
          this.educeAllSchedule({
            schoolCode: this.userInfo.schoolCode,
            schoolYearId: this.schoolYearId,
            type: '1',
            name: '课程表'
          })
        }
      } else if (this.actiontab === '2') {
        if (type === 1) {
          if (!this.userCode) {
            this.$message.warning('请先选择教师')
            return
          }
          this.educeSchedule({
            schoolCode: this.userInfo.schoolCode,
            userCode: this.userCode,
            schoolYearId: this.schoolYearId,
            name: this.teacherName
          })
        } else if (type === 2) {
          this.educeAllSchedule({
            schoolCode: this.userInfo.schoolCode,
            schoolYearId: this.schoolYearId,
            type: '2',
            name: '课程表'
          })
        }
      } else if (this.actiontab === '3') {
        if (type === 1) {
          if (!this.placeId) {
            this.$message.warning('请先选择教室')
            return
          }
          this.educeSchedule({
            schoolCode: this.userInfo.schoolCode,
            placeId: this.placeId,
            schoolYearId: this.schoolYearId,
            name: this.placeName
          })
        } else if (type === 2) {
          this.educeAllSchedule({
            schoolCode: this.userInfo.schoolCode,
            schoolYearId: this.schoolYearId,
            type: '3',
            name: '课程表'
          })
        }
      }
    },
    // 获取课表
    getListByClass() {
      this.getClassList({
        classCode: this.classCode,
        schoolCode: this.userInfo.schoolCode,
        schoolYearId: this.schoolYearId,
        userCode: this.userCode,
        placeId: this.placeId
      }).then(res => {
        const allClass = document.querySelector('.class-list').querySelectorAll('li')
        allClass.forEach(item => {
          item.innerHTML = ''
          item.style.background = '#fff'
        })
        if (!res.data) {
          return
        }
        if (this.actiontab === '3') {
          this.placeName = res.data[0].placeName
        }
        res.data.forEach(item => {
          this.insertClass('class' + item.timeInterval + '0' + item.week + item.classNode, item)
        })
      })
    },
    // 选中老师
    selectTree(item) {
      console.log(item)
      if (item.teacherId) {
        this.userCode = item.teacherId
        this.teacherName = item.title
        this.classCode = ''
        this.gradeCode = ''
        this.placeId = ''
        this.getListByClass()
      }
    },
    // 选中年级
    selectClass(item) {
      this.schoolYearId = item.schoolYearId
      if (item.classCode) {
        this.gradeCode = item.gradeCode
        this.classCode = item.classCode
        this.schoolYearId = item.schoolYearId
        this.placeName = item.placeName
        this.placeId = ''
        this.userCode = ''
        this.clazzName = item.gradeName + item.clazzName
        this.getListByClass()
      }
    },
    // 选中教室
    selectRoom(item) {
      console.log(item)
      if (item.type === '3') {
        this.gradeCode = ''
        this.classCode = ''
        this.placeName = item.placeName
        this.placeId = item.key
        this.userCode = ''
        this.getListByClass()
      }
    },
    insertClass(id, list) {
      this.chooseCourseInfo[id] = {
        subjectName: list.subjectName,
        subjectId: list.subjectId,
        userName: list.userName,
        userCode: list.userCode
      }
      try {
        const liDom = document.querySelector('#' + id)
        const sName = list.subjectName
        const tName = list.userName
        const pName = this.actiontab === '1' ? this.placeName : list.placeName
        let html = ''
        if (this.actiontab === '2') {
          html = `<div class="">
                    <div style="font-size: 14px; font-weight: bold">${sName}</div>
                    <div id="${id}pName" class="qui-te" style="font-size: 12px">${pName}</div>
                    </div>
                    `
        } else {
          html = `<div class="">
                    <div style="font-size: 14px; font-weight: bold">${sName}</div>
                    <div style="font-size: 12px">${tName}</div>
                    <div id="${id}pName" class="qui-te" style="font-size: 12px;display:none">${pName}</div>
                    </div>
                    `
        }
        liDom.innerHTML = html
      } catch (err) {}
    },
    hover(id, e) {
      const liDom = document.querySelector('#' + id + 'pName')
      if (!liDom) {
        this.contentHTML = ''
        return
      }
      this.contentHTML = liDom.innerHTML
    }
  }
}
</script>

<style lang="less" scoped>
ul,
li {
  margin: 0;
  padding: 0;
}
.left-menu {
  width: 220px;
  padding-left: 10px;
  background-color: #fff;
}
.ant-radio-button-wrapper {
  padding: 0 35px;
}
.course-tab {
  margin: 0 10px 10px 10px;
}
.course-list {
  margin-left: 10px;
  background-color: #fff;
  width: 120px;
  li {
    color: #fff;
    line-height: 22px;
    font-size: 12px;
    text-align: center;
    margin-left: 10px;
    width: 95px;
    height: 95px;
    background-color: #ccc;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 10px;
    &.act {
      background-color: #1890ff;
    }
    p {
      line-height: 20px;
    }
  }
}
.time-ul {
  width: 100%;
  li {
    height: 40px;
    line-height: 40px;
    text-align: center;
    border: 1px #ccc solid;
    border-left: none;
    &.day-li {
      flex: 1;
    }
  }
}
.class-num li {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px #ccc solid;
  border-top: none;
}
.class-list {
  li {
    border: 1px #ccc solid;
    border-top: none;
    border-left: none;
    cursor: pointer;
    font-size: 12px;
    text-align: center;
    background-color: #fff;
  }
}
.time-step {
  width: 100px;
  text-align: center;
  li {
    overflow: hidden;
    border: 1px #ccc solid;
    border-top: none;
    border-left: none;
    border-right: none;
  }
}
.class-step {
  width: 100px;
  text-align: center;
}
</style>
