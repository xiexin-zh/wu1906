<template>
  <a-modal
    :title="title"
    v-model="addVisible"
    :destroyOnClose="true"
    :maskClosable="false"
    width="940px"
    @ok="addSubmit"
    :okButtonProps="{ props: { disabled: isLoad } }"
  >
    <a-form :form="form">
      <a-form-item label="方案名称：" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }">
        <a-input
          v-decorator="[
            'name',
            {
              initialValue: appForm.name,
              rules: [{ required: true, message: '请填写方案名称' }]
            }
          ]"
          placeholder="请填写方案名称"
        />
      </a-form-item>
      <a-form-item label="方案说明：" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }">
        <a-input v-decorator="['remark', { initialValue: appForm.remark }]" placeholder="请填写方案说明" />
      </a-form-item>
      <a-form-item label="班级基础分：" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }">
        <a-input-number
          :disabled="disabled"
          style="width:100%"
          v-decorator="[
            'baseScore',
            {
              initialValue: appForm.baseScore,
              rules: [{ required: true, message: '请填写班级基础分' }]
            }
          ]"
          placeholder="请填写班级基础分"
        />
      </a-form-item>
      <a-form-item label="方案设置：" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }" required>
        <a-button icon="plus" class="add-btn" @click="add(0)">添加</a-button>
        <div class="project-box">
          <div v-for="list in project" :key="list.key">
            <div class="qui-fx">
              <div class="tip">*</div>检查项名称：
              <a-input style="width:20%" v-model="list.name"></a-input>
              <div class="add-index mar-l10" @click="add(1, list)">添加指标</div>
              <div class="del-index mar-l10" @click="delJcx(list)">删除</div>
            </div>
            <div v-for="item in list.indexDtoList" :key="item.key">
              <div class="qui-fx">
                <div class="tip">*</div>指标内容：
                <a-input style="width:30%" v-model="item.name"></a-input>
                <div class="tip mar-l10">*</div>
                <div>指标分值：</div>
                <a-input-number style="width:30%" v-model="item.score"></a-input-number>
                <div class="del-index mar-l10" @click="del(list, item)">删除</div>
              </div>
            </div>
          </div>
        </div>
      </a-form-item>
      <a-form-item label="德育员" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }" required>
        <div>
          <template v-for="tag in teacherList">
            <a-tag
              :key="tag.userCode"
              :closable="true"
              :afterClose="() => userClose(tag)"
            >{{ tag.userName }}</a-tag>
          </template>
          <a-tag @click="addTag(0)" style="background: #fff; borderStyle: dashed;">
            <a-icon type="plus" />添加
          </a-tag>
        </div>
      </a-form-item>
      <a-form-item label="评分对象" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }" required>
        <div>
          <template v-for="tag in classList">
            <a-tag
              :key="tag.beAssessedCode"
              :closable="true"
              :afterClose="() => classClose(tag)"
            >{{ tag.gradeName }}{{ userInfo.schoolType === '8' || userInfo.schoolType === '9' ? tag.professionName : '' }}{{ tag.beAssessedName }}</a-tag>
          </template>
          <a-tag @click="addTag(1)" style="background: #fff; borderStyle: dashed;">
            <a-icon type="plus" />添加
          </a-tag>
        </div>
      </a-form-item>
      <a-form-item :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }" label="评分周期：">
        <a-radio-group v-decorator="['cycle', { initialValue: cycle }]">
          <a-radio value="D">按日打分</a-radio>
          <a-radio value="W">按周打分</a-radio>
          <a-radio value="M">按月打分</a-radio>
        </a-radio-group>
      </a-form-item>
    </a-form>
    <choose-user
      ref="chooseUser"
      is-check
      v-if="userTag"
      v-model="userTag"
      @submit="chooseUser"
      title="添加人员"
    ></choose-user>
    <choose-class
      ref="chooseClass"
      is-check
      v-model="studentTag"
      v-if="studentTag"
      @submit="chooseClass"
    ></choose-class>
  </a-modal>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import moment from 'moment'
