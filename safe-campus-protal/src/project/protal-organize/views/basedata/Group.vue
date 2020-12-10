<template>
  <div class="home page-layout bg-fff">
    <a-tabs
      default-active-key="1"
      :tab-position="mode"
      @prevClick="callback"
      @nextClick="callback"
      @change="onChage"
      v-model="activeKey"
    >
      <a-tab-pane v-for="item in roleList" :key="item.streetCode" :tab="`${item.streetName}`">
        <div style="margin-left: 10px;">
          <a-button icon="plus" class="add-btn" @click.stop="modify(0)">添加小组</a-button>
        </div>
        <no-data msg="暂无数据" v-if="noticeList.length === 0">
          <div slot="btn">
            <a-button icon="plus" class="add-btn" @click.stop="modify(0)">添加小组</a-button>
          </div>
        </no-data>
        <div class="qui-fx-f1" style="overflow-y:scroll">
          <div class="qui-fx qui-fx-wp ">
            <div class="notice-card" v-for="item in noticeList" :key="item.id">
              <div class="qui-fx-f1 qui-fx-ver qui-fx-jsb">
                <div class="qui-fx-ac-jc">
                  <div class="title_ qui-fx-jc">
                    {{ item.groupName }}
                  </div>
                </div>
                <div class="cotent">
                  <div class="set">组长： {{ item.leaderName }}</div>
                  <div class="set">组长机构： {{ item.leaderEduName }}</div>
                  <div class="set">联系方式： {{ item.leaderMobile }}</div>
                  <div class=" set">
                    成员：
                    <span v-for="(ele, i) in item.memberList" :key="i"
                      >{{ ele.eduName }}{{ i === item.memberList.length - 1 ? '' : '，' }}</span
                    >
                  </div>
                </div>
                <div class="qui-fx-jsb qui-fx-ac" style="margin-top: 10px;">
                  <div></div>
                  <div class=" qui-fx">
                    <a-tooltip placement="topLeft" title="编辑">
                      <a-button size="small" class="edit-action-btn" icon="form" @click="modify(1, item.id)"
                        >编辑</a-button
                      >
                    </a-tooltip>
                    <a-popconfirm placement="left" okText="确定" cancelText="取消" @confirm="deleteGroup(item.id)">
                      <template slot="title">
                        您确定删除吗?
                      </template>
                      <a-tooltip placement="topLeft" title="删除">
                        <a-button size="small" class="del-action-btn" icon="delete">删除</a-button>
                      </a-tooltip>
                    </a-popconfirm>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </a-tab-pane>
    </a-tabs>
    <!-- <page-num v-model="pageList" :total="total" @change-page="showList"></page-num> -->
    <add-group ref="addGroup" :title="title" :streetList="streetList" @update="showList"></add-group>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import PageNum from '@c/PageNum'
import NoData from '@c/NoData'
import AddGroup from '../components/AddGroup'
export default {
  name: 'Group',
  components: {
    PageNum,
    NoData,
    AddGroup
  },
  data() {
    return {
      total: 0,
      pageList: {
        page: 1,
        size: 20
      },
      noticeList: [],
      title: '添加小组',
      type: '',
      mode: 'top',
      roleList: [],
      streetList: [],
      activeKey: ''
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  mounted() {
    this.getTabList()
  },
  methods: {
    ...mapActions('home', ['addGroup', 'delGroup', 'getGroup', 'updateGroup', 'getStreet', 'getDetail']),
    callback(val) {},
    onChage(val) {
      this.activeKey = val
      this.streetList = []
      this.roleList.forEach(item => {
        if (item.streetCode === this.activeKey) {
          this.streetList.push({
            streetName: item.streetName,
            streetCode: item.streetCode
          })
        }
      })
      this.showList()
    },
    async getTabList() {
      const req = {
        eduCode: this.userInfo.eduCode,
        pageNum: this.pageList.page,
        pageSize: this.pageList.size
      }
      const res = await this.getStreet(req)
      if (!res.data) {
        this.roleList = []
        return
      }
      this.roleList = res.data.list
      this.total = res.data.total
      this.activeKey = this.roleList[0].streetCode
      this.streetList.push({
        streetName: this.roleList[0].streetName,
        streetCode: this.roleList[0].streetCode
      })
      this.showList()
    },
    async showList() {
      const req = {
        eduCode: this.userInfo.eduCode,
        streetCode: this.activeKey
      }
      const res = await this.getGroup(req)
      if (!res.data) {
        this.noticeList = []
        return
      }
      this.noticeList = res.data
      this.total = res.data.total
    },
    async modify(type, id) {
      if (type) {
        const res = await this.getDetail({ id })
        const data = res.data
        this.$refs.addGroup.appForm = data
        this.$refs.addGroup.id = data.id
        this.$refs.addGroup.groupName = data.groupName
        this.$refs.addGroup.appForm.userName = data.leaderName
        this.$refs.addGroup.appForm.mobile = data.leaderMobile
        this.$refs.addGroup.chooseTeachersDeatil = data.memberList
        if (type === 1) {
          this.title = '编辑小组'
          this.$refs.addGroup.type = '1'
        }
      } else {
        this.title = '添加小组'
        this.$refs.addGroup.type = '0'
        this.$refs.addGroup.chooseTeachersDeatil = []
        this.$refs.addGroup.appForm = {}
      }
      this.$refs.addGroup.addVisible = true
    },
    async deleteGroup(id) {
      await this.delGroup({ id })
      this.$message.success('删除成功')
      this.$tools.goNext(() => {
        this.showList()
      })
    }
  }
}
</script>
<style lang="less" scoped>
.notice-card {
  border-radius: 4px;
  background-color: #fff;
  border: 1px solid rgb(77, 76, 172);
  border-radius: 5px;
  padding: 10px;
  width: calc(25% - 20px);
  margin: 10px 10px;
  overflow: hidden;
  .title_ {
    width: 85%;
    border-bottom: 2px solid rgb(77, 76, 172);
    font-size: 18px;
  }
  .cotent {
    width: 85%;
    margin-left: 30px;
    .set {
      margin-top: 10px;
    }
  }
}
</style>
