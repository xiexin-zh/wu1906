<template>
  <div class="duty-list page-layout u-fx-ver u-type-white-bg">
    <u-space direction="vertical" class="layout-padd">
      <u-tabs @change="getList(activeTab)" v-model="activeTab" :tab-list="tabList"></u-tabs>
      <div class="u-fx-ver u-fx-f1">
        <div >
          <u-button icon="plus" class="add-btn u-mar-l10" @click="modify(0)">添加小组</u-button>
        </div>
        <u-empty v-if="noticeList.length === 0" description="暂无小组数据"> </u-empty>
        <div class="u-fx-f1" style="overflow-y:scroll">
          <div class="u-fx u-fx-wp ">
            <div class="notice-card" v-for="item in noticeList" :key="item.id">
              <div class="u-fx-f1 u-fx-ver u-fx-jsb">
                <div class="u-fx-ac-jc">
                  <div class="title_ u-fx-jc u-padd-t10 u-padd-b10">
                    {{ item.groupName }}
                  </div>
                </div>
                <div class="cotent">
                  <div class="set">组长： {{ item.leaderName }}</div>
                  <div class="set">组长机构： {{ item.leaderOrgName }}</div>
                  <div class="set">联系方式： {{ item.leaderPhone }}</div>
                  <div class=" set">
                    成员：
                    <span
                      v-for="(ele, i) in item.memberlist"
                      :key="i"
                    >{{ ele.schoolName }}{{ i === item.memberlist.length - 1 ? '' : '，' }}</span
                    >
                  </div>
                </div>
                <div class="u-fx-jsb u-fx-ac" style="margin-top: 10px;">
                  <div></div>
                  <div class="u-fx">
                    <u-button
                      type="link"
                      size="small"
                      @click="modify(1, item)"
                    >编辑</u-button
                    >
                    <a-tooltip placement="topLeft" title="删除">
                      <u-button type="link" content="确定删除该小组吗?" @click="_delGroup(item.id)" delete size="small" >删除</u-button>
                    </a-tooltip>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </u-space>
    <!-- 督办小组弹框 -->
    <u-submit-form
      ref="form"
      :title="formTitle + '小组'"
      :formData="submitGroup"
      v-model="formStatus"
      @submit="submit"
    >
      <div slot="slotOne">
        <a-input
          placeholder="请点击选择小组长"
          @click="showTag=true"
          v-model="checkLeaderObj.leaderName"
        />
      </div>
      <div slot="slotThree">
        <a-input
          :disabled="true"
          placeholder="小组长联系方式"
          v-model="checkLeaderObj.leaderPhone"
        />
      </div>
      <div slot="slotTwo">
        <div class="choose-input" @click="showSchoolTag = true">
          <div class="p" v-if="checkmemberlists.length === 0">请选择成员</div>
          <template >
            <a-tag
              v-for="(tag) in checkmemberlists"
              color="purple"
              @click.stop.prevent
              :key="tag.schoolCode"
              :closable="true"
              @close.stop="() => userClose(tag)"
            >{{ tag.schoolName }}</a-tag
            >
          </template>
        </div>
      </div>
    </u-submit-form>
    <u-choose-teacher
      isRadio
      ref="chooseTeacherRef"
      v-if="showTag"
      v-model="showTag"
      :schoolCode="schoolCode"
      :bindList="bindList"
      @submit="submitLeader"
      :chooseByDutyTag="true"
      title="选择小组长"
    >
    </u-choose-teacher>
    <u-choose-school
      isCheck
      ref="chooseschoolRef"
      v-if="showSchoolTag"
      v-model="showSchoolTag"
      :schoolCode="schoolCode"
      :bindList="checkmemberlists"
      @submit="submitMemberLists"
      :chooseByDutyTag="true"
      title="选择成员"
    >
    </u-choose-school>
  </div>
</template>

<script>
// import NoData from '@c/NoData'
import { mapState, mapActions } from 'vuex'
import { submitGroup } from '../../../submit-columns/submitColumns'

