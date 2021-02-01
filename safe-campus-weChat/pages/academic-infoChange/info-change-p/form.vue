<template>
  <view class="upload u-fx-ver">
    <scroll-view scroll-y="true" class="scroll-h u-padd-20">
      <view class="u-fx-ac u-bd-b item-list" @click="chooseStudent">
        <view class="tip">学生：</view>
        <view class="u-fx-f1">
          <input
            placeholder="请选择学生"
            disabled
            v-model="studentInfo.studentName"
            class="item-input1"
          />
        </view>
        <u-icon
          class="arrow"
          name="arrow-right"
          color="#333333"
          size="26"
        ></u-icon>
      </view>
      <view class="u-fx-ac u-bd-b item-list">
        <view class="tip">学号：</view>
        <view class="u-fx-f1">
          <input
            placeholder="请输入学号"
            disabled
            v-model="studentInfo.workNo"
            class="item-input1"
          />
        </view>
        <u-icon
          class="arrow"
          name="arrow-right"
          color="#ffffff"
          size="26"
        ></u-icon>
      </view>
      <view class="u-fx-ac u-bd-b item-list" @click="showSex = true">
        <view class="">性别：</view>
        <view class="u-fx-f1">
          <input
            placeholder="请选择性别"
            disabled
            :value="studentInfo.sex ? Tools.getSex(studentInfo.sex) : ''"
            class="item-input1"
          />
        </view>
        <u-icon
          class="arrow"
          name="arrow-right"
          color="#333333"
          size="26"
        ></u-icon>
      </view>
      <view class="u-fx-ac u-bd-b item-list" @click="showPublicface = true">
        <view class="">政治面貌：</view>
        <view class="u-fx-f1">
          <input
            placeholder="请选择政治面貌"
            disabled
            :value="Tools.getPoliticsStatus(studentInfo.publicFace)"
            class="item-input1"
          />
        </view>
        <u-icon
          class="arrow"
          name="arrow-right"
          color="#333333"
          size="26"
        ></u-icon>
      </view>
      <view class="u-fx-ac u-bd-b item-list">
        <view class="">身份证号：</view>
        <view class="u-fx-f1">
          <input
            placeholder="请输入身份证号"
            v-model="studentInfo.idNumber"
            class="item-input1"
          />
        </view>
        <u-icon
          class="arrow"
          name="arrow-right"
          color="#ffffff"
          size="26"
        ></u-icon>
      </view>
      <view class="u-fx-ac u-bd-b item-list">
        <view class="">家庭住址：</view>
        <view class="u-fx-f1">
          <input
            placeholder="请输入家庭住址"
            v-model="studentInfo.homeAddress"
            class="item-input1"
            maxlength="50"
          />
        </view>
        <u-icon
          class="arrow"
          name="arrow-right"
          color="#ffffff"
          size="26"
        ></u-icon>
      </view>
      <view class="u-fx-ac u-bd-b item-list" @click="showNation = true">
        <view class="">民族：</view>
        <view class="u-fx-f1">
          <input
            placeholder="请选择民族"
            disabled
            v-model="studentInfo.nation"
            class="item-input1"
          />
        </view>
        <u-icon
          class="arrow"
          name="arrow-right"
          color="#333333"
          size="26"
        ></u-icon>
      </view>
      <view class="u-fx-ac u-bd-b item-list">
        <view class="">联系电话：</view>
        <view class="u-fx-f1">
          <input
            placeholder="请输入联系电话"
            v-model="studentInfo.mobile"
            class="item-input1"
          />
        </view>
        <u-icon
          class="arrow"
          name="arrow-right"
          color="#ffffff"
          size="26"
        ></u-icon>
      </view>
      <view class="u-fx-ac u-bd-b item-list">
        <view class="">文化程度：</view>
        <view class="u-fx-f1">
          <input
            placeholder="请输入文化程度"
            v-model="studentInfo.cultureDegree"
            class="item-input1"
            maxlength="5"
          />
        </view>
        <u-icon
          class="arrow"
          name="arrow-right"
          color="#ffffff"
          size="26"
        ></u-icon>
      </view>
      <view class="u-fx-ac u-bd-b item-list" @click="showDate = true">
        <view class="">出生年月日：</view>
        <view class="u-fx-f1">
          <input
            placeholder="请选择出生年月日"
            disabled
            :value="
              studentInfo.birthday
                ? Tools.getDateTime(studentInfo.birthday, 'date')
                : ''
            "
            class="item-input1"
          />
        </view>
        <u-icon
          class="arrow"
          name="arrow-right"
          color="#333333"
          size="26"
        ></u-icon>
      </view>
      <view class="u-fx-ac u-bd-b item-list">
        <view class="tip">原专业班级：</view>
        <view class="u-fx-f1">
          <input
            placeholder="请选择原专业班级"
            disabled
            v-model="studentInfo.oldClass"
            class="item-input1"
          />
        </view>
        <u-icon
          class="arrow"
          name="arrow-right"
          color="#ffffff"
          size="26"
        ></u-icon>
      </view>
      <view class="u-fx-ac u-bd-b item-list" @click="classTag = true">
        <view class="tip">转入专业班级：</view>
        <view class="u-fx-f1">
          <input
            placeholder="请选择转入专业班级"
            disabled
            v-model="studentInfo.newClass"
            class="item-input1"
          />
        </view>
        <u-icon
          class="arrow"
          name="arrow-right"
          color="#333333"
          size="26"
        ></u-icon>
      </view>
      <view class="u-fx-ver u-bd-b item-list">
        <view class="up-title">
          <text class="tip">个人简历及转专业原因说明</text>
        </view>
        <view class="up-content">
          <textarea
            class="item-input"
            style="font-size: 14px"
            maxlength="200"
            v-model.trim="remark"
            placeholder="请输入"
          />
          <view class="length-tip">{{ remark ? remark.length : 0 }}/200</view>
        </view>
      </view>
    </scroll-view>
    <view class="upload-btn u-fx-ac-jc">
      <u-button style="width: 100%" type="primary" @click="submitForm"
        >提交</u-button
      >
    </view>
    <u-select
      v-model="showSex"
      mode="single-column"
      :list="sexList"
      @confirm="
        (val) => {
          studentInfo.sex = val[0].value;
        }
      "
    ></u-select>
    <u-select
      v-model="showPublicface"
      mode="single-column"
      :list="publicFaceList"
      @confirm="
        (val) => {
          studentInfo.publicFace = val[0].value;
        }
      "
    ></u-select>
    <u-select
      v-model="showNation"
      mode="single-column"
      :list="nation"
      @confirm="
        (val) => {
          studentInfo.nation = val[0].value;
        }
      "
    ></u-select>
    <u-picker
      mode="time"
      v-model="showDate"
      :params="dateParams"
      @confirm="changeDate"
    ></u-picker>
    <student-tree
      ref="chooseStudent"
      :studentTag="studentTag"
      :schoolInfo="schoolInfo"
      @close="studentTag = false"
      @confirm="selectStudent"
    ></student-tree>
    <class-tree
      ref="classTree"
      isRadio
      v-show="classTag"
      :isHighSchool="true"
      :isHighSchoolData="true"
      :classTag="classTag"
      :schoolInfo="schoolInfo"
      @close="classTag = false"
      @confirm="classSelcet"
    ></class-tree>
  </view>
