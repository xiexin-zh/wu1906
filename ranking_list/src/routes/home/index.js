import React, { Component } from "react";
import { connect } from "dva";
import styles from "./index.scss";

import Pplist from "../pplist";
import Sprint from "../sprint";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showPplist: true,
    };
  }

  timeCheck = null;

  componentDidMount() {
    this.timeCheck = setInterval(() => {
      this.setState({
        showPplist: !this.state.showPplist,
      });
    }, 30000);
  }

  componentWillUnmount() {
    clearInterval(this.timeCheck);
  }

  render() {
    const { showPplist } = this.state;
    return (
      <div className={styles.homeBox}>
        <Pplist show={showPplist} />
        <Sprint show={!showPplist} />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
