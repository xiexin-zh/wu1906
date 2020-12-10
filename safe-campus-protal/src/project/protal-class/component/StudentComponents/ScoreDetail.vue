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
      <a-form-item label="方案设置：" v-bind="formItemLayout" required>
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
      <a-form-item label="授权查看人" v-bind="formItemLayout">
        <div>
          <template v-for="tag in appForm.eduUserDtoList">
            <a-tag :key="tag.userCode">
              {{ tag.userName }}
            </a-tag>
          </template>
        </div>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import moment from 'moment'
export default {
  name: 'ScoreDetail',
  data() {
    return {
      formItemLayout: {
        labelCol: { span: 3 },
        wrapperCol: { span: 21 }
      },
      remark: '',
      value: 1,
      radioStyle: {
        display: 'block',
        height: '45px',
        lineHeight: '45px'
      },
      name: '',
      addVisible: false,
      form: this.$form.createForm(this),
      appForm: {},
      project: []
    }
  },
  methods: {
    ...mapActions('home', ['stuCategoryDetail']),
    moment,
    async getDetail(categoryId) {
      const res = await this.stuCategoryDetail(categoryId)
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
