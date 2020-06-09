import React from 'react';
import { connect } from 'dva';

function KnowledgeBase(props) {
  // eslint-disable-next-line no-empty-pattern
  const {} = props;
  return <p>知识库</p>;
}
KnowledgeBase.propTypes = {};
function mapStateToProps() {
  return {};
}
export default connect(mapStateToProps)(KnowledgeBase);
