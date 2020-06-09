<template>
  <el-dialog title="查看信息"  v-if="userItem" :visible.sync="dialogVisible2" width="679px">
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
          <span class="textLayout">预约公墓</span>
        </el-col>
        <el-col :span="20">
          <div class="inputLayout">{{userItem.organ_name}}</div>
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
          <span class="textLayout">同行人数</span>
        </el-col>
        <el-col :span="20">
          <div class="inputLayout">{{userItem.ro_peoplenum}}</div>
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
            <span class="textLayout">同行人员信息:</span>
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
      <el-button type="primary" @click="closeView">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
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
    return {};
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
  props: ["userItem", "dialogVisible2","closeView"],
  components: {}
};
</script>

<style scoped lang="less">
.userinfo {
  .inputLayout,
  .textLayout {
    height: 40px;
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
