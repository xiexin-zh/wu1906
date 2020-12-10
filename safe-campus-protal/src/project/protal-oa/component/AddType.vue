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
        <a-form-item label="物品分类名称" :label-col="{ span: 5 }" :wrapper-col="{ span: 18 }">
          <a-input
            v-decorator="[
              'typeName',
              { initialValue: appForm.typeName, rules: [{ required: true, message: '请输入物品分类名称' }] }
            ]"
          />
        </a-form-item>
        <a-form-item label="物品管理员" :label-col="{ span: 5 }" :wrapper-col="{ span: 18 }" required>
          <div class="choose-input" @click="teacherSelect">
            <div class="p" v-if="chooseTeachersDeatil.length === 0">请点击选择物品管理员</div>
            <template v-for="tag in chooseTeachersDeatil">
              <a-tag
                color="purple"
                @click.stop.prevent
                :key="tag.userCode"
                :closable="true"
                @close.stop="() => userClose(tag)">{{ tag.userName }}</a-tag>
            </template>
          </div>
        </a-form-item>
      </a-form>
    </a-modal>
    <choose-user
      is-check
      ref="form"
      :teacherList="chooseTeachersDeatil"
      v-if="userTag"
      v-model="userTag"
      @submit="submit"
      title="选择物品管理员"
    >
    </choose-user>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import moment from 'moment'
import ChooseUser from '@c/choose/ChooseUser'
export default {
  components: {
    ChooseUser
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
    }
  },
  data() {
    return {
      userTag: false,
      confirmLoading: false,
      moment,
      bindObj: {},
      form: this.$form.createForm(this),
      addVisible: false,
      chooseTeachersDeatil: [],
      appForm: {
        typeName: '',
        adminUserName: ''
      },
      type: '0'
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  watch: {
    type() {
      this.title = this.type === '0' ? '添加物品分类' : '编辑物品分类'
    },
    appForm() {
      this.chooseTeachersDeatil = []
      if (!this.appForm.adminUserCode) {
        return
      }
      if (this.type === '1') {
        const codeList = this.appForm.adminUserCode.split(',')
        const nameList = this.appForm.adminUserName.split(',')
        codeList.forEach((item, index) => {
          this.chooseTeachersDeatil.push({
            userName: nameList[index],
            userCode: item
          })
        })
      }
    }
  },
  mounted() {},
  methods: {
    ...mapActions('home', ['addType']),
    teacherSelect() {
      this.userTag = true
    },
    userClose(removedTag) {
      this.chooseTeachersDeatil = this.chooseTeachersDeatil.filter(tag => tag !== removedTag)
    },
    async submit(values) {
      console.log(values)
      this.$refs.form.reset()
      this.chooseTeachersDeatil = []
      values.forEach(ele => {
        this.chooseTeachersDeatil.push({
          userName: ele.userName,
          userCode: ele.userCode
        })
      })
    },
    deselect(value, option) {
      const index = this.chooseTeachersDeatil.findIndex(list => list.key === value.key)
      this.chooseTeachersDeatil.splice(index, 1)
      console.log(this.chooseTeachersDeatil)
    },
    addWhiteCancel() {
      this.addVisible = false
    },
    addWhiteHandle(e) {
      e.preventDefault()
      this.form.validateFields((err, value) => {
        if (!err) {
          if (this.chooseTeachersDeatil.length === 0) {
            this.$message.error('请选择物品管理员!')
            return
          }
          value.id = this.title === '编辑物品分类' ? this.id : ''
          const adminUserCode = []
          const adminUserName = []
          this.chooseTeachersDeatil.forEach(ele => {
            adminUserCode.push(ele.userCode)
            adminUserName.push(ele.userName)
          })
          const req = {
            typeName: value.typeName,
            schoolCode: this.userInfo.schoolCode,
            adminUserCode: adminUserCode.join(','),
            adminUserName: adminUserName.join(','),
            id: this.id
          }
          this.addType(req).then(res => {
            this.addVisible = false
            this.$message.success('操作成功')
            this.chooseTeachersDeatil = []
            this.$tools.goNext(() => {
              this.$emit('update')
            })
          })
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
