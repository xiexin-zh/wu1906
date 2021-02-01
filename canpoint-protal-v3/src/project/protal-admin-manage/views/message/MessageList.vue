<template>
  <div class="template page-layout  u-type-white-bg u-fx-ver">
    <u-space direction="vertical" class="layout-padd">
      <!--搜索表单-->
      <u-search-form :search-label="messageSearch" @search="search">
        <div slot="left">
          <u-button @click="messageAction(0)" icon="plus" type="primary">新增公告</u-button>
        </div>
        <div slot="right"></div>
      </u-search-form>
      <!--搜索表单-->
    </u-space>
    <div class="u-fx u-fx-f1">
      <u-table :page-list="pageList" :columns="messageTable" :table-list="messageList">
        <template v-slot:slotOne="slotOne">
          <u-tag :type="slotOne.record.hasFrame ? 'success' : 'info'">{{
            slotOne.record.hasFrame ? '是' : '否'
          }}</u-tag>
        </template>
        <template v-slot:slotTwo="slotTwo">
          <div style="height: 50px" class="u-of" v-html="slotTwo.record.content"></div>
        </template>
        <template v-slot:actions="actions">
          <u-button type="link" @click="messageAction(1, actions.record)">编辑</u-button>
          <u-button type="link" delete content="您确定删除吗?" @click="_delMessage(actions.record.id)">删除</u-button>
        </template>
      </u-table>
    </div>
    <u-pagination v-model="pageList" :total="total" @change="_getMessageList"></u-pagination>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import messageSearch from '../../search-columns/message'
import messageTable from '../../table-columns/message'
export default {
  name: 'MessageList',
  components: {},
  data() {
    return {
      messageSearch,
      searchParams: {
        title: '',
        startTime: '',
        endTime: ''
      },
      messageTable,
      messageList: [],
      pageList: { page: 1, size: 20 },
      total: 0
    }
  },
  mounted() {
    this._getMessageList()
  },
  methods: {
    ...mapActions('home', ['getMessageList', 'delMessage']),
    // 获取列表
    async _getMessageList() {
      const res = await this.getMessageList({
        ...this.pageList,
        ...this.searchParams
      })
      this.messageList = res.data.records
      this.total = res.data.total
    },
    // 搜索
    search(values) {
      this.searchParams.title = values.title
      this.searchParams.startTime = values.rangeTime ? values.rangeTime[0] : ''
      this.searchParams.endTime = values.rangeTime ? values.rangeTime[1] : ''
      this._getMessageList()
    },
    // 删除列表
    async _delMessage(id) {
      try {
        await this.delMessage({
          id
        })
        this.$message.success('删除成功')
        this.$tools.goNext(() => {
          this._getMessageList()
        })
      } catch (err) {}
    },
    /**
     * 新增或编辑消息
     * @param { number } type 0: 新增消息 1: 编辑消息
     * @param { object } record 消息项数据,传递给编辑界面
     */
    messageAction(type, record = {}) {
      window.sessionStorage.setItem('messageDetail', JSON.stringify(record))
      this.$router.push({
        path: '/message/send',
        query: {
          type
        }
      })
    }
  }
}
</script>
<style lang="less" scoped></style>
