import React, { Component } from 'react';
import { connect } from 'dva';
import { Steps, Icon } from 'antd';

import styles from './index.less';

const { Step } = Steps;

class ProcessStep extends Component {
  // eslint-disable-next-line no-empty-pattern
  constructor(props) {
    super(props);
    this.state = {
      current: 1,
      stepOption: [
        { id: 0, title: '1、工单签收', time: '2020-4-5' },
        { id: 1, title: '2、工单处置', time: '2020-4-5' },
        { id: 2, title: '3、工单审核', time: '2020-4-5' },
        { id: 3, title: '4、工单办结', time: '2020-4-5' },
      ],
    };
  }

  renderTitle = (title, color) => {
    return (
      <div style={{ color }}>
        <Icon type="bank" />
        <span style={{ marginLeft: '10px' }}>{title}</span>
      </div>
    );
  };

  renderTime = (time, color) => {
    return (
      <div style={{ color }}>
        <Icon type="clock-circle" />
        <span style={{ marginLeft: '10px' }}>{time}</span>
      </div>
    );
  };

  render() {
    const { current, stepOption } = this.state;
    return (
      <div className={styles.step}>
        <Steps current={current} direction="vertical">
          {stepOption.map(item => {
            let color = '#ccc';
            if (item.id === current) {
              color = '#249fde';
            }
            return (
              <Step
                key={item.id}
                title={this.renderTitle(item.title, color)}
                description={this.renderTime(item.time, color)}
              />
            );
          })}
        </Steps>
      </div>
    );
  }
}
ProcessStep.propTypes = {};
function mapStateToProps() {
  return {};
}
export default connect(mapStateToProps)(ProcessStep);
