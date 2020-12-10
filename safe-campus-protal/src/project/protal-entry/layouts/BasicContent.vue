<template>
  <div class="qui-fx-ver qui-fx-f1 notice-list u-of" style="padding: 10px;">
    <help-dialog v-model="helpTag" v-if="helpTag" :help-info="helpInfo"></help-dialog>
    <a-modal
      mask
      :footer="null"
      width="750px"
      :maskClosable="false"
      :visible="isShow"
      @ok="isShow = false"
      @cancel="isShow = false"
    >
      <div class="notice-close" @click="isShow = false"></div>
      <div class="notice-bg u-fx-ver">
        <div
          class="u-tx-c u-font-3 u-bold"
          style="height: 100px; line-height: 90px"
        >{{ newDetail.title }}</div>
        <div class="u-tx-c u-padd-b10 u-font-01 u-mar-t10 u-tips-color">
          <span>发布人：{{ newDetail.publisherName }}</span>
          <span class="u-padd-l">发布时间：{{ $tools.getDate(newDetail.creatTime) }}</span>
        </div>
        <div class="u-fx-ac notice-content">
          <div style="width: 40px">
            <div @click="seeNotice('left')" class="left-icon" v-if="currentIndex !== 0 && isIcon"></div>
          </div>
          <div
            class="u-line2 u-fx-f1 u-auto"
            style="height: 370px; margin: 0 10px;padding: 0 15px"
            v-html="newDetail.content"
          ></div>
          <div style="width: 40px">
            <div
              @click="seeNotice('right')"
              class="right-icon"
              v-if="currentIndex !== unReadList.length - 1 && isIcon"
            ></div>
          </div>
        </div>
      </div>
    </a-modal>
    <div class="u-fx-ac">
      <div class="banner-img u-fx-f1">
        <img :src="Banner" alt />
      </div>
      <div class="help-list content-box u-fx-ver">
        <div class="title qui-fx-ac" @click="helpTag=true">
          <img :src="app" alt />操作指南
        </div>
        <div class="u-fx-f1" style="overflow: auto">
          <no-data style="padding-top: 100px" v-if="helpList.length === 0" msg="暂无数据~"></no-data>
          <ul>
            <li
              class="u-fx-ac file-list u-fx-jsb u-content-color"
              v-for="help in helpList"
              :key="help._id"
              @click="seeHelp(help)"
            >
              <div class="u-fx-f1 u-te">{{ help.title }}</div>
              <div
                class="view-btn"
                v-if="parseInt(help.funType) === 1"
              >{{ parseInt(help.funType) === 0 ? '查看' : '下载' }}</div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="qui-fx-f1 qui-fx content qui-of">
      <div class="qui-fx-f1 content-box qui-fx-ver" style="margin-right: 10px;">
        <div class="title qui-fx-ac">
          <img :src="app" alt />我的应用
        </div>
        <div class="qui-fx-f1 app">
          <div class="pos-box" style="overflow-y: auto; padding-bottom: 10px">
            <no-data style="padding-top: 100px" v-if="menuList.length === 0" msg="暂无应用~"></no-data>
            <ul>
              <!-- <li
                @click="goApp(index)"
                v-for="(list, index) in menuList"
                :key="list.id"
                class="qui-fx-ac-jc"
                :style="{ backgroundColor: colors[0] }"
              >
                <img :src="list.icon" @error="$tools.errorImg($event)" alt />
                <div style="margin-top: 15px" class="qui-te">{{ list.name.split('#')[0] }}</div>
              </li>-->
              <li
                @click="goApp(index)"
                v-for="(list, index) in menuList"
                :key="list.id"
                class="qui-fx-ac"
              >
                <div class="app-box u-fx-ac-jc" :style="{ backgroundColor: getColor() }">
                  <img :src="list.icon" @error="$tools.errorImg($event)" alt />
                </div>
                <div class="qui-te u-mar-l10 u-content-color">{{ list.name.split('#')[0] }}</div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="content-box qui-fx-ver">
        <div class="title qui-fx-ac">
          <img :src="news" alt />平台消息
        </div>
        <div class="qui-fx-f1 notice">
          <div class="pos-box" style="overflow: auto; padding-bottom: 10px">
            <no-data style="padding-top: 100px" v-if="newList.length === 0" msg="暂无消息~"></no-data>
            <ul>
              <li
                @click="seeNotice(list, index)"
                v-for="(list, index) in newList"
                :key="list.id"
                class="qui-fx u-fx-ac"
              >
                <div class="tips" v-if="!list.readStatus"></div>
                <div class="qui-fx-f1 qui-te u-content-color">{{ list.title }}</div>
                <div class="u-tips-color">{{ $tools.getDate(list.creatTime).substr(5, 11) }}</div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import Banner from '../assets/img/banner.png'
