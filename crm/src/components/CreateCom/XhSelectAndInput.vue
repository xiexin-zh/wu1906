<!-- XhSelectAndInput -->
<template>
  <div class="select-and-input-box">
    <el-select
      style="flex: 1 1;"
      v-model="dataValue"
      :disabled="disabled"
      @change="dataValueClick"
      placeholder="請選擇"
    >
      <el-option
        v-for="(item, index) in option"
        :key="index"
        :label="item.name"
        :value="item.id"
      ></el-option>
    </el-select>
    <el-input
      v-show="flag"
      v-if="inputShow"
      @blur="blurClick()"
      style="width: 60%;"
      placeholder="请输入内容"
      v-model="dataValue_code"
      @input="valueChange"
    ></el-input>
  </div>
</template>
<script type="text/javascript">
import stringInput from "./stringInput";

export default {
  name: "Xh-selectAndInput", // 新建 select
  components: {},
  mixins: [stringInput],
  watch: {
    item: {
      handler(val) {
        if (val) {
          let settingList = Array;
          if (val.key == "listed_company") {
            settingList = JSON.parse(localStorage.getItem("settingA"));
          } else if (val.key == "phone_code") {
            settingList = JSON.parse(localStorage.getItem("settingB"));
          }
          this.option = settingList.map((item, index, array) => {
            item.value = item.status_id;
            return item;
          });
        }
      },
      deep: true,
      immediate: true
    }
  },
  computed: {
    inputShow: function() {
      if (this.index === 7) {
        return this.dataValue === 1;
      } else {
        return true;
      }
    }
  },
  data() {
    return {
      blurClickFlag:false,
      flag_p: "",
      flag: true,
      option: [],
      inputVal: "",
      dataValue_code: "",
      dataValue: "",
      listed_company: ""
    };
  },
  props: {},
  mounted() {
    this.Bus.$emit("blurClickFlag", false);
    if (localStorage.getItem("settingBValue")) {
      if (this.option[0].id == 46) {
        this.dataValue = JSON.parse(localStorage.getItem("settingAValue"));
        if (this.dataValue == 46) {
          this.flag = true;
        } else {
          this.flag = false;
        }
        console.log(this.dataValue);
        this.dataValue_code = JSON.parse(localStorage.getItem("settingC"));
      } else if (this.option[0].id == 109) {
        this.dataValue = JSON.parse(localStorage.getItem("settingBValue"));
        this.dataValue_code = JSON.parse(localStorage.getItem("settingD"));
      }
    }
  },
  methods: {
    dataValueClick() {
      if (this.dataValue == 47 || this.dataValue == 46) {
        if (this.dataValue == 47) {
          this.flag = false;
          this.Bus.$emit("flagRules", false);
        } else if (this.dataValue == 46) {
          this.dataValue_code = '';
          localStorage.setItem("settingC", this.dataValue_code);
          this.flag = true;
          this.flag_p = true;
          // 是这里什么都没有写啊
          this.Bus.$emit("flagRules", true);
        }
        localStorage.setItem("listedCompany", this.dataValue);
      } else {
        localStorage.setItem("phoneCode", this.dataValue);
      }
    },
    blurClick() {
      if (this.dataValue_code) {
        this.Bus.$emit("blurClickFlag", true);
        localStorage.setItem("settingC", this.dataValue_code);
      }
    }
  },
  beforeDestroy() {
    localStorage.removeItem("settingAValue");
    localStorage.removeItem("settingBValue");
    localStorage.removeItem("settingC");
    localStorage.removeItem("settingD");
  }
};
</script>
<style lang="scss" scoped>
.select-and-input-box {
  display: flex;
  justify-content: space-between;
}
</style>
