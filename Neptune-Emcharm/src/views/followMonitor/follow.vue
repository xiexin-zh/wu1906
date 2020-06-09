<template>
  <div class="follow">
    <div class="follow-title">
      <span>流量監控</span>
    </div>
    <div class="follow-main">
      <div class="content">
        <Products @getData="getData" />
        <div class="tendency follow-top">
          <FollowTop :followTopData="followTopData" />
        </div>
        <div class="tendency follow-allFollow">
          <AllFollow
            :proName="showName"
            :proPlat="proPlat"
            :avg_all_total="avg_all_total"
            :per_data="per_data"
          />
        </div>
        <div class="tendency follow-upFollow">
          <UpFollow
            :proName="showName"
            :proPlat="proPlat"
            :avg_all_upload="avg_all_upload"
            :per_data="per_data"
          />
        </div>
        <div class="tendency follow-downFollow">
          <DownFollow
            :proName="showName"
            :proPlat="proPlat"
            :avg_all_download="avg_all_download"
            :per_data="per_data"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AllFollow from "./components/AllFollow.vue";
import UpFollow from "./components/UpFollow.vue";
import DownFollow from "./components/DownFollow.vue";
import Products from "../../components/Products.vue";
import FollowTop from "./components/FollowTop.vue";
import { compare } from "../../utils/transform";
import * as DataAction from "../../api/dataAction";

export default {
  data() {
    return {
      proName: "",
      proPlat: "",
      showName: "",
      avg_all_download: 0,
      avg_all_total: 0,
      avg_all_upload: 0,
      per_data: [],
      followTopData: []
    };
  },
  methods: {
    // 獲取產品名稱/平台
    getData(showName, name, proPlat) {
      console.log(showName, name, proPlat);
      this.showName = showName;
      this.proName = name;
      this.proPlat = proPlat;
      this.getFollowTop();
      this.getFollowData();
    },
    async getFollowTop() {
      const res = await DataAction.getFollowTop({
        pkg_iclude: this.proName,
        platform: this.proPlat
      });
      if (res.code == 200 && res.data.data.length > 0) {
        this.followTopData = res.data.data.sort(compare("api_flow_download"));
      }
    },
    async getFollowData() {
      const res = await DataAction.getFollow({
        pkg_iclude: this.proName,
        platform: this.proPlat
      });
      if (res.code == 200) {
        this.avg_all_download = res.data.avg_all_download;
        this.avg_all_total = res.data.avg_all_total;
        this.avg_all_upload = res.data.avg_all_upload;
        this.per_data = res.data.per_data;
      } else {
        this.$message.error("暫無數據");
      }
    }
  },
  mounted() {
    // this.getFollowData();
  },
  components: {
    AllFollow,
    UpFollow,
    DownFollow,
    Products,
    FollowTop
  }
};
</script>

<style lang="scss" scoped>
.follow {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.follow-title {
  height: 70px;
  border-bottom: 1px solid #ccc;
  box-sizing: border-box;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-size: 20px;
  font-weight: 500;
  padding-left: 20px;
  box-sizing: border-box;
  letter-spacing: 2px;
}
.follow-main {
  flex: 1;
  overflow-y: auto;

  .content {
    margin-top: 20px;
    padding: 0 40px 20px 40px;
    box-sizing: border-box;

    .tendency {
      margin-top: 40px;
      height: 350px;
      border: 1px solid #ccc;
      box-sizing: border-box;
      padding: 20px 0px 10px;
    }
    .follow-top {
      height: 500px;
    }
  }
}
</style>