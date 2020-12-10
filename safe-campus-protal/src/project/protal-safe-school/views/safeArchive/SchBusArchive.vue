<template>
  <div class="sch-bus page-layout bg-fff qui-fx-ver">
    <search-form is-reset @search-form="searchForm" :search-label="searchLabel">
      <div slot="left">
        <a-button type="primary" icon="plus" @click="addApp(0)">新增档案</a-button>
        <a-button icon="delete" class="del-btn mar-l10" @click="dels">批量删除</a-button>
      </div>
    </search-form>
    <table-list
      is-check
      :page-list="pageList"
      :columns="columns"
      :table-list="userList"
      v-model="chooseList"
      @clickRow="clickRow"
      @selectAll="selectAll">
      <template v-slot:other1="record">
        <a-tooltip placement="topLeft" title="详情">
          <a-button size="small" class="detail-action-btn" @click="goDetail(record.record)">查看</a-button>
        </a-tooltip>
      </template>
      <template v-slot:actions="action">
        <a-tooltip placement="topLeft" title="编辑">
          <a-button size="small" class="edit-action-btn" icon="form" @click.stop="addApp(1, action)"></a-button>
        </a-tooltip>
        <a-popconfirm placement="left" okText="确定" cancelText="取消" @confirm="del(action)">
          <template slot="title"> 确定删除该校车的档案记录吗？ </template>
          <a-tooltip placement="topLeft" title="删除">
            <a-button size="small" class="del-action-btn" icon="delete"></a-button>
          </a-tooltip>
        </a-popconfirm>
        <!-- <a-tooltip placement="topLeft" title="生产隐患">
          <a-button size="small" class="power-action-btn" icon="lock" @click.stop="create(action)"></a-button>
        </a-tooltip> -->
      </template>
    </table-list>
    <page-num v-model="pageList" :total="total" @change-page="showList"></page-num>
    <school-detail ref="schoolDetail"></school-detail>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import SearchForm from '@c/SearchForm'
import TableList from '@c/TableList'
import PageNum from '@c/PageNum'
import Tools from '@u/tools'
import SchoolDetail from '../../component/SchoolDetail'
const searchLabel = [
  {
    value: 'keyword',
    type: 'input',
    label: '牌照/车型',
    placeholder: '请输入'
  }
]
const columns = [
  {
    title: '序号',
    scopedSlots: {
      customRender: 'index'
    },
    width: '10%'
  },
  {
    title: '牌照',
    dataIndex: 'licensePlate',
    width: '13%'
  },
  {
    title: '车型',
    dataIndex: 'type',
    width: '13%'
  },
  {
    title: '核载人数',
    dataIndex: 'num',
    width: '12%'
  },
  {
    title: '车辆运营班次',
    width: '15%',
    scopedSlots: {
      customRender: 'other1'
    }
  },
  {
    title: '发布时间',
    dataIndex: 'createTime',
    width: '15%',
    customRender: (text) => {
      return Tools.getDate(text).substring(0, 10)
    }
  },
  {
    title: '操作',
    key: 'action',
    width: '15%',
    scopedSlots: {
      customRender: 'action'
    }
  }
]
export default {
  name: 'SchBusArchive',
  components: {
    TableList,
    PageNum,
    SearchForm,
    SchoolDetail
  },
  data() {
    return {
      columns,
      searchLabel,
      pageList: {
        page: 1,
        size: 20
      },
      searchList: {

      },
      total: 0,
      userList: [],
      chooseList: [],
      title: '添加档案'
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  mounted() {
    this.showList()
  },
  methods: {
    ...mapActions('home', ['getSchoolArchive', 'delSchoolArchive', 'delSchoolArchives']),
    async showList() {
      this.searchList.schoolCode = this.userInfo.schoolCode
      this.searchList = Object.assign(this.searchList, this.pageList)
      const res = await this.getSchoolArchive(this.searchList)
      this.userList = res.data.records
      this.total = res.data.total
    },
    selectAll(item, type) {
      if (type) {
        this.totalList = this.totalList.concat(item)
      } else {
        item.forEach(item => {
          const index = this.totalList.findIndex(list => {
            return list.id === item.id
          })
          this.totalList.splice(index, 1)
        })
      }
    },
    // 监听选中或取消
    clickRow(item, type) {
      if (type) {
        if (this.isCheck) {
          this.totalList.push(item)
        } else {
          this.totalList = [item]
        }
      } else {
        const index = this.totalList.findIndex(list => list.id === item.id)
        this.totalList.splice(index, 1)
      }
    },
    searchForm(values) {
      values.keyword = values.keyword ? values.keyword : undefined
      this.searchList = Object.assign(this.searchList, values)
      this.pageList.page = 1
      this.pageList.size = 20
      this.showList()
    },
    // 查看车辆运营班次
    goDetail(record) {
      this.$refs.schoolDetail.showDetail(record.code)
    },
    addApp(type, record) {
      if (type) {
        this.title = '编辑档案'
      } else {
        this.title = '添加档案'
      }
      this.$router.push({
        path: '/schBusArchive/schoolAdd',
        query: {
          id: record ? record.record.id : '',
          code: record ? record.record.code : ''
        }
      })
    },
    // 删除单条记录
    async del(record) {
      await this.delSchoolArchive(record.record.id)
      this.$message.success('操作成功')
      this.$tools.goNext(() => {
        this.showList()
        this.chooseList = []
      })
    },
    // 批量删除
    dels(record) {
      if (this.chooseList.length === 0) {
        this.$message.warning('请选择要删除的档案记录')
        return false
      }
      this.$tools.delTip('确定删除选中的档案记录吗？', () => {
        this.delSchoolArchives(this.chooseList).then(res => {
          this.$message.success('操作成功')
          this.$tools.goNext(() => {
            this.showList()
          })
        })
      })
    }
  }
}
</script>
<style lang="less" scoped></style>
