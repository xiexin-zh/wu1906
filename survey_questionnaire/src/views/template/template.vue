<template>
  <div class="templates">
    <div class="temTab">
      <div class="temTitle">
        <span class="el-icon-s-fold"></span>
        <span class="temClass">模板分类</span>
      </div>
      <div class="myTem">
        <p @click="clickTitle('my')">
          <span>我的模板</span>
          <span :class="showMy ? 'el-icon-caret-top' : 'el-icon-caret-bottom'"></span>
        </p>
        <ul v-show="showMy">
          <li :class="active == 'my-all' ? 'menu' : '' " @click="clickTab('my-all')">全部</li>
        </ul>
      </div>
      <div class="sysTem">
        <p @click="clickTitle('sys')">
          <span>系统模板</span>
          <span :class="showSys ? 'el-icon-caret-top' : 'el-icon-caret-bottom'"></span>
        </p>
        <ul v-show="showSys">
          <li :class="active == 'sys-all' ? 'menu' : '' " @click="clickTab('sys-all')">全部</li>
        </ul>
      </div>
    </div>
    <div class="temMain">
      <el-table class="userTable" :data="list" :header-row-style="headerStyle">
        <el-table-column prop="s_title" label="问卷名称" />
        <el-table-column label="操作" width="200">
          <template slot-scope="{ row }">
            <el-button class="commonBtn" type="primary" title="预览" @click="handleView(row)" icon="el-icon-view"></el-button>
            <el-button class="commonBtn" type="primary" title="复制" @click="handleCopy(row)" icon="el-icon-document-copy"></el-button>
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

export default {
  data() {
    return {
      active: "my-all",
      showMy: true,
      showSys: true,
      isSysTem: false,
      list: [],
      listCount: 0,
      currentPage: 1,
      pageSize: 10,
      headerStyle: { fontSize: "14px", color: "#333", fontWeight: 400 }
    };
  },
  methods: {
    clickTab(value) {
      this.active = value;
      if (value == "my-all") {
        this.isSysTem = false;
      } else {
        this.isSysTem = true;
      }
      this.getTemplate(0, this.pageSize);
    },
    clickTitle(value) {
      if (value == "my") {
        this.showMy = !this.showMy;
      } else {
        this.showSys = !this.showSys;
      }
    },
    async handleCopy(row) {
      const res= await NaireAction.copyTemplate({
        surveyId: row.s_id
      })
      if(res.success){
        this.$message.success('复制成功');
        this.$router.push({
          path: `/setting/${res.data.newSurveyId}/questionadd`
        });
      }else{
        this.$message.error('复制失败')
      }
    },
    handleView(row) {
      const routes = this.$router.resolve({
        name: "view",
        params: {
          type: "0",
          id: row.s_id,
          normal: 'template'
        }
      });
      window.open(routes.href, "_blank");
    },
    changeSize(page) {
      this.getTemplate((page - 1) * this.pageSize, this.pageSize);
    },
    async getTemplate(offset, limit) {
      const res = await NaireAction.getTemplate({
        isSys: this.isSysTem,
        offset,
        limit
      });
      if (res.success) {
        this.$message.success("获取成功");
        this.list = res.data.list;
        this.listCount = res.data.total;
      } else {
        this.$message.error("获取失败");
      }
    }
  },
  mounted() {
    this.getTemplate(0, this.pageSize);
  }
};
</script>

<style lang="scss" scoped>
.templates {
  flex: 1;
  display: flex;
}
.temTab {
  width: 200px;
  background-color: #fff;

  .temTitle {
    height: 40px;
    font-size: 16px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 20px;

    .el-icon-s-fold {
      font-size: 30px;
      margin-right: 5px;
    }

    .temClass {
      font-size: 18px;
      color: #333;
    }
  }

  .myTem,
  .sysTem {
    p {
      padding-left: 35px;
      box-sizing: border-box;
      height: 30px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      color: #333;
      cursor: pointer;

      .el-icon-caret-bottom,
      .el-icon-caret-top {
        margin-left: 5px;
        color: #666;
        font-size: 12px;
        font-weight: 600;
      }
    }

    ul {
      list-style: none;

      li {
        cursor: pointer;
      }
    }
  }
}
.menu {
  color: blue;
}
.temMain {
  flex: 1;
  background-color: #f5f7f9;
  border-radius: 5px;
  padding: 5px;
  box-sizing: border-box;
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
