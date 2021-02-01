<template>
  <view class="add">
    <teacher-tree
      isCheck
      :teacherTag="teacherTag"
      v-show="teacherTag"
      :schoolInfo="schoolInfo"
      @close="teacherClose"
      @confirm="teacherSelcet"
      :classChecked="repairApprovalList"
    ></teacher-tree>
    <teacher-tree
      isCheck
      :teacherTag="teacherCopy"
      v-show="teacherCopy"
      :schoolInfo="schoolInfo"
      @close="teacherClose"
      @confirm="teacherCopySelcet"
      :classChecked="repairCopyList"
    ></teacher-tree>
    <u-select v-model="siteTag" :list="siteList" @confirm="confirm"></u-select>
    <scroll-view scroll-y="true" class="scroll-h u-bg-fff">
      <view class="u-fx-ac u-bd-b item-list" v-if="isSelect">
        <view class="tip">报修类别：</view>
        <view
          class="u-fx-f1 u-fx-je u-content-color"
          @click="changeName([...arguments, 5])"
          >{{ formData.materialTypeName }}</view
        >
        <view class="rit-icon"></view>
      </view>
      <view class="u-fx-ac u-bd-b item-list" v-if="isSelect">
        <view class="tip">报修名称：</view>
        <view
          class="u-fx-f1 u-fx-je u-content-color"
          @click="changeName([...arguments, 6])"
          >{{ formData.materialName }}</view
        >
        <view class="rit-icon"></view>
      </view>
      <view class="u-fx-ac u-bd-b item-list" v-if="isShow">
        <view class="tip"> 报修物品:</view>
        <view class="u-fx-f1"
          ><input
            maxlength="10"
            v-model="formData.materialRemark"
            class="item-input"
        /></view>
      </view>
      <view class="u-fx-ac u-bd-b item-list">
        <view class="tip">物品位置：</view>
        <view
          class="u-fx-f1 u-fx-je u-content-color"
          @click="changeSiteType([...arguments, 1])"
          >{{ formData.type }}</view
        >
        <view class="rit-icon"></view>
      </view>
      <view class="u-fx-ac u-bd-b item-list">
        <view class="tip"> 楼栋：</view>
        <view
          class="u-fx-f1 u-fx-je u-content-color"
          @click="changeSiteType([...arguments, 2])"
          >{{ formData.building }}</view
        >
        <view class="rit-icon"></view>
      </view>
      <view class="u-fx-ac u-bd-b item-list">
        <view class="tip">楼层：</view>
        <view
          class="u-fx-f1 u-fx-je u-content-color"
          @click="changeSiteType([...arguments, 3])"
          >{{ formData.floor }}</view
        >
        <view class="rit-icon"></view>
      </view>
      <view class="u-fx-ac u-bd-b item-list">
        <view class="tip">房间：</view>
        <view
          class="u-fx-f1 u-fx-je u-content-color"
          @click="changeSiteType([...arguments, 4])"
          >{{ formData.room }}</view
        >
        <view class="rit-icon"></view>
      </view>
      <view class="qui―fx u-bd-b item-list">
        <view> 报修原因：</view>
        <view class="u-fx-f1">
          <textarea
            class="item-input"
            v-model="formData.remark"
            maxlength="20"
          />
        </view>
      </view>
      <view class="u-fx u-bd-b item-list">
        <view>上传图片：<view>(最多上传5张图片)</view></view>
        <view class="u-fx-f1">
          <view class="u-fx-f1"
            ><an-upload-img
              total="5"
              v-model="photoList"
              class="upload"
            ></an-upload-img>
          </view>
        </view>
      </view>
   <view class="u-fx-ac u-bd-b item-list">
			  <view class="tip">审批人</view>
        <view @click="teacherTag = true" class="u-fx-f1 u-fx">
          <view class="copyer u-fx-f1 u-content-color u-tx-r">
               <text v-if="repairApprovalList.length === 0">请选择</text>
                <text v-if="repairApprovalList.length >3">已选{{repairApprovalList.length}}人</text>
             <u-tag 
              v-if="repairApprovalList.length <=3"
              v-for="(item,index) in repairApprovalList"
              :key="index"
              :text="item.userName"
              mode="light" 
              type="info" 
              class="mar-l10"
              />
          </view>
          <view class="rit-icon"></view>
        </view>
			</view>
      <view class="u-fx-ac u-bd-b item-list">
        <view>抄送人:</view>
        <view @click="teacherCopy = true" class="u-fx-f1 u-fx">
          <view class="copyer u-fx-f1 u-content-color u-tx-r">
                <text v-if="repairCopyList.length === 0">请选择</text>
              <text v-if="repairCopyList.length >3">已选{{repairCopyList.length}}人</text>
            <u-tag
              v-if="repairCopyList.length <=3"
              v-for="(item, index) in repairCopyList"
              :key="index"
              :text="item.userName"
              mode="light"
              type="info"
              class="mar-l10"
              style="margin: 4px;"
            />
          </view>
        </view>
        <view class="rit-icon"></view>
      </view>
    </scroll-view>
    <view class="footer-btn u-fx-ac">
      <u-button
        type="primary"
        class="u-fx-f1 u-mar-l u-mar-r u-type-primary-dark-bg"
        @click="submit"
        >提交</u-button
      >
    </view>
  </view>
