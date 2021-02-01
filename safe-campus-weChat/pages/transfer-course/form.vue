<template>
  <view class="add">
    <teacher-tree
      isCheck
      :teacherTag="teacherTag1"
      v-show="teacherTag1"
      :schoolInfo="schoolInfo"
      @close="teacherClose"
      @confirm="teacherSelcet1"
      :classChecked="repairApprovalList"
    ></teacher-tree>
    <teacher-tree
      isClear
      isRadio
      :teacherTag="teacherTag2"
      v-show="teacherTag2"
      :schoolInfo="schoolInfo"
      @close="teacherClose"
      @confirm="teacherSelcet2"
      :classChecked="substituteList"
    ></teacher-tree>
    <class-tree
      isRadio
      v-show="classTag"
      :classTag="classTag"
      :schoolInfo="schoolInfo"
      @close="classClose"
      @confirm="classSelcet"
			:isHighSchool="isHighSchool"
      :classChecked="classList"
    ></class-tree>
    <u-select v-model="siteTag" :list="siteList" @confirm="confirm"></u-select>
    <scroll-view scroll-y="true" class="scroll-h">
      <view class="u-fx-ac u-bd-b item-list">
        <view class="tip">开始时间：</view>
        <view class="u-fx-f1 u-fx-je">
          <picker
            mode="date"
            :value="formData.startDate"
            :start="startDate"
            :end="endDate"
            @change="changeDate([...arguments, 1])"
          >
            <view class="date u-fx-jc">
              <view class="uni-input">{{ formData.startDate }}</view>
            </view>
          </picker>
          <view class="rit-icon"></view>
        </view>
      </view>
      <view class="u-fx-ac u-bd-b item-list">
        <view class="tip">结束时间：</view>
        <view class="u-fx-f1 u-fx-je">
          <picker
            mode="date"
            :value="formData.endDate"
            :start="startDate"
            :end="endDate"
            @change="changeDate([...arguments, 2])"
          >
            <view class="date u-fx-jc">
              <view class="uni-input">{{ formData.endDate }}</view>
            </view>
          </picker>
          <view class="rit-icon"></view>
        </view>
      </view>
      <view class="u-fx-ac u-bd-b item-list">
        <view class="tip">选择班级:</view>
        <view @click="chooseClass" class="u-fx-f1 u-fx-je u-content-color">
          <text v-if="classList.length === 0">请选择</text>
          <view v-for="(item, index) in classList" :key="index">
            <u-tag
              :text="isHighSchool ? (item.gradeName + item.subjectName + item.className) : (item.gradeName + item.className)"
              mode="light"
              type="info"
              class="mar-l10"
            />
          </view>
        </view>
        <view class="rit-icon"></view>
      </view>
      <view
        class="u-fx-jsb u-bd-b item-list set-ba"
        v-if="this.scheduleList.length !== 0"
      >
        <view> 近{{ this.timeList.length }}天可调的课程 </view>
        <view>共{{ this.scheduleList.length }}节</view>
      </view>
      <view
        class="u-bd-b item-list u-fx-jc"
        v-for="(item, index) in scheduleList"
        :key="index"
      >
        <view>
          <text>{{ item.fromTeacherName }}</text>
          <text> {{ item.fromGradeName }}{{ isHighSchool ? item.fromProfessionName : '' }}{{ item.fromClassName }}</text>
          <text> {{ item.fromSubjectName }}</text>
          <text> 第{{ item.fromLesson }}节</text>
          <text> {{ item.fromCourseTime }}</text>
          <text>
            星期{{
              convertToChinese(parseInt(new Date(item.fromCourseTime).getDay()))
            }}</text
          >
          <view class="u-fx-jc u-mar-t20 u-mar-b20">
            <image src="/mobile-img/form.png"></image>
          </view>
          <view
            class="u-padd-40 u-fx-jc u-bd-1px u-mar-b20"
            @click="changeSiteType([...arguments, item, index])"
            >{{ item.type }}</view
          >
          <view
            v-for="(ele, index) in item.list"
            :key="index"
            v-if="item.list.length !== 0"
          >
            <text>{{ ele.toTeacherName }}</text>
            <text> {{ ele.toGradeName }}{{ isHighSchool ? ele.toProfessionName : '' }}{{ ele.toClassName }}</text>
            <text> {{ ele.toSubjectName }}</text>
            <text> 第{{ ele.toLesson }}节</text>
            <text> {{ ele.to_course_time }}</text>
            <text> 星期{{ convertToChinese(ele.toWeek) }}</text>
          </view>
        </view>
      </view>
      <view class="qui―fx u-bd-b item-list u-mar-t20">
        <view class="tip"> 调代课原因：</view>
        <view class="u-fx-f1">
          <textarea
            class="item-input"
            v-model="formData.description"
            maxlength="100"
          />
        </view>
      </view>
      <view class="u-fx u-bd-b item-list">
        <view>上传图片：</view>
        <view class="u-fx-f1">
          <view class="u-fx-f1"
            ><an-upload-img
              total="9"
              v-model="photoList"
              class="upload"
            ></an-upload-img>
          </view>
        </view>
      </view>
      <view class="u-fx-ac u-bd-b item-list u-mar-t20">
        <view class="tip">审批人:</view>
        <view @click="chooseTeacher()" class="u-fx-f1 u-fx-je u-content-color">
          <text v-if="repairApprovalList.length === 0">请选择</text>
          <text v-if="repairApprovalList.length > 3"
            >已选{{ repairApprovalList.length }}人</text
          >
          <view v-for="(item, index) in repairApprovalList" :key="index">
            <u-tag
              v-if="repairApprovalList.length <= 3"
              :text="item.userName"
              mode="light"
              type="info"
              class="mar-l10"
              style="margin-left: 4px"
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
    <u-popup
      ref="checkPopup1"
      mode="center"
      length="75%"
      :mask-close-able="false"
    >
      <view>
        <view class="choose-input u-bd-1px" @click="onShowDatePicker()">
          <view class="p">{{ title }}</view>
        </view>
        <mx-date-picker
          :show="showPicker"
          :showAll="true"
          type="date"
          :value="dateValue"
          :show-tips="true"
          :show-seconds="true"
          @confirm="onSelected"
          @cancel="onSelected"
          @all="cancelAll"
        />
      </view>
      <scroll-view scroll-y="true" class="scroll">
        <no-data v-if="newList.length === 0" msg="暂无数据"></no-data>
        <view>
          <u-radio-group v-model="formData.value" @change="checkbox">
            <u-radio
              class="u-padd-40 u-bd-b u-fx-jsb"
              v-for="(item, index) in newList"
              :key="index"
							:name="item.toClassScheduleId"
            >
              <label :for="item.toTeacherName" class="tea-name">
                <text>{{ item.toTeacherName }}</text>
              </label>
              <view class="">
                <view class="sel-sub">
                  <text> {{ item.toGradeName }}{{ isHighSchool ? item.toProfessionName : '' }}{{ item.toClassName }}</text>
                  <text> {{ item.toSubjectName }}</text>
                  <text> 第{{ item.toLesson }}节</text>
                </view>
                <view class="sel-sub">
                  <text> 星期{{ convertToChinese(item.toWeek) }}</text>
                </view>
              </view>
            </u-radio>
          </u-radio-group>
        </view>
      </scroll-view>
      <view class="footer-btn u-fx-ac">
        <u-button
          class="u-fx-f1 u-mar-r u-type-info-dark-bg u-type-white"
          @click="cancel"
          >取消</u-button
        >
        <u-button
          type="primary"
          class="u-fx-f1 u-mar-l u-mar-r u-type-primary-d ark-bg"
          @click="ok"
          >确定</u-button
        >
      </view>
    </u-popup>
  </view>
