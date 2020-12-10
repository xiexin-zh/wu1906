<template>
  <div class="task-add page-layout qui-fx-ver">
    <div class="content pos-box bg-fff">
      <div class="u-padd-10 u-padd-l20 u-padd-t20">
        <a-row type="flex" class="u-mar-40" >
          <a-col :span="5" >
          </a-col>
          <a-col :span="16" >
            <div class="stepBar u-fx">
              <div
                v-for="(item,index) in steps"
                :key="index"
                class="u-fx-ac-jc"
                :class="[item.count==='1'?'step-fist':item.count==='4'?'step-end':'step',{'active':item.active}]"
                @click="isActive(item.count)">{{ item.name }}
              </div>
            </div>
          </a-col>
        </a-row>
        <info v-if="stepsActive==='1'" :id="id" ref="info" ></info>
        <lesson-plan v-if="stepsActive==='2'" :id="id" ref="lessonPlan"></lesson-plan>
        <exercise v-if="stepsActive==='3'" :id="id" ref="exercise" ></exercise>
        <resources v-if="stepsActive==='4'" :id="id" ref="resources" ></resources>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
export default {
  name: 'AddTask',
  components: {
    info: () => import('./Info'),
    exercise: () => import('./Exercise'),
    lessonPlan: () => import('./LessonPlan'),
    resources: () => import('./Resources')
  },
  data() {
    return {
      id: '',
      stepsActive: '1',
      steps: [
        {
          name: '课堂信息',
          active: true,
          count: '1'
        },
        {
          name: '课堂教案',
          active: false,
          count: '2'
        },
        {
          name: '课堂习题',
          active: false,
          count: '3'
        },
        {
          name: '课堂资源',
          active: false,
          count: '4'
        }
      ],
      userList: {}, // 资源类型
      appForm: {},
      firstData: [],
      formItemLayout: {
        labelCol: { span: 6 },
        wrapperCol: { span: 16 }
      },
      fileInfo: {
        tip: '上传图标',
        h: 120, // 高度
        w: 120 // 宽度
      },
      isLoad: false,
      form: this.$form.createForm(this),
      cardInfo: {
        taskType: '1',
        thumbnailUrl: []
      },
      isEdit: false,
      url: '',
      show: true,
      flag: false,
      docName: ''
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])

  },
  watch: {
  },
  async mounted() {
    this.id = this.$route.query.id
  },
  methods: {
    ...mapActions('home', [
      'firstCategory'
    ]),
    isActive(count, id) {
      // 保存信息改变路由参数
      if (id) {
        this.$router.push({ query: { id: id } })
      }
      // 课堂信息的时候判断是否有通过校验到下一步
      if (this.stepsActive === '1' && count > '1') {
        const a = this.$refs.info.submitOk()
        if (!a) return
      }
      // if (count === '2') {
      //   this.$refs.info.save()
      // } else if (count === '3') {
      //   this.$refs.info.save()
      //   this.$refs.lessonPlan.submitOk()
      // } else if (count === '4') {
      //   this.$refs.info.save()
      //   this.$refs.lessonPlan.submitOk()
      //   this.$refs.exercise.submitOk()
      // }
      this.stepsActive = count
      this.steps.forEach(element => {
        if (element.count === count) {
          element.active = true
        } else {
          element.active = false
        }
      })
    },
    previous() {
      this.stepsActive++
    },
    nextStep() {}

  }
}
</script>
<style lang="less" scoped>
.task-add {
  background-color: #f5f5fb;
  .content {
    height: calc(100% - 10px);
    overflow-y: scroll;
    .input {
      width: 90%;
      border: 1px dashed #cfcfcf;
    }
   }
   .stepBar{
      .step-fist{
        width: 169px;
        height: 38px;
        background: url('../../../../assets/img/Tab1_weixuan.png') no-repeat ;
        background-size: 169px, 50px;
        &.active{
          color: #fff;
          background: url('../../../../assets/img/Tab1_xuanzhong.png') no-repeat ;
          background-size: 169px, 50px;
        }
      }
      .step{
        width: 169px;
        height: 38px;
        background: url('../../../../assets/img/Tab2_weixuan.png') no-repeat ;
        background-size: 169px, 50px;
        &.active{
          color: #fff;
          background: url('../../../../assets/img/Tab2_xuanzhong.png') no-repeat ;
          background-size: 169px, 50px;
        }
      }
      .step-end{
        width: 169px;
        height: 38px;
        background: url('../../../../assets/img/Tab3_weixuan.png') no-repeat ;
        background-size: 169px, 50px;
        &.active{
          color: #fff;
          background: url('../../../../assets/img/Tab3_xuanzhong.png') no-repeat ;
          background-size: 169px, 50px;
        }
      }
   }
}
</style>
