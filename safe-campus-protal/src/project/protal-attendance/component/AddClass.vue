<template>
  <a-modal
    width="1000px"
    title="添加班次"
    v-model="status"
    @ok="submitOk"
    :maskClosable="false"
    :destroyOnClose="true"
    :confirmLoading="confirmLoading"
  >
    <div class="set-group page-layout qui-fx-ver">
      <down-record v-if="recordTag" :device-sn="bussCode" buss-code="KQGLXT" v-model="recordTag"></down-record>
      <a-form :form="form" :style="{ maxHeight: maxHeight }">
        <a-form-item label="班次名称" :label-col="{ span: 3 }" :wrapper-col="{ span: 15 }">
          <a-input
            placeholder="请输入班次名称"
            maxlength="15"
            v-decorator="['name', { initialValue: name, rules: [{ required: true, message: '请输入班次名称' }] }]"
          />
        </a-form-item>
        <a-form-item label="打卡时间" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }" :required="true">
          <div class="u-tips-color">类型：一天两次上下班</div>
          <a-table
            :columns="columns"
            :dataSource="data"
            :bordered="true"
            :pagination="false"
            class="table"
          >
            <template slot="other1" slot-scope="text, record">
              <div class="action qui-fx-jsa qui-fx-ac">
                <template>
                  {{ record.title }}
                  <a-time-picker
                    :allowClear="false"
                    format="HH:mm"
                    :disabledHours="val => getDisabledHours(val, record.id, 'time')"
                    :disabledMinutes="val => getDisabledMinutes(val, record.id, 'time')"
                    :defaultValue="moment(record.time, 'HH:mm')"
                    @change="(val, dateStrings) => changeTime(val, dateStrings, 'time', record.id)"
                  />
                </template>
              </div>
            </template>
            <template slot="other2" slot-scope="text, record">
              <div class="action qui-fx-jsa qui-fx-ac">
                <template>
                  <a-time-picker
                    :allowClear="false"
                    format="HH:mm"
                    :defaultValue="moment(record.startTime, 'HH:mm')"
                    :disabledHours="val => getDisabledHours(val, record.id, 'startTime')"
                    :disabledMinutes="val => getDisabledMinutes(val, record.id, 'startTime')"
                    @change="(val, dateStrings) => changeTime(val, dateStrings, 'startTime', record.id)"
                  />
                  <span>至</span>
                  <a-time-picker
                    :allowClear="false"
                    format="HH:mm"
                    :disabledHours="val => getDisabledHours(val, record.id, 'endTime')"
                    :disabledMinutes="val => getDisabledMinutes(val, record.id, 'endTime')"
                    :defaultValue="moment(record.endTime, 'HH:mm')"
                    @change="(val, dateStrings) => changeTime(val, dateStrings, 'endTime', record.id)"
                  />
                  可打卡
                </template>
              </div>
            </template>
            <template slot="other3" slot-scope="text, record">
              <div class="action qui-fx-jsa qui-fx-ac">
                <template>
                  <a-switch
                    v-model="record.checked"
                    checked-children="是"
                    un-checked-children="否"
                    @change="onChange($event,record)"
                    :disabled="parseInt(record.id) === 0"/>
                </template>
              </div>
            </template>
          </a-table>
        </a-form-item>
      </a-form>
    </div>
  </a-modal>
</template>

