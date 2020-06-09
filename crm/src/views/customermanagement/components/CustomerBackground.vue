<!-- CustomerBackground -->
<template>
  <div class="customer-background">
    <div class="new-bg-btn">
      <el-button class="rc-head-item" @click="handleClick()" type="primary"
        >新增客戶背景</el-button
      >
    </div>
    <p
      v-empty="flag"
      v-if="flag"
      xs-empty-text="暂无数据"
      style="minHeight: 500px"
    ></p>
    <div class="list-content-box" v-if="!flag">
      <div v-for="(item, index) in list" :key="index">
        <div
          class="bg-details-show-boxs"
          :style="{ 'border-left-color': leftRedBorder(item) }"
        >
          <div class="bg-details-show-left-edit" @click="handleClick(item)">
            <img src="../../../assets/edit.svg" alt="edit" />
          </div>
          <div
            class="bg-details-show-right-content"
            :style="{ 'border-bottom-color': leftRedBorder(item) }"
          >
            <div class="content-head mG10">
              <div class="sellingIndustry">
                <h2 class="retail" :style="{ color: leftRedBorder(item) }">
                  零售業
                </h2>
                <span
                  class="mainFont"
                  :style="{ backgroundColor: leftRedBorder(item) }"
                  >{{ item.category && item.category.substring(0, 1) }}</span
                >
              </div>
              <div class="head-right">
                <span>
                  更新時間：{{
                    item.update_time
                      | filterTimestampToFormatTime("YYYY-MM-DD HH:mm:ss")
                  }}
                </span>
                <span>操作人：{{ item.owner_user_id }}</span>
              </div>
            </div>
            <div class="content-company-name mG10">
              <span class="title-w60">公司名稱</span>
              <span class="field">{{ item.company_name }}</span>
              <span v-if="item.listed_company_value" class="city">市</span>
              <span class="field" v-if="item.listed_company=='是'">{{ item.company_code }}</span>
            </div>
            <div class="content-registered-capital">
              <div>
                <div class="capital mG10">
                  <span class="title-w60">註冊資金</span>
                  <span class="field">{{ item.register_capital }}</span>
                  <UnitComponent />
                </div>
                <div class="mG10">
                  <span class="title-w60">規模</span>
                  <span class="field">{{ item.company_size }}</span>
                </div>
                <div class="mG10">
                  <span class="title-w60">財務狀況</span>
                  <span class="field">{{ item.financial_status }}</span>
                </div>
              </div>
              <div>
                <div class="mG10">
                  <span class="title-w60">就業情況</span>
                  <span class="field">{{ item.employment_status }}</span>
                </div>
                <div class="mG10">
                  <span class="title-w60">職位</span>
                  <span class="field">{{ item.position }}</span>
                </div>
              </div>
              <div>
                <span class="remarks-title title-w60">備註</span>
                <span class="field remarks-content">{{ item.remark }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <c-r-m-create-view
      v-if="visibleForm"
      :titleList="titleDataList"
      crmType="customer"
      :action="createActionInfo"
      currentHash="crm_customer_background"
      @save-edit-success-get-customer-detail="getCrmCustomerDetail"
    />
  </div>
</template>

<script>
// 列表假数据
// import { newCustomeBgTableList } from "../../../assets/data/newCustomerBackground/newCustomeBgTableList";
import UnitComponent from "../../../components/UnitComponent";
import CRMCreateView from "./CRMCreateView";
import loading from "../mixins/loading";
// 新 api
import { crmCustomerDetail } from "@/api/new-api/common";
import { Message } from "element-ui";

export default {
  name: "CustomerBackground",
  //import引入的组件需要注入到对象中才能使用
  components: {
    CRMCreateView,
    UnitComponent
  },
  mixins: [loading],
  data() {
    //这里存放数据
    return {
      titleDataList:'',
      flag: false,
      visibleForm: false,
      list: [],
      flagTitle: "",
      createActionInfo: { type: "save" }
    };
  },
  //监听属性 类似于data概念
  computed: {},
  //监控data中的数据变化
  watch: {
    // 監聽 id 改變重新請求 客戶背景 數據
    id: function() {
      this.getCrmCustomerDetail();
    }
  },
  props: {
    //   // 详情信息id
    id: [String, Number]
  },
  //方法集合
  methods: {
    leftRedBorder(item) {
      return item.category_value === 1 ? "#b74f4f" : "#3aa973";
    },
    //新增
    handleClick(editItem = {}) {
      this.titleDataList = '新增客戶背景'
      this.visibleForm = true;
      this.createActionInfo.currentItem = { customer_id: this.id };
      this.createActionInfo.request_type = "background";
      this.createActionInfo.type = "save";
      if (editItem.hasOwnProperty("customer_id")) {
        this.titleDataList = '編輯客戶背景'
        this.createActionInfo.type = "update";
        this.createActionInfo.currentItem = editItem;
      }
    },
    handleCancelCancel() {
      this.visibleForm = false;
      this.createActionInfo.type = "save";
    },
    handleEditConfirm() {
      this.visibleForm = false;
      this.createActionInfo.type = "save";
    },
    getCrmCustomerDetail() {
      this.loading = true;
      const params = {
        request_type: "background",
        customer_id: this.id,
        page: 1,
        limit: 10
      };
      crmCustomerDetail(params)
        .then(res => {
          const {
            data: { list, dataCount }
          } = res;
          this.list = list;
          this.loading = false;
          if (this.list.length == 0) {
            this.flag = true;
          } else {
            this.flag = false;
          }
          this.handleCancelCancel();
        })
        .catch(data => {
          this.loading = false;
        });
    }
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    // 获取列表数据
    this.getCrmCustomerDetail();
  },
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    // this.Bus.$on("transmitId", data => {
    //   if (data) {
    //     this.id = data.customer_id;
    //     this.createActionInfo.currentItem = { customer_id: this.id };
    //     this.Bus.$emit("transmitdistinguishedGuest", this.id);
    //     this.getCrmCustomerDetail();
    //   }
    // });
    this.Bus.$on("flagFalse", data => {
      this.visibleForm = false;
    });
  },
  beforeDestroy() {} //生命周期 - 销毁之前
};
</script>
<style lang="scss" scoped>
.field {
  font-size: 14px;
  font-weight: normal;
}
.mG10 {
  margin-bottom: 10px;
}
.editer-p {
  width: 100%;
  text-align: center;
}
.title-w60 {
  width: 60px;
  font-size: 12px;
  display: inline-block;
  color: #7d7d7d;
}
.customer-background {
  border: 1px solid #f5f4f5;
}
.new-bg-btn {
  background-color: #f6f6f6;
  padding: 10px 20px 10px 0;
  display: flex;
  justify-content: flex-end;
}
.list-content-box {
  max-height: 70vh;
  overflow-x: hidden;
  overflow-y: auto;
}
.bg-details-show-boxs {
  width: 100%;
  margin-bottom: 5px;
  display: flex;
  border-left: 2px solid;
}
.bg-details-show-left-edit {
  width: 50px;
  background-color: #faf9f9;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  &:hover {
    background-color: #a6a3a3;
  }
  img {
    width: 20px;
    height: 20px;
  }
}
.bg-details-show-right-content {
  flex: 1 1;
  border-bottom: 2px solid;
  margin-left: 10px;
  .content-head {
    display: flex;
    justify-content: space-between;
    .sellingIndustry {
      margin-top: 10px;
    }
    .retail {
      display: inline-block;
    }
    .mainFont {
      color: #ffff;
      font-size: 22px;
      width: 35px;
      height: 35px;
      display: inline-block;
      border-radius: 100%;
      text-align: center;
      line-height: 35px;
      font-weight: bold;
    }
    .head-right {
      margin: 7px 7px 0 0;
      color: #7d7d7d;
    }
  }
  .content-company-name {
    .city {
      display: inline-block;
      width: 20px;
      height: 20px;
      background-color: #41aded;
      color: #fff;
      border-radius: 5px;
      text-align: center;
      line-height: 20px;
    }
  }
  .content-registered-capital {
    display: flex;
    // align-items: center;
    justify-content: space-between;
    .capital {
      display: flex;
      align-items: center;
    }
    .remarks-title {
      vertical-align: top;
    }
    .remarks-content {
      display: inline-block;
      width: 300px;
    }
  }
}
</style>
