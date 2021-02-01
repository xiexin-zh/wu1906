<template>
  <view class="add">
    <scroll-view scroll-y="true" class="scroll-h u-bg-fff">
      <view class="u-fx-ac u-bd-b item-list">
        <view class="tip">请假学生：</view>
        <view @click="check(1)" class="u-fx-f1 u-fx u-tx-r">
          <view class="u-fx-f1 u-content-color">
            {{ leaveInfo.userName }}
          </view>
          <view class="rit-icon"></view>
        </view>
      </view>
      <view class="u-fx-ac u-bd-b item-list">
        <view class="tip">请假类型：</view>
        <view class="u-fx-f1 u-fx-je u-content-color">
          <picker
            mode="selector"
            :value="currentRole"
            :range="role"
            @change="chooseRole"
          >
            {{ role[currentRole] }}
          </picker>
        </view>
        <view class="rit-icon"></view>
      </view>
      <view class="u-fx-ac u-bd-b item-list">
        <view class="tip">开始时间：</view>
        <view class="u-fx-f1 u-fx-je" @click="startShow = true">
          <u-picker
            mode="time"
            v-model="startShow"
            :params="params"
            @confirm="startConfirm"
          ></u-picker>
          <view class="uni-input u-content-color">{{
            leaveInfo.startDate
          }}</view>
          <view class="rit-icon"></view>
        </view>
      </view>
      <view class="u-fx-ac u-bd-b item-list">
        <view class="tip">结束时间：</view>
        <view class="u-fx-f1 u-fx-je" @click="endShow = true">
          <u-picker
            mode="time"
            v-model="endShow"
            :params="params"
            @confirm="endConfirm"
          ></u-picker>
          <view class="uni-input u-content-color">{{ leaveInfo.endDate }}</view>
          <view class="rit-icon"></view>
        </view>
      </view>
      <view class="u-fx-ac u-bd-b item-list">
        <view class="tip">请假时长：</view>
        <view class="u-fx-f1 u-fx-je u-content-color"
          >{{ leaveInfo.duration }}小时</view
        >
      </view>
      <view class="u-fx u-bd-b item-list">
        <view>描述：</view>
        <view class="u-fx-f1 u-tx-r">
          <textarea
            v-model="leaveInfo.remark"
            class="item-input u-content-color"
            placeholder="请输入描述"
          />
        </view>
      </view>
      <view class="u-fx-ac u-bd-b item-list">
        <view class="tip">是否出校：</view>
        <view class="u-fx-f1 u-fx-je col-666">
          <radio-group @change="radioChange">
            <label
              ><radio
                value="Y"
                :checked="leaveInfo.outSchool === 'Y'"
              />是</label
            >
            <label class="u-padd-l20"
              ><radio
                :checked="leaveInfo.outSchool === 'N'"
                value="N"
              />否</label
            >
          </radio-group>
        </view>
      </view>
      <view class="u-fx-ver u-bd-b item-list">
			  <view class="tip">审批人：</view>
        <view class="u-fx-f1 u-mar-t20">
          <view class="an-img u-mar-l20" @click="check(2)">
            <image class="upload-icon" :src="this.leaveInfo.leaveApprovalAddDto.photoUrl "></image>
            <div class="u-text-center">{{this.leaveInfo.leaveApprovalAddDto.userName}}</div>
		      </view>
			  </view>
			</view>
      <view class="u-fx-ac u-bd-b item-list">
        <view>抄送人：</view>
        <view @click="check(0)" class="u-fx-f1 u-fx">
          <view class="copyer u-fx-f1 u-content-color u-tx-r">
            <u-tag
              @close="tagClick(item)"
              v-for="(item, index) in leaveInfo.leaveCopyList"
              :key="index"
              :text="item.userName"
              mode="light"
              type="info"
              closeable
              class="mar-l10"
            />
          </view>
          <view class="rit-icon"></view>
        </view>
      </view>
      <view class="u-bd-b item-list">
        <view>上传附图：</view>
        <view class="u-fx-f1">
          <an-upload-img
            total="3"
            v-model="leaveInfo.photoList"
            class="img-margin"
          ></an-upload-img>
        </view>
      </view>
    </scroll-view>
    <view class="submit-btn"><u-button type="primary" @click="submit">提交</u-button></view>
    <teacher-tree  :isRadio="isRadio"  :isCheck="isCheck" :teacherTag="teacherTag" v-if="teacherTag" :schoolInfo="schoolInfo" @close="teacherTag = false"
		 @confirm="teacherSelcet" :classChecked="[]">
		</teacher-tree>
    <u-popup ref="popup" mode="center" length="75%" :mask-close-able="false">
      <scroll-view scroll-y="true" class="scroll" @scrolltolower="loadMore">
        <view>
          <radio-group @change="radioUser">
            <label
              class="list u-bd-b u-fx-jsb"
              v-for="(item, index) in studentList"
              :key="index"
            >
              <label :for="item.userName">
                <text>{{ item.userName }}</text>
              </label>
              <radio
                :id="item.userCode"
                :value="`${item.userCode}^${item.userName}=${item.photoUrl}`"
                :checked="item.checked"
              ></radio>
            </label>
          </radio-group>
        </view>
      </scroll-view>
      <view class="submit-btn u-fx-ac">
        <!-- <u-button class="btn u-font-01" size="mini"  @click="cancel(1)">取消</u-button> -->
        <u-button
          class="btn u-font-01"
          type="primary"
          size="mini"
          @click="ok(1)"
          >确定</u-button
        >
      </view>
    </u-popup>
  </view>
