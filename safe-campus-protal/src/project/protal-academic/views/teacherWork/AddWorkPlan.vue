<template>
  <div class="add-plan">
    <a-form class="ant-advanced-search-form" :form="form">
      <a-row :gutter="24">
        <a-col :span="10">
          <a-form-item
            :label-col="{ span: 4 }"
            :wrapper-col="{ span: 20 }"
            label="教师姓名"
            :required="true"
          >
            <a-input
              v-decorator="['userName', { rules: [{ required: true, message: '' }] }]"
              placeholder=""
              :disabled="true"
            />
          </a-form-item>
        </a-col>
        <a-col :span="10">
          <a-form-item
            :label-col="{ span: 4 }"
            :wrapper-col="{ span: 20 }"
            label="年级"
            :required="true"
          >
            <a-select
              v-decorator="['schoolYear', { rules: [{ required: true, message: '请选择年级' }] }]"
              placeholder="请选择"
            >
              <a-select-option value="2020"> 2020 </a-select-option>
              <a-select-option value="2019"> 2019 </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :span="10">
          <a-form-item
            :label-col="{ span: 4 }"
            :wrapper-col="{ span: 20 }"
            label="学期"
            :required="true"
          >
            <a-select
              v-decorator="['semester', { rules: [{ required: true, message: '请选择学期' }] }]"
              placeholder="请选择"
            >
              <a-select-option value="上学期"> 上学期 </a-select-option>
              <a-select-option value="下学期"> 下学期 </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="10">
          <a-form-item
            :label-col="{ span: 4 }"
            :wrapper-col="{ span: 20 }"
            label="专业"
            :required="true"
          >
            <a-select
              v-decorator="['major', { rules: [{ required: true, message: '请选择专业' }] }]"
              placeholder="请选择"
            >
              <a-select-option value="软件开发"> 软件开发 </a-select-option>
              <a-select-option value="软件测试"> 软件测试 </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :span="10">
          <a-form-item
            :label-col="{ span: 4 }"
            :wrapper-col="{ span: 20 }"
            label="班级"
            :required="true"
          >
            <a-select
              v-decorator="['class', { rules: [{ required: true, message: '请选择班级' }] }]"
              placeholder="请选择"
            >
              <a-select-option value="1"> 1班 </a-select-option>
              <a-select-option value="1"> 2班 </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="10">
          <a-form-item
            :label-col="{ span: 4 }"
            :wrapper-col="{ span: 20 }"
            label="课程"
            :required="true"
          >
            <a-select
              v-decorator="['subject', { rules: [{ required: true, message: '请选择课程' }] }]"
              placeholder="请选择"
            >
              <a-select-option value="软件开发"> java </a-select-option>
              <a-select-option value="软件测试"> ps </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :span="10">
          <a-form-item :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }" label="周课时">
            <a-input
              v-decorator="['weekCount', { rules: [{ required: false, message: '请输入周课时' }] }]"
              placeholder="请输入周课时"
            >
            </a-input>
          </a-form-item>
        </a-col>
        <a-col :span="10">
          <a-form-item :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }" label="学期总课时">
            <a-input
              v-decorator="[
                'allCount',
                { rules: [{ required: false, message: '请输入学期总课时' }] }
              ]"
              placeholder="请输入学期总课时"
            >
            </a-input>
          </a-form-item>
        </a-col>
      </a-row>
      <div class="content-box plan-text">
        <div class="box-title">教师工作计划内容：</div>
        <div class="box-main">
          <quill-editor
            style="height: 400px"
            v-model="content"
            ref="myQuillEditor"
            :options="quillOption"
            @focus="onEditorFocus($event)"
            @change="onEditorChange($event)"
          ></quill-editor>
        </div>
      </div>
      <div class="content-box file">
        <div class="box-title">附件：</div>
        <div class="box-main" style="display: flex">
          <a-upload
            class="qui-fx qui-fx-ac"
            :multiple="false"
            name="multipartFile"
            :data="{ fileType: 'doc' }"
            accept=".doc,.docx,.xls,.xlsx,.wps,.et"
            :fileList="fileList"
            :withCredentials="true"
            :customRequest="customRequest"
            :beforeUpload="beforeUpload"
          >
            <a-button style="margin-right: 20px" type="primary">
              <a-icon type="upload" /> 选择文件
            </a-button>
          </a-upload>
          <span>说明：文件只能上传doc、docx、wps、et、xls、xlsx格式，且大小不能超过50M。</span>
        </div>
      </div>
      <div class="content-box">
        <div class="box-title"></div>
        <div class="box-main file-list">
          <div class="list-item">
            <div class="file-name">
              <span @click="downFile">xxxxxxxxxxxxxxxx.xls(4KB)</span>
            </div>
            <div class="file-del" @click="delFile">
              <a-icon type="close" />
            </div>
          </div>
        </div>
      </div>
      <a-form-item :wrapper-col="{ span: 10 }">
        <div style="display: flex; padding-left: 150px; padding-top: 50px">
          <a-button type="default" style="border: 1px solid #ccc" @click="handleCancel">
            取消
          </a-button>
          <a-button :style="{ marginLeft: '8px' }" type="primary" @click="handleSubmit">
            保存
          </a-button>
        </div>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import { quillEditor } from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import axios from 'axios'
