<template>
  <div class="help page-layout bg-fff u-fx-ver">
    <a-tabs v-model="currentKey">
      <a-tab-pane :key="index" :tab="tab.title" v-for="(tab, index) in typeList"></a-tab-pane>
      <a-button
        @click="createHelp('')"
        icon="plus"
        type="primary"
        class="u-mar-r10"
        slot="tabBarExtraContent"
      >新增</a-button>
    </a-tabs>
    <table-list :page-list="pageList" :columns="columns" :table-list="helpList">
      <template v-slot:actions="action">
        <a-tooltip placement="topLeft" title="详情">
          <a-button
            size="small"
            class="detail-action-btn"
            icon="ellipsis"
            @click="createHelp(action.record)"
          ></a-button>
        </a-tooltip>
        <a-popconfirm
          placement="left"
          okText="确定"
          cancelText="取消"
          @confirm="_delHelp(action.record._id)"
        >
          <template slot="title">您确定删除吗?</template>
          <a-tooltip placement="topLeft" title="删除">
            <a-button size="small" class="del-action-btn" icon="delete"></a-button>
          </a-tooltip>
        </a-popconfirm>
      </template>
    </table-list>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import TableList from '@c/TableList'
import $tools from '@u/tools'
const columns = [
  {
    title: '序号',
    width: '10%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '标题',
    dataIndex: 'title',
    width: '40%'
  },
  {
    title: '模块',
    dataIndex: 'moduleName',
    width: '10%'
  },
  {
    title: '发布时间',
    dataIndex: 'createTime',
    width: '20%',
    customRender: text => {
      return $tools.getDate(text)
    }
  },
  {
    title: '操作',
    width: '20%',
    scopedSlots: {
      customRender: 'action'
    }
  }
]
export default {
  name: 'Help',
  components: { TableList },
  data() {
    return {
      currentKey: 0,
      columns,
      pageList: {
        page: 1,
        size: 20
      },
      typeList: [
        {
          type: 0,
          title: '常见问题'
        },
        {
          type: 1,
          title: '功能模块'
        }
      ],
      helpList: []
    }
  },
  watch: {
    currentKey(n, o) {
      if (n !== o) {
        this._getHelpList()
      }
    }
  },
  mounted() {
    this._getHelpList()
  },
  methods: {
    ...mapActions('home', ['getHelpList', 'delHelp']),
    createHelp(item) {
      window.sessionStorage.setItem('helpInfo', JSON.stringify(item))
      this.$router.push({
        path: '/help/helpDetail',
        query: {
          funType: this.currentKey
        }
      })
    },
    async _getHelpList() {
      const res = await this.getHelpList({
        ...this.pageList,
        funType: this.currentKey
      })
      this.helpList = res.data.map(item => {
        return {
          id: item._id,
          ...item
        }
      })
    },
    async _delHelp(_id) {
      await this.delHelp({
        _id
      })
      this.$message.success('删除成功')
      this.$tools.goNext(() => {
        this._getHelpList()
      })
    }
  }
}
</script>
<style lang="less" scoped>
.help {
}
</style>
