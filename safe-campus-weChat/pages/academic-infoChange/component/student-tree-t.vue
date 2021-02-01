<template>
  <view class="">
    <ly-drawer :visible="studentTag" mode="right" width="80%" @close="close">
      <no-data msg="暂无班级数据~" v-if="noDataTag"></no-data>
      <view v-else>
        <scroll-view :scroll-y="true" class="scroll-h u-padd-t40">
          <view v-for="item in treeData" :key="item.id" class="u-padd-20">
            <view
              @click="changeItem(item)"
              class="u-fx u-mar-b10"
              style="color: #606266"
            >
              <u-icon
                :name="!item.show ? 'arrow-down-fill' : 'arrow-up-fill'"
                color="#C0C4CC"
                size="26"
                style="margin-right: 10px"
              ></u-icon>
              <view>{{ item.name }}</view>
            </view>
            <u-radio-group
              v-show="item.show"
              v-model="selectVal"
              :wrap="true"
              class="u-padd-l20"
              @change="(userId) => changeStudent(userId, item)"
            >
              <u-radio
                v-for="el in item.children"
                :key="el.id"
                :name="el.id"
                class="u-mar-t10"
              >
                {{ el.name }}
              </u-radio>
            </u-radio-group>
          </view>
        </scroll-view>
      </view>
      <view class="footer">
        <view class="button confirm" @tap="confirm">确定</view>
        <view class="button cancle" @tap="close">取消</view>
      </view>
    </ly-drawer>
  </view>
</template>

<script>
import LyDrawer from "@/components/ly-drawer/ly-drawer.vue";
import LyTree from "@/components/ly-tree/ly-tree.vue";
import noData from "@/components/no-data/no-data.vue";
import $ajax from "@u/request.js";
import hostEnv from "../../../config/index.js";
export default {
  components: {
    LyTree,
    noData,
    LyDrawer,
  },
  watch: {
    searchText(val) {
      this.$refs.tree.filter(val);
    },
    classChecked(val) {
      this.selectedData = val.map((el) => {
        return {
          ...el,
          type: "2",
        };
      });
      this.checkedKeys = val.map((el) => {
        return el.classCode;
      });
    },
  },
  props: {
    isClear: {
      //关闭弹窗清楚选择
      type: Boolean,
      default: false,
    },
    isCheck: {
      type: Boolean,
      default: false,
    },
    isRadio: {
      type: Boolean,
      default: false,
    },
    studentTag: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    classChecked: {
      type: Array,
      default: () => {
        return [];
      },
    },
    schoolInfo: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      noDataTag: false,
      ready: false,
      searchText: "",
      props: {
        label: "name",
        children: "children",
        isLeaf: "leaf",
      },
      selectedData: [],
      treeData: [],
      checkedKeys: [],
      selectVal: "",
      userInfo: {},
    };
  },
  created() {
    // this.getTreeData();
  },
  methods: {
    close() {
      this.searchText = "";
      if (this.isClear && this.$refs.tree) {
        this.$refs.tree.setCheckAll(false);
      }
      this.$emit("close");
    },
    confirm() {
      this.$emit("confirm", this.userInfo);
    },
    changeItem(item) {
      const { id, show, children } = item;
      this.treeData = this.treeData.map((el) => {
        if (id === el.id) {
          return {
            ...item,
            show: !el.show,
          };
        }
        return el;
      });
      if (!show && children.length === 0) {
        this.getStudent(item);
      }
    },
    changeStudent(userId, values) {
      this.selectVal = userId;
      const obj = values.children.find((item) => item.id === userId);
      this.userInfo = {
        ...values,
        user: obj,
      };
    },
    getTreeData() {
      $ajax
        .get({
          url: `${hostEnv.protal_api_8092}/class/manage/query/by/teachercode?schoolCode=${this.schoolInfo.schoolCode}&teacherCode=${this.schoolInfo.userCode}`,
        })
        .then((res) => {
          if (!res.data || res.data.length === 0) {
            this.noDataTag = true;
            return;
          }
          this.noDataTag = false;
          const list = res.data.map((item) => {
            return {
              ...item,
              name: `${item.gradeName}级/${item.subjectName}/${item.className}`,
              children: [],
              show: false,
            };
          });
          this.treeData = list;
          this.ready = true;
        })
        .catch(() => {
          this.noDataTag = true;
        });
    },
    getStudent(item) {
      $ajax
        .post({
          url: `${hostEnv.protal_api_11002}/student/manage/list`,
          params: {
            classCode: item.classCode,
            gradeCode: item.gradeCode,
            schoolCode: this.schoolInfo.schoolCode,
            subjectCode: item.subjectCode,
            page: 1,
            size: 9999,
          },
        })
        .then((res) => {
          const list = res.data.list.map((el) => {
            return {
              ...el,
              name: el.userName,
              leaf: true,
            };
          });
          const index = this.treeData.findIndex((el) => el.id === item.id);
          const obj = { ...this.treeData[index], children: list };
          this.$set(this.treeData, index, obj);
        });
    },
  },
};
</script>
<style lang="scss">
.footer {
  position: fixed;
  z-index: 998;
  left: 0;
  bottom: 0;
  background: #ffffff;
  width: 100%;
  height: 100rpx;
  overflow: hidden;
  box-shadow: 1rpx 1rpx 8px #c7c7c7;
}

.footer .button {
  width: 50%;
  border: none;
  text-align: center;
  float: right;
  font-size: 30rpx;
  border-radius: 0;
  height: 100rpx;
  line-height: 100rpx;
}

.footer .button:after {
  width: 0;
  height: 0;
}

.footer .button.confirm {
  background: #2979ff;
  color: #fff;
}

.footer .button.cancle {
  background: #f5f5f5;
}

.ly-search {
  margin: 0rpx 30rpx;
  padding-top: 20rpx;
  padding-bottom: 15rpx;
  border-bottom: 1px solid #ededed;
}

uni-input {
  font-size: 28rpx;
}

.scroll-h {
  height: calc(100vh - 160rpx);
}
</style>
