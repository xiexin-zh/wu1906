<template>
  <div class="add-study page-layout qui-fx-ver">
    <choose-class
      title="添加班级"
      ref="chooseClass"
      :classList="classList"
      is-check
      v-model="classTag"
      v-if="classTag"
      @submit="chooseClass"
    ></choose-class>
    <a-form :form="form" :style="{ maxHeight: maxHeight, overflow: 'auto' }">
      <a-form-item label="资源名称" :label-col="{ span: 3 }" :wrapper-col="{ span: 15 }">
        <a-input
          placeholder="请输入资源名称"
          :maxLength="20"
          v-decorator="[
            'title',
            { initialValue: formData.title, rules: [{ required: true, message: '请输入资源名称' }] }
          ]"
        />
      </a-form-item>
      <a-form-item label="资源发布" :label-col="{ span: 3 }" :wrapper-col="{ span: 15 }" :required="true">
        <a-radio-group v-model="currentKey" button-style="solid">
          <a-radio v-for="tab in tabList" :key="tab.key" :value="tab.key">{{ tab.title }}</a-radio>
        </a-radio-group>
        <div class="choose-input" v-if="currentKey === 1" @click="classSelect">
          <div class="p" v-if="classList.length === 0">请选择班级</div>
          <template v-for="tag in classList">
            <a-tag color="blue" @click.stop.prevent :key="tag.classCode" closable @close.stop="() => classClose(tag)">
              {{ tag.gradeName }}{{ userInfo.schoolType === '8' || userInfo.schoolType === '9' ? tag.subjectName : '' }}{{ tag.className }}</a-tag
            >
          </template>
        </div>
      </a-form-item>
      <a-form-item
        v-if="type !== '2'"
        label="上传资源："
        :label-col="{ span: 3 }"
        :wrapper-col="{ span: 15 }"
        :required="true"
      >
        <div class="qui-fx-ac">
          <a-upload
            name="fileList"
            :action="fileInfo.url"
            :file-list="fileList"
            :remove="remove"
            @change="upload"
            @preview="handlePreview"
            accept=".doc, .docx, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, .pdf, application/pdf, .mp4, image/*, .xls, .xlsx, .excel, .ppt, .pptx"
          >
            <a-button v-if="fileList.length < 5" type="primary"> <a-icon type="upload" />上传 </a-button>
            <span @click.stop.prevent class="tip">说明：仅支持上传5份文件</span>
          </a-upload>
        </div>
      </a-form-item>
      <a-form-item v-else label="复用资源：" :label-col="{ span: 3 }" :wrapper-col="{ span: 15 }" :required="true">
        <div class="">
          <a-checkbox-group @change="onChange">
            <a-row>
              <a-col class="file-list qui-fx-ac" :span="24" v-for="item in fileList" :key="item.id">
                <a-checkbox :value="item.id">
                  {{ item.name }}
                </a-checkbox>
              </a-col>
            </a-row>
          </a-checkbox-group>
        </div>
      </a-form-item>
      <a-form-item :wrapper-col="{ span: 15, offset: 3 }">
        <a-button style="margin-right:50px;" @click="cancle">取消</a-button>
        <a-button type="primary" @click="handleSubmit">发布</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import ChooseClass from '@c/choose/ChooseClass'
