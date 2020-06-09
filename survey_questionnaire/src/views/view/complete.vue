<template>
  <div class="view-layout">
    <div class="main">
      <img :class=" clientWidth > 540 ? 'headImg' : 'headImg1'" :src="require('../../../public/img/bg.png')" alt />
      <div :class=" clientWidth > 540 ? 'contemtBox' : 'contemtBox1'">
        <div class="title">{{title}}</div>
        <div class="icon">
          <img :src="require('../../../public/icon/select.png')" alt />
        </div>
        <div class="endtxt">
          <div v-html="endTxt"></div>
        </div>
        <!-- <div class="cancel">
          <el-button type="primary" class="close" @click="close">关闭</el-button>
        </div> -->
      </div>
    </div>
    <div :class=" clientWidth > 540 ? 'footer' : 'footer1' ">
      <p>悦享问卷系统</p>
      <div class="footerImg">
        <img :src="require('../../../public/img/top.png')" alt />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
/* eslint-disable */
import { Component, Vue } from "vue-property-decorator";
import * as NaireAction from "@/api/naire";

@Component
export default class CompleteComp extends Vue {
  private endTxt: string = "";
  private title: string = "";
  private clientWidth: number = 0;

  close() {
    // window.close();
    var userAgent = navigator.userAgent;
    if (
      userAgent.indexOf("Firefox") != -1 ||
      userAgent.indexOf("Chrome") != -1
    ) {
      window.location.href = "";
      window.close();
    } else if (
      userAgent.indexOf("Android") > -1 ||
      userAgent.indexOf("Linux") > -1
    ) {
      window.opener = null;
      window.open("", "_self");
      window.close();
    }else if(navigator.userAgent.toLowerCase().indexOf('micromessenger') > -1){
      document.addEventListener('WeixinJSBridgeReady', function(){ WeixinJSBridge.call('closeWindow'); }, false)
    } else {
      window.opener = null;
      window.open("", "_self");
      window.close();
    }
  }

  mounted() {
    const endTxt = localStorage.getItem("endTxt") || "";
    const title = localStorage.getItem("title") || "";
    this.endTxt = endTxt;
    this.title = title;
    this.clientWidth = document.body.clientWidth;
  }
}
</script>

<style lang="scss" scoped>
.view-layout {
  width: 100%;
  height: 100%;
  background-color: #f8f9fd;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;

  .main {
    flex: 1;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: flex-start;

    .headImg {
      width: 940px;
      height: 300px;
    }

    .headImg1 {
      max-width:400px;
      height: 190px;
    }

    .contemtBox1 {
      max-width: 700px;
      min-height: 450px;
      position: absolute;
      top: 100px;
      background-color: #fff;
      // padding: 0 70px;
    }
    .contemtBox {
      width: 700px;
      height: 450px;
      position: absolute;
      top: 100px;
      background-color: #fff;
      padding: 0 70px;
    }
  }
  .endtxt {
    padding: 10px 10px;
  }

  .footer {
    width: 60%;
    height: 100px;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;

    p {
      flex: 1;
      font-size: 12px;
      color: #9b9b9b;
    }

    .footerImg {
      width: 100%;
      height: 60px;
      display: flex;
      justify-content: center;
      align-items: center;

      img {
        width: 100%;
        height: 100%;
      }
    }
  }
  .footer1 {
    width: 60%;
    height: 60px;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;

    p {
      flex: 1;
      font-size: 12px;
      color: #9b9b9b;
    }

    .footerImg {
      width: 100%;
      height: 40px;
      display: flex;
      justify-content: center;
      align-items: center;

      img {
        width: 100%;
        height: 100%;
      }
    }
  }
}
.contemtBox {
  display: flex;
  flex-direction: column;
  .title {
    height: 80px;
    line-height: 80px;
    text-align: center;
    color: #d1d1d1;
    font-size: 24px;
    border-bottom: 1px dotted #d6e6f9;
  }
  .icon {
    height: 100px;
    display: flex;
    justify-content: center;
    align-items: center;

    img {
      width: 80px;
      height: 80px;
    }
  }
  .endtxt {
    flex: 1;
  }
  .cancel {
    height: 70px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-top: 1px dotted #d6e6f9;

    .close {
      width: 50%;
    }
  }
}

.contemtBox1 {
  width: 100%;
  padding: 0 5px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  .title {
    height: 80px;
    line-height: 80px;
    text-align: center;
    color: #d1d1d1;
    font-size: 16px;
    border-bottom: 1px dotted #d6e6f9;
  }
  .icon {
    height: 100px;
    display: flex;
    justify-content: center;
    align-items: center;

    img {
      width: 80px;
      height: 80px;
    }
  }
  .endtxt {
    flex: 1;
  }
  .cancel {
    height: 70px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-top: 1px dotted #d6e6f9;

    .close {
      width: 190px;
    }
  }
}
</style>
