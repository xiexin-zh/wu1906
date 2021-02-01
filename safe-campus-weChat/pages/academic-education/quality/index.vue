<template>
  <view class="list-box u-fx-ver">
    <no-data v-if="passed" msg="暂无数据"></no-data>
    <view v-else class="form u-fx-f1 u-padd-20">
      <view class="user-info u-bg-fff u-border-radius u-padd-20">
        <view class="u-fx-ac u-mar-b20">
          <view class="line" />
          <text class="name">被评人信息</text>
        </view>
        <view class="u-fx-ac">
          <image
            v-if="evaluatedUser.userPhotoUrl"
            class="icon"
            :src="evaluatedUser.userPhotoUrl"
          ></image>
          <svg
            v-else
            t="1611886424633"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="2512"
            width="200"
            height="200"
          >
            <path
              d="M510.45 70.554c-243.163 0-442.115 198.951-442.115 442.115 0 243.16 198.952 442.11 442.116 442.11 243.159 0 442.11-198.95 442.11-442.11 0-243.165-198.951-442.115-442.11-442.115z m11.051 132.633c168.556 0 168.556 127.11 168.556 198.95 0 71.847-66.318 204.48-168.556 207.24-99.475 0-168.556-132.632-168.556-207.24 0.001-71.841 0.001-198.95 168.556-198.95z m-11.05 726.723c-127.11 0-243.164-58.03-320.534-149.211 11.051-27.635 24.868-58.03 44.212-74.607 41.446-33.162 165.79-88.425 165.79-88.425l77.37 149.215 13.816-35.923L469 686.747l44.212-44.208 44.212 44.208-19.345 46.974 11.055 35.924 80.132-146.45s124.343 55.262 165.793 88.424c19.34 13.813 33.157 38.685 41.447 60.787C761.9 869.12 643.082 929.91 510.45 929.91z m0 0"
              fill="#bfbfbf"
              p-id="2513"
            ></path>
          </svg>
          <view class="u-fx-ver u-mar-l20">
            <text class="u-mar-b10"> {{ evaluatedUser.userName }} </text>
            <text>组织结构：{{ evaluatedUser.userDeptName }}</text>
          </view>
        </view>
      </view>
      <view
        class="ques-list u-bg-fff u-border-radius u-padd-20 u-mar-b10"
        v-for="item in questionList"
        :key="item.id"
      >
        <view class="model-name u-mar-b20">{{ item.name }}</view>
        <view v-for="(el, i) in item.children" :key="el.id">
          <view class="u-mar-t10">
            <text class="child-name">{{
              `【${i + 1}】${el.name}(${el.allScore}分)：`
            }}</text>
            <text class="required">{{ el.content }}</text>
          </view>
          <view v-if="el.allScore <= 5" class="u-padd-20">
            <u-radio-group v-model="el.score">
              <u-radio
                v-for="(score, index) in el.allScore"
                :key="index"
                :name="score"
              >
                {{ `${score}分` }}
              </u-radio>
            </u-radio-group>
            <view v-if="hasSubmit && !el.score" class="error-tip u-mar-t10"
              >{{ `请选择分数` }}
            </view>
          </view>
          <view v-else class="u-padd-20">
            <u-input
              :value="el.score"
              @click="(value) => inputScore(value, item.id, el.id, el.score)"
              type="number"
              disabled
              height="60"
              :clearable="false"
              :border="true"
              :placeholder="`请输入1-${el.allScore}内分数`"
            />
            <view v-if="hasSubmit && !el.score" class="error-tip u-mar-t10"
              >{{ `请输入分数` }}
            </view>
            <view
              v-if="el.score && Number(el.score) > el.allScore"
              class="error-tip u-mar-t10"
              >{{ `请输入1-${el.allScore}内的分数` }}
            </view>
          </view>
        </view>
      </view>
    </view>
    <view v-if="!passed" class="submit u-fx-ac-jc">
      <u-button style="width: 100%" type="primary" @click="submitForm">
        提交
      </u-button>
    </view>
    <u-keyboard
      ref="uKeyboard"
      mode="number"
      :tips="nowScore ? nowScore : '输入分数'"
      :dot-enabled="false"
      v-model="show"
      @change="changeScore"
      @backspace="backspace"
    ></u-keyboard>
  </view>
</template>

