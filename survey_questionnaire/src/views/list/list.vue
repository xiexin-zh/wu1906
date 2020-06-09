<template>
  <div v-loading.fullscreen.lock="loading" class="naire-list">
    <div class="naire-btn">
      <el-button type="primary" @click="createNaire">创建问卷</el-button>
      <el-button type="danger" @click="batchDelete">批量删除</el-button>
    </div>
    <el-table :data="list" @selection-change="onSelectionChange">
      <el-table-column type="selection" width="55" />
      <el-table-column prop="n_title" label="问卷名称" align="left" width="250">
        <template slot-scope="{ row }">
          <router-link tag="a" :to="`./view/0/${row.n_id}/naire`" target="_blank">
            <span
              :title="row.n_title"
            >{{ row.n_title.length > 18 ? row.n_title.substr(0,18) + '...' : row.n_title }}</span>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column prop="n_creattime" label="创建时间" align="center">
        <template slot-scope="{ row }">{{ row.n_creattime | formatTime }}</template>
      </el-table-column>
      <el-table-column prop="n_starttime" label="开始时间" align="center">
        <template slot-scope="{ row }">{{ row.n_creattime | formatTime }}</template>
      </el-table-column>
      <el-table-column prop="n_deadline" label="结束时间" align="center">
        <template slot-scope="{ row }">
          <!-- 问卷超过截止日期 -->
          {{ row.n_deadline | formatTime }}
        </template>
      </el-table-column>
      <el-table-column prop="n_status" label="问卷状态" align="center">
        <template slot-scope="{ row }">
          <div class="naireStatus">
            <el-tag class="ml-10 status" size="mini" :type="row.n_status | statusColorFilter">{{ row.n_status | statusFilter }}</el-tag>
            <el-tag v-if="isExpired(row.n_deadline)" class="ml-10" size="mini" type="info">已截止</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="200px">
        <template slot-scope="{ row }">
          <!-- <el-button
            type="primary"
            size="mini"
            style="margin-right: 10px"
            @click="handleStatistics(row)"
          >统计分析</el-button> -->
          <img class="fenxi" title="统计分析" @click="handleStatistics(row)" :src="require('../../../public/icon/fenxi.png')" alt="">
          <el-dropdown @command="onOptionClick($event, row)">
            <!-- <el-button type="danger" size="mini"> -->
              <img class="caozuo" title="操作" :src="require('../../../public/icon/caozuo.png')" alt="">
              <!-- 操作
              <i class="el-icon-arrow-down el-icon--right" /> -->
            <!-- </el-button> -->
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="preview">预览问卷</el-dropdown-item>
              <el-dropdown-item command="share">问卷分享</el-dropdown-item>
              <el-dropdown-item command="copy">问卷复制</el-dropdown-item>
              <el-dropdown-item command="setting">问卷设置</el-dropdown-item>
              <el-dropdown-item
                command="publish"
              >{{ row.n_status === NaireStatus.PUBLISHED ? '停止发布' : '发布问卷' }}</el-dropdown-item>
              <el-dropdown-item command="delete">删除问卷</el-dropdown-item>
              <el-dropdown-item command="saveAs">另存为模板</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>

    <change-time :visible.sync="changeTimeVisible" :model="editModel" />
    <copy-url :visible.sync="copyUrlVisible" :model="editModel" />
    <create-tab :visible.sync="selectTabVisible" />
    <div class="pagination">
      <el-pagination
        background
        layout="prev, pager, next, jumper"
        :total="listCount"
        :hide-on-single-page="true"
        :page-size="pageSize"
        @current-change="changeCurrent"
      />
    </div>
  </div>
</template>

<script lang="ts">
/* eslint-disable */
import { Component, Vue } from "vue-property-decorator";
import dayjs from "dayjs";
import ChangeTime from "./components/ChangeTime.vue";
import CopyUrl from "./components/CopyUrl.vue";
import CreateTab from "./components/CreateTab.vue";
import * as NaireAction from "@/api/naire";
import { IApiNaireItem } from "@/api/types";

import {
  NaireStatus,
  NaireStatusText,
  NaireStatusColor
} from "@/config/enum/naireStatus";

@Component({
  filters: {
    formatTime(val: string | number) {
      const timestamp = Number(val);
      if (timestamp == 0) {
        return "";
      }
      return dayjs(timestamp).format("YYYY-MM-DD HH:mm:ss");
    },
    statusFilter(val: NaireStatus) {
      return NaireStatusText[val];
    },
    statusColorFilter(val: NaireStatus) {
      return NaireStatusColor[val];
    }
  },
  components: {
    ChangeTime,
    CopyUrl,
    CreateTab
  }
})
export default class NavBar extends Vue {
  private list: IApiNaireItem[] = [];
  private NaireStatus = NaireStatus;
  private loading: boolean = false;
  private changeTimeVisible: boolean = false;
  private copyUrlVisible: boolean = false;
  private selectTabVisible: boolean = false;
  private editModel: any = {};
  private selectContent: any[] = [];
  private pageSize: number = 10;
  private listCount: number = 0;
  private totalPage: number = 0;

