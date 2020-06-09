<template>
  <el-container class="crm-create">
    <p
      v-empty="list.length === 0"
      v-if="list.length === 0"
      xs-empty-text="暂无数据"
      style="minHeight: 500px;width: 100%"
    ></p>
    <div class="crm-create-body" v-if="list.length !== 0">
      <div
        v-for="(item, index) in list"
        :key="index"
        style="width:100%;height:320px;"
      >
        <div class="icon-aside-div" @click="compileClick(item)">
          <img src="../../../assets/edit.svg" alt="edit" style="width:24px;" />
        </div>
        <div class="icon-main-div">
          <p style="font-size:18px;color:red;line-height:30px">
            {{ item.vip_room }}貴賓廳
          </p>
          <div class="operation">
            <span
              >操作時間:
              {{
                item.update_time
                  | filterTimestampToFormatTime("YYYY-MM-DD HH:mm:ss")
              }}</span
            >
            <span style="padding-left:20px"
              >操作人: {{ item.owner_user_id }}</span
            >
          </div>
          <span>時間段:</span>
          <span
            >{{
              item.start_time
                | filterTimestampToFormatTime("YYYY-MM-DD HH:mm:ss")
            }}
          </span>
          <span> - </span>
          <span>
            {{
              item.end_time | filterTimestampToFormatTime("YYYY-MM-DD HH:mm:ss")
            }}
          </span>
          <span class="span-right">博彩産品:</span>
          <span>{{ item.gaming_products }}</span>
          <p class="form-item-p">營運</p>
          <span>最高營運金額:</span>
          <span>{{ item.max_amount }}</span>
          <span class="unit-component-w">
            <unit-component></unit-component>
          </span>
          <span class="span-right">平均營運金額:</span>
          <span>{{ item.average_amount }}</span>
          <span class="unit-component-w">
            <unit-component></unit-component>
          </span>
          <p class="form-item-p">股本及借貸</p>
          <span>股本:</span>
          <span>{{ item.capital_stock }}</span>
          <span class="unit-component-w">
            <unit-component></unit-component>
          </span>
          <span class="span-center">借貸額:</span>
          <span>{{ item.loan_amount }}</span>
          <span class="unit-component-w">
            <unit-component></unit-component>
          </span>
          <span class="span-center">欠款:</span>
          <span>{{ item.overdraft }}</span>
          <span class="unit-component-w">
            <unit-component></unit-component>
          </span>
          <p>
            <span>備注:</span>
            <span>{{ item.remark }} </span>
          </p>
          <!-- </el-form-item>
          <el-form-item> -->
          <p class="form-item-p">轉碼</p>
          <!-- </el-form-item>
          <el-form-item> -->
          <span>月轉碼:</span>
          <span>{{ item.monthly_transcoding }}</span>
          <span class="unit-component-w">
            <unit-component></unit-component>
          </span>
          <span class="span-right">傭金:</span>
          <span>{{ item.brokerage }}</span>
          <span class="unit-component-w">
            <unit-component></unit-component>
          </span>
          <!-- </el-form-item>
          <el-form-item> -->
          <p class="form-item-span">
            <span>合作內容:</span>
            <span>{{ item.cooperative_contents }}</span>
          </p>
          <!-- </el-form-item>
        </el-form> -->
        </div>
      </div>
    </div>
  </el-container>
</template>
<script>
import UnitComponent from "../../../components/UnitComponent/index";
// import { crmCustomerDetail } from "@/api/new-api/common";

export default {
  name: "distinguishedGuest",
  components: {
    UnitComponent
  },
  data() {
    return {
      items: [],
      flag: false,
      //  FormList:{},
      FormDataList: {
        vip_room: "",
        start_time: "",
        end_time: "",
        gaming_products: "",
        max_amount: "",
        average_amount: "",
        monthly_transcoding: "",
        brokerage: "",
        cooperative_contents: "",
        capital_stock: "",
        loan_amount: "",
        overdraft: "",
        remark: ""
      },
      createActionInfo: {}
    };
  },
  props: {
    list: {
      type: Array
    }
  },
  watch: {
    // flagData: function(val) {
    //   if (val === 1) {
    //     this.getPastGamblingExperience();
    //   }
    // }
  },
  created() {
    // 获取列表数据
    // this.getPastGamblingExperience();
  },
  mounted() {
    // this.Bus.$on("transmitdistinguishedGuest", data => {
    //   this.customer_id = data;
    //   this.getPastGamblingExperience();
    //   if (data) {
    //     this.Bus.$emit("transmitShoppingRecord", this.customer_id);
    //   }
    // });
    // this.FormDataList = this.FormList;
  },
  methods: {
    // getPastGamblingExperience() {
    //   const params = {
    //     request_type: "experience",
    //     customer_id: this.customer_id,
    //     page: 1,
    //     limit: 10
    //   };
    //   crmCustomerDetail(params).then(res => {
    //     const {
    //       data: { list, dataCount }
    //     } = res;
    //     if (list.length > 0) {
    //       this.items = list;
    //     } else if (list.length == 0) {
    //       this.flag = true;
    //     }
    //   });
    //   this.flagData = 0;
    // },
    compileClick(data) {
      this.$emit("compileClose", data);
    }
  }
};
</script>
<style lang="scss" scoped>
// .el-form-item {
//   margin-bottom: 0px;
//   /deep/ .el-form-item__content {
//     line-height: 30px !important;
//   }
// }
.form-item-p {
  font-size: 16px;
}
.crm-create {
  width: 100%;
  min-height: 500px;
  overflow: auto;
}
.crm-create-body {
  position: relative;
  width: 100%;
  height: 310px;
}
.icon-aside-div {
  position: absolute;
  display: inline-block;
  width: 40px;
  height: 310px;
  line-height: 310px;
  text-align: center;
  border-left: 2px solid red;
  cursor: pointer;
  &:hover {
    background-color: #a6a3a3;
  }
}

.icon-main-div {
  position: relative;
  display: inline-block;
  width: 94%;
  margin-left: 45px;
  height: 310px;
  border-bottom: 2px solid red;
}
.img-aside {
  height: 365px;
  line-height: 365px;
  border-left: 2px solid red;
  cursor: pointer;
  &:hover {
    background-color: #a6a3a3;
  }
}
.operation {
  position: absolute;
  top: 0px;
  right: 30px;
}
.i-edit {
  font-size: 36px;
}
.el-row {
  line-height: 20px;
}
.unit-component-w {
  display: inline-block;
  vertical-align: middle;
}
.span-right {
  padding-left: 25%;
}
.span-center {
  padding-left: 15%;
}
span {
  line-height: 30px;
}
</style>
