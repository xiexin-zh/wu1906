<template>
  <a-modal
    :width="width + 'px'"
    :title="title"
    v-model="status"
    @ok="submitOk"
    :maskClosable="false"
    :destroyOnClose="true"
    @cancel="reset"
    okText="提交"
    :confirmLoading="confirmLoading"
  >
    <slot name="topTips"></slot>
    <a-form :form="form">
      <div v-for="(item, index) in formData" :key="index">
        <!--文本框-->
        <a-form-item v-bind="formItemLayout" :label="item.label" v-if="item.type === 'input'">
          <a-input
            :placeholder="item.placeholder"
            :read-only="item.readonly"
            :disabled="item.disabled"
            :type="item.password ? 'password' : 'text'"
            v-decorator="[
              item.value,
              {
                initialValue: item.initValue + '',
                rules: [
                  {
                    len: item.len,
                    max: item.max || 100,
                    required: !item.hasOwnProperty('required') || item.required,
                    message: item.placeholder
                  },
                  { pattern: item.regular ? rules[item.regular] : '', message: item.placeholder }
                ]
              }
            ]"
          />
        </a-form-item>
        <!--文本域-->
        <a-form-item v-bind="formItemLayout" :label="item.label" v-if="item.type === 'textarea'">
          <a-textarea
            :placeholder="item.placeholder"
            :read-only="item.readonly"
            :disabled="item.disabled"
            :autoSize="{ minRows: item.minRows, maxRows: item.maxRows }"
            :allowClear="true"
            v-decorator="[
              item.value,
              {
                initialValue: item.initValue + '',
                rules: [
                  {
                    len: item.len,
                    max: item.max || 100,
                    required: !item.hasOwnProperty('required') || item.required,
                    message: item.placeholder
                  },
                  { pattern: item.regular ? rules[item.regular] : '', message: item.placeholder }
                ]
              }
            ]"
          />
        </a-form-item>
        <!--数字文本框-->
        <a-form-item v-bind="formItemLayout" :label="item.label" v-if="item.type === 'numberInput'">
          <a-input-number
            style="width: 100%"
            :placeholder="item.placeholder"
            :read-only="item.readonly"
            :disabled="item.disabled"
            :min="item.min"
            :max="item.max"
            :formatter="item.isInt ? limitNumber : value => value"
            :parser="item.isInt ? limitNumber : value => value"
            v-decorator="[
              item.value,
              {
                initialValue: item.initValue + '',
                rules: [
                  {
                    required: !item.hasOwnProperty('required') || item.required,
                    message: item.placeholder
                  }
                ]
              }
            ]"
          />
        </a-form-item>
        <!--单选框-->
        <a-form-item v-bind="formItemLayout" :label="item.label" v-if="item.type === 'radio'">
          <a-radio-group
            :read-only="item.readonly"
            :disabled="item.disabled"
            buttonStyle="solid"
            v-decorator="[
              item.value,
              {
                initialValue: item.initValue,
                rules: [
                  {
                    required: !item.hasOwnProperty('required') || item.required,
                    message: item.placeholder
                  }
                ]
              }
            ]"
          >
            <a-radio-button
              :value="list.key"
              v-for="(list, ind) in item.list"
              :key="ind"
            >{{ list.val }}</a-radio-button>
          </a-radio-group>
        </a-form-item>
        <!--复选框-->
        <a-form-item v-bind="formItemLayout" :label="item.label" v-if="item.type === 'checkbox'">
          <a-checkbox-group
            :read-only="item.readonly"
            :disabled="item.disabled"
            v-decorator="[
              item.value,
              {
                initialValue: item.initValue,
                rules: [
                  {
                    required: !item.hasOwnProperty('required') || item.required,
                    message: item.placeholder
                  }
                ]
              }
            ]"
            style="width: 100%; margin-top: 8px"
            :placeholder="item.placeholder"
          >
            <a-row>
              <a-col
                :span="24 % item.list.length == 0 ? 24 / item.list.length : parseInt(24 / item.list.length)"
                v-for="(item1, index1) in item.list"
                :key="index1"
              >
                <a-checkbox :value="item1.key">{{ item1.val }}</a-checkbox>
              </a-col>
            </a-row>
          </a-checkbox-group>
        </a-form-item>
        <!--选择框-->
        <a-form-item v-bind="formItemLayout" :label="item.label" v-if="item.type === 'select'">
          <a-select
            :read-only="item.readonly"
            :disabled="item.disabled"
            :mode="item.mode ? 'multiple' : 'default'"
            v-decorator="[
              item.value,
              {
                initialValue: item.initValue,
                rules: [
                  {
                    required: !item.hasOwnProperty('required') || item.required,
                    message: item.placeholder
                  }
                ]
              }
            ]"
            :placeholder="item.placeholder"
          >
            <a-select-option v-for="(item2, index2) in item.list" :value="item2.key" :key="index2">
              {{
                item2.val
              }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <!--上传图片-->
        <a-form-item
          v-bind="formItemLayout"
          :label="item.label"
          :required="!item.hasOwnProperty('required') || item.required"
          v-if="item.type === 'uploadImg'"
        >
          <u-upload
            :is-check="item.isCheck"
            showProgressTag
            type="image"
            :maxSize="10"
            :length="item.length || 5"
            v-model="imgList"
            :schoolCode="schoolCode"
          ></u-upload>
        </a-form-item>
        <!--地区选择-->
        <a-form-item
          v-bind="formItemLayout"
          :label="item.label"
          :required="!item.hasOwnProperty('required') || item.required"
          v-if="item.type === 'area'"
        >
          <u-choose-area
            :disabled="item.disabled"
            :allowClear="item.allowClear"
            v-model="areaList"
            :placeholder="item.initValue"
          ></u-choose-area>
        </a-form-item>
        <!--地区选择-->
        <!--组织机构-->
        <a-form-item
          v-bind="formItemLayout"
          :label="item.label"
          :required="!item.hasOwnProperty('required') || item.required"
          v-if="item.type === 'org'"
        >
          <u-choose-org
            :disabled="item.disabled"
            :allowClear="item.allowClear"
            @choose="chooseOrg"
            v-model="orgList"
            :default-value="item.initValue"
            :school="schoolCode"
          ></u-choose-org>
        </a-form-item>
        <!--组织机构-->
        <!--单个日期-->
        <a-form-item v-bind="formItemLayout" :label="item.label" v-if="item.type === 'singleTime'">
          <a-date-picker
            v-decorator="[
              item.value,
              {
                initialValue: moment(item.initValue || new Date(), 'YYYY-MM-DD'),
                rules: [
                  {
                    required: !item.hasOwnProperty('required') || item.required,
                    message: item.placeholder
                  }
                ]
              }
            ]"
          />
        </a-form-item>
        <!--日期区间-->
        <a-form-item v-bind="formItemLayout" :label="item.label" v-if="item.type === 'rangeTime'">
          <a-range-picker
            style="width: 280px"
            v-decorator="[
              item.value,
              {
                initialValue: [
                  moment(item.initValue[0] || new Date(), 'YYYY-MM-DD'),
                  moment(item.initValue[1] || new Date(), 'YYYY-MM-DD')
                ],
                rules: [
                  {
                    required: !item.hasOwnProperty('required') || item.required,
                    message: item.placeholder
                  }
                ]
              }
            ]"
          />
        </a-form-item>
        <!--时间设置-->
        <a-form-item v-bind="formItemLayout" :label="item.label" v-if="item.type === 'time'">
          <a-time-picker
            format="HH:mm"
            v-decorator="[
              item.value,
              {
                initialValue: moment(item.initValue || '00:00', 'HH:mm'),
                rules: [{ required: item.required, message: item.placeholder }]
              }
            ]"
          />
        </a-form-item>
        <!--带按钮的输入框-->
        <a-form-item
          v-bind="formItemLayout"
          :label="item.label"
          v-if="item.type === 'input-button'"
        >
          <a-input-search
            :placeholder="item.placeholder"
            :read-only="item.readonly"
            :disabled="item.disabled"
            @search="onSearch"
            :type="item.password ? 'password' : 'text'"
            v-decorator="[
              item.value,
              {
                initialValue: item.initValue + '',
                rules: [
                  {
                    len: item.len,
                    max: item.max || 100,
                    required: !item.hasOwnProperty('required') || item.required,
                    message: item.placeholder
                  },
                  { pattern: item.regular ? rules[item.regular] : '', message: item.placeholder }
                ]
              }
            ]"
          >
            <a-button slot="enterButton">{{ item.buttonText }}</a-button>
          </a-input-search>
        </a-form-item>
        <!--自定义插槽功能-->
        <a-form-item
          v-bind="formItemLayout"
          :label="item.label"
          :required="!item.hasOwnProperty('required') || item.required"
          v-if="item.type === 'slotOne'"
        >
          <slot name="slotOne"></slot>
        </a-form-item>
        <a-form-item
          v-bind="formItemLayout"
          :label="item.label"
          :required="!item.hasOwnProperty('required') || item.required"
          v-if="item.type === 'slotTwo'"
        >
          <slot name="slotTwo"></slot>
        </a-form-item>
        <a-form-item
          v-bind="formItemLayout"
          :label="item.label"
          :required="!item.hasOwnProperty('required') || item.required"
          v-if="item.type === 'slotThree'"
        >
          <slot name="slotThree"></slot>
        </a-form-item>
        <a-form-item
          v-bind="formItemLayout"
          :label="item.label"
          :required="!item.hasOwnProperty('required') || item.required"
          v-if="item.type === 'slotFour'"
        >
          <slot name="slotFour"></slot>
        </a-form-item>
        <a-form-item
          v-bind="formItemLayout"
          :label="item.label"
          :required="!item.hasOwnProperty('required') || item.required"
          v-if="item.type === 'slotFive'"
        >
          <slot name="slotFive"></slot>
        </a-form-item>
      </div>
    </a-form>
    <slot name="bottomTips"></slot>
  </a-modal>
