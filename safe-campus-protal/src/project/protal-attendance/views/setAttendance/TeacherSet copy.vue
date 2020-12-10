<template>
  <div class="set-group page-layout qui-fx-ver">
    <down-record v-if="recordTag" :device-sn="bussCode" buss-code="KQGLXT" v-model="recordTag"></down-record>
    <a-form :form="form" :style="{ maxHeight: maxHeight }">
      <a-form-item label="考勤组名称" :label-col="{ span: 3 }" :wrapper-col="{ span: 15 }">
        <a-input
          placeholder="请输入考勤组名称"
          v-decorator="['name', { initialValue: groupName, rules: [{ required: true, message: '请输入考勤组名称' }] }]"
        />
      </a-form-item>
      <a-form-item label="考勤时间" :label-col="{ span: 3 }" :wrapper-col="{ span: 18 }" :required="true">
        <a-table
          :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
          :columns="set.columns"
          :dataSource="data"
          :bordered="true"
          :pagination="false"
          class="table"
        >
          <template slot="action" slot-scope="text, record">
            <div class="qui-fx">
              <div>{{ record.accessTimeList.name ? `${record.accessTimeList.name}班次：` : '休息' }}</div>
              <div class="u-mar-r20" v-for="(ele, i) in record.accessTimeList.ruleTimeDtoList" :key="i">
                {{ ele.startTime }} ~ {{ ele.endTime }}
              </div>
            </div>
          </template>
          <template slot="other1" slot-scope="text, record">
            <a-tag color="#6882da" @click="add(0, record)">更改班次</a-tag>
          </template>
        </a-table>
      </a-form-item>
      <a-form-item label="特殊日期" :label-col="{ span: 3 }" :wrapper-col="{ span: 18 }" :required="true">
        <a-checkbox-group v-decorator="['holidayFlag', { initialValue: holidayFlag, }]" >
          <a-checkbox value="1"> 法定节假日自动排休 </a-checkbox>
        </a-checkbox-group>
        <div>
          <div>
            必须打卡的日期：<a-button size="small" class="add-action-btn" icon="plus" @click="add(1)">添加</a-button>
          </div>
          <a-table
            :columns="set.specialColumns"
            :dataSource="clockList"
            :bordered="true"
            :pagination="false"
            class="table"
          >
            <template slot="action" slot-scope="text, record">
              <div class="qui-fx">
                <div>{{ record.name }}班次：</div>
                <div class="u-mar-r20" v-for="(ele, i) in record.ruleTimeDtoList" :key="i">
                  {{ ele.startTime }} ~ {{ ele.endTime }}
                </div>
              </div>
            </template>
            <template slot="other1" slot-scope="text, record">
              <a-tooltip placement="topLeft" title="编辑">
                <a-button size="small" class="edit-action-btn" icon="form" @click="add(2,record)"></a-button>
              </a-tooltip>
              <template slot="title">
                您确定删除吗?
              </template>
              <a-tooltip placement="topLeft" title="删除">
                <a-button size="small" class="del-action-btn" icon="delete" @click="del('clockList',record)"></a-button>
              </a-tooltip>
            </template>
          </a-table>
        </div>
        <div>
          <div>
            不用打卡的日期：<a-button size="small" class="add-action-btn" icon="plus" @click="clockTag = true">添加</a-button>
          </div>
          <a-table
            :columns="set.specialColumns"
            :dataSource="unClockList"
            :bordered="true"
            :pagination="false"
            class="table"
          >
            <template slot="action" slot-scope="text, record">
              休息
            </template>
            <template slot="other1" slot-scope="text, record">
              <a-tooltip placement="topLeft" title="删除">
                <a-button size="small" class="del-action-btn" icon="delete" @click="del('unClockList',record)"></a-button>
              </a-tooltip>
            </template>
          </a-table>
        </div>
      </a-form-item>
      <a-form-item label="考勤设备" :label-col="{ span: 3 }" :wrapper-col="{ span: 18 }" :required="true">
        <device-list
          :table-list="groupList"
          :columns="set.deviceColumns"
          :page-list="pageList"
          :chooseType="chooseType"
          :bind-code="groupId"
          :schoolCode="userInfo.schoolCode"
          @groupList="addGroup"
          @showData="showData"
          @getRecordList="getRecordList"
          @delRecord="delRecord"
          :attendance="true"
          :show="false"
          :check="check"
        >
        </device-list>
      </a-form-item>
      <a-form-item :wrapper-col="{ span: 15, offset: 3 }">
        <a-button style="margin-right:50px;" @click="cancle">取消</a-button>
        <a-button type="primary" :loading="loading" @click="handleSubmit">保存</a-button>
      </a-form-item>
    </a-form>
    <change-class v-model="visible" :show="show" ref="changeClass" @submit="changeClass"></change-class>
    <no-clock ref="noClock" @submit="noClock" v-model="clockTag"> </no-clock>
  </div>
