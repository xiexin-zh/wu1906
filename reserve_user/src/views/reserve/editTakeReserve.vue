<template>
  <div class="editTake">
    <header>
      <Head title="预约修改"/>
    </header>
    <div class="main">
      <div class="takeUser">
        <van-form validate-first>
          <van-field
            label="预约人姓名："
            v-model="toTakeDetailList.realname"
            name="regUserName"
            placeholder="请输入姓名"
            :disabled="true"
            :rules="[{ validator:regUserName, message: '姓名2-20位' }]"
          />
          <van-field label="证件类型：" v-model="toTakeDetailList.card_type" name="cardType" placeholder :disabled="true" />
          <van-field
            label="证件号码："
            v-model="toTakeDetailList.idcardno"
            name="cardNum"
            :disabled="true"
            placeholder="请输入证件号码"
            :rules="[{ validator:regCardNum, message: '请输入正确的证件号码' }]"
          />
          <van-field
            label="联系电话："
            v-model="toTakeDetailList.mobile"
            name="regUserTel"
            :disabled="true"
            placeholder="请输入电话号码"
            :rules="[{ validator:regUserTel, message: '请输入正确的电话号码' }]"
          />
          <van-field
            readonly
            clickable
            label="预约墓地："
            :value="toTakeDetailList.organ_name"
            placeholder="选择墓地"
            @click="showPickerAddress = true"
          />
          <van-popup v-model="showPickerAddress" position="bottom">
            <van-picker
              show-toolbar
              :columns="addressColumns"
              @cancel="showPicker = false"
              @confirm="onConfirmSweep"
            />
          </van-popup>
          <van-field
            readonly
            clickable
            name="calendar"
            :value="toTakeDetailList.ao_time"
            label="预约祭扫日期："
            placeholder="点击选择日期"
            @click="showDate = true"
          />
          <van-calendar v-model="showDate" @confirm="onConfirmDate" />
        </van-form>
      </div>
      <div class="takeUser">
        <van-form validate-first>
          <p class="partnerTitle">祭扫逝者信息</p>
          <van-field
            label="逝者姓名："
            v-model="toTakeDetailList.die_name"
            name="sweepName"
            placeholder="请输入逝者姓名"
            :rules="[{ validator:regUserName, message: '姓名2-20位' }]"
          />
          <van-field name="radio" label="墓穴信息">
            <template #input>
              <van-radio-group v-model="toTakeDetailList.ao_graveinfo" direction="horizontal">
                <van-radio name="10">墓穴证号</van-radio>
                <van-radio name="20">墓穴位置</van-radio>
              </van-radio-group>
            </template>
          </van-field>
          <van-field
            v-if="toTakeDetailList.ao_graveinfo=='10'"
            label="墓穴证号："
            v-model="toTakeDetailList.ao_graveno"
            name="sweepNum"
            placeholder="请输入墓穴证号"
            :rules="[{ validator:regSweepNum, message: '墓穴证号不能为空' }]"
          />
          <van-field
            v-if="toTakeDetailList.ao_graveinfo=='20'"
            label="墓穴位置："
            v-model="toTakeDetailList.ao_gravewhere"
            name="sweepAddress"
            placeholder="请输入墓穴位置"
            :rules="[{ validator:regSweepAddress, message: '墓穴位置不能为空' }]"
          />
          <p class="sweepService">祭扫服务：代为祭扫将提供鲜花、清扫和擦拭服务</p>
        </van-form>
      </div>
      <div class="stepBtn">
        <p @click="saveEdit">保存</p>
      </div>
    </div>
  </div>
</template>

