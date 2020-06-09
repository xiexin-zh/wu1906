<template>
  <div class="noticeSet">
    <div class="setBox">
      <div class="noticeTime">
        <span>设置阅读须知时间</span>
        <el-input class="inputTime" v-model="onlineNum"></el-input>
        <span>s</span>
      </div>
      <div class="noticeTxt">
        <WangEnduit v-if="onlineString" :valueString="onlineString" :catchData="getValue" />
      </div>
      <div @click="saveNotice" class="noticeSave">
        <span>保存</span>
      </div>
    </div>
  </div>
</template>

<script>
import { getNotices, editNotices } from "../../api/reserve.js";
import WangEnduit from "@/components/WangEnduit.vue";

export default {
  data() {
    return {
      onlineNum: 8,
      // inputTxt: "",
      onlineString: "",
      id: ""
    };
  },
  components: {
    WangEnduit
  },
  methods: {
    async getNoticestext() {
      const res = await getNotices();
      if (res.error == 0) {
        const { c_id, c_agency_info, c_agency_num } = res.data;
        this.onlineString = c_agency_info;
        this.id = c_id;
        this.onlineNum = c_agency_num;

      } else {
        this.$message.error(res.msg);
      }
    },
    saveNotice() {
      editNotices({
        noticeId: this.id,
        type: 20,
        num: this.onlineNum,
        info: this.onlineString
      }).then(res => {
        if (res && res.error == 0) {
          this.$message({
            message: res.msg,
            type: "success"
          });
        } else {
          this.$message(res.msg);
        }
      });
    },
    getValue(val) {
      this.onlineString = val;
      // console.log(val)
    }
  },
  mounted() {
    this.getNoticestext();
   
  }
};
</script>

<style lang="scss" scoped>
.noticeSet {
  flex: 1;
  display: flex;
  padding: 15px;
  box-sizing: border-box;
}
.setBox {
  flex: 1;
  background-color: #fff;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  padding: 15px;
  box-sizing: border-box;
}
.noticeTime {
  height: 50px;
  display: flex;
  justify-content: flex-start;
  align-items: center;

  span {
    margin-right: 10px;
    font-size: 14px;
    color: #4a4a4a;
  }

  .inputTime {
    width: 50px;
    margin-right: 10px;
  }
}
.noticeTxt {
  flex: 1;

  .textArea {
    height: 500px;
  }
}
.noticeSave {
  height: 100px;
  display: flex;
  justify-content: flex-end;
  align-content: center;

  span {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 108px;
    height: 40px;
    border-radius: 4px;
    color: #fff;
    font-size: 14px;
    background-color: #445c73;
  }
}
</style>