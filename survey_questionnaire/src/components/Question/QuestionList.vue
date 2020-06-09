<template>
  <div>
    <div v-if="questionList && questionList.length === 0" class="no-question">一点东西都没有，赶快添加题目吧！</div>
    <div v-for="(topic, index) in questionList" :key="index" :class="['question-item', type]">
      <div class="question-order">
        <div>Q{{ index + 1 }}：</div>
        <!-- 删除问题-->
        <div class="question-action" @click="delQuestion(index)">
          <i class="el-icon-delete-solid" />
        </div>
      </div>
      <div class="question-content">
        <el-card shadow="hover">
          <question-item :type="topic.type" :topic="topic" :index="index" v-on="$listeners" />
        </el-card>
      </div>
      <div class="tip">
        <div class="tip1">
          <span @click="openQsBox(index)">在此题后插入新题</span>
        </div>
        <div class="tip2">
          <!-- <el-button size="mini" @click="copyQuestion(topic.type,index)">复制</el-button>
          <el-button size="mini" @click="delQuestion(index)">删除</el-button>
          <el-button size="mini" @click="changeQsPs('top',index)">上移</el-button>
          <el-button size="mini" @click="changeQsPs('bottom',index)">下移</el-button>
          <el-button size="mini" @click="stickQs('first',index)">最前</el-button>
          <el-button size="mini" @click="stickQs('last',index)">最后</el-button>-->
          <div class="opBtn" @click="copyQuestion(topic.type,index)">
            <img :src="require('../../../public/img/setting/add/copy.png')" alt />
            <span>复制</span>
          </div>
          <div class="opBtn" @click="delQuestion(index)">
            <img :src="require('../../../public/img/setting/add/delete.png')" alt />
            <span>删除</span>
          </div>
          <div class="opBtn" @click="changeQsPs('top',index)">
            <img :src="require('../../../public/img/setting/add/toTop.png')" alt />
            <span>上移</span>
          </div>
          <div class="opBtn" @click="changeQsPs('bottom',index)">
            <img :src="require('../../../public/img/setting/add/toBottom.png')" alt />
            <span>下移</span>
          </div>
          <div class="opBtn" @click="stickQs('first',index)">
            <img :src="require('../../../public/img/setting/add/pre.png')" alt />
            <span>最前</span>
          </div>
          <div class="opBtn" @click="stickQs('last',index)">
            <img :src="require('../../../public/img/setting/add/next.png')" alt />
            <span>最后</span>
          </div>
        </div>
      </div>
      <el-dialog class="qsBox" :visible.sync="openQs" :destroy-on-close="true" title="选择题目类型">
        <div class="insertBox">
          <el-button @click="insertOption('单选题')" size="mini">单选题</el-button>
          <el-button @click="insertOption('多选题')" size="mini">多选题</el-button>
          <el-button @click="insertOption('下拉框')" size="mini">下拉框</el-button>
          <el-button @click="insertOption('单行文本')" size="mini">单行文本</el-button>
          <el-button @click="insertOption('多行文本')" size="mini">多行文本</el-button>
          <el-button @click="insertOption('时间日期')" size="mini">时间/日期</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script lang="ts">
/* eslint-disable */
import { Component, Vue, Prop } from "vue-property-decorator";
import QuestionItem from "@/components/Question/QuestionItem.vue";

@Component({
  components: {
    QuestionItem
  }
})
export default class extends Vue {
  @Prop() questionList!: Questionnaire.IQuestionItem[];
  @Prop({ default: "normal" }) type?: string;

  private openQs: boolean = false;
  private qsIndex: number = 0;

  private delQuestion(index: number) {
    this.$emit("delQuestion", { index });
  }

  private copyQuestion(type: string, index: number) {
    this.$emit("copyQuestion", { type, index });
  }
  private changeQsPs(type: string, index: number) {
    this.$emit("changeQsPs", { type, index });
  }

  private stickQs(type: string, index: number) {
    this.$emit("stickQs", { type, index });
  }
  private insertOption(type: string) {
    this.$emit("insertOption", { type, index: this.qsIndex });
    this.closeQsBox();
  }

  private openQsBox(index: number) {
    this.qsIndex = index;
    this.openQs = true;
  }

  private closeQsBox() {
    this.openQs = false;
  }
}
</script>

<style lang="scss" scoped>
.no-question {
  margin: 30px 0;
  font-size: 14px;
  padding-left: 40px;
  box-sizing: border-box;
}

.question-item {
  display: flex;
  align-content: center;
  justify-content: flex-start;
  margin-bottom: 20px;
  position: relative;

  .question-order {
    flex: 60px 0 0;
    text-align: center;
  }

  .question-action {
    &:hover {
      color: #018fe5;
      cursor: pointer;
    }
  }

  .question-content {
    flex: 1;
  }
}

.tip {
  width: 60%;
  height: 40px;
  position: absolute;
  bottom: 20px;
  right: 10px;
  justify-content: space-between;
  display: none;
}
.tip1 {
  width: 150px;
  height: 40px;
  font-size: 14px;
  color: #3399ff;
  border: 2px solid #7ed321;
  border-radius: 6px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
.tip1 span {
  cursor: pointer;
}
.tip2 {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-size: 12px;
}
.opBtn {
  width: 50px;
  height: 25px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-left: 10px;
  cursor: pointer;
}
.opBtn:hover {
  background-color: #f7f4f8;
}
.opBtn img {
  width: 12px;
  height: 12px;
}
.question-item:hover .tip {
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.qsBox {
  top: 20%;
}
.insertBox {
  display: flex;
  justify-content: space-around;
  align-items: center;
}
</style>
