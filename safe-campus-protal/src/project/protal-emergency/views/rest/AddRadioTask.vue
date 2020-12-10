<template>
  <div class="area-add page-layout bg-fff qui-fx-ver">
    <div class="content pos-box">
      <a-form :form="form">
        <a-form-item label="任务名称：" v-bind="formItemLayout">
          <a-input
            :maxLength="30"
            v-decorator="[
              'name',
              {
                initialValue: appForm.name,
                rules: [{ required: true, message: '请输入任务名称' }]
              }
            ]"
            placeholder="请输入任务名称"
          />
        </a-form-item>
        <a-form-item label="作息分类" v-bind="formItemLayout">
          <a-select
            v-decorator="[
              'categoryCode',
              { initialValue: appForm.categoryCode, rules: [{ required: true, message: '请选择作息分类' }] },
            ]"
            placeholder="请选择作息分类"
          >
            <a-select-option v-for="item in classifyList" :key="item.code">{{ item.name }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="音频资源" v-bind="formItemLayout" required>
          <a-tag @click="choose" v-if="this.resourceCodeList.length === 0">选择音频</a-tag>
          <div class="audio qui-fx-ac qui-fx-jsb u-padd-l20 u-padd-r20 u-mar-t10" v-if="this.resourceCodeList.length > 0">
            <div>【{{ this.resourceCodeList[0].categoryName }}】- {{ this.resourceCodeList[0].name }}</div>
            <audio :src="this.resourceCodeList[0].url" controls></audio>
            <div class="del-index mar-l10" @click="del"><a-icon type="delete" class="u-mar-t10" style="color:red;font-size:26px" /></div>
          </div>
        </a-form-item>
        <a-form-item label="播放区域" v-bind="formItemLayout">
          <a-select
            mode="multiple"
            v-decorator="[
              'areaCodeList',
              { initialValue: appForm.areaCodeList, rules: [{ required: true, message: '请选择播放区域' }] },
            ]"
            placeholder="请选择播放区域"
          >
            <a-select-option v-for="item in areaList" :key="item.code">{{ item.name }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="任务类型" v-bind="formItemLayout">
          <a-radio-group
            :disabled="!!detailId"
            v-decorator="[
              'taskType',
              {
                initialValue: appForm.taskType,
                rules: [{ required: true, message: '请选择任务类型' }]
              }
            ]"
            @change="changeType"
          >
            <a-radio value="1">一次性任务</a-radio>
            <a-radio value="2">周任务</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="启动日期" v-bind="formItemLayout">
          <a-date-picker
            :allowClear="false"
            v-decorator="[
              'startDate',
              {initialValue: appForm.startDate ? appForm.startDate : moment(appForm.startDate || new Date(new Date().getTime() + 24*60*60*1000)), rules: [{ required: true, message: '请选择启动日期' }]}
            ]"
          />
        </a-form-item>
        <a-form-item label="终止日期" v-bind="formItemLayout" v-if="taskType === '2'">
          <a-date-picker
            :allowClear="false"
            v-decorator="[
              'endDate',
              {initialValue: appForm.endDate ? appForm.endDate : moment(appForm.endDate || new Date(new Date().getTime() + 365*24*60*60*1000)), rules: [{ required: true, message: '请选择终止日期' }]}
            ]"
          />
        </a-form-item>
        <a-form-item label="任务时间" v-bind="formItemLayout" v-if="taskType === '2'" required>
          <div class="week-box qui-fx">
            <div
              v-for="week in weekDays"
              :class="['week-item',{'active': currentWeek.indexOf(week.key) > -1}]"
              :key="week.key"
              @click="weekChange(week.key)"
            > {{ week.value }} </div>
          </div>
        </a-form-item>
        <a-form-item label="启动时间" v-bind="formItemLayout">
          <a-time-picker
            :allowClear="false"
            format="HH:mm"
            v-decorator="[
              'startTime',
              {initialValue: moment(appForm.startTime || new Date(), 'HH:mm'),rules: [{ required: true, message: '请选择启动时间' }]}]"
          />
        </a-form-item>
        <a-form-item v-bind="formItemLayout" :style="{ textAlign: 'center'}">
          <a-button @click="cancel">取消</a-button>
          <a-button class="mar-l10" type="primary" @click="submitOk" :disabled="isLoad">保存</a-button>
        </a-form-item>
      </a-form>
    </div>
    <choose-audio v-model="chooseTag" @submit="select" ref="chooseAudio"></choose-audio>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import ChooseAudio from '../../component/ChooseAudio'
import moment from 'moment'
export default {
  name: 'AddRadioTask',
  components: {
    ChooseAudio
  },
  data() {
    return {
      headers: {
        authorization: 'authorization-text'
      },
      formItemLayout: {
        labelCol: { span: 6 },
        wrapperCol: { span: 16 }
      },
      isLoad: false,
      form: this.$form.createForm(this),
      appForm: {
        taskType: '1'
      },
      detailId: '',
      classifyList: [],
      show: true,
      weekDays: [
        {
          key: 1,
          value: '星期一'
        },
        {
          key: 2,
          value: '星期二'
        },
        {
          key: 3,
          value: '星期三'
        },
        {
          key: 4,
          value: '星期四'
        },
        {
          key: 5,
          value: '星期五'
        },
        {
          key: 6,
          value: '星期六'
        },
        {
          key: 7,
          value: '星期日'
        }
      ],
      currentWeek: [],
      chooseTag: false,
      areaList: [],
      taskType: '1',
      resourceCodeList: []
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  mounted() {
    this._getRadioArea()
    this._getRestByCode()
    this.detailId = this.$route.query.id
    if (this.detailId) {
      this._getRadioTaskDetail()
    }
  },
  methods: {
    moment,
    ...mapActions('home', ['addRadioTask', 'getRadioTaskDetail', 'updateRadioTask', 'getRestByCode', 'getRadioArea']),
    // 区域列表
    async _getRadioArea() {
      const res = await this.getRadioArea(this.userInfo.schoolCode)
      this.areaList = res.data
    },
    // 资源分类列表
    async _getRestByCode() {
      const res = await this.getRestByCode(this.userInfo.schoolCode)
      this.classifyList = res.data
    },
    // 广播资源详情
    async _getRadioTaskDetail() {
      const res = await this.getRadioTaskDetail(this.detailId)
      this.appForm = res.data
      this.resourceCodeList = res.data.resourceList
      this.taskType = res.data.taskType
      this.currentWeek = res.data.weekList
    },
    choose() {
      this.$refs.chooseAudio.totalList = []
      this.resourceCodeList = []
      this.chooseTag = true
    },
    // 取消
    cancel() {
      this.$router.go(-1)
    },
    // 周月季任务的切换
    weekChange(record) {
      if (this.currentWeek.length !== 0 && this.currentWeek.indexOf(record) > -1) {
        this.currentWeek = this.currentWeek.filter(el => el !== record)
      } else {
        this.currentWeek.push(record)
      }
    },
    // 任务类型切换
    changeType(e) {
      this.taskType = e.target.value
    },
    select(record) {
      this.chooseTag = false
      this.$refs.chooseAudio.reset()
      this.resourceCodeList = record
    },
    del() {
      this.resourceCodeList = []
    },
    // 提交
    submitOk(e) {
      e.preventDefault()
      this.form.validateFields((error, values) => {
        this.isLoad = false
        if (!error) {
          if (this.resourceCodeList.length === 0) {
            this.$message.warning('请选择音频')
            return false
          }
          if (this.taskType === '2' && this.currentWeek.length === 0) {
            this.$message.warning('请选任务时间')
            return false
          }
          values.schoolCode = this.userInfo.schoolCode
          values.resourceCodeList = this.resourceCodeList.map(el => {
            return el.code
          })
          values.categoryName = this.resourceCodeList[0].categoryName
          values.weekList = this.currentWeek
          values.startDate = moment(values.startDate).format('YYYY-MM-DD')
          values.endDate = this.taskType === '2' ? moment(values.endDate).format('YYYY-MM-DD') : undefined
          values.startTime = moment(values.startTime).format('HH:mm:ss')
          if (this.taskType === '2' && values.endDate < values.startDate) {
            this.$message.warning('终止日期必须大于等于启动日期')
            return false
          }
          this.isLoad = true
          if (!this.detailId) {
            this.addRadioTask(values)
              .then((res) => {
                this.$message.success('操作成功')
                this.$tools.goNext(() => {
                  this.$router.go(-1)
                })
              })
              .catch((res) => {
                this.isLoad = false
              })
          } else {
            values.code = this.detailId
            this.updateRadioTask(values)
              .then((res) => {
                this.$message.success('操作成功')
                this.$tools.goNext(() => {
                  this.$router.go(-1)
                })
              })
              .catch((res) => {
                this.isLoad = false
              })
          }
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.area-add {
  padding: 20px;
  .content {
    height: calc(100% - 100px);
    overflow-y: scroll;
  }
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
.active {
  background-color: #6882DA;
  color: #fff;
}
.audio {
  height: 54px;
  border-radius: 30px;
  background-color: #f1f3f4;
}
</style>
