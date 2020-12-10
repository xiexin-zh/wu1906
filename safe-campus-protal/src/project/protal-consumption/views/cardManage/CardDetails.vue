<template>
  <div class="card-details page-layout qui-fx-ver">
    <show-dialog
      width="600px"
      v-if="cardTag"
      v-model="cardTag"
      @submit="cardSubmit"
      :title="cardTitle"
      :on-text="btnText"
      ref="cardForm"
    >
      <a-alert v-if="tag === 2" message="请将空白新卡置于发卡器上进行读取换卡，您也可以手动输入新卡卡号" type="success" />
      <a-row class="u-padd-10" type="flex" align="middle" v-if="tag === 2">
        <a-col :span="6" class="u-tx-r">新卡号：</a-col>
        <a-col :span="16">
          <a-input ref="readnewcard" v-model="newCardNo" placeholder="请输入10位新卡号" />
        </a-col>
      </a-row>
      <a-row class="u-padd-10" type="flex" align="middle">
        <a-col :span="6" class="u-tx-r">卡号：</a-col>
        <a-col :span="16">
          <a-input
            ref="readcard"
            :readonly="detail.cardInfo.status !== '0'"
            v-model="detail.cardNo"
            placeholder="请输入10位卡号"
          />
        </a-col>
      </a-row>
      <a-row class="u-padd-10">
        <a-col :span="6" class="u-tx-r">姓名：</a-col>
        <a-col :span="16">{{ detail.userName }}</a-col>
      </a-row>
      <a-row class="u-padd-10">
        <a-col :span="6" class="u-tx-r">身份：</a-col>
        <a-col :span="16">{{ datamap(detail.userType, userTypeList) }}</a-col>
      </a-row>
      <a-row class="u-padd-10">
        <a-col :span="6" class="u-tx-r">学号工号：</a-col>
        <a-col :span="16">{{ detail.workNo }}</a-col>
      </a-row>
      <a-row class="u-padd-10">
        <a-col :span="6" class="u-tx-r">班级/部门：</a-col>
        <a-col :span="16">{{ detail.classBoards }}</a-col>
      </a-row>
      <a-row class="u-padd-10">
        <a-col :span="6" class="u-tx-r">卡状态：</a-col>
        <a-col :span="16">{{ datamap(detail.cardInfo.status, cardTypeList) }}</a-col>
      </a-row>
      <a-row class="u-padd-10">
        <a-col :span="6" class="u-tx-r">账户余额：</a-col>
        <a-col :span="16">
          {{ detail.balance }}
        </a-col>
      </a-row>
      <a-row class="u-padd-10">
        <a-col :span="6" class="u-tx-r">押金：</a-col>
        <a-col :span="16">
          <a-input
            :readonly="detail.cardInfo.status !== '0'"
            v-model="detail.deposit"
            placeholder="请输入押金"
          />
        </a-col>
      </a-row>
      <a-row class="u-padd-10">
        <a-col :span="6" class="u-tx-r">备注：</a-col>
        <a-col :span="16">
          <a-textarea v-model="recordRemark" placeholder="请输入备注" allow-clear />
        </a-col>
      </a-row>
      <a-row class="u-padd-10">
        <a-col :span="0" class="u-tx-r"></a-col>
        <a-col :span="24">
          <a-alert :message="tipMsg" banner />
        </a-col>
      </a-row>
    </show-dialog>
    <show-dialog
      width="800px"
      v-model="dialogTag"
      @submit="dialogTag = false"
      title="查看历史卡片"
      on-text="关闭"
    >
      <table-list :columns="columns" :table-list="historyList"></table-list>
    </show-dialog>
    <detail-show :detail-info="detailInfo" :title="detailTitle" :photoSrc="detail.photoUrl">
      <div>
        <a-button @click="showCard(0)" v-if="detail.status !=='3' && detail.cardInfo.status === '1'" class="add-btn">挂失</a-button>
        <a-button @click="showCard(1)" v-if="detail.status !=='3' && detail.cardInfo.status === '2'" class="export-btn">解挂</a-button>
        <a-button
          @click="showCard(2)"
          v-if="detail.status !=='3' && (detail.cardInfo.status === '1' || detail.cardInfo.status === '2')"
          class="export-all-btn"
        >换卡</a-button>
        <a-button
          @click="showCard(3)"
          v-if="detail.status !=='3' && (detail.cardInfo.status === '1' || detail.cardInfo.status === '2')"
          class="del-btn"
        >退卡</a-button>
        <a-button @click="showCard(4)" v-if="detail.status !=='3' && detail.cardInfo.status === '0'" class="add-btn">开卡</a-button>
      </div>
    </detail-show>
    <crad class="crad">
      <div slot="title">账户信息</div>
      <div slot="content">
        <a-row class="qui-fx-jsa page-layout qui-fx-ac padd-t10">
          <a-col :span="2" class="padd-t10"></a-col>
          <a-col :span="20" class="padd-t10">
            <div class="qui-fx-ver">
              <a-row class="padd-l10">
                <a-col class="mar-b10 qui-fx-jc" :span="8">账户余额 : {{ detail.balance }}</a-col>
                <a-col
                  class="mar-b10 qui-fx-jc"
                  :span="8"
                >状态 : {{ datamap(detail.status, accountTypeList) }}</a-col>
                <a-col class="mar-b10 qui-fx-jc" :span="8">开户时间 : {{ detail.openTime }}</a-col>
                <a-col class="mar-b10 qui-fx-jc" :span="8">押金 : {{ detail.deposit }}</a-col>
              </a-row>
            </div>
          </a-col>
        </a-row>
      </div>
    </crad>
    <crad class="crad">
      <div slot="title" class="u-fx-ac u-fx-jsb">
        <div>卡片信息</div>
        <div>
          <a-button @click="seeHistory" class="add-btn" v-if="detail.status !=='3'">查看历史卡片</a-button>
        </div>
      </div>
      <div slot="content">
        <a-row class="qui-fx-jsa page-layout qui-fx-ac padd-t10">
          <a-col :span="2" class="padd-t10"></a-col>
          <a-col :span="20" class="padd-t10">
            <div class="qui-fx-ver">
              <a-row class="padd-l10">
                <a-col class="mar-b10 qui-fx-jc" :span="8">卡号 : {{ detail.cardNo }}</a-col>
                <a-col
                  class="mar-b10 qui-fx-jc"
                  :span="8"
                >状态 : {{ datamap(detail.cardInfo.status, cardTypeList) }}</a-col>
                <a-col class="mar-b10 qui-fx-jc" :span="8">发卡时间 : {{ detail.openTime }}</a-col>
              </a-row>
            </div>
          </a-col>
        </a-row>
      </div>
    </crad>
    <crad class="crad">
      <div slot="title">消费规则</div>
      <div slot="content">
        <a-row class="qui-fx-jsa page-layout qui-fx-ac padd-t10">
          <a-col :span="2" class="padd-t10"></a-col>
          <a-col :span="20" class="padd-t10">
            <div class="qui-fx-ver">
              <a-row class="padd-l10">
                <a-col class="mar-b10 qui-fx-jc" :span="8">每日消费限额 : {{ detail.everydayConsume }}</a-col>
                <a-col class="mar-b10 qui-fx-jc" :span="8">单次消费限额 : {{ detail.singleConsume }}</a-col>
                <a-col class="mar-b10 qui-fx-jc" :span="8">优惠比例 : {{ detail.discount }}</a-col>
              </a-row>
            </div>
          </a-col>
        </a-row>
      </div>
    </crad>
  </div>
