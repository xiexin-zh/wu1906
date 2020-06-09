<template>
  <el-dialog :visible.sync="dialogVisible" :destroy-on-close="true" width="900px">
    <div class="create-title">创建调查问卷</div>
    <div class="selectBox">
      <div class="create-options" @click="createByTemplate">
        <div class="options-left">
          <div>
            <span class="el-icon-document"></span>
          </div>
        </div>
        <div class="options-right">
          <h3>从模板创建问卷</h3>
          <p>使用其他用户公开的问卷</p>
        </div>
      </div>
      <div class="create-options create-upload">
        <el-upload
          :action="uploadUrl"
          accept="application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          name="userfile"
          :show-upload-list="false"
          :limit="1"
          :on-exceeded="onUploadExceeded"
          :on-success="onUploadSuccess"
          :on-error="onUploadError"
        >
          <div class="upload">
            <div class="options-left">
              <div>
                <span class="el-icon-edit-outline"></span>
              </div>
            </div>
            <div class="options-right">
              <h3>文本导入</h3>
              <p>自由编辑，自由生成问卷</p>
            </div>
          </div>
        </el-upload>
      </div>
      <div class="create-options" @click="createSelf">
        <div class="options-left">
          <div>
            <span class="el-icon-folder-add"></span>
          </div>
        </div>
        <div class="options-right">
          <h3>人工创建</h3>
          <p>自由创建</p>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script lang="ts">
/* eslint-disable */
import { Component, Vue, Prop, Watch } from "vue-property-decorator";

@Component
export default class extends Vue {
  @Prop() visible!: boolean;

  get dialogVisible() {
    return this.visible;
  }
  set dialogVisible(val) {
    this.$emit("update:visible", val);
  }

  createSelf() {
    this.$router.push({
      path: `/setting/0/questionadd`
    });
  }

  createByTemplate() {
    this.$router.push({
      name: "template"
    });
  }
}
</script>

<style scoped>
.create-title {
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 30px;
}
.selectBox {
  height: 250px;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.selectBox > div {
  height: 100px;
  width: 260px;
  border: 1px solid #ccc;
  display: flex;
  cursor: pointer;
  transition: all 0.3s;
}

.selectBox > div:hover {
  background-color: #f7f3f3;
}
.selectBox > div:hover .options-left > div {
  background-color: #fff;
}

.options-left {
  width: 70px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.options-left > div {
  width: 45px;
  height: 45px;
  background-color: #f7f3f3;
  font-size: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: blue;
  transition: all 0.3s;
}

.options-right {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.options-right h3 {
  font-size: 18px;
  color: #000;
  flex: 1;
  display: flex;
  align-items: flex-end;
}
.options-right p {
  flex: 1;
  color: #333;
}

.create-upload {
  display: flex;
  align-items: center;
}

.selectBox .upload {
  display: flex;
  align-items: center;
}
</style>
