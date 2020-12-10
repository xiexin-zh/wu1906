<template>
  <div class="task-add page-layout qui-fx-ver">
    <div class="content pos-box">
      <div class="u-padd-10 u-padd-l20">
        <a-form :form="form">
          <a-form-item label="项目名称：" v-bind="formItemLayout">
            <a-input
              v-decorator="[
                'name',
                {
                  initialValue: identifyInfo.name,
                  rules: [{ required: true, message: '请填写项目名称' }]
                }
              ]"
              placeholder="请填写项目名称"
              :disabled="type === '2'"
            />
          </a-form-item>
          <a-form-item label="项目类型" v-bind="formItemLayout">
            <a-radio-group
              v-decorator="[
                'typeCode',
                {
                  initialValue: identifyInfo.typeCode,
                  rules: [{ required: true, message: '请选择项目类型' }]
                }
              ]"
              button-style="solid"
              :disabled="type === '2'"
            >
              <a-radio value="1">设施设备及区域</a-radio>
              <a-radio value="2">教育教学活动</a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item label="评估方式" v-bind="formItemLayout">
            <a-radio-group
              v-decorator="[
                'methodCode',
                {
                  initialValue: identifyInfo.methodCode,
                  rules: [{ required: true, message: '请选择评估方式' }]
                }
              ]"
              button-style="solid"
              :disabled="type === '2'"
            >
              <a-radio value="1">教学条件危险性分析评价法（LEC）</a-radio>
              <a-radio value="2">风险矩阵法（LS）</a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item label="检查对象" v-bind="formItemLayout" required>
            <div v-if="type !== '2'">
              <a-tag style="background: #fff; borderStyle: dashed;" @click="addTag" > <a-icon type="plus" />添加 </a-tag>
            </div>
            <table-list :page-list="pageList" :columns="type === '2' ? identify.identifyCheck : identify.identifyColumns" :table-list="identifyList">
              <template v-slot:actions="action">
                <div>
                  <a-button size="small" class="del-action-btn" icon="delete" @click="del(action)"></a-button>
                </div>
              </template>
            </table-list>
          </a-form-item>
          <a-form-item label="备注" v-bind="formItemLayout">
            <a-textarea
              :auto-size="{ minRows: 3, maxRows: 5 }"
              :allowClear="true"
              v-decorator="[
                'remark',
                {
                  initialValue: identifyInfo.remark
                }
              ]"
              :disabled="type === '2'"
            />
          </a-form-item>
        </a-form>
      </div>
      <div class="u-tx-c u-mar-t20" v-if="type !== '2'">
        <a-button @click="cancel">取消</a-button>
        <a-button class="mar-l10" type="primary" @click="submitOk" :disabled="isLoad">保存</a-button>
      </div>
    </div>
    <choose-identify
      ref="chooseIdentify"
      is-check
      :teacherList="identifyList"
      v-if="userTag"
      v-model="userTag"
      @submit="chooseIdentify"
      title="添加成员"
    ></choose-identify>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import TableList from '@c/TableList'
import NoData from '@c/NoData'
import moment from 'moment'
import ChooseIdentify from '../../component/ChooseIdentify'
import identify from '../../assets/js/table/identify'
export default {
  name: 'AddTask',
  components: {
    NoData,
    TableList,
    ChooseIdentify
  },
  data() {
    return {
      identify,
      classList: [],
      identifyList: [],
      formItemLayout: {
        labelCol: { span: 6 },
        wrapperCol: { span: 16 }
      },
      isLoad: false,
      userTag: false,
      form: this.$form.createForm(this),
      detailId: '',
      pageList: {
        page: 1,
        size: 20
      },
      identifyInfo: {
        typeCode: '1',
        methodCode: '1'
      },
      type: '0'
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  mounted() {
    this.detailId = this.$route.query.id
    this.type = this.$route.query.type
    if (this.detailId) {
      this.showDetail()
    }
  },
  methods: {
    ...mapActions('home', [ 'riskIdentifyDetail', 'addRiskIdentify', 'modifyRiskIdentify' ]),
    moment,
    // 获取详情
    async showDetail() {
      const res = await this.riskIdentifyDetail(this.detailId)
      this.identifyInfo = res.data
      this.identifyList = res.data.targetList
    },
    addTag() {
      this.userTag = true
    },
    cancel() {
      this.$router.go(-1)
    },
    chooseIdentify(record) {
      this.$refs.chooseIdentify.reset()
      console.log(record)
      this.identifyList = record
    },
    del(record) {
      this.identifyList = this.identifyList.filter(tag => tag !== record.record)
    },
    // 提交
    submitOk(e) {
      e.preventDefault()
      this.form.validateFields((error, values) => {
        this.isLoad = false
        if (!error) {
          if (this.identifyList.length === 0) {
            this.$message.warning('请选择检查对象')
            return
          }
          console.log('this.identifyList',this.identifyList)
          values.ids = this.identifyList.map(el => el.id ? el.id : el.detailId)
          values.schoolCode = this.userInfo.schoolCode
          this.isLoad = true
          if (this.detailId) {
            values.id = this.detailId
            this.modifyRiskIdentify(values)
              .then((res) => {
                this.$message.success('操作成功')
                this.$tools.goNext(() => {
                  this.$router.go(-1)
                })
              })
              .catch((res) => {
                this.isLoad = false
              })
          } else {
            this.addRiskIdentify(values)
              .then((res) => {
                this.$message.success('操作成功')
                this.$tools.goNext(() => {
                  this.$router.go(-1)
                })
              })
              .catch((res) => {
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
.task-add {
  .content {
    height: calc(100% - 10px);
    overflow-y: scroll;
  }
}
</style>
