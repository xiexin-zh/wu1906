<template>
  <div class="accident-add page-layout bg-fff qui-fx-ver">
    <div class="content pos-box">
      <a-form :form="form">
        <a-form-item
          v-bind="formItemLayout"
          :label="list.label"
          v-for="(list, index) in formData"
          :key="index"
          required
        >
          <a-input v-decorator="['value', { initialValue: list.value }]" readOnly />
        </a-form-item>
        <a-form-item v-bind="formItemLayout" label="事故发生详情" required>
          <a-textarea v-decorator="['details', { initialValue: detailInfo.details }]" readOnly />
        </a-form-item>
        <a-form-item v-bind="formItemLayout" label="事故图片">
          <img :src="url" alt="" v-for="(url, index) in detailInfo.pictures" :key="index" />
        </a-form-item>
        <a-form-item v-bind="formItemLayout" label="处理信息" required v-if="detailInfo.disposeInfo">
          <a-textarea v-decorator="['disposeInfo', { initialValue: detailInfo.disposeInfo }]" readOnly />
        </a-form-item>
        <a-form-item v-bind="formItemLayout" label="批示以及续报信息">
          <a-input
            v-decorator="['content', { initialValue: '暂未有批示和续报信息' }]"
            readOnly
            v-if="detailInfo.status === '1'"
          />
          <div v-for="element in detailInfo.instructReports" :key="element.id" v-else>
            <div class="u-mar-b10">
              <div class="title u-padd-l10">
                {{ detailInfo.schoolName }}-{{ element.userName }} {{ element.type === '1' ? '批示于' : '续报于' }} {{ element.time | gmtToDate }}
              </div>
              <div class="u-bd-l u-bd-r u-bd-b u-padd-l10">{{ element.content }}</div>
            </div>
          </div>
        </a-form-item>
        <a-form-item v-bind="formItemLayout" label="结案信息" v-if="detailInfo.status !== '1'">
          <a-textarea
            placeholder="请填写结案信息"
            :read-only="detailInfo.status === '3'"
            v-decorator="[
              'finishInfo',
              {
                initialValue: detailInfo.finishInfo,
                rules: [
                  {
                    required: true,
                    message: '请填写结案信息'
                  }
                ]
              }
            ]"
          />
        </a-form-item>
        <a-form-item v-bind="formItemLayout" :style="{ textAlign: 'center' }" v-if="detailInfo.status === '2'">
          <a-button @click="cancel">取消</a-button>
          <a-button class="mar-l10" type="primary" @click="submitForm" :loading="confirmLoading">保存</a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  name: 'AddAccident',
  components: {},
  data() {
    return {
      form: this.$form.createForm(this),
      formItemLayout: {
        labelCol: { span: 6 },
        wrapperCol: { span: 16 }
      },
      formData: [],
      detailId: '',
      detailInfo: {},
      confirmLoading: false
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  mounted() {
    this.detailId = this.$route.query.id
    this.showDetail(this.detailId)
  },
  methods: {
    ...mapActions('home', ['finishAccident', 'updateOtherArchive', 'accidentDetail']),
    async showDetail() {
      const res = await this.accidentDetail(this.detailId)
      const data = res.data
      this.detailInfo = data
      this.formData = [
        {
          value: res.data.title,
          label: '事故名称'
        },
        {
          value: this.$tools.getDate(res.data.happenTime, 1),
          label: '事故发生时间'
        },
        {
          value: this.$tools.accidentType(res.data.type),
          label: '事故分类'
        },
        {
          value: this.$tools.accidentNature(res.data.nature),
          label: '事故性质'
        },
        {
          value: this.$tools.accidentLevel(res.data.level),
          label: '事故等级'
        },
        {
          value: res.data.financialLoss,
          label: '事故直接经济损失'
        },
        {
          value: res.data.deathNum,
          label: '死亡人数'
        },
        {
          value: res.data.injuredNum,
          label: '受伤人数'
        },
        {
          value: res.data.location,
          label: '事故发生地点'
        },
        {
          value: this.$tools.accidentStatus(res.data.status),
          label: '事故现状态'
        }
      ]
    },
    cancel() {
      this.$router.go(-1)
    },
    submitForm(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          const req = {
            finishInfo: values.finishInfo,
            id: this.detailId,
            userCode: this.userInfo.userCode,
            userName: this.userInfo.userName
          }
          this.confirmLoading = true
          this.finishAccident(req)
            .then(res => {
              this.$message.success('操作成功')
              this.$tools.goNext(() => {
                this.$router.go(-1)
              })
            })
            .catch(() => {
              this.confirmLoading = false
            })
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.accident-add {
  padding: 20px;
  .content {
    height: calc(100% - 10px);
    overflow-y: scroll;
    img {
      width: 100px;
      height: 100px;
      margin-right: 20px;
    }
    .title {
      height: 40px;
      background-color: #f2f2f2;
    }
  }
}
</style>
