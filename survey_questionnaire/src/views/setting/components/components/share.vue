<template>
  <div class="settings-share">
    <div class="shareBox">
      <div class="shareTitle">分享二维码或链接</div>
      <div class="content">
        <div id="qrShareCode" class="shareCode">
          <canvas width="50" height="50" ref="qrcode" />
        </div>
        <div class="shareCenter">
          <el-input id="url1" ref="copyURL1" :value="url" :autofocus="true" :readonly="true" />
          <el-button class="saveCode" @click="downCode">保存二维码</el-button>
        </div>
        <div class="copyUrl">
          <el-button class="copyboard" data-clipboard-target="#url1" @click="handleCopy">复制</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import Clipboard from "clipboard";
import QRCode from "qrcode";
import * as NaireAction from "@/api/naire";

export default {
  data() {
    return {
      rowId: "",
      url: ""
    };
  },

  methods: {
    // 保存二维码
    downCode() {
      this.saveImg();
    },

    makeCode() {
      QRCode.toCanvas(
        this.$refs.qrcode,
        this.url,
        {
          width: 200
        },
        function(error) {
          if (error) console.error(error);
        }
      );
    },

    // 将canvas生成的二维码保存为图片
    saveImg() {
      const canvasData = document.getElementById("qrShareCode").childNodes;
      const a = document.createElement("a");
      a.href = canvasData[0].toDataURL();
      a.download = "qrcode";
      a.click();
    },

    //获取分享连接
    getUrl(rowId) {
      this.url = window.location.origin + "/#/view/1/" + rowId + '/naire';
    },

    //复制按钮
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
  },
  mounted() {
    const params = this.$route.params;
    const { rowId } = params;
    this.rowId = rowId;
    this.getUrl(rowId);
    this.makeCode();
  }
};
</script>

<style lang="scss" scoped>
.settings-share {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 20px;
  box-sizing: border-box;
}
.shareBox {
  width: 800px;
  height: 400px;
  background-color: #fff;
  border-radius: 5px;
  padding: 20px;
  box-sizing: border-box;
}

.shareTitle {
  height: 50px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-size: 18px;
  padding-left: 20px;
  box-sizing: border-box;
}

.content {
  display: flex;
  padding-top: 20px;
  box-sizing: border-box;
}

.shareCode {
  width: 300px;
}
.shareCenter {
  flex: 1;
  padding-top: 20px;
  box-sizing: border-box;
}
.saveCode {
  margin-top: 100px;
}
.copyUrl {
  width: 200px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 20px;
  box-sizing: border-box;
}
</style>
