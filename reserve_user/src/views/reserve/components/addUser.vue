<template>
  <div>
    <div class="addUser">
      <van-form validate-first>
        <van-field
          label="预约人姓名："
          v-model="username"
          name="regUserName"
          placeholder="请输入姓名"
          :rules="[{ validator:regUserName, message: '姓名2-20位' }]"
        />
        <van-field label="证件类型：" v-model="cardType" name="cardType" placeholder :disabled="true" />
        <van-field
          label="证件号码："
          v-model="cardNum"
          name="cardNum"
          placeholder="请输入证件号码"
          :rules="[{ validator:regCardNum, message: '请输入正确的证件号码' }]"
        />
        <van-field
          label="联系电话："
          v-model="usermobile"
          name="regUserTel"
          placeholder="请输入电话号码"
          :rules="[{ validator:regUserTel, message: '请输入正确的电话号码' }]"
        />
        <van-field name="radio" label="是否为居家隔离人员：" label-width="130px">
          <template #input>
            <van-radio-group v-model="insulate" direction="horizontal">
              <van-radio name="1">是</van-radio>
              <van-radio name="2">否</van-radio>
            </van-radio-group>
          </template>
        </van-field>

        <van-field
          readonly
          clickable
          name="picker"
          :value="sweepValue"
          label="预约墓地："
          placeholder="点击选择墓地"
          @click="showPickerAddress = true"
        />
        <van-popup v-model="showPickerAddress" position="bottom">
          <van-picker
            show-toolbar
            :columns="addressColumns"
            @confirm="onConfirmSweep"
            @cancel="showPicker = false"
          />
        </van-popup>

        <!-- <van-field
          readonly
          clickable
          label="预约墓地："
          :value="sweepValue"
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
        </van-popup>-->
        <van-field
          readonly
          clickable
          name="calendar"
          :value="date"
          label="预约祭扫日期："
          placeholder="点击选择日期"
          @click="showDate = true"
        />
        <van-calendar v-model="showDate" @confirm="onConfirmDate" />

        <van-field
          readonly
          clickable
          label="预约时段："
          :value="timePick"
          placeholder="选择时段"
          @click="showPickerTime = true"
        />
        <van-popup v-model="showPickerTime" position="bottom">
          <van-picker
            show-toolbar
            :columns="columnsTime"
            @cancel="showPickerTime = false"
            @confirm="onConfirmTime"
          />
        </van-popup>

        <van-field
          readonly
          clickable
          name="tripmode"
          :value="tripmode"
          label="出行方式："
          placeholder="点击选择出行方式"
          @click="showtripmode = true"
        />
        <van-popup v-model="showtripmode" position="bottom">
          <van-picker
            show-toolbar
            :columns="tripmodeColumns"
            @confirm="onTripmode"
            @cancel="showtripmode = false"
          />
        </van-popup>

        <van-field name="radio" label="扫墓人数(最多3人)" label-width="130px">
          <template #input>
            <van-radio-group v-model="userCount" direction="horizontal">
              <van-radio name="1">1</van-radio>
              <van-radio name="2">2</van-radio>
              <van-radio name="3">3</van-radio>
            </van-radio-group>
          </template>
        </van-field>
      </van-form>
    </div>
    <div v-if="userCount == '2' || userCount == '3'" class="addUser">
      <van-form validate-first>
        <p class="partnerTitle">同行者1</p>
        <van-field
          label="姓名："
          v-model="partnerName1"
          name="regPartnerName1"
          placeholder="请输入同行者姓名"
          :rules="[{ validator:regUserName, message: '姓名2-20位' }]"
        />
        <van-field label="证件类型：" v-model="cardType" name="cardType" :disabled="true" />
        <van-field
          label="证件号码："
          v-model="cardNum1"
          name="regCardNum1"
          placeholder="请输入证件号码"
          :rules="[{ validator:regCardNum, message: '请输入正确的证件号码' }]"
        />
        <van-field
          readonly
          clickable
          name="tripmode1"
          :value="tripmode1"
          label="出行方式："
          placeholder="点击选择出行方式"
          @click="showtripmode1 = true"
        />
        <van-popup v-model="showtripmode1" position="bottom">
          <van-picker
            show-toolbar
            :columns="tripmodeColumns"
            @confirm="onTripmode1"
            @cancel="showtripmode1 = false"
          />
        </van-popup>
        <van-field name="radio1" label="是否为居家隔离人员" label-width="130px">
          <template #input>
            <van-radio-group v-model="insulate1" direction="horizontal">
              <van-radio name="1">是</van-radio>
              <van-radio name="2">否</van-radio>
            </van-radio-group>
          </template>
        </van-field>
      </van-form>
    </div>
    <div v-if="userCount == '3'" class="addUser">
      <van-form validate-first>
        <p class="partnerTitle">同行者2</p>
        <van-field
          label="姓名："
          v-model="partnerName2"
          name="validator"
          placeholder="请输入同行者姓名"
          :rules="[{ validator:regUserName, message: '姓名2-20位' }]"
        />
        <van-field label="证件类型：" v-model="cardType" name="cardType" :disabled="true" />
        <van-field
          label="证件号码："
          v-model="cardNum2"
          name="regCardNum2"
          placeholder="请输入证件号码"
          :rules="[{ validator:regCardNum, message: '请输入正确的证件号码' }]"
        />
        <van-field
          readonly
          clickable
          name="tripmode2"
          :value="tripmode2"
          label="出行方式："
          placeholder="点击选择出行方式"
          @click="showtripmode2 = true"
        />
        <van-popup v-model="showtripmode2" position="bottom">
          <van-picker
            show-toolbar
            :columns="tripmodeColumns"
            @confirm="onTripmode2"
            @cancel="showtripmode2 = false"
          />
        </van-popup>
        <van-field name="radio2" label="是否为居家隔离人员：" label-width="130px">
          <template #input>
            <van-radio-group v-model="insulate2" direction="horizontal">
              <van-radio name="1">是</van-radio>
              <van-radio name="2">否</van-radio>
            </van-radio-group>
          </template>
        </van-field>
      </van-form>
    </div>
    <div class="stepBtn">
      <p @click="nextStep(3)">下一步</p>
    </div>
  </div>
