<template>
  <div v-loading.fullscreen.lock="loading" class="users">
    <el-form inline>
      <el-form-item>
        <el-button type="primary" @click="addUser">新增用户</el-button>
      </el-form-item>
      <el-form-item>
        <el-upload
          class="uploadBtn"
          name="up_file"
          :action="uploadUrl"
          accept=".xls, .xlsx, .csv"
          :show-file-list="false"
          :limit="1"
          :headers="headers"
          :auto-upload="true"
          :on-success="uploadSuccess"
        >
          <el-button plain icon="el-icon-upload el-icon--right">批量导入</el-button>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-link class="downMode" type="primary" :href="baseURL">下载模板</el-link>
      </el-form-item>
      <el-form-item>
        <el-select v-model="searchParams.value" placeholder="搜索类别">
          <el-option
            v-for="(item, index) in searchOptions"
            :key="index"
            :value="item.value"
            :label="item.label"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input v-model="searchParams.keyword" clearable placeholder="搜索内容" />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="ios-search"
          @click="fetchListData(0,pageParams.page_size)"
        >搜索用户</el-button>
      </el-form-item>
      <el-form-item class="batchDelete">
        <el-button type="danger" @click="batchDelete">批量删除</el-button>
        <!-- <el-button type="warning" @click="clearAll">一键清空</el-button> -->
      </el-form-item>
    </el-form>
    <div>
      <el-table :data="list" border @selection-change="onSelectionChange">
        <el-table-column type="selection" />
        <el-table-column prop="u_number" label="编号" />
        <el-table-column prop="u_name" label="姓名" />
        <el-table-column prop="u_sex" label="性别">
          <template slot-scope="{ row }">{{ row.u_sex }}</template>
        </el-table-column>
        <el-table-column prop="u_class" label="组织单位" />
        <el-table-column prop="u_identity" label="身份证号" />
        <!-- <el-table-column prop="u_email" label="邮箱" /> -->
        <el-table-column prop="u_mobile" label="手机号" />
        <el-table-column label="操作" width="180">
          <template slot-scope="{ row }">
            <el-button class="commonBtn" title="编辑" type="primary" icon="el-icon-edit-outline" @click="handleEdit(row)"></el-button>
            <el-button class="commonBtn" title="删除" type="danger" icon="el-icon-delete" @click="handleDelete(row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="pagination">
      <el-pagination
        background
        :current-page.sync="pageParams.current"
        :page-size="pageParams.page_size"
        layout="prev, pager, next, jumper"
        :total="total"
        @current-change="onChangePage"
      />
    </div>
    <!-- 添加用户 -->
    <el-dialog :visible.sync="addUserVisible" :destroy-on-close="true" width="30%" title="新增用户">
      <div v-if="addUserVisible">
        <add-user @cancelClick="closeBox"></add-user>
      </div>
    </el-dialog>
    <!-- 编辑用户 -->
    <el-dialog :visible.sync="editUserVisible" :destroy-on-close="true" width="30%" title="编辑用户">
      <div v-if="editUserVisible">
        <edit-user @cancelEdit="closeEditBox" :nowUser="nowUser"></edit-user>
      </div>
    </el-dialog>
    <!-- <add-user :visible.sync="addUserVisible" @submit="fetchListData(0,pageParams.page_size)" />
    <edit-user :visible.sync="editUserVisible" :model="editModel" @submit="fetchListData(0,pageParams.page_size)" />-->
  </div>
</template>

<script lang="ts">
/* eslint-disable */
import { Component, Vue } from "vue-property-decorator";
import * as UserAction from "@/api/user";
import AddUser from "@/views/user/components/AddUser.vue";
import EditUser from "@/views/user/components/EditUser.vue";
import { defaultUserData } from "@/api/default";
import { getLocalStorage } from "@/utils/storage";

interface ISearchOption {
  value: string;
  label: string;
}

