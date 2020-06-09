<template>
  <div class="recycle">
    <div class="clearAll">
      <el-button type="danger" @click="clearAll">清空回收站</el-button>
    </div>
    <div class="listBox">
      <el-table class="userTable" :data="list" :header-row-style="headerStyle">
        <el-table-column prop="s_title" label="问卷名称" />
        <el-table-column width="200" prop="s_creattime" label="发布时间" />
        <el-table-column label="操作" width="200">
          <template slot-scope="{ row }">
            <img class="opbtn" title="恢复" @click="handleDelete(row)" :src="require('../../../public/icon/huifu.png')" alt="">
            <img class="opbtn" title="彻底删除" @click="handleRecover(row)" :src="require('../../../public/icon/deepDel.png')" alt="">
            <!-- <el-button class="opbtn" type="danger" icon="el-icon-close" @click="handleDelete(row)"></el-button> -->
            <!-- <el-button
              class="opbtn"
              type="success"
              icon="el-icon-caret-right"
              @click="handleRecover(row)"
            ></el-button> -->
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
  </div>
</template>

<script>
/* eslint-disable */
import * as NaireAction from "@/api/naire";
import { format } from "../../utils/transform";
export default {
  data() {
    return {
      list: [],
      pageSize: 10,
      listCount: 0,
      currentPage: 1,
      headerStyle: { fontSize: "14px", color: "#333", fontWeight: 400 }
    };
  },
  methods: {
    clearAll() {
      if (this.list.length == 0) {
        return this.$message.error("已没有数据");
      }
      this.$confirm("彻底删除将不可再恢复，确定吗？", {
        type: "warning"
      })
        .then(async () => {
          const res = await NaireAction.clearAll();
          if (res.success) {
            this.getListData(0, this.pageSize);
            this.$message.success("清空成功");
          } else {
            this.$message.error("清空失败");
          }
        })
        .catch(() => {});
    },
    async handleRecover(row) {
      const res = await NaireAction.recoverNaire({
        surveyId: row.s_id
      });
      if (res.success) {
        this.getListData(0, this.pageSize);
        this.$message.success("恢复成功");
      } else {
        this.$message.error("恢复失败");
      }
    },
    handleDelete(row) {
      this.$confirm("删除问卷将不可再恢复，确定吗？", {
        type: "warning"
      })
        .then(async () => {
          const res = await NaireAction.singleDel({
            surveyId: row.s_id
          });
          if (res.success) {
            this.currentPage = 1;
            this.getListData(0, this.pageSize);
            this.$message.success("删除成功");
          } else {
            this.$message.error("删除失败");
          }
        })
        .catch(() => {});
    },
    changeSize(page) {
      this.getListData((page - 1) * this.pageSize, this.pageSize);
    },
    async getListData(offset, limit) {
      const res = await NaireAction.getRecyleList({
        offset,
        limit
      });
      if (res.success) {
        let newList = [];
        if (res.data.list.length > 0) {
          newList = res.data.list.map(item => {
            return {
              ...item,
              s_creattime: format(Number(item.s_creattime)),
              n_creattime: format(Number(item.n_creattime))
            };
          });
        }
        this.list = newList;
        this.listCount = res.data.total;
      } else {
        this.$message.error("数据获取失败");
      }
    }
  },
  mounted() {
    this.getListData(0, this.pageSize);
  }
};
</script>

<style lang="scss" scoped>
.recycle {
  flex: 1;
}
.clearAll {
  height: 50px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-right: 50px;
  box-sizing: border-box;
}
.listBox {
  .opbtn {
    height: 30px;
    margin-right: 5px;
  }
}
.pagination {
  padding-bottom: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>