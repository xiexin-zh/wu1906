<template>
  <div class="takeDetails">
    <header>
      <Head title="预约详情" />
    </header>
    <div class="main">
      <div class="content">
        <div class="details">
          <div class="mainUser">
            <p class="partName">预约信息</p>
            <p class="detailTxt">
              <span>预约人姓名：</span><span>{{toTakeDetailList.realname}}</span>
            </p>
            <p class="detailTxt">
              <span>证件号码：</span><span>{{toTakeDetailList.idcardno}}</span>
            </p>
            <p class="detailTxt">
              <span>联系电话：</span><span>{{toTakeDetailList.mobile}}</span>
            </p>
            <p class="detailTxt">
              <span>预约机构：</span><span>{{toTakeDetailList.organ_name}}</span>
            </p>
            <p class="detailTxt">
              <span>预约祭扫时间</span><span>{{toTakeDetailList.ao_time}}</span>
            </p>
          </div>
          <div class="partner">
            <p class="partName">祭扫逝者信息</p>
            <p class="detailTxt">
              <span>逝者名称：</span><span>{{toTakeDetailList.die_name}}</span>
            </p>
            <p class="detailTxt">
              <span>墓穴信息：</span><span>{{toTakeDetailList.ao_graveno}}</span>
            </p>
          </div>
        </div>
        <div class="footer" v-if="toTakeDetailList.ao_state=='0'">
          <div class="edit" @click="editReserve">修改预约</div>
          <div class="cancel" @click="cancelReserve">取消预约</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as ReserveAction from "../../api/reserve";
import Head from "../../components/Head.vue";
import { Toast } from "vant";
export default {
  data(){
    return {
      toTakeDetailList:{}
    }
  },
  mounted(){
    let url = localStorage.getItem('toTakeDetail');
    this.toTakeDetailList = JSON.parse(url);
    this.toTakeDetailList.ao_time = this.formatTime(this.toTakeDetailList.ao_time);
    if(this.toTakeDetailList.ao_organ == '1'){

    }
  },
  methods:{
    formatTime(time) {
      const date = new Date(Number(time));
      const y = date.getFullYear();
      const m = date.getMonth() + 1;
      const d = date.getDay();
      return y + "-" + m + "-" + d ;
    },
    editReserve(){
      this.$router.push({
        name:'editTakeReserve'
      })
    },
    async cancelReserve(){
       let params = {};
       console.log(this.toTakeDetailList.ao_id);
       params.orderId = this.toTakeDetailList.ao_id;
        const res = await ReserveAction.orderCancelAgency({
        ...params
      });
      if (res.error == 0) {
          Toast("取消成功");
          this.$router.push({ name: "searchReserve" });
        } else {
          Toast.fail(res.msg);
      }
    }
  },
  components: {
    Head
  }
};
</script>

<style lang="scss" scoped>
.takeDetails {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.main {
  flex: 1;
  height: 100%;
  background-color: #f8f6f9;
  padding: 0.3rem;
  box-sizing: border-box;
}

header {
  height: 0.86rem;
}

.details {
  background-color: #fff;
  padding: 0.3rem;
  box-sizing: border-box;
  border-radius: 20px;

  .mainUser {
  }
  .partner {
    margin-top: 0.5rem;
  }
  .partName {
    font-size: 0.3rem;
    color: #030303;
    margin-bottom: 0.3rem;
    margin-top: 0.2rem;
  }
  .detailTxt {
    font-size: 0.24rem;
    color: #4a4a4a;
    margin-bottom: 0.2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;

    span{
      display: flex;
      flex: 1;
      justify-content: flex-start;
      align-items: center;
    }
  }
}
.footer{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .edit{
    width: 5.7rem;
    height: 0.8rem;
    background-color: #445C73;
    font-size: 0.26rem;
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 40px;
    margin-top: 0.5rem;
  }
  .cancel{
    height: 0.6rem;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #D0021B;
    font-size: 0.24rem;
  }
}
</style>
