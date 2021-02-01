<template>
  <div class="bulk-import page-layout u-fx-ver u-type-white-bg u-padd">
    <div class="top u-fx-ver">
      <div class="tips u-fx-ver u-padd u-mar-b10">
        <div class="title u-fx-ac u-mar-b10">
          <a-icon class="icon u-mar-r20" type="info-circle" />
          <div>温馨提示：</div>
        </div>
        <div class="u-fx-ver u-mar-l40" >
          <p>
            1、{{ title }}信息采集表：下载模板，按模板格式录入{{ title }}信息。不可修改表格文件名“{{ identity }}”。
          </p>
          <p>
            2、{{ title }}照片：支持JPG，大小20kb-100kb，分辨率400*400-800*800，以{{ title }}姓名命名，每个人的照片名称必须与{{ title }}列表中人员姓名一致。
          </p>
          <p>3、上传文件：将{{ title }}信息采集表与所有{{ title }}人脸照片放在同一个文件夹下，文件夹名称不限，将文件夹压缩为ZIP压缩包后上传。</p>
        </div>
        <div class="u-fx u-mar-l40">
          <u-download :reqObj="reqObj" title="下载模板"></u-download>
        </div>
      </div>
      <div class="u-mar-b20 u-fx" v-if="status === '1'">
        <span class="title u-fx-ac">选择{{ identity === 'teacher' ? '部门' : '班级' }}：</span>
        <div class="u-fx-f1" style="width:100%">
          <u-choose-org
            v-if="identity === 'teacher'"
            :school="schoolCode"
            @choose="selectOrg"
            :defaultValue="defaultValue"></u-choose-org>
          <choose-grade
            v-if="identity === 'student' && (schoolType !== '8' && schoolType !== '9')"
            :school="schoolCode"
            :schoolYearCode="schoolYearCode"
            @choose="selectOrg"></choose-grade>
          <choose-high-grade
            v-if="identity === 'student' && (schoolType === '8' || schoolType === '9')"
            :school="schoolCode"
            @choose="selectOrg"></choose-high-grade>
        </div>
        <div class="u-fx-ac">
          <a-icon class="u-mar-l10 u-mar-r10 tip-color" type="info-circle" />
          <span class="u-light-color">批量导入{{ title }}支持以{{ title }}为单位的导入哦，在导入之前请选择{{ title }}所属{{ identity === 'teacher'? '部门' : '班级' }}~</span>
        </div>
      </div>
      <div class="u-mar-b20 u-fx">
        <span class="title u-fx-ac">上传文件：</span>
        <div class="u-fx">
          <a-upload
            class="u-fx u-fx-ac"
            :multiple="false"
            name="multipartFile"
            :data="{ fileType: 'zip' }"
            accept=".zip"
            :fileList="fileList"
            :withCredentials="true"
            :customRequest="customRequest"
            :beforeUpload="beforeUpload"
          >
            <a-button class="u-mar-r" type="primary"> <a-icon type="upload" /> 选择压缩包 </a-button>
          </a-upload>
        </div>
      </div>
    </div>
    <div class="u-fx-ver u-fx-f1">
      <div class="u-mar-b">
        <div class="u-fx-jsb">
          <p class=" u-fx u-fx-ac">
            导入结果
            <span v-if="result" >（导入成功,其中失败<span class="error">{{ failCount }}</span>条）</span>
          </p>
        </div>
      </div>
      <u-table :scroll-h="isStudent ? 260 : 350" :page-list="pageList" :columns="columns" :table-list="resList">
      </u-table>
    </div>
  </div>
</template>

<script>
import ChooseGrade from '../../component/ChooseGrade'
import ChooseHighGrade from '../../component/ChooseHighGrade'
import columns from '../../table-columns/batch'
import { mapState, mapActions } from 'vuex'
import hostEnv from '@config/host-env'
import axios from 'axios'
export default {
  name: 'BulkImport',
  components: {
    ChooseGrade,
    ChooseHighGrade
  },
  data() {
    return {
      columns,
      isTeacher: false,
      isStudent: false,
      pageList: {
        page: 1,
        size: 999
      },
      resList: [],
      fileUrl: '',
      fileList: [],
      result: false,
      defaultValue: [],
      reqObj: {
        url: '',
        params: {}
      },
      title: '',
      identity: '',
      schoolYearCode: '',
      schoolType: '',
      status: '',
      failCount: 0,
      info: []
    }
  },
  computed: {
    ...mapState('home', ['schoolCode', 'loginInfo'])
  },
  created() {
    this.schoolType = this.loginInfo.schoolType
    this.status = this.$route.query.status
    this.identity = this.$route.query.type
    this.schoolYearCode = this.$route.query.schoolYearCode
    this.classCode = this.$route.query.classCode
    if (this.identity === 'teacher') {
      this.title = '教职工'
      this.isTeacher = true
      this.reqObj = { url: '/protal_v3_11101/canpointUserInfo/teacher/download/template', method: 'get' }
    } else if (this.identity === 'student') {
      this.title = '学生'
      this.isStudent = true
      this.reqObj = { url: '/protal_v3_11101/canpointUserInfo/student/download/template', method: 'get' }
    }
  },
  methods: {
    ...mapActions('home', ['downStudentsTemplate', 'downStudentsTemplate']),
    selectOrg(value, info) {
      this.info = info
      if (this.identity === 'teacher') {
        this.orgCode = value.join(',')
        this.orgName = info[info.length - 1].label
      } else {
        this.classCode = info[info.length - 1].value
      }
    },
    beforeUpload(file) {
      if (this.info.length === 0 && this.status === '1') {
        this.$message.error(`请选择${this.identity === 'teacher' ? '部门' : '班级'}`)
        return false
      }
      const isZip = file.type === 'application/x-zip-compressed' || 'application/zip'
      if (!isZip) {
        this.$message.error('请上传格式为ZIP的压缩包')
      }
      return isZip
    },
    customRequest(data) {
      // 上传提交
      this.resList = []
      const formData = new FormData()
      formData.append('multipartFile', data.file)
      this.fileList = [data.file]
      this.saveFile(formData)
    },
    saveFile(formData) {
       const fileUrl = this.identity === 'teacher'
        ? `${hostEnv.protal_v3_11101}/canpointUserInfo/teacher/batchImportTeacher?schoolCode=${this.schoolCode}&orgCode=${this.orgCode}&orgName=${this.orgName}`
        : `${hostEnv.protal_v3_11101}/canpointUserInfo/student/batchImportStudent?schoolCode=${this.schoolCode}&classCode=${this.classCode}&schoolYearCode=${this.schoolYearCode}`
      axios({
        method: 'post',
        url: fileUrl,
        data: formData
      })
        .then(res => {
          console.log('res', res)
          if (res.data.code === 200) {
            this.$message.success(`导入成功`)
            this.result = true
            this.resList = res.data.data.failList
            this.failCount = res.data.data.failCount
            this.resList.forEach((ele, index) => {
              ele.id = index
              ele.result = '失败'
            })
          } else {
            this.result = false
            this.$message.error(res.data.message)
            this.fileList = []
          }
        })
        .catch(error => {
          this.$message.error(error)
          this.fileList = []
        })
    }
  }
}
</script>
<style lang="less" scoped>
.bulk-import {
  .tips {
    background-color:#e6f7ff;
    .title {
      font-size: 14px;
      color: #000;
      .icon {
        font-size: 24px;
        color:#1890ff;
      }
    }
  }
  .tip-color{
    color:#1890ff;
  }
  /deep/ .ant-cascader-picker {
    width: 100%;
  }
}
</style>
