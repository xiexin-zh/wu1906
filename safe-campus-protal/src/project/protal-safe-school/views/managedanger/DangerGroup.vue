<template>
  <div class="danger-group page-layout bg-fff qui-fx-ver">
    <a-form :form="form">
      <a-form-item label="小组负责人" v-bind="formItemLayout" required>
        <div>
          <template v-for="tag in adminList">
            <a-tag :key="tag.userCode" :closable="true" :afterClose="() => userClose(tag,'adminList')">
              {{ tag.userName }}
            </a-tag>
          </template>
          <a-tag style="background: #fff; borderStyle: dashed;" @click="addTag(0)" > <a-icon type="plus" />添加 </a-tag>
        </div>
      </a-form-item>
      <a-form-item label="组员" v-bind="formItemLayout" required>
        <div>
          <template v-for="tag in userList">
            <a-tag :key="tag.userCode" :closable="true" :afterClose="() => userClose(tag,'userList')">
              {{ tag.userName }}
            </a-tag>
          </template>
          <a-tag style="background: #fff; borderStyle: dashed;" @click="addTag(1)" > <a-icon type="plus" />添加 </a-tag>
        </div>
      </a-form-item>
      <a-form-item v-bind="formItemLayout" :style="{ textAlign: 'center' }">
        <a-button class="mar-l10" type="primary" @click="submitOk" :disabled="isLoad">保存</a-button>
      </a-form-item>
    </a-form>
    <choose-post
      ref="choosePost"
      :teacherList="active === 1 ? userList : adminList"
      is-check
      v-if="userTag"
      v-model="userTag"
      @submit="choosePost"
      title="添加成员"
    ></choose-post>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import TableList from '@c/TableList'
import ChoosePost from '@c/choose/ChoosePost'
import moment from 'moment'

export default {
  name: 'DangerGroup',
  components: {
    TableList,
    ChoosePost
  },
  data() {
    return {
      form: this.$form.createForm(this),
      formItemLayout: {
        labelCol: { span: 6 },
        wrapperCol: { span: 16 }
      },
      userTag: false,
      adminList: [],
      userList: [],
      active: 0,
      isLoad: false
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  mounted() {
    this.showList()
  },
  methods: {
    ...mapActions('home', ['addDangerGroup', 'getGroupDetail']),
    moment,
    async showList() {
      const res = await this.getGroupDetail({ schoolCode: this.userInfo.schoolCode })
      this.adminList = res.data.leaders.map(el => {
        return {
          id: el.id,
          detailId: el.id,
          userName: el.name,
          userCode: el.code
        }
      })
      this.userList = res.data.users.map(el => {
        return {
          id: el.id,
          detailId: el.id,
          userName: el.name,
          userCode: el.code
        }
      })
    },
    addTag(type) {
      this.active = type
      this.userTag = true
    },
    choosePost(list) {
      if (this.active) {
        this.userList = list
      } else {
        this.adminList = list
      }
      this.$refs.choosePost.reset()
    },
    userClose(removedTag, string) {
      this[string] = this[string].filter(tag => tag !== removedTag)
    },
    // 提交
    submitOk(e) {
      if (this.adminList.length === 0 || this.userList.length === 0) {
        this.$message.warning('请添加人员')
        return false
      }
      this.isLoad = true
      const adminList = this.adminList.map(el => {
        return {
          id: el.detailId,
          name: el.userName,
          code: el.userCode
        }
      })
      const userList = this.userList.map(el => {
        return {
          id: el.detailId,
          name: el.userName,
          code: el.userCode
        }
      })
      const req = {
        leaders: adminList,
        users: userList,
        schoolCode: this.userInfo.schoolCode
      }
      this.addDangerGroup(req)
        .then((res) => {
          this.$message.success('操作成功')
          this.isLoad = false
          this.$tools.goNext(() => {
            this.showList()
          })
        })
        .catch((res) => {
          this.isLoad = false
        })
    }
  }
}
</script>
<style lang="less" scoped>
.danger-group {
  padding: 20px;
}
</style>
