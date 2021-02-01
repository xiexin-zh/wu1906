<template>
  <div class="set-group page-layout u-fx-ver">
    <a-form :form="form" :style="{ maxHeight }">
      <a-form-item label="权限组名称" :label-col="{ span: 3 }" :wrapper-col="{ span: 15 }">
        <a-input
          placeholder="请输入权限组名称"
          maxlength="15"
          v-decorator="['name', { initialValue: groupName, rules: [{ required: true, message: '请输入权限组名称' }] }]"
        />
      </a-form-item>
      <a-form-item label="通行时间" :label-col="{ span: 3 }" :wrapper-col="{ span: 15 }" :required="true">
        <a-table
          :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
          :columns="columns"
          :dataSource="data"
          :bordered="true"
          :pagination="false"
          class="table"
        >
          <template slot="action" slot-scope="text, record">
            <div v-if="record.accessTimeList.length > 0">
              <div class="action u-fx-jsb u-fx-ac" v-for="(item, i) in record.accessTimeList" :key="i">
                <div class="left">
                  <template>
                    <a-time-picker
                      format="HH:mm"
                      :defaultValue="moment(item.startTime, 'HH:mm')"
                      @change="(val, dateStrings) => changeTime(val, dateStrings, 'startTime', record.id, i)"
                      :disabledMinutes="val => getStartMinutes(val, record.id, i)"
                      :disabledHours="val => getStartHours(val, record.id, i)"
                      :value="item.startTime"
                    />
                    <span>至</span>
                    <a-time-picker
                      format="HH:mm"
                      :disabledHours="val => getDisabledHours(val, record.id, i)"
                      :disabledMinutes="val => getDisabledMinutes(val, record.id, i)"
                      :defaultValue="moment(item.endTime, 'HH:mm')"
                      @change="(val, dateStrings) => changeTime(val, dateStrings, 'endTime', record.id, i)"
                      :value="item.endTime"
                    />
                  </template>
                </div>
                <div class="right u-fx">
                  <img v-if="item.canAdd" :src="addImg" alt @click="addAccessTime(i, record.id)" />
                  <img :src="deleteImg" alt @click="deleteAccessTime(i, record.id)" />
                </div>
              </div>
            </div>
            <div v-else>
              <img :src="addImg" alt @click="addAccessTime(0, record.key)" />
            </div>
          </template>
        </a-table>
      </a-form-item>
      <a-form-item :wrapper-col="{ span: 15, offset: 3 }">
        <a-button style="margin-right:50px;" @click="cancle">取消</a-button>
        <a-button type="primary" @click="handleSubmit" :loading="loading">保存</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import moment from 'moment'
import { mapState, mapActions } from 'vuex'
import addImg from '../assets/img/add.png'
import deleteImg from '../assets/img/delete.png'
import deleImg from '../assets/img/dele.png'

const columns = [
  {
    title: '工作日',
    dataIndex: 'weekDay',
    align: 'center'
  },
  {
    title: '通行时间',
    dataIndex: 'accessTime',
    align: 'center',
    scopedSlots: {
      customRender: 'action'
    }
  }
]

