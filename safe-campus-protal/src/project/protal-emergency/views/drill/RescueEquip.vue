<template>
  <div class="page-layout qui-fx-ver">
    <search-form isReset @search-form="searchForm" :search-label="equip.searchLabel">
      <div slot="left">
        <a-button icon="plus" class="add-btn" @click="add(0)">添加器材</a-button>
        <a-button icon="delete" class="del-btn" @click.stop="dels">批量删除</a-button>
      </div>
    </search-form>
    <table-list
      is-check
      :page-list="pageList"
      :columns="equip.columns"
      :table-list="equipList"
      v-model="chooseList"
    >
      <template v-slot:actions="action">
        <a-tooltip
          placement="topLeft"
          title="编辑"
        >
          <a-button size="small" class="edit-action-btn" icon="form" @click="add(2,action)"></a-button>
        </a-tooltip>
        <a-popconfirm
          placement="left"
          okText="确定"
          cancelText="取消"
          @confirm="del(action)"
        >
          <template slot="title">确定删除该器材吗？</template>
          <a-tooltip placement="topLeft" title="删除">
            <a-button size="small" class="del-action-btn" icon="delete"></a-button>
          </a-tooltip>
        </a-popconfirm>
      </template>
    </table-list>
    <page-num v-model="pageList" :total="total" @change-page="_getRescueEquip"></page-num>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import TableList from '@c/TableList'
import PageNum from '@c/PageNum'
import equip from '../../assets/js/table/equip'
import SearchForm from '@c/SearchForm'
export default {
  name: 'RescueEquip',
  components: {
    TableList,
    PageNum,
    SearchForm
  },
  data() {
    return {
      equip,
      total: 0,
      pageList: {
        page: 1,
        size: 20
      },
      searchList: {},
      equipList: [],
      form: this.$form.createForm(this),
      chooseList: []
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  mounted() {
    this._getRescueEquip()
  },
  methods: {
    ...mapActions('home', ['getRescueEquip', 'delRescueEquip', 'delRescueEquips']),
    async _getRescueEquip() {
      this.searchList.schoolCode = this.userInfo.schoolCode
      this.searchList = Object.assign(this.searchList, this.pageList)
      const res = await this.getRescueEquip(this.searchList)
      this.equipList = res.data.records
      this.total = res.data.total
    },
    add(type, record) {
      this.$router.push({
        path: '/rescueEquip/addEquip',
        query: {
          id: record ? record.record.id : ''
        }
      })
    },
    // 删除单条记录
    async del(record) {
      await this.delRescueEquip(record.record.id)
      this.$message.success('操作成功')
      this.$tools.goNext(() => {
        this._getRescueEquip()
        this.chooseList = []
      })
    },
    // 批量删除
    dels(record) {
      if (this.chooseList.length === 0) {
        this.$message.warning('请选择要删除的器材')
        return false
      }
      this.$tools.delTip('确定删除选中的器材吗？', () => {
        this.delRescueEquips(this.chooseList).then((res) => {
          this.$message.success('操作成功')
          this.$tools.goNext(() => {
            this._getRescueEquip()
            this.chooseList = []
          })
        })
      })
    },
    // 查询
    searchForm(values) {
      this.pageList.page = 1
      this.pageList.size = 20
      this.searchList = Object.assign(this.searchList, values)
      this._getRescueEquip()
    }
  }
}
</script>
<style lang="less" scoped>
</style>
