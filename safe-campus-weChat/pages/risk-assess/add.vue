<template>
  <view class="add">
    <u-select v-model="siteTag" :list="siteList" @confirm="confirm"></u-select>
    <scroll-view scroll-y="true" :class="state === '2' ? 'scroll-h' : 'scroll'">
      <view class="u-type-white-bg">
        <view class="detail u-fx-ver u-padd">
          <view class="u-fx-f1">
            <view class="u-line2">项目名称：{{ obj.name }} </view>
            <view class="u-mar-t20 u-line2">检查对象：{{ obj.checkObject }} </view>
            <view class="u-mar-t20 u-line2">潜在风险：{{ obj.riskContent }} </view>
            <view class="u-mar-t20 u-line2">事故类型：{{ obj.accidentType }} </view>
          </view>
        </view>
      </view>
      <view class="u-fx-ac u-padd-l20 u-padd-t10 u-padd-b10 u-font-1">
        <view class="left-tip u-mar-r20"></view>
        <view> 风险评价（{{obj.methodCode === '1' ? 'LEC' : 'LS'}}）</view>
      </view>
      <view class="u-type-white-bg">
        <view class="u-type-white-bg">
          <view class="u-fx-ac u-bd-b u-padd u-padd-l40" v-if="obj.methodCode === '1'">
            <view class="tip">L(可能性):</view>
            <view @click="choose('lList','lValue','lLabel')" class="u-fx-f1 u-fx-je u-content-color u-mar-l20">
              <text class="u-light-color" v-if="!lValue">请选择</text>
              <view>{{lLabel}}</view>
            </view>
            <view class="rit-icon"></view>
          </view>
          <view class="u-fx-ac u-bd-b u-padd u-padd-l40" v-if="obj.methodCode === '1'">
            <view class="tip">E(频繁程度):</view>
            <view @click="choose('eList','eValue','eLabel')" class="u-fx-f1 u-fx-je u-content-color u-mar-l20">
              <text class="u-light-color" v-if="!eValue">请选择</text>
              <view>{{eLabel}}</view>
            </view>
            <view class="rit-icon"></view>
          </view>
          <view class="u-fx-ac u-bd-b u-padd u-padd-l40" v-if="obj.methodCode === '1'">
            <view class="tip">C(严重性):</view>
            <view @click="choose('cList','cValue','cLabel')" class="u-fx-f1 u-fx-je u-content-color u-mar-l20">
              <text class="u-light-color" v-if="!cValue">请选择</text>
              <view>{{cLabel}}</view>
            </view>
            <view class="rit-icon"></view>
          </view>
        </view>
        <view>
          <view class="u-fx-ac u-bd-b u-padd u-padd-l40" v-if="obj.methodCode === '2'">
            <view class="tip">L(可能性):</view>
            <view @click="choose('lsList', 'lslValue','lslLabel')" class="u-fx-f1 u-fx-je u-content-color u-mar-l20">
              <text class="u-light-color" v-if="!lslValue">请选择</text>
              <view>{{lslLabel}}</view>
            </view>
            <view class="rit-icon"></view>
          </view>
          <view class="u-fx-ac u-bd-b u-padd u-padd-l40" v-if="obj.methodCode === '2'">
            <view class="tip">S(严重性):</view>
            <view @click="choose('sList','sValue','sLabel')" class="u-fx-f1 u-fx-je u-content-color u-mar-l20">
              <text class="u-light-color" v-if="!sValue">请选择</text>
              <view>{{sLabel}}</view>
            </view>
            <view class="rit-icon"></view>
          </view>
        </view>
        <view class="u-fx-jsb u-padd">
          <view class="u-fx-f1 u-tx-c u-bd-r"> 
            <text class="u-padd-20"> 风险值：{{ riskInfo.grade }}</text>
          </view>
          <view class="u-fx-f1 u-bd-r u-tx-c"> 
            <text class="u-padd-20"> 风险等级：{{ riskInfo.level }}</text>
          </view>
          <view class="u-fx-f1 u-tx-c"> 
            <text class="u-padd-20"> 安全色：{{ riskInfo.color }}</text>
          </view>
        </view>
      </view>
      <view class="u-type-white-bg">
        <view class="u-mar-t20 u-fx-ac u-bd-b u-padd u-padd-l40">
          <view class="tip">管控层级:</view>
          <view @click="choose('controlList','controlLevel','controlListLabel')" class="u-fx-f1 u-fx-je u-content-color u-mar-l20">
            <text class="u-light-color" v-if="!formData.controlLevel">请选择</text>
            <view>{{formData.controlListLabel}}</view>
          </view>
          <view class="rit-icon"></view>
        </view>
        <view class="u-fx-ac u-bd-b u-padd u-padd-l40">
          <view class="tip">责任岗位:</view>
          <view @click="choose('postList','responsibilityPost','responsibilityPost')" class="u-fx-f1 u-fx-je u-content-color u-mar-l20">
            <text class="u-light-color" v-if="!formData.responsibilityPost">请选择</text>
            <view>{{formData.responsibilityPost}}</view>
          </view>
          <view class="rit-icon"></view>
        </view>
        <view class="u-fx-ac u-bd-b u-padd u-padd-l40">
          <view class="tip">责任部门:</view>
          <view @click="choose('section','responsibilityDept','responsibilityDept')" class="u-fx-f1 u-fx-je u-content-color u-mar-l20">
            <text class="u-light-color" v-if="!formData.responsibilityDept">请选择</text>
            <view>{{formData.responsibilityDept}}</view>
          </view>
          <view class="rit-icon"></view>
        </view>
        <view class="u-fx-ac u-bd-b u-padd u-padd-l40">
          <view class="tip">责任人:</view>
          <view @click="choose('responsibilityUserName','responsibilityUserCode','responsibilityUserName')" class="u-fx-f1 u-fx-je u-content-color u-mar-l20">
            <text class="u-light-color" v-if="!formData.responsibilityUserCode">请选择</text>
            <view>{{formData.responsibilityUserName}}</view>
          </view>
          <view class="rit-icon"></view>
        </view>
        <view class="u-fx-ac u-bd-b u-padd">
          <view>电话: {{formData.telephone}}</view>
        </view>
      </view>
      <view class="u-fx-ac u-padd-l20 u-padd-t10 u-padd-b10 u-font-1">
        <view class="left-tip u-mar-r20"></view>
        <view>建议措施</view>
      </view>
      <view class="u-type-white-bg">
        <view class="u-fx-ac u-bd-b u-padd-20">
          <view>工程技术：</view>
          <view class="u-fx-f1 u-fx-je u-light-color u-tx-r">
            <input class="u-fx-f1 u-font-01 u-main-color" :disabled="state === '2'" v-model="formData.scientificMeasures" placeholder="请输入"/>
          </view>
        </view>
        <view class="u-fx-ac u-bd-b u-padd-20">
          <view>管理措施：</view>
          <view class="u-fx-f1 u-fx-je u-light-color u-tx-r">
            <input class="u-fx-f1 u-font-01 u-main-color" :disabled="state === '2'" v-model="formData.manageMeasures" placeholder="请输入"/>
          </view>
        </view>
        <view class="u-fx-ac u-bd-b u-padd-20">
          <view>培训教育：</view>
          <view class="u-fx-f1 u-fx-je u-light-color u-tx-r">
            <input class="u-fx-f1 u-font-01 u-main-color" :disabled="state === '2'" v-model="formData.trainingMeasures" placeholder="请输入"/>
          </view>
        </view>
        <view class="u-fx-ac u-bd-b u-padd-20">
          <view>个体防护：</view>
          <view class="u-fx-f1 u-fx-je u-light-color u-tx-r">
            <input class="u-fx-f1 u-font-01 u-main-color" :disabled="state === '2'" v-model="formData.protectiveMeasures" placeholder="请输入"/>
          </view>
        </view>
        <view class="u-fx-ac u-bd-b u-padd-20">
          <view>应急处置：</view>
          <view class="u-fx-f1 u-fx-je u-light-color u-tx-r">
            <input class="u-fx-f1 u-font-01 u-main-color" :disabled="state === '2'" v-model="formData.emergencyMeasure" placeholder="请输入"/>
          </view>
        </view>
      </view>
      <view class="u-fx-ac u-padd-l20 u-padd-t10 u-padd-b10 u-font-1">
        <view class="left-tip u-mar-r20"></view>
        <view>警示标识</view>
      </view>
      <view class="u-fx u-type-white-bg u-padd-l40 u-padd-t20 u-padd-b20 u-padd-r20">
        <view class="u-fx-ac-jc an-img-add u-padd-b20"  v-if="state === '1'">
          <view class="add-font" @click="_riskAssessAsign">+</view>
          <view class="u-font-01">添加标识</view>
        </view>
        <image class="sign u-mar-r10 u-mar-t10" v-for="(list,index) in warnings" :key="index" :src="list.url" alt="">
      </view>
      <view class="u-fx-ac u-padd-l20 u-padd-t10 u-padd-b10 u-font-1">
        <view class="left-tip u-mar-r20"></view>
        <view>剩余风险评价（{{obj.methodCode === '1' ? 'LEC' : 'LS'}}）</view>
      </view>
      <view class="u-type-white-bg">
        <view class="u-type-white-bg">
          <view class="u-fx-ac u-bd-b u-padd u-padd-l40" v-if="obj.methodCode === '1'">
            <view class="tip">L(可能性):</view>
            <view @click="choose('lList','remainingLValue','remainingLLabel')" class="u-fx-f1 u-fx-je u-content-color u-mar-l20">
              <text class="u-light-color" v-if="!remainingLValue">请选择</text>
              <view>{{remainingLLabel}}</view>
            </view>
            <view class="rit-icon"></view>
          </view>
          <view class="u-fx-ac u-bd-b u-padd u-padd-l40" v-if="obj.methodCode === '1'">
            <view class="tip">E(频繁程度):</view>
            <view @click="choose('eList','remainingEValue','remainingELabel')" class="u-fx-f1 u-fx-je u-content-color u-mar-l20">
              <text class="u-light-color" v-if="!remainingEValue">请选择</text>
              <view>{{remainingELabel}}</view>
            </view>
            <view class="rit-icon"></view>
          </view>
          <view class="u-fx-ac u-bd-b u-padd u-padd-l40" v-if="obj.methodCode === '1'">
            <view class="tip">C(严重性):</view>
            <view @click="choose('cList','remainingCValue','remainingCLabel')" class="u-fx-f1 u-fx-je u-content-color u-mar-l20">
              <text class="u-light-color" v-if="!remainingCValue">请选择</text>
              <view>{{remainingCLabel}}</view>
            </view>
            <view class="rit-icon"></view>
          </view>
        </view>
        <view>
          <view class="u-fx-ac u-bd-b u-padd u-padd-l40" v-if="obj.methodCode === '2'">
            <view class="tip">L(可能性):</view>
            <view @click="choose('lsList','remainingLValue','remainingLslLabel')" class="u-fx-f1 u-fx-je u-content-color u-mar-l20">
              <text class="u-light-color" v-if="!remainingLValue">请选择</text>
              <view>{{remainingLslLabel}}</view>
            </view>
            <view class="rit-icon"></view>
          </view>
          <view class="u-fx-ac u-bd-b u-padd u-padd-l40" v-if="obj.methodCode === '2'">
            <view class="tip">S(严重性):</view>
            <view @click="choose('sList','remainingSValue','remainingSLabel')" class="u-fx-f1 u-fx-je u-content-color u-mar-l20">
              <text class="u-light-color" v-if="!remainingSValue">请选择</text>
              <view>{{remainingSLabel}}</view>
            </view>
            <view class="rit-icon"></view>
          </view>
        </view>
        <view class="u-fx-jsb u-padd">
          <view class="u-fx-f1 u-tx-c u-bd-r"> 
            <text class="u-padd-20"> 风险值：{{ remainInfo.grade }}</text>
          </view>
          <view class="u-fx-f1 u-bd-r u-tx-c"> 
            <text class="u-padd-20"> 风险等级：{{ remainInfo.level }}</text>
          </view>
          <view class="u-fx-f1 u-tx-c"> 
            <text class="u-padd-20"> 安全色：{{ remainInfo.color }}</text>
          </view>
        </view>
      </view>
    </scroll-view>
    <view class="footer-btn u-fx-ac" v-if="state === '1'">
      <u-button
        type="primary"
        class="u-fx-f1 u-mar-l u-mar-r u-type-primary-dark-bg"
        @click="submit"
        >提交</u-button
      >
    </view>
    <view>
		  <u-popup mode="bottom" v-model="show">
        <view class="content">
          <view class="u-fx-jsb">
            <view class="u-light-color">取消</view>
            <view class="u-type-primary" @click="ok">确定</view>
          </view>
          <scroll-view scroll-y="true" class="scroll-w">
            <view>
              <u-tabs :list="addData.list" :is-scroll="false" :current="current" @change="tabChange"></u-tabs>
              <view class="u-fx-wp" v-if="allSignList[current]">
                <view class="img-box u-mar-r10 u-mar-b10" v-for="(list,index) in allSignList[current].signList" :key="index" @click="chooseSign(list)">
                  <image :src="list.url" alt="">
                  <view :class="['check-box', {'check' : list.check }]"></view>
                </view>
              </view>
            </view>
          </scroll-view>
        </view>
      </u-popup>
    </view>
  </view>
