<template>
  <div class="card-details u-bg-fff qui-fx-ver u-auto" :style="{ maxHeight: maxHeight + 'px' }">
    <card class="crad">
      <div slot="title" class="u-fx-ac u-fx-jsb">
        <div>基本信息</div>
      </div>
      <div slot="content">
        <a-row class="qui-fx-jsa page-layout qui-fx-ac u-padd-t10 u-padd-b20">
          <a-col :span="2" class="padd-t10"></a-col>
          <a-col :span="20" class="padd-t10">
            <div class="qui-fx-ver">
              <a-row class="">
                <a-col class="td td-title u-fx-jc" :span="4">订单号</a-col>
                <a-col class="td u-fx-jc" :span="8">{{ detail.orderId }}</a-col>
                <a-col class="td td-title u-fx-jc" :span="4">订单详情</a-col>
                <a-col class="td u-fx-jc" :span="8">{{ detail.remark }}</a-col>
              </a-row>
              <a-row class="">
                <a-col class="td td-title u-fx-jc" :span="4">交易状态</a-col>
                <a-col class="td u-fx-jc" :span="8">{{ datamap(detail.status, dealTypeList) }}</a-col>
                <a-col class="td td-title u-fx-jc" :span="4">用户id</a-col>
                <a-col class="td u-fx-jc" :span="8">{{ detail.userCode }}</a-col>
              </a-row>
              <a-row class="">
                <a-col class="td td-title u-fx-jc" :span="4">订单金额</a-col>
                <a-col class="td u-fx-jc" :span="8">{{ detail.orderAmount }}</a-col>
                <a-col class="td td-title u-fx-jc" :span="4">AppKey</a-col>
                <a-col class="td u-fx-jc" :span="8">{{ }}</a-col>
              </a-row>
              <a-row class="">
                <a-col class="td td-title u-fx-jc" :span="4">优惠金额</a-col>
                <a-col class="td u-fx-jc" :span="8">{{ detail.discountAmount }}</a-col>
                <a-col class="td td-title u-fx-jc" :span="4">订单来源</a-col>
                <a-col class="td u-fx-jc" :span="8">{{ detail.source }}</a-col>
              </a-row>
              <a-row class="u-bd-b">
                <a-col class="td td-title u-fx-jc" :span="4">应收金额</a-col>
                <a-col class="td u-fx-jc" :span="8">{{ detail.payAmount }}</a-col>
                <a-col class="td td-title u-fx-jc" :span="4">订单时间</a-col>
                <a-col class="td u-fx-jc" :span="8">{{ detail.orderSuccTime | gmtToDate }}</a-col>
              </a-row>
            </div>
          </a-col>
        </a-row>
      </div>
    </card>
    <card class="crad">
      <div slot="title" class="u-fx-ac u-fx-jsb">
        <div>支付信息</div>
      </div>
      <div slot="content">
        <a-row class="qui-fx-jsa page-layout qui-fx-ac u-padd-t10 u-padd-b20">
          <a-col :span="2" class="padd-t10"></a-col>
          <a-col :span="20" class="padd-t10">
            <div class="qui-fx-ver">
              <a-row class="">
                <a-col class="td td-title u-fx-jc" :span="4">支付流水号</a-col>
                <a-col class="td u-fx-jc" :span="8">{{ detail.paySerial }}</a-col>
                <a-col class="td td-title u-fx-jc" :span="4">支付账户</a-col>
                <a-col class="td u-fx-jc" :span="8">{{ }}</a-col>
              </a-row>
              <a-row class="">
                <a-col class="td td-title u-fx-jc" :span="4">支付状态</a-col>
                <a-col class="td u-fx-jc" :span="8">{{ datamap(detail.payStatus, payTypeList) }}</a-col>
                <a-col class="td td-title u-fx-jc" :span="4">学号/工号</a-col>
                <a-col class="td u-fx-jc" :span="8">{{ }}</a-col>
              </a-row>
              <a-row class="">
                <a-col class="td td-title u-fx-jc" :span="4">支付金额</a-col>
                <a-col class="td u-fx-jc" :span="8">{{ detail.orderAmount }}</a-col>
                <a-col class="td td-title u-fx-jc" :span="4">班级/部门</a-col>
                <a-col class="td u-fx-jc" :span="8">{{ }}</a-col>
              </a-row>
              <a-row class="u-bd-b">
                <a-col class="td td-title u-fx-jc" :span="4">支付时间</a-col>
                <a-col class="td u-fx-jc" :span="8">{{ detail.tPayOrder.paySuccTime | gmtToDate }}</a-col>
                <a-col class="td td-title u-fx-jc" :span="4">支付方式</a-col>
                <a-col class="td u-fx-jc" :span="8">{{ detail.payChannel }}</a-col>
              </a-row>
            </div>
          </a-col>
        </a-row>
      </div>
    </card>
    <card class="crad">
      <div slot="title" class="u-fx-ac u-fx-jsb">
        <div>操作信息</div>
      </div>
      <div slot="content">
        <div class="u-padd-20">
          <a-timeline>
            <a-timeline-item>
              <p>2015-09-01</p>
              <p>Create a services site </p>
            </a-timeline-item>
            <a-timeline-item>
              <p>2015-09-01</p>
              <p>Create a services site </p>
            </a-timeline-item>
            <a-timeline-item>
              <p>2015-09-01</p>
              <p>Create a services site </p>
            </a-timeline-item>
            <a-timeline-item>
              <p>2015-09-01</p>
              <p>Create a services site </p>
            </a-timeline-item>
          </a-timeline>
        </div>
      </div>
    </card>
  </div>
</template>
<script>
import card from '../../component/card'
import { mapState, mapActions } from 'vuex'
export default {
  name: 'OrderDetail',
  components: {
    card
  },
  data() {
    return {
      detail: {
        tPayOrder: {}
      },
      maxHeight: 300,
      payTypeList: [],
      dealTypeList: []
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  async mounted() {
    this.maxHeight = window.screen.height - 215
    await this._showDetail()
    this.payTypeList = JSON.parse(window.localStorage.getItem('pay_status'))
    this.dealTypeList = JSON.parse(window.localStorage.getItem('trade_status'))
  },
  methods: {
    ...mapActions('home', ['getOrderDetail']),
    datamap(data, list) {
      return list.filter((ele) => ele.key === data).length > 0 ? list.filter((ele) => ele.key === data)[0].val : ''
    },
    async _showDetail() {
      const res = await this.getOrderDetail(this.$route.query.id)
      this.detail = res.data
    }
  }
}
</script>

<style lang="less" scoped>
/deep/ #card {
  border: 1px #f5f5f5 solid;
}
.card-details {
  padding: 20px;
  .crad {
    width: 100%;
    .td{
      padding: 10px;
      border: 1px solid #eee;
      height: 39px;
      border-bottom: none
    }
    .td-title{
      background: #f5f5f5;
      text-align: right;
    }
  }
  .ant-timeline-item p{
    margin-bottom: 5px;
  }
}
</style>