</template>

<script>
import { regTel, regIdCard } from "../../../utils/transform.js";
import { Toast } from "vant";
import * as AdminAction from "../../../api/admin";
import * as ReserveAction from "../../../api/reserve";
export default {
  data() {
    return {
      username: "",
      partnerName1: "",
      partnerName2: "",
      usermobile: "",
      cardType: "居民身份证",
      cardNum: "",
      cardNum1: "",
      cardNum2: "",
      insulate: "2",
      insulate1: "2",
      insulate2: "2",
      userCount: "1",
      showPickerAddress: false,
      sweepValue: [],
      addressColumns: [],
      originAddress: [],
      showDate: false,
      date: "",
      timePick: "",
      showPickerTime: false,
      tripmode: "",
      tripmode1: "",
      tripmode2: "",
      showtripmode: false,
      showtripmode1: false,
      showtripmode2: false,
      tripmodeColumns: ["公共交通", "自驾", "其他"],
      columnsTime: [
        "8:00-10:00 (100人)",
        "10:00-12:00 (150人)",
        "12:00-14:00 (200人)",
        "14:00-16:00 (150人)",
        "16:00-18:00 (100人)"
      ]
    };
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
    async nextStep(step) {
      let params = {};
      params.orderId = 0;
      params.realname = this.username;
      params.card_type = 10;
      params.idcardno = this.cardNum;
      params.mobile = this.usermobile;
      params.is_isolation = this.insulate == "2" ? 0 : 1;
      let organ = "";
      this.originAddress.forEach(item => {
        if (item.og_name == this.sweepValue) {
          organ = item.og_id;
        }
      });
      params.organ = organ;
      params.time = new Date(this.date).getTime();
      params.timeframe = 10;
      params.tripmode = (this.tripmodeColumns.indexOf(this.tripmode) + 1) * 10;
      params.peoplenum = this.userCount;

      //  同行1
      params.name1 = this.partnerName1;
      params.card_type1 = 10;
      params.idno1 = this.cardNum1;
      params.tripmode1 =
        (this.tripmodeColumns.indexOf(this.tripmode1) + 1) * 10;
      params.isolation1 = this.insulate1 == "2" ? 0 : 1;

      //  同行2
      params.name2 = this.partnerName2;
      params.card_type2 = 10;
      params.idno2 = this.cardNum2;
      params.tripmode2 =
        (this.tripmodeColumns.indexOf(this.tripmode2) + 1) * 10;
      params.isolation2 = this.insulate2 == "2" ? 0 : 1;

      // 预约者信息验证
      if (!this.regUserName(this.username)) {
        return Toast.fail("预约者姓名2-20位");
      }
      if (!this.regUserTel(this.usermobile)) {
        return Toast.fail("预约者手机号码格式错误");
      }
      if (!this.regCardNum(this.cardNum)) {
        return Toast.fail("预约者身份证号码格式错误");
      }

      if (
        !params.realname ||
        !params.idcardno ||
        !params.mobile ||
        !params.organ ||
        !params.time ||
        !params.timeframe ||
        !params.tripmode
      ) {
        return Toast.fail("请完善预约者信息");
      }

      if (this.userCount == 1) {
        delete params.name1;
        delete params.card_type1;
        delete params.idno1;
        delete params.tripmode1;
        delete params.isolation1;
        delete params.name2;
        delete params.card_type2;
        delete params.idno2;
        delete params.tripmode2;
        delete params.isolation2;
      } else if (this.userCount == 2) {
        delete params.name2;
        delete params.card_type2;
        delete params.idno2;
        delete params.tripmode2;
        delete params.isolation2;
        if (!params.name1 || !params.idno1 || !params.tripmode1) {
          return Toast.fail("请完善同行者信息");
        }
        // 同行者1信息验证
        if (!this.regUserName(this.partnerName1)) {
          return Toast.fail("同行者姓名2-20位");
        }
        if (!this.regCardNum(this.cardNum1)) {
          return Toast.fail("同行者身份证号码格式错误");
        }
      } else if (this.userCount == 3) {
        if (
          !params.name1 ||
          !params.idno1 ||
          !params.tripmode1 ||
          !params.name2 ||
          !params.idno2 ||
          !params.tripmode2
        ) {
          return Toast.fail("请完善同行者信息");
        }
        // 同行者1-2信息验证
        if (
          !this.regUserName(this.partnerName1) ||
          !this.regUserName(this.partnerName2)
        ) {
          return Toast.fail("预约者姓名2-20位");
        }
        if (
          !this.regCardNum(this.cardNum1) ||
          !this.regCardNum(this.cardNum2)
        ) {
          return Toast.fail("预约者身份证号码格式错误");
        }
      }
      const res = await ReserveAction.editReserve(params);
      if (res.error == 0) {
        const acceptanceNo = res.data.acceptanceNo;
        this.$emit("changeStep", step, acceptanceNo);
      } else {
        Toast.fail(res.msg);
      }
    },
    onSubmit() {},
    formatDate(date) {
      return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    },
    onConfirmSweep(value) {
      this.sweepValue = value;
      this.showPickerAddress = false;
    },
    onConfirmDate(date) {
      this.showDate = false;
      this.date = this.formatDate(date);
    },
    onConfirmTime(value) {
      this.timePick = value;
      this.showPickerTime = false;
    },
    onTripmode(val) {
      this.tripmode = val;
      this.showtripmode = false;
    },
    onTripmode1(val) {
      this.tripmode1 = val;
      this.showtripmode1 = false;
    },
    onTripmode2(val) {
      this.tripmode2 = val;
      this.showtripmode2 = false;
    },
    // 获取当前用户信息
    async getUserData() {
      const res = await AdminAction.getUserData();
      if (res.error == 0) {
        this.username = res.data.realname;
        this.cardNum = res.data.idcardno;
        this.usermobile = res.data.mobile;
      }
    },

    // 获取墓地信息
    async getCemetery() {
      const res = await ReserveAction.getCemetery();
      if (res.error == 0) {
        let address = [];
        if (res.data.length > 0) {
          res.data.forEach(item => {
            address.push(item.og_name);
          });
        }
        this.originAddress = res.data;
        this.addressColumns = address;
      }
    }
  },
  mounted() {
    this.getUserData();
    this.getCemetery();
  }
};
</script>

<style lang="scss" scoped>
.addUser {
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
</style>