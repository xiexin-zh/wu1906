<template>
  <div>
    <div class="addSuccess">
      <div class="successImg">
        <img :src="require('../../../assets/images/success.png')" alt />
      </div>
      <p>预约成功</p>
    </div>
    <div class="addSuccess">
      <div class="codeNumber">受理号:{{acceptanceNo}}</div>
      <div class="codeImg">
        <canvas width="50" height="50" ref="qrcode" />
      </div>
      <div class="codeTxt">请妥善保管好您的预约二维码</div>
      <div class="codeTxt">并于预约当日提供身份证和二维码进行身份核验</div>
    </div>
  </div>
</template>

<script>
import QRCode from "qrcode";
export default {
  props: ["acceptanceNo"],
  data() {
    return {
      codeNumber: "WWWYU55273290938"
    };
  },
  methods: {
    complete() {},
    makeCode() {
      QRCode.toCanvas(
        this.$refs.qrcode,
        this.acceptanceNo,
        {
          width: 200
        },
        function(error) {
          if (error) console.error(error);
        }
      );
    }
  },
  mounted() {
    this.makeCode();
  }
};
</script>

<style lang="scss" scoped>
.addSuccess {
  border-radius: 0.2rem;
  background-color: #fff;
  padding: 0.3rem;
  box-sizing: border-box;
  margin-bottom: 0.5rem;

  .successImg {
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      margin-top: 0.2rem;
      width: 1.92rem;
      height: 1.92rem;
    }
  }

  p {
    margin-top: 0.5rem;
    margin-bottom: 0.2rem;
    font-size: 0.32rem;
    color: #608cb6;
    text-align: center;
  }
}

.codeNumber {
  text-align: center;
  font-size: 0.22rem;
  color: #608cb6;
}

.codeImg {
  min-height: 3.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.codeTxt {
  text-align: center;
  font-size: 0.22rem;
  color: #4a4a4a;
}
</style>