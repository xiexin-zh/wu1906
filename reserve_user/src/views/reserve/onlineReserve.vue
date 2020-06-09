<template>
  <div class="online_reserve">
    <header>
      <Head title="网上预约申请" />
    </header>
    <div class="online_reserve_main">
      <div class="mainBox">
        <div class="step">
          <Step size="3" :title="title" :active="active" />
        </div>
        <div class="content">
          <div v-if="active == 1" class="explain">
            <Explain :text="text" @changeStep="changeStep" />
          </div>
          <div v-if="active == 2" class="reserveForm">
            <add-user @changeStep="changeStep" />
          </div>
          <div v-if="active == 3" class="reserveForm">
            <ReserveSuccess :acceptanceNo="acceptanceNo" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as ReserveAction from "../../api/reserve";
import Head from "../../components/Head.vue";
import Step from "../../components/Step.vue";
import Explain from "./components/explain.vue";
import AddUser from "./components/addUser.vue";
import ReserveSuccess from "./components/reserveSuccess.vue";
import * as AdminAction from "../../api/admin";
export default {
  data() {
    return {
      title: ["预约须知", "填写信息", "预约成功"],
      active: 1,
      text: "",
      acceptanceNo: ""
    };
  },
  methods: {
    changeStep(step, acceptanceNo) {
      this.active = step;
      if (acceptanceNo) {
        this.acceptanceNo = acceptanceNo;
      }
    },
    async getReserve(){
      const res = await ReserveAction.getReserveNotice({
      });
      if (res.error == 0) {
        this.text = res.data.c_reserve_info;
        } else {
          Toast.fail(res.msg);
      }
    }
  },
  mounted() {
    this.getReserve();
    // const { c_reserve_info } = this.$store.state.notice;
    // console.log(this.$store.state.notice);
    // this.text = c_reserve_info || "";
  },
  components: {
    Head,
    Step,
    Explain,
    AddUser,
    ReserveSuccess
  }
};
</script>

<style lang="scss" scoped>
.online_reserve {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  background-color: #eff0f2;
}
header {
  height: 0.86rem;
}
.online_reserve_main {
  flex: 1;
  overflow-y: scroll;

  .step {
    height: 1.5rem;
    display: flex;
    justify-content: center;
    align-items: center;
    padding-top: 0.2rem;
  }
}
.content {
  .explain {
    flex: 1;
    padding: 0.3rem;
    box-sizing: border-box;
    min-height: 5rem;
  }
  .reserveForm {
    flex: 1;
    padding: 0.3rem;
    box-sizing: border-box;
    min-height: 5rem;
  }
}
</style>