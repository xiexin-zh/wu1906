<template>
  <a-layout class="u-fx u-of">
    <div :class="['slide-left', { 'slide-left-close': slideTag }]">
      <side-menu ref="slideMenu" @goSystem="goSystem" mode="inline" :theme="navTheme"></side-menu>
    </div>
    <div class="u-fx-f1 u-fx-ver">
      <header-top ref="headerTop" @change="changeSchool"></header-top>
      <div class="u-fx-f1 u-fx">
        <basic-content v-if="!isEntryApp" @goApp="goApp"></basic-content>
        <iframe v-if="isEntryApp" id="iframe-content" src frameborder="0"></iframe>
      </div>
    </div>
  </a-layout>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import { mixin, mixinDevice } from '@/utils/mixin'
import BasicContent from './BasicContent'
import SideMenu from '../components/Menu/SideMenu'
import HeaderTop from '@/components/GlobalHeader/HeaderTop'
import baseData from '@u/libs/base-data'
import { entryApp, entrySystem } from './app-menu'

export default {
  name: 'BasicLayout',
  mixins: [mixin, mixinDevice],
  components: {
    SideMenu,
    HeaderTop,
    BasicContent
  },
  computed: {
    ...mapState('home', ['isEntryApp', 'slideTag', 'menuUrl', 'menuIndex'])
  },
  data() {
    return {}
  },
  async mounted() {
    window.setMenu = id => {
      this.setState({
        menuIndex: [id]
      })
    }
    const loginInfo = window.sessionStorage.getItem('loginInfo')
    // 如果存在用户信息，并且已在系统内，需打开对应系统界面
    if (loginInfo && this.isEntryApp) {
      this.goSystem(this.menuUrl, this.menuIndex[0])
      return
    }
    // 获取用户关联的学校列表
    const res = await this.getSchoolInfo()
    if (res.data || res.data.length > 0) {
      this.setState({
        schoolList: res.data
      })
      this._getAppList(res.data[0])
    } else {
      this.$message.success('暂无查询到学校信息')
    }
  },
  methods: {
    ...mapActions('home', ['getAppList', 'getSchoolInfo', 'schoolYear']),
    ...mapMutations('home', ['setState']),
    /**
     * 切换学校
     * @param { object } item 学校信息
     */
    changeSchool(item) {
      this._getAppList(item)
    },
    /**
     * 获取当前用户角色所绑定的应用列表
     * @param { string } schoolCode 学校code
     */
    async _getAppList(item) {
      // 存储当前的学校信息和学年信息
      const schoolCode = item.schoolCode
      window.sessionStorage.setItem('schoolCode', schoolCode)
      window.sessionStorage.setItem('loginInfo', JSON.stringify(item))
      baseData.getUsingSchoolYear(schoolCode)
      const res = await this.getAppList({
        schoolCode,
        plateformType: 1
      })
      // 存储应用列表
      this.setState({
        appList: res.data,
        schoolCode,
        loginInfo: item
      })
    },
    /**
     * 点击我的应用模块
     * @param { object } appInfo 应用信息
     * @param { number } index 当前应用的索引
     */
    goApp(appInfo, index) {
      entryApp(appInfo, index, this, (url, key) => {
        this.goSystem(url, key)
      })
    },
    /**
     * 进入到系统路由界面,统一的菜单跳转入口
     * @param { string } path 菜单url
     * @param { number } key 菜单key值
     */
    goSystem(path, key) {
      this.setState({
        menuIndex: [key], // 当前菜单key值
        menuUrl: path, // 存储当前菜单url
        slideTag: false, // 是否伸缩左侧菜单栏
        isEntryApp: true // 是否进入应用状态
      })
      this.$nextTick(() => {
        const dom = document.querySelector('#iframe-content')
        entrySystem(path, dom)
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
      color: @u-main-color;
      cursor: pointer;
    }
  }
}
.slide-left {
  transition: width 0.3s ease;
  width: 200px;
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
