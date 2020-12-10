<template>
  <div class="account-details page-layout qui-fx-ver">
    <a-modal
      width="600px"
      v-if="ruleTag"
      v-model="ruleTag"
      @ok="ruleEdit"
      title="编辑消费规则"
      :maskClosable="false"
      @cancel="ruleCancle"
      :destroyOnClose="true"
    >
      <a-row class="u-padd-10">
        <a-col :span="5" class="u-tx-r">每日消费限额：</a-col>
        <a-col :span="19">
          <a-input type="number" :min="1" v-model="detail.everydayConsume" placeholder="请输入每日消费限额" />
        </a-col>
      </a-row>
      <a-row class="u-padd-10">
        <a-col :span="5" class="u-tx-r">单次消费限额：</a-col>
        <a-col :span="19">
          <a-input type="number" :min="1" v-model="detail.singleConsume" placeholder="请输入单次消费限额" />
        </a-col>
      </a-row>
      <a-row class="u-padd-10">
        <a-col :span="5" class="u-tx-r">优惠类型：</a-col>
        <a-col :span="19">
          <a-radio-group v-model="detail.preferType" @change="rulechange">
            <a-radio value="0">无优惠</a-radio>
            <a-radio value="1">折扣</a-radio>
            <a-radio value="2">减免</a-radio>
          </a-radio-group>
        </a-col>
      </a-row>
      <a-row v-if="detail.preferType === '1'" class="u-padd-10">
        <a-col :span="5" class="u-tx-r">折扣比例：</a-col>
        <a-col :span="19">
          <a-input type="number" v-model="detail.discount" placeholder="请输入折扣比例" />
        </a-col>
      </a-row>
      <a-row v-if="detail.preferType === '2'" class="u-padd-10">
        <a-col :span="5" class="u-tx-r">减免金额：</a-col>
        <a-col :span="19">
          <a-input v-model="detail.remit" placeholder="请输入减免金额" />
        </a-col>
      </a-row>
    </a-modal>
    <a-modal
      width="600px"
      ref="modal"
      v-if="cardTag"
      v-model="cardTag"
      :title="cardTitle"
      :maskClosable="false"
      @cancel="cancle"
      :destroyOnClose="true"
    >
      <a-row class="u-padd-10">
        <a-col :span="6" class="u-tx-r">姓名：</a-col>
        <a-col :span="16">{{ detail.userName }}</a-col>
      </a-row>
      <a-row class="u-padd-10">
        <a-col :span="6" class="u-tx-r">学号/工号：</a-col>
        <a-col :span="16">{{ detail.workNo }}</a-col>
      </a-row>
      <a-row class="u-padd-10">
        <a-col :span="6" class="u-tx-r">班级/部门：</a-col>
        <a-col :span="16">{{ detail.classBoards }}</a-col>
      </a-row>
      <a-row class="u-padd-10">
        <a-col :span="6" class="u-tx-r">身份：</a-col>
        <a-col :span="16">{{ datamap(detail.userType, userTypeList) }}</a-col>
      </a-row>
      <a-row class="u-padd-10">
        <a-col :span="6" class="u-tx-r">账户状态：</a-col>
        <a-col :span="16">{{ datamap(detail.status, accountTypeList) }}</a-col>
      </a-row>
      <div v-if="tag === 0">
        <a-row class="u-padd-10">
          <a-col :span="5" class="u-tx-r">每日消费限额：</a-col>
          <a-col :span="19">
            <a-input type="number" :min="1" v-model="detail.everydayConsume" placeholder="请输入每日消费限额" />
          </a-col>
        </a-row>
        <a-row class="u-padd-10">
          <a-col :span="5" class="u-tx-r">单次消费限额：</a-col>
          <a-col :span="19">
            <a-input type="number" :min="1" v-model="detail.singleConsume" placeholder="请输入单次消费限额" />
          </a-col>
        </a-row>
        <a-row class="u-padd-10">
          <a-col :span="5" class="u-tx-r">优惠类型：</a-col>
          <a-col :span="19">
            <a-radio-group v-model="detail.preferType">
              <a-radio value="0">无优惠</a-radio>
              <a-radio value="1">折扣</a-radio>
              <a-radio value="2">减免</a-radio>
            </a-radio-group>
          </a-col>
        </a-row>
        <a-row v-if="detail.preferType === '1'" class="u-padd-10">
          <a-col :span="5" class="u-tx-r">折扣比例：</a-col>
          <a-col :span="19">
            <a-input type="number" v-model="detail.discount" placeholder="请输入折扣比例" />
          </a-col>
        </a-row>
        <a-row v-if="detail.preferType === '2'" class="u-padd-10">
          <a-col :span="5" class="u-tx-r">减免金额：</a-col>
          <a-col :span="19">
            <a-input v-model="detail.remit" placeholder="请输入减免金额" />
          </a-col>
        </a-row>
        <a-row class="u-padd-10">
          <a-col :span="5" class="u-tx-r">账户余额：</a-col>
          <a-col :span="19">{{ detail.balance }}</a-col>
        </a-row>
        <a-row class="u-padd-10">
          <a-col :span="5" class="u-tx-r">押金：</a-col>
          <a-col :span="19">{{ detail.deposit }}</a-col>
        </a-row>
      </div>
      <div v-if="tag === 1">
        <a-row class="u-padd-10" v-if="!sureTag">
          <a-col :span="4" class="u-tx-r">账户余额：</a-col>
          <a-col :span="20">{{ detail.balance }}</a-col>
        </a-row>
        <a-row class="u-padd-10" v-else>
          <a-col :span="4" class="u-tx-r">账户余额：</a-col>
          <a-col :span="20">{{ (Number(detail.balance) + Number(detail.rechargeAmount)).toFixed(2) }}</a-col>
        </a-row>
        <a-row type="flex" align="middle" class="u-padd-10" v-if="!sureTag">
          <a-col :span="4" class="u-tx-r">充值金额：</a-col>
          <a-col :span="20">
            <a-input
              @focus="current = -1"
              type="number"
              :min="1"
              v-model="detail.rechargeAmount"
              style="width: 300px"
              placeholder="请输入充值金额"
            />
            <span class="u-mar-l">到账：{{ detail.rechargeAmount }}元</span>
          </a-col>
        </a-row>
        <a-row class="u-padd-10" v-if="sureTag">
          <a-col :span="4" class="u-tx-r">充值金额：</a-col>
          <a-col :span="20">{{ detail.rechargeAmount }}</a-col>
        </a-row>
        <a-row class="u-padd-10" v-if="sureTag">
          <a-col :span="4" class="u-tx-r">充值时间：</a-col>
          <a-col :span="20">{{ new Date() | getDate(1) }}</a-col>
        </a-row>
        <a-row v-if="!sureTag">
          <a-col :span="4" class="u-tx-r"></a-col>
          <a-col :span="20">
            <ul class="money-num u-fx">
              <li
                @click="changeMoney(item, index)"
                :class="{ act: current === index }"
                v-for="(item, index) in moneyTotal"
                :key="index"
              >
                {{ item }}
              </li>
            </ul>
          </a-col>
        </a-row>
      </div>
      <div v-if="tag === 2">
        <a-row class="u-padd-10" v-if="!sureTag">
          <a-col :span="4" class="u-tx-r">账户余额：</a-col>
          <a-col :span="20">{{ detail.balance }}</a-col>
        </a-row>
        <a-row class="u-padd-10" v-else>
          <a-col :span="4" class="u-tx-r">账户余额：</a-col>
          <a-col :span="20">{{ (Number(detail.balance) + Number(detail.subsidyAmount)).toFixed(2) }}</a-col>
        </a-row>
        <a-row class="u-padd-10" v-if="!sureTag">
          <a-col :span="4" class="u-tx-r">补助金额：</a-col>
          <a-col :span="20">
            <a-input
              type="number"
              :min="1"
              @focus="current = -1"
              v-model="detail.subsidyAmount"
              placeholder="请输入补助金额"
            />
          </a-col>
        </a-row>
        <a-row class="u-padd-10" v-if="sureTag">
          <a-col :span="4" class="u-tx-r">补助金额：</a-col>
          <a-col :span="20">{{ detail.subsidyAmount }}</a-col>
        </a-row>
      </div>
      <div v-if="tag === 4">
        <a-row class="u-padd-10">
          <a-col :span="4" class="u-tx-r">账户余额：</a-col>
          <a-col :span="20">{{ detail.balance }}</a-col>
        </a-row>
        <a-row class="u-padd-10">
          <a-col :span="4" class="u-tx-r">押金：</a-col>
          <a-col :span="20">{{ detail.deposit }}</a-col>
        </a-row>
        <a-row class="u-padd-10">
          <a-col :span="5" class="u-tx-r">余额退还：</a-col>
          <a-col :span="19">
            <a-radio-group v-model="isReturnBalance">
              <a-radio value="1">退余额（可退{{ detail.canReturn }}）</a-radio>
              <a-radio value="2">不退余额</a-radio>
            </a-radio-group>
          </a-col>
        </a-row>
        <a-row class="u-padd-10">
          <a-col :span="5" class="u-tx-r">押金退还：</a-col>
          <a-col :span="19">
            <a-radio-group v-model="isReturnDeposit">
              <a-radio value="1">退押金（可退{{ detail.deposit }}）</a-radio>
              <a-radio value="2">不退押金</a-radio>
            </a-radio-group>
          </a-col>
        </a-row>
        <a-row class="u-padd-10">
          <a-col :span="4" class="u-tx-r">共计退还：</a-col>
          <a-col :span="20">{{
            parseInt(isReturnBalance === '1' ? detail.canReturn : 0) +
              parseInt(isReturnDeposit === '1' ? detail.deposit : 0)
          }}</a-col>
        </a-row>
      </div>
      <div v-if="tag === 3 || tag === 5 || tag === 6">
        <a-row class="u-padd-10">
          <a-col :span="4" class="u-tx-r">账户余额：</a-col>
          <a-col :span="20">{{ detail.balance }}</a-col>
        </a-row>
        <a-row class="u-padd-10">
          <a-col :span="4" class="u-tx-r">押金：</a-col>
          <a-col :span="20">{{ detail.deposit }}</a-col>
        </a-row>
      </div>
      <a-row class="u-padd-10" v-if="tag !== 0 && tag !== 1 && tag !== 6">
        <a-col :span="4" class="u-tx-r">备注：</a-col>
        <a-col :span="20">
          <a-textarea v-model="recordRemark" placeholder="请输入备注" allow-clear />
        </a-col>
      </a-row>
      <a-row class="u-padd-10" v-if="tipMsg">
        <a-col :span="0" class="u-tx-r"></a-col>
        <a-col :span="24">
          <a-alert :message="tipMsg" banner />
        </a-col>
      </a-row>
      <template slot="footer" v-if="!sureTag && needSure">
        <a-button key="submit" type="primary" @click="submit">{{ btnText }}</a-button>
      </template>
      <template slot="footer" v-if="sureTag && needSure">
        <a-button key="back" @click="cancle">撤销</a-button>
        <a-button key="submit" type="primary" :loading="loading" @click="submitForm">关闭({{ sureTime }}S)</a-button>
      </template>
      <template slot="footer" v-if="!needSure">
        <a-button key="submit" type="primary" @click="submitForm">{{ btnText }}</a-button>
      </template>
    </a-modal>
    <detail-show :photo-src="detail.photoUrl" :detail-info="detailInfo" :title="detailTitle">
      <div>
        <a-button @click="showCard(1)" v-if="detail.status === '1'" class="add-btn">充值</a-button>
        <a-button @click="showCard(2)" v-if="detail.status === '1'" class="export-btn">补助</a-button>
        <a-button @click="showCard(3)" v-if="detail.status === '1'" class="export-all-btn">冻结</a-button>
        <a-button @click="showCard(4)" v-if="detail.status === '1'" class="del-btn">余额清零</a-button>
        <a-button @click="showCard(5)" v-if="detail.status === '1'" class="detail-action-btn">销户</a-button>
        <a-button @click="showCard(6)" v-if="detail.status === '2'" class="add-btn">解冻</a-button>
        <a-button @click="showCard(0)" v-if="detail.status === '3'" class="add-btn">开户</a-button>
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
                <a-col class="mar-b10 qui-fx-jc" :span="8">状态 : {{ datamap(detail.status, accountTypeList) }}</a-col>
                <a-col class="mar-b10 qui-fx-jc" :span="8">开户时间 : {{ detail.createTime }}</a-col>
                <a-col class="mar-b10 qui-fx-jc" :span="8">押金 : {{ detail.deposit }}</a-col>
              </a-row>
            </div>
          </a-col>
        </a-row>
      </div>
    </crad>
    <crad class="crad">
      <div slot="title" class="u-fx-ac u-fx-jsb">
        <div>消费规则</div>
        <div>
          <a-button @click="ruleTag = true" class="add-btn" v-if="detail.cardStatus !== '0'">编辑</a-button>
        </div>
      </div>
      <div slot="content">
        <a-row class="qui-fx-jsa page-layout qui-fx-ac padd-t10">
          <a-col :span="2" class="padd-t10"></a-col>
          <a-col :span="20" class="padd-t10">
            <div class="qui-fx-ver">
              <a-row class="padd-l10">
                <a-col class="mar-b10 qui-fx-jc" :span="8">每日消费限额 : {{ detail.everydayConsume }}</a-col>
                <a-col class="mar-b10 qui-fx-jc" :span="8">单次消费限额 : {{ detail.singleConsume }}</a-col>
                <a-col
                  class="mar-b10 qui-fx-jc"
                  :span="8"
                >优惠 :
                  {{ detail.preferType === '2' ? '减免' : detail.preferType === '1' ? '折扣' : '无优惠' }}
                  {{
                    detail.preferType === '2'
                      ? detail.consumeRule.remit
                      : detail.preferType === '1'
                        ? detail.discount + '折'
                        : ''
                  }}
                </a-col>
              </a-row>
            </div>
          </a-col>
        </a-row>
      </div>
    </crad>
    <crad class="crad">
      <div slot="title">家长信息</div>
      <div slot="content">
        <table-list :columns="columns" :table-list="detail.parentList || []"></table-list>
      </div>
    </crad>
  </div>
