<template>
  <div class="students page-layout qui-fx">
    <div class="qui-fx qui-fx-jsb" style="width: 100%">
      <div class="left select-list">
        <major-tree
          v-if="userInfo.schoolType === '8' || userInfo.schoolType === '9'"
          @select="select"
        ></major-tree>
        <class-tree v-else @select="select"></class-tree>
      </div>
      <div class="left student-list">
        <div class="choose-all">
          <div class="stu-num">班级学生 {{ studentsList.length }}人</div>
          <div class="stu-num">已选: {{ checkList.length }} 人</div>
          <div class="tips">请点击学生添加值日生</div>
        </div>
        <div class="stu_dent">
          <div class="u-padd-20">
            <draggable @end="dragEnd" element="ul" v-model="studentsList">
              <div
                @click="checkSingle(index)"
                :class="['choose-person', { 'choose-person-ok': person.check }]"
                v-for="(person, index) in studentsList"
                :key="index"
                class="stu-info u-padd-20"
              >
                <a-badge :count="person.count" show-zero>
                  <div class="student-img">
                    <img v-if="!person.photoUrl" :src="infoImg" alt />
                    <img v-else :src="person.photoUrl" alt />
                  </div>
                </a-badge>

                <div class="code">{{ person.userName }}</div>
              </div>
            </draggable>
          </div>
        </div>
      </div>
      <div class="right qui-fx-ver qui-fx-f1">
        <div class="duty-list">
          <div style="padding: 10px 0 0 10px">
            <a-button
              v-if="!isEdit"
              size="small"
              class="edit-action-btn"
              icon="form"
              @click="addDuty"
              >编辑</a-button
            >
            <a-button v-if="isEdit" type="primary" @click="submitClass">保存</a-button>
            <a-button v-if="isEdit" @click="cancel" style="margin: 0 10px; border-color: #f5f5f5"
              >取消</a-button
            >
            <a-button v-if="isEdit" type="danger" @click="del">删除所有</a-button>
          </div>
          <div class="qui-fx-f1" style="margin: 10px; border-left: 1px #ccc solid">
            <div class="pos-box">
              <ul class="time-ul inner-li">
                <li class="day-li" v-for="day in weekDays" :key="day.key">{{ day.value }}</li>
              </ul>
              <ul class="info-ul">
                <li
                  class="info-li"
                  v-for="day in weekDays"
                  :key="day.key"
                  @click="addClass(day.key)"
                >
                  <div v-for="(tag, index) in ratedPersonList" :key="index">
                    <div class="u-fx-ac-jc u-mar-b10" v-if="tag.weekDay === day.key">
                      <div class="info-img">
                        <img v-if="!tag.photoUrl" :src="infoImg" alt />
                        <img v-else :src="tag.photoUrl" alt />
                      </div>
                      <a-tag
                        :key="tag.id"
                        :closable="closable"
                        :afterClose="() => dutyClose(tag)"
                        >{{ tag.userName }}</a-tag
                      >
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import ClassTree from '@c/ClassTree'
import { Badge } from 'ant-design-vue'
import infoImg from '../../assets/img/nouser.jpg'
import draggable from 'vuedraggable'
import MajorTree from '@c/MajorTree'

