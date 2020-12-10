<template>
  <a-modal
    width="900px"
    :title="title"
    v-model="status"
    @ok="submitOk"
    :maskClosable="false"
    :destroyOnClose="true"
    okText="提交"
    :confirmLoading="confirmLoading"
  >
    <a-form :form="form">
      <a-form-item v-bind="formItemLayout" label="学校名称" >
        <a-input
          placeholder="请输入学校名称"
          v-decorator="[
            'schoolName',
            { initialValue: appForm.schoolName, rules: [ {required: true, message: '请输入学校名称' } ]}
          ]"
        />
      </a-form-item>
      <a-form-item v-bind="formItemLayout" label="学校编码" >
        <a-input
          :disabled="disabled"
          placeholder="请输入学校编码"
          v-decorator="[
            'schoolCode',
            { initialValue: appForm.schoolCode, rules: [ { required: true, message: '请输入学校编码' } ]}
          ]"
        />
      </a-form-item>
      <!--复选框-->
      <a-form-item v-bind="formItemLayout" label="学段" required>
        <a-checkbox-group v-model="checkedList" :disabled="disabled" @change="periodChange">
          <div class="qui-fx">
            <div class="qui-fx mar-b10">
              <div style="width:80px">
                <a-checkbox :style="radioStyle" :value="nursery"> 幼儿园 </a-checkbox>
              </div>
              <div style="width:200px">
                <a-select v-model="nurserySystem" :disabled="disabled">
                  <a-select-option v-for="item in middleList" :key="item.key">{{ item.value }}</a-select-option>
                </a-select>
              </div>
            </div>
            <div class="qui-fx mar-b10 u-mar-l20">
              <div style="width:80px">
                <a-checkbox :style="radioStyle" :value="primary"> 小学 </a-checkbox>
              </div>
              <div style="width:200px">
                <a-select v-model="primarySystem" :disabled="disabled">
                  <a-select-option v-for="item in primaryList" :key="item.key">{{ item.value }}</a-select-option>
                </a-select>
              </div>
            </div>
          </div>
          <div class="qui-fx">
            <div class="qui-fx mar-b10">
              <div style="width:80px">
                <a-checkbox :style="radioStyle" :value="middle"> 初中 </a-checkbox>
              </div>
              <div style="width:200px">
                <a-select v-model="middleSystem" :disabled="disabled">
                  <a-select-option v-for="item in middleList" :key="item.key">{{ item.value }}</a-select-option>
                </a-select>
              </div>
            </div>
            <div class="qui-fx u-mar-l20">
              <div style="width:80px">
                <a-checkbox :style="radioStyle" :value="high"> 高中 </a-checkbox>
              </div>
              <div style="width:200px">
                <a-select v-model="highSystem" :disabled="disabled">
                  <a-select-option v-for="item in highList" :key="item.key">{{ item.value }}</a-select-option>
                </a-select>
              </div>
            </div>
          </div>
          <div class="qui-fx">
            <div class="qui-fx">
              <div style="width:80px">
                <a-checkbox :style="radioStyle" :value="secondVocational"> 中职 </a-checkbox>
              </div>
              <div style="width:200px">
                <a-select v-model="secondVocationalSystem" :disabled="disabled">
                  <a-select-option v-for="item in secondVocationalList" :key="item.key">{{ item.value }}</a-select-option>
                </a-select>
              </div>
            </div>
            <div class="qui-fx u-mar-l20">
              <div style="width:80px">
                <a-checkbox :style="radioStyle" :value="college"> 高校 </a-checkbox>
              </div>
              <div style="width:200px">
                <a-select v-model="collegeSystem" :disabled="disabled">
                  <a-select-option v-for="item in collegeList" :key="item.key">{{ item.value }}</a-select-option>
                </a-select>
              </div>
            </div>
          </div>
        </a-checkbox-group>
      </a-form-item>
      <a-form-item v-bind="formItemLayout" label="学校类型">
        <a-radio-group
          disabled
          button-style="solid"
          v-decorator="[
            'schoolType',
            { initialValue: appForm.schoolType }
          ]">
          <a-radio-button value="7"> 幼儿园 </a-radio-button>
          <a-radio-button value="1"> 小学 </a-radio-button>
          <a-radio-button value="2"> 初中 </a-radio-button>
          <a-radio-button value="3"> 高中 </a-radio-button>
          <a-radio-button value="4"> 九年制 </a-radio-button>
          <a-radio-button value="6"> 十二年制 </a-radio-button>
          <a-radio-button value="5"> 完全中学 </a-radio-button>
          <a-radio-button value="8"> 中职 </a-radio-button>
          <a-radio-button value="9"> 高校 </a-radio-button>
        </a-radio-group>
      </a-form-item>
      <a-form-item v-bind="formItemLayout" label="地区">
        <a-cascader
          :options="areaList"
          @click.stop="onFocus"
          @change="onChange"
          :loadData="loadData"
          :placeholder="placeholder"
          v-decorator="[
            'value',
            {initialValue: [], rules: [{ required: placeholder === '请选择地区' ? true : false, message: '请选择地区' }]}
          ]"
          changeOnSelect/>
      </a-form-item>
      <a-form-item v-bind="formItemLayout" label="详细地址" >
        <a-input
          placeholder="请输入详细地址"
          v-decorator="[
            'detailAddress',
            { initialValue: appForm.detailAddress, rules: [ { required: false, message: '请输入详细地址' } ]}
          ]"
        />
      </a-form-item>
      <!--上传图片-->
      <a-form-item v-bind="formItemLayout" label="logo" required>
        <upload-multi :length="1" v-model="fileList" :fileInfo="fileInfo" ></upload-multi>
      </a-form-item>
      <a-form-item v-bind="formItemLayout" label="备注" >
        <a-input
          placeholder="备注"
          v-decorator="[
            'remark',
            { initialValue: appForm.remark, rules: [ { required: false, message: '请输入备注' } ]}
          ]"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { mapActions } from 'vuex'
