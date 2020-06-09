<template>
  <div class="task-calendars">
    <div class="add-btn">
      <el-button type="primary" @click="newTask">
        創建日程
      </el-button>
    </div>
    <div ref="hoverDialog" class="hover-dialog">
      <div class="img-content">
        <span>{{ hoverDialogList.start_time | moment("YYYY-MM-DD") }}</span>
        <span v-if="hoverDialogList.end_time">
          - {{ hoverDialogList.end_time | moment("YYYY-MM-DD") }}</span
        >
      </div>
      <div>
        {{ hoverDialogList.text }}
      </div>
    </div>
    <!-- 日历 -->
    <div id="calendar" v-loading="loading"></div>
    <!-- 新建日程 -->
    <!-- <create-schedule
      v-if="showDialog"
      :text="newText"
      :formData="formData"
      @onSubmit="onSubmit"
      @closeDialog="closeDialog"
    >
    </create-schedule> -->
    <c-r-m-create-view
      v-if="showDialog"
      crm-type="leads"
      :editBtn="listData"
      @hiden-view="showDialog = false"
      :titleList="titleLists"
      crmType="customer"
      :action="createActionInfo"
      currentHash="crm_customer_schedule"
      @onSubmitLoading="onSubmit"
      :formData="formData"
    >
    </c-r-m-create-view>
    <!-- 详情 -->
    <v-details
      v-if="dialogVisible"
      :dialogVisible="dialogVisible"
      :listData="listData"
      @editBtn="editBtn"
      @deleteClose="deleteClose"
      @handleClose="handleClose"
    >
    </v-details>
  </div>
</template>

<script>
import $ from "jquery";
import fullcalendar from "fullcalendar";
import "fullcalendar/dist/locale/zh-cn.js";
import createSchedule from "./components/createSchedule";
import VDetails from "./components/details";
import CRMCreateView from "../../customermanagement/components/CRMCreateView";
// API
import {
  scheduleRead,
  scheduleList,
  scheduleAdd,
  scheduleEdit
} from "@/api/oamanagement/schedule";

