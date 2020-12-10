<template>
  <div class="page-layout qui-fx-ver">
    <submit-form ref="form" @submit-form="submitForm" :title="title" v-model="formStatus" :form-data="formData">
      <div slot="upload">
        <upload-multi :length="3" v-model="fileList" :fileInfo="fileInfo" ></upload-multi>
      </div>
    </submit-form>
    <search-form @search-form="searchForm" :search-label="searchLabel">
      <div slot="left">
        <a-button icon="plus" type="primary" @click="addApp(0)">新增服务器</a-button>
      </div>
    </search-form>
    <no-data msg="暂无应用列表" v-if="false">
      <div slot="btn">
        <a-button type="primary">添加应用</a-button>
      </div>
    </no-data>
    <table-list
      is-check
      is-zoom
      @clickRow="clickRow"
      :page-list="pageList"
      v-model="chooseList"
      :columns="columns"
      :table-list="userList">
      <template v-slot:actions="action">
        <a-tag @click.stop="addApp(1, action)">编辑</a-tag>
        <a-tag color="#f50" @click.stop="delServer(action)">删除</a-tag>
      </template>
    </table-list>
    <page-num v-model="pageList" :total="total" @change-page="showList"></page-num>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import TableList from '@c/TableList'
import PageNum from '@c/PageNum'
import SubmitForm from '@c/SubmitForm'
import UploadMulti from '@c/UploadMulti'
import SearchForm from '@c/SearchForm'
import NoData from '@c/NoData'
const searchLabel = [
  {
    value: 'name',
    type: 'input',
    label: '学校名称',
    placeholder: '请输入学校名称'
  },
  {
    value: 'name',
    type: 'input',
    label: '摄像机编号',
    placeholder: '请输入摄像机编号'
  },
  {
    value: 'name',
    type: 'input',
    label: '安装位置',
    placeholder: '请输入安装位置'
  },
  {
    list: [ // 选择列表项，select控件必传
      {
        key: '',
        val: '全部'
      },
      {
        key: 1,
        val: '开启'
      },
      {
        key: 2,
        val: '关闭'
      }
    ],
    value: 'status',
    type: 'select',
    label: '在线状态'
  }
]
const columns = [
  {
    title: '序号',
    width: '6%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '学校名称',
    dataIndex: 'schoolName',
    width: '8%'
  },
  {
    title: '服务器编码',
    dataIndex: 'serverCode',
    width: '8%'
  },
  {
    title: '服务器型号',
    dataIndex: 'serverModel',
    width: '8%'
  },
  {
    title: '安装日期',
    dataIndex: 'createDate',
    width: '8%'
    // customRender: (text) => {
    //   return `${text[0]}`
    // }
  },
  {
    title: '安装位置',
    dataIndex: 'site',
    width: '8%'
  },
  {
    title: 'IP地址',
    dataIndex: 'ip',
    width: '8%'
  },
  {
    title: '在线状态',
    dataIndex: 'state',
    width: '8'
    // customRender: (text) => {
    //   if (text === 1) {
    //     return '在线'
    //   } else {
    //     return '离线'
    //   }
    // }
  },
  {
    title: '状态更新时间',
    dataIndex: 'updateDate',
    width: '10%'
    // customRender: (text) => {
    //   return `${text[0]}`
    // }
  },
  {
    title: '学校管理员',
    dataIndex: 'schoolAdmin',
    width: '8%'
  },
  {
    title: '平台运维员',
    dataIndex: 'serverAdmin',
    width: '8%'
  },
  {
    title: '操作',
    width: '8%',
    scopedSlots: {
      customRender: 'action'
    }
  }
]
const formData = [
  {
    value: 'userName',
    initValue: '',
    type: 'input',
    label: '摄像机编号',
    placeholder: '请输入摄像机编号'
  },
  {
    value: 'userName',
    initValue: '',
    type: 'input',
    label: '摄像机型号',
    placeholder: '请输入摄像机型号'
  },
  {
    value: 'birthday',
    type: 'singleTime',
    label: '安装日期',
    initValue: '',
    placeholder: '请选择安装日期'
  },
  {
    value: 'userName',
    initValue: '',
    type: 'input',
    label: '安装位置',
    placeholder: '请输入安装位置'
  },
  {
    value: 'userName',
    initValue: '',
    type: 'input',
    label: 'IP地址',
    placeholder: '请输入IP地址'
  },
  {
    value: 'sex',
    initValue: [],
    list: [
      {
        key: 1,
        val: '男'
      },
      {
        key: 2,
        val: '女'
      },
      {
        key: 3,
        val: '未知'
      }
    ],
    type: 'select',
    label: '所属学校',
    placeholder: '请选择所属学校'
  },
  {
    value: 'userName',
    initValue: '',
    type: 'input',
    label: '平台运维',
    placeholder: '请输入平台运维'
  },
  {
    value: 'userName',
    initValue: '',
    type: 'input',
    label: '备注',
    placeholder: '请输入备注',
    required: false // 默认为true，不用填写
  }
]
export default {
  name: 'Serve',
  components: {
    NoData,
    TableList,
    PageNum,
    SubmitForm,
    UploadMulti,
    SearchForm
  },
  data () {
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
      userList: []
    }
  },
  mounted () {
    this.showList()
  },
  methods: {
    ...mapActions('home', [
      'getServer'
    ]),
    searchForm (values) {
      console.log(values)
    },
    submitForm (values) {
      console.log(values)
      setTimeout(() => {
        this.$refs.form.reset()
      }, 2000)
    },
    addApp (type, record) {
      this.formStatus = true
      if (type) {
        this.formData = this.$tools.fillForm(formData, record.record)
      } else {
        this.formData = formData
      }
    },
    deleteList () {
      if (this.chooseList.length === 0) {
        this.$message.warning('请选择删除项')
        return
      }
      this.$tools.delTip('确定删除吗?', () => {
      })
    },
    async showList () {
      const res = await this.getServer(this.pageList)
      this.userList = res.data
      this.total = res.total
    },
    clickRow (id) {
      console.log(id)
    },
    delServer (record) {
      this.$tools.delTip('确定删除该应用吗?', () => {

      })
    }
  }
}
</script>
<style lang="less" scoped>
</style>
