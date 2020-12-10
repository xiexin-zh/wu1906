<template>
  <div class="page-layout qui-fx-ver">
    <search-form is-reset @search-form="searchForm" :search-label="searchLabel">
      <div slot="left">
        <a-button icon="plus" type="primary" @click="addApp(0)">新增学校</a-button>
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
            @click.stop="goDetial('/institute/detail', action)"
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
    <add-institute ref="addInstitute" :title="title" @update="showList" :disabled="disabled"></add-institute>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import TableList from '@c/TableList'
import PageNum from '@c/PageNum'
import SearchForm from '@c/SearchForm'
import AddInstitute from './AddInstitute'
const searchLabel = [
  {
    value: 'codeOrName', // 分类查询
    type: 'selectInput', // 表单类型
    selectType: [
      {
        key: 1,
        val: '学校名称'
      },
      {
        key: 2,
        val: '编码'
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
        key: '00',
        val: '幼儿园'
      },
      {
        key: '01',
        val: '小学'
      },
      {
        key: '02',
        val: '初中'
      },
      {
        key: '03',
        val: '高中'
      },
      {
        key: '05',
        val: '中职'
      },
      {
        key: '04',
        val: '高校'
      }
    ],
    value: 'schoolStage',
    type: 'select',
    label: '学段'
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
    title: '学校名称',
    dataIndex: 'schoolName',
    width: '15%'
  },
  {
    title: '学段',
    dataIndex: 'schoolStage',
    width: '10%',
    customRender: text => {
      const arr = text.split(',')
      const newArr = []
      for (let i = 0; i < arr.length; i++) {
        if (arr[i] === '01') {
          newArr.push('小学')
        } else if (arr[i] === '02') {
          newArr.push('初中')
        } else if (arr[i] === '03') {
          newArr.push('高中')
        } else if (arr[i] === '00') {
          newArr.push('幼儿园')
        } else if (arr[i] === '04') {
          newArr.push('高校')
        } else if (arr[i] === '05') {
          newArr.push('中职')
        }
      }
      return newArr.join(',')
    }
  },
  {
    title: '学校编码',
    dataIndex: 'schoolCode',
    width: '10%'
  },
  {
    title: 'logo',
    dataIndex: 'logoUrl',
    width: '10%',
    scopedSlots: {
      customRender: 'snapPic'
    }
  },
  {
    title: '详细地址',
    dataIndex: 'detailAddress',
    width: '15%'
  },
  {
    title: '管理员手机号',
    dataIndex: 'adminMobile',
    width: '10%'
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
  name: 'InstituteManage',
  components: {
    TableList,
    SearchForm,
    PageNum,
    AddInstitute
  },
  data() {
    return {
      searchLabel,
      title: '新增学校',
      chooseList: [],
      columns,
      total: 0,
      pageList: {
        page: 1,
        size: 20
      },
      userList: [],
      form: this.$form.createForm(this),
      studyList: [
        {
          key: '00',
          val: '幼儿园'
        },
        {
          key: '01',
          val: '小学'
        },
        {
          key: '02',
          val: '初中'
        },
        {
          key: '03',
          val: '高中'
        },
        {
          key: '04',
          val: '高校'
        },
        {
          key: '05',
          val: '中职'
        }
      ],
      areaList: [],
      disabled: false
    }
  },
  mounted() {
    this.showList()
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
    resetBtn() {
      this.form.resetFields()
      this.searchBtn()
    },
    searchBtn(e) {
      if (e) e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          if (values.value && values.value.length > 0) {
            values.areaCode = values.value[values.value.length - 1]
          }
          this.pageList = Object.assign(this.pageList, values)
          this.showList()
        }
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
        this.$refs.addInstitute.nurserySystem = this.$refs.addInstitute.nurserySystem ? record.record.nurserySystem : 3
        this.$refs.addInstitute.collegeSystem = this.$refs.addInstitute.collegeSystem ? record.record.collegeSystem : 3
        this.$refs.addInstitute.secondVocationalSystem = this.$refs.addInstitute.secondVocationalSystem ? record.record.highSystem : 3
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
        this.$refs.addInstitute.nurserySystem = 3
        this.$refs.addInstitute.collegeSystem = 3
        this.$refs.addInstitute.secondVocationalSystem = 3
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