</template>
<script>
import ShowDialog from '@c/ShowDialog'
import DetailShow from '@c/DetailShow'
import Tools from '@u/tools'
import { mapState, mapActions } from 'vuex'
import crad from '../../component/card'
import TableList from '@c/TableList'
import md5 from 'js-md5'
const columns = [
  {
    title: '序号',
    width: '100',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '姓名',
    dataIndex: 'parentName'
  },
  {
    title: '手机号',
    dataIndex: 'mobile'
  },
  {
    title: '家属关系',
    dataIndex: 'relationship',
    customRender: (text) => {
      return Tools.relationship(text)
    }
  }
]
export default {
  name: 'AccountDetails',
  components: {
    TableList,
    crad,
    DetailShow,
    ShowDialog
  },
  data() {
    return {
      detailTitle: '基本信息',
      detailInfo: [],
      userTypeList: [],
      accountTypeList: [],
      detail: {},
      columns,
      cardTag: false,
      ruleTag: false,
      recordRemark: '',
      tipMsg: '',
      sureTag: false,
      sureTime: 10,
      loading: false,
      cardTitle: '',
      btnText: '确定',
      current: -1,
      moneyTotal: [50, 100, 200, 500],
      totalMoney: 0,
      isReturnBalance: '1',
      isReturnDeposit: '1',
      needSure: true,
      actionType: ['开户', '充值', '补助', '冻结', '余额清零', '销户', '解冻'],
      tag: 0 // 操作类别 0:开户，1:充值，2:补助，3 :冻结，4：余额清零，5：销户,6:解冻
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  async mounted() {
    await this._showDetail()
    console.log(this.detail)
    this.userTypeList = JSON.parse(window.localStorage.getItem('user_type'))
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
  },
  methods: {
    ...mapActions('home', [
      'getAccountDetail',
      'editAccount',
      'addOpenAccount',
      'addRecharge',
      'accountSubsidy',
      'accountFrozen',
      'accountThaw',
      'accountClear',
      'accountCancel',
      'getReturnBalance'
    ]),
    datamap(data, list) {
      return list.filter((ele) => ele.key === data).length > 0 ? list.filter((ele) => ele.key === data)[0].val : ''
    },
    async _showDetail() {
      const res = await this.getAccountDetail(this.$route.query.id)
      this.detail = res.data
    },
    /**
     * @description 账户操作 包括 0:开户，1:充值，2:补助，3 :冻结，4：余额清零，5：销户,6:解冻
     */
    async showCard(tag) {
      if (tag === 0) {
        this.actionFun = 'addOpenAccount'
        this.needSure = false
        this.tipMsg = ''
      } else if (tag === 1) {
        this.needSure = true
        this.actionFun = 'addRecharge'
        this.tipMsg = '请确认核对收到一致的现金金额'
      } else if (tag === 2) {
        this.needSure = true
        this.actionFun = 'accountSubsidy'
        this.tipMsg = '补助金额将直接发放到用户账户中，请核实操作'
      } else if (tag === 3) {
        this.needSure = false
        this.actionFun = 'accountFrozen'
        this.tipMsg = '冻结后，账户资金将无法使用'
      } else if (tag === 4) {
        await this._getReturnBalance()
        if (this.detail.balance === 0 && this.detail.deposit === 0) {
          this.$message.warning('账户余额和押金已清零')
          return
        }
        this.needSure = false
        this.actionFun = 'accountClear'
        this.tipMsg = '清除账户余额及押金'
        this._getReturnBalance()
      } else if (tag === 5) {
        this.needSure = false
        this.actionFun = 'accountCancel'
        this.tipMsg = '请先确认账户余额已清零'
      } else if (tag === 6) {
        this.needSure = false
        this.actionFun = 'accountThaw'
        this.tipMsg = ''
      }
      this.cardTag = true
      this.cardTitle = this.actionType[tag]
      this.btnText = '确定' + this.actionType[tag]
      this.tag = tag
    },
    /**
     * @description 获取可退余额
     */
    async _getReturnBalance() {
      const res = await this.getReturnBalance(this.detail.id)
      this.detail.canReturn = res.data
    },
    /**
     * @description 手动切换金额
     */
    changeMoney(money, index) {
      this.detail.rechargeAmount = money
      this.current = index
    },
    /**
     * @description 提交充值
     */
    async submit() {
      if (this.tag === 1 && (!this.detail.rechargeAmount || Number(this.detail.rechargeAmount) <= 0)) {
        this.$message.warning('请输入有效的充值金额')
        return
      }
      if (this.tag === 2 && (!this.detail.subsidyAmount || Number(this.detail.subsidyAmount) <= 0)) {
        this.$message.warning('请输入有效的补助金额')
        return
      }
      if ((this.tag === 2 || this.tag === 3) && this.recordRemark === '') {
        this.$message.warning('请输入备注')
        return
      }
      if (this.tag === 1) {
        this.tipMsg = '请确认核对收到一致的现金金额'
      } else if (this.tag === 2) {
        this.tipMsg = '请确认本次补助发放是否无误，可在10秒内撤销本次补助发放操作'
      }
      this.sureTag = true
      this.setInterval = setInterval(() => {
        if (this.sureTime === 0) {
          this.submitForm()
        } else {
          this.sureTime--
        }
      }, 1000)
    },
    /**
     * @description 撤销
     */
    cancle() {
      if (this.setInterval) {
        clearInterval(this.setInterval)
      }
      if (this.tag === 1) {
        this.tipMsg = '请确认本次充值是否无误，可在10秒内撤销本次充值操作'
      } else if (this.tag === 2) {
        this.tipMsg = '补助金额将直接发放到用户账户中，请核实操作'
      }
      this.sureTime = 10
      this.recordRemark = ''
      this.sureTag = false
    },
    /**
     * @description 确认提交
     */
    async submitForm() {
      if (this.setInterval) {
        clearInterval(this.setInterval)
        this.sureTime = 10
      }
      if (this.tag === 5 && (parseInt(this.detail.balance) !== 0 || parseInt(this.detail.deposit) !== 0)) {
        this.$message.warning('请先完成余额清零操作')
        return
      }
      if ((this.tag === 3 || this.tag === 5 || this.tag === 4) && this.recordRemark === '') {
        this.$message.warning('请输入备注')
        return
      }
      try {
        this.loading = true
        let req = {
          ...this.detail
        }
        if (this.tag === 2 || this.tag === 3 || this.tag === 4) {
          req.remark = this.recordRemark
        }
        if (this.tag === 4) {
          req.isReturnBalance = this.isReturnBalance
          req.isReturnDeposit = this.isReturnDeposit
        }
        if (this.tag === 1 || this.tag === 2 || this.tag === 4) {
          req = {
            id: this.detail.id,
            isReturnBalance: this.detail.isReturnBalance || undefined,
            isReturnDeposit: this.detail.isReturnDeposit || undefined,
            rechargeAmount: this.detail.rechargeAmount || undefined,
            remark: this.recordRemark || undefined,
            returnBalance: this.detail.returnBalance || undefined,
            returnDeposit: this.detail.returnDeposit || undefined,
            subsidyAmount: this.detail.subsidyAmount || undefined,
            timeStamp: parseInt(new Date().getTime() / 1000),
            key: 'M86l522AV6q613Ii4W6u8K48uW8vM1N6bFgyv769220MdYe9u37N4y7rI5mQ'
          }
          req.sign = this.getSign(req)
          req.key = undefined
        }
        await this[this.actionFun](req)
        this.$message.success(`${this.cardTitle}成功`)
        this.$tools.goNext(() => {
          this.recordRemark = ''
          this.sureTag = false
          this.cardTag = false
          this.loading = false
          this._showDetail()
        })
      } catch (err) {
        this.loading = false
      }
    },
    // 生成签名
    getSign(params) {
      const arr = []
      for (const i in params) {
        if (params[i]) {
          arr.push(i + '=' + params[i])
        }
      }
      const urlStr = arr.join('&')
      return md5(urlStr).toUpperCase()
    },
    /**
     * @description 编辑消费规则
     */
    rulechange() {
      this.detail.remit = ''
      this.detail.discount = ''
    },
    async ruleEdit() {
      if (!this.detail.everydayConsume || this.detail.everydayConsume < 0) {
        this.$message.warning('请输入每日消费限额')
        return
      }
      if (!this.detail.singleConsume || this.detail.singleConsume < 0) {
        this.$message.warning('请输入单次消费限额')
        return
      }
      if (this.detail.preferType === '2' && (!this.detail.remit || this.detail.remit < 0)) {
        this.$message.warning('请输入减免金额')
        return
      }
      if (this.detail.preferType === '1' && (!this.detail.discount || this.detail.discount < 0)) {
        this.$message.warning('请输入折扣比例')
        return
      }
      await this.editAccount(this.detail)
      this.$message.success('操作成功')
      this.ruleTag = false
      this.$tools.goNext(() => {
        this._showDetail()
      })
    },
    ruleCancle() {
      this._showDetail()
    }
  }
}
</script>

<style lang="less" scoped>
/deep/ #card {
  border: 1px #f5f5f5 solid;
}
.account-details {
  padding: 20px;
  .crad {
    width: 100%;
    .border {
      border: 1px #f5f5f5 solid;
    }
  }
}
.money-num {
  li {
    cursor: pointer;
    padding: 0 10px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    color: #666;
    margin-left: 8px;
    border: 1px #eee solid;
    &.act {
      background: @u-type-primary;
      color: #fff;
    }
  }
}
</style>
