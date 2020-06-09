<template>
  <div class="reserveBox">
    <div class="headerImg">
      <img :src="require('../../assets/images/title.png')" alt />
    </div>
    <div class="reserveList">
      <ul>
        <li v-for="(item) in list" :key="item.type">
          <img :src="item.img" alt @click="routerTo(item.type)" />
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
/* eslint-disable no-new */
import * as ReserveAction from '../../api/reserve';
export default {
  data() {
    return {
      list: [
        {
          name: "网上预约服务",
          type: "onlineReserve",
          img: require("../../assets/images/onlineReserve.png")
        },
        {
          name: "电话预约",
          type: "telReserve",
          img: require("../../assets/images/telReserve.png")
        },
        {
          name: "代为祭扫",
          type: "takeReserve",
          img: require("../../assets/images/takeReserve.png")
        },
        {
          name: "网上祭扫",
          type: "onlineSweep",
          img: require("../../assets/images/onlineSweep.png")
        },
        {
          name: "预约查询",
          type: "searchReserve",
          img: require("../../assets/images/searchReserve.png")
        }
      ]
    };
  },
  methods: {
    routerTo(address) {
      switch (address) {
        case "onlineReserve":
          this.$router.push({
            name: "onlineReserve"
          });
          break;
        case "telReserve":
          this.$router.push({
            name: "telReserve"
          });
          break;
        case "takeReserve":
          this.$router.push({
            name: "takeReserve"
          });
          break;
        case "onlineSweep":
          this.$router.push({
            name: "onlineSweep"
          });
          break;
        case "searchReserve":
          this.$router.push({
            name: "searchReserve"
          });
          break;
        default:
          this.$router.push({
            name: "reserve"
          });
      }
    },
    async getNotice(){
      const res = await ReserveAction.getReserveNotice();
      if(res.error == 0){
        this.$store.dispatch('setNotice',res.data)
      }
    }
  },
  mounted(){
    const token = sessionStorage.getItem('JWT_TOKEN');
    if(token){
      this.getNotice();
    }
  }
};
</script>

<style lang="scss" scoped>
.reserveBox {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-image: url("../../assets/images/bg@3x.png");
  background-size: 100% 100%;
}
.headerImg {
  height: 3.2rem;
  display: flex;
  justify-content: center;
  align-items: flex-end;

  img {
    width: 4.73rem;
    height: 0.64rem;
  }
}
.reserveList {
  flex: 1;

  ul {
    width: 100%;
    height: 100%;
    padding-top: 0.6rem;
    box-sizing: border-box;

    li {
      height: 1.2rem;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 0.2rem;

      img{
        width: 5.2rem;
        height: 1.13rem;
      }
    }
  }
}
</style>