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
        <!-- <van-field label="证件类型：" v-model="cardType" name="cardType" placeholder :disabled="true" /> -->
        <van-field label="证件类型："
           v-model="cardType"
            name="cardType" 
            placeholder
            @click="showcard_type2 = true"
            />
          <van-popup v-model="showcard_type2" position="bottom">
            <van-picker
              show-toolbar
              :columns="addressCard_type2"
              @confirm="onConfirmCard_type2"
              @cancel="showcard_type2 = false"
            />
          </van-popup>
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
        <van-field name="methodTyep" label="选择祭扫方式：" label-width="130px" class="methodType">
          <template #input>
            <div><van-radio-group v-model="methodTyep" direction="horizontal">
              <van-radio name="1">鲜花</van-radio>
              <van-radio name="2">点烛</van-radio>
              <van-radio name="3">上香</van-radio>
              <van-radio name="4">祭酒</van-radio>
            </van-radio-group></div>
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
export default {
  data() {
    return {
      username: "",
      cardNum: "",
      usermobile: "",
      methodTyep: "1"
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
    nextStep(step) {
      this.$emit("changeStep", step);
    },
    onSubmit() {},
    formatDate(date) {
      return `${date.getMonth() + 1}/${date.getDate()}`;
    },
    onConfirm(date) {
      this.showDate = false;
      this.date = this.formatDate(date);
    }
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
  margin-bottom: 0.5rem;
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
.space {
  margin-bottom: 0.3rem;
}
.methodType{
  flex-direction: column;
}
</style>