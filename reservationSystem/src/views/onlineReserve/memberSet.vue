<template>
  <div class="memberMsg">
    <div class="memberList">
      <div class="memberSearch">
        <div class="select">
          <el-select @change="selectChange" v-model="type" placeholder="请选择">
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
      </div>
      <div class="members">
        <div class="userList">
          <el-table :data="list" border>
            <el-table-column align="center" type="index" label="编号" />
            <el-table-column align="center" prop="realname" label="姓名" />
            <el-table-column align="center" prop="mobile" label="手机号" />
            <el-table-column align="center" prop="idcardno" label="证件号码" />
            <el-table-column align="center" prop="ro_peoplenum" label="同行人数" />
            <!-- <el-table-column align="center" prop="ro_tripmode" label="出行方式" /> -->
            <el-table-column align="center" prop="ro_tripmode" label="出行方式">
              <template slot-scope="scope">
                <span v-if="scope.row.ro_tripmode == 10">公共交通</span>
                <span v-if="scope.row.ro_tripmode == 20">自驾</span>
                <span v-if="scope.row.ro_tripmode == 30">其他</span>
              </template>
            </el-table-column>
            <el-table-column :formatter="formatTime" align="center" prop="ro_time" label="祭扫日期" />
            <el-table-column align="center" prop="ro_timeframe" label="祭扫时段" />
            <el-table-column align="center" prop="organ_name" label="预约机构" />
            <el-table-column align="center" prop="ro_state" label="状态">
              <template slot-scope="scope">
                <span v-if="scope.row.ro_state == 0" style="color:black;">已预约</span>
                <span v-if="scope.row.ro_state == 1" style="color:red;">已取消</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="操作" width="90">
              <template v-slot="{ row }">
                <el-button class="commonBtn" title="查看" type="primary" @click="handleEdit(row)">查看</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页 -->
          <div class="pagination">
            <el-pagination
              layout="prev, pager, next, jumper"
              :total="listCount"
              :hide-on-single-page="true"
              :page-size="pageSize"
              :current-page.sync="currentPage"
              @current-change="changeSize"
            />
          </div>
        </div>
      </div>
      <el-dialog title="查看信息" v-if="userItem" :visible.sync="dialogVisible" width="679px">
        <div class="userinfo">
          <el-row :gutter="20">
            <el-col :span="4">
              <span class="textLayout">姓名</span>
            </el-col>
            <el-col :span="20">
              <div class="inputLayout">{{userItem.realname}}</div>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="4">
              <span class="textLayout">手机号</span>
            </el-col>
            <el-col :span="20">
              <div class="inputLayout">{{userItem.mobile}}</div>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="4">
              <span class="textLayout">证件类型</span>
            </el-col>
            <el-col :span="20">
              <div class="inputLayout">{{userItem.card_type|cardtype}}</div>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="4">
              <span class="textLayout">证件号码</span>
            </el-col>
            <el-col :span="20">
              <div class="inputLayout">{{userItem.idcardno}}</div>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="4">
              <span class="textLayout">同行人数</span>
            </el-col>
            <el-col :span="20">
              <div class="inputLayout">{{userItem.ro_peoplenum}}</div>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="4">
              <span class="textLayout">出行方式</span>
            </el-col>
            <el-col :span="20">
              <div class="inputLayout">{{userItem.ro_tripmode | tripmode}}</div>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="4">
              <span class="textLayout">祭扫日期</span>
            </el-col>
            <el-col :span="20">
              <div class="inputLayout">2020-04-07</div>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="4">
              <span class="textLayout">祭扫时段</span>
            </el-col>
            <el-col :span="9">
              <div class="inputLayout">
                <i class="el-icon-time"></i>
                {{userItem.ro_timeframe}}
              </div>
            </el-col>
            <el-col :span="2">
              <div style="text-align:center;line-height:42px">至</div>
            </el-col>
            <el-col :span="9">
              <div class="inputLayout">
                <i class="el-icon-time"></i>
                {{userItem.ro_timeframe}}
              </div>
            </el-col>
          </el-row>

          <el-row :gutter="10">
            <el-col :span="6">
              <span class="textLayout">是否为居家隔离人员</span>
            </el-col>
            <el-col :span="18">
              <div class="inputLayout">{{userItem.is_isolation|isolation}}</div>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="4">
              <span class="textLayout">预约机构</span>
            </el-col>
            <el-col :span="20">
              <div class="inputLayout">{{userItem.organ_name}}</div>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="4">
              <span class="textLayout">受理编号</span>
            </el-col>
            <el-col :span="20">
              <div class="inputLayout">{{userItem.ro_no}}</div>
            </el-col>
          </el-row>

          <template v-if="userItem.ro_peoplenum>=2">
            <el-row>
              <el-col :span="24">
                <span class="textLayout">同行1:</span>
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <el-col :span="4">
                <span class="textLayout">姓名</span>
              </el-col>
              <el-col :span="20">
                <div class="inputLayout">{{userItem.ro_name1}}</div>
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <el-col :span="4">
                <span class="textLayout">证件类型</span>
              </el-col>
              <el-col :span="20">
                <div class="inputLayout">{{userItem.card_type1 | cardtype}}</div>
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <el-col :span="4">
                <span class="textLayout">证件号码</span>
              </el-col>
              <el-col :span="20">
                <div class="inputLayout">{{userItem.ro_idno1}}</div>
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <el-col :span="4">
                <span class="textLayout">出行方式</span>
              </el-col>
              <el-col :span="20">
                <div class="inputLayout">{{userItem.ro_tripmode1|tripmode}}</div>
              </el-col>
            </el-row>

            <el-row :gutter="10">
              <el-col :span="6">
                <span class="textLayout">是否为居家隔离人员</span>
              </el-col>
              <el-col :span="18">
                <div class="inputLayout">{{userItem.is_isolation1|isolation}}</div>
              </el-col>
            </el-row>

            <template v-if="userItem.ro_peoplenum==3">
              <el-row>
                <el-col :span="24">
                  <span class="textLayout">同行2:</span>
                </el-col>
              </el-row>

              <el-row :gutter="20">
                <el-col :span="4">
                  <span class="textLayout">姓名</span>
                </el-col>
                <el-col :span="20">
                  <div class="inputLayout">{{userItem.ro_name2}}</div>
                </el-col>
              </el-row>

              <el-row :gutter="20">
                <el-col :span="4">
                  <span class="textLayout">证件类型</span>
                </el-col>
                <el-col :span="20">
                  <div class="inputLayout">{{userItem.card_type2|cardtype}}</div>
                </el-col>
              </el-row>

              <el-row :gutter="20">
                <el-col :span="4">
                  <span class="textLayout">证件号码</span>
                </el-col>
                <el-col :span="20">
                  <div class="inputLayout">{{userItem.ro_idno2}}</div>
                </el-col>
              </el-row>

              <el-row :gutter="20">
                <el-col :span="4">
                  <span class="textLayout">出行方式</span>
                </el-col>
                <el-col :span="20">
                  <div class="inputLayout">{{userItem.ro_tripmode2|tripmode}}</div>
                </el-col>
              </el-row>

              <el-row :gutter="10">
                <el-col :span="6">
                  <span class="textLayout">是否为居家隔离人员</span>
                </el-col>
                <el-col :span="18">
                  <div class="inputLayout">{{userItem.is_isolation1|isolation}}</div>
                </el-col>
              </el-row>
            </template>
          </template>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import * as ReserveAction from "../../api/reserve";
