<template>
  <div class="stepBox">
    <div class="stepItem">
      <div :class="active==1 ? 'circle1' : 'circle' ">
        <span>1</span>
      </div>
      <div class="title">{{title[0]}}</div>
    </div>
    <p class="line"></p>
    <div class="stepItem">
      <div :class="active==2 ? 'circle1' : 'circle' ">
        <span>2</span>
      </div>
      <div class="title">{{title[1]}}</div>
    </div>
    <p v-if="size==3" class="line"></p>
    <div v-if="size==3" class="stepItem">
      <div :class="active==3 ? 'circle1' : 'circle' ">
        <span>3</span>
      </div>
      <div class="title">{{title[2]}}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["size", "title", "lineWidth", "active"]
};
</script>

<style lang="scss" scoped>
.stepBox {
  height: 1.2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
}

.stepItem {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;

  .circle {
    width: 0.6rem;
    height: 0.6rem;
    border: 2px solid #445c73;
    box-sizing: border-box;
    border-radius: 50%;
    font-size: 14px;
    color: #445c73;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    margin-bottom: 0.15rem;
  }

  .circle1 {
    width: 0.6rem;
    height: 0.6rem;
    border: 2px solid #445c73;
    background-color: #445c73;
    box-sizing: border-box;
    border-radius: 50%;
    font-size: 14px;
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    margin-bottom: 0.15rem;
  }

  .title {
    font-size: 0.22rem;
    color: #4a4a4a;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

.line {
  position: relative;
  top: -0.25rem;
  width: 1.2rem;
  height: 2px;
  background-color: #445c73;
  margin: 0 0.2rem;
}
</style>