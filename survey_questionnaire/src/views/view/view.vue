<template>
  <div class="viewBox">
    <div
      v-if="clientWidth > 540"
      :class="this.$route.params.type == '1' && isPublish && !isToTime && !isExpired ? 'viewLeft' : 'viewLeft1'"
    >
      <img
        v-if="this.$route.params.type == '1' && isPublish && !isToTime && !isExpired"
        id="leftImg"
        :src="require('../../../public/img/left.png')"
        alt
      />
    </div>
    <div v-loading.fullscreen.lock="loading" class="view-layout">
      <div
        v-if="this.$route.params.type == '1' && isPublish && !isToTime && !isExpired "
        class="topImg"
      ></div>
      <div v-if="!isPublish && this.$route.params.type == '1'" class="main">
        <div class="header">
          <h1>问卷未发布！</h1>
        </div>
        <div class="content">
          <p>您所填写的问卷未发布，暂不能填写。</p>
        </div>
      </div>
      <div v-else-if="isExpired && this.$route.params.type == '1'" class="main">
        <div class="header">
          <h1>问卷已过期！</h1>
        </div>
        <div class="content">
          <p>您所填写的问卷已到截止日期，暂不能填写。</p>
        </div>
      </div>
      <div v-else-if="isToTime && this.$route.params.type == '1'" class="main">
        <div class="header">
          <h1>填写时间未开始！</h1>
        </div>
        <div class="content">
          <p>您所填写的问卷未到开始日期，暂不能填写。</p>
        </div>
      </div>
      <div v-else-if="naire" class="main">
        <div class="header naireTitle">
          <h1>{{ naire.title }}</h1>
        </div>
        <div class="content">
          <div class="intro">
            <div class="naireDes" style="white-space: pre-wrap" v-html="naire.intro"></div>
            <!-- <p class="mt-10">截止日期：{{ naire.deadline | formatTime }}</p> -->
          </div>
          <div class="welText" v-if="naire.welcometxt.length > 0">
            <div class="weltxtContent" v-html="naire.welcometxt"></div>
          </div>
          <div class="user-info" v-if="this.$route.params.type == '1'&&naire.ispublic == '0'">
            <el-alert :type="isLogin ? 'success' : 'warning'">{{ loginTip }}</el-alert>
            <el-form
              v-show="!isLogin"
              ref="userInfo"
              class="mt-10"
              :model="visitCode"
              :rules="codeRule"
              inline
            >
              <el-form-item prop="code">
                <el-input v-model="visitCode.code" placeholder="请填写访问码" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="handleSubmit">点击验证</el-button>
              </el-form-item>
            </el-form>
          </div>

          <div
            v-if="(isLogin && this.$route.params.type=='1') || this.$route.params.type=='0' || ispublic"
          >
            <question-list :question-list="naire.topic" />
          </div>

          <div
            class="text-center"
            v-if="(this.$route.params.type == '1' && isLogin) || (ispublic && this.$route.params.type == '1')"
          >
            <!-- <el-button v-if="this.$route.params.type == '0'" type="success" @click="goBack">返回管理平台</el-button> -->
            <el-button
              size="medium"
              type="primary"
              :loading="finished"
              :disabled="finished"
              @click="submitNaire"
            >提交问卷</el-button>
          </div>
        </div>
      </div>
      <div class="footer">
        <p>悦享问卷系统</p>
      </div>
    </div>
    <div
      v-if="clientWidth > 540"
      :class="this.$route.params.type == '1' && isPublish && !isToTime && !isExpired ? 'viewRight' : 'viewRight1'"
    >
      <img
        v-if="this.$route.params.type == '1' && isPublish && !isToTime && !isExpired"
        id="rightImg"
        :src="require('../../../public/img/right.png')"
        alt
      />
    </div>
  </div>
</template>

<script lang="ts">
/* eslint-disable */
import { Component, Vue, Watch } from "vue-property-decorator";
import { UserModule } from "@/store/modules/user";
import * as NaireAction from "@/api/naire";
import * as UserAction from "@/api/user";
import QuestionList from "./components/Question/QuestionList.vue";
import { ElForm } from "element-ui/types/form";
import { questionType } from "@/config/enum/questionType";

@Component({
  components: {
    QuestionList
  }
})
export default class extends Vue {
  private loading: boolean = false;
  private naire: any = null;
  private isLogin: boolean = false;
  private userId: string = "";
  private visitCode: any = {
    code: ""
  };
  private codeRule: any = {
    visitCode: [{ required: true, message: "请填写访问码", trigger: "blur" }]
  };
  private finished: boolean = false;
  private isPublish: boolean = false;
  private isExpired: boolean = false;
  private isToTime: boolean = false;
  private ispublic: boolean = false;
  private endtxt: string = "";
  private clientWidth: number = 0;

  @Watch("$route")
  watchRoute() {
    if (this.$route.params.normal == "template") {
      this.fetchDataTem();
    } else {
      this.fetchData();
    }
  }

