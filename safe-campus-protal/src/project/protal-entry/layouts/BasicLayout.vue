<template>
  <a-layout class="qui-fx u-of">
    <div :class="['slide-left', { 'slide-left-close': slideTag }]">
      <side-menu ref="slideMenu" @goSrc="goSrc" mode="inline" :theme="navTheme"></side-menu>
    </div>
    <div class="qui-fx-f1 qui-fx-ver">
      <header-top ref="headerTop" @changeMenu="getAppList"></header-top>
      <div class="qui-fx-f1 qui-fx">
        <basic-content v-if="!isEntryApp" @entryApp="entryApp"></basic-content>
        <iframe v-if="isEntryApp" id="iframe-content" src frameborder="0"></iframe>
      </div>
    </div>
  </a-layout>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import { mixin, mixinDevice } from '@/utils/mixin'
import adminMenu from '../assets/js/admin-menu'
import BasicContent from './BasicContent'
import SideMenu from '../components/Menu/SideMenu'
import HeaderTop from '@/components/GlobalHeader/HeaderTop'

export default {
  name: 'BasicLayout',
  mixins: [mixin, mixinDevice],
  components: {
    SideMenu,
    HeaderTop,
    BasicContent
  },
  computed: {
    ...mapState('home', ['isEntryApp', 'slideTag'])
  },
  data() {
    return {
      routeAddress: [],
      schoolList: []
    }
  },
  watch: {},
  async mounted() {
    if (!window.sessionStorage.getItem('loginType')) {
      window.location.href = '/login'
      return
    }
    const { userTypes, accountType, id } = JSON.parse(window.sessionStorage.getItem('loginType'))
    const isAdmin = userTypes.some(item => {
      return item.userType === 1
    })
    if (accountType === 1 && isAdmin) {
      this.updateState({
        key: 'menuList',
        data: adminMenu
      })
      this.getSchoolList(userTypes, list => {
        list[0].id = id
        window.sessionStorage.setItem('loginInfo', JSON.stringify(list[0]))
        this.entryApp(0)
      })
    } else {
      this.getSchoolList(userTypes)
    }
  },
  methods: {
    ...mapActions('home', ['getApp', 'getSchoolInfo']),
    ...mapMutations('home', ['updateState']),
    // 获取所有登录账户的学校信息
    getSchoolList(userTypes, call) {
      const allList = []
      userTypes.forEach((item, index) => {
        allList.push(this.getSchoolInfo(item.schoolCode))
      })
      Promise.all(allList).then(res => {
        const list = res.map(item => {
          return item.data
        })
        if (call) {
          call(list)
        } else {
          this.$refs.headerTop.bindSchool(list)
        }
      })
    },
    // 获取当前学校的菜单权限
    async getAppList(schoolCode, userType, userId) {
      const res = await this.getApp({
        schoolCode,
        userType,
        plateformType: 2,
        userId
      })
      const resSort = res.data.sort((a, b) => {
        return a.orderNum - b.orderNum
      })
      this.updateState({
        key: 'menuList',
        data: resSort
      })
    },
    entryApp(index) {
      /**
       * 设置进入应用和菜单展开状态值
       */
      this.updateState({
        key: 'isEntryApp',
        data: true
      })
      this.updateState({
        key: 'slideTag',
        data: false
      })
      this.$refs.slideMenu.changeModule(index)
    },
    goSrc(path) {
      this.$nextTick(() => {
        if (process.env.NODE_ENV === 'production') {
          const url = path.split('#/')
          const urlPath = `${url[0]}/index.html#/${url[1]}`
          document.querySelector('#iframe-content').src = `${window.location.origin}${urlPath}`
        } else {
          let params
          if (path.indexOf('pc-protal') > -1) {
            params = path.replace('/pc-protal', '').split('#/')
          } else {
            params = path.split('#/')
          }
          console.log(`${window.location.origin}${params[0]}.html#/${params[1]}`)
          document.querySelector(
            '#iframe-content'
          ).src = `${window.location.origin}${params[0]}.html#/${params[1]}`
        }
      })
    }
  }
}
</script>

<style lang="less">
@import url('../../../components/global.less');

#iframe-content {
  width: 100%;
  height: 100%;
}
.address-list {
  height: 35px;
  margin-top: 4px;
  li {
    float: left;
    height: 35px;
    line-height: 35px;
    font-size: 14px;
    .act {
      color: @main-color;
      cursor: pointer;
    }
  }
}
.slide-left {
  transition: width 0.3s ease;
  width: 240px;
  overflow: hidden;
}
.slide-left-close {
  width: 50px;
}
.page-transition-enter {
  opacity: 0;
}

.page-transition-leave-active {
  opacity: 0;
}

.page-transition-enter .page-transition-container,
.page-transition-leave-active .page-transition-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>
