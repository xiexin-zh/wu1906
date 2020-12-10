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
      <a-form-item v-bind="formItemLayout" label="机构名称" >
        <a-input
          placeholder="请输入机构名称"
          v-decorator="[
            'eduName',
            { initialValue: appForm.eduName, rules: [ {required: true, message: '请输入机构名称' } ]}
          ]"
        />
      </a-form-item>
      <a-form-item v-bind="formItemLayout" label="机构编码" >
        <a-input
          :disabled="disabled"
          placeholder="请输入机构编码"
          v-decorator="[
            'eduCode',
            { initialValue: appForm.eduCode, rules: [ { required: true, message: '请输入机构编码' } ]}
          ]"
        />
      </a-form-item>
      <!--复选框-->
      <a-form-item v-bind="formItemLayout" label="机构级别" required>
        <a-select
          v-decorator="[
            'level',
            { initialValue: appForm.level, rules: [{ required: true, message: '请选择机构级别' }] },
          ]"
          placeholder="请选择机构级别"
        >
          <a-select-option v-for="list in bureauLevel" :key="list.key">
            {{ list.value }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item v-bind="formItemLayout" label="地区" required>
        <a-cascader
          :allowClear="false"
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
export default {
  name: 'AddBureau',
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
      confirmLoading: false,
      status: false,
      form: this.$form.createForm(this),
      formItemLayout: {
        labelCol: { span: 6 },
        wrapperCol: { span: 16 }
      },
      appForm: {},
      areaList: [],
      placeholder: '请选择地区',
      length: 0,
      radioStyle: {
        display: 'block'
      },
      checkBox: [],
      bureauLevel: [{
        value: '省级',
        key: '1'
      }, {
        value: '市级',
        key: '2'
      }, {
        value: '区/县级',
        key: '3'
      }]
    }
  },
  methods: {
    ...mapActions('home', [
      'getProvinces', 'getSubNodes', 'addEdu', 'updateEdu'
    ]),
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
          values.type = '2'
          if (!this.appForm.isChange) {
            this.$message.warning('请选择省市区')
            return false
          }
          if (this.title === '新增机构') {
            this.addEdu({
              ...this.appForm,
              ...values
            }).then(res => {
              this.confirmLoading = false
              this.status = false
              this.$message.success('操作成功')
              this.$emit('update')
            }).catch(() => {
              this.confirmLoading = false
            })
          } else {
            this.updateEdu({
              ...this.appForm,
              ...values
            }).then(res => {
              this.confirmLoading = false
              this.status = false
              this.$message.success('操作成功')
              this.$emit('update')
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