</template>
<script>
import { actions, store } from "./store/index";
import eventBus from "@u/eventBus";
import tools from ".../../../utils/tools";
import teacherTree from "@/components/teacher-tree/teacher-tree";
import anUploadImg from "@/components/an-uploadImg/an-uploadImg";
import classTree from "@/components/class-tree/class-tree";
import MxDatePicker from "@/components/mx-datepicker/mx-datepicker.vue";
import noData from "@/components/no-data/no-data.vue";
export default {
  components: {
    teacherTree,
    anUploadImg,
    classTree,
    MxDatePicker,
    noData,
  },
  data() {
    return {
			isHighSchool: false,
      teacherTag1: false,
      teacherTag2: false,
      schoolInfo: {
        schoolYearId: 0,
        schoolCode: "",
      },
      pageList: {
        page: 1,
        size: 20,
      },
      repairApprovalList: [],
      photoList: [],
      classTag: false,
      classList: [],
      scheduleList: [],
      dateList: [],
      timeList: [],
      siteTag: false,
      siteList: [
        {
          value: "1",
          label: "代课",
        },
        {
          value: "2",
          label: "调课",
        },
        {
          value: "3",
          label: "自修",
        },
        {
          value: "4",
          label: "教务处理",
        },
      ],
      showPicker: false,
      dateValue: "",
      title: "请选择时间",
      substituteList: [],
      transferList: [],
      recordList: [],
      weekday: ["日", "一", "二", "三", "四", "五", "六"],
      lastActive: null,
      newList: [],
      storageTime: "",
      lastIndex: "",
      chooseList: [],
      formData: {
        startDate: "请选择",
        endDate: "请选择",
        description: "",
        type: "请选择调课类型",
        value: "",
      },
      substituteInfo: [],
    };
  },
  created() {
    this.schoolInfo.schoolCode = store.userInfo.schoolCode;
    this.schoolInfo.schoolYearId = store.schoolYear.schoolYearId;
		this.isHighSchool = store.userInfo.schoolType === '8' || store.userInfo.schoolType === '9'
		this.dateValue = this.$tools.getDateTime(new Date(), 'date')
  },
  watch: {},
  computed: {
    startDate() {
      return this.getDate("start");
    },
    endDate() {
      return this.getDate("end");
    },
  },
  methods: {
    getDate(type) {
      const date = new Date();
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();

      if (type === "start") {
        year = year;
      } else if (type === "end") {
        year = year + 2;
      }
      month = month > 9 ? month : "0" + month;
      day = day > 9 ? day : "0" + day;
      return `${year}-${month}-${day}`;
    },
    changeDate([e, type]) {
      if (type === 1) {
        this.scheduleList = [];
        this.classList = [];
        this.formData.startDate = e.target.value;
      } else {
        this.scheduleList = [];
        this.classList = [];
        this.formData.endDate = e.target.value;
        const time =
          (new Date(this.formData.endDate).getTime() -
            new Date(this.formData.startDate).getTime()) /
          (1000 * 60 * 60 * 24);
        if (time > 15) {
          this.$tools.toast("请选择15天内");
          return;
        }
        this.timeList = [];
        const startTime = getDate(this.formData.startDate);
        const endTime = getDate(this.formData.endDate);
        while (endTime.getTime() - startTime.getTime() >= 0) {
          const year = startTime.getFullYear();
          const month =
            (startTime.getMonth() + 1).toString().length == 1
              ? "0" + (startTime.getMonth() + 1).toString()
              : startTime.getMonth() + 1;
          const day =
            startTime.getDate().toString().length == 1
              ? "0" + startTime.getDate()
              : startTime.getDate();
          this.timeList.push({ daytime: year + "-" + month + "-" + day });
          startTime.setDate(startTime.getDate() + 1);
        }
      }
    },
    onShowDatePicker() {
      this.showPicker = !this.showPicker;
    },
    cancelAll(e) {
      this.showPicker = false;
    },
    onSelected(e) {
      this.showPicker = false;
      if (!e) {
        return;
      }
			console.log(e.value)
      this.storageTime = e.value;
      this.title = e.value;
      this.newList = [];
      this.recordList.forEach((element) => {
        if (parseInt(new Date(e.value).getDay()) === parseInt(element.toWeek)) {
          this.newList.push({
            ...element,
          });
        }
      });
    },
    async classSelcet(value) {
      this.scheduleList = [];
      this.classList = [];
      this.classTag = false;
      this.classList = value
      const req = {
        schoolCode: store.userInfo.schoolCode,
        userCode: store.userInfo.userCode,
        schoolYearId: store.schoolYear.schoolYearId,
      };
      const res = await actions.getClassList(req);
      const data = res.data;
      this.dateList = [];
      data.forEach((el) => {
        this.classList.forEach((element) => {
          if (element.classCode === el.classCode) {
            this.dateList.push({
              fromWeek: el.week,
              fromLesson: el.classNode,
              fromTeacherCode: el.userCode,
              fromTeacherName: el.userName,
              fromSubjectCode: el.subjectCode,
              fromSubjectName: el.subjectName,
              fromGradeName: el.gradeName,
							fromProfessionName: el.professionName,
							fromProfessionCode: el.professionCode,
              fromGradeCode: el.gradeCode,
              fromClassName: el.className,
              fromClassCode: el.classCode,
              fromClassScheduleId: el.id,
              schoolCode: store.userInfo.schoolCode,
              schoolName: store.userInfo.schoolName,
              userCode: store.userInfo.userCode,
              schoolYearId: store.schoolYear.schoolYearId,
            });
          }
        });
      });
      if (this.dateList.length === 0) {
        this.$tools.toast("该班级没有可调的课程!");
        return;
      }
      this.scheduleList = [];
      this.timeList.forEach((el) => {
        this.dateList.forEach((element) => {
          if (
            parseInt(
              new Date(el.daytime).getDay() === 0
                ? 7
                : new Date(el.daytime).getDay()
            ) === parseInt(element.fromWeek)
          ) {
            this.scheduleList.push({
              ...element,
              fromCourseTime: el.daytime,
              type: "请选择调课类型",
              list: [],
              infoList: [],
            });
          }
        });
      });
    },
    classClose() {
      this.classTag = false;
    },
    chooseClass() {
      this.classTag = true;
    },
    valChange(e) {},
    chooseTeacher() {
      this.teacherTag1 = true;
    },
    teacherSelcet1(teacherInfo) {
      this.repairApprovalList = teacherInfo;
      this.teacherTag1 = false;
    },
    async teacherSelcet2(value) {
      this.teacherTag2 = false;
      if (this.lastActive.category === "1") {
        this.substituteList = [];
        this.substituteList = value.map((el) => {
          return {
            toTeacherCode: el.userCode,
            toTeacherName: el.userName,
          };
        });
        this.lastActive.type = this.substituteList[0].toTeacherName;
        this.scheduleList[this.lastIndex].infoList = this.substituteList;
      } else if (this.lastActive.category === "2") {
        this.transferList = [];
        this.transferList = value.map((el) => {
          return {
            userCode: el.userCode,
            userName: el.userName,
            schoolCode: el.orgCode.split(",")[0],
          };
        });
        const req = {
          schoolCode: store.userInfo.schoolCode,
          userCode: this.transferList[0].userCode,
          schoolYearId: store.schoolYear.schoolYearId,
        };
        const res = await actions.getClassList(req);
        if (res.data === null) {
          this.$tools.toast("该老师没有可调的课程!");
          return;
        }
        this.recordList = res.data.map((el) => {
          return {
            toWeek: el.week,
            toLesson: el.classNode,
            toTeacherCode: el.userCode,
            toTeacherName: el.userName,
            toSubjectCode: el.subjectCode,
            toSubjectName: el.subjectName,
            toGradeCode: el.gradeCode,
            toGradeName: el.gradeName,
						toProfessionName: el.professionName,
						toprofessionCode: el.professionCode,
            toClassCode: el.classCode,
            toClassName: el.className,
            toClassScheduleId: el.id,
          };
        });
        this.title = this.$tools.getDateTime(new Date(), 'date')
        this.newList = this.recordList;
        this.$refs.checkPopup1.open();
      }
    },
    cancel() {
      this.$refs.checkPopup1.close();
    },
    ok() {
      this.scheduleList[this.lastIndex].list = this.chooseList;
      this.$refs.checkPopup1.close();
    },
    checkbox(e) {
			this.chooseList = this.newList.filter(list => list.toClassScheduleId === e)
      if (this.storageTime !== "" && this.chooseList.lenrth > 0) {
        this.chooseList[0].to_course_time = this.storageTime;
      }
			console.log(this.chooseList)
    },
    confirm(e) {
      if (!e) {
        return;
      }
      this.lastActive.type = e[0].label;
      this.lastActive.category = e[0].value;
      if (this.lastActive.category === "1") {
        this.scheduleList[this.lastIndex].list = [];
        this.teacherTag2 = true;
      } else if (this.lastActive.category === "2") {
        this.teacherTag2 = true;
        this.scheduleList[this.lastIndex].infoList = [];
      } else if (this.lastActive.category === "3") {
        this.scheduleList[this.lastIndex].list = [];
        this.scheduleList[this.lastIndex].infoList = [];
      } else if (this.lastActive.category === "4") {
        this.scheduleList[this.lastIndex].list = [];
        this.scheduleList[this.lastIndex].infoList = [];
      }
    },
    changeSiteType([e, item, index]) {
      this.lastActive = item;
      this.lastIndex = index;
      this.siteTag = true;
    },
    teacherClose() {
      this.teacherTag1 = false;
      this.teacherTag2 = false;
    },
    submit: tools.throttle(async function () {
      this.scheduleList.forEach((el) => {
        for (var key in el.list[0]) {
          el[key] = el.list[0][key];
        }
        for (var key in el.infoList[0]) {
          el[key] = el.infoList[0][key];
        }
      });
      this.substituteInfo = this.scheduleList.filter(
        (item) =>
          item.list.length !== 0 ||
          item.infoList.length !== 0 ||
          item.category === "3" ||
          item.category === "4"
      );
      if (this.substituteInfo.length === 0) {
        this.$tools.toast("请选择要调的课程!");
        return;
      }
      if (!this.formData.description) {
        this.$tools.toast("请输入调代课原因!");
        return;
      }
      if (this.repairApprovalList.length === 0) {
        this.$tools.toast("请选择审批人!");
        return;
      }
      this.$tools.goNext(() => {
        const req = {
          substituteForm: {
            schoolCode: store.userInfo.schoolCode,
            createUsername: store.userInfo.userName,
            createUsercode: store.userInfo.userCode,
            schoolYearId: store.schoolYear.schoolYearId,
            startTime: this.formData.startDate,
            stopTime: this.formData.endDate,
            approval_state: 1,
            description: this.formData.description,
            currentApproval: this.repairApprovalList[0].approverCode,
          },
          substituteFile: this.photoList.map((ele) => {
            return ele.url
          }),
          substituteApprovers: this.repairApprovalList.map((el, index) => {
            return {
              approverCode: el.userCode,
              approverName: el.userName,
              approvalSort: index + 1,
              currentApproval: index === 0 ? el.userCode : undefined,
              approvalState: "1",
            };
          }),
          substituteInfo: this.substituteInfo.map((el) => {
            return {
              ...el,
              infoList: undefined,
              list: undefined,
              id: undefined,
              type: undefined,
            };
          }),
        };
        actions.addSub(req).then((res) => {
          this.$tools.toast("操作成功", 'success');
          this.$tools.goNext(() => {
            eventBus.$emit("getList");
            this.$tools.goBack();
          });
        });
      });
    }, 1000),
    convertToChinese(num) {
      var str = num.toString();
      var len = num.toString().length;
      var C_Num = [];
      for (var i = 0; i < len; i++) {
        C_Num.push(this.weekday[str.charAt(i)]);
      }
      return C_Num.join("");
    },
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
    image {
      width: 35rpx;
      height: 40rpx;
    }
  }
}
.scroll {
  height: 70vh;
  .u-radio-group {
    display: flex;
    flex-direction: column;
  }
}
.choose-input {
  width: 100%;
  min-height: 80rpx;
  line-height: 90rpx;
  .p {
    height: 60rpx;
    color: $u-light-color;
    text-align: center;
  }
}
</style>
