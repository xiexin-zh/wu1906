<template>
  <a-form :form="form">
    <a-form-item label="考勤组名称" :label-col="{ span: 3 }" :wrapper-col="{ span: 15 }">
      <a-input
        placeholder="请输入考勤组名称"
        :maxLength="15"
        v-decorator="['groupName', { initialValue: groupName, rules: [{ required: true, message: '请输入考勤组名称' }] }]"
      />
    </a-form-item>
    <a-form-item label="考勤时间" :label-col="{ span: 3 }" :wrapper-col="{ span: 18 }" :required="true">
      <a-table
        :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        :columns="groupSetTea"
        :dataSource="data"
        :bordered="true"
        :pagination="false"
      >
        <template slot="action" slot-scope="text, record">
          <div class="u-fx">
            <div>
              {{ record.accessTimeList.name ? `${record.accessTimeList.name}：` : '休息' }}
            </div>
            <div class="u-mar-r20" v-for="(ele, i) in record.accessTimeList.ruleTimeDtoList" :key="i">
              {{ ele.startTime }} ~ {{ ele.endTime }}
            </div>
          </div>
        </template>
        <template slot="other1" slot-scope="text, record">
          <u-button size="small" type="link" @click="add(0, record)">更改班次</u-button>
        </template>
      </a-table>
    </a-form-item>
    <a-form-item label="特殊日期" :label-col="{ span: 3 }" :wrapper-col="{ span: 18 }">
      <a-checkbox-group v-decorator="['holidayFlag', { initialValue: holidayFlag }]">
        <a-checkbox value="1"> 法定节假日自动排休 </a-checkbox>
      </a-checkbox-group>
      <div>
        <div>
          必须打卡的日期：<u-button size="small" type="light" icon="plus" @click="add(1)">添加</u-button>
        </div>
        <a-table
          :columns="specialColumns"
          :dataSource="clockList"
          :bordered="true"
          :pagination="false"
          class="table"
        >
          <template slot="action" slot-scope="text, record">
            <div class="u-fx">
              <div>{{ record.name }}：</div>
              <div class="u-mar-r20" v-for="(ele, i) in record.ruleTimeDtoList" :key="i">
                {{ ele.startTime }} ~ {{ ele.endTime }}
              </div>
            </div>
          </template>
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
        <a-table
          :columns="specialColumns"
          :dataSource="unClockList"
          :bordered="true"
          :pagination="false"
          class="table"
        >
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
    <change-class v-model="visible" :show="show" ref="changeClass" @submit="changeClass"></change-class>
    <no-clock ref="noClock" @submit="noClock" v-model="clockTag"> </no-clock>
  </a-form>
</template>

<script>
import moment from 'moment'
import { mapState, mapActions } from 'vuex'
import ChangeClass from './ChangeClass'
import NoClock from './NoClock'
import { groupSetTea, specialColumns } from '../table-columns/group'

