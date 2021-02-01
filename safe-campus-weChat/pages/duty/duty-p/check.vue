<template>
  <view>
    <choose-child @change="childInfo"></choose-child>
    <scroll-view scroll-y="true" class="scroll-h">
			<duty-list :data-list="recordList"></duty-list>
    </scroll-view>
  </view>
</template>
<script>
import dutyList from '../component/dutyList.vue'
import chooseChild from "@/components/choose-child/choose-child.vue";
import { store, actions } from "./store/index.js";
export default {
  components: {
    chooseChild,
		dutyList
  },
  data() {
    return {
			userCode: '',
      recordList: [],
      classCode: "",
      schoolYearId: "",
    }
  },
  async created() {
        console.log(store.childList)

    this.schoolYearId = store.schoolYear.schoolYearId;
    this.classCode = store.childList[0].classCode;
		this.userCode = store.childList[0].userCode
  },
  mounted() {
    this.showMotto();
  },
  methods: {
    childInfo(item) {
			this.classCode = item.classCode
			this.userCode = item.userCode
			this.showMotto()
    },
    async showMotto(tag = false) {
      const req = {
        schoolCode: store.userInfo.schoolCode,
        classCode: this.classCode,
        schoolYearId: this.schoolYearId,
        userCode: this.userCode,
      };
      const res = await actions.getParenttdutyList(req);
      this.recordList = res.data
    },
  },
};
</script>

<style lang="scss" scoped>
.scroll-h {
  height: calc(100vh);
}
</style>
