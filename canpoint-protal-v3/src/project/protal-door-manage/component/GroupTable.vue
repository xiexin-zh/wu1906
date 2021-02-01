<template>
  <div class="page-layout u-fx-ver u-type-white-bg">
    <u-space direction="vertical" class="layout-padd">
      <u-alert message description="未加入通行权限组的学校人员在任意时间不允许通行"></u-alert>
      <u-search-form :search-label="currentSearchLabel" @search="search">
        <div slot="left">
          <u-button icon="plus" @click="currentAction(0)" type="primary">添加权限组</u-button>
        </div>
      </u-search-form>
    </u-space>
    <div class="u-fx u-fx-f1">
      <u-table :page-list="pageList" :columns="currentTable" :table-list="currentList">
        <template v-slot:slotOne="slotOne">
          <div class="u-fx-ver">
            <div v-for="(ele, i) in slotOne.record.timeRuleList" :key="i">
              <div class="u-fx-ac" style="margin: 5px 0">
                <span class="u-mar-r10">{{ ele.weekCode | getWeekDay }}</span>
                <div class="u-fx-ver">
                  <div class="u-fx" v-for="(item, j) in ele.timeRuleList" :key="j">
                    <span>{{ item.accessStart | getTimeString }}</span>
                    <span>~</span>
                    <span>{{ item.accessEnd | getTimeString }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
        <template v-slot:slotTwo="slotTwo">
          <div class="u-fx-ac">
            <div class="u-fx-ver">
              <span v-for="item in slotTwo.record.controlGroupList" :key="item.controlGroupCode">
                {{ item.controlGroupName }}
              </span>
            </div>
            <div class="u-mar-l10">
              <a-tooltip placement="top">
                <template slot="title">绑定</template>
                <a-icon
                  @click.stop="addControl(slotTwo.record.ruleGroupCode)"
                  type="plus"
                  style="padding-left: 8px; cursor: pointer"
                ></a-icon>
              </a-tooltip>
            </div>
          </div>
        </template>
        <template v-slot:slotThree="slotThree">
          <u-table-action
            @action="addUser(slotThree.record.ruleGroupCode, slotThree.record.userGroupCode)"
            buttonValue="绑定"
            icon="plus"
            iconTip="绑定"
            :label="slotThree.record.userCount"
          ></u-table-action>
        </template>
        <template v-slot:actions="actions">
          <u-button type="link" @click="currentAction(1, actions.record.ruleGroupCode)">编辑</u-button>
          <u-button type="link" delete @click="deleteCurrent(actions.record.ruleGroupCode)">删除</u-button>
        </template>
      </u-table>
    </div>
    <div class="u-type-white-bg">
      <u-pagination justify="end" v-model="pageList" :total="total" @change="showCurrentList"></u-pagination>
    </div>
    <u-choose-device
      is-check
      allow-empty
      editControlType
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
import { currentSearchLabel } from '../search-columns/current'
import { currentTable } from '../table-columns/current'
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
      currentSearchLabel,
      currentTable,
      currentList: [],
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
    this.showCurrentList()
  },
  methods: {
    ...mapActions('home', [
      'getGroupList',
      'delRuleGroup',
      'getGroupDetail',
      'updateAccessUser',
      'bindAccessDevice',
      'getAccessUserList'
    ]),
    // 权限组列表
    async showCurrentList() {
      const req = {
        pageNum: this.pageList.page,
        pageSize: this.pageList.size,
        schoolCode: this.schoolCode,
        ruleGroupType: this.ruleGroupType,
        groupName: this.ruleGroupName
      }
      const res = await this.getGroupList(req)
      this.total = res.data.total
      this.currentList = res.data.list.map((el) => {
        return {
          ...el,
          id: el.ruleGroupCode
        }
      })
    },
    // 搜索权限组
    search(value) {
      this.ruleGroupName = value.ruleGroupName
      this.showCurrentList()
    },
    /**
     * 新增编辑控制组
     * @param { Number } type 0新增1编辑
     * @param { String } id 编辑控制组ruleGroupCode
     */
    currentAction(type, ruleGroupCode) {
      const obj = {
        path: '/setGroup',
        query: {
          ruleGroupType: this.ruleGroupType,
          ruleGroupCode
        }
      }
      this.$router.push(obj)
    },
    // 删除权限组
    async deleteCurrent(ruleGroupCode) {
      await this.delRuleGroup({ ruleGroupCode, schoolCode: this.schoolCode })
      this.$message.success('删除成功')
      this.$tools.goNext(() => {
        this.showCurrentList()
      })
    },
    // 绑定设备
    async addControl(ruleGroupCode) {
      this.ruleGroupCode = ruleGroupCode
      const res = await this.getGroupDetail({
        ruleGroupCode,
        schoolCode: this.schoolCode
      })
      this.controlList = res.data.controlGroupList.map((ele) => {
        return {
          ...ele,
          deviceSn: ele.controlGroupCode,
          deviceName: ele.controlGroupName
        }
      })
      this.controlTag = true
    },
    // 绑定提交
    async controlSubmit(value) {
      const req = {
        schoolCode: this.schoolCode,
        ruleGroupCode: this.ruleGroupCode,
        controlGroupDtoList: value.map((ele) => {
          return {
            controlGroupCode: ele.deviceSn,
            controlGroupName: ele.deviceName,
            deviceType: ele.deviceType,
            snapSite: ele.snapSite,
            inOrOut: ele.inOrOut,
            controlType: ele.controlType ? 1 : 0
          }
        })
      }
      try {
        await this.bindAccessDevice(req)
        this.$message.success('绑定成功')
        this.$refs.chooseDeviceRef.reset()
        this.$tools.goNext(() => {
          this.showCurrentList()
        })
      } catch (err) {
        this.$refs.chooseDeviceRef.error()
      }
    },
    // 绑定人员
    async addUser(ruleGroupCode, userGroupCode) {
      this.ruleGroupCode = ruleGroupCode
      this.userGroupCode = userGroupCode
      const res = await this.getAccessUserList({
        pageNum: 1,
        pageSize: 50000,
        ruleGroupCode,
        userGroupCode,
        schoolCode: this.schoolCode
      })
      this.userList = res.data.list
      this.userTag = true
    },
    // 绑定提交
    async userSubmit(value) {
      const addUserInfoList = []
      const deleteUserInfoList = []
      value.delList.forEach((ele) => {
        deleteUserInfoList.push({
          userCode: ele.userCode,
          userName: ele.userName,
          userType: this.ruleGroupType
        })
      })
      value.addList.forEach((ele) => {
        addUserInfoList.push({
          userCode: ele.userCode,
          userName: ele.userName,
          userType: this.ruleGroupType
        })
      })
      const req = {
        schoolCode: this.schoolCode,
        ruleGroupCode: this.ruleGroupCode,
        userGroupCode: this.userGroupCode,
        addUserInfoList,
        deleteUserInfoList,
        userType: this.ruleGroupType
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
          this.showCurrentList()
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
