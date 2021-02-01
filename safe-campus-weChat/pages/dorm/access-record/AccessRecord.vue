<template>
  <div>
    <component :is="currentCom"></component>
  </div>
</template>

<script>
import { store, actions } from '../store/index.js';
import AccessRecordP from "./AccessRecordP";
import AccessRecordT from "./AccessRecordT";
export default {
  name: "AccesRecord",
  data() {
    return {
      currentCom: "",
    };
  },
  created() {
    if (store.userInfo.typeCode === "16") {
      this.currentCom = AccessRecordP;
    } else if (store.userInfo.typeCode === "4") {
      this.currentCom = AccessRecordT;
    } else {
      this.currentCom = AccessRecordT;
    }
  },
};
</script>