import news from '../assets/img/news.png'
import app from '../assets/img/app.png'
import HelpDialog from './HelpDialog'
import NoData from '@c/NoData'
export default {
  name: 'BasicContent',
  computed: {
    ...mapState('home', ['menuList', 'loginType', 'schoolCode'])
  },
  data() {
    return {
      unReadList: [],
      isIcon: false,
      currentIndex: 0,
      noticeTitle: '消息详情',
      isShow: false,
      Banner,
      news,
      app,
      appList: [],
      newList: [],
      helpList: [],
      helpInfo: {},
      helpTag: false,
      helpTitle: '12',
      newDetail: { creatTime: '' },
      colors: [
        '#336699',
        '#6699CC',
        '#0099CC',
        '#336699',
        '#3399CC',
        '#6699CC',
        '#006699',
        '#99CCFF',
        '#9999FF',
        '#6699FF'
      ]
    }
  },
  components: {
    NoData,
    HelpDialog
  },
  async mounted() {
    this._searchNotice()
    this._getSchoolYear()
    this._getHelpList()
  },
  methods: {
    ...mapActions('home', [
      'searchPersonNotice',
      'readPersonNotice',
      'getSchoolYear',
      'getHelpList'
    ]),
    getColor() {
      return '#6882da'
      // return this.colors[Math.floor(Math.random() * 9)]
    },
    // 获取帮助指引
    async _getHelpList() {
      const res = await this.getHelpList({
        page: 1,
        size: 40
      })
      this.helpList = res.data
    },
    // 查看帮助指引
    seeHelp(item) {
      if (parseInt(item.funType) === 1) {
        window.open(item.linkUrl)
      } else {
        this.helpInfo = item
        this.helpTag = true
        this.helpTitle = '操作指南：' + item.title
      }
    },
    // 获取学年
    async _getSchoolYear() {
      const res = await this.getSchoolYear({
        page: 1,
        schoolCode: this.schoolCode,
        semesterName: '',
        size: 10,
        state: ''
      })
      const index = res.data.records.findIndex(list => list.state === '2')
      window.sessionStorage.setItem(
        'schoolYear',
        JSON.stringify(
          {
            ...res.data.records[index],
            schoolYearId: res.data.records[index].schoolYearName.substring(0, 4)
          } || {}
        )
      )
    },
    /**
     * @des 列表
     */
    async _searchNotice() {
      const res = await this.searchPersonNotice({
        page: 1,
        size: 20,
        userCode: this.loginType.userCode,
        eduCode: this.schoolCode
      })
      this.newList = res.data.list.map(item => {
        return {
          id: item.noticeCode,
          ...item
        }
      })
      this.unReadList = res.data.list.filter(item => {
        return item.popFalg === '1' && !item.readStatus
      })
      if (this.unReadList.length > 0) {
        this.isShow = true
        this.isIcon = true
        this.newDetail = this.unReadList[0]
        this.readStatus(this.newDetail)
      }
    },
    /**
     * @description 查询公告详情
     */
    seeNotice(index, _index) {
      this.isShow = true
      if (index === 'left') {
        this.currentIndex--
        this.newDetail = this.unReadList[this.currentIndex]
      } else if (index === 'right') {
        this.currentIndex++
        this.newDetail = this.unReadList[this.currentIndex]
      } else {
        this.newList[_index].readStatus = '1'
        this.isIcon = false
        this.newDetail = index
      }
      this.readStatus(this.newDetail)
    },
    /**
     * @description 阅读消息
     */
    async readStatus(item) {
      await this.readPersonNotice({
        eduCode: this.schoolCode,
        noticeCodes: [item.noticeCode],
        userCode: this.loginType.userCode
      })
      this.newList.filter(_item => {
        return _item.noticeCode === item.noticeCode
      })[0].readStatus = '1'
    },
    goApp(index) {
      const url = this.menuList[index].url || ''
      /**
       * @des 校端看板
       */
      if (url.indexOf('school-view') > -1) {
        window.open(
          url +
            '&schoolCode=' +
            JSON.parse(window.sessionStorage.getItem('loginInfo')).schoolCode +
            '&schoolName=' +
            JSON.parse(window.sessionStorage.getItem('loginInfo')).schoolName
        )
        return
      }
      if (url.indexOf('http') > -1 || url.indexOf('https') > -1) {
        window.open(url + '?id=' + JSON.parse(window.sessionStorage.getItem('loginInfo')).id)
      } else {
        this.$emit('entryApp', index)
      }
    }
  }
}
</script>

<style lang="less" scoped>
::-webkit-scrollbar {
  width: 1px; /*对垂直流动条有效*/
  height: 1px; /*对水平流动条有效*/
}

/*定义滚动条的轨道颜色、内阴影及圆角*/
::-webkit-scrollbar-track {
  background-color: transparent;
}

/*定义滑块颜色、内阴影及圆角*/
::-webkit-scrollbar-thumb {
  background-color: transparent;
}

/*定义两端按钮的样式*/
::-webkit-scrollbar-button {
  background-color: transparent;
}

/*定义右下角汇合处的样式*/
::-webkit-scrollbar-corner {
  background: transparent;
}

/deep/ .ant-modal-body {
  margin-top: 100px;
}
/deep/ .ant-modal-mask {
  background-color: rgba(0, 0, 0, 0.6);
}
.banner-img {
  height: 380px;
  img {
    width: 100%;
    height: 380px;
  }
}
.help-list {
  background-color: #fff;
  width: 430px;
  height: 380px;
  border-radius: 6px;
  margin-left: 10px;
}
.file-list {
  height: 40px;
  border-bottom: 1px #f5f5f5 solid;
  padding: 0 10px 0 5px;
  cursor: pointer;
  transition: all 0.3s ease;
  &:hover {
    transform: translateX(5px);
  }
}
.view-btn {
  cursor: pointer;
  font-size: 12px;
  letter-spacing: 2px;
  width: 45px;
  color: #fff;
  height: 24px;
  border-radius: 6px;
  line-height: 24px;
  text-align: center;
  background-color: @u-type-primary;
}
.notice-close {
  width: 40px;
  height: 40px;
  position: absolute;
  z-index: 1000;
  top: -70px;
  left: 790px;
  cursor: pointer;
  background: url(../assets/img/close.png) no-repeat;
  background-size: 40px 40px;
}
.notice-content {
  width: 780px;
  margin: 20px auto 10px auto;
}
.notice-bg {
  width: 913px;
  height: 549px;
  position: absolute;
  z-index: 999;
  top: -40px;
  left: -80px;
  background: url(../assets/img/notice-bg.png) no-repeat;
  background-size: 913px 549px;
}
.left-icon {
  width: 30px;
  height: 30px;
  background: url('../assets/img/left.png') no-repeat;
  background-size: 30px;
  margin-right: 20px;
  cursor: pointer;
}
.right-icon {
  width: 30px;
  height: 30px;
  background: url('../assets/img/right.png') no-repeat;
  background-size: 30px;
  margin-left: 10px;
  cursor: pointer;
}
.content-box {
  border-radius: 6px;
  background-color: #fff;
  box-shadow: 1px 1px 3px #f5f5f5;
  padding: 15px;
  overflow: hidden;
  .title {
    font-size: 16px;
    font-weight: bold;
    padding-bottom: 10px;
    border-bottom: 1px #eee dashed;
    img {
      margin-right: 10px;
    }
  }
}
.content {
  margin-top: 10px;
}
.app {
  li {
    .app-box {
      width: 50px;
      height: 50px;
      border-radius: 100%;
      background-color: #0099cc;
    }
    border-right: 1px #f5f5f5 solid;
    margin-top: 35px;
    float: left;
    cursor: pointer;
    letter-spacing: 1px;
    margin-left: 1.428%;
    transition: all 0.3s ease;
    width: 15%;
    font-size: 14px;
    img {
      width: 26px;
      height: 26px;
      display: block;
    }
    &:hover {
      transform: translateX(10px);
    }
  }
}
.notice {
  overflow: hidden;
  width: 400px;
  .tips {
    margin-right: 6px;
    background-color: @u-type-primary;
    width: 8px;
    height: 8px;
    border-radius: 100%;
  }
  li {
    height: 50px;
    line-height: 50px;
    padding-right: 8px;
    transition: padding 0.3s ease;
    border-bottom: 1px #f5f5f5 solid;
    cursor: pointer;
    &:hover {
      color: @u-type-primary;
      padding-left: 5px;
    }
  }
}
</style>
