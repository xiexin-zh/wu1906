<template>
  <div class="page-layout qui-fx-ver">
    <submit-form
      ref="form"
      v-if="formStatus"
      @submit-form="submitForm"
      :title="title"
      v-model="formStatus"
      :form-data="formData"
    >
      <div slot="upload">
        <upload-multi :length="1" v-model="fileList" :fileInfo="fileInfo"></upload-multi>
      </div>
    </submit-form>
    <search-form is-reset @search-form="searchForm" :search-label="searchLabel">
      <div slot="left">
        <a-button type="primary" icon="plus" @click="addApp(0)">新增应用</a-button>
      </div>
    </search-form>
    <table-list is-zoom :page-list="pageList" v-model="chooseList" :columns="columns" :table-list="userList">
      <template v-slot:totalNums="totalNum">
        <div
          :class="['table-total-num', { 'num-cursor': totalNum.record.platform !== 1 }]"
          @click="schoolDetail(totalNum.record)"
        >
          {{ totalNum.record.platform === 1 ? '平台' : totalNum.record.schoolSum }}
        </div>
      </template>
      <template v-slot:actions="action">
        <a-tooltip placement="topLeft" title="详情">
          <a-button
            size="small"
            class="detail-action-btn"
            icon="ellipsis"
            @click.stop="goDetial('/apply/detail', action)"
          ></a-button>
        </a-tooltip>
        <a-tooltip placement="topLeft" title="编辑">
          <a-button size="small" class="edit-action-btn" icon="form" @click.stop="addApp(1, action)"></a-button>
        </a-tooltip>
        <a-popconfirm placement="left" okText="确定" cancelText="取消" @confirm="delApp(action)">
          <template slot="title">您确定删除吗?</template>
          <a-tooltip placement="topLeft" title="删除">
            <a-button size="small" class="del-action-btn" icon="delete"></a-button>
          </a-tooltip>
        </a-popconfirm>
      </template>
    </table-list>
    <page-num v-model="pageList" :total="total" @change-page="showList"></page-num>
    <a-drawer
      title="关联学校列表"
      :width="720"
      placement="right"
      :closable="true"
      @close="onClose"
      :visible="visible">
      <div v-if="visible" class="qui-fx-ver" style="height: 650px">
        <table-list overFlow :page-list="schoolList" :columns="schoolColumns" :table-list="schoolData"></table-list>
        <page-num v-model="schoolList" :total="schoolTotal" @change-page="schoolApply"></page-num>
      </div>
    </a-drawer>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import TableList from '@c/TableList'
