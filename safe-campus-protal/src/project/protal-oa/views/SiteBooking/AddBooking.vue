<template>
  <div class="add-booking page-layout qui-fx-ver">
    <choose-user
      ref="chooseUser"
      :teacherList="teacherList"
      is-check
      v-if="teacherTag"
      v-model="teacherTag"
      @submit="chooseUser"
      title="添加教职工"
    ></choose-user>
    <choose-class
      title="添加班级"
      ref="chooseClass"
      :classList="classList"
      is-check
      v-model="classTag"
      v-if="classTag"
      @submit="chooseClass"
    ></choose-class>
    <choose-control
      ref="chooseControl"
      is-check
      v-if="controlTag"
      v-model="controlTag"
      @submit="chooseDevice"
      :controlList="controlList"
      :schoolCode="userInfo.schoolCode"
      title="添加设备"
    ></choose-control>
    <a-form :form="form" :style="{ maxHeight: maxHeight,overflow: 'auto' }">
      <a-form-item label="场地" :label-col="{ span: 3 }" :wrapper-col="{ span: 15 }" :required="true">
        <a-cascader
          :options="options"
          :load-data="loadData"
          :placeholder="formData.siteName"
          @change="onChange"
          :disabled="type !== '0'"
          v-decorator="[
            'placeList',
            {
              rules: [{ required: type === '0', message: '请选择场地' }]
            }
          ]"
        />
      </a-form-item>
      <a-form-item label="预订说明" :label-col="{ span: 3 }" :wrapper-col="{ span: 15 }">
        <a-input
          placeholder="请输入预订说明"
          :maxLength="20"
          :disabled="type === '1'"
          v-decorator="['remark', { initialValue: formData.remark, rules: [{ required: true, message: '请输入预订说明' }] }]"
        />
      </a-form-item>
      <a-form-item
        v-show="placeId !== ''"
        label="预订时间"
        :label-col="{ span: 3 }"
        :wrapper-col="{ span: 18 }"
        :required="true"
      >
        <ul>
          <li class="qui-fx-f1" v-for="(time, index) in timeList" :key="index">
            <div class="qui-fx-ac mar-b10">
              <a-date-picker
                :allowClear="false"
                :value="time.date"
                :disabled="type === '1'"
                :default-value="defaultDate"
                :disabled-date="disabledDate"
                style="margin-right: 10px"
                @change="(val,dateStrings)=>changeDate(val,dateStrings, index)"
              />
              <a-time-picker
                :allowClear="false"
                :disabled="type === '1'"
                :value="time.startTime"
                @change="(val,dateStrings)=>changeTime(val,dateStrings,'startTime', index)"
                format="HH:mm"
                :disabledMinutes="(val)=>getStartMinutes(val,index)"
                :disabledHours="(val)=>getStartHours(val,index)"
              />
              <span style="padding: 0 8px">至</span>
              <a-time-picker
                :allowClear="false"
                :disabled="type === '1'"
                style="margin-right: 10px"
                :value="time.endTime"
                format="HH:mm"
                :disabledMinutes="(val)=>getDisabledMinutes(val, index)"
                :disabledHours="(val)=>getDisabledHours(val, index)"
                @change="(val,dateStrings)=>changeTime(val,dateStrings,'endTime', index)"
              ></a-time-picker>
              <img
                v-if="index === timeList.length - 1 && type === '0'"
                :src="addImg"
                alt
                @click="add(true, index)"
              />
              <img v-if=" type === '0'" :src="deleImg" alt @click="add(false, index)" />
            </div>
          </li>
        </ul>
        <div
          v-for="(time, index) in signList"
          :key="index"
          :id="`container${index}`"
          style="width: 100%;height:220px;"
        ></div>
      </a-form-item>
      <a-form-item
        v-show="placeId !== ''"
        label="开启签到"
        :label-col="{ span: 3 }"
        :wrapper-col="{ span: 15 }"
      >
        <a-switch
          :disabled="type === '1'"
          @click="switchChange"
          v-model="formData.switch"
          v-decorator="['switch', { initialValue: formData.switch }]"
        />
      </a-form-item>
      <a-form-item
        v-if="formData.switch"
        label="签到设备"
        :label-col="{ span: 3 }"
        :wrapper-col="{ span: 15 }"
        :required="true"
      >
        <div>
          <a-tag
            v-if="type !== '1'"
            @click="controlSelect"
            style="background: #fff; borderStyle: dashed;"
          >
            <a-icon type="plus" />添加设备
          </a-tag>
          <template v-for="tag in controlList">
            <a-tag
              color="orange"
              :key="tag.deviceSn"
              :closable="type !== '1'"
              @close="() => controlClose(tag)"
            >{{ tag.deviceName }}</a-tag>
          </template>
        </div>
      </a-form-item>
      <a-form-item
        v-if="formData.switch"
        label="签到对象"
        :label-col="{ span: 3 }"
        :wrapper-col="{ span: 15 }"
        :required="true"
      >
        <div>
          <a-tag
            v-if="type !== '1'"
            @click="teacherSelect"
            style="background: #fff; borderStyle: dashed;"
          >
            <a-icon type="plus" />添加教职工
          </a-tag>
          <template v-for="tag in teacherList">
            <a-tag
              color="cyan"
              :key="tag.userCode"
              :closable="type !== '1'"
              @close="() => userClose(tag)"
            >{{ tag.userName }}</a-tag>
          </template>
        </div>
        <div>
          <a-tag
            v-if="type !== '1'"
            @click="classSelect"
            style="background: #fff; borderStyle: dashed;"
          >
            <a-icon type="plus" />添加班级
          </a-tag>
          <template v-for="tag in classList">
            <a-tag
              color="blue"
              :key="tag.classCode"
              :closable="type !== '1'"
              @close="() => classClose(tag)"
            >{{ tag.gradeName }}{{ userInfo.schoolType === '8' || userInfo.schoolType === '9' ? tag.subjectName : '' }}{{ tag.className }}</a-tag>
          </template>
        </div>
      </a-form-item>
      <a-form-item v-if="type !== '1'" :wrapper-col="{ span: 15, offset: 3 }">
        <a-button style="margin-right:50px;" @click="cancle">取消</a-button>
        <a-button type="primary" @click="handleSubmit">保存</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import Highcharts from 'highcharts/highstock'