export default {
  name: 'SetGroupTea',
  components: {
    ChangeClass,
    NoClock
  },
  computed: {
    ...mapState('home', ['schoolCode'])
  },
  props: {
    groupId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      groupSetTea,
      specialColumns,
      moment,
      loading: false,
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
      groupName: '',
      visible: false,
      clockTag: false,
      clockList: [],
      unClockList: [],
      show: false,
      holidayFlag: ['1']
    }
  },
  created() {
    if (this.groupId) {
      this.showData()
    }
  },
  methods: {
    ...mapActions('home', ['updateAccess', 'getTeaAccessDetail']),
    // 更改班次
    add(type, record) {
      this.state = type
      if (type) {
        this.$refs.changeClass.defaultValue = type === 2 ? moment(record.current).format('YYYY-MM-DD HH:mm:ss') : ''
        this.$refs.changeClass.current = type === 2 ? record.current : ''
        this.$refs.changeClass.chooseList = type === 2 ? [record.classId ? record.classId : record.id] : []
        this.$refs.changeClass.totalList =
          type === 2 ? { ...record, id: record.classId ? record.classId : record.id } : {}
        this.chooseRecord = type === 2 ? record : {}
        this.show = false
        this.$refs.changeClass.title = '必须打卡的日期'
      } else {
        this.show = true
        this.$refs.changeClass.chooseList =
          JSON.stringify(this.data[record.id].accessTimeList) === '{}'
            ? []
            : [
                this.data[record.id].accessTimeList.classId
                  ? this.data[record.id].accessTimeList.classId
                  : this.data[record.id].accessTimeList.id
              ]
        this.classId = record.id
        this.$refs.changeClass.title = '更改班次'
        this.$refs.changeClass.totalList = record.accessTimeList
      }
      this.visible = true
    },
    // 更换班次提交
    changeClass(record) {
      if (this.state === 1) {
        const { count, clockList } = this
        const newData = {
          key: count,
          ...record
        }
        this.clockList = [...clockList, newData]
        this.count = count + 1
      } else if (this.state === 2) {
        for (var i = 0; i < this.clockList.length; i++) {
          if (this.clockList[i].key === this.chooseRecord.key) {
            this.clockList[i].classId = record.id
            this.clockList[i].current = record.current
            this.clockList[i].code = record.code
            this.clockList[i].name = record.name
            this.clockList[i].id = record.id
            this.clockList[i].ruleTimeDtoList = record.ruleTimeDtoList
            this.clockList[i].key = this.chooseRecord.key
          }
        }
      } else {
        this.data[this.classId].accessTimeList = record
      }
      this.$refs.changeClass.reset()
    },
    // 不用打卡日期
    noClock(record) {
      this.unClockList.push(record)
      this.$refs.noClock.reset()
    },
    // 表单回填
    async showData() {
      const res = await this.getTeaAccessDetail({ groupId: this.groupId })
      this.detailData = res.data
      this.holidayFlag = res.data.holidayFlag === '1' ? ['1'] : []
      this.groupName = res.data.groupName
      res.data.rules.forEach((item, index) => {
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
      this.clockList = res.data.specialSignInDayRuleDtos.map((ele, index) => {
        return {
          id: ele.classId,
          name: ele.shiftName,
          code: ele.shiftCode,
          current: this.$tools.getDate(ele.dayTime, 1),
          key: index,
          ruleTimeDtoList: ele.ruleTimeDtoList
        }
      })
      this.count = this.clockList.length
      this.unClockList = res.data.noSignInDayRuleDtos.map((ele) => {
        return {
          ...ele,
          current:
            ele.startDate === ele.endDate
              ? this.$tools.getDate(ele.startDate, 1)
              : `${this.$tools.getDate(ele.startDate, 1)}~${this.$tools.getDate(ele.endDate, 1)}`
        }
      })
    },
    // 考勤日期选择
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    cancle() {
      this.$router.push({ path: '/teacherSet' })
    },
    // 特殊日期的删除
    del(type, record) {
      this[type] = this[type].filter((list) => list !== record)
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
              ruleTimeDtoList: ele.accessTimeList.ruleTimeDtoList,
              shiftCode: ele.accessTimeList.code,
              shiftName: ele.accessTimeList.name
            })
          })
          let result = true
          rules.forEach((eve) => {
            if (!eve.ruleTimeDtoList) {
              result = false
            }
          })
          if (!result) {
            this.$message.warning('请选择班次')
            return
          }
          const req = {
            holidayFlag: values.holidayFlag.length > 0 ? '1' : '0',
            groupName: values.groupName,
            teacherRules: rules,
            specialClockDayRules: this.clockList.map((ele) => {
              return {
                dayTime: ele.current,
                ruleTimeDtoList: ele.ruleTimeDtoList,
                shiftCode: ele.code,
                shiftName: ele.name
              }
            }),
            noClockDayRules: this.unClockList.map((ele) => {
              return {
                startDate: ele.current.indexOf('~') > -1 ? ele.current.split('~')[0] : ele.current,
                endDate: ele.current.indexOf('~') > -1 ? ele.current.split('~')[1] : ele.current
              }
            }),
            schoolCode: this.schoolCode,
            type: 1
          }
          this.loading = true
          if (this.groupId) req.id = this.groupId
          this.updateAccess(req)
            .then((res) => {
              this.$message.success('保存成功')
              this.$tools.goNext(() => {
                this.loading = true
                this.$router.push({ path: '/teacherSet' })
              })
            })
            .catch(() => {
              this.loading = false
            })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
