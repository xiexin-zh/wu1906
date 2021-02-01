<template>
  <view class="u-page u-bg-fff u-auto">
    <view class="add" v-if="showTag === '1'">
      <view class="u-fx u-bd-b item-list input-area">
        <view class="tip">活动心得：</view>
        <view class="u-fx-f1 mar-r20">
          <textarea
            class="item-input u-content-color"
            maxlength="200"
            v-model="recordInfo.content"
            placeholder="请输入活动心得"
          />
        </view>
      </view>
      <view class="u-fx u-bd-b item-list">
        <view>上传图片：</view>
        <view class="u-fx-f1">
          <view class="u-fx-f1">
            <an-upload-img total="9" v-model="recordInfo.attachList" class="upload"></an-upload-img>
          </view>
        </view>
      </view>
      <view class="submit-box">
        <view class="btn" @click="submit">提交</view>
      </view>
    </view>
    <view class="edit" v-else>
      <view class="u-fx item-list" v-if="recordInfo.attachList.length > 0">
        <view>附件：</view>
        <view class="u-fx-f1">
          <view class="u-fx-f1">
            <an-upload-img disabled v-model="recordInfo.attachList" class="upload"></an-upload-img>
          </view>
        </view>
      </view>
      <view class="content u-padd-t u-content-color" v-html="recordInfo.content"></view>
    </view>
  </view>
</template>

<script>
import { store, actions } from "./store/index.js";
import eventBus from "@u/eventBus";
import hostEnv from "../../config/index.js";
import anUploadImg from "@/components/an-uploadImg/an-uploadImg";
export default {
  components: {
    anUploadImg
  },
  data() {
    return {
      showTag: "1",
      recordInfo: {
        content: "",
        attachList: []
      },
      id: ""
    };
  },
  watch: {},
  computed: {},
  async mounted() {
    this.id = this.$tools.getQuery().get("id");
    this.detailGet();
  },
  methods: {
    async detailGet() {
      const res = await actions.getMeetRecordById(this.id);
      if (res.data === null) {
        this.showTag = "1";
      } else {
        this.showTag = "2";
        this.recordInfo.content = res.data.content;
        res.data.attachList.forEach(ele => {
          this.recordInfo.attachList.push({
            name: ele.fileName,
            url: ele.fileUrl
          });
        });
      }
    },
    async submit() {
      if (this.recordInfo.content === "") {
        this.$tools.toast("请填写活动心得");
        return;
      }

      const req = {
        placeReserveId: this.id,
        schoolCode: store.userInfo.schoolCode,
        content: this.recordInfo.content,
        attachList: this.recordInfo.attachList.map(ele => {
          return {
            fileUrl: ele.url
          };
        })
      };
      const res = await actions.addMeetRecord(req);
      this.$tools.toast("提交成功", "success");
      this.$tools.goNext(() => {
        this.$tools.goBack();
      });
    },
    goUpload() {},
    goDownload(url) {
      let httpUrl =
        "/img-download/" +
        url
          .replace("http://", "")
          .split("/")
          .slice(1)
          .join("/");
      /* let system = uni.getSystemInfoSync().platform;
			if(system == 'ios'){
				httpUrl = encodeURI(httpUrl);
			}
			uni.openDocument({
				httpUrl,
				success: (res) => {console.log('打开文档成功');}
			}) */ uni.downloadFile(
        {
          url: httpUrl, //下载地址接口返回
          success: data => {
            if (data.statusCode === 200) {
              //文件保存到本地
              uni.saveFile({
                tempFilePath: data.tempFilePath, //临时路径
                success: function(res) {
                  uni.showToast({
                    icon: "none",
                    mask: true,
                    title: "文件已保存：" + res.savedFilePath, //保存路径
                    duration: 3000
                  });
                  setTimeout(() => {
                    //打开文档查看
                    uni.openDocument({
                      filePath: res.savedFilePath,
                      success: function(res) {
                        // console.log('打开文档成功');
                      }
                    });
                  }, 3000);
                }
              });
            }
          },
          fail: err => {
            uni.showToast({
              icon: "none",
              mask: true,
              title: "失败请重新下载"
            });
          }
        }
      );
    }
  }
};
</script>

<style lang="scss">
.add {
  position: relative;
  .scroll-h {
    height: calc(100vh - 100rpx);
  }
  .scroll-y {
    height: calc(100vh - 40rpx);
  }
  .item-list {
    padding: 25rpx 15rpx 25rpx 25rpx;
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
      color: $u-tips-color;
    }
  }
  .input-area {
    height: 650rpx;
  }
  /deep/ .uni-textarea-textarea {
    border: 1rpx solid $u-border-color;
    padding: 20rpx;
    height: 600rpx;
    line-height: 50rpx;
    color: $u-content-color;
  }
  /deep/ .uni-textarea-placeholder {
    padding: 20rpx;
  }
  .submit-box {
    position: fixed;
    bottom: 0;
    height: 100rpx;
    width: 100%;
    .btn {
      height: 80rpx;
      line-height: 80rpx;
      text-align: center;
      letter-spacing: 8rpx;
      margin: 0 20rpx;
      background-color: $u-type-primary;
      color: $uni-bg-color;
      border-radius: $u-border-radius;
    }
  }
}
.edit {
  overflow-x: hidden;
  padding: $u-mp-20 0;
  margin: 0 $u-mp-20;
  .content {
    text-indent: 50rpx;
    line-height: 46rpx;
  }
  .content /deep/ img {
    display: block;
    width: 100%;
    margin: 20rpx 0;
  }
}
</style>
