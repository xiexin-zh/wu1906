import React, { Component } from "react";
import { DynamicBarChart } from "../../components/Chart/index";
import { connect } from "dva";
import Socket from "../../utils/websocket";
import { webSocketUrl } from "../../utils/config";
import styles from "./index.scss";

import NewChart from "../../components/Echart/index";

const pp1 = require("../../assets/one.png");
const pp2 = require("../../assets/two.png");
const pp3 = require("../../assets/three.png");
const pp4 = require("../../assets/four.png");

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      data: {
        name: "火烧屁屁榜",
        values: [
          // {
          //   id: 1,
          //   label: "tt 1",
          //   value: 100,
          //   color: "green",
          //   textColor: "green",
          //   avatar: require("../../assets/yay.jpg"),
          // },
          // {
          //   id: 2,
          //   label: "tt 2",
          //   value: 200,
          //   color: "yellow",
          //   textColor: "green",
          //   avatar: require("../../assets/yay.jpg"),
          // },
          // {
          //   id: 3,
          //   label: "tt 3",
          //   value: 20,
          //   color: "green",
          //   textColor: "green",
          //   avatar: require("../../assets/yay.jpg"),
          // },
          // {
          //   id: 4,
          //   label: "tt 4",
          //   value: 90,
          //   color: "green",
          //   textColor: "green",
          //   avatar: require("../../assets/yay.jpg"),
          // },
          // {
          //   id: 5,
          //   label: "tt 5",
          //   value: 80,
          //   color: "green",
          //   textColor: "green",
          //   avatar: '',  //require("../../assets/yay.jpg"),
          // },
          // {
          //   id: 6,
          //   label: "tt6",
          //   value: 60,
          //   color: "green",
          //   textColor: "green",
          //   avatar: '',   // require("../../assets/yay.jpg"),
          // },
          // {
          //   id: 7,
          //   label: "tt 7",
          //   value: 30,
          //   color: "green",
          //   textColor: "green",
          //   avatar: require("../../assets/yay.jpg"),
          // }
        ],
      },
      topThree: [
        // {
        //   id: 10,
        //   label: "tt 10",
        //   value: 20,
        //   color: "green",
        //   textColor: "green",
        //   avatar: require("../../assets/yay.jpg"),
        // },
        // {
        //   id: 11,
        //   label: "tt 11",
        //   value: 420,
        //   color: "yellow",
        //   textColor: "green",
        //   avatar: require("../../assets/yay.jpg"),
        // },
        // {
        //   id: 12,
        //   label: "tt 12",
        //   value: 4200,
        //   color: "red",
        //   textColor: "green",
        //   avatar: require("../../assets/yay.jpg"),
        // },
      ],
      taskRemindInterval: null,
      titleHeight: 70,
      animateImg: require("../../assets/one.png"),
    };
  }

  // 测试数据切换
  change = () => {
    this.setState({
      data: {
        name: "火烧屁屁榜",
        values: [
          {
            id: 1,
            label: "tt 1",
            value: 100,
            color: "green",
            avatar: require("../../assets/yay.jpg"),
          },
          {
            id: 2,
            label: "tt 2",
            value: 200,
            color: ["green", "yellow"],
            avatar: require("../../assets/yay.jpg"),
          },
          {
            id: 3,
            label: "tt 3",
            value: 20,
            color: "green",
            avatar: require("../../assets/yay.jpg"),
          },
          {
            id: 4,
            label: "tt 4",
            value: 90,
            color: "green",
            avatar: require("../../assets/yay.jpg"),
          },
          {
            id: 5,
            label: "tt 5",
            value: 80,
            color: "green",
            avatar: require("../../assets/yay.jpg"),
          },
          {
            id: 6,
            label: "tt 6",
            value: 60,
            color: "green",
            avatar: require("../../assets/yay.jpg"),
          },
          {
            id: 7,
            label: "tt 7",
            value: 30,
            color: "green",
            avatar: require("../../assets/yay.jpg"),
          },
          {
            id: 8,
            label: "tt 8",
            value: 54,
            color: "green",
            avatar: require("../../assets/yay.jpg"),
          },
          {
            id: 9,
            label: "tt 9",
            value: 50,
            color: "green",
            avatar: require("../../assets/yay.jpg"),
          },
          {
            id: 10,
            label: "tt 10",
            value: 20,
            color: "green",
            avatar: require("../../assets/yay.jpg"),
          },
        ],
      },
    });
  };

  // 测试
  testData = () => {
    let time = 1;

    this.timer1 = setTimeout(() => {
      this.timer2 && clearInterval(this.timer2);
      this.timer2 = setInterval(() => {
        const data = this.state.data;
        const newData = {
          ...data,
          values: data.values.map((item) => {
            if (item.id === 24) {
              // if (time % 3 === 0) {
              //   return {
              //     ...item,
              //     value: (Number(item.value) - 10000 * Math.random()).toFixed(1),
              //   };
              // }
              return {
                ...item,
                value: (Number(item.value) + 1000 * Math.random()).toFixed(1),
              };
            } else if (item.id === 15) {
              if (time % 3 === 0) {
                return {
                  ...item,
                  value: (Number(item.value) - 1000 * Math.random()).toFixed(1),
                };
              }
              return {
                ...item,
                value: (Number(item.value) + 500 * Math.random()).toFixed(1),
              };
            } else if (item.id === 21) {
              return {
                ...item,
                value: (Number(item.value) + 500 * Math.random()).toFixed(1),
              };
            } else {
              return {
                ...item,
                value: (Number(item.value) + 100 * Math.random()).toFixed(1),
              };
            }
          }),
        };
        this.setState({ data: newData }, () => time++);
      }, 100);
    }, 2000);
  };

  startSocket = () => {
    this.socket = new Socket({
      socketUrl:
        "ws://" + webSocketUrl + ":9876/mozi/v1/lucky-52/get-firelist-pp",
      // socketUrl: "ws://l307d45463.qicp.vip/mozi/v1/lucky-52/get-firelist-pp",
      timeout: 5000,
      socketMessage: (receive) => {
        // console.log(receive.data); //后端返回的数据，渲染页面
        if (receive || receive.data) {
          function setColor(value) {
            if (value <= 120) {
              return "green";
            }
            if (value <= 360) {
              return ["green", "yellow"];
            }
            return ["green", "yellow", "red"];
          }

          let values = JSON.parse(receive.data);
          values = values.reverse().splice(0,10).reverse();
          const topThree = values
            .slice(values.length - 3, values.length)
            .reverse();
          const ppUser = values.slice(0, values.length - 3);
          const data = {
            name: "火烧屁屁榜",
            values:
              ppUser.length === 0
                ? []
                : ppUser.map((item) => {
                    return {
                      ...item,
                      color: setColor(item.value),
                      textColor: item.color,
                    };
                  }),
          };
          this.setState({
            loading: false,
            data,
            topThree,
          });
        }
      },
      socketClose: (msg) => {
        console.log(msg);
      },
      socketError: () => {
        console.log("连接建立失败");
      },
      socketOpen: () => {
        console.log("连接建立成功");
        // 心跳机制 定时向后端发数据
        // this.setState({
        //   taskRemindInterval: setInterval(() => {
        //     this.socket.sendMessage({ msgType: 0 });
        //   }, 30000),
        // });
      },
    });
    try {
      this.socket.connection();
    } catch (e) {
      // 捕获异常，防止js error
      // donothing
    }
  };

  setItemHeight = () => {
    const listBox = document.getElementById("pplist");
    if (!listBox) {
      return 0;
    }
    const listHeight = listBox.offsetHeight-10;
    const length = this.state.data.values.length || 1;
    const itemHeight = listHeight / length - 20;
    return itemHeight > 80 ? 80 : itemHeight;
  };

  // 动画效果
  timeChange = null;
  changImg = () => {
    let num = 1;
    this.timeChange = setInterval(() => {
      if (num > 4) {
        num = 1;
      }
      let ppImg = pp3;
      if (num === 1) {
        ppImg = pp3;
      } else if (num === 2) {
        ppImg = pp2;
      } else if (num === 3) {
        ppImg = pp1;
      } else {
        ppImg = pp4;
      }
      this.setState({
        animateImg: ppImg,
      });
      num++;
    }, 400);
  };

  componentDidMount() {
    this.startSocket();
    this.changImg();
    // this.testData();
  }

  timer1 = null;
  timer2 = null;

  componentWillUnmount() {
    clearTimeout(this.timer1);
    clearInterval(this.timer2);
    clearInterval(this.timeChange);
    this.socket.close();
  }

  render() {
    const { show } = this.props;
    const { topThree, animateImg } = this.state;
    if (this.props.chart && !this.state.loading) {
      return <NewChart data={this.state.data} />;
    }

    return (
      <div
        className={styles.listBox}
        style={{ display: show ? "flex" : "none" }}
      >
        {topThree.length > 0 && (
          <div className={styles.listTop}>
            <div className={styles.ppTitle}>
              <img src={require("../../assets/title.png")} alt="title" />
            </div>
            <div className={styles.topMain}>
              <div className={styles.line}>
                <img src={require("../../assets/line.png")} alt="" />
              </div>
              <div className={styles.topBox}>
                <div className={styles.topOne}>
                  <div className={styles.ppAvatar}>
                    <span className={styles.userValue}>
                      {topThree[0] ? "-" + topThree[0].value : ""}
                    </span>
                    <div className={styles.avatarBox}>
                      <div className={styles.userBg}>
                        {topThree[0] && topThree[0].avatar ? (
                          <img src={topThree[0].avatar} alt="" />
                        ) : (
                          <span>{topThree[0].label.substr(0, 1)}</span>
                        )}
                        <img className={styles.userShyLeft} src={require('../../assets/shy_left.png')} alt="" />
                        <img className={styles.userShyRight} src={require('../../assets/shy_right.png')} alt="" />
                      </div>
                      <img className={styles.ppBg} src={animateImg} alt="" />
                    </div>
                    <span className={styles.userlabel}>
                      {topThree[0] ? topThree[0].label : ""}
                    </span>
                  </div>
                  <div className={styles.rank}>
                    <img src={require("../../assets/rank_1.png")} alt="" />
                  </div>
                </div>
                <div className={styles.topTwo}>
                  <div className={styles.ppAvatar}>
                    <span className={styles.userValue}>
                      {topThree[1] ? "-" + topThree[1].value : ""}
                    </span>
                    <div className={styles.avatarBox}>
                      <div className={styles.userBg}>
                        {topThree[1] && topThree[1].avatar ? (
                          <img src={topThree[1].avatar} alt="" />
                        ) : (
                          <span>{topThree[1].label.substr(0, 1)}</span>
                        )}
                        <img className={styles.userShyLeft} src={require('../../assets/shy_left.png')} alt="" />
                        <img className={styles.userShyRight} src={require('../../assets/shy_right.png')} alt="" />
                      </div>
                      <img className={styles.ppBg} src={pp2} alt="" />
                    </div>
                    <span className={styles.userlabel}>
                      {topThree[1] ? topThree[1].label : ""}
                    </span>
                  </div>
                  <div className={styles.rank}>
                    <img src={require("../../assets/rank_2.png")} alt="" />
                  </div>
                </div>
                <div className={styles.topThree}>
                  <div
                    className={styles.ppAvatar}
                    style={{ left: "60px", top: "-120px" }}
                  >
                    <span className={styles.userValue}>
                      {topThree[2] ? "-" + topThree[2].value : ""}
                    </span>
                    <div className={styles.avatarBox}>
                      <div className={styles.userBg}>
                        {topThree[2] && topThree[2].avatar ? (
                          <img src={topThree[2].avatar} alt="" />
                        ) : (
                          <span>{topThree[2].label.substr(0, 1)}</span>
                        )}
                        <img className={styles.userShyLeft} src={require('../../assets/shy_left.png')} alt="" />
                        <img className={styles.userShyRight} src={require('../../assets/shy_right.png')} alt="" />
                      </div>
                      <img className={styles.ppBg} src={pp3} alt="" />
                    </div>
                    <span className={styles.userlabel}>
                      {topThree[2] ? topThree[2].label : ""}
                    </span>
                  </div>
                  <div className={styles.rank}>
                    <img src={require("../../assets/rank_3.png")} alt="" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className={styles.listOther}>
          <div className={styles.spaceBlock}></div>
          <div id="pplist" className={styles.userList}>
            <DynamicBarChart
              data={this.state.data}
              showTitle={true}
              iterationTitleStyles={{
                height: `${this.state.titleHeight}px`,
              }}
              changeData={this.change}
              barHeight={this.setItemHeight()}
              showDottedLine={true}
              showAvatar={true}
            />
          </div>
        </div>
      </div>
    );
  }
}

Home.propTypes = {};

function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
