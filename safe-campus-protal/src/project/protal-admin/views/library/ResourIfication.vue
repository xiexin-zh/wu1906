<template>
  <div class="resour-ification page-layout bg-fff u-padd-30">
    <a-button class="u-mar-b10" type="primary" @click="addClass('0')">
      <a-icon type="plus" />添加分类
    </a-button>
    <a-table
      bordered
      :columns="columns"
      :data-source="treeData"
      :rowKey="(record, index) => record.key"
      :pagination="false"
      :scroll="{ y: 540 }"
    >
      <!-- :expandedRowKeys="expandedRowKeys" -->
      <template slot="categoryName" slot-scope="record">
        <a-icon slot="icon" type="carry-out"/>{{ record.categoryName }}
      </template>
      <template slot="operating" slot-scope="record">
        <a herf='#' class="u-type-primary" v-if="!record.parentId" @click="addClass('1',record)" >添加子类</a>
        <a herf='#'  class="u-mar-l40 u-type-primary" @click="addClass('2',record)">编辑</a>
        <a-popconfirm
          placement="topLeft"
          ok-text="确定"
          cancel-text="取消"
          @confirm="del(record)">
          <template slot="title">
            确定删除该任务吗？
          </template>
          <a-tooltip placement="topLeft" title="删除">
            <a herf='#' class="red u-mar-l40" style="color:'#fa3534'" >删除</a >
          </a-tooltip>
        </a-popconfirm>
      </template>
    </a-table>
    <submit-form
      ref="form"
      @submit-form="submitForm"
      :title="title"
      v-model="formStatus"
      :form-data="FormData"
    >
    </submit-form>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import SubmitForm from '@c/SubmitForm'
const columns = [
  {
    title: '名字',
    key: 'categoryName',
    // dataIndex: 'categoryName',
    scopedSlots: { customRender: 'categoryName' }
  },

  {
    title: '操作',
    width: '30%',
    align: 'right',
    scopedSlots: { customRender: 'operating' }
  }
]

const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
  },
  onSelect: (record, selected, selectedRows) => {
    console.log(record, selected, selectedRows)
  },
  onSelectAll: (selected, selectedRows, changeRows) => {
    console.log(selected, selectedRows, changeRows)
  }
}
export default {
  name: 'ResourIfication',
  components: {
    SubmitForm
  },
  data() {
    return {
      rowSelection,
      columns,
      title: '',
      formStatus: false,
      FormData: [
        {
          value: 'name',
          initValue: '',
          type: 'input',
          label: '分类名称',
          placeholder: '请填输入分类名称',
          minRows: 2,
          maxRows: 6,
          max: 100
        }
      ],
      treeData: [],
      expandedRowKeys: [],
      type: '', // 0添加父类, 1添加子类 ,3修改分类名字
      parentId: '',
      id: ''
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  mounted() {
  },
  async created() {
    await this.showList()
  },
  watch: {
  },
  methods: {
    ...mapActions('home', [
      'treeView',
      'adminAddParent',
      'adminAddSon',
      'adminDel',
      'modifyName'
    ]),
    setKey(arr) {
      arr.forEach(i => {
        i.key = i.parentId + i.id + Math.random()
        if (i.children && i.children.length > 0) {
          this.setKey(i.children)
        }
      })
      return arr
    },
    async showList() {
      const res = await this.treeView()
      this.treeData = this.setKey(res.data)
    },
    addClass(type, data) {
      this.formStatus = true
      this.type = type
      if (this.type === '2') {
        this.title = '编辑分类'
        this.id = data.id
        console.log(this.$tools.fillForm(this.FormData, data))
        data.name = data.categoryName
        this.FormData = this.$tools.fillForm(this.FormData, data)
      } else {
        this.parentId = data.id || ''
        this.title = '添加分类'
      }
    },
    async del(record) {
      if (record.children && record.children.length > 0) {
        return this.$message.error('请先删子类')
      }
      await this.adminDel(record.id)
      this.$message.success('操作成功')
      this.showList()
    },
    async submitForm(values) {
      if (this.type === '0') {
        await this.adminAddParent({ query: values.name })
      } else if (this.type === '1') {
        await this.adminAddSon({ name: values.name, parentId: this.parentId })
      } else if (this.type === '2') {
        await this.modifyName({ name: values.name, id: this.id })
      }
      this.$refs.form.error()
      this.formStatus = false
      this.$message.success('操作成功')
      this.$tools.goNext(() => {
        this.showList()
        this.$refs.form.reset()
      })
    }
  }
}
</script>
<style lang="less">
@deep: ~'>>>';
.resour-ification{
  .ant-table-thead > tr > th{
     background-color: #ecf5ff !important;
   }
}
</style>
