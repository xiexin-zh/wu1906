<template>
  <div class="setTime">
    <div class="box">
      <div class="date">
        <div class="header">日期</div>
        <div class="setDayAndTime">
          <span class="text">允许预约日期段</span>
          <!-- <div class="setTimeItem">
            <el-date-picker v-model="startTime" type="datetime" placeholder="请选择开始时间"></el-date-picker>
            <span>至</span>
            <el-date-picker v-model="endTime" type="datetime" placeholder="请选择结束时间"></el-date-picker>
          </div>-->
          <el-date-picker
            v-model="startAndEnd"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="getStartAndEndTime"
          ></el-date-picker>
        </div>
        <div class="setDayAndTime">
          <span class="text">每日预约截止时间点</span>
          <div class="setTimeItem">
            <el-time-select v-model="deadline" placeholder="选择时间"></el-time-select>
          </div>
        </div>
      </div>
      <div class="everyday">
        <div class="header">
          <span>每日预约时间段设置</span>
          <el-button @click="addTimes" class="btn">
            <i class="add" />
            添加时间段
          </el-button>
        </div>
        <div class="addtimelist">
          <TimeItem
            :startchange="startchange"
            :getNum="getNum"
            :endchange="endchange"
            :index="index"
            :dataItem="item"
            v-for="(item,index) in tiemlist"
            :key="item.rf_id"
            :click="deldata"
          />
        </div>
      </div>
      <div class="footer">
        <el-button @click="saveTimeSet" class="btn">保存</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { getTimeframe, setTimeframe } from "../../api/reserve.js";
import { format } from "../../utils/transform.js";
import TimeItem from "./components/TimeItem";
export default {
  data() {
    return {
      startAndEnd: "",
      deadline: "",
      tiemlist: "",
      reqStart: "",
      reqEnd: ""
    };
  },
  components: {
    TimeItem
  },
  methods: {
    async getSacrificeTime() {
      const res = await getTimeframe();
      if (res.data) {
        this.startAndEnd = [
          format(parseInt(res.data.c_starttime)),
          format(parseInt(res.data.c_endtime))
        ];
        this.reqStart = res.data.c_starttime;
        this.reqEnd = res.data.c_endtime;
        this.deadline = res.data.c_deadline;
        this.tiemlist = res.data.list;
      }
    },
    addTimes() {
      this.tiemlist = [...this.tiemlist, {}];
    },
    startchange(e, index) {
      this.tiemlist[index].rf_start = e;
    },
    endchange(e, index) {
      this.tiemlist[index].rf_end = e;
    },
    getNum(num, index) {
      this.tiemlist[index].rf_setnum = num;
    },
    getStartAndEndTime(val) {
      this.reqStart = new Date(val[0]).getTime();
      this.reqEnd = new Date(val[1]).getTime();
    },
    saveTimeSet() {
      const result = this.tiemlist.every(item => {
        return (
          item.rf_start !== null &&
          item.rf_end !== null &&
          item.rf_setnum !== null
        );
      });
    
      if (!result) {
        this.$message("请设置时间或人数")
        return;
      }
      setTimeframe({
        c_starttime: this.reqStart,
        c_endtime: this.reqEnd,
        c_deadline: this.deadline,
        list: this.tiemlist
      }).then(res => {
        if (res.error == 0) {
          this.$message({
            message: res.msg,
            type: "success"
          });
        }
      });
    },
    deldata(index) {
      this.tiemlist.splice(index, 1);
    }
  },
  mounted() {
    this.getSacrificeTime();
  }
};
</script>

<style scoped lang="less">
@iptHeight: 28px;

.setTime {
  width: 100%;
  padding: 15px;
  background: rgba(237, 240, 241, 1);
}
.box {
  width: 100%;
  height: 769px;
  background: #fff;
  padding: 20px;
  box-sizing: border-box;
}
.setDayAndTime {
  display: flex;
  align-items: center;
  margin-top: 20px;
  .text {
    margin-right: 56px;
    width: 150px;
  }
  .setTimeItem {
    > span {
      margin: 0 26px;
    }
  }
}
.everyday {
  margin-top: 50px;
  .header {
    .btn {
      background-color: #445c73;
      color: white;
      margin-left: 109px;
      .add {
        background: url("../../assets/add.png");
        height: 12px;
        width: 12px;
        display: inline-block;
      }
    }
  }
  .numbertx {
    margin: 0 26px;
  }
}
.footer {
  // margin-top: 306px;
  display: flex;
  justify-content: flex-end;
  .btn {
    width: 108px;
    height: 40px;
    color: white;
    background: rgba(68, 92, 115, 1);
  }
}

input::-webkit-input-placeholder {
  /* WebKit browsers */
  color: #dcdfe6;
}
</style>
