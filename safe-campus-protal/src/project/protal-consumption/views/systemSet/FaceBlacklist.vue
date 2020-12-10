<template>
  <div class="sector-set page-layout qui-fx-ver">
    <choose-people
      isCheck
      ref="bindTemplate"
      v-if="bindTag"
      v-model="bindTag"
      @submit="bindSubmit"
      title="添加黑名单"
    ></choose-people>
    <div class="top-btn-group qui-fx">
      <a-button type="primary" @click="bindTag = true"> <a-icon type="plus" />添加</a-button>
    </div>
    <table-list is-zoom :page-list="pageList" :columns="columns" :table-list="dataList">
      <template v-slot:actions="action">
        <a-popconfirm placement="left" okText="确定" cancelText="取消" @confirm="del(action.record)">
          <template slot="title">确定从黑名单中删除该人脸吗？</template>
          <a-tooltip placement="topLeft" title="删除">
            <a-button size="small" class="del-action-btn" icon="unlock"></a-button>
          </a-tooltip>
        </a-popconfirm>
      </template>
    </table-list>
    <page-num
      v-model="pageList"
      :total="total"
      @change-page="showList"
    ></page-num>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import TableList from '@c/TableList'
import NoData from '@c/NoData'
import ChoosePeople from '@c/choose/ChoosePeople'
import PageNum from '@c/PageNum'
const columns = [
  {
    title: '序号',
    width: '10%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '姓名',
    dataIndex: 'userName',
    width: '10%'
  },
  {
    title: '身份',
    dataIndex: 'userType',
    width: '10%',
    customRender: text => {
      return text === '1' ? '学生' : text === '2' ? '教职工' : '其它'
    }
  },
  {
    title: '学号/工号',
    dataIndex: 'workNo',
    width: '10%'
  },
  {
    title: '班级/部门',
    dataIndex: 'classBoards',
    width: '15'
  },
  {
    title: '加入时间',
    dataIndex: 'joinTime',
    width: '15%'
  },
  {
    title: '人脸照片',
    dataIndex: 'photoUrl',
    width: '15%',
    scopedSlots: {
      customRender: 'snapPic'
    }
  },
  {
    title: '操作',
    width: '15%',
    scopedSlots: {
      customRender: 'action'
    }
  }
]
export default {
  name: 'FaceBlacklist',
  components: {
    ChoosePeople,
    TableList,
    PageNum,
    NoData
  },
  data() {
    return {
      bindTag: false,
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
    this.showList()
  },
  methods: {
    ...mapActions('home', ['getBlackList', 'addNewBlack', 'deleBlack']),
    async showList(keyword = '') {
      const req = {
        pageNum: this.pageList.page,
        pageSize: this.pageList.size
      }
      const res = await this.getBlackList(req)
      this.dataList = res.rows
      this.total = res.total
    },
    async bindSubmit(value) {
      await this.addNewBlack({
        userList: value.stuList.map(el => {
          return {
            userName: el.userName,
            userCode: el.userCode,
            userType: 1
          }
        }).concat(value.teaList.map(el => {
          return {
            userName: el.userName,
            userCode: el.userCode,
            userType: 2
          }
        })),
        schoolCode: this.userInfo.schoolCode
      })
      this.$message.success('添加成功')
      this.$tools.goNext(() => {
        this.$refs.bindTemplate.reset()
        this.showList()
      })
    },
    del(record) {
      this.deleBlack(record.id).then((res) => {
        this.$message.success('删除成功')
        this.$tools.goNext(() => {
          this.showList()
        })
      })
    }
  }
}
</script>
<style lang="less" scoped></style>
