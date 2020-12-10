<template>
  <div class="record page-layout qui-fx-ver">
    <search-form isReset @search-form="search" :search-label="searchLabel">
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
        <template slot="createTime" slot-scope="createTime">
          <span>{{ getDateTime(createTime, 1) }}</span>
        </template>
        <template slot="photoList" slot-scope="photoList">
          <div class="person-bg-img">
            <img :src="photoList" class="photo-bg-img" alt="">
          </div>
        </template>
        <template slot="action" slot-scope="text, record">
          <a-tag color="#f50" @click="delUser(record)">删除</a-tag>
        </template>
      </a-table>
    </div>
    <page-num v-model="pageList" :total="total" @change-page="showTableList"></page-num>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import moment from 'moment'
import mixins from '@u/mixins'
import blackTable from '../../assets/js/table/blackTable'
import SearchForm from '@c/SearchForm'
import PageNum from '../components/common/PageNum'
export default {
  name: 'BlackList',
  mixins: [mixins],
  components: {
    PageNum,
    SearchForm
  },
  data () {
    return {
      columns: blackTable,
      searchVal: {},
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
        listType: '1',
        schoolCode: window.sessionStorage.getItem('schoolScheme'),
        userName: '',
        site: '',
        status: ''
      },
      recordList: [],
      total: 0
    }
  },
  methods: {
    ...mapActions('invadeRecord', ['getAllList', 'delAllList']),
    ...mapActions('orgTree', ['appList']),
    getSysList () {
      this.appList({ schoolCode: window.sessionStorage.getItem('schoolScheme'), plateformType: '2' }).then(res => {
        const arr = this.filterSearch(res.data.list)
        arr.unshift({ key: '', val: '全部' })
        this.searchLabel[2].list = arr
      })
    },
    filterSearch (data) {
      data.forEach(el => {
        this.$set(el, 'key', el.appCode)
        this.$set(el, 'val', el.name)
      })
      return data
    },
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
      this.formData.sysSourceCode = val.sysSourceCode
      // this.formData.site = val.site
      // this.formData.status = val.status
      this.showTableList(this.formData)
    }
  },
  mounted () {
    this.showTableList()
    this.getSysList()
  }
}
</script>

<style lang="less" scoped>
.record{
  height: 100%;
}
.search-form{
  height: 70px;
}
.pagination-com{
  margin: 0;
}
</style>
