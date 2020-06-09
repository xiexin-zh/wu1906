<template>
  <div>
    <div class="addSuccess">
      <div class="successImg">
        <img :src="require('../../../assets/images/success.png')" alt />
      </div>
      <p>预约成功</p>
      <div class="codeNumber">受理号:{{acceptanceNo}}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["acceptanceNo"],
  data() {
    return {};
  },
  mounted() {}
};
</script>

<style lang="scss" scoped>
.addSuccess {
  border-radius: 0.2rem;
  background-color: #fff;
  padding: 0.3rem;
  box-sizing: border-box;
  margin-bottom: 0.5rem;
  min-height: 8rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

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
</style>