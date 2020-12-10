<template>
  <a-modal
    title="查看评分方案"
    v-model="addVisible"
    :destroyOnClose="true"
    :maskClosable="false"
    width="940px"
    :footer="null"
  >
    <a-form :form="form">
      <a-form-item label="方案名称：" v-bind="formItemLayout">
        <a-input v-decorator="[ 'name', { initialValue: appForm.name } ]" disabled/>
      </a-form-item>
      <a-form-item label="方案说明：" v-bind="formItemLayout">
        <a-input v-decorator="[ 'remark', { initialValue: appForm.remark } ]" disabled/>
      </a-form-item>
      <a-form-item label="班级基础分：" v-bind="formItemLayout">
        <a-input v-decorator="[ 'baseScore', { initialValue: appForm.baseScore } ]" disabled/>
      </a-form-item>
      <a-form-item label="方案设置：" v-bind="formItemLayout">
        <div class="project-box">
          <div v-for="list in project" :key="list.key">
            <div class="qui-fx">
              检查项名称：<a-input style="width:20%" v-model="list.name" disabled></a-input>
            </div>
            <div v-for="item in list.indexDtoList" :key="item.key">
              <div class="qui-fx">
                指标内容：<a-input style="width:30%" v-model="item.name" disabled></a-input>
                <div>指标分值：</div>
                <a-input-number style="width:30%" v-model="item.score" disabled></a-input-number>
              </div>
            </div>
          </div>
        </div>
      </a-form-item>
      <a-form-item label="德育员" v-bind="formItemLayout" >
        <div>
          <template v-for="tag in appForm.eduUserDtoList">
            <a-tag :key="tag.userCode"> {{ tag.userName }} </a-tag>
          </template>
        </div>
      </a-form-item>
      <a-form-item label="评分对象" v-bind="formItemLayout">
        <div>
          <template v-for="tag in appForm.classDtoList">
            <a-tag :key="tag.beAssessedCode"> {{ tag.gradeName }}{{ tag.beAssessedName }} </a-tag>
          </template>
        </div>
      </a-form-item>
      <a-form-item label="评分周期：" v-bind="formItemLayout">
        <a-radio-group
          disabled
          v-decorator="[
            'cycle ',
            { initialValue: appForm.cycle }
          ]">
          <a-radio value="D"> 按日打分 </a-radio>
          <a-radio value="W"> 按周打分 </a-radio>
          <a-radio value="M"> 按月打分 </a-radio>
        </a-radio-group>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { mapActions } from 'vuex'
import moment from 'moment'
export default {
  name: 'ScoreDetail',
  components: {
  },
  data() {
    return {
      formItemLayout: {
        labelCol: { span: 3 },
        wrapperCol: { span: 21 }
      },
      userTag: false,
      studentTag: false,
      categoryTime: moment('12:00:00', 'HH:mm:ss'),
      classList: [],
      remark: '',
      name: '',
      isLoad: false,
      addVisible: false,
      form: this.$form.createForm(this),
      appForm: {},
      teacherList: [],
      project: [],
      isView: false,
      disabled: false,
      regex: false
    }
  },
  methods: {
    ...mapActions('home', ['getCategoryDetail']),
    moment,
    async getDetail(categoryId) {
      const res = await this.getCategoryDetail(categoryId)
      const data = res.data
      const eduItemsDtos = res.data.eduItemsDtos
      this.appForm = data
      this.project = eduItemsDtos
      this.project.map((el, index) => {
        el.key = index
        el.indexDtoList.map((item, i) => {
          item.key = i
        })
      })
      this.categoryTime = moment(new Date(data.time), 'HH:mm:ss')
    }
  }
}
</script>

<style lang="less" scoped>
.ant-input-disabled,
.ant-input-number-disabled,
.ant-select-disabled,
.ant-radio-disabled,
.ant-time-picker-input{
  background-color: #fff;
  color: #999;
}
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
