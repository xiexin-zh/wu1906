<template>
  <div class="teacher-set page-layout u-fx-ver u-type-white-bg">
    <u-space direction="vertical" class="layout-padd">
      <u-alert message description="考勤组、考勤时间、考勤设备、考勤人员发生变更操作后，次日生效。"></u-alert>
      <u-search-form :search-label="groupSearchLabel" @search="search">
        <div slot="left">
          <u-button icon="plus" @click="groupAction(0)" type="primary">添加考勤组</u-button>
        </div>
      </u-search-form>
    </u-space>
    <div class="u-fx u-fx-f1">
      <u-table :page-list="pageList" :columns="groupTable" :table-list="groupList">
        <template v-slot:slotOne="slotOne">
          <div class="u-fx-ver" v-if="ruleGroupType === '1'">
            <div v-for="(ele, i) in slotOne.record.ruleTime" :key="i">
              <div class="u-fx-ac" style="margin: 5px 0">
                <span class="u-mar-r10">{{ ele.dayName | getWeekDay }}</span>
                <div
                  class="u-fx"
                  v-for="(list, index) in ele.ruleTimeDtoList"
                  :key="index"
                >{{ list.startTime }} ~ {{ list.endTime }}</div>
              </div>
            </div>
          </div>
          <div class="u-fx-ver" v-if="ruleGroupType === '2'">
            <div v-for="(ele, i) in JSON.parse(slotOne.record.ruleTime)" :key="i">
              <div class="u-fx-ac" style="margin: 5px 0">
                <span class="u-mar-r10">{{ ele.dayName | getWeekDay }}</span>
                <div class="u-fx-ver">
                  <span>{{ ele.startTime }} ~ {{ ele.endTime }}</span>
                </div>
              </div>
            </div>
          </div>
        </template>
        <template v-slot:slotTwo="slotTwo">
          <div class="u-fx-ac">
            <div class="u-fx-ver">
              <span v-for="item in slotTwo.record.controllerNames" :key="item.controlGroupCode">
                {{ item }}
              </span>
            </div>
            <div class="u-mar-l10">
              <a-tooltip placement="top">
                <template slot="title">绑定</template>
                <a-icon
                  @click.stop="addControl(slotTwo.record.id)"
                  type="plus"
                  style="padding-left: 8px; cursor: pointer"
                ></a-icon>
              </a-tooltip>
            </div>
          </div>
        </template>
        <template v-slot:slotThree="slotThree">
          <u-table-action
            @action="addUser(slotThree.record.id)"
            buttonValue="绑定"
            icon="plus"
            iconTip="绑定"
            :label="slotThree.record.userCount"
          ></u-table-action>
        </template>
        <template v-slot:actions="actions">
          <u-button type="link" @click="groupAction(1, actions.record.id)">编辑</u-button>
          <u-button type="link" delete @click="deleteGroup(actions.record.id)">删除</u-button>
        </template>
      </u-table>
    </div>
    <div class="u-type-white-bg">
      <u-pagination justify="end" v-model="pageList" :total="total" @change="showGroupList"></u-pagination>
    </div>
    <u-choose-device
      is-check
      allow-empty
      update-type
      ref="chooseDeviceRef"
      v-if="controlTag"
      v-model="controlTag"
      :schoolCode="schoolCode"
      :bindList="controlList"
      @submit="controlSubmit"
    >
    </u-choose-device>
    <u-choose-teacher
      update-type
      allow-empty
      ref="chooseTeacherRef"
      is-check
      v-if="userTag && ruleGroupType === '1'"
      :bindList="userList"
      v-model="userTag"
      @submit="userSubmit"
      title="添加适用人员"
      :schoolCode="schoolCode"
    ></u-choose-teacher>
    <u-choose-student
      update-type
      allow-empty
      ref="chooseStudentRef"
      is-check
      v-if="userTag && ruleGroupType === '2'"
      :bindList="userList"
      v-model="userTag"
      @submit="userSubmit"
      title="添加适用人员"
      :schoolCode="schoolCode"
    ></u-choose-student>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { groupSearchLabel } from '../search-columns/group'
