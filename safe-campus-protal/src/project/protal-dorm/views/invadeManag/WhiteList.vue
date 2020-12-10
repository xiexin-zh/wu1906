<template>
  <div class="record page-layout qui-fx-ver">
    <search-form isReset @search-form="search" :search-label="searchLabel">
      <a-button type="primary" slot="left" @click.stop="addHandle(0)">添加白名单</a-button>
    </search-form>
    <div id="table" class="wrap-table qui-fx-f1">
      <a-table
        :pagination="false"
        :rowKey="(record) => record.id"
        :columns="columns"
        :dataSource="recordList"
        :scroll="{y: this.$tools.setScroll('table')}"
      >
        <template slot="index" slot-scope="text, record, index">
          <span>{{ (pageList.page - 1) * (pageList.size) + (index + 1) }}</span>
        </template>
        <template slot="gender" slot-scope="gender">
          <span>{{ getSex(gender) }}</span>
        </template>
        <template slot="buildingName" slot-scope="text, record">
          <span>{{ record.buildingName }} {{ record.floorName }}</span>
        </template>
        <template slot="expirationTime" slot-scope="expirationTime">
          <span>{{ getDateTime(expirationTime, 1) }}</span>
        </template>
        <template slot="createTime" slot-scope="createTime">
          <span>{{ getDateTime(createTime, 1) }}</span>
        </template>
        <template slot="photoList" slot-scope="photoList">
          <div class="person-bg-img">
            <img :src="photoList" class="photo-bg-img" alt="">
          </div>
        </template>
        <template slot="action" slot-scope="text, record">
          <a-tag color="#108ee9" @click="addHandle(1,record)">编辑</a-tag>
          <a-tag color="#f50" @click="delUser(record)">删除</a-tag>
        </template>
      </a-table>
    </div>
    <page-num v-model="pageList" :total="total" @change-page="showTableList"></page-num>
    <add-white ref="addWhite" :title="title" @updata="showTableList"></add-white>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import moment from 'moment'
import mixins from '@u/mixins'
import whiteTable from '../../assets/js/table/whiteTable'
import SearchForm from '@c/SearchForm'
import PageNum from '../components/common/PageNum'
import AddWhite from '../components/AddWhite'
export default {
  name: 'WhiteList',
  mixins: [mixins],
  components: {
    PageNum,
    SearchForm,
    AddWhite
  },
  data () {
    return {
      weekList: [],
      columns: whiteTable,
      searchVal: {},
      title: '添加',
      searchLabel: [
        {
          value: 'userName',
          type: 'input',
          label: '姓名',
          placeholder: '请输入姓名'
        },
        {
          value: 'idNumber',
          type: 'input',
          label: '身份证',
          placeholder: '请输入身份证号'
        }
      ],
      pageList: {
        page: 1,
        size: 20
      },
      moment,
      formData: {
        listType: '0',
        schoolCode: sessionStorage.getItem('schoolScheme'),
        userName: '',
        site: '',
        status: ''
      },
      recordList: [],
      total: 0,
      whiteForm: false
    }
  },
  mounted () {
    this.showTableList()
  },
  methods: {
    ...mapActions('invadeRecord', [
      'getAllList', 'delAllList'
    ]),
    ...mapActions('orgTree',
      ['getBuildNode', 'getBuildChildNode']),
    showTableList () {
      const req = {
        ...this.pageList,
        ...this.formData
      }
      this.getAllList(req).then(res => {
        this.recordList = res.data.list
        this.total = res.data.total
      })
    },
    // 添加白名单
    addHandle (type, record) {
      if (type) {
        this.title = '编辑'
        this.$refs.addWhite.userName = record.userName
        this.$refs.addWhite.userCode = record.userCode
        this.$refs.addWhite.whiteId = record.id
        this.$refs.addWhite.appForm = record
        this.$refs.addWhite.placeholder = [record.buildingName, record.floorName].join('/')
        this.$refs.addWhite.appForm.expirationTime = moment(new Date(record.expirationTime), 'YYYY-MM-DD HH:mm:ss')
      } else {
        this.$refs.addWhite.whiteId = ''
        this.$refs.addWhite.userName = ''
        this.$refs.addWhite.userCode = ''
        this.$refs.addWhite.appForm = {}
        this.$refs.addWhite.placeholder = '请选择楼栋楼层'
        this.$refs.addWhite.appForm.expirationTime = moment(new Date(new Date()), 'YYYY-MM-DD HH:mm:ss').add(1, 'day')
        this.title = '添加'
      }
      this.$refs.addWhite.addVisible = true
    },
    delUser (record) {
      this.$tools.delTip('确认要删除吗？', () => {
        this.delAllList(record.id).then(res => {
          this.$message.success('删除成功')
          this.$tools.goNext(() => {
            this.showTableList()
          })
        })
      })
    },
    changePage () {
      this.formData = Object.assign(this.pageList, this.formData)
      this.showTableList()
    },
    search (val) {
      this.formData.userName = val.userName
      this.formData.idNumber = val.idNumber
      // this.formData.site = val.site
      // this.formData.status = val.status
      this.showTableList()
    }
  }
}
</script>

<style lang="less" scoped>
.record{
  height: 100%;
}
  .search-form {
    margin-top: 0px;
    height: auto;
  }
  .pagination-com {
    padding: 0
  }
</style>