import PageNum from '@c/PageNum'
import Tools from '@u/tools'
import SubmitForm from '@c/SubmitForm'
import UploadMulti from '@c/UploadMulti'
import SearchForm from '@c/SearchForm'
const searchLabel = [
  {
    value: 'keyWord',
    type: 'input',
    label: '应用名称',
    placeholder: '请输入应用名称'
  }
]
const schoolColumns = [
  {
    title: '序号',
    width: '10%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '学校名称',
    dataIndex: 'schoolName',
    width: '30%'
  },
  {
    title: '管理员',
    dataIndex: 'userName',
    width: '30%'
  },
  {
    title: '手机号',
    dataIndex: 'mobile',
    width: '30%'
  }
]
const columns = [
  {
    title: '序号',
    width: '5%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '应用名称',
    dataIndex: 'appName',
    width: '20%'
  },
  // {
  //   title: '应用路径',
  //   dataIndex: 'linkUrl',
  //   width: '10%'
  // },
  {
    title: '业务地址',
    dataIndex: 'bussUrl',
    width: '25%'
  },
  // {
  //   title: '终端类型',
  //   dataIndex: 'plateformType',
  //   width: '8%',
  //   customRender: text => {
  //     if (text === 1) {
  //       return '手机'
  //     } else {
  //       return 'PC'
  //     }
  //   }
  // },
  {
    title: 'logo',
    dataIndex: 'logoUrl',
    width: '10%',
    scopedSlots: {
      customRender: 'snapPic'
    }
  },
  {
    title: '关联学校',
    width: '10%',
    scopedSlots: {
      customRender: 'totalNum'
    }
  },
  {
    title: '备注',
    dataIndex: 'remark',
    width: '10%'
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: '10%',
    customRender: text => {
      return Tools.getDate(text).substring(0, 10)
    }
  },
  {
    title: '操作',
    width: '10%',
    scopedSlots: {
      customRender: 'action'
    }
  }
]
const formData = [
  {
    value: 'appName',
    initValue: '',
    type: 'input',
    label: '应用名称',
    placeholder: '请输入应用名称'
  },
  {
    value: 'appCode',
    initValue: '',
    type: 'input',
    label: '应用编码',
    placeholder: '请输入应用编码',
    disabled: false
  },
  {
    value: 'linkUrl',
    initValue: '',
    type: 'input',
    label: '应用路径',
    placeholder: '请输入应用路径(必须以/开头)',
    regular: 'file'
  },
  // {
  //   value: 'plateformType',
  //   initValue: [],
  //   list: [
  //     {
  //       key: 1,
  //       val: '手机'
  //     },
  //     {
  //       key: 2,
  //       val: 'PC '
  //     }
  //   ],
  //   type: 'select',
  //   label: '终端类型',
  //   placeholder: '请选择终端类型'
  // },
  {
    value: 'platform',
    initValue: 0,
    list: [
      {
        key: 0,
        val: '否'
      },
      {
        key: 1,
        val: '是'
      }
    ],
    type: 'radio',
    label: '平台应用',
    placeholder: '请选择是否是平台应用'
  },
  {
    type: 'upload',
    label: '应用Logo'
  },
  {
    value: 'bussUrl',
    initValue: '',
    type: 'input',
    label: '业务地址',
    placeholder: '请输入业务地址',
    required: false,
    regular: 'url'
  },
  {
    value: 'remark',
    initValue: '',
    type: 'input',
    label: '备注',
    required: false, // 默认为true，不用填写
    placeholder: '请输入备注'
  }
]
export default {
  name: 'ApplyManageCom',
  props: {
    plateformType: {
      type: String,
      default: '2'
    }
  },
  components: {
    TableList,
    PageNum,
    SubmitForm,
    UploadMulti,
    SearchForm
  },
  data() {
    return {
      searchLabel,
      fileInfo: {
        tip: '上传图片',
        h: 120, // 高度
        w: 120 // 宽度
      },
      fileList: [],
      title: '新增应用',
      formStatus: false,
      formData,
      chooseList: [],
      columns,
      total: 0,
      pageList: {
        page: 1,
        size: 20
      },
      userList: [],
      keyWord: '',
      applyId: '',
      visible: false,
      height: 500,
      schoolList: {
        page: 1,
        size: 20
      },
      schoolTotal: 0,
      schoolData: [],
      schoolColumns,
      appId: ''
    }
  },
  mounted() {
    this.showList()
  },
  methods: {
    ...mapActions('home', ['getApply', 'delApply', 'addApply', 'updateApply', 'getApplySchool']),
    searchForm(values) {
      this.keyWord = values.keyWord
      this.pageList.page = 1
      this.showList()
    },
    async submitForm(values) {
      if (this.fileList.length === 0) {
        this.$message.warning('请上传图片')
        this.$refs.form.error()
        return
      }
      try {
        values.logoUrl = this.fileList[0].url
        values.plateformType = this.plateformType
        if (this.title === '编辑应用') {
          values.id = this.applyId
          await this.updateApply(values)
        } else {
          await this.addApply(values)
        }
        this.$message.success('操作成功')
        this.$tools.goNext(() => {
          this.$refs.form.reset()
          this.showList()
        })
      } catch (err) {
        this.$refs.form.error()
      }
    },
    addApp(type, record) {
      this.formStatus = true
      if (type) {
        this.title = '编辑应用'
        this.formData = this.$tools.fillForm(formData, record.record)
        this.fileList = [{ url: record.record.logoUrl }]
        this.applyId = record.record.id
        this.formData[1].disabled = true
        this.formData[3].disabled = true
      } else {
        this.title = '新增应用'
        this.formData = formData
        this.fileList = []
        if (this.plateformType === '1') {
          this.formData[3].disabled = true
        } else {
          this.formData[3].disabled = false
        }
      }
    },
    // 删除菜单
    delApp(record) {
      this.delApply(record.record.id).then(res => {
        this.$message.success('删除成功')
        this.$tools.goNext(() => {
          this.showList()
        })
      })
    },
    // 应用库列表
    async showList() {
      this.pageList.keyWord = this.keyWord
      this.pageList.plateformType = this.plateformType
      const res = await this.getApply(this.pageList)
      this.userList = res.data.list
      this.total = res.data.total
    },
    goDetial(path, record) {
      this.$router.push({
        path: path,
        query: {
          id: record.record.id,
          plateformType: record.record.plateformType,
          platform: parseInt(record.record.platform)
        }
      })
    },
    schoolDetail(record) {
      if (record.platform !== 1) {
        this.visible = true
        this.appId = record.id
        this.schoolApply()
      }
    },
    async schoolApply() {
      this.schoolList.appId = this.appId
      const res = await this.getApplySchool(this.schoolList)
      this.schoolData = res.data.list
      this.schoolTotal = res.data.total
    },
    onClose() {
      this.visible = false
    }
  }
}
</script>
<style lang="less" scoped>
.num-cursor {
  cursor: pointer;
}
</style>
