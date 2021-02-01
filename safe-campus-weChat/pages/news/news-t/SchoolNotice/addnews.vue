<template>
  <view class="add">
    <teacher-tree
      isCheck
      :teacherTag="teacherTag"
      v-show="teacherTag"
      :schoolInfo="schoolInfo"
      @close="teacherClose"
      @confirm="teacherSelcet"
      :classChecked="userCodeList"
    ></teacher-tree>
    <class-tree
      isCheck
      v-show="classTag"
			:isHighSchool="isHighSchool"
      :classTag="classTag"
      :schoolInfo="schoolInfo"
      @close="classClose"
      @confirm="classSelcet"
      :classChecked="classList"
    ></class-tree>
		<dormcard-tree
		  isCheck
		  v-show="dormTag"
		  :classTag="dormTag"
		  :schoolInfo="schoolInfo"
		  @close="dormClose"
		  @confirm="dormSelcet"
		  :classChecked="dormList"
		></dormcard-tree>
    <scroll-view scroll-y="true" class="scroll-h u-bg-fff">
      <view class="u-fx-ac u-bd-b item-list">
        <view class="tip">公告标题：</view>
        <view class="u-fx-f1"
          ><input placeholder="请输入标题" maxlength="30" v-model="newsInfo.title" class="item-input"
        /></view>
      </view>
      <view class="qui―fx u-bd-b item-list">
        <view class="tip">公告正文:</view>
        <view class="u-fx-f1 u-mar-t">
          <textarea
            class="item-input"
            v-model="newsInfo.content"
						placeholder="请输入公告正文"
            maxlength="600"
          />
        </view>
      </view>
         <view class="u-fx-ac u-bd-b item-list">
			  <view class="tip">选择教职工:</view>
        <view @click="teacherTag = true" class="u-fx-f1 u-fx u-fx-ac">
          <view class="copyer u-fx-f1 u-content-color u-tx-r">
             <text v-if="userCodeList.length === 0">请选择</text>
             <text v-if="userCodeList.length >3">已选{{userCodeList.length}}人</text>
            <u-tag 
            v-if="userCodeList.length <=3"
              v-for="(item,index) in userCodeList"
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
			  <view class="tip">选择班级:</view>
        <view @click="classTag = true" class="u-fx-f1 u-fx u-fx-ac">
          <view class="copyer u-fx-f1 u-content-color u-tx-r">
          <text v-if="classList.length === 0">请选择</text>
                       <text v-if="classList.length >2">已选{{classList.length}}个班级</text>
            <u-tag 
                        v-if="classList.length <=2"
              v-for="(item,index) in classList"
              :key="index"
              :text="isHighSchool ? (item.gradeName + item.subjectName + item.className) : (item.gradeName + item.className)"
              mode="light" 
              type="info" 
              class="mar-l10"
              />
          </view>
          <view class="rit-icon"></view>
        </view>
			</view>
			<view class="u-fx-ac u-bd-b item-list">
			  <view class="tip">选择宿舍班牌:</view>
			  <view @click="dormTag = true" class="u-fx-f1 u-fx u-fx-ac">
			    <view class="copyer u-fx-f1 u-content-color u-tx-r">
			    <text v-if="dormList.length === 0">请选择</text>
			                 <text v-if="dormList.length >2">已选{{dormList.length}}个班牌</text>
			      <u-tag 
			                  v-if="dormList.length <=2"
			        v-for="(item,index) in dormList"
			        :key="index"
			        :text="item.buildingName"
			        mode="light" 
			        type="info" 
			        class="mar-l10"
			        />
			    </view>
			    <view class="rit-icon"></view>
			  </view>
			</view>
      <view class="u-fx-ac u-bd-b item-list">
        <view>开启全屏通知：</view>
        <view class="u-fx-f1 u-fx-je"
          ><u-switch
            v-model="newsInfo.showFull"
            @change="showTime"
            active-value="1"
            inactive-value="2"
          ></u-switch
        ></view>
      </view>
      <view class="u-fx-ac u-bd-b item-list" v-if="isShow">
        <view class="tip">全屏开始时间：</view>
        <view class="u-fx-f1 u-fx-je" @click="startShow = true">
          <u-picker
            mode="time"
            v-model="startShow"
            :params="params"
            @confirm="startConfirm"
          ></u-picker>
          <view class="uni-input u-content-color">{{
            newsInfo.startDate
          }}</view>
          <view class="rit-icon"></view>
        </view>
      </view>
      <view class="u-fx-ac u-bd-b item-list" v-if="isShow">
        <view class="tip">全屏结束时间：</view>
        <view class="u-fx-f1 u-fx-je" @click="endShow = true">
          <u-picker
            mode="time"
            v-model="endShow"
            :params="params"
            @confirm="endConfirm"
          ></u-picker>
          <view class="uni-input u-content-color">{{ newsInfo.endDate }}</view>
          <view class="rit-icon"></view>
        </view>
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
import { actions, store } from "../store/index";
import eventBus from "@u/eventBus";
import tools from ".../../../utils/tools";
import teacherTree from "@/components/teacher-tree/teacher-tree";
import classTree from "@/components/class-tree/class-tree";
import dormcardTree from "@/components/dormcard-tree/dormcard-tree";
export default {
  components: { teacherTree, classTree, dormcardTree },
  data() {
    return {
			isHighSchool: false,
      newsInfo: {
        title: "",
        content: "",
        showFull: false,
        startDate: this.$tools.getPhoneTime(new Date(), "noSecond"),
        endDate: this.$tools.getPhoneTime(
          new Date(new Date().getTime() + 2 * 60 * 60 * 1000),
          "noSecond"
        ),
      },
      id: "",
      pageList: {
        page: 1,
        size: 20,
      },
      userCodeList: [],
      classList: [],
			dormList: [],
      schoolYearId: "",
      startShow: false,
      endShow: false,
      params: {
        year: true,
        month: true,
        day: true,
        hour: true,
        minute: true,
        second: false,
      },
      isShow: false,
      disabled: false,
      teacherTag: false,
      classTag: false,
			dormTag: false,
      schoolInfo: {
        schoolYearId: 0,
        schoolCode: "",
      },
    };
  },
  async created() {
		this.isHighSchool = store.userInfo.schoolType === '8' || store.userInfo.schoolType === '9'
    this.schoolInfo.schoolCode = store.userInfo.schoolCode;
    this.schoolInfo.schoolYearId = store.schoolYear.schoolYearId;
		this.userCode = store.userInfo.userCode;
		this.id = this.$tools.getQuery().get("id");
		if (this.id) {
		  this.detailGet(this.id);
		}
  },
  watch: {},
  computed: {},
  methods: {
    classClose() {
      this.classTag = false;
    },
		dormClose() {
		  this.dormTag = false;
		},
    classSelcet(value) {
			console.log(value)
      this.classTag = false;
      this.classList = value;
    },
		dormSelcet(value) {
			console.log(value)
		  this.dormTag = false;
		  this.dormList = value;
		},
    teacherClose() {
      this.teacherTag = false;
    },
    teacherSelcet(value) {
      this.teacherTag = false;
      this.userCodeList = value;
    },
    showTime() {
      if (this.newsInfo.showFull === false) {
        this.isShow = false;
      } else {
        this.isShow = true;
      }
    },
    startConfirm(params) {
      this.newsInfo.startDate = `${params.year}-${params.month}-${params.day} ${
        params.hour
      }:${params.minute}`;
      this.newsInfo.endDate = this.newsInfo.endDate.replace(/-/g, "-");
      const time =
        new Date(new Date(this.newsInfo.endDate).getTime()).getTime() -
        new Date(new Date(this.newsInfo.startDate).getTime()).getTime() -
        1000 -
        60 -
        60;
      if (time > 0) {
        this.newsInfo.duration = Math.ceil(time);
      } else {
        this.newsInfo.duration = Math.floor(time);
      }
    },
    endConfirm(params) {
      this.newsInfo.endDate = `${params.year}-${params.month}-${params.day} ${
        params.hour
      }:${params.minute}`;
      this.newsInfo.startDate = this.newsInfo.startDate.replace(/-/g, "-");
      const time =
        new Date(new Date(this.newsInfo.endDate).getTime()).getTime() -
        new Date(new Date(this.newsInfo.startDate).getTime()).getTime() -
        1000 -
        60 -
        60;
      if (time > 0) {
        this.newsInfo.duration = Math.ceil(time);
        s;
      } else {
        this.newsInfo.duration = Math.floor(time);
      }
    },
    async detailGet(id) {
      const res = await actions.getNoticeDetail(id);
      this.newsInfo = res.data;
      this.classList = res.data.noticeClassList;
			this.dormList = res.data.noticeDeviceList;
      this.userCodeList = res.data.noticeUserList;
      if (this.newsInfo.showFull === "1") {
        this.newsInfo.showFull = true;
        this.isShow = true;
      } else {
        this.newsInfo.showFull = false;
        this.isShow = false;
      }
      if (this.newsInfo.fullStart != null) {
        this.newsInfo.startDate = this.$tools.getPhoneTime(
          new Date(this.newsInfo.fullStart),
          "noSecond"
        );
      } else {
        this.newsInfo.startDate = this.$tools.getPhoneTime(
          new Date(),
          "noSecond"
        );
      }
      if (this.newsInfo.fullEnd != null) {
        this.newsInfo.endDate = this.$tools.getPhoneTime(
          new Date(this.newsInfo.fullEnd),
          "noSecond"
        );
      } else {
        this.newsInfo.endDate = this.$tools.getPhoneTime(
          new Date(new Date().getTime() + 2 * 60 * 60 * 1000),
          "noSecond"
        );
      }
    },
    async submit() {
      if (this.newsInfo.title === "") {
        this.$tools.toast("请输入标题");
        return false;
      } else if (this.newsInfo.content === "") {
        this.$tools.toast("请输入正文");
        return false;
      } else if (
        this.classList.length === 0 &&
        this.userCodeList.length === 0 &&
				this.dormList.length === 0
      ) {
        this.$tools.toast("请选择发布对象");
        return;
      } else if (
        new Date(this.newsInfo.endDate).getTime() <=
        new Date(this.newsInfo.startDate).getTime()
      ) {
        this.$tools.toast("请选择正确时间段");
        return false;
      }
      const req = {
        createBy: store.userInfo.userName,
        creatorCode: store.userInfo.userCode,
        schoolCode: store.userInfo.schoolCode,
        userCodes: this.userCodeList.map(el => el.userCode),
        classCodes: this.classList.map(el => el.classCode),
				dormCardList: this.dormList.map(el => el.deviceSn),
        schoolYearId: store.schoolYear.schoolYearId,
        fullStart: this.newsInfo.startDate,
        fullEnd: this.newsInfo.endDate,
        showFull: this.newsInfo.showFull === true ? 1 : 2,
        content: this.newsInfo.content,
        title: this.newsInfo.title,
      };
      if (this.id) {
        await actions.updateNotice({
          ...req,
          id: this.id,
        });
      } else {
        await actions.addNotice({
          ...req,
        });
      }
      this.$tools.toast("提交成功", 'success');
      this.$tools.goNext(() => {
				eventBus.$emit("getList");
        this.$tools.goBack();
      });
    },
  },
};
</script>

