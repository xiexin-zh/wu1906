<template>
  <div class="settings">
    <!-- <div class="settingHeader">
      <LayoutHeader />
    </div>-->
    <div class="setContain">
      <div class="setting-tab">
        <li class="activeNav toHome">
          <img
            :src="require('../../../public/icon/cancel.png')"
            alt="返回"
            title="返回列表"
            @click="routeToList"
          />
        </li>
        <li
          v-for="(item) in navConfigs"
          :key="item.id"
          :class="activeTab ===item.id ? 'activeNav' : ''"
          @click="changeTab(item.tabName)"
        >
          <img :src="item.icon" alt />
          <span>{{item.title}}</span>
        </li>
      </div>
      <div class="setting-content">
        <!-- <questionSet v-if="activeTab === 1" /> -->
        <!-- <addQuestion v-if="activeTab === 2" /> -->
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
/* eslint-disable */
import { Component, Vue } from "vue-property-decorator";
import LayoutHeader from "../../components/LayoutHeader.vue";
import QuestionSet from "./components/questionset.vue";
import AddQuestion from "./components/createQuestion.vue";

@Component({
  components: {
    LayoutHeader,
    QuestionSet,
    AddQuestion
  }
})
export default class extends Vue {
  private navConfigs: any = [
    {
      title: "问卷设置",
      id: 1,
      tabName: "questionset",
      icon: require("../../../public/img/setting/baseSet.png")
    },
    {
      title: "添加题目",
      id: 2,
      tabName: "questionadd",
      icon: require("../../../public/img/setting/addqs.png")
    }
  ];
  private activeTab: number = 1;
  private tabId: number = 1;
  private rowId: string = "1";

  routeToList() {
    this.$router.push("/list");
  }

  changeTab(tabName: string) {
    if (tabName === "questionset") {
      this.activeTab = 1;
      this.$router.push({
        path: `/setting/${this.rowId}/${tabName}/base`
      });
    } else {
      this.activeTab = 2;
      this.$router.push({
        path: `/setting/${this.rowId}/${tabName}`
      });
    }
  }
  changeTabId(id: number) {
    this.activeTab = id;
  }

  changeRowId(id: string) {
    this.rowId = id;
  }

  mounted() {
    const params = this.$route.params;
    const meta = this.$route.meta;
    const { navIndex } = meta;
    const { rowId, tabId } = params;
    this.rowId = rowId;
    let index = 1;
    if (navIndex === "questionset") {
      index = 1;
    }
    if (navIndex === "questionadd") {
      index = 2;
    }
    this.activeTab = index;
  }
}
</script>

<style lang="scss" scoped>
.settings {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.settingHeader {
  height: 60px;
}
.setContain {
  flex: 1;
  display: flex;
  height: 100%;
  overflow: hidden;
  padding-right: 5px;
}
.setting-tab {
  width: 100px;
  background-color: #464c5b;

  li {
    list-style: none;
    width: 100%;
    height: 130px;
    font-size: 24px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: #fff;
    cursor: pointer;
    font-size: 16px;

    img {
      width: 35px;
      height: 35px;
      margin-bottom: 10px;
    }
  }
}
.setting-tab .activeNav {
  background-color: #333;
}
.setting-tab .toHome {
  background-color: #464c5b;
  height: 72px;
}
.setting-content {
  flex: 1;
  display: flex;
  box-sizing: border-box;
  background-color: #f8f6f6;
}
</style>
