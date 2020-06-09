<template>
  <div>
    <div class="takeUser">
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
        <van-field
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
        </van-popup>
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
      </van-form>
    </div>
    <div class="takeUser">
      <van-form validate-first>
        <p class="partnerTitle">祭扫逝者信息</p>
        <van-field
          label="逝者姓名："
          v-model="sweepName"
          name="sweepName"
          placeholder="请输入逝者姓名"
          :rules="[{ validator:regUserName, message: '姓名2-20位' }]"
        />
        <van-field name="radio" label="墓穴信息">
          <template #input>
            <van-radio-group v-model="sweepMsg" direction="horizontal">
              <van-radio name="1">墓穴证号</van-radio>
              <van-radio name="2">墓穴位置</van-radio>
            </van-radio-group>
          </template>
        </van-field>
        <van-field
          v-if="sweepMsg=='1'"
          label="墓穴证号："
          v-model="sweepNum"
          name="sweepNum"
          placeholder="请输入墓穴证号"
          :rules="[{ validator:regSweepNum, message: '墓穴证号不能为空' }]"
        />
        <van-field
          v-if="sweepMsg=='2'"
          label="墓穴位置："
          v-model="sweepAddress"
          name="sweepAddress"
          placeholder="请输入墓穴位置"
          :rules="[{ validator:regSweepAddress, message: '墓穴位置不能为空' }]"
        />
        <p class="sweepService">祭扫服务：代为祭扫将提供鲜花、清扫和擦拭服务</p>
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
      originAddress: [],
      addressColumns: [],
      showDate: false,
      date: "",
      timePick: "",
      showPickerTime: false
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
      let organ = "";
      this.originAddress.forEach(item => {
        if (item.og_name == this.sweepValue) {
          organ = item.og_id;
        }
      });
      params.organ = organ;
      params.time = new Date(this.date).getTime();
      params.name = this.sweepName;
      params.graveinfo = this.sweepMsg == "1" ? "10" : "20";
      params.graveno = this.sweepNum;
      params.gravewhere = this.sweepAddress;
      if (
        !params.realname ||
        !params.idcardno ||
        !params.mobile ||
        !params.organ ||
        !params.time
      ) {
        return Toast.fail("请完善预约信息");
      }
      if (
        !this.regUserName(this.username) ||
        !this.regUserName(this.sweepName)
      ) {
        return Toast.fail("姓名2-20位");
      }
      if (!this.regCardNum(this.cardNum)) {
        return Toast.fail("身份证格式错误");
      }
      if (!this.regUserTel(this.usermobile)) {
        return Toast.fail("手机号码格式错误");
      }
      if (this.sweepMsg == "1") {
        delete params.gravewhere;
        if (!params.graveno) {
          return Toast.fail("请完善预约信息");
        }
      } else {
        delete params.graveno;
        if (!params.gravewhere) {
          return Toast.fail("请完善预约信息");
        }
      }
      const res = await ReserveAction.editAgency(params);
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
    regSweepNum(val) {
      return val.trim().length > 0;
    },
    regSweepAddress(val) {
      return val.trim().length > 0;
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