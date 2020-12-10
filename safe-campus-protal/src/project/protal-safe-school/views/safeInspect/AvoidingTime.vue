<template>
  <div class="avoid-time page-layout bg-fff">
    <div class="pos-box content">
      <div class="qui-fx">
        <div class="avoid-left qui-fx-f1">
          <div class="avoid-title">
            <div class="time-title">法定节假日</div>
          </div>
          <table-list
            is-check
            :columns="columns"
            :table-list="userList"
            v-model="chooseList"
            @clickRow="clickRow"
            @selectAll="selectAll">
            <template v-slot:actions="action">
              <a-tooltip placement="topLeft" title="添加">
                <a-button size="small" class="add-action-btn" icon="plus" @click.stop="addApp(1, action.record.id)"></a-button>
              </a-tooltip>
            </template>
          </table-list>
          <div class="avoid-title">
            <div class="time-title">周一至周日</div>
          </div>
          <table-list
            is-check
            :columns="weekColumns"
            :table-list="weekDays"
            v-model="weekChoose"
            @clickRow="weekRow"
            @selectAll="weekAll">
            <template v-slot:actions="action">
              <a-tooltip placement="topLeft" title="添加">
                <a-button size="small" class="add-action-btn" icon="plus" @click.stop="addApp(0, action.record.id)"></a-button>
              </a-tooltip>
            </template>
          </table-list>
          <!-- <div class="week-box qui-fx-ac">
            <div class="week-title" >每周：</div>
            <div class="qui-fx-f1">
              <div
                :class="['week-item',{'active': currentWeek.indexOf(week.key) > -1}]"
                v-for="week in weekDays"
                :key="week.key"
                @click="weekChange('currentWeek', week.key)"
              >
                {{ week.value }}
                <div v-if="currentWeek.indexOf(week.key) > -1" class="choose-icon">
                  <img :src="img" alt="">
                </div>
              </div>
              <a-button icon="plus" class="add-btn" @click="addApp(0)">添加例外任务</a-button>
            </div>

          </div> -->
          <div class="avoid-title">
            <div class="time-title no-set">无需巡查时间设置</div>
          </div>
          <div>
            <div class="time-choose">
              时间选择：<a-range-picker @change="onChange" />
              <a-button icon="plus" class="add-btn" size="small" @click="addTime">添加</a-button>
            </div>
            <table-list :columns="timeColumns" :table-list="timeList">
              <template v-slot:actions="action">
                <a-popconfirm placement="left" okText="确定" cancelText="取消" @confirm="del(action.record.id)">
                  <template slot="title">
                    您确定删除吗?
                  </template>
                  <a-tooltip placement="topLeft" title="删除">
                    <a-button size="small" class="del-action-btn" icon="delete"></a-button>
                  </a-tooltip>
                </a-popconfirm>
              </template>
            </table-list>
          </div>
        </div>
        <div class="avoid-right">
          <div class="tip">《使用提示》</div>
          <div class="tip-content">
            1、本模块的设置是为了实现在一些特定时间规避已生成的巡查任务。
          </div>
          <div class="tip-content">
            2、默认规避'法定节假日'已生成的巡查任务。如果需要设置特定时间段内进行检查，在'例外任务'中添加即可。
          </div>
          <div class="tip-content">
            3、'周一至周日'为常规设置,一般设置一次即可。
          </div>
          <div class="tip-content">
            4、如果需要设置特定时间段内进行检查任务的规避，在'例外时间设置'中添加即可。
          </div>
        </div>
      </div>
    </div>
    <choose-task ref="chooseTask" :params="params" @updateWeek="weekTaskGet" @updateDay="holidayGet"></choose-task>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import TableList from '@c/TableList'
import ChooseTask from '../../component/ChooseTask'
import img from '../../assets/img/choose.png'
import $tools from '@u/tools'
const columns = [
  {
    title: '节假日名称',
    dataIndex: 'name',
    width: '20%',
    customRender: (text, record) => {
      return `(${record.year}年)${record.name}`
    }
  },
  {
    title: '开始时间',
    dataIndex: 'startDate',
    width: '25%',
    customRender: text => {
      return $tools.getDate(text, 1)
    }
  },
  {
    title: '结束时间',
    dataIndex: 'endDate',
    width: '25%',
    customRender: text => {
      return $tools.getDate(text, 1)
    }
  },
  {
    title: '添加例外任务',
    key: 'action',
    width: '20%',
    scopedSlots: {
      customRender: 'action'
    }
  }
]
const weekColumns = [
  {
    title: '工作日名称',
    dataIndex: 'value',
    width: '50%'
  },
  {
    title: '添加例外任务',
    key: 'action',
    width: '50%',
    scopedSlots: {
      customRender: 'action'
    }
  }
]
const timeColumns = [
  {
    title: '开始时间',
    dataIndex: 'startDate',
    width: '40%',
    customRender: text => {
      return $tools.getDate(text, 1)
    }
  },
  {
    title: '结束时间',
    dataIndex: 'endDate',
    width: '40%',
    customRender: text => {
      return $tools.getDate(text, 1)
    }
  },
  {
    title: '操作',
    key: 'action',
    width: '20%',
    scopedSlots: {
      customRender: 'action'
    }
  }
]
export default {
  name: 'AvoidingTime',
  components: {
    TableList,
    ChooseTask
  },
  data() {
    return {
      columns,
      timeColumns,
      weekColumns,
      currentWeek: [],
      weekDays: [
        {
          id: 2,
          value: '星期一'
        },
        {
          id: 3,
          value: '星期二'
        },
        {
          id: 4,
          value: '星期三'
        },
        {
          id: 5,
          value: '星期四'
        },
        {
          id: 6,
          value: '星期五'
        },
        {
          id: 7,
          value: '星期六'
        },
        {
          id: 1,
          value: '星期日'
        }
      ],
      chooseList: [],
      weekChoose: [],
      userList: [],
      timeList: [],
      img,
      startDate: '',
      endDate: '',
      params: {},
      totalList: []
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  mounted() {
    this.holidayGet()
    this.extraDateGet()
    this.weekTaskGet()
  },
  methods: {
    ...mapActions('home',
      [
        'getHoliday', 'extraDateList', 'addExtraDate', 'delHolidayTask',
        'delExtraDate', 'getWeekTask', 'getHolidayTask', 'holidayBindTask',
        'delWeekTask', 'allHolidayBind', 'allWeekBind', 'weekBindTask'
      ]),
    // 节假日列表和勾选列表
    async holidayGet() {
      const res = await this.getHoliday()
      this.userList = res.data
      const result = await this.getHolidayTask({ schoolCode: this.userInfo.schoolCode })
      this.chooseList = result.data
    },
    // 周一至周日勾选列表
    async weekTaskGet() {
      const res = await this.getWeekTask({ schoolCode: this.userInfo.schoolCode })
      this.weekChoose = res.data
    },
    // 无需巡查时间设置
    async extraDateGet() {
      const res = await this.extraDateList({ schoolCode: this.userInfo.schoolCode })
      this.timeList = res.data
    },
    // 时间选择
    onChange(date, dateString) {
      this.startDate = dateString[0]
      this.endDate = dateString[1]
    },
    // 时间添加
    addTime () {
      if (this.startDate === '' || this.endDate === '') {
        this.$message.warning('请选择时间')
        return false
      }
      const req = {
        schoolCode: this.userInfo.schoolCode,
        startDate: this.startDate,
        endDate: this.endDate
      }
      this.addExtraDate(req).then(res => {
        this.$message.success('操作成功')
        this.$tools.goNext(() => {
          this.extraDateGet()
        })
      })
    },
    // 时间删除
    del(id) {
      this.delExtraDate(id).then(res => {
        this.$message.success('删除成功')
        this.$tools.goNext(() => {
          this.extraDateGet()
        })
      })
    },
    // 任务绑定
    addApp(type, id) {
      this.params.holidayId = type ? id : undefined
      this.params.weekNum = !type ? id : undefined
      this.$refs.chooseTask.status = true
      this.$refs.chooseTask.tabActive = '1'
      this.$refs.chooseTask.showList()
    },
    selectAll(item, type, a) {
      if (type) {
        const req = this.userList.map(el => {
          return {
            holidayId: el.id,
            schoolCode: this.userInfo.schoolCode,
            taskTemplateCodes: []
          }
        })
        this.allHolidayBind(req)
      } else {
        this.holidayChange(item, 0, 0)
      }
    },
    clickRow(item, type) {
      this.holidayChange(item, type, 1)
    },
    holidayChange(item, type, state) {
      const req = {
        schoolCode: this.userInfo.schoolCode,
        holidayId: state ? item.id : '',
        taskTemplateCodes: type ? [] : undefined
      }
      if (type) {
        this.holidayBindTask(req)
      } else {
        this.delHolidayTask(req)
      }
    },
    weekChange(item, type, state) {
      const req = {
        schoolCode: this.userInfo.schoolCode,
        weekNum: state ? item.id : '',
        taskTemplateCodes: type ? [] : undefined
      }
      if (type) {
        this.weekBindTask(req)
      } else {
        this.delWeekTask(req)
      }
    },
    weekAll(item, type) {
      if (type) {
        const req = this.weekDays.map(el => {
          return {
            weekNum: el.id,
            schoolCode: this.userInfo.schoolCode,
            taskTemplateCodes: []
          }
        })
        this.allWeekBind(req)
      } else {
        this.weekChange(item, 0, 0)
      }
    },
    weekRow(item, type) {
      this.weekChange(item, type, 1)
    }
    // weekChange(string, record, data) {
    //   if (this[string].indexOf(record) > -1) {
    //     this[string] = this[string].filter(el => el !== record)
    //   } else {
    //     this[string].push(record)
    //   }
    //   this[data] = false
    // },
  }
}
</script>
<style lang="less" scoped>
.avoid-time {
  margin-bottom: 25px;
  .content {
    height: calc(100% - 10px);
    overflow-y: scroll;
  }
  .avoid-right {
    width: 300px;
    padding: 20px 50px 0 20px;
    background: url(../../assets/img/note-bg.png) no-repeat;
    background-size: 100% 100%;
  }
  .avoid-left {
    padding: 0 10px;
    height: 100%;
  }
  .avoid-title {
    height: 45px;
    line-height: 45px;
    font-size: 16px;
    color: #4D4CAC;
    border-bottom: 1px solid #ccc;
    .time-title{
      width: 80px;
      height: 100%;
      border-bottom: 3px solid #4D4CAC;
    }
    .no-set {
      width: 130px;
    }
  }
}
.week-box {
  min-height: 80px;
  padding: 10px;
  .week-title {
    width: 30rpx;
  }
  .week-item {
    width: 75px;
    height: 32px;
    line-height: 32px;
    display: inline-block;
    border: 1px solid #676767;
    text-align: center;
    cursor: pointer;
    margin: 5px 10px;
    position: relative;
  }
  .active {
    background-color: #F5F5FB;
    color: #4D4CAC;
  }
  .choose-icon {
    width: 26px;
    height: 33px;
    position: absolute;
    right: 0;
    bottom: 0;
    img {
      width: 100%;
      height: 100%;
    }
  }
}
.add-btn {
  margin-left: 20px;
}
.time-choose {
  padding: 10px;
}
.tip{
  text-align: center;
  color: #4D4CAC;
  font-size: 20px;
}
.tip-content {
  margin-top: 15px;
  letter-spacing: 2px;
}
</style>
