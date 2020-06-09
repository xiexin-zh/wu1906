<template>
  <el-dialog :visible.sync="dialogVisible" :destroy-on-close="true" width="30%" title="复制地址">
    <el-row>
      <el-col :span="18">
        <el-input id="url" ref="copyURL" :value="url" :autofocus="true" :readonly="true" />
      </el-col>
      <!-- 投票类地址 -->
      <el-col :span="4" :offset="1">
        <el-button class="copyboard" data-clipboard-target="#url" @click="handleCopy">复制</el-button>
      </el-col>
    </el-row>
    <div id="qrCode" class="qrcode-wrapper">
      <canvas width="50" height="50" ref="qrcode" />
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="downCode">保存二维码</el-button>
    </div>
  </el-dialog>
</template>

<script lang="ts">
/* eslint-disable */
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { IApiNaireItem } from "@/api/types";
import * as NaireAction from "@/api/naire";
import Clipboard from "clipboard";
import QRCode from "qrcode";

@Component
export default class extends Vue {
  @Prop() visible!: boolean;
  @Prop() model!: any;

  @Watch("model")
  watchModel(val: IApiNaireItem) {
    this.$nextTick(() => {
      QRCode.toCanvas(
        this.$refs.qrcode,
        this.url,
        {
          width: 300
        },
        function(error) {
          if (error) console.error(error);
        }
      );
    });
  }

  get dialogVisible() {
    return this.visible;
  }
  set dialogVisible(val) {
    this.$emit("update:visible", val);
  }

  get url() {
    return window.location.origin + "/#/view/1/" + this.model.n_id + '/naire';
  }

  handleCopy() {
    const clipboard = new Clipboard(".copyboard");

    clipboard.on("success", e => {
      this.$message.success("复制成功！");
      e.clearSelection();
    });

    clipboard.on("error", e => {
      this.$message.error("复制失败！");
    });
  }
  // 保存二维码
  downCode() {
    this.saveImg();
  }

  // 将canvas生成的二维码保存为图片
  saveImg() {
    const canvasData: any = document.getElementById("qrCode").childNodes;
    const a: any = document.createElement("a");
    a.href = canvasData[0].toDataURL();
    a.download = "qrcode";
    a.click();
  }
}
</script>

<style lang="scss" scoped>
.qrcode-wrapper {
  text-align: center;
}

.dialog-footer {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