@Component({
  components: {
    AddUser,
    EditUser
  }
})
export default class extends Vue {
  private loading: boolean = false;
  private searchParams: {
    keyword: string;
    value: string;
  } = {
    keyword: "",
    value: ""
  };
  public searchOptions: ISearchOption[] = [
    { value: "20", label: "姓名" },
    { value: "10", label: "编号" },
    { value: "40", label: "身份证号" },
    { value: "30", label: "组织单元" },
    { value: "50", label: "手机号" }
  ];
  private editModel: User.IUser = {
    ...defaultUserData
  };
  private addUserVisible: boolean = false;
  private editUserVisible: boolean = false;
  private selectContent: User.IUser[] = [];
  private pageParams: {
    current: number;
    page_size: number;
  } = {
    current: 1,
    page_size: 10
  };
  private total: number = 0;
  public list: User.IUser[] = [];
  private nowUser: any = "";
  private uploadData: any = {};
  private headers: any = {};
  private baseURL: string = `${process.env.VUE_APP_BASE_API}/upload/import_sysparticipant.xlsx`;

  get uploadUrl() {
    return `${process.env.VUE_APP_BASE_API}/participant/import`;
  }

  uploadSuccess(response: any, file: any, fileList: any) {
    if (response.err == 0) {
      this.fetchListData(0, 10);
      this.$message.success("导入成功");
    } else {
      this.$message.error(response.msg);
    }
  }

  onChangePage(val: number) {
    this.pageParams.current = val;
    this.fetchListData(
      (val - 1) * this.pageParams.page_size,
      this.pageParams.page_size
    );
  }

  onSelectionChange(val: User.IUser[]) {
    this.selectContent = val;
  }

  onUploadExceeded() {
    this.$message.warning("仅支持单个单文件导入");
  }

  onUploadSuccess(response: any) {
    if (response.err === 0) {
      this.$message.success(response.msg);
      this.fetchListData(0, 10);
    } else {
      this.$message.error("上传出错");
    }
  }

  onUploadError() {
    this.$message.error("上传出错");
  }

  handleEdit(row: User.IUser) {
    this.nowUser = row;
    this.editUserVisible = true;
  }

  closeEditBox() {
    this.editUserVisible = false;
  }

  handleDelete(row: User.IUser) {
    this.$confirm("确认删除此用户吗？", "删除", {
      type: "warning"
    })
      .then(() => {
        this.delUser(row.u_id || "");
      })
      .catch(() => {});
  }

  public addUser() {
    this.addUserVisible = true;
  }

  closeBox(type: any) {
    this.addUserVisible = false;
    if (type) {
      this.fetchListData(0, this.pageParams.page_size);
    }
  }

  private async delUser(nIds: string) {
    const res = await UserAction.del({
      pId: nIds
    });
    if (res.success) {
      this.$message.success(`删除成功`);
      this.pageParams.current = 1;
      this.fetchListData(0, 10);
    } else {
      this.$message.error(res.msg);
    }
  }

  public batchDelete() {
    if (this.selectContent.length == 0) {
      return this.$message.error("至少选择一条数据");
    }
    this.$confirm("您确认删除这几条内容吗？", "批量删除", {
      type: "warning"
    })
      .then(async () => {
        const rowIds = this.selectContent.map(({ u_id: id }) => id).join(",");
        const res = await UserAction.delUserBatch({
          pIds: rowIds
        });
        if (res.success) {
          this.$message.success("删除成功");
          this.fetchListData(0, 10);
        } else {
          this.$message.error("删除失败");
        }
      })
      .catch(() => {});
  }

  public clearAll() {
    this.$confirm("您确认删除全部内容吗？", "一键清空", {
      type: "warning"
    })
      .then(async () => {
        const res = await UserAction.clear();
        if (res.success) {
          this.$message.success("清空用户成功");
          this.fetchListData(0, 10);
        } else {
          this.$message.error(res.msg);
        }
      })
      .catch(() => {});
  }

  public async fetchListData(offset: number, limit: number) {
    this.loading = true;
    const res = await UserAction.list({
      keyword: this.searchParams.keyword,
      type: this.searchParams.value,
      offset,
      limit
    });
    this.loading = false;
    if (res.success) {
      let newList = [];
      if (res.data.list.length !== 0) {
        newList = res.data.list.map((item: any) => {
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
      this.total = res.data.total;
    } else {
      this.$message.error(res.msg);
    }
  }

  mounted() {
    this.fetchListData(0, 10);
    const jwtToken = getLocalStorage("JWT_TOKEN");
    this.headers.Authorization = `token ${jwtToken}`;
  }
}
</script>

<style scoped>
.users {
  flex: 1;
}
.downMode {
  font-size: 12px;
  color: #3399FF;
}
.pagination {
  padding-bottom: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.batchDelete{
  float: right;
  margin-right: 50px;
}

.commonBtn{
  width: 50px;
  height: 30px;
}
</style>
