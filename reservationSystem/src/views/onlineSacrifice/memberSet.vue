<template>
  <div class="memberSet">
    <div class="box">
      <div class="head">
        <HeadSearch :selectChange="selectChange" :options="options" :clickSerchBtn="clickSerch" />
      </div>

      <div class="userlist">
        <el-table :data="userlist" border style="width: 100%">
          <el-table-column align="center" type="index" label="编号"></el-table-column>
          <el-table-column align="center" prop="oo_dead" label="祭奠对象"></el-table-column>
          <el-table-column align="center" prop="oo_writer" label="留言人"></el-table-column>
          <el-table-column width="510" align="center" prop="oo_message" label="祭奠私语"></el-table-column>
          <el-table-column width="111" align="center" prop="oo_type" label="祭扫方式">
            <template slot-scope="scope">
              <span v-if="scope.row.oo_type == 10">鲜花</span>
              <span v-if="scope.row.oo_type == 20">点烛</span>
              <span v-if="scope.row.oo_type == 30">上香</span>
              <span v-if="scope.row.oo_type == 40">祭酒</span>
            </template>
          </el-table-column>
          <el-table-column :formatter="formatTime" align="center" prop="oo_createtime" label="留言时间"></el-table-column>
        </el-table>
      </div>
      <!-- 分页 -->
      <div class="footer">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="pageSize"
          layout="prev, pager, next, jumper"
          :total="listCount"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import HeadSearch from "@/components/HeadSearch.vue";
import { getOrderlist } from "../../api/onlineSacrifice";
import { format } from "../../utils/transform";
export default {
  data() {
    return {
      userlist: [],
      listCount: "",
      value: "",
      rtype: "", //祭扫方式,
      limit: 10,
      serchinput: "",
      currentPage: 1,
      pageSize: 10,
      options: [
        {
          value: 10,
          label: "留言人"
        },
        {
          value: 20,
          label: "祭奠私语"
        }
      ]
    };
  },
  methods: {
    async memberList(offset, limit) {
      const res = await getOrderlist({
        type: this.value,
        keyword: this.serchinput,
        offset,
        limit,
        rtype: this.trtype
      });
      console.log(res);
      if (res.error == 0) {
        (this.userlist = res.data.list), (this.listCount = res.data.total);
      } else {
        this.$message.error(res.msg);
      }
    },
    clickSerch(val) {
      this.serchinput = val;
      this.memberList(0, this.limit);
    },
    selectChange(val) {
      this.value = val;
    },
    formatTime(row) {
      return format(parseInt(row.oo_createtime));
    },
    handleCurrentChange(val) {
      this.memberList((val - 1) * this.pageSize, this.pageSize);
    }
  },
  mounted() {
    this.memberList(0, this.limit);
  },
  components: {
    HeadSearch
  }
};
</script>

<style scoped lang="less">
.memberSet {
  flex: 1;
  display: flex;
  padding: 15px;
  box-sizing: border-box;
}
.head {
  margin-bottom: 20px;
}
.box {
  flex: 1;
  background-color: #fff;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  padding: 15px;
  box-sizing: border-box;
}
.footer {
  text-align: center;
}
</style>
