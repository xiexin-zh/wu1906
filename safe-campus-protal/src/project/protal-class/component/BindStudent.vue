
<template>
  <div>
    <a-modal
      title="班级列表"
      v-model="bindVisible"
      :destroyOnClose="true"
      :maskClosable="false"
      width="940px"
      @ok="addSubmit"
      :okButtonProps="{ props: {disabled: isLoad} }"
      wrapClassName="student-dialog">
      <div class="qui-fx-ver">
        <search-form @search-form="showTableList" :search-label="searchLabel" style="margin:-30px 0 0 0;height:60px;">
          <div slot="left"></div>
          <div slot="right"></div>
        </search-form>
        <div class="qui-fx-f1 wrap-table" id="controlTable">
          <table-list
            :columns="columns"
            :table-list="roomList"
            is-check
            @clickRow="setBusinessRow"
            v-model="chooseList"
          >
            <template slot="number" slot-scope="text, record, index">
              <span>{{ (searchForm.page - 1) * (searchForm.size) + (index + 1) }}</span>
            </template>
            <template slot="createDate" slot-scope="createDate">
              {{ createDate | getDate(1) }}
            </template>
          </table-list>
        </div>
      </div>
    </a-modal>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import SearchForm from '@c/SearchForm'
import TableList from '@c/TableList'
const columns = [{
  title: '序号',
  scopedSlots: {
    customRender: 'number'
  },
  width: '10%'
}, {
  title: '年级',
  dataIndex: 'gradeName',
  width: '30%'
}, {
  title: '班级',
  dataIndex: 'className',
  width: '30%'
}, {
  title: '年份',
  dataIndex: 'year',
  width: '20%'
}]
export default {
  name: 'BindStudent',
  components: {
    SearchForm,
    TableList
  },
  data () {
    return {
      searchLabel: [
        {
          list: [],
          initValue: [],
          value: 'name',
          type: 'select',
          label: '年级',
          placeholder: ''
        }],
      selectedKeys: [],
      loadTable: false,
      columns,
      tags: [],
      name: '',
      isLoad: false,
      bindVisible: false,
      selectedRows: [],
      searchForm: {
        page: 1,
        start: 0,
        size: 1000,
        gradeId: '',
        gradeName: ''
      },
      roomList: [],
      chooseList: []
    }
  },
  computed: {
    ...mapState('home', ['authWebUserInfo'])
  },
  mounted () {
    // this.gradeGet()
  },
  methods: {
    ...mapActions('home', ['addCount', 'updateCount', 'getCount', 'getGrade', 'gradeClass'
    ]),
    gradeGet () {
      const req = {
        schoolScheme: this.authWebUserInfo.exts.schoolScheme,
        page: 1,
        start: 0,
        size: 100
      }
      // 获取年级
      this.getGrade(req).then(res => {
        this.gradeList = res.data
        this.searchLabel[0].list = this.filterSearch(res.data)
        this.searchLabel[0].placeholder = res.data[0].gradeName
        this.searchForm.gradeId = res.data[0].gradeId
        this.searchForm.gradeName = res.data[0].gradeName
        this.searchForm.gradeCode = res.data[0].gradeCode
        this.classListGet()
      })
    },
    filterSearch (data) {
      data.forEach(el => {
        this.$set(el, 'key', el.gradeId)
        this.$set(el, 'val', el.gradeName)
      })
      return data
    },
    classListGet () {
      this.gradeClass(this.searchForm).then(res => {
        this.roomList = res.data
      })
    },
    showTableList (obj) {
      this.searchForm.gradeId = obj.name
      this.classListGet()
    },
    businessSelectChange (keys, rows) {
      this.selectedKeys = keys
      this.selectedRows = rows
    },
    setBusinessRow (record, index) {
      return {
        on: {
          click: () => {
            let flag = false
            let keys = []
            keys = this.selectedKeys
            if (keys.indexOf(record.id) >= 0) {
              flag = true
            }
            if (flag) {
              keys.splice(keys.findIndex(item => item === record.id), 1)
              this.selectedRows.splice(this.selectedRows.findIndex(item => item.id === record.id), 1)
            } else {
              keys.push(record.id)
              this.selectedRows.push(record)
            }
          }
        }
      }
    },
    addSubmit () {
      if (!this.selectedRows.length === 0) {
        this.$message.warning('请选择绑定人员！')
        return false
      }
      let row = []
      row = this.selectedRows.map(element => {
        return {
          beAssessedName: element.beAssessedName ? element.beAssessedName : element.className,
          beAssessedId: element.beAssessedId ? element.beAssessedId : element.id
        }
      })
      this.$emit('getClassInfo', row)
      this.confirmLoading = false
      this.bindVisible = false
    }
  }
}
</script>

<style lang="less">
.student-dialog{
  .ant-table-thead > tr:first-child > th:first-child > div{
      display: none;
    }
  .ant-calendar-picker{
    width:100%!important;
  }
}

</style>
