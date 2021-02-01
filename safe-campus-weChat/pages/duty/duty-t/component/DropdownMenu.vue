<template>
  <view class="dropDown u-fx" v-if="gradeList.length > 0">
    <ms-dropdown-menu
      ><ms-dropdown-item v-model="value0" :list="gradeList"></ms-dropdown-item
    ></ms-dropdown-menu>
    <ms-dropdown-menu
      ><ms-dropdown-item
        v-model="value1"
        :list="classList"
        :title="defTitle"
      ></ms-dropdown-item
    ></ms-dropdown-menu>
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
  props: {},
  data() {
    return {
      value0: "0",
      value1: "0",
      gradeList: [],
      classList: [],
      defTitle: "",
    };
  },
  watch: {
    value0(val, oldval) {
      if (val !== oldval) {
        this.getClass(val);
        this.$emit("value0Change", this.value0);
      }
    },
    value1(val, oldval) {
      if (val !== oldval) {
        this.defTitle = "";
        this.$emit("value1Change", this.value1);
      }
    },
  },
  async created() {
    const req = {
      schoolCode: store.userInfo.schoolCode,
    };
    const res = await actions.getGradeList(req);
    if (res.data.list.length === 0) {
      return;
    }
    console.log(res.data.list[0].code);
    const req1 = {
      schoolYearId: store.schoolYear.schoolYearId,
      schoolCode: store.userInfo.schoolCode,
      gradeCode: res.data.list[0].code,
    };
    const res1 = await actions.getClassList(req1);
    res.data.list.forEach((ele) => {
      this.gradeList.push({
        text: ele.name,
        value: ele.code,
      });
    });
    if (res1.data.list.length === 0) {
      return;
    }
    res1.data.list.forEach((ele) => {
      this.classList.push({
        text: ele.className,
        value: ele.classCode,
      });
    });
    this.$emit("value0Change", res.data.list[0].code);
    this.$emit("value1Change", res1.data.list[0].classCode);
  },
  methods: {
    async getClass(code) {
      this.classList = [];
      const req = {
        schoolYearId: store.schoolYear.schoolYearId,
        schoolCode: store.userInfo.schoolCode,
        gradeCode: code,
      };
      const res = await actions.getClassList(req);
      if (res.data.list.length === 0) {
        this.defTitle = "请选择";
        return;
      }
      this.$emit("value1Change", res.data.list[0].classCode);
      this.defTitle = res.data.list[0].className;
      res.data.list.forEach((ele) => {
        this.classList.push({
          text: ele.className,
          value: ele.classCode,
        });
      });
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
  width: 50%;
  padding: 2rpx 0;
  border: 1rpx solid $u-border-color;
}
.dropdown-menu:first-child {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  border-right: none;
}
.dropdown-menu:last-child {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
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
</style>
