<template>
  <div class="set-group page-layout qui-fx-ver">
    <down-record v-if="recordTag" :device-sn="bussCode" buss-code="KQGLXT" v-model="recordTag"></down-record>
    <a-form :form="form" :style="{ maxHeight: maxHeight }">
      <a-form-item label="考勤组名称" :label-col="{ span: 3 }" :wrapper-col="{ span: 15 }">
        <a-input
          placeholder="请输入考勤组名称"
          maxlength="15"
          v-decorator="[
            'name',
            { initialValue: groupName, rules: [{ required: true, message: '请输入考勤组名称' }] }
          ]"
        />
      </a-form-item>
      <a-form-item
        label="考勤时间"
        :label-col="{ span: 3 }"
        :wrapper-col="{ span: 15 }"
        :required="true"
      >
        <a-table
          :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
          :columns="columns"
          :dataSource="data"
          :bordered="true"
          :pagination="false"
          class="table"
        >
          <template slot="action" slot-scope="text, record">
            <div
              class="action qui-fx-jsa qui-fx-ac"
              v-for="(item, i) in record.accessTimeList"
              :key="i"
            >
              <template>
                <a-time-picker
                  format="HH:mm"
                  :defaultValue="moment(item.startTime, 'HH:mm')"
                  @change="
                    (val, dateStrings) => changeTime(val, dateStrings, 'startTime', record.id, i)
                  "
                />
                <span>至</span>
                <a-time-picker
                  format="HH:mm"
                  :disabledHours="val => getDisabledHours(val, record.id, i)"
                  :disabledMinutes="val => getDisabledMinutes(val, record.id, i)"
                  :defaultValue="moment(item.endTime, 'HH:mm')"
                  @change="
                    (val, dateStrings) => changeTime(val, dateStrings, 'endTime', record.id, i)
                  "
                />
              </template>
            </div>
          </template>
        </a-table>
      </a-form-item>
      <a-form-item
        label="考勤设备"
        :label-col="{ span: 3 }"
        :wrapper-col="{ span: 18 }"
        :required="true"
      >
        <a-form-item
          label="特殊日期"
          :label-col="{ span: 3 }"
          :wrapper-col="{ span: 18 }"
          :required="true"
        >
          <a-checkbox-group v-decorator="['holidayFlag', { initialValue: holidayFlag, }]">
            <a-checkbox value="1">法定节假日自动排休</a-checkbox>
          </a-checkbox-group>
          <div>
            <div>
              必须打卡的日期：
              <a-button size="small" class="add-action-btn" icon="plus" @click="add(1)">添加</a-button>
            </div>
            <a-table
              :columns="set.specialColumns"
              :dataSource="clockList"
              :bordered="true"
              :pagination="false"
              class="table"
            >
              <template
                slot="action"
                slot-scope="text, record"
              >{{ record.startTime }} ~ {{ record.endTime }}</template>
              <template slot="other1" slot-scope="text, record">
                <a-tooltip placement="topLeft" title="编辑">
                  <a-button size="small" class="edit-action-btn" icon="form" @click="add(2,record)"></a-button>
                </a-tooltip>
                <template slot="title">您确定删除吗?</template>
                <a-tooltip placement="topLeft" title="删除">
                  <a-button
                    size="small"
                    class="del-action-btn"
                    icon="delete"
                    @click="del('clockList',record)"
                  ></a-button>
                </a-tooltip>
              </template>
            </a-table>
          </div>
          <div>
            <div>
              不用打卡的日期：
              <a-button size="small" class="add-action-btn" icon="plus" @click="clockTag = true">添加</a-button>
            </div>
            <a-table
              :columns="set.specialColumns"
              :dataSource="unClockList"
              :bordered="true"
              :pagination="false"
              class="table"
            >
              <template slot="action" slot-scope="text, record">休息</template>
              <template slot="other1" slot-scope="text, record">
                <a-tooltip placement="topLeft" title="删除">
                  <a-button
                    size="small"
                    class="del-action-btn"
                    icon="delete"
                    @click="del('unClockList',record)"
                  ></a-button>
                </a-tooltip>
              </template>
            </a-table>
          </div>
        </a-form-item>
        <a-form-item
          label="考勤设备"
          :label-col="{ span: 3 }"
          :wrapper-col="{ span: 18 }"
          :required="true"
        >
          <device-list
            :table-list="groupList"
            :columns="deviceColumns"
            :page-list="pageList"
            :chooseType="chooseType"
            :bind-code="groupId"
            :schoolCode="userInfo.schoolCode"
            @groupList="addGroup"
            @delGroup="delGroup"
            @showData="showData"
            @getRecordList="getRecordList"
          >
            <template v-slot:actions="action">
              <div>
                <a-switch
                  :defaultChecked="action.record.status"
                  checked-children="上学考勤"
                  un-checked-children="放学考勤"
                  v-model="action.record.inOrOut"
                />
              </div>
            </template>
          </device-list>
        </a-form-item>
        <a-form-item :wrapper-col="{ span: 15, offset: 3 }">
          <a-button style="margin-right: 50px" @click="cancle">取消</a-button>
          <a-button type="primary" :loading="loading" @click="handleSubmit">保存</a-button>
        </a-form-item>
      </a-form-item>
    </a-form>
    <must-clock ref="mustClock" @submit="mustClock" v-model="mustClockTag"></must-clock>
    <no-clock ref="noClock" @submit="noClock" v-model="clockTag"></no-clock>
  </div>
