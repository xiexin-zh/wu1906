<template>
  <div class="editReserve">
    <header>
      <Head title="预约修改"/>
    </header>
    <div class="main">
      <div class="editUser">
        <van-form validate-first>
          <van-field
            label="预约人姓名："
            v-model="reserveDetailsList.realname"
            name="regUserName"
            :disabled="true"
            placeholder="请输入姓名"
            :rules="[{ validator:regUserName, message: '姓名2-20位' }]"
          />
          <van-field label="证件类型：" v-model="reserveDetailsList.card_type" name="cardType" placeholder :disabled="true" />
          <van-field
            label="证件号码："
            v-model="reserveDetailsList.idcardno"
            name="cardNum"
            :disabled="true"
            placeholder="请输入证件号码"
            :rules="[{ validator:regCardNum, message: '请输入正确的证件号码' }]"
          />
          <van-field
            label="联系电话："
            v-model="reserveDetailsList.mobile"
            name="regUserTel"
            :disabled="true"
            placeholder="请输入电话号码"
            :rules="[{ validator:regUserTel, message: '请输入正确的电话号码' }]"
          />
          <van-field name="radio" label="是否为居家隔离人员：" label-width="130px">
            <template #input>
              <van-radio-group v-model="reserveDetailsList.is_isolation" direction="horizontal">
                <van-radio name="0">是</van-radio>
                <van-radio name="1">否</van-radio>
              </van-radio-group>
            </template>
          </van-field>
          <van-field
            readonly
            clickable
            label="预约墓地："
            :value="reserveDetailsList.organ_name"
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
            :value="reserveDetailsList.ro_time"
            label="预约祭扫日期："
            placeholder="点击选择日期"
            @click="showDate = true"
          />
          <van-calendar v-model="showDate" @confirm="onConfirmDate" />

          <van-field
            readonly
            clickable
            label="预约时段："
            :value="reserveDetailsList.ro_timeframe"
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
            :value="reserveDetailsList.ro_tripmode"
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
              <van-radio-group v-model="reserveDetailsList.ro_peoplenum" direction="horizontal">
                <van-radio name="1">1</van-radio>
                <van-radio name="2">2</van-radio>
                <van-radio name="3">3</van-radio>
              </van-radio-group>
            </template>
          </van-field>
        </van-form>
      </div>
      <div v-if="reserveDetailsList.ro_peoplenum == 2 || reserveDetailsList.ro_peoplenum == 3" class="editUser">
        <van-form validate-first>
          <p class="partnerTitle">同行者1</p>
          <van-field
            label="姓名："
            v-model="reserveDetailsList.ro_name1"
            name="regUserName"
            placeholder="请输入同行者姓名"
            :rules="[{ validator:regUserName, message: '姓名2-20位' }]"
          />
          <van-field label="证件类型："
           v-model="reserveDetailsList.card_type1"
            name="cardType" 
            placeholder
            @click="showcard_type1 = true"
            />
          <van-popup v-model="showcard_type1" position="bottom">
            <van-picker
              show-toolbar
              :columns="addressCard_type1"
              @confirm="onConfirmCard_type1"
              @cancel="showcard_type1 = false"
            />
          </van-popup>
          <van-field
            label="证件号码："
            v-model="reserveDetailsList.ro_idno1"
            name="reserveDetailsList.idno1"
            placeholder="请输入证件号码"
            :rules="[{ validator:regCardNum, message: '请输入正确的证件号码' }]"
          />
          <van-field
            readonly
            clickable
            name="tripmode"
            :value="reserveDetailsList.ro_tripmode1"
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
              <van-radio-group v-model="reserveDetailsList.is_isolation1" direction="horizontal">
                <van-radio name="0">是</van-radio>
                <van-radio name="1">否</van-radio>
              </van-radio-group>
            </template>
          </van-field>
        </van-form>
      </div>
      <div v-if="reserveDetailsList.ro_peoplenum == '3'" class="editUser">
        <van-form validate-first>
          <p class="partnerTitle">同行者2</p>
          <van-field
            label="姓名："
            v-model="reserveDetailsList.ro_name2"
            name="validator"
            placeholder="请输入同行者姓名"
            :rules="[{ validator:regUserName, message: '姓名2-20位' }]"
          />
          <van-field label="证件类型："
           v-model="reserveDetailsList.card_type2"
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
            v-model="reserveDetailsList.ro_idno2"
            name="regCardNum2"
            placeholder="请输入证件号码"
            :rules="[{ validator:regCardNum, message: '请输入正确的证件号码' }]"
          />
          <van-field
            readonly
            clickable
            name="tripmode"
            :value="reserveDetailsList.ro_tripmode2"
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
              <van-radio-group v-model="reserveDetailsList.is_isolation2" direction="horizontal">
                <van-radio name="0">是</van-radio>
                <van-radio name="1">否</van-radio>
              </van-radio-group>
            </template>
          </van-field>
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
import { regTel, regIdCard } from "../../utils/transform.js";
import Head from '../../components/Head.vue';
import { Toast } from "vant";
export default {
  data() {
    return {
      addressCard_type1:[
        '内地居民身份证',
        '香港居民身份证',
        '澳门居民身份证',
        '台湾居民身份证',
        '护照',
        '军官证',
        '士兵证',
        '其他有效国籍旅行证',
      ],
      addressCard_type2:[
        '内地居民身份证',
        '香港居民身份证',
        '澳门居民身份证',
        '台湾居民身份证',
        '护照',
        '军官证',
        '士兵证',
        '其他有效国籍旅行证',
      ],
      tripmodeColumns:["公共交通", "自驾", "其他"],
      showtripmode:false,
      showtripmode1: false,
      showtripmode2: false,
      showcard_type2:false,
      showcard_type1:false,
      reserveDetailsList:{},
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
      userCount: '1',
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
    let url = localStorage.getItem('routerData');
    this.reserveDetailsList = JSON.parse(url);
    if(this.reserveDetailsList.ro_tripmode == '10'){
      this.reserveDetailsList.ro_tripmode = '公共交通'
    }else if(this.reserveDetailsList.ro_tripmode == '20'){
      this.reserveDetailsList.ro_tripmode = '自驾'
    }else if(this.reserveDetailsList.ro_tripmode == '30'){
      this.reserveDetailsList.ro_tripmode = '其他'
    }
    if(this.reserveDetailsList.ro_tripmode1 == '10'){
      this.reserveDetailsList.ro_tripmode1 = '公共交通'
    }else if(this.reserveDetailsList.ro_tripmode1 == '20'){
      this.reserveDetailsList.ro_tripmode1 = '自驾'
    }else if(this.reserveDetailsList.ro_tripmode1 == '30'){
      this.reserveDetailsList.ro_tripmode1 = '其他'
    }
    if(this.reserveDetailsList.ro_tripmode2 == '10'){
      this.reserveDetailsList.ro_tripmode2 = '公共交通'
    }else if(this.reserveDetailsList.ro_tripmode2 == '20'){
      this.reserveDetailsList.ro_tripmode2 = '自驾'
    }else if(this.reserveDetailsList.ro_tripmode2 == '30'){
      this.reserveDetailsList.ro_tripmode2 = '其他'
    }
    this.reserveDetailsList.ro_time = this.formatTime(this.reserveDetailsList.ro_time);
    console.log(this.reserveDetailsList);
    if(this.reserveDetailsList.card_type=='10'){
      this.reserveDetailsList.card_type = "内地居民身份证"
    }else if(this.reserveDetailsList.card_type=='20'){
      this.reserveDetailsList.card_type = "香港居民身份证"
    }else if(this.reserveDetailsList.card_type=='30'){
      this.reserveDetailsList.card_type = "澳门居民身份证"
    }else if(this.reserveDetailsList.card_type=='40'){
      this.reserveDetailsList.card_type = "台湾居民身份证"
    }else if(this.reserveDetailsList.card_type=='50'){
      this.reserveDetailsList.card_type = "护照"
    }else if(this.reserveDetailsList.card_type=='60'){
      this.reserveDetailsList.card_type = "军官证"
    }else if(this.reserveDetailsList.card_type=='70'){
      this.reserveDetailsList.card_type = "士兵证"
    }else if(this.reserveDetailsList.card_type=='80'){
      this.reserveDetailsList.card_type = "其他有效国籍旅行证"
    }
    if(this.reserveDetailsList.card_type1=='10'){
      this.reserveDetailsList.card_type1 = "内地居民身份证"
    }else if(this.reserveDetailsList.card_type1=='20'){
      this.reserveDetailsList.card_type1 = "香港居民身份证"
    }else if(this.reserveDetailsList.card_type1=='30'){
      this.reserveDetailsList.card_type1 = "澳门居民身份证"
    }else if(this.reserveDetailsList.card_type1=='40'){
      this.reserveDetailsList.card_type1 = "台湾居民身份证"
    }else if(this.reserveDetailsList.card_type1=='50'){
      this.reserveDetailsList.card_type1 = "护照"
    }else if(this.reserveDetailsList.card_type1=='60'){
      this.reserveDetailsList.card_type1 = "军官证"
    }else if(this.reserveDetailsList.card_type1=='70'){
      this.reserveDetailsList.card_type1 = "士兵证"
    }else if(this.reserveDetailsList.card_type1=='80'){
      this.reserveDetailsList.card_type1 = "其他有效国籍旅行证"
    }
    if(this.reserveDetailsList.card_type2=='10'){
      this.reserveDetailsList.card_type2 = "内地居民身份证"
    }else if(this.reserveDetailsList.card_type2=='20'){
      this.reserveDetailsList.card_type2 = "香港居民身份证"
    }else if(this.reserveDetailsList.card_type2=='30'){
      this.reserveDetailsList.card_type2 = "澳门居民身份证"
    }else if(this.reserveDetailsList.card_type2=='40'){
      this.reserveDetailsList.card_type2 = "台湾居民身份证"
    }else if(this.reserveDetailsList.card_type2=='50'){
      this.reserveDetailsList.card_type2 = "护照"
    }else if(this.reserveDetailsList.card_type2=='60'){
      this.reserveDetailsList.card_type2 = "军官证"
    }else if(this.reserveDetailsList.card_type2=='70'){
      this.reserveDetailsList.card_type2 = "士兵证"
    }else if(this.reserveDetailsList.card_type2=='80'){
      this.reserveDetailsList.card_type2 = "其他有效国籍旅行证"
    }
    this.getCemetery();
  },
  methods: {
    formatTime(time) {
      const date = new Date(Number(time));
      const y = date.getFullYear();
      const m = date.getMonth() + 1;
      const d = date.getDay();
      return y + "-" + m + "-" + d ;
    },
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
      let date = new Date(this.reserveDetailsList.ro_time);
      this.reserveDetailsList.ro_time = date.getTime(date);
      if(this.reserveDetailsList.organ_name=="北京市八宝山人民公墓"){
            this.reserveDetailsList.organ_name = '2'
          }else if(this.reserveDetailsList.organ_name=="北京市八宝山革命公墓"){
            this.reserveDetailsList.organ_name = '1'
          }
          if(this.reserveDetailsList.card_type=='内地居民身份证'){
            this.reserveDetailsList.card_type = "10"
          }else if(this.reserveDetailsList.card_type=='香港居民身份证'){
            this.reserveDetailsList.card_type = "20"
          }else if(this.reserveDetailsList.card_type=='澳门居民身份证'){
            this.reserveDetailsList.card_type = "30"
          }else if(this.reserveDetailsList.card_type=='台湾居民身份证'){
            this.reserveDetailsList.card_type = "40"
          }else if(this.reserveDetailsList.card_type=='护照'){
            this.reserveDetailsList.card_type = "50"
          }else if(this.reserveDetailsList.card_type=='军官证'){
            this.reserveDetailsList.card_type = "60"
          }else if(this.reserveDetailsList.card_type=='士兵证'){
            this.reserveDetailsList.card_type = "70"
          }else if(this.reserveDetailsList.card_type=='其他有效国籍旅行证'){
            this.reserveDetailsList.card_type = "80"
          }
          if(this.reserveDetailsList.ro_tripmode == '公共交通'){
            this.reserveDetailsList.ro_tripmode = '10'
          }else if(this.reserveDetailsList.ro_tripmode == '自驾'){
            this.reserveDetailsList.ro_tripmode = '20'
          }else if(this.reserveDetailsList.ro_tripmode == '其他'){
            this.reserveDetailsList.ro_tripmode = '30'
          }
          
          console.log(this.reserveDetailsList.is_isolation1)
          let parse = {};
          parse.orderId = this.reserveDetailsList.ro_id;
          parse.realname = this.reserveDetailsList.realname;
          parse.card_type = this.reserveDetailsList.card_type;
          parse.idcardno = this.reserveDetailsList.idcardno;
          parse.mobile = this.reserveDetailsList.mobile;
          parse.is_isolation = this.reserveDetailsList.is_isolation;
          parse.isolation1 = this.reserveDetailsList.is_isolation1;
          parse.organ = this.reserveDetailsList.organ_name;
          parse.time = this.reserveDetailsList.ro_time;
          parse.timeframe = this.reserveDetailsList.ro_timeframe;
          parse.tripmode = this.reserveDetailsList.ro_tripmode;
          parse.peoplenum = this.reserveDetailsList.ro_peoplenum;
          parse.name1 = this.reserveDetailsList.ro_name1;
          parse.card_type1 = this.reserveDetailsList.card_type1;
          parse.idno1 = this.reserveDetailsList.ro_idno1;
          parse.tripmode1 = this.reserveDetailsList.ro_tripmode1;
          parse.name2 = this.reserveDetailsList.ro_name2;
          parse.card_type2 = this.reserveDetailsList.card_type2;
          parse.idno2 = this.reserveDetailsList.ro_idno2;
          parse.tripmode2 = this.reserveDetailsList.ro_tripmode2;
          parse.isolation2 = this.reserveDetailsList.is_isolation2;
          if(parse.tripmode1 == '公共交通'){
            parse.tripmode1 = '10'
          }else if(parse.tripmode1 == '自驾'){
            parse.tripmode1 = '20'
          }else if(parse.tripmode1 == '其他'){
            parse.tripmode1 = '30'
          }
          if(parse.card_type1=='内地居民身份证'){
            parse.card_type1 = "10"
          }else if(parse.card_type1=='香港居民身份证'){
            parse.card_type1 = "20"
          }else if(parse.card_type1=='澳门居民身份证'){
            parse.card_type1 = "30"
          }else if(parse.card_type1=='台湾居民身份证'){
            parse.card_type1 = "40"
          }else if(parse.card_type1=='护照'){
            parse.card_type1 = "50"
          }else if(parse.card_type1=='军官证'){
            parse.card_type1 = "60"
          }else if(parse.card_type1=='士兵证'){
            parse.card_type1 = "70"
          }else if(parse.card_type1=='其他有效国籍旅行证'){
            parse.card_type1 = "80"
          }
      if(this.reserveDetailsList.ro_peoplenum == '1'){
        if(this.reserveDetailsList.is_isolation ==''||
           this.reserveDetailsList.organ_name ==''||
           this.reserveDetailsList.ro_time ==''||
           this.reserveDetailsList.ro_time ==''||
           this.reserveDetailsList.ro_timeframe==''||this.reserveDetailsList.ro_peoplenum == ''
         ){
          Toast("请填写完整信息!");
        }else {
          const res = await ReserveAction.editReserve({
            ...parse
          });
        if(res.error == 0) {
          Toast("保存成功");
          this.$router.push({ name: "searchReserve" });
          } else {
            Toast.fail(res.msg);
          }
       }
      }else if(this.reserveDetailsList.ro_peoplenum == '2'){
         
          
        console.log(parse);
             const res = await ReserveAction.editReserve({
            ...parse
          });
        if(res.error == 0) {
          Toast("保存成功");
          this.$router.push({ name: "searchReserve" });
          } else {
            Toast.fail(res.msg);
        }
       }else if(this.reserveDetailsList.ro_peoplenum == '3'){
          if(parse.card_type2=='内地居民身份证'){
            parse.card_type2 = "10"
          }else if(parse.card_type2=='香港居民身份证'){
            parse.card_type2 = "20"
          }else if(parse.card_type2=='澳门居民身份证'){
            parse.card_type2 = "30"
          }else if(parse.card_type2=='台湾居民身份证'){
            parse.card_type2 = "40"
          }else if(parse.card_type2=='护照'){
            parse.card_type2 = "50"
          }else if(parse.card_type2=='军官证'){
            parse.card_type2 = "60"
          }else if(parse.card_type2=='士兵证'){
            parse.card_type2 = "70"
          }else if(parse.card_type2=='其他有效国籍旅行证'){
            parse.card_type2 = "80"
          }
          if(parse.tripmode2 == '公共交通'){
            parse.tripmode2 = '10'
          }else if(parse.tripmode2== '自驾'){
            parse.tripmode2= '20'
          }else if(parse.tripmode1 == '其他'){
            parse.tripmode2 = '30'
          }
         const res = await ReserveAction.editReserve({
            ...parse
          });
        if(res.error == 0) {
          Toast("保存成功");
          this.$router.push({ name: "searchReserve" });
          } else {
            Toast.fail(res.msg);
          // }
       }
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
      this.reserveDetailsList.ro_time = this.formatDate(date);
    },
    onConfirmTime(value) {
      this.reserveDetailsList.ro_timeframe = value;
      this.showPickerTime = false;
    },
     //获取墓地列表
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
        console.log(address);
      }
    },
    onConfirmCard_type1(val){
      this.showcard_type1 = false;
      this.reserveDetailsList.card_type1 = val;
    },
    onConfirmCard_type2(val){
       this.showcard_type2 = false;
      this.reserveDetailsList.card_type2 = val;
    },
    onTripmode(val){
      this.reserveDetailsList.ro_tripmode = val;
      this.showtripmode = false;
    },
    onTripmode1(val){
      this.reserveDetailsList.ro_tripmode1 = val;
      this.showtripmode1 = false;
    },
    onTripmode2(val){
      this.reserveDetailsList.ro_tripmode2 = val;
      this.showtripmode2 = false;
    }
  },
  components:{
    Head
  }
};
</script>

<style lang="scss" scoped>
.editReserve{
  display: flex;
  flex-direction: column;
  height: 100%;
}
header{
  height: 0.86rem;
}
.main{
  flex: 1;
  height: 100%;
  overflow-y: scroll;
}
.editUser {
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