import { getDateFromTimestamp } from "@/utils";
import moment from "moment";
export default {
  name: "schedule",
  components: {
    CRMCreateView,
    createSchedule,
    VDetails
  },
  data() {
    return {
      titleLists: "",
      showDialog: false,
      hoverDialogList: {},
      dialogVisible: false,
      formData: {
        checkList: []
      },
      // classList:{},
      newtext: "",
      loading: true,
      // 详情数据
      listData: {},
      list: [],
      createActionInfo: {
        types: "crm_customer_travel",
        module: "crm",
        controller: "customer_detail",
        action: "save"
      }
    };
  },
  props: {
    id: [String, Number]
    // listData: {

    // }
  },
  watch: {
    $route(to, from) {
      this.$router.go(0);
    },
    list: {
      immediate: true,
      deep: true,
      handler(val1, val2) {}
    },
    id: function(val) {
      $("#calendar").fullCalendar("refetchEvents");
    }
  },
  mounted() {
    this.listFun();
    this.Bus.$on("onSubmitLoading", data => {
      this.onSubmit();
    });
  },
  methods: {
    // 初始化日历任务
    listFun() {
      let _this = this;
      $("#calendar").fullCalendar({
        height: document.documentElement.clientHeight - 200,
        nextDayThreshold: "00:00:00",
        dayClick: function(date, jsEvent, view) {
          _this.newText = "創建日程";
          _this.showDialog = true;
          _this.formData = {
            start_time: date._i,
            end_time: date._i,
            checkList: []
          };
        },
        // 点击显示详情
        eventClick: function(val, key) {
          setTimeout(res => {
            let classColor = document.getElementsByClassName(
              "el-dialog__title"
            )[8];
            classColor.style.color = val.color_value;
          }, 100);
          let list = [];
          list.push(val.start_time, val.end_time);
          val.time = list;
          _this.listData = val;

          _this.showParticulars(val);
        },
        header: {
          left: "today,agendaDay,agendaWeek,month",
          center: "title",
          right: " prevYear,prev, next,nextYear"
        },
        eventMouseover: function(event, jsEvent, view) {
          _this.$refs.hoverDialog.style.display = "block";
          _this.$refs.hoverDialog.style.width =
            document.getElementsByClassName("fc-day")[0].offsetWidth + "px";
          _this.$refs.hoverDialog.style.left =
            jsEvent.currentTarget.offsetLeft - 5 + "px";
          _this.$refs.hoverDialog.style.top =
            jsEvent.clientY - jsEvent.offsetY - 130 + "px";
          _this.$refs.hoverDialog.style.color = event.color_value;
          _this.hoverDialogList = {
            time: event.start._i,
            start_time: event.start_time,
            end_time: event.end_time,
            text: event.title,
            type: event.ScheduleType,
            color: event.color,
            priority: event.priority
          };
        },
        eventMouseout: function(event, jsEvent, view) {
          _this.$refs.hoverDialog.style.display = "none";
        },
        events: function(start, end, timezone, callback) {
          _this.loading = true;
          let start_date = moment(start).valueOf() / 1000;
          let end_date = moment(end).valueOf() / 1000;
          scheduleList({
            customer_id: _this.id,
            start_time: start_date,
            end_time: end_date
          })
            .then(res => {
              let list = res.data.list.map(item => {
                item.start = moment(
                  getDateFromTimestamp(item.start_time)
                ).format("YYYY-MM-DD HH:mm:ss");
                item.end = moment(getDateFromTimestamp(item.end_time)).format(
                  "YYYY-MM-DD HH:mm:ss"
                );
                return item;
              });

              callback(list);
              _this.loading = false;
              list.forEach((item, index) => {
                if (item.travel_type == "入場動態") {
                  setTimeout(res => {
                    document.querySelectorAll(".fc-title")[index] &&
                      document
                        .querySelectorAll(".fc-title")
                        [index].classList.add("before");
                  }, 100);
                } else if (item.travel_type == "接觸") {
                  setTimeout(res => {
                    document.querySelectorAll(".fc-title")[index] &&
                      document
                        .querySelectorAll(".fc-title")
                        [index].classList.add("after");
                  }, 100);
                } else if (item.travel_type == "約見") {
                  setTimeout(res => {
                    document.querySelectorAll(".fc-title")[index] &&
                      document
                        .querySelectorAll(".fc-title")
                        [index].classList.add("eventY");
                  }, 100);
                } else if (item.travel_type == "禮遇") {
                  setTimeout(res => {
                    document.querySelectorAll(".fc-title")[index] &&
                      document
                        .querySelectorAll(".fc-title")
                        [index].classList.add("liyu");
                  }, 100);
                }
              });
            })
            .catch(err => {
              _this.loading = false;
            });
        }
      });
    },
    // 详情数据
    showParticulars(val) {
      this.dialogVisible = true;
    },
    // 详情关闭
    handleClose() {
      this.dialogVisible = false;
    },
    // 详情删除
    deleteClose(val) {
      $("#calendar").fullCalendar("refetchEvents");
      this.handleClose();
    },
    // 详情编辑
    editBtn(val) {
      this.titleLists = "編輯日程";
      let times = [];
      for (let item of val.time) {
        times.push(item * 1000);
      }
      val.start_time = times[0];
      val.end_time = times[1];
      this.formData = val;
      this.handleClose();
      this.showDialog = true;
      this.createActionInfo.action = "update";
    },
    // 新建按钮
    newTask() {
      this.createActionInfo.action = "save";
      this.titleLists = "新增日程";
      this.showDialog = true;
      this.formData = {
        checkList: []
      };
    },
    // 新建日程关闭按钮
    closeDialog() {
      this.showDialog = false;
    },
    // 新建提交
    onSubmit(data, file) {
      if ((this.createActionInfo.action = "save")) {
        this.$message.success("新建成功");
        $("#calendar").fullCalendar("refetchEvents");
        this.closeDialog();
      } else {
        this.$message.success("編輯成功");
        $("#calendar").fullCalendar("refetchEvents");
        this.closeDialog();
      }
    }
    // onSubmitDialog(){
    //   $(function() {
    //     this.listFun();
    //   });
    // }
  },
  updated() {}
};
</script>

<style>
@import "fullcalendar/dist/fullcalendar.css";
</style>

