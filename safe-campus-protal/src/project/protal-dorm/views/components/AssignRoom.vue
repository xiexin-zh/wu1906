<template>
  <a-modal
    :title="'宿舍分配-人员选择（最大选择人数：' + chooseNum + '人）'"
    v-model="assignTag"
    @ok="assignSubmit"
    width="1000px"
    :destroyOnClose="true"
  >
    <a-row type="flex">
      <a-col class="class-tree">
        <!-- <teacher-tree @tree-click="searchPerson" isTab isSelect :current-tab="1" ></teacher-tree> -->
        <div class="org-tree">
          <div class="left-top">
            <a-radio-group v-model="current" style="margin-left: 6px">
              <a-radio-button
                style="width: 120px; height: 40px; line-height: 40px; text-align: center"
                :value="item.name"
                :key="index"
                v-for="(item, index) in tabList"
                >{{ item.title }}</a-radio-button
              >
            </a-radio-group>
          </div>
          <div class="left-tree">
            <major-tree
              v-if="(schoolType === '8' || schoolType === '9') && current === 1"
              @select="select"
            ></major-tree>
            <grade-tree
              v-if="schoolType !== '8' && schoolType !== '9' && current === 1"
              @select="select"
            ></grade-tree>
            <org-tree
              v-if="current === 0"
              @defaultCode="defaultCode"
              @select="orgSelect"
            ></org-tree>
          </div>
        </div>
      </a-col>
      <a-col style="flex: 1">
        <a-row type="flex" justify="end">
          <a-col>
            <span class="form-text">姓名：</span>
            <a-input class="input-name" v-model="userName" placeholder="请输入" />
            <!-- <span class="form-text">性别：</span>
            <a-select v-model="sex" class="select-type">
              <a-select-option :key="item.value" v-for="item in sexTypes" :value="item.value">{{
                item.label
              }}</a-select-option>
            </a-select> -->
            <a-button type="primary" @click="searchForm" class="search-btn-mar">查询</a-button>
          </a-col>
        </a-row>
        <a-row>
          <span class="choose-all" @click="checkAll(true)">全选</span>
          <span class="choose-all" @click="checkAll(false)">反选</span>
          <span class="choose-all">一共{{ personList.length }}人</span>
          <span class="choose-all">已选: {{ checkList.length }} 人</span>
        </a-row>
        <div class="student-list">
          <div style="padding:20px;" v-if="personList.length === 0">暂无查询到人员</div>
          <div
            @click="checkSingle(index)"
            :class="['choose-person', { 'choose-person-ok': person.check }]"
            v-for="(person, index) in personList"
            :key="index"
            @mouseover="showTip(index)"
          >
            <a-tooltip placement="rightBottom">
              <div>
                <div class="student-img">
                  <img :src="person.photoSrc" alt="" />
                </div>
                <div>
                  <div class="code" style="margin: 4px 0">{{ person.userName }}</div>
                  <div class="code">{{ person.userNo }}</div>
                </div>
              </div>
              <template slot="title">
                <div>{{ person.userName }}</div>
                <div>{{ person.userNo }}</div>
              </template>
            </a-tooltip>
          </div>
        </div>
      </a-col>
    </a-row>
  </a-modal>
</template>

