<template>
  <a-modal
    width="650px"
    :title="title"
    v-model="userTag"
    @ok="handleOk"
    :maskClosable="false"
    :destroyOnClose="true"
    okText="提交"
    :confirmLoading="confirmLoading"
  >
    <a-form
      :form="form"
    >
      <a-form-item
        v-bind="formItemLayout"
        label="姓名"
      >
        <a-input
          placeholder="请输入姓名"
          :maxLength="4"
          v-decorator="[
            'name',
            { initialValue: addForm.name, rules: [
              { required: true, message: '请输入姓名' }
            ]}
          ]"
        />
      </a-form-item>
      <a-form-item
        v-bind="formItemLayout"
        label="邮箱"
      >
        <a-input
          placeholder="请输入邮箱"
          v-decorator="[
            'email',
            { initialValue: addForm.email, rules: [
              {
                type: 'email', message: '请输入正确的邮箱',
              },
              { required: true, message: '请输入邮箱' }
            ]}
          ]"
        />
      </a-form-item>
      <a-form-item
        v-bind="formItemLayout"
        label="性别"
      >
        <a-radio-group buttonStyle="solid" v-decorator="['sex', {initialValue: addForm.sex + '', rules: [{ required: true, message: '请选择性别' }]}]">
          <a-radio-button value="1">
            男
          </a-radio-button>
          <a-radio-button value="2">
            女
          </a-radio-button>
        </a-radio-group>
      </a-form-item>
      <a-form-item
        v-bind="formItemLayout"
        label="生日"
      >
        <a-date-picker v-decorator="['time', {initialValue: moment(addForm.time, 'YYYY-MM-DD'), rules: [{ required: true, message: '请选择生日' }]}]" />
      </a-form-item>
      <a-form-item
        v-bind="formItemLayout"
        label="年龄"
      >
        <a-input
          type="number"
          v-decorator="[
            'age',
            {
              initialValue: addForm.age,
              rules: [{
                required: true, message: '请输入年龄',
              }]
            }
          ]"
        />
      </a-form-item>
      <a-form-item
        v-bind="formItemLayout"
        label="职业"
      >
        <a-select
          v-decorator="[
            'work',
            { initialValue: addForm.work, rules: [{ required: true, message: '请选择职业' }]}
          ]"
          placeholder="请选择职业"
        >
          <a-select-option v-for="work in workList" :value="work.key" :key="work.name">
            {{ work.name }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item
        v-bind="formItemLayout"
        label="爱好"
      >
        <a-checkbox-group
          v-decorator="['enjoy', {initialValue: addForm.enjoy, rules: [{ required: true, message: '请选择兴趣爱好' }]}]"
          style="width: 100%;"
        >
          <a-row>
            <a-col :span="8" v-for="item in enjoyList" :key="item.key">
              <a-checkbox :value="item.key">
                {{ item.name }}
              </a-checkbox>
            </a-col>
          </a-row>
        </a-checkbox-group>
      </a-form-item>
      <a-form-item
        v-bind="formItemLayout"
        label="是否开启"
      >
        <a-switch checkedChildren="开" unCheckedChildren="关" defaultChecked v-decorator="['status', { initialValue: true }]" />
      </a-form-item>
      <a-form-item
        v-bind="formItemLayout"
        label="logo"
      >
        <a-upload
          v-decorator="['pic', {initialValue: addForm.pic, rules: [{ required: true, message: '请上传图片' }]}]"
          name="fileList"
          listType="picture-card"
          class="avatar-uploader"
          :showUploadList="false"
          action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
          :beforeUpload="beforeUpload"
          @change="uploadPic"
        >
          <img style="width:120px; height: 120px; display: block" v-if="addForm.pic" :src="addForm.pic" alt="avatar" />
          <div v-else>
            <a-icon :type="uploadTag ? 'loading' : 'plus'" />
            <div class="ant-upload-text">上传图片</div>
          </div>
        </a-upload>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import moment from 'moment'
export default {
  name: 'SubmitForm',
  props: {
    formData: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data () {
    return {
      form: this.$form.createForm(this),
      formItemLayout: {
        labelCol: { span: 4 },
        wrapperCol: { span: 20 }
      }
    }
  },
  methdos: {
    handleOk (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          this.confirmLoading = true
          // monent 转化为正常日期格式
          values.time = moment(values.time).format('YYYY-MM-DD')
          values.status = values.status ? 1 : 0
          setTimeout(() => {
            this.userList.push(values)
            this.confirmLoading = false
            this.userTag = false
          }, 2000)
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>

</style>
