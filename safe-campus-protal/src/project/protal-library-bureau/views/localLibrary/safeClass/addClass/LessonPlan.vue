<template>
  <div class="lessonPlan qui-fx-ver">
    <!-- <div class="content pos-box bg-fff"> -->
    <div class="u-padd-10 u-padd-l20 u-padd-t40">
      <a-row type="flex" justify="center">
        <a-col :span="18" >
          <a-button icon="plus" class="add-action-btn u-mar-b20" type="primary" @click="addPlan">添加教案</a-button>
          <a-collapse v-model="activeKey">
            <a-collapse-panel :key="`${index+1}`" v-for="(list,index) in planList">
              <div slot="header" class="u-fx-ac header" >
                <div class="u-fx-ac">
                  <div>教案名称：</div>
                  <div class="wh">
                    <a-input
                      style="width:500px"
                      @click.stop="inputChange"
                      v-model="list.name"
                      placeholder="请填写教案名称" />
                  </div>
                </div>
                <div class="delIcon ">
                  <a-icon type="close" @click.stop="delPlan(index)" />
                </div>
              </div>
              <a-form :form="form[Object.keys(form)[index]]">
                <a-form-item required label="教案图片" v-bind="formItemLayout">
                  <a-row >
                    <a-col :span="24" >
                      <upload-multi
                        :length="10"
                        v-model="list.pictures"
                        :fileInfo="fileInfo"
                      ></upload-multi>
                    </a-col>
                  </a-row>
                </a-form-item>
                <a-form-item
                  label="教案内容："
                  v-bind="formItemLayout"
                  :style="{ textAlign: 'center' }"
                  required
                >
                  <quill-editor
                    v-model="list.content"
                    ref="myQuillEditor"
                    :options="quillOption"
                    @focus="onEditorFocus($event)"
                    @change="onEditorChange($event)"
                  ></quill-editor>
                </a-form-item>
              </a-form>
            </a-collapse-panel>
          </a-collapse>
        </a-col>
      </a-row>
      <div class="u-tx-c u-mar-t20">
        <a-button type="primary" @click="previous">上一步</a-button>
        <a-button class="mar-l10" type="primary" @click="nextStep">下一步</a-button>
        <a-button class="mar-l10" @click="carryOut" >完成</a-button>
      </div>
    </div>
    <!-- </div> -->
  </div>
</template>

<script>
import { quillEditor } from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import quillConfig from '../../../../assets/js/quill-config'
import UploadMulti from '@c/UploadMulti'
import { mapState, mapActions } from 'vuex'
export default {
  name: 'LessonPlan',
  components: {
    UploadMulti,
    quillEditor
  },
  data() {
    return {
      form: {
        creatFrom1: this.$form.createForm(this)
      },
      activeKey: ['1'],
      planList: [ // 初始值
        {
          content: '',
          name: '',
          pictures: []
        }
        // {
        //   content: '',
        //   name: '',
        //   pictures: []
        // }
      ],
      quillOption: quillConfig,
      formItemLayout: {
        labelCol: { span: 2 },
        wrapperCol: { span: 20 }
      },
      fileInfo: {
        tip: '上传图标',
        h: 120, // 高度
        w: 120 // 宽度
      },
      isLoad: false,
      cardInfo: {
        taskType: '1',
        thumbnailUrl: []
      }
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  watch: {
  },
  async created() {
    this.id = this.$route.query.id
    if (this.id) {
      this.showDetail()
    }
  },
  methods: {
    ...mapActions('home', [
      'planSearch',
      'planBind'
    ]),
    // 添加教案
    addPlan() {
      this.planList.unshift({
        content: '',
        name: '',
        pictures: []
      })
      const value = `creatFrom${this.planList.length}`
      this.form[value] = this.$form.createForm(this)
    },
    delPlan(index) {
      this.planList.splice(index, 1)
      delete this.form[Object.keys(this.form)[index]]
      console.log(this.form)
    },
    // 穿透点击事件不能删
    inputChange() {},
    // 获取详情
    async showDetail() {
      const res = await this.planSearch(this.id)
      if (res.data.length === 0) return // 为空数组的时候不赋值
      this.planList = res.data.map(el => {
        return {
          ...el,
          pictures: el.pictures.map(v => {
            return {
              url: v || '',
              uid: '',
              uname: ''
            }
          })
        }
      })
    },
    // 富文本编辑器方法
    onEditorFocus(data) {},
    // 获得焦点事件
    onEditorChange(data) {
      this.text = data.text
      this.content = data.html
      this.roundup = data.text.substring(0, 120)
    },
    previous() {
      this.$parent.isActive('1')
    },
    // 完成
    carryOut() {
      this.submitOk().then(el => {
        this.$router.push('/safeClassLocal')
      })
    },
    // 下一步
    nextStep() {
      this.submitOk().then(el => {
        this.$parent.isActive('3')
      })
    },
    // 提交
    submitOk(e) {
      return new Promise((resolve, reject) => {
        // 循环校验表单
        let checkFalg = true
        const that = this
        Object.values(this.form).forEach((element, index) => {
          element.validateFields((error, values) => {
            if (!error) {
              const name = that.planList[index].name
              if (!name) {
                checkFalg = false
                return that.$message.success(`教案名字不能为空`)
              }
              const pictures = this.planList[index].pictures
              if (pictures.length === 0) {
                checkFalg = false
                return this.$message.success(`${name}教案图片不能为空`)
              }
              const content = this.planList[index].content
              if (!content) {
                checkFalg = false
                return this.$message.success(`${name}教案内容不能为空`)
              }
            }
          })
        })
        if (checkFalg) {
          const req = {
            classId: Number(this.id),
            planList: this.planList.map(v => {
              return {
                ...v,
                pictures: v.pictures.map(i => i.url)
              }
            })
          }
          this.planBind(req).then(res => {
            return resolve(res)
          })
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
@deep: ~'>>>';
.lessonPlan {
  .ant-collapse{
    background-color: #fff;
    border: none;
    .ant-collapse-item{
      border: 1px solid #f5f5f5;
      margin-bottom: 20px;
      @{deep} .header{
        display: flex;
        justify-content: space-between;
      }
    }
  }
}
</style>
