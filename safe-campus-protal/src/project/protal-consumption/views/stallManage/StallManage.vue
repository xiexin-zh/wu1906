<template>
  <div class="account-list page-layout qui-fx-ver">
    <search-form is-reset @search-form="searchForm" :search-label="searchLabel">
      <div slot="left">
        <a-button icon="export" class="export-btn" @click="addStall(0)">添加档口</a-button>
      </div>
    </search-form>
    <submit-form
      ref="form"
      @submit-form="submitForm"
      :title="formTitle"
      v-model="showTag"
      @classRoom="addClassRoom"
      :form-data="formData"
    >
    </submit-form>
    <div class="qui-fx-f1 qui-fx">
      <table-list :page-list="pageList" :columns="stallColumns" :table-list="stallList">
        <template v-slot:other2="other2">
          <span>{{ other2.record.buildName }}{{ other2.record.floorName }}{{ other2.record.roomName }}</span>
        </template>
        <template v-slot:other1="other1">
          <a-tooltip placement="topLeft" title="编辑">
            <a-button size="small" class="edit-action-btn" icon="form" @click.stop="addStall(1, other1.record)"></a-button>
          </a-tooltip>
          <a-popconfirm placement="left" okText="确定" cancelText="取消" @confirm.stop="untie(other1.record)">
            <template slot="title"> 确定删除该档口吗？ </template>
            <a-tooltip placement="topLeft" title="删除">
              <a-button size="small" class="del-action-btn" icon="delete"></a-button>
            </a-tooltip>
          </a-popconfirm>
        </template>
      </table-list>
    </div>
    <page-num v-model="pageList" :total="total" @change-page="showList"></page-num>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import SearchForm from '@c/SearchForm'
import TableList from '@c/TableList'
import PageNum from '@c/PageNum'
import stallColumns from '../../assets/table/stallColumns'
import SubmitForm from '../../component/SubmitForm'
const searchLabel = [
  {
    value: 'windowName',
    type: 'input',
    label: '档口名称',
    placeholder: '请输入档口名称'
  }
]
const formData = [
  {
    value: 'windowName',
    initValue: '',
    type: 'input',
    label: '档口名称',
    placeholder: '请输入档口名称'
  },
  {
    value: 'build',
    initValue: [],
    type: 'siteChoose',
    label: '绑定场地',
    placeholder: '请选择场地'
  },
  {
    value: 'remark',
    initValue: '',
    type: 'input',
    label: '备注',
    placeholder: '请输入备注'
  }
]
export default {
  name: 'StallManage',
  components: {
    SearchForm,
    TableList,
    PageNum,
    SubmitForm
  },
  data() {
    return {
      showTag: false,
      formTitle: '添加档口',
      formData,
      total: 0,
      searchLabel,
      stallColumns,
      pageList: {
        page: 1,
        size: 20
      },
      searchObj: {},
      stallList: []
    }
  },
  computed: {
    ...mapState('home', ['userInfo', 'schoolCode'])
  },
  mounted() {
    this.showList()
  },
  methods: {
    ...mapActions('home', ['getStallList', 'addNewStall', 'deleStall', 'editStall']),
    async showList() {
      const req = {
        pageNum: this.pageList.page,
        pageSize: this.pageList.size,
        windowName: this.searchObj.windowName
      }
      const res = await this.getStallList(req)
      this.stallList = res.rows
      this.total = res.total
    },
    searchForm(values) {
      this.searchObj = values
      this.showList()
    },
    addStall(type, record) {
      this.showTag = true
      this.type = type
      if (type) {
        this.record = record
        this.formTitle = '编辑档口'
        this.formData = this.$tools.fillForm(formData, record)
        this.formData[1].initValue = [record.buildCode, record.floorCode, record.roomCode]
        this.placeName = record.buildName + '-' + record.floorName + '-' + record.roomName
        console.log(this.formData)
      } else {
        this.formTitle = '添加档口'
        this.formData = formData
      }
    },
    // 删除
    untie(record) {
      const req = {
        id: record.id
      }
      this.deleStall(req).then((res) => {
        this.$message.success('删除成功')
        this.$tools.goNext(() => {
          this.showList()
        })
      })
    },
    // 绑定场地
    addClassRoom(val) {
      this.placeName = val
      console.log(this.placeName)
    },
    async submitForm(values) {
      console.log(values)
      const req = {
        schoolCode: this.schoolCode,
        remark: values.remark,
        windowName: values.windowName,
        buildCode: values.build[0],
        buildName: this.placeName.split('-')[0],
        floorCode: values.build[1],
        floorName: this.placeName.split('-')[1],
        roomCode: values.build[2],
        roomName: this.placeName.split('-')[2],
        createBy: this.userInfo.userName
      }
      if (this.type) {
        req.id = this.record.id
        await this.editStall(req)
        this.$message.success('编辑成功')
        this.$tools.goNext(() => {
          this.showList()
          this.$refs.form.reset()
        })
      } else {
        await this.addNewStall(req)
        this.$message.success('新增成功')
        this.$tools.goNext(() => {
          this.showList()
          this.$refs.form.reset()
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
</style>
