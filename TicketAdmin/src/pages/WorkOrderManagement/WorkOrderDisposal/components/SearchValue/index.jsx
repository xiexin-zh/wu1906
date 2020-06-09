import React, { Component } from 'react';
import { connect } from 'dva';
import { CloseCircleOutlined } from '@ant-design/icons';

import styles from './index.less';

class SearchValue extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  delBox = () => {
    const { index, deleteSearch } = this.props;
    deleteSearch(index);
  };

  changeValue = e => {
    const { changeSearchValue, index } = this.props;
    const { value } = e.target;
    changeSearchValue(index, value);
  };

  render() {
    return (
      <div className={styles.searchBox}>
        <input placeholder="输入内容" onChange={this.changeValue} />
        <span onClick={this.delBox}>
          <CloseCircleOutlined />
        </span>
      </div>
    );
  }
}

SearchValue.propTypes = {};
function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps)(SearchValue);
