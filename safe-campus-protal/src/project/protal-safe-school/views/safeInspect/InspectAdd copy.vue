<template>
  <div class="daily-add page-layout bg-fff qui-fx-ver">
    <div class="content pos-box">
      <a-form :form="form">
        <a-form-item label="任务名称：" v-bind="formItemLayout">
          <a-input
            v-decorator="[
              'taskName',
              {
                initialValue: cardInfo.taskName,
                rules: [{ required: true, message: '请填写任务名称' }]
              }
            ]"
            placeholder="请填写任务名称"
          />
        </a-form-item>
        <a-form-item label="巡查地点" v-bind="formItemLayout" >
          <a-select
            v-decorator="[
              'address',
              { initialValue: cardInfo.address, rules: [{ required: true, message: '请选择巡查地点' }] }
            ]"
            placeholder="请选择巡查地点"
            @change="choose"
          >
            <a-select-option v-for="(item,index) in areaList" :key="index" :value="item.code + '/' + item.name+ '=' + item.id" >
              {{ item.name }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="任务负责人" v-bind="formItemLayout" required>
          <div>
            <template v-for="tag in teacherList">
              <a-tag :key="tag.code" :closable="true" :afterClose="() => userClose(0,tag)">
                {{ tag.name }}
              </a-tag>
            </template>
            <a-tag @click="addTag(0)" class="tag" v-if="teacherList.length === 0" > <a-icon type="plus" />添加 </a-tag>
          </div>
        </a-form-item>
        <a-form-item label="巡查时间类型" v-bind="formItemLayout">
          <a-radio-group
            v-decorator="[
              'timeType',
              {
                initialValue: cardInfo.timeType,
                rules: [{ required: true, message: '请选择巡查时间类型' }]
              }
            ]"
            @change="timeChange"
            :disabled="isEdit"
          >
            <a-radio value="1">指定时间段完成</a-radio>
            <a-radio value="2">指定时间区间，期间任意时间均可完成</a-radio>
          </a-radio-group>
          <div v-if="cardInfo.timeType === '1'">
            <a-radio-group
              v-decorator="[
                'taskTimeType1',
                {
                  initialValue: cardInfo.taskTimeType1,
                  rules: [{ required: true, message: '请选择巡查时间类型' }]
                }
              ]"
              button-style="solid"
              @change="change"
              :disabled="isEdit">
              <a-radio-button value="1"> 自定义任务 </a-radio-button>
              <a-radio-button value="2"> 周任务 </a-radio-button>
              <a-radio-button value="3"> 月任务 </a-radio-button>
            </a-radio-group>
          </div>
          <div v-if="cardInfo.timeType === '2'">
            <a-radio-group
              v-decorator="[
                'taskTimeType2',
                {
                  initialValue: cardInfo.taskTimeType2,
                  rules: [{ required: true, message: '请选择巡查时间类型' }]
                }
              ]"
              button-style="solid"
              @change="change"
              :disabled="isEdit">
              <a-radio-button value="2"> 周任务 </a-radio-button>
              <a-radio-button value="3"> 月任务 </a-radio-button>
              <a-radio-button value="4"> 季度任务 </a-radio-button>
            </a-radio-group>
          </div>
          <!-- 日期多选控件 -->
          <div class="date-time" id="dateTime" ref="dateTime" v-show="cardInfo.taskTimeType1 === '1' && cardInfo.timeType === '1'"> </div>
          <div class="week-box qui-fx" v-if="cardInfo.taskTimeType1 === '2' && cardInfo.timeType === '1'">
            <div
              :class="['week-item',{'active': currentWeek.indexOf(week.key) > -1}]"
              v-for="week in weekDays"
              :key="week.key"
              @click="weekChange('currentWeek', week.key)"
            > {{ week.value }} </div>
          </div>
          <div class="month-box" v-if="cardInfo.taskTimeType1 === '3' && cardInfo.timeType === '1'">
            <div
              :class="['month-item',{'active':currentMonth.indexOf(month) > -1}]"
              v-for="(month,index) in 31"
              :key="index"
              @click="weekChange('currentMonth', month)"
            > {{ month > 9 ? month : `0${month}` }} </div>
          </div>
          <div class="week-box week-task qui-fx-ver" v-if="cardInfo.taskTimeType2 === '2' && cardInfo.timeType === '2'">
            <div>
              <span class="mar-r10">
                <a-input-number id="inputNumber" v-model="value" :min="minValue" />
              </span>
              <div :class="['week-item', 'weeks' ,{'active': allWeek}]" @click="chooseAll('allWeek','weekCurrent')"> 今年全选 </div>
            </div>
            <div>
              <a-tooltip
                placement="rightTop"
                :class="['week-item','weeks',{'active': weekCurrent.indexOf(Number(index)) > -1 }]"
                v-for="(item,index) in weeks"
                :key="index"
                @click="weekChange('weekCurrent', Number(index), 'allWeek')">
                <template slot="title">
                  <span>{{ item[0] }}~{{ item[item.length-1] }}</span>
                </template>
                <div>第{{ index }}周</div>
              </a-tooltip>
            </div>
          </div>
          <div class="week-box week-task qui-fx-ver" v-if="cardInfo.taskTimeType2 === '3' && cardInfo.timeType === '2'">
            <div>
              <span class="mar-r10">
                <a-input-number id="inputNumber" v-model="value" :min="minValue" />
              </span>
              <div :class="['week-item', 'weeks' ,{'active': allMonth}]" @click="chooseAll('allMonth','monthCurrent')"> 今年全选 </div>
            </div>
            <div>
              <div
                :class="['week-item', 'weeks', {'active': monthCurrent.indexOf(item) > -1}]"
                v-for="(item,index) in 12"
                :key="index"
                @click="weekChange('monthCurrent', item, 'allMonth')"
              > {{ item > 9 ? item : `0${item}` }}月 </div>
            </div>
          </div>
          <div class="week-box week-task qui-fx-ver" v-if="cardInfo.taskTimeType2 === '4' && cardInfo.timeType === '2'">
            <div>
              <span class="mar-r10">
                <a-input-number id="inputNumber" v-model="value" :min="minValue" />
              </span>
              <div :class="['week-item', 'weeks' ,{'active': allQuarter}]" @click="chooseAll('allQuarter','quarterCurrent')"> 今年全选 </div>
            </div>
            <div>
              <div
                :class="['week-item','weeks',{'active': quarterCurrent.indexOf(item) > -1 }]"
                v-for="(item,index) in 4"
                :key="index"
                @click="weekChange('quarterCurrent', item, 'allQuarter')"
              > 第{{ item }}季度 </div>
            </div>
          </div>
        </a-form-item>
        <!-- 日常巡检的巡查时段 -->
        <a-form-item label="巡查时段" v-bind="formItemLayout" v-if="cardInfo.timeType === '1' && url==='daily'" required>
          <div class="project-box" >
            <a-button icon="plus" class="add-btn" size="small" @click="add(1)">添加时段</a-button>
            <a-collapse default-active-key="1">
              <a-collapse-panel v-for="(item,index) in times" :key="item.key" :style="customStyle" :header="`时段${index+1}`" >
                <div class="qui-fx-ver">
                  <div>
                    <span class="tip">*</span>
                    <span class="mar-r10"> 时段 : </span>
                    <a-time-picker v-model="item.startTime"/>
                    <span class="mar-r10 mar-l10"> 至 </span>
                    <a-time-picker v-model="item.endTime"/>
                  </div>
                  <div class="mar-t15">
                    <span class="tip">*</span>
                    <span class="mar-r10"> 完成方式 : </span>
                    <a-radio-group v-model="item.comppleteType">
                      <a-radio value="1">一个人完成则所有人完成</a-radio>
                      <a-radio value="2">必须所有人完成才视为完成</a-radio>
                    </a-radio-group>
                  </div>
                  <div v-if="taskTypeCodes.indexOf('1') > -1" class="mar-t15">
                    <span class="tip">*</span>
                    常规检查 :
                    <template v-for="tag in item.routineUsers">
                      <a-tag :key="tag.code" :closable="true" :afterClose="() => userClose(1,tag,'routineUsers',item.key)">
                        {{ tag.name }}
                      </a-tag>
                    </template>
                    <a-tag @click="addTag(1,'routineUsers',item)" class="tag"> <a-icon type="plus" />添加 </a-tag>
                  </div>
                  <div v-if="taskTypeCodes.indexOf('2') > -1" class="mar-t15">
                    <span class="tip">*</span>
                    安全检查 :
                    <template v-for="tag in item.safeUsers">
                      <a-tag :key="tag.code" :closable="true" :afterClose="() => userClose(1,tag,'safeUsers',item.key)">
                        {{ tag.name }}
                      </a-tag>
                    </template>
                    <a-tag @click="addTag(1,'safeUsers',item)" class="tag"> <a-icon type="plus" />添加 </a-tag>
                  </div>
                  <div v-if="taskTypeCodes.indexOf('3') > -1" class="mar-t15">
                    <span class="tip">*</span>
                    卫生检查 :
                    <template v-for="tag in item.hygieneUsers">
                      <a-tag :key="tag.code" :closable="true" :afterClose="() => userClose(1,tag,'hygieneUsers',item.key)">
                        {{ tag.name }}
                      </a-tag>
                    </template>
                    <a-tag @click="addTag(1,'hygieneUsers',item)" class="tag"> <a-icon type="plus" />添加 </a-tag>
                  </div>
                </div>
                <a-button size="small" class="del-action-btn" icon="delete" slot="extra" @click.stop="handleClick($event,item)"></a-button>
              </a-collapse-panel>
            </a-collapse>
          </div>
        </a-form-item>
        <!-- 设备巡检的巡查时段 -->
        <a-form-item :label="cardInfo.timeType === '1' ? '巡查时段' : '巡检设置'" v-bind="formItemLayout" v-if=" url === 'equip'" required>
          <div class="project-box" >
            <div class="qui-fx-ver">
              <div v-if="cardInfo.timeType === '1'">
                <span class="tip">*</span>
                <span class="mar-r10"> 时段 : </span>
                <a-time-picker v-model="times[0].startTime"/>
                <span class="mar-r10 mar-l10"> 至 </span>
                <a-time-picker v-model="times[0].endTime"/>
              </div>
              <div :class="{'mar-t15' : cardInfo.timeType === '1' ? 'mar-t15' : ''}">
                <span class="tip">*</span>
                <span class="mar-r10" v-if="cardInfo.timeType === '1'"> 完成方式 : </span>
                <a-radio-group v-model="times[0].comppleteType">
                  <a-radio value="1">一个人完成则所有人完成</a-radio>
                  <a-radio value="2">必须所有人完成才视为完成</a-radio>
                </a-radio-group>
              </div>
              <div class="mar-t15">
                <span class="tip">*</span>
                巡查人员 :
                <template v-for="tag in times[0].routineUsers">
                  <a-tag :key="tag.code" :closable="true" :afterClose="() => userClose(1,tag,'routineUsers',times[0].key)">
                    {{ tag.name }}
                  </a-tag>
                </template>
                <a-tag @click="addTag(1,'routineUsers',times[0])" class="tag"> <a-icon type="plus" />添加 </a-tag>
              </div>
              <div class="mar-t15">
                <span class="tip">*</span>
                巡检设备 :
                <template v-for="tag in times[0].devices">
                  <a-tag :key="tag.code" :closable="true" :afterClose="() => userClose(1,tag,'devices',times[0].key)">
                    {{ tag.name }}
                  </a-tag>
                </template>
                <a-tag @click="addEquipTag(1,'devices',times[0])" class="tag"> <a-icon type="plus" />添加 </a-tag>
              </div>
            </div>
          </div>
        </a-form-item>
        <!-- 安全护导的巡查时段 -->
        <a-form-item label="巡查时段" v-bind="formItemLayout" v-if="cardInfo.timeType === '1' && url==='safe'" required>
          <div class="project-box" >
            <a-button icon="plus" class="add-btn" size="small" @click="add(1)">添加时段</a-button>
            <a-collapse default-active-key="1">
              <a-collapse-panel v-for="(item,index) in times" :key="item.key" :style="customStyle" :header="`时段${index+1}`" >
                <div class="qui-fx-ver">
                  <div>
                    <span class="tip">*</span>
                    <span class="mar-r10"> 时段 : </span>
                    <a-time-picker v-model="item.startTime"/>
                    <span class="mar-r10 mar-l10"> 至 </span>
                    <a-time-picker v-model="item.endTime"/>
                  </div>
                  <div class="mar-t15">
                    <span class="tip">*</span>
                    <span class="mar-r10"> 完成方式 : </span>
                    <a-radio-group v-model="item.comppleteType">
                      <a-radio value="1">一个人完成则所有人完成</a-radio>
                      <a-radio value="2">必须所有人完成才视为完成</a-radio>
                    </a-radio-group>
                  </div>
                  <div class="mar-t15">
                    <span class="tip">*</span>
                    护导队伍 :
                    <template v-for="tag in item.routineUsers">
                      <a-tag :key="tag.code" :closable="true" :afterClose="() => userClose(1,tag,'routineUsers',item.key)">
                        {{ tag.name }}
                      </a-tag>
                    </template>
                    <a-tag @click="addTag(1,'routineUsers',item)" class="tag"> <a-icon type="plus" />添加 </a-tag>
                  </div>
                </div>
                <a-button size="small" class="del-action-btn" icon="delete" slot="extra" @click.stop="handleClick($event,item)"></a-button>
              </a-collapse-panel>
            </a-collapse>
          </div>
        </a-form-item>
        <!-- 日常巡检的巡查人员 -->
        <a-form-item label="巡查人员" v-bind="formItemLayout" v-if="cardInfo.timeType === '2' && url === 'daily'">
          <a-radio-group v-model="comppleteType">
            <a-radio value="1">一个人完成则所有人完成</a-radio>
            <a-radio value="2">必须所有人完成才视为完成</a-radio>
          </a-radio-group>
          <div class="user-box" v-if="this.cardInfo.areaCode">
            <div v-if="taskTypeCodes.indexOf('1') > -1">
              <span class="tip">*</span>
              常规检查 :
              <template v-for="tag in userList.routineUsers">
                <a-tag :key="tag.code" :closable="true" :afterClose="() => userClose(2,tag,'routineUsers')">
                  {{ tag.name }}
                </a-tag>
              </template>
              <a-tag @click="addTag(2,'routineUsers',userList.routineUsers)" class="tag"> <a-icon type="plus" />添加 </a-tag>
            </div>
            <div v-if="taskTypeCodes.indexOf('2') > -1">
              <span class="tip">*</span>
              安全检查 :
              <template v-for="tag in userList.safeUsers">
                <a-tag :key="tag.code" :closable="true" :afterClose="() => userClose(2,tag,'safeUsers')">
                  {{ tag.name }}
                </a-tag>
              </template>
              <a-tag @click="addTag(2,'safeUsers',userList.routineUsers)" class="tag"> <a-icon type="plus" />添加 </a-tag>
            </div>
            <div v-if="taskTypeCodes.indexOf('3') > -1">
              <span class="tip">*</span>
              卫生检查 :
              <template v-for="tag in userList.hygieneUsers">
                <a-tag :key="tag.code" :closable="true" :afterClose="() => userClose(2,tag,'hygieneUsers')">
                  {{ tag.name }}
                </a-tag>
              </template>
              <a-tag @click="addTag(2,'hygieneUsers',userList.hygieneUsers)" class="tag"> <a-icon type="plus" />添加 </a-tag>
            </div>
          </div>
        </a-form-item>
        <!-- 安全护导的巡查人员 -->
        <a-form-item label="巡查人员" v-bind="formItemLayout" v-if="cardInfo.timeType === '2' && url === 'safe'">
          <a-radio-group v-model="comppleteType">
            <a-radio value="1">一个人完成则所有人完成</a-radio>
            <a-radio value="2">必须所有人完成才视为完成</a-radio>
          </a-radio-group>
          <div class="user-box">
            <div>
              <span class="tip">*</span>
              护导队伍 :
              <template v-for="tag in userList.routineUsers">
                <a-tag :key="tag.code" :closable="true" :afterClose="() => userClose(2,tag,'routineUsers')">
                  {{ tag.name }}
                </a-tag>
              </template>
              <a-tag @click="addTag(2,'routineUsers',userList.routineUsers)" class="tag"> <a-icon type="plus" />添加 </a-tag>
            </div>
          </div>
        </a-form-item>
        <a-form-item v-bind="formItemLayout" :style="{ textAlign: 'center' }">
          <a-button @click="cancel">取消</a-button>
          <a-button class="mar-l10" type="primary" @click="submitOk" :disabled="isLoad">保存</a-button>
        </a-form-item>
      </a-form>
      <choose-user
        ref="chooseUser"
        :is-check="isCheck"
        :is-radio="isRadio"
        v-if="userTag"
        v-model="userTag"
        @submit="chooseUser"
        title="添加人员">
      </choose-user>
      <choose-equip
        ref="chooseEquip"
        is-check
        v-if="equipTag"
        v-model="equipTag"
        @submit="chooseEquip"
        title="添加人员">
      </choose-equip>
    </div>
  </div>
</template>

<script>
import 'kalendae/build/kalendae.js'
import { mapState, mapActions } from 'vuex'
import ChooseUser from '@c/ChooseUser'
import ChooseEquip from '../../component/ChooseEquip'
import moment from 'moment'
export default {
  name: 'InspectAdd',
  components: {
    ChooseUser,
    ChooseEquip
  },
  data() {
    return {
      formItemLayout: {
        labelCol: { span: 6 },
        wrapperCol: { span: 16 }
      },
      isLoad: false,
      form: this.$form.createForm(this),
      times: [],
      count: 0,
      checkList: [],
      weekDays: [
        {
          key: 2,
          value: '星期一'
        },
        {
          key: 3,
          value: '星期二'
        },
        {
          key: 4,
          value: '星期三'
        },
        {
          key: 5,
          value: '星期四'
        },
        {
          key: 6,
          value: '星期五'
        },
        {
          key: 7,
          value: '星期六'
        },
        {
          key: 1,
          value: '星期日'
        }
      ],
      deviceCode: '',
      detailId: '',
      areaList: [],
      userTag: false,
      equipTag: false,
      teacherList: [],
      cardInfo: {
        timeType: '1',
        taskTimeType1: '1',
        taskTimeType2: '2'
      },
      chooseType: '',
      userList: [],
      routineUsers: [],
      safeUsers: [],
      hygieneUsers: [],
      taskTypeCodes: [],
      type: '',
      value: 2020,
      minValue: 2020,
      weeks: '',
      currentWeek: [],
      currentMonth: [],
      weekCurrent: [],
      monthCurrent: [],
      quarterCurrent: [],
      allWeek: false,
      allMonth: false,
      allQuarter: false,
      dateList: [],
      comppleteType: '1',
      isCheck: false,
      isRadio: false,
      isEdit: false,
      detailType: '',
      url: '',
      devices: [],
      customStyle:
        'background: #F5F5FB;border-radius: 4px;margin-bottom: 10px;border: 0;overflow: scroll;max-height:260px'
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  watch: {
    value(newVal, oldVal) {
      this.getnumofweeks(newVal)
    }
  },
  mounted() {
    this.url = this.$route.query.url
    this.deviceCode = this.$route.query.code
    this.detailType = this.$route.query.type
    this.detailId = this.$route.query.id
    this.times = this.url === 'equip' ? [{ key: 0 }] : []
    this.areaGet()
    if (this.detailId) {
      this.showDetail()
      this.isEdit = this.detailType !== 3
    } else {
      this.isEdit = false
      this.calendarTool(this.dateList)
    }
    this.value = new Date().getFullYear()
    this.minValue = new Date().getFullYear()
    this.getnumofweeks(this.value)
  },
  methods: {
    ...mapActions('home', ['getAllTaskDetail', 'getInspectionArea', 'inspectDetail',
      'addDailyTask', 'updateDailyTask', 'addDeviceTask', 'updateDeviceTask', 'addSafeTask', 'updateSafeTask'
    ]),
    moment,
    // 获取每年有几周
    formatNumber(n) {
      return n.toString().length > 1 ? n : '0' + n
    },
    getnumofweeks (year) {
      const days = this.getDate(year || new Date().getFullYear())
      const weeks = {}
      for (let i = 0; i < days.length; i++) {
        const weeksKeyLen = Object.keys(weeks).length
        const daySplit = days[i].split('_')
        if (weeks[weeksKeyLen] === undefined) {
          weeks[weeksKeyLen + 1] = [daySplit[0]]
        } else {
          if (daySplit[1] === '1') {
            weeks[weeksKeyLen + 1] = [daySplit[0]]
          } else {
            weeks[weeksKeyLen].push(daySplit[0])
          }
        }
      }
      this.weeks = weeks
    },
    getDate(year) {
      const dates = []
      for (let i = 1; i <= 12; i++) {
        for (let j = 1; j <= new Date(year, i, 0).getDate(); j++) {
          dates.push(year + '-' + this.formatNumber(i) + '-' + this.formatNumber(j) + '_' + new Date([year, i, j].join('-')).getDay())
        }
      }
      return dates
    },
    timeChange(e) {
      this.cardInfo.timeType = e.target.value
      this.cardInfo.taskTimeType1 = '1'
      this.cardInfo.taskTimeType2 = '2'
    },
    // 自定义任务日历的创建和选择
    calendarTool(selectedTime) {
      const _this = this
      const k = new Kalendae('dateTime', {
        mode: 'multiple',
        selected: selectedTime
        // direction: 'future'
      })
      k.subscribe('change', function(date) {
        const dateList = this.getSelected()
        _this.dateList = dateList.split(',')
      })
    },
    // 巡查时段折叠 右侧删除按钮
    handleClick(event, removedTag) {
      event.stopPropagation()
      this.times = this.times.filter(tag => tag !== removedTag)
    },
    // 任务类型切换
    change(e) {
      this.cardInfo.timeType === '1' ? this.cardInfo.taskTimeType1 = e.target.value : this.cardInfo.taskTimeType2 = e.target.value
    },
    // 巡检地点
    async areaGet() {
      const req = {
        schoolCode: this.userInfo.schoolCode,
        taskTypeCode: this.url === 'daily' ? '1' : this.url === 'equip' ? '2' : '3'
      }
      const res = await this.getInspectionArea(req)
      this.areaList = res.data
    },
    // 巡检地点选中
    choose(e) {
      this.cardInfo.areaCode = e.split('/')[0]
      this.cardInfo.address = e.split('/')[1]
      if (this.url === 'daily') {
        this.areaDetail(e.split('/')[1].split('=')[1])
      }
    },
    // 巡检地点选中后获取当前数据的详情
    async areaDetail(id) {
      const res = await this.inspectDetail(id)
      const data = res.data.dayList
      this.taskTypeCodes = data.map(el => el.contents.length > 0 ? el.checkType : null)
    },
    // 人员删除
    userClose(type, removedTag, list, tagItem) {
      if (type) {
        if (type === 1) {
          this.times[tagItem][list] = this.times[tagItem][list].filter(tag => tag !== removedTag)
        } else {
          this.userList[list] = this.userList[list].filter(tag => tag !== removedTag)
        }
      } else {
        this.teacherList = this.teacherList.filter(tag => tag !== removedTag)
      }
    },
    // 点击添加人员
    addTag(type, name, record) {
      this.type = type
      this.chooseType = [name]
      this.userTag = true
      if (type) {
        this.isCheck = true
        this.isRadio = false
        this[name] = record
        if (type === 1) {
          setTimeout(() => {
            this.$refs.chooseUser.chooseList = record[name].map(el => {
              return Number(el.id)
            })
            this.$refs.chooseUser.totalList = record[name].map(el => {
              return {
                ...el,
                userName: el.name,
                userCode: el.code
              }
            })
          }, 100)
        } else {
          setTimeout(() => {
            this.$refs.chooseUser.chooseList = this.userList[name].map(el => {
              return Number(el.id)
            })
            this.$refs.chooseUser.totalList = this.userList[name].map(el => {
              return {
                ...el,
                userName: el.name,
                userCode: el.userCode
              }
            })
          }, 100)
        }
      } else {
        this.isRadio = true
        this.isCheck = false
      }
    },
    // 周月季任务的切换
    weekChange(string, record, data) {
      if (this[string].indexOf(record) > -1) {
        this[string] = this[string].filter(el => el !== record)
      } else {
        this[string].push(record)
      }
      this[data] = false
    },
    // 今年全选
    chooseAll(string, data) {
      this[string] = !this[string]
      this[string] ? this.getNum(data, string === 'allMonth' ? 12 : string === 'allQuarter' ? 4 : Object.values(this.weeks).length) : this[data] = []
    },
    getNum(string, num) {
      var arr = []
      for (var i = 1; i <= num; i++) {
        arr.push(i)
      }
      this[string] = arr
    },
    // 获取详情
    async showDetail() {
      const res = await this.getAllTaskDetail(this.detailId)
      const data = res.data
      this.cardInfo = data
      this.value = data.year
      this.teacherList = [{ name: data.leaderName, code: data.leaderCode }]
      const date = data.date.map(el => Number(el))
      this.weekCurrent = date
      this.monthCurrent = date
      this.quarterCurrent = date
      this.currentWeek = date
      this.currentMonth = date
      this.dateList = data.date.map(el => el.substring(0, 11))
      const time = data.times[0]
      this.taskTypeCodes = []
      if (time.hygieneUsers.length > 0) {
        this.taskTypeCodes.push('3')
        this.userList.hygieneUsers = time.hygieneUsers
      }
      if (time.routineUsers.length > 0) {
        this.taskTypeCodes.push('1')
        this.userList.routineUsers = time.routineUsers
      }
      if (time.safeUsers.length > 0) {
        this.taskTypeCodes.push('2')
        this.userList.safeUsers = time.safeUsers
      }
      this.times = data.times.map((el, index) => {
        return {
          ...el,
          key: index,
          startTime: moment(new Date(el.startTime), 'HH:mm:ss'),
          endTime: moment(new Date(el.endTime), 'HH:mm:ss')
        }
      })
      this.cardInfo.taskTimeType1 = data.timeType === '1' ? data.taskTimeType : ''
      this.cardInfo.taskTimeType2 = data.timeType === '2' ? data.taskTimeType : ''
      this.count = data.times.length
      this.calendarTool(this.dateList)
    },
    // 人员选择
    chooseUser(teacherList) {
      const list = teacherList.map(el => {
        return {
          ...el,
          code: el.userCode,
          name: el.userName
        }
      })
      if (this.type) {
        if (this.type === 1) {
          this.times[this[this.chooseType].key][this.chooseType] = list
        } else {
          this.userList[this.chooseType] = list
        }
      } else {
        this.teacherList = list
      }
      this.$refs.chooseUser.reset()
    },
    // 添加设备
    addEquipTag() {
      this.equipTag = true
      setTimeout(() => {
        this.$refs.chooseEquip.chooseList = this.times[0].devices.map(el => {
          return el.id
        })
        this.$refs.chooseEquip.totalList = this.times[0].devices.map(el => {
          return {
            ...el,
            device: el.name
          }
        })
      }, 100)
    },
    // 设备选择
    chooseEquip(devices) {
      this.times[0].devices = devices.map(el => {
        return {
          code: el.code,
          name: el.device,
          id: el.id
        }
      })
      this.$refs.chooseEquip.reset()
    },

    // 巡查时段添加
    add() {
      if (!this.cardInfo.areaCode && this.url === 'daily') return this.$message.warning('请选择巡查地点')
      const { count, times } = this
      const newData = {
        key: count
      }
      this.times = [...times, newData]
      this.count = count + 1
    },
    cancel() {
      this.$router.go(-1)
    },
    // 提交
    submitOk(e) {
      e.preventDefault()
      this.form.validateFields((error, values) => {
        if (this.teacherList.length === 0) {
          this.$message.warning('请选择任务负责人')
          return
        }
        if (this.cardInfo.timeType === '1' &&
        ((this.cardInfo.taskTimeType1 === '1' && this.dateList.length === 0) ||
        (this.cardInfo.taskTimeType1 === '2' && this.currentWeek.length === 0) ||
        (this.cardInfo.taskTimeType1 === '3' && this.currentMonth.length === 0))) {
          this.$message.warning('请选择任务时间')
          return
        }
        if (this.cardInfo.timeType === '2' &&
        ((this.cardInfo.taskTimeType2 === '2' && this.weekCurrent.length === 0) ||
        (this.cardInfo.taskTimeType2 === '3' && this.monthCurrent.length === 0) ||
        (this.cardInfo.taskTimeType2 === '4' && this.quarterCurrent.length === 0))) {
          this.$message.warning('请选择任务时间')
          return
        }
        const isList = this.times.map(el => !el.startTime || !el.endTime || el.endTime <= el.startTime || !el.comppleteType ||
        (this.taskTypeCodes.indexOf('3') > -1 && (!el.hygieneUsers || el.hygieneUsers.length === 0)) ||
           ((this.taskTypeCodes.indexOf('1') > -1 || this.url === 'equip') && (!el.routineUsers || el.routineUsers.length === 0)) ||
           (this.taskTypeCodes.indexOf('2') > -1 && (!el.safeUsers || el.safeUsers.length === 0)) ||
           (this.url === 'equip' && (!el.devices || el.devices.length === 0)) ||
           (this.url === 'safe' && (!el.routineUsers || el.routineUsers.length === 0)) ? '1' : '-1'
        )
        if (this.cardInfo.timeType === '1' && (this.times.length === 0 || isList.indexOf('1') > -1)) {
          this.$message.warning('请完善巡查时段')
          return false
        }
        if (this.cardInfo.timeType === '2' &&
      ((this.taskTypeCodes.indexOf('3') > -1 && (!this.userList.hygieneUsers || this.userList.hygieneUsers.length === 0)) ||
           (this.taskTypeCodes.indexOf('1') > -1 && (!this.userList.routineUsers || this.userList.routineUsers.length === 0)) ||
           (this.taskTypeCodes.indexOf('2') > -1 && (!this.userList.safeUsers || this.userList.safeUsers.length === 0)) ||
           (this.url === 'equip' && (!this.times[0].devices || !this.times[0].routineUsers || this.times[0].routineUsers.length === 0 || this.times[0].devices.length === 0)) ||
           (this.url === 'safe' && (!this.userList.routineUsers || this.userList.routineUsers.length === 0))
      )
        ) {
          this.$message.warning(this.url === 'daily' ? '请完善巡检设置' : '请完善巡查人员')
          return false
        }
        this.isLoad = false
        if (!error) {
          values.schoolCode = this.userInfo.schoolCode
          if (this.cardInfo.timeType === '1') {
            values.date = this.cardInfo.taskTimeType1 === '1' ? this.dateList : this.cardInfo.taskTimeType1 === '2' ? this.currentWeek : this.currentMonth
          } else {
            values.date = this.cardInfo.taskTimeType2 === '2' ? this.weekCurrent : this.cardInfo.taskTimeType2 === '3' ? this.monthCurrent : this.quarterCurrent
          }
          values.year = this.cardInfo.timeType === '1' ? undefined : this.value
          const address = this.cardInfo.address
          values.address = address.split('=')[0]
          values.leaderName = this.teacherList[0].name
          values.leaderCode = this.teacherList[0].code
          values.areaCode = this.cardInfo.areaCode
          const times = [{
            comppleteType: this.comppleteType,
            devices: this.url === 'equip' ? this.times[0].devices : [],
            hygieneUsers: this.userList.hygieneUsers ? this.userList.hygieneUsers : [],
            routineUsers: this.url === 'equip' ? this.times[0].routineUsers : this.userList.routineUsers,
            safeUsers: this.userList.safeUsers ? this.userList.safeUsers : []
          }]
          values.times = this.cardInfo.timeType === '1' ? this.times : times
          values.taskTimeType = this.cardInfo.timeType === '1' ? values.taskTimeType1 : values.taskTimeType2
          this.isLoad = true
          if (!this.detailId || this.detailType === 3) {
            if (this.url === 'daily') {
              this.addDailyTask(values)
                .then(res => {
                  this.$message.success('操作成功')
                  this.$tools.goNext(() => {
                    this.$router.go(-1)
                  })
                })
                .catch(res => {
                  this.isLoad = false
                })
            } else if (this.url === 'equip') {
              this.addDeviceTask(values)
                .then(res => {
                  this.$message.success('操作成功')
                  this.$tools.goNext(() => {
                    this.$router.go(-1)
                  })
                })
                .catch(res => {
                  this.isLoad = false
                })
            } else if (this.url === 'safe') {
              this.addSafeTask(values)
                .then(res => {
                  this.$message.success('操作成功')
                  this.$tools.goNext(() => {
                    this.$router.go(-1)
                  })
                })
                .catch(res => {
                  this.isLoad = false
                })
            }
          } else {
            values.id = this.detailId
            if (this.url === 'daily') {
              this.updateDailyTask(values)
                .then(res => {
                  this.$message.success('操作成功')
                  this.$tools.goNext(() => {
                    this.$router.go(-1)
                  })
                })
                .catch(res => {
                  this.isLoad = false
                })
            } else if (this.url === 'equip') {
              this.updateDeviceTask(values)
                .then(res => {
                  this.$message.success('操作成功')
                  this.$tools.goNext(() => {
                    this.$router.go(-1)
                  })
                })
                .catch(res => {
                  this.isLoad = false
                })
            } else if (this.url === 'safe') {
              this.updateSafeTask(values)
                .then(res => {
                  this.$message.success('操作成功')
                  this.$tools.goNext(() => {
                    this.$router.go(-1)
                  })
                })
                .catch(res => {
                  this.isLoad = false
                })
            }
          }
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.daily-add {
  padding: 20px;
  .content {
    height: calc(100% - 100px);
    overflow-y: scroll;
  }
  .week-box {
    max-width: 600px;
    margin-top: 10px;
    border-top: 5px solid #6882DA;
    box-shadow: 0px 0px 6px #ddd;
    padding: 10px;
    .week-item{
      width: 75px;
      display: inline-block;
      border: 1px solid #E7E7E7;
      text-align: center;
      cursor: pointer;
      margin: 5px 10px;
    }
  }
  .month-box{
    max-width: 680px;
    margin-top: 10px;
    border-top: 5px solid #6882DA;
    box-shadow: 0px 0px 6px #ddd;
    padding: 10px;
    .month-item{
      display: inline-block;
      width: 45px;
      height: 28px;
      line-height: 28px;
      border: 1px solid #E7E7E7;
      text-align: center;
      margin:0 5px;
      cursor: pointer;
    }
  }
  .week-task {
    max-width: 1000px;
    .weeks {
      width: 70px;
      height: 30px;
      line-height: 30px;
      margin: 5px;
    }
  }
  .ant-calendar-picker {
    width: 100% !important;
  }
  .ant-checkbox-group {
    width: 100%;
  }
}
.ant-collapse{
  border: none;
}
.tip {
    color: #f5222d;
    font-weight: bold;
    margin: 0 5px;
  }
  .mar-t15 {
    margin-top: 15px;
  }
  .user-box {
    max-height: 200px;
    border-top: 5px solid #6882DA;
    box-shadow: 0px 0px 6px #ddd;
    padding: 10px;
  }
.ant-input-number {
  border: 1px solid #E7E7E7;
}
.active {
  background-color: #6882DA;
  color: #fff;
}
.tag {
  cursor: pointer;
}
.date-time {
  margin: 10px 0 0 -15px;
}
</style>
