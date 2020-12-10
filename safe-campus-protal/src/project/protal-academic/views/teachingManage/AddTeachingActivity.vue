<template>
  <div class="add-plan">
    <a-form class="ant-advanced-search-form" :form="form">
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
              <a-select-option value="1"> 第一学期 </a-select-option>
              <a-select-option value="2"> 第二学期 </a-select-option>
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
              <a-select-option value="1"> 软件测试 </a-select-option>
              <a-select-option value="2"> 软件开发 </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :span="10">
          <a-form-item
            :label-col="{ span: 4 }"
            :wrapper-col="{ span: 20 }"
            label="教研组"
            :required="true"
          >
            <a-select
              v-decorator="[
                'teachingGroup',
                { rules: [{ required: true, message: '请选择教研组' }] }
              ]"
              placeholder="请选择"
            >
              <a-select-option value="1"> 教研组1 </a-select-option>
              <a-select-option value="2"> 教研组2 </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="10">
          <a-form-item
            :label-col="{ span: 4 }"
            :wrapper-col="{ span: 20 }"
            label="主持人"
            :required="true"
          >
            <a-input
              :read-only="true"
              @focus="showSelectPanel(1)"
              v-model="compere.userName"
              placeholder="请选择"
            >
              <a-icon slot="suffix" type="right" />
            </a-input>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :span="10">
          <a-form-item
            :label-col="{ span: 4 }"
            :wrapper-col="{ span: 20 }"
            label="主讲人"
            :required="false"
          >
            <a-input
              :read-only="true"
              @focus="showSelectPanel(0)"
              v-model="speaker.userName"
              placeholder="请选择"
            >
              <a-icon slot="suffix" type="right" />
            </a-input>
          </a-form-item>
        </a-col>
        <a-col :span="10">
          <a-form-item
            :label-col="{ span: 4 }"
            :wrapper-col="{ span: 20 }"
            label="活动时间"
            :required="true"
          >
            <a-date-picker
              :showToday="false"
              :allowClear="false"
              v-decorator="[
                'time',
                {
                  initialValue: moment(new Date(), 'YYYY-MM-DD'),
                  rules: [
                    {
                      required: true,
                      message: '请选择活动时间'
                    }
                  ]
                }
              ]"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :span="10">
          <a-form-item
            :label-col="{ span: 4 }"
            :wrapper-col="{ span: 20 }"
            label="活动名称"
            :required="true"
          >
            <a-input
              placeholder="请输入"
              v-decorator="[
                'activityName',
                {
                  initialValue: '',
                  rules: [
                    {
                      max: 15,
                      required: true,
                      message: '请输入活动名称(限15字内)'
                    }
                  ]
                }
              ]"
            />
          </a-form-item>
        </a-col>
        <a-col :span="10">
          <a-form-item
            :label-col="{ span: 4 }"
            :wrapper-col="{ span: 20 }"
            label="活动地点"
            :required="true"
          >
            <a-input
              placeholder="请输入"
              v-decorator="[
                'address',
                {
                  initialValue: '',
                  rules: [
                    {
                      max: 15,
                      required: true,
                      message: '请输入活动地点(限15字内)'
                    }
                  ]
                }
              ]"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :span="10">
          <a-form-item
            :label-col="{ span: 4 }"
            :wrapper-col="{ span: 20 }"
            label="活动描述"
            :required="true"
          >
            <a-textarea
              placeholder="请输入"
              :rows="4"
              v-decorator="[
                'activityDes',
                {
                  initialValue: '',
                  rules: [
                    {
                      max: 20,
                      required: true,
                      message: '请输入活动描述(限200字内)'
                    }
                  ]
                }
              ]"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <div class="content-box plan-text">
        <div class="box-title">活动内容：</div>
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
      <div class="content-box">
        <div class="box-title">本教研组教师情况：</div>
        <div class="box-main file-list">
          <table-list isBorder :columns="columns" :table-list="taskList"></table-list>
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
    <teacher-panel
      isCheck
      :isRadio="false"
      title="选择教师"
      v-if="panelStatus"
      v-model="panelStatus"
      @submit="confirmSelect"
    ></teacher-panel>
  </div>
</template>

<script>
import { quillEditor } from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import axios from 'axios'
import moment from 'moment'
import hostEnv from '@config/host-env'
import TeacherPanel from '../../component/TeacherPanel'
import quillConfig from '../../assets/js/quill-config'
import TableList from '../../component/TableList'

import { mapState, mapActions } from 'vuex'
const columns = [
  {
    title: '序号',
    align: 'center',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '教师姓名',
    align: 'center',
    dataIndex: 'userName'
  },
  {
    title: '性别',
    align: 'center',
    dataIndex: 'sex'
  }
]
export default {
  name: 'AddTeachingActivity',
  components: {
    quillEditor,
    TableList,
    TeacherPanel
  },
  data() {
    return {
      moment,
      form: this.$form.createForm(this),
      fileList: [],
      content: '',
      quillOption: quillConfig,
      columns,
      taskList: [],
      panelStatus: false,
      userType: 1, // 1-主持人  0-主讲人，
      compere: { userName: '', userId: '', userCode: '' }, // 主持人
      speaker: { userName: '', userId: '', userCode: '' } // 主讲人
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
    showSelectPanel(val) {
      this.userType = val
      this.panelStatus = true
    },
    // 选择教师-回显
    confirmSelect(msgObj) {
      console.log(msgObj)
      this.panelStatus = false
      const { userName, id, userCode } = msgObj
      const obj = {
        userName: msgObj.map((item) => item.userName).join(','),
        userId: msgObj.map((item) => item.id).join(','),
        userCode: msgObj.map((item) => item.userCode).join(',')
      }
      if (this.userType) {
        this.compere = obj
        this.form.setFieldsValue({
          compere_name: obj.userName
        })
      } else {
        this.speaker = obj
        this.form.setFieldsValue({
          speaker_name: obj.userName
        })
      }
    },
    handleCancel() {},
    handleSubmit(e) {
      e.preventDefault()
      this.form.validateFields(async (err, values) => {
        if (!err) {
          if (!this.compere.userCode) {
            this.$message.error('请选择主持人')
            return
          }
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