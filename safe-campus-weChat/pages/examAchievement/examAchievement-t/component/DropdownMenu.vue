<template>
	<view class="dropDown u-fx u-bg-fff">
		<ms-dropdown-menu v-if="showClass"><ms-dropdown-item v-model="value0" :list="classList" :title="defTitle"></ms-dropdown-item></ms-dropdown-menu>
		<ms-dropdown-menu v-if="showSub"><ms-dropdown-item v-model="value1" :list="subList" :title="defSubTitle"></ms-dropdown-item></ms-dropdown-menu>
	</view>
</template>

<script>
import msDropdownMenu from "@/components/ms-dropdown/dropdown-menu.vue";
import msDropdownItem from "@/components/ms-dropdown/dropdown-item.vue";
import { store, actions } from "../store/index.js";
export default {
  components: {
    msDropdownMenu,
    msDropdownItem,
  },
  props: {
    statusList: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  computed: {
    teachClassList: () =>
      JSON.parse(uni.getStorageSync("protal")).teachClassList,
  },
  data() {
    return {
      showClass: false,
      showSub: false,
      defTitle: "",
      defSubTitle: "",
      value0: "",
      value1: "",
      classList: [],
      subList: [],
      gradeCode:''
    };
  },
  watch: {
    value0(val, oldval) {
      if (val !== oldval) {
        this.defTitle = this.classList.filter((el) => {
          return el.value === val;
        })[0].text;
        this.$emit("value0Change", this.value0);
      }
    },
    value1(val, oldval) {
      if (val !== oldval) {
        this.defSubTitle = this.subList.filter((el) => {
          return el.value === val;
        })[0].text;
        this.$emit("value1Change", val);
      }
    },
  },
  async created() {
    this.gradeCode = this.$tools.getQuery().get("gradeCode");
    this.classList = this.teachClassList
    this.classList = this.teachClassList.filter((item) => item.gradeCode === this.gradeCode);
    if (this.classList.length > 0) {
      this.showClass = true;
      this.defTitle = this.classList[0].text;
      this.value0 = this.classList[0].value;
    }
    this._getSubList();
  },
  methods: {
    async _getSubList() {
      const req = {
        schoolCode: store.userInfo.schoolCode,
      };
      const res = await actions.getSubList(req);
      this.subList = res.data.map((ele) => {
        return {
          text: ele.subjectName,
          value: ele.subjectCode,
        };
      });
      this.value1 = res.data[0].subjectCode;
      this.defSubTitle = this.subList[0].text;
      this.showSub = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.dropdown {
  padding: 4rpx 18rpx 18rpx 18rpx;
  background: #fff;
  font-size: 12px;
}
.dropdown-menu {
  width: 100%;
  padding: 2rpx 0;
}
.dropdown-item__selected {
  padding: 10rpx;
}
.icon {
  margin-left: 10rpx;
}
.down {
  transition: transform 0.3s;
  transform: rotateZ(0);
}
.up {
  transition: transform 0.3s;
  transform: rotateZ(-180deg);
}
button {
  font-size: 28upx;
}
.dropdown-item {
  width: 100%;
  flex: 1;
  position: relative;
  &__selected {
    position: relative;
    display: flex;
    align-items: center;
    background: #fff;
    padding: 20rpx;
    box-sizing: border-box;
    justify-content: center;
    .selected__name {
      font-size: 28rpx;
    }
    .selected__icon {
      margin-left: 20rpx;
      &.down {
        transition: transform 0.3s;
        transform: rotateZ(0);
      }
      &.up {
        transition: transform 0.3s;
        transform: rotateZ(-180deg);
      }
    }
  }
}
@font-face {
  font-family: "iconfont"; /* project id 1564327 */
  src: url("https://at.alicdn.com/t/font_1564327_fcszez4n5i.eot");
  src: url("https://at.alicdn.com/t/font_1564327_fcszez4n5i.eot?#iefix")
      format("embedded-opentype"),
    url("https://at.alicdn.com/t/font_1564327_fcszez4n5i.woff2") format("woff2"),
    url("https://at.alicdn.com/t/font_1564327_fcszez4n5i.woff") format("woff"),
    url("https://at.alicdn.com/t/font_1564327_fcszez4n5i.ttf")
      format("truetype"),
    url("https://at.alicdn.com/t/font_1564327_fcszez4n5i.svg#iconfont")
      format("svg");
}
.iconfont {
  font-family: "iconfont" !important;
  font-size: 24rpx;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -webkit-text-stroke-width: 0.2px;
  -moz-osx-font-smoothing: grayscale;
}
</style>
