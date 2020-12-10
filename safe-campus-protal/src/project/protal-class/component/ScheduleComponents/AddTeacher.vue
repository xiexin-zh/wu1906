<template>
  <div class="fast-student">
    <a-modal
      :title="title"
      :pagination="false"
      v-model="addVisible"
      destroyOnClose
      width="820px"
      @ok="bindHandle"
      @cancel="cancelModal"
      :confirmLoading="isLoad"
      :maskClosable="false"
    >
      <a-form :form="addForm" >
        <a-form-item label="学科:" :label-col="{ span: 3 }" :wrapper-col="{ span: 18 }">
          <a-select
            class="select-type"
            :disabled="type === '1'"
            v-decorator="[
              `subject`,
              {initialValue: teacherInfo.subjectId ? {key:teacherInfo.subjectId.toString(), label:teacherInfo.subjectName} : [], rules: [{ required: true, message: '请选择学科' }]}
            ]"
            placeholder="请选择学科"
            labelInValue
          >
            <a-select-option :key="item.id" v-for="item in subjectList" :value="item.id">{{ item.name }}</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
      <a-row class="qui-fx-ac-jc">
        <a-col span="3" style="text-align: right;line-height:32px">授课老师：</a-col>
        <a-col span="18">
          <a-select
            style="width: 100%"
            mode="multiple"
            v-model="chooseTeachersDeatil"
            size="default"
            placeholder="请点击选择授课老师"
            @dropdownVisibleChange="teacherSelect"
            @deselect="deselect"
            labelInValue
          >
          </a-select>
        </a-col>
      </a-row>
    </a-modal>
    <choose-user
      chooseType="common"
      ref="chooseUser"
      :teacherList="chooseTeachersDeatil"
      is-check
      v-if="userTag"
      v-model="userTag"
      @submit="choose"
      title="选择授课老师"
    >
    </choose-user>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import ChooseUser from '@c/ChooseUser'
export default {
  name: 'AddTeacher',
  components: {
    ChooseUser
  },
  data () {
    return {
      userTag: false,
      formItemLayout: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 4 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 20 }
        }
      },
      formItemLayoutWithOutLabel: {
        wrapperCol: {
          xs: { span: 24, offset: 0 },
          sm: { span: 20, offset: 4 }
        }
      },
      addForm: this.$form.createForm(this),
      choosedList: [],
      addVisible: false,
      isLoad: false,
      courseName: '',
      teacherName: '',
      subjectList: [],
      teacherInfo: {},
      chooseTeachersDeatil: [],
      type: '0',
      title: '添加'
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  watch: {
    type() {
      this.title = this.type === '0' ? '添加' : '编辑'
    },
    teacherInfo() {
      console.log(this.teacherInfo)
      this.chooseTeachersDeatil = []
      if (!this.teacherInfo.outUserInfoDtoList) {
        return
      }
      if (this.type === '1') {
        this.teacherInfo.outUserInfoDtoList.forEach(ele => {
          this.chooseTeachersDeatil.push({
            userCode: ele.userCode,
            userName: ele.userName,
            key: ele.userCode,
            label: ele.userName
          })
        })
      }
    }
  },
  beforeCreate () {
    this.form = this.$form.createForm(this)
    this.form.getFieldDecorator('keys', { initialValue: [], preserve: true })
  },
  created () {
  },
  methods: {
    ...mapActions('home', [
      'getSubject', 'bindCourse', 'editBindCourse'
    ]),
    choose(value) {
      this.chooseTeachersDeatil = []
      value.forEach(ele => {
        this.chooseTeachersDeatil.push({
          key: ele.userCode,
          label: ele.userName,
          userCode: ele.userCode,
          userName: ele.userName
        })
      })
      console.log(this.chooseTeachersDeatil)
      this.$refs.chooseUser.reset()
    },
    deselect(value, option) {
      const index = this.chooseTeachersDeatil.findIndex(list => list.key === value.key)
      this.chooseTeachersDeatil.splice(index, 1)
      console.log(this.chooseTeachersDeatil)
    },
    subjectSelect () {
      this.getSubject({ schoolCode: this.userInfo.schoolCode }).then(res => {
        this.subjectList = []
        res.data.forEach(ele => {
          this.subjectList.push({
            id: ele.id.toString(),
            name: ele.name
          })
        })
      })
    },
    teacherSelect () {
      this.userTag = true
    },
    cancelModal () {
      this.teacherInfo = {}
    },
    bindHandle () {
      this.addForm.validateFields((err, values) => {
        if (!err) {
          this.isLoad = true
          const userCodes = []
          this.chooseTeachersDeatil.forEach(ele => {
            userCodes.push(ele.key)
          })
          const req = {
            subjectId: values.subject.key,
            subjectName: values.subject.label,
            schoolCode: this.userInfo.schoolCode,
            userCodes
          }
          console.log(req)
          let res = null
          if (this.type === '1') {
            res = this.editBindCourse(req)
          } else {
            res = this.bindCourse(req)
          }
          res.then(res => {
            this.isLoad = false
            this.$message.success('操作成功')
            this.chooseTeachersDeatil = []
            this.addVisible = false
            this.addForm.resetFields()
            this.$tools.goNext(() => {
              this.$emit('updataTeacher')
            })
          }).catch(() => {
            this.isLoad = false
            this.chooseTeachersDeatil = []
            this.addVisible = false
            this.addForm.resetFields()
          })
        } else {
          this.isLoad = false
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.select-type {
  width: 160px !important;
}
.form-text {
  color: #666;
  margin-left: 15px;
}
.search-btn-mar {
  margin-left: 15px;
}
.add-box{
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 15px;
}
.icon-box{
  display: inline-block;
  width: 28px;
  line-height: 28px;
  margin-top: 6px;
  font-size: 18px;
  background-color: #1890ff;
  border-radius: 3px;
  text-align: center;
  cursor: pointer;
}
.add-icon{
  color: #fff;
}
.delete-box{
  background-color: #ff0000;
}
.ant-col-2{
  text-align: center;
}
.ant-col-3{
  text-align: inherit;
}
</style>
