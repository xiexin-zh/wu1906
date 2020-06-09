<template>
  <div class="settings-base">
    <div class="baseBox">
      <div class="editBox">
        <div><span class="title">问卷名称</span></div>
        <div id="editorNameBox" class="editorBox">
          <el-input v-model="inputName"></el-input>
        </div>
      </div>
      <div class="editBox">
        <div><span class="title">问卷说明</span></div>
        <div id="editDes" class="editorBox minHeight" v-html="inputDes" @click="enditMsg('inputDes')"></div>
      </div>
      <div class="editBox">
        <div><span class="title">欢迎词</span></div>
        <div id="editWel" class="editorBox minHeight" v-html="inputWel" @click="enditMsg('inputWel')"></div>
      </div>
      <div class="editBox">
        <div><span class="title">结束语</span></div>
        <div id="editEnd" class="editorBox minHeight" v-html="inputEnd" @click="enditMsg('inputEnd')"></div>
      </div>
      <div class="editBox">
        <div><span class="title">有效时间</span></div>
        <el-date-picker
          class="timeSelect"
          v-model="valueTime"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format="yyyy-MM-dd H:mm"
          value-format="timestamp"
        >></el-date-picker>
      </div>
      <div class="submitBox">
        <div class="btns">
          <el-button class="btn" @click="addQuestion">添加问题</el-button>
        </div>
        <div class="btns">
          <el-button class="btn" @click="saveMsg">保存</el-button>
          <el-button class="btn" @click="goPublish" type="primary">去发布</el-button>
        </div>
      </div>
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
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import * as NaireAction from "@/api/naire";
import EditorBar from "../../../../components/wangEnduit/Editor.vue";

export default {
  data() {
    return {
      inputName: "",
      inputDes: "",
      inputWel: "",
      inputEnd: "",
      valueTime: "",
      rowId: "",
      dialogVisible: false,
      editValue: "",
      type: ""
    };
  },
  components: {
    EditorBar
  },
  methods: {
    async getBaseMsg(rowId) {
      const res = await NaireAction.getBase({
        n_id: rowId
      });
      if (res) {
        this.inputName = res.data.n_title || "";
        this.inputDes = res.data.n_intro || "";
        this.inputWel = res.data.n_welcometxt || "";
        this.inputEnd = res.data.n_endtxt || "";
        this.valueTime = [
          Number(res.data.n_starttime ? res.data.n_starttime : new Date().getTime()),
          Number(res.data.n_deadline ? res.data.n_deadline : new Date().getTime())
        ];
      }
    },

    enditMsg(value) {
      if (value == "inputDes") {
        this.editValue = this.inputDes;
      }
      if (value == "inputWel") {
        this.editValue = this.inputWel;
      }
      if (value == "inputEnd") {
        this.editValue = this.inputEnd;
      }
      this.type = value;
      this.dialogVisible = true;
    },

    addQuestion() {
      // console.log(this.$parent.$parent)
      this.$parent.$parent.changeTabId(2)
      this.$router.push({
        path: `/setting/${this.rowId}/questionadd`
      });
    },
    goPublish() {
      this.$parent.changeTab("publish");
    },

    async saveMsg() {
      if (this.inputName.trim().length === 0) {
        this.$message.error("问卷名称不能为空！");
        return false;
      }
      if (
        this.inputName.replace(/<\/?.+?>/g, "").replace(/ /g, "").length > 25
      ) {
        this.$message.error("标题不超过25个字");
        return false;
      }
      if (
        this.inputDes.replace(/<\/?.+?>/g, "").replace(/ /g, "").length > 500
      ) {
        this.$message.error("问卷说明不超过500个字");
        return false;
      }
      if (
        this.inputWel.replace(/<\/?.+?>/g, "").replace(/ /g, "").length > 250
      ) {
        this.$message.error("欢迎语不超过250个字");
        return false;
      }
      if (
        this.inputEnd.replace(/<\/?.+?>/g, "").replace(/ /g, "").length > 250
      ) {
        this.$message.error("结束语不超过250个字");
        return false;
      }
      if (this.valueTime.length === 0 || this.valueTime == 0) {
        this.$message.error("请选择时间");
        return false;
      }
      const startTime = this.valueTime[0];
      const endTime = this.valueTime[1];
      const res = await NaireAction.setBase({
        n_id: this.rowId,
        n_title: this.inputName.trim(),
        n_intro: this.inputDes.trim(),
        n_welcometxt: this.inputWel.trim(),
        n_endtxt: this.inputEnd.trim(),
        n_starttime: startTime,
        n_deadline: endTime
      });
      if (res.success) {
        this.$message.success("保存成功！");
      } else {
        this.$message.error("保存失败，请重试！");
      }
    },

    getEditorVal(type, value) {
      if (type == "inputDes") {
        this.inputDes = value;
      }
      if (type == "inputWel") {
        this.inputWel = value;
      }
      if (type == "inputEnd") {
        this.inputEnd = value;
      }
    }
  },
  mounted() {
    const params = this.$route.params;
    const { rowId } = params;
    this.rowId = rowId;
    this.getBaseMsg(rowId);
  }
};
</script>

<style lang="scss" scoped>
.settings-base {
  // flex: 1;
  min-width: 1000px;
  display: flex;
  justify-content: center;
  background-color: #fff;
  overflow-y: scroll;
}
.baseBox {
  // flex: 1;
  max-width: 900px;
  background-color: #fff;
  padding: 30px 20px;

  .editBox {
    min-height: 50px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 5px 0;
    margin-bottom: 20px;

    .title {
      display: flex;
      width: 120px;
      font-size: 16px;
      color: #4A4A4A;
    }

    .editorBox {
      border-radius: 4px;
      border: 1px solid #dcdfe6;
      padding: 3px 5px;
      box-sizing: border-box;
      min-height: 30px;
    }
    .minHeight{
      min-height: 50px;
    }

    #editorNameBox {
      border: 0;
      padding: 0;
    }
  }
  .submitBox {
    height: 70px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .btn {
      width: 120px;
      height: 40px;
    }
  }
}
.editBtn {
  width: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
</style>