  get loginTip() {
    if (this.isLogin) return `访问码验证成功，请继续完成问卷！`;
    return `在填写表单之前，请先填写访问码。`;
  }

  // 是否为管理员
  get isAdmin() {
    return UserModule.isAdmin;
  }

  // // 问卷已截止
  // get isExpired() {
  //   return Number(this.naire.deadline) < new Date().getTime();
  // }

  //时间未开始
  // get isToTime() {
  //   return Number(this.naire.starttime) > new Date().getTime();
  // }

  // 返回管理平台
  goBack() {
    this.$router.push("/list");
  }

  // 访问码验证
  async handleSubmit() {
    if (this.visitCode.code.length == 0) {
      return this.$message.error("请填写访问码");
    }
    const res = await UserAction.regCode({
      surveyId: this.$route.params.id,
      visitCode: this.visitCode.code
    });
    if (res.success) {
      if (!res.data.isfinish_survey) {
        this.isLogin = true;
        this.userId = res.data.u_id;
      } else {
        return this.$message.error("您已填写过问卷");
      }
    } else {
      return this.$message.error("访问码验证失败");
    }
  }

  // 问卷表单校验
  validateNaire() {
    let _flag = true;
    let _addtion = false;
    this.naire.topic.forEach(
      (item: Questionnaire.IQuestionItem, index: number) => {
        if (item.isRequired) {
          if (item.type === questionType.SINGLE_TEXT) {
            if (!(item.selectContent && item.selectContent.trim().length > 0)) {
              _flag = false;
            }
          }
          if (item.type === questionType.TEXT_MUILTIPLE) {
            if (!(item.selectContent && item.selectContent.trim().length > 0)) {
              _flag = false;
            }
          }
          if (item.type === questionType.SINGLE_CHOICE) {
            if (!(item.selectContent && item.selectContent.trim().length > 0)) {
              _flag = false;
            }
          }
          if (item.type === questionType.DROP_DOWN) {
            if (!(item.selectContent && item.selectContent.trim().length > 0)) {
              _flag = false;
            }
          }
          if (item.type === questionType.DATE_PICKER) {
            if (!(item.selectContent && item.selectContent.trim().length > 0)) {
              _flag = false;
            }
          }
          if (item.type === questionType.MULTIPLE_CHOICE) {
            if (
              !(
                item.selectMultipleContent &&
                item.selectMultipleContent.length > 0
              )
            ) {
              _flag = false;
            }
            // 必选几项
            if (
              item.setting.last &&
              item.setting.last > 0 &&
              item.selectContent &&
              item.selectContent.length !== Number(item.setting.last)
            ) {
              _flag = false;
            }
          }
        }
      }
    );
    if (!_flag) {
      this.$notify.warning({
        title: "提示",
        message: "您还有必填项未正确填写，请检查后提交！",
        type: "warning"
      });
      return false;
    }
    // if (_addtion) {
    //   this.$notify.warning({
    //     title: "提示",
    //     message: "请填写附加理由",
    //     type: "warning"
    //   });
    //   return false;
    // }
    if (this.$route.params.type == "1" && !this.isLogin && !this.ispublic) {
      this.$notify.warning({
        title: "提示",
        message: "请先验证访问码",
        type: "warning"
      });
      return false;
    }
    return true;
  }

  // 提交问卷
  async submitNaire() {
    if (!this.validateNaire()) {
      return;
    }
    this.finished = true;
    const nId = this.naire.n_id;
    const result: any[] = [];

    this.naire.topic.forEach(
      (question: Questionnaire.IQuestionItem, index: number) => {
        if (question.type === "单选题") {
          const curQues = {
            n_id: nId,
            u_id: this.userId,
            q_id: question.q_id,
            o_id: question.selectContent,
            o_addition: question.additional ? question.additional.trim() : ""
          };
          result.push(curQues);
        } else if (question.type === "多选题") {
          const curQues = {
            n_id: nId,
            u_id: this.userId,
            q_id: question.q_id,
            o_id: question.selectMultipleContent,
            o_addition: question.additional ? question.additional.trim() : ""
          };
          result.push(curQues);
        } else if (question.type === "下拉框") {
          const curQues = {
            n_id: nId,
            u_id: this.userId,
            q_id: question.q_id,
            o_id: question.selectContent,
            o_addition: question.additional ? question.additional.trim() : ""
          };
          result.push(curQues);
        } else if (question.type === "单行文本") {
          const curQues = {
            n_id: nId,
            u_id: this.userId,
            q_id: question.q_id,
            o_id: "",
            o_addition: question.selectContent
              ? question.selectContent.trim()
              : ""
          };
          result.push(curQues);
        } else if (question.type === "日期时间") {
          const curQues = {
            n_id: nId,
            u_id: this.userId,
            q_id: question.q_id,
            o_id: "",
            o_addition: question.selectContent
              ? question.selectContent.trim()
              : ""
          };
          result.push(curQues);
        } else {
          const curQues = {
            n_id: nId,
            u_id: this.userId,
            q_id: question.q_id,
            o_id: "",
            o_addition: question.selectContent
              ? question.selectContent.trim()
              : ""
          };
          result.push(curQues);
        }
      }
    );
    const res = await NaireAction.submit({
      nId,
      result: result,
      userId: this.userId
    });
    this.finished = false;
    if (res.success) {
      localStorage.setItem("endTxt", this.endtxt);
      localStorage.setItem("title", this.naire.title);
      this.$message.success("提交成功");
      this.$router.push(`/complete/${this.$route.params.id}`);
    } else {
      this.$message.error("提交失败");
    }
  }

