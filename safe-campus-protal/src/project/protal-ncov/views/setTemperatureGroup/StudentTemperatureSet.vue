<template>
  <div class="page-layout qui-fx-ver">
    <choose-student
      ref="chooseUser"
      is-check
      v-if="userTag"
      chooseType="ncov"
      :bind-obj="bindObj"
      v-model="userTag"
      @submit="chooseUser"
      title="添加学生">
    </choose-student>
    <div class="qui-fx-jsb qui-fx-ac">
      <div></div>
      <div class="top-btn-group">
        <a-button icon="plus" type="primary" @click="addGroup(0)">添加测温组</a-button>
      </div>
    </div>
    <table-list :page-list="pageList" :columns="columns" :table-list="recordList">
      <template v-slot:accessEqs="accessEq">
        <div class="qui-fx-ver">
          <div class="qu-fx" v-for="(item, i) in accessEq.record.controllerNames" :key="i">
            <span>{{ item }}</span>
          </div>
        </div>
      </template>
      <template v-slot:crews="crew">
        <div class="qui-fx qui-fx-ac">
          {{ crew.record.userCount }}
          <a-button
            size="small"
            type="primary"
            icon="plus"
            style="margin-left:10px;"
            @click="addCrew(crew.record.id, crew.record.code)"
          ></a-button>
        </div>
      </template>
      <template v-slot:actions="action">
        <div>
          <a-tooltip placement="topLeft" title="编辑">
            <a-button size="small" class="edit-action-btn" icon="form" @click.stop="addGroup(1,action.record.id)"></a-button>
          </a-tooltip>
          <a-popconfirm placement="left" okText="确定" cancelText="取消" @confirm.stop="delGroup(action.record.id)">
            <template slot="title">
              您确定删除吗?
            </template>
            <a-tooltip placement="topLeft" title="删除">
              <a-button size="small" class="del-action-btn" icon="delete"></a-button>
            </a-tooltip>
          </a-popconfirm>
        </div>
      </template>
    </table-list>
    <page-num v-model="pageList" :total="total" @change-page="showList"></page-num>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import TableList from './TableList'
import PageNum from '@c/PageNum'
import ChooseStudent from '@c/ChooseStudent'
const columns = [
  {
    title: '序号',
    width: '20%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '测温组名称',
    dataIndex: 'name',
    width: '20%'
  },
  {
    title: '测温设备',
    dataIndex: 'controllerNames',
    width: '20%',
    scopedSlots: {
      customRender: 'accessEq'
    }
  },
  {
    title: '测温人员',
    dataIndex: 'userCount',
    width: '20%',
    scopedSlots: {
      customRender: 'crew'
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
  name: 'StudentTemperatureSet',
  components: {
    TableList,
    PageNum,
    ChooseStudent
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  data() {
    return {
      columns,
      userTag: false,
      total: 1,
      pageList: {
        page: 1,
        size: 20
      },
      id: '',
      groupCode: '',
      bindObj: {},
      recordList: []
    }
  },
  mounted() {
    this.showList()
  },
  methods: {
    ...mapActions('home', ['getAccessList', 'delAccess', 'bindAccessUser']),
    async showList() {
      const req = {
        ...this.pageList,
        schoolCode: this.userInfo.schoolCode,
        type: '8'
      }
      const res = await this.getAccessList(req)
      this.total = res.data.total
      this.recordList = res.data.list
    },
    // 添加控制组
    addGroup(type, id) {
      const obj = {
        path: '/studentTemperatureSet/setGroup',
        query: type === 0 ? { type: 'student' } : { id, type: 'student' }
      }
      this.$router.push(obj)
    },
    // 删除控制组
    async delGroup(id) {
      await this.delAccess(id)
      this.$message.success('删除成功')
      this.$tools.goNext(() => {
        this.showList()
      })
    },
    // 适用人员管理
    addCrew(id, groupCode) {
      this.id = id
      this.groupCode = groupCode
      this.bindObj.groupCode = groupCode
      this.userTag = true
    },
    async chooseUser(values) {
      const users = []
      values.forEach(ele => {
        users.push({
          userName: ele.userName,
          userCode: ele.userCode
        })
      })
      const req = {
        schoolCode: this.userInfo.schoolCode,
        groupId: this.id,
        groupCode: this.groupCode,
        users
      }
      try {
        await this.bindAccessUser(req)
        this.$message.success('添加成功')
        this.$refs.chooseUser.reset()
        this.$tools.goNext(() => {
          this.showList()
        })
      } catch (err) {
        this.$refs.chooseUser.error()
      }
    }
  }
}
</script>
<style lang="less" scoped>
</style>