</template>
<script>
import validateForm from '@u/validate'
import { actions, store, setStore } from "./store/index"
import eventBus from "@u/eventBus"
import addData from "./assets/add.js"
import noData from "@/components/no-data/no-data.vue"
	const yzForm = {
		controlLevel: '请选择管控层级',
		responsibilityPost: '请选择责任岗位',
		responsibilityDept: '请选择责任部门',
		responsibilityUserCode: '请选择负责人'
  }
  const lecForm = {
		lLabel: '请进行风险评价',
		eLabel: '请进行风险评价',
		cLabel: '请进行风险评价',
		remainingLValue: '请进行剩余风险评价',
		remainingEValue: '请进行剩余风险评价',
    remainingCValue: '请进行剩余风险评价'
  }
  const lsForm = {
		lslValue: '请进行风险评价',
		sValue: '请进行风险评价',
		remainingLValue: '请进行剩余风险评价',
		remainingSValue: '请进行剩余风险评价'
	}
export default {
  components: {
    noData,
    validateForm
  },
  data() {
    return {
      yzForm,
      addData,
      siteTag: false,
      siteList: [],
      formData: {
        lLabel: '',
        eLabel: '',
        cLabel: '',
        remainingLValue: '',
        remainingEValue: '',
        remainingCValue: '',
        lslValue: '',
        sValue: '',
        remainingLValue: '',
        remainingSValue: '',
        controlLevel: '',
        responsibilityPost: '',
        responsibilityDept: '',
        responsibilityUserCode: ''
      },
      currentValue: '',
      currentLabel: '',
      detailId: '',
      sectionList: [],
      userList: [],
      show: false,
      current: 0,
      allSignList: [],
      warnings: [],
      obj: {},
      lValue: '',
      cValue: '',
      eValue: '',
      sValue: '',
      lslValue: '',
      remainingCValue: '',
      remainingEValue: '',
      remainingLValue: '',
      remainingSValue: '',
      remainingLslValue: '',
      lLabel: '',
      cLabel: '',
      eLabel: '',
      sLabel: '',
      lslLabel: '',
      remainingCLabel: '',
      remainingLslLabel: '',
      remainingELabel: '',
      remainingLLabel: '',
      remainingSLabel: '',
      riskInfo: {},
      remainInfo: {},
      state: ''
    };
  },
   watch: {
    lValue(newVal, oldVal) {
      if (newVal !== oldVal) {
        this._lecRisk(0)
      }
    },
    cValue(newVal, oldVal) {
      if (newVal !== oldVal) {
        this._lecRisk(0)
      }
    },
    eValue(newVal, oldVal) {
      if (newVal !== oldVal) {
        this._lecRisk(0)
      }
    },
    sValue(newVal, oldVal) {
      if (newVal !== oldVal) {
        this._lsRisk(0)
      }
    },
    lslValue(newVal, oldVal) {
      if (newVal !== oldVal) {
        this._lsRisk(0)
      }
    },
    remainingCValue(newVal, oldVal) {
      if (newVal !== oldVal) {
        this._lecRisk(1)
      }
    },
    remainingEValue(newVal, oldVal) {
      if (newVal !== oldVal) {
        this._lecRisk(1)
      }
    },
    remainingLValue(newVal, oldVal) {
      if (newVal !== oldVal) {
        this._lecRisk(1)
      }
    },
    remainingLslValue(newVal, oldVal) {
      if (newVal !== oldVal) {
        this._lsRisk(1)
      }
    },
    remainingSValue(newVal, oldVal) {
      if (newVal !== oldVal) {
        this._lsRisk(1)
      }
    }
  },
  mounted() {
    this.detailId = this.$tools.getQuery().get("id")
    this.state = this.$tools.getQuery().get("state")
    this.obj = JSON.parse(this.$tools.getQuery().get("req"))
    this._getOrgBySchool()
    if (this.state === '2') {
      this.riskAssessDetail_()
    }
  },
  methods: {
    // 获取学校信息
    async _getOrgBySchool () {
      const res = await actions.getOrgBySchool(store.userInfo.schoolCode)
      this.sectionList = res.data.orgChilds.map(el=>{
        return {
          ...el,
          label: el.name,
          value: el.code
        }
      })
    },
    // 获取所有老师
    async _getTeacherList () {
      const req = {
        page: 1,
        size: 9999,
        schoolCode: store.userInfo.schoolCode,
        orgCode: this.formData.responsibilityDept
      }
      const res = await actions.getTeacherList(req)
      this.userList = res.data.list.map(el=>{
        return {
          ...el,
          label: el.userName,
          value: el.userCode
        }
      })
    },
    // 根据id查评估详情
    async riskAssessDetail_() {
      const res = await actions.riskAssessDetail(this.detailId)
      this.formData = res.data
      this.warnings = res.data.signs.map(el => {
        return {
          url: el
        }
      })
      this.lValue = res.data.lValue ? res.data.lValue : ''
      this.lLabel = res.data.lValue ? this.addData.lList[parseInt(res.data.lValue) - 1].label : ''
      this.cValue = res.data.cValue ? res.data.cValue : ''
      this.cLabel = res.data.cValue ? this.addData.cList[parseInt(res.data.cValue) - 1].label : ''
      this.eValue = res.data.eValue ? res.data.eValue : ''
      this.eLabel = res.data.eValue ? this.addData.eList[parseInt(res.data.eValue) - 1].label : ''
      this.sValue = res.data.sValue ? res.data.sValue : ''
      this.sLabel = res.data.sValue ? this.addData.sList[parseInt(res.data.sValue) - 1].label : ''
      this.lslValue = res.data.lValue ? res.data.lValue : ''
      this.lslLabel = res.data.lValue ? this.addData.lsList[parseInt(res.data.lValue) - 1].label : ''
      this.remainingCValue = res.data.remainingCValue ? res.data.remainingCValue : ''
      this.remainingCLabel = res.data.remainingCValue ? this.addData.cList[parseInt(res.data.remainingCValue) - 1].label : ''
      this.remainingEValue = res.data.remainingEValue ? res.data.remainingEValue : ''
      this.remainingELabel = res.data.remainingEValue ? this.addData.eList[parseInt(res.data.remainingEValue) - 1].label : ''
      this.remainingLValue = res.data.remainingLValue ? res.data.remainingLValue : ''
      this.remainingLLabel = res.data.remainingLValue ? this.addData.lList[parseInt(res.data.remainingLValue) - 1].label : ''
      this.remainingSValue = res.data.remainingSValue ? res.data.remainingSValue : ''
      this.remainingSLabel = res.data.remainingSValue ? this.addData.sList[parseInt(res.data.remainingSValue) - 1].label : ''
      this.remainingLslValue = res.data.remainingLValue ? res.data.remainingLValue : ''
      this.remainingLslLabel = res.data.remainingLValue ? this.addData.lsList[parseInt(res.data.remainingLValue) - 1].label : ''
      this.formData.controlListLabel = res.data.controlLevel ? this.addData.controlList[parseInt(res.data.controlLevel) - 1].label : '暂无'
      this.formData.responsibilityPost = res.data.responsibilityPost ? res.data.responsibilityPost : '暂无'
      this.formData.responsibilityDept = res.data.responsibilityDept ? res.data.responsibilityDept : '暂无'
      this.formData.responsibilityUserName = res.data.responsibilityUserName ? res.data.responsibilityUserName : '暂无'
    },
    async _riskAssessAsign () {
      const res = await actions.riskAssessAsign()
      this.allSignList = res.data.map(el => {
        return {
          signList: el.signList.map(el => {
            return {
              url: el,
              check: false
            }
          })
        }
      })
      this.show = true
    },
    chooseSign(list) {
      list.check = !list.check
    },
    ok() {
      const arr = []
      this.allSignList.forEach(el => {
        el.signList.forEach(item => {
          if (item.check) {
            arr.push(item)
          }
        })
      })
      this.show = false
      this.warnings = arr
    },
    choose(type,title,label) {
      if(this.state === '2') {
        return
      }
      this.currentValue = title
      this.currentLabel = label
      if(type === 'section'){
        this.siteList = this.sectionList
      } else if(type === 'responsibilityUserName'){
        this.siteList = this.userList
      } else {
        this.siteList = this.addData[type]
      }
      this.siteTag = true
    },
    confirm(e) {
      if (!e) {
        return;
      }
      if(this.currentLabel === 'responsibilityDept') {
        this._getTeacherList()
      }
      if(this.currentLabel === 'responsibilityUserName') {
        if(e.length !== 0) {
          this.formData.telephone = this.userList.filter(el => el.userCode === e[0].value)[0].mobile
        }
      }
      this.formData[this.currentValue] = e[0].value
      this.formData[this.currentLabel] = e[0].label
      this[this.currentValue] = e[0].value
      this[this.currentLabel] = e[0].label
    },
    tabChange(key){
      this.current = key
    },
    // 获取lec风险值
    async _lecRisk (type) {
      if (type) {
        if (this.remainingCValue && this.remainingEValue && this.remainingLValue) {
          const req = {
            cValue: this.remainingCValue,
            eValue: this.remainingEValue,
            lValue: this.remainingLValue
          }
          const res = await actions.lecRisk(req)
          this.remainInfo = res.data
        }
      } else {
        if (this.cValue && this.eValue && this.lValue) {
          const req = {
            cValue: this.cValue,
            eValue: this.eValue,
            lValue: this.lValue
          }
          const res = await actions.lecRisk(req)
          this.riskInfo = res.data
        }
      }
    },
     // 获取ls风险值
    async _lsRisk (type) {
      if (type) {
        if (this.remainingLslValue && this.remainingSValue) {
          const req = {
            lValue: this.remainingLslValue,
            sValue: this.remainingSValue
          }
          const res = await actions.lsRisk(req)
          this.remainInfo = res.data
        }
      } else {
        if (this.lslValue && this.sValue) {
          const req = {
            lValue: this.lslValue,
            sValue: this.sValue
          }
          const res = await actions.lsRisk(req)
          this.riskInfo = res.data
        }
      }
    },
    submit() {
      const form = this.obj.methodCode === '1' ? Object.assign(yzForm,lecForm) : Object.assign(yzForm,lsForm)
      this.formData.lValue = this.obj.methodCode === '1' ?  this.formData.lValue : this.formData.lslValue
      this.formData.lLabel = this.obj.methodCode === '1' ?  this.formData.lLabel : this.formData.lslLabel
      console.log('this.formData',this.obj.methodCode === '1')
      console.log('this.formData',this.formData)
      validateForm(form, this.formData, () => {
        this.formData.warnings = this.warnings.map(el => el.url)
        this.formData.id = this.detailId
        this.$tools.confirm("确定提交风险评估吗？", () => {
          actions.riskAssess(this.formData).then(res => {
            this.$tools.toast('评估成功')
            uni.setStorageSync('chooseList', [])
            this.$tools.goNext(() => {
              eventBus.$emit('getList')
              this.$tools.navTo({
                url: "./index",
                title: "风险评估",
              });
            })
          })
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.add {
  .scroll {
    height: calc(100vh - 100rpx);
    .tip::before {
      position: absolute;
      content: '*';
      color: #ff0000;
      left: 10px;
      top: 12px;
      z-index: 99;
    }
  }
  .scroll-h {
    height: calc(100vh - 10rpx);
    .tip::before {
      position: absolute;
      content: '*';
      color: #ff0000;
      left: 10px;
      top: 12px;
      z-index: 99;
    }
  }
  .item-text-area {
    height: 120rpx;
    width: 100%;
    line-height: 40rpx;
    color: $u-content-color;
  }
  .detail {
    // width: 100vw;
  }
}
.left-tip {
  width: 6rpx;
  height: 32rpx;
  background-color: #0084FF;
}
.an-img-add {
	margin-right: 10rpx;
	height: 140rpx;
	width: 140rpx;
	color:#ccc;
  background-color: #f7f7f7;
  .add-font {
    font-size: 80rpx;
  }
}
/deep/ .uni-picker-view-indicator {
  height: 200rpx!important;
}
.content {
  padding: 24rpx;
  text-align: center;
}
.scroll-w {
  height: 600rpx;
}
.img-box {
  position: relative;
  image {
    width: 107rpx;
    height: 130rpx;
  }
  .check-box {
    position: absolute;
    top: 1rpx;
    right: 3rpx;
    height: 18rpx;
    width: 18rpx;
  }
  .check{
    background: url(/mobile-img/check.png) center center;
    background-size: 100% 100%;
  }
}
 .sign {
    width: 140rpx;
    height: 140rpx;
    color: #ccc;
  }
</style>
