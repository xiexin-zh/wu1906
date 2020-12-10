<template>
  <div class="production">
    <div class>
      <img class="banner-top" src="../assets/img/banner_cpzx.png" alt />
    </div>
    <div class="content-w">
      <div class="u-padd-b20 u-padd-t20">
        <el-row>
          <el-col :xs="24" :sm="12" :lg="12">
            <img class="cpys-img" src="../assets/img/cpys.png" alt />
          </el-col>
          <el-col :xs="24" :sm="12" :lg="12">
            <div class="product-top" v-html="detail"></div>
          </el-col>
        </el-row>
        <div class="title-line">硬件产品 / HARDWARE</div>
        <el-row :gutter="40">
          <el-col
            v-for="(product, index) in productList"
            :key="index"
            :xs="24"
            :sm="12"
            :lg="12"
            class="product-list u-hand"
            @click.native="goDetail(product._id)"
          >
            <img class="product-img" :src="product.url" alt />
            <div class="product-des">{{ product.title }}</div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Production',
  async asyncData({ $axios }) {
    const res = await $axios.get(`http://canpointtest.com:8090/videoApi/getProduct?page=1&size=20`)
    const resInfo = await $axios.get(`http://canpointtest.com:8090/videoApi/getAbout?type=product`)
    return { productList: res.data.data.reverse(), detail: resInfo.data.data[0].content }
  },
  data() {
    return {
      productList: [],
      detail: '',
    }
  },
  methods: {
    goDetail(_id) {
      this.$router.push({
        path: 'productDetail',
        query: {
          _id,
        },
      })
    },
  },
}
</script>
<style lang="scss" scopde>
.production {
  li {
    line-height: 30px;
  }
  .title {
    font-size: 16px;
    margin-top: 30px;
    font-weight: bold;
  }
  .product-list {
    padding: 10px 60px;
  }
  .cpys-img {
    width: 100%;
    height: auto;
    display: block;
  }
  .product-des {
    font-size: 16px;
    height: 60px;
    line-height: 60px;
    background-color: #444;
    color: #fff;
    text-align: center;
  }
}
</style>