<script>
import moment from 'moment'
import { mapState, mapActions } from 'vuex'
const columns = [
  {
    title: '上下班时间',
    align: 'center',
    dataIndex: 'weekDay',
    scopedSlots: {
      customRender: 'other1'
    }
  },
  {
    title: '打卡时间限制',
    dataIndex: 'accessTime',
    align: 'center',
    scopedSlots: {
      customRender: 'other2'
    }
  },
  {
    title: '是否需要打卡',
    dataIndex: 'accessTime1',
    align: 'center',
    scopedSlots: {
      customRender: 'other3'
    }
  }
]
export default {
  name: 'AddClass',
  computed: {
    ...mapState('home', ['userInfo']),
    status: {
      get() {
        return this.value
      },
      set() {
        this.$emit('input', false)
      }
    }
  },
  data() {
    return {
      loading: false,
      recordTag: false,
      bussCode: '',
      moment,
      userTag: false,
      maxHeight: 0,
      columns,
      dateData: [],
      data: [
        {
          key: 1,
          id: 0,
          title: '上午上班'
        },
        {
          key: 2,
          id: 1,
          title: '上午下班'
        },
        {
          key: 3,
          id: 2,
          title: '下午上班'
        },
        {
          key: 4,
          id: 3,
          title: '下午下班'
        }
      ],
      formLayout: 'horizontal',
      selectedRowKeys: [],
      pageList: {
        page: 1,
        size: 9999
      },
      form: this.$form.createForm(this),
      groupList: [],
      chooseType: '',
      detailData: null,
      name: '',
      type: '',
      confirmLoading: false
    }
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    classObg: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  created() {
    this.maxHeight = window.screen.height - 280 + 'px'
  },
  methods: {
    ...mapActions('home', ['addShiftManage', 'updateShiftManage']),
    // 添加提交
    submitOk(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          const arr = []
          this.data.forEach((element, index) => {
            if (element.time <= element.startTime || element.time >= element.endTime || element.startTime >= element.endTime) {
              arr.push(1)
            }
            if (index < 3) {
              if (this.data[index].time >= this.data[index + 1].time || this.data[index].startTime >= this.data[index + 1].startTime || this.data[index].endTime >= this.data[index + 1].endTime) {
                arr.push(1)
              }
            }
            if (index !== 0) {
              if (this.data[index].startTime <= this.data[index - 1].endTime) {
                arr.push(1)
              }
            }
          })
          if (arr.indexOf(1) > -1) {
            this.$message.warning('请填写正确的时间')
            return false
          }
          const shiftRuleDtoList = this.data.map(el => {
            return {
              hasValid: el.checked ? '1' : '0',
              workTime: el.time,
              startTime: el.startTime,
              endTime: el.endTime
            }
          })
          const req = {
            ...values,
            schoolCode: this.userInfo.schoolCode,
            shiftRuleDtoList: shiftRuleDtoList
          }
          this.loading = true
          if (this.classId) {
            req.id = this.classId
            this.updateShiftManage(req)
              .then(res => {
                this.$message.success('编辑成功')
                this.$tools.goNext(() => {
                  this.confirmLoading = false
                  this.status = false
                  this.$emit('update')
                })
              })
              .catch(() => {
                this.loading = false
              })
          } else {
            this.addShiftManage(req)
              .then(res => {
                this.$message.success('添加成功')
                this.$tools.goNext(() => {
                  this.confirmLoading = false
                  this.status = false
                  this.$emit('update')
                })
              })
              .catch(() => {
                this.loading = false
              })
          }
        }
      })
    },
    // 上下班时间的改变
    changeTime(val, dateStrings, type, id) {
      this.data[id][type] = dateStrings
    },
    // 限制小时
    getDisabledHours(val, id, string) {
      // if (string === 'startTime') {
      //   const hours = []
      //   const time = this.data[id].time.split(':')[0]
      //   const endTime = this.data[id].endTime.split(':')[0]
      //   const timeArr = time > 9 ? time : time[1]
      //   const endTimeArr = endTime > 9 ? endTime : endTime[1]
      //   for (let i = (parseInt(timeArr) + 1); i < 24; i++) {
      //     hours.push(i)
      //   }
      //   if (id !== 0) {
      //     const lastEndTime = this.data[id - 1].endTime.split(':')[0]
      //     const lastEndTimeArr = lastEndTime > 9 ? lastEndTime : lastEndTime[1]
      //     for (let k = 0; k < parseInt(lastEndTimeArr); k++) {
      //       hours.push(k)
      //     }
      //   }
      //   if (endTime !== '00') {
      //     for (let j = parseInt(endTimeArr); j < 24; j++) {
      //       hours.push(j)
      //     }
      //   }
      //   return hours
      // }
      // // 大于上一个endTime 大于starttime 小于endtime
      // if (id !== 0 && string === 'time') {
      //   const hours = []
      //   const lastEndTime = this.data[id - 1].endTime
      //   const startTime = this.data[id].startTime.split(':')[0]
      //   const endTime = this.data[id].endTime.split(':')[0]
      //   const lastEndTimeArr = lastEndTime > 9 ? lastEndTime : lastEndTime[1]
      //   const startTimeArr = startTime > 9 ? startTime : startTime[1]
      //   const endTimeArr = endTime > 9 ? endTime : endTime[1]
      //   for (let i = 0; i < parseInt(lastEndTimeArr); i++) {
      //     hours.push(i)
      //   }
      //   for (let k = 0; k < parseInt(startTimeArr); k++) {
      //     hours.push(k)
      //   }
      //   if (endTime !== '00') {
      //     for (let j = parseInt(endTimeArr); j < 24; j++) {
      //       hours.push(j)
      //     }
      //   }
      //   return hours
      // }
      // // 大于time和startime 小于下一个starttime
      // if (string === 'endTime') {
      //   const hours = []
      //   const time = this.data[id].time.split(':')[0]
      //   const startTime = this.data[id].startTime.split(':')[0]
      //   const timeArr = time > 9 ? time : time[1]
      //   const startTimeArr = startTime > 9 ? startTime : startTime[1]
      //   for (let i = 0; i < parseInt(timeArr); i++) {
      //     hours.push(i)
      //   }
      //   for (let k = 0; k < parseInt(startTimeArr); k++) {
      //     hours.push(k)
      //   }
      //   return hours
      // }
      // if (id === 0 && string !== 'endTime') {
      //   return 0
      // } else {
      //   const hours = []
      //   const time = string === 'time' ? this.data[id - 1].time : string === 'startTime' ? this.data[id - 1].endTime : this.data[id].startTime
      //   const timeArr = time.split(':')
      //   for (var i = 0; i < parseInt(timeArr[0]); i++) {
      //     hours.push(i)
      //   }
      //   return hours
      // }
    },
    // 限制分钟
    getDisabledMinutes(selectedHour, id, string) {
      // if (string === 'startTime') {
      //   const hours = []
      //   const time = this.data[id].time.split(':')
      //   const endTime = this.data[id].endTime.split(':')
      //   const timeArr = time[1] > 9 ? time[1] : time[1][1]
      //   const endTimeArr = endTime[1] > 9 ? endTime[1] : endTime[1][1]
      //   if (selectedHour === parseInt(time[0])) {
      //     for (let i = (parseInt(timeArr) + 1); i < 60; i++) {
      //       hours.push(i)
      //     }
      //   }
      //   if (id !== 0) {
      //     const lastEndTime = this.data[id - 1].endTime.split(':')
      //     const lastEndTimeArr = lastEndTime[1] > 9 ? lastEndTime[1] : lastEndTime[1][1]
      //     if (selectedHour === parseInt(lastEndTimeArr[0])) {
      //       for (let k = 0; k < parseInt(lastEndTimeArr); k++) {
      //         hours.push(k)
      //       }
      //     }
      //   }
      //   if (endTime[1] !== '00') {
      //     if (selectedHour === parseInt(endTimeArr[0])) {
      //       for (let j = parseInt(endTimeArr); j < 60; j++) {
      //         hours.push(j)
      //       }
      //     }
      //   }
      //   return hours
      // }
      // // 大于上一个endTime 大于starttime 小于endtime
      // if (id !== 0 && string === 'time') {
      //   const hours = []
      //   const lastEndTime = this.data[id - 1].endTime.split(':')
      //   const startTime = this.data[id].startTime.split(':')
      //   const endTime = this.data[id].endTime.split(':')
      //   const lastEndTimeArr = lastEndTime[1] > 9 ? lastEndTime[1] : lastEndTime[1][1]
      //   const startTimeArr = startTime > 9 ? startTime[1] : startTime[1][1]
      //   const endTimeArr = endTime > 9 ? endTime[1] : endTime[1][1]
      //   if (selectedHour === parseInt(lastEndTimeArr[0])) {
      //     for (let i = 0; i < parseInt(lastEndTimeArr); i++) {
      //       hours.push(i)
      //     }
      //   }
      //   if (selectedHour === parseInt(startTimeArr[0])) {
      //     for (let k = 0; k < parseInt(startTimeArr); k++) {
      //       hours.push(k)
      //     }
      //   }
      //   if (selectedHour === parseInt(endTimeArr[0])) {
      //     if (endTime[1] !== '00') {
      //       for (let j = parseInt(endTimeArr); j < 60; j++) {
      //         hours.push(j)
      //       }
      //     }
      //   }
      //   return hours
      // }
      // // 大于time和startime 小于下一个starttime
      // if (string === 'endTime') {
      //   const hours = []
      //   const time = this.data[id].time.split(':')
      //   const startTime = this.data[id].startTime.split(':')
      //   const timeArr = time[1] > 9 ? time[1] : time[1][1]
      //   const startTimeArr = startTime[1] > 9 ? startTime[1] : startTime[1][1]
      //   if (selectedHour === parseInt(timeArr[0])) {
      //     for (let i = 0; i < parseInt(timeArr); i++) {
      //       hours.push(i)
      //     }
      //   }
      //   if (selectedHour === parseInt(startTimeArr[0])) {
      //     for (let k = 0; k < parseInt(startTimeArr); k++) {
      //       hours.push(k)
      //     }
      //   }
      //   return hours
      // }
      // if (id === 0 && string !== 'endTime') {
      //   return 0
      // } else {
      //   const hours = []
      //   const time = string === 'time' ? this.data[id - 1].time : string === 'startTime' ? this.data[id - 1].endTime : this.data[id].startTime
      //   const timeArr = time.split(':')
      //   if (selectedHour === parseInt(timeArr[0])) {
      //     for (var i = 0; i < parseInt(timeArr[1]); i++) {
      //       hours.push(i)
      //     }
      //   }
      //   return hours
      // }
      // if (id === 0 && string !== 'endTime') {
      //   return 0
      // } else {
      //   const minutes = []
      //   const time = string === 'time' ? this.data[id - 1].time : string === 'startTime' ? this.data[id - 1].endTime : this.data[id].startTime
      //   const timeArr = time.split(':')
      //   if (selectedHour === parseInt(timeArr[0])) {
      //     for (var i = 0; i <= parseInt(timeArr[1]); i++) {
      //       minutes.push(i)
      //     }
      //   }
      //   return minutes
      // }
    },
    // switch的改变
    onChange(e, record) {
      if (record.id === 1) {
        this.data[2].checked = this.data[1].checked
      } else if (record.id === 2) {
        this.data[1].checked = this.data[2].checked
      }
    }
  }
}
</script>

<style lang="less" scoped>
.set-group {
  .table {
    max-height: 300px;
    overflow: auto;
  }
}
</style>