export default {
  name: 'SetGroup',
  components: {
  },
  computed: {
    ...mapState('home', ['schoolCode'])
  },
  data() {
    return {
      loading: false,
      moment,
      addImg,
      deleImg,
      deleteImg,
      columns,
      maxHeight: window.screen.height - 280 + 'px',
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
      form: this.$form.createForm(this),
      ruleGroupCode: '',
      detailData: null,
      groupName: '',
      pageList: {
        page: 1,
        size: 15
      }
    }
  },
  created() {
    console.log(this.$route.query)
    this.ruleGroupCode = this.$route.query.ruleGroupCode
    if (this.ruleGroupCode) {
      this.showData()
    } else {
      this.data.forEach(ele => {
        ele.accessTimeList = [{ startTime: moment('00:00', 'HH:mm'), endTime: moment('00:00', 'HH:mm'), canAdd: true }]
      })
    }
  },
  methods: {
    ...mapActions('home', ['addGroup', 'editGroup', 'getGroupDetail', 'getAccessUserList']),
    // 门禁组表单回填
    async showData() {
      const res = await this.getGroupDetail({
        ruleGroupCode: this.ruleGroupCode,
        schoolCode: this.schoolCode
      })
      this.detailData = res.data
      this.groupName = res.data.ruleGroupName
      this.data.forEach(ele => {
        ele.accessTimeList = [{ startTime: moment('00:00', 'HH:mm'), endTime: moment('00:00', 'HH:mm'), canAdd: true }]
      })
      res.data.timeRuleList.forEach(item => {
        this.selectedRowKeys.push(parseInt(item.weekCode))
        if (parseInt(item.weekCode) === 1) {
          if (item.timeRuleList.length === 0) {
            this.data[6].accessTimeList[0] = {
              startTime: moment('00:00', 'HH:mm'),
              endTime: moment('00:00', 'HH:mm'),
              canAdd: true
            }
          } else {
            this.data[6].accessTimeList = []
            this.$nextTick(() => {
              item.timeRuleList.forEach((ele, index) => {
                this.data[6].accessTimeList.push({
                  startTime: moment(
                    ele.accessStart ? ele.accessStart.split(':')[0] + ':' + ele.accessStart.split(':')[1] : '00:00',
                    'HH:mm'
                  ),
                  endTime: moment(
                    ele.accessEnd ? ele.accessEnd.split(':')[0] + ':' + ele.accessEnd.split(':')[1] : '00:00',
                    'HH:mm'
                  ),
                  canAdd: index === item.timeRuleList.length - 1
                })
              })
            })
          }
        } else {
          if (item.timeRuleList.length === 0) {
            this.data[parseInt(item.weekCode) - 2].accessTimeList[0] = {
              startTime: moment('00:00', 'HH:mm'),
              endTime: moment('00:00', 'HH:mm'),
              canAdd: true
            }
          } else {
            this.data[parseInt(item.weekCode) - 2].accessTimeList = []
            this.$nextTick(() => {
              item.timeRuleList.forEach((ele, index) => {
                this.data[parseInt(item.weekCode) - 2].accessTimeList.push({
                  startTime: moment(
                    ele.accessStart
                      ? ele.accessStart.toString().split(':')[0] + ':' + ele.accessStart.split(':')[1]
                      : '00:00',
                    'HH:mm'
                  ),
                  endTime: moment(
                    ele.accessEnd ? ele.accessEnd.split(':')[0] + ':' + ele.accessEnd.split(':')[1] : '00:00',
                    'HH:mm'
                  ),
                  canAdd: index === item.timeRuleList.length - 1
                })
              })
            })
          }
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
            this.$message.warning('请勾选通行时间')
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
            ele.accessTimeList.forEach(item => {
              rules.push({
                weekCode: ele.key,
                accessStart: item.startTime ? moment(item.startTime).format('HH:mm') : '00:00',
                accessEnd: item.endTime ? moment(item.endTime).format('HH:mm') : '00:00'
              })
            })
          })
          let result = true
          rules.forEach(eve => {
            if (
              parseInt(eve.accessStart.split(':')[0]) * 60 + parseInt(eve.accessStart.split(':')[1]) >
              parseInt(eve.accessEnd.split(':')[0]) * 60 + parseInt(eve.accessEnd.split(':')[1])
            ) {
              result = false
            }
          })
          if (!result) {
            this.$message.warning('通行开始时间不能晚于结束时间')
            return
          }
          const req = {
            ruleGroupName: values.name,
            timeRuleList: rules,
            schoolCode: this.schoolCode,
            ruleGroupType: this.$route.query.ruleGroupType === '1' ? 1 : 2,
            ruleGroupCode: this.ruleGroupCode ? this.ruleGroupCode : undefined
          }
          this.loading = true
          const actionFun = this.ruleGroupCode ? 'editGroup' : 'addGroup'
          this[actionFun](req)
            .then(res => {
              this.$message.success('保存成功')
              const path = this.$route.query.ruleGroupType === '1' ? '/teacherCurrent' : '/studentCurrent'
              this.$tools.goNext(() => {
                this.loading = true
                this.$router.push({ path })
              })
            })
            .catch(() => {
              this.loading = false
            })
        }
      })
    },
    // 通行日期选择
    onSelectChange(selectedRowKeys) {
      console.log('selectedRowKeys changed: ', selectedRowKeys)
      this.selectedRowKeys = selectedRowKeys
    },
    changeTime(val, dateStrings, type, id, index) {
      if (type === 'startTime') {
        this.data[id].accessTimeList[index].startTime = val
      } else {
        console.log(dateStrings)
        if (
          parseInt(dateStrings.split(':')[0]) <
          moment(this.data[id].accessTimeList[index].startTime)
            .format('HH:mm')
            .split(':')[0]
        ) {
          this.$message.warning('开始时间不能大于结束时间')
        }
        this.data[id].accessTimeList[index].endTime = val
      }
    },
    getStartHours(val, id, index) {
      if (index === 0) {
        return
      }
      const hours = []
      const time = moment(this.data[id].accessTimeList[index - 1].endTime).format('HH:mm')
      const timeArr = time.split(':')
      for (var i = 0; i < parseInt(timeArr[0]); i++) {
        hours.push(i)
      }
      return hours
    },
    getDisabledHours(val, id, index) {
      const hours = []
      const time = moment(this.data[id].accessTimeList[index].startTime).format('HH:mm')
      const timeArr = time.split(':')
      for (var i = 0; i < parseInt(timeArr[0]); i++) {
        hours.push(i)
      }
      return hours
    },
    getStartMinutes(selectedHour, id, index) {
      if (index === 0) {
        return
      }
      const time = moment(this.data[id].accessTimeList[index - 1].endTime).format('HH:mm')
      const timeArr = time.split(':')
      const minutes = []
      if (selectedHour === parseInt(timeArr[0])) {
        for (var i = 0; i < parseInt(timeArr[1]); i++) {
          minutes.push(i)
        }
      }
      return minutes
    },
    getDisabledMinutes(selectedHour, id, index) {
      const time = moment(this.data[id].accessTimeList[index].startTime).format('HH:mm')
      const timeArr = time.split(':')
      const minutes = []
      if (selectedHour === parseInt(timeArr[0])) {
        for (var i = 0; i < parseInt(timeArr[1]); i++) {
          minutes.push(i)
        }
      }
      return minutes
    },
    // 添加通行时间
    addAccessTime(index, id) {
      console.log(this.data[id].accessTimeList[index].endTime)
      this.data[id].accessTimeList.forEach(ele => {
        ele.canAdd = false
      })
      this.data[id].accessTimeList.push({
        startTime: this.data[id].accessTimeList[index].endTime,
        endTime: moment('00:00', 'HH:mm'),
        canAdd: true
      })
    },
    // 移除通行时间
    deleteAccessTime(index, id) {
      console.log(index)
      console.log(this.data[id].accessTimeList[index])
      if (index === 0 && this.data[id].accessTimeList.length === 1) {
        this.$message.warning('已经是最后一项了')
        return
      }
      this.data[id].accessTimeList.splice(index, 1)
      if (this.data[id].accessTimeList.length > 0) {
        this.data[id].accessTimeList[this.data[id].accessTimeList.length - 1].canAdd = true
      }
    },
    // 选择通行时间
    timeChange(time) {
      console.log(time)
    },
    cancle() {
      const path = this.$route.query.ruleGroupType === '1' ? '/teacherCurrent' : '/studentCurrent'
      this.$router.push({ path })
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
    max-height: 600px;
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
