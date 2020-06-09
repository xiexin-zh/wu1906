<template>
  <flexbox style="height:100%;" direction="column" align="stretch">
    <div class="body" v-loading="loading">
      <div class="section">
        <div class="name">評級（定義/條件） :</div>
        <el-input
          v-model="creditRatingValue"
          style="padding-right:10px"
          v-show="flag"
          disabled
        ></el-input>
        <el-select
          v-model="systemName"
          placeholder="请选择"
          v-show="!flag"
          style="width:290px;padding-right:10px"
          @change="changeGetId"
        >
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
        <img
          src="../../../assets/edit.svg"
          alt="edit"
          style="width:16px;"
          v-show="flag"
          @click="flag = false"
        />
        <i
          class="el-icon-circle-check icon-circle"
          v-show="!flag"
          @click="saveRatingChanges"
        ></i>
        <i
          class="el-icon-circle-close icon-circle"
          v-show="!flag"
          @click="flag = true"
        ></i>
      </div>
      <div class="sectionHint">
        <div class="section-hint">
          <p>附加文件</p>
          <div
            v-empty="fileList.length === 0"
            v-if="fileList.length === 0"
            xs-empty-text="暂无文件"
            style="minHeight: 500px"
          ></div>
          <el-upload
            multiple
            class="upload-demo upload"
            :http-request="handleChange"
            :before-upload="beforeAvatarUpload"
            action
            :file-list="fileList"
            accept="image/png, image/jpeg, image/gif, image/jpg, .docx, .doc, .pdf, .xlsx,"
          >
            <div slot="file" slot-scope="{ file }">
              <div @click="handlePictureCardPreview(file)" class="fileStyle">
                <div class="showFileLeft">
                  <div class="fileTitle">
                    <img
                      :src="file.file_path"
                      alt
                      v-if="fileType(file.types)"
                      width="50px"
                      height="50px"
                    />
                    <img
                      v-else
                      src="@/assets/file.svg"
                      alt
                      width="50px"
                      height="50px"
                    />
                  </div>
                  <div>
                    <p>{{ file.name }}</p>
                    <p>
                      <span>
                        上传日期:{{
                          file.create_time | moment("YYYY-MM-DD HH:mm:ss")
                        }}
                      </span>
                      <span>操作人:{{ file.user_name }}</span>
                    </p>
                  </div>
                </div>
                <div @click.stop="handleRemove(file)" class="deleteBox">
                  <img
                    src="@/assets/delete.svg"
                    alt
                    width="20px"
                    height="20px"
                  />
                </div>
              </div>
            </div>
            <i class="uploader-icon">
              <span class="el-icon-plus uploader-icon-plus"></span>
              <span class="uploader-icon-span"
                >支持excel，word，png，jpg，pdf</span
              >
            </i>
          </el-upload>
        </div>
        <el-dialog :visible.sync="dialogVisible" :modal-append-to-body="false">
          <img
            width="100%"
            style="maxHeight: 500px; objectFit: contain;"
            :src="dialogImageUrl"
            alt
          />
        </el-dialog>
      </div>
    </div>
  </flexbox>
</template>

<script>
// import EditImage from "@/components/EditImage";
// 新 api
import {
  crmCustomerDetailRead,
  crmCustomerDetailUpdate,
  crmCustomerDetailDeleteFile,
  adminFileSave,
  getPdfFile
} from "@/api/new-api/common";
export default {
  name: "creditAndLoan",
  // components: {
  //   EditImage
  // },
  props: {
    // 详情信息id
    id: [String, Number]
  },
  data() {
    return {
      loading: false,
      systemName: "",
      fileList: [],
      flag: true,
      options: [],
      listData: {},
      getId: "",
      creditRatingValue: "",
      dialogVisible: false,
      dialogImageUrl: ""
    };
  },
  watch: {
    id: function() {
      this.fileList = [];
      this.getDetail();
    }
  },
  mounted() {
    this.getDetail();
  },
  methods: {
    changeGetId(id) {
      this.getId = id;
    },
    saveRatingChanges() {
      this.flag = true;
      const { id, customer_id } = this.listData;
      crmCustomerDetailUpdate({
        id,
        customer_id,
        request_type: "credit",
        credit_rating: this.getId
      }).then(res => {
        const { data } = res;
        this.$message({
          message: data,
          type: "success"
        });
        this.creditRatingValue = this.options.find(
          item => item.id === this.getId
        ).name;
      });
    },
    //  上传限制大小
    beforeAvatarUpload(file) {
      const fileType = file.type.split("/")[0];
      if (fileType === "image") {
        // 图片上传限制提示
        // 图片上传限制 2M
        const ImageIsLt2M = file.size / 1024 / 1024 < 2;
        if (!ImageIsLt2M) {
          this.$message({
            message: "上传图片大小不能超过 2MB!",
            type: "warning"
          });
          return ImageIsLt2M;
        }
      } else {
        // 文件上传限制提示
        // 文件上传限制 5M
        const FileIsLt5M = file.size / 1024 / 1024 < 5;
        if (!FileIsLt5M) {
          this.$message({
            message: "上传文件大小不能超过 5MB!",
            type: "warning"
          });
          return FileIsLt5M;
        }
      }
      return true;
    },
    handleChange(uploadObj) {
      const { file } = uploadObj;
      const { customer_id } = this.listData;
      console.log(file, customer_id);
      this.loading = true;
      adminFileSave({
        customer_id,
        file,
        types: "crm_customer_credit"
      })
        .then(res => {
          const { data } = res;
          this.fileList.push(data);
          //  this.getDetail()
          this.$message({
            message: "上傳成功",
            type: "success"
          });
          this.loading = false;
        })
        .catch(_ => {
          this.loading = false;
          this.getDetail();
          this.$message({
            message: "上傳失敗",
            type: "error"
          });
        });
    },
    fileType(types) {
      return types && types.split("/")[0] === "image";
    },
    // 圖片展示
    handlePictureCardPreview(file) {
      console.log(file);
      const { types, file_path, name } = file;
      // let documentElement = document.querySelectorAll('.el-upload-list__item');
      // console.log(documentElement,index);
      if (this.fileType(types)) {
        console.log(1);

        this.dialogImageUrl = file_path;
        this.dialogVisible = true;
      } else {
        // 创建隐藏的可下载链接
        if (file.types === "application/pdf") {
          getPdfFile({ url: file_path })
            .then(res => {
              let blob = new Blob([res.data], {
                type: "application/pdf;charset=utf-8"
              });
              let objectUrl = URL.createObjectURL(blob);
              let eleLink = document.createElement("a");
              eleLink.download = name;
              eleLink.style.display = "none";
              eleLink.href = objectUrl;
              // 触发点击
              document.body.appendChild(eleLink);
              eleLink.click();
              // 移除
              document.body.removeChild(eleLink);
            })
            .catch(() => {
              this.loading = false;
            });
        } else {
          let eleLink = document.createElement("a");
          eleLink.download = name;
          eleLink.style.display = "none";
          eleLink.href = file_path;
          // 触发点击
          document.body.appendChild(eleLink);
          eleLink.click();
          // 移除
          document.body.removeChild(eleLink);
        }
      }
    },
    handleRemove(file) {
      this.$confirm("此操作将删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.loading = true;
          const { customer_id } = this.listData;
          const { file_id } = file;
          crmCustomerDetailDeleteFile({
            file_id,
            customer_id,
            types: "crm_customer_credit"
          })
            .then(res => {
              const { data } = res;
              this.fileList = this.fileList.filter(
                fileItem => fileItem.file_id !== file_id
              );
              this.loading = false;
              this.$message({
                message: data,
                type: "success"
              });
            })
            .catch(_ => {
              this.loading = false;
              this.$message({
                message: "删除失败",
                type: "warning"
              });
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    getDetail() {
      this.loading = true;
      crmCustomerDetailRead({ request_type: "credit", id: this.id })
        .then(res => {
          const { data } = res;
          this.loading = false;
          this.options = data.credit_rating_data;
          this.systemName = data.credit_rating_value;
          this.creditRatingValue = data.credit_rating_value;
          this.listData = data;
          this.fileList = data.files_info;
        })
        .catch(() => {
          this.loading = false;
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.header {
  height: 60px;
  line-height: 60px;
  position: relative;
  z-index: 100;
  padding: 0 20px;
  font-size: 18px;
}

.body {
  flex: 1;
  overflow-y: auto;
  padding: 40px 30px 20px 30px;
  background-color: white;
  border: 1px solid #e6e6e6;
  border-radius: 2px;
  position: relative;
}

.save-button {
  position: absolute;
  top: 8px;
  right: 30px;
}

.section {
  margin-bottom: 30px;
  .name {
    display: inline;
    color: #777777;
    font-size: 12px;
    margin-bottom: 8px;
  }
  .section-hint {
    width: 100%;
    height: 600px;
  }
  .name-hint {
    color: #777777;
    font-size: 12px;
    margin-bottom: 8px;
  }
  .el-input {
    width: 300px;
  }
}

.uploader-icon {
  position: absolute;
  left: 10%;
  bottom: 20px;
  font-size: 28px;
  color: #8c939d;
  width: 80%;
  height: 80px;
  line-height: 80px;
  text-align: center;
  margin: auto 0;
  border: 1px solid #ccc;
  .uploader-icon-span {
    font-size: 12px;
  }
  .uploader-icon-plus {
    display: inline-block;
    width: 30px;
    height: 30px;
    line-height: 26px;
    font-size: 16px;
    border-radius: 5px;
    border: 1px solid #777777;
  }
}
.sectionHint {
  width: 100%;
  height: 400px;
  overflow: hidden;
  .upload {
    width: 100%;
    max-height: 300px;
    overflow-y: auto;
    /deep/ .el-upload-list__item {
      width: 100%;
      border-radius: 0px;
      line-height: 30px;
      margin-right: 20px;
      border-bottom: 1px solid #8c939d;
    }
    .fileStyle {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .showFileLeft {
        display: flex;
        align-items: center;
        .fileTitle {
          margin-right: 40px;
        }
      }
      .deleteBox {
        line-height: 0;
        padding: 20px;
        cursor: pointer;
      }
    }
  }
}

.upload-show {
  position: relative;
  display: block;
  width: 300px;
  height: 80px;
  img {
    width: 100%;
    height: 100%;
  }

  .icon-delete {
    position: absolute;
    top: -10px;
    right: -8px;
    color: red;
    font-size: 20px;
    display: none;
  }
}
.icon-circle {
  margin-top: 8px;
  font-size: 20px;
}
.upload-show:hover {
  .icon-delete {
    display: block;
  }
}
</style>
