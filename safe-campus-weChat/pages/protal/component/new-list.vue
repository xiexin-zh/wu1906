<template>
	<view class="news">
		<no-data v-if="newsList.length === 0"></no-data>
    <view v-for="news in newsList" :key="news.id" class="news-list u-bd-b u-fx" @click="detail(news.id)">
      <view class="u-fx-f1 u-fx-ver u-fx-jsb">
        <view class="u-te2">{{ news.title }}</view>
        <text class="time u-font-02 u-tips-color">{{ news.createTime | getToDate }}</text>
      </view>
      <view>
        <img :src="getImg(news.imgUrl)" alt="">
      </view>
    </view>
	</view>
</template>

<script>
import autoImg from '@s/img/news_bg.png'
import noData from '@/components/no-data/no-data.vue'
export default {
	components: {
		noData
	},
  props: {
    newsList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
	data() {
		return {
    }
	},
	methods: {
		getImg (url) {
			return url.indexOf('http') > -1 ? url : autoImg
		},
    detail (id) {
      this.$tools.navTo({
				url: `../news/news-t/SchoolNews/detail?id=${id}`,
				title: '详情'
			})
    }
	}
}
</script>

<style lang="scss" scoped>
  .news-list {
    background-color: #fff;
    padding: 20rpx;
    img {
      margin-left: 10rpx;
      width: 220rpx;
      height: 140rpx;
      display: block;
    }
    .time {
    }
  }
</style>