<script>
import * as ReserveAction from "../../api/reserve";
import { regTel, regIdCard, editAgency} from "../../utils/transform.js";
import Head from '../../components/Head.vue';
import { Toast } from "vant";
export default {
  data() {
    return {
      toTakeDetailList:"",
      username: "",
      usermobile: "",
      cardType: "居民身份证",
      cardNum: "",
      insulate: "2",
      sweepName: "",
      sweepMsg: "1",
      sweepNum: "",
      sweepAddress: "",
      showPickerAddress: false,
      sweepValue: [],
      addressColumns: [],
      showDate: false,
      date: "",
      timePick: "",
      showPickerTime: false,
      columnsTime: [
        "8:00-10:00 (100人)",
        "10:00-12:00 (150人)",
        "12:00-14:00 (200人)",
        "14:00-16:00 (150人)",
        "16:00-18:00 (100人)"
      ]
    };
  },
  mounted(){
    let url = localStorage.getItem('toTakeDetail');
    this.toTakeDetailList = JSON.parse(url);
    this.toTakeDetailList.ao_time = this.formatDate(this.toTakeDetailList.ao_time);
    this.getCemetery();
  },
  methods: {
    regUserName(val) {
      return /^[\u4E00-\u9FA5A-Za-z]{2,20}$/.test(val);
    },
    regUserTel(val) {
      return regTel(val);
    },
    regCardNum(val) {
      return regIdCard(val);
    },
    async saveEdit() {
      if(this.toTakeDetailList.organ_name=='北京市八宝山革命公墓'){
        this.toTakeDetailList.organ_name = '1';
      }else if(this.toTakeDetailList.organ_name=='北京市八宝山人民公墓'){
        this.toTakeDetailList.organ_name = '2'
      }
      let date = new Date(this.toTakeDetailList.ao_time);
      this.toTakeDetailList.ao_time = date.getTime(date);
      console.log(this.toTakeDetailList.ao_time);
      let parse = {};
      parse.orderId = this.toTakeDetailList.ao_id;
      parse.realname = this.toTakeDetailList.realname;
      parse.card_type = this.toTakeDetailList.card_type;
      parse.idcardno = this.toTakeDetailList.idcardno;
      parse.mobile = this.toTakeDetailList.mobile;
      parse.organ = this.toTakeDetailList.organ_name;
      parse.time = this.toTakeDetailList.ao_time;
      parse.name = this.toTakeDetailList.die_name;
      parse.graveinfo = this.toTakeDetailList.ao_graveinfo;
      parse.graveno = this.toTakeDetailList.ao_graveno;
      parse.graveno = this.toTakeDetailList.ao_graveno;
      parse.gravewhere = this.toTakeDetailList.ao_gravewhere;
      const res = await ReserveAction.editAgency({
        ...parse
      });
      if (res.error == 0) {
          Toast("修改成功");
          this.$router.push({ name: "searchReserve" });
        } else {
          Toast.fail(res.msg);
      }
    },
    formatDate(time) {
      const date = new Date(Number(time));
      const y = date.getFullYear();
      const m = date.getMonth() + 1;
      const d = date.getDay();
      return y + "-" + m + "-" + d ;
    },
    onConfirmSweep(value) {
      this.toTakeDetailList.organ_name = value;
      this.showPickerAddress = false;
    },
    onConfirmDate(date) {
      this.showDate = false;
      this.toTakeDetailList.ao_time = this.formatDate(date);
    },
    onConfirmTime(value) {
      this.timePick = value;
      this.showPickerTime = false;
    },
    regSweepNum(val) {
      return val.trim().length > 0;
    },
    regSweepAddress(val) {
      return val.trim().length > 0;
    },
    async getCemetery(){
      const res = await ReserveAction.getCemetery({});
      if (res.data.length > 0) {
          res.data.forEach(item => {
            this.addressColumns.push(item.og_name);
          });
        }
    }
  },
  components:{
    Head
  }
};
</script>

<style lang="scss" scoped>
.editTake{
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}
header{
  height: 0.86rem;
}
.main{
  flex: 1;
  height: 100%;
  overflow-y: scroll;
}
.takeUser {
  border-radius: 0.2rem;
  background-color: #fff;
  min-height: 5rem;
  padding: 0.3rem;
  box-sizing: border-box;
  margin-bottom: 0.16rem;
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
.partnerTitle {
  padding-left: 0.25rem;
  box-sizing: border-box;
}
.sweepService {
  font-size: 0.22rem;
  color: #445c73;
  text-align: center;
  margin-top: 0.5rem;
}
</style>