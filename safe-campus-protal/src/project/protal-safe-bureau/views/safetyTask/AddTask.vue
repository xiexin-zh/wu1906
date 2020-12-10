<template>
  <div class="task-add page-layout qui-fx-ver">
    <div class="content pos-box">
      <div class="u-padd-10 u-padd-l20 bg-fff">
        <div class="fill-top u-mar-b20">
          <div class="fill-head task">任务内容</div>
        </div>
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
          <a-form-item label="任务类型" v-bind="formItemLayout">
            <a-radio-group
              v-decorator="[
                'taskType',
                {
                  initialValue: cardInfo.taskType,
                  rules: [{ required: true, message: '请选择任务类型' }]
                }
              ]"
              button-style="solid"
              @change="change"
              :disabled="isEdit"
            >
              <a-radio-button value="1">一次性计划</a-radio-button>
              <a-radio-button value="2">周任务</a-radio-button>
              <a-radio-button value="3">月任务</a-radio-button>
            </a-radio-group>
            <div class="week-box week-task qui-fx-ver" v-if="cardInfo.taskType === '2'">
              <div>
                <span class="mar-r10">
                  <a-input-number id="inputNumber" v-model="value" :min="minValue" />
                </span>
                <div :class="['week-item', 'weeks', { active: allWeek }]" @click="chooseAll('allWeek', 'weekCurrent')">
                  今年全选
                </div>
              </div>
              <div>
                <a-tooltip
                  placement="rightTop"
                  :class="['week-item', 'weeks', { active: weekCurrent.indexOf(Number(index)) > -1 }]"
                  v-for="(item, index) in weeks"
                  :key="index"
                  @click="weekChange('weekCurrent', Number(index), 'allWeek')"
                >
                  <template slot="title">
                    <span>{{ item[0] }}~{{ item[item.length - 1] }}</span>
                  </template>
                  <div>第{{ index }}周</div>
                </a-tooltip>
              </div>
            </div>
            <div class="week-box week-task qui-fx-ver" v-if="cardInfo.taskType === '3'">
              <div>
                <span class="mar-r10">
                  <a-input-number id="inputNumber" v-model="value" :min="minValue" />
                </span>
                <div
                  :class="['week-item', 'weeks', { active: allMonth }]"
                  @click="chooseAll('allMonth', 'monthCurrent')"
                >
                  今年全选
                </div>
              </div>
              <div>
                <div
                  :class="['week-item', 'weeks', { active: monthCurrent.indexOf(item) > -1 }]"
                  v-for="(item, index) in 12"
                  :key="index"
                  @click="weekChange('monthCurrent', item, 'allMonth')"
                >
                  {{ item > 9 ? item : `0${item}` }}月
                </div>
              </div>
            </div>
          </a-form-item>
          <a-form-item
            label="时间："
            v-bind="formItemLayout"
            :style="{ textAlign: 'center' }"
            v-if="cardInfo.taskType === '1'"
          >
            <a-range-picker
              :disabled-date="disabledDate"
              v-decorator="[
                'data',
                {
                  initialValue: [
                    moment(cardInfo.startTime ? new Date(cardInfo.startTime) : new Date(), 'YYYY-MM-DD'),
                    moment(cardInfo.endTime ? new Date(cardInfo.endTime) : new Date(), 'YYYY-MM-DD')
                  ],
                  rules: [{ required: 'required', message: '请选择时间' }]
                }
              ]"
            />
          </a-form-item>
          <a-form-item label="任务描述：" v-bind="formItemLayout" :style="{ textAlign: 'center' }" required>
            <quill-editor
              v-model="cardInfo.des"
              ref="myQuillEditor"
              :options="quillOption"
              @focus="onEditorFocus($event)"
              @change="onEditorChange($event)"
            ></quill-editor>
          </a-form-item>
          <a-form-item label="任务附件：" v-bind="formItemLayout" :style="{ textAlign: 'left' }">
            <a-upload
              name="fileList"
              :multiple="false"
              :action="url"
              :data="params"
              :remove="handleRemove"
              @change="handleChange"
            >
              <a-button v-if="show"> <a-icon type="upload" />上传附件 </a-button>
            </a-upload>
            <div v-if="flag">
              {{ docName }}
              <a-button class="del-action-btn mar-l10" icon="delete" size="small" @click="delFile"></a-button>
            </div>
          </a-form-item>
        </a-form>
      </div>
      <div class="u-mar-t10 bg-fff u-padd-10 u-padd-l20">
        <div class="fill-top">
          <div class="fill-head report">要求上报内容</div>
        </div>
        <div class="qui-fx">
          <div class="qui-fx">
            <div class="left u-padd-10 u-mar-t20 u-bd-1px">
              <div class="u-mar-b10">请点击题目控件添加题目</div>
              <div
                :class="['left-content', 'u-mar-b10', 'u-tx-c', 'u-bd-1px', item.key === '0' ? 'bgc' : 'bg-fff']"
                v-for="item in list"
                :key="item.key"
                @click="modify(0, item.key)"
              >
                {{ item.val }}
              </div>
            </div>
          </div>
          <no-data
            msg="暂无题目~"
            v-if="
              radioList &&
                checkList &&
                fillList &&
                fileList &&
                radioList.length === 0 &&
                checkList.length === 0 &&
                fillList.length === 0 &&
                fileList.length === 0
            "
          ></no-data>
          <div class="qui-fx-f1" v-else>
            <div class="u-mar-t20 u-mar-l20 u-mar-r20" v-if="radioList.length !== 0">
              <div>单选题</div>
              <div class="subject u-mar-t10 u-padd-b10">
                <div class="project qui-fx u-mar-b10 u-padd" v-for="el in radioList" :key="el.key">
                  <div class="qui-fx-ver">题目：</div>
                  <div class="qui-fx-f1 qui-fx-ver u-mar-l20">
                    <div class="qui-fx">
                      <a-input style="width:90%" placeholder="请输入标题" v-model="el.title" />
                      <div class="u-line u-mar-l10 u-type-primary" @click="del(0, el, 'radioList')">删除</div>
                    </div>
                    <div class="qui-fx u-mar-t10" v-for="item in el.pointList" :key="item.key">
                      <a-input style="width:90%" placeholder="请输入选项" v-model="item.content" />
                      <a-icon class="u-line u-mar-l10 u-type-primary" type="minus-circle" @click="del(1, el, item)" />
                    </div>
                    <div class="qui-fx u-mar-t10">
                      <a-input class="input" placeholder="新建选项" read-only @click="modify(1, 'radioList', el)" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="u-mar-l20 u-mar-r20" v-if="checkList.length !== 0">
              <div>多选题</div>
              <div class="subject u-mar-t10 u-padd-b10">
                <div class="project qui-fx u-mar-b10 u-padd" v-for="el in checkList" :key="el.key">
                  <div class="qui-fx-ver">题目：</div>
                  <div class="qui-fx-f1 qui-fx-ver u-mar-l20">
                    <div class="qui-fx">
                      <a-input style="width:90%" placeholder="请输入标题" v-model="el.title" />
                      <div class="u-line u-mar-l10 u-type-primary" @click="del(0, el, 'checkList')">删除</div>
                    </div>
                    <div class="qui-fx u-mar-t10" v-for="item in el.pointList" :key="item.key">
                      <a-input style="width:90%" placeholder="请输入选项" v-model="item.content" />
                      <a-icon class="u-line u-mar-l10 u-type-primary" type="minus-circle" @click="del(1, el, item)" />
                    </div>
                    <div class="qui-fx u-mar-t10">
                      <a-input class="input" placeholder="新建选项" read-only @click="modify(1, 'checkList', el)" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="u-mar-l20 u-mar-r20" v-if="fillList.length !== 0">
              <div>填空题</div>
              <div class="subject u-mar-t10 u-padd-b10">
                <div class="project qui-fx u-mar-b10 u-padd" v-for="el in fillList" :key="el.key">
                  <div class="qui-fx-ver">题目：</div>
                  <div class="qui-fx-f1 qui-fx-ver u-mar-l20">
                    <div class="qui-fx">
                      <a-input style="width:90%" placeholder="请输入题目" v-model="el.title" />
                      <div class="u-line u-mar-l10 u-type-primary" @click="del(0, el, 'fillList')">删除</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="u-mar-l20 u-mar-r20" v-if="fileList.length !== 0">
              <div>附件上传</div>
              <div class="subject u-mar-t10 u-padd-b10">
                <div class="project qui-fx u-mar-b10 u-padd" v-for="el in fileList" :key="el.key">
                  <div class="qui-fx-ver">题目：</div>
                  <div class="qui-fx-f1 qui-fx-ver u-mar-l20">
                    <div class="qui-fx">
                      <a-input style="width:90%" placeholder="请输入附件标题" v-model="el.title" />
                      <div class="u-line u-mar-l10 u-type-primary" @click="del(0, el, 'fileList')">删除</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="u-tx-c u-mar-t20">
        <a-button @click="cancel">取消</a-button>
        <a-button class="mar-l10" type="primary" @click="submitOk" :disabled="isLoad">保存</a-button>
      </div>
    </div>
  </div>
</template>

<script>
import hostEnv from '@config/host-env'
import { quillEditor } from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import UploadMulti from '@c/UploadMulti'
import quillConfig from '../../assets/js/quill-config'
import { mapState, mapActions } from 'vuex'
import NoData from '@c/NoData'
import moment from 'moment'
export default {
  name: 'AddTask',
  components: {
    quillEditor,
    UploadMulti,
    NoData
  },
  data() {
    return {
      list: [
        {
          key: '0',
          val: '上报常用项'
        },
        {
          key: 'radio',
          val: '单选题'
        },
        {
          key: 'check',
          val: '多选题'
        },
        {
          key: 'fill',
          val: '填空题'
        },
        {
          key: 'file',
          val: '附件上传'
        }
      ],
      radioList: [],
      checkList: [],
      fillList: [],
      fileList: [],
      radioCount: 0,
      checkCount: 0,
      fillCount: 0,
      fileCount: 0,
      quillOption: quillConfig,
      formItemLayout: {
        labelCol: { span: 6 },
        wrapperCol: { span: 16 }
      },
      isLoad: false,
      form: this.$form.createForm(this),
      times: [],
      detailId: '',
      cardInfo: {
        taskType: '1'
      },
      value: 2020,
      minValue: 2020,
      weeks: '',
      weekCurrent: [],
      monthCurrent: [],
      allWeek: false,
      allMonth: false,
      isEdit: false,
      devices: [],
      title: '',
      url: '',
      params: {},
      docUrl: '',
      show: true,
      flag: false,
      defaultFileList: [],
      docName: ''
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
    this.url = `${hostEnv.protal_api_10050}/file/upload/doc`
    this.params.schoolCode = this.userInfo.schoolCode
    this.detailId = this.$route.query.id
    this.type = this.$route.query.type + ''
    this.times = [{ key: 0 }]
    this.title = this.url === 'safe' ? '护导队伍' : '巡查人员'
    if (this.detailId) {
      this.showDetail()
      this.isEdit = this.type === '1'
    } else {
      this.isEdit = false
    }
    this.value = new Date().getFullYear()
    this.minValue = new Date().getFullYear()
    this.getnumofweeks(this.value)
  },
  methods: {
    ...mapActions('home', [
      'getTaskDetail',
      'addTask',
      'updateDailyTask',
      'addSafeTask',
      'updateSafeTask',
      'modifySchoolTask'
    ]),
    moment,
    disabledDate(current) {
      // console.log( moment().endOf('day'))
      // Can not select days before today and today
      return current && current <= moment().endOf('day')
    },
    // 获取详情
    async showDetail() {
      const res = await this.getTaskDetail(this.detailId)
      this.cardInfo = res.data
      this.weekCurrent = res.data.dateNums
      this.monthCurrent = res.data.dateNums
      const questions = res.data.questions.map((el, index) => {
        return {
          ...el,
          key: index,
          pointList: el.content
            ? el.content.map((item, i) => {
                return {
                  key: i,
                  content: item
                }
              })
            : []
        }
      })
      questions.map(el => {
        if (el.questionType === '1') {
          this.radioList.push(el)
          this.radioCount = this.radioList.length
        } else if (el.questionType === '2') {
          this.checkList.push(el)
          this.checkCount = this.checkList.length
        } else if (el.questionType === '3') {
          this.fillList.push(el)
          this.fillCount = this.fillList.length
        } else {
          this.fileList.push(el)
          this.fileCount = this.fileList.length
        }
      })
      this.docName = res.data.docName
      this.docUrl = res.data.docUrl
      this.show = !res.data.docUrl
      this.flag = !!res.data.docUrl
    },
    // 富文本编辑器方法
    onEditorFocus(data) {},
    // 获得焦点事件
    onEditorChange(data) {
      this.text = data.text
      this.content = data.html
      this.roundup = data.text.substring(0, 120)
    },
    // 获取每年有几周
    formatNumber(n) {
      return n.toString().length > 1 ? n : '0' + n
    },
    getnumofweeks(year) {
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
          dates.push(
            year +
              '-' +
              this.formatNumber(i) +
              '-' +
              this.formatNumber(j) +
              '_' +
              new Date([year, i, j].join('-')).getDay()
          )
        }
      }
      return dates
    },
    // 任务类型切换
    change(e) {
      this.cardInfo.taskType = e.target.value
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
      this[string]
        ? this.getNum(data, string === 'allMonth' ? 12 : string === 'allQuarter' ? 4 : Object.values(this.weeks).length)
        : (this[data] = [])
    },
    getNum(string, num) {
      var arr = []
      for (var i = 1; i <= num; i++) {
        arr.push(i)
      }
      this[string] = arr
    },
    cancel() {
      this.$router.go(-1)
    },
    delFile() {
      this.show = true
      this.flag = false
    },
    handleRemove() {
      this.show = true
    },
    handleChange(info) {
      if (info.file.status !== 'uploading' && info.file.status !== 'removed') {
        if (info.file.response) {
          this.$message.error(info.file.response.message)
        }
      }
      if (info.file.status === 'done') {
        if (info.file.response.code === 200) {
          this.show = false
          this.$message.success(`${info.file.name} 上传成功`)
          this.docUrl = info.file.response.data[0]
          this.docName = info.file.name
        } else {
          this.$message.error(info.file.response.message)
        }
      } else if (info.file.status === 'error') {
        this.$message.error(`${info.file.name} 上传失败`)
      }
    },
    modify(type, key, record) {
      if (type) {
        let length = record.pointList.length === 0 ? 0 : record.pointList[record.pointList.length - 1].key + 1
        const newData = {
          key: length
        }
        record.pointList = [...record.pointList, newData]
        length = length + 1
      } else {
        if (key === '0') return false
        const newData = {
          key: this[`${key}Count`],
          pointList: [],
          questionType: key === 'radio' ? '1' : key === 'check' ? '2' : key === 'fill' ? '3' : '4'
        }
        this[`${key}List`] = [...this[`${key}List`], newData]
        this[`${key}Count`] = this[`${key}Count`] + 1
      }
    },
    // 删除
    del(type, list, string) {
      if (type) {
        list.pointList.filter(el => {
          if (el.key === string.key) {
            list.pointList = list.pointList.filter(i => i !== string)
          }
        })
      } else {
        this[string] = this[string].filter(i => i !== list)
      }
    },
    // 提交
    submitOk(e) {
      e.preventDefault()
      this.form.validateFields((error, values) => {
        if (!this.cardInfo.des) {
          this.$message.warning('请填写任务描述')
          return false
        }
        let list = this.radioList
          .concat(this.checkList)
          .concat(this.fillList)
          .concat(this.fileList)
        if (list.length === 0) {
          this.$message.warning('请点击题目控件添加题目')
          return false
        }
        list = list.map(el => {
          return {
            content:
              el.questionType === '1' || el.questionType === '2'
                ? el.pointList.map(item => {
                    return item.content ? item.content : ''
                  })
                : [],
            title: el.title,
            questionType: el.questionType
          }
        })
        const isTrue = []
        list.forEach(el => {
          if (!el.title || ((el.questionType === '1' || el.questionType === '2') && el.content.length === 0)) {
            isTrue.push(1)
          } else if (el.content && el.content.length !== 0) {
            el.content.forEach(element => {
              if (element === '') {
                isTrue.push(1)
              }
            })
          }
        })
        if (isTrue.length > 0) {
          this.$message.warning('请填写完整题目')
          return false
        }
        values.userName = this.userInfo.userName
        values.userCode = this.userInfo.userCode
        values.schoolCode = this.userInfo.schoolCode
        values.year = this.value
        values.docUrl = this.docUrl
        values.docName = this.docName
        values.questions = list
        values.des = this.cardInfo.des
        values.startTime = this.cardInfo.taskType === '1' ? moment(values.data[0]).format('YYYY-MM-DD') : undefined
        values.endTime = this.cardInfo.taskType === '1' ? moment(values.data[1]).format('YYYY-MM-DD') : undefined
        const dateNums =
          this.cardInfo.taskType === '2' ? this.weekCurrent : this.cardInfo.taskType === '3' ? this.monthCurrent : ''
        for (var j = 0; j < dateNums.length - 1; j++) {
          for (var i = 0; i < dateNums.length - 1 - j; i++) {
            if (dateNums[i] > dateNums[i + 1]) {
              var temp = dateNums[i]
              dateNums[i] = dateNums[i + 1]
              dateNums[i + 1] = temp
            }
          }
        }
        values.dateNums = dateNums
        if (this.cardInfo.taskType !== '1' && values.dateNums.length === 0) {
          this.$message.warning('请选择任务时间')
          return false
        }
        this.isLoad = false
        if (!error) {
          this.isLoad = true
          if (this.type === '1') {
            values.id = this.detailId
            this.modifySchoolTask(values)
              .then(res => {
                this.$message.success('操作成功')
                this.$tools.goNext(() => {
                  this.$router.go(-1)
                })
              })
              .catch(res => {
                this.isLoad = false
              })
          } else if (this.type === '2' || this.type === '0') {
            this.addTask(values)
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
      })
    }
  }
}
</script>
<style lang="less" scoped>
.task-add {
  background-color: #f5f5fb;
  .content {
    height: calc(100% - 10px);
    overflow-y: scroll;
    .fill-top {
      height: 30px;
      line-height: 30px;
      font-size: 16px;
      color: #4d4cac;
      border-bottom: 1px solid #ccc;
      .fill-head {
        text-align: center;
        border-bottom: 3px solid #4d4cac;
      }
      .task {
        width: 70px;
      }
      .report {
        width: 100px;
      }
    }
    .week-box {
      max-width: 600px;
      margin-top: 10px;
      border-top: 5px solid #6882da;
      box-shadow: 0px 0px 6px #ddd;
      padding: 10px;
      .week-item {
        width: 75px;
        display: inline-block;
        border: 1px solid #e7e7e7;
        text-align: center;
        cursor: pointer;
        margin: 5px 10px;
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
    .left {
      width: 220px;
      height: 300px;
      background-color: #fcfcfc;
      .left-content {
        width: 100%;
        height: 33px;
        line-height: 33px;
      }
      .bgc {
        color: #4d4cac;
        background-color: #f5f5fb;
      }
    }
    .ant-calendar-picker {
      width: 100% !important;
    }
    .active {
      background-color: #6882da;
      color: #fff;
    }
    .project {
      background-color: #fafafa;
    }
    .input {
      width: 90%;
      border: 1px dashed #cfcfcf;
    }
    .u-line {
      line-height: 32px;
    }
  }
}
</style>
