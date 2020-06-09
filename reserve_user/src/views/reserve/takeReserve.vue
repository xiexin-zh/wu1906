<template>
  <div class="take_reserve">
    <header>
      <Head title="代为祭扫" />
    </header>
    <div class="take_reserve_main">
      <div class="mainBox">
        <div class="step">
          <Step size="3" :title="title" :active="active" />
        </div>
        <div class="content">
          <div v-if="active == 1" class="explain">
            <Explain :text="text" @changeStep="changeStep" />
          </div>
          <div v-if="active == 2" class="reserveForm">
            <TakeUser @changeStep="changeStep" />
          </div>
          <div v-if="active == 3" class="reserveForm">
            <TakeSuccess :acceptanceNo="acceptanceNo" />
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
import TakeUser from "./components/takeUser.vue";
import TakeSuccess from "./components/takeSuccess.vue";
export default {
  data() {
    return {
      title: ["预约须知", "填写信息", "预约成功"],
      active: 1,
      text: "",
      acceptanceNo:''
    };
  },
  methods: {
    changeStep(step,acceptanceNo) {
      this.active = step;
      this.acceptanceNo = acceptanceNo;
    }, 
    async getReserve(){
      const res = await ReserveAction.getReserveNotice({
      });
      if (res.error == 0) {
        this.text = res.data.c_agency_info;
        } else {
          Toast.fail(res.msg);
      }
    }
  },
  mounted() {
    this.getReserve()
  },
  components: {
    Head,
    Step,
    Explain,
    TakeUser,
    TakeSuccess
  }
};
</script>

<style lang="scss" scoped>
.take_reserve {
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
.take_reserve_main {
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