<template>
  <view class="list-box u-fx-ver">
    <no-data v-if="quesList.length === 0" msg="暂无数据"></no-data>
    <view v-else class="form u-fx-f1 u-fx u-padd-20">
      <view class="ques-list u-padd-20 u-fx-f1 u-bg-fff u-border-radius">
        <view
          class="list-item u-mar-t20"
          v-for="(item, i) in quesList"
          :key="item.id"
        >
          <view class="ques-title">
            {{ `【${i + 1}】${item.description}` }}
            <text class="required"></text>
          </view>
          <view class="u-padd-l20 u-padd-r20">
            <view class="u-mar-t20" v-if="item.type === '1'">
              <u-radio-group v-model="item.answer[0]">
                <u-radio
                  v-for="(el, index) in item.optionList"
                  :key="index"
                  :name="el"
                >
                  {{ el }}
                </u-radio>
              </u-radio-group>
              <view
                v-show="!passed && item.answer.length === 0"
                class="error-tip u-padd-t20"
                >请选择选项</view
              >
            </view>
            <view class="u-mar-t20" v-if="item.type === '2'">
              <u-checkbox-group v-model="item.answer" class="u-fx-ver">
                <u-checkbox
                  v-model="el.checked"
                  v-for="(el, index) in item.optionList"
                  :key="index"
                  :name="el.name"
                  >{{ el.name }}</u-checkbox
                >
              </u-checkbox-group>
              <view
                v-show="!passed && !getResult(item.optionList)"
                class="error-tip u-padd-t20"
                >至少选择一项</view
              >
            </view>
            <view class="u-mar-t20" v-if="item.type === '3'">
              <u-input
                v-model="item.answer[0]"
                type="textarea"
                :maxlength="200"
                :auto-height="true"
                :clearable="false"
                :border="true"
                placeholder="限200字内"
              />
              <view
                v-show="!passed && !item.answer[0]"
                class="error-tip u-padd-t20"
                >请填写内容</view
              >
            </view>
          </view>
        </view>
      </view>
    </view>
    <view class="submit u-fx-ac-jc">
      <u-button style="width: 100%" type="primary" @click="submitForm">
        提交
      </u-button>
    </view>
  </view>
</template>

<script>
import eventBus from "@u/eventBus";
import noData from "@/components/no-data/no-data.vue";
import { store, actions } from "../store/index.js";
export default {
  name: "Survey",
  components: {
    noData,
  },
  data() {
    return {
      passed: true,
      quesList: [
        {
          answer: [],
          description: "老师上课时，是否有迟到早退现象？",
          id: 1,
          optionList: ["是", "否"],
          type: "1",
        },
        {
          answer: [],
          description:
            "老师上课时，是否问过孩子“这套题我们做过吗？”或“我们讲到哪里了？”",
          id: 2,
          optionList: ["是", "否"],
          type: "1",
        },
        {
          answer: [],
          description: "老师是否为您的孩子制定教学计划？",
          id: 3,
          optionList: [
            { id: 1, name: "选项1", checked: false },
            { id: 2, name: "选项2", checked: false },
            { id: 3, name: "现象3", checked: false },
          ],
          type: "2",
        },
        {
          answer: [],
          description: "学生每次上课，老师是否出示教案让学生进行评价？",
          id: 4,
          optionList: [
            { id: 1, name: "选项1", checked: false },
            { id: 2, name: "选项2", checked: false },
            { id: 3, name: "现象3", checked: false },
          ],
          type: "2",
        },
        {
          answer: [],
          description: "老师是否给孩子做阶段测试？",
          id: 5,
          optionList: [],
          type: "3",
        },
        {
          answer: [],
          description:
            "老师在上课时是否做与课堂内容无关的事情(如玩手机、吃东西、聊天等)？",
          id: 6,
          optionList: [],
          type: "3",
        },
      ],
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
    // this.showList();
  },
  methods: {
    async showList() {
      const res = await actions.getQuesDetail({ bussId: this.bussId });
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
    getResult(qsList) {
      const list = qsList.filter((item) => item.checked);
      return list.length > 0;
    },
    async submitForm() {
      console.log(this.quesList);
      this.passed = false;
      let pass = false;
      if (!pass) {
        this.$tools.toast("请完善选项");
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
      this.$tools.toast("感谢您的填写！", 1);
      this.$tools.goBack();
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

.ques-list {
  overflow-y: auto;
}
.ques-title {
  font-weight: 700;
}
.list-item {
  margin-bottom: 60rpx;
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
