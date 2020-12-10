<template>
  <div class="page-layout qui-fx-ver">
    <search-form isReset @search-form="searchForm" :search-label="route.searchLabel">
      <div slot="left">
        <a-button icon="plus" class="add-btn" @click="add(0)">添加路线图</a-button>
        <a-button icon="delete" class="del-btn" @click.stop="dels">批量删除</a-button>
      </div>
    </search-form>
    <table-list
      is-zoom
      is-check
      :page-list="pageList"
      :columns="route.columns"
      :table-list="imgList"
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
          <template slot="title">确定删除该疏散线路图吗？</template>
          <a-tooltip placement="topLeft" title="删除">
            <a-button size="small" class="del-action-btn" icon="delete"></a-button>
          </a-tooltip>
        </a-popconfirm>
      </template>
    </table-list>
    <page-num v-model="pageList" :total="total" @change-page="_getRouteImg"></page-num>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import TableList from '@c/TableList'
import PageNum from '@c/PageNum'
import route from '../../assets/js/table/route'
import SearchForm from '@c/SearchForm'
export default {
  name: 'EvacuateRoute',
  components: {
    TableList,
    PageNum,
    SearchForm
  },
  data() {
    return {
      route,
      bodyStyle: {
        padding: 0
      },
      visible: false,
      total: 0,
      pageList: {
        page: 1,
        size: 20
      },
      searchList: {},
      imgList: [],
      form: this.$form.createForm(this),
      areaList: [],
      disabled: false,
      chooseList: []
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  mounted() {
    this._getRouteImg()
  },
  methods: {
    ...mapActions('home', ['getRouteImg', 'delRouteImg', 'delRouteImgs']),
    async _getRouteImg() {
      this.searchList.schoolCode = this.userInfo.schoolCode
      this.searchList = Object.assign(this.searchList, this.pageList)
      const res = await this.getRouteImg(this.searchList)
      this.imgList = res.data.records
      this.total = res.data.total
    },
    add(type, record) {
      this.$router.push({
        path: '/evacuateRoute/addRoute',
        query: {
          id: record ? record.record.id : ''
        }
      })
    },
    // 删除单条记录
    async del(record) {
      await this.delRouteImg(record.record.id)
      this.$message.success('操作成功')
      this.$tools.goNext(() => {
        this._getRouteImg()
        this.chooseList = []
      })
    },
    // 批量删除
    dels(record) {
      if (this.chooseList.length === 0) {
        this.$message.warning('请选择要删除的疏散线路图')
        return false
      }
      this.$tools.delTip('确定删除选中的疏散路线图吗？', () => {
        this.delRouteImgs(this.chooseList).then((res) => {
          this.$message.success('操作成功')
          this.$tools.goNext(() => {
            this._getRouteImg()
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
      this._getRouteImg()
    }
  }
}
</script>
<style lang="less" scoped>
</style>
