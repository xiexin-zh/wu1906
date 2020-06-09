<template>
  <div class="userList">
    <div class="select">
      <el-select v-model="valuetype" placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-input class="selectInput" v-model="inputValue" placeholder="请输入内容" />
      <el-button @click="searchUser">搜索</el-button>
    </div>
    <div class="userList">
      <el-table :data="list" border @selection-change="onSelectionChange">
        <el-table-column type="selection" />
        <el-table-column prop="u_number" label="编号" />
        <el-table-column prop="u_name" label="姓名" />
        <el-table-column prop="u_sex" label="性别" width="50" />
        <el-table-column prop="u_class" label="组织单位" />
        <el-table-column prop="u_identity" label="身份证号" />
        <el-table-column prop="u_mobile" label="手机号" />
      </el-table>
      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          background
          layout="prev, pager, next, jumper"
          :total="listCount"
          :hide-on-single-page="true"
          :page-size="pageSize"
          :current-page.sync="currentPage"
          @current-change="changeSize"
        />
      </div>
    </div>
    <div class="footerBtn">
      <el-button @click="cancelSave">取 消</el-button>
      <el-button type="primary" @click="addUser">确定</el-button>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import * as userData from "@/api/user";

export default {
  props: ["rowId"],
  data() {
    return {
      list: [],
      listCount: 0,
      pageSize: 10,
      options: [
        {
          value: "10",
          label: "编号"
        },
        {
          value: "20",
          label: "姓名"
        },
        {
          value: "30",
          label: "组织单位"
        },
        {
          value: "40",
          label: "身份证号"
        },
        {
          value: "50",
          label: "手机号"
        }
      ],
      valueSelect: "10",
      inputValue: "",
      valuetype: "",
      selectContent: [],
      currentPage: 1
    };
  },
  mounted() {
    this.getSystemUser({ type: "", keyword: "", offset: 0, limit: 10 });
  },
  methods: {
    changeSize(page) {
      this.getSystemUser({
        type: this.valuetype,
        keyword: this.inputValue,
        offset: (page - 1) * this.pageSize,
        limit: 10
      });
    },
    cancelSave() {
      this.$emit("closeSlectUserBox", false);
    },
    // 获取数据
    async getSystemUser({ type, keyword, offset, limit }) {
      let getData = {
        surveyId: this.rowId,
        type,
        keyword,
        offset,
        limit
      };
      const res = await userData.getSystemUser({
        ...getData
      });
      if (res.success) {
        let newList = [];
        if (res.data.list.length > 0) {
          newList = res.data.list.map(item => {
            if (item.u_sex == 0) {
              return {
                ...item,
                u_sex: "男"
              };
            } else {
              return {
                ...item,
                u_sex: "女"
              };
            }
          });
        }
        this.list = newList;
        this.listCount = res.data.total;
      }
    },
    //搜素
    searchUser() {
      this.getSystemUser({
        type: this.valuetype,
        keyword: this.inputValue,
        offset: 0,
        limit: 10
      });
      this.currentPage = 1;
    },
    // 多选
    onSelectionChange(val) {
      this.selectContent = val;
    },
    // 确定添加
    async addUser() {
      if (this.selectContent.length == 0) {
        return this.$message.error("请先现在用户");
      }
      const rowIds = this.selectContent.map(({ u_id: id }) => id).join(",");
      const res = await userData.saveSystemUser({
        surveyId: this.rowId,
        pIds: rowIds
      });
      if (res.success) {
        this.$message.success("添加成功");
        this.$emit("closeSlectUserBox", true);
      }
    }
  }
};
</script>

<style scoped>
.select {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 20px;
}
.selectInput {
  width: 200px;
  margin: 0 10px;
}
.footerBtn {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.pagination {
  padding-bottom: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>