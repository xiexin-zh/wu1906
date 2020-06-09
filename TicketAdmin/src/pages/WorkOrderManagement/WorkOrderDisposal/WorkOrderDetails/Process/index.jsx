import React, { Component } from 'react';
import { connect } from 'dva';

import styles from './index.less';

class Process extends Component {
  constructor(props){
    super(props);
    this.state={

    }
  }

  render(){
    return(
      <div className={styles.process}>工单进程</div>
    )
  }
}

Process.propTypes = {};
function mapStateToProps() {
  return {};
}
export default connect(mapStateToProps)(Process);