<template>
  <div>
    <a-modal
      width="665px"
      v-model="status"
      :footer="null"
      :maskClosable="true"
      :destroyOnClose="true"
      :confirmLoading="confirmLoading"
    >
      <div
        v-show="record.id"
        class="poster"
        :style="{'background': 'url('+posterImg+') 100% 100%'}"
      >
        <div class="top">{{ userInfo.schoolName }}</div>
        <div class="title">{{ record.description }}</div>
        <div class="content">
          <div><span class="text-bold">活动地点：</span>{{ record.placeName }}</div>
          <div><span class="text-bold">活动时间：</span>{{ record.reserveDate | gmtToDate('date') }} {{ record.startTime }}-{{ record.endTime }}</div>
          <div><span class="text-bold">活动内容：</span>{{ record.content }}</div>
        </div>
        <div class="scan qui-fx-ac-jc">
          <vue-qr
            :text="downloadData.url"
            :margin="10"
            colorDark="#f67b29"
            colorLight="#fff"
            :size="200"
          ></vue-qr>
          扫码立即加入
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script>
import posterImg from '@a/img/poster.png'
import scanImg from '@a/img/scan.png'
import { mapState, mapActions } from 'vuex'
import vueQr from 'vue-qr'
export default {
  name: 'Poster',
  components: {
    vueQr
  },
  props: {
    record: {
      type: Object,
      default: () => {
        return {}
      }
    },
    value: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    record: {
      handler(newValue, oldValue) {
        if (newValue !== oldValue) {
          this.downloadData.url = `http://canpointlive.com/mobile-protal/protal-card/#/pages/activity-booking/sign?id=${this.record.id}&schoolCode=${this.userInfo.schoolCode}`
          // this.downloadData.url = `http://canpointtest.com/mobile-protal/protal/#/pages/activity-booking/sign?id=${this.record.id}&schoolCode=${this.userInfo.schoolCode}`
          console.log(newValue)
        }
      },
      deep: true
    }
  },
  computed: {
    ...mapState('home', ['userInfo']),
    status: {
      get() {
        return this.value
      },
      set() {
        this.$emit('input', false)
      }
    }
  },
  data() {
    return {
      scanImg,
      posterImg,
      confirmLoading: false,
      appForm: {
        content: '',
        fileList: []
      },
      downloadData: {
        url: ''
      }
    }
  },
  mounted() {
  },
  methods: {
    ...mapActions('home', ['getMeetRecordById'])
  }
}
</script>

<style lang="less" scoped>
.poster {
  width: 600px;
  height: 800px;
  position: relative;
  .top {
    position: absolute;
    top: 90px;
    left: 100px;
    font-size: 16px;
    text-align: center;
    width: 400px;
  }
  .title {
    position: absolute;
    top: 120px;
    left: 100px;
    font-size: 24px;
    font-weight: bold;
    text-align: center;
    width: 400px;
  }
  .content {
    position: absolute;
    top: 200px;
    left: 110px;
    width: 380px;
    line-height: 31px;
    .text-bold{
      font-weight: bolder;
    }
  }
  .scan {
    position: absolute;
    bottom: 50px;
    margin: 0 auto;
    width: 100%;
    color: #fff;
    img {
      width: 100px;
      height: 100px;
      margin-bottom: 10px;
    }
  }
}
/deep/ .ant-modal-close-x {
  width: 38px;
  height: 38px;
  line-height: 38px;
}
/deep/ .ant-modal-body {
  padding: 32px;
}
</style>
