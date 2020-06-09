<template>
  <div class="rc-cont">
    <div class="new-bg-btn">
      <el-button class="rc-head-item" @click="handleClick()" type="primary"
        >新增購物</el-button
      >
    </div>
    <el-collapse
      v-model="activeNames"
      @change="handleChange"
      class="rc-cont-collapse"
    >
      <el-collapse-item title="未领取" name="1">
        <relative-unclaimed
          ref="childRelativeUnclaimed"
          crm-type="crm_customer_shop"
          @change-state-fun="changeStateFun"
          :cus_tomer_id="id"
        />
      </el-collapse-item>
      <el-collapse-item title="已领取" name="2">
        <relativealready-received
          ref="childRelativealreadyReceived"
          crm-type="crm_customer_shop"
          :cus_tomer_id="id"
        />
      </el-collapse-item>
    </el-collapse>
    <c-r-m-create-view
      v-if="isCreate"
      crm-type="crm_customer_shop"
      currentHash="crm_customer_shop"
      :action="createActionInfo"
      @save-edit-success-get-customer-detail="editSaveSuccess"
      @hiden-view="isCreate = false"
      titleList="新增購物"
    ></c-r-m-create-view>
  </div>
</template>

<script type="text/javascript">
import RelativealreadyReceived from "./RelativealreadyReceived";
import RelativeUnclaimed from "./RelativeUnclaimed";
import CRMCreateView from "./CRMCreateView";
// import { CustomerDetail } from "@/api/new-api/common"
export default {
  name: "ShoppingRecord", //相关操作  可能再很多地方展示 放到客户管理目录下
  components: {
    RelativealreadyReceived,
    RelativeUnclaimed,
    CRMCreateView
  },
  computed: {},
  data() {
    return {
      activeNames: ["1"],
      isCreate: false,
      createActionInfo: { type: "save" }
    };
  },
  watch: {
    id: function(val) {
      this.id = val;
    }
  },
  props: {
    // 详情信息id
    id: [String, Number]
  },
  mounted() {},
  methods: {
    handleClick() {
      this.isCreate = true;
      this.createActionInfo.currentItem = { customer_id: this.id };
      this.createActionInfo.request_type = "shop";
      // if (editItem.hasOwnProperty("customer_id")) {
      //   this.createActionInfo.type = "update";
      //   this.createActionInfo.currentItem = editItem;
      // }
    },
    handleChange() {},
    editSaveSuccess() {
      this.$refs.childRelativeUnclaimed.getDetail();
      this.$refs.childRelativealreadyReceived.getDetail();
      this.isCreate = false;
    },
    changeStateFun() {
      this.$refs.childRelativealreadyReceived.getDetail();
    }
  }
};
</script>
<style lang="scss" scoped>
.new-bg-btn {
  background-color: #f6f6f6;
  padding: 10px 20px 10px 0;
  display: flex;
  justify-content: flex-end;
}
.rc-cont-collapse {
  overflow-y: auto;
  max-height: calc(100vh - 200px);
}
</style>
