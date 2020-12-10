<template>
  <div class="page-layout qui-fx-ver">
    <div class="top-btn-group">
      <a-button icon="plus" class="add-btn" @click="add(0)">添加区域</a-button>
      <a-button icon="delete" class="del-btn" @click="dels">批量删除</a-button>
    </div>
    <table-list
      is-check
      :page-list="pageList"
      :columns="columns"
      :table-list="userList"
      v-model="chooseList"
    >
      <template v-slot:actions="action">
        <a-tooltip
          placement="topLeft"
          title="编辑"
        >
          <a-button size="small" class="edit-action-btn" icon="form" @click="add(1,action)"></a-button>
        </a-tooltip>
        <a-popconfirm
          placement="left"
          okText="确定"
          cancelText="取消"
          @confirm="del(action)"
        >
          <template slot="title">确定删除该区域吗？</template>
          <a-tooltip placement="topLeft" title="删除">
            <a-button size="small" class="del-action-btn" icon="delete"></a-button>
          </a-tooltip>
        </a-popconfirm>
      </template>
    </table-list>
    <page-num v-model="pageList" :total="total" @change-page="_getAreaList"></page-num>
    <add-area :title="title" v-model="areaTag" @update="_getAreaList" ref="addArea"></add-area>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import TableList from '@c/TableList'
import PageNum from '@c/PageNum'
import columns from '../../assets/js/table/area.js'
import AddArea from '../../component/AddArea'
export default {
  name: 'AreaSet',
  components: {
    TableList,
    PageNum,
    AddArea
  },
  data() {
    return {
      columns,
      total: 0,
      pageList: {
        page: 1,
        size: 20
      },
      searchList: {},
      userList: [],
      form: this.$form.createForm(this),
      chooseList: [],
      title: '添加区域',
      areaTag: false
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  mounted() {
    this._getAreaList()
  },
  methods: {
    ...mapActions('home', ['getAreaList', 'delRadioArea', 'delRadioAreas']),
    // 区域列表
    async _getAreaList() {
      this.searchList.schoolCode = this.userInfo.schoolCode
      this.searchList = Object.assign(this.searchList, this.pageList)
      const res = await this.getAreaList(this.searchList)
      this.userList = res.data.records.map(el => {
        return {
          ...el,
          id: el.areaCode
        }
      })
      this.total = res.data.total
    },
    // 添加编辑区域
    add(type, record) {
      if (type) {
        this.title = '编辑区域'
        this.$refs.addArea._radioAreaDetail(record.record.areaCode)
      } else {
        this.title = '添加区域'
        this.$refs.addArea.appForm.areaName = ''
        this.$refs.addArea.detailId = ''
        this.$refs.addArea.project = []
      }
      this.areaTag = true
    },
    // 删除单条记录
    async del(record) {
      await this.delRadioArea(record.record.areaCode)
      this.$message.success('操作成功')
      this.$tools.goNext(() => {
        this._getAreaList()
        this.chooseList = []
      })
    },
    // 批量删除
    dels(record) {
      if (this.chooseList.length === 0) {
        this.$message.warning('请选择要删除的区域')
        return false
      }
      this.$tools.delTip('确定删除选中的区域吗？', () => {
        this.delRadioAreas(this.chooseList).then((res) => {
          this.$message.success('操作成功')
          this.$tools.goNext(() => {
            this._getAreaList()
            this.chooseList = []
          })
        })
      })
    }
  }
}
</script>
<style lang="less" scoped>
</style>
