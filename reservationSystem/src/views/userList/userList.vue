<template>
  <div class="userlist">
    <div class="main">
      <div class="head">
        <span class="left">总注册人数:{{listCount}}</span>
        <div class="right">
          <el-select @change="selectChange" v-model="value" placeholder="搜索类别">
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
      <div class="content">
        <el-table :data="userlist" border style="width: 100%">
          <el-table-column align="center" prop="id" label="编号" width="139"></el-table-column>
          <el-table-column align="center" prop="realname" label="姓名" width="389"></el-table-column>
          <el-table-column align="center" prop="mobile" label="手机号" width="389"></el-table-column>
          <el-table-column align="center" prop="idcardno" label="身份证号"></el-table-column>
        </el-table>
        <!-- 分页 -->
      </div>
      <div class="footer">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="pageSize"
          layout="prev, pager, next, jumper"
          :total="listCount"
           :hide-on-single-page="true"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { getmemberList } from "../../api/reserve";
export default {
  data() {
    return {
      value: "",
      serchinput: "", //搜索的值
      type: 0, //选项类型 默认0（10=姓名，20=身份证，30=电话）
      pageSize: 10, //一次返回多少调数据
      userlist: [], //返回的用户数据
      listCount: 0, //返回的总条数
      currentPage: 1, //当前页，
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
  mounted() {
    this.memberList(0, this.pageSize);
  },
  methods: {
    async memberList(offset, limit) {
      const res = await getmemberList({
        type: this.value,
        keyword: this.serchinput,
        offset,
        limit
      });
      console.log(res);
      if (res.error == 0) {
        (this.userlist = res.data.list), (this.listCount = res.data.total);
      } else {
        this.$message.error(res.msg);
      }
    },
    handleSizeChange(val) {
      this.memberList((val - 1) * this.pageSize, this.pageSize);
    },
    handleCurrentChange(val) {
      console.log(val);
    },
    // 选项框改变时的回调
    selectChange(val) {
      this.value = val;
      // this.memberList(this.currentPage, this.pageSize);
    },
    clickSerchBtn() {
      this.memberList(0, this.pageSize);
    }
    // changeSize(page) {
    //   this.currentPage = page;
    //   this.getRlist((page - 1) * this.pageSize, this.pageSize);
    // }
  }
};
</script>

<style scoped lang="less">
.userlist {
  flex: 1;
  display: flex;
  padding: 15px;
  box-sizing: border-box;
}
.main {
  flex: 1;
  background-color: #fff;
  border-radius: 5px;
  padding: 15px;
  box-sizing: border-box;
  .head {
    display: flex;
    justify-content: space-between;
    .right {
      display: flex;
    }
  }
}
.btn {
  width: 71px;
  height: 32px;
  background: rgba(68, 92, 115, 1);
  border-radius: 4px;
  color: white;
}
.pagination {
  padding-bottom: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.footer {
  padding-bottom: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
