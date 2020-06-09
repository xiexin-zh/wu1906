<template>
  <div class="information">
    <div class="information-top">
        <div class="information-top-statistic">
            <p class="information-top-statistic-p">每日预约情况</p>
            <div class="information-top-statistic-div">
                <div class="information-top-statistic-left"></div>
                <span class="information-top-statistic-span">可预约总数({{list_sun}})</span>
                <div class="information-top-statistic-right"></div>
                <span class="information-top-statistic-span">已预约人数</span>
            </div>
            <div class="information-top-statistic-progress">
                <div class="statistic-progress" 
                v-for="(item, index) in settingList"
                :key="index">
                    <span class="statistic-progress-span">{{item.data}}</span>
                    <div class="statistic-progress-div">
                        <el-progress :text-inside="true" :stroke-width="26" :percentage="item.appointment_allow =='0'?0:parseFloat((item.appointment_allow/item.appointment_sun)*100).toFixed(2)"></el-progress>
                    </div>
                    <span class="statistic-progress-span">{{item.appointment_sun}}</span>
                </div>
            </div>
        </div>
        <div class="information-top-map">
            <p class="information-p">北京市地图</p>
            <img src='@/assets/copy2.png' class="information-img" v-show="area_id_flag=='1'"/>
            <img src='../../assets/copy1.png' class="information-img" v-show="area_id_flag=='4'"/>
            <img src='../../assets/copy3.png' class="information-img" v-show="area_id_flag=='3'"/>
            <img src='../../assets/copy4.png' class="information-img" v-show="area_id_flag=='2'"/>
            <img src='../../assets/copy5.png' class="information-img" v-show="area_id_flag=='13'"/>
            <img src='../../assets/copy6.png' class="information-img" v-show="area_id_flag=='7'"/>
            <img src='../../assets/copy7.png' class="information-img" v-show="area_id_flag=='8'"/>
            <img src='../../assets/copy8.png' class="information-img" v-show="area_id_flag=='6'"/>
            <img src='../../assets/copy9.png' class="information-img" v-show="area_id_flag=='5'"/>
            <img src='../../assets/copy10.png' class="information-img" v-show="area_id_flag=='10'"/>
            <img src='../../assets/copy11.png' class="information-img" v-show="area_id_flag=='11'"/>
            <img src='../../assets/copy12.png' class="information-img" v-show="area_id_flag=='12'"/>
            <img src='../../assets/copy13.png' class="information-img" v-show="area_id_flag=='9'"/>
            <img src='../../assets/copy14.png' class="information-img" v-show="area_id_flag=='14'"/>
            <div class="div1 div01" @click="areaIdFlag('1')"></div>
            <div class="div2 div01" @click="areaIdFlag('2')"></div>
            <div class="div3 div01" @click="areaIdFlag('3')"></div>
            <div class="div4 div01" @click="areaIdFlag('4')"></div>
            <div class="div5 div01" @click="areaIdFlag('5')"></div>
            <div class="div6 div01" @click="areaIdFlag('6')"></div>
            <div class="div7 div01" @click="areaIdFlag('7')"></div>
            <div class="div8 div01" @click="areaIdFlag('8')"></div>
            <div class="div9 div01" @click="areaIdFlag('9')"></div>
            <div class="div10 div01" @click="areaIdFlag('10')"></div>
            <div class="div11 div01" @click="areaIdFlag('11')"></div>
            <div class="div12 div01" @click="areaIdFlag('12')"></div>
            <div class="div13 div01" @click="areaIdFlag('13')"></div>
            <div class="div14 div01" @click="areaIdFlag('14')"></div>
        </div>
        <div class="information-top-proportion">
            <div class="information-proportion-top">
                <p class="information-proportion-p">注册总人数</p>
                <div class="information-proportion-div">
                    <span>总</span>
                    <span class="information-proportion-div-span">{{list}}</span>
                    <span>人</span>
                </div>
            </div>
            <div class="information-proportion-bottom">
                <p class="proportion-bottom-p">占比情况</p>
                <div class="cylindrical">
                    <div id="cylindrical"></div>
                </div>
                <p class="proportion-p-bottom">网上祭祀:  <span style="color:#608EB6;marign:0 5px">{{data}}</span>人</p>
            </div>
        </div>
    </div>
    <div class="information-bottom">
        <div class="information-bottom-left">
            <p class="information-bottom-left-p">当日时间段预约分布</p>
            <div id="information"></div>
        </div>
        <div class="information-bottom-left">
            <p class="information-bottom-left-p">历史数据统计</p>
            <div id="statistics"></div>
        </div>
    </div>
  </div>
