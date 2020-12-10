<template>
  <div class="page-layout qui-fx-ver">
    <choose-user
      ref="chooseUser"
      is-check
      chooseType="attendance"
      :bind-obj="bindObj"
      v-if="userTag"
      v-model="userTag"
      @submit="chooseUser"
      title="添加考勤人员"
    >
    </choose-user>
    <div class="qui-fx-jsb qui-fx-ac">
      <div class="tips">
        <span>说明：考勤组、考勤时间、考勤设备、考勤人员发生变更操作后，次日生效。</span>
      </div>
      <div class="top-btn-group">
        <a-button icon="plus" type="primary" @click="addGroup(0)">添加考勤组</a-button>
      </div>
    </div>
    <table-list :page-list="pageList" :columns="columns" :table-list="recordList">
      <template v-slot:accessTimes="accessTime">
        <div class="qui-fx" v-for="(ele, i) in accessTime.record.ruleTime" :key="i">
          <div>{{ ele.dayName | getWeekDay }}</div>
          <div class="qui-fx u-mar-l10" v-for="(list, index) in ele.ruleTimeDtoList" :key="index">
            {{ list.startTime }} ~ {{ list.endTime }}
          </div>
        </div>
      </template>
      <template v-slot:accessEqs="accessEq">
        <div class="qui-fx-ver">
          <div class="qu-fx" v-for="item in accessEq.record.controllerNames" :key="item.id">
            <span>{{ item }}</span>
          </div>
        </div>
      </template>
      <template v-slot:crews="crew">
        <total-show
          :total="crew.record.userCount"
          @click.native="addCrew(crew.record.id)"
        ></total-show>
      </template>
      <template v-slot:actions="action">
        <div>
          <a-tooltip placement="topLeft" title="编辑">
            <a-button
              size="small"
              class="edit-action-btn"
              icon="form"
              @click.stop="addGroup(1, action.record.id)"
            ></a-button>
          </a-tooltip>
          <a-popconfirm
            placement="left"
            okText="确定"
            cancelText="取消"
            @confirm.stop="delGroup(action.record.id)"
          >
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
import ChooseUser from '@c/ChooseUser'
import TotalShow from '@c/TotalShow'
const columns = [
  {
    title: '序号',
    width: '8%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '考勤组名称',
    dataIndex: 'name',
    width: '15%'
  },
  {
    title: '考勤时间',
    dataIndex: 'ruleTime',
    width: '30%',
    scopedSlots: {
      customRender: 'accessTime'
    }
  },
  {
    title: '考勤设备',
    dataIndex: 'controllerNames',
    width: '15%',
    scopedSlots: {
      customRender: 'accessEq'
    }
  },
  {
    title: '考勤人员',
    dataIndex: 'userCount',
    width: '15%',
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
  name: 'TeacherAccessSet',
  components: {
    TableList,
    PageNum,
    ChooseUser,
    TotalShow
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  data() {
    return {
      columns,
      userTag: false,
      total: 0,
      id: '',
      bindObj: {},
      pageList: {
        page: 1,
        size: 20
      },
      recordList: []
    }
  },
  mounted() {
    this.showList()
  },
  methods: {
    ...mapActions('home', ['getAttendanceGroup', 'delAccess', 'bindAccessUser']),
    async showList() {
      const req = {
        ...this.pageList,
        schoolCode: this.userInfo.schoolCode,
        type: '1'
      }
      const res = await this.getAttendanceGroup(req)
      this.total = res.data.total
      this.recordList = res.data.list
    },
    // 添加控制组
    addGroup(type, id) {
      console.log(123)
      const obj = {
        path: '/teacherAccessSet/teacherSet',
        query: {
          id: type ? id : ''
        }
      }
      this.$router.push(obj)
    },
    // 删除控制组
    async delGroup(id) {
      console.log(id)
      await this.delAccess({ id })
      this.$message.success('删除成功')
      this.$tools.goNext(() => {
        this.showList()
      })
    },
    // 适用人员管理
    addCrew(id) {
      this.id = id
      this.bindObj.id = id
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
.tips {
  font-size: 12px;
  margin-left: 20px;
  color: #909399;
}
</style>
