<template>
  <div>
    <time-type-select @change="timeTypeChange"></time-type-select>
    <customer-dash :data="dashData"></customer-dash>
    <duplicate-check
      v-if="showDuplicateCheck"
      @hiden-view="showDuplicateCheck = false"
    ></duplicate-check>
  </div>
</template>

<script>
import timeTypeSelect from "@/components/timeTypeSelect";
import CustomerDash from "./components/NewCustomerDash";
import DuplicateCheck from "./components/duplicateCheck";
import membersDep from "@/components/selectEmployee/membersDep";
import { mapGetters } from "vuex";
import { usersList } from "@/api/common";

export default {
  /** 客户管理下的工作台 */
  name: "customerWorkbench",
  components: {
    CustomerDash,
    DuplicateCheck,
    membersDep, // 员工部门
    timeTypeSelect
  },
  filters: {},
  data() {
    return {
      /** 用户部门数组 */
      users: [],
      strucs: [],
      // 条件
      dashData: { users: [], strucs: [], timeTypeValue: {} },
      filtersInfo: { realname: "", thumb_img: "" },
      // 时间值
      timeTypeValue: { label: "本季度", value: "quarter" },
      // 展示查重
      showDuplicateCheck: false
    };
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  mounted() {
    this.users.push(this.userInfo);
    this.dashData = {
      users: [],
      strucs: [],
      timeTypeValue: this.timeTypeValue
    };
    this.filtersInfo = {
      realname: "本人及下屬",
      thumb_img: require("@/assets/img/crm_multiuser.png")
    };
    this.getUserList();
  },
  methods: {
    getUserList() {
      usersList({ by: "sub" })
        .then(res => {
          this.users = res.data;
        })
        .catch(() => {});
    },

    // 类型选择
    timeTypeChange(data) {
      this.timeTypeValue = data;
      this.dashData = {
        users: this.users,
        strucs: this.strucs,
        timeTypeValue: this.timeTypeValue
      };
    },
    // 更改筛选条件
    popoverSubmit(users, strucs) {
      this.users = users;
      this.strucs = strucs;
      if (this.users.length === 1 && this.strucs.length === 0) {
        this.dashData = {
          users: this.users,
          strucs: this.strucs,
          timeTypeValue: this.timeTypeValue
        };
        this.filtersInfo = {
          realname: this.users[0].realname,
          thumb_img: this.users[0].thumb_img
        };
      } else if (this.users.length === 0 && this.strucs.length === 0) {
        this.users = [this.userInfo];
        this.dashData = {
          users: this.users,
          strucs: this.strucs,
          timeTypeValue: this.timeTypeValue
        };
        this.filtersInfo = {
          realname: this.userInfo.realname,
          thumb_img: this.userInfo.thumb_img
        };
      } else {
        this.dashData = {
          users: this.users,
          strucs: this.strucs,
          timeTypeValue: this.timeTypeValue
        };
        var name = "";
        if (this.users.length > 0) {
          name = this.users.length + "個員工";
        }
        if (this.strucs.length > 0) {
          if (this.users.length > 0) {
            name = name + ",";
          }
          name = name + this.strucs.length + "個部門";
        }
        this.filtersInfo = {
          realname: name,
          thumb_img: require("@/assets/img/crm_multiuser.png")
        };
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.user-container {
  margin-bottom: 20px;
  position: relative;
  .user-img {
    display: block !important;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 16px;
    margin-left: 0px;
  }
  .user-info {
    .user-name {
      font-size: 16px;
      color: #333333;
    }
    .user-line {
      width: 1px;
      height: 12px;
      background-color: #aaa;
      margin: 0 14px;
    }
    .user-switch {
      color: #005df7;
      font-size: 12px;
      margin-right: 15px;
    }
  }
  .user-more {
    margin-top: 5px;
    font-size: 12px;
    color: #999999;
  }

  .check {
    position: absolute;
    top: 3px;
    right: 0;
    color: white;
    font-size: 13px;
    border-radius: 3px;
    background: #005df7;

    /deep/ .wukong-check {
      margin-right: 4px;
      font-size: 17px;
    }
  }
}
</style>
