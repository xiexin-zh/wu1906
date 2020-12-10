<template>
  <view class="total-select u-fx-je u-padd-20 u-bd-b">
    <u-select
      v-model="showDate"
      :list="dateList"
      @confirm="chooseType"
    ></u-select>
    <u-select
      v-model="showSubject"
      :list="subjectList"
      @confirm="chooseType"
    ></u-select>
    <view class="select-type u-fx-ac u-content-color" @tap="_showDate">
      <view>{{ currentDatetName }}</view>
      <view class="rit-arrow"></view>
    </view>
    <view
      class="select-type u-fx-ac u-content-color u-mar-l20"
      @tap="_showSubject"
    >
      <view>{{ currentSubjectName }}</view>
      <view class="rit-arrow"></view>
    </view>
  </view>
</template>

<script>
import { store } from "@store";
export default {
  props: {
    current: {
      type: Number,
      default: 0,
    },
  },
  mounted() {
    this.getDateList();
  },
  watch: {
    current() {
      this.getDateList();
    },
  },
  computed: {
    subjectList: () => {
      const list = store.subjectList.map((item) => {
        return {
          value: item.subjectCode,
          label: item.subjectName,
        };
      });
      return [{ value: "", label: "全部" }, ...list];
    },
  },
  data() {
    return {
      showDate: false,
      showSubject: false,
      currentDatetName: "本周",
      currentDatetCode: "",
      currentSubjectName: "全部",
      currentSubjectCode: "",
      dateList: [],
    };
  },
  methods: {
    _showDate() {
      this.type = 1;
      this.showDate = true;
    },
    _showSubject() {
      this.type = 2;
      this.showSubject = true;
    },
    chooseType(item) {
      if (this.type === 2) {
        this.currentSubjectName = item[0].label;
        this.currentSubjectCode = item[0].value;
      } else if (this.type === 1) {
        this.currentDatetName = item[0].label;
        this.currentDatetCode = item[0].value;
      }
      this.$emit("change", {
        subjectCode: this.currentSubjectCode,
        startTime:
          new Date(this.currentDatetCode.split("~")[0]).getTime() ||
          new Date(
            this.current === 0
              ? this.$tools.getNowWeekDate()[0]
              : this.$tools.getNowWMonthDate()[0]
          ).getTime(),
        endTime:
          new Date(this.currentDatetCode.split("~")[1]).getTime() ||
          new Date(
            this.current === 0
              ? this.$tools.getNowWeekDate()[1]
              : this.$tools.getNowWMonthDate()[1]
          ).getTime(),
      });
    },
    getDateList() {
      this.currentDatetName = this.current === 0 ? "本周" : "本月";
      this.currentSubjectName = "全部";
      if (this.current === 0) {
        const date = new Date();
        const year = new Date().getFullYear();
        const month = new Date().getMonth() + 1;
        let weekIndex = "";
        const monthList = this.$tools
          .getWeeks(`${year}-${month}`)
          .map((item, index) => {
            return {
              value: [new Date(item[0]), new Date(item[1])],
              label: `${year}年${month}月第${index + 1}周`,
              timeOut: this.getTime(date, [
                new Date(item[0]),
                new Date(item[1]),
              ]),
            };
          });
        monthList.forEach((item, index) => {
          if (item.timeOut) {
            weekIndex = index;
            return;
          }
        });
        const dateList = monthList
          .slice(0, weekIndex + 1)
          .reverse()
          .map((item) => {
            if (item.timeOut) {
              return {
                ...item,
                label: "本周",
              };
            }
            return item;
          });
        this.dateList = dateList.map((item) => {
          return {
            ...item,
            value: `${this.$tools.getDateTime(
              item.value[0],
              "date"
            )}~${this.$tools.getDateTime(item.value[1], "date")}`,
          };
        });
      } else {
        const monthArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
				const nowYear = new Date().getFullYear()
        const nowMonth = new Date().getMonth() + 1;
        const nowMonthIndex = monthArr.indexOf(nowMonth);
        const monthBlock = monthArr.slice(0, nowMonthIndex + 1);
        const dateList = monthBlock
          .map((item) => {
						const time = new Date(`${nowYear}-${item}`)
            return {
              value: this.$tools.getNowWMonthDate(time),
              label: `${new Date().getFullYear()}年${item}月`,
            };
          })
          .reverse()
          .map((item, index) => {
            if (index === 0) {
              return {
                ...item,
                label: "本月",
              };
            }
            return item;
          });
        this.dateList = dateList.map((item) => {
          return {
            ...item,
            value: `${this.$tools.getDateTime(
              item.value[0],
              "date"
            )}~${this.$tools.getDateTime(item.value[1], "date")}`,
          };
        });
      }
    },
    getTime(time, timeArr) {
      if (time >= timeArr[0] && time < timeArr[1]) {
        return true;
      }
      return false;
    },
  },
};
</script>

<style lang="scss" scoped>
.total-select {
  .select-type {
    border: 1px #ddd solid;
    padding: 8rpx 20rpx;
    border-radius: 40rpx;
  }
}
</style>
