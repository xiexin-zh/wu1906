<template>
  <view class="add">
    <u-select v-model="siteTag" :list="siteList" @confirm="confirm"></u-select>
    <scroll-view scroll-y="true" :class="type===2?'scroll-h':'scroll'">
      <view class="u-type-white-bg">
        <view class="u-fx-ac u-bd-b u-padd-20">
          <view>项目名称：</view>
          <view class="u-fx-f1 u-fx-je u-light-color u-tx-r">
            <input class="u-font-01 u-main-color" :disabled="type === 2" v-model="formData.name" placeholder="请输入项目名称" />
          </view>
        </view>
        <view class="u-fx-ac u-bd-b u-padd">
          <view>项目类型:</view>
          <view @click="choose(1)" class="u-fx-f1 u-fx-je u-content-color">
            <text v-if="!formData.typeCode">请选择</text>
            <view> {{formData.typeCode === '1' ? '设施设备及区域' : formData.typeCode === '2' ? '教育教学活动' : ''}} </view>
          </view>
          <view class="rit-icon"></view>
        </view>
        <view class="u-fx-ac u-bd-b u-padd">
          <view>评估方式:</view>
          <view @click="choose(2)" class="u-fx-f1 u-fx-je u-content-color">
            <text v-if="!formData.methodCode">请选择</text>
            <view> {{formData.methodCode === '1' ? '教学条件危险性分析评价法（LES）' : formData.methodCode === '2' ? '风险矩阵法（LS）' : ''}} </view>
          </view>
          <view class="rit-icon"></view>
        </view>
        <view class="u-bd-b u-padd-20">
          <view>备注：</view>
          <textarea v-model="formData.remark" :disabled="type === 2" class="item-text-area u-font-02 u-padd-t20"/>
        </view>
      </view>
      <view class="u-fx-ac u-bd-b u-padd u-mar-t20 u-mar-b20 u-type-white-bg">
        <view>已选择检查对象:</view>
        <view @click="check" class="u-fx-f1 u-fx-je u-content-color">
          <text class="u-light-color" v-if="classList.length === 0">查看</text>
        </view>
        <view class="rit-icon"></view>
      </view>
      <view class="u-fx-ac u-bd-b u-padd u-type-white-bg">
        <view>风险类型:</view>
        <view @click="choose(3)" class="u-fx-f1 u-fx-je u-content-color">
          <text v-if="!categoryName">请选择</text>
          <view> {{categoryName}} </view>
        </view>
        <view class="rit-icon"></view>
      </view>
      <u-checkbox-group class="approve-list u-type-white-bg u-padd-l20 u-padd-r20" :wrap="true">
        <u-checkbox 
          :disabled="type === 2"
          @change="checkboxGroup($event,item)"
          v-model="item.checked" 
          v-for="(item, i) in dataList"
          :key="i" 
          :name="item.id"
          class="u-bd-b"
        >
        <view class="detail u-fx-ver u-padd u-fx-f1">
          <view class="u-tips-color u-mar-t20"
            >检查对象：{{ item.checkObject }}
          </view>
          <view class="u-tips-color u-mar-t20"
            >潜在风险：{{ item.riskContent }}
          </view>
          <view class="u-tips-color u-mar-t20"
            >事故类型：
            <text> {{item.riskType}} </text>
          </view>
        </view>
        </u-checkbox>
      </u-checkbox-group>
    </scroll-view>
    <view class="footer-btn u-fx-ac" v-if="type !== 2">
      <u-button
        type="primary"
        class="u-fx-f1 u-mar-l u-mar-r u-type-primary-dark-bg"
        @click="submit"
        >确定</u-button
      >
    </view>
  </view>
