<template>
  <div class="bulk-import page-layout qui-fx-ver">
    <div class="top qui-fx-ver">
      <div class="line qui-fx">
        <span class="title qui-fx-ac">下载模板：</span>
        <div class="qui-fx">
          <a-button style="margin-right:20px" type="primary" @click="download">
            <a-icon type="download" /> 下载模板
          </a-button>
        </div>
      </div>
      <div class="tips qui-fx mar-b10">
        <p>说明：</p>
        <div class="qui-fx-ver" v-if="isStudent">
          <p>1、学生信息采集表：下载模板，按模板格式录入学生信息。不可修改表格文件名“student”；</p>
          <p>
            2、学生照片：支持JPG，大小20kb-100kb，分辨率400*400-800*800，以学生姓名命名，每个人的照片名称必须与学生列表中人员姓名一致；
          </p>
          <p>
            3、上传文件：将学生信息采集表与所有学生人脸照片放在同一个文件夹下，文件夹名称不限，将文件夹压缩为ZIP压缩包后上传；
          </p>
        </div>
        <div class="qui-fx-ver" v-if="isTeacher">
          <p>
            1、请将教职工信息Excel表和人脸照片放在同一个文件夹下，表格以“teacher”命名，照片以教职工姓名命名，文件夹压缩后上传，目前支持的压缩包格式为ZIP；
          </p>
          <p>
            2、目前支持的照片文件格式有JPG，照片大小20kb-100kb，分辨率400*400-800*800，每个人的照片名称必须与教职工列表中人员姓名一致，否则视为无效图片，一个人只能放一张照片；
          </p>
          <p>3、如果仅上传教职工信息不上传人脸照片，文件夹中仅存放Excel即可；</p>
          <p>
            4、填写表格时请确保教职工姓名与文件夹中照片命名一致，手机号请填写11位数字，性别仅支持填写男/女。切忌修改表头字段或改变列顺序，否则将导入异常；
          </p>
          <p>5、文件上传失败或提示错误，可重新选择压缩包后再上传。</p>
        </div>
      </div>
      <div class="line qui-fx-ver">
        <div class="qui-fx" v-if="state">
          <span class="title qui-fx-ac">选择班级：</span>
          <div class="qui-fx-f1 qui-fx">
            <a-select
              v-model="selectGrade"
              @change="firstChange"
              style="width: calc(32% - 10px);margin-right:10px;"
              placeholder="请选择年级"
            >
              <a-select-option v-for="(first, i) in firstList" :key="i">{{ first.val }}</a-select-option>
            </a-select>
            <a-select
              style="width:32%;margin-right:10px;"
              placeholder="请选择专业"
              @change="secondChange"
              v-model="selectSubject"
            >
              <a-select-option v-for="(second, i) in secondList" :key="i">{{ second.val }}</a-select-option>
            </a-select>
            <a-select style="width:32%" placeholder="请选择班级" v-model="selectClass">
              <a-select-option v-for="(three, i) in threeList" :key="i">{{ three.val }}</a-select-option>
            </a-select>
          </div>
        </div>
        <div class="qui-fx u-mar-t10" v-if="state">
          <div class="title"></div>
          <div class="u-tips-color">
            <a-icon type="info-circle" class="u-mar-r10 u-type-primary" />
            批量导入学生仅支持以班级为单位的导入哦，在导入之前请选择学生所属班级~
          </div>
        </div>
        <div class="qui-fx u-mar-t20">
          <span class="title qui-fx-ac">选择文件：</span>
          <div class="qui-fx">
            <a-upload
              class="qui-fx qui-fx-ac"
              :multiple="false"
              name="multipartFile"
              :data="{ fileType: 'zip' }"
              accept=".zip"
              :fileList="fileList"
              :withCredentials="true"
              :customRequest="customRequest"
              :beforeUpload="beforeUpload"
            >
              <a-button style="margin-right:20px" type="primary"> <a-icon type="upload" /> 选择压缩包 </a-button>
            </a-upload>
          </div>
        </div>
      </div>
    </div>
    <div class="content qui-fx-ver qui-fx-f1">
      <div class="tit">
        <div class="res qui-fx-jsb">
          <p class="qui-fx qui-fx-ac">
            导入结果<span v-if="result"
              >（导入成功,其中失败<span class="error">{{ resList.length }}</span
              >条）</span
            >
          </p>
        </div>
      </div>
      <table-list :scroll-h="isStudent ? 260 : 350" :page-list="pageList" :columns="columns" :table-list="resList">
      </table-list>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import selectImg from '../../assets/img/database/role/select.png'
