<template>
  <div class="home page-layout u-fx-ver u-type-white-bg layout-padd u-scroll-y">
    <u-choose-teacher
      is-check
      ref="chooseTeacherRef"
      v-if="showTag"
      v-model="showTag"
      :schoolCode="schoolCode"
      @submit="_addDormMaster"
      title="添加宿管"
    ></u-choose-teacher>
    <u-space direction="vertical">
      <u-alert message description="您可以给每个楼栋设置宿管"></u-alert>
      <a-collapse :defaultActiveKey="activeKey">
        <a-collapse-panel
          :key="index"
          :header="build.buildingName"
          v-for="(build, index) in buildList"
        >
          <u-empty description="暂未添加宿管" v-if="build.masterList.length === 0"></u-empty>
          <div
            class="master-list u-fx-ac u-shadow"
            v-for="master in build.masterList"
            :key="master.id"
          >
            <img :src="master.photoUrl || autoUser" alt />
            <div class="u-fx-f1 u-mar-l10">
              <div>姓名：{{ master.userName }}</div>
              <div class="u-padd-t5 u-padd-b5">部门：{{ master.deptName }}</div>
              <div>电话：{{ master.mobile }}</div>
            </div>
            <u-button
              type="danger"
              @click="_delDormMaster(build.buildingCode, master.userCode)"
              delete
              size="small"
              icon="delete"
              content="确定删除宿管吗?"
            >删除</u-button>
          </div>
          <u-button
            icon="plus"
            slot="extra"
            type="primary"
            @click="addDrom(build.buildingCode)"
          >添加宿管</u-button>
        </a-collapse-panel>
      </a-collapse>
    </u-space>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import autoUser from '@a/img/auto-user.png'
export default {
  name: 'ManageSet',
  components: {},
  data() {
    return {
      autoUser,
      buildList: [],
      activeKey: [0],
      showTag: false
    }
  },
  computed: {
    ...mapState('home', ['schoolCode'])
  },
  mounted() {
    this._getDormMaster()
  },
  methods: {
    ...mapActions('home', ['getDormMaster', 'addDormMaster', 'delDormMaster']),
    /**
     * 获取宿舍楼栋以及绑定的宿管
     */
    async _getDormMaster() {
      const res = await this.getDormMaster({
        schoolCode: this.schoolCode
      })
      this.buildList = res.data
    },
    /**
     * 添加宿管逻辑操作
     * @param { string } code 当前楼栋的code
     */
    addDrom(code) {
      this.buildingCode = code
      this.showTag = true
    },
    /**
     * 添加宿管业务操作
     * @param { string } code 当前楼栋的code
     */
    async _addDormMaster(values) {
      try {
        const req = {
          schoolCode: this.schoolCode,
          buildingCode: this.buildingCode,
          masterList: values.map(item => {
            return {
              createTime: '2020-10-10',
              deptCode: item.orgCode,
              deptName: item.orgName,
              mobile: item.mobile,
              photoUrl: item.photoUrl,
              userCode: item.userCode,
              userName: item.userName
            }
          })
        }
        await this.addDormMaster(req)
        this.$tools.message('success', '添加成功')
        this.$refs.chooseTeacherRef.reset()
        this.$tools.goNext(this._getDormMaster)
      } catch (err) {
        this.$refs.chooseTeacherRef.error()
      }
    },
    /**
     * 删除宿管
     * @param { string } buildingCode 楼栋code
     * @param { string } userCode 宿管code
     */
    async _delDormMaster(buildingCode, userCode) {
      await this.delDormMaster({
        buildingCode,
        userCode
      })
      this.$tools.message('success', '删除成功')
      this.$tools.goNext(this._getDormMaster)
    }
  }
}
</script>
<style lang="less" scoped>
.master-list {
  width: 22.5%;
  margin-left: 2%;
  padding: 20px;
  margin-bottom: 15px;
  float: left;
  img {
    border-radius: @u-border-radius;
    width: 70px;
    height: 70px;
    display: block;
  }
}
</style>