<script>
import GradeTree from '@c/GradeTree'
import OrgTree from '@c/OrgTree'
import MajorTree from '@c/MajorTree'
// import TeacherTree from './orgTree/TeacherTree'
import { mapState, mapActions } from 'vuex'
export default {
  name: 'AssignRoom',
  components: {
    // TeacherTree
    GradeTree,
    OrgTree,
    MajorTree
  },
  props: {
    chooseId: {
      type: Array,
      default: () => {
        return []
      }
    },
    chooseNum: {
      type: Number,
      required: true
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  data() {
    return {
      checkList: [],
      personList: [],
      assignTag: false,
      userName: '',
      // sex: '',
      classCode: '',
      levelCode: '',
      sexTypes: [
        {
          value: '',
          label: '全部'
        },
        {
          value: '1',
          label: '男'
        },
        {
          value: '2',
          label: '女'
        }
      ],
      current: 1,
      currentIndex: -1,
      tabMenu: ['午休查寝', '晚间查寝'],
      tabList: [
        {
          name: 1,
          title: '学生'
        },
        {
          name: 0,
          title: '老师'
        }
      ],
      selectItem: {},
      orgSelectItemt: {},
      schoolType: JSON.parse(window.sessionStorage.getItem('loginInfo')).schoolType
    }
  },
  methods: {
    ...mapActions('roomManage', [
      'getAssignRoomSubmit',
      'assignStudent',
      'getStudentList',
      'getTeacherList'
    ]),
    ...mapActions('orgTree', ['allAssignRoomSubmit']),
    defaultCode(item) {
      item.code = item.code[0]
      this.orgSelect(item)
    },
    select(item) {
      if (!item.gradeCode) {
        this.personList = []
        return
      }
      this.selectItem = item
      this.getAssignRoomSubmit({
        gradeCode: item.gradeCode,
        classCode: item.classCode,
        schoolCode: window.sessionStorage.getItem('schoolScheme')
      }).then(res => {
        this.getStudentList({
          schoolCode: window.sessionStorage.getItem('schoolScheme'),
          schoolYearId: item.schoolYearId,
          classId: item.classCode,
          gradeId: item.gradeCode,
          keyword: this.userName,
          hasDorm: '1',
          subjectCode: this.schoolType === '8' || this.schoolType === '9' ? item.subjectCode : '',
          gradeCode: this.schoolType === '8' || this.schoolType === '9' ? item.gradeCode : '',
          grade: this.schoolType === '8' || this.schoolType === '9' ? item.gradeName : '',
          classCode: this.schoolType === '8' || this.schoolType === '9' ? item.classCode : '',
          // sex: this.sex,
          page: 1,
          size: 10000000
        }).then(data => {
          this.checkList = []
          const allList = []
          if (res.data.list.length > 0) {
            res.data.list.forEach(element => {
              return allList.push(element.userCode)
            })
          }
          const dataAll = data.data.list
          this.personList = dataAll
            .filter(item => {
              return allList.indexOf(item.userCode) === -1
            })
            .map(item => {
              return {
                classCode: item.classCode,
                className: item.className,
                gender: item.sex,
                photoSrc: item.photoUrl,
                stageCode: item.stageCode,
                stageName: item.stage,
                userCode: item.userCode,
                userName: item.userName,
                userNo: item.workNo,
                gradeCode:
                  this.schoolType === '8' || this.schoolType === '9' ? item.grade : item.gradeCode,
                gradeName: this.schoolType === '8' || this.schoolType === '9' ? '' : item.gradeName,
                subjectCode:
                  this.schoolType === '8' || this.schoolType === '9' ? item.subjectCode : ''
              }
            })
        })
      })
    },
    orgSelect(item) {
      console.log(2, item)
      this.orgSelectItemt = item
      this.getAssignRoomSubmit({
        orgCode: item.code,
        schoolCode: window.sessionStorage.getItem('schoolScheme')
      }).then(res => {
        this.getTeacherList({
          orgCode: item.code,
          schoolCode: sessionStorage.getItem('schoolScheme'),
          page: 1,
          size: 10000000,
          keyword: this.userName
        }).then(data => {
          this.checkList = []
          const allList = []
          if (res.data.list.length > 0) {
            res.data.list.forEach(element => {
              return allList.push(element.userCode)
            })
          }
          const dataAll = data.data.list
          this.personList = dataAll
            .filter(item => {
              return allList.indexOf(item.userCode) === -1
            })
            .map(item => {
              return {
                gender: item.sex,
                photoSrc: item.photoUrl,
                userCode: item.userCode,
                userName: item.userName,
                userNo: item.workNo
              }
            })
        })
      })
    },
    showTip(index) {
      this.currentIndex = index
    },
    checkAll(type) {
      this.personList = this.personList.map(item => {
        return {
          ...item,
          check: type ? true : !item.check
        }
      })
      this.getCheckList()
    },
    checkSingle(index) {
      this.personList[index].check = !this.personList[index].check
      this.getCheckList()
    },
    getCheckList() {
      this.checkList = this.personList.filter(item => {
        return item.check
      })
    },
    assignSubmit() {
      if (this.checkList.length === 0) {
        this.$message.warn('请选择')
      } else if (this.checkList.length > this.chooseNum) {
        this.$message.warning('超出可选择最大数量')
      } else {
        this.assignStudent({
          roomList: this.chooseId,
          schoolCode: window.sessionStorage.getItem('schoolScheme'),
          schoolName: window.sessionStorage.getItem('schoolName'),
          userList: this.checkList,
          systemCode: 'dorm'
        }).then(res => {
          this.$message.success('分配成功')
          this.assignTag = false
          this.$tools.goNext(() => {
            this.$emit('assign-ok')
          })
        })
      }
    },
    searchForm() {
      if (this.current === 0) {
        this.orgSelect(this.orgSelectItemt)
      } else if (this.current === 1) {
        this.select(this.selectItem)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.choose-person {
  cursor: pointer;
  border-radius: 3px;
  margin: 15px 0 0 14px;
  float: left;
  width: 120px;
  padding: 10px;
  background-color: #ccc;
  text-align: center;
  .code {
    overflow: hidden;
    height: 20px;
  }
}
.choose-person-ok {
  background-color: #6882da;
  color: #fff;
}
.class-tree {
  height: 600px;
}
.student-list {
  border-radius: 4px;
  overflow: auto;
  overflow-x: hidden;
  height: 550px;
  margin-top: 10px;
  background-color: rgb(229, 243, 255);
}
.choose-all {
  color: #666;
  font-weight: bold;
  cursor: pointer;
  padding-left: 4px;
  padding-right: 15px;
}
.student-img {
  margin: 0 auto;
  width: 90px;
  height: 105px;
  img {
    width: 100%;
    height: 100%;
    display: block;
  }
}
.ant-radio-button-wrapper-checked {
  background-color: @main-color !important;
  color: #fff;
}
.org-tree {
  padding-top: 10px;
  width: 265px;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.left-top {
  width: 100%;
  height: 62px;
  display: flex;
  padding: 4px 7px 0px 7px;
}
.left-tree {
  width: 100%;
  flex: 1;
  padding: 0 7px 0 7px;
  height: calc(100% - 10px);
  overflow: auto;
}
</style>
