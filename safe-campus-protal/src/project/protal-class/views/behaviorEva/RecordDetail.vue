<template>
  <div class="page-layout qui-fx detail">
    <div class="img-left qui-fx-f1 qui-fx-ver" >
      <div class="qui-fx-f1 current-box">
        <img class="img-current" :src="currentImg" alt="" >
      </div>
      <div class="img-word">{{ content }}</div>
    </div>
    <div class="detai-text">
      <div class="img-top" @click="scrollTop" v-show="rightShow"></div>
      <div class="img-box" ref="build_list" :style="{ maxHeight: maxHeight }">
        <div
          ref="scroll_build"
          style="position: relative; left: 0; transition: all .3s ease; font-size: 0px; white-space: no-wrap">
          <div
            class="detail-img"
            v-for="(item,index) in banners"
            :key="index"
            :style="{ width:width,height: height,backgroundImage: 'url(' + item + ')' }"
            @click="show(item)">
          </div>
          <!-- <div class="detail-img" v-for="(item,index) in banners" :key="index" :style="{ height: height }">
            <img :src="item" alt="" @click="show(item)">
          </div> -->
        </div>
      </div>
      <div style="clear:both" class="img-bottom" @click="scrollLeft" v-show="leftShow "></div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  name: 'RecordDetail',
  components: {
  },
  data () {
    return {
      banners: [],
      leftShow: false,
      rightShow: false,
      currentImg: '',
      maxHeight: 0,
      detailId: '',
      content: '',
      height: '',
      width: ''
    }
  },
  computed: {
    ...mapState('home', [ 'userInfo' ])
  },
  created() {
    this.maxHeight = document.body.clientHeight - 260 + 'px'
    this.height = (document.body.clientHeight - 260) / 3 + 'px'
    this.width = document.body.clientWidth / 3 + 'px'
  },
  mounted () {
    this.detailId = this.$route.query.id
    this.categoryGet()
  },
  methods: {
    ...mapActions('home', [ 'getAppraiseDetail' ]),
    categoryGet () {
      this.getAppraiseDetail(this.detailId).then(res => {
        this.banners = res.data.urlList
        this.currentImg = res.data.urlList[0]
        this.content = res.data.content
        setTimeout(() => {
          var scrollH = this.$refs.scroll_build.scrollHeight
          var buildH = this.$refs.build_list.clientHeight
          if (scrollH > buildH) {
            this.rightShow = true
          }
        }, 100)
      })
    },
    scrollLeft () {
      var boxScroll = this.$refs.scroll_build
      var canTop = Math.abs(boxScroll.offsetTop)
      if (canTop >= 100) {
        boxScroll.style.top = boxScroll.offsetTop + 100 + 'px'
      } else {
        boxScroll.style.top = '0px'
      }
    },
    scrollTop() {
      var boxScroll = this.$refs.scroll_build
      var buildScroll = this.$refs.build_list
      var canTop = boxScroll.scrollHeight - buildScroll.clientHeight - Math.abs(boxScroll.offsetTop)
      if (canTop >= 100) {
        boxScroll.style.top = -(Math.abs(boxScroll.offsetTop) + 100) + 'px'
      } else {
        boxScroll.style.top = -(Math.abs(boxScroll.offsetTop) + canTop) + 'px'
      }
      this.leftShow = true
    },
    show(record) {
      this.currentImg = record
    }
  }
}
</script>
<style lang="less" scoped>
.detail{
  .img-left{
    height: 100%;
    padding: 15px;
    .current-box {
      height: 100px;
      img{
        width: 100%;
        height: 100%;
      }
    }
    .img-word {
      text-indent: 2em;
      height: 200px;
      overflow: scroll;
      font-size: 18px;
      margin-top: 10px;
      color: #333;
    }
  }
  .detai-text {
    padding: 0 15px;
    .img-top {
      height: 50px;
      background: url('../../assets/img/up.png') no-repeat;
      background-position: center;
      cursor: pointer;
    }
    .img-bottom {
      height: 50px;
      background: url('../../assets/img/down.png') no-repeat;
      background-position: center;
      cursor: pointer;
    }
    .img-box {
      float: left;
      white-space: nowrap;
      position: relative;
      overflow: hidden;
      zoom: 1;
      .detail-img {
        margin-top: 15px;
        background-repeat: no-repeat;
        background-size: 100% 100%;
        cursor: pointer;
        // img {
        //   width: 100%;
        //   height: 100%;
        //   cursor: pointer;
        // }
      }
    }
  }
}
</style>
