import React, { Component } from "react";
import { connect } from "dva";
import { Input, Button, message, Select } from "antd";
import styles from "./index.scss";

const { Option } = Select;

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      time: "",
      num: "",
      groups: [
        { id: 1, name: "IMAX" },
        { id: 2, name: "VISION" },
        { id: 3, name: "WOLVERINE" },
        { id: 4, name: "FRIDAY" },
      ],
      groupNum: "",
    };
  }

  handleChange = (value) => {
    this.setState({
      groupNum: value,
    });
  };

  submit = async () => {
    const { time, num, groupNum } = this.state;
    if (!groupNum) {
      return message.warning("请选择小组");
    }
    if (time.trim().length === 0) {
      return message.warning("请输入迭代日期");
    }
    if (num.trim().length === 0) {
      return message.warning("请输入迭代次数");
    }
    let data = {
      date: this.state.time,
      stage: this.state.num,
      groupNumber: this.state.groupNum,
    };
    const res = await this.props.changeStatus(data);
    console.log(res);
    if (res === 1) {
      message.success("提交成功");
    } else {
      message.error("提交失败，请重新检查并提交");
    }
  };

  render() {
    const { groups } = this.state;
    return (
      <div className={styles.homeBox}>
        <div>
          <label>请选择小组：</label>
          <Select
            className={styles.other}
            placeholder="请选择小组"
            onChange={this.handleChange}
          >
            {groups.map((item) => {
              return (
                <Option key={item.id} value={item.id}>
                  {item.name}
                </Option>
              );
            })}
          </Select>
        </div>
        <div>
          <label>当前迭代日期：</label>
          <Input
            className={styles.other}
            onChange={(e) => {
              this.setState({
                time: e.target.value,
              });
            }}
            placeholder="当前迭代日期（输入格式：2020-01-01）"
          />
        </div>
        <div>
          <label>当前第几次迭代：</label>
          <Input
            className={styles.other}
            onChange={(e) => {
              this.setState({
                num: e.target.value,
              });
            }}
            placeholder="当前第几次迭代（例：27）"
          />
        </div>
        <Button type="primary" onClick={this.submit}>
          提交
        </Button>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
    changeStatus: ({ date, stage, groupNumber }) => {
      return dispatch({
        type: "search/setSoundStatus",
        payload: {
          date,
          stage,
          groupNumber,
        },
      });
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