import { format } from "../../utils/transform";
const options1 = [
  {
    value: "10",
    label: "公共交通"
  },
  {
    value: "20",
    label: "自驾"
  },
  {
    value: "30",
    label: "其他"
  }
];
const options2 = [
  {
    value: "10",
    label: "内地居民身份证"
  },
  {
    value: "20",
    label: "香港居民身份证"
  },
  {
    value: "30",
    label: "澳门居民身份证"
  },
  {
    value: "40",
    label: "台湾居民身份证"
  },
  {
    value: "50",
    label: "护照"
  },
  {
    value: "60",
    label: "军官证"
  },
  {
    value: "70",
    label: "士兵证"
  },
  {
    value: "80",
    label: "护照"
  }
];
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
      listCount: 0,
      pageSize: 10,
      currentPage: 1,
      type: "",
      dialogVisible: false,
      userItem: ""
    };
  },
  filters: {
    tripmode: function(value) {
      if (!value) return "";
      const result = options1.filter(item => {
        return item.value == value;
      });
      return result[0].label;
    },
    cardtype: function(value) {
      if (!value) return "";
      const result = options2.filter(item => {
        return item.value == value;
      });
      return result[0].label;
    },
    isolation: function(value) {
      if (!value) return "";
      return value == 0 ? "否" : "是";
    }
  },
  methods: {
    searchUser() {
      this.getRlist(0, this.pageSize);
    },
    formatTime(row) {
      return format(parseInt(row.ro_time));
    },
    handleEdit(data) {
      this.dialogVisible = true;
      this.userItem = data;
    },
    changeSize(page) {
      this.currentPage = page;
      this.getRlist((page - 1) * this.pageSize, this.pageSize);
    },
    selectChange(val) {
      console.log(val);
      this.type = val;
    },
    async getRlist(offset, limit) {
      const res = await ReserveAction.getRlist({
        type: this.type,
        keyword: this.inputValue,
        offset,
        limit
      });
      console.log(res);
      if (res.error == 0) {
        (this.list = res.data.list), (this.listCount = res.data.total);
      } else {
        this.$message.error(res.msg);
      }
    }
  },
  mounted() {
    this.getRlist(0, this.pageSize);
  }
};
</script>

<style lang="scss" scoped>
.memberMsg {
  flex: 1;
  display: flex;
  padding: 15px;
  box-sizing: border-box;
}
.memberList {
  flex: 1;
  background-color: #fff;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  padding: 15px;
  box-sizing: border-box;
}
.memberSearch {
  height: 100px;
}
.members {
  flex: 1;
}

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
</style>