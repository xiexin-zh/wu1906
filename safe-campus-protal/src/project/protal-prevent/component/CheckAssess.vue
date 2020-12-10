<template>
  <a-modal
    width="1000px"
    title="风险审核"
    v-model="status"
    @ok="submitOk"
    :maskClosable="false"
    :destroyOnClose="true"
    :confirmLoading="confirmLoading"
    :okButtonProps="{ props: {disabled: isLoad} }">
    <div class="u-mar-b20">
      <a-table :columns="assess.checkColumns" :data-source="assess.dataSource" :pagination="false">
        <template v-slot:other1="other1">
          <a-switch default-checked v-model="other1.checkObject" :disabled="auditStatus !== '1'"/>
        </template>
        <template v-slot:other2="other2">
          <a-input :maxLength="30" v-model="other2.reason" :disabled="auditStatus !== '1'"/>
        </template>
      </a-table>
    </div>
    <a-form :form="form" >
      <a-form-item label="审核建议" v-bind="formItemLayout" required>
        <a-radio-group
          :disabled="auditStatus !== '1'"
          @change="change"
          buttonStyle="solid"
          v-decorator="[
            'auditSuggest',
            {
              initialValue: detailInfo.auditSuggest,
              rules: [{ required: true, message: '请选择审核建议' }]
            }
          ]"
        >
          <a-radio-button :value="item.key" v-for="item in list" :key="item.key">
            {{ item.val }}
          </a-radio-button>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="责任人" v-bind="formItemLayout" required>
        <div>
          <template v-for="tag in userList">
            <a-tag :key="tag.userCode" :closable="true" :afterClose="() => userClose(tag)">
              {{ tag.userName }}
            </a-tag>
          </template>
          <a-tag v-if="userList.length === 0" style="background: #fff; borderStyle: dashed;" @click="addTag" > <a-icon type="plus" />添加 </a-tag>
        </div>
      </a-form-item>
      <a-form-item label="建议检查频次" v-bind="formItemLayout" required>
        <a-input-number
          :disabled="auditStatus !== '1'"
          :min="1"
          v-decorator="[
            'frequency',
            { initialValue: detailInfo.frequency, rules: [{ required: true, message: '请输入' }]}
          ]" />
        <a-select
          style="width:50%;margin-left:20px"
          :disabled="auditStatus !== '1'"
          v-decorator="[
            'frequencyUnit',
            { initialValue: detailInfo.frequencyUnit, rules: [{ required: true, message: '请选择' }]}
          ]"
        >
          <a-select-option v-for="work in numList" :value="work.key" :key="work.key">
            {{ work.val }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="L(可能性)" v-bind="formItemLayout" v-if="methodCode === '1' && detailInfo.auditSuggest === '2'">
        <a-select
          v-decorator="[
            'remainingLValue',
            { initialValue: detailInfo.remainingLValue, rules: [{ required: true, message: '请选择' }] }
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
      <a-form-item label="E(频繁程度)" v-bind="formItemLayout" v-if="methodCode === '1' && detailInfo.auditSuggest === '2'">
        <a-select
          v-decorator="[
            'remainingEValue',
            { initialValue: detailInfo.remainingEValue, rules: [{ required: true, message: '请选择' }] }
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
      <a-form-item label="C(严重性)" v-bind="formItemLayout" v-if="methodCode === '1' && detailInfo.auditSuggest === '2'">
        <a-select
          v-decorator="[
            'remainingCValue',
            { initialValue: detailInfo.remainingCValue, rules: [{ required: true, message: '请选择' }] }
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
          风险值：{{ remainInfo.grade }}    风险等级：{{ remainInfo.level }}      安全色：{{ remainInfo.color }}
        </div>
      </a-form-item>
      <a-form-item label="L(可能性)" v-bind="formItemLayout" v-if="methodCode === '2' && detailInfo.auditSuggest === '2'">
        <a-select
          v-decorator="[
            'remainingLValue',
            { initialValue: detailInfo.remainingLValue, rules: [{ required: true, message: '请选择' }] }
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
      <a-form-item label="S(严重性)" v-bind="formItemLayout" v-if="methodCode === '2' && detailInfo.auditSuggest === '2'">
        <a-select
          v-decorator="[
            'remainingSValue',
            { initialValue: detailInfo.remainingSValue, rules: [{ required: true, message: '请选择' }] }
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
          风险值：{{ remainInfo.grade }}    风险等级：{{ remainInfo.level }}      安全色：{{ remainInfo.color }}
        </div>
      </a-form-item>
    </a-form>
    <choose-post
      ref="choosePost"
      is-radio
      :userList="userList"
      v-if="userTag"
      v-model="userTag"
      @submit="choosePost"
      title="添加成员"
    ></choose-post>
  </a-modal>
</template>

<script>
import ChoosePost from '@c/choose/ChoosePost'
import { mapState, mapActions } from 'vuex'
import assess from '../assets/js/table/assess'
export default {
  name: 'ChooseEquip',
  components: {
    ChoosePost
  },
  computed: {
    ...mapState('home', ['schoolCode', 'userInfo']),
    status: {
      get() {
        return this.value
      },
      set() {
        this.$emit('input', false)
      }
    }
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    methodCode: {
      type: String,
      required: true
    },
    auditStatus: {
      type: String,
      required: true
    },
    id: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      assess,
      form: this.$form.createForm(this),
      formItemLayout: {
        labelCol: { span: 3 },
        wrapperCol: { span: 16 }
      },
      userTag: false,
      confirmLoading: false,
      list: [
        {
          key: '1',
          val: '审核通过'
        }, {
          key: '2',
          val: '审核不通过'
        }
      ],
      numList: [
        {
          key: '1',
          val: '次/天'
        }, {
          key: '2',
          val: '次/周'
        }, {
          key: '3',
          val: '次/月'
        }
      ],
      userList: [],
      detailInfo: {
        auditSuggest: '1',
        frequencyUnit: '1'
      },
      isLoad: false,
      remainInfo: {},
      lValue: '',
      cValue: '',
      eValue: '',
      sValue: '',
      lslValue: ''
    }
  },
  watch: {
    lValue(newVal, oldVal) {
      if (newVal !== oldVal) {
        this._lecRisk()
      }
    },
    cValue(newVal, oldVal) {
      if (newVal !== oldVal) {
        this._lecRisk()
      }
    },
    eValue(newVal, oldVal) {
      if (newVal !== oldVal) {
        this._lecRisk()
      }
    },
    sValue(newVal, oldVal) {
      if (newVal !== oldVal) {
        this._lsRisk()
      }
    },
    lslValue(newVal, oldVal) {
      if (newVal !== oldVal) {
        this._lsRisk()
      }
    }
  },
  mounted() {
    if (this.auditStatus === '1') {
      this.assess.dataSource = this.assess.dataSource.map(el => {
        return {
          ...el,
          reason: ''
        }
      })
    } else {
      this.isLoad = true
      this._auditRiskDetail()
    }
  },
  methods: {
    ...mapActions('home', ['auditRisk', 'auditRiskDetail', 'lecRisk', 'lsRisk']),
    async _lecRisk (type) {
      if (this.cValue && this.eValue && this.lValue) {
        const req = {
          cValue: this.cValue,
          eValue: this.eValue,
          lValue: this.lValue
        }
        const res = await this.lecRisk(req)
        this.remainInfo = res.data
      }
    },
    async _lsRisk (type) {
      if (this.lslValue && this.sValue) {
        const req = {
          lValue: this.lslValue,
          sValue: this.sValue
        }
        const res = await this.lsRisk(req)
        this.remainInfo = res.data
      }
    },
    async _auditRiskDetail () {
      const res = await this.auditRiskDetail(this.id)
      this.remainInfo = res.data.remainingRiskIndex
      this.detailInfo = res.data
      this.detailInfo.auditSuggest = res.data.auditSuggest ? '1' : '2'
      this.userList = [{ userName: res.data.auditDutyName, userCode: res.data.auditDutyCode }]
      this.assess.dataSource = this.assess.dataSource.map((el, index) => {
        return {
          ...el,
          reason: res.data[`falseReason${[index + 1]}`],
          checkObject: res.data[`auditJudge${[index + 1]}`]
        }
      })
    },
    change(e) {
      this.detailInfo.auditSuggest = e.target.value
    },
    choosePost(list) {
      this.userList = list
      this.$refs.choosePost.reset()
    },
    addTag(type) {
      this.active = type
      this.userTag = true
    },
    userClose(removedTag) {
      if (this.auditStatus === '1') {
        this.userList = this.userList.filter(tag => tag !== removedTag)
      }
    },
    submitOk(e) {
      e.preventDefault()
      this.form.validateFields((error, values) => {
        if (!error) {
          if (this.userList.length === 0) {
            this.$message.warning('请选择责任人')
            return false
          }
          this.assess.dataSource.forEach((el, index) => {
            values[`auditJudge${[index + 1]}`] = el.checkObject
            values[`falseReason${[index + 1]}`] = el.reason
          })
          values.auditSuggest = this.detailInfo.auditSuggest === '1'
          values.auditDutyCode = this.userList[0].userCode
          values.auditDutyName = this.userList[0].userName
          values.id = this.id
          this.confirmLoading = true
          this.auditRisk(values)
            .then((res) => {
              this.$message.success('操作成功')
              this.$tools.goNext(() => {
                this.$emit('updata')
              })
            })
            .catch((res) => {
              this.confirmLoading = false
            })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
/deep/ .ant-table-body .ant-table-thead .ant-table-row-cell-break-word {
  background-color: #9698d6!important;
  color: #fff;
}
.ant-input {
  background-color: #f4f7fc!important;
}
 .tip {
    height: 15px;
  }
</style>