import { mapState, mapActions } from 'vuex'
import hostEnv from '@config/host-env'
export default {
  name: 'AddStudy',
  components: {
    ChooseClass
  },
  data() {
    return {
      currentKey: 0,
      tabList: [
        {
          key: 0,
          title: '全校'
        },
        {
          key: 1,
          title: '指定班级'
        }
      ],
      form: this.$form.createForm(this),
      maxHeight: 0,
      formData: {
        title: ''
      },
      fileList: [],
      classTag: false,
      id: 0,
      type: 0, // 0新增 1查看 2编辑
      classList: [],
      fileInfo: {
        url: ''
      },
      chooseList: []
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  mounted() {
    this.fileInfo.url = `${hostEnv.protal_api_11014}/study/theme/file/uploadFile?schoolCode=${this.userInfo.schoolCode}`
    this.maxHeight = window.screen.height - 280 + 'px'
    this.type = this.$route.query.type
    if (this.type !== '0') {
      this.showData()
    }
  },
  methods: {
    ...mapActions('home', ['addNewStudy', 'delFile', 'detailStudy', 'editStudy']),
    // 表单回填
    async showData() {
      const res = await this.detailStudy(this.$route.query.id)
      console.log(res.data)
      this.formData.title = res.data.name
      this.currentKey = res.data.schoolGradeCode === '00' ? 0 : 1
      this.classList = res.data.schoolGradeCode === '00' ? [] : res.data.classList
      res.data.fileList.forEach(ele => {
        this.fileList.push({
          name: ele.fileName,
          uid: ele.id,
          id: ele.id,
          fileUrl: ele.url
        })
      })
    },
    onChange(checkedValues) {
      this.chooseList = checkedValues
    },
    remove(file) {
      const index = this.fileList.findIndex(item => {
        return item.uid === file.uid
      })
      // this.delFile(this.fileList[index].id)
      this.fileList.splice(index, 1)
    },
    handlePreview(file) {
      if (file.fileUrl) {
        window.open(file.fileUrl, '_blank')
      }
    },
    upload({ fileList }) {
      console.log(fileList)
      this.fileList = fileList
      const index = fileList.findIndex(item => {
        return item.status === 'done'
      })
      console.log(index)
      if (index === -1) {
        return
      }
      const info = fileList[index]
      console.log(info)
      if (info.response.code === 400) {
        this.$message.warning(info.file.response.message)
        return
      }
      this.fileList[index] = {
        name: info.name,
        uid: info.uid,
        id: Array.isArray(info.response.data) ? info.response.data[0].id : info.response.data.id,
        fileUrl: Array.isArray(info.response.data) ? info.response.data[0].url : info.response.data.url
      }
      console.log(this.fileList)
    },
    // 提交权限组
    handleSubmit(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          if (this.currentKey === 1 && this.classList.length === 0) {
            this.$message.error('请选择发布班级')
            return
          }
          if (this.type !== '2') {
            if (this.fileList.length === 0) {
              this.$message.error('请上传资源')
              return
            } else {
              if (this.fileList.length === 0 && this.type === '2') {
                this.$message.error('请选择复用资源')
                return
              }
              if (this.fileList.some(ele => ele.status === 'uploading' || ele.status === 'error')) {
                this.$message.error('请等待资源上传完成')
                return
              }
            }
          }
          const req = {
            classList: this.currentKey === 1 ? this.classList : undefined,
            name: values.title,
            repeat: this.type === '2' ? 'Y' : 'N',
            ownerCode: this.userInfo.userCode,
            ownerName: this.userInfo.userName,
            schoolCode: this.userInfo.schoolCode,
            schoolGradeCode: this.currentKey === 1 ? undefined : '00'
          }
          if (this.type === '2') {
            req.fileAddIdList = this.chooseList
          } else {
            const fileAddIdList = []
            this.fileList.forEach(el => {
              fileAddIdList.push(el.id)
            })
            req.fileAddIdList = fileAddIdList
          }
          console.log(req)
          if (this.type === '1') {
            req.id = this.$route.query.id
            this.editStudy(req).then(res => {
              this.$message.success('编辑成功')
              this.$tools.goNext(() => {
                this.$router.push({ path: '/studyGround' })
              })
            })
          } else {
            this.addNewStudy(req).then(res => {
              this.$message.success('发布成功')
              this.$tools.goNext(() => {
                this.$router.push({ path: '/studyGround' })
              })
            })
          }
        }
      })
    },
    chooseClass(classInfo) {
      this.classList = classInfo.map(el => {
        return {
          ...el,
          id: undefined
        }
      })
      console.log(this.classList)
      this.$refs.chooseClass.reset()
    },
    classClose(removedTag) {
      this.classList = this.classList.filter(tag => tag !== removedTag)
    },
    deselect(value, option) {
      const index = this.classList.findIndex(list => list.key === value.key)
      this.classList.splice(index, 1)
      console.log(this.classList)
    },
    classSelect() {
      this.classTag = true
    },
    cancle() {
      this.$router.push({ path: '/studyGround' })
    }
  }
}
</script>

<style lang="less" scoped>
.add-study {
  padding-top: 30px;
}
.choose-input {
  border: 1px solid @bor-color;
  border-radius: @radius;
  width: 100%;
  min-height: 32px;
  line-height: 32px;
  padding: 0 10px;
  .p {
    height: 30px;
    line-height: 30px;
    color: @dark-color;
  }
}
.tip {
  color: @dark-color;
  font-size: 12px;
  margin-left: 10px;
}
.file-list {
  margin: 0px 0 10px 10px;
}
/deep/ .ant-upload-list-item-card-actions {
  right: -30px;
}
</style>