// import ChooseUser from '@c/choose/ChooseUser'
import ChooseUser from '@c/ChooseUser'
import ChooseClass from '@c/choose/ChooseClass'
export default {
  name: 'AddScore',
  components: {
    ChooseUser,
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
      userTag: false,
      studentTag: false,
      classList: [],
      remark: '',
      value: 1,
      searchForm: {
        page: 1,
        start: 0,
        size: 20
      },
      zbCount: 0,
      name: '',
      isLoad: false,
      addVisible: false,
      form: this.$form.createForm(this),
      appForm: {},
      cycle: 'D',
      scoreId: '',
      teacherList: [],
      project: [],
      disabled: false,
      regex: false
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  methods: {
    ...mapActions('home', ['addCategory']),
    moment,
    addTag(type) {
      if (type) {
        this.studentTag = true
        setTimeout(() => {
          this.$refs.chooseClass.chooseList = this.classList.map(el => {
            return el.beAssessedCode
          })
          this.$refs.chooseClass.totalList = this.classList.map(el => {
            return {
              ...el,
              classCode: el.beAssessedCode,
              className: el.beAssessedName
            }
          })
        }, 100)
      } else {
        this.userTag = true
        setTimeout(() => {
          this.$refs.chooseUser.chooseList = this.teacherList.map(el => {
            console.log('111111', el)
            return el.userId ? el.userId : el.id
          })
          this.$refs.chooseUser.totalList = this.teacherList.map(el => {
            console.log('el', el)
            return {
              ...el,
              detailId: el.id,
              id: el.userId ? el.userId : el.id
            }
          })
        }, 100)
      }
    },
    // 添加指标和内容
    add(type, record) {
      if (type) {
        let length = record.indexDtoList.length
        this.project.filter((el, index) => {
          if (el.key === record.key) {
            const newData = {
              key: length
            }
            this.project[index].indexDtoList = [...this.project[index].indexDtoList, newData]
            length = length + 1
          }
        })
      } else {
        const { zbCount, project } = this
        const newData = {
          key: zbCount,
          indexDtoList: []
        }
        this.project = [...project, newData]
        this.zbCount = zbCount + 1
      }
    },
    // 删除指标
    del(list, item) {
      this.project.filter(el => {
        if (el.id === list.id) {
          el.indexDtoList = el.indexDtoList.filter(i => i !== item)
        }
      })
    },
    // 删除检查项
    delJcx(list) {
      this.project = this.project.filter(i => i !== list)
    },
    // 德育员删除
    userClose(removedTag) {
      this.teacherList = this.teacherList.filter(tag => tag !== removedTag)
    },
    // 评分对象删除
    classClose(removedTag) {
      this.classList = this.classList.filter(tag => tag !== removedTag)
    },
    // 德育员选择
    chooseUser(teacherList) {
      console.log('1', teacherList)
      this.teacherList = teacherList
      this.$refs.chooseUser.reset()
    },
    // 评分对象选择
    chooseClass(classInfo) {
      this.classList = classInfo.map(el => {
        return {
          ...el,
          professionName: el.subjectName,
          beAssessedId: el.classId,
          beAssessedCode: el.classCode,
          beAssessedName: el.className
        }
      })
      this.$refs.chooseClass.reset()
    },
    regexForm() {
      this.project.map(el => {
        if (el.indexDtoList.length === 0 || !el.name) {
          this.regex = true
        } else {
          this.regex = false
        }
        el.indexDtoList.map(item => {
          if (!item.name || !item.score) {
            this.regex = true
          } else {
            this.regex = false
          }
        })
      })
    },
    // 提交
    addSubmit(e) {
      e.preventDefault()
      this.form.validateFields((error, values) => {
        this.regexForm()
        this.isLoad = false
        if (!error) {
          if (this.project.length === 0) {
            this.$message.warning('请添加方案设置项')
          }
          if (this.teacherList.length === 0) {
            this.$message.warning('请添加德育员')
          }
          if (this.classList.length === 0) {
            this.$message.warning('请选择被评分对象')
          }
          values.id = this.title === '编辑评分方案' ? this.scoreId : ''
          values.state = '1'
          values.type = '2'
          values.schoolCode = this.userInfo.schoolCode
          values.classDtoList = this.classList.map(el => {
            return {
              beAssessedCode: el.classCode ? el.classCode : el.beAssessedCode,
              beAssessedName: el.className ? el.className : el.beAssessedName,
              schoolYearId: el.schoolYearId,
              beAssessedId: el.beAssessedId ? el.beAssessedId : el.id,
              gradeName: el.gradeName,
              gradeCode: el.gradeCode,
              professionName: el.subjectName,
              professionCode: el.subjectCode,
              id: el.beAssessedId ? el.classId : undefined
            }
          })
          values.eduUserDtoList = this.teacherList.map(el => {
            return {
              userCode: el.userCode,
              userId: el.userId ? el.userId : el.id,
              userName: el.userName,
              id: el.detailId ? el.detailId : undefined
            }
          })
          this.isLoad = true
          if (this.regex) {
            this.$message.warning('请填写完整的方案设置')
            this.isLoad = false
            return false
          } else {
            values.eduItemsDtos = this.project
          }
          if (this.title === '新增评分方案') {
            values.eduItemsDtos.map((el, index) => {
              el.id = ''
              el.indexDtoList.map((item, i) => {
                item.id = ''
              })
            })
          }
          this.addCategory(values)
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
