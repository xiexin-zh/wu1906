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
      <div v-for="(item, index) in useFormData" :key="index">
        <!--标题栏-->
        <a-form-item v-bind="formItemLayout" v-if="item.type === 'title'">
          <span class="form-title">{{ item.title }}</span>
        </a-form-item>
        <!--分割线-->
        <a-form-item v-if="item.type === 'line'">
          <div class="line"></div>
        </a-form-item>
        <!--文本框-->
        <a-form-item v-bind="formItemLayout" :label="item.label" v-if="item.type === 'input'">
          <a-input
            :placeholder="item.placeholder"
            :read-only="item.readonly"
            :disabled="item.disabled"
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
        <!--数字框-->
        <a-form-item v-bind="formItemLayout" :label="item.label" v-if="item.type === 'number'">
          <a-input-number
            style="width:100%"
            :placeholder="item.placeholder"
            :read-only="item.readonly"
            :disabled="item.disabled"
            :min="1"
            :max="item.max"
            v-decorator="[
              item.value,
              {
                initialValue: item.initValue,
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
            <a-radio :value="list.key" v-for="(list, ind) in item.list" :key="ind">{{ list.val }}</a-radio>
          </a-radio-group>
        </a-form-item>
        <!--选择框-->
        <a-form-item v-bind="formItemLayout" :label="item.label" v-if="item.type === 'select'">
          <a-select
            :read-only="item.readonly"
            :disabled="item.disabled"
            v-decorator="[
              item.value,
              {
                initialValue: item.initValue,
                rules: [{ required: !item.hasOwnProperty('required') || item.required, message: item.placeholder }]
              }
            ]"
            :placeholder="item.placeholder"
          >
            <a-select-option
              v-for="(item2, index2) in item.list"
              :value="item2.key"
              :key="index2"
            >{{ item2.val }}</a-select-option>
          </a-select>
        </a-form-item>
        <!--教室选择-->
        <a-form-item v-bind="formItemLayout" :label="item.label" v-if="item.type === 'siteChoose'">
          <a-cascader
            :options="buildList"
            @change="onChange"
            @click.stop="onFocus"
            :loadData="loadData"
            :placeholder="item.placeholder"
            v-decorator="[
              item.value,
              {
                initialValue: item.initValue,
                rules: [{ required: !item.hasOwnProperty('required') || item.required, message: item.placeholder }]
              }
            ]"
            changeOnSelect
          />
        </a-form-item>
        <!--组织机构选择-->
        <a-form-item v-bind="formItemLayout" :label="item.label" v-if="item.type === 'orgChoose'">
          <a-cascader
            :options="orgList"
            @change="orgChange"
            @click.stop="orgFocus"
            :placeholder="item.placeholder"
            v-decorator="[
              item.value,
              {
                initialValue: item.initValue,
                rules: [{ required: !item.hasOwnProperty('required') || item.required, message: item.placeholder }]
              }
            ]"
            changeOnSelect
          />
        </a-form-item>
        <!--联动选择框-->
        <a-form-item v-bind="formItemLayout" :label="item.label" v-if="item.type === 'linkSelect'">
          <a-select
            :read-only="item.readonly"
            :disabled="item.disabled"
            allowClear
            v-decorator="[
              item.value1,
              {
                initialValue: item.initValue1,
                rules: [{ required: !item.hasOwnProperty('required') || item.required, message: item.placeholder1 }]
              }
            ]"
            style="width: calc(50% - 10px);margin-right:10px;"
            :placeholder="item.placeholder1"
            @change="item.firstChange"
          >
            <a-select-option v-for="(first, i) in item.firstList" :key="i">{{ first.val }}</a-select-option>
          </a-select>
          <a-select
            allowClear
            style="width:50%"
            :placeholder="item.placeholder2"
            @change="item.secondChange"
            :disabled="item.disabled"
            v-decorator="[
              item.value2,
              {
                initialValue: item.initValue2,
                rules: [{ required: !item.hasOwnProperty('required') || item.required, message: item.placeholder1 }]
              }
            ]"
          >
            <a-select-option v-for="(second, i) in item.secondList" :key="i">{{ second.val }}</a-select-option>
          </a-select>
        </a-form-item>
        <!--单个日期-->
        <a-form-item v-bind="formItemLayout" :label="item.label" v-if="item.type === 'singleTime'">
          <a-date-picker
            :showToday="false"
            :allowClear="false"
            v-decorator="[
              item.value,
              {
                initialValue: moment(item.initValue || new Date(), 'YYYY-MM-DD'),
                rules: [{ required: !item.hasOwnProperty('required') || item.required, message: item.placeholder }]
              }
            ]"
          />
        </a-form-item>
        <!--上传图片-->
        <a-form-item
          v-bind="formItemLayout"
          :label="item.label"
          v-if="item.type === 'upload'"
          :required="!item.hasOwnProperty('required') || item.required"
        >
          <slot name="upload"></slot>
        </a-form-item>
      </div>
    </a-form>
  </a-modal>
</template>

