<template>
  <a-modal
    width="1200px"
    :title="title"
    v-model="status"
    @ok="submitOk"
    :maskClosable="false"
    :destroyOnClose="true"
    :confirmLoading="confirmLoading"
  >
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
    <div class="choose-user qui-fx">
      <div class="qui-fx-ver qui-fx-f1">
        <table-list
          :is-check="isCheck"
          :is-radio="isRadio"
          :scroll-h="500"
          :page-list="pageList"
          v-model="chooseList"
          :columns="columns"
          @clickRow="clickRow"
          @selectAll="selectAll"
          :table-list="userList"
        ></table-list>
        <page-num
          :jumper="false"
          v-model="pageList"
          :mar-top="20"
          :mar-bot="0"
          size="small"
          :total="total"
          @change-page="getUserList"
        ></page-num>
      </div>
      <div class="user-box qui-fx-ver">
        <div class="title qui-fx-jsb">
          <span>已选择</span>
          <span>{{ totalList.length }}个</span>
        </div>
        <div class="qui-fx-f1" style="overflow: auto">
          <ul style="padding-left:0">
            <li v-for="(item, index) in totalList" :key="item.schoolCode" class="qui-fx-jsb">
              <span>{{ item.schoolName }}</span>
              <a-tag @click="delUser(item.schoolCode, index)" color="#f50">删除</a-tag>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </a-modal>
</template>

<script>
import SearchForm from '@c/SearchForm'
import PageNum from '@c/PageNum'
import TableList from '@c/TableList'
import { mapState } from 'vuex'
import $ajax from '@u/ajax-serve'
import hostEnv from '@config/host-env'
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
export default {
  name: 'ChooseUser',
  components: {
    PageNum,
    TableList,
    SearchForm
  },
  props: {
    chooseType: {
      type: String,
      default: ''
    },
    isRadio: {
      type: Boolean,
      default: false
    },
    isCheck: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: ''
    },
    value: {
      type: Boolean,
      default: false
    },
    teacherList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  computed: {
    ...mapState('home', ['schoolCode', 'eduCode']),
    status: {
      get() {
        return this.value
      },
      set() {
        this.$emit('input', false)
      }
    }
  },
  data() {
    return {
      searchLabel,
      keyword: '',
      confirmLoading: false,
      orgCode: '',
      chooseList: [],
      schoolStage: '',
      typeList: [
        {
          key: '',
          val: '全部'
        },
        {
          key: 1,
          val: '小学'
        },
        {
          key: 2,
          val: '初中'
        },
        {
          key: 3,
          val: '高中'
        }
      ],
      pageList: {
        page: 1,
        size: 20
      },
      total: 0,
      columns,
      userList: [],
      totalList: [],
      areaList: [],
      code: '',
      searchObj: {
        keyWord: '',
        schoolStage: '',
        areas: []
      }
    }
  },
  created() {
    this.code = this.type === 'edu' ? this.eduCode : this.schoolCode
  },
  async mounted() {
    this.teacherList.forEach(item => {
      this.chooseList.push(item.schoolCode)
      this.totalList.push({
        id: item.id,
        schoolCode: item.schoolCode,
        schoolName: item.schoolName
      })
    })
    this.getUserList()
  },
  methods: {
    searchForm(values) {
      this.searchObj.keyWord = values.keyWord
      this.searchObj.schoolStage = values.schoolStage
      this.searchObj.areas = values.areas ? values.areas : []
      this.getUserList()
    },
    async getUserList() {
      console.log(this.eduCode)
      const req = {
        ...this.pageList,
        eduCode: this.eduCode,
        ...this.searchObj
      }
      const res = await $ajax.post({
        url: `${hostEnv.protal_api_10050}/school/info/edu/schoolmanage/info`,
        params: req
      })
      if (!res.data) {
        return
      }
      this.userList = res.data.list.map(item => {
        return {
          ...item,
          id: item.schoolCode
        }
      })
      this.total = res.data.total
    },
    showReset() {
      this.searchObj = {
        keyWord: '',
        schoolStage: '',
        areas: []
      }
      this.getUserList()
    },
    defaultCode(item) {
      this.orgCode = item.code[0]
    },
    select(item) {
      this.pageList.page = 1
      this.orgCode = item.code
      this.getUserList()
    },
    reset() {
      this.confirmLoading = false
      this.$emit('input', false)
    },
    error() {
      this.confirmLoading = false
    },
    delUser(id, index) {
      this.totalList.splice(index, 1)
      this.chooseList.splice(this.chooseList.indexOf(id), 1)
      console.log(this.chooseList)
    },
    selectAll(item, type) {
      if (type) {
        this.totalList = this.totalList.concat(item)
      } else {
        item.forEach(item => {
          const index = this.totalList.findIndex(list => {
            return list.schoolCode === item.schoolCode
          })
          this.totalList.splice(index, 1)
        })
      }
    },
    // 监听选中或取消
    clickRow(item, type) {
      // console.log(item, type)
      if (type) {
        if (this.isCheck) {
          this.totalList.push(item)
        } else {
          this.totalList = [item]
        }
      } else {
        const index = this.totalList.findIndex(list => list.schoolCode === item.schoolCode)
        this.totalList.splice(index, 1)
      }
    },
    submitOk() {
      if (this.totalList.length === 0) {
        this.$message.warning('请选择人员')
        return
      }
      this.confirmLoading = true
      this.$emit('submit', this.totalList)
    },
    onFocus(value) {
      this.areaList = []
      this.isNotEdited = false
      $ajax
        .get({
          url: `${hostEnv.protal_api_10050}/provinces/getProvinces`
        })
        .then(res => {
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
      $ajax
        .get({
          url: `${hostEnv.protal_api_10050}/provinces/getSubNodes/${targetOption.id}`
        })
        .then(res => {
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
.choose-user {
  height: 600px;
  .org-box {
    width: 200px;
  }
  .user-box {
    border: 1px #f5f5f5 solid;
    margin-left: 15px;
    width: 200px;
    .title {
      padding: 0 10px;
      background-color: #f5f5f5;
      height: 41px;
      line-height: 41px;
      border-bottom: 1px #f5f5f5 solid;
    }
    li {
      border-bottom: 1px #f5f5f5 solid;
      padding: 6px 0px 6px 8px;
    }
  }
}
</style>
