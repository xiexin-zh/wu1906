<template>
  <div class="bottom">
    <el-row>
      <el-col :xs="24" :sm="4" :lg="8" class="u-fx u-fx-jc u-padd hidden-sm-only hidden-md-only">
        <div class="ewm-img u-fx u-fx-jc">
          <img src="../assets/img/xcx.png" alt="" />
          <img src="../assets/img/gzh.jpg" alt="" />
        </div>
      </el-col>
      <el-col :xs="6" :sm="4" :lg="2" class="u-fx u-fx-jc">
        <ul>
          <li class="title">产品中心</li>
          <li @click="goHtml('/production', 1)">硬件产品</li>
          <li @click="goHtml('/production', 1)">产品优势</li>
          <li @click="goHtml('/video', 1)">视频中心</li>
        </ul>
      </el-col>
      <el-col :xs="6" :sm="4" :lg="2" class="u-fx u-fx-jc">
        <ul>
          <li class="title">开放资源</li>
          <li @click="goHtml('/solution', 3)">解决方案</li>
          <li @click="goHtml('/case', 4)">客户案例</li>
        </ul>
      </el-col>
      <el-col :xs="6" :sm="4" :lg="2" class="u-fx u-fx-jc">
        <ul>
          <li class="title">合伙人模式</li>
          <li @click="goHtml('/model', 5)">业务模式</li>
          <li @click="goHtml('/model', 5)">合作模式</li>
        </ul>
      </el-col>
      <el-col :xs="6" :sm="4" :lg="2" class="u-fx u-fx-jc">
        <ul>
          <li class="title">联系我们</li>
          <li @click="goHtml('/about', 8)">关于我们</li>
          <li @click="goHtml('/about', 8)">合作资讯</li>
        </ul>
      </el-col>
      <el-col :xs="24" :sm="8" :lg="8" class="u-fx u-fx-jc u-padd-l20 u-padd-r20">
        <ul>
          <li class="title">联系方式</li>
          <li>电话：027-65526543</li>
          <li>手机：15058133936</li>
          <li>邮箱：896922782@qq.com</li>
          <li style="line-height: 20px">地址：武汉市东湖新技术开发区光谷大道现代世贸中心A座17楼</li>
        </ul>
      </el-col>
    </el-row>
    <div class="copy-right">
      <div class="hidden-xs-only">Copyright © 2018—2019 武汉全品教育科技有限公司版权所有京ICP备15050178号-2</div>
      <el-row class="hidden-sm-and-up">
        <el-col :xs="24" :sm="12" :lg="12">Copyright © 2018—2019</el-col>
        <el-col :xs="24" :sm="12" :lg="12">武汉全品教育科技有限公司版权所有京ICP备15050178号-2</el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Bottom',
  data() {
    return {}
  },
  methods: {
    goHtml(path, index) {
      this.$store.commit('home/SET_Data', index)
      this.$router.push(path)
    },
  },
}
</script>

<style scoped lang="scss">
.bottom {
  padding-top: 20px;
  overflow: hidden;
  background-color: #000;
  .ewm-img {
    img {
      border-radius: 2px;
      width: 120px;
      height: 120px;
      display: block;
      margin: 0 10px;
    }
  }
  li {
    height: 40px;
    line-height: 40px;
    color: #666;
    cursor: pointer;
    &.title {
      cursor: auto;
      font-weight: bold;
      color: #fff;
    }
  }
  .copy-right {
    margin-top: 10px;
    padding: 15px;
    font-size: 12px;
    text-align: center;
    color: #666;
    border-top: 1px #333 solid;
  }
}
</style>
