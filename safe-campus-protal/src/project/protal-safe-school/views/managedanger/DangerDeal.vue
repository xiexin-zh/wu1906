<template>
  <div class="danger-detail page-layout bg-fff qui-fx-ver">
    <div class="content pos-box">
      <div class="detail-info">
        <div class="detail-title">
          <div class="title">隐患信息</div>
        </div>
        <div class="info">
          <div>
            <div class="info-box qui-fx" v-for="item in detailInfo" :key="item.id">
              <div class="info-title">{{ item.title }}</div>
              <div class="info-content qui-fx-f1">{{ item.content }}</div>
            </div>
          </div>
          <div class="img-content">
            <div class="img-box qui-fx" v-for="item in detailImg" :key="item.id">
              <div class="info-title">{{ item.title }}</div>
              <div class="info-content qui-fx-f1" v-if="item.title !== '隐患描述：'">
                <img v-for="(list,index) in item.content" :key="index" :src="list" alt />
              </div>
              <div v-else class="info-content qui-fx-f1">{{ item.content }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="detail-deal">
        <div class="detail-title">
          <div class="title">{{ title }}</div>
        </div>
        <a-form :form="form">
          <a-form-item label="验收状态：" v-bind="formItemLayout" v-if="title === '验收隐患'" required>
            <a-radio-group
              v-decorator="['state', { initialValue: state }]"
            >
              <a-radio value="1">通过</a-radio>
              <a-radio value="0">不通过</a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item label="验收备注：" v-bind="formItemLayout" v-if="title === '验收隐患'">
            <a-textarea
              v-decorator="[ 'remark']"
            />
          </a-form-item>
          <a-form-item label="整改图片：" v-bind="formItemLayout" required v-if="title === '处理隐患'">
            <upload-multi :length="9" v-model="completePhotos" :fileInfo="fileInfo"></upload-multi>
            备注：限上传9张照片
          </a-form-item>
          <a-form-item label="整改备注：" v-bind="formItemLayout" v-if="title === '处理隐患'">
            <a-textarea
              v-decorator="[ 'remark']"
            />
          </a-form-item>
          <a-form-item label="处理流程：" v-bind="formItemLayout">
            <a-timeline class="time-line">
              <a-timeline-item v-for="(item,index) in processes" :key="index">
                <div class="qui-fx">
                  <div class="time-left">
                    {{ item.content }}
                    <a-tooltip placement="topLeft" :title="item.remark" v-if="item.remark">
                      <span class="u-type-error">备注</span>
                    </a-tooltip>
                  </div>
                  <div class="qui-fx-f1">{{ item.createTime | gmtToDate }}</div>
                </div>
              </a-timeline-item>
            </a-timeline>
          </a-form-item>
          <a-form-item v-bind="formItemLayout" :style="{ textAlign: 'center' }">
            <a-button @click="cancel">取消</a-button>
            <a-button class="mar-l10" type="primary" @click="submitOk" :disabled="isLoad">保存</a-button>
          </a-form-item>
        </a-form>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import UploadMulti from '@c/UploadMulti'
import moment from 'moment'

export default {
  name: 'DangerDeal',
  components: {
    UploadMulti
  },
  data() {
    return {
      form: this.$form.createForm(this),
      formItemLayout: {
        labelCol: { span: 6 },
        wrapperCol: { span: 16 }
      },
      fileInfo: {
        tip: '上传图标',
        h: 120, // 高度
        w: 120 // 宽度
      },
      completePhotos: [],
      detailInfo: [],
      detailImg: [],
      processes: [],
      isLoad: false,
      title: '',
      state: '1'
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  mounted() {
    this.detailId = this.$route.query.id
    this.title = parseInt(this.$route.query.type) === 1 ? '处理隐患' : '验收隐患'
    if (this.detailId) {
      this.showDetail()
    }
  },
  methods: {
    ...mapActions('home', ['dangerDetail', 'dealDanger', 'checkDanger']),
    moment,
    cancel() {
      this.$router.go(-1)
    },
    // 提交
    submitOk(e) {
      e.preventDefault()
      this.form.validateFields((error, values) => {
        this.isLoad = false
        if (!error) {
          if (this.completePhotos.length === 0 && this.title === '处理隐患') {
            this.$message.warning('请上传图片')
            return
          }
          values.taskId = this.detailId
          values.optCode = this.userInfo.userCode
          values.completePhotos = this.completePhotos.map(el => el.url)
          this.isLoad = true
          if (this.title === '处理隐患') {
            this.dealDanger(values)
              .then(res => {
                this.$message.success('操作成功')
                this.$tools.goNext(() => {
                  this.$router.go(-1)
                })
              })
              .catch(res => {
                this.isLoad = false
              })
          } else {
            this.checkDanger(values)
              .then(res => {
                this.$message.success('操作成功')
                this.$tools.goNext(() => {
                  this.$router.go(-1)
                })
              })
              .catch(res => {
                this.isLoad = false
              })
          }
        }
      })
    },
    async showDetail() {
      const res = await this.dangerDetail(this.detailId)
      const data = res.data
      this.processes = data.processes
      this.detailInfo = [
        {
          title: '隐患地点：',
          content: data.address
        },
        {
          title: '负责人：',
          content: data.leaderName
        },
        {
          title: '隐患类型：',
          content: data.categoryName
        },
        {
          title: '处理人：',
          content: data.handerName
        },
        {
          title: '隐患状态：',
          content: data.state === '1' ? '已上报' : data.state === '2' ? '已指派' : data.state === '3' ? '已处理' : data.state === '4' ? '已验收' : data.state === '5' ? '已撤销' : ''
        },
        {
          title: '要求处理完成时长：',
          content: data.handleDuration
        },
        {
          title: '隐患等级：',
          content: data.level === '1' ? '低风险' : data.state === '2' ? '一般风险' : data.state === '3' ? '较大风险' : data.state === '4' ? '重大风险' : ''
        },
        {
          title: '是否允许转派：',
          content: data.hasDispense === '1' ? '可以' : '不可以'
        }
      ]
      this.detailImg = [
        {
          title: '隐患图片：',
          content: data.dangerPhotoUrls
        },
        {
          title: '隐患描述：',
          content: data.description
        }
      ]
    }
  }
}
</script>
<style lang="less" scoped>
.danger-detail {
  background-color: #f0f2f5;
  .content {
    height: calc(100% - 10px);
    overflow-y: scroll;
    .detail-info {
      padding-top: 20px;
      min-height: 500px;
      overflow-y: scroll;
      background-color: #fff;
      .info {
        padding: 20px;
        .info-box {
          border-top: 1px solid #9698d6;
          height: 55px;
          line-height: 52px;
          width: 50%;
          float: left;
          &:nth-child(2n) {
            border-right: 1px solid #9698d6;
          }
        }
        .img-content {
          margin-top: 220px;
        }
        .info-title {
          width: 150px;
          background-color: #f5f5fb;
          border-right: 1px solid #9698d6;
          border-left: 1px solid #9698d6;
          text-align: right;
          padding: 0 5px;
          color: #575758;
        }
        .info-content {
          padding: 0 10px;
          color: #333;
          width: 100%;
          overflow-x: scroll;
          img {
            width: 60px;
            height: 60px;
            margin-right: 10px;
          }
        }
        .img-box {
          border: 1px solid #9698d6;
          height: 80px;
          line-height: 70px;
          border-bottom: none;
          border-left: none;
          &:last-child {
            border-bottom: 1px solid #9698d6;
          }
          .info-title {
            &:last-child {
              border-bottom: 1px solid #9698d6 !important;
            }
          }
        }
      }
    }
    .detail-title {
      height: 35px;
      border-bottom: 1px solid #ddd;
      .title {
        margin-left: 40px;
        position: relative;
        &::before{
          content: '';
          position: absolute;
          height: 20px;
          width: 5px;
          background-color: #4D4CAC;
          left: -20px;
        }
      }
    }
    .detail-deal {
      margin-top: 20px;
      padding: 20px 0;
      background-color: #fff;
      .time-line {
        margin: 30px 0 0 20px;
        .time-left {
          width: 360px;
        }
      }
    }
  }
}
</style>
