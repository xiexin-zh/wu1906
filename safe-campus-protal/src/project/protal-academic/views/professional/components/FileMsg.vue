<template>
  <div class="file-msg">
    <div class="file-upload">
      <span class="title qui-fx-ac">附件：</span>
      <div class="qui-fx">
        <a-upload
          class="qui-fx qui-fx-ac"
          :multiple="false"
          name="file"
          accept=".doc,.docx,.xls,.xlsx"
          :fileList="fileList"
          :withCredentials="true"
          :customRequest="customRequest"
          :beforeUpload="beforeUpload"
        >
          <a-button style="margin-right: 20px" type="primary">
            <a-icon type="upload" /> 选择文件
          </a-button>
        </a-upload>
      </div>
      <span>说明：文件只能上传doc、docx、xls、xlsx格式，且大小不能超过10M</span>
    </div>
    <div class="file-list">
      <div class="list-item" v-for="item in fileData" :key="item.id">
        <div class="file-name">
          <img src="../../../assets/img/file.png" alt="" />
          <span @click="downFile(item.fileUrl)">{{ `${item.fileName} (${item.fileSize}KB)` }}</span>
        </div>
        <div class="file-del" @click="delFile(item.id)">
          <a-icon type="close" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Tools from '@/utils/tools'
import axios from 'axios'
import hostEnv from '@config/host-env'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'FileMsg',
  components: {},
  props: {
    programId: {
      required: true
    }
  },
  data() {
    return {
      fileList: [],
      fileUrl: '',
      fileData: []
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  created() {
    this.fileUrl = `${hostEnv.ljj_people}/student/manage/batch/import`
    this.showList()
  },
  mounted() {},
  methods: {
    ...mapActions('home', ['getSchemeFile', 'delSchemeFile', 'saveSchemeFile']),
    beforeUpload(file) {
      if (this.fileData.length >= 5) {
        this.$message.warning('最多支持上传5份文件')
        return false
      }
      const { size, name } = file
      const index = name.lastIndexOf('.')
      const ext = name.substr(index + 1)
      if (ext !== 'doc' && ext !== 'docx' && ext !== 'xls' && ext !== 'xlsx') {
        this.$message.error('文件只能上传doc、docx、xls、xlsx格式')
        return false
      }
      if (typeof size !== 'number' || size > 10 * 1024 * 1024) {
        this.$message.error('文件大小限制在10M内')
        return false
      }
      return true
    },
    customRequest(data) {
      // 上传提交
      const { name, size } = data.file
      const index = name.lastIndexOf('.')
      const type = name.substr(index + 1)
      Tools.ossUpload(this.userInfo.schoolCode, data.file, type, async res => {
        const req = {
          fileName: name,
          fileType: type,
          fileUrl: res.data.url,
          schemeId: this.programId,
          fileSize: parseInt(size / 1024)
        }
        await this.saveSchemeFile(req)
        this.showList()
      })
    },
    async showList() {
      const res = await this.getSchemeFile({ schemeId: this.programId })
      if (res && res.code === 200) {
        this.fileData = res.data
      }
    },
    downFile(url) {
      window.open(url)
    },
    async delFile(id) {
      await this.delSchemeFile(id)
      this.showList()
    }
  }
}
</script>

<style lang="less" scoped>
.file-msg {
  padding: 20px;
  box-sizing: border-box;
}
.file-upload {
  display: flex;
  justify-content: flex-start;
  justify-items: center;
}
.file-list {
  display: flex;
  flex-direction: column;
  padding-top: 20px;
  padding-left: 50px;
  box-sizing: border-box;

  .list-item {
    width: 40%;
    display: flex;
    padding: 5px;
    border-bottom: 1px solid #f5f5f5;

    .file-name {
      flex: 1;

      img {
        width: 14px;
        height: 14px;
        margin-right: 20px;
      }
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
