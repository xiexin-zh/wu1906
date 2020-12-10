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
          <p>
            1、请将学生信息Excel表和人脸照片放在同一个文件夹下，表格以“student”命名，照片以学生姓名命名，文件夹压缩后上传，目前支持的压缩包格式为ZIP；
          </p>
          <p>
            2、目前支持的照片文件格式有JPG，照片大小20kb-100kb，分辨率400*400-800*800，每个人的照片名称必须与学生列表中人员姓名一致，否则视为无效图片，一个人只能放一张照片；
          </p>
          <p>3、如果仅上传学生信息不上传人脸照片，文件夹中仅存放Excel即可；</p>
          <p>
            4、填写表格时请确保学生姓名与文件夹中照片命名一致，入学年份请填写数字，性别仅支持填写男/女，走住读类型仅支持填写走读/住读。切忌修改表头字段或改变列顺序，否则将导入异常；
          </p>
          <p>
            5、家长姓名、手机号、亲属关系3列选填，手机号请填写11位数字，亲属关系仅支持填写爸爸/妈妈/爷爷/奶奶/其他。3者必需填写完整才能录入成功。每个学生只能同时导入一个家长。
          </p>
          <p>6、文件上传失败或提示错误，可重新选择压缩包后再上传。</p>
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
      <div class="line qui-fx">
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
    <div class="content qui-fx-ver qui-fx-f1">
      <div class="tit">
        <div class="res qui-fx-jsb">
          <p class="qui-fx qui-fx-ac">
            导入结果<span
              v-if="result"
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
      orgName: ''
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  created() {
    this.orgCode = this.$route.query.code
    this.orgName = this.$route.query.name
    console.log(this.orgCode)
    console.log(this.orgName)
    if (this.$route.query.type === 'teachers') {
      this.isTeacher = true
      this.fileUrl = `${hostEnv.protal_api_11002}/userinfo/teacher/user/batTeacherAdd?schoolCode=${this.userInfo.schoolCode}&orgCode=${this.orgCode}&orgName=${this.orgName}`
    } else if (this.$route.query.type === 'students') {
      this.isStudent = true
      this.fileUrl = `${hostEnv.protal_api_11002}/userinfo/student/user/upload`
    }
  },
  mounted() {},
  methods: {
    ...mapActions('home', ['downStudentsTemplate', 'downStudentsTemplate']),
    deleteList(action) {},
    reelect(action) {},
    lead() {},
    beforeUpload(file) {
      console.log(file)
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
        params = {
          classId: this.$route.query.id,
          schoolCode: this.userInfo.schoolCode
        }
      }
      axios({
        method: 'post',
        url: this.fileUrl,
        data: formData,
        params
      })
        .then(res => {
          if (res.data.code === 200) {
            this.$message.success(`导入成功`)
            console.log(res.data.data)
            this.result = true
            this.resList = res.data.data
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
