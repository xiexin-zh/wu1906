<template>
  <div class="page-layout safetyExercises qui-fx-ver">
    <search-form is-reset @search-form="searchForm" :search-label="exrcisesPageSearchLabel">
      <div slot="right">
        <a-button icon="del" class="add-action-btn u-mar-l10" @click="delAll">批量删除</a-button>
        <a-button icon="del" class="add-action-btn " @click="downTemplate">下载模板</a-button>
        <a-button icon="plus" class="add-action-btn " @click="add(0)">添加习题</a-button>
        <a-button icon="del" class="add-action-btn " @click="exportExerci">导出</a-button>
        <a-upload
          style="width: 50px;"
          :multiple="false"
          name="file"
          :customRequest="customRequest"
          :showUploadList="false"
        >
          <!-- :showUploadList="true" -->
          <!-- :fileList="fileList" -->
          <!-- accept=".xls" -->
          <!-- :data="{ fileType: 'xls' }" -->
          <a-button type="primary">导入</a-button>
        </a-upload>
      </div>
    </search-form>
    <table-list
      is-check
      is-zoom
      v-model="chooseList"
      :page-list="pageList"
      :columns="exercisePageListColumns"
      :table-list="findList"
    >
      <template v-slot:actions="action">
        <a-tooltip placement="topLeft" title="编辑">
          <a-button size="small" class="edit-action-btn" icon="form" @click="add(1, action.record)"></a-button>
        </a-tooltip>
        <a-popconfirm placement="topLeft" ok-text="确定" cancel-text="取消" @confirm="delTask(action.record)">
          <template slot="title">
            确定删除该任务吗？
          </template>
          <a-tooltip placement="topLeft" title="删除">
            <a-button size="small" class="del-action-btn" icon="delete"></a-button>
          </a-tooltip>
        </a-popconfirm>
      </template>
    </table-list>
    <page-num v-if="total" v-model="pageList" :total="total" @change-page="showList"></page-num>
  </div>
</template>
<script>
import hostEnv from '@config/host-env'
import { mapState, mapActions } from 'vuex'
import TableList from '@c/TableList'
import PageNum from '@c/PageNum'
import SearchForm from '@c/SearchForm'
import { exrcisesPageSearchLabel } from '../../../assets/js/searchLabel.js'
import { exercisePageListColumns } from '../../../assets/js/tableColumns'
export default {
  name: 'SafetyExercises',
  components: {
    TableList,
    PageNum,
    SearchForm
  },
  inject: ['reload'],
  data() {
    return {
      exercisePageListColumns,
      exrcisesPageSearchLabel,
      total: 0,
      pageList: {
        page: 1,
        size: 20
      },
      findList: [],
      chooseList: [], // 当有选择项时，被选中的项，返回每项的唯一id
      searchList: {},
      fileList: []
    }
  },
  computed: {
    ...mapState('home', ['userInfo', 'eduCode'])
  },
  created() {
    this.showList()
  },
  methods: {
    ...mapActions('home', ['ecsPage', 'ecsRemove', 'ecsRemoveAll', 'ecsImport', 'ecsExport', 'ecsDownload']),
    async showList() {
      const req = {
        source: '2',
        ...this.pageList,
        ...this.searchList,
        userCode: this.userInfo.userCode,
        schoolCode: this.userInfo.schoolCode
      }
      const res = await this.ecsPage(req)
      this.findList = res.data.records
      this.total = res.data.total
    },
    searchForm(values) {
      this.searchList = values
      this.showList()
    },
    // 导出
    async exportExerci() {
      const req = {
        ...this.searchList,
        schoolCode: this.userInfo.schoolCode,
        source: '2'
      }
      if (this.chooseList.length === 0) {
        this.ecsExport(req)
      } else {
        this.ecsExport({ ...req, ids: this.chooseList })
      }
    },
    // 导出调接口
    ecsExport(req) {
      var url = `${hostEnv.protal_api_8091}/class/exercises/export`
      var xhr = new XMLHttpRequest()
      xhr.open('POST', url, true) // 也可以使用POST方式，根据接口
      xhr.responseType = 'blob'
      xhr.onload = function() {
        if (this.status === 200) {
          var content = this.response
          var aTag = document.createElement('a')
          var blob = new Blob([content])
          var headerName = xhr.getResponseHeader('Content-disposition')
          var fileName = decodeURIComponent(headerName).substring(20)
          aTag.download = fileName
          aTag.href = URL.createObjectURL(blob)
          aTag.click()
          URL.revokeObjectURL(blob)
        }
      }
      xhr.send(JSON.stringify(req))
    },
    // 下载模板
    async downTemplate() {
      window.location.href = `${hostEnv.protal_api_8091}/class/exercises/download`
    },
    // 导入文件
    beforeUpload(file) {
      const isZip = file.type === 'application/vnd.ms-excel'
      if (!isZip) {
        this.$message.error('请上传格式为xls的文件')
      }
      return isZip
    },
    customRequest(data) {
      // 上传提交
      this.resList = []
      const formData = new FormData()
      formData.append('file', data.file)
      formData.append('code', this.userInfo.schoolCode)
      formData.append('source', '2')
      this.fileList = [data.file]
      this.saveFile(formData)
    },
    async saveFile(formData) {
      await this.ecsImport(formData)
      this.$message.success('导入成功')
      this.showList()
    },
    async delTask(record) {
      await this.ecsRemove(record.id)
      this.showList()
    },
    async delAll() {
      if (this.chooseList.length <= 0) return
      const that = this
      this.$confirm({
        title: '提示',
        content: '确定删除该任务吗?',
        onOk() {
          that.ecsRemoveAll(that.chooseList).then(res => {
            that.$message.success('操作成功')
            that.chooseList = []
            that.showList()
          })
        },
        onCancel() {}
      })
    },
    add(type, record) {
      this.$router.push({
        path: '/safeClassLocal/addExercises',
        query: {
          id: record ? record.id : '',
          type: type
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.safetyExercises {
  height: 100%;
  width: 100%;
}
</style>
