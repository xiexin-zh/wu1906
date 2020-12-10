<template>
  <div class="page-layout qui-fx-ver">
    <div class="top-btn-group">
      <a-button icon="plus" class="add-btn">新增补助</a-button>
    </div>
    <table-list :page-list="pageList" :columns="columns" :table-list="userList">
      <template v-slot:actions="action">
        <a-tooltip placement="topLeft" title="详情">
          <a-button
            size="small"
            class="detail-action-btn"
            icon="ellipsis"
            @click.stop="goDetial('/institute/detail', action)"
          ></a-button>
        </a-tooltip>
        <a-tooltip placement="topLeft" title="详情">
          <a-button size="small" class="edit-action-btn" icon="form" @click.stop="addApp(1, action)"></a-button>
        </a-tooltip>
        <a-tooltip placement="topLeft" title="复制">
          <a-button size="small" class="edit-action-btn" icon="form" @click.stop="addApp(1, action)"></a-button>
        </a-tooltip>
        <a-popconfirm placement="left" okText="确定" cancelText="取消" @confirm="del(action)">
          <template slot="title"> 您确定删除吗? </template>
          <a-tooltip placement="topLeft" title="删除">
            <a-button size="small" class="del-action-btn" icon="delete"></a-button>
          </a-tooltip>
        </a-popconfirm>
      </template>
    </table-list>
    <page-num v-model="pageList" :total="total" @change-page="showList"></page-num>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import TableList from '@c/TableList'
import PageNum from '@c/PageNum'
const columns = [
  {
    title: '序号',
    width: '5%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '创建时间',
    dataIndex: 'schoolName',
    width: '12%'
  },
  {
    title: '补助名称',
    dataIndex: 'schoolStage',
    width: '10'
  },
  {
    title: '发放群体',
    dataIndex: 'schoolCode',
    width: '10%'
  },
  {
    title: '待发放/已发放(人)',
    dataIndex: 'logoUrl',
    width: '10%'
  },
  {
    title: '发放时间',
    dataIndex: 'detailAddress',
    width: '12%'
  },
  {
    title: '状态',
    dataIndex: 'remark',
    width: '8%'
  },
  {
    title: '每人发放金额',
    dataIndex: 'num',
    width: '10%'
  },
  {
    title: '总发放金额',
    dataIndex: 'total',
    width: '10%'
  },
  {
    title: '操作',
    width: '12%',
    scopedSlots: {
      customRender: 'action'
    }
  }
]
export default {
  name: 'Subsidies',
  components: {
    TableList,
    PageNum
  },
  data() {
    return {
      columns,
      total: 0,
      pageList: {
        page: 1,
        size: 20
      },
      userList: [],
      form: this.$form.createForm(this),
      areaList: [],
      disabled: false
    }
  },
  mounted() {
    // this.showList()
  },
  methods: {
    ...mapActions('home', ['getSchool', 'delSchool', 'getProvinces', 'getSubNodes']),
    searchForm(values) {
      values.areaCode = Array.isArray(values.value) ? values.value[values.value.length - 1] : ''
      this.pageList = Object.assign(this.pageList, values)
      this.showList()
    },
    loadData(selectedOptions) {
      const targetOption = selectedOptions[selectedOptions.length - 1]
      targetOption.loading = true
      this.getSubNodes(targetOption.id).then(res => {
        targetOption.loading = false
        targetOption.children = res.data
        targetOption.children.forEach(el => {
          el.label = el.cityName
          el.value = el.id
          el.isLeaf = selectedOptions.length === 2 // 处理第三层没有子节点的情况
        })
        this.areaList = [...this.areaList]
      })
    },
    onFocus(value) {
      this.areaList = []
      this.isNotEdited = false
      this.getProvinces().then(res => {
        this.areaList = res.data
        this.areaList.forEach(el => {
          el.label = el.cityName
          el.value = el.id
          el.isLeaf = false
        })
      })
    },
    addApp(type, record) {
      this.$refs.addInstitute.status = true
      if (type) {
        this.$refs.addInstitute.appForm = record.record
        this.$refs.addInstitute.fileList = [{ url: record.record.logoUrl }]
        this.$refs.addInstitute.placeholder = record.record.mergerName.substring(3).replace(/,/g, '/')
        this.$refs.addInstitute.checkedList = record.record.schoolStage.split(',')
        this.$refs.addInstitute.primarySystem = this.$refs.addInstitute.primarySystem ? record.record.primarySystem : 6
        this.$refs.addInstitute.middleSystem = this.$refs.addInstitute.middleSystem ? record.record.middleSystem : 3
        this.$refs.addInstitute.highSystem = this.$refs.addInstitute.highSystem ? record.record.highSystem : 3
        this.title = '编辑学校'
        this.disabled = true
      } else {
        this.$refs.addInstitute.appForm = []
        this.$refs.addInstitute.fileList = []
        this.$refs.addInstitute.placeholder = '请选择地区'
        this.$refs.addInstitute.checkedList = []
        this.$refs.addInstitute.primarySystem = 6
        this.$refs.addInstitute.middleSystem = 3
        this.$refs.addInstitute.highSystem = 3
        this.title = '新增学校'
        this.disabled = false
      }
    },
    async showList() {
      const res = await this.getSchool(this.pageList)
      this.userList = res.data.list
      this.total = res.data.total
    },
    goDetial(path, record) {
      this.$router.push({
        path: path,
        query: {
          id: record.record.id
        }
      })
    },
    del(record) {
      this.delSchool(record.record.id).then(res => {
        this.$message.success('操作成功')
        this.$tools.goNext(() => {
          this.showList()
        })
      })
    }
  }
}
</script>
<style lang="less" scoped></style>
