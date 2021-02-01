<template>
  <u-submit-form
    v-if="status"
    ref="form"
    :width="900"
    @submit="submitOk"
    :title="`${title}学校`"
    v-model="status"
    :form-data="formData.school"
  >
    <div slot="slotOne">
      <a-checkbox-group
        style="width:100%"
        v-model="checkedList"
        :disabled="disabled"
        @change="periodChange"
      >
        <a-row>
          <div v-for="(list,i) in typeList" :key="i">
            <a-col :span="12" class="u-mar-t10">
              <div class="u-fx">
                <div class="u-fx-ac" style="width:80px">
                  <a-checkbox :style="radioStyle" :value="list.value">{{ list.title }}</a-checkbox>
                </div>
                <div style="width:200px">
                  <a-select v-model="list.model" :disabled="disabled">
                    <a-select-option v-for="item in list.list" :key="item.key">
                      {{
                      item.value
                      }}
                    </a-select-option>
                  </a-select>
                </div>
              </div>
            </a-col>
          </div>
        </a-row>
      </a-checkbox-group>
    </div>
    <div slot="slotTwo">
      <a-radio-group
        disabled
        button-style="solid"
        v-decorator="['schoolType', { initialValue: appForm.schoolType }]"
      >
        <a-radio-button value="1">幼儿园</a-radio-button>
        <a-radio-button value="2">小学</a-radio-button>
        <a-radio-button value="3">初中</a-radio-button>
        <a-radio-button value="4">高中</a-radio-button>
        <a-radio-button value="5">九年制</a-radio-button>
        <a-radio-button value="6">十二年制</a-radio-button>
        <a-radio-button value="7">完全中学</a-radio-button>
        <a-radio-button value="8">中职</a-radio-button>
        <a-radio-button value="9">高校</a-radio-button>
      </a-radio-group>
    </div>
  </u-submit-form>
</template>

<script>
import formData from '../submit-columns/submitColumns.js'
import { mapActions } from 'vuex'
export default {
  name: 'AddInstitute',
  components: {},
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
  data() {
    return {
      formData,
      status: false,
      appForm: {
        schoolType: ''
      },
      areaList: [],
      radioStyle: {
        display: 'block'
      },
      checkedList: [],
      typeList: [
        {
          title: '幼儿园',
          value: '1',
          model: 3,
          list: [
            {
              key: 3,
              value: '三年制'
            },
            {
              key: 4,
              value: '四年制'
            }
          ]
        },
        {
          title: '小学',
          value: '2',
          model: 6,
          list: [
            {
              key: 6,
              value: '六年制'
            },
            {
              key: 5,
              value: '五年制'
            }
          ]
        },
        {
          title: '初中',
          value: '3',
          model: 3,
          list: [
            {
              key: 3,
              value: '三年制'
            },
            {
              key: 4,
              value: '四年制'
            }
          ]
        },
        {
          title: '高中',
          value: '4',
          model: 3,
          list: [
            {
              key: 3,
              value: '三年制'
            }
          ]
        },
        {
          title: '中职',
          value: '5',
          model: 3,
          list: [
            {
              key: 3,
              value: '三年制'
            }
          ]
        },
        {
          title: '高校',
          value: '6',
          model: 3,
          list: [
            {
              key: 3,
              value: '三年制'
            },
            {
              key: 4,
              value: '四年制'
            },
            {
              key: 5,
              value: '五年制'
            }
          ]
        }
      ]
    }
  },
  methods: {
    ...mapActions('home', ['delSchool', 'addSchool', 'updateSchool', 'schoolDetail']),
    // 编辑时获取详情
    async _schoolDetail(type, id) {
      if (type) {
        const res = await this.schoolDetail({ schoolCode: id })
        const data = res.data
        this.appForm = data
        this.formData.school = this.$tools.fillForm(formData.school, data)
        this.formData.school[4].disabled = true
        this.formData.school[4].initValue = `${data.provinceName}/${data.cityName}/${data.areaName}`
        this.$refs.form.areaList = [data.provinceCode, data.cityCode, data.areaCode]
        this.checkedList = data.sectionList.map(el => el.sectionType)
        for (let i = 0; i < data.sectionList.length; i++) {
          for (let j = 0; j < this.typeList.length; j++) {
            if (data.sectionList[i].sectionType === this.typeList[j].value) {
              this.typeList[j].model = data.sectionList[i].annualSystem
            }
          }
        }
        this.formData.school[1].disabled = true
      } else {
        this.formData.school = this.$tools.fillForm(formData.school, formData.school)
        this.formData.school[4].initValue = '请选择地区'
        this.formData.school[4].disabled = false
        this.formData.school[1].disabled = false
        this.appForm = []
        this.checkedList = []
      }
    },
    // 办学层次选择校验
    periodChange(e) {
      const nursery = e.indexOf('1') !== -1
      const primary = e.indexOf('2') !== -1
      const middle = e.indexOf('3') !== -1
      const high = e.indexOf('4') !== -1
      const secondVocational = e.indexOf('5') !== -1
      const college = e.indexOf('6') !== -1
      if (nursery) {
        this.checkedList = ['1']
        this.appForm.schoolType = '1'
      }
      if (college) {
        this.checkedList = ['6']
        this.appForm.schoolType = '9'
      }
      if (secondVocational) {
        this.checkedList = ['5']
        this.appForm.schoolType = '8'
      }
      if (primary && high && !middle) {
        this.checkedList = []
        this.appForm.schoolType = ''
      }
      if (primary && middle && !high) {
        this.appForm.schoolType = '5'
      } else if (high && middle && !primary) {
        this.appForm.schoolType = '7'
      } else if (primary && high && middle) {
        this.appForm.schoolType = '6'
      }
      if (e.length === 1 && !nursery && !college && !secondVocational) {
        this.appForm.schoolType = e[0]
      }
    },
    // 表单提交
    async submitOk(values) {
      try {
        if (this.checkedList.length === 0) {
          this.$message.warning('请选择学段')
          this.$refs.form.error()
          return
        }
        if (values.areaList === '请选择地区' || values.areaList.length === 0) {
          this.$message.warning('请选择地区')
          this.$refs.form.error()
          return
        }
        const sectionList = []
        for (let i = 0; i < this.checkedList.length; i++) {
          for (let j = 0; j < this.typeList.length; j++) {
            if (this.checkedList[i] === this.typeList[j].value) {
              sectionList.push({
                sectionType: this.checkedList[i],
                annualSystem: this.typeList[j].model
              })
            }
          }
        }
        values.provinceCode = values.areaList[0]
        values.cityCode = values.areaList[1]
        values.areaCode = values.areaList[2]
        values.sectionList = sectionList
        const req = {
          ...this.appForm,
          ...values
        }
        this.title === '新增' ? await this.addSchool(req) : this.updateSchool(req)
        this.$message.success(`${this.title}成功`)
        this.$tools.goNext(() => {
          this.$refs.form.reset()
          this.$emit('update')
        })
      } catch (err) {
        this.$refs.form.error()
      }
    }
  }
}
</script>

<style lang="less" scoped></style>
