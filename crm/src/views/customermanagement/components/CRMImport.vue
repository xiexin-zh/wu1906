<template>
  <el-dialog :visible.sync="showDialog"
             :title="'導入'+crmTypeName"
             width="550px"
             :append-to-body="true"
             @close="closeView">
    <div class="dialog-body">
      <div class="sections">
        <div>一、請按照數據模板的格式準備要導入的數據。<span class="download"
                @click="download">點擊下載</span>《{{crmTypeName}}導入模板》</div>
        <div class="content content-tips">
          <div>注意事項：</div>
          <div>1、模板中的表頭名稱不能更改，表頭行不能刪除</div>
          <div>2、其中標*為必填項，必須填寫</div>
          <div>3、導入文件請勿超過20MB</div>
        </div>
      </div>
      <div class="sections">
        <flexbox align="initial">
          <div>二、</div>
          <div>請選擇數據重複時的處理方式（查重規則：【{{fieldUniqueInfo}}】）</div>
        </flexbox>
        <div class="content">
          <el-select v-model="config"
                     placeholder="請選擇">
            <el-option v-for="(item, index) in [{name: '覆蓋系統原有數據',value: 1},{name: '跳過',value: 0}]"
                       :key="index"
                       :label="item.name"
                       :value="item.value">
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="sections">
        <div>三、請選擇需要導入的文件</div>
        <div class="content">
          <flexbox class="file-select">
            <el-input v-model="file.name"
                      :disabled="true"></el-input>
            <el-button type="primary"
                       @click="selectFile">選擇文件</el-button>
          </flexbox>
        </div>
      </div>
      <div class="sections">
        <div>四、請選擇跟進人（{{crmType == 'customer' ? '如不選擇，導入的戶口將進入公海' : '必選'}}）</div>
        <div class="content">
          <div class="user-cell">
            <xh-user-cell :value="user"
                          @value-change="userSelect"></xh-user-cell>
          </div>
        </div>
      </div>
      <input type="file"
             id="importInputFile"
             accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
             @change="uploadFile">
    </div>
    <span slot="footer"
          class="dialog-footer">
      <el-button @click="closeView">取 消</el-button>
      <el-button type="primary"
                 @click="sure">確 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  crmCustomerExcelImport,
  crmCustomerExcelDownloadURL
} from '@/api/customermanagement/customer'
import {
  crmLeadsExcelImport,
  crmLeadsExcelDownloadURL
} from '@/api/customermanagement/clue'
import {
  crmContactsExcelImport,
  crmContactsExcelDownloadURL
} from '@/api/customermanagement/contacts'
import {
  crmProductExcelImport,
  crmProductExcelDownloadURL
} from '@/api/customermanagement/product'
import { adminFieldUniqueFieldAPI } from '@/api/customermanagement/common'

import { XhUserCell } from '@/components/CreateCom'
import { Loading } from 'element-ui'

export default {
  name: 'c-r-m-import', // 文件导入
  components: {
    XhUserCell
  },
  data() {
    return {
      loading: false,
      showDialog: false,
      config: 1, // 	1 覆盖，0跳过
      file: { name: '' },
      user: [],
      fieldUniqueInfo: '' // 字段验重信息
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
    crmTypeName() {
      return (
        {
          customer: '戶口',
          leads: '線索',
          contacts: '自然人',
          product: '產品'
        }[this.crmType] || ''
      )
    }
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    // CRM类型
    crmType: {
      type: String,
      default: ''
    }
  },
  watch: {
    show: function(val) {
      this.showDialog = val
    }
  },
  mounted() {
    this.user.push(this.userInfo)
    this.getFieldUniqueInfo()
  },
  methods: {
    sure() {
      var params = {}
      if (!this.file.name) {
        this.$message.error('請選擇導入文件')
      } else if (
        this.crmType != 'customer' &&
        (!this.user || this.user.length == 0)
      ) {
        this.$message.error('請選擇跟進人')
      } else {
        params.config = this.config
        params.file = this.file
        params.owner_user_id = this.user.length > 0 ? this.user[0].id : ''

        var request = {
          customer: crmCustomerExcelImport,
          leads: crmLeadsExcelImport,
          contacts: crmContactsExcelImport,
          product: crmProductExcelImport
        }[this.crmType]
        let loading = Loading.service({ fullscreen: true })
        request(params)
          .then(res => {
            loading.close()
            this.$message.success(res.data)
            this.closeView()
          })
          .catch(() => {
            loading.close()
          })
      }
    },
    // 下载模板操作
    download() {
      var a = document.createElement('a')
      a.href =
        window.BASE_URL +
        {
          customer: crmCustomerExcelDownloadURL,
          leads: crmLeadsExcelDownloadURL,
          contacts: crmContactsExcelDownloadURL,
          product: crmProductExcelDownloadURL
        }[this.crmType]
      a.target = '_black'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    },
    // 选择文件
    selectFile() {
      document.getElementById('importInputFile').click()
    },
    /** 图片选择出发 */
    uploadFile(event) {
      var files = event.target.files
      const file = files[0]
      this.file = file
      event.target.value = ''
    },
    // 用户选择
    userSelect(data) {
      if (data.value && data.value.length > 0) {
        this.user = data.value
      } else {
        this.user = []
      }
    },
    // 关闭操作
    closeView() {
      this.$emit('close')
    },
    /**
     * 获取字段验重信息
     */
    getFieldUniqueInfo() {
      adminFieldUniqueFieldAPI({ types: 'crm_' + this.crmType })
        .then(res => {
          this.fieldUniqueInfo = res.data
        })
        .catch(() => {})
    }
  }
}
</script>

<style scoped lang="scss">
.sections {
  font-size: 14px;
  .download {
    cursor: pointer;
    color: #005DF7;
  }
}

.content {
  padding: 10px 10px 10px 30px;
  .el-select {
    width: 300px;
  }
  .user-cell {
    width: 300px;
  }
}

.content-tips {
  font-size: 12px;
  color: #a9a9a9;
  line-height: 15px;
}

#importInputFile {
  display: none;
}

.file-select {
  .el-input {
    width: 300px;
  }
  button {
    margin-left: 20px;
  }
}
</style>
