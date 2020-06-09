import React from 'react';
import { connect } from 'dva';
import { Modal } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
import styles from './CreatGroupAddMember.scss';
import AddressBook from 'components/common/Address';

class CreatGroupAddMember extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checkedMemberList: [],
    };
  }

  cancelAddMember = () => {
    const { hideAddMembersBoxs } = this.props;
    hideAddMembersBoxs();
  };
  finishAddMember = () => {
    const { checkedMemberList } = this.state;
    const { hideAddMembersBoxs, obtainCheckedMemberList } = this.props;
    obtainCheckedMemberList(checkedMemberList);
    hideAddMembersBoxs();
  };
  // 渲染 確定/取消 title
  renderTitle = () => {
    return (
      <div className={styles.selectTitle}>
        <p onClick={this.cancelAddMember}>
          <FormattedMessage id="Dialogue.Cancel" defaultMessage="取消" />
        </p>
        <p onClick={this.finishAddMember}>
          <FormattedMessage id="Dialogue.Finish" defaultMessage="確定" />
        </p>
      </div>
    );
  };
  select_members = (event) => {
    const target = event.target;
    const checked = target.checked;
    const id = target.value;
    const { checkedMemberList } = this.state;
    const newCheckedList = checked
      ? checkedMemberList.concat(id)
      : checkedMemberList.filter((item) => item !== id);
    this.setState({
      checkedMemberList: newCheckedList,
    });
  };

  render() {
    const { addMemberModal, hideAddMembersBoxs, intl } = this.props;
    const NewsAddMembers = intl.formatMessage({ id: 'Group.NewsAddMembers' });
    return (
      <Modal
        className={styles.createpost}
        title={NewsAddMembers}
        visible={addMemberModal}
        // destroyOnClose={true}
        maskStyle={{
          WebkitBackdropFilter: 'blur(10px)',
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
        }}
        confirmLoading={false}
        footer={null}
        onCancel={hideAddMembersBoxs}
      >
        <div
          className={styles.memberList}
        >
          {this.renderTitle()}
          <AddressBook
            key={'creactGroup'}
            onChange={this.select_members}
            checkedList={this.state.checkedMemberList}
          />
        </div>
      </Modal>
    );
  }
}

CreatGroupAddMember.propTypes = {};

function mapStateToProps(state) {
  return {};
}
export default connect(mapStateToProps)(injectIntl(CreatGroupAddMember));
