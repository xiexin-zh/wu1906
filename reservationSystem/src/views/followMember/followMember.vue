<template>
  <div class="followMember">
    <div class="memberBox">
      <div class="memberOperate">
        <HeadSearch :selectChange="selectChange" :options="options" :clickSerchBtn="clickSerch" />
      </div>
      <div class="lists">
        <div class="userList">
          <el-table :data="list" border>
            <el-table-column type="index" align="center" label="编号" width="50"></el-table-column>
            <el-table-column align="center" prop="realname" label="姓名" />
            <el-table-column align="center" prop="mobile" label="手机号" />
            <el-table-column align="center" prop="appoint_mode" label="预约方法" />
            <el-table-column align="center" prop="ro_peoplenum" label="同行人数" />
            <el-table-column align="center" prop="ro_tripmode" label="出行方式" />
            <el-table-column :formatter="formatTime" align="center" prop="ro_time" label="检票日期" />
            <el-table-column align="center" prop="ro_updatetime" label="检票时间" />
            <el-table-column align="center" prop="organ_name" label="预约机构" />
            <el-table-column align="center" prop="ro_state" label="状态">
              <template slot-scope="scope">
                <span v-if="scope.row.ro_state == 0" style="color:black;">已预约</span>
                <span v-if="scope.row.ro_state == 1" style="color:red;">已取消</span>
              </template>
            </el-table-column>
            <el-table-column width="160" align="center" label="操作">
              <template v-slot="{ row }">
                <el-button class="commonBtn" title="查看" type="primary" @click="handleView(row)">查看</el-button>
                <el-button class="commonBtn" title="查看" type="danger" @click="handleSelect(row)">筛选</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <div v-if="searchlist.length>0" class="userList">
          <div class="headerbox">
            <span>以下是为您筛查的结果:</span>
            <div class="memberFilter">
              <span @click="handleExport">导出Excel表格</span>
            </div>
          </div>
          <el-table :data="searchlist" border>
            <el-table-column type="index" align="center" label="编号" width="50"></el-table-column>
            <el-table-column align="center" prop="realname" label="姓名" />
            <el-table-column align="center" prop="mobile" label="手机号" />
            <el-table-column align="center" prop="appoint_mode" label="预约方法" />
            <el-table-column align="center" prop="ro_peoplenum" label="同行人数" />
            <el-table-column align="center" prop="ro_tripmode" label="出行方式" />
            <el-table-column :formatter="formatTime" align="center" prop="ro_time" label="检票日期" />
            <el-table-column align="center" prop="ro_updatetime" label="检票时间" />
            <el-table-column align="center" prop="organ_name" label="预约机构" />
            <el-table-column align="center" prop="ro_state" label="状态">
              <template slot-scope="scope">
                <span v-if="scope.row.ro_state == 0" style="color:black;">已预约</span>
                <span v-if="scope.row.ro_state == 1" style="color:red;">已取消</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="操作">
              <template v-slot="{ row }">
                <el-button class="commonBtn" title="查看" type="primary" @click="handleView(row)">查看</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页 -->
          <div class="pagination">
            <el-pagination
              layout="prev, pager, next, jumper"
              :total="listCount"
              :page-size="pageSize"
              :current-page.sync="currentPage"
              @current-change="changeSize"
            />
          </div>
        </div>
        <ViewTable :userItem="userItem" :dialogVisible2="dialogVisible2" :closeView="closeView" />
      </div>
    </div>
  </div>
</template>

<script>
import { getfollowList, getfollowSearch } from "../../api/follow";
import HeadSearch from "@/components/HeadSearch.vue";
import ViewTable from "@/components/ViewTable.vue";
import { format } from "../../utils/transform";
export default {
  data() {
    return {
      options: [
        {
          value: "10",
          label: "姓名"
        },
        {
          value: "20",
          label: "身份证号"
        },
        {
          value: "30",
          label: "手机号"
        }
      ],
      inputValue: "",
      list: [],
      searchlist: [],
      listCount: 0,
      pageSize: 10,
      limit: 10,
      currentPage: 1,
      type: "",
      userItem: [],
      dialogVisible: false,
      offset: 0,
      row: "",
      dialogVisible2: false
    };
  },
  methods: {
    searchUser() {},
    selectChange(val) {
      this.type = val;
    },
    clickSerch(val) {
      if (!this.type) {
        this.$message("请选择类别");
        return;
      }
      this.inputValue = val;
      this.getalist(0, this.limit);
    },
    handleClose() {
      this.dialogVisible = false;
    },
    changeSize(page) {
      const row = this.row;
      this.currentPage = page;
      getfollowSearch({
        updatetime: row.ro_updatetime,
        organ: row.ro_organ,
        offset: (page - 1) * this.limit,
        limit: this.limit
      }).then(res => {
        console.log(res);
        if (res.error == 0) {
          if (res.data.list.length == 0) {
            this.$message("没有查询到数据");
          }
          this.searchlist = res.data.list;
          this.listCount = res.data.total;
        } else {
          this.$message.error(res.msg);
        }
      });
      this.getalist((this.currentPage - 1) * this.pageSize, this.pageSize);
    },
    formatTime(row) {
      return format(parseInt(row.ro_time));
    },
    handleSelect(row) {
      this.row = row;
      getfollowSearch({
        updatetime: row.ro_updatetime,
        organ: row.ro_organ,
        offset: 0,
        limit: this.limit
      }).then(res => {
        console.log(res);
        if (res.error == 0) {
          if (res.data.list.length == 0) {
            this.$message("没有查询到数据");
          }
          this.searchlist = res.data.list;
          this.listCount = res.data.total;
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    handleExport() {
      const { ro_updatetime, ro_organ, realname, mobile } = this.row;

      const api = 'http://reserveapi.prosuntech.com/admin';
      const token = localStorage.getItem('JWT_TOKEN');
      window.location.href = `${api}/show/exportData?token=token ${token}&updatetime=${ro_updatetime}&organ=${ro_organ}&mobile=${mobile}&realname=${realname}`
      // console.log(jwtToken)
      // exportData({
      //   updatetime: ro_updatetime,
      //   organ: ro_organ,
      //   mobile,
      //   realname,
      //   token:"token "+jwtToken
      // });
    },
    getalist(offset, limit) {
      getfollowList({
        type: this.type,
        keyword: this.inputValue,
        offset,
        limit
      }).then(res => {
        if (res.error == 0) {
          if (res.data.length == 0) {
            this.$message("没有查询到数据");
          }
          this.list = res.data;
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    handleView(row) {
      this.dialogVisible2 = true;
      this.userItem = row;
      console.log(row);
    },
    closeView() {
      this.dialogVisible2 = false;
    }
  },

  components: {
    HeadSearch,
    ViewTable
  }
};
</script>

<style scoped lang="less">
.followMember {
  flex: 1;
  display: flex;
  padding: 15px;
  box-sizing: border-box;
}
.memberBox {
  flex: 1;
  background-color: #fff;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  padding: 15px;
  box-sizing: border-box;
}
.memberOperate {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 80px;
}
.memberFilter {
  span {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 108px;
    height: 40px;
    background: rgba(68, 92, 115, 1);
    border-radius: 4px;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #fff;
    cursor: pointer;
  }
}
.menberSearch {
  width: 70%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  .el-button {
    color: #fff;
    background-color: #445c73;
  }
}
.selectInput {
  width: 200px;
  margin: 0 10px;
}
.lists {
  flex: 1;
}

.userinfo {
  .inputLayout,
  .textLayout {
    line-height: 40px;
  }
  .inputLayout {
    border: 1px solid rgba(0, 0, 0, 0.14);
    border-radius: 4px;
    padding-left: 24px;
  }
}

.el-row {
  margin-bottom: 16px;
}
.headerbox {
  margin-top: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.pagination {
  text-align: center;
}
</style>
