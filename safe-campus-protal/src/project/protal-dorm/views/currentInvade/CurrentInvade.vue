<template>
  <div class="page-layout">
    <div class="box-scroll" ref="boxScroll">
      <div class="camera-list" v-if="roleCode.indexOf(schoolCode) > -1" @click="goFace()">
        <div class="title qui-fx-jc">
          校园门禁管理系统
        </div>
        <img :src="welcome" alt="">
        <div class="bottom qui-fx-jsa qui-fx-ac">
          <div class="qui-fx-ac"><img :src="face" alt=""></div>
        </div>
      </div>
      <div class="camera-list" v-for="list in dataList" :key="list.id">
        <div class="title qui-fx-jsb">
          <div>{{ list.categoryName }}</div>
        </div>
        <img :src="welcome" alt="">
        <div class="bottom qui-fx-jsa qui-fx-ac">
          <div @click="goWelcome(list, 'invade')" class="qui-fx-ac"><img :src="face" alt="">实时入侵</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import face from '../../assets/img/invade/face.png'
import welcome from '../../assets/img/invade/welcome.png'
import { mapActions } from 'vuex'
export default {
  name: 'ControlSet',
  data () {
    return {
      face,
      welcome,
      schoolCode: window.sessionStorage.getItem('schoolScheme'),
      dataList: [],
      roleCode: ['HR', 'YD', 'CANPOINT']
    }
  },
  methods: {
    ...mapActions('currentInvade', [
      'getBuildNode'
    ]),
    goFace () {
      window.open('/door-face?schoolCode =' + this.schoolCode, '_blank')
    },
    goWelcome (list, type) {
      if (process.env.NODE_ENV === 'production') {
        window.open('/pc-protal/invade/' + type + '.html?buildingCode=' + list.categoryCode + '&schoolCode=' + this.schoolCode, '_blank')
      } else {
        window.open('http://127.0.0.1:5500/static/invade/' + type + '.html?buildingCode=' + list.categoryCode + '&schoolCode=' + this.schoolCode, '_blank')
      }
    }
  },
  async mounted () {
    this.$refs.boxScroll.style.height = document.documentElement.clientHeight - 150 + 'px'
    const res = await this.getBuildNode(this.schoolCode)
    this.dataList = res.data
    console.log(this.dataList)
  }
}
</script>

<style lang="less" scoped>
  .camera-list {
    margin-top: 1.2%;
    border-radius: 6px;
    overflow: hidden;
    width: 23.5%;
    background-color:#fff;
    height: 240px;
    float: left;
    margin-left: 1.2%;
    position: relative;
    & > img {
      width: 100%;
      height: 240px;
      display: block;
    }
    .title {
      width: 100%;
      position: absolute;
      top: 0;
      left: 0;
      background: rgba(0,0,0, .6);
      padding: 6px 10px;
      color:#fff;
    }
    .bottom {
      width: 100%;
      position: absolute;
      bottom: 0;
      left: 0;
      cursor: pointer;
      background: rgba(0,0,0, .6);
      color:#fff;
      padding: 10px 10px;
      font-size: 16px;
      img {
        display: block;
        width: 26px;
        height: 26px;
        margin-right: 5px;
      }
    }
  }
</style>
