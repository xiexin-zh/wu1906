<template>
  <div class="search-form">
    <a-row type="flex" justify="space-between" align="middle">
      <a-col :span="breakLine ? 12 : 'auto'">
        <slot name="left"></slot>
      </a-col>
      <a-col :class="['u-fx u-fx-ac u-fx-je', { 'u-space-pt': breakLine }]">
        <a-form :form="form" layout="inline" class="u-fx">
          <div v-for="(item, index) in searchLabel" :key="index">
            <!--下拉选择文本框-->
            <a-form-item v-if="item.type === 'selectInput'">
              <a-input
                :placeholder="item.placeholder"
                style="width: 200px"
                v-decorator="[
                  item.value,
                  {
                    rules: [{ required: false, message: item.placeholder || '请输入' }]
                  }
                ]"
              >
                <a-select
                  slot="addonBefore"
                  v-decorator="['prefix', { initialValue: item.selectType[0].val }]"
                  style="min-width: 70px"
                >
                  <a-select-option
                    :value="list.val"
                    v-for="(list, index1) in item.selectType"
                    :key="index1"
                  >{{ list.val }}</a-select-option>
                </a-select>
              </a-input>
            </a-form-item>
            <!--下拉选择文本框-->
            <!--文本框-->
            <a-form-item :label="item.label" v-if="item.type === 'input'">
              <a-input
                :placeholder="item.placeholder"
                :style="item.style || 'width: 120px'"
                v-decorator="[
                  item.value,
                  { rules: [{ required: false, message: item.placeholder || '请输入' }] }
                ]"
              />
            </a-form-item>
            <!--选择框-->
            <a-form-item :label="item.label" v-if="item.type === 'select'">
              <a-select
                @change="item.selectChange"
                v-decorator="[
                  item.value,
                  {
                    initialValue: item.initValue,
                    rules: [{ required: false, message: item.placeholder }]
                  }
                ]"
                :style="item.style || 'width: 120px'"
                :placeholder="item.placeholder || '全部'"
              >
                <a-select-option
                  v-for="(item2, index2) in item.list"
                  :value="item2.key"
                  :key="index2"
                >{{ item2.val }}</a-select-option>
              </a-select>
            </a-form-item>
            <!--单选日期-->
            <a-form-item :label="item.label" v-if="item.type === 'singleTime'">
              <a-date-picker
                v-decorator="[
                  item.value,
                  {
                    initialValue: item.initialValue
                      ? moment(item.initValue || new Date(), 'YYYY-MM-DD')
                      : '',
                    rules: [{ required: false, message: item.placeholder }]
                  }
                ]"
              />
            </a-form-item>
            <!--复选日期-->
            <a-form-item :label="item.label" v-if="item.type === 'rangeTime'">
              <a-range-picker
                style="width: 280px"
                v-decorator="[
                  item.value,
                  {
                    initialValue: item.initValue,
                    rules: [{ required: false, message: item.placeholder }]
                  }
                ]"
              />
            </a-form-item>
            <!--选择地区-->
            <a-form-item :label="item.label" v-if="item.type === 'area'">
              <u-choose-area :key="areaKey" v-model="areaList"></u-choose-area>
            </a-form-item>
          </div>
          <!--地区选择-->
          <slot name="area"></slot>
          <!--场地选择-->
          <slot name="place"></slot>
        </a-form>
        <u-button type="light" @click="searchBtn">搜索</u-button>
        <u-button v-if="isReset" type="default" @click="resetBtn">重置</u-button>
        <slot name="right"></slot>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  name: 'SearchForm',
  props: {
    // 是否需要重置按钮
    isReset: {
      type: Boolean,
      required: false,
      default: true
    },
    // 搜索表单项
    searchLabel: {
      type: Array,
      required: false,
      default: () => {
        return []
      }
    },
    // 按钮和表单搜索是否换行显示
    breakLine: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data() {
    return {
      moment,
      areaKey: 0,
      areaList: [],
      form: this.$form.createForm(this)
    }
  },
  methods: {
    resetBtn() {
      this.areaList = []
      this.areaKey++
      this.form.resetFields()
      this.$emit('reset')
      this.searchBtn()
    },
    searchBtn(e) {
      if (e) e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          for (const key in values) {
            if (Object.prototype.toString.call(values[key]) === '[object Object]' && values[key]._isAMomentObject) {
              values[key] = moment(values[key]).format('YYYY-MM-DD')
            }
            if (values[key] instanceof Array && values[key].length === 0) {
              values[key] = ''
            }
            if (values[key] instanceof Array && values[key][0]._isAMomentObject) {
              values[key] = [moment(values[key][0]).format('YYYY-MM-DD'), moment(values[key][1]).format('YYYY-MM-DD')]
            }
            if (typeof values[key] === 'undefined' || values[key] === null) values[key] = ''
          }
          delete values.prefix
          if (this.$parent.pageList) {
            this.$parent.pageList.page = 1
          }
          if (this.$parent.$parent.pageList) {
            this.$parent.$parent.pageList.page = 1
          }
          const isArea = this.searchLabel.filter(item => item.type === 'area')[0]
          if (isArea) {
            values.areaList = this.areaList
          }
          this.$emit('search', values)
        }
      })
    }
  }
}
</script>
