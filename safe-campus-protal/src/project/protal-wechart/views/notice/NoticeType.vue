<template>
  <div class="notice-type page-layout u-type-white-bg">
    <submit-form ref="form" @submit-form="submitForm" :title="title" v-model="formStatus" :form-data="formData">
      <div slot="upload">
        <upload-multi :length="3" v-model="fileList" :fileInfo="fileInfo"></upload-multi>
      </div>
    </submit-form>
    <div class="top-btn-group">
      <a-button icon="plus" class="add-btn" @click="addNoticeType('新增通知类型')">通知类型</a-button>
    </div>
    <table-list :columns="columns" :table-list="noticeTypeList">
      <template v-slot:actions="action">
        <a-tooltip placement="topLeft" title="编辑">
          <a-button size="small" class="edit-action-btn" icon="form"></a-button>
        </a-tooltip>
        <a-popconfirm placement="left" okText="确定" cancelText="取消" @confirm="del">
          <template slot="title">您确定删除吗?</template>
          <a-tooltip placement="topLeft" title="删除">
            <a-button size="small" class="del-action-btn" icon="delete"></a-button>
          </a-tooltip>
        </a-popconfirm>
      </template>
    </table-list>
  </div>
</template>

<script>
import SubmitForm from '@c/SubmitForm'
import TableList from '@c/TableList'
import UploadMulti from '@c/UploadMulti'
const formData = [
  {
    value: 'type',
    initValue: '',
    type: 'input',
    label: '通知类型',
    max: 30, // 最大长度
    placeholder: '请输入通知类型'
  },
  {
    value: 'user',
    initValue: '',
    type: 'input',
    label: '通知用途',
    placeholder: '请输入通知用途'
  },
  {
    value: 'userName',
    initValue: '',
    type: 'input',
    label: '通知简述',
    placeholder: '请输入通知简述'
  },
  {
    type: 'upload',
    label: '上传图标'
  }
]
const columns = [
  {
    title: '序号',
    width: '10%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '通知图标',
    dataIndex: 'photo',
    width: '20%',
    scopedSlots: {
      customRender: 'snapPic'
    }
  },
  {
    title: '通知类型',
    dataIndex: 'age',
    width: '20%'
  },
  {
    title: '通知用途',
    dataIndex: 'depart',
    width: '20%'
  },
  {
    title: '用途简述',
    dataIndex: 'phone',
    width: '20%'
  },
  {
    title: '操作',
    width: '10%',
    scopedSlots: {
      customRender: 'action'
    }
  }
]
export default {
  name: 'NoticeType',
  components: { TableList, SubmitForm, UploadMulti },
  data() {
    return {
      fileInfo: {
        url: '/upload/base/file/freeUpload', // 接口地址
        tip: '上传图片',
        h: 120, // 高度
        w: 120 // 宽度
      },
      fileList: [],
      title: '新增通知类型',
      formData,
      formStatus: false,
      columns,
      noticeTypeList: []
    }
  },
  mounted() {},
  methods: {
    addNoticeType(title) {
      this.formStatus = true
      this.title = title
    },
    submitForm(values) {}
  }
}
</script>
<style lang="less" scoped>
.notice-type {
}
</style>