  async fetchData() {
    this.loading = true;
    const res = await NaireAction.detail({
      n_id: this.$route.params.id
    });
    this.loading = false;
    if (res.success) {
      this.naire = res.data;
      this.endtxt = res.data.endtxt;
      this.isPublish = res.data.status == "1";
      this.ispublic = res.data.ispublic == "1";
      this.isExpired = Number(this.naire.deadline) < new Date().getTime();
      this.isToTime = Number(this.naire.starttime) > new Date().getTime();
      document.title = res.data.title;
    }
  }
  async fetchDataTem() {
    this.loading = true;
    const res = await NaireAction.detailTem({
      n_id: this.$route.params.id
    });
    this.loading = false;
    if (res.success) {
      this.naire = res.data;
      this.endtxt = res.data.endtxt;
      this.isPublish = res.data.status == "1";
      this.ispublic = res.data.ispublic == "1";
      this.isExpired = Number(this.naire.deadline) < new Date().getTime();
      this.isToTime = Number(this.naire.starttime) > new Date().getTime();
      document.title = res.data.title;
    }
  }

  handleScroll(e: any) {
    let scrollTop =
      e.target.documentElement.scrollTop || e.target.body.scrollTo;
    const leftImg = document.getElementById("leftImg");
    const rightImg = document.getElementById("rightImg");
    if (leftImg) {
      leftImg.style.top = scrollTop + 100 + "px";
    }
    if (rightImg) {
      rightImg.style.top = scrollTop + 100 + "px";
    }
  }

  mounted() {
    if (this.$route.params.normal == "template") {
      this.fetchDataTem();
    } else {
      this.fetchData();
    }
    this.clientWidth = document.body.clientWidth;
    window.addEventListener("scroll", this.handleScroll, true);
  }
}
</script>

<style lang="scss" scoped>
.viewBox {
  display: flex;
  background-color: #edf0f8;
}
.viewLeft {
  flex: 1;
  background-color: #f7f4f8;
  overflow: hidden;
  display: flex;
  justify-content: flex-end;
  padding-right: 20px;
}
.viewLeft img {
  width: 250px;
  height: 500px;
  // margin: 150px 20px 0 0;
  position: absolute;
  top: 150px;
}
.viewLeft1 {
  flex: 1;
  background-color: #f7f4f8;
  overflow: hidden;
  justify-content: flex-start;
}
.viewRight {
  flex: 1;
  background-color: #f7f4f8;
  overflow: hidden;
  padding-left: 20px;
}
.viewRight img {
  width: 250px;
  height: 500px;
  // margin: 150px 0 0 20px;
  position: absolute;
  top: 150px;
}
.viewRight1 {
  flex: 1;
  background-color: #f7f4f8;
  overflow: hidden;
}
.view-layout {
  background-color: #f7f4f8;
  min-height: 100vh;
  max-width: 800px;
  height: 100%;
  width: 100%;
  // padding: 20px 10px;
  font-size: 14px;
  // overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  display: flex;
  flex-direction: column;

  .topImg {
    height: 100px;
    background: #f7f4f8 url("../../../public/img/top.png") no-repeat center
      center;
    background-size: 100% 100%;
  }

  .main {
    flex: 1;
    max-width: 800px;
    width: 100%;
    height: auto;
    margin: 0 auto;
    padding-bottom: 30px;
    background-color: #fff;
    box-shadow: 0 2px 5px 1px rgba(124, 124, 124, 0.2);
  }

  .header {
    padding: 30px 20px;
    height: auto;
    min-height: 33px;
    border-bottom: 2px dotted #eee;

    h1 {
      width: 100%;
      margin: 0 auto;
      text-align: center;
      font-size: 24px;
    }
  }

  .naireTitle {
    color: #4a90e2;
  }

  .content {
    padding: 20px;
    text-align: left;
    font-size: inherit;

    .intro {
      margin: 10px 0;
    }
  }
  .text-center {
    display: flex;
    justify-content: center;
    align-content: center;
  }

  .footer {
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-top: 1px dotted #eee;
  }
}

.code-row-bg button {
  margin: 0 10px;
}

.naireDes {
  padding-bottom: 25px;
  box-sizing: border-box;
}
.welText {
  padding-bottom: 25px;
}
.endText {
  padding: 20px 0 40px;
}
</style>
