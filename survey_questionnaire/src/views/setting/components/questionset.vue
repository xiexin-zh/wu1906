<template>
  <div class="settings-question">
    <div class="topNav">
      <li
        v-for="(item) in tabConfings"
        :key="item.id"
        :class="nowTab === item.id ? 'active' : ''"
        @click="changeTab(item.tabName)"
      >
        <img :src="nowTab === item.id ? item.icon1 : item.icon" alt />
        <span>{{ item.title }}</span>
      </li>
    </div>
    <div class="setContent">
      <router-view></router-view>
    </div>
  </div>
</template>

<script lang="ts">
/* eslint-disable */
import { Component, Vue } from "vue-property-decorator";
import BaseSet from "./components/base.vue";
import PublisgSet from "./components/publish.vue";
import ShareSet from "./components/share.vue";
import * as NaireAction from "@/api/naire";

@Component({
  components: {
    BaseSet,
    PublisgSet,
    ShareSet
  }
})
export default class extends Vue {
  private tabConfings: any = [
    {
      title: "基本设置",
      id: 1,
      tabName: "base",
      icon: require("../../../../public/img/setting/set-base.png"),
      icon1: require("../../../../public/img/setting/set-base1.png")
    },
    {
      title: "发布设置",
      id: 2,
      tabName: "publish",
      icon: require("../../../../public/img/setting/set-publish.png"),
      icon1: require("../../../../public/img/setting/set-publish1.png")
    },
    {
      title: "分享设置",
      id: 3,
      tabName: "share",
      icon: require("../../../../public/img/setting/set-share.png"),
      icon1: require("../../../../public/img/setting/set-share1.png")
    }
  ];
  private nowTab: number = 1;
  private rowId: string = "1";

  changeTab(id: string) {
    if (id === "base") {
      this.nowTab = 1;
    }
    if (id === "publish") {
      this.nowTab = 2;
    }
    if (id === "share") {
      this.nowTab = 3;
    }
    this.$router.push({
      path: `/setting/${this.rowId}/questionset/${id}`
    });
  }

  mounted() {
    const params = this.$route.params;
    const { meta } = this.$route;
    const { rowId } = params;
    this.rowId = rowId;
    let tabId = 1;
    if (meta.navIndex === "base") {
      tabId = 1;
    }
    if (meta.navIndex === "publish") {
      tabId = 2;
    }
    if (meta.navIndex === "share") {
      tabId = 3;
    }
    this.nowTab = tabId;
  }
}
</script>

<style lang="scss" scoped>
.settings-question {
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.topNav {
  height: 72px;
  background-color: #fff;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 0 150px;

  li {
    width: 150px;
    height: 100%;
    list-style: none;
    font-size: 20px;
    display: flex;
    flex-direction: column;
    font-size: 14px;
    justify-content: center;
    align-items: center;
    color: #333;
    cursor: pointer;

    img{
      width: 30px;
      height: 30px;
    }
  }
}

.topNav li.active {
  color: #fff;
  background-color: #333;
}

.setContent {
  flex: 1;
  background-color: #F4F6FA;
  display: flex;
  justify-content: center;
  overflow-y: scroll;
  padding: 20px 20px;
  box-sizing: border-box;
  overflow: hidden;
}
</style>
