<template>
  <div class="follow-products">
    <div class="proBox pro-name">
      <p class="proTitle">產品名稱</p>
      <div class="selectName">
        <el-radio-group class="nameRadio" v-model="proName" @change="changeName">
          <el-radio
            class="radioItem"
            v-for="(item,index) in proList"
            :key="index"
            :label="item.pkg_include"
          >{{item.proName}}</el-radio>
        </el-radio-group>
      </div>
    </div>
    <div class="proBox pro-platform">
      <p class="proTitle">平台</p>
      <div class="selectName">
        <el-radio-group class="nameRadio" v-model="proPlat" @change="changePlat">
          <el-radio
            class="radioItem"
            v-for="(item,index) in plats "
            :key="index"
            :label="item"
          >{{item}}</el-radio>
        </el-radio-group>
      </div>
    </div>
  </div>
</template>

<script>
import * as DataAction from "../api/dataAction";
export default {
  data() {
    return {
      proName: "",
      proPlat: "",
      showName: "",
      proList: [],
      plats: []
    };
  },
  methods: {
    changeName(name) {
      this.changePro();
      const showName = this.proList.filter(item => {
        return item.pkg_include == name;
      })[0].proName;
      this.showName = showName;
      this.$emit("getData", this.showName, this.proName, this.proPlat);
    },
    changePlat(plat) {
      this.$emit("getData", this.showName, this.proName, this.proPlat);
    },
    async getPlatForm() {
      const navTitle = this.$route.meta.navTitle;
      let apiAction = DataAction.getPlatForm;
      switch (navTitle) {
        case "function":
          apiAction = DataAction.getPlatForm;
          break;
        case "api":
          apiAction = DataAction.getPlatFormForApi;
          break;
        default:
          apiAction = DataAction.getPlatForm;
      }
      const res = await apiAction();
      if (res.code == "200") {
        this.proList = res.data.products;
        this.proName = res.data.default.pkg_include;
        this.proPlat = res.data.default.platName;
        this.showName = res.data.default.proName;
        this.plats = res.data.products.filter(item => {
          return item.pkg_include == res.data.default.pkg_include;
        })[0].plat;
        this.$emit("getData", this.showName, this.proName, this.proPlat);
      } else {
        this.$message.error("產品數據獲取失敗");
      }
    },
    changePro() {
      this.plats = this.proList.filter(item => {
        return item.pkg_include == this.proName;
      })[0].plat;
    }
  },
  mounted() {
    this.getPlatForm();
  }
};
</script>

<style lang="scss" scoped>
.follow-products {
  display: flex;
  justify-content: flex-start;

  .proBox {
    width: 350px;
    min-height: 150px;
    border: 1px solid #ccc;
    box-sizing: border-box;
    box-shadow: 1px 1px 5px #888888;
    position: relative;
  }

  .proTitle {
    background-color: #fff;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 0 2px;
    box-sizing: border-box;
    height: 30px;
    position: absolute;
    top: -15px;
    left: 20px;
  }

  .selectName {
    height: 100%;
    width: 100%;
    padding: 20px;
    box-sizing: border-box;
    font-size: 18px;

    .nameRadio {
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;

      .radioItem {
        height: 50px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
      }
    }
  }

  .pro-name {
    margin-right: 20px;
  }
  .pro-platform {
  }
}
</style>