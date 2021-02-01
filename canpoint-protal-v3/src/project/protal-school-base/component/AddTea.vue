<template>
  <a-modal
    width="800px"
    :title="`${title}教职工`"
    v-model="status"
    @ok="submitOk"
    :maskClosable="false"
    :destroyOnClose="true"
    okText="提交"
    :confirmLoading="confirmLoading"
  >
    <a-form :form="form" layout="inline">
      <a-row>
        <a-col :span="12">
          <a-form-item label="教职工姓名" v-bind="formItemLayout" style="width: 100%">
            <a-input
              placeholder="请输入教职工姓名"
              v-decorator="[
                'userName',
                {
                  initialValue: appForm.userName,
                  rules: [
                    {
                      max: 10,
                      required: true,
                      message: '请输入教职工姓名'
                    }
                  ]
                }
              ]"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="手机号" v-bind="formItemLayout" style="width: 100%">
            <a-input
              placeholder="请输入手机号"
              v-decorator="[
                'mobile',
                {
                  initialValue: appForm.mobile,
                  rules: [{ required: true, pattern: phone, message: '请输入正确的手机号' }]
                }
              ]"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="12">
          <a-form-item label="状态" v-bind="formItemLayout" style="width: 100%">
            <a-radio-group
              buttonStyle="solid"
              v-decorator="[
                'hasJob',
                {
                  initialValue: appForm.hasJob,
                  rules: [{ required: true, message: '请选择在职状态' }]
                }
              ]"
            >
              <a-radio value="1">在职</a-radio>
              <a-radio value="0">离职</a-radio>
            </a-radio-group>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="性别" v-bind="formItemLayout" style="width: 100%">
            <a-radio-group
              buttonStyle="solid"
              v-decorator="[
                'gender',
                {
                  initialValue: appForm.gender,
                  rules: [{ required: true, message: '请选择性别' }]
                }
              ]"
            >
              <a-radio value="1">男</a-radio>
              <a-radio value="2">女</a-radio>
            </a-radio-group>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="12">
          <a-form-item label="部门" v-bind="formItemLayout" style="width: 100%">
            <u-choose-org :school="schoolCode" @choose="selectOrg" :defaultValue="defaultValue"></u-choose-org>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="职务" v-bind="formItemLayout" style="width: 100%">
            <a-select
              mode="multiple"
              v-decorator="[
                'stationCodeList',
                { initialValue: appForm.stationCodeList }
              ]"
              placeholder="请选择职务"
            >
              <a-select-option v-for="item in jobList" :value="item.code" :key="item.code">
                {{
                  item.name
                }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="12">
          <a-form-item label="身份证号码" v-bind="formItemLayout" style="width: 100%">
            <a-input
              placeholder="请输入身份证号码"
              v-decorator="[
                'idNumber',
                {
                  initialValue: appForm.idNumber,
                  rules: [{ required: false, pattern: idCard, message: '请输入正确的身份证号码' }]
                }
              ]"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="工号" v-bind="formItemLayout" style="width: 100%">
            <a-input
              placeholder="请输入工号"
              v-decorator="[
                'workNo',
                {
                  initialValue: appForm.workNo
                }
              ]"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-form-item label="出生日期" v-bind="itemLayout" style="width: 100%">
          <a-date-picker
            :showToday="false"
            :allowClear="false"
            v-decorator="[
              'birthday',
              {
                initialValue: appForm.birthday
                  ? moment(new Date(appForm.birthday), 'YYYY-MM-DD')
                  : ''
              }
            ]"
          />
        </a-form-item>
      </a-row>
      <a-row>
        <a-form-item label="人脸照片" v-bind="itemLayout" style="width: 100%">
          <div class="qui-fx qui-fx-ac">
            <u-upload
              isCheck
              showProgressTag
              type="image"
              :maxSize="10"
              :length="1"
              v-model="imgList"
              :schoolCode="schoolCode"
            ></u-upload>
            <span style="font-size: 12px; margin-left: 10px">大小20到100kB，像素400x400到800x800，格式仅jpg</span>
          </div>
        </a-form-item>
      </a-row>
      <a-row>
        <a-form-item label="备注" v-bind="itemLayout" style="width: 100%">
          <a-textarea
            placeholder="请输入备注"
            v-decorator="[
              'introduce',
              { initialValue: appForm.introduce, rules: [ { required: false, message: '请输入备注' } ]}
            ]"
          />
        </a-form-item>
      </a-row>
    </a-form>
  </a-modal>
</template>

<script>
import moment from 'moment'
import { mapState, mapActions } from 'vuex'
export default {
  name: 'AddTea',
  components: {},
  props: {
    title: {
      type: String,
      default: ''
    },
    value: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState('home', ['schoolCode']),
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
      defaultValue: [],
      imgList: [],
      idCard: /^[1-9]\d{5}(18|19|20|(3\d))\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
      phone: /^(?:(?:\+|00)86)?1[3-9]\d{9}$/,
      moment,
      confirmLoading: false,
      form: this.$form.createForm(this),
      formItemLayout: {
        labelCol: { span: 7 },
        wrapperCol: { span: 17 }
      },
      itemLayout: {
        labelCol: { span: 3 },
        wrapperCol: { span: 21 }
      },
      type: 1,
      appForm: {},
      jobList: []
    }
  },
  mounted() {
    this._getPostList()
  },
  methods: {
    ...mapActions('home', ['detailInfo', 'getPostList', 'addTeacher', 'updateTea']),
    selectOrg(value, info) {
      this.orgCode = value
      this.orgName = info[info.length - 1].label
    },
    // 获取职位
    async _getPostList() {
      const res = await this.getPostList({ schoolCode: this.schoolCode })
      if (!res.data) {
        this.jobList = []
        return
      }
      this.jobList = res.data.map(item => {
        return {
          ...item,
          id: String(item.id)
        }
      })
    },
    reset() {
      this.confirmLoading = false
      this.$emit('input', false)
    },
    error() {
      this.confirmLoading = false
    },
    submitOk(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          this.submit(values)
        }
      })
    },
    async submit(values) {
      try {
        const req = {
          ...this.appForm,
          photoUrl: this.imgList.length > 0 ? this.imgList[0].url : '',
          ...values,
          hasJob: values.hasJob === '1',
          birthday: values.birthday ? moment(values.birthday).format('YYYY-MM-DD') : '',
          orgCode: this.orgCode.join(','),
          orgName: this.orgName,
          schoolCode: this.schoolCode
        }
        this.title === '添加' ? await this.addTeacher(req) : await this.updateTea(req)
        this.reset()
        this.$message.success(`${this.title}成功`)
        this.$tools.goNext(() => {
          this.$emit('update')
        })
      } catch (err) {
        this.error()
      }
    }
  }
}
</script>

<style lang="less" scoped>
/deep/ .ant-form-item {
  margin-bottom: 14px;
}
</style>
