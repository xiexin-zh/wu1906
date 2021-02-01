<template>
  <view>
    <view class="home" v-if="userType === '1'">
      <scroll-view scroll-y="true" class="scroll-h">
				<duty-list isAdd isClose @delUser="delUser" @addUser="addUser" :data-list="recordList"></duty-list>
      </scroll-view>
    </view>
    <view v-if="userType === '0'">
      <check></check>
    </view>
  </view>
</template>
<script>
import { store, actions } from "./store/index.js";
import dutyList from '../component/dutyList.vue'
import eventBus from "@u/eventBus";
import check from "./check.vue";
export default {
  components: {
    check,
		dutyList
  },
	computed: {
		schoolYear: () => store.schoolYear
	},
  data() {
    return {
      recordList: [],
      classCode: "",
      gradeCode: "",
      schoolYearId: "",
      userType: "0", //1班主任，0教职工
    };
  },
  async created() {
		this.schoolYearId = store.schoolYear.schoolYearId;
    if (store.isBZR) {
      this.userType = "1";
      this.gradeCode = store.isBZR.gradeCode;
      this.classCode = store.isBZR.classCode;
    }
    uni.setStorageSync("classInfo", {
      gradeCode: this.gradeCode,
      classCode: this.classCode,
      schoolYearId: this.schoolYearId,
    });
  },
  async mounted() {
		eventBus.$on('show', () => {
			this.showList()
		})
    this.showList();
    console.log(store.userInfo.userCode)
  },
  methods: {
    async showList() {
      const req = {
        schoolCode: store.userInfo.schoolCode,
        classCode: this.classCode,
        schoolYearId: this.schoolYearId,
      };
      const res = await actions.getdutyList(req);
      this.recordList = res.data.listInfo;
    },
    addUser(key) {
      this.$tools.navTo({
        url: "./select?key=" + key,
        title: "选择值日生",
      });
    },
    delUser(id) {
      this.$tools.confirm("确定删除吗", () => {
        actions.delDuty(id).then((res) => {
          this.$tools.toast("删除成功");
					this.$tools.goNext(() => {
						this.showList();
					})
        });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.scroll-h {
  height: 100vh;
}
</style>
