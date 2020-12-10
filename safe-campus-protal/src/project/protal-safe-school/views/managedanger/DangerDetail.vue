<template>
  <div class="danger-detail page-layout bg-fff qui-fx-ver">
    <div class="content pos-box">
      <div class="detail-info">
        <div class="detail-title">
          <div class="title">查看隐患信息</div>
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
          <div class="title">处理流程</div>
        </div>
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
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import moment from 'moment'

export default {
  name: 'DangerDetail',
  components: {
  },
  data() {
    return {
      detailInfo: [],
      detailImg: [],
      processes: []
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  mounted() {
    this.detailId = this.$route.query.id
    if (this.detailId) {
      this.showDetail()
    }
  },
  methods: {
    ...mapActions('home', ['addInspect', 'dangerDetail', 'updateInspect', 'specialDangerDetail']),
    moment,
    handleClick(event) {
      event.stopPropagation()
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
        },
        {
          title: '整改图片：',
          content: data.completePhotoUrls
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
          border-left: none;
          height: 80px;
          line-height: 70px;
          border-bottom: none;
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