</template>

<script>
import moment from 'moment'
import { mapState, mapActions } from 'vuex'
import DownRecord from '@c/DownRecord'
import { Switch } from 'ant-design-vue'
import DeviceList from '@c/DeviceList'
import ChangeClass from '../../component/ChangeClass'
import NoClock from '../../component/NoClock'
import TableList from '@c/TableList'
import set from '../../assets/js/table/set.js'

export default {
  name: 'SetGroup',
  components: {
    DeviceList,
    ASwitch: Switch,
    DownRecord,
    ChangeClass,
    TableList,
    NoClock
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  data() {
    return {
      set,
      loading: false,
      recordTag: false,
      bussCode: '',
      moment,
      userTag: false,
      maxHeight: 0,
      dateData: [],
      data: [
        {
          key: 2,
          weekDay: '星期一',
          accessTimeList: {},
          id: 0
        },
        {
          key: 3,
          weekDay: '星期二',
          accessTimeList: {},
          id: 1
        },
        {
          key: 4,
          weekDay: '星期三',
          accessTimeList: {},
          id: 2
        },
        {
          key: 5,
          weekDay: '星期四',
          accessTimeList: {},
          id: 3
        },
        {
          key: 6,
          weekDay: '星期五',
          accessTimeList: {},
          id: 4
        },
        {
          key: 7,
          weekDay: '星期六',
          accessTimeList: {},
          id: 5
        },
        {
          key: 1,
          weekDay: '星期日',
          accessTimeList: {},
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
      type: '',
      visible: false,
      clockTag: false,
      clockList: [],
      unClockList: [],
      classId: '',
      state: '',
      show: false,
      holidayFlag: ['1'],
      check: false,
      chooseRecord: {}
    }
  },
  created() {
    this.maxHeight = window.screen.height - 280 + 'px'
    this.groupId = this.$route.query.id ? this.$route.query.id.toString() : ''
    if (this.groupId) {
      this.check = true
      this.attendanceGroupDetail_()
    }
  },
  async mounted() {
    this.getShiftManage_()
  },
  methods: {
    ...mapActions('home', ['addAttendanceGroup', 'getShiftManage', 'updateAttendanceGroup', 'attendanceGroupDetail']),
    // 列表
    async getShiftManage_() {
      this.pageList.schoolCode = this.userInfo.schoolCode
      const res = await this.getShiftManage(this.pageList)
      this.$refs.changeClass.recordList = res.data.list
    },
    // 获取详情
    async attendanceGroupDetail_() {
      const res = await this.attendanceGroupDetail({ groupId: this.groupId })
      this.showData(res.data)
    },
    // 获取下发记录
    getRecordList(record) {
      this.bussCode = record.deviceSn
      this.recordTag = true
    },
    // 解绑设备
    delRecord(record) {
      this.groupList = this.groupList.filter(list => list.deviceSn !== record.deviceSn)
    },
    add(type, record) {
      console.log('this.data[id].accessTimeList', record)
      this.state = type
      if (type) {
        this.$refs.changeClass.chooseList = type === 2 ? [record.id] : []
        this.$refs.changeClass.defaultValue = type === 2 ? moment(record.current).format('YYYY-MM-DD HH:mm:ss') : ''
        this.$refs.changeClass.current = type === 2 ? record.current : ''
        this.$refs.changeClass.chooseList = type === 2 ? [record.classId] : []
        this.$refs.changeClass.totalList = type === 2 ? { ...record, id: record.classId } : {}
        this.chooseRecord = type === 2 ? record : {}
        this.show = false
        this.$refs.changeClass.title = '必须打卡的日期'
      } else {
        this.show = true
        this.$refs.changeClass.chooseList =
          JSON.stringify(this.data[record.id].accessTimeList) === '{}' ? []
            : [this.data[record.id].accessTimeList.classId ? this.data[record.id].accessTimeList.classId : this.data[record.id].accessTimeList.id]
        this.classId = record.id
        this.$refs.changeClass.title = '更改班次'
        this.$refs.changeClass.totalList = record.accessTimeList
      }
      this.visible = true
    },
    // 更换班次
    changeClass(record) {
      if (this.state === 1) {
        this.clockList.push(record)
      } else if (this.state === 2) {
        console.log('record', record)
        console.log('chooseRecord', this.chooseRecord)
        for (var i = 0; i < this.clockList.length; i++) {
          if (this.clockList[i].shiftCode === this.chooseRecord.shiftCode) {
            this.clockList[i].classId = record.id
            this.clockList[i].current = record.current
            this.clockList[i].code = record.code
            this.clockList[i].name = record.name
            this.clockList[i] = record
          }
        }
      } else {
        this.data[this.classId].accessTimeList = record
      }
      console.log('this.clockList', this.clockList)
      this.$refs.changeClass.reset()
    },
    // 不用打卡日期
    noClock(record) {
      this.unClockList.push(record)
      this.$refs.noClock.reset()
    },
    // 表单回填
    async showData(value) {
      if (!value) return
      this.detailData = value
      this.holidayFlag = value.holidayFlag === '1' ? ['1'] : []
      this.groupName = value.groupName
      this.groupList = value.controllerGroups
      this.groupList.map(ele => {
        ele.snapSite = ele.address
        ele.deviceType = ele.type
        ele.status = ele.inOrOut === '1'
        ele.inOrOut = ele.inOrOut === '1'
      })
      value.rules.forEach((item, index) => {
        this.selectedRowKeys.push(parseInt(item.dayName))
        if (parseInt(item.dayName) === 1) {
          this.data[6].accessTimeList = item
          this.data[6].accessTimeList.name = item.shiftName
          this.data[6].accessTimeList.code = item.shiftCode
        } else {
          this.data[parseInt(item.dayName) - 2].accessTimeList = item
          this.data[parseInt(item.dayName) - 2].accessTimeList.name = item.shiftName
          this.data[parseInt(item.dayName) - 2].accessTimeList.code = item.shiftCode
        }
      })
      this.clockList = value.specialSignInDayRuleDtos.map(ele => {
        return {
          ...ele,
          name: ele.shiftName,
          code: ele.shiftCode,
          current: this.$tools.getDate(ele.dayTime, 1)
        }
      })
      this.unClockList = value.noSignInDayRuleDtos.map(ele => {
        return {
          ...ele,
          current: ele.startDate === ele.endDate ? this.$tools.getDate(ele.startDate, 1) : `${this.$tools.getDate(ele.startDate, 1)}~${this.$tools.getDate(ele.endDate, 1)}`
        }
      })
      console.log('edit,data', this.data)
      console.log('edit,clockList', this.clockList)
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
      this.$nextTick(() => {
        this.groupList = value
      })
    },
    // 考勤日期选择
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    cancle() {
      const path = '/teacherAccessSet'
      this.$router.push({ path })
    },
    // 特殊日期的删除
    del(type, record) {
      this[type] = this[type].filter(list => list !== record)
    },
    // 提交权限组
    handleSubmit(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
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
              ruleTimeDtoList: ele.accessTimeList.ruleTimeDtoList,
              shiftCode: ele.accessTimeList.code,
              shiftName: ele.accessTimeList.name
            })
          })
          let result = true
          rules.forEach(eve => {
            if (
              !eve.ruleTimeDtoList
            ) {
              result = false
            }
          })
          if (!result) {
            this.$message.warning('请选择班次')
            return
          }
          const deviceGroups = []
          this.groupList.forEach(ele => {
            deviceGroups.push({
              address: ele.snapSite,
              deviceName: ele.deviceName,
              deviceSn: ele.deviceSn,
              inOrOut: this.type === 'teacher' ? null : ele.inOrOut ? '1' : '2',
              type: ele.deviceType
            })
          })
          const specialClockDayRules = []
          this.clockList.forEach(ele => {
            specialClockDayRules.push({
              dayTime: ele.current,
              ruleTimeDtoList: ele.ruleTimeDtoList,
              shiftCode: ele.code,
              shiftName: ele.name
            })
          })
          const noClockDayRules = []
          this.unClockList.forEach(ele => {
            noClockDayRules.push({
              startDate: ele.current.indexOf('~') === -1 ? ele.current : ele.current.slice('~')[0],
              endDate: ele.current.indexOf('~') === -1 ? ele.current : ele.current.slice('~')[1]
            })
          })
          const req = {
            holidayFlag: values.holidayFlag.length > 0 ? '1' : '0',
            deviceGroups,
            groupName: values.name,
            rules,
            specialClockDayRules,
            noClockDayRules,
            schoolCode: this.userInfo.schoolCode,
            type: 1
          }
          this.loading = true
          const path = '/teacherAccessSet'
          if (this.groupId) {
            req.id = this.groupId
            this.updateAttendanceGroup(req)
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
            this.addAttendanceGroup(req)
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
    max-height: 350px;
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
}
</style>