</template>

<script>
import eventBus from "@u/eventBus";
import anUploadImg from "@/components/an-uploadImg/an-uploadImg";
import { actions, store } from "../store/index";
  import teacherTree from "@/components/teacher-tree/teacher-tree"
export default {
  components: {
    anUploadImg,
    teacherTree
  },
  data() {
    return {
      role: [],
      reasonList: [],
      dataList: [],
      studentList: [],
      currentRole: 0,
      leaveInfo: {
        startDate: this.$tools.getPhoneTime(new Date(), "noSecond"),
        endDate: this.$tools.getPhoneTime(
          new Date(new Date().getTime() + 2 * 60 * 60 * 1000),
          "noSecond"
        ),
        duration: "2",
        outSchool: "",
        remark: "",
        photoList: [],
        reasonId: "",
        reason: "",
        userCode: "",
        userName: "",
        leaveCopyList: [],
        leaveApprovalAddDto:{}
      },
      oddNumbers: "",
      pageList: {
        page: 1,
        size: 15,
      },
      morePage: false,
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
      keyword: "",
      teacherTag: false,
      schoolInfo: {
        schoolYearId: 0,
        schoolCode: "",
      },
      type: 0,
      isCheck: false,
      isRadio: false
    };
  },
  created() {
    this.schoolInfo.schoolCode = store.userInfo.schoolCode
    this.schoolInfo.schoolYearId = store.schoolYear.schoolYearId
  },
  mounted() {
    this.oddNumbers = this.$tools.getQuery().get("oddNumbers")
    if (this.oddNumbers) {
      this.detailGet(this.oddNumbers)
    } else {
      this.leaveInfo.leaveApprovalAddDto.userName = store.userInfo.userName
      this.leaveInfo.leaveApprovalAddDto.userCode = store.userInfo.userCode
      this.leaveInfo.leaveApprovalAddDto.photoUrl = store.userInfo.photoUrl
      this.leaveReasonGet(0)
    }
    this.studentGet()
  },
  methods: {
    async detailGet(id) {
      const res = await actions.studentLeaveDetail(id);
      this.leaveInfo = res.data
      this.leaveInfo.leaveApprovalAddDto = this.leaveInfo.leaveApprovalAddDto[0]
      this.leaveInfo.startDate = this.$tools.getPhoneTime(
        new Date(this.leaveInfo.startTime),
        "noSecond"
      );
      this.leaveInfo.endDate = this.$tools.getPhoneTime(
        new Date(this.leaveInfo.endTime),
        "noSecond"
      );
      this.leaveReasonGet(1)
    },
    async studentGet(tag = false) {
      if (tag) {
        this.pageList.page += 1;
      } else {
        this.pageList.page = 1;
      }
      const req = {
        page: this.pageList.page,
        size: this.pageList.size,
        schoolCode: store.userInfo.schoolCode,
        headerTeacherId: store.userInfo.userCode,
      };
      const res = await actions.getClassStudent(req);
      if (tag) {
        this.studentList = this.studentList.concat(res.data.list);
      } else {
        this.studentList = res.data.list;
      }
      this.morePage = res.data.hasNextPage;
    },
    loadMore () {
     if (!this.morePage) {
        this.$tools.toast("数据已加载完毕")
        return
      }
      this.studentGet(true)
    },
    async leaveReasonGet(type) {
      const res = await actions.getLeaveReason();
      // this.reasonList = res.data;
      this.reasonList = res.data.filter(el=>el.name === '事假' || el.name === '病假' || el.name === '其他')
      this.role = [];
      this.reasonList.forEach((el) => {
        this.role.push(el.name);
      });
      if (type) {
        this.currentRole = this.role.indexOf(this.leaveInfo.reason);
      } else {
        this.leaveInfo.reasonId = this.reasonList[0].id;
        this.leaveInfo.reason = this.reasonList[0].name;
      }
    },
    radioChange(e) {
      this.leaveInfo.outSchool = e.target.value;
    },
    chooseRole(e) {
      this.currentRole = e.target.value;
      this.leaveInfo.reasonId = this.reasonList[e.target.value].id;
      this.leaveInfo.reason = this.reasonList[e.target.value].name;
    },
    check(type) {
      console.log('0',type)
      this.type = type
      if (type === 1) {
        this.leaveInfo.userName = "";
        this.$refs.popup.open();
      } else if (type === 2){
        this.isRadio = true
        this.isCheck = false
        this.teacherTag = true
      } else {
        this.isRadio = false
        this.isCheck = true
        this.teacherTag = true
      }
    },
    ok(type) {
      this.$refs.popup.close()
    },
    tagClick(item) {
      this.leaveInfo.leaveCopyList = this.leaveInfo.leaveCopyList.filter(el => el !== item)
    },
    radioUser(e) {
      const data = e.target.value;
      this.leaveInfo.userName = data.split("^")[1].split("=")[0];
      this.leaveInfo.userCode = data.split("^")[0];
    },
    startConfirm(params) {
      this.leaveInfo.startDate = `${params.year}/${params.month}/${params.day} ${params.hour}:${params.minute}`;
      this.leaveInfo.endDate = this.leaveInfo.endDate.replace(/-/g, "/");
      const time =
        (new Date(new Date(this.leaveInfo.endDate).getTime()).getTime() -
          new Date(new Date(this.leaveInfo.startDate).getTime()).getTime()) /
        1000 /
        60 /
        60;
      if (time > 0) {
        this.leaveInfo.duration = Math.ceil(time);
      } else {
        this.leaveInfo.duration = Math.floor(time);
      }
    },
    endConfirm(params) {
      this.leaveInfo.endDate = `${params.year}/${params.month}/${params.day} ${params.hour}:${params.minute}`;
      this.leaveInfo.startDate = this.leaveInfo.startDate.replace(/-/g, "/");
      const time =
        (new Date(new Date(this.leaveInfo.endDate).getTime()).getTime() -
          new Date(new Date(this.leaveInfo.startDate).getTime()).getTime()) /
        1000 /
        60 /
        60;
      if (time > 0) {
        this.leaveInfo.duration = Math.ceil(time);
      } else {
        this.leaveInfo.duration = Math.floor(time);
      }
    },
    teacherSelcet(value) {
      if (this.type === 2) {
        if(value.length === 0 ){
          this.$tools.toast("请选择人员")
          return
        }
        this.leaveInfo.leaveApprovalAddDto.userCode = value[0].userCode
        this.leaveInfo.leaveApprovalAddDto.userName = value[0].userName
        this.leaveInfo.leaveApprovalAddDto.photoUrl = value[0].photoUrl
        this.teacherTag = false
      } else if (this.type === 0) {
        this.leaveInfo.leaveCopyList = value.map(el=>{
          return {
            userCode: el.userCode,
            userName: el.userName,
            photoUrl : el.photoUrl
          }
        })
        this.teacherTag = false
      }
    },
    async submit() {
      if (this.leaveInfo.userName === "") {
        this.$tools.toast("请选择学生");
        return false;
      } else if (this.leaveInfo.outSchool === "") {
        this.$tools.toast("请选择是否出校");
        return false;
      } else if (
        new Date(this.leaveInfo.endDate).getTime() <=
        new Date(this.leaveInfo.startDate).getTime()
      ) {
        this.$tools.toast("请选择正确时间段");
        return false;
      }
      const photoList = this.leaveInfo.photoList.map((el) => {
        return el.url
      });
      const req = {
        photoList: photoList,
        schoolCode: store.userInfo.schoolCode,
        applicantCode: store.userInfo.userCode,
        applicantName: store.userInfo.userName,
        startTime: new Date(this.leaveInfo.startDate).getTime(),
        endTime: new Date(this.leaveInfo.endDate).getTime(),
        applicantType: "4",
      };
      if (this.oddNumbers) {
        await actions.updateStudentLeave({
          ...this.leaveInfo,
          ...req,
        });
        this.$tools.toast("操作成功");
        this.$tools.goNext(() => {
          eventBus.$emit("getList");
          this.$tools.goBack();
        });
      } else {
        await actions.addStudentLeave({
          ...this.leaveInfo,
          ...req,
        });
        this.$tools.toast("操作成功");
        this.$tools.goNext(() => {
          eventBus.$emit("getList");
          this.$tools.goBack();
        });
      }
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
  }
  .scroll {
    height: 70vh;
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
    .student-btn {
      bottom: 12vh;
    }
  }
}
.copyer {
  .u-size-default {
    padding: 10rpx 5rpx;
  }
}
.img-margin {
  margin: 20rpx;
}
.mar-l10 {
  margin-left: 10rpx;
}
.submit-btn {
  height: 80rpx;
  justify-content: center;
  .btn {
    letter-spacing: 8rpx;
    margin: 0 20rpx;
  }
}
.an-uploadImg-group {
	overflow: auto;
	height: 100%;
}
.an-img {
	float: left;
	position: relative;
}
.an-img-add {
	float: left;
	font-size: 50rpx;
	height: 80rpx;
	width: 80rpx;
	color:#666;
	text-align: center;
	line-height: 80rpx;
}
.upload-icon {
	height: 100rpx;
	width: 100rpx;
	display: block;
}
.u-text-center {
  text-align: center;
}
</style>
