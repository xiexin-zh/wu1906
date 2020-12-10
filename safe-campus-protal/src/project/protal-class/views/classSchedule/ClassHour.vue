<template>
  <div class="page-layout qui-fx-ver qui-of">
    <submit-form
      ref="cForm"
      title="课节设置"
      v-model="classTag"
      :form-data="classData"
      @submit-form="classForm"
    >
      <template v-slot:tips v-if="editTag">
        <a-alert message="温馨提示：修改课节设置，会导致已创建的课时和课程表被清空，请谨慎操作！" banner style="margin-bottom:10px" />
      </template>
    </submit-form>
    <submit-form
      :width="550"
      ref="tForm"
      title="时间设置"
      v-model="timeTag"
      :form-data="timeData"
      @submit-form="timeForm"
    ></submit-form>
    <a-row style="margin:10px 0;" type="flex" justify="space-between" align="middle">
      <a-col class="qui-fx-ac" style="padding: 10px 5px 0px 10px;text-align:left">
        <a-button type="primary" @click="setChange">课节设置</a-button>
        （当前设置：每周上{{ getNum(hourInfo.week ) }}天课，
        <span>早上{{ hourInfo.morningNum || 0 }}节课，</span>
        <span>上午{{ hourInfo.forenoonNum || 0 }}节课，</span>
        <span>下午{{ hourInfo.afternoonNum || 0 }}节课，</span>
        <span>晚上{{ hourInfo.nightNum || 0 }}节课</span>）
      </a-col>
    </a-row>
    <div
      v-if="timeList"
      class="qui-fx-f1 qui-fx-ver"
      style="margin: 10px; border-left: 1px #ccc solid"
    >
      <ul class="time-ul qui-fx">
        <li class="time-step" style="border-right: none">时段</li>
        <li class="class-step" style="border-left: 1px #ccc solid">课节</li>
        <li class="day-li" v-for="i in weekDays" :key="i">{{ i }}</li>
      </ul>
      <div class="qui-fx-f1 qui-fx">
        <ul class="time-step qui-fx-ver">
          <li class="qui-fx-ac-jc" :style="{flex: hourInfo.morningNum}">早上</li>
          <li class="qui-fx-ac-jc" :style="{flex: hourInfo.forenoonNum}">上午</li>
          <li class="qui-fx-ac-jc" :style="{flex: hourInfo.afternoonNum}">下午</li>
          <li class="qui-fx-ac-jc" :style="{flex: hourInfo.nightNum}">晚上</li>
        </ul>
        <ul class="class-step qui-fx-ver class-num">
          <li v-for="(i, index) in classNum" :key="i">第{{ index + 1 }}节</li>
        </ul>
        <div class="class-list qui-fx-ver qui-fx-f1 qui-of">
          <div
            class="qui-fx-f1 qui-fx"
            v-for="(i, index) in toArray(hourInfo.morningNum)"
            :key="'1' + index"
          >
            <ul class="qui-fx qui-fx-f1" :id="'class10' + (index + 1)">
              <li class="qui-fx-f1 qui-fx-ac-jc" v-for="(box, ind) in 2" :key="10 + ind"></li>
              <li class="qui-fx-f1 qui-fx-ac-jc">
                <a-tag color="#2db7f5" @click="timeChange('class10' + (index + 1))">设置</a-tag>
              </li>
            </ul>
          </div>
          <div
            class="qui-fx-f1 qui-fx"
            v-for="(i, index) in toArray(hourInfo.forenoonNum)"
            :key="'2' + index"
          >
            <ul class="qui-fx qui-fx-f1" :id="'class20' + (hourInfo.morningNum + index + 1)">
              <li class="qui-fx-f1 qui-fx-ac-jc" v-for="(box, ind) in 2" :key="20 + ind"></li>
              <li class="qui-fx-f1 qui-fx-ac-jc">
                <a-tag
                  color="#2db7f5"
                  @click="timeChange('class20' + (hourInfo.morningNum + index + 1))"
                >设置</a-tag>
              </li>
            </ul>
          </div>
          <div
            class="qui-fx-f1 qui-fx"
            v-for="(i, index) in toArray(hourInfo.afternoonNum)"
            :key="'3' + index"
          >
            <ul
              class="qui-fx qui-fx-f1"
              :id="'class30' + (hourInfo.morningNum + hourInfo.forenoonNum + index + 1)"
            >
              <li class="qui-fx-f1 qui-fx-ac-jc" v-for="(box, ind) in 2" :key="30 + ind"></li>
              <li class="qui-fx-f1 qui-fx-ac-jc">
                <a-tag
                  color="#2db7f5"
                  @click="timeChange('class30' + (hourInfo.morningNum + hourInfo.forenoonNum + index + 1))"
                >设置</a-tag>
              </li>
            </ul>
          </div>
          <div
            class="qui-fx-f1 qui-fx"
            v-for="(i, index) in toArray(hourInfo.nightNum)"
            :key="'4' +index"
          >
            <ul
              class="qui-fx qui-fx-f1"
              :id="'class40' + (hourInfo.morningNum + hourInfo.forenoonNum + hourInfo.afternoonNum + index + 1)"
            >
              <li class="qui-fx-f1 qui-fx-ac-jc" v-for="(box, ind) in 2" :key="40 + ind"></li>
              <li class="qui-fx-f1 qui-fx-ac-jc">
                <a-tag
                  color="#2db7f5"
                  @click="timeChange('class40' + (hourInfo.morningNum + hourInfo.forenoonNum + hourInfo.afternoonNum + index + 1))"
                >设置</a-tag>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <edit-hour ref="editHour"></edit-hour>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import EditHour from '../../component/ScheduleComponents/EditHour'
