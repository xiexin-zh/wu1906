<template>
  <div class="wrapper">
    <div class="http404-container">
      <img class="pic"
           src="@/assets/404_images/404.png"
           alt="">
      <div class="title">抱歉，您要訪問的頁面丟失了</div>
      <div class="desc">請檢查您輸入的網址是否正確，請點擊以下按鈕返回首頁</div>
      <div class="btn"
           @click="handleBack">
        返回首頁
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: 'Page404',
  methods: {
    handleBack() {
      this.$router.push('/')
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.wrapper {
  position: relative;
}

.http404-container {
  position: relative;
  top: 50%;
  transform: translateY(-50%);
  .pic {
    width: 600px;
    display: block;
    margin: 0 auto;
  }
  .title {
    width: 100%;
    text-align: center;
    font-size: 24px;
    color: #111;
    line-height: 38px;
    margin-top: 77px;
  }
  .desc {
    width: 100%;
    font-size: 18px;
    color: #777;
    text-align: center;
    line-height: 38px;
    margin-top: 8px;
  }
  .btn {
    width: 125px;
    height: 44px;
    text-align: center;
    font-size: 14px;
    color: #fefefe;
    line-height: 44px;
    background: #005DF7;
    border-radius: 6px;
    margin: 50px auto 0;
    cursor: pointer;
  }
}

@media screen and (max-width: 1500px) {
  .http404-container {
    .pic {
      width: 500px;
    }
    .title {
      margin-top: 50px;
    }
    .btn {
      margin-top: 40px;
    }
  }
}
</style>