  mounted() {
    this.fetchListData(0, 10);
  }

  onSelectionChange(val: any) {
    this.selectContent = val;
  }

  onOptionClick(command: string, row: any) {
    switch (command) {
      case "preview":
        // this.$router.push({
        //   name: "view",
        //   params: {
        //     id: row.n_id
        //   }
        // });
        const routes = this.$router.resolve({
          path: `view/0/${row.n_id}/naire`
        });
        window.open(routes.href, "_blank");
        break;
      case "copy":
        this.copy(row);
        break;
      case "share":
        this.editModel = row;
        this.copyUrlVisible = true;
        break;
      case "setting":
        this.$router.push({
          path: `/setting/${row.n_id}/questionset/base`
        });
        break;
      case "publish":
        this.changeStatus(row);
        break;
      case "delete":
        this.singleDelete(row);
        break;
      case "saveAs":
        this.saveAs(row);
        break;
    }
  }

  /**
   * 是否已截止
   * @param deadline
   */
  public isExpired(deadline: number) {
    return deadline < Date.now();
  }

  public createNaire() {
    this.selectTabVisible = true;
  }

  private async deleteNaireSingle(nIds: string) {
    const res = await NaireAction.delSingle({
      n_id: nIds
    });
    if (res.success) {
      this.$message.success("删除成功");
      this.fetchListData(0, 10);
    } else {
      this.$message.error("删除失败");
    }
  }

  private async deleteNaireBatch(nIds: string) {
    const res = await NaireAction.delBatch({
      surveyIds: nIds
    });
    if (res.success) {
      this.$message.success("删除成功");
      this.fetchListData(0, 10);
    } else {
      this.$message.error("删除失败");
    }
  }

  public singleDelete(row: IApiNaireItem) {
    this.$confirm("您确认删除问卷吗？", "删除", {
      type: "warning"
    })
      .then(async () => {
        this.deleteNaireSingle(row.n_id);
      })
      .catch(() => {});
  }

  public batchDelete() {
    if (this.selectContent.length === 0) {
      return this.$message.info("请至少选择一条问卷");
    }
    this.$confirm("您确认删除这几条内容吗？", "批量删除", {
      type: "warning"
    })
      .then(async () => {
        const rowIds = this.selectContent.map(({ n_id: id }) => id).join(",");
        this.deleteNaireBatch(rowIds);
      })
      .catch(() => {});
  }

  /**
   * 查看统计
   * @param row
   */
  public handleStatistics(row: IApiNaireItem) {
    this.$router.push({
      name: "statisticsSource",
      params: {
        id: row.n_id
      }
    });
  }

  /**
   * 修改发布状态
   * @param row
   */
  async changeStatus(row: IApiNaireItem) {
    this.loading = true;
    const { n_status } = row;
    if (n_status == "1") {
      this.$confirm("您确定停止发布吗？", "停止发布", {
        type: "warning"
      })
        .then(async () => {
          const res = await NaireAction.changeStatus({
            n_id: row.n_id,
            n_state: false
          });
          this.loading = false;
          if (res.success) {
            this.$message.success("停止发布成功");
            this.fetchListData(0, 10);
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch(() => {
          this.loading = false;
        });
    } else {
      this.loading = false;
      this.$router.push({
        path: `/setting/${row.n_id}/questionset/publish`
      });
    }
  }

  /**
   * 另存为模板
   */

  async saveAs(row: IApiNaireItem) {
    const surveyId = row.n_id;
    const res = await NaireAction.saveAs({
      surveyId
    });
    if (res) {
      this.$message.success("已存入个人模板");
    } else {
      this.$message.error("另存失败");
    }
  }

  /**
   * 复制问卷
   */

  async copy(row: IApiNaireItem) {
    const surveyId = row.n_id;
    const res = await NaireAction.copy({
      surveyId
    });
    if (res) {
      this.$message.success("复制成功");
      this.fetchListData(0, this.pageSize);
    } else {
      this.$message.error("复制失败");
    }
  }

  public async fetchListData(offset: number, limit: number) {
    this.loading = true;
    const res = await NaireAction.list({
      offset,
      limit
    });
    const { list, total, total_page } = res.data;
    this.loading = false;
    if (!res.success) return;
    this.list = list;
    this.listCount = total || 0;
    this.totalPage = total_page || 0;
  }

  // 分页
  changeCurrent(page: any) {
    let rqCount: number = (page - 1) * this.pageSize;
    rqCount = rqCount < 0 ? 0 : rqCount;
    this.fetchListData(rqCount, this.pageSize);
  }
}
</script>

<style lang="scss" scoped>
.naire-list {
  flex: 1;
}
.naire-btn {
  margin: 10px;
}
.naireStatus{
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.pagination {
  padding-bottom: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.fenxi{
  width: 50px;
  height: 30px;
  margin-right: 16px;
}
.caozuo{
  width: 50px;
  height: 30px;
}
.status{
  margin-right: 10px;
}
</style>
