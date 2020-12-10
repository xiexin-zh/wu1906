<template>
  <a-modal
    :title="title"
    v-model="addVisible"
    :destroyOnClose="true"
    :maskClosable="false"
    width="940px"
    @ok="addSubmit"
    :okButtonProps="{ props: { disabled: isLoad } }"
    :cancel-button-props="{ props: { disabled: isView } }"
  >
    <a-form :form="form">
      <a-form-item label="距离" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }">
        <a-input
          maxlength="10"
          v-decorator="[
            'name',
            {
              initialValue: appForm.name,
              rules: [{ required: true, message: '请填写事件名称' }]
            }
          ]"
          placeholder="请填写事件名称"
        />
      </a-form-item>
      <a-form-item label="提示语" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }">
        <a-input
          maxlength="6"
          v-decorator="[
            'tips',
            {
              initialValue: appForm.tips,
              rules: [{ required: true, message: '请填写提示语' }]
            }
          ]"
          placeholder="请填写提示语"
        />
      </a-form-item>
      <a-form-item label="截止日期" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }">
        <a-date-picker
          format="YYYY-MM-DD"
          :disabled-date="disabledDate"
          v-decorator="[
            'endTime',
            {
              initialValue: appForm.endTime,
              rules: [{ required: true, message: '请选择截止日期' }]
            }
          ]"
        />
      </a-form-item>
      <a-form-item label="应用对象" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }" required>
        <div>
          <template v-for="tag in classList">
            <a-tag :key="tag.classCode" :closable="true" :afterClose="() => classClose(tag)">
              {{ (userInfo.schoolType === '8' || userInfo.schoolType === '9') ? (tag.gradeName + tag.subjectName + tag.className) : (tag.gradeName + tag.className) }}
            </a-tag>
          </template>
          <a-tag @click="addTag()" style="background: #fff; borderStyle: dashed;"> <a-icon type="plus" />添加 </a-tag>
        </div>
      </a-form-item>
    </a-form>
    <choose-class
      ref="chooseClass"
      is-check
      v-model="studentTag"
      v-if="studentTag"
      @submit="chooseClass"
      :classList="classList"
    ></choose-class>
  </a-modal>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import moment from 'moment'
import ChooseClass from '@c/choose/ChooseClass'
export default {
  name: 'AddCount',
  components: {
    ChooseClass
  },
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      studentTag: false,
      classList: [],
      value: 1,
      searchForm: {
        page: 1,
        size: 20
      },

      isLoad: false,
      addVisible: false,
      form: this.$form.createForm(this),
      appForm: {
        name: '',
        endTime: '',
        tips: ''
      },
      isView: false,
      id: '',
      classCodeList: []
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  mounted() {},
  methods: {
    ...mapActions('home', ['addCount', 'updateCount']),
    moment,
    disabledDate(current) {
      return current && current < moment().endOf('day')
    },
    addTag() {
      this.studentTag = true
    },
    classClose(removedTag) {
      this.classList = this.classList.filter(tag => tag !== removedTag)
    },
    chooseClass(classInfo) {
      this.classList = classInfo
      this.$refs.chooseClass.reset()
    },
    addSubmit(e) {
      e.preventDefault()
      this.form.validateFields((error, values) => {
        if (!error) {
          if (this.classList.length === 0) {
            this.$message.warning('请选择应用对象!')
            return
          }
          this.isLoad = true
          values.id = this.title === '编辑倒数日' ? this.id : ''
          values.endTime = moment(values.endTime).format('YYYY-MM-DD')
          this.classCodeList = []
          this.classList.forEach(el => {
            this.classCodeList.push(el.classCode)
          })
          const req = {
            schoolCode: this.userInfo.schoolCode,
            schoolYearId: JSON.parse(window.sessionStorage.getItem('schoolYear')).schoolYearId,
            classCodes: this.classCodeList,
            createUsername: this.userInfo.userName,
            createUsercode: this.userInfo.userCode,
            ...values
          }
          if (this.title === '编辑倒数日') {
            this.updateCount(req)
              .then(res => {
                this.addVisible = false
                this.isLoad = false
                this.$message.success('操作成功')
                this.$tools.goNext(() => {
                  this.$emit('update')
                })
              })
              .catch(res => {
                this.isLoad = false
              })
          } else {
            this.addCount(req)
              .then(res => {
                this.addVisible = false
                this.isLoad = false
                this.$message.success('操作成功')
                this.$tools.goNext(() => {
                  this.$emit('update')
                })
              })
              .catch(res => {
                this.isLoad = false
              })
          }
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.project-box {
  max-height: 500px;
  overflow-y: scroll;
  .add-index {
    color: @main-color;
    cursor: pointer;
  }
  .del-index {
    color: @tip-color;
    cursor: pointer;
  }
  .tip {
    color: #f5222d;
    font-weight: bold;
    margin-right: 5px;
  }
  .select-ml {
    margin-left: 23px;
  }
}
.ant-calendar-picker {
  width: 100% !important;
}
</style>
