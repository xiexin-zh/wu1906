<template>
  <div class="page-layout qui-fx-ver">
    <search-form is-reset @search-form="searchForm" :search-label="searchLabel">
      <div slot="left">
        <a-button icon="plus" type="primary" @click="addApp(0)">新增机构</a-button>
      </div>
      <template v-slot:area>
        <a-form-item label="地区">
          <a-cascader
            :options="areaList"
            @click.stop="onFocus"
            :loadData="loadData"
            placeholder="请选择地区"
            v-decorator="['value']"
            changeOnSelect
          />
        </a-form-item>
      </template>
    </search-form>
    <table-list
      is-zoom
      :page-list="pageList"
      v-model="chooseList"
      :columns="columns"
      :table-list="userList"
    >
      <template v-slot:actions="action">
        <a-tooltip placement="topLeft" title="详情">
          <a-button
            size="small"
            class="detail-action-btn"
            icon="ellipsis"
            @click.stop="goDetial('/bureau/detail', action)"
          ></a-button>
        </a-tooltip>
        <a-tooltip placement="topLeft" title="编辑">
          <a-button
            size="small"
            class="edit-action-btn"
            icon="form"
            @click.stop="addApp(1, action)"
          ></a-button>
        </a-tooltip>
        <a-popconfirm placement="left" okText="确定" cancelText="取消" @confirm="del(action)">
          <template slot="title">您确定删除吗?</template>
          <a-tooltip placement="topLeft" title="删除">
            <a-button size="small" class="del-action-btn" icon="delete"></a-button>
          </a-tooltip>
        </a-popconfirm>
      </template>
    </table-list>
    <page-num v-model="pageList" :total="total" @change-page="showList"></page-num>
    <add-bureau ref="addInstitute" :title="title" @update="showList" :disabled="disabled"></add-bureau>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import TableList from '@c/TableList'
import PageNum from '@c/PageNum'
import SearchForm from '@c/SearchForm'
import AddBureau from './AddBureau'
const searchLabel = [
  {
    value: 'keyWord', // 分类查询
    type: 'selectInput', // 表单类型
    selectType: [
      {
        key: 1,
        val: '机构名称'
      },
      {
        key: 2,
        val: '机构编码'
      }
    ],
    placeholder: '请输入' // 表单默认值(非必选字段)
  },
  {
    list: [
      // 选择列表项，select控件必传
      {
        key: '',
        val: '全部'
      },
      {
        key: '1',
        val: '省级'
      },
      {
        key: '2',
        val: '市级'
      },
      {
        key: '3',
        val: '区/县级'
      }
    ],
    value: 'level',
    type: 'select',
    label: '机构级别'
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
    title: '机构名称',
    dataIndex: 'eduName',
    width: '15%'
  },
  {
    title: '机构编码',
    dataIndex: 'eduCode',
    width: '10%'
  },
  {
    title: '机构级别',
    dataIndex: 'level',
    width: '10%',
    customRender: text => {
      if (text === '1') {
        return '省级'
      } else if (text === '2') {
        return '市级'
      } else {
        return '区/县级'
      }
    }
  },
  {
    title: '地区',
    dataIndex: 'mergerName',
    width: '10%'
  },
  {
    title: '详细地址',
    dataIndex: 'detailAddress',
    width: '20%'
  },
  {
    title: '备注',
    dataIndex: 'remark',
    width: '10%'
  },
  {
    title: '操作',
    width: '15%',
    scopedSlots: {
      customRender: 'action'
    }
  }
]
export default {
  name: 'BureauManage',
  components: {
    TableList,
    SearchForm,
    PageNum,
    AddBureau
  },
  data() {
    return {
      searchLabel,
      title: '新增机构',
      chooseList: [],
      columns,
      total: 0,
      pageList: {
        page: 1,
        size: 20

      },
      searchList: {
        type: '2',
        provinceCode: '',
        cityCode: '',
        areaCode: ''

      },
      userList: [],
      form: this.$form.createForm(this),
      areaList: [],
      disabled: false
    }
  },
  mounted() {
    this.showList()
  },
  methods: {
    ...mapActions('home', ['getEdu', 'delEdu', 'getProvinces', 'getSubNodes']),
    searchForm(values) {
      this.pageList.page = 1
      this.pageList.size = 20
      this.searchList.provinceCode = values.value[0]
      this.searchList.cityCode = values.value[1]
      this.searchList.areaCode = values.value[2]
      // values.areaCode = Array.isArray(values.value) ? values.value[values.value.length - 1] : ''
      this.searchList = Object.assign(this.searchList, values)
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
        this.$refs.addInstitute.appForm.isChange = true
        this.$refs.addInstitute.placeholder = record.record.mergerName.substring(3).replace(/,/g, '/')
        this.title = '编辑机构'
        this.disabled = true
      } else {
        this.$refs.addInstitute.appForm = []
        this.$refs.addInstitute.placeholder = '请选择地区'
        this.title = '新增机构'
        this.disabled = false
      }
    },
    async showList() {
      this.searchList = Object.assign(this.searchList, this.pageList)
      const res = await this.getEdu(this.searchList)
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
      this.delEdu({ id: record.record.id }).then(res => {
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
