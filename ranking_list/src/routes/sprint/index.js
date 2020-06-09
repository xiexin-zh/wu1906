import React, { Component } from "react";
import { connect } from "dva";
import Socket from "../../utils/websocket";
import { webSocketUrl } from "../../utils/config";
import { Table, Typography, message } from "antd";
import { formatDate } from "../../utils/tools";
import pIcon from "../../assets/tz.png";
import Progress from './Progress';

import styles from "./index.scss";

const { Text } = Typography;

class Sprint extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      columns: [
        {
          title: "冲刺排名",
          dataIndex: "sort",
          key: "sort",
          align: "center",
          height: "50px",
          render: (text, data) => {
            if (text === 1 && data.cardNum === data.compCardNum) {
              return (
                <img
                  src={require("../../assets/1.png")}
                  alt=""
                  style={{ width: "80px", height: "45px" }}
                />
              );
            } else if (text === 2 && data.cardNum === data.compCardNum) {
              return (
                <img
                  src={require("../../assets/2.png")}
                  alt=""
                  style={{ width: "80px", height: "45px" }}
                />
              );
            } else if (text === 3 && data.cardNum === data.compCardNum) {
              return (
                <img
                  src={require("../../assets/3.png")}
                  alt=""
                  style={{ width: "80px", height: "45px" }}
                />
              );
            } else {
              return <span>{text}</span>;
            }
          },
        },
        {
          title: "成员",
          dataIndex: "userName",
          key: "userName",
          align: "center",
          height: "50px",
        },
        {
          title: "冲刺进度",
          dataIndex: "userName",
          key: "process",
          align: "center",
          height: "50px",
          width: "15%",
          render: (text, data) => {
            const { totalCompEP, totalEP } = data;
            const point = ((totalCompEP / totalEP) * 100).toFixed(0);
            const pointText = totalEP !== 0 ? point : 0;
            return (
              <div
                style={{
                  width: "90%",
                  marginLeft: '5%',
                  height: "45px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: 'column'
                }}
              >
                <Progress done={pointText}/>
                {/* <div
                  style={{
                    width: "90%",
                    height: "20px",
                    borderRadius: "20px",
                    backgroundColor: "#cfcfcf",
                    overflow: "hidden",
                  }}
                >
                  <p
                    style={{
                      width: pointText,
                      height: "100%",
                      borderRadius: "20px",
                      textAlign: "right",
                      fontSize: "15px",
                      color: "#fff",
                      backgroundColor: "#1E90FF",
                      overflow: "hidden",
                      lineHeight: "20px",
                      paddingRight: point < 14 || totalEP === 0 ? "0" : "4px",
                      boxSizing: "border-box",
                      transition: "all 0.5s",
                    }}
                  >
                    {point < 14 || totalEP === 0 ? "" : pointText}
                  </p>
                </div> */}
              </div>
            );
          },
        },
        {
          title: "E.P完成情况",
          dataIndex: "epClpStatus",
          key: "epClpStatus",
          align: "center",
          width: "100px",
          height: "50px",
        },
        {
          title: "任务完成情况",
          dataIndex: "cardClpStatus",
          key: "cardClpStatus",
          align: "center",
          width: "100px",
          height: "50px",
        },
        {
          title: "TODO",
          dataIndex: "todoCard",
          key: "todoCard",
          align: "center",
          height: "50px",
          className: styles.specialTd,
          render: (text) => (
            <div
              className={
                text === 0
                  ? styles.tdGreen
                  : text >= 2
                  ? styles.tdYellow
                  : styles.tdNomal
              }
            >
              {text}
            </div>
          ),
        },
        {
          title: "DOING",
          dataIndex: "doingCard",
          key: "doingCard",
          align: "center",
          height: "50px",
          className: styles.specialTd,
          render: (text) => (
            <div
              className={
                text === 0
                  ? styles.tdGreen
                  : text >= 2
                  ? styles.tdYellow
                  : styles.tdNomal
              }
            >
              {text}
            </div>
          ),
        },
        {
          title: "待QA验收",
          dataIndex: "waitQACard",
          key: "waitQACard",
          align: "center",
          height: "50px",
          className: styles.specialTd,
          render: (text) => (
            <div
              className={
                text === 0
                  ? styles.tdGreen
                  : text >= 2
                  ? styles.tdYellow
                  : styles.tdNomal
              }
            >
              {text}
            </div>
          ),
        },
        {
          title: "待PO验收",
          dataIndex: "waitPOCard",
          key: "waitPOCard",
          align: "center",
          height: "50px",
          className: styles.specialTd,
          render: (text) => (
            <div
              className={
                text === 0
                  ? styles.tdGreen
                  : text >= 2
                  ? styles.tdYellow
                  : styles.tdNomal
              }
            >
              {text}
            </div>
          ),
        },
        {
          title: () => (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "center",
              }}
            >
              <img
                src={pIcon}
                alt=""
                style={{ width: "15px", height: "15px" }}
              />
              <span>&nbsp;任务</span>
            </div>
          ),
          dataIndex: "cardPeach",
          key: "cardPeach",
          align: "center",
          height: "50px",
          render: (val) => {
            if (val === 0) {
              return "N/A";
            }
            let newVal = [];
            for (let i = 0; i < val; i++) {
              // newVal += "🍑";
              newVal.push(i + 1);
            }
            return (
              <div className={styles.flexRow}>
                {newVal.map((n, index) => (
                  <img
                    key={index}
                    src={pIcon}
                    alt=""
                    style={{ width: "15px", height: "15px" }}
                  />
                ))}
              </div>
            );
          },
        },
        {
          title: "计划会议后增加任务",
          dataIndex: "meetAfter",
          key: "meetAfter",
          align: "center",
          height: "50px",
          render: (val) => {
            if (val === 0) {
              return "N/A";
            }
            return "+" + val;
          },
        },
        {
          title: "领取任务的最长时间",
          dataIndex: "longDate",
          key: "longDate",
          align: "center",
          height: "50px",
          render: (date) => {
            return formatDate(date);
          },
        },
      ],
      data: [],
      title: "",
    };
  }

  playAudioA = () => {
    const audioA = document.getElementById("audioA");
    audioA.play();
  };
  playAudioB = () => {
    const audioB = document.getElementById("audioB");
    audioB.play();
  };

  changeStatus = async ({ id, onlyVoice, repeatedVoice }) => {
    let data = {
      id,
      onlyVoice,
      repeatedVoice,
    };
    const res = await this.props.changeStatus(data);
    // console.log(res);
  };

  startSocketSprint = () => {
    this.socket = new Socket({
      socketUrl: "ws://" + webSocketUrl + ":9875/sprint/reflect",
      // socketUrl: "ws://l307d45463.qicp.vip/sprint/reflect",
      // socketUrl: "ws://123.57.189.15:9875/sprint/reflect",
      timeout: 5000,
      socketMessage: (receive) => {
        // console.log(receive.data); //后端返回的数据，渲染页面
        if (receive || receive.data) {
          const { teamMember, firstDevs, title } = JSON.parse(receive.data);
          let data = [];
          if (firstDevs && firstDevs.length > 0) {
            // 如果排名第一的 onlyVoice == 0；说明声音没有播放
            if (firstDevs[0].onlyVoice === "0") {
              this.playAudioB(); // 播放声音
              // 调接口改变状态，将 onlyVoice == 1
              this.changeStatus({
                id: firstDevs[0].id,
                onlyVoice: "1",
                repeatedVoice: "1",
              });
            }
            data = firstDevs.concat(teamMember);
          } else {
            data = teamMember;
          }

          // 如果排行榜排名变化 播放声音A
          if (this.state.data.length > 0) {
            let startAudioA = false;
            let isFirst = -1;
            for (let i = 0; i < data.length; i++) {
              if (this.state.data[i].id !== data[i].id) {
                isFirst = i;
                startAudioA = true;
              }
            }
            if (startAudioA) {
              if (isFirst === 0 && data[0].cardNum === data[0].compCardNum) {
                return;
              }
              console.log("播放A");
              this.playAudioA();
            }
          }

          this.setState({
            loading: false,
            title: title || "SPRINT",
            data:
              data.length === 0
                ? []
                : data.map((item, index) => {
                    return {
                      ...item,
                      sort: index + 1,
                      epClpStatus: item.totalCompEP + " / " + item.totalEP,
                      cardClpStatus: item.compCardNum + " / " + item.cardNum,
                    };
                  }),
          });
        } else {
          this.setState({
            loading: false,
          });
          message.error("数据获取失败");
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

  componentDidMount() {
    this.startSocketSprint();
    // const data = [
    //   {
    //     cardNum: 9,
    //     cardPeach: 3,
    //     compCardNum: 8,
    //     doingCard: 1,
    //     id: 1,
    //     longDate: "2020-04-28 17:52:19",
    //     meetAfter: 0,
    //     todoCard: 0,
    //     totalCompEP: 17,
    //     totalEP: 27,
    //     userName: "李兴",
    //     waitPOCard: 0,
    //     waitQACard: 2,
    //     onlyVoice: "0",
    //     repeatedVoice: "0",
    //   },
    //   {
    //     cardNum: 16,
    //     cardPeach: 11,
    //     compCardNum: 15,
    //     doingCard: 0,
    //     id: 2,
    //     longDate: "N/A",
    //     meetAfter: 0,
    //     todoCard: 0,
    //     totalCompEP: 23,
    //     totalEP: 0,
    //     userName: "杨吉",
    //     waitPOCard: 9,
    //     waitQACard: 1,
    //     onlyVoice: "0",
    //     repeatedVoice: "0",
    //   },
    //   {
    //     cardNum: 6,
    //     cardPeach: 0,
    //     compCardNum: 4,
    //     doingCard: 1,
    //     id: 3,
    //     longDate: "2020-04-27 15:42:34",
    //     meetAfter: 0,
    //     todoCard: 0,
    //     totalCompEP: 6,
    //     totalEP: 27,
    //     userName: "石天舒",
    //     waitPOCard: 0,
    //     waitQACard: 3,
    //     onlyVoice: "0",
    //     repeatedVoice: "0",
    //   },
    //   {
    //     cardNum: 6,
    //     cardPeach: 0,
    //     compCardNum: 3,
    //     doingCard: 1,
    //     id: 4,
    //     longDate: "2020-04-27 15:42:39",
    //     meetAfter: 1,
    //     todoCard: 1,
    //     totalCompEP: 12,
    //     totalEP: 67,
    //     userName: "史彦超",
    //     waitPOCard: 1,
    //     waitQACard: 0,
    //     onlyVoice: "0",
    //     repeatedVoice: "0",
    //   },
    //   {
    //     cardNum: 13,
    //     cardPeach: 10,
    //     compCardNum: 7,
    //     doingCard: 0,
    //     id: 5,
    //     longDate: "N/A",
    //     meetAfter: 0,
    //     todoCard: 0,
    //     totalCompEP: 10,
    //     totalEP: 17,
    //     userName: "侯鲁林",
    //     waitPOCard: 5,
    //     waitQACard: 1,
    //     onlyVoice: "0",
    //     repeatedVoice: "0",
    //   },
    //   {
    //     cardNum: 8,
    //     cardPeach: 3,
    //     compCardNum: 3,
    //     doingCard: 3,
    //     id: 6,
    //     longDate: "2020-04-27 15:41:23",
    //     meetAfter: 0,
    //     todoCard: 0,
    //     totalCompEP: 3,
    //     totalEP: 17,
    //     userName: "杨奥涵",
    //     waitPOCard: 0,
    //     waitQACard: 2,
    //     onlyVoice: "0",
    //     repeatedVoice: "0",
    //   },
    //   {
    //     cardNum: 7,
    //     cardPeach: 2,
    //     compCardNum: 5,
    //     doingCard: 0,
    //     id: 7,
    //     longDate: "N/A",
    //     meetAfter: 1,
    //     todoCard: 1,
    //     totalCompEP: 18,
    //     totalEP: 59,
    //     userName: "孟庆成",
    //     waitPOCard: 1,
    //     waitQACard: 0,
    //     onlyVoice: "0",
    //     repeatedVoice: "0",
    //   },
    // ];
    // this.setState(
    //   {
    //     loading: false,
    //     data: data.map((item, index) => {
    //       return {
    //         ...item,
    //         sort: index + 1,
    //       };
    //     }),
    //     title: "IMAX sprint 24 - Day 0",
    //   },
    //   () => {
    //     setTimeout(() => {
    //       this.playAudioB();
    //     }, 5000);

    //     setTimeout(() => {
    //       this.playAudioA();
    //     }, 60000);

    //     setTimeout(() => {
    //       this.playAudioA();
    //     }, 120000);
    //   }
    // );
  }

  componentWillUnmount() {
    // this.socket.closeSocket();
  }

  render() {
    const { columns, data, title, loading } = this.state;
    const { show } = this.props;
    const listHeight = document.body.clientHeight - 150;
    return (
      <div
        className={styles.sprint}
        style={{ display: show ? "block" : "none" }}
      >
        <div className={styles.spTitle}>
          <div
            onClick={() =>
              this.changeStatus({ id: 1, onlyVoice: "0", repeatedVoice: "0" })
            }
            className={styles.sprintName}
          >
            <span>{title}</span>
          </div>
        </div>
        <div className="tableStyle">
          <Table
            columns={columns}
            dataSource={data}
            bordered={true}
            pagination={false}
            loading={loading}
            rowKey={(pageData) => {
              return pageData.id;
            }}
            summary={(pageData) => {
              let totalCard = 0;
              let compeletedCard = 0;
              let totalEp = 0;
              let completedEp = 0;
              let todoNum = 0;
              let doingNum = 0;
              let qaNum = 0;
              let poNum = 0;
              let peachNum = 0;
              let newAddNum = 0;

              pageData.forEach(
                ({
                  cardNum,
                  compCardNum,
                  totalEP,
                  totalCompEP,
                  todoCard,
                  doingCard,
                  waitQACard,
                  waitPOCard,
                  cardPeach,
                  meetAfter,
                }) => {
                  totalCard += cardNum;
                  compeletedCard += compCardNum;
                  totalEp += totalEP;
                  completedEp += totalCompEP;
                  todoNum += todoCard;
                  doingNum += doingCard;
                  qaNum += waitQACard;
                  poNum += waitPOCard;
                  peachNum += cardPeach;
                  newAddNum += meetAfter;
                }
              );
              let patchText = "";
              let patchVal = [];
              if (peachNum === 0) {
                patchText = "N/A";
              } else {
                for (let i = 0; i < peachNum; i++) {
                  patchVal.push(i+1);
                }
              }
              return (
                <>
                  <tr>
                    <td></td>
                    <td></td>
                    <td align="center" className={styles.setFont}>
                      <Text>【总计】</Text>
                    </td>
                    <td align="center" className={styles.setFont}>
                      <Text>{completedEp + " / " + totalEp}</Text>
                    </td>
                    <td align="center" className={styles.setFont}>
                      <Text>{compeletedCard + " / " + totalCard}</Text>
                    </td>
                    <td align="center" className={styles.setFont}>
                      <Text>{todoNum}</Text>
                    </td>
                    <td align="center" className={styles.setFont}>
                      <Text>{doingNum}</Text>
                    </td>
                    <td align="center" className={styles.setFont}>
                      <Text>{qaNum}</Text>
                    </td>
                    <td align="center" className={styles.setFont}>
                      <Text>{poNum}</Text>
                    </td>
                    <td
                      align="center"
                      className={styles.setFont}
                      style={{
                        fontSize: peachNum > 7 ? "12px" : "14px",
                        padding: "px 0",
                      }}
                    >
                      {peachNum === 0 ? (
                        <Text>{patchText}</Text>
                      ) : (
                        <div className={styles.flexRow}>
                          {patchVal.map((n, index) => (
                            <img
                              key={index}
                              src={pIcon}
                              alt=""
                              style={{ width: "10px", height: "10px" }}
                            />
                          ))}
                        </div>
                      )}
                    </td>
                    {/* <td align="center" className={styles.setFont}>
                      <Text>{peachNum}</Text>
                    </td> */}
                    <td align="center" className={styles.setFont}>
                      <Text>{newAddNum === 0 ? "N/A" : "+" + newAddNum}</Text>
                    </td>
                    <td align="center" className={styles.setFont}>
                      <Text>N/A</Text>
                    </td>
                  </tr>
                </>
              );
            }}
            rowClassName={(record, index) => {
              if (index % 2 === 0) {
                return styles.rowWhite;
              } else {
                return styles.rowGray;
              }
            }}
            scroll={{ y: listHeight }}
          />
        </div>
        <div className={styles.audio}>
          <audio id="audioA" controls>
            <source
              src={require("../../assets/A.wav")}
              type="audio/wav"
            ></source>
          </audio>
          <audio id="audioB" controls>
            <source
              src={require("../../assets/B.wav")}
              type="audio/wav"
            ></source>
          </audio>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
    changeStatus: ({ id, onlyVoice, repeatedVoice }) => {
      return dispatch({
        type: "userList/setSoundStatus",
        payload: {
          id,
          onlyVoice,
          repeatedVoice,
        },
      });
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Sprint);
