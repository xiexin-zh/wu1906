<template>
  <div class="set-group page-layout qui-fx-ver">
    <choose-classcard
      ref="chooseCard"
      chooseType="classCard"
      :bindObj="chooseClassCardDeatil"
      is-check
      v-if="userTag"
      v-model="userTag"
      @submit="chooseCard"
      title="选择应用班牌"
    >
    </choose-classcard>
    <a-form :form="form" :style="{ maxHeight: maxHeight }">
      <a-form-item label="计划名称" :label-col="{ span: 3 }" :wrapper-col="{ span: 12 }">
        <a-input
          placeholder="请输入计划名称"
          :maxLength="30"
          v-decorator="['name', {initialValue: appForm.planName, rules: [{ required: true, message: '请输入计划名称' }] }]"
        />
      </a-form-item>
      <a-form-item label="应用班牌：" :label-col="{ span: 3}" :wrapper-col="{ span: 12 }" :required="true">
        <div class="qui-fx-ac" style="flex-wrap:wrap">
          <a-radio-group name="classGroup" :default-value="appForm.showType ? appForm.showType : '1'" v-model="appForm.showType">
            <a-radio value="1">全校班牌</a-radio>
            <a-radio value="2">指定班牌</a-radio>
          </a-radio-group>
          <a-select
            v-if="appForm.showType === '2'"
            style="width: calc(100% - 192px)"
            mode="multiple"
            v-model="chooseClassCardDeatil"
            size="default"
            placeholder="请点击选择应用班牌"
            @dropdownVisibleChange="classCardSelect"
            @deselect="deselect"
            labelInValue
          >
          </a-select>
        </div>
      </a-form-item>
      <a-form-item label="计划模式" :label-col="{ span: 3 }" :wrapper-col="{ span: 12 }" :required="true">
        <a-radio-group name="planGroup" @change="planChange" :default-value="appForm.planType ? appForm.planType : '1'" v-model="appForm.planType" :required="true">
          <a-radio value="1">每天相同</a-radio>
          <a-radio value="2">5+2模式</a-radio>
          <a-radio value="3">自定义</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item :wrapper-col="{ span: 13, offset: 2 }">
        <a-table
          :columns="column"
          :dataSource="data"
          :bordered="true"
          :pagination="false"
          class="table"
        >
          <template slot="action" slot-scope="text, record">
            <div v-if="record.accessTimeList.length > 0">
              <div
                class="action qui-fx-jsb qui-fx-ac"
                v-for="(item, i) in record.accessTimeList"
                :key="i"
              >
                <div class="left">
                  <template>
                    <a-time-picker
                      format="HH:mm"
                      :defaultValue="moment(item.startTime, 'HH:mm')"
                      @change="(val,dateStrings)=>changeTime(val,dateStrings,'startTime',record.id, i)"
                      :disabledMinutes="(val)=>getStartMinutes(val,record.id, i)"
                      :disabledHours="(val)=>getStartHours(val,record.id, i)"
                      :value="item.startTime"
                    />
                    <span>至</span>
                    <a-time-picker
                      format="HH:mm"
                      :disabledHours="(val)=>getDisabledHours(val,record.id, i)"
                      :disabledMinutes="(val)=>getDisabledMinutes(val,record.id, i)"
                      :defaultValue="moment(item.endTime, 'HH:mm')"
                      @change="(val,dateStrings)=>changeTime(val,dateStrings,'endTime',record.id, i)"
                      :value="item.endTime"
                    />
                  </template>
                </div>
                <div class="right qui-fx">
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
        <a-button style="margin-right:50px;" @click="cancle">
          取消
        </a-button>
        <a-button type="primary" @click="handleSubmit">
          保存
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import addImg from '../../assets/img/add.png'
import deleteImg from '../../assets/img/delete.png'
import ChooseClasscard from '@c/ChooseClasscards'
import moment from 'moment'
import { mapState, mapActions } from 'vuex'
const columns = [
  {
    title: '日期',
    align: 'center',
    dataIndex: 'weekDay'
  },
  {
    title: '时段',
    dataIndex: 'accessTime',
    align: 'center',
    scopedSlots: {
      customRender: 'action'
    }
  }
]
const datas = [
  {
    key: 1,
    weekDay: '周一',
    accessTimeList: [],
    id: 0
  },
  {
    key: 2,
    weekDay: '周二',
    accessTimeList: [],
    id: 1
  },
  {
    key: 3,
    weekDay: '周三',
    accessTimeList: [],
    id: 2
  },
  {
    key: 4,
    weekDay: '周四',
    accessTimeList: [],
    id: 3
  },
  {
    key: 5,
    weekDay: '周五',
    accessTimeList: [],
    id: 4
  },
  {
    key: 6,
    weekDay: '周六',
    accessTimeList: [],
    id: 5
  },
  {
    key: 7,
    weekDay: '周日',
    accessTimeList: [],
    id: 6
  }
]
export default {
  name: 'SetGroup',
  components: {
    ChooseClasscard
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  data() {
    return {
      addImg,
      deleteImg,
      moment,
      userTag: false,
      chooseClassCardDeatil: [],
      maxHeight: 0,
      columns,
      column: [],
      datas,
      data: [],
      formLayout: 'horizontal',
      form: this.$form.createForm(this),
      id: '',
      chooseList: [],
      classCardList: [],
      time: null,
      appForm: {
        planName: '',
        showType: '1',
        planType: '1'
      }
    }
  },
  created() {
    this.maxHeight = window.screen.height - 280 + 'px'
    this.id = this.$route.query.id ? this.$route.query.id.toString() : ''
    if (this.appForm.planType === '1') {
      this.column = this.columns.slice(1)
      this.column[0].title = '周一至周日'
      this.data = this.datas.slice(0, 1)
    } else {
      this.column = this.columns
      this.column[1].title = '时段'
      if (this.appForm.planType === '2') {
        this.data = this.datas.slice(0, 2)
        this.data[0].weekDay = '周一至周五'
        this.data[1].weekDay = '周六至周日'
      } else {
        this.data = this.datas
        this.data[0].weekDay = '周一'
        this.data[1].weekDay = '周二'
      }
    }
    if (this.id) {
      this.showData()
    } else {
      this.data.forEach(ele => {
        ele.accessTimeList = [{ startTime: moment('00:00', 'HH:mm'), endTime: moment('00:00', 'HH:mm'), canAdd: true }]
      })
    }
  },
  async mounted() {
    this.showCardList()
  },
  methods: {
    ...mapActions('home', ['getClassCardList']),
    async showCardList () {
      const req = {
        schoolCode: this.userInfo.schoolCode,
        bindStatus: '1',
        page: 1,
        size: 9999
      }
      const res = await this.getClassCardList(req)
      if (!res.data) {
        return
      }
      res.data.list.forEach(item => {
        this.classCardList.push({
          key: item.id,
          name: item.deviceName
        })
      })
    },
    handleChange(value, option) {
      console.log(value)
      this.chooseList = value
    },
    planChange(e) {
      console.log(e.target.value)
      if (e.target.value === '1') {
        this.column = this.columns.slice(1)
        this.column[0].title = '周一至周日'
        this.data = this.datas.slice(0, 1)
      } else {
        this.column = this.columns
        this.column[1].title = '时段'
        if (e.target.value === '2') {
          this.data = this.datas.slice(0, 2)
          this.data[0].weekDay = '周一至周五'
          this.data[1].weekDay = '周六至周日'
        } else {
          this.data = this.datas
          this.data[0].weekDay = '周一'
          this.data[1].weekDay = '周二'
        }
      }
      this.data.forEach(ele => {
        ele.accessTimeList = [{ startTime: moment('00:00', 'HH:mm'), endTime: moment('00:00', 'HH:mm'), canAdd: true }]
      })
    },
    // 表单回填
    async showData() {
      this.data.forEach(ele => {
        ele.accessTimeList = [{ startTime: moment('00:00', 'HH:mm'), endTime: moment('00:00', 'HH:mm'), canAdd: true }]
      })
    },
    // 提交权限组
    handleSubmit(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log(values)
          console.log(this.appForm)
          const rules = []
          this.data.forEach(ele => {
            ele.accessTimeList.forEach(item => {
              rules.push({
                weekCode: ele.key,
                startTime: item.startTime ? moment(item.startTime).format('HH:mm') : '00:00',
                endTime: item.endTime ? moment(item.endTime).format('HH:mm') : '00:00'
              })
            })
          })
          console.log(rules)
          if (this.appForm.showType === '2') {
            this.appForm.classcardIds = []
            this.chooseClassCardDeatil.forEach(ele => {
              this.appForm.classcardIds.push(ele.key)
            })
            console.log(this.appForm.classcardIds)
          } else {
            this.appForm.classcardIds = []
          }
        }
      })
    },
    changeTime (val, dateStrings, type, id, index) {
      if (type === 'startTime') {
        this.data[id].accessTimeList[index].startTime = val
      } else {
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
    // 添加计划
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
      if (this.data[id].accessTimeList.length > 2) {
        this.data[id].accessTimeList[2].canAdd = false
      }
    },
    // 移除计划
    deleteAccessTime(index, id) {
      if (index === 0 && this.data[id].accessTimeList.length === 1) {
        this.$message.warning('已经是最后一项了')
        return
      }
      this.data[id].accessTimeList.splice(index, 1)
      if (this.data[id].accessTimeList.length > 0) {
        this.data[id].accessTimeList[this.data[id].accessTimeList.length - 1].canAdd = true
      }
    },
    cancle() {
      this.$router.push({ path: '/upDownPlan' })
    },
    chooseCard(value) {
      this.chooseClassCardDeatil = []
      value.forEach(ele => {
        this.chooseClassCardDeatil.push({
          key: ele.id.toString(),
          label: ele.deviceName,
          deviceSn: ele.deviceSn
        })
      })
      console.log(this.chooseClassCardDeatil)
      this.$refs.chooseCard.reset()
    },
    deselect(value, option) {
      const index = this.chooseClassCardDeatil.findIndex(list => list.key === value.key)
      this.chooseClassCardDeatil.splice(index, 1)
    },
    classCardSelect () {
      this.userTag = true
    }
  }
}
</script>

<style lang="less" scoped>
.set-group {
  background: #fff;
  padding-top: 20px;
  overflow: auto;
  .table{
    max-height: 500px;
    overflow: auto;
    margin:0 40px 20px 40px;
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