<script>
import moment from 'moment'
import { InputNumber } from 'ant-design-vue'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'SubmitForm',
  components: {
    [InputNumber.name]: InputNumber
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    value: {
      type: Boolean,
      default: false
    },
    formData: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  computed: {
    ...mapState('home', ['userInfo']),
    status: {
      get() {
        return this.value
      },
      set() {
        this.$emit('input', false)
      }
    },
    useFormData: function() {
      return this.formData.filter(function(item) {
        return !item.hasOwnProperty('show') || item.show
      })
    }
  },
  data() {
    return {
      rules: {
        idCard: /^[1-9]\d{5}(18|19|20|(3\d))\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
        ip: /^((([0-9A-Fa-f]{1,4}:){7}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){6}:[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){5}:([0-9A-Fa-f]{1,4}:)?[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){4}:([0-9A-Fa-f]{1,4}:){0,2}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){3}:([0-9A-Fa-f]{1,4}:){0,3}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){2}:([0-9A-Fa-f]{1,4}:){0,4}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){6}((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|(([0-9A-Fa-f]{1,4}:){0,5}:((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|(::([0-9A-Fa-f]{1,4}:){0,5}((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|([0-9A-Fa-f]{1,4}::([0-9A-Fa-f]{1,4}:){0,5}[0-9A-Fa-f]{1,4})|(::([0-9A-Fa-f]{1,4}:){0,6}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){1,7}:))$/i,
        phone: /^(?:(?:\+|00)86)?1[3-9]\d{9}$/,
        email: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
      },
      moment,
      confirmLoading: false,
      form: this.$form.createForm(this),
      formItemLayout: {
        labelCol: { span: 4 },
        wrapperCol: { span: 20 }
      },
      buildList: [],
      orgList: [],
      type: 1,
      chooseSite: '',
      chooseOrg: '',
      chooseName: ''
    }
  },
  mounted() {
    this.orgFocus()
  },
  methods: {
    ...mapActions('home', [
      'getSiteList',
      'getSiteById',
      'getChildSite',
      'getOrgList',
      'getOrgBySchool'
    ]),
    reset() {
      this.confirmLoading = false
      this.$emit('input', false)
    },
    error() {
      this.confirmLoading = false
    },
    onChange(value, selectedOptions) {
      this.chooseSite = ''
      if (selectedOptions) {
        this.chooseSite += selectedOptions.map(ele => {
          return ele.label
        })
      }
      this.$emit('classRoom', this.chooseSite.split(',').join('-'))
    },
    async onFocus(value) {
      this.buildList = []
      const req = {
        name: '',
        schoolCode: this.userInfo.schoolCode,
        type: this.type
      }
      const res = await this.getSiteList(req)
      this.buildList = res.data
      this.buildList.forEach(el => {
        el.label = el.name
        el.value = el.id
        el.isLeaf = false
      })
    },
    loadData(selectedOptions) {
      const targetOption = selectedOptions[selectedOptions.length - 1]
      targetOption.loading = true
      const req = {
        parentId: targetOption.id,
        schoolCode: this.userInfo.schoolCode
      }
      this.getChildSite(req).then(res => {
        targetOption.loading = false
        targetOption.children = res.data.list
        // 处理第三层没有子节点的情况
        targetOption.children.forEach(el => {
          el.label = el.name + (el.type === '2' ? '楼' : '')
          el.value = el.id
          el.isLeaf = el.type === '3'
        })
        this.buildList = [...this.buildList]
      })
    },
    orgChange(value, selectedOptions) {
      this.chooseOrg = ''
      this.chooseName = ''
      console.log(selectedOptions)
      if (selectedOptions) {
        this.chooseOrg += selectedOptions.map(ele => {
          return ele.value
        })
        this.chooseName += selectedOptions.map(ele => {
          return ele.name
        })
        this.$emit('org', this.chooseOrg.split(',').join(','), this.chooseName.split(',').join(','))
      }
    },
    // 深层递归
    newOrgData(data) {
      data.forEach(item => {
        item.children = item.orgChilds || null
        item.label = item.name
        item.value = item.code
        if (item.orgChilds && item.orgChilds.length > 0) {
          this.newOrgData(item.orgChilds)
        }
      })
      return data
    },
    async orgFocus(value) {
      this.orgList = []
      const res = await this.getOrgBySchool(this.userInfo.schoolCode)
      if (res.data.code === '') {
        res.data.code = res.data.schoolCode
      }
      this.orgList = this.newOrgData([res.data])
    },
    submitOk(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          for (const key in values) {
            if (values[key] && values[key]._f === 'HH:mm') {
              values[key] = moment(values[key]).format('HH:mm')
            }
            if (values[key] && values[key]._f === 'YYYY-MM-DD') {
              values[key] = moment(values[key]).format('YYYY-MM-DD')
            }
            if (
              values[key] &&
              values[key] instanceof Array &&
              values[key][0] &&
              values[key][0]._isAMomentObject
            ) {
              values[key] = [
                moment(values[key][0]).format('YYYY-MM-DD'),
                moment(values[key][1]).format('YYYY-MM-DD')
              ]
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

<style lang="less" scoped>
.form-title {
  color: #6882da;
  margin-left: 10px;
  padding-left: 20px;
  border-left: 3px solid #6882da;
  font-size: 16px;
}
.line {
  width: 100%;
  margin-top: 10px;
  height: 1px;
  background-image: linear-gradient(to right, #ccc 0%, #ccc 50%, transparent 50%);
  background-size: 16px 1px;
  background-repeat: repeat-x;
}
/deep/ .ant-form-item {
  margin-bottom: 14px;
}
</style>