</template>

<script>
import { statisticsGetCharts } from "../../api/reserve"
export default {
    name: "statisticAnalysis",
  data() {
      return {
          list_sun:"",
          data: '',
          list:'',
          datafromList: [],
          datafromData: [],
          datafromDate:[],
          area_id_flag:"14",
          nearlyDay:[],
          nearlyWeek11:[],
          nearlyWeek1:[],
          nearlyWeekList: [],
          nearlyDate: [],
          total:{},
          areaData:[],
          settingList:[],
      }
  },
    watch: {
          
        },
  components: {  },
  mounted() {
    this.GetCharts();
  },
  methods: {
      pieChart(){
           let myChart = this.$echarts.init(document.getElementById('cylindrical'));
           let{photo_num,on_line_num,intercede_num}=this.total
           
           let option = {
            title: {
               left: 'center'
            },
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b} : {c} ({d}%)'
            },
            legend: {
                bottom: 10,
                left: 'center',
            },
            series: [
               {
                   type: 'pie',
                   radius: '65%',
                   center: ['50%', '50%'],
                   selectedMode: 'single',
                   data: [
                       {value: parseInt(on_line_num),name: '网上预约'},
                       {value: parseInt(photo_num), name: '电话预约'},
                       {value: parseInt(intercede_num), name: '代为祭扫'},
                   ],
               }
            ]
           };
          myChart.setOption(option);

      },
      distribution(){
          let information = this.$echarts.init(document.getElementById('information'));
          let nearlyList = this.nearlyWeekList
          let neaDate = this.nearlyDate
          let  option = {
              tooltip: {
                      trigger: 'axis',
                      axisPointer: {
                          type: 'cross',
                          label: {
                              backgroundColor: '#6a7985'
                          }
                      }
                  },
                //   legend: {
                //       data: ['当日预约人数']
                //   },
                 xAxis: {
                  type: 'category',
                  data: neaDate,
                  backgroundStyle: {
                      color: '#608EB6'
                  },
                  
              },
              yAxis: {
                  type: 'value',
                //  data: ['4','8','12']
              },
              series: [{
                  data:  nearlyList,
                  type: 'bar',
                  showBackground: true,
                  backgroundStyle: {
                      color: '#ccc'
                  },
                  itemStyle: {
                      color: "#608EB6"
                  }
              }]
          };

          information.setOption(option);
      },
      statistics(){
          let statistics = this.$echarts.init(document.getElementById('statistics'));
        //   let value = [ '1', '2','3']
          let option = {
                  tooltip: {
                      trigger: 'axis',
                      axisPointer: {
                          type: 'cross',
                          label: {
                              backgroundColor: '#6a7985'
                          }
                      }
                  },
                  legend: {
                      data: ['当日预约', '实际入园']
                  },
                  grid: {
                      left: '3%',
                      right: '4%',
                      bottom: '3%',
                      containLabel: true
                  },
                  xAxis: [
                      {
                          type: 'category',
                          boundaryGap: false,
                          data: this.datafromDate
                      }
                  ],
                  yAxis: [
                      {
                          type: 'value',
                          data: ['5','10','15','20','25']
                      }
                  ],
                  series: [
                      {
                          name: '当日预约',
                          type: 'line',
                          stack: '总量',
                          areaStyle: {},
                          data: this.datafromData
                      },
                      {
                          name: '实际入园',
                          type: 'line',
                          stack: '总量',
                          areaStyle: {},
                          data: this.datafromList
                      },
                  ]
              };
              statistics.setOption(option);
      },
      areaIdFlag(data){
          if(data == "14"){
              this.initialize(1);
          }else if(data == '1'){
              this.initialize(13);
          }else if(data == '4'){
              this.initialize(4);
          }else if(data == '3'){
              this.initialize(5);
          }else if(data == '2'){
              this.initialize(12);
          }else if(data == '5'){
              this.initialize(14);
          }else if(data == '6'){
              this.initialize(3);
          }else if(data == '7'){
              this.initialize(11);
          }else if(data == '13'){
              this.initialize(7);
          }else if(data == '10'){
              this.initialize(8);
          }else if(data == '11'){
              this.initialize(10);
          }else if(data == '12'){
              this.initialize(6);
          }else if(data == '8'){
              this.initialize(2);
          }else if(data == '9'){
              this.initialize(9);
          }
          this.area_id_flag = data;
          
      },
      async GetCharts(){
          const res = await statisticsGetCharts({});
          if(res.error== '0'){
            this.areaData = res.data;
            console.log(res.data);
            this.list = res.data[0].reg_total
            this.data = res.data[0].order_total
            this.initialize(1)
          }else if(res.error == '1'){
              this.$message.error(res.msg);
          }
      },
      initialize(data){
          data = parseInt(data);
          this.nearlyDate = [];
          this.nearlyWeek = [];
          this.nearlyWeekList = [];
          this.datafromList = [];
          this.datafromDate = [];
          this.datafromData = [];
          this.settingList = this.areaData[data].nearlyWeek;
          this.list_sun = this.settingList[0].appointment_sun;
          this.total = this.areaData[data].total;
          this.nearlyWeek1 = this.areaData[data].nearlyWeek1;
          this.nearlyWeek11 = this.areaData[data].nearlyWeek11;
          this.nearlyDay = this.areaData[data].nearlyDay;
          this.nearlyDay.forEach(element=>{
              this.nearlyWeekList.push(element.appointment);
              this.nearlyDate.push(element.datalist);
          });
          this.nearlyWeek1.forEach(element=>{
              this.datafromList.push(element.appointment_list);
              this.datafromDate.push(element.datafrom);
          });
          this.nearlyWeek11.forEach(element=>{
              this.datafromData.push(element.appointment_data);
          });
          
        this.pieChart();
        this.distribution();
        this.statistics();

      }
  }
};
</script>

