import React, { Component } from 'react';
import { connect } from 'dva';

import styles from './index.less';

class SelectDay extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  changeDay = day => {
    const { chooseDay } = this.props;
    chooseDay(day);
  };

  render() {
    const { days, value } = this.props;
    return (
      <div className={styles.selectDay}>
        {days.map(item => {
          return (
            <span
              className={value === item.type ? styles.active : ''}
              key={item.type}
              onClick={() => this.changeDay(item.type)}
            >
              {item.name}
            </span>
          );
        })}
      </div>
    );
  }
}

SelectDay.propTypes = {};
function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps)(SelectDay);
