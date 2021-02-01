<template>
  <view class="add">
    <scroll-view scroll-y="true" class="scroll-h u-bg-fff">
      <view class="u-fx-ac u-bd-b item-list">
        <view class="tip"> 新闻标题：</view>
        <view class="u-fx-f1"
          ><input maxlength="30" placeholder="请输入标题" v-model="newsInfo.title" class="item-input"
        /></view>
      </view>
      <view class="qui―fx u-bd-b item-list">
        <view class="tip"> 新闻内容：</view>
        <view class="u-fx-f1 u-mar-t">
          <textarea
            class="item-input"
            v-model="newsInfo.content"
						placeholder="请输入新闻内容"
            maxlength="2000"
          />
        </view>
      </view>
      <view class="u-bd-b item-list">
        <view class="tip mar-b20">上传封面图：</view>
        <view
          >
        	<video-upload
							class="u-fx-f1 u-padd-l20 u-padd-r10 u-padd-b20"
							:schoolCode="userInfo.schoolCode"
							types="image"
							v-model="fileList"
							:uploadCount="1"
							:upload_max="10"
							@success="success"
							@delImage="delImage"
						></video-upload>
        </view>
      </view>
    </scroll-view>
    <view class="footer-btn u-fx-ac">
      <u-button
        type="primary"
        class="u-fx-f1 u-mar-l u-mar-r u-type-primary-dark-bg"
        @click="submit"
        >提交</u-button
      >
    </view>
  </view>
</template>

<script>
import { actions, store } from "../store/index";
import eventBus from "@u/eventBus";
import tools from ".../../../utils/tools";
import hostEnv from "../../../../config/index.js";
export default {
  components: {
  },
  data() {
    return {
      newsInfo: {
        title: "",
        content: "",
      },
			uploadUrl: '',
      fileList: [],
      id: ""
    };
  },
  computed: {
		userInfo: () => store.userInfo,
	},
  created() {
  },
  async mounted() {
    this.id = this.$tools.getQuery().get("id");
    if (this.id) {
      this.detailGet(this.id);
    }
  },
  methods: {
    success(e) {
      console.log(e);
      this.photoId = e.id;
    },
    delImage(value) {
      console.log(value);
      const index = this.fileList.findIndex((list) => {
        return list.url === value.url;
      });
      this.fileList.splice(index, 1);
      // actions.delFile(value.id || this.fileList[0].id);
    },
    async detailGet(id) {
      const res = await actions.getNewsDetail(id);
      this.newsInfo = res.data;
      if (res.data.imgUrl) {
        this.fileList = [
          {
            url: res.data.imgUrl,
            id: res.data.id,
          },
        ];
      }
    },
    submit: tools.throttle(async function() {
      if (this.newsInfo.title === "") {
        this.$tools.toast("请输入标题");
        return false;
      } else if (this.newsInfo.content === "") {
        this.$tools.toast("请输入新闻内容");
        return false;
      }
      const req = {
        createBy: store.userInfo.userName,
        schoolCode: store.userInfo.schoolCode,
        creatorCode: store.userInfo.userCode,
      };
      if (this.id) {
        await actions.updateContent({
          ...req,
          id: this.id,
          imgUrl: this.fileList[0].url,
          remark: "",
          content: this.newsInfo.content,
          title: this.newsInfo.title,
        });
        this.$tools.toast("提交成功", 'success');
        this.$tools.goNext(() => {
          eventBus.$emit("getList");
          this.$tools.goBack();
        });
      } else {
        await actions.addNews({
          ...this.newsInfo,
          ...req,
          imgUrl: this.fileList.length > 0 ? this.fileList[0].url : "",
        });
        this.$tools.toast("提交成功", 'success');
        this.$tools.goNext(() => {
          eventBus.$emit("getList");
          this.$tools.goBack();
        });
      }
    }, 1000),
  },
};
</script>

<style lang="scss">
.add {
  .scroll-h {
    height: calc(100vh - 100rpx);
  }
  .item-list {
    padding: 25rpx 15rpx 25rpx 25rpx;
    background-color: #fff;
    .tip::before {
      position: absolute;
      z-index: 99;
      content: "*";
      top: 30rpx;
      color: $u-type-error;
      font-weight: bold;
      left: 8rpx;
    }
    .item-input {
      width: 100%;
      font-size: 26rpx;
      color: #999;
    }
    .radio {
      padding-left: 25rpx;
    }
    .text_num {
      text-align: right;
      color: #999;
    }
  }
  .submit-box {
    height: 100rpx;
    .btn {
      height: 80rpx;
      line-height: 80rpx;
      text-align: center;
      letter-spacing: 8rpx;
      margin: 0 20rpx;
      background-color: $u-type-primary;
      color: #fff;
      border-radius: $u-border-radius;
    }
  }
}
</style>