<style scoped lang="less">
#cylindrical {
    position: absolute;
    top: -20px;
    left: 0;
    width:400px;
    height: 280px;
  }
#information{
    width: 647px;
    height: 358px;
}
#statistics {
    width: 647px;
    height: 358px;
}
.information {
  width:98%;
  height:98%;
  margin: 1% 1%;
  background:rgba(255,255,255,1);
  border-radius:4px;
  border:1px solid rgba(231,231,231,1);
  
  .information-top {
      height:480px;
      overflow: hidden;
      .information-top-statistic{
          float: left;
          display: inline-block;
          width:30%;
          height:461px;
          margin: 15px 10px;
          padding-left: 10px;
          background:rgba(255,255,255,1);
          border-radius:4px;
          border:1px solid rgba(231,231,231,1);
          .information-top-statistic-p {
              font-size:14px;
              font-family:PingFangSC-Regular,PingFang SC;
              font-weight:400;
              color:rgba(74,74,74,1);
              line-height:40px;
          }
          .information-top-statistic-div {
              vertical-align: top;
              .information-top-statistic-left {
                  display: inline-block;
                  width:20px;
                  height:20px;
                  margin: 0 5px;
                  background:rgba(241,241,241,1);
              }
              .information-top-statistic-right {
                  display: inline-block;
                  width:20px;
                  height:20px;
                  margin: 0 5px;
                  background-color: #409EFF;
              }
              .information-top-statistic-span {
                  line-height: 20px;
                  font-size:12px;
                  font-family:PingFangSC-Regular,PingFang SC;
                  font-weight:400;
                  color:rgba(74,74,74,1);
              }
          }
          .information-top-statistic-progress {
              .statistic-progress {
                  width: 100%;
                  .statistic-progress-span {
                      margin: 0 5px;
                  }
                  /deep/.statistic-progress-div {
                      margin-top: 10px;
                      display: inline-block;
                      width: 70%;
                      .el-progress-bar__outer {
                          border-radius: 0;
                          width: 100%;
                          .el-progress-bar__inner {
                              border-radius: 0;
                          }
                      }
                  }
              }
          }
      }
      .information-top-map {
          position: relative;
          display: inline-block;
          width:36.5%;
          height:461px;
          margin: 15px 0;
          background:rgba(255,255,255,1);
          border-radius:4px;
          border:1px solid rgba(231,231,231,1);
          .information-img {
              margin: 20px 20px 20px 40px;
              width: 85%;
          }
          .information-p {
              position: absolute;
              top: 10px;
              left: 15px;
          }
          .div01 {
              width: 20px;
              height: 20px;
            //   background-color: red;
          }
          .div1 {
              position: absolute;
              top: 144px;
              left: 172px;
          }
          .div2 {
              position: absolute;
              top: 159px;
              left: 326px;
          }
          .div3 {
              position: absolute;
              top: 177px;
              left: 245px;
          }
          .div4 {
              position: absolute;
              top: 209px;
              left: 191px;
          }
          .div5 {
              position: absolute;
              top: 254px;
              left: 100px;
          }
          .div6 {
              position: absolute;
              top: 254px;
              left: 185px;
          }
          .div7 {
              position: absolute;
              top: 232px;
              left: 277px;
          }
          .div8 {
              position: absolute;
              top: 280px;
              left: 245px;
          }
          .div9 {
              position: absolute;
              top: 291px;
              left: 174px;
          }
          .div10 {
              position: absolute;
              top: 325px;
              left: 118px;
          }
          .div11 {
              position: absolute;
              top: 344px;
              left: 208px;
          }
          .div12 {
              position: absolute;
              top: 317px;
              left: 281px;
          }
          .div13 {
              position: absolute;
              top: 222px;
              left: 359px;
          }
          .div14 {
              position: absolute;
              top: 274px;
              left: 215px;
          }
      }
      .information-top-proportion {
          float: right;
          display: inline-block;
          width:29%;
          height:461px;
          margin: 15px 10px;
          background:rgba(255,255,255,1);
          .information-proportion-top {
              width: 100%;
              height:160px;
              background:rgba(255,255,255,1);
              border-radius:4px;
              border:1px solid rgba(231,231,231,1);
              .information-proportion-p {
                  margin: 10px 15px;
                  font-size:14px;
                  font-family:PingFangSC-Regular,PingFang SC;
                  font-weight:400;
                  color:rgba(74,74,74,1);
              }
              .information-proportion-div {
                  width: 100%;
                  text-align: center;
                  height: 120px;
                  line-height: 100px;
                  .information-proportion-div-span {
                      margin: 0 15px;
                      font-size:30px;
                      font-family:PingFangSC-Semibold,PingFang SC;
                      font-weight:600;
                      color:rgba(141,147,255,1);
                  }
              }
          }
          .information-proportion-bottom {
              position: relative;
              width: 100%;
              height:292px;
              margin-top: 5px;
              background:rgba(255,255,255,1);
              border-radius:4px;
              border:1px solid rgba(231,231,231,1);
              .proportion-bottom-p {
                  margin: 10px;
                  font-size:14px;
                  font-family:PingFangSC-Regular,PingFang SC;
                  font-weight:400;
                  color:rgba(74,74,74,1);
              }
              .proportion-bottom-div {
                  vertical-align: top;
                  .proportion-bottom-left {
                      display: inline-block;
                      width:20px;
                      height:20px;
                      margin: 0 5px;
                      margin-left: 15px;
                      background: #8D93FF;
                  }
                  .proportion-bottom-right {
                      display: inline-block;
                      width:20px;
                      height:20px;
                      margin: 0 5px;
                      background:#4C9AE0;
                  }
                  .proportion-bottom-zhong {
                      display: inline-block;
                      width:20px;
                      height:20px;
                      margin: 0 5px;
                      background:#4EDDCF;
                  }
                  .proportion-bottom-span {
                      line-height: 20px;
                      font-size:12px;
                      font-family:PingFangSC-Regular,PingFang SC;
                      font-weight:400;
                      color:rgba(74,74,74,1);
                      margin-right: 15px;
                  }
              }
              .proportion-p-bottom {
                  position: absolute;
                  bottom: 14px;
                  left: 12px;
                  margin-top: 15px;
                  text-align: center;
                  font-size:14px;
                  font-family:PingFangSC-Regular,PingFang SC;
                  font-weight:400;
                  color:rgba(74,74,74,1);
              }
          }
      }
  }
  .information-bottom {
      .information-bottom-left {
          position: relative;
          display: inline-block;
          width:623px;
          height:358px;
          margin: 10px;
          background:rgba(255,255,255,1);
          border-radius:4px;
          border:1px solid rgba(231,231,231,1);
          .information-bottom-left-p {
              position: absolute;
              top: 5px;
              left: 10px;
              font-size:14px;
              font-family:PingFangSC-Regular,PingFang SC;
              font-weight:400;
              color:rgba(74,74,74,1);
          }
      }
  }
}
</style>
