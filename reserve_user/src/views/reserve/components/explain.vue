<template>
  <div>
    <div class="txtMain">
      <p class="title">预约须知</p>
      <p class="explain" v-html="text">{{text}}</p>
    </div>
    <div class="stepBtn">
      <p v-if="next" @click="nextStep(2)">下一步</p>
      <div v-if="!next" class="timeOut">
        <span>请仔细阅读预约须知</span>
        <span class="timeNum">({{timeNum}})</span>
      </div>
    </div>
  </div>
</template>
 
<script>
export default {
  props: ["text"],
  data() {
    return {
      next: false,
      timeNum: 8
    };
  },
  methods: {
    timeOut() {
      let num = 8;
      let timer = setInterval(() => {
        num--;
        this.timeNum = num;
        if (num == 0) {
          clearInterval(timer);
          this.next = true;
        }
      }, 1000);
    },
    nextStep(step) {
      this.$emit("changeStep", step);
    }
  },
  mounted() {
    this.timeOut();
  }
};
</script>

<style lang="scss" scoped>
.txtMain {
  border-radius: 0.2rem;
  background-color: #fff;
  min-height: 5rem;
  padding: 0.3rem;
  box-sizing: border-box;
}
.title {
  font-size: 0.26rem;
  color: #4a4a4a;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 500;
  margin: 0.2rem 0;
}
.explain {
  text-indent: 0.5rem;
  font-size: 0.24rem;
  color: #4a4a4a;
}
.stepBtn {
  width: 100%;
  height: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 0.5rem;

  p {
    width: 5.7rem;
    height: 0.8rem;
    background-color: #445c73;
    color: #fff;
    font-size: 0.3rem;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 40px;
  }
}

.timeOut {
  width: 5.7rem;
  height: 0.8rem;
  background-color: #445c73;
  color: #fff;
  font-size: 0.3rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 40px;

  .timeNum {
    color: red;
    margin-left: 0.1rem;
  }
}
</style>