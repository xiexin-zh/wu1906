<template>
  <view class="add">
    <scroll-view scroll-y="true" class="scroll-h u-bg-fff">
      <view class="u-fx-ac u-bd-b u-padd">
        <view>事故名称：</view>
        <view class="u-fx-f1 u-fx-je u-tips-color">
          <input class="u-font-01 u-tx-r" v-model="addInfo.title" placeholder="请输入事故名称" />
        </view>
      </view>
      <view class="u-fx-ac u-bd-b u-padd">
        <view>事故发生地点：</view>
        <view class="u-fx-f1 u-fx-je u-tips-color">
          <input class="u-font-01 u-tx-r" v-model="addInfo.location" placeholder="请输入事故发生地点" />
        </view>
      </view>
      <view class="u-fx-ac u-bd-b u-padd">
        <view>事故发生时间：</view>
        <view class="u-fx-f1 u-fx-je" @click="startShow = true">
          <view class="uni-input u-tips-color">{{ addInfo.happenTime }}</view>
          <view class="rit-icon"></view>
        </view>
      </view>
      <view class="u-fx-ac u-bd-b u-padd" @click="check(0)">
        <view>事故分类：</view>
        <view class="u-fx-f1 u-fx-je u-tips-color">{{ addInfo.typeLabel }}</view>
        <view class="rit-icon"></view>
      </view>
      <view class="u-fx-ac u-bd-b u-padd">
        <view>事故性质：</view>
        <view class="u-fx-f1 u-fx-je u-tips-color" @click="check(1)">{{ addInfo.natureLabel }}</view>
        <view class="rit-icon"></view>
      </view>
      <view class="u-fx-ac u-bd-b u-padd">
        <view>事故等级：</view>
        <view class="u-fx-f1 u-fx-je u-tips-color" @click="check(2)">{{ addInfo.levelLabel }}</view>
        <view class="rit-icon"></view>
      </view>
      <view class="line"></view>
      <view class="u-fx-jsb u-bd-b u-padd">
        <view>事故直接经济损失：</view>
        <view class="u-fx-f1 u-fx-je u-tips-color">
          <input
            type="number"
            class="u-font-01 u-tx-r u-padd-r10"
            v-model="addInfo.financialLoss"
            placeholder="请输入事故直接经济损失"
          />元</view
        >
      </view>
      <view class="u-fx-ac u-bd-b u-padd">
        <view>死亡人数：</view>
        <view class="u-fx-f1 u-fx-je u-tips-color"
          ><input
            type="number"
            class="u-font-01 u-tx-r u-padd-r10"
            v-model="addInfo.deathNum"
            placeholder="请输入死亡人数"
          />人</view
        >
      </view>
      <view class="u-fx-ac u-bd-b u-padd">
        <view>受伤人数：</view>
        <view class="u-fx-f1 u-fx-je u-tips-color"
          ><input
            type="number"
            class="u-font-01 u-tx-r u-padd-r10"
            v-model="addInfo.injuredNum"
            placeholder="请输入受伤人数"
          />人</view
        >
      </view>
      <view class="line"></view>
      <view class="u-fx-ac u-bd-b u-padd">
        <view>事故现状：</view>
        <view class="u-fx-f1 u-fx-je col-666">
          <u-radio-group v-model="addInfo.statusName">
            <u-radio shape="circle" v-for="(item, index) in addData.stateList" :key="index" :name="item.name">
              {{ item.name }}
            </u-radio>
          </u-radio-group>
        </view>
      </view>
      <view class="u-bd-b u-padd">
        <view>事故详情：</view>
        <view class="u-fx-f1">
          <textarea class="item-text-area" v-model="addInfo.details" placeholder="请输入事故详情" />
        </view>
      </view>
      <view class="u-bd-b u-padd">
        <view>上传附图：</view>
        <view class="u-fx-f1">
          <an-upload-img total="9" v-model="addInfo.pictures" class="u-mar-t20"></an-upload-img>
        </view>
      </view>
      <view class="u-bd-b u-padd" v-if="addInfo.statusName === '处理中'">
        <view>处理信息：</view>
        <view class="u-fx-f1">
          <textarea class="item-text-area" v-model="addInfo.disposeInfo" placeholder="请输入处理信息" />
        </view>
      </view>
      <view class="u-bd-b u-padd" v-if="addInfo.statusName === '已结案'">
        <view>结案信息：</view>
        <view class="u-fx-f1">
          <textarea class="item-text-area" v-model="addInfo.finishInfo" placeholder="请输入结案信息" />
        </view>
      </view>
    </scroll-view>
    <u-select v-model="show" :list="list" @confirm="confirm"></u-select>
    <u-picker mode="time" v-model="startShow" :params="params" @confirm="startConfirm"></u-picker>
    <view class="submit-btn"><u-button type="primary" :loading="loading" @click="submit">上报事故</u-button></view>
  </view>
