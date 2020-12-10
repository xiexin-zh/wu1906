<template>
  <div class="fast-student">
    <a-modal
      class="qui-fx-ver"
      :title="title"
      :pagination="false"
      v-model="addVisible"
      destroyOnClose
      width="820px"
      :footer="null"
      @cancel="cancelModal"
      :maskClosable="false"
    >
      <a-alert banner style="margin-bottom:20px">
        <span slot="message">
          导入成功数据{{ successCount }}条，<span style="color: red">失败数据{{ failCount }}条</span>。
        </span>
      </a-alert>
      <a-upload
        class="qui-fx-ac"
        :multiple="false"
        :showUploadList="false"
        name="file"
        :data="{ fileType: 'xls' }"
        accept=".xls"
        :fileList="fileList"
        :withCredentials="true"
        :customRequest="customRequest"
        :beforeUpload="beforeUpload"
      >
        <a-button icon="upload" class="export-all-btn" style="margin: 0 10px 0 0;">重新上传</a-button>
      </a-upload>
      <table-list
        :scroll-h="400"
        :columns="columns"
        :table-list="resultObj.failData ? resultObj.failData : bindObj.failData"
      >
      </table-list>
    </a-modal>
  </div>
</template>

<script>
import hostEnv from '@config/host-env'
import axios from 'axios'
import TableList from '@c/TableList'
import { mapState, mapActions } from 'vuex'
const columns = [
  {
    title: '行号',
    width: '20%',
    dataIndex: 'rowNo'
  },
  {
    title: '学科',
    dataIndex: 'subjectName',
    width: '20%'
  },
  {
    title: '老师',
    dataIndex: 'userName',
    width: '20%'
  },
  {
    title: '手机号',
    dataIndex: 'phone',
    width: '20%'
  },
  {
    title: '原因',
    dataIndex: 'reason',
    width: '20%'
  }
]
export default {
  name: 'ImportResult',
  components: {
    TableList
  },
  props: {
    bindObj: {
      type: Object,
      default: () => {
        return {}
      }
    },
    classInfo: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      columns,
      userTag: false,
      isLoad: false,
      addVisible: false,
      title: '导入结果',
      fileList: [],
      fileUrl: '',
      resultObj: {},
      successCount: '',
      failCount: ''
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  watch: {
    bindObj() {
      this.successCount = this.bindObj.successCount
      this.failCount = this.bindObj.failCount
    }
  },
  created() {},
  methods: {
    ...mapActions('home', ['getSubject', 'bindCourse', 'editBindCourse']),
    beforeUpload(file) {
      console.log(file)
      const isZip = file.type === 'application/vnd.ms-excel'
      if (!isZip) {
        this.$message.error('请上传格式为xls的文件')
      }
      return isZip
    },
    saveFile(formData) {
      axios({
        method: 'post',
        url: `${hostEnv.protal_api_11010}/class/schedule/import/excel?schoolCode=${this.userInfo.schoolCode}&classCode=${this.classInfo.classCode}&schoolYearId=${this.classInfo.schoolYearId}&placeId=${this.classInfo.placeId}&placeName=${this.classInfo.placeName}`,
        data: formData
      }).then(res => {
        if (res.data.code === 200) {
          if (typeof res.data.data === 'string') {
            this.$message.error(res.data.data)
            return
          }
          this.resultObj = res.data.data
          this.resultObj.failData.map((ele, i) => {
            ele.id = i
          })
          this.successCount = res.data.data.successCount
          this.failCount = res.data.data.failCount
          this.fileList = []
        } else {
          this.$message.error(res.data.message)
          this.fileList = []
        }
      }) /* .catch((error) => {
        console.log(error)
        this.$message.error(error)
        this.fileList = []
      }) */
    },
    customRequest(data) {
      // 上传提交
      this.resList = []
      const formData = new FormData()
      formData.append('file', data.file)
      this.fileList = [data.file]
      this.saveFile(formData)
    },
    cancelModal() {
      this.successCount = ''
      this.failCount = ''
      this.resultObj = {}
      this.$parent.getListByClass()
    }
  }
}
</script>
<style lang="less" scoped></style>
