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
      <a-form-item label="学生姓名" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }" required>
        <div>
          <template v-for="tag in classList">
            <a-tag :key="tag.userCode" :closable="true" :afterClose="() => classClose(tag)">
              {{ tag.userName }}
            </a-tag>
          </template>
          <a-tag @click="addTag()" style="background: #fff; borderStyle: dashed;"> <a-icon type="plus" />添加 </a-tag>
        </div>
      </a-form-item>
      <a-form-item :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }" label="选择表扬语" required>
        <a-checkbox-group @change="onChange" v-model="value">
          <span v-for="item in batchList" :key="item.id">
            <a-checkbox :value="`${item.id}`" :disabled="item.disabled">
              {{ item.label }}
            </a-checkbox>
          </span>
        </a-checkbox-group>
      </a-form-item>
    </a-form>
    <choose-student
      ref="chooseUser"
      is-check
      chooseType="class"
      v-if="userTag"
      v-model="userTag"
      @submit="chooseUser"
      title="选择学生"
      :classList="classList"
    ></choose-student>
  </a-modal>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import ChooseStudent from '@c/choose/ChooseStudent'
export default {
  name: 'AddPraises',
  components: {
    ChooseStudent
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
      classList: [],
      pageList: {
        page: 1,
        size: 20
      },

      isLoad: false,
      addVisible: false,
      form: this.$form.createForm(this),
      appForm: {
        label: ''
      },
      isView: false,
      batchList: [],
      labelList: [],
      value: [],
      getList: []
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  mounted() {
    this.praiseList_()
  },
  methods: {
    ...mapActions('home', ['addsetPraise', 'updatesetPraise', 'praiseList']),
    onChange(checkedValues) {
      this.labelList = []
      this.getList = checkedValues
      this.batchList.forEach(item => {
        this.getList.forEach(el => {
          if (item.id == el) {
            this.labelList.push(item.label)
          }
        })
      })
      if (this.value.length >= 3) {
        this.batchList.forEach(el => {
          el.disabled = this.value.indexOf(el.id.toString()) == -1
        })
      } else {
        this.batchList.forEach(el => {
          if (el.disabled) {
            el.disabled = false
          }
        })
      }
    },
    addTag() {
      this.userTag = true
    },
    async praiseList_() {
      const req = {
        schoolCode: this.userInfo.schoolCode,
        ...this.pageList
      }
      const res = await this.praiseList(req)
      this.batchList = res.data.list.filter(item => item.category === 2)
      this.batchList.forEach(el => {
        this.$set(el, 'disabled', false)
      })
    },
    classClose(removedTag) {
      this.classList = this.classList.filter(tag => tag !== removedTag)
    },
    chooseUser(values) {
      console.log(values)
      this.classList = values
      this.$refs.chooseUser.reset()
    },
    addSubmit(e) {
      e.preventDefault()
      this.form.validateFields((error, values) => {
        if (!error) {
          if (this.classList.length === 0) {
            this.$message.warning('请选择要表扬的学生!')
            return
          }
          this.isLoad = true
          const req = {
            labelList: this.labelList,
            praiseList: this.classList.map(el => {
              return {
                category: 2,
                praiseNamePhoto: el.photoUrl,
                praiseName: el.userName,
                praiseCode: el.userCode,
                createUsercode: this.userInfo.userCode,
                createUsername: this.userInfo.userName,
                schoolCode: this.userInfo.schoolCode,
                schoolYearId: JSON.parse(window.sessionStorage.getItem('schoolYear')).schoolYearId,
                classCode: el.classCode,
                className: el.className,
                gradeName: el.gradeName,
                professionName: el.subjectName,
                professionCode: el.subjectCode
              }
            })
          }
          this.addsetPraise(req)
            .then(res => {
              this.addVisible = false
              this.isLoad = false
              this.value = []
              this.batchList = this.batchList.map(el => {
                return {
                  ...el,
                  disabled: false
                }
              })
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

<style lang="less" scoped></style>
