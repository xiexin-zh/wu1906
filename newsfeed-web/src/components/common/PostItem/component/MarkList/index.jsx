import React, { Component } from 'react';
import styles from './index.scss';
import { Modal } from 'antd';
import UserAvatar from '../../../UserAvatar';
import propTypes from 'prop-types';
import { withRouter } from 'dva/router';
import { getUsername } from '../../../../../utils/utils';

class MarkList extends Component {
  render() {
    const { visible, onCancel, memberslist, history } = this.props;
    return (
      <Modal
        className={styles.MarkList}
        visible={visible}
        title={'標註人名'}
        footer={null}
        onCancel={onCancel}
        destroyOnClose={true}
        maskStyle={{
          WebkitBackdropFilter: 'blur(10px)',
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
        }}
      >
        <div>
          {memberslist &&
            memberslist.map((item) => {
              const username = getUsername(item);
              const { full_name, title } = item;
              return (
                <div
                  className={styles.memberList}
                  key={item.id}
                  onClick={() => {
                    history.push(`/user/${item.id}`);
                  }}
                >
                  <UserAvatar userId={item.id} />
                  {username && (
                    <span className={styles.givenName}>{username}</span>
                  )}
                  {full_name && (
                    <span className={styles.fullName}>{full_name}</span>
                  )}
                  {title && <span className={styles.title}>{title}</span>}
                </div>
              );
            })}
        </div>
      </Modal>
    );
  }
}
MarkList.propTypes = {
  visible: propTypes.bool.isRequired,
  onCancel: propTypes.func.isRequired,
  postData: propTypes.array,
};
MarkList.defaultProps = {
  postData: [],
};
export default withRouter(MarkList);