import UploadMulti from '@c/UploadMulti'
export default {
  name: 'AddInstitute',
  components: {
    UploadMulti
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      fileInfo: {
        tip: '上传图片',
        h: 120, // 高度
        w: 120 // 宽度
      },
      fileList: [],
      confirmLoading: false,
      status: false,
      form: this.$form.createForm(this),
      formItemLayout: {
        labelCol: { span: 4 },
        wrapperCol: { span: 20 }
      },
      appForm: {
        schoolType: '1'
      },
      areaList: [],
      placeholder: '请选择地区',
      length: 0,
      radioStyle: {
        display: 'block'
      },
      primarySystem: 6,
      middleSystem: 3,
      highSystem: 3,
      nurserySystem: 3,
      secondVocationalSystem: 3,
      collegeSystem: 3,
      primaryList: [{
        key: 6,
        value: '六年制'
      }, {
        key: 5,
        value: '五年制'
      }],
      middleList: [{
        key: 3,
        value: '三年制'
      }, {
        key: 4,
        value: '四年制'
      }],
      highList: [{
        key: 3,
        value: '三年制'
      }, {
        key: 4,
        value: '四年制'
      }],
      secondVocationalList: [{
        key: 3,
        value: '三年制'
      }],
      collegeList: [{
        key: 3,
        value: '三年制'
      }, {
        key: 4,
        value: '四年制'
      }, {
        key: 5,
        value: '五年制'
      }],
      checkBox: [],
      primary: '01',
      middle: '02',
      high: '03',
      nursery: '00',
      secondVocational: '05',
      college: '04',
      checkedList: [],
      defaultValue: '0'
    }
  },
  methods: {
    ...mapActions('home', [
      'getProvinces', 'getSubNodes', 'delSchool', 'addSchool', 'updateSchool'
    ]),
    periodChange(e) {
      const nursery = e.indexOf('00') !== -1
      const primary = e.indexOf('01') !== -1
      const middle = e.indexOf('02') !== -1
      const high = e.indexOf('03') !== -1
      const college = e.indexOf('04') !== -1
      const secondVocational = e.indexOf('05') !== -1
      if (nursery) {
        this.checkedList = ['00']
        this.appForm.schoolType = '7'
      }
      if (college) {
        this.checkedList = ['04']
        this.appForm.schoolType = '9'
      }
      if (secondVocational) {
        this.checkedList = ['05']
        this.appForm.schoolType = '8'
      }
      if (primary && high && !middle) {
        this.checkedList = []
        this.appForm.schoolType = ''
      }
      if (primary && middle && !high) {
        this.appForm.schoolType = '4'
      } else if (high && middle && !primary) {
        this.appForm.schoolType = '5'
      } else if (primary && high && middle) {
        this.appForm.schoolType = '6'
      }
      if (e.length === 1 && !nursery && !college && !secondVocational) {
        this.appForm.schoolType = e[0].substr(1, 2)
      }
    },
    onChange (value, obj) {
      this.length = obj.length
      if (obj.length === 3) {
        this.appForm.provinceName = obj[0].label
        this.appForm.provinceCode = obj[0].id
        this.appForm.cityName = obj[1].label
        this.appForm.cityCode = obj[1].id
        this.appForm.areaName = obj[2].label
        this.appForm.areaCode = obj[2].id
        this.appForm.isChange = true
      } else {
        this.appForm.isChange = false
      }
    },
    loadData (selectedOptions) {
      const targetOption = selectedOptions[selectedOptions.length - 1]
      targetOption.loading = true
      this.getSubNodes(targetOption.id).then(res => {
        targetOption.loading = false
        targetOption.children = res.data
        targetOption.children.forEach(el => {
          el.label = el.cityName
          el.value = el.id
          el.isLeaf = selectedOptions.length === 2 // 处理第三层没有子节点的情况
        })
        this.areaList = [...this.areaList]
      })
    },
    onFocus (value) {
      this.areaList = []
      this.isNotEdited = false
      this.getProvinces().then(res => {
        this.areaList = res.data
        this.areaList.forEach(el => {
          el.label = el.cityName
          el.value = el.id
          el.isLeaf = false
        })
      })
    },
    submitOk (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          if (this.checkedList.length === 0) {
            this.$message.warning('请选择学段')
            return
          }
          if (this.fileList.length === 0) {
            this.$message.warning('请上传照片')
            return
          }
          values.primarySystem = this.primarySystem
          values.schoolStage = this.checkedList.join(',')
          values.middleSystem = this.middleSystem
          values.highSystem = this.highSystem
          values.nurserySystem = this.nurserySystem
          values.secondVocationalSystem = this.secondVocationalSystem
          values.collegeSystem = this.collegeSystem
          values.logoUrl = this.fileList[0].url
          if (this.checkedList.indexOf('01') === -1) {
            values.primarySystem = ''
          }
          if (this.checkedList.indexOf('02') === -1) {
            values.middleSystem = ''
          }
          if (this.checkedList.indexOf('03') === -1) {
            values.highSystem = ''
          }
          if (this.checkedList.indexOf('00') === -1) {
            values.nurserySystem = ''
          }
          if (this.checkedList.indexOf('04') === -1) {
            values.collegeSystem = ''
          }
          if (this.checkedList.indexOf('05') === -1) {
            values.secondVocationalSystem = ''
          }
          if (this.title === '新增学校') {
            this.addSchool({
              ...this.appForm,
              ...values
            }).then(res => {
              this.confirmLoading = false
              this.status = false
              this.$message.success('操作成功')
              this.$tools.goNext(() => {
                this.$emit('update')
              })
            }).catch(() => {
              this.confirmLoading = false
            })
          } else {
            this.updateSchool({
              ...this.appForm,
              ...values
            }).then(res => {
              this.confirmLoading = false
              this.status = false
              this.$message.success('操作成功')
              this.$tools.goNext(() => {
                this.$emit('update')
              })
            }).catch(() => {
              this.confirmLoading = false
            })
          }
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
