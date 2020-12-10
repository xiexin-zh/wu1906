<template>
  <div class="protal-index">
    <div class="title">平安智慧校园云平台</div>
    <div class="qui-fx-f1 protal-list">
      <div
        v-for="(app, index) in appList"
        :key="index"
        class="box qui-fx-ac-jc"
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
          name: '项目模板',
          url: 'protal-template'
        },
        {
          id: 0,
          name: '登录',
          url: 'protal-login'
        },
        {
          name: '小程序管理后台',
          url: 'protal-wechart'
        },
        {
          name: '运维端',
          url: 'protal-admin'
        },
        {
          name: '学校基础数据',
          url: 'protal-school'
        },
        {
          name: '局端基础数据',
          url: 'protal-organize'
        },
        {
          name: '控制中心',
          url: 'protal-control'
        },
        {
          name: '门禁管理',
          url: 'protal-door'
        },
        {
          name: '考勤管理',
          url: 'protal-attendance'
        },
        {
          name: '疫情防控',
          url: 'protal-ncov'
        },
        {
          name: '宿舍管理',
          url: 'protal-dorm'
        },
        {
          name: '电子班牌',
          url: 'protal-class'
        },
        {
          name: '一卡通',
          url: 'protal-card'
        },
        {
          name: '公共模块-信息发布',
          url: 'protal-common'
        },
        /* {
          name: '公共模块-场地预订',
          url: 'protal-sitebooking'
        }, */
        {
          name: '公共模块-OA办公',
          url: 'protal-oa'
        },
        {
          name: '校园安防-学校',
          url: 'protal-safe-school'
        },
        {
          name: '校园安防-局端',
          url: 'protal-safe-bureau'
        },
        {
          name: '一卡通消费系统',
          url: 'protal-consumption'
        },
        {
          name: '交易管理系统',
          url: 'protal-dealManage'
        },
        {
          name: '全品缴费',
          url: 'protal-pay'
        },
        {
          name: '双重预防',
          url: 'protal-prevent'
        },
        {
          name: '高教版基础数据',
          url: 'protal-high-school'
        },
        {
          name: '安全教育-局端',
          url: 'protal-library-bureau'
        },
        {
          name: '安全教育-校端',
          url: 'protal-library-school'
        },
        {
          name: '安全台账-校端',
          url: 'protal-parameter-school'
        },
        {
          name: '安全台账-局端',
          url: 'protal-parameter-bureau'
        },
        {
          name: '安全应急',
          url: 'protal-emergency'
        },
        {
          name: '招生迎新管理系统',
          url: 'protal-new-student'
        },
        {
          name: '教务系统',
          url: 'protal-academic'
        },
        {
          name: '消息管理-运维端',
          url: 'protal-mesg-mgt'
        }
      ]
    }
  },
  mounted() {
    // const loginInfo = {
    //   id: 1267,
    //   userCode: 'U14jynzusn1u80',
    //   userName: '产品管理',
    //   accountType: 4,
    //   photoUrl: '',
    //   userType: 2,
    //   date: 1591666389492,
    //   schoolCode: 'CANPOINTAI',
    //   schoolId: 219,
    //   schoolName: 'AI教育中心产品部',
    //   eduCode: '',
    //   token: 'e5431b6607f0cad9663b30a8c2eaf15a'
    // }
    // window.sessionStorage.setItem('loginInfo', JSON.stringify(loginInfo))
  },
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
  background: linear-gradient(
    90deg,
    rgba(2, 0, 36, 1) 0%,
    rgba(50, 50, 190, 1) 0%,
    rgba(10, 86, 101, 1) 70%
  );
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
