import React from "react";
import echarts from "echarts/lib/echarts";
import "echarts/lib/chart/bar";
// 引入提示框和标题组件
import "echarts/lib/component/tooltip";
import "echarts/lib/component/title";

import zdq from "../../assets/zdq.jpg";
import hyx from "../../assets/hyx.jpg";
import yay from "../../assets/yay.jpg";
import jl from "../../assets/jl.jpg";
import wcg from "../../assets/wcg.jpg";
import zzx from "../../assets/zzx.jpg";

import styles from "./index.css";

const colorMap = {
  "010": "#5B8FF9",
  "011": "#5AD8A6",
  "012": "#5D7092",
  "013": "#F6BD16",
  "014": "#E86452",
  "015": "#6DC8EC",
  "016": "#945FB9",
  "017": "#FF9845",
  "018": "#1E9493",
};

function fullScreen() {
  var element = document.documentElement;
  if (element.requestFullscreen) {
    console.log(element.requestFullscreen);
    element.requestFullscreen();
  } else if (element.msRequestFullscreen) {
    element.msRequestFullscreen();
  } else if (element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  } else if (element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen();
  }
}

function exitFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  }
}

var weatherIcons = [zdq, hyx, yay, jl, wcg, zzx];

const list = {
  郑大钱: 0,
  云肖: 1,
  test: 2,
  教练: 3,
  王崇刚: 4,
  智鑫: 5,
};

const rishMap = {};

Object.values(Object.keys(list)).forEach((item, i) => {
  rishMap[`R_${i}`] = {
    height: 20,
    align: "center",
    backgroundColor: {
      image: weatherIcons[i % 6],
    },
  };
});

const option = {
  title: {
    text: "火烧屁屁榜",
  },
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "shadow",
    },
  },
  grid: {
    left: 100,
  },
  toolbox: {
    show: true,
    feature: {
      saveAsImage: {},
    },
  },
  xAxis: {
    type: "value",
    name: "屁屁分",
    axisLabel: {
      formatter: "{value}",
    },
  },
  yAxis: {
    type: "category",
    inverse: true,
    data: [],
    axisLabel: {
      formatter: function (value, i, d) {
        return "{value|" + value + "}";
      },
      margin: 20,
      rich: {
        value: {
          lineHeight: 30,
          align: "center",
        },
        ...rishMap,
      },
    },
  },

  series: [
    {
      type: "bar",
      encode: {
        // Map the "amount" column to X axis.
        x: "expScore",
        // Map the "product" column to Y axis
        y: "name",
      },
      // label: {
      //   show: true,
      //   position: 'right',
      // },
      label: {
        show: true,
        formatter: function (value, i, d) {
          // console.log(value, i);
          // if (value.dataIndex <= 2) {
          //   return `🔥 {value|${value.data.value}}`;
          // }
          // return `{value|${value.data.value}}`;

          return `{test| } {value|${value.data.value}}`;

        },
        position: "right",
        rich: {
          value: {
            lineHeight: 20,
            align: "center",
          },
          test: {
            height: 20,
            align: "center",
            backgroundColor: {
              // 换图片改这里
              image: weatherIcons[2],
            },
          },
        },
      },
      itemStyle: {
        normal: {
          // color: new echarts.graphic.LinearGradient(
          //       0, 0, 1, 0,
          //       [
          //           {offset: 0, color: 'green'},
          //           {offset: 0.5, color: 'yellow'},
          //           {offset: 1, color: 'red'}
          //       ]
          //   ),
          // color:  function (params) {
          //   console.log(params);
          //   return params.data.color;
          // },
          color: function (params) {
            // console.log(params.data.expScore);
            const colorItemGreen = { offset: 0, color: "green" };
            const colorItemYellow = { offset: 0.5, color: "yellow" };
            const colorItemRed = { offset: 1, color: "red" };
            let colorArray = [colorItemGreen];

            if (params.data.value > 120) {
              colorArray.push(colorItemYellow);
            }

            if (params.data.value > 360) {
              colorArray.push(colorItemRed);
            }

            return new echarts.graphic.LinearGradient(0, 0, 1, 0, colorArray);

            // return params.data.color;
          },
          // borderColor: 'rgba(220, 220, 220, 0.8)',
          // borderColor: function (params) {
          //   console.log(params);
          //   return params.data.color;
          // },
          borderWidth: 0,
        },
      },
      // showBackground: true,
      // backgroundStyle: {
      //   // color: 'rgba(220, 220, 220, 0.8)',
      //   borderColor: 'rgba(220, 220, 220, 0.8)',
      //   borderWidth: 2,
      // }
    },
  ],
  dataset: {
    // dimensions: ['name', 'expScore'],
    source: [],
  },
};

