<template>
  <div class="page-layout qui-fx-ver notice">
    <search-form is-reset @search-form="searchForm" :search-label="searchLabel">
      <div slot="left">
        <a-button icon="plus" type="primary" @click="actionNotice">新增公告</a-button>
      </div>
    </search-form>
    <table-list :page-list="pageList" :columns="columns" :table-list="noticeList">
      <template v-slot:other1="other1">
        <a-tag
          :color="parseInt(other1.record.popFalg) === 0 ? '#999' : '#87d068'"
        >{{ parseInt(other1.record.popFalg) === 0 ? '否' : '是' }}</a-tag>
      </template>
      <template v-slot:other2="other2">
        <div>
          <div class="table-h" v-html="other2.record.content"></div>
        </div>
      </template>
      <template v-slot:actions="action">
        <a-tooltip placement="topLeft" title="编辑">
          <a-button
            size="small"
            class="edit-action-btn"
            icon="form"
            @click.stop="actionNotice(action.record)"
          ></a-button>
        </a-tooltip>
        <a-popconfirm
          placement="left"
          okText="确定"
          cancelText="取消"
          @confirm="_delNotice(action.record)"
        >
          <template slot="title">您确定删除吗?</template>
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
import { mapActions, mapState } from 'vuex'
import TableList from '@c/TableList'
import PageNum from '@c/PageNum'
import SearchForm from '@c/SearchForm'
const searchLabel = [
  {
    value: 'title', // 表单属性
    type: 'input', // 表单类型
    label: '标题', // 表单label值
    placeholder: '请输入标题' // 表单默认值(非必选字段)
  },
  {
    value: 'rangeTime', // 日期区间
    type: 'rangeTime',
    label: '发布日期'
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
    title: '公告标题',
    dataIndex: 'title',
    width: '20%'
  },
  {
    title: '公告内容',
    width: '30%',
    scopedSlots: {
      customRender: 'other2'
    }
  },
  {
    title: '是否弹出',
    width: '10%',
    scopedSlots: {
      customRender: 'other1'
    }
  },
  {
    title: '发布人',
    dataIndex: 'publisherName',
    width: '10%'
  },
  {
    title: '发布时间',
    dataIndex: 'creatTime',
    width: '10%',
    customRender: text => {
      return text.substr(5, 11)
    }
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
  name: 'Notice',
  components: {
    TableList,
    PageNum,
    SearchForm
  },
  data() {
    return {
      searchLabel,
      searchText: {},
      columns,
      total: 0,
      pageList: {
        page: 1,
        size: 20
      },
      noticeList: []
    }
  },
  computed: {
    ...mapState('home', ['schoolCode'])
  },
  mounted() {
    this.showList()
  },
  methods: {
    ...mapActions('home', ['searchNotice', 'delNotice']),
    /**
     * @description 新增公告
     * @param {tag: number} 判断操作为编辑()还是新增(1)
     */
    actionNotice(detail) {
      this.$router.push({
        path: '/notice/add',
        query: {
          detail
        }
      })
    },
    /**
     * @description 删除新闻公告
     * @param {id: string} 公告id
     */
    async _delNotice(item) {
      try {
        await this.delNotice({
          id: item.id
        })
        this.$message.success('删除成功')
        this.$tools.goNext(() => {
          this.showList()
        })
      } catch (err) {}
    },
    /**
     * @description 公告列表
     */
    async showList() {
      const res = await this.searchNotice({
        ...this.searchText,
        ...this.pageList
      })
      this.noticeList = res.data.list.map(item => {
        return {
          id: item.noticeId,
          ...item
        }
      })
      this.total = res.data.total
    },
    /**
     * @description 搜索列表
     */
    searchForm(values) {
      this.pageList.page = 1
      this.searchText = values
      if (values.rangeTime) {
        this.searchText.startDate = values.rangeTime[0]
        this.searchText.endDate = values.rangeTime[1]
      } else {
        this.searchText.startDate = ''
        this.searchText.endDate = ''
      }
      this.showList()
    }
  }
}
</script>
<style lang="less" scoped>
.table-h {
  height: 60px;
  overflow: auto;
}
</style>