import hostEnv from '@config/host-env'
import quillConfig from '../../assets/js/quill-config'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'AddWorkPlan',
  components: {
    quillEditor
  },
  props: {
    type: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      form: this.$form.createForm(this),
      fileList: [],
      content: '',
      quillOption: quillConfig
    }
  },
  methods: {
    beforeUpload(file) {
      console.log(file)
      const { size, name } = file
      const index = name.lastIndexOf('.')
      const ext = name.substr(index + 1)
      if (
        ext !== 'doc' &&
        ext !== 'docx' &&
        ext !== 'xls' &&
        ext !== 'xlsx' &&
        ext !== 'wps' &&
        ext !== 'et'
      ) {
        this.$message.error('文件只能上传doc、docx、wps、et、xls、xlsx格式')
        return false
      }
      if (typeof size !== 'number' || size > 50 * 1024 * 1024) {
        this.$message.error('文件大小限制在50M内')
        return false
      }
      return true
    },
    // 富文本编辑器方法
    onEditorFocus(data) {},
    // 获得焦点事件
    onEditorChange(data) {
      data.quill.deleteText(6000, 4)
      this.content = data.html
    },
    customRequest(data) {
      // 上传提交
      const formData = new FormData()
      formData.append('multipartFile', data.file)
      this.fileList = [data.file]
      this.saveFile(formData)
    },
    saveFile(formData) {
      const params = {}
      console.log(params)
      axios({
        method: 'post',
        url: this.fileUrl,
        data: formData,
        params
      })
        .then((res) => {
          console.log(res)
        })
        .catch((error) => {
          this.$message.error(error)
          this.fileList = []
        })
    },
    downFile() {},
    delFile() {},
    handleCancel() {},
    handleSubmit(e) {
      e.preventDefault()
      this.form.validateFields(async (err, values) => {
        if (!err) {
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.add-plan {
  height: calc(100vh - 65px);
  background-color: #fff;
  padding: 20px;
  box-sizing: border-box;
  overflow-y: auto;
}
.content-box {
  display: flex;
  margin: 20px 0;
  width: 80%;

  .box-title {
    width: 150px;
    text-align: right;
    color: rgba(0, 0, 0, 0.85);
  }

  .box-main {
    flex: 1;
    padding-left: 5px;
    box-sizing: border-box;
  }
}
.plan-text {
  height: 450px;
}
.file-list {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;

  .list-item {
    width: 40%;
    display: flex;
    padding: 5px;
    border-bottom: 1px solid #f5f5f5;

    .file-name {
      flex: 1;
    }
    .file-del {
      width: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  .list-item:hover {
    background-color: #f5f5f5;

    .file-name {
      span {
        color: blue;
        text-decoration: underline;
        cursor: pointer;
      }
    }
    .file-del {
      cursor: pointer;
    }
  }
}
</style>