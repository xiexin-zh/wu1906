<template>
  <div class="record page-layout qui-fx-ver">
    <a-modal
      :title="whiteTitle"
      :visible="whiteForm"
      :maskClosable="false"
      :destroyOnClose="true"
      :confirmLoading="confirmLoading"
      width="650px"
      @ok="submitWhiteForm"
      @cancel="addWhiteCancel"
    >
      <a-form :form="form">
        <a-form-item label="有效期至" :label-col="{ span: 5 }" :wrapper-col="{ span: 18 }">
          <a-date-picker
            format="YYYY-MM-DD HH:mm:ss"
            showTime
            v-decorator="[
              'expirationTime',
              {
                initialValue: expirationTime,
                rules: [{ required: true, message: '请选择有效期' }]
              }
            ]"
            placeholder="请选择有效期"
          />
        </a-form-item>
        <a-form-item label="原因" :label-col="{ span: 5 }" :wrapper-col="{ span: 18 }">
          <a-input
            v-decorator="['reason', { initialValue: reason, rules: [{ required: true, message: '请输入原因' }] }]"
            placeholder="请输入原因"
          />
        </a-form-item>
      </a-form>
    </a-modal>
    <submit-form
      :title="blackTitle"
      ref="blackForm"
      v-model="blackForm"
      :form-data="addBlackCause"
      @submit-form="submitForm"
    >
    </submit-form>
    <!-- <submit-form :title="whiteTitle" ref="whiteForm" v-model="whiteForm" :form-data="addWhiteCause" @submit-form="submitForm">
    </submit-form> -->
    <search-form isReset @search-form="search" :search-label="searchLabel">
      <a-button type="primary" slot="left" @click.stop="handleTplDownload">导出</a-button>
    </search-form>
    <div id="table" class="qui-fx-f1">
      <div style="position: absolute; width: 100%; height: 100%;">
        <a-table
          :scroll="{ y: this.$tools.setScroll('table') }"
          :pagination="false"
          :rowKey="record => record.id"
          :columns="columns"
          :dataSource="recordList"
        >
          <template slot="index" slot-scope="text, record, index">
            <span>{{ (pageList.page - 1) * pageList.size + (index + 1) }}</span>
          </template>
          <template slot="buildingName" slot-scope="text, record">
            <span>{{ record.buildingName }} {{ record.floorName }}</span>
          </template>
          <template slot="invasionTime" slot-scope="invasionTime">
            <span>{{ getDateTime(invasionTime, 1) }}</span>
          </template>
          <template slot="snapSrc" slot-scope="snapSrc">
            <a-popover placement="left">
              <template slot="content">
                <img :src="snapSrc" alt="" style="height:300px;width:300px" />
              </template>
              <div class="person-bg-img">
                <img :src="snapSrc" class="photo-bg-img" alt="" />
              </div>
            </a-popover>
          </template>
          <template slot="photoSrc" slot-scope="photoSrc">
            <div class="person-bg-img">
              <img :src="photoSrc" class="photo-bg-img" alt="" />
            </div>
          </template>
          <template slot="action" slot-scope="text, record">
            <a-tag v-if="record.userType === '0'" color="#f50" @click="addUser(1, record)">加黑名单</a-tag>
            <a-tag v-if="record.userType === '2' || record.userType === '3'" @click="addUser(0, record)" color="#108ee9"
              >加白名单</a-tag
            >
          </template>
        </a-table>
      </div>
    </div>
    <page-num v-model="pageList" :total="total" @change-page="showTableList"></page-num>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import mixins from '@u/mixins'
import invadeTable from '../../assets/js/table/invadeTable'
import SearchForm from '@c/SearchForm'
import PageNum from '../components/common/PageNum'
import SubmitForm from '../components/common/SubmitForm'
import hostEnv from '@config/host-env'
import moment from 'moment'
const addBlackCause = [
  {
    value: 'reason',
    initValue: '',
    type: 'input',
    label: '原因',
    required: true,
    placeholder: '请输入添加黑名单原因'
  }
]
const userInfo = {
  schoolCode: window.sessionStorage.getItem('schoolScheme'),
  createUserCode: JSON.parse(sessionStorage.getItem('loginInfo')).userCode,
  createUserName: JSON.parse(sessionStorage.getItem('loginInfo')).userName
}

export default {
  name: 'Record',
  components: {
    PageNum,
    SearchForm,
    SubmitForm
  },
  mixins: [mixins],
  data() {
    return {
      moment,
      expirationTime: moment(new Date(new Date()), 'YYYY-MM-DD HH:mm:ss').add(1, 'day'),
      reason: '',
      form: this.$form.createForm(this),
      confirmLoading: false,
      addBlackCause,
      userInfo,
      blackForm: false,
      whiteForm: false,
      blackTitle: '添加黑名单',
      whiteTitle: '添加白名单',
      choosePeople: {},
      columns: invadeTable,
      searchLabel: [
        {
          value: 'userName',
          type: 'input',
          label: '姓名',
          placeholder: '请输入姓名'
        },
        {
          value: 'areaKey',
          type: 'input',
          label: '地点',
          placeholder: '请输入入侵地点'
        },
        {
          list: [
            {
              key: '',
              val: '全部'
            },
            {
              key: '0',
              val: '陌生人'
            },
            {
              key: '1',
              val: '黑名单'
            },
            {
              key: '2',
              val: '学生'
            }
          ],
          value: 'userType',
          type: 'select',
          label: '身份'
        }
      ],
      pageList: {
        page: 1,
        size: 20
      },
      formData: {
        schoolCode: window.sessionStorage.getItem('schoolScheme'),
        userName: '',
        areaKey: '',
        userType: '',
        status: ''
      },
      total: 0,
      recordList: []
    }
  },
  methods: {
    ...mapActions('invadeRecord', ['getInvasionList', 'addList', 'exportInvasion']),
    async showTableList() {
      const res = await this.getInvasionList({
        ...this.formData,
        ...this.pageList
      })
      this.total = res.data.total
      this.recordList = res.data.list
    },
    search(val) {
      this.formData = {
        ...this.formData,
        ...val
      }
      this.showTableList()
    },
    addUser(type, record) {
      if (type) {
        // 加入黑名单
        record.photoList = [record.snapSrc]
        this.blackForm = true
      } else {
        // 加入白名单
        record.photoList = [record.photoSrc]
        this.whiteForm = true
      }
      this.choosePeople = record
    },
    submitWhiteForm(e) {
      e.preventDefault()
      this.form.validateFields((err, value) => {
        if (!err) {
          value.expirationTime = moment(value.expirationTime).format('YYYY-MM-DD HH:mm:ss')
          value.listType = '0'
          /* value.sysSourceCode = localStorage.getItem('appCode')
          value.sysSourceName = localStorage.getItem('appName') */
          this.addList({
            ...this.userInfo,
            ...this.choosePeople,
            ...value
          })
            .then(res => {
              this.$message.success('操作成功')
              this.whiteForm = false
              this.confirmLoading = false
              this.$tools.goNext(() => {
                this.showTableList()
              })
            })
            .catch(() => {
              this.confirmLoading = false
            })
        } else {
          this.confirmLoading = false
        }
      })
    },
    async submitForm(values) {
      values.listType = '1'
      /* values.sysSourceCode = localStorage.getItem('appCode')
      values.sysSourceName = localStorage.getItem('appName') */
      await this.addList({
        ...this.userInfo,
        ...this.choosePeople,
        ...values
      })
      this.$message.success('操作成功')
      this.blackForm = false
      this.$refs.blackForm.confirmLoading = false
      this.$tools.goNext(() => {
        this.showTableList()
      })
    },
    async handleExport() {
      // 导出
      const req = {
        schoolCode: window.sessionStorage.getItem('schoolScheme')
      }
      await this.exportInvasion({
        ...req
      })
    },
    handleTplDownload() {
      var url = `${hostEnv.protal_api_11006}/dorm/invasion/record/export/list`
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
      xhr.send(JSON.stringify({ schoolCode: window.sessionStorage.getItem('schoolScheme') }))
    },
    addWhiteCancel() {
      this.whiteForm = false
    }
  },
  mounted() {
    this.showTableList()
  }
}
</script>

<style lang="less" scoped>
.record {
  height: 100%;
}
.search-form {
  margin-top: 0px;
  height: auto;
}
.pagination-com {
  padding: 0;
}
.ant-calendar-picker {
  width: 100% !important;
}
</style>