<script>
import eventBus from "@u/eventBus";
import noData from "@/components/no-data/no-data.vue";
import { store, actions } from "../store/index.js";
import Tools from "@u/tools";
export default {
  name: "Quality",
  components: {
    noData,
  },
  data() {
    return {
      Tools,
      passed: true,
      show: false,
      hasSubmit: false,
      nowScore: "",
      evaluatedUser: {},
      questionList: [],
    };
  },
  computed: {
    userInfo() {
      return store.userInfo;
    },
  },
  watch: {},
  created() {
    this.listId = this.$tools.getQuery().get("id");
    this.bussId = this.$tools.getQuery().get("bussId");
  },
  mounted() {
    eventBus.$on("getList", () => {
      this.showList();
    });
    this.showList();
  },
  methods: {
    async showList() {
      const res = await actions.getQuesDetail({ bussId: this.bussId });
      this.passed = false;
      const { evaluatedUser, quotaList } = res.data;
      this.evaluatedUser = evaluatedUser;
      this.questionList = quotaList.map((item) => {
        return {
          id: item.id,
          name: item.name,
          score: item.score,
          children: item.secondQuotaList.map((el) => {
            return {
              id: el.id,
              name: el.name,
              content: el.remark,
              allScore: el.score,
              score: el.evaluateScore || "",
            };
          }),
        };
      });
    },
    async submitForm() {
      this.hasSubmit = true;
      let pass = true;
      this.questionList.forEach((item) => {
        item.children.forEach((el) => {
          if (!el.score || Number(el.score) > el.allScore) {
            pass = false;
            return false;
          }
        });
      });
      if (!pass) {
        this.$tools.toast("请修改错误分数");
        return;
      }
      const req = {
        evaluatorCode: this.userInfo.userCode,
        evaluatedUser: this.evaluatedUser,
        quotaList: this.questionList.map((item) => {
          return {
            id: item.id,
            name: item.name,
            score: item.score,
            secondQuotaList: item.children.map((el) => {
              return {
                id: el.id,
                name: el.name,
                remark: el.content,
                score: Number(el.allScore),
                evaluateScore: Number(el.score),
              };
            }),
          };
        }),
      };
      await actions.submitQues(req);
      this.$tools.toast("感谢您的评价！", 1);
      this.$tools.goNext(() => {
        eventBus.$emit("getList");
        this.$tools.goBack();
      });
    },
    inputScore(e, pId, cId, score) {
      this.activeQues = [pId, cId];
      this.nowScore = score;
      this.show = true;
    },
    changeScore(val) {
      this.nowScore = this.nowScore += val;
      this.questionList = this.questionList.map((item) => {
        if (item.id === this.activeQues[0]) {
          return {
            ...item,
            children: item.children.map((el) => {
              if (el.id === this.activeQues[1]) {
                return {
                  ...el,
                  score: `${el.score}${val}`,
                };
              }
              return el;
            }),
          };
        }
        return item;
      });
    },
    backspace() {
      // 删除value的最后一个字符
      if (this.nowScore.length) {
        this.nowScore = this.nowScore.substr(0, this.nowScore.length - 1);
      }
      this.questionList = this.questionList.map((item) => {
        if (item.id === this.activeQues[0]) {
          return {
            ...item,
            children: item.children.map((el) => {
              if (el.id === this.activeQues[1]) {
                return {
                  ...el,
                  score: el.score.length
                    ? `${el.score.substr(0, el.score.length - 1)}`
                    : "",
                };
              }
              return el;
            }),
          };
        }
        return item;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.list-box {
  height: 100vh;
  overflow-y: auto;
  position: relative;
}
.user-info {
  min-height: 20rpx;
  margin-bottom: 20rpx;
}

.ques-list {
  .model-name {
    font-weight: 800;
    font-size: 30rpx;
    color: #2979ff;
  }
  .child-name {
    font-weight: 600;
  }
}
.submit {
  padding: 20rpx;
}

.line {
  height: 40rpx;
  width: 6rpx;
  background-color: #2979ff;
}
.name {
  font-size: 30rpx;
  font-weight: 700;
  margin-left: 20rpx;
}
.icon {
  width: 100rpx;
  height: 100rpx;
}
.required::after {
  position: relative;
  z-index: 99;
  content: "*";
  top: 6rpx;
  color: red;
  font-weight: bold;
  left: 8rpx;
}
.error-tip {
  color: red;
  font-size: 24rpx;
}
</style>