import SubmitForm from '@c/SubmitForm'
var weekList = [
  {
    key: 1,
    val: '周一'
  },
  {
    key: 2,
    val: '周二'
  },
  {
    key: 3,
    val: '周三'
  },
  {
    key: 4,
    val: '周四'
  },
  {
    key: 5,
    val: '周五'
  },
  {
    key: 6,
    val: '周六'
  },
  {
    key: 7,
    val: '周日'
  }
]
var calssNumber = [
  {
    key: 0,
    val: 0
  },
  {
    key: 1,
    val: 1
  },
  {
    key: 2,
    val: 2
  },
  {
    key: 3,
    val: 3
  },
  {
    key: 4,
    val: 4
  },
  {
    key: 5,
    val: 5
  }
]
const classData = [
  {
    value: 'week',
    list: weekList,
    initValue: [],
    type: 'checkbox',
    label: '星期',
    required: true,
    placeholder: '请选择天数'
  },
  {
    value: 'morningNum',
    list: calssNumber,
    initValue: [],
    type: 'select',
    label: '早上',
    required: true,
    placeholder: '请选择课节数'
  },
  {
    value: 'forenoonNum',
    list: calssNumber,
    initValue: [],
    type: 'select',
    label: '上午',
    required: true,
    placeholder: '请选择课节数'
  },
  {
    value: 'afternoonNum',
    list: calssNumber,
    initValue: [],
    type: 'select',
    label: '下午',
    required: true,
    placeholder: '请选择课节数'
  },
  {
    value: 'nightNum',
    list: calssNumber,
    initValue: [],
    type: 'select',
    label: '晚上',
    required: true,
    placeholder: '请选择课节数'
  }
]
const timeData = [
  {
    value: 'startTime',
    type: 'time',
    label: '上课时间',
    initValue: '',
    required: true,
    placeholder: '请选择上课时间'
  },
  {
    value: 'endTime',
    type: 'time',
    label: '下课时间',
    initValue: '',
    required: true,
    placeholder: '请选择下课时间'
  }
]
export default {
  components: {
    EditHour,
    SubmitForm
  },
  data() {
    return {
      noDataTag: false,
      editTag: false,
      editVisible: false,
      classTag: false,
      classData: classData,
      timeTag: false,
      timeData: timeData,
      timeList: null,
      hourInfo: {
        week: '1,2,3,4,5'
      },
      classNum: 4,
      weekDays: ['上课时间', '下课时间', '操作']
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  mounted() {
    this.initClass()
  },
  methods: {
    ...mapActions('home', ['getClassNum', 'getCourseList', 'addCourse', 'addCourseTime']),
    getNum() {
      const w = this.hourInfo.week
      return typeof w === 'object' ? w.length : w.split(',').length
    },
    toArray(num) {
      if (parseInt(num) === 0) return []
      return new Array(num)
    },
    gmtToDate(date) {
      const d = new Date(date)
      return (
        (d.getHours() > 9 ? d.getHours() : '0' + d.getHours()) +
        ':' +
        (d.getMinutes() > 9 ? d.getMinutes() : '0' + d.getMinutes())
      )
    },
    // 初始化课时
    initClass() {
      this.getClassNum({
        schoolCode: this.userInfo.schoolCode
      }).then(res => {
        const data = res.data
        if (!data) {
          this.editTag = false
          return
        }
        this.editTag = true
        this.hourInfo = data
        this.classNum = data.morningNum + data.forenoonNum + data.afternoonNum + data.nightNum
        this.getCourseList({ schoolCode: this.userInfo.schoolCode }).then(res => {
          this.timeList = res.data
          if (!res.data) {
            return
          }
          res.data.forEach(item => {
            try {
              this.$tools.goNext(() => {
                document.querySelector('#class' + (item.timeInterval + '0' + item.classNode)).children[0].innerHTML =
                  item.startTime
                document.querySelector('#class' + (item.timeInterval + '0' + item.classNode)).children[1].innerHTML =
                  item.endTime
              })
            } catch (err) {}
          })
        })
      })
    },
    // 弹出课节弹出框
    setChange() {
      this.classTag = true
      this.hourInfo.week =
        typeof this.hourInfo.week === 'object'
          ? this.hourInfo.week
          : this.hourInfo.week.split(',').map(i => parseInt(i))
      for (const key in this.hourInfo) {
        if (this.hourInfo[key] === 0) {
          this.hourInfo[key] = this.hourInfo[key] + ''
        }
      }
      this.classData = this.$tools.fillForm(this.classData, this.hourInfo)
    },
    // 弹出时间设置框
    timeChange(id) {
      console.log(id)
      if (!this.timeList) {
        this.$message.warning('请先设置课节')
        return
      }
      const time = this.timeList.filter(item => {
        return parseInt(item.classNode) === parseInt(id.substring(7, id.length)) && parseInt(item.timeInterval) === parseInt(id.substring(5, 6))
      })
      console.log(time)
      if (time.length === 0) {
        this.timeId = ''
      } else {
        this.timeId = time[0].id
      }
      this.timeTag = true
      const dom = document.querySelector(`#${id}`).children
      const rangeTime = {
        startTime: dom[0].innerHTML,
        endTime: dom[1].innerHTML
      }
      this.currentId = id
      this.timeData = this.$tools.fillForm(this.timeData, rangeTime)
    },
    // 新增修改课节时间
    timeForm(values) {
      if (values.endTime < values.startTime) {
        this.$message.warning('下课时间不能早于上课时间')
        this.$refs.tForm.error()
        return
      }
      console.log(this.currentId)
      this.addCourseTime({
        id: this.timeId,
        startTime: values.startTime,
        endTime: values.endTime,
        classNode: this.currentId.substring(7, this.currentId.length),
        timeInterval: this.currentId.substring(5, 6),
        schoolCode: this.userInfo.schoolCode
      })
        .then(res => {
          this.$message.success('设置成功')
          this.$refs.tForm.reset()
          this.$tools.goNext(() => {
            this.initClass()
          })
        })
        .catch(() => {
          this.$refs.tForm.error()
        })
    },
    // 新增或修改课节
    classForm(values) {
      if (this.editTag) {
        const _self = this
        this.$confirm({
          title: '修改课节设置后将清空已创建的课时和课程表，确定修改吗？',
          content: '',
          okText: '确定',
          okType: 'danger',
          cancelText: '取消',
          onOk() {
            _self.saveForm(values)
          },
          onCancel() {
            _self.$refs.cForm.error()
          }
        })
      } else {
        this.saveForm(values)
      }
    },
    saveForm(values) {
      this.classStatus = true
      values.week = values.week.sort().join(',')
      const obj = {
        schoolCode: this.userInfo.schoolCode,
        id: this.hourInfo.id
      }
      this.addCourse({
        ...values,
        ...obj
      })
        .then(res => {
          this.$message.success('设置成功')
          this.$refs.cForm.reset()
          this.$tools.goNext(() => {
            this.$router.go(0)
          })
        })
        .catch(() => {
          this.$refs.cForm.error()
        })
    }
  }
}
</script>

<style lang="less" scoped>
ul,
li {
  padding: 0;
  margin: 0;
}
.time-ul {
  width: 100%;
  li {
    height: 50px;
    line-height: 50px;
    text-align: center;
    border: 1px #ccc solid;
    border-left: none;
    &:first-child {
    }
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
    font-size: 16px;
    letter-spacing: 1px;
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
    border-left: none;
    border-top: none;
    border-right: none;
  }
}
.class-step {
  width: 100px;
  text-align: center;
}
</style>