</template>

<script>
import moment from 'moment'
export default {
  name: 'USubmitForm',
  components: {},
  props: {
    // 弹出框宽度
    width: {
      type: [Number, String],
      default: '720'
    },
    // 弹出框标题
    title: {
      type: String,
      default: ''
    },
    // 是否显示弹出框
    value: {
      type: Boolean,
      default: false
    },
    // 表单项内容
    formData: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 表单label左侧区域大小
    labelCol: {
      type: Number,
      default: 4
    },
    // 表单右侧区域大小
    wrapperCol: {
      type: Number,
      default: 20
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
  mounted() {},
  data() {
    const imgList = (this.formData.filter(item => item.type === 'uploadImg')[0] || {}).initValue
    const isOrg = this.formData.filter(item => item.type === 'org')[0]
    const isArea = this.formData.filter(item => item.type === 'area')[0]
    return {
      areaList: isArea ? isArea.initValue : [], // 区域
      areaName: isArea ? isArea.initValue : '',
      orgList: isOrg ? isOrg.initValue : [], // 组织机构
      orgName: isOrg ? isOrg.orgName : '', // 组织机构
      imgList: imgList,
      schoolCode: window.sessionStorage.getItem('schoolCode') || '',
      rules: {
        card: /^[a-zA-Z0-9_]+$/,
        // 身份證
        idCard: /^[1-9]\d{5}(18|19|20|(3\d))\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
        // 密码校验
        password: /^[a-zA-Z0-9_]+$/,
        // url地址
        url: /^(((ht|f)tps?):\/\/)?[\w-]+(\.[\w-]+)+([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/,
        // 文件路径
        file: /\//,
        // ip地址
        ip: /^((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){3}$/,
        // 电话号码
        phone: /^(?:(?:\+|00)86)?1[3-9]\d{9}$/,
        // email地址
        email: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
      },
      moment,
      confirmLoading: false,
      form: this.$form.createForm(this),
      formItemLayout: {
        labelCol: { span: this.labelCol },
        wrapperCol: { span: this.wrapperCol }
      }
    }
  },
  methods: {
    reset() {
      this.confirmLoading = false
      this.$emit('input', false)
    },
    error() {
      this.confirmLoading = false
    },
    onSearch(value) {
      this.$emit('onSearch', value)
    },
    /**
     * 选择组织机构回调
     */
    chooseOrg(code, name) {
      this.orgName = name.reduce((prev, curr) => {
        return prev + curr.orgName + ','
      }, '')
    },
    submitOk(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          if (!values) return
          for (const key in values) {
            if (values[key]._f && values[key]._f === 'HH:mm') {
              values[key] = moment(values[key]).format('HH:mm')
            }
            if (values[key]._f && values[key]._f === 'YYYY-MM-DD') {
              values[key] = moment(values[key]).format('YYYY-MM-DD')
            }
            if (values[key] instanceof Array && values[key][0] && values[key][0]._isAMomentObject) {
              values[key] = [moment(values[key][0]).format('YYYY-MM-DD'), moment(values[key][1]).format('YYYY-MM-DD')]
            }
          }
          const isImg = this.formData.filter(item => item.type === 'uploadImg')[0]
          const isArea = this.formData.filter(item => item.type === 'area')[0]
          const isOrg = this.formData.filter(item => item.type === 'org')[0]
          if (isImg) {
            if (isImg.required) {
              if (this.imgList.length === 0) {
                this.$message.warning('请上传图片')
                return
              }
            }
            values[isImg.value] = this.imgList
          }
          if (isArea) {
            if (isArea.required) {
              if (this.areaList.length === 0) {
                this.$message.warning('请选择地区')
                return
              }
            }
            values[isArea.value] = this.areaList
            values.areaName = this.areaName
          }
          if (isOrg) {
            if (isOrg.required) {
              if (this.orgList.length === 0) {
                this.$message.warning('请选择组织机构')
                return
              }
            }
            values[isOrg.value] = this.orgList
            values.orgName = this.orgName
          }
          this.confirmLoading = true
          this.$emit('submit', values)
        }
      })
    },
    // 数字输入框只允许输入整数
    limitNumber(value) {
      if (typeof value === 'string') {
        return !isNaN(Number(value)) ? value.replace(/\./g, '') : 0
      } else if (typeof value === 'number') {
        return !isNaN(value) ? String(value).replace(/\./g, '') : 0
      } else {
        return 0
      }
    }
  }
}
</script>

<style lang="less" scoped></style>
