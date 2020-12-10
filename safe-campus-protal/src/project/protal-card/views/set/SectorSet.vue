<template>
  <div class="sector-set page-layout qui-fx-ver">
    <no-data msg="暂无数据" v-if="dataList.length === 0"></no-data>
    <table-list
      v-else
      :page-list="pageList"
      :columns="columns"
      :table-list="dataList"
    >
      <template v-slot:actions="action">
        <a-tooltip placement="topLeft" title="修改设置">
          <a-button size="small" class="edit-action-btn" icon="form" @click.stop="edit(action.record)"></a-button>
        </a-tooltip>
        <a-popconfirm placement="left" okText="确定" cancelText="取消" @confirm="reset(action.record)">
          <template slot="title">
            您确定重置密码吗?
          </template>
          <a-tooltip placement="topLeft" title="重置密码">
            <a-button size="small" class="del-action-btn" icon="unlock"></a-button>
          </a-tooltip>
        </a-popconfirm>
      </template>
    </table-list>
    <page-num v-model="pageList" v-if="dataList.length !== 0" :total="total" @change-page="showList"></page-num>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import TableList from '@c/TableList'
import NoData from '@c/NoData'
import PageNum from '@c/PageNum'
const columns = [
/*   {
    title: '序号',
    width: '10%',
    scopedSlots: {
      customRender: 'index'
    }
  }, */
  {
    title: '扇区编号',
    dataIndex: 'userName',
    width: '15%'
  },
  {
    title: '扇区默认密码',
    dataIndex: 'mobile',
    width: '15%'
  },
  {
    title: '扇区使用密码',
    dataIndex: 'workNo',
    width: '15%'
  },
  {
    title: '使用类别',
    dataIndex: 'sex',
    width: '15'
  },
  {
    title: '备注',
    dataIndex: 'email',
    width: '15%'
  },
  {
    title: '操作',
    width: '25%',
    scopedSlots: {
      customRender: 'action'
    }
  }
]
export default {
  name: 'SectorSet',
  components: {
    TableList,
    PageNum,
    NoData
  },
  data() {
    return {
      columns,
      total: 0,
      pageList: {
        page: 1,
        size: 20
      },
      dataList: []
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  mounted() {
    // this.showList()
  },
  methods: {
    ...mapActions('home', [
      'getTeacherList'
    ]),
    async showList (keyword = '') {
      const req = {
        ...this.pageList,
        schoolCode: this.userInfo.schoolCode,
        orgCode: this.orgCode,
        keyword
      }
      const res = await this.getTeacherList(req)
      if (!res.data) {
        return
      }
      this.teacherList = res.data.list
      this.total = res.data.total
    },
    edit(record) {
    },
    reset(record) {
    }
  }
}
</script>
<style lang="less" scoped></style>
