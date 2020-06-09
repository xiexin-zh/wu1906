<!-- 上傳圖片組建 -->
<template>
  <div class="avatar-uploader">
    <el-upload
      class="avatar-uploader"
      action
      :http-request="handleChange"
      :show-file-list="false"
      :on-success="onSuccess"
      :on-change="handleProgress"
      accept="image/png, image/jpeg, image/jpg,"
    >
      <img v-if="dialogImageUrl" :src="dialogImageUrl" class="avatar" />
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible" size="tiny">
      <img width="100%" :src="dialogImageUrl" alt />
    </el-dialog>
  </div>
</template>

<script>
import arrayMixin from "./arrayMixin";
import { adminFileSave } from "@/api/new-api/common";
export default {
  name: "xh-upload-img",
  mixins: [arrayMixin],

  data() {
    return {
      ImageUrl: "",
      dialogImageUrl: "",
      dialogVisible: false,
      disabledHide: false // 控制上傳的圖片放大/下載/刪除 變量
    };
  },
  computed: {
    addStyle() {
      return this.dialogImageUrl;
    }
  },
  methods: {
    handleChange(uploadObj) {
      const { file } = uploadObj;
      adminFileSave({
        file,
        types: "crm_customer"
      })
        .then(res => {
          const { data } = res;
          this.$message({
            message: "上傳成功",
            type: "success"
          });
          this.Bus.$emit("ImageUrl", data.file_path);
          this.dialogImageUrl = `${data.domain}${data.file_path}`;
          this.loading = false;
        })
        .catch(_ => {
          this.loading = false;
          this.$message({
            message: "上傳失敗",
            type: "error"
          });
        });
    },
    onSuccess(response, file, fileList) {
      this.ImageUrl = URL.createObjectURL(file.raw);
    },
    handleDownload(file) {
      // 下載
      console.log(file);
    },
    handleRemove(file) {
      // 刪除
      console.log(file);
      // this.dialogImageUrl = "";
    },
    handlePictureCardPreview(file) {
      // 放大
      console.log(" 👌👌👌 --->>>放大", file);
      // this.dialogImageUrl = file.url;
      // this.dialogVisible = true;
    },
    handleProgress(file, fileList) {},
    handleError(response, file, fileList) {
      // 上傳失敗
      console.log("上传失败");
    }
  }
};
</script>
<style lang="scss" scoped>
/deep/.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 150px;
  height: 150px;
  line-height: 150px;
  text-align: center;
}
.avatar {
  width: 150px;
  height: 150px;
  display: block;
}
</style>
