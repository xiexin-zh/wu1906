<template>
  <div class="account-list page-layout qui-fx-ver">
    <div class="top-btn-group">
      <a-button icon="plus" class="add-btn" @click="add">新增补助</a-button>
    </div>
    <div class="qui-fx-f1 qui-fx">
      <table-list :page-list="pageList" :columns="subsidyColumns" :table-list="subsidyList">
        <template v-slot:other1="other1">
          <a-tag color="green" @click="detail(other1.record)">{{ other1.record.grantNumber }}</a-tag>
        </template>
        <template v-slot:actions="action">
          <a-popconfirm
            v-if="action.record.status === 2"
            placement="left"
            okText="确定"
            cancelText="取消"
            @confirm="send(action.record)"
          >
            <template slot="title">您确定立即发放吗?</template>
            <a-tooltip placement="topLeft" title="立即发放">
              <a-button size="small" class="play-action-btn" icon="play-circle"></a-button>
            </a-tooltip>
          </a-popconfirm>
          <a-popconfirm
            placement="left"
            okText="确定"
            cancelText="取消"
            @confirm="del(action.record)"
            v-if="action.record.status !== 3"
          >
            <template slot="title">您确定删除吗?</template>
            <a-tooltip placement="topLeft" title="删除">
              <a-button size="small" class="del-action-btn" icon="delete"></a-button>
            </a-tooltip>
          </a-popconfirm>
        </template>
      </table-list>
    </div>
    <page-num v-model="pageList" :total="total" @change-page="showList"></page-num>
    <add-subsidy ref="addSubsidy" @updata="showList"></add-subsidy>
    <subsidy-person ref="subsidyPerson"></subsidy-person>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import SearchForm from '@c/SearchForm'
import TableList from '@c/TableList'
import PageNum from '@c/PageNum'
import AddSubsidy from '../../component/AddSubsidy'
import SubsidyPerson from '../../component/SubsidyPerson'
import subsidyColumns from '../../assets/table/subsidyColumns'
export default {
  name: 'SubsidyManage',
  components: {
    SearchForm,
    TableList,
    PageNum,
    AddSubsidy,
    SubsidyPerson
  },
  data() {
    return {
      total: 0,
      subsidyColumns,
      pageList: {
        page: 1,
        size: 20
      },
      subsidyList: []
    }
  },
  computed: {
    ...mapState('home', ['schoolCode'])
  },
  mounted() {
    this.showList()
  },
  methods: {
    ...mapActions('home', ['getSubsidy', 'subsidyInfoList', 'initSend', 'delSubsidy']),
    async showList() {
      const res = await this.getSubsidy(this.pageList)
      this.subsidyList = res.data.list
      this.total = res.data.total
    },
    async send(record) {
      record.status = '1'
      await this.initSend(record)
      this.$message.success('操作成功')
      this.$tools.goNext(() => {
        this.showList()
      })
    },
    copy(record) {
      record.status = record.status.toString()
      this.$refs.addSubsidy.cardInfo = record
      this.$refs.addSubsidy.visible = true
    },
    async del(record) {
      const req = {
        status: 3,
        id: record.id
      }
      await this.delSubsidy(req)
      this.$message.success('操作成功')
      this.$tools.goNext(() => {
        this.showList()
      })
    },
    detail(record) {
      this.$refs.subsidyPerson.dialogTag = true
      this.$refs.subsidyPerson.showList(record.id)
    },
    add() {
      this.$refs.addSubsidy.visible = true
      this.$refs.addSubsidy.classList = []
      this.$refs.addSubsidy.value = []
    }
  }
}
</script>

<style lang="less" scoped>
</style>
