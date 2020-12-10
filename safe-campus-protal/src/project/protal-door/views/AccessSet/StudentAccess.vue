<template>
  <div class="page-layout qui-fx-ver">
    <choose-student
      ref="chooseUser"
      is-check
      chooseType="door"
      :bind-obj="bindObj"
      v-if="userTag"
      v-model="userTag"
      @submit="chooseUser"
      title="添加学生"
    ></choose-student>
    <div class="qui-fx-jsb qui-fx-ac">
      <div class="tips">
        <div>说明：未加入通行权限组的学校人员在任意时间不允许通行；</div>
        <div style="text-indent: 35px;">
          同一人员若在不同权限组绑定了同一个设备且通行时间不同，则通行时间取并集。
        </div>
      </div>
      <div class="top-btn-group">
        <a-button icon="plus" type="primary" @click="addGroup(0)">添加权限组</a-button>
      </div>
    </div>
    <table-list :page-list="pageList" :columns="columns" :table-list="recordList">
      <template v-slot:accessTimes="accessTime">
        <div class="qui-fx-ver">
          <div v-for="(ele, i) in accessTime.record.timeRuleList" :key="i">
            <div class="qui-fx-ac" style="margin:5px 0">
              <span style="margin-right:10px;">{{ ele.weekCode | getWeekDay }}</span>
              <div class="qui-fx-ver">
                <div class="qui-fx" v-for="(item, j) in ele.timeRuleList" :key="j">
                  <span>{{ item.accessStart | getTimeString }}</span>
                  <span>~</span>
                  <span>{{ item.accessEnd | getTimeString }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template v-slot:accessEqs="accessEq">
        <div class="qui-fx-ver">
          <div
            class="qu-fx"
            v-for="item in accessEq.record.controlGroupList"
            :key="item.controlGroupCode"
          >
            <span>{{ item.controlGroupName }}</span>
          </div>
        </div>
      </template>
      <template v-slot:crews="crew">
        <total-show
          :total="crew.record.userCount"
          @click.native="addCrew(crew.record.ruleGroupCode, crew.record.userGroupCode)"
        ></total-show>
      </template>
      <template v-slot:actions="action">
        <div>
          <a-tooltip placement="topLeft" title="编辑">
            <a-button
              size="small"
              class="edit-action-btn"
              icon="form"
              @click.stop="addGroup(1, action.record.ruleGroupCode)"
            ></a-button>
          </a-tooltip>
          <a-popconfirm
            placement="left"
            okText="确定"
            cancelText="取消"
            @confirm.stop="delGroup(action.record.ruleGroupCode)"
          >
            <template slot="title">您确定删除吗?</template>
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
import TotalShow from '@c/TotalShow'
const columns = [
  {
    title: '序号',
    width: '16%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '权限组名称',
    dataIndex: 'ruleGroupName',
    width: '16%'
  },
  {
    title: '通行时间',
    dataIndex: 'timeRuleList',
    width: '16%',
    scopedSlots: {
      customRender: 'accessTime'
    }
  },
  {
    title: '通行设备',
    dataIndex: 'controlGroupList',
    width: '16%',
    scopedSlots: {
      customRender: 'accessEq'
    }
  },
  {
    title: '适用人员',
    dataIndex: 'userCount',
    width: '20%',
    scopedSlots: {
      customRender: 'crew'
    }
  },
  {
    title: '操作',
    width: '10%',
    scopedSlots: {
      customRender: 'action'
    }
  }
]
export default {
  name: 'StudentAccess',
  components: {
    TableList,
    PageNum,
    ChooseStudent,
    TotalShow
  },
  data() {
    return {
      columns,
      userTag: false,
      total: 0,
      id: '',
      bindObj: {},
      userGroupCode: '',
      ruleGroupCode: '',
      pageList: {
        page: 1,
        size: 20
      },
      recordList: []
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  mounted() {
    this.showList()
  },
  methods: {
    ...mapActions('home', ['getGroupList', 'delRuleGroup', 'bindAccessUser']),
    async showList() {
      const req = {
        pageNum: this.pageList.page,
        pageSize: this.pageList.size,
        schoolCode: this.userInfo.schoolCode,
        ruleGroupType: '2'
      }
      const res = await this.getGroupList(req)
      this.total = res.data.total
      this.recordList = res.data.list
    },
    // 添加控制组
    addGroup(type, id) {
      const obj = {
        path: '/studentAccess/setGroup',
        query: type === 0 ? { type: 'student' } : { id, type: 'student' }
      }
      this.$router.push(obj)
    },
    // 删除控制组
    async delGroup(ruleGroupCode) {
      await this.delRuleGroup({ ruleGroupCode, schoolCode: this.userInfo.schoolCode })
      this.$message.success('删除成功')
      this.$tools.goNext(() => {
        this.showList()
      })
    },
    // 适用人员管理
    addCrew(ruleGroupCode, userGroupCode) {
      this.ruleGroupCode = ruleGroupCode
      this.userGroupCode = userGroupCode
      this.bindObj = {
        ruleGroupCode,
        userGroupCode,
        schoolCode: this.userInfo.schoolCode
      }
      this.userTag = true
    },
    async chooseUser(values) {
      console.log(values)
      const userInfoList = []
      values.forEach(ele => {
        userInfoList.push({
          userCode: ele.userCode,
          userName: ele.userName,
          userType: '2'
        })
      })
      const req = {
        schoolCode: this.userInfo.schoolCode,
        ruleGroupCode: this.ruleGroupCode,
        userGroupCode: this.userGroupCode,
        userInfoList,
        userType: '2'
      }
      try {
        await this.bindAccessUser(req)
        this.$refs.chooseUser.reset()
        this.$message.success('添加成功')
        this.$tools.goNext(() => {
          this.showList()
        })
      } catch (e) {
        this.$refs.chooseUser.error()
      }
    }
  }
}
</script>
<style lang="less" scoped>
.tips {
  font-size: 12px;
  margin-left: 20px;
  color: #909399;
}
</style>