</template>
<script>
import validateForm from '@u/validate';
import { actions, store, setStore } from "./store/index";
import eventBus from "@u/eventBus";
import tools from ".../../../utils/tools";
import noData from "@/components/no-data/no-data.vue";
const yzForm = {
  name: '请输入项目名称'
}
export default {
  components: {
    noData
  },
  data() {
    return {
      classList: [],
      siteTag: false,
      siteList: [],
      formData: {
        name: ''
      },
      current: 1,
      categoryList: [],
      dataList: [],
      chooseAllList: [],
      detailId: '',
      categoryName: '',
      categoryCode: '',
      type: ''
    };
  },
  mounted() {
    this.detailId = this.$tools.getQuery().get("id")
    this.type = parseInt(this.$tools.getQuery().get("type"))
    this.chooseAllList = uni.getStorageSync('chooseList')
    if(this.detailId){
      this.riskIdentifyDetail_()
    }
    this.riskCategory_()
    eventBus.$on("getList", () => {
      this.chooseAllList = uni.getStorageSync('chooseList')
      this.riskModelList_()
    })
  },
  methods: {
    async riskCategory_() {
      const res = await actions.riskCategory()
      this.categoryList = res.data
      this.categoryName = this.categoryList[0].categoryName
      this.categoryCode = this.categoryList[0].categoryCode
      this.formData.typeName = '设施设备及区域'
      this.formData.typeCode = '1'
      this.formData.methodName = '教学条件危险性分析评价法（LES）'
      this.formData.methodCode = '1'
      this.riskModelList_()
    },
    async riskIdentifyDetail_() {
      const res = await actions.riskIdentifyDetail(this.detailId)
      this.formData = res.data
      this.chooseAllList = res.data.targetList.map(el=>{
        return {
          ...el,
          checked: true
        }
      })
      uni.setStorageSync('chooseList', this.chooseAllList)
    },
    choose (type) {
      this.current = type
      if(type === 1){
        this.siteList = [
          {
            label: '设施设备及区域',
            value: '1'
          },
          {
            label: '教育教学活动',
            value: '2'
          }
        ]
      } else if(type === 2){
        this.siteList = [
          {
            label: '教学条件危险性分析评价法（LES）',
            value: '1'
          },
          {
            label: '风险矩阵法（LS）',
            value: '2'
          }
        ]
      } else {
        this.siteList = []
        this.categoryList.forEach(ele => {
          this.siteList.push({
            label: ele.categoryName,
            value: ele.categoryCode
          })
        })
      }
      if((this.type === 2 && type === 3) || this.type !== 2){
        this.siteTag = true 
      }
    },
    async riskModelList_() {
      const req = {
        categoryCode: this.categoryCode,
        page: 1,
        size: 9999
      }
      const res = await actions.riskModelList(req)    
      this.dataList = res.data.records.map(el => {
        if(this.chooseAllList.length > 0) {
          this.chooseAllList.forEach(item => {
          if(el.id === item.id) {
            this.$set(el, 'checked', true)
          }
        })
        }
        return el
      })
    },
    confirm(e) {
      if (!e) {
        return;
      }
      if(this.current === 1){
        this.formData.typeName = e[0].label
        this.formData.typeCode = e[0].value
      } else if(this.current === 2){
        this.formData.methodName = e[0].label
        this.formData.methodCode = e[0].value
      } else {
        this.categoryName = e[0].label
        this.categoryCode = e[0].value
        this.riskModelList_()
      }
    },
    checkboxGroup(e,record){
      if(e.value){
        this.chooseAllList.push(record)
      } else {
        const index = this.chooseAllList.findIndex(list => list.id === e.name)
        this.chooseAllList.splice(index, 1)
      }
      uni.setStorageSync('chooseList', this.chooseAllList)
    },
    check(){
      this.$tools.navTo({
        url: `./choose?type=${this.type}`,
        title: "已选择检查对象"
      });
    },
    submit() {
      validateForm(yzForm, this.formData, () => {
        if (this.chooseAllList.length === 0) {
          return this.$tools.toast('请选择检查对象')
        }
        this.$tools.confirm("确定提交风险辨识吗？", () => {
            let req = {
            ...this.formData,
            schoolCode: store.userInfo.schoolCode,
            ids: this.chooseAllList.map(el => el.id)
          }
          if(this.detailId){
              req.id = this.detailId
            actions.modifyRiskIdentify(req).then(res => {
              this.$tools.toast('操作成功')
              uni.setStorageSync('chooseList', [])
              this.$tools.goNext(() => {
                eventBus.$emit('getList')
                this.$tools.navTo({
                  url: "./index",
                  title: "风险辨识",
                });
              })
            })
          } else {
            actions.addRiskIdentify(req).then(res => {
              this.$tools.toast('操作成功')
              uni.setStorageSync('chooseList', [])
              this.$tools.goNext(() => {
                eventBus.$emit('getList')
                this.$tools.navTo({
                  url: "./index",
                  title: "风险辨识",
                });
              })
            })
          }
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
  }
  .scroll-h {
    height: calc(100vh - 10rpx);
  }
  .item-text-area {
    height: 120rpx;
    width: 100%;
    line-height: 40rpx;
    color: $u-content-color;
  }
  .approve-list {
    width: 100%;
  }
  .detail {
    width: 100vw;
  }
}
</style>
