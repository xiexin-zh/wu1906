<template>
  <div class="page-layout qui-fx-ver">
    <search-form
      isReset
      @search-form="searchForm"
      :search-label="searchLabel">
      <div slot="left">
        <a-button icon="plus" type="primary" @click="addGroup(0)">添加班次</a-button>
      </div>
    </search-form>
    <table-list :page-list="pageList" :columns="columns" :table-list="recordList">
      <template v-slot:accessTimes="accessTime">
        <div class="qui-fx-ver">
          <div class="qu-fx" v-for="(ele, i) in accessTime.record.ruleTimeDtoList" :key="i">
            <span v-if="ele.startTime">{{ ele.startTime }}</span>
            <span v-if="ele.startTime"> ~ </span>
            <span v-if="ele.startTime">{{ ele.endTime }}</span>
          </div>
        </div>
      </template>
      <template v-slot:actions="action">
        <div>
          <a-tooltip placement="topLeft" title="编辑">
            <a-button size="small" class="edit-action-btn" icon="form" @click.stop="addGroup(1,action.record.id)"></a-button>
          </a-tooltip>
          <a-popconfirm placement="left" okText="确定" cancelText="取消" @confirm.stop="delGroup(action.record.id)">
            <template slot="title">
              您确定删除吗?
            </template>
            <a-tooltip placement="topLeft" title="删除">
              <a-button size="small" class="del-action-btn" icon="delete"></a-button>
            </a-tooltip>
          </a-popconfirm>
        </div>
      </template>
    </table-list>
    <page-num v-model="pageList" :total="total" @change-page="getShiftManage_"></page-num>
    <add-class ref="addClass" v-model="visible" @update="getShiftManage_" :class-obj="classObg"></add-class>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import SearchForm from '@c/SearchForm'
import TableList from './TableList'
import PageNum from '@c/PageNum'
import AddClass from '../../component/AddClass'
const searchLabel = [
  {
    value: 'name',
    type: 'input',
    label: '班次名称',
    placeholder: '请输入'
  }
]
const columns = [
  {
    title: '序号',
    width: '15%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '班次名称',
    dataIndex: 'name',
    width: '25%'
  },
  {
    title: '考勤时间',
    width: '35%',
    scopedSlots: {
      customRender: 'accessTime'
    }
  },
  {
    title: '操作',
    width: '30%',
    scopedSlots: {
      customRender: 'action'
    }
  }
]
export default {
  name: 'ClassSet',
  components: {
    TableList,
    PageNum,
    SearchForm,
    AddClass
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  data() {
    return {
      columns,
      searchLabel,
      total: 0,
      pageList: {
        page: 1,
        size: 20
      },
      recordList: [],
      visible: false,
      classObg: {},
      searchList: {}
    }
  },
  mounted() {
    this.getShiftManage_()
  },
  methods: {
    ...mapActions('home', ['getShiftManage', 'delShiftManage', 'bindAccessUser', 'shiftManageDetail']),
    // 列表
    async getShiftManage_() {
      this.searchList.schoolCode = this.userInfo.schoolCode
      this.searchList = Object.assign(this.searchList, this.pageList)
      const res = await this.getShiftManage(this.searchList)
      this.total = res.data.total
      this.recordList = res.data.list
    },
    // 添加班次
    async addGroup(type, id) {
      if (type) {
        // 编辑获取详情
        const res = await this.shiftManageDetail({ id: id })
        this.classObg = res.data
        this.$refs.addClass.name = this.classObg.name
        this.$refs.addClass.classId = id
        // this.classObg.list.forEach((el, index) => {
        //   this.$refs.addClass.data[index].time = el.workTime
        //   this.$refs.addClass.data[index].startTime = el.startTime
        //   this.$refs.addClass.data[index].endTime = el.endTime
        //   this.$refs.addClass.data[index].checked = el.checked ? el.checked : el.hasValid === '1'
        // })
        this.$refs.addClass.data = this.classObg.list.map((el, index) => {
          return {
            id: index,
            key: index+1,
            startTime: el.startTime,
            endTime: el.endTime,
            time: el.workTime,
            checked: el.hasValid === '1'
          }
        })
      } else {
        this.$refs.addClass.classId = ''
        this.$refs.addClass.name = ''
        this.$refs.addClass.data = this.$refs.addClass.data.map(el => {
          return {
            ...el,
            time: '00:00',
            startTime: '00:00',
            endTime: '00:00',
            checked: true
          }
        })
      }
      this.visible = true
    },
    // 删除班次
    async delGroup(id) {
      await this.delShiftManage({ id })
      this.$message.success('删除成功')
      this.$tools.goNext(() => {
        this.getShiftManage_()
      })
    },
    // 查询
    searchForm (values) {
      this.pageList.page = 1
      this.pageList.size = 20
      this.searchList = Object.assign(this.searchList, values)
      this.getShiftManage_()
    }
  }
}
</script>
<style lang="less" scoped>
</style>
