import React from 'react';
import { connect } from 'dva';
import { Modal } from 'antd';

// import styles from './NoticeDetailsPopup.css';

class VoteDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  renderVoteDetail = () => {
    const { showPostPopup, handleCancel } = this.props;
    return (
      <Modal
        width="95%"
        visible={showPostPopup}
        footer={null}
        style={{ height: '95%', top: 20 }}
        onCancel={handleCancel}
      >
        <div>vote</div>
      </Modal>
    );
  };

  render() {
    return this.renderVoteDetail();
  }
}

VoteDetails.propTypes = {};

function mapStateToProps(state) {
  return {};
}
export default connect(mapStateToProps)(VoteDetails);