</template>

<script>
import eventBus from "@u/eventBus";
import StudentTree from "../component/student-tree-p.vue";
import classTree from "@/components/class-tree/class-tree";
import Tools from "@u/tools";
import { store, actions } from "../store/index.js";
import nation from "@u/nation.js";
const sexList = [
  {
    value: 1,
    label: "男",
  },
  {
    value: 2,
    label: "女",
  },
  {
    value: 3,
    label: "未知",
  },
];
const publicFaceList = [
  {
    value: "1",
    label: "党员",
  },
  {
    value: "2",
    label: "团员",
  },
  {
    value: "3",
    label: "群众",
  },
  {
    value: "4",
    label: "其他",
  },
];
const dateParams = {
  year: true,
  month: true,
  day: true,
  hour: false,
  minute: false,
  second: false,
};
export default {
  name: "TrainResult",
  components: {
    StudentTree,
    classTree,
  },
  data() {
    return {
      phone: /^(?:(?:\+|00)86)?1[3-9]\d{9}$/,
      idCard: /^[1-9]\d{5}(18|19|20|(3\d))\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
      Tools,
      schoolInfo: {},
      remark: "",
      photoList: [],
      studentInfo: {},
      showSex: false,
      sexList,
      showPublicface: false,
      publicFaceList,
      showNation: false,
      nation: nation.map((item) => {
        return { value: item.name, label: item.name };
      }),
      showDate: false,
      dateParams,
      studentTag: false,
      classTag: false,
    };
  },
  computed: {
    schoolCode() {
      return store.userInfo.schoolCode;
    },
  },
  created() {
    this.schoolInfo = {
      schoolCode: store.userInfo.schoolCode,
      userCode: store.userInfo.userCode,
    };
  },
  methods: {
    async submitForm() {
      const req = {
        birthday: this.studentInfo.birthday,
        creatorCode: store.userInfo.userCode,
        creatorName: store.userInfo.userName,
        cultureDegree: this.studentInfo.cultureDegree,
        homeAddress: this.studentInfo.homeAddress,
        idNumber: this.studentInfo.idNumber,
        mobile: this.studentInfo.mobile,
        nation: this.studentInfo.nation,
        newClassCode: this.studentInfo.newClassCode,
        newClassName: this.studentInfo.newClassName,
        newGrade: this.studentInfo.newGrade,
        newMajorCode: this.studentInfo.newMajorCode,
        newMajorName: this.studentInfo.newMajorName,
        oldClassCode: this.studentInfo.oldClassCode,
        oldClassName: this.studentInfo.oldClassName,
        oldGrade: this.studentInfo.oldGrade,
        oldMajorCode: this.studentInfo.oldMajorCode,
        oldMajorName: this.studentInfo.oldMajorName,
        publicFace: this.studentInfo.publicFace,
        remark: this.remark,
        schoolCode: store.userInfo.schoolCode,
        sex: this.studentInfo.sex,
        studentClassId: this.studentInfo.studentClassId,
        studentCode: this.studentInfo.userCode,
        studentName: this.studentInfo.userName,
        studentPhotoUrl: this.studentInfo.photoUrl,
        workNo: this.studentInfo.workNo,
      };
      if (!req.studentCode) {
        this.$tools.toast("请选择学生");
        return;
      }
      if (req.idNumber && !this.idCard.test(req.idNumber)) {
        this.$tools.toast("身份证格式错误");
        return;
      }
      if (req.mobile && !this.phone.test(req.mobile)) {
        this.$tools.toast("手机号格式错误");
        return;
      }
      if (!req.newClassCode) {
        this.$tools.toast("请选择转入班级");
        return;
      }
      if (!req.remark) {
        this.$tools.toast("请填写转专业说明");
        return;
      }
      await actions.addChangeData(req);
      this.$tools.toast("申请成功", 1);
      this.$tools.goNext(() => {
        eventBus.$emit("getList");
        this.$tools.goBack();
      });
    },
    changeDate(val) {
      const time = new Date(`${val.year}-${val.month}-${val.day}`).getTime();
      this.studentInfo.birthday = time;
    },
    chooseStudent() {
      this.studentTag = true;
      this.$refs.chooseStudent.getTreeData();
    },
    selectStudent(values) {
      this.studentTag = false;
      this.studentInfo = values;
      this.getStudentInfo(values.userCode);
    },
    async getStudentInfo(userCode) {
      const res = await actions.getStudentInfoByCode({ userCode });
      this.studentInfo = {
        ...res.data,
        studentName: res.data.userName,
        oldClassCode: res.data.classCode,
        oldClassName: res.data.className,
        oldGrade: res.data.schoolYearId,
        oldMajorCode: res.data.gradeCode,
        oldMajorName: res.data.gradeName,
        oldClass: `${res.data.admissionTime}级/${res.data.gradeName}/${res.data.className}`,
      };
    },
    classSelcet(value) {
      this.classTag = false;
      this.studentInfo = {
        ...this.studentInfo,
        newClass: `${value[0].gradeName}/${value[0].subjectName}/${value[0].className}`,
        newClassCode: value[0].classCode,
        newClassName: value[0].className,
        newGrade: value[0].gradeName.replace("级", ""),
        newMajorCode: value[0].subjectCode,
        newMajorName: value[0].subjectName,
      };
    },
  },
};
</script>

<style lang="less" scoped>
.upload {
  background-color: #fff;

  /deep/ .uni-input-wrapper {
    font-size: 28rpx;
  }
}
.scroll-h {
  height: calc(100vh - 120rpx);
}
.item-list {
  padding: 20rpx;
}
.up-title {
  font-size: 14px;
  .title-text {
    margin-bottom: 10rpx;
  }
}
.item-input1 {
  text-align: right;
}
.up-content {
  border: 1px solid #eee;
  border-radius: 8rpx;
  margin-top: 20rpx;
  padding: 10rpx;
  box-sizing: border-box;
  position: relative;
  padding-bottom: 20rpx;

  .item-input {
    width: 100%;
    height: 400rpx;
    display: block;
  }

  .length-tip {
    position: relative;
    height: 20rpx;
    bottom: 0;
    text-align: right;
    color: #cccccc;
  }
}
.upload-btn {
  height: 120rpx;
  padding: 20rpx;
  color: #ffffff;
}

.tip::before {
  position: absolute;
  z-index: 99;
  content: "*";
  top: 30rpx;
  color: red;
  font-weight: bold;
  left: 8rpx;
}
.arrow {
  margin-left: 10rpx;
}
</style>
