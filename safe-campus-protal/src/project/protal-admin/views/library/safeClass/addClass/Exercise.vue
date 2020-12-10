<template>
  <div class="exercise page-layout qui-fx-ver">
    <!-- <div class="content pos-box bg-fff"> -->
    <div class="u-padd-10 u-padd-l20 u-padd-t40 ">
      <a-row :gutter="[50, 100]" type="flex" justify="center">
        <a-col :span="18">
          <div class="u-fx-ac u-mar-b10">
            <a-button
              icon="plus"
              class="add-action-btn mar-l10"
              type="primary"
              @click="addExercises"
            >添加课堂习题</a-button
            >
            <a-button class="mar-l10" type="danger" @click="delAll">批量删除</a-button>
            <div class="mar-l10">总分：<span>{{ getAllFraction }}</span>分</div>
          </div>
          <table-list
            is-check
            is-zoom
            :minHeight="500"
            v-model="chooseList"
            @selectAll="selectAll"
            :page-list="pageList"
            :columns="exerciseColumns"
            :table-list="findList"
          >
            <template v-slot:other1="{record,index}">
              <a-form-model ref="ruleForm">
                <a-form-model-item>
                  <a-input-number
                    placeholder="请输入正整数"
                    @blur="onChange(index,record.numberFraction)"
                    v-model="record.numberFraction"
                    style="width:80px"
                    :max="getMax(index)"
                    :min="0"
                    :formatter="value => (value + '').replace(/\./g, '')"
                    :parser="value => value.replace(/\./g, '')"
                  />
                </a-form-model-item>
              </a-form-model>
            </template>
            <template v-slot:actions="action">
              <a-tooltip placement="topLeft" title="预览">
                <a-button
                  size="small"
                  class="detail-action-btn"
                  icon="ellipsis"
                  @click.stop="preview(action.record)"
                ></a-button>
              </a-tooltip>
              <a-popconfirm placement="topLeft" ok-text="确定" cancel-text="取消" @confirm="del(action.record)">
                <template slot="title">
                  确定删除该任务吗？
                </template>
                <a-tooltip placement="topLeft" title="删除">
                  <a-button size="small" class="del-action-btn" icon="delete"></a-button>
                </a-tooltip>
              </a-popconfirm>
            </template>
          </table-list>
        </a-col>
      </a-row>
      <div class="u-tx-c u-mar-t40 u-mar-b20">
        <a-button type="primary" @click="previous">上一步</a-button>
        <a-button class="mar-l10" type="primary" @click="nextStep">下一步</a-button>
        <a-button class="mar-l10" @click="carryOut">完成</a-button>
      </div>
    </div>
    <exercise-list v-model="formStatus"></exercise-list>
    <submit-form ref="form" title="预览习题" v-model="previewStatus" :form-data="formData"> </submit-form>
  </div>
</template>

<script>
import SubmitForm from '../../../../component/ExerciseSubmitForm'
import { exerciseColumns } from '../../../../assets/js/tableColumns'
import { exerciseSearchLabel } from '../../../../assets/js/searchLabel'
import PageNum from '@c/PageNum'
import { mapState, mapActions } from 'vuex'
import TableList from '@c/TableList'
import SearchForm from '@c/SearchForm'
export default {
  name: 'AddTask',
  components: {
    TableList,
    SearchForm,
    PageNum,
    SubmitForm,
    exerciseList: () => import('./ExerciseList')
  },
  computed: {
    ...mapState('home', ['userInfo']),
    getAllFraction() {
      const a = this.findList.map(v => Number(v.fraction)).reduce((a, b) => a + b, 0)
      return a > 0 ? a : 0
    }
  },
  data() {
    return {
      value: 1,
      previewStatus: false,
      formData: {},
      chooseList: [], // 当有选择项时，被选中的项，返回每项的唯一id
      pageList: {
        page: 1,
        size: 20
      },
      formStatus: false,
      isLoad: true,
      exerciseColumns,
      exerciseSearchLabel,
      findList: [],
      // 习题弹框
      exerciseData: {
        // record: [],
        // total: '20'
      }
    }
  },
  watch: {},
  async created() {
    this.id = this.$route.query.id
    if (this.id) {
      this.showList()
    }
  },
  methods: {
    ...mapActions('home', ['exercisesSearch', 'exercisesBind']),
    async showList() {
      const res = await this.exercisesSearch(this.id)
      this.findList = res.data.map(el => {
        return {
          ...el,
          numberFraction: el.fraction
        }
      })
    },
    addExercises() {
      this.formStatus = true
    },
    // 子组件选择的习题
    sonSelected(record) {
      if (this.findList.length === 0) {
        this.findList = this.findList.concat(record)
      } else {
        const chenckedArr = record.filter(v => this.findList.findIndex(i => i.id === v.id) === -1) // 去重
        this.findList = this.findList.concat(chenckedArr)
      }
    },
    delAll() {
      if (this.chooseList.length <= 0) return this.$message.error('请选择习题')
      const that = this
      this.$confirm({
        title: '提示',
        content: '确定批量删除选中的习题吗?',
        onOk() {
          that.findList = that.findList.filter(v => !that.chooseList.includes(v.id))
        },
        onCancel() {}
      })
    },
    del(record) {
      this.findList = this.findList.filter(v => v.id !== record.id)
    },
    // 预览
    preview(record) {
      this.previewStatus = true
      const { content, answers, topicType } = record
      const initValue = []
      this.formData = {
        type: topicType === '1' ? '单选题' : '多选题',
        label: content,
        options: answers.map((el, index) => {
          if (el.selected) {
            initValue.push(index)
          }
          return {
            key: index,
            val: el.option,
            selected: el.selected
          }
        }),
        checkedValue: initValue
      }
    },
    selectAll() {},
    previous() {
      this.$parent.isActive('2')
    },
    // 完成
    carryOut() {
      // if (this.findList.length === 0) return this.$message.error('请添加习题')
      this.submitOk().then(el => {
        this.$router.push('/safeClass')
      })
    },
    // 下一步
    nextStep() {
      // if (this.findList.length === 0) return this.$message.error('请添加习题')
      this.submitOk().then(el => {
        this.$parent.isActive('4')
      })
    },
    // 提交
    async submitOk(e) {
      return new Promise((resolve, reject) => {
        const req = {
          classId: Number(this.id),
          exercisesList: this.findList.map(v => {
            return {
              fraction: v.fraction,
              id: Number(v.id)
            }
          })
        }
        this.exercisesBind(req).then(res => {
          return resolve(res)
        })
      })
    },
    // 失去焦点设置每列习题分数值fraction
    onChange(index, numberFraction) {
      this.findList[index].fraction = numberFraction
    },
    nostop() {
      console.log(1)
    },
    // 弹框方法
    searchForm(values) {
      this.searchList = values
      this.showList()
    },
    // 动态获取最大值
    getMax(index) {
      const a = this.findList.filter((v, count) => count !== index)
      return 100 - (a.map(v => Number(v.fraction)).reduce((a, b) => a + b, 0))
    }
  }
}
</script>
<style lang="less" scoped>
@deep: ~'>>>';
.exercise {
  @{deep} .ant-form-item{
    margin-bottom: 0px!important;
  }
}
</style>
