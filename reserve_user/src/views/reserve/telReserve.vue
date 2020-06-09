<template>
  <div class="tel_reserve">
    <header>
      <Head title="电话预约" />
    </header>
    <div class="tel_reserve_main">
      <div class="step">
        <Step size="2" :title="title" :active="active" />
      </div>
      <div class="content">
        <div v-if="active == 1" class="explain">
          <Explain :text="text" @changeStep="changeStep" />
        </div>
        <div v-if="active == 2" class="reserveForm">
          <TelList />
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
import TelList from "./components/telList.vue";
export default {
  data() {
    return {
      title: ["预约须知", "预约电话"],
      active: 1,
      text:''
        // "电话预约电话预约电话预约电话预约电话预约电话预约电话预约电话预约电话预约电话预约电话预约电话预约"
    };
  },
  methods: {
    changeStep(step) {
      this.active = step;
    },
    async getReserve(){
      const res = await ReserveAction.getReserveNotice({
      });
      if (res.error == 0) {
        this.text = res.data.c_tel_info;
        } else {
          Toast.fail(res.msg);
      }
    }
  },
  mounted(){
    this.getReserve();
  },
  components: {
    Head,
    Step,
    Explain,
    TelList
  }
};
</script>

<style lang="scss" scoped>
.tel_reserve {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: #eff0f2;
}
header {
  height: 0.86rem;
}
.tel_reserve_main {
  flex: 1;

  .step {
    height: 1.5rem;
    display: flex;
    justify-content: center;
    align-items: center;
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