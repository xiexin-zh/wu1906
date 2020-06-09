<template>
  <div class="memberSet">
    <div class="box">
      <div class="header">
        <div class="content">
          <el-select  v-model="value" placeholder="搜索类别">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-input v-model="serchinput" placeholder="请输入内容"></el-input>
          <el-button @click="clickSerchBtn" class="btn">搜索</el-button>
        </div>
      </div>
      <div class="userlist">
        <el-table :data="userlist" border style="width: 100%">
          <el-table-column align="center" type="index" label="编号"></el-table-column>
          <el-table-column align="center" prop="realname" label="预约人姓名"></el-table-column>
          <el-table-column align="center" prop="mobile" label="手机号"></el-table-column>
          <el-table-column align="center" prop="idcardno" label="证件号码"></el-table-column>
          <el-table-column align="center" prop="organ_name" label="预约机构"></el-table-column>
          <el-table-column :formatter="formatTime" align="center" prop="ao_time" label="预约时间"></el-table-column>
          <el-table-column align="center" prop="die_name" label="逝者名称"></el-table-column>
          <el-table-column align="center" prop="ao_graveinfo" label="逝者墓穴信息"></el-table-column>
          <el-table-column prop="ao_state" align="center" label="状态">
            <template slot-scope="scope">
              <span v-if="scope.row.ao_state == 0" style="color:black;">已预约</span>
              <span v-if="scope.row.ao_state == 1" style="color:red;">已取消</span>
            </template>
          </el-table-column>
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
import { getalist } from "../../api/sacrifice";
import { format } from "../../utils/transform";
export default {
  data() {
    return {
      userlist: [],
      pageSize: 10,
      value: '',
      listCount: 0,
      currentPage: 1,
      serchinput: "",
      options: [
        {
          value: 10,
          label: "姓名"
        },
        {
          value: 20,
          label: "身份证号"
        },
        {
          value: 30,
          label: "手机号"
        }
      ]
    };
  },
  components: {},
  methods: {
    async getAlistList(offset, limit) {
      const res = await getalist({
        type: this.value,
        keyword: this.serchinput,
        offset,
        limit
      });
      if (res.error == 0) {
        (this.userlist = res.data.list), (this.listCount = res.data.total);
      } else {
        this.$message.error(res.msg);
      }
    },
    formatTime(row) {
      // console.log(row.ao_time)
      return format(parseInt(row.ao_time));
    },
    // handleSizeChange(val) {
    //   this.getAlistList((val - 1) * this.pageSize, this.pageSize);
    // },
    handleCurrentChange(val) {
      this.getAlistList((val - 1) * this.pageSize, this.pageSize);
    },
    // selectChange(val) {
    //   // this.type = val;
    // },
    clickSerchBtn() {
     this.getAlistList(0, this.pageSize);
    }
  },
  mounted() {
    this.getAlistList(0, this.pageSize);
  }
};
</script>

<style scoped lang="less">
.memberSet {
  flex: 1;
  display: flex;
  padding: 15px;
  box-sizing: border-box;
  position: relative;
}
.header {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 17px;
  .content {
    display: flex;
  }
  .btn {
    width: 71px;
    height: 32px;
    background: rgba(68, 92, 115, 1);
    border-radius: 4px;
    color: white;
  }
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
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 50px;
}
</style>
