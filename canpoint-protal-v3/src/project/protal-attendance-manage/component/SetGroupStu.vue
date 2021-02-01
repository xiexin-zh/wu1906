<template>
  <a-form :form="form">
    <a-form-item label="考勤组名称" :label-col="{ span: 3 }" :wrapper-col="{ span: 15 }">
      <a-input
        placeholder="请输入考勤组名称"
        :maxLength="15"
        v-decorator="[
          'groupName',
          { initialValue: groupName, rules: [{ required: true, message: '请输入考勤组名称' }] }
        ]"
      />
    </a-form-item>
    <a-form-item label="考勤时间" :label-col="{ span: 3 }" :wrapper-col="{ span: 15 }" :required="true">
      <a-table
        :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        :columns="groupSetStu"
        :dataSource="data"
        :bordered="true"
        :pagination="false"
        class="table"
      >
        <template slot="action" slot-scope="text, record">
          <div class="action u-fx-jsa u-fx-ac" v-for="(item, i) in record.accessTimeList" :key="i">
            <template>
              <a-time-picker
                format="HH:mm"
                :defaultValue="moment(item.startTime, 'HH:mm')"
                @change="(val, dateStrings) => changeTime(val, dateStrings, 'startTime', record.id, i)"
              />
              <span>至</span>
              <a-time-picker
                format="HH:mm"
                :disabledHours="(val) => getDisabledHours(val, record.id, i)"
                :disabledMinutes="(val) => getDisabledMinutes(val, record.id, i)"
                :defaultValue="moment(item.endTime, 'HH:mm')"
                @change="(val, dateStrings) => changeTime(val, dateStrings, 'endTime', record.id, i)"
              />
            </template>
          </div>
        </template>
      </a-table>
    </a-form-item>
    <a-form-item label="特殊日期" :label-col="{ span: 3 }" :wrapper-col="{ span: 18 }">
      <a-checkbox-group v-decorator="['holidayFlag', { initialValue: holidayFlag }]">
        <a-checkbox value="1">法定节假日自动排休</a-checkbox>
      </a-checkbox-group>
      <div>
        <div>必须打卡的日期：<u-button size="small" type="light" icon="plus" @click="add(1)">添加</u-button></div>
        <a-table :columns="specialColumns" :dataSource="clockList" :bordered="true" :pagination="false" class="table">
          <template slot="action" slot-scope="text, record">{{ record.startTime }} ~ {{ record.endTime }}</template>
          <template slot="other1" slot-scope="text, record">
            <u-button class="u-mar-r10" size="small" type="link" @click="add(2, record)">编辑</u-button>
            <u-button delete size="small" type="link" @click="del('clockList', record)">删除</u-button>
          </template>
        </a-table>
      </div>
      <div>
        <div>
          不用打卡的日期：
          <u-button size="small" type="light" icon="plus" @click="clockTag = true">添加</u-button>
        </div>
        <a-table :columns="specialColumns" :dataSource="unClockList" :bordered="true" :pagination="false" class="table">
          <template slot="action"> 休息 </template>
          <template slot="other1" slot-scope="text, record">
            <u-button delete size="small" type="link" @click="del('unClockList', record)">删除</u-button>
          </template>
        </a-table>
      </div>
    </a-form-item>
    <a-form-item :wrapper-col="{ span: 10, offset: 10 }">
      <u-button type="default" style="margin-right: 50px" @click="cancle">取消</u-button>
      <a-button type="primary" :loading="loading" @click="handleSubmit">保存</a-button>
    </a-form-item>
    <must-clock ref="mustClock" @submit="mustClock" v-model="mustClockTag"></must-clock>
    <no-clock ref="noClock" @submit="noClock" v-model="clockTag"></no-clock>
  </a-form>
</template>

<script>
import moment from 'moment'
import { mapState, mapActions } from 'vuex'
import { groupSetStu, specialColumns } from '../table-columns/group'
import MustClock from './MustClock'
import NoClock from './NoClock'
export default {
  name: 'SetGroupStu',
  components: {
    MustClock,
    NoClock
  },
  props: {
    groupId: {
      type: String,
      default: ''
    }
  },
  computed: {
    ...mapState('home', ['schoolCode'])
  },
  data() {
    return {
      moment,
      groupSetStu,
      specialColumns,
      clockTag: false,
      mustClockTag: false,
      clockList: [],
      unClockList: [],
      holidayFlag: ['1'],
      loading: false,
      data: [
        {
          key: 2,
          weekDay: '星期一',
          accessTimeList: [],
          id: 0
        },
        {
          key: 3,
          weekDay: '星期二',
          accessTimeList: [],
          id: 1
        },
        {
          key: 4,
          weekDay: '星期三',
          accessTimeList: [],
          id: 2
        },
        {
          key: 5,
          weekDay: '星期四',
          accessTimeList: [],
          id: 3
        },
        {
          key: 6,
          weekDay: '星期五',
          accessTimeList: [],
          id: 4
        },
        {
          key: 7,
          weekDay: '星期六',
          accessTimeList: [],
          id: 5
        },
        {
          key: 1,
          weekDay: '星期日',
          accessTimeList: [],
          id: 6
        }
      ],
      formLayout: 'horizontal',
      selectedRowKeys: [],
      pageList: {
        page: 1,
        size: 9999
      },
      form: this.$form.createForm(this),
      groupName: ''
    }
  },
  async created() {
    if (this.groupId) {
      const res = await this.getAccessDetail({ groupId: this.groupId })
      this.showData(res.data)
    } else {
      this.data.forEach((ele) => {
        ele.accessTimeList = [{ startTime: '00:00', endTime: '00:00', canAdd: true }]
      })
    }
  },
  methods: {
    ...mapActions('home', ['getAccessDetail', 'updateAccess']),
    // 表单回填
    async showData(value) {
      if (!value) return
      this.detailData = value
      this.holidayFlag = value.holidayFlag === '1' ? ['1'] : []
      this.groupName = value.groupName
      this.data.forEach((ele) => {
        ele.accessTimeList = [{ startTime: '00:00', endTime: '00:00', canAdd: true }]
      })
      value.rules.forEach((item) => {
        this.selectedRowKeys.push(parseInt(item.dayName))
        if (item.dayName === '1') {
          this.data[6].accessTimeList[0] = {
            startTime: item.startTime,
            endTime: item.endTime,
            canAdd: true
          }
        } else {
          this.data[parseInt(item.dayName) - 2].accessTimeList[0] = {
            startTime: item.startTime,
            endTime: item.endTime,
            canAdd: true
          }
        }
      })
      this.clockList = value.specialSignInDayRuleDtos.map((ele, index) => {
        return {
          current: this.$tools.getDate(ele.dayTime, 1),
          startTime: ele.ruleTimeDtoList[0].startTime,
          endTime: ele.ruleTimeDtoList[0].endTime
        }
      })
      console.log(this.clockList)
      this.unClockList = value.noSignInDayRuleDtos.map((ele) => {
        return {
          ...ele,
          current:
            ele.startDate === ele.endDate
              ? this.$tools.getDate(ele.startDate, 1)
              : `${this.$tools.getDate(ele.startDate, 1)}~${this.$tools.getDate(ele.endDate, 1)}`
        }
      })
      console.log(this.selectedRowKeys)
    },
    // 提交权限组
    handleSubmit(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log(values)
          console.log(this.data)
          console.log(this.selectedRowKeys)
          if (this.selectedRowKeys.length === 0) {
            this.$message.warning('请勾选考勤时间')
            return
          }
          const rules = []
          const weeks = []
          this.selectedRowKeys.forEach((item) => {
            var id = 1
            if (item === 1) {
              id = 6
            } else {
              id = item - 2
            }
            weeks.push(this.data[id])
          })
          weeks.forEach((ele) => {
            rules.push({
              dayName: ele.key,
              startTime: ele.accessTimeList[0].startTime ? ele.accessTimeList[0].startTime : '00:00',
              endTime: ele.accessTimeList[0].endTime ? ele.accessTimeList[0].endTime : '00:00'
            })
          })
          let result = true
          console.log(rules)
          rules.forEach((eve) => {
            if (
              parseInt(eve.startTime.split(':')[0]) * 60 + parseInt(eve.startTime.split(':')[1]) >
              parseInt(eve.endTime.split(':')[0]) * 60 + parseInt(eve.endTime.split(':')[1])
            ) {
              result = false
            }
          })
          if (!result) {
            this.$message.warning('考勤开始时间不能晚于结束时间')
            return
          }
          const req = {
            holidayFlag: values.holidayFlag.length > 0 ? '1' : '0',
            groupName: values.groupName,
            studentRules: rules,
            schoolCode: this.schoolCode,
            type: 2,
            specialClockDayRules: this.clockList.map((ele) => {
              return {
                dayTime: ele.current,
                ruleTimeDtoList: [
                  {
                    startTime: ele.startTime,
                    endTime: ele.endTime
                  }
                ]
              }
            }),
            noClockDayRules: this.unClockList.map((ele) => {
              return {
                startDate: ele.current.indexOf('~') > -1 ? ele.current.split('~')[0] : ele.current,
                endDate: ele.current.indexOf('~') > -1 ? ele.current.split('~')[1] : ele.current
              }
            })
          }
          console.log(req)
          this.loading = true
          if (this.groupId) req.id = this.groupId
          this.updateAccess(req)
            .then((res) => {
              this.$message.success('保存成功')
              this.$tools.goNext(() => {
                this.loading = true
                this.$router.push({ path: '/studentSet' })
              })
            })
            .catch(() => {
              this.loading = false
            })
        }
      })
    },
    changeTime(val, dateStrings, type, id, index) {
      if (type === 'startTime') {
        this.data[id].accessTimeList[index].startTime = dateStrings
      } else {
        this.data[id].accessTimeList[index].endTime = dateStrings
      }
    },
    getDisabledHours(val, id, index) {
      const hours = []
      const time = this.data[id].accessTimeList[index].startTime
      const timeArr = time.split(':')
      for (var i = 0; i < parseInt(timeArr[0]); i++) {
        hours.push(i)
      }
      return hours
    },
    getDisabledMinutes(selectedHour, id, index) {
      const time = this.data[id].accessTimeList[index].startTime
      const timeArr = time.split(':')
      const minutes = []
      if (selectedHour === parseInt(timeArr[0])) {
        for (var i = 0; i < parseInt(timeArr[1]); i++) {
          minutes.push(i)
        }
      }
      return minutes
    },
    // 考勤日期选择
    onSelectChange(selectedRowKeys) {
      console.log('selectedRowKeys changed: ', selectedRowKeys)
      this.selectedRowKeys = selectedRowKeys
    },
    // 添加考勤时间
    addAccessTime(index, key) {
      this.data[key].accessTimeList.push({ startTime: null, endTime: null })
    },
    // 删除特殊日期
    delDate(record) {
      this.$tools.delTip('确定删除吗?', () => {
        console.log(record.id)
      })
    },
    cancle() {
      this.$router.push({ path: '/studentSet' })
    },
    // 添加必须打卡日期
    add(type, record) {
      this.state = type
      this.$refs.mustClock.defaultValue = type === 2 ? moment(record.current).format('YYYY-MM-DD HH:mm:ss') : ''
      this.$refs.mustClock.current = type === 2 ? record.current : ''
      this.$refs.mustClock.startTime = type === 2 ? record.startTime : '00:00'
      this.$refs.mustClock.endTime = type === 2 ? record.endTime : '00:00'
      this.$refs.mustClock.id = type === 2 ? record.id : ''
      this.chooseRecord = type === 2 ? record : {}
      this.mustClockTag = true
    },
    mustClock(record) {
      console.log(record)
      if (this.state === 1) {
        this.clockList.push(record)
      } else if (this.state === 2) {
        const i = this.clockList.findIndex((list) => {
          return list.id === this.chooseRecord.id
        })
        console.log(i)
        if (i !== -1) {
          this.clockList[i].startTime = record.startTime
          this.clockList[i].endTime = record.endTime
          this.clockList[i].current = record.current
        }
      }
      this.$refs.mustClock.reset()
    },
    // 不用打卡日期
    noClock(record) {
      console.log(record)
      this.unClockList.push(record)
      this.$refs.noClock.reset()
    },
    // 特殊日期的删除
    del(type, record) {
      this[type] = this[type].filter((list) => list !== record)
    }
  }
}
</script>
<style lang="less" scoped></style>
