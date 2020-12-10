<template>
  <div>
    <slot name="tips"></slot>
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
        <!--数字文本框-->
        <a-form-item v-bind="formItemLayout" :label="item.label" v-if="item.type === 'numberInput'">
          <a-input-number
            style="width: 100%"
            :placeholder="item.placeholder"
            :read-only="item.readonly"
            :disabled="item.disabled"
            :min="item.min"
            :max="item.max"
            v-decorator="[
              item.value,
              {
                initialValue: item.initValue + '',
                rules: [{ required: !item.hasOwnProperty('required') || item.required, message: item.placeholder }]
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
                rules: [{ required: !item.hasOwnProperty('required') || item.required, message: item.placeholder }]
              }
            ]"
          >
            <a-radio-button :value="list.key" v-for="(list, ind) in item.list" :key="ind">
              {{ list.val }}
            </a-radio-button>
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
                rules: [{ required: !item.hasOwnProperty('required') || item.required, message: item.placeholder }]
              }
            ]"
            style="width: 100%;margin-top: 8px;"
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
                rules: [{ required: !item.hasOwnProperty('required') || item.required, message: item.placeholder }]
              }
            ]"
            :placeholder="item.placeholder"
          >
            <a-select-option v-for="(item2, index2) in item.list" :value="item2.key" :key="index2">
              {{ item2.val }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <!--上传图片-->
        <a-form-item
          v-bind="formItemLayout"
          :label="item.label"
          :required="!item.hasOwnProperty('required') || item.required"
          v-if="item.type === 'upload'"
        >
          <slot name="upload"></slot>
        </a-form-item>
        <!--单个日期-->
        <a-form-item v-bind="formItemLayout" :label="item.label" v-if="item.type === 'singleTime'">
          <a-date-picker
            v-decorator="[
              item.value,
              {
                initialValue: moment(item.initValue || new Date(), 'YYYY-MM-DD'),
                rules: [{ required: !item.hasOwnProperty('required') || item.required, message: item.placeholder }]
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
                rules: [{ required: !item.hasOwnProperty('required') || item.required, message: item.placeholder }]
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
      </div>
      <a-form-item v-bind="formItemLayout" :style="{ textAlign: 'center' }">
        <a-button @click="cancel(query)">取消</a-button>
        <a-button class="mar-l10" type="primary" @click="submitOk">保存</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  name: 'SubmitForm',
  components: {},
  props: {
    value: {
      type: Boolean,
      default: false
    },
    formData: {
      type: Array,
      default: () => {
        return []
      }
    },
    query: {
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
        card: /^[a-zA-Z0-9_]+$/,
        password: /^[a-zA-Z0-9_]+$/,
        url: /^(((ht|f)tps?):\/\/)?[\w-]+(\.[\w-]+)+([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/,
        file: /\//,
        ip: /^((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){3}$/,
        phone: /^(?:(?:\+|00)86)?1[3-9]\d{9}$/,
        email: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
      },
      moment,
      confirmLoading: false,
      form: this.$form.createForm(this),
      formItemLayout: {
        labelCol: { span: 6 },
        wrapperCol: { span: 16 }
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
    cancel() {
      this.$router.push({
        name: this.query.name,
        query: this.query.query
      })
    },
    submitOk(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          for (const key in values) {
            if (values[key]._f === 'HH:mm') {
              values[key] = moment(values[key]).format('HH:mm')
            }
            if (values[key]._f === 'YYYY-MM-DD') {
              values[key] = moment(values[key]).format('YYYY-MM-DD')
            }
            if (values[key] instanceof Array && values[key][0]._isAMomentObject) {
              values[key] = [moment(values[key][0]).format('YYYY-MM-DD'), moment(values[key][1]).format('YYYY-MM-DD')]
            }
          }
          this.confirmLoading = true
          this.$emit('submit-form', values)
        }
      })
    }
  }
}
</script>

<style lang="less" scoped></style>
