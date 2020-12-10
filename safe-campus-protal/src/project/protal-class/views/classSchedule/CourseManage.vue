<template>
  <div class="page-layout qui-fx" id="courseManage">
    <import-result ref="importResult" :bindObj="bindObj" :classInfo="classInfo"></import-result>
    <a-modal title="操作说明" width="600px" v-model="actionTag" @ok="actionTag = false">
      <p>1. 选择班级，为所选班级创建课程表</p>
      <p>2. 点击“编辑课表”启用编辑，选择学科/老师后，在右侧课表处点击对应的表格填充课程</p>
      <p>3. 若需要删除课程，点击已添加的课程即可删除</p>
    </a-modal>
    <div class="left-menu qui-fx-ver">
      <div class="qui-fx-f1 box-scroll">
        <a-tabs default-active-key="1">
          <a-tab-pane key="1" tab="教师列表">
            <div class="u-fx" :style="{ height: $tools.setScroll('courseManage') - 50 + 'px' }">
              <teacher-menu @select="selectTree"></teacher-menu>
            </div>
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
    <div class="qui-fx-ver qui-fx-f1">
      <div class="course-tab">
        <div class="qui-fx-jsb mar-b10 mar-t10 qui-fx-ac">
          <div class="qui-fx-ac">
            <span class="mar-r10">请选择班级:</span>
            <a-cascader
              v-if="userInfo.schoolType === '8' || userInfo.schoolType === '9'"
              style="width: 300px"
              :options="highOptions"
              placeholder="请选择班级"
              @change="onChange"
            />
            <a-cascader
              v-else
              :options="classesList"
              style="width: 300px"
              @click.stop="onFocus"
              :loadData="loadData"
              placeholder="请选择班级"
              @change="onChange"
            />
          </div>
          <div>
            <a-button icon="export" type="primary" @click="educe(2)">批量导出</a-button>
          </div>
        </div>
        <div class="qui-fx-jsb">
          <div class="mar-t10 qui-fx-ac">
            <a-button v-if="!isEdit" icon="form" class="edit-action-btn" @click="editClass">编辑课表</a-button>
            <a-button v-if="isEdit" type="primary" @click="submitClass">保存</a-button>
            <a-button v-if="isEdit" style="margin-left: 10px" @click="cancle">取消</a-button>
            <a-icon
              type="question-circle"
              style="margin: 0 10px 0 5px; cursor: pointer; font-size: 18px"
              @click="actionTag = true"
            />
            <a-button icon="export" class="del-btn" @click="educe(1)">导出课表</a-button>
            <!-- <a-button
              v-if="classCode === ''"
              icon="upload"
              class="export-all-btn"
              style="margin: 0 10px 0 0;"
              @click="importClass"
              >导入课表</a-button
            >
            <a-upload
              v-else
              style="width: 300px;"
              class="qui-fx-ac"
              :multiple="false"
              :showUploadList="false"
              name="file"
              :data="{ fileType: 'xls' }"
              accept=".xls"
              :fileList="fileList"
              :withCredentials="true"
              :customRequest="customRequest"
              :beforeUpload="beforeUpload"
            >
              <a-button icon="upload" class="export-all-btn" style="margin: 0 10px 0 0;">导入课表</a-button>
            </a-upload> -->
          </div>
          <div class="mar-t10">
            <a-button icon="download" class="play-action-btn" style="margin: 0" @click="download(1)">下载导入模板</a-button
            >
          </div>
        </div>
      </div>
      <div class="qui-fx-f1 qui-fx-ver" style="margin: 10px; border-left: 1px #ccc solid">
        <ul class="time-ul qui-fx">
          <li class="time-step" style="border-right: none">时段</li>
          <li class="class-step" style="border-left: 1px #ccc solid">课节</li>
          <li class="day-li" v-for="i in weekDays" :key="i">{{ i | getWeek }}</li>
        </ul>
        <div class="qui-fx-f1 qui-fx">
          <ul class="time-step qui-fx-ver">
            <li class="qui-fx-ac-jc" :style="{ flex: courseTime.morningNum }">早上</li>
            <li class="qui-fx-ac-jc" :style="{ flex: courseTime.forenoonNum }">上午</li>
            <li class="qui-fx-ac-jc" :style="{ flex: courseTime.afternoonNum }">下午</li>
            <li class="qui-fx-ac-jc" :style="{ flex: courseTime.nightNum }">晚上</li>
          </ul>
          <ul class="class-step qui-fx-ver class-num">
            <li v-for="(i, index) in classNum" :key="i">第{{ index + 1 }}节</li>
          </ul>
          <div class="class-list qui-fx-ver qui-fx-f1">
            <div class="qui-fx-f1 qui-fx" v-for="(i, index) in courseTime.morningNum" :key="'1' + index">
              <ul class="qui-fx qui-fx-f1">
                <a-popover trigger="hover" v-for="(box, ind) in weekDays" :key="10 + ind">
                  <template slot="content">{{ contentHTML }}</template>
                  <li
                    @click="addClass('class10' + box + (index + 1))"
                    :id="'class10' + box + (index + 1)"
                    class="qui-fx-f1 qui-fx-ac-jc"
                  ></li>
                </a-popover>
              </ul>
            </div>
            <div class="qui-fx-f1 qui-fx" v-for="(i, index) in courseTime.forenoonNum" :key="'2' + index">
              <ul class="qui-fx qui-fx-f1">
                <a-popover trigger="hover" v-for="(box, ind) in weekDays" :key="20 + ind">
                  <template slot="content">{{ contentHTML }}</template>
                  <li
                    @click="addClass('class20' + box + (courseTime.morningNum + index + 1))"
                    :id="'class20' + box + (courseTime.morningNum + index + 1)"
                    class="qui-fx-f1 qui-fx-ac-jc"
                  ></li>
                </a-popover>
              </ul>
            </div>
            <div class="qui-fx-f1 qui-fx" v-for="(i, index) in courseTime.afternoonNum" :key="'3' + index">
              <ul class="qui-fx qui-fx-f1">
                <a-popover trigger="hover" v-for="(box, ind) in weekDays" :key="30 + ind">
                  <template slot="content">{{ contentHTML }}</template>
                  <li
                    @click="addClass('class30' + box + (courseTime.morningNum + courseTime.forenoonNum + index + 1))"
                    :id="'class30' + box + (courseTime.morningNum + courseTime.forenoonNum + index + 1)"
                    class="qui-fx-f1 qui-fx-ac-jc"
                  ></li>
                </a-popover>
              </ul>
            </div>
            <div class="qui-fx-f1 qui-fx" v-for="(i, index) in courseTime.nightNum" :key="'4' + index">
              <ul class="qui-fx qui-fx-f1">
                <a-popover trigger="hover" v-for="(box, ind) in weekDays" :key="40 + ind">
                  <template slot="content">{{ contentHTML }}</template>
                  <li
                    @click="
                      addClass(
                        'class40' +
                          box +
                          (courseTime.morningNum + courseTime.forenoonNum + courseTime.afternoonNum + index + 1)
                      )
                    "
                    :id="
                      'class40' +
                        box +
                        (courseTime.morningNum + courseTime.forenoonNum + courseTime.afternoonNum + index + 1)
                    "
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
</template>