</template>

<script>
import eventBus from '@u/eventBus'
import anUploadImg from '@/components/an-uploadImg/an-uploadImg'
import { actions, store } from './store/index'
import addData from './assets/add'
import validateForm from '@u/validate'
const yzForm = {
  title: '请填写事故名称',
  location: '请填写事故发生地点',
  type: '请选择事故分类',
  nature: '请选择事故性质',
  level: '请选择事故等级',
  financialLoss: '请填写事故直接经济损失',
  deathNum: '请填写死亡人数',
  injuredNum: '请填写受伤人数',
  details: '请填写事故详情'
}
export default {
  components: {
    anUploadImg
  },
  data() {
    return {
      addData,
      currentRole: 0,
      addInfo: {
        title: '',
        location: '',
        type: '',
        nature: '',
        level: '',
        financialLoss: '',
        deathNum: '',
        injuredNum: '',
        details: '',
        happenTime: this.$tools.getPhoneTime(new Date(), 'noSecond'),
        typeLabel: '请选择事故分类',
        natureLabel: '请选择事故性质',
        levelLabel: '请选择事故等级',
        statusName: '新填报',
        pictures: []
      },
      startShow: false,
      params: {
        year: true,
        month: true,
        day: true,
        hour: true,
        minute: true,
        second: false
      },
      show: false,
      list: [],
      value: '1',
      selectType: 0,
      loading: false
    }
  },
  mounted() {},
  methods: {
    check(type) {
      this.selectType = type
      this.list =
        type === 0 ? this.addData.accidentType : type === 1 ? this.addData.accidentState : this.addData.accidentLevel
      this.show = true
    },
    startConfirm(params) {
      this.addInfo.happenTime = `${params.year}/${params.month}/${params.day} ${params.hour}:${params.minute}`
    },
    confirm(e) {
      if (this.selectType === 0) {
        this.addInfo.typeLabel = e[0].label
        this.addInfo.type = e[0].value
      }
      if (this.selectType === 1) {
        this.addInfo.natureLabel = e[0].label
        this.addInfo.nature = e[0].value
      }
      if (this.selectType === 2) {
        this.addInfo.levelLabel = e[0].label
        this.addInfo.level = e[0].value
      }
    },
    submit() {
      validateForm(yzForm, this.addInfo, () => {
        this.loading = true
        const pictures = this.addInfo.pictures.map((el) => {
          return el.url
        })
        if(this.addInfo.statusName === '处理中' && !this.addInfo.disposeInfo){
          this.loading = false
          this.$tools.toast('请填写处理信息')
          return false
        }
         if(this.addInfo.statusName === '已结案' && !this.addInfo.finishInfo){
          this.loading = false
          this.$tools.toast('请填写结案信息')
          return false
        }
        const req = {
          pictures: pictures,
          schoolCode: store.userInfo.schoolCode,
          schoolName: store.userInfo.schoolName,
          status: this.addInfo.statusName === '新填报' ? '1' : this.addInfo.statusName === '处理中' ? '2' : '3',
          happenTime: this.addInfo.happenTime.replace(/\//g, '-'),
          userCode: store.userInfo.userCode,
          userName: store.userInfo.userName
        }
        actions
          .addAccident({
            ...this.addInfo,
            ...req
          })
          .then((res) => {
            this.$tools.toast('操作成功')
            this.$tools.goNext(() => {
              eventBus.$emit('getList')
              this.$tools.goBack()
            })
          })
          .catch(() => {
            this.loading = false
          })
      })
    }
  }
}
</script>

<style lang="scss">
.add {
  position: relative;
  .scroll-h {
    height: calc(100vh - 100rpx);
  }
}
.item-text-area {
  height: 120rpx;
  width: 100%;
  line-height: 40rpx;
  padding-top: 15rpx;
  color: $u-content-color;
  font-size: 24rpx;
}
.line {
  height: 20rpx;
  background-color: #f4f7fc;
}
</style>
