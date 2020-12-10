<template>
  <div class="template-type page-layout u-type-white-bg">
    <submit-form ref="form" @submit-form="submitForm" :title="title" v-model="formStatus" :form-data="formData">
    </submit-form>
    <div class="top-btn-group">
      <a-button icon="plus" class="add-btn" @click="addTemplate('新增模板分类')">模板分类</a-button>
    </div>
    <table-list :columns="columns" :table-list="templateType">
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
const formData = [
  {
    value: 'type',
    initValue: '',
    type: 'input',
    label: '分类名称',
    max: 30, // 最大长度
    placeholder: '请输入分类名称'
  }
]
const columns = [
  {
    title: '序号',
    width: '20%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '分类名称',
    dataIndex: 'name',
    width: '40%'
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: '20%'
  },
  {
    title: '操作',
    width: '20%',
    scopedSlots: {
      customRender: 'action'
    }
  }
]
export default {
  name: 'TemplateType',
  components: { TableList, SubmitForm },
  data() {
    return {
      title: '新增通知类型',
      formData,
      formStatus: false,
      columns,
      templateType: []
    }
  },
  mounted() {},
  methods: {
    addTemplate(title) {
      this.formStatus = true
      this.title = title
    },
    submitForm() {}
  }
}
</script>
<style lang="less" scoped>
.template-type {
}
</style>