<style lang="scss">
.add {
  position: relative;
  .scroll-h {
    height: calc(100vh - 100rpx);
  }
  .item-list {
    padding: 25rpx 15rpx 25rpx 25rpx;
    .tip::before {
      position: absolute;
      z-index: 99;
      content: "*";
      top: 30rpx;
      color: $u-type-error;
      font-weight: bold;
      left: 8rpx;
    }
    .item-input {
      width: 100%;
      font-size: 26rpx;
      color: $u-tips-color;
    }
    .radio {
      padding-left: 25rpx;
    }
    .upload {
      margin: 20rpx;
    }
  }
  .submit-box {
    height: 100rpx;
    .btn {
      height: 80rpx;
      line-height: 80rpx;
      text-align: center;
      letter-spacing: 8rpx;
      margin: 0 20rpx;
      background-color: $u-type-primary;
      color: $uni-bg-color;
      border-radius: $u-border-radius;
    }
  }
  .search {
    padding: 20rpx;
  }
  .scroll {
    height: 70vh;
    // padding-bottom: 10vh;
    .list {
      padding: 15rpx 25rpx;
      image {
        width: 60rpx;
        height: 60rpx;
      }
    }
    .u-checkbox-group {
      display: flex;
      flex-direction: column;
    }
  }
}
.copyer {
  .u-size-default {
    padding: 10rpx 5rpx;
  }
}
.mar-l10 {
  margin-left: 10rpx;
  margin-top: 10rpx;
}
.submit-btn {
  height: 80rpx;
  justify-content: center;
  .btn {
    letter-spacing: 8rpx;
    margin: 0 20rpx;
  }
}
</style>
