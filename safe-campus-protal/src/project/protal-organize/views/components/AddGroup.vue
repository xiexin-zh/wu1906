<template>
  <div class="add-white">
    <a-modal
      :title="title"
      :visible="addVisible"
      @cancel="addWhiteCancel"
      :maskClosable="false"
      :destroyOnClose="true"
      :confirmLoading="confirmLoading"
      width="650px"
      @ok="addWhiteHandle"
    >
      <a-form :form="form">
        <a-form-item label="小组名称" :label-col="{ span: 5 }" :wrapper-col="{ span: 18 }">
          <a-input
            v-decorator="[
              'groupName',
              { initialValue: appForm.groupName, rules: [{ required: true, message: '请输入小组名称' }] }
            ]"
          />
        </a-form-item>
        <a-form-item label="小组长" :label-col="{ span: 5 }" :wrapper-col="{ span: 18 }" required>
          <a-input
            @click="teacherSelect"
            placeholder="请点击选择小组长"
            v-decorator="['userName', { initialValue: appForm.userName }]"
            readOnly
          />
        </a-form-item>
        <a-form-item label="小组长手机号" :label-col="{ span: 5 }" :wrapper-col="{ span: 18 }">
          <a-input :disabled="disabled" v-decorator="['mobile', { initialValue: appForm.mobile }]" readOnly />
        </a-form-item>
        <a-form-item label="成员" :label-col="{ span: 5 }" :wrapper-col="{ span: 18 }" required>
          <div class="choose-input" @click="schoolSelect">
            <div class="p" v-if="chooseTeachersDeatil.length === 0">请选择成员</div>
            <template v-for="tag in chooseTeachersDeatil">
              <a-tag
                color="purple"
                @click.stop.prevent
                :key="tag.eduCode"
                :closable="true"
                @close.stop="() => userClose(tag)"
                >{{ tag.eduName }}</a-tag
              >
            </template>
          </div>
        </a-form-item>
      </a-form>
    </a-modal>
    <choose-user type="edu" is-radio ref="form" v-if="userTag" v-model="userTag" @submit="submit" title="选择小组长">
    </choose-user>
    <choose-school
      type="edu"
      is-check
      :teacherList="chooseTeachersDeatil"
      ref="ChooseSchool"
      v-if="schoolTag"
      v-model="schoolTag"
      @submit="ChooseSchool"
      title="选择成员"
    >
    </choose-school>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import moment from 'moment'
import ChooseUser from '@c/ChooseUser'
import ChooseSchool from './ChooseSchool'
export default {
  components: {
    ChooseUser,
    ChooseSchool
  },
  props: {
    refBuildList: {
      type: Object,
      default: function() {
        return {}
      }
    },
    title: {
      type: String,
      default: ''
    },
    streetList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      disabled: true,
      userTag: false,
      schoolTag: false,
      confirmLoading: false,
      moment,
      bindObj: {},
      form: this.$form.createForm(this),
      addVisible: false,
      userCode: '',
      mobile: '',
      groupList: [],
      chooseTeachersDeatil: [],
      appForm: {
        groupName: '',
        userName: '',
        mobile: '',
        eduName: ''
      },
      type: '0'
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  watch: {
    type() {
      this.title = this.type === '0' ? '添加小组' : '编辑小组'
    },
    appForm() {
      console.log(this.appForm)
      this.chooseTeachersDeatil = []
      if (!this.appForm.memberList) {
        return
      }
      if (this.type === '1') {
        this.appForm.memberList.forEach(ele => {
          this.chooseTeachersDeatil.push({
            eduCode: ele.eduCode,
            eduName: ele.eduName
          })
        })
        this.groupList = []
        this.groupList.push({
          userCode: this.appForm.leaderCode,
          userName: this.appForm.leaderName,
          mobile: this.appForm.leaderMobile,
          orgCode: this.appForm.leaderEduCode,
          orgName: this.appForm.leaderEduName
        })
      }
    }
  },
  mounted() {},
  methods: {
    ...mapActions('home', ['addGroup', 'updateGroup']),
    userClose(removedTag) {
      this.chooseTeachersDeatil = this.chooseTeachersDeatil.filter(tag => tag !== removedTag)
    },
    teacherSelect() {
      this.userTag = true
    },
    schoolSelect() {
      this.schoolTag = true
    },
    async submit(values) {
      this.$refs.form.reset()
      this.appForm.userName = values[0].userName
      this.appForm.mobile = values[0].mobile
      this.groupList = []
      values.forEach(ele => {
        this.groupList.push({
          userCode: ele.userCode,
          userName: ele.userName,
          mobile: ele.mobile,
          orgCode: ele.orgCode,
          orgName: ele.orgName
        })
      })
    },
    async ChooseSchool(values) {
      this.$refs.ChooseSchool.reset()
      this.appForm.eduName = values[0].schoolName
      this.chooseTeachersDeatil = []
      values.forEach(ele => {
        this.chooseTeachersDeatil.push({
          eduCode: ele.schoolCode,
          eduName: ele.schoolName
        })
      })
    },
    deselect(value, option) {
      const index = this.chooseTeachersDeatil.findIndex(list => list.key === value.key)
      this.chooseTeachersDeatil.splice(index, 1)
    },
    addWhiteCancel() {
      this.addVisible = false
    },
    addWhiteHandle(e) {
      e.preventDefault()
      this.form.validateFields((err, value) => {
        if (!err) {
          if (!this.appForm.userName) {
            this.$message.error('小组长不能为空!')
            return
          }
          if (this.chooseTeachersDeatil.length === 0) {
            this.$message.error('成员不能为空!')
            return
          }
          value.id = this.title === '编辑小组' ? this.id : ''
          const req = {
            groupName: value.groupName,
            leaderCode: this.groupList[0].userCode,
            leaderMobile: this.groupList[0].mobile,
            leaderName: this.groupList[0].userName,
            leaderEduName: this.groupList[0].orgName,
            leaderEduCode: this.groupList[0].orgCode.split(',')[1],
            streetCode: this.streetList[0].streetCode,
            streetName: this.streetList[0].streetName,
            memberList: this.chooseTeachersDeatil,
            eduCode: this.userInfo.eduCode,
            eduName: this.userInfo.eduName,
            groupCode: this.appForm.groupCode,
            id: this.appForm.id
          }
          if (this.title === '编辑小组') {
            this.updateGroup(req).then(res => {
              this.addVisible = false
              this.$message.success('操作成功')
              this.chooseTeachersDeatil = []
              this.$tools.goNext(() => {
                this.$emit('update')
              })
            })
          } else {
            this.addGroup(req).then(res => {
              this.addVisible = false
              this.$message.success('操作成功')
              this.chooseTeachersDeatil = []
              this.$tools.goNext(() => {
                this.$emit('update')
              })
            })
          }
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.choose-input {
  border: 1px solid @bor-color;
  border-radius: @radius;
  width: 100%;
  min-height: 32px;
  line-height: 32px;
  padding: 0 10px;
  .p {
    height: 30px;
    line-height: 30px;
    color: @dark-color;
  }
}
</style>