<style lang="scss" scoped>
.task-calendars {
  position: relative;
  border: 1px solid #e6e6e6;
  border-radius: 4px;
  .hover-dialog {
    display: none;
    padding: 15px;
    z-index: 99;
    position: absolute;
    background: #fff;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    border-left: 2px solid transparent;
    .img-content {
      color: #999;
      margin-bottom: 10px;
      font-size: 12px;
      img {
        vertical-align: middle;
      }
    }
  }
  .add-btn {
    position: absolute;
    top: 14px;
    right: 40px;
  }
  #calendar {
    height: 100%;
    display: flex;
    flex-direction: column;
    background: #fff;
  }
  #calendar /deep/ .fc-license-message {
    display: none !important;
  }
  #calendar /deep/ .fc-toolbar {
    padding-top: 1em;
    .fc-left {
      float: none;
      padding-left: 20px;
      position: absolute;
      .fc-button-group {
        .fc-button {
          text-shadow: none;
        }
        .fc-state-default {
          background: #f0f0f0;
          padding: 0 1.2em;
          border: 0;
          margin-right: 3px;
        }
        .fc-state-down {
          box-shadow: none;
          text-shadow: none;
        }
        .fc-state-active {
          background: #005df7;
          color: #fff;
        }
      }
      .fc-today-button {
        background: #fff;
        margin-right: 50px;
      }
    }
    .fc-center {
      // margin-left: -277px;
      // position: absolute;
      // margin: -29px 0px 0px 45px;
      h2 {
        font-size: 20px;
        font-weight: normal;
        margin-top: 5px;
      }
      .fc-prevYear-button,
      .fc-prev-button,
      .fc-next-button,
      .fc-nextYear-button {
        background: none;
        border: 0;
        color: #aaa;
        outline: none;
        box-shadow: none;
      }
      .fc-button-group {
        .fc-prev-button .fc-icon-left-single-arrow:after,
        .fc-next-button .fc-icon-right-single-arrow:after {
          font-size: 160%;
          font-weight: none;
        }
      }
    }
    .fc-right {
      float: none;
      display: flex;
      justify-content: center;
    }
  }
  #calendar /deep/ .fc-view-container {
    .fc-body {
      .fc-row {
        .fc-day {
          border-color: #e9e9e9;
        }
        .fc-bg {
          .fc-sat,
          .fc-sun {
            background: #fbfbfb;
          }
          .fc-today {
            background: none;
          }
        }
        .fc-content-skeleton {
          .fc-today {
            .fc-day-number {
              background: #005df7;
              border-radius: 50%;
              padding: 3px;
              color: #fff;
              min-width: 16px;
              text-align: center;
            }
          }
          .fc-day-grid-event {
            background-color: #fff !important;
            border: 0 !important;
            border-radius: 23px;
            margin-left: 5px;
            margin-right: 5px;
            .fc-content {
              // color: #fff;
              overflow: visible;
              .fc-time {
                display: none;
              }
              /deep/.fc-title {
                float: left;
                width: 100%;
                color: #fff;
                // overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                position: relative;
                &::before {
                  position: absolute;
                  content: "";
                  display: block;
                  width: 20px;
                  height: 20px;
                  color: #fff;
                  background: #fff url(img/about.png) no-repeat;
                  background-size: 100% 100%;
                }
              }
              .after {
                &::before {
                  background: url(img/contact.png) no-repeat center !important;
                  background-size: 100% 100%;
                  display: block;
                  width: 20px;
                  height: 20px;
                }
              }
              .before {
                &::before {
                  background: url(img/dynamic.png) no-repeat center !important;
                  background-size: 100% 100%;
                  display: block;
                  width: 20px;
                  height: 20px;
                }
              }
              .eventY {
                &::before {
                  background: url(img/about.png) no-repeat center !important;
                  background-size: 100% 100%;
                  display: block;
                  width: 20px;
                  height: 20px;
                }
              }
              .liyu {
                &::before {
                  background: url(img/gift.png) no-repeat center !important;
                  background-size: 100% 100%;
                  display: block;
                  width: 20px;
                  height: 20px;
                }
              }
            }
          }
        }
        .fc-day-number {
          margin: 5px;
        }
        .fc-day-grid-event {
          border-left: 2px solid #ff9668 !important;
          border-radius: 0;
          margin-left: 0;
          margin-right: 0;
          padding: 2px 15px;
        }
      }
    }
    .fc-body > tr > .fc-widget-content {
      border: 0;
    }
    .fc-head {
      .fc-head-container {
        border: 0;
        border-bottom: 1px solid #ddd;
      }
    }
  }
  #calendar /deep/ .fc-day-header {
    background: #f5f5f5;
    border-width: 0;
    font-weight: normal;
    span {
      height: 50px;
      line-height: 50px;
    }
  }
}
</style>
