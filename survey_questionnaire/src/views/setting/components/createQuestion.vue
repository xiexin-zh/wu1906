<template>
  <div class="createQs">
    <div class="qsTop">
      <div class="topOpn" @click="preView">
        <img :src="require('../../../../public/img/setting/view.png')" alt="">
        <span>预览</span>
      </div>
      <div class="topOpn" @click="saveQuestion">
        <img :src="require('../../../../public/img/setting/save.png')" alt="">
        <span>保存</span>
      </div>
    </div>
    <div class="qsContent">
      <div class="leftTab">
        <div class="tabTop">
          <div>
            <li
              v-for="item in tabList"
              :key="item.key"
              :class="activeTab == item.id ? 'qsItem' : ''"
              @click="changeTab(item.id)"
            >{{ item.title }}</li>
          </div>
        </div>
        <div class="tabOption">
          <div
            class="optionList"
            v-show="activeTab == 1"
            v-for="item in questionList"
            :key="item.id"
          >
            <div class="question">
              <p class="quesTitle">
                <span>{{ item.title }}</span>
                <span class="el-icon-caret-bottom"></span>
              </p>
              <div class="selectContent">
                <div
                  class="qsClassfy"
                  v-for="(list, index) in item.content"
                  :key="index"
                  @click="addOption(list.questionType)"
                >
                  <img class="qsIcon" :src="list.icon" alt />
                  <span class="qsTxt">{{ list.txt }}</span>
                  <div class="showTip" :style="'top:' + list.top">
                    <img class="tipImg" :src="list.img" alt />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="qsList" v-show="activeTab == 2">
            <li v-for="(item, index) in this.form.topic" :key="index" :title="item.question">
              {{ "Q" + (index + 1) + ": "
              }}{{
              item.question.length > 12
              ? item.question.slice(0, 12) + "..."
              : item.question
              }}
            </li>
          </div>
        </div>
      </div>

      <div class="rightAdd">
        <div class="rightContent">
          <el-form
            ref="form"
            :model="form"
            :rules="rules"
            prop="inputName"
            label-position="right"
            label-width="100px"
          >
            <el-form-item label="问卷名称" prop="title">
              <el-input v-model="form.title" />
            </el-form-item>
            <el-form-item label="问卷介绍" prop="intro">
              <div id="inputDes" v-html="form.intro" @click="openEdit('inputDes')"></div>
            </el-form-item>

            <question-list
              :question-list="form.topic"
              @delQuestion="onDelQuestion"
              @addOption="onAddOption"
              @delOption="onDelOption"
              @changeOption="changeOption"
              @copyQuestion="copyQuestion"
              @changeQsPs="changeQsPs"
              @stickQs="stickQs"
              @insertOption="insertOption"
            />

            <el-dialog
              :visible.sync="dialogVisible"
              :destroy-on-close="true"
              width="50%"
              class="editDialog"
            >
              <editor-bar
                v-if="dialogVisible"
                :editValue="editValue"
                :type="type"
                @change="getEditorVal"
              />
            </el-dialog>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import * as NaireAction from "@/api/naire";
import {
  getLength,
  regTel,
  regNumber,
  regClass,
  regBirthday,
  regIdCard,
  regCode
} from "@/utils/transform";
import EditorBar from "../../../components/wangEnduit/Editor.vue";
import QuestionList from "@/components/Question/QuestionList.vue";
import { questionType, questionTypeText } from "@/config/enum/questionType";

export default {
  data() {
    const validateTitle = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入问卷名称"));
      } else if (getLength(value) > 100) {
        callback(new Error("长度:中文50个字，英文100个字母"));
      } else {
        callback();
      }
    };
    return {
      tabList: [
        { id: 1, title: "题型选择", img: "", key: "qs1" },
        { id: 2, title: "问题列表", img: "", key: "qs2" }
      ],
      activeTab: 1,
      questionList: [
        {
          id: 1,
          title: "选择题",
          content: [
            {
              icon: require("../../../../public/img/setting/add-singleChoice.png"),
              txt: "单选",
              img: require("../../../../public/img/singleChoice.png"),
              questionType: questionType.SINGLE_CHOICE,
              top: "15px"
            },
            {
              icon: require("../../../../public/img/setting/add-mutilChoice.png"),
              txt: "多选",
              img: require("../../../../public/img/muiltChioce.png"),
              questionType: questionType.MULTIPLE_CHOICE,
              top: "15px"
            },
            {
              icon: require("../../../../public/img/setting/add-drop.png"),
              txt: "下拉框",
              img: require("../../../../public/img/dropDown.png"),
              questionType: questionType.DROP_DOWN,
              top: "50px"
            }
          ]
        },
        {
          id: 2,
          title: "填空题",
          content: [
            {
              icon: require("../../../../public/img/setting/add-singleTxt.png"),
              txt: "单行文本",
              img: require("../../../../public/img/singleTxt.png"),
              questionType: questionType.SINGLE_TEXT,
              top: "140px"
            },
            {
              icon: require("../../../../public/img/setting/add-mutilTxt.png"),
              txt: "多行文本",
              img: require("../../../../public/img/muiltTxt.png"),
              questionType: questionType.TEXT_MUILTIPLE,
              top: "140px"
            }
          ]
        },
        {
          id: 3,
          title: "其他题型",
          content: [
            {
              icon: require("../../../../public/img/setting/add-date.png"),
              txt: "日期/时间",
              img: require("../../../../public/img/datePicker.png"),
              questionType: questionType.DATE_PICKER,
              top: "235px"
            }
          ]
        }
      ],
      rowId: "",
      inputName: "",
      inputDes: "",
      rules: {
        title: [{ required: true, validator: validateTitle, trigger: "blur" }],
        intro: [{ required: false, message: "", trigger: "blur" }]
      },
      dialogVisible: false,
      editValue: "",
      type: "",
      form: {
        title: "",
        intro: "",
        status: "create",
        options: [],
        topic: []
      },
      imgTop: ""
    };
  },
  methods: {
    changeTab(id) {
      this.activeTab = id;
    },

    // 获取问卷基本数据
    async getBaseMsg(rowId) {
      if (rowId == "0") {
        return false;
      }
      const res = await NaireAction.getNaireClass({
        n_id: rowId
      });
      if (res.success) {
        let newData = res.data;
        newData.status = "update";
        this.form = newData;
      }
    },

    getEditorVal(type, value) {
      if (type == "inputDes") {
        this.form.intro = value;
      }
    },

    // 打开问卷描述富文本编辑框
    openEdit(value) {
      if (value == "inputDes") {
        this.editValue = this.form.intro;
      }
      this.type = value;
      this.dialogVisible = true;
    },

    // 添加题目
    addOption(type) {
      switch (type) {
        case questionType.SINGLE_CHOICE:
          const radioQues = {
            question: "单选题目",
            options: [
              {
                content: "选项",
                isAddition: false,
                image: "",
                desc: "",
                sort: "0"
              },
              {
                content: "选项",
                isAddition: false,
                image: "",
                desc: "",
                sort: "0"
              }
            ],
            description: "",
            type: "单选题",
            isRequired: true,
            sort: "0",
            selectContent: "",
            setting: {
              last: 1
            },
            additional: ""
          };
          this.form.topic.push(radioQues);
          break;
        case questionType.MULTIPLE_CHOICE:
          const checkboxQues = {
            question: "多选题目",
            options: [
              {
                content: "选项",
                isAddition: false,
                image: "",
                desc: "",
                sort: "0"
              },
              {
                content: "选项",
                isAddition: false,
                image: "",
                desc: "",
                sort: "0"
              }
            ],
            description: "",
            type: "多选题",
            isRequired: true,
            sort: "0",
            setting: {
              last: 1 // 最少选择几项
            },
            selectMultipleContent: []
          };
          this.form.topic.push(checkboxQues);
          break;
        case questionType.DROP_DOWN:
          const dropQues = {
            question: "下拉选择",
            options: [
              {
                content: "选项",
                isAddition: false,
                image: "",
                desc: "",
                sort: "0"
              },
              {
                content: "选项",
                isAddition: false,
                image: "",
                desc: "",
                sort: "0"
              }
            ],
            description: "",
            type: "下拉框",
            isRequired: true,
            sort: "0",
            selectContent: "",
            setting: {
              last: 1
            },
            additional: ""
          };
          this.form.topic.push(dropQues);
          break;
        case questionType.SINGLE_TEXT:
          const singleText = {
            question: "单行文本",
            description: "",
            type: "单行文本",
            isRequired: true,
            sort: "0",
            setting: {},
            selectContent: ""
          };
          this.form.topic.push(singleText);
          break;
        case questionType.TEXT_MUILTIPLE:
          const mutilText = {
            question: "多行文本",
            description: "",
            type: "多行文本",
            isRequired: true,
            sort: "0",
            setting: {},
            selectContent: ""
          };
          this.form.topic.push(mutilText);
          break;
        case questionType.DATE_PICKER:
          const datePicker = {
            question: "日期/时间",
            description: "",
            type: "日期时间",
            isRequired: true,
            sort: "0",
            setting: {},
            selectContent: ""
          };
          this.form.topic.push(datePicker);
          break;
      }
    },

    // 插入题目
    insertOption({ type, index }) {
      switch (type) {
        case questionType.SINGLE_CHOICE:
          const radioQues = {
            question: "单选题目",
            options: [
              {
                content: "选项",
                isAddition: false,
                image: "",
                desc: "",
                sort: "0"
              },
              {
                content: "选项",
                isAddition: false,
                image: "",
                desc: "",
                sort: "0"
              }
            ],
            description: "",
            type: "单选题",
            isRequired: true,
            sort: this.form.topic.length,
            selectContent: "",
            setting: {
              last: 1
            },
            additional: ""
          };
          this.form.topic.splice(index + 1, 0, radioQues);
          break;
        case questionType.MULTIPLE_CHOICE:
          const checkboxQues = {
            question: "多选题目",
            options: [
              {
                content: "选项",
                isAddition: false,
                image: "",
                desc: "",
                sort: "0"
              },
              {
                content: "选项",
                isAddition: false,
                image: "",
                desc: "",
                sort: "0"
              }
            ],
            description: "",
            type: "多选题",
            isRequired: true,
            sort: this.form.topic.length,
            setting: {
              last: 1 // 最少选择几项
            },
            selectMultipleContent: []
          };
          this.form.topic.splice(index + 1, 0, checkboxQues);
          break;
        case questionType.DROP_DOWN:
          const dropQues = {
            question: "下拉选择",
            options: [
              {
                content: "选项",
                isAddition: false,
                image: "",
                desc: "",
                sort: "0"
              },
              {
                content: "选项",
                isAddition: false,
                image: "",
                desc: "",
                sort: "0"
              }
            ],
            description: "",
            type: "下拉框",
            isRequired: true,
            sort: this.form.topic.length,
            selectContent: "",
            setting: {
              last: 1
            },
            additional: ""
          };
          this.form.topic.splice(index + 1, 0, dropQues);
          break;
        case questionType.SINGLE_TEXT:
          const singleText = {
            question: "单行文本",
            description: "",
            type: "单行文本",
            isRequired: true,
            sort: this.form.topic.length,
            setting: {},
            selectContent: ""
          };
          this.form.topic.splice(index + 1, 0, singleText);
          break;
        case questionType.TEXT_MUILTIPLE:
          const mutilText = {
            question: "多行文本",
            description: "",
            type: "多行文本",
            isRequired: true,
            sort: this.form.topic.length,
            setting: {},
            selectContent: ""
          };
          this.form.topic.splice(index + 1, 0, mutilText);
          break;
        case questionType.DATE_PICKER:
          const datePicker = {
            question: "日期/时间",
            description: "",
            type: "日期时间",
            isRequired: true,
            sort: this.form.topic.length,
            setting: {},
            selectContent: ""
          };
          this.form.topic.splice(index + 1, 0, datePicker);
          break;
      }
    },

    // 删除题目
    onDelQuestion({ index }) {
      this.form.topic.splice(index, 1);
    },

    // 添加选项
    onAddOption({ index }) {
      const tempData = {
        content: "选项",
        isAddition: false,
        image: "", // 选项图片
        desc: "",
        sort: this.form.topic[index].options.length
      };
      this.form.topic[index].options.push({ ...tempData });
    },

    // 删除选项
    onDelOption({ index, opIndex }) {
      if (this.form.topic[index].options.length < 2) {
        return this.$message.warning("已经是最后一个选项，无法删除。");
      }
      this.form.topic[index].options.splice(opIndex, 1);
    },

    // 改变选项位置上移 下移
    changeOption({ index, opIndex, type }) {
      let newForm = this.form;
      if (index < 0) {
        return false;
      }
      // type: top为上移  bottom为下移
      if (type == "top") {
        if (opIndex <= 0) {
          return false;
        }
        const newOption = newForm.topic[index].options[opIndex];
        this.form.topic[index].options.splice(opIndex, 1);
        this.form.topic[index].options.splice(opIndex - 1, 0, newOption);
      }
      if (type == "bottom") {
        if (opIndex == this.form.topic[index].options.length - 1) {
          return false;
        }
        const newOption = newForm.topic[index].options[opIndex];
        this.form.topic[index].options.splice(opIndex, 1);
        this.form.topic[index].options.splice(opIndex + 1, 0, newOption);
      }
    },

    // 复制题目
    copyQuestion({ type, index }) {
      const newQs = JSON.stringify(this.form.topic[index]);
      const newArr = JSON.parse(newQs);
      delete newArr.q_id;
      this.form.topic.splice(index + 1, 0, newArr);
    },

    // 题目上下移动
    changeQsPs({ index, type }) {
      if (type == "top") {
        //上移
        if (index == 0) {
          return false;
        }
        const newQs = this.form.topic[index];
        this.form.topic.splice(index, 1);
        this.form.topic.splice(index - 1, 0, newQs);
      }
      if (type == "bottom") {
        // 下移
        if (index == this.form.topic.length - 1) {
          return false;
        }
        const newQs = this.form.topic[index];
        this.form.topic.splice(index, 1);
        this.form.topic.splice(index + 1, 0, newQs);
      }
    },

    // 题目置顶 置后
    stickQs({ type, index }) {
      if (type == "first") {
        if (index == 0) {
          return false;
        }
        const newQs = this.form.topic[index];
        this.form.topic.splice(index, 1);
        this.form.topic.unshift(newQs);
      }
      if (type == "last") {
        if (index == this.form.topic.length - 1) {
          return false;
        }
        const newQs = this.form.topic[index];
        this.form.topic.splice(index, 1);
        this.form.topic.push(newQs);
      }
    },

    // 保存问卷
    async saveQuestion() {
      if (this.form.topic.length == 0) {
        return this.$message.error("至少添加一个问题");
      }
      let saveData = {};
      saveData.status = this.form.status;
      saveData.naire = {
        n_id: this.form.status == "update" ? this.form.n_id : "0",
        starttime: Date.now(),
        deadline: Date.now(),
        title: this.form.title,
        intro: this.form.intro,
        topic: this.form.topic.map((item, index) => {
          return {
            ...item,
            sort: index + 1
          };
        })
      };
      const res = await NaireAction.createQs({
        ...saveData
      });
      if (res.success) {
        const newId = res.data.n_id;
        const oldId = this.rowId;
        this.rowId = newId;
        this.$parent.changeRowId(newId);
        if (oldId == 0) {
          this.$router.push({
            path: `/setting/${newId}/questionadd`
          });
        }
        this.getBaseMsg(newId);
        this.$message.success(
          this.form.status == "create" ? "创建成功" : "编辑成功"
        );
      } else {
        this.$message.error(
          this.form.status == "create" ? "创建成功" : "编辑失败"
        );
      }
    },

    // 问卷预览
    preView() {
      if (this.rowId == 0) {
        return this.$message.error("请先保存问卷");
      }
      if (this.form.topic.length == 0) {
        return this.$message.error("请先添加题目");
      }
      let newAdd = false;
      this.form.topic.forEach(item => {
        if (!item.hasOwnProperty("q_id")) {
          newAdd = true;
        }
      });
      if (newAdd) {
        return this.$message.error("请先保存问卷");
      }
      // const routes = this.$router.resolve({ path: `view/0/${this.rowId}` });
      const routes = this.$router.resolve({
        name: "view",
        params: {
          type: "0",
          id: this.rowId,
          normal: 'naire'
        }
      });
      window.open(routes.href, "_blank");
    }
  },
  mounted() {
    const params = this.$route.params;
    const { rowId } = params;
    this.rowId = rowId;
    if (rowId != 0) {
      this.getBaseMsg(rowId);
    }
  },
  components: {
    EditorBar,
    QuestionList
  }
};
</script>

<style scoped>
.createQs {
  flex: 1;
  background-color: #ccc;
  height: 100%;
}
.qsTop {
  height: 72px;
  background-color: #fff;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.topOpn{
  display: flex;
  justify-content: space-around;
  align-items: center;
  font-size: 16px;
  margin-right: 20px;
  cursor: pointer;
  font-weight: 400;
  color: #4A4A4A;
}
.topOpn img{
  width: 16px;
  width: 16px;
  margin-right: 5px;
}
.qsContent {
  flex: 1;
  display: flex;
  background-color: #ccc;
  height: 100%;
  margin-top: 16px;
}
.leftTab {
  width: 250px;
  border-right: 1px solid #ccc;
  margin-right: 16px;
  background-color: #fff;
  padding-left: 10px;
  padding-right: 10px;
  box-sizing: border-box;
}
.rightAdd {
  flex: 1;
  padding-top: 20px;
  padding-bottom: 100px;
  box-sizing: border-box;
  background-color: #fff;
  /* height: 100%; */
  overflow-y: scroll;
  border-radius: 3px;
}
.tabTop {
  height: 50px;
  display: flex;
  box-sizing: border-box;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
  font-size: 16px;
  background-color: #E4E4E4;
  border-radius: 5px;
}
.tabTop > div {
  height: 50px;
  flex: 1;
  display: flex;
  /* border: 1px solid #ccc; */
  border-radius: 5px;
  padding: 5px;
  box-sizing: border-box;
}
.tabTop li {
  flex: 1;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 900;
}

.tabTop .qsItem {
  background-color: #fff;
  color: #4A4A4A;
  font-weight: 600;
  border-radius: 5px;
}

.quesTitle {
  height: 50px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-weight: 800;
  font-size: 16px;
  color: #4A4A4A;
}
.quesTitle .el-icon-caret-bottom{
  margin-left: 5px;
}

.selectContent {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
}
.qsClassfy {
  width: 110px;
  height: 40px;
  padding-left: 5px;
  box-sizing: border-box;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  color: #808080;
}
.qsClassfy .qsIcon {
  width: 15px;
  height: 15px;
  margin-right: 5px;
}
.tabOption {
  position: relative;
}
.showTip {
  display: none;
}

.qsClassfy:hover .showTip {
  position: absolute;
  left: 230px;
  width: 250px;
  height: 110px;
  display: block;
  z-index: 100;
  overflow: hidden;
}

.tipImg {
  display: block;
  width: 100%;
  height: 100%;
}

.qsClassfy:hover .qsTxt {
  color: blue;
}

.rightContent {
  /* overflow-y: scroll; */
}

#inputDes {
  border: 1px solid #ccc;
  overflow: hidden;
  min-height: 30px;
  border-radius: 5px;
  cursor: pointer;
  padding: 0 10px;
  box-sizing: border-box;
}

.qsList{
  margin-top: 20px;
}

.qsList li {
  list-style: none;
  font-size: 14px;
  margin-bottom: 10px;
  cursor: pointer;
  padding-left: 15px;
  box-sizing: border-box;
  color: #808080;
}

.qsList li:hover {
  color: blue;
}
</style>