export default {
  name: 'Group',
  components: { },
  data() {
    return {
       activeTab: '',
       noticeList: [],
       submitGroup,
       tabList: [
        {
          key: '1',
          title: '光明街道'
        },
        {
          key: '2',
          title: '高庄街道'
        },
        {
          key: '3',
          title: '高庄街道1'
        },
        {
          key: '4',
          title: '高庄街道2'
        },
        {
          key: '5',
          title: '高庄街道3'
        }
      ],
      appForm: {},
      total: 0,
      pageList: {
        page: 1,
        size: 100
      },
      formTitle: '',
      formStatus: false, // 添加督办小组表单
      record: {}, // 当前弹框的数据存储用于数据回选
      showTag: false, // 选择小组长
      checkLeaderObj: {}, // 选择的小组长
      bindList: [],
      showSchoolTag: false, // 选择学校成员
      checkmemberlists: []
    }
  },
  computed: {
    ...mapState('home', ['schoolCode'])
  },
  async mounted() {
    await this.getTabs()
    await this.getList(this.activeTab)
  },
  methods: {
    ...mapActions('home', ['getStreet', 'addGroup', 'getGroup', 'addPost', 'updateGroup', 'delGroup', 'getPostUser', 'addPostUser']),
    // 获取数据列表
    async getTabs() {
        const req = {
        ...this.pageList,
        eduCode: this.schoolCode
      }
      const res = await this.getStreet(req)
      this.tabList = res.data.records.map((el) => {
        return {
          id: el.id,
          key: el.streetCode,
          title: el.streetName,
          streetCode: el.streetCode
        }
      })
      this.activeTab = this.tabList[0] && this.tabList[0].key
    },
    // 获取数据列表
    async getList(streetCode) {
      const req = {
        streetCode: streetCode,
        eduCode: this.schoolCode
      }
      const res = await this.getGroup(req)
      this.noticeList = res.data
      this.total = res.data.total
    },
    // 添加督办小组
    async modify(type, record) {
      this.formStatus = true
      if (type) {
        this.formTitle = '编辑'
        this.listId = record.id
        this.record = record
        this.submitGroup = type ? this.$tools.fillForm(submitGroup, record) : submitGroup
        this.checkLeaderObj.leaderName = record.leaderName
        this.checkLeaderObj.leaderCode = record.leaderCode
        this.checkLeaderObj.leaderPhone = record.leaderPhone
        this.checkmemberlists = record.memberlist
      } else {
        this.listId = ''
        this.formTitle = '添加'
        this.record = {}
        this.checkLeaderObj = {}
        this.checkmemberlists = []
        this.submitGroup = submitGroup
      }
    },
    // 删除成员标签
    userClose(removedTag) {
      this.checkmemberlists = this.checkmemberlists.filter(tag => tag.schoolCode !== removedTag.schoolCode)
    },
    // 选择小组长
    async submitLeader(values) {
      console.log(values)
      this.checkLeaderObj = {
        leaderName: values[0].userName,
        leaderCode: values[0].userCode,
        leaderPhone: values[0].mobile
      }
      this.bindList = values
      this.submitGroup = this.$tools.fillForm(submitGroup, { groupName: this.record.groupName || '' })
      this.$refs.chooseTeacherRef.reset()
    },
    // 确定选择学校成员
    async submitMemberLists(values) {
      this.checkmemberlists = values
      this.$refs.chooseschoolRef.reset()
    },
    // 添加或修改督办小组
    async submit(values) {
      if (Object.keys(this.checkLeaderObj).length === 0) {
        this.$message.warning('小组长不能为空')
        this.$refs.form.error()
        return
      }
      if (this.checkmemberlists.length === 0) {
        this.$message.warning('学校成员不能为空')
        this.$refs.form.error()
        return
      }
      const req = {
        ...values,
        ...this.checkLeaderObj,
        streetCode: this.activeTab,
        eduCode: this.schoolCode,
        memberlist: this.checkmemberlists
      }
      if (this.listId) req.id = this.listId
      try {
        this.listId ? await this.updateGroup(req) : await this.addGroup(req)
        this.$tools.message('success', `${this.formTitle}成功`)
        this.$refs.form.reset()
        this.$tools.goNext(() => {
            this.getList(this.activeTab)
        })
      } catch (err) {
        this.$refs.form.error()
      }
    },
    // 删除小组
    async _delGroup(id) {
      await this.delGroup({ id })
      this.$tools.message('success', '删除成功')
      this.$tools.goNext(() => {
            this.getList(this.activeTab)
        })
    }
  }
}
</script>
<style lang="less" scoped>
.notice-card {
  border-radius: 4px;
  background-color: #fff;
  border: 2px solid @u-type-primary-light;
  border-radius: 5px;
  padding: 10px;
  width: calc(25% - 20px);
  margin: 20px 10px;
  overflow: hidden;
  .title_ {
    width: 90%;
    border-bottom: 2px solid @u-type-primary-light;
    font-size: 18px;
  }
  .cotent {
    padding-top: 10px;
    width: 90%;
    margin-left: 30px;
    .set {
      margin-top: 10px;
    }
  }
}
.choose-input {
  border: 1px solid @u-border-color;
  border-radius: @u-border-radius;
  width: 100%;
  min-height: 32px;
  line-height: 32px;
  padding: 0 10px;
  .p {
    height: 30px;
    line-height: 30px;
    color: @u-border-color;
  }
}
</style>
