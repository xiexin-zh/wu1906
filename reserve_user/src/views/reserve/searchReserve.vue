<template>
  <div class="searchBox">
    <div class="head">
      <Head title="预约查询" />
    </div>
    <div class="main">
      <van-tabs v-model="active" sticky color="#445C73" class="tabs" @change="changeTab">
        <van-tab title="网络预约" class="onlineReserve">
          <div class="tab1">
            <div class="reserveItem" v-for="(item) in rList" :key="item.ro_id">
              <div class="itemTop" @click="toReserveDetail(item)">
                <p class="sweepName">
                  <span class="address">{{item.organ_name}}</span>
                  <span
                    :class="item.ro_state == 0 ? 'status' :'status1'"
                  >{{item.ro_state == 0 ? '【已预约】' :'【已取消】'}}</span>
                </p>
                <p class="sweepTime">{{formatTime(item.ro_time)}}</p>
              </div>
              <div class="itemBottom">
                <p class="codeNum" @click="toReserveDetail(item)">受理号:{{item.ro_no}}</p>
                <p
                  class="codeImg"
                  @click="item.ro_state == 0 ? lookCode(item.ro_no) : showCancel"
                >查看二维码</p>
              </div>
            </div>
            <van-pagination
              v-if="rTotal > 10"
              v-model="currentPage"
              :total-items="rTotal"
              :show-page-size="limit"
              force-ellipses
            />
          </div>
        </van-tab>
        <van-tab title="代扫预约" class="onlineReserve">
          <div class="tab1">
            <div
              class="reserveItem"
              v-for="(item) in aList"
              :key="item.ao_id"
            >
              <div class="itemTop" @click="toTakeDetail(item)">
                <p class="sweepName">
                  <span class="address">{{item.organ_name}}</span>
                  <span
                    :class="item.ao_state == 0 ? 'status' : 'status1'"
                  >{{item.ao_state == 0 ? '【已预约】' : '【已取消】'}}</span>
                </p>
                <p class="sweepTime">{{formatTime(item.ao_time)}}</p>
              </div>
              <div class="itemBottom">
               <p class="codeNum" @click="toTakeDetail(item)">受理号:{{item.ao_no}}</p>
                <p
                  class="codeImg"
                  @click="item.ao_state == 0 ? lookCode(item.ao_no) : showCancel"
                >查看二维码</p>
              </div>
            </div>
            <van-pagination
              v-if="aTotal > 10"
              v-model="currentPage"
              :total-items="aTotal"
              :show-page-size="limit"
              force-ellipses
            />
          </div>
        </van-tab>
      </van-tabs>
    </div>
    <van-dialog v-model="showCode" title="二维码查看">
      <div class="codeImgBox">
        <canvas width="50" height="50" ref="qrcode" /> 
      </div>
    </van-dialog>
  </div>
</template>

<script>
import Head from "../../components/Head.vue";
import QRCode from "qrcode";
import { Toast } from "vant";
import * as ReserveAction from "../../api/reserve";
import { format } from "../../utils/transform";
export default {
  data() {
    return {
      active: 0,
      showCode: false,
      codeNumber: "12121212",
      rList: [],
      rTotal: 0,
      aList: [],
      aTotal: 0,
      limit: 10,
      currentPage: 1
    };
  },
  methods: {
    formatTime(time) {
      const date = new Date(Number(time));
      const y = date.getFullYear();
      const m = date.getMonth() + 1;
      const d = date.getDay();
      var h = date.getHours();
      var mm = date.getMinutes();
      // var s = date.getSeconds();
      if(h<10){if(h>0){h = "0"+h}else if(h==0){h = '00'}}
      if(mm<10){if(mm>0){mm = "0"+mm}else if(mm==0){ mm = '00'}}
      // if(s<10){if(s>0){s = "0"+s}else if(s==0){s = '00'}}
      return y + "-" + m + "-" + d + '  ' + h + ':' + mm ;
    },
    toReserveDetail(data) {
      let routerData = JSON.stringify(data)
      localStorage.setItem('routerData',routerData);
      this.$router.push({
        path: "reserveDetail"
      });
    },
    toTakeDetail(data) {
      let toTakeDetail = JSON.stringify(data)
      localStorage.setItem('toTakeDetail',toTakeDetail);
      this.$router.push({
        name: "takeDetail"
      });
    },
    lookCode(id) {
      this.showCode = true;
      setTimeout(() => {
        this.makeCode(id);
      }, 0);
    },
    showCancel() {
      Toast.fail("该预约已取消");
    },
    makeCode(id) {
      QRCode.toCanvas(
        this.$refs.qrcode,
        id,
        {
          width: 200
        },
        function(error) {
          if (error) console.error(error);
        }
      );
    },
    changeTab() {
      if (this.active == 0) {
        this.getRlist(0, this.limit);
      } else {
        this.getAlist(0, this.limit);
      }
    },
    async getRlist(offset, limit) {
      const res = await ReserveAction.getRlist({
        offset,
        limit
      });
      if (res.error == 0) {
        this.rList = res.data.list;
        this.rTotal = res.data.total;
      } else {
        Toast.fail(res.msg);
      }
    },
    async getAlist(offset, limit) {
      const res = await ReserveAction.getAlist({
        offset,
        limit
      });
      if (res.error == 0) {
        this.aList = res.data.list;
        this.aTotal = res.data.total;
      } else {
        Toast.fail(res.msg);
      }
    }
  },
  mounted() {
    this.getRlist();
  },
  components: {
    Head
  }
};
</script>

<style lang="scss" scoped>
.searchBox {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}
.head {
  height: 0.86rem;
}
.tabs {
  height: 0.86rem;
}
.main {
  flex: 1;
  background-color: #f7f6f9;
  height: 100%;
  padding-bottom: 0.5rem;
  box-sizing: border-box;

  .tabs {
    height: 100%;
    overflow-y: scroll;
  }

  .onlineReserve {
    height: 100%;
  }

  .tab1 {
    padding: 0.3rem;
    box-sizing: border-box;
    height: 100%;

    .reserveItem {
      height: 1.5rem;
      margin-bottom: 0.3rem;
      background-color: #fff;
      border-radius: 20px;
      display: flex;
      flex-direction: column;
      padding: 0.2rem 0.3rem;
      box-sizing: border-box;

      .itemTop,
      .itemBottom {
        flex: 1;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .sweepName {
        .address {
          font-size: 0.28rem;
          color: #030303;
        }
        .status {
          font-size: 0.22rem;
          color: #7ed321;
        }
        .status1 {
          font-size: 0.22rem;
          color: #d0021b;
        }
      }
      .sweepTime {
        font-size: 0.22rem;
        color: #9b9b9b;
      }

      .codeNum {
        font-size: 0.22rem;
        color: #445c73;
      }
      .codeImg {
        font-size: 0.22rem;
        color: #9b9b9b;
      }
    }
  }
}

.codeImgBox {
  min-height: 3.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>