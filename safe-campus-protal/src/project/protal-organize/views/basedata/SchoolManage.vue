<template>
  <div class="running-tab page-layout qui-fx-ver">
    <search-form is-reset @search-form="searchForm" :search-label="searchLabel">
      <template v-slot:area>
        <a-form-item label="地区">
          <a-cascader
            :options="areaList"
            @click.stop="onFocus"
            :loadData="loadData"
            placeholder="请选择地区"
            v-decorator="['areas']"
            changeOnSelect
          />
        </a-form-item>
      </template>
    </search-form>
    <table-list is-zoom :page-list="pageList" :columns="columns" :table-list="dataList">
      <template v-slot:actions="action">
        <a-tooltip placement="topLeft" title="详情">
          <a-button size="small" class="detail-action-btn" icon="ellipsis" @click.stop="detail(action.record)"></a-button>
        </a-tooltip>
      </template>
    </table-list>
    <page-num v-model="pageList" :total="total" @change-page="showList(searchObj)"></page-num>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import TableList from '@c/TableList'
import SearchForm from '@c/SearchForm'
import PageNum from '@c/PageNum'
import 'moment/locale/zh-cn'

const searchLabel = [
  {
    value: 'keyWord',
    initValue: '',
    type: 'selectInput',
    selectType: [
      {
        key: 'schoolName',
        val: '学校名称'
      },
      {
        key: 'schoolCode',
        val: '学校编码'
      }
    ],
    placeholder: '请输入'
  },
  {
    list: [
      {
        key: '',
        val: '全部'
      },
      {
        key: '1',
        val: '小学'
      },
      {
        key: '2',
        val: '初中'
      },
      {
        key: '3',
        val: '高中'
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
    width: '10%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '学校名称',
    dataIndex: 'schoolName',
    width: '10%'
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
    title: '学校logo',
    dataIndex: 'logoUrl',
    width: '10%',
    scopedSlots: {
      customRender: 'snapPic'
    }
  },
  {
    title: '地区',
    dataIndex: 'mergerName',
    width: '20%'
  },
  {
    title: '详细地址',
    dataIndex: 'detailAddress',
    width: '10%'
  },
  {
    title: '备注',
    dataIndex: 'remark',
    width: '10%'
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
  name: 'SchoolManage',
  components: {
    TableList,
    SearchForm,
    PageNum
  },
  data() {
    return {
      searchLabel,
      columns,
      cardID: '',
      areaList: [],
      total: 0,
      pageList: {
        page: 1,
        size: 20
      },
      dataList: [],
      searchObj: {
        keyWord: '',
        schoolStage: '',
        areas: []
      }
    }
  },
  async mounted() {
    this.showList()
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  methods: {
    ...mapActions('home', ['underSchoolList', 'getProvinces', 'getSubNodes']),
    async showList(searchObj = this.searchObj) {
      const req = {
        ...this.pageList,
        eduCode: this.userInfo.eduCode,
        ...searchObj
      }
      const res = await this.underSchoolList(req)
      if (!res.data) {
        return
      }
      this.dataList = res.data.list
      this.total = res.data.total
    },
    searchForm(values) {
      console.log(values)
      this.searchObj.keyWord = values.keyWord
      this.searchObj.schoolStage = values.schoolStage
      this.searchObj.areas = values.areas ? values.areas : []
      this.showList(this.searchObj)
    },
    detail(record) {
      console.log(record.id)
      this.$router.push({
        path: '/basedata/schoolDetail',
        query: { id: record.id }
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
    }
  }
}
</script>
<style lang="less" scoped>
</style>