import { groupTable } from '../table-columns/group'
export default {
  name: 'GroupTable',
  components: {},
  props: {
    // 教职工1 学生2
    ruleGroupType: {
      type: String,
      default: '1'
    }
  },
  data() {
    return {
      groupSearchLabel,
      groupTable,
      groupList: [],
      pageList: { page: 1, size: 20 },
      total: 0,
      controlList: [],
      controlTag: false,
      userList: [],
      userTag: false
    }
  },
  computed: {
    ...mapState('home', ['schoolCode'])
  },
  mounted() {
    this.showGroupList()
  },
  methods: {
    ...mapActions('home', [
      'getAttendanceGroup',
      'getAccessList',
      'delAccess',
      'bindAccessUser',
      'updateAccessUser',
      'getTeaAccessDetail',
      'getAccessDetail',
      'bindAccessDevice',
      'getAccessUser'
    ]),
    // 权限组列表
    async showGroupList() {
      const req = {
        ...this.pageList,
        schoolCode: this.schoolCode,
        type: this.ruleGroupType,
        groupName: this.ruleGroupName
      }
      const action = this.ruleGroupType === '1' ? 'getAttendanceGroup' : 'getAccessList'
      const res = await this[action](req)
      this.total = res.data.total
      this.groupList = res.data.list
    },
    // 搜索权限组
    search(value) {
      this.ruleGroupName = value.ruleGroupName
      this.showGroupList()
    },
    /**
     * 新增编辑控制组
     * @param { Number } type 0新增1编辑
     * @param { String } id 编辑控制组id
     */
    groupAction(type, id) {
      const obj = {
        path: '/setGroup',
        query: {
          ruleGroupType: this.ruleGroupType,
          id
        }
      }
      this.$router.push(obj)
    },
    // 删除权限组
    async deleteGroup(id) {
      await this.delAccess({ id })
      this.$message.success('删除成功')
      this.$tools.goNext(() => {
        this.showGroupList()
      })
    },
    // 绑定设备
    async addControl(id) {
      this.id = id
      const action = this.ruleGroupType === '1' ? 'getTeaAccessDetail' : 'getAccessDetail'
      const res = await this[action]({ groupId: id })
      this.controlList = res.data.controllerGroups.map((ele) => {
        return {
          ...ele,
          snapSite: ele.address,
          deviceType: ele.type,
          deviceId: ele.id
        }
      })
      this.controlTag = true
    },
    // 绑定提交
    async controlSubmit(value) {
      const addDeviceGroups = []
      const deleteDeviceGroups = []
      value.delList.forEach(ele => {
        deleteDeviceGroups.push({
          deviceName: ele.deviceName,
          deviceSn: ele.deviceSn,
          inOrOut: ele.inOrOut,
          type: ele.deviceType || ele.type,
          id: ele.deviceId
        })
      })
      value.addList.forEach(ele => {
        addDeviceGroups.push({
          deviceName: ele.deviceName,
          deviceSn: ele.deviceSn,
          inOrOut: ele.inOrOut,
          type: ele.deviceType || ele.type,
          id: ele.deviceId
        })
      })
      const req = {
        schoolCode: this.schoolCode,
        groupId: this.id,
        addDeviceGroups,
        deleteDeviceGroups
      }
      try {
        await this.bindAccessDevice(req)
        this.$message.success('绑定成功')
        this.$refs.chooseDeviceRef.reset()
        this.$tools.goNext(() => {
          this.showGroupList()
        })
      } catch (err) {
        this.$refs.chooseDeviceRef.error()
      }
    },
    // 绑定人员
    async addUser(id) {
      this.id = id
      const res = await this.getAccessUser({
        attendanceUserId: id
      })
      this.userList = res.data
      this.userTag = true
    },
    // 绑定提交
    async userSubmit(value) {
      const addUsers = []
      const deleteUsers = []
      value.delList.forEach((ele) => {
        deleteUsers.push({
          userCode: ele.userCode,
          userName: ele.userName
        })
      })
      value.addList.forEach((ele) => {
        addUsers.push({
          userCode: ele.userCode,
          userName: ele.userName
        })
      })
      const req = {
        schoolCode: this.schoolCode,
        groupId: this.id,
        addUsers,
        deleteUsers
      }
      try {
        await this.updateAccessUser(req)
        if (this.ruleGroupType === '1') {
          this.$refs.chooseTeacherRef.reset()
        } else if (this.ruleGroupType === '2') {
          this.$refs.chooseStudentRef.reset()
        }
        this.$message.success('绑定成功')
        this.$tools.goNext(() => {
          this.showGroupList()
        })
      } catch (e) {
        if (this.ruleGroupType === '1') {
          this.$refs.chooseTeacherRef.error()
        } else if (this.ruleGroupType === '2') {
          this.$refs.chooseStudentRef.error()
        }
      }
    }
  }
}
</script>
<style lang="less" scoped></style>