export default {
  name: 'Duty',
  components: {
    ClassTree,
    ABadge: Badge,
    draggable,
    MajorTree
  },
  data() {
    return {
      closable: false,
      isEdit: false, // 编辑状态
      gradeId: '',
      classId: '',
      total: 0,
      pageList: {
        page: 1,
        size: 9999
      },
      infoImg,
      studentsList: [],
      schoolYearId: '',
      gradeCode: '',
      classCode: '',
      userId: '',
      weekDays: [
        {
          value: '星期一',
          key: 1
        },
        {
          value: '星期二',
          key: 2
        },
        {
          value: '星期三',
          key: 3
        },
        {
          value: '星期四',
          key: 4
        },
        {
          value: '星期五',
          key: 5
        },
        {
          value: '星期六',
          key: 6
        },
        {
          value: '星期日',
          key: 0
        }
      ],
      ratedPersonList: [],
      checkList: [],
      countInfoList: []
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  mounted() {},
  methods: {
    ...mapActions('home', [
      'getStudentList',
      'getdutyList',
      'addonDuty',
      'updateDuty',
      'delDuty',
      'highSchoolStudentList'
    ]),
    dragEnd(evt) {},
    select(item) {
      console.log(item)
      if (!item.classCode) {
        return
      }
      this.classInfo = item
      this.showList()
    },
    async showList() {
      let res = null
      if (this.userInfo.schoolType === '8' || this.userInfo.schoolType === '9') {
        res = await this.highSchoolStudentList({
          ...this.pageList,
          schoolCode: this.userInfo.schoolCode,
          classCode: this.classInfo.classCode,
          grade: this.classInfo.gradeName
        })
      } else {
        res = await this.getStudentList({
          ...this.pageList,
          schoolCode: this.userInfo.schoolCode,
          classId: this.classInfo.classCode,
          schoolYearId: this.classInfo.schoolYearId
        })
      }
      if (!res.data.list) {
        this.studentsList = []
        return
      }
      this.studentsList = res.data.list
      this.total = res.data.total
      this.dutyList()
    },
    async dutyList() {
      const req = {
        classCode: this.classInfo.classCode,
        schoolCode: this.userInfo.schoolCode,
        schoolYearId: this.classInfo.schoolYearId
      }
      const res = await this.getdutyList(req)
      if (!res.data.listInfo) {
        this.ratedPersonList = []
        return
      }
      this.ratedPersonList = res.data.listInfo
      this.countInfoList = res.data.countInfo
      this.total = res.data.total
      this.studentsList.forEach((ele) => {
        ele.count = 0
        this.countInfoList.forEach((item) => {
          if (item.userCode === ele.userCode) {
            ele.count = item.count
          }
        })
      })
    },
    checkSingle(index) {
      if (!this.isEdit) {
        this.$message.warning('先点击编辑')
        return
      }
      this.studentsList[index].check = !this.studentsList[index].check
      this.getCheckList()
    },
    getCheckList() {
      this.checkList = this.studentsList.filter((item) => {
        return item.check
      })
    },
    // 删除值日生
    dutyClose(removedTag) {
      if (!this.isEdit) {
        this.$message.warning('先点击编辑')
        return
      }
      console.log(removedTag)
      this.ratedPersonList = this.ratedPersonList.filter((tag) => tag !== removedTag)
    },
    addDuty() {
      this.isEdit = true
      this.closable = true
    },
    addClass(key) {
      if (!this.isEdit) {
        this.$message.warning('先点击编辑')
        return
      }
      const checkCodes = this.checkList.map((el) => el.userCode)
      let isRepeat = false // true 有重复学生,false 没有重复学生
      isRepeat = this.ratedPersonList
        .filter((el) => el.weekDay === key)
        .some((el) => {
          return checkCodes.indexOf(el.userCode) !== -1
        })
      if (isRepeat) {
        this.$message.warning('不可添加重复学生')
        return
      } else {
        this.ratedPersonList = this.ratedPersonList.concat(
          this.checkList.map((ele) => {
            return {
              weekDay: key,
              userCode: ele.userCode,
              userName: ele.userName,
              photoUrl: ele.photoUrl,
              schoolCode: this.userInfo.schoolCode,
              schoolYearId: this.classInfo.schoolYearId,
              classCode: ele.classCode,
              status: 1 // 1-添加过程的暂态
            }
          })
        )
      }
      this.isEdit = true
    },
    cancel() {
      this.dutyList()
      this.isEdit = false
      this.closable = false
      this.studentsList.map((ele) => {
        ele.check = false
      })
      this.checkList = []
      this.ratedPersonList = this.ratedPersonList.filter((el) => {
        return !(el.status && el.status === 1)
      })
    },
    del() {
      const req = {
        query: `${this.classInfo.classCode}/${this.classInfo.schoolYearId}/${this.userInfo.schoolCode}`,
        data: []
      }
      this.updateDuty(req).then((res) => {
        this.$message.success('删除成功')
        this.$tools.goNext(() => {
          this.isEdit = false
          this.closable = false
          this.dutyList()
        })
      })
    },
    submitClass() {
      // 删除添加过程中的暂态标志
      this.ratedPersonList.forEach((el) => {
        el.status && delete el.status
      })
      const req = {
        query: `${this.classInfo.classCode}/${this.classInfo.schoolYearId}/${this.userInfo.schoolCode}`,
        data: this.ratedPersonList
      }
      this.updateDuty(req).then((res) => {
        this.$message.success('添加成功')
        this.$tools.goNext(() => {
          this.studentsList.map((ele) => {
            ele.check = false
          })
          this.checkList = []
          this.isEdit = false
          this.closable = false
          this.dutyList()
        })
      })
    }
  }
}
</script>
<style lang="less" scoped>
.student-list {
  border-radius: 4px;
  margin-top: 10px;
  border: 1px solid #f5f5f5;
  width: 25%;
  .stu_dent {
    overflow-y: scroll;
    height: 800px;
  }
}
.choose-all {
  height: 80px;
  border-bottom: 1px solid #f5f5f5;
  padding: 10px;
  .stu-num {
    font-size: 15px;
    color: #666;
    font-weight: bold;
  }
  .tips {
    color: #a9a9a9;
  }
}
.u-padd-20 {
  padding: 20px;
}
.stu-info {
  float: left;
  margin-left: 13px;
}
.student-img {
  width: 62px;
  height: 62px;
  img {
    width: 100%;
    height: 100%;
    display: block;
    border-radius: 50%;
  }
}
.duty-list {
  border-radius: 4px;
  height: 800px;
  margin-top: 10px;
  border: 1px solid #f5f5f5;
  margin-left: 20px;
  margin-right: 20px;
}
.select-list {
  width: 15%;
}
.code {
  text-align: center;
}
ul,
li {
  margin: 0;
  padding: 0;
}
.ant-radio-button-wrapper {
  padding: 0 35px;
}
.inner-li li:first-of-type {
  border-left: 1px #f5f5f5 solid;
}
.inner-li {
  li {
    height: 40px;
    line-height: 40px;
    text-align: center;
    border-top: 1px #f5f5f5 solid;
    border-right: 1px #f5f5f5 solid;
    background-color: #fff;
    float: left;
    width: 14.28%;
    border-bottom: 1px #f5f5f5 solid;
  }
}
.time-ul {
  width: 100%;
  li {
    background-color: #eee;
  }
}
.info-ul {
  li {
    height: 680px;
    text-align: center;
    border-right: 1px #f5f5f5 solid;
    border-bottom: 1px #f5f5f5 solid;
    background-color: #fff;
    float: left;
    width: 14.28%;
    overflow-y: scroll;
  }
}
.info-ul li:first-of-type {
  border-left: 1px #f5f5f5 solid;
}
.choose-person {
  cursor: pointer;
}
.choose-person-ok {
  background-color: #6882da;
  color: #fff;
}
.info-img {
  width: 50px;
  height: 50px;
  margin: 5px 0;
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    display: block;
  }
}
/deep/ .ant-tag {
  margin-right: 0;
}
</style>