export default class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      time: 0,
      data: props.data.values
        .map((item) => ({
          id: item.id,
          name: item.label,
          expScore: item.value,
          color: "linear-gradient(0.25turn, green, yellow, red)",
        }))
        .sort((a, b) => (Number(a.expScore) > Number(b.expScore) ? -1 : 1)),
    };

    this.myChart = null;
  }

  componentDidMount() {
    var myChart = echarts.init(document.getElementById("main"));
    this.myChart = myChart;
    this.draw();
  }

  draw = () => {
    // 绘制图表

    const data = this.props.data.values
      .map((item) => ({
        id: item.id,
        name: item.label,
        expScore: item.value,
        color: item.color,
      }))
      .sort((a, b) => (Number(a.expScore) > Number(b.expScore) ? -1 : 1));

    if (this.state.time === 0) {
      this.myChart.setOption({
        ...option,
        dataset: {
          dimensions: ["name", "expScore"],
          source: data,
        },
        yAxis: {
          data: data
            .sort((a, b) => (Number(a.expScore) > Number(b.expScore) ? -1 : 1))
            .map((item) => item.name),
          type: "category",
          inverse: true,
          axisLabel: {
            formatter: function (value, i, d) {
              !value && console.log(value, i, d);
              return `{R_${list[value]}| }\n{value|${value}}`;
            },
            margin: 20,
            rich: {
              value: {
                lineHeight: 20,
                align: "center",
              },
              ...rishMap,
            },
          },
        },


      });
    } else {
      this.myChart.setOption({
        series: {
          data: data.sort((a, b) => (Number(a.expScore) > Number(b.expScore) ? -1 : 1)).map((item) => ({
            name: item.name,
            value: item.expScore,
            color: item.color,
          })),
        },
        yAxis: {
          data: data.sort((a, b) => (Number(a.expScore) > Number(b.expScore) ? -1 : 1)).map((item) => item.name),
        },
        // dataset: {
        //   dimensions: ["name", "expScore"],
        //   source: data,
        // },
        // yAxis: data.sort((a, b) => (Number(a.expScore) > Number(b.expScore) ? -1 : 1)).map((item) => item.name),
      });
    }

    this.setState({
      time: this.state.time + 1
    });
  }

  componentDidUpdate(nextProps) {
    const { data } = this.props;
    if (nextProps.data !== data) {
      this.draw();
    }
  }

  // UNSAFE_componentWillReceiveProps(nextProps) {
  //   this.setState(
  //     {
  //       data: nextProps.data.values
  //         .map((item) => ({
  //           id: item.id,
  //           name: item.label,
  //           expScore: item.value,
  //           color: item.color,
  //         }))
  //         .sort((a, b) => (a.expScore > b.expScore ? -1 : 1)),
  //     },
  //     this.draw
  //   );
  // }

  render() {
    // const { data } = this.state;
    // console.log(data);

    return (
      <div className={styles.normal}>
        <div id="main" style={{ width: "100%", height: '100vh' }}></div>
      </div>
    );
  }
}