</template>
<script>
import DetailShow from '@c/DetailShow'
import ShowDialog from '@c/ShowDialog'
import { mapState, mapActions } from 'vuex'
import crad from '../../component/card'
import TableList from '@c/TableList'
const columns = [
  {
    title: '序号',
    width: '10%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '卡号',
    width: '20%',
    dataIndex: 'cardNo'
  },
  {
    title: '卡状态',
    width: '16%',
    dataIndex: 'status'
  },
  {
    title: '发卡时间',
    width: '27%',
    dataIndex: 'hairpinTime'
  },
  {
    title: '退卡时间',
    width: '27%',
    dataIndex: 'returnTime'
  }
]
export default {
  name: 'CardDetails',
  components: {
    TableList,
    crad,
    DetailShow,
    ShowDialog
  },
  data() {
    return {
      tipMsg: '',
      columns,
      detailTitle: '基本信息',
      detailInfo: [],
      detail: {
        cardInfo: {}
      },
      dialogTag: false,
      historyList: [],
      userTypeList: [],
      cardTypeList: [],
      accountTypeList: [],
      cardTag: false,
      cardTitle: '',
      actionType: ['挂失', '解挂', '换卡', '退卡', '开卡'],
      btnText: '确定',
      recordRemark: '',
      newCardNo: '',
      tag: '' // 操作类别
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  async mounted() {
    await this._showDetail()
    // this.detail = JSON.parse(window.localStorage.getItem('cardInfo'))
    this.userTypeList = JSON.parse(window.localStorage.getItem('user_type'))
    this.cardTypeList = JSON.parse(window.localStorage.getItem('card_status'))
    this.accountTypeList = JSON.parse(window.localStorage.getItem('ecard_account_status'))
    this.detailInfo = [
      {
        key: '姓名',
        val: this.detail.userName
      },
      {
        key: '班级/部门',
        val: this.detail.classBoards
      },
      {
        key: '学号/工号',
        val: this.detail.workNo
      },
      {
        key: '身份',
        val: this.datamap(this.detail.userType, this.userTypeList)
      }
    ]
    const index = this.columns.findIndex((list) => list.dataIndex === 'status')
    if (index !== -1) {
      this.columns[index].customRender = (text) => {
        return this.datamap(text, this.cardTypeList)
      }
    }
  },
  methods: {
    ...mapActions('home', ['getCardInfoList', 'getCardInfoDetail', 'lossCard', 'unlockCard', 'changeCard', 'returnCard', 'openCard']),
    datamap(data, list) {
      return list.filter((ele) => ele.key === data).length > 0 ? list.filter((ele) => ele.key === data)[0].val : ''
    },
    async _showDetail() {
      const res = await this.getCardInfoDetail(this.$route.query.id)
      this.detail = res.data
    },
    /**
     * @description 获取历史卡片信息
     */
    seeHistory() {
      this.dialogTag = true
      this._getCardInfoList()
    },
    async _getCardInfoList() {
      const res = await this.getCardInfoList({
        pageNum: 1,
        pageSize: 100,
        accountId: this.detail.id
      })
      this.historyList = res.rows
    },
    /**
     * @description 卡操作 包括挂失:0，解挂:1, 换卡:2，退卡: 3 开卡：4
     */
    showCard(tag) {
      this.cardTag = true
      this.cardTitle = this.actionType[tag]
      this.btnText = '确定' + this.actionType[tag]
      this.tag = tag
      if (tag === 0) {
        this.actionFun = 'lossCard'
        this.tipMsg = '挂失后将无法正常使用卡片，不影响人脸使用'
      } else if (tag === 1) {
        this.actionFun = 'unlockCard'
        this.tipMsg = '解挂后可正常使用卡片'
      } else if (tag === 2) {
        this.actionFun = 'changeCard'
        this.tipMsg = '换卡后原卡将被自动销卡作废，如有额外换卡费用，请直接向用户收取现金'
        this.$nextTick(() => {
          this.$refs.readnewcard.focus()
        })
      } else if (tag === 3) {
        this.actionFun = 'returnCard'
        this.tipMsg = '退卡后卡片被注销，无法再次使用，不影响刷脸功能'
      } else if (tag === 4) {
        this.actionFun = 'openCard'
        this.tipMsg = '开卡之后可以正常使用'
        this.$nextTick(() => {
          this.$refs.readcard.focus()
        })
      }
    },
    async cardSubmit() {
      if (this.tag === 2) {
        if (!this.newCardNo) {
          this.$message.warning('请输入新卡号')
          return
        }
        if (this.newCardNo.length !== 10) {
          this.$message.warning('卡号错误')
          return
        }
      }
      if (this.tag === 4) {
        if (!this.detail.cardNo) {
          this.$message.warning('请输入卡号')
          return
        }
        if (this.detail.cardNo.length !== 10) {
          this.$message.warning('卡号错误')
          return
        }
      }
      if (!this.recordRemark) {
        this.$message.warning('请输入备注')
        return
      }
      if (this.detail.deposit < 0) {
        this.$message.warning('金额不能为负数')
        return
      }
      this.$refs.cardForm.loading = true
      try {
        await this[this.actionFun]({
          accountId: this.detail.id,
          cardNo: this.detail.cardNo,
          depositAmount: this.detail.deposit,
          newCardNo: this.newCardNo,
          recordRemark: this.recordRemark
        })
        this.$message.success('操作成功')
        this.recordRemark = ''
        this.cardTag = false
        this.$tools.goNext(() => {
          this._showDetail()
        })
      } catch (err) {
        this.$refs.cardForm.loading = false
      }
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
    .border {
      border: 1px #f5f5f5 solid;
    }
  }
}
</style>
