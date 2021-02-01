<template>
  <div class="protal-index">
    <div class="title">平安智慧校园云平台</div>
    <div class="u-fx-f1 protal-list">
      <div
        v-for="(app, index) in appList"
        :key="index"
        class="box u-fx-ac-jc"
        @click="goHtml(app.url)"
      >
        <img :src="autoImg" alt />
        {{ app.name }}
      </div>
    </div>
  </div>
</template>
<script>
import autoImg from '@a/img/auto_app.png'
export default {
  name: 'App',
  components: {},
  data() {
    return {
      autoImg,
      appList: [
        {
          id: '1000',
          name: '项目基础模板',
          url: 'protal-template'
        },
        {
          id: 1,
          name: '登录',
          url: 'protal-login'
        },
        {
          id: 2,
          name: '平台管理',
          url: 'protal-admin-manage'
        },
        {
          id: 3,
          name: '消息中心',
          url: 'protal-message-manage'
        },
        {
          id: 4,
          name: '基础数据-校端',
          url: 'protal-school-base'
        },
        {
          id: 5,
          name: '基础数据-局端',
          url: 'protal-organize-base'
        },
        {
          id: 6,
          name: '课程管理-校端',
          url: 'protal-course-manage'
        },
        {
          id: 7,
          name: '门禁系统',
          url: 'protal-door-manage'
        },
        {
          id: 8,
          name: '考勤系统',
          url: 'protal-attendance-manage'
        },
        {
          id: 9,
          name: '访客系统',
          url: 'protal-visitor-manage'
        },
        {
          id: 10,
          name: '疫情防控系统',
          url: 'protal-ncov-manage'
        },
        {
          id: 11,
          name: '宿舍管理',
          url: 'protal-dorm-manage'
        }
      ]
    }
  },
  mounted() {},
  methods: {
    goHtml(path) {
      window.location.href = `./${path}.html`
    }
  }
}
</script>

<style lang="less">
.protal-index {
  background: rgb(15, 13, 65);
  background: linear-gradient(90deg, rgba(2, 0, 36, 1) 0%, rgba(50, 50, 190, 1) 0%, rgba(10, 86, 101, 1) 70%);
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 99;
  .title {
    text-shadow: 0px 0px 3px #ccc;
    height: 150px;
    text-align: center;
    color: #fff;
    letter-spacing: 4px;
    line-height: 120px;
    font-size: 34px;
  }
  .protal-list {
    width: 1020px;
    margin: 0 auto;
  }
  .box {
    transition: all 0.5s ease;
    color: #666;
    float: left;
    margin-top: 20px;
    margin-left: 20px;
    border-right: 1px #ccc solid;
    padding: 50px 0;
    width: 120px;
    height: 120px;
    border-radius: 4px;
    box-shadow: 0px 0px 2px #ccc;
    margin-left: 20px;
    cursor: pointer;
    background: #fff;
    font-size: 12px;
    img {
      width: 60px;
      height: 60px;
      display: block;
      margin-bottom: 10px;
    }
    &:hover {
      transform: scale(1.1);
      background: #666;
      color: #f5f5f5;
      box-shadow: 0px 0px 6px #ccc;
    }
  }
}
</style>