<script>
import hostEnv from '@config/host-env'
import axios from 'axios'
import { mapState, mapActions } from 'vuex'
import TeacherMenu from '../../component/ScheduleComponents/TeacherMenu'
import ImportResult from '../../component/ScheduleComponents/ImportResult'
export default {
  name: 'CourseManage',
  components: {
    TeacherMenu,
    ImportResult
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  data() {
    return {
      fileList: [],
      fileUrl: '',
      actionTag: false,
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
      highOptions: [],
      gradeCode: '',
      classCode: '',
      placeName: '',
      schoolYearId: '',
      placeId: '',
      contentHTML: '',
      clazzName: '',
      bindObj: {},
      classInfo: {},
      chooseCourseInfo: {} // 保存已排课程信息
    }
  },
  created() {
    if (this.userInfo.schoolType === '8' || this.userInfo.schoolType === '9') {
      this.schoolYearId = JSON.parse(window.sessionStorage.getItem('schoolYear')).schoolYearId
      this._getHighSchoolClass()
    } else {
      const req = {
        schoolCode: this.userInfo.schoolCode
      }
      this.getSchoolYear(req).then(res => {
        if (!res.data) {
          return
        }
        this.schoolYearId = res.data.list[0].id
      })
    }
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
    ...mapActions('home', [
      'getClassNum',
      'getClassList',
      'saveClassByTeacher',
      'getSchoolYear',
      'getGradeData',
      'getClassData',
      'educeSchedule',
      'educeAllSchedule',
      'verifyClass',
      'downloadTem',
      'getHighSchoolClass'
    ]),
    async _getHighSchoolClass() {
      const req = {
        schoolCode: this.userInfo.schoolCode
      }
      const res = await this.getHighSchoolClass(req)
      this.highOptions = this.newTreeData(res.data)
      console.log(this.highOptions)
    },
    // 深层递归
    newTreeData(data) {
      data.forEach((item) => {
        if (item.gradeName) {
          item.gradeName = item.gradeName + '级'
        }
        item.children = item.subjectNodeDtos || item.classNodeDtos || []
        item.isLeaf = !item.subjectNodeDtos && !item.classNodeDtos
        item.label = item.classCode
          ? item.className
          : item.subjectCode
            ? item.subjectName
            : item.gradeName
        item.value = item.classCode
          ? item.classCode
          : item.subjectCode
            ? item.subjectCode
            : item.gradeCode
        if (item.subjectNodeDtos && item.subjectNodeDtos.length > 0) {
          this.newTreeData(item.subjectNodeDtos)
        }
        if (item.classNodeDtos && item.classNodeDtos.length > 0) {
          this.newTreeData(item.classNodeDtos)
        }
      })
      return data
    },
    educe(type) {
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
    },
    download(type) {
      this.downloadTem({ schoolCode: this.userInfo.schoolCode })
    },
    importClass() {
      if (!this.classCode) {
        this.$message.warning('请先选择班级')
      }
    },
    beforeUpload(file) {
      console.log(file)
      const isZip = file.type === 'application/vnd.ms-excel'
      if (!isZip) {
        this.$message.error('请上传格式为xls的文件')
      }
      return isZip
    },
    saveFile(formData) {
      axios({
        method: 'post',
        url: `${hostEnv.protal_api_11010}/class/schedule/import/excel?schoolCode=${this.userInfo.schoolCode}&classCode=${this.classCode}&schoolYearId=${this.schoolYearId}&placeId=${this.placeId}&placeName=${this.placeName}`,
        data: formData
      }).then(res => {
        if (res.data.code === 200) {
          console.log(res.data.data)
          if (typeof res.data.data === 'string') {
            this.$message.error(res.data.data)
            return
          }
          this.$refs.importResult.addVisible = true
          this.bindObj = res.data.data
          this.bindObj.failData.map((ele, i) => {
            ele.id = i
          })
          this.fileList = []
        } else {
          this.$message.error(res.data.message)
          this.fileList = []
        }
      }) /* .catch((error) => {
        console.log(error)
        this.$message.error(error)
        this.fileList = []
      }) */
    },
    customRequest(data) {
      // 上传提交
      this.resList = []
      const formData = new FormData()
      formData.append('file', data.file)
      this.fileList = [data.file]
      this.saveFile(formData)
    },
    async onFocus(value) {
      this.classesList = []
      const req = {
        schoolCode: this.userInfo.schoolCode
      }
      const res = await this.getGradeData(req)
      this.classesList = res.data.list
      this.classesList.forEach(el => {
        el.label = el.name
        el.value = el.code
        el.isLeaf = false
      })
    },
    loadData(selectedOptions) {
      const targetOption = selectedOptions[selectedOptions.length - 1]
      targetOption.loading = true
      const req = {
        gradeCode: targetOption.code,
        schoolCode: this.userInfo.schoolCode,
        schoolYearId: this.schoolYearId
      }
      this.getClassData(req).then(res => {
        targetOption.loading = false
        targetOption.children = res.data.list
        targetOption.children.forEach(el => {
          el.label = el.className
          el.value = el.classCode
          el.isLeaf = true
        })
        this.classesList = [...this.classesList]
      })
    },
    onChange(value, selectedOptions) {
      if (value.length !== 3) {
        return
      }
      console.log(value)
      console.log(selectedOptions)
      this.gradeCode = value[0]
      this.classCode = this.userInfo.schoolType === '8' || this.userInfo.schoolType === '9' ? value[2] : value[1]
      this.placeName = selectedOptions[1].placeName
      this.contentHTML = selectedOptions[1].placeName
      this.placeId = selectedOptions[1].placeId
      this.clazzName = selectedOptions[0].label + selectedOptions[1].label
      this.isEdit = false
      this.classInfo = {
        classCode: this.classCode,
        placeName: this.placeName,
        schoolYearId: this.schoolYearId,
        placeId: this.placeId
      }
      this.getListByClass()
    },
    // 根据班级id获取课表
    getListByClass() {
      this.getClassList({
        classCode: this.classCode,
        schoolCode: this.userInfo.schoolCode,
        schoolYearId: this.schoolYearId
      }).then(res => {
        const allClass = document.querySelector('.class-list').querySelectorAll('li')
        allClass.forEach(item => {
          item.innerHTML = ''
          item.style.background = '#fff'
        })
        if (!res.data) {
          return
        }
        res.data.forEach(item => {
          this.insertClass('class' + item.timeInterval + '0' + item.week + item.classNode, item)
        })
      })
    },
    // 选中老师
    selectTree(obj) {
      console.log(obj)
      this.chooseTree = obj
    },
    cancle() {
      this.isEdit = false
      this.getListByClass()
    },
    // 保存班级课程
    submitClass() {
      const allClass = document.querySelector('.class-list').querySelectorAll('li')
      const classScheduleList = []
      allClass.forEach(item => {
        if (item.innerHTML !== '') {
          classScheduleList.push({
            classCode: this.classCode,
            placeId: this.placeId,
            placeName: this.placeName,
            timeInterval: item.id.substring(5, 6),
            week: item.id.substring(7, 8),
            classNode: item.id.substring(8, item.id.length),
            ...this.chooseCourseInfo[item.id]
          })
        }
      })
      const req = {
        className: this.clazzName,
        classCode: this.classCode,
        schoolCode: this.userInfo.schoolCode,
        schoolYearId: this.schoolYearId,
        classScheduleList,
        createUsername: this.userInfo.userName,
        createUsercode: this.userInfo.userCode
      }
      this.saveClassByTeacher(req).then(res => {
        this.$message.success('排课成功')
        this.$tools.goNext(() => {
          this.isEdit = false
          this.getListByClass()
        })
      })
    },
    // 编辑课表
    editClass() {
      if (this.classCode === '') {
        this.$message.warning('请先选择班级')
        return
      }
      this.isEdit = true
    },
    // 插入课程
    addClass(id) {
      if (!this.isEdit) {
        this.$message.warning('您处在不可编辑状态')
        return
      }
      const liDom = document.querySelector('#' + id)
      if (liDom.innerHTML) {
        delete this.chooseCourseInfo[id]
        liDom.style.backgroundColor = '#fff'
        liDom.innerHTML = ''
        return
      }
      this.insertClass(id)
    },
    addCouse(type, id, list) {
      try {
        const liDom = document.querySelector('#' + id)
        const sName = type === 0 ? this.chooseTree.courseName : list.subjectName
        const tName = type === 0 ? this.chooseTree.title : list.userName
        const html = `<div class="">
                          <div style="font-size: 14px; font-weight: bold">${sName}</div>
                          <div style="font-size: 12px">${tName}</div>
                          </div>
                          `
        liDom.innerHTML = html
      } catch (err) {}
    },
    insertClass(id, list) {
      let type = 0
      if (list) {
        type = 1
        this.chooseCourseInfo[id] = {
          subjectName: list.subjectName,
          subjectId: list.subjectId,
          userName: list.userName,
          userCode: list.userCode
        }
        this.addCouse(type, id, list)
      } else {
        type = 0
        if (!this.chooseTree.teacherId) {
          this.$message.warning('请选择授课老师')
          return
        }
        if (!this.chooseTree.courseId) {
          return
        }
        this.chooseCourseInfo[id] = {
          subjectName: this.chooseTree.courseName,
          subjectId: this.chooseTree.courseId,
          userName: this.chooseTree.title,
          userCode: this.chooseTree.teacherId
        }
        this.addCouse(type, id, list)
        /* const req = {
          timeInterval: id.substring(5, 6),
          week: id.substring(7, 8),
          classNode: id.substring(8, id.length),
          schoolYearId: this.schoolYearId,
          schoolCode: this.userInfo.schoolCode,
          userCode: this.chooseTree.teacherId
        }
        this.verifyClass(req).then(res => {
          this.chooseCourseInfo[id] = {
            subjectName: this.chooseTree.courseName,
            subjectId: this.chooseTree.courseId,
            userName: this.chooseTree.title,
            userCode: this.chooseTree.teacherId
          }
          this.addCouse(type, id, list)
        }) */
      }
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
  padding-top: 10px;
  background-color: #fff;
}
.ant-radio-button-wrapper {
  padding: 0 35px;
}
.course-tab {
  margin: 10px;
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
