<template>
  <div class="reserveDetails">
    <header>
      <Head title="预约详情" />
    </header>
    <div class="main">
      <div class="content">
        <div class="details">
          <div class="mainUser">
            <p class="partName">预约信息</p>
            <p class="detailTxt">
              <span>预约人姓名：</span><span>{{reserveDetailsList.realname}}</span>
            </p>
            <p class="detailTxt">
              <span>证件号码：</span><span>{{reserveDetailsList.idcardno}}</span>
            </p>
            <p class="detailTxt">
              <span>联系电话：</span><span>{{reserveDetailsList.mobile}}</span>
            </p>
            <p class="detailTxt">
              <span>预约机构：</span><span>{{reserveDetailsList.ro_organ}}</span>
            </p>
            <p class="detailTxt">
              <span>预约祭扫时间</span><span>{{formatTime(reserveDetailsList.ro_time)}}</span>
            </p>
            <p class="detailTxt">
              <span>预约时段：</span><span>{{reserveDetailsList.ro_timeframe}}</span>
            </p>
            <p class="detailTxt"><span>出行方式：</span><span>{{reserveDetailsList.ro_tripmode}}</span></p>
          </div>
          <div class="partner" v-if="reserveDetailsList.ro_peoplenum > 1">
            <p class="partName">同行1</p>
            <p class="detailTxt">
              <span>预约人姓名：</span><span>{{reserveDetailsList.ro_name1}}</span>
            </p>
            <p class="detailTxt">
              <span>证件号码：</span><span>{{reserveDetailsList.ro_idno1}}</span>
            </p>
          </div>
          <div class="partner" v-if="reserveDetailsList.ro_peoplenum > 2">
            <p class="partName">同行2</p>
            <p class="detailTxt">
              <span>预约人姓名：</span><span>{{reserveDetailsList.ro_name2}}</span>
            </p>
            <p class="detailTxt">
              <span>证件号码：</span><span>{{reserveDetailsList.ro_idno2}}</span>
            </p>
          </div>
        </div>
        <div class="footer" v-if="reserveDetailsList.ro_state=='0'">
          <div class="edit" @click="editReserve" >修改预约</div>
          <div class="cancel" @click="cancelReserve">取消预约</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as ReserveAction from "../../api/reserve";
import Head from "../../components/Head.vue";
import { List } from 'vant';
import { Toast } from "vant";
export default {
  name: 'reserveDetails',
  data(){
    return {
        reserveDetailsList:{},
        reserveData:''
    }
  },
  mounted(){
    let url = localStorage.getItem('routerData');
    this.reserveDetailsList = JSON.parse(url);
    if(this.reserveDetailsList.ro_tripmode == '10'){
      this.reserveDetailsList.ro_tripmode = '公共交通'
    }else if(this.reserveDetailsList.ro_tripmode == '20'){
      this.reserveDetailsList.ro_tripmode = '自驾'
    }else if(this.reserveDetailsList.ro_tripmode == '30'){
      this.reserveDetailsList.ro_tripmode = '其他'
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
        path:'editReserve'
      })
    },
    async cancelReserve(){
      let params = {};
      params.orderId = this.reserveDetailsList.ro_id;
      const res = await ReserveAction.cancelSubscribe({
        ...params
      });
      if (res.error == 0) {
          Toast("取消成功");
          this.$router.push({ name: "searchReserve" });
        } else {
          Toast.fail(res.msg);
      }
    },
  },
  components: {
    Head
  }
};
</script>

<style lang="scss" scoped>
.reserveDetails {
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
