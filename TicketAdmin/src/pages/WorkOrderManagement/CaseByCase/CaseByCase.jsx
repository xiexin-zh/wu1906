import React from 'react';
import { connect } from 'dva';
import styles from './CaseByCase.css';

function CaseByCase(props) {
  // eslint-disable-next-line no-empty-pattern
  const {} = props;
  return <div className={styles.CaseByCaseBox}>工单管理----一案一档</div>;
}
CaseByCase.propTypes = {};
function mapStateToProps() {
  return {};
}
export default connect(mapStateToProps)(CaseByCase);