</template>

<script>
import moment from 'moment'
import { mapState, mapActions } from 'vuex'
import DownRecord from '@c/DownRecord'
import { Switch } from 'ant-design-vue'
import addImg from '../../assets/img/add.png'
import deleteImg from '../../assets//img/delete.png'
import deleImg from '../../assets/img/dele.png'
import DeviceList from '@c/DeviceList'
import set from '../../assets/js/table/set.js'
import TableList from '@c/TableList'
import MustClock from '../../component/MustClock'
import NoClock from '../../component/NoClock'
const columns = [
  {
    title: '工作日',
    align: 'center',
    dataIndex: 'weekDay'
  },
  {
    title: '上班时间一下班时间',
    dataIndex: 'accessTime',
    align: 'center',
    scopedSlots: {
      customRender: 'action'
    }
  }
]

const deviceColumns = [
  {
    title: '序号',
    width: '10%',
    scopedSlots: {
      customRender: 'index'
    },
    align: 'center'
  },
  {
    title: '设备名称',
    dataIndex: 'deviceName',
    width: '15%',
    align: 'center'
  },
  {
    title: '设备类型',
    dataIndex: 'deviceType',
    width: '15%',
    customRender: text => {
      return parseInt(text) === 1 ? '网络相机' : parseInt(text) === 2 ? '面板机' : '班牌'
    },
    align: 'center'
  },
  {
    title: '安装位置',
    dataIndex: 'snapSite',
    width: '15%',
    align: 'center'
  },
  {
    title: '设备SN码',
    dataIndex: 'deviceSn',
    width: '15%',
    align: 'center'
  },
  {
    title: '控制类型',
    dataIndex: 'inOrOut',
    width: '15%',
    align: 'center',
    customRender: text => {
      return parseInt(text) === 1 ? '进' : parseInt(text) === 2 ? '出' : '无'
    }
  },
  {
    title: '操作',
    width: '20%',
    align: 'center',
    scopedSlots: {
      customRender: 'action'
    }
  }
]
export default {
  name: 'SetGroup',
  components: {
    TableList,
    DeviceList,
    ASwitch: Switch,
    DownRecord,
    NoClock,
    MustClock
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  data() {
    return {
      set,
      clockTag: false,
      mustClockTag: false,
      clockList: [],
      unClockList: [],
      holidayFlag: ['1'],
      loading: false,
      recordTag: false,
      bussCode: '',
      moment,
      userTag: false,
      maxHeight: 0,
      addImg,
      deleImg,
      deleteImg,
      columns,
      deviceColumns,
      dateData: [],
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
      groupList: [],
      groupId: '',
      chooseType: '',
      detailData: null,
      groupName: '',
      type: ''
    }
  },
  created() {
    this.maxHeight = window.screen.height - 280 + 'px'
    this.groupId = this.$route.query.id ? this.$route.query.id.toString() : ''
    this.type = this.$route.query.type
    if (this.type === 'student') {
      this.columns[1].title = '上学时间一放学时间'
    }
    if (this.groupId) {
      this.chooseType = 'attendance'
      this.showData()
    } else {
      this.data.forEach(ele => {
        ele.accessTimeList = [{ startTime: '00:00', endTime: '00:00', canAdd: true }]
      })
    }
  },
  async mounted() {},
  methods: {
    ...mapActions('home', ['addAccess', 'getAccessDetail', 'updateAccess']),
    // 获取下发记录
    getRecordList(record) {
      this.bussCode = record.deviceSn
      this.recordTag = true
    },
    // 表单回填
    async showData(value) {
      if (!value) return
      this.detailData = value
      this.holidayFlag = value.holidayFlag === '1' ? ['1'] : []
      this.groupName = value.groupName
      this.groupList = value.controllerGroups.map(ele => {
        return {
          ...ele,
          snapSite: ele.address,
          deviceType: ele.type
        }
      })
      this.data.forEach(ele => {
        ele.accessTimeList = [{ startTime: '00:00', endTime: '00:00', canAdd: true }]
      })
      value.rules.forEach(item => {
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
      this.unClockList = value.noSignInDayRuleDtos.map(ele => {
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
          console.log(this.groupList)
          console.log(this.selectedRowKeys)
          if (this.selectedRowKeys.length === 0) {
            this.$message.warning('请勾选考勤时间')
            return
          }
          if (this.groupList.length === 0) {
            this.$message.warning('请添加考勤设备')
            return
          }
          const rules = []
          const weeks = []
          this.selectedRowKeys.forEach(item => {
            var id = 1
            if (item === 1) {
              id = 6
            } else {
              id = item - 2
            }
            weeks.push(this.data[id])
          })
          weeks.forEach(ele => {
            rules.push({
              dayName: ele.key,
              startTime: ele.accessTimeList[0].startTime
                ? ele.accessTimeList[0].startTime
                : '00:00',
              endTime: ele.accessTimeList[0].endTime ? ele.accessTimeList[0].endTime : '00:00'
            })
          })
          let result = true
          console.log(rules)
          rules.forEach(eve => {
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
          const deviceGroups = []
          this.groupList.forEach(ele => {
            deviceGroups.push({
              address: ele.snapSite,
              deviceName: ele.deviceName,
              deviceSn: ele.deviceSn,
              inOrOut: ele.inOrOut,
              type: ele.deviceType
            })
          })
          const specialClockDayRules = []
          this.clockList.forEach(ele => {
            specialClockDayRules.push({
              dayTime: ele.current,
              ruleTimeDtoList: [
                {
                  startTime: ele.startTime,
                  endTime: ele.endTime
                }
              ]
            })
          })
          const noClockDayRules = []
          this.unClockList.forEach(ele => {
            noClockDayRules.push({
              startDate: ele.current.indexOf('~') > -1 ? ele.current.split('~')[0] : ele.current,
              endDate: ele.current.indexOf('~') > -1 ? ele.current.split('~')[1] : ele.current
            })
          })
          const req = {
            holidayFlag: values.holidayFlag.length > 0 ? '1' : '0',
            deviceGroups,
            groupName: values.name,
            rules,
            schoolCode: this.userInfo.schoolCode,
            type: this.type === 'teacher' ? 1 : 2,
            specialClockDayRules,
            noClockDayRules
          }
          console.log(req)
          this.loading = true
          const path = this.type === 'teacher' ? '/teacherAccessSet' : '/studentAttendanceSet'
          if (this.groupId) {
            req.id = this.groupId
            this.updateAccess(req)
              .then(res => {
                this.$message.success('编辑成功')
                this.$tools.goNext(() => {
                  this.loading = true
                  this.$router.push({ path })
                })
              })
              .catch(() => {
                this.loading = false
              })
          } else {
            this.addAccess(req)
              .then(res => {
                this.$message.success('添加成功')
                this.$tools.goNext(() => {
                  this.loading = true
                  this.$router.push({ path })
                })
              })
              .catch(() => {
                this.loading = false
              })
          }
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
    // 添加测温设备
    addGroup(value) {
      this.groupList.forEach(ele => {
        value.forEach(item => {
          if (ele.deviceSn === item.id) {
            item.inOrOut = ele.inOrOut
          }
        })
      })
      console.log(this.groupList)
      this.$nextTick(() => {
        this.groupList = value
      })
    },
    // 删除设备
    delGroup(value) {
      const index = this.groupList.findIndex(list => list.deviceSn === value.deviceSn)
      if (index !== -1) {
        this.groupList.splice(index, 1)
      }
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
      const path = this.type === 'teacher' ? '/teacherAccessSet' : '/studentAttendanceSet'
      this.$router.push({ path })
    },
    // 添加必须打卡日期
    add(type, record) {
      this.state = type
      this.$refs.mustClock.defaultValue =
        type === 2 ? moment(record.current).format('YYYY-MM-DD HH:mm:ss') : ''
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
        const i = this.clockList.findIndex(list => {
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
      this[type] = this[type].filter(list => list !== record)
    }
  }
}
</script>

<style lang="less" scoped>
.set-group {
  background: #fff;
  padding-top: 20px;
  overflow: auto;
  .table {
    max-height: 300px;
    overflow: auto;
  }
  .action {
    margin: 5px 0;
    span {
      margin: 0 5px;
    }
    .right {
      img {
        width: 24px;
        height: 24px;
        margin: 0 10px;
        cursor: pointer;
      }
    }
  }
  .control-list {
    display: inline-block;
    margin: 0 10px 10px 0;
    line-height: 25px;
  }
}
</style>
