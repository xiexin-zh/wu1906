<template>
  <el-select
    style="width: 100%;"
    v-model="dataValue"
    :disabled="disabled"
    @change="valueChange"
    placeholder="請選擇"
  >
    <el-option
      v-for="(item, index) in option"
      :key="index"
      :label="item.name || item.title"
      :value="item.id"
    >
    </el-option>
  </el-select>
</template>
<script type="text/javascript">
import stringMixin from "./stringMixin";

export default {
  name: "xh-select", // 新建 select
  components: {},
  mixins: [stringMixin],
  watch: {
    item: {
      handler(val) {
        if (window.document.location.hash == "#/crm/customerInformation") {
          if (val.value === 127 || val.value === 128 ||
           val.value === 129 || val.value ==='入場動態'|| val.value ==='接觸' || val.value ==='約見'||
           val.value === 325||val.value ==='禮遇') {
             let valueId = val.data.setting;
             valueId.forEach(element => {
               if(element.id == val.value||element.name ==val.value){
                 console.log(element);
                 this.categoryValue = element.category;
               }
             });
             let categoryValueList = {};
             this.categoryValueList.categoryValue = this.categoryValue;
             this.categoryValueList.value = val.value;
             this.Bus.$emit("Appointment", this.categoryValueList);
          }
        }else if(window.document.location.hash === "#/crm/customerContact"){
          if(val.key ==="customer_id"){
            this.Bus.$emit('CRMcustomerId',val)
          }
        }
        if (val && val.data.setting) {
          var settingList = val.data.setting;
          if (settingList.length > 0 && typeof settingList[0] == "string") {
            var array = [];
            for (let index = 0; index < settingList.length; index++) {
              const element = settingList[index];
              array.push({ name: element, value: element });
            }
            this.option = array;
          } else if (
            settingList.length > 0 &&
            settingList[0].status_id &&
            !settingList[0].value
          ) {
            // 商机阶段
            this.option = settingList.map((item, index, array) => {
              item.value = item.status_id;
              return item;
            });
          } else {
            this.option = settingList;
          }
        } else {
          this.option = [];
        }
      },
      deep: true,
      immediate: true
    }
  },
  computed: {},
  data() {
    return {
      flag: 1,
      option: [],
      categoryValue:'',
      categoryValueList: {}
    };
  },
  props: {},
  mounted() {},
  methods: {}
};
</script>
<style lang="scss" scoped></style>