import timeline from 'highcharts/modules/timeline'
import addImg from '../../assets/img/add.png'
import deleImg from '../../assets/img/delete.png'
import ChooseClass from '@c/choose/ChooseClass'
import ChooseUser from '@c/choose/ChooseUser'
import { mapState, mapActions } from 'vuex'
import ChooseControl from '@c/choose/ChooseControl'
import { Switch } from 'ant-design-vue'
import moment from 'moment'
timeline(Highcharts)
export default {
  name: 'AddBooking',
  components: {
    moment,
    ASwitch: Switch,
    ChooseControl,
    ChooseClass,
    ChooseUser
  },
  data() {
    return {
      addImg,
      deleImg,
      defaultDate: moment(new Date(), 'YYYY/MM/DD'),
      formData: {
        placeList: [],
        remark: '',
        siteName: '请选择场地',
        switch: false
      },
      controlTag: false,
      switchTag: false,
      classTag: false,
      teacherTag: false,
      form: this.$form.createForm(this),
      maxHeight: 0,
      id: 0,
      type: 0, // 0新增 1查看 2编辑
      timeList: [],
      groupList: [],
      teacherList: [],
      classList: [],
      controlList: [],
      options: [
        {
          value: '100',
          label: '教室',
          type: 0,
          isLeaf: false
        },
        {
          value: '101',
          label: '宿舍',
          type: 0,
          isLeaf: false
        },
        {
          value: '102',
          label: '食堂',
          type: 0,
          isLeaf: false
        },
        {
          value: '103',
          label: '出入口',
          type: 0,
          isLeaf: false
        },
        {
          value: '104',
          label: '其它',
          type: 0,
          isLeaf: false
        }
      ],
      siteList: [],
      placeId: '',
      placeName: '',
      placeType: '',
      placeTypeName: '',
      signList: []
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  watch: {
    placeId: {
      handler(newValue, oldValue) {
        if (newValue !== '') {
          if (this.type === '0') {
            this.timeList = [
              {
                date: moment(new Date(), 'YYYY/MM/DD'),
                startTime: moment(new Date(), 'HH:mm'),
                endTime: moment('20:00', 'HH:mm')
              }
            ]
            setTimeout(() => {
              this.showBI(`container0`, moment(new Date(), 'YYYY/MM/DD').format('YYYY-MM-DD'), newValue)
            }, 500)
          }
        }
      },
      deep: true
    },
    timeList: {
      handler(newValue, oldValue) {
        if (this.type !== '1') {
          let dateList = []
          newValue.map(el => {
            dateList.push(el.date.format('YYYY-MM-DD'))
          })
          dateList = [...new Set(dateList)]
          const arr = []
          dateList.map(el => {
            arr.push({
              date: el
            })
          })
          this.signList = arr
        }
      },
      deep: true
    },
    signList: {
      handler(newValue, oldValue) {
        if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
          newValue.map((el, i) => {
            setTimeout(() => {
              this.showBI(`container${i}`, el.date, this.placeId)
            }, 500)
          })
        }
      },
      deep: true
    }
  },
  mounted() {
    this.maxHeight = window.screen.height - 280 + 'px'
    this.type = this.$route.query.type
    if (this.type !== '0') {
      this.showData()
    }
  },
  methods: {
    ...mapActions('home', [
      'getSiteList',
      'getChildSite',
      'addReserve',
      'getReserveList',
      'checkReserve',
      'reserveDetail'
    ]),
    async showSiteList(type, id) {
      this.siteList = []
      let res = null
      if (type) {
        const req = {
          parentId: id,
          schoolCode: this.userInfo.schoolCode
        }
        res = await this.getChildSite(req)
        res.data = res.data.list
      } else {
        const req = {
          category: id,
          schoolCode: this.userInfo.schoolCode
        }
        res = await this.getSiteList(req)
      }
      if (res.data.length === 0) {
        return
      }
      res.data.forEach(ele => {
        this.siteList.push({
          label: ele.type === '2' ? ele.name + '楼' : ele.name,
          value: ele.id,
          type: ele.type,
          isLeaf: ele.type === '3'
        })
      })
    },
    switchChange(val) {
      if (!val) {
        this.teacherList = []
        this.classList = []
        this.controlList = []
      }
    },
    onChange(value, selectedOptions) {
      if (value.length === 0) {
        this.placeId = ''
        this.placeName = ''
        this.placeType = ''
        this.placeTypeName = ''
        return
      }
      this.placeId = value.join(',')
      const arr = []
      selectedOptions.slice(1).forEach(ele => {
        arr.push(ele.label)
      })
      this.placeName = arr.join(',')
      this.placeType = value[0]
      this.placeTypeName = selectedOptions[0].label
    },
    async loadData(selectedOptions) {
      const targetOption = selectedOptions[selectedOptions.length - 1]
      targetOption.loading = true
      await this.showSiteList(targetOption.type, targetOption.value)
      targetOption.loading = false
      targetOption.children = this.siteList
      this.options = [...this.options]
    },
    // 表单回填
    async showData() {
      const res = await this.reserveDetail(this.$route.query.id)
      console.log(res.data)
      this.placeId = res.data.placeType + ',' + res.data.placeId
      this.placeName = res.data.placeName
      this.placeType = res.data.placeType
      this.placeTypeName = this.options.filter(ele => ele.value === res.data.placeType)[0].label
      this.formData.placeList = [res.data.placeType].concat(res.data.placeId.split(','))
      this.formData.siteName = (this.placeTypeName + ',' + res.data.placeName).replace(/,/g, '/')
      this.timeList = [
        {
          date: moment(new Date(res.data.reserveDate), 'YYYY/MM/DD'),
          startTime: moment(res.data.startTime, 'HH:mm'),
          endTime: moment(res.data.endTime, 'HH:mm')
        }
      ]
      this.formData.remark = res.data.description
      this.formData.switch = res.data.openSign === '1'
      console.log(this.formData.switch)
      this.teacherList = res.data.teacherList
      this.classList = res.data.classList.map(el => {
        return {
          ...el,
          subjectName: el.professionName,
          subjectCode: el.professionCode
        }
      })
      this.controlList = res.data.placeReserveDeviceList
    },
    // 验证时间是否重叠
    yzTime(data) {
      const arr = []
      data.forEach(ele => {
        arr.push({
          startTime: new Date(`${ele.date.format('YYYY-MM-DD')} ${ele.startTime.format('HH:mm:ss')}`),
          endTime: new Date(`${ele.date.format('YYYY-MM-DD')} ${ele.endTime.format('HH:mm:ss')}`)
        })
      })
      const tempList = []
      console.log(arr)
      let isOverLap = 1
      arr.forEach((item, index) => {
        // 数据无效直接中断退出
        if (!item.startTime || !item.endTime) {
          return false
        }
        // 转换为时间戳
        const startTimeStamp = item.startTime.getTime()
        const endTimeStamp = item.endTime.getTime()
        if (startTimeStamp >= endTimeStamp) {
          isOverLap = 3
        }
        // 将时段数据处理后存入数组
        tempList.push([
          {
            flag: index,
            value: startTimeStamp
          },
          {
            flag: index,
            value: endTimeStamp
          }
        ])
      })
      // 对数组进行扁平处理后 从小到大排序
      const timeFiledList = [].concat(...tempList)
      timeFiledList.sort((a, b) => a.value - b.value)
      console.log(timeFiledList)
      // 是否重叠标志
      for (let i = 0; i < timeFiledList.length; i += 2) {
        if (i > 0) {
          // 存在相同值时(排序中三个连续值) => 时间重叠
          if (
            timeFiledList[i].value === timeFiledList[i - 1].value ||
            timeFiledList[i - 1].value === timeFiledList[i - 2].value
          ) {
            isOverLap = 2
            break
          }
        }
        // 相邻两个标记不同，则为重叠
        if (timeFiledList[i].flag !== timeFiledList[i + 1].flag) {
          isOverLap = 2
          break
        }
      }
      return isOverLap
    },
    // 提交权限组
    handleSubmit(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log(this.yzTime(this.timeList))
          if (this.yzTime(this.timeList) === 3) {
            this.$message.error('开始时间不能大于结束时间')
            return
          }
          if (this.yzTime(this.timeList) === 2) {
            this.$message.error('预订时间段重复，请重新选择')
            return
          }
          if (values.switch) {
            if (this.controlList.length === 0 || (this.classList.length === 0 && this.teacherList.length === 0)) {
              this.$message.error('请完善签到信息')
              return
            }
          }
          const dateList = []
          const checkTagList = []
          this.timeList.forEach((ele, index) => {
            dateList.push({
              reserveDate: ele.date.format('YYYY-MM-DD'),
              startTime: ele.startTime.format('HH:mm'),
              endTime: ele.endTime.format('HH:mm')
            })
            this.checkReserve({
              placeId: this.placeId
                .split(',')
                .slice(1)
                .join(','),
              startTime: ele.startTime.format('HH:mm'),
              endTime: ele.endTime.format('HH:mm'),
              reserveDate: ele.date.format('YYYY-MM-DD'),
              id: this.type === '2' ? this.$route.query.id : undefined
            }).catch(e => {
              checkTagList.push(e)
            })
          })
          this.$tools.goNext(() => {
            console.log(checkTagList)
            if (checkTagList.length !== 0) {
              return
            }
            const req = {
              schoolCode: this.userInfo.schoolCode,
              createName: this.userInfo.userName,
              createCode: this.userInfo.userCode,
              placeId: this.placeId
                .split(',')
                .slice(1)
                .join(','),
              placeType: this.placeId
                .split(',')
                .slice(0, 1)
                .toString(),
              placeName: this.placeName,
              description: values.remark,
              placeReserveDateDtoList: dateList,
              openSign: values.switch ? '1' : '2',
              type: '1'
            }
            if (values.switch) {
              req.classList = this.classList.map(el => {
                return {
                  classCode: el.classCode,
                  className: el.className,
                  gradeName: el.gradeName,
                  gradeCode: el.gradeCode,
                  professionName: el.subjectName,
                  professionCode: el.subjectCode,
                  classId: el.classId,
                  schoolYearId: el.schoolYearId
                }
              })
              req.teacherList = this.teacherList.map(el => {
                return {
                  workNo: el.mobile,
                  userCode: el.userCode,
                  userName: el.userName,
                  orgCode: el.orgCode,
                  orgName: el.orgName
                }
              })
              req.placeReserveDeviceList = this.controlList.map(el => {
                return {
                  deviceName: el.deviceName,
                  deviceSn: el.deviceSn
                }
              })
            } else {
              req.placeReserveDeviceList = []
              req.classList = []
              req.teacherList = []
            }
            if (this.type === '2') {
              req.id = this.$route.query.id
              req.placeReserveDateDtoList = undefined
              req.reserveDate = dateList[0].reserveDate
              req.startTime = dateList[0].startTime
              req.endTime = dateList[0].endTime
            }
            console.log(req)
            this.addReserve(req).then(res => {
              this.$message.success('预订成功')
              this.$tools.goNext(() => {
                this.$router.push({ path: '/siteBooking' })
              })
            })
          })
        }
      })
    },
    // 添加签到设备
    chooseDevice(value) {
      this.controlList = value
      this.$refs.chooseControl.reset()
    },
    chooseUser(teacherList) {
      this.teacherList = teacherList
      this.$refs.chooseUser.reset()
    },
    chooseClass(classInfo) {
      console.log(classInfo)
      this.classList = classInfo
      this.$refs.chooseClass.reset()
    },
    userClose(removedTag) {
      this.teacherList = this.teacherList.filter(tag => tag !== removedTag)
    },
    classClose(removedTag) {
      this.classList = this.classList.filter(tag => tag !== removedTag)
    },
    controlClose(removedTag) {
      console.log(removedTag)
      this.controlList = this.controlList.filter(tag => tag !== removedTag)
    },
    teacherSelect() {
      this.teacherTag = true
    },
    controlSelect() {
      this.controlTag = true
    },
    classSelect() {
      this.classTag = true
    },
    cancle() {
      this.$router.push({ path: '/siteBooking' })
    },
    disabledDate(current) {
      return current && current < moment().startOf('day')
    },
    add(tag, index) {
      console.log(index)
      if (tag) {
        if (index > 1) {
          this.$message.warning('最多添加三个时段')
          return
        }
        this.timeList.push({
          date: moment(new Date(), 'YYYY/MM/DD'),
          startTime: moment(new Date(), 'HH:mm'),
          endTime: moment('20:00', 'HH:mm')
        })
      } else {
        if (this.timeList.length === 1) {
          this.$message.warning('已经是最后一项了')
          return
        }
        this.timeList.splice(index, 1)
        console.log(this.timeList)
      }
    },
    changeTime(val, dateStrings, type, index) {
      console.log()
      if (
        this.timeList[index].date.format('YYYY/MM/DD') === moment(new Date()).format('YYYY/MM/DD') &&
        val.valueOf() < moment(new Date()).valueOf()
      ) {
        val = moment(new Date(), 'HH:mm')
      }
      if (type === 'startTime') {
        if (parseInt(val.format('HH')) * 60 + parseInt(val.format('mm')) > 20 * 60) {
          this.$message.warning('预订时间不能晚于20:00')
          this.timeList[index].startTime = moment('20:00', 'HH:mm')
        } else {
          this.timeList[index].startTime = val
        }
      } else {
        if (parseInt(val.format('HH')) * 60 + parseInt(val.format('mm')) > 20 * 60) {
          this.$message.warning('预订时间不能晚于20:00')
          this.timeList[index].endTime = moment('20:00', 'HH:mm')
        } else {
          this.timeList[index].endTime = val
        }
      }
    },
    changeDate(val, dateStrings, index) {
      this.timeList[index].date = val
      if (dateStrings !== moment(new Date()).format('YYYY-MM-DD')) {
        this.timeList[index].startTime = moment('08:00', 'HH:mm')
      } else {
        this.timeList[index].startTime = moment(new Date(), 'HH:mm')
      }
    },
    range(start, end) {
      const result = []
      for (let i = start; i < end; i++) {
        result.push(i)
      }
      return result
    },
    getStartHours(val, index) {
      return this.range(0, 8).concat(this.range(21, 24))
    },
    getDisabledHours(val, index) {
      const hours = []
      const time = moment(this.timeList[index].startTime).format('HH:mm')
      const timeArr = time.split(':')
      for (var i = 0; i < parseInt(timeArr[0]); i++) {
        hours.push(i)
      }
      const arr = hours.concat(this.range(21, 24))
      return arr
    },
    getStartMinutes(selectedHour, index) {
      if (index === 0) {
        return
      }
      const time = moment(this.timeList[index].endTime).format('HH:mm')
      const timeArr = time.split(':')
      const minutes = []
      if (selectedHour === parseInt(timeArr[0])) {
        for (var i = 0; i < parseInt(timeArr[1]); i++) {
          minutes.push(i)
        }
      }
      return minutes
    },
    getDisabledMinutes(selectedHour, index) {
      const time = moment(this.timeList[index].startTime).format('HH:mm')
      const timeArr = time.split(':')
      const minutes = []
      if (selectedHour === parseInt(timeArr[0])) {
        for (var i = 0; i < parseInt(timeArr[1]); i++) {
          minutes.push(i)
        }
      }
      return minutes
    },
    async showBI(id, date, placeId) {
      console.log(date)
      console.log(
        placeId
          .split(',')
          .slice(1)
          .join(',')
      )
      const req = {
        schoolCode: this.userInfo.schoolCode,
        placeId: placeId
          .split(',')
          .slice(1)
          .join(','),
        reserveDate: date,
        orderBy: 'reserve_date ASC, start_time ASC'
      }
      const res = await this.getReserveList(req)
      const data = res.data.list
      const xData = []
      if (data.length === 0) {
        xData.push(
          {
            name: '00:00' + '-' + '08:00',
            label: '不可预订',
            color: '#ddd'
          },
          {
            name: '08:00' + '-' + '20:00',
            label: '可预订',
            color: '#4f93ed'
          },
          {
            name: '20:00' + '-' + '24:00',
            label: '不可预订',
            color: '#ddd'
          }
        )
      } else {
        data.forEach((el, i) => {
          if (i === 0) {
            xData.push({
              name: el.startTime + '-' + el.endTime,
              label: '预订人：' + el.createName,
              color: '#ddd',
              description: el.description
            })
          } else if (i >= 1) {
            if (res.data.list[i - 1].endTime !== el.startTime) {
              if (
                moment(res.data.list[i - 1].endTime, 'HH:mm').valueOf() + 60 * 1000 ===
                moment(el.startTime, 'HH:mm').valueOf()
              ) {
                xData.push({
                  name: el.startTime + '-' + el.endTime,
                  label: '预订人：' + el.createName,
                  color: '#ddd',
                  description: el.description
                })
              } else {
                xData.push(
                  {
                    name:
                      moment(moment(res.data.list[i - 1].endTime, 'HH:mm').valueOf() + 60 * 1000).format('HH:mm') +
                      '-' +
                      moment(moment(el.startTime, 'HH:mm').valueOf() - 60 * 1000).format('HH:mm'),
                    label: '可预订',
                    color: '#4f93ed'
                  },
                  {
                    name: el.startTime + '-' + el.endTime,
                    label: '预订人：' + el.createName,
                    color: '#ddd',
                    description: el.description
                  }
                )
              }
            } else {
              xData.push({
                name: el.startTime + '-' + el.endTime,
                label: '预订人：' + el.createName,
                color: '#ddd',
                description: el.description
              })
            }
          }
        })
        if (data[0].startTime !== '08:00') {
          xData.unshift({
            name: '08:00' + '-' + moment(moment(data[0].startTime, 'HH:mm').valueOf() - 60 * 1000).format('HH:mm'),
            label: '可预订',
            color: '#4f93ed'
          })
        }
        if (data[data.length - 1].endTime !== '20:00') {
          xData.push({
            name:
              moment(moment(data[data.length - 1].endTime, 'HH:mm').valueOf() + 60 * 1000).format('HH:mm') +
              '-' +
              '20:00',
            label: '可预订',
            color: '#4f93ed'
          })
        }
      }
      console.log(xData)
      Highcharts.chart(id, {
        chart: {
          type: 'timeline'
        },
        credits: {
          enabled: false
        },
        xAxis: {
          visible: false
        },
        yAxis: {
          visible: false
        },
        title: {
          text: date
        },
        series: [
          {
            data: xData
          }
        ]
      })
    }
  }
}
</script>

<style lang="less" scoped>
.add-booking {
  padding-top: 30px;
  img {
    width: 24px;
    height: 24px;
    margin: 0 10px;
    cursor: pointer;
  }
  /deep/ .ant-form-item {
    margin-bottom: 14px;
  }
}
</style>
