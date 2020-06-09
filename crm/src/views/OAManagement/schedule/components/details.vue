<template>
  <div class="details">
    <el-dialog
      :title="listData.title"
      :visible.sync="dialogVisible"
      width="400px"
      :modal="false"
      top="30vh"
      :before-close="handleClose"
    >
      <div class="content">
        <div v-for="(item, index) in list" :key="index" class="list-data">
          <label>{{ item.label }}：</label>
          <span v-if="item.type == 'time' && listData.create_time">{{
            listData[item.value] | moment("YYYY-MM-DD HH:mm:ss")
          }}</span>
          <span v-else-if="item.type == 'create_time'">{{
            listData[item.value] | moment("YYYY-MM-DD HH:mm:ss")
          }}</span>
          <span v-else-if="item.type == 'ownerList'" class="owner-list">
            <span v-for="(k, j) in listData[item.value]" :key="j">
              <el-tooltip
                placement="bottom"
                effect="light"
                popper-class="tooltip-change-border"
              >
                <div slot="content">
                  <!-- <span>{{ k.realname }}</span> -->
                </div>
                <div
                  v-photo="k"
                  v-lazy:background-image="
                    $options.filters.filterUserLazyImg(k.thumb_img)
                  "
                  :key="k.thumb_img"
                  class="div-photo header-circle"
                ></div>
              </el-tooltip>
            </span>
          </span>
          <span v-else-if="item.type == 'remindtype'">{{
            listData.remindtypeText
          }}</span>
          <!-- <span v-else-if="item.type == 'create_person'">{{
            listData.create_user_info.realname
          }}</span> -->
          <span v-else-if="item.type == 'bz'">{{ listData[item.value] }}</span>
        </div>
        <!-- 关联业务 -->
        <!-- <related-business :marginLeft="'0'"
                          :alterable="false"
                          :allData="allData"
                          :alterableColor="'#666'"
                          @checkRelatedDetail="checkRelatedDetail">
        </related-business> -->
      </div>
      <!-- v-if="listData.permission && listData.permission.is_delete == 1"
        v-if="listData.permission && listData.permission.is_update == 1" v-if="btnShow" -->
      <span slot="footer" class="dialog-footer" >
        <el-button
          type="primary"
          
          @click="editBtn"
          >編輯</el-button
        >
        <el-button
          type="danger"
          
          @click="deleteClose"
          >刪除</el-button
        >
      </span>
    </el-dialog>
    <c-r-m-full-screen-detail
      :visible.sync="showRelatedDetail"
      :crmType="relatedCRMType"
      :id="relatedID"
    >
    </c-r-m-full-screen-detail>
  </div>
</template>

<script>
import { scheduleDelete } from "@/api/oamanagement/schedule";
// 关联业务 - 选中列表
import relatedBusiness from "@/components/relatedBusiness";
import CRMFullScreenDetail from "@/views/customermanagement/components/CRMFullScreenDetail";
export default {
  components: {
    relatedBusiness,
    CRMFullScreenDetail
  },
  data() {
    return {
      list: [
        { label: "類型", value: "travel_type", type: "time" },
        { label: "類別", value: "type", type: "time" },
        { label: "創建時間", value: "create_time", type: "time" },
        { label: "地點", value: "address", type: "time" },
        // { label: "創建時間", value: "create_time", type: "create_time" },
        // { label: "備註", value: "remark", type: "bz" }
      ],
      allData: {},
      // 相关详情的查看
      relatedID: "",
      relatedCRMType: "",
      showRelatedDetail: false
    };
  },
  created() {
    let newVal = this.listData;
    this.allData.business = newVal.businessList ? newVal.businessList : "";
    this.allData.contacts = newVal.contactsList ? newVal.contactsList : "";
    this.allData.contract = newVal.contractList ? newVal.contractList : "";
    this.allData.customer = newVal.customerList ? newVal.customerList : "";
    switch (newVal.remindtype) {
      case 0:
        newVal.remindtypeText = "無";
        break;
      case 1:
        newVal.remindtypeText = "準時提醒";
        break;
      case 2:
        newVal.remindtypeText = "5分鐘前";
        break;
      case 3:
        newVal.remindtypeText = "15分鐘前";
        break;
      case 4:
        newVal.remindtypeText = "30分鐘前";
        break;
      case 5:
        newVal.remindtypeText = "一個小時前";
        break;
      case 6:
        newVal.remindtypeText = "二個小時前";
        break;
      case 7:
        newVal.remindtypeText = "一天前";
        break;
      case 8:
        newVal.remindtypeText = "二天前";
        break;
      case 9:
        newVal.remindtypeText = "一週前";
        break;
    }
  },
  props: {
    dialogVisible: Boolean,
    listData: Object,
    // 是否显示编辑删除按钮
    btnShow: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    handleClose() {
      this.$emit("handleClose");
    },
    deleteClose() {
      this.$confirm("確定刪除?", "提示", {
        confirmButtonText: "確定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let params = {};
          params.request_type = "event";
          params.id = this.listData.id;
          scheduleDelete(params).then(res => {
            this.$emit("deleteClose", this.listData);
            this.$message({
              type: "success",
              message: "刪除成功!"
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消刪除"
          });
        });
    },
    editBtn() {
      this.listData.action = "update";
      this.$emit("editBtn", this.listData);
    },
    checkRelatedDetail(crmType, item) {
      this.relatedID = item.key;
      this.relatedCRMType = crmType;
      this.showRelatedDetail = true;
    }
  }
};
</script>

<style scoped lang="scss">
.details /deep/ .el-dialog {
  box-shadow: 0px 1px 8px 0px rgba(0, 0, 0, 0.3);
  .el-dialog__header {
    padding-left: 25px;
    padding-right: 40px;
  }
  .el-dialog__body {
    padding: 0 30px 30px;
    .content {
      padding-left: 5px;
      padding-top: 5px;
      .text {
        font-size: 16px;
        margin-bottom: 15px;
      }
      .list-data {
        margin-bottom: 15px;
        font-size: 13px;
        color: #333;
        label {
          width: 70px;
          display: inline-block;
          text-align: left;
          color: #666;
        }
        .owner-list {
          display: inline-block;
          vertical-align: middle;
          span {
            display: inline-block;
          }
          .div-photo {
            width: 25px;
            height: 25px;
            margin-right: 10px;
          }
        }
      }
      .list-data:nth-child(3) {
        label {
          vertical-align: middle;
        }
      }
      .related-business > span {
        display: none;
      }
    }
  }
}
</style>
