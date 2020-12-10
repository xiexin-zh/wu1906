<template>
  <a-modal
    width="650px"
    :title="title"
    v-model="status"
    @ok="submitOk"
    :maskClosable="false"
    :destroyOnClose="true"
    okText="提交"
    :confirmLoading="confirmLoading"
  >
    <a-form :form="form">
      <a-form-item label="设备名称" v-bind="formItemLayout">
        <a-input
          placeholder="请输入设备名称"
          v-decorator="[
            'deviceName',
            { initialValue: deviceInfo.deviceName, rules: [{ required: true, message: '请输入设备名称' }] }
          ]"
        />
      </a-form-item>
      <a-form-item label="设备类型" v-bind="formItemLayout">
        <a-select
          @change="changeType"
          v-decorator="[
            'deviceType',
            { initialValue: deviceInfo.deviceType, rules: [{ required: true, message: '请选择设备类型' }] }
          ]"
          placeholder="请选择设备类型"
        >
          <a-select-option :value="1">网络相机</a-select-option>
          <a-select-option :value="2">面板机</a-select-option>
          <a-select-option :value="3">班牌</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="设备SN码" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
        <a-row>
          <a-col :span="22">
            <a-input
              :disabled="isSn"
              placeholder="请输入设备SN码"
              v-decorator="[
                'deviceSn',
                { initialValue: deviceInfo.deviceSn, rules: [{ required: false, message: '请输入设备SN码' }] }
              ]"
            />
          </a-col>
          <a-col :span="2">
            <a-tooltip placement="topLeft">
              <template slot="title">
                <span>SN码不填时会自动生成</span>
              </template>
              <a-icon type="exclamation-circle" style="color: #999; margin-left: 15px" />
            </a-tooltip>
          </a-col>
        </a-row>
      </a-form-item>
      <a-form-item label="IP地址" v-bind="formItemLayout">
        <a-input
          placeholder="请输入IP地址"
          v-decorator="[
            'deviceIp',
            {
              initialValue: deviceInfo.deviceIp,
              rules: [
                { required: true, message: '请输入正确的ip地址' },
                { pattern: rules['ip'], message: '请输入正确的ip地址' }
              ]
            }
          ]"
        />
      </a-form-item>
      <a-form-item label="阈值" v-bind="formItemLayout">
        <a-input-number
          type="numberInput"
          style="width: 500px"
          placeholder="请输入60-99范围的识别阈值"
          :min="60"
          :max="99"
          v-decorator="[
            'threshold',
            {
              initialValue: deviceInfo.threshold,
              rules: [{ required: true, message: '请输入60-99范围的识别阈值' }]
            }
          ]"
        />
      </a-form-item>
      <a-form-item label="安装位置" v-bind="formItemLayout">
        <a-input
          placeholder="请输入安装位置"
          v-decorator="[
            'snapSite',
            { initialValue: deviceInfo.snapSite, rules: [{ required: true, message: '请输入安装位置' }] }
          ]"
        />
      </a-form-item>
      <a-form-item label="进出类型" v-bind="formItemLayout">
        <a-radio-group
          @change="changeInOrOut"
          v-decorator="[
            'inOrOut',
            {
              initialValue: deviceInfo.inOrOut,
              rules: [{ required: inOrOut === 1, message: '请选择进出类型' }]
            }
          ]"
        >
          <a-radio :value="1">进</a-radio>
          <a-radio :value="2">出</a-radio>
          <a-radio :value="3">无</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item v-if="deviceType === 1" label="协议类型" v-bind="formItemLayout">
        <a-radio-group
          @change="changeProtocol"
          v-decorator="[
            'protocolType',
            {
              initialValue: deviceInfo.protocolType,
              rules: [{ required: deviceType === 1, message: '请选择协议类型' }]
            }
          ]"
        >
          <a-radio :value="1">rtsp</a-radio>
          <a-radio :value="2">onvif</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item
        v-if="deviceType === 1 && protocolType === 1"
        label="请求路径"
        v-bind="formItemLayout"
      >
        <a-input
          placeholder="请输入请求路径"
          v-decorator="[
            'rtspUrl',
            { initialValue: deviceInfo.rtspUrl, rules: [{ required: deviceType === 1, message: '请输入请求路径' }] }
          ]"
        />
      </a-form-item>
      <a-form-item
        v-if="deviceType === 1 && protocolType === 2"
        label="安全账号"
        v-bind="formItemLayout"
      >
        <a-input
          placeholder="请输入安全账号"
          v-decorator="[
            'account',
            {
              initialValue: deviceInfo.account,
              rules: [{ required: deviceType === 1 && protocolType === 2, message: '请输入安全账号' }]
            }
          ]"
        />
      </a-form-item>
      <a-form-item
        v-if="deviceType === 1 && protocolType === 2"
        label="请求密码"
        v-bind="formItemLayout"
      >
        <a-input
          placeholder="请输入请求密码"
          v-decorator="[
            'pwd',
            {
              initialValue: deviceInfo.pwd,
              rules: [{ required: deviceType === 1 && protocolType === 2, message: '请输入请求密码' }]
            }
          ]"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import moment from 'moment'
export default {
  name: 'AddDevice',
  components: {},
  props: {
    isSn: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    value: {
      type: Boolean,
      default: false
    },
    deviceInfo: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  computed: {
    status: {
      get() {
        return this.value
      },
      set() {
        this.$emit('input', false)
      }
    }
  },
  data() {
    return {
      rules: {
        ip: /^((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){3}$/
      },
      formData: {
        account: '',
        // 'bindStatus': 0,
        deviceIp: '',
        deviceName: '',
        deviceSn: '',
        // 'deviceStatus': 0,
        deviceType: '',
        ext1: '',
        protocolType: '',
        pwd: '',
        remarks: '',
        rtspUrl: '',
        schoolCode: '',
        snapSite: ''
      },
      inOrOut: this.deviceInfo.inOrOut || '',
      deviceType: this.deviceInfo.deviceType || '',
      protocolType: this.deviceInfo.protocolType || '',
      moment,
      confirmLoading: false,
      form: this.$form.createForm(this),
      formItemLayout: {
        labelCol: { span: 4 },
        wrapperCol: { span: 20 }
      }
    }
  },
  mounted() {},
  methods: {
    reset() {
      this.confirmLoading = false
      this.$emit('input', false)
    },
    error() {
      this.confirmLoading = false
    },
    changeType(value) {
      this.deviceType = value
    },
    changeProtocol(event) {
      this.protocolType = event.target.value
    },
    changeInOrOut(event) {
      this.inOrOut = event.target.value
    },
    submitOk(e) {
      console.log(e)
      e.preventDefault()
      this.form.validateFields((err, values) => {
        console.log(err, values)
        if (!err) {
          this.confirmLoading = true
          this.$emit('submit-form', {
            ...this.formData,
            ...values
          })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped></style>
