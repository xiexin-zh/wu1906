<template>
  <div class="avoid-time page-layout">
    <div class="pos-box content">
      <div class="info bg-fff u-padd">
        <div>{{ name }}</div>
        <div class="u-mar-t20">
          <div class="info-box wh50 qui-fx">
            <div class="info-title">检查对象：</div>
            <div class="info-content qui-fx-f1">{{ checkObject }}</div>
          </div>
          <div class="info-box wh50 qui-fx">
            <div class="info-title">潜在风险：</div>
            <div class="info-content qui-fx-f1">{{ riskContent }}</div>
          </div>
        </div>
        <div class="info-box bd qui-fx">
          <div class="info-title">事故类型：</div>
          <div class="info-content qui-fx-f1">{{ accidentType }}</div>
        </div>
      </div>
      <div class="u-mar-t20 bg-fff u-padd-t10  u-padd-b20 u-padd-l20 u-padd-r20">
        <div class="avoid-title">
          <div class="time-title no-set">{{ methodCode === '1' ? '分析评价法-LEC' : '风险评价-LS' }}</div>
        </div>
        <div class="u-mar-t20">
          <a-form :form="form">
            <a-form-item label="L(可能性)" v-bind="formItemLayout" v-if="methodCode === '1'">
              <a-select
                v-decorator="[
                  'lValue',
                  { initialValue: detailInfo.lValue, rules: [{ required: true, message: '请选择' }] }
                ]"
                placeholder="请选择"
                :disabled="auditStatus !== '1'"
                v-model="lValue"
              >
                <a-select-option v-for="(item,index) in assess.lList" :key="index" :value="item.key" >
                  {{ item.val }}
                </a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="E(频繁程度)" v-bind="formItemLayout" v-if="methodCode === '1'">
              <a-select
                v-decorator="[
                  'eValue',
                  { initialValue: detailInfo.eValue, rules: [{ required: true, message: '请选择' }] }
                ]"
                placeholder="请选择"
                :disabled="auditStatus !== '1'"
                v-model="eValue"
              >
                <a-select-option v-for="(item,index) in assess.eList" :key="index" :value="item.key" >
                  {{ item.val }}
                </a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="C(严重性)" v-bind="formItemLayout" v-if="methodCode === '1'">
              <a-select
                v-decorator="[
                  'cValue',
                  { initialValue: detailInfo.cValue, rules: [{ required: true, message: '请选择' }] }
                ]"
                placeholder="请选择"
                :disabled="auditStatus !== '1'"
                v-model="cValue"
              >
                <a-select-option v-for="(item,index) in assess.cList" :key="index" :value="item.key" >
                  {{ item.val }}
                </a-select-option>
              </a-select>
              <div class="tip">
                风险值：{{ riskInfo.grade }}    风险等级：{{ riskInfo.level }}      安全色：{{ riskInfo.color }}
              </div>
            </a-form-item>
            <a-form-item label="L(可能性)" v-bind="formItemLayout" v-if="methodCode === '2'">
              <a-select
                v-decorator="[
                  'lslValue',
                  { initialValue: detailInfo.lValue, rules: [{ required: true, message: '请选择' }] }
                ]"
                placeholder="请选择"
                :disabled="auditStatus !== '1'"
                v-model="lslValue"
              >
                <a-select-option v-for="(item,index) in assess.lsList" :key="index" :value="item.key" >
                  {{ item.val }}
                </a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="S(严重性)" v-bind="formItemLayout" v-if="methodCode === '2'">
              <a-select
                v-decorator="[
                  'sValue',
                  { initialValue: detailInfo.sValue, rules: [{ required: true, message: '请选择' }] }
                ]"
                placeholder="请选择"
                :disabled="auditStatus !== '1'"
                v-model="sValue"
              >
                <a-select-option v-for="(item,index) in assess.sList" :key="index" :value="item.key" >
                  {{ item.val }}
                </a-select-option>
              </a-select>
              <div class="tip">
                风险值：{{ riskInfo.grade }}    风险等级：{{ riskInfo.level }}      安全色：{{ riskInfo.color }}
              </div>
            </a-form-item>
            <a-form-item label="管控层级" v-bind="formItemLayout" >
              <a-select
                v-decorator="[
                  'controlLevel',
                  { initialValue: detailInfo.controlLevel, rules: [{ required: true, message: '请选择管控层级' }] }
                ]"
                placeholder="请选择管控层级"
                :disabled="auditStatus !== '1'"
              >
                <a-select-option v-for="(item,index) in assess.controlList" :key="index" :value="item.key" >
                  {{ item.val }}
                </a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="责任岗位" v-bind="formItemLayout" >
              <a-select
                v-decorator="[
                  'responsibilityPost',
                  { initialValue: detailInfo.responsibilityPost, rules: [{ required: true, message: '请选择责任岗位' }] }
                ]"
                placeholder="请选择责任岗位"
                :disabled="auditStatus !== '1'"
              >
                <a-select-option v-for="(item,index) in assess.postList" :key="index" :value="item.val" >
                  {{ item.val }}
                </a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="责任部门" v-bind="formItemLayout" >
              <a-select
                v-decorator="[
                  'responsibilityDept',
                  { initialValue: detailInfo.responsibilityDept, rules: [{ required: true, message: '请选择责任部门' }] }
                ]"
                placeholder="请选择责任部门"
                @change="handleChange"
                :disabled="auditStatus !== '1'"
              >
                <a-select-option v-for="(item,index) in partList" :key="index" :value="item.code">
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="责任人" v-bind="formItemLayout" required>
              <a-select
                v-decorator="[
                  'responsibilityUserName',
                  { initialValue: detailInfo.responsibilityUserName, rules: [{ required: true, message: '请选择责任人' }] }
                ]"
                placeholder="请选择责任人"
                @change="change"
                :disabled="auditStatus !== '1'"
              >
                <a-select-option v-for="(item,index) in userList" :key="index" :value="`${item.userCode}=${item.userName}+${item.mobile}`">
                  {{ item.userName }}
                </a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item v-bind="formItemLayout" label="电话" required>
              <a-input
                :disabled="true"
                v-decorator="[
                  'telephone',
                  { initialValue: detailInfo.telephone}
                ]"
              />
            </a-form-item>
          </a-form>
        </div>
      </div>
      <div class="u-mar-t20 bg-fff u-padd-t10  u-padd-b20 u-padd-l20 u-padd-r20">
        <div class="avoid-title">
          <div class="time-title top-title">审核建议措施</div>
        </div>
        <div class="u-mar-t20">
          <a-row>
            <a-col :span="12" v-for="(list,index) in assess.remarkList" :key="index">
              <div class="qui-fx u-mar">
                <div class="title">{{ list.title }}</div>
                <a-textarea
                  v-model="detailInfo[list.key]"
                  @change="areaChange($event, list)"
                  :auto-size="{ minRows: 3, maxRows: 5 }"
                  :disabled="auditStatus !== '1'"
                />
              </div>
            </a-col>
          </a-row>
        </div>
      </div>
      <div class="u-mar-t20 bg-fff u-padd-t10  u-padd-b20 u-padd-l20 u-padd-r20">
        <div class="avoid-title">
          <div class="time-title sign-title">警示标识</div>
        </div>
        <div class="qui-fx-wp">
          <img class="sign u-mar-r10 u-mar-t10" v-for="(list,index) in detailInfo.warnings" :key="index" :src="list.url" alt="">
          <div class="sign qui-fx-ac-jc u-mar-t10" @click="add" v-if="auditStatus === '1'">
            <a-icon style="font-size: 30px" type="plus"/>
          </div>
        </div>
      </div>
      <div class="u-mar-t20 bg-fff u-padd-t10  u-padd-b20 u-padd-l20 u-padd-r20">
        <div class="avoid-title">
          <div class="time-title remain-title">{{ methodCode === '1' ? '剩余分析评价法-LEC' : '剩余风险评价-LS' }}</div>
        </div>
        <div class="u-mar-t20">
          <a-form :form="lastForm">
            <a-form-item label="L(可能性)" v-bind="formItemLayout" v-if="methodCode === '1'">
              <a-select
                v-decorator="[
                  'remainingLValue',
                  { initialValue: detailInfo.remainingLValue, rules: [{ required: true, message: '请选择' }] }
                ]"
                placeholder="请选择"
                :disabled="auditStatus !== '1'"
                v-model="remainingLValue"
              >
                <a-select-option v-for="(item,index) in assess.lList" :key="index" :value="item.key" >
                  {{ item.val }}
                </a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="E(频繁程度)" v-bind="formItemLayout" v-if="methodCode === '1'">
              <a-select
                v-decorator="[
                  'remainingEValue',
                  { initialValue: detailInfo.remainingEValue, rules: [{ required: true, message: '请选择' }] }
                ]"
                placeholder="请选择"
                :disabled="auditStatus !== '1'"
                v-model="remainingEValue"
              >
                <a-select-option v-for="(item,index) in assess.eList" :key="index" :value="item.key" >
                  {{ item.val }}
                </a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="C(严重性)" v-bind="formItemLayout" v-if="methodCode === '1'">
              <a-select
                v-decorator="[
                  'remainingCValue',
                  { initialValue: detailInfo.remainingCValue, rules: [{ required: true, message: '请选择' }] }
                ]"
                placeholder="请选择"
                :disabled="auditStatus !== '1'"
                v-model="remainingCValue"
              >
                <a-select-option v-for="(item,index) in assess.cList" :key="index" :value="item.key" >
                  {{ item.val }}
                </a-select-option>
              </a-select>
              <div class="tip">
                风险值：{{ remainInfo.grade }}    风险等级：{{ remainInfo.level }}      安全色：{{ remainInfo.color }}
              </div>
            </a-form-item>
            <a-form-item label="L(可能性)" v-bind="formItemLayout" v-if="methodCode === '2'">
              <a-select
                v-decorator="[
                  'remainingLslValue',
                  { initialValue: detailInfo.remainingLValue, rules: [{ required: true, message: '请选择' }] }
                ]"
                placeholder="请选择"
                :disabled="auditStatus !== '1'"
                v-model="remainingLslValue"
              >
                <a-select-option v-for="(item,index) in assess.lsList" :key="index" :value="item.key" >
                  {{ item.val }}
                </a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="S(严重性)" v-bind="formItemLayout" v-if="methodCode === '2'">
              <a-select
                v-decorator="[
                  'remainingSValue',
                  { initialValue: detailInfo.remainingSValue, rules: [{ required: true, message: '请选择' }] }
                ]"
                placeholder="请选择"
                :disabled="auditStatus !== '1'"
                v-model="remainingSValue"
              >
                <a-select-option v-for="(item,index) in assess.sList" :key="index" :value="item.key" >
                  {{ item.val }}
                </a-select-option>
              </a-select>
              <div class="tip">
                风险值：{{ remainInfo.grade }}    风险等级：{{ remainInfo.level }}      安全色：{{ remainInfo.color }}
              </div>
            </a-form-item>
          </a-form>
        </div>
      </div>
      <div class="u-tx-c u-mar-t20" v-if="auditStatus === '1'">
        <a-button @click="cancel">取消</a-button>
        <a-button class="mar-l10" type="primary" @click="submitOk" :disabled="isLoad">保存</a-button>
      </div>
    </div>
    <choose-sign
      ref="chooseSign"
      is-check
      :teacherList="identifyList"
      v-if="signTag"
      v-model="signTag"
      @submit="chooseSign"
      title="添加成员"
    ></choose-sign>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import ChooseSign from '../../component/ChooseSign'
import assess from '../../assets/js/table/assess'
export default {
  name: 'AddAssess',
  components: {
    ChooseSign
  },
  data() {
    return {
      assess,
      detailInfo: [],
      userList: [],
      formItemLayout: {
        labelCol: { span: 3 },
        wrapperCol: { span: 21 }
      },
      isLoad: false,
      form: this.$form.createForm(this),
      lastForm: this.$form.createForm(this),
      fileList: [],
      name: '',
      accidentType: '',
      checkObject: '',
      riskContent: '',
      methodCode: '',
      identifyList: [],
      userTag: false,
      signTag: false,
      partList: [],
      responsibilityDept: '',
      riskLevel: '',
      auditStatus: '',
      riskInfo: {},
      remainInfo: {},
      lValue: '',
      cValue: '',
      eValue: '',
      sValue: '',
      lslValue: '',
      remainingCValue: '',
      remainingEValue: '',
      remainingLValue: '',
      remainingSValue: '',
      remainingLslValue: ''
    }
  },
  watch: {
    lValue(newVal, oldVal) {
      if (newVal !== oldVal) {
        this._lecRisk(0)
      }
    },
    cValue(newVal, oldVal) {
      if (newVal !== oldVal) {
        this._lecRisk(0)
      }
    },
    eValue(newVal, oldVal) {
      if (newVal !== oldVal) {
        this._lecRisk(0)
      }
    },
    sValue(newVal, oldVal) {
      if (newVal !== oldVal) {
        this._lsRisk(0)
      }
    },
    lslValue(newVal, oldVal) {
      if (newVal !== oldVal) {
        this._lsRisk(0)
      }
    },
    remainingCValue(newVal, oldVal) {
      if (newVal !== oldVal) {
        this._lecRisk(1)
      }
    },
    remainingEValue(newVal, oldVal) {
      if (newVal !== oldVal) {
        this._lecRisk(1)
      }
    },
    remainingLValue(newVal, oldVal) {
      if (newVal !== oldVal) {
        this._lecRisk(1)
      }
    },
    remainingLslValue(newVal, oldVal) {
      if (newVal !== oldVal) {
        this._lsRisk(1)
      }
    },
    remainingSValue(newVal, oldVal) {
      if (newVal !== oldVal) {
        this._lsRisk(1)
      }
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  mounted() {
    this.accidentType = this.$route.query.accidentType
    this.checkObject = this.$route.query.checkObject
    this.riskContent = this.$route.query.riskContent
    this.name = this.$route.query.name
    this.methodCode = this.$route.query.methodCode
    this.detailId = this.$route.query.id
    this.riskLevel = this.$route.query.riskLevel
    this.auditStatus = this.$route.query.auditStatus
    this._getOrgBySchool()
    if (this.riskLevel) {
      this.showDetail()
    }
  },
  methods: {
    ...mapActions('home', ['riskAssessDetail', 'riskAssess', 'getOrgBySchool', 'getTeacherList', 'lecRisk', 'lsRisk']),
    // 获取学校信息
    async _getOrgBySchool () {
      const res = await this.getOrgBySchool(this.userInfo.schoolCode)
      this.partList = res.data.orgChilds
      console.log('this.partList',this.partList)
    },
    // 获取所有老师
    async _getTeacherList () {
      const req = {
        page: 1,
        size: 9999,
        schoolCode: this.userInfo.schoolCode,
        orgCode: this.responsibilityDept
      }
      const res = await this.getTeacherList(req)
      this.userList = res.data.list
    },
    async _lecRisk (type) {
      if (type) {
        if (this.remainingCValue && this.remainingEValue && this.remainingLValue) {
          const req = {
            cValue: this.remainingCValue,
            eValue: this.remainingEValue,
            lValue: this.remainingLValue
          }
          const res = await this.lecRisk(req)
          this.remainInfo = res.data
        }
      } else {
        if (this.cValue && this.eValue && this.lValue) {
          const req = {
            cValue: this.cValue,
            eValue: this.eValue,
            lValue: this.lValue
          }
          const res = await this.lecRisk(req)
          this.riskInfo = res.data
        }
      }
    },
    async _lsRisk (type) {
      if (type) {
        if (this.remainingLslValue && this.remainingSValue) {
          const req = {
            lValue: this.remainingLslValue,
            sValue: this.remainingSValue
          }
          const res = await this.lsRisk(req)
          this.remainInfo = res.data
        }
      } else {
        if (this.lslValue && this.sValue) {
          const req = {
            lValue: this.lslValue,
            sValue: this.sValue
          }
          const res = await this.lsRisk(req)
          this.riskInfo = res.data
        }
      }
    },
    handleChange(record) {
      this.responsibilityDept = record
      this.form.resetFields('responsibilityUserName')
      this.detailInfo.responsibilityUserName = ''
      this.detailInfo.responsibilityUserCode = ''
      this.detailInfo.telephone = ''
      this._getTeacherList()
    },
    change(record) {
      this.detailInfo.responsibilityUserName = record.split('=')[1].split('+')[0]
      this.detailInfo.responsibilityUserCode = record.split('=')[0]
      this.detailInfo.telephone = record.split('=')[1].split('+')[1]
    },
    async showDetail() {
      const res = await this.riskAssessDetail(this.detailId)
      this.detailInfo = res.data
      if (this.detailInfo.signs.length > 0) {
        this.detailInfo.warnings = this.detailInfo.signs.map(el => {
          return {
            url: el
          }
        })
      }
      this.responsibilityDept = res.data.responsibilityDept
      this.riskInfo = res.data.riskIndex
      this.remainInfo = res.data.remainingRiskIndex
      this.lValue = res.data.lValue
      this.cValue = res.data.cValue
      this.eValue = res.data.eValue
      this.sValue = res.data.sValue
      this.lslValue = res.data.lValue
      this.remainingCValue = res.data.remainingCValue
      this.remainingEValue = res.data.remainingEValue
      this.remainingLValue = res.data.remainingLValue
      this.remainingSValue = res.data.remainingSValue
      this.remainingLslValue = res.data.remainingLslValue
      this._getTeacherList()
    },
    add () {
      this.signTag = true
    },
    chooseSign (record) {
      this.$refs.chooseSign.reset()
      this.detailInfo.warnings = record
    },
    cancel() {
      this.$router.go(-1)
    },
    areaChange(e, record) {
      this.detailInfo[record.key] = e.target.value
    },
    submitOk(e) {
      e.preventDefault()
      this.form.validateFields((error, values) => {
        if (!error) {
          this.lastForm.validateFields((error, val) => {
            if (!error) {
              const warnings = []
              if (this.detailInfo.warnings && this.detailInfo.warnings.length > 0) {
                this.detailInfo.warnings.map(el => {
                  warnings.push(el.url)
                })
              }
              values.responsibilityUserName = this.detailInfo.responsibilityUserName
              values.warnings = warnings
              values.id = this.detailId
              val.responsibilityDept = this.riskLevel ? values.responsibilityDept : this.partList.filter(el => el.code === values.responsibilityDept)[0].name
              if (this.methodCode === '2') {
                values.lValue = values.lslValue
                val.remainingLValue = val.remainingLslValue
              }
              this.isLoad = true
              this.riskAssess({
                ...this.detailInfo,
                ...values,
                ...val
              })
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
          })
        }
      })
    }
  }

}
</script>
<style lang="less" scoped>
.avoid-time {
  background-color: #f5f5fb;
  .content {
    height: calc(100% - 10px);
    overflow-y: scroll;
  }
  .avoid-title {
    height: 45px;
    line-height: 45px;
    font-size: 16px;
    color: #4D4CAC;
    border-bottom: 1px solid #ccc;
    .time-title {
      height: 100%;
      border-bottom: 3px solid #4D4CAC;
    }
    .no-set {
      width: 118px;
    }
  }
}
.info {
  height: 140px;
    .info-box {
      border-top: 1px solid #9698d6;
      height: 30px;
      line-height: 25px;
      float: left;
      width: 100%;
      &:nth-child(2n) {
        border-right: 1px solid #9698d6;
      }
    }
    .wh50 {
      width: 50%;
    }
    .bd {
      border-bottom: 1px solid #9698d6;
      border-right: 1px solid #9698d6;
    }
    .info-title {
      width: 150px;
      background-color: #f5f5fb;
      border-right: 1px solid #9698d6;
      border-left: 1px solid #9698d6;
      text-align: right;
      padding: 0 5px;
      color: #575758;
    }
    .info-content {
      padding: 0 10px;
      color: #333;
      width: 100%;
      overflow-x: scroll;
    }
  }
  .form-left {
    width: 320px;
  }
  .title {
    width: 90px;
  }
  .sign {
    width: 80px;
    height: 80px;
    color: #ccc;
  }
  .top-title{
    width: 100px;
  }
  .remain-title{
    width: 150px;
  }
  .sign-title{
    width: 66px;
  }
  .tip {
    height: 15px;
  }
</style>
