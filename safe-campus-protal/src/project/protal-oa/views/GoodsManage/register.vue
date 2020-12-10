<template>
  <div class="page-layout place-manage">
    <div class="place-left">
      <submit-form ref="form" @submit-form="submitForm" :title="title" v-model="formStatus" :form-data="formData">
      </submit-form>
      <a-button icon="plus" class="add-btn" @click="addType(0)">添加物品类别</a-button>
      <table-list
        is-radio
        @clickRow="clickRow"
        v-model="chooseList"
        :page-list="pageList"
        :columns="columns"
        :table-list="deviceList"
        :scroll="{ y: scrollH - 50 }"
        :style="{ height: scrollH - 0 + 'px' }"
      >
        <template v-slot:actions="action">
          <a-tooltip placement="topLeft" title="编辑">
            <a-button
              size="small"
              class="edit-action-btn"
              icon="form"
              @click.stop="addType(1, action.record)"
            ></a-button>
          </a-tooltip>
          <a-popconfirm
            placement="left"
            okText="确定"
            cancelText="取消"
            @confirm.stop="deleteList(0, action.record.id)"
          >
            <template slot="title">
              您确定删除吗?
            </template>
            <a-tooltip placement="topLeft" title="删除">
              <a-button size="small" class="del-action-btn" icon="delete"></a-button>
            </a-tooltip>
          </a-popconfirm>
        </template>
      </table-list>
      <page-num v-if="deviceList.length > 0" v-model="pageList" :total="total" @change-page="showList"></page-num>
    </div>
    <div class="place-right">
      <a-button icon="plus" class="add-btn" @click="addApp(2)">添加物品</a-button>
      <table-list
        :scroll="{ y: scrollH - 50 }"
        :style="{ height: scrollH - 0 + 'px' }"
        :page-list="pageList"
        :columns="columnss"
        :table-list="recordList"
      >
        <template v-slot:actions="action">
          <a-tooltip placement="topLeft" title="编辑">
            <a-button
              size="small"
              class="edit-action-btn"
              icon="form"
              @click.stop="addApp(3, action.record)"
            ></a-button>
          </a-tooltip>
          <a-popconfirm
            placement="left"
            okText="确定"
            cancelText="取消"
            @confirm.stop="deleteList(1, action.record.id)"
          >
            <template slot="title">
              您确定删除吗?
            </template>
            <a-tooltip placement="topLeft" title="删除">
              <a-button size="small" class="del-action-btn" icon="delete"></a-button>
            </a-tooltip>
          </a-popconfirm>
        </template>
      </table-list>
      <page-num
        v-if="recordList.length > 0"
        v-model="pageList"
        :total="faultTotal"
        @change-page="showNameList"
      ></page-num>
    </div>
    <add-type ref="addType" :title="title" @update="showList"></add-type>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import TableList from '@c/TableList'
import PageNum from '@c/PageNum'
import SubmitForm from '@c/SubmitForm'
import Tools from '@u/tools'
import AddType from '../../component/AddType'
const columns = [
  {
    title: '序号',
    width: '20%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '物品类别',
    width: '20%',
    dataIndex: 'typeName'
  },
  {
    title: '管理员',
    dataIndex: 'adminUserName',
    width: '20%'
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: '20%',
    customRender: text => {
      return Tools.getDate(text)
    }
  },
  {
    title: '操作',
    width: '20%',
    scopedSlots: {
      customRender: 'action'
    }
  }
]
const columnss = [
  {
    title: '序号',
    width: '20%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '物品名称',
    dataIndex: 'materialName',
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
const formData = [
  {
    value: 'materialName',
    initValue: '',
    type: 'input',
    label: '物品名称',
    placeholder: '请输入2-10个字符(中英文)',
    max: 10
  }
]
export default {
  name: 'Register',
  components: {
    TableList,
    PageNum,
    SubmitForm,
    AddType
  },
  data() {
    return {
      pageList: {
        page: 1,
        size: 20
      },
      deviceList: [],
      recordList: [],
      columns,
      columnss,
      formStatus: false,
      title: '添加物品分类',
      formData,
      typeId: '',
      chooseList: [],
      total: 0,
      scrollH: 0,
      selectedRowKeys: [0],
      faultTotal: 0
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  mounted() {
    this.showList()
    this.scrollH = document.documentElement.offsetHeight - 210
  },
  methods: {
    ...mapActions('home', ['getTypeList', 'typeDetail', 'delType', 'getNameList', 'addName', 'nameDetail', 'delName']),
    clickRow(item, type) {
      this.typeId = item.id
      this.showNameList()
    },
    async showList() {
      const req = {
        ...this.pageList,
        schoolCode: this.userInfo.schoolCode
      }
      const res = await this.getTypeList(req)
      this.deviceList = res.data.list
      this.typeId = res.data.list[0].id
      this.total = res.data.total
      this.chooseList = [this.typeId]
      this.showNameList()
    },
    async showNameList() {
      const req = {
        ...this.pageList,
        schoolCode: this.userInfo.schoolCode,
        typeId: this.typeId
      }
      const res = await this.getNameList(req)
      this.recordList = res.data.list
      this.faultTotal = res.data.total
    },
    addApp(type, record) {
      if (type === 2) {
        this.formData[0].initValue = ''
        this.title = '添加物品'
        this.formData = this.formData
        this.type = 2
      } else if (type === 3) {
        this.title = '编辑物品'
        this.formData = this.$tools.fillForm(formData, record)
        this.type = 3
        this.record = record
      }
      this.formStatus = true
    },
    async addType(type, item) {
      if (type) {
        this.$refs.addType.appForm = item
        this.$refs.addType.id = item.id
        this.$refs.addType.typeName = item.typeName
        if (type === 1) {
          this.title = '编辑物品分类'
          this.$refs.addType.type = '1'
        }
      } else {
        this.title = '添加物品分类'
        this.$refs.addType.type = '0'
        this.$refs.addType.appForm = {}
      }
      this.$refs.addType.addVisible = true
    },
    submitForm(values) {
      if (this.type === 2) {
        const req = {
          schoolCode: this.userInfo.schoolCode,
          materialName: values.materialName,
          typeId: this.typeId
        }
        this.addName(req)
          .then(res => {
            this.$message.success('添加成功')
            this.$tools.goNext(() => {
              this.showNameList()
              this.$refs.form.reset()
            })
          })
          .catch(() => {
            this.$refs.form.error()
          })
      } else if (this.type === 3) {
        const req = {
          schoolCode: this.userInfo.schoolCode,
          materialName: values.materialName,
          id: this.record.id
        }
        this.addName(req)
          .then(res => {
            this.$message.success('编辑成功')
            this.$tools.goNext(() => {
              this.showNameList()
              this.$refs.form.reset()
            })
          })
          .catch(() => {
            this.$refs.form.error()
          })
      }
    },
    async deleteList(type, id) {
      if (type === 0) {
        await this.delType(id)
        this.$message.success('删除成功')
        this.$tools.goNext(() => {
          this.showList()
        })
      } else if (type === 1) {
        this.delName(id).then(res => {
          this.$message.success('删除成功')
          this.$tools.goNext(() => {
            this.showNameList()
          })
        })
      }
    }
  }
}
</script>
<style lang="less" scoped>
.place-manage {
  .place-left {
    width: 59.5%;
    float: left;
    padding: 15px;
  }
  .place-right {
    width: 40%;
    float: left;
    padding: 15px;
    margin-left: 0.5%;
  }
}
</style>
