<template>
  <div class="account-list page-layout qui-fx-ver">
    <search-form is-reset @search-form="searchForm" :search-label="searchLabel"></search-form>
    <div class="qui-fx-f1 qui-fx">
      <table-list :page-list="pageList" :columns="machineColumns" :table-list="machineList">
        <template v-slot:actions="action">
          <div>
            <a-switch
              @click.native.stop
              @change="tie($event, action.record)"
              v-model="action.record.switch"
            />
          </div>
        </template>
        <template v-slot:other1="other1">
          <a-tooltip placement="topLeft" title="设置">
            <a-button size="small" class="edit-action-btn" icon="form" @click.stop="set(other1.record)"></a-button>
          </a-tooltip>
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
import { Switch } from 'ant-design-vue'
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
        key: '1',
        val: '在线'
      },
      {
        key: '2',
        val: '离线'
      }
    ],
    value: 'status',
    type: 'select',
    label: '状态'
  }
]
export default {
  name: 'MachineManage',
  components: {
    SearchForm,
    TableList,
    PageNum,
    ASwitch: Switch
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
    ...mapActions('home', ['getMachineList', 'editMachine', 'editMachineIsOpen', 'addAuthor', 'unBindConsume']),
    async showList() {
      const req = {
        pageNum: this.pageList.page,
        pageSize: this.pageList.size,
        status: this.searchObj.status,
        deviceName: this.searchObj.deviceName
      }
      const res = await this.getMachineList(req)
      this.machineList = res.rows.map(ele => {
        return {
          ...ele,
          switch: ele.isOpen === '1'
        }
      })
      this.total = res.total
    },
    searchForm(values) {
      this.searchObj = values
      this.showList()
    },
    // 授权
    async tie (value, record) {
      console.log(record)
      const req = {
        id: record.id,
        isOpen: value ? '1' : '0'
      }
      await this.editMachineIsOpen(req)
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
    }
  }
}
</script>

<style lang="less" scoped>
</style>
