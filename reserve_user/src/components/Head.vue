<template>
  <div class="head">
    <van-nav-bar
      :title="title"
      left-text="返回"
      right-text=""
      left-arrow
      @click-left="onClickLeft"
      @click-right="onClickRight"
    />
  </div>
</template>

<script>
export default {
  props:['title'],
  methods:{
    onClickLeft(){
      this.$router.go(-1);
    },
    onClickRight(){
      console.log('右侧按钮')
    }
  }
};
</script>

<style scoped>
.head {
  height: 0.86rem;
}
</style>