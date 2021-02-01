<template>
  <div class="count u-fx">
    <div>{{ hour }}:</div>
    <div>{{ minute }}:</div>
    <div>{{ second }}</div>
  </div>
</template>

<script>
export default {
  name: 'DateTime',
  data() {
    return {
      hour: '00',
      minute: '00',
      second: '00',
      flag: null,
      abc : 0, // 秒的计数
      cde : 0, // 分的计数
      efg : 0, // 时的计数
    }
  },
  methods: {
    start(type) {
      if (type) {
        this.hour = '00'
        this.minute = '00'
        this.second = '00'
        this.flag = null
        this.abc = 0
        this.cde = 0
        this.efg = 0
        this.flag = setInterval(() => {
          if (this.second === 60 || this.second === '60') {
            this.second = '00';
            this.abc = 0;
            if(this.minute === 60 || this.minute === '60') {
              this.minute = '00';
              this.cde = 0;
              if(this.efg+1 <= 9){
                this.efg++;
                this.hour = '0' + this.efg;
              }else{
                this.efg++;
                this.hour = this.efg;
              }
            } else {
              if (this.cde + 1 <= 9) {
                this.cde++;
                this.minute = '0' + this.cde;
              } else {
                this.cde++;
                this.minute = this.cde;
              }
            }
          } else {
            if (this.abc + 1 <= 9) {
              this.abc++;
              this.second = '0' + this.abc;
            } else {
              this.abc++;
              this.second = this.abc;
            }
          }
        },1000)
      } else {
        this.flag = clearInterval(this.flag)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.count {
  color: #fff;
  margin-top: 10rpx;
  font-size: 32rpx;
  font-weight: bold;
  letter-spacing: 4rpx;
}
</style>  