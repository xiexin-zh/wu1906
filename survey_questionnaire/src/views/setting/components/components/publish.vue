<template>
  <div class="settings-publish">
    <div class="publishBox">
      <div class="publishTitle">发布方式</div>
      <div class="pubSelect">
        <div class="switch">
          <p>
            <span>公开</span>
            <el-switch v-model="value1" @change="changeSwitch1(value1)"></el-switch>
          </p>
          <p>
            <span>私有</span>
            <el-switch v-model="value2" @change="changeSwitch2(value2)"></el-switch>
          </p>
        </div>
        <div class="operate" v-if="value2">
          <!-- <div class="tip">若是选择已有参与者的方式，对应的访问码一栏为空</div> -->
          <div class="operateBtn">
            <div class="leftBtns">
              <el-upload
                class="uploadBtn"
                name="up_file"
                :action="uploadUrl"
                accept=".xls, .xlsx, .csv"
                :show-file-list="false"
                :limit="1"
                :data="uploadData"
                :headers="headers"
                :auto-upload="true"
                :on-success="uploadSuccess"
              >
                <!-- <el-button plain icon="el-icon-upload el-icon--right">导入参与者</el-button> -->
                <div class="publishBtn">
                  <img
                    :src="require('../../../../../public/img/setting/publish/import.png')"
                    class="btnIcon"
                    alt
                  />
                  <span>导入参与者</span>
                </div>
              </el-upload>
              <!-- <el-button @click="addUser">新建参与者</el-button> -->
              <div class="publishBtn addBtn" @click="addUser">
                <img
                  :src="require('../../../../../public/img/setting/publish/add.png')"
                  class="btnIcon"
                  alt
                />
                <span>新建参与者</span>
              </div>
              <!-- <el-button class="spaceBtn" @click="openSlectUserBox">选择已有参与者</el-button> -->
              <div class="publishBtn importBtn" @click="openSlectUserBox">
                <img
                  :src="require('../../../../../public/img/setting/publish/import.png')"
                  class="btnIcon"
                  alt
                />
                <span>选择已有参与者</span>
              </div>
            </div>
            <div class="rightBtns">
              <el-button type="primary" @click="setCodeBatch">批量生成访问码</el-button>
              <el-button type="danger" @click="deleteBatch">批量删除</el-button>
            </div>
          </div>
          <div class="downMode">
            <el-link type="primary" :href="baseURL">下载模板</el-link>
          </div>
        </div>
      </div>
      <div v-if="value2">
        <el-table class="userTable" :data="list" border @selection-change="onSelectionChange">
          <el-table-column type="selection" />
          <el-table-column prop="u_number" label="编号" />
          <el-table-column prop="u_name" label="姓名" />
          <el-table-column prop="u_sex" label="性别" width="50">
            <template slot-scope="{ row }">{{ row.u_sex }}</template>
          </el-table-column>
          <el-table-column prop="u_class" label="组织单位" />
          <el-table-column prop="u_identity" width="150" label="身份证号" />
          <!-- <el-table-column prop="u_email" label="邮箱" /> -->
          <el-table-column prop="u_mobile" width="100" label="手机号" />
          <el-table-column class="codecCell" prop="u_visitcode" label="访问码" width="90">
            <template slot-scope="{ row }">
              <!-- <el-button
                v-if="row.u_visitcode.length == 0"
                type="success"
                @click="setCodeSingle(row.u_id)"
              >生成</el-button>-->
              <img
                class="codePro"
                v-if="row.u_visitcode.length == 0"
                @click="setCodeSingle(row.u_id)"
                :src="require('../../../../../public/icon/code.png')"
                alt="生成"
                title="生成"
              />
              <span v-if="row.u_visitcode.length !== 0">{{row.u_visitcode}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150">
            <template slot-scope="{ row }">
              <el-button type="primary" class="commonBtn" icon="el-icon-edit-outline" title="编辑" @click="handleEdit(row)"></el-button>
              <el-button type="danger" class="commonBtn" icon="el-icon-delete" title="删除" @click="handleDelete(row)"></el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <div class="pagination">
          <el-pagination
            background
            layout="prev, pager, next, jumper"
            :total="listCount"
            :current-page.sync="currentPage"
            :hide-on-single-page="true"
            :page-size="pageSize"
            @current-change="changeSize"
          />
        </div>
      </div>
      <div class="btns">
        <el-button @click="goPublish" type="primary">发布</el-button>
        <el-button @click="goShare">去分享</el-button>
      </div>
    </div>
    <!-- 添加用户 -->
    <el-dialog :visible.sync="addBox" :destroy-on-close="true" width="30%" title="新增用户">
      <div v-if="addBox">
        <add-user @cancelClick="closeBox" :rowId="rowId"></add-user>
      </div>
    </el-dialog>
    <!-- 编辑用户 -->
    <el-dialog :visible.sync="editBox" :destroy-on-close="true" width="30%" title="编辑用户">
      <div v-if="editBox">
        <edit-user @cancelEdit="closeEditBox" :nowUser="nowUser" :rowId="rowId"></edit-user>
      </div>
    </el-dialog>
    <!-- 系统参与者选择 -->
    <el-dialog :visible.sync="selectBox" :destroy-on-close="true" width="80%">
      <div v-if="selectBox">
        <select-user @closeSlectUserBox="closeSlectUserBox" :rowId="rowId"></select-user>
      </div>
    </el-dialog>
  </div>
</template>

<script>
/* eslint-disable */
import * as userData from "@/api/user";
import * as NaireAction from "@/api/naire";
import AddUser from "./AddUser.vue";
import EditUser from "./EditUser.vue";
import SelectUser from "./SelectUser.vue";
import { getLocalStorage } from "@/utils/storage";

export default {
  data() {
    return {
      list: [],
      listCount: 0,
      pageSize: 10,
      value1: true,
      value2: false,
      rowId: 1,
      ispublic: "1",
      addBox: false,
      editBox: false,
      nowUser: "",
      selectContent: [],
      currentPage: 1,
      selectBox: false,
      baseURL: `${process.env.VUE_APP_BASE_API}/upload/import_participant.xlsx`,
      uploadUrl: `${process.env.VUE_APP_BASE_API}/sParticipant/import`,
      uploadData: {},
      headers: {},
      loading: false,
      isPublish: false
    };
  },
  mounted() {
    const { rowId } = this.$route.params;
    this.rowId = rowId;
    this.getPublishStatus();
    this.getUserList(0, 10);
    this.uploadData = { surveyId: rowId };
    const jwtToken = getLocalStorage("JWT_TOKEN");
    this.headers.Authorization = `token ${jwtToken}`;
    // this.headers['Content-Type'] = 'multipart/form-data';
  },
  methods: {
    // 上传文件成功
    uploadSuccess(response, file, fileList) {
      if (response.err == 0) {
        this.getUserList(0, 10);
        this.$message.success("导入成功");
      } else {
        this.$message.error(response.msg);
      }
    },
    // 多选
    onSelectionChange(val) {
      this.selectContent = val;
    },
    // 翻页
    changeSize(page) {
      this.getUserList((page - 1) * this.pageSize, 10);
    },
    // 获取发布用户列表
    async getUserList(offset, limit) {
      const userList = await userData.getPublishUser({
        surveyId: this.rowId,
        offset,
        limit
      });
      if (userList.success) {
        let newList = [];
        if (userList.data.list.length !== 0) {
          newList = userList.data.list.map(item => {
            if (item.u_sex == 1) {
              return {
                ...item,
                u_sex: "女"
              };
            } else {
              return {
                ...item,
                u_sex: "男"
              };
            }
          });
        }
        this.list = newList;
        this.listCount = userList.data.total;
      }
    },
    // 获取分享状态
    async getPublishStatus() {
      const status = await userData.getPublishStatus({
        surveyId: this.rowId
      });
      if (status.success) {
        this.ispublic = status.data.n_ispublic;
        this.isPublish = status.data.n_status == 1;
        this.value1 = status.data.n_ispublic == 1 ? true : false;
        this.value2 = status.data.n_ispublic == 0 ? true : false;
      }
    },
    // 设置问卷分享状态
    async setPermission() {
      return await userData.setPublishStatus({
        surveyId: this.rowId
      });
    },
    // 切换分享开关
    async changeSwitch1(val) {
      const res = await this.setPermission();
      if (res.success) {
        this.$message.success("设置成功！");
        this.value2 = !val;
      }
    },
    async changeSwitch2(val) {
      const res = await this.setPermission();
      if (res.success) {
        this.$message.success("设置成功！");
        this.value1 = !val;
      }
    },
    // 去分享
    goShare() {
      this.$parent.changeTab("share");
    },

    // 发布问卷
    async goPublish() {
      const res = await NaireAction.changeStatus({
        n_id: this.rowId,
        n_state: true
      });
      if (res.success) {
        // if (this.isPublish) {
        //   this.isPublish = false;
        //   return this.$message.success("取消发布成功");
        // }
        // this.isPublish = true;
        this.$message.success("发布成功，快去分享您的问卷吧~");
      }
    },

    // 添加新用户
    addUser() {
      this.addBox = true;
    },

    // 取消新增用户
    closeBox(featchData) {
      if (featchData) {
        this.getUserList(0, 10);
      }
      this.addBox = false;
    },

    // 编辑用户
    handleEdit(row) {
      this.nowUser = row;
      this.editBox = true;
    },

    // 取消编辑
    closeEditBox(featchData) {
      if (featchData) {
      }
      this.editBox = false;
    },

    // 单个删除
    handleDelete(row) {
      this.$confirm("确定删除？", "删除", {
        type: "warning"
      })
        .then(async () => {
          const res = await userData.delSingle({
            pId: row.u_id
          });
          if (res.success) {
            this.$message.success("删除成功");
            this.getUserList(0, 10);
            this.currentPage = 1;
          } else {
            this.$message.error("删除失败");
          }
        })
        .catch(() => {});
    },

    // 批量删除
    deleteBatch() {
      if (this.selectContent.length === 0) {
        return this.$message.info("至少选择一个用户");
      }
      this.$confirm("确定删除？", "删除", {
        type: "warning"
      })
        .then(async () => {
          const rowIds = this.selectContent.map(({ u_id: id }) => id).join(",");
          const res = await userData.delBatch({
            pIds: rowIds
          });
          if (res.success) {
            this.$message.success("删除成功");
            this.getUserList(0, 10);
            this.currentPage = 1;
          } else {
            this.$message.error("删除失败");
          }
        })
        .catch(() => {});
    },

    // 单个设置访问码
    async setCodeSingle(id) {
      const res = await userData.setCodeSingle({
        pId: id
      });
      if (res.success) {
        this.$message.success("设置成功");
        this.list = this.list.map(item => {
          if (item.u_id === id) {
            return {
              ...item,
              u_visitcode: res.data.u_visitcode
            };
          } else {
            return {
              ...item
            };
          }
        });
      } else {
        this.$message.error("设置失败");
      }
    },

    // 批量设置访问码
    setCodeBatch() {
      if (this.selectContent.length == 0) {
        return this.$message.error("请选择访问者");
      }
      let hasCode = false;
      this.selectContent.forEach(item => {
        if (item.u_visitcode.length > 0) {
          hasCode = true;
        }
      });
      if (hasCode) {
        this.$confirm("已选访问者部分已有访问码，是否重新设置？", "提示", {
          type: "warning"
        })
          .then(async () => {
            const rowIds = this.selectContent
              .map(({ u_id: id }) => id)
              .join(",");
            const res = await userData.setCodeBath({
              pIds: rowIds
            });
            if (res.success) {
              this.$message.success("设置成功");
              this.getUserList(0, 10);
              this.currentPage = 1;
            } else {
              this.$message.error("设置失败");
            }
          })
          .catch(() => {});
      }
    },

    // 打开系统参与者
    openSlectUserBox() {
      this.selectBox = true;
    },

    // 关闭系统参与者
    closeSlectUserBox(isLoading) {
      this.selectBox = false;
      if (isLoading) {
        this.getUserList(0, 10);
      }
    },

    onUploadSuccess(response) {
      if (response.err === 0) {
        this.$message.success(response.msg);
        this.fetchListData();
      } else {
        this.$message.error("上传出错");
      }
    }
  },
  components: {
    AddUser,
    EditUser,
    SelectUser
  }
};
</script>

<style lang="scss" scoped>
.settings-publish {
  // flex: 1;
  display: flex;
  justify-content: center;
  background-color: #fff;
  overflow-y: scroll;
}
.publishBox {
  // flex: 1;
  min-width: 1000px;
  background-color: #fff;
  padding: 0 20px 10px;
  box-sizing: border-box;
}

.publishTitle {
  height: 100px;
  font-size: 20px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.pubSelect {
  display: flex;
}

.switch {
  width: 200px;

  p {
    height: 40px;
    display: flex;
    justify-content: flex-start;
    align-items: center;

    span {
      margin-right: 20px;
    }
  }
}

.operate {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  flex: 1;

  .tip {
    font-size: 12px;
    color: red;
  }

  .spaceBtn {
    margin-right: 30px;
  }
}

.operateBtn {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.leftBtns {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.uploadBtn {
  margin-right: 20px;
}

.downMode {
  a {
    font-size: 12px;
    text-decoration: underline;
    color: #3399FF;
  }
}

.publishBtn {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-size: 12px;
  color: #4a4a4a;
  border-radius: 5px;
  border: 1px solid #ccc;
  height: 32px;
  padding: 5px 5px;
  cursor: pointer;
  box-sizing: border-box;
}
.publishBtn img {
  width: 12px;
  height: 12px;
  margin-right: 5px;
}

.importBtn,
.addBtn {
  margin-right: 20px;
}

.userList {
  margin-top: 20px;
}

.btns {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
}
.codePro {
  width: 50px;
  height: 30px;
}
.pagination {
  padding-bottom: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.commonBtn{
  width: 50px;
  height: 30px;
}
</style>
