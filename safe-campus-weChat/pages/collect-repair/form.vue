<template>
  <view class="add">
    <teacher-tree
      isRadio
      :teacherTag="teacherTag"
      v-show="teacherTag"
      :schoolInfo="schoolInfo"
      @close="teacherClose"
      @confirm="teacherSelcet"
      :classChecked="repairApprovalList"
    ></teacher-tree>
    <u-select v-model="siteTag" :list="siteList" @confirm="confirm"></u-select>
    <scroll-view scroll-y="true" class="scroll-h">
      <view v-for="(item, index) in goodsList" :key="index">
        <template>
          <view class="u-fx-ac u-bd-b item-list">
            <view class="tip">物品类别：</view>
            <view
              class="u-fx-f1 u-fx-je u-content-color"
              @click="changeName([...arguments, 1, item, index])"
              >{{ item.materialTypeName }}</view
            >
            <view class="rit-icon"></view>
          </view>
          <view class="u-fx-ac u-bd-b item-list">
            <view class="tip">物品名称：</view>
            <view
              class="u-fx-f1 u-fx-je u-content-color"
              @click="changeName([...arguments, 2, item, index])"
              >{{ item.materialName }}</view
            >
            <view class="rit-icon"></view>
          </view>
          <view class="u-fx-ac u-bd-b item-list">
            <view class="tip">物品数量：</view>
            <view class="u-fx-f1 u-fx-je u-content-color">
              <u-number-box
                v-model="item.number"
                @change="valChange"
              ></u-number-box>
            </view>
            <view class="u-padd-l40">
              <u-button
                v-if="index !== 0"
                type="primary"
                class="u-type-error-dark-bg"
                size="mini"
                @click="handleDelete(item, index)"
                >删除</u-button
              >
            </view>
          </view>
        </template>
      </view>
      <view class="u-bd-b item-list">
        <u-button
          type="primary"
          class="u-type-info-dark-bg"
          size="mini"
          @click="addGoods"
        >
          添加
        </u-button>
      </view>
    <view class="u-fx-ac u-bd-b item-list">
			  <view>审批人</view>
        <view @click="teacherTag = true" class="u-fx-f1 u-fx">
          <view class="copyer u-fx-f1 u-content-color u-tx-r">
                            <text v-if="repairApprovalList.length === 0">请选择</text>
                      <text v-if="repairApprovalList.length >3">已选{{repairCopyList.length}}人</text>
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

    </scroll-view>
    <view class="footer-btn u-fx-ac">
      <u-button
        type="primary"
        class="u-fx-f1 u-mar-l u-mar-r u-type-primary-dark-bg"
        @click="submit"
        >申领</u-button
      >
    </view>
  </view>
</template>

<script>
import { actions, store } from "./store/index";
import eventBus from "@u/eventBus";
import tools from ".../../../utils/tools";
import teacherTree from "@/components/teacher-tree/teacher-tree";
export default {
  components: {
    teacherTree,
  },
  data() {
    return {
      formData: {
        materialTypeName: "请选择",
        materialId: "",
        materialName: "请选择",
        materialTypeId: "",
        number: 0,
        schoolCode: store.userInfo.schoolCode,
      },
      siteType: 1,
      siteList: [],
      siteTag: false,
      teacherTag: false,
      schoolInfo: {
        schoolYearId: 0,
        schoolCode: "",
      },
      pageList: {
        page: 1,
        size: 20,
      },
      repairApprovalList: [],
      goodsList: [
        { materialTypeName: "请选择", materialName: "请选择", number: 0 },
      ],
      lastActive: null,
    };
  },
  created() {
    this.schoolInfo.schoolCode = store.userInfo.schoolCode;
    this.schoolInfo.schoolYearId = store.schoolYear.schoolYearId;
  },
  watch: {},
  methods: {
    valChange(e) {
      console.log(e.value);
    },
    teacherSelcet(value) {
      if (
        value[0].userCode === store.userInfo.userCode 
      ) {
        this.$tools.toast("审批人不能是自己!");
        return;
      } else {
        this.teacherTag = false;
        this.repairApprovalList = value;
      }
    },
    teacherClose() {
      this.teacherTag = false;
    },
    handleDelete(item, index) {
      console.log("del", item, index, this.goodsList);
      this.goodsList.splice(index, 1);
    },
    changeName([e, type, item, index]) {
      this.lastActive = item;
      this.siteType = type;
      this.siteList = [];
      if (type === 1) {
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
          } else {
            this.$tools.toast("该物品分类列表为空");
          }
        });
      } else if (type === 2) {
        if (item.materialTypeName === "") {
          this.$tools.toast("请选择物品分类");
          return;
        }
        const req = {
          typeId: item.materialTypeId,
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
    confirm(e) {
      if (!e) {
        return;
      }
      if (this.siteType === 1) {
        this.lastActive.materialTypeName = e[0].label;
        this.lastActive.materialTypeId = e[0].value;
        this.lastActive.materialName = "请选择";
      } else if (this.siteType === 2) {
        this.lastActive.materialName = e[0].label;
        this.lastActive.materialId = e[0].value;
      }
    },
    addGoods() {
      this.goodsList.push({
        materialTypeName: "请选择",
        materialName: "请选择",
        number: 0,
      });
    },
    submit: tools.throttle(async function() {
      if (this.goodsList[0].materialName === "请选择") {
        this.$tools.toast("请选择领用的物品类别!");
        return;
      }
      if (this.goodsList[0].materialName === "请选择") {
        this.$tools.toast("请选择领用的物品名称!");
        return;
      }
      if (this.goodsList[0].number === "0") {
        this.$tools.toast("物品数量必须大于0!");
        return;
      }
      console.log(this.goodsList);
      if (this.repairApprovalList.length === 0) {
        this.$tools.toast("请选择审批人员!");
        return;
      }
      const req = {
        schoolCode: store.userInfo.schoolCode,
        applicantName: store.userInfo.userName,
        applicantCode: store.userInfo.userCode,
        collectNaterialNameList: this.goodsList, //放选的物品
        approvalUserName: this.repairApprovalList[0].userName,
        approvalUserCode: this.repairApprovalList[0].userCode,
      };
      await actions.addCollection({
        ...req,
      });
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
      top: 30rpx;
      color: $u-type-error;
      font-weight: bold;
      left: 8rpx;
    }
  }
}
</style>