</template>
<script>
import anUploadImg from "@/components/an-uploadImg/an-uploadImg";
import { actions, store } from "./store/index";
import eventBus from "@u/eventBus";
import tools from ".../../../utils/tools";
import teacherTree from "@/components/teacher-tree/teacher-tree";
export default {
  components: {
    teacherTree,
    anUploadImg,
  },
  data() {
    return {
      formData: {
        type: "请选择",
        typeCode: "",
        buildingCode: "",
        roomCode: "",
        floorCode: "",
        building: "请选择",
        floor: "请选择",
        room: "请选择",
        materialTypeName: "请选择",
        materialId: "",
        materialName: "请选择",
        materialTypeId: "",
        materialRemark: "",
        placeName: "",
        placeId: "",
        remark: "",
      },
      photoList: [],
      id: "",
      siteType: 1,
      siteList: [],
      siteTag: false,
      typeList: [
        {
          value: "100",
          label: "教室",
        },
        {
          value: "101",
          label: "宿舍",
        },
        {
          value: "102",
          label: "食堂",
        },
        {
          value: "103",
          label: "出入口",
        },
        {
          value: "104",
          label: "其它",
        },
      ],
      teacherTag: false,
      teacherCopy: false,
      schoolInfo: {
        schoolYearId: 0,
        schoolCode: "",
      },
      pageList: {
        page: 1,
        size: 20,
      },
      isShow: false,
      isSelect: true,
      repairApprovalList: [],
      repairCopyList: [],
    };
  },
  created() {
    this.schoolInfo.schoolCode = store.userInfo.schoolCode;
    this.schoolInfo.schoolYearId = store.schoolYear.schoolYearId;
  },
  methods: {
    teacherSelcet(value) {
      value.forEach((ele) => {
        if (ele.userCode === store.userInfo.userCode) {
          this.$tools.toast("审批人不能是自己!");
          return;
        } else {
          this.repairApprovalList = value;
          this.teacherTag = false;
        }
      });
    },
    teacherCopySelcet(value) {
      value.forEach((ele) => {
        if (ele.userCode === store.userInfo.userCode) {
          this.$tools.toast("抄送人不能是自己!");
          return;
        } else {
          this.repairCopyList = value;
          this.teacherCopy = false;
        }
      });
    },
    teacherClose() {
      this.teacherTag = false;
      this.teacherCopy = false;
    },
    changeName([e, type]) {
      this.siteType = type;
      if (type === 5) {
        this.siteList = [];
        const req = {
          schoolCode: store.userInfo.schoolCode,
          ...this.pageList,
        };
        actions.getTypeList(req).then((res) => {
          if (res.data.list.length !== 0) {
            this.siteTag = true;
            res.data.list.forEach((ele) => {
              this.siteList.push({
                label: ele.typeName,
                value: ele.id,
              });
            });
            this.siteList.push({ label: "其他", value: "" });
          } else {
            this.$tools.toast("该物品分类列表为空");
          }
        });
      } else if (type === 6) {
        this.siteList = [];
        if (this.formData.materialTypeId === "") {
          this.$tools.toast("请选择物品分类");
          return;
        }
        const req = {
          typeId: this.formData.materialTypeId,
          schoolCode: store.userInfo.schoolCode,
          ...this.pageList,
        };
        actions.getNameList(req).then((res) => {
          if (res.data.list.length !== 0) {
            this.siteTag = true;
            res.data.list.forEach((ele) => {
              this.siteList.push({
                label: ele.materialName,
                value: ele.id,
              });
            });
          } else {
            this.$tools.toast("该物品名称列表为空");
          }
        });
      }
    },
    changeSiteType([e, type]) {
      this.siteType = type;
      if (type === 1) {
        this.siteTag = true;
        this.siteList = this.typeList;
      } else if (type === 2) {
        this.siteList = [];
        if (this.formData.typeCode === "") {
          this.$tools.toast("请选择场地类型");
          return;
        }
        const req = {
          category: this.formData.typeCode,
          schoolCode: store.userInfo.schoolCode,
        };
        actions.getSiteList(req).then((res) => {
          if (res.data.length !== 0) {
            this.siteTag = true;
            res.data.forEach((ele) => {
              this.siteList.push({
                label: ele.name,
                value: ele.id,
              });
            });
          } else {
            this.$tools.toast("该类型场地列表为空");
          }
        });
      } else if (type === 3) {
        this.siteList = [];
        if (this.formData.buildingCode === "") {
          this.$tools.toast("请选择场地");
          return;
        }
        const req = {
          parentId: this.formData.buildingCode,
          schoolCode: store.userInfo.schoolCode,
        };
        actions.getChildSite(req).then((res) => {
          if (res.data.list.length !== 0) {
            this.siteTag = true;
            res.data.list.forEach((ele) => {
              this.siteList.push({
                label: ele.name + "楼",
                value: ele.id,
              });
            });
          } else {
            this.$tools.toast("该场地楼层列表为空");
          }
        });
      } else if (type === 4) {
        this.siteList = [];
        if (this.formData.floorCode === "") {
          this.$tools.toast("请选择楼层");
          return;
        }
        const req = {
          parentId: this.formData.floorCode,
          schoolCode: store.userInfo.schoolCode,
        };
        actions.getChildSite(req).then((res) => {
          if (res.data.list.length !== 0) {
            this.siteTag = true;
            res.data.list.forEach((ele) => {
              this.siteList.push({
                label: ele.name,
                value: ele.id,
              });
            });
          } else {
            this.$tools.toast("该楼层房间列表为空");
          }
        });
      }
    },
    confirm(e) {
      if (!e) {
        return;
      }
      if (this.siteType === 1) {
        this.formData.type = e[0].label;
        this.formData.typeCode = e[0].value;
        this.formData.building = "请选择";
        this.formData.floor = "请选择";
        this.formData.room = "请选择";
        this.formData.buildingCode = "";
        this.formData.floorCode = "";
        this.formData.roomCode = "";
      } else if (this.siteType === 2) {
        this.formData.building = e[0].label;
        this.formData.buildingCode = e[0].value;
        this.formData.floor = "请选择";
        this.formData.room = "请选择";
        this.formData.floorCode = "";
        this.formData.roomCode = "";
      } else if (this.siteType === 3) {
        this.formData.floor = e[0].label;
        this.formData.floorCode = e[0].value;
        this.formData.room = "请选择";
        this.formData.roomCode = "";
      } else if (this.siteType === 4) {
        this.formData.room = e[0].label;
        this.formData.roomCode = e[0].value;
        this.formData.placeId =
          this.formData.buildingCode +
          "," +
          this.formData.floorCode +
          "," +
          this.formData.roomCode;
        this.formData.placeName =
          this.formData.building +
          "," +
          this.formData.floor +
          "," +
          this.formData.room;
        console.log(this.formData.typeCode);
        console.log(this.formData.placeName);
        console.log(this.formData.placeId);
      } else if (this.siteType === 5) {
        this.formData.materialTypeName = e[0].label;
        this.formData.materialTypeId = e[0].value;
        this.formData.materialName = "请选择";
      } else if (this.siteType === 6) {
        this.formData.materialName = e[0].label;
        this.formData.materialId = e[0].value;
      }
      if (e[0].label === "其他") {
        this.isShow = true;
        this.isSelect = false;
        this.formData.materialName = "";
        this.formData.materialTypeName = "";
      }
    },
    submit: tools.throttle(async function() {
      if (this.formData.materialTypeName === "请选择") {
        this.$tools.toast("请选择报修的物品类别!");
        return;
      }
      if (this.formData.materialName === "请选择") {
        this.$tools.toast("请选择报修的物品名称!");
        return;
      }
      if (this.formData.type === "请选择") {
        this.$tools.toast("请选择物品位置!");
        return;
      }
      if (this.formData.building === "请选择") {
        this.$tools.toast("请选择楼栋!");
        return;
      }
      if (this.formData.floor === "请选择") {
        this.$tools.toast("请选择楼层!");
        return;
      }
      if (this.formData.room === "请选择") {
        this.$tools.toast("请选择房间!");
        return;
      }
      if (this.repairApprovalList.length === 0) {
        this.$tools.toast("请选择审批人员!");
        return;
      }
      if (this.photoList.length > 5) {
        this.$tools.toast("最多上传五张图片!");
        return;
      }
      const req = {
        schoolCode: store.userInfo.schoolCode,
        submitUserName: store.userInfo.userName,
        submitUserCode: store.userInfo.userCode,
        placeId: this.formData.placeId,
        placeName: this.formData.placeName,
        repairSource: "1",
        attachmentList: this.photoList.map((ele) => {
          return {
            type: 1,
            url: ele.url
          };
        }),
        repairApprovalList: this.repairApprovalList.map((el) => {
          return {
            approvalUserCode: el.userCode,
            approvalUserName: el.userName,
            schoolCode: el.orgCode.split(",")[0],
          };
        }),
        repairCopyList: this.repairCopyList.map((el) => {
          return {
            copyUserCode: el.userCode,
            copyUserName: el.userName,
            schoolCode: el.orgCode.split(",")[0],
          };
        }),
        materialId: this.formData.materialId,
        materialName: this.formData.materialName,
        materialTypeId: this.formData.materialTypeId,
        materialTypeName: this.formData.materialTypeName,
        materialRemark: this.formData.materialRemark,
        remark: this.formData.remark,
      };
      await actions.addRepair(
        req,
      );
      this.$tools.toast("操作成功");
      this.$tools.goNext(() => {
        eventBus.$emit("getList");
        this.$tools.goBack();
      });
    }, 1000),
  },
};
</script>

<style lang="scss" scoped>
.add {
  .scroll-h {
    height: calc(100vh - 100rpx);
  }
  .item-list {
    padding: 25rpx 15rpx 25rpx 25rpx;
    background-color: #fff;
    .tip::before {
      position: absolute;
      z-index: 99;
      content: "*";
      // top: 30rpx;
      color: $u-type-error;
      font-weight: bold;
      left: 8rpx;
    }
    .item-input {
      width: 100%;
      font-size: 26rpx;
      color: #999;
    }
    .radio {
      padding-left: 25rpx;
    }
    .text_num {
      text-align: right;
      color: #999;
    }
  }
}
.mar-l10 {
  margin-left: 10rpx;
  margin-top: 10rpx;
}
</style>
