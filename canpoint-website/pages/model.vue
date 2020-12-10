<template>
  <div class="model">
    <img class="banner-top" src="../assets/img/banner_hhrms.png" alt="" />
    <div class="content-w model-content">
      <div class="u-auto u-padd-b20">
        <ul class="news-tab">
          <li
            v-for="(item, index) in tabList"
            :key="index"
            :class="{ act: current === index }"
            @click="changeTag(index)"
          >
            {{ item }}
          </li>
        </ul>
      </div>
      <el-row v-if="current === 0" class="yw-show" :gutter="100">
        <el-col :xs="24" :sm="12" :lg="12">
          <div v-html="modelList.ywOne"></div>
        </el-col>
        <el-col :xs="24" :sm="12" :lg="12">
          <div class="border-line" v-html="modelList.ywTwo"></div>
        </el-col>
      </el-row>
      <el-row v-if="current === 1" class="yw-show" :gutter="100">
        <el-col :xs="24" :sm="12" :lg="12">
          <div v-html="modelList.hzOne"></div>
        </el-col>
        <el-col :xs="24" :sm="12" :lg="12">
          <div class="border-line" v-html="modelList.hzTwo"></div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Model',
  async asyncData({ $axios, query }) {
    const res = await $axios.get(`http://canpointtest.com:8090/videoApi/getAbout?type=model`)
    return {
      modelList: res.data.data[0],
    }
  },
  data() {
    return {
      current: 0,
      tabList: ['业务模式', '合作模式'],
      modelList: {
        ywOne: '',
        ywTwo: '',
      },
    }
  },
  methods: {
    changeTag(index) {
      this.current = index
    },
  },
}
</script>
<style lang="scss" scoped>
.news-tab {
  width: 240px;
  margin: 0.5rem auto;
  padding-bottom: 1rem;
  li {
    letter-spacing: 2px;
    float: left;
    width: 120px;
    line-height: 50px;
    height: 50px;
    cursor: pointer;
    text-align: center;
    background-color: #eee;
    &.act {
      background-color: #4b6fd3;
      color: #fff;
      font-size: 14px;
    }
  }
}
.border-line {
  border-radius: 4px;
  padding: 30px;
  border: 4px #eee solid;
}
.model-content {
  padding: 40px 0;
}
.yw-show {
  img {
    width: 100%;
    height: auto;
    display: block;
  }
}
</style>
