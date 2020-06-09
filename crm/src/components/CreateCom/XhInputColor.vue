<template>
  <div class="select-and-input-box">
    <el-input
      v-model="dataValue"
      :type="type"
      :disabled="disabled"
      @input="valueChange"
    >
      <i slot="prefix" class="el-input__icon">
        <span class="bg-color" :style="colorListDatas!==''?{ background: colorListDatas }:{ background: colorData }"></span>
      </i>
    </el-input>
    <div class="color-box">
      <span
        v-for="(item, index) in colorList"
        :key="index"
        @click="changeColor(item)"
        :style="{ background: item.name }"
      >
      </span>
    </div>
  </div>
</template>
<script type="text/javascript">
import stringMixin from "./stringMixin";

export default {
  name: "XhInputColor", // 新建 input
  components: {},
  mixins: [stringMixin],
  computed: {
    type() {
      if (this.item && this.item.form_type == "password") {
        return this.item.form_type;
      } else {
        return "XhInputColor";
      }
    }
  },
  watch: {
    colorListDatas: function(newVal,oldVal){
      console.log(newVal,oldVal)
      if(oldVal==''){
        let colors = JSON.parse(localStorage.getItem("colorList"));
        colors.forEach(element => {
          if(element.id===newVal){
            this.colorData = element.name
          }
        });
      }
    }
  },
  data() {
    return {
      colorData: "",
      colorList: [],
      colorListDatas:''
    };
  },
  props: {},
  mounted() {
    this.colorList = JSON.parse(localStorage.getItem("colorList"));
    this.colorData = this.colorList[0].name;
    this.Bus.$on('colorListDatas',data=>{
      this.colorListDatas = data;
    })
    
  },
  methods: {
    changeColor(val) {
      console.log(val);
      this.colorData = val.name;
      this.Bus.$emit("colorData", val);
    }
  }
};
</script>
<style lang="scss" scoped>
.el-input__icon {
  /deep/.bg-color {
    width: 15px;
    height: 15px;
    border-radius: 50%;
    display: inline-block;
    vertical-align: middle;
  }
}
.color-box {
  margin-top: 10px;
  line-height: normal;
  span {
    display: inline-block;
    width: 18px;
    height: 18px;
    margin-right: 25px;
    border-radius: 50%;
    cursor: pointer;
  }
  span:last-child {
    margin: 0;
  }
}
</style>
