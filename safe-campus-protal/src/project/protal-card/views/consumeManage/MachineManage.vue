<template>
  <div class="account-list page-layout qui-fx-ver">
    <search-form is-reset @search-form="searchForm" :search-label="searchLabel"></search-form>
    <div class="qui-fx-f1 qui-fx">
      <table-list :page-list="pageList" :columns="machineColumns" :table-list="machineList">
        <template v-slot:actions="action">
          <a-tag color="green" v-if="action.record.authorization"> 已授权 </a-tag>
          <a-popconfirm v-else placement="left" okText="确定" cancelText="取消" @confirm.stop="tie(action.record)">
            <template slot="title">
              您确定授权吗?
            </template>
            <a-tooltip placement="topLeft" title="授权">
              <a-icon class="mouse mar-l10" type="unlock" />
            </a-tooltip>
          </a-popconfirm>
        </template>
        <template v-slot:other1="other1">
          <a-tooltip placement="topLeft" title="设置">
            <a-button size="small" class="edit-action-btn" icon="form" @click.stop="set(other1.record)"></a-button>
          </a-tooltip>
          <a-popconfirm placement="left" okText="确定" cancelText="取消" @confirm.stop="untie(other1.record)">
            <template slot="title">
              确定解绑设备吗？
              解绑后设备中的数据将被清空，无法进行刷脸消费
            </template>
            <a-tooltip placement="topLeft" title="解绑">
              <a-button size="small" class="del-action-btn" icon="delete"></a-button>
            </a-tooltip>
          </a-popconfirm>
        </template>
      </table-list>
    </div>
    <page-num v-model="pageList" :total="total" @change-page="showList"></page-num>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import SearchForm from '@c/SearchForm'
import TableList from '@c/TableList'
import PageNum from '@c/PageNum'
import machineColumns from '../../assets/table/machineColumns'
const searchLabel = [
  {
    value: 'deviceName',
    type: 'input',
    label: '设备名称',
    placeholder: '请输入名称'
  },
  {
    list: [
      {
        key: '',
        val: '全部'
      },
      {
        key: '0',
        val: '在线'
      },
      {
        key: '1',
        val: '离线'
      }
    ],
    value: 'deviceStatus',
    type: 'select',
    label: '状态'
  }
]
export default {
  name: 'MachineManage',
  components: {
    SearchForm,
    TableList,
    PageNum
  },
  data() {
    return {
      total: 0,
      searchLabel,
      machineColumns,
      pageList: {
        page: 1,
        size: 20
      },
      searchObj: {},
      machineList: []
    }
  },
  computed: {
    ...mapState('home', ['schoolCode'])
  },
  mounted() {
    this.showList()
  },
  methods: {
    ...mapActions('home', ['getDeviceList', 'addAuthor', 'unBindConsume']),
    async showList() {
      const req = {
        ...this.pageList,
        ...this.searchObj
      }
      const res = await this.getDeviceList(req)
      this.machineList = res.data.list
      this.total = res.data.total
    },
    searchForm(values) {
      this.searchObj = values
      this.showList()
    },
    // 授权
    async tie (record) {
      const req = {
        deviceSn: record.deviceSn,
        macAddress: record.macAddress,
        id: record.id,
        schoolCode: this.schoolCode
      }
      await this.addAuthor(req)
      this.$message.success('操作成功')
      this.$tools.goNext(() => {
        this.showList()
      })
    },
    set(record) {
      this.$router.push({
        path: '/consume/setMachine',
        query: {
          id: record.id,
          deviceSn: record.deviceSn
        }
      })
    },
    // 解绑
    untie (record) {
      const req = {
        id: record.id,
        deviceSn: record.deviceSn,
        isDelete: '1'
      }
      this.unBindConsume(req).then(res => {
        this.$message.success('解绑成功')
        this.$tools.goNext(() => {
          this.showList()
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