import deleteImg from '../../assets/img/database/role/delete.png'
import { mapState, mapActions } from 'vuex'
import TableList from '@c/TableList'
import PageNum from '@c/PageNum'
import hostEnv from '@config/host-env'
const columns = [
  {
    title: '序号',
    width: '20%',
    dataIndex: 'orderNum'
  },
  {
    title: '姓名',
    dataIndex: 'userName',
    width: '20%'
  },
  {
    title: '结果',
    dataIndex: 'result',
    width: '20%'
  },
  {
    title: '原因',
    dataIndex: 'remark',
    width: '20%'
  }
]
export default {
  name: 'BulkImport',
  components: {
    TableList,
    PageNum
  },
  data() {
    return {
      selectImg,
      deleteImg,
      columns,
      isTeacher: false,
      isStudent: false,
      pageList: {
        page: 1,
        size: 20
      },
      resList: [],
      fileUrl: '',
      total: 100,
      fileList: [],
      result: false,
      orgCode: '',
      orgName: '',
      grade: '',
      subjectCode: '',
      classCode: '',
      subjectName: '',
      className: '',
      firstList: [],
      secondList: [],
      threeList: [],
      highSubTerm: [],
      highSubList: [],
      highClass: [],
      selectGrade: '',
      selectSubject: '',
      selectClass: '',
      gradeName: ''
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  created() {
    this.state = parseInt(this.$route.query.state) === 1
    this.grade = this.$route.query.grade
    this.subjectCode = this.$route.query.subjectCode
    this.classCode = this.$route.query.classCode
    this.subjectName = this.$route.query.subjectName
    this.className = this.$route.query.className
    this.orgCode = this.$route.query.code
    this.orgName = this.$route.query.name
    if (this.$route.query.type === 'teachers') {
      this.isTeacher = true
      this.fileUrl = `${hostEnv.protal_api_11002}/userinfo/teacher/user/batTeacherAdd?schoolCode=${this.userInfo.schoolCode}&orgCode=${this.orgCode}&orgName=${this.orgName}`
    } else if (this.$route.query.type === 'students') {
      this.isStudent = true
      // this.fileUrl = `${hostEnv.protal_api_11002}/userinfo/student/user/upload`
      this.fileUrl = `${hostEnv.protal_api_11002}/student/manage/batch/import`
    }
  },

  mounted() {
    if (this.state) {
      this.getGrade()
    }
  },
  methods: {
    ...mapActions('home', [
      'downStudentsTemplate',
      'downStudentsTemplate',
      'getHighClass',
      'getHighGradeSub',
      'getHighGrade'
    ]),
    beforeUpload(file) {
      console.log('file', file)
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
      let params = {}
      if (this.isStudent) {
        if (this.state) {
          params = {
            schoolCode: this.userInfo.schoolCode,
            grade: this.highSubTerm[this.selectGrade].gradeName,
            subjectCode: this.highSubList[this.selectSubject].subjectCode,
            classCode: this.highClass[this.selectClass].classCode,
            subjectName: this.highSubList[this.selectSubject].subjectName,
            className: this.highClass[this.selectClass].className
          }
        } else {
          params = {
            schoolCode: this.userInfo.schoolCode,
            grade: this.grade,
            subjectCode: this.subjectCode,
            classCode: this.classCode,
            subjectName: this.subjectName,
            className: this.className
          }
        }
      }
      console.log('params', params)
      axios({
        method: 'post',
        url: this.fileUrl,
        data: formData,
        params
      })
        .then(res => {
          if (res.data.code === 200) {
            this.$message.success(`导入成功`)
            this.result = true
            this.resList = this.isTeacher ? res.data.data : res.data.data.list
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
          console.log(error)
          this.$message.error(error)
          this.fileList = []
        })
    },
    download() {
      if (this.isStudent === true) {
        window.location.href = `${hostEnv.protal_api_11002}/userinfo/student/user/download/template`
      } else if (this.isTeacher) {
        window.location.href = `${hostEnv.protal_api_11002}/userinfo/teacher/user/download/teacher/template`
      }
    },
    // 获取年级
    async getGrade() {
      this.firstList = []
      const res = await this.getHighGrade({ schoolCode: this.userInfo.schoolCode })
      this.highSubTerm = res.data
      if (res.data.length === 0) {
        this.selectSubject = []
        this.selectClass = []
        return
      }
      res.data.forEach(ele => {
        this.firstList.push({ key: ele.gradeCode, val: `${ele.gradeName}级` })
      })
      this.selectGrade = 0
      this.grade = res.data[0].gradeName
      this.gradeName = res.data[0].gradeName
      this._getSubjectList()
    },
    firstChange(value) {
      if (value || value === 0) {
        this.gradeName = this.highSubTerm[value].gradeName
        this._getSubjectList()
      }
    },
    // 获取专业
    async _getSubjectList() {
      this.secondList = []
      const req = {
        gradeName: this.gradeName,
        schoolCode: this.userInfo.schoolCode
      }
      const res = await this.getHighGradeSub(req)
      this.highSubList = res.data
      if (res.data.length === 0) {
        this.selectSubject = []
        this.selectClass = []
        return
      }
      res.data.forEach(ele => {
        this.secondList.push({ key: ele.subjectCode, val: ele.subjectName })
      })
      this.selectSubject = 0
      this.subjectCode = this.secondList[0].key
      this._getHighClass(res.data[0].subjectCode)
    },
    // 点击专业获取班级
    secondChange(value) {
      if (value || value === 0) {
        this._getHighClass(this.highSubList[value].subjectCode)
      }
    },
    // 查询班级列表
    async _getHighClass(subjectCode) {
      this.threeList = []
      const req = {
        schoolCode: this.userInfo.schoolCode,
        page: 1,
        size: 99999,
        subjectCode: subjectCode,
        gradeName: this.gradeName
      }
      const res = await this.getHighClass(req)
      this.highClass = res.data.records
      if (res.data.records.length === 0) {
        this.selectClass = []
        return
      }
      res.data.records.forEach(ele => {
        this.threeList.push({ key: ele.id, val: ele.className })
      })
      this.selectClass = 0
      this.classCode = this.threeList[0].key
    }
  }
}
</script>
<style lang="less" scoped>
.bulk-import {
  height: 100%;
  .top {
    background: #fff;
    border: 1px solid #f5f5f5;
    border-left: none;
    border-right: none;
    padding: 20px;
    margin-bottom: 20px;
    .line {
      margin-bottom: 20px;
      .title {
        font-size: 14px;
        font-weight: bold;
        margin-right: 20px;
        min-width: 70px;
      }
      .download {
        color: @main-color;
        cursor: pointer;
      }
    }
    /deep/ .ant-upload-list-item-info {
      padding: 0 22px 0 4px;
    }
  }
  .content {
    background: #fff;
    padding: 20px 0;
    .tit {
      margin-bottom: 20px;
      .res {
        p {
          border-left: 3px solid @main-color;
          padding-left: 10px;
          margin: 0 0 0 10px;
          font-weight: bold;
          line-height: 16px;
          height: 16px;
          font-size: 16px;
          span {
            margin: 0 5px;
          }
          span.success {
            color: @main-color;
          }
          span.error {
            color: #e81515;
          }
        }
      }
    }
    .action {
      div {
        cursor: pointer;
        margin: 4px 30px 0 0;
        img {
          width: 20px;
          height: 20px;
        }
        span {
          font-size: 12px;
        }
      }
    }
  }
}
</style>
