import React from 'react';
import { connect } from 'dva';
import { Modal, message } from 'antd';
import { allowUserJoinGroup } from '../../../../models/groupOption/action';
import { deleteNoticeList } from '../../../../models/notification/actions';
import styles from './index.scss';

class ApplyConfirm extends React.Component {
  cancelModal = () => {
    this.props.dispatch({
      type: 'groupOption/changeApplyHidden',
    });
  };

  applyRefuse = async () => {
    const { applyMessage, dispatch } = this.props;
    const { groupId, userId, noticeId } = applyMessage;
    let res = await dispatch(
      allowUserJoinGroup({
        groupId,
        operateUserIds: [userId],
        allowJoin: false,
      })
    );
    if (res.code === '200') {
      dispatch(
        deleteNoticeList({
          type: 2,
          noticeId,
        })
      );
      message.success('操作成功');
      dispatch({
        type: 'groupOption/changeApplyHidden',
      });
    }
  };

  applyOk = async () => {
    const { applyMessage, dispatch } = this.props;
    const { groupId, userId, noticeId } = applyMessage;
    let res = await dispatch(
      allowUserJoinGroup({ groupId, operateUserIds: [userId], allowJoin: true })
    );
    if (res.code === '200') {
      dispatch(
        deleteNoticeList({
          type: 2,
          noticeId,
        })
      );
      message.success('操作成功');
      dispatch({
        type: 'groupOption/changeApplyHidden',
      });
    }
  };

  render() {
    const { showApplyConfirm, applyMessage, applyGroupDetail } = this.props;
    const { name } = applyMessage;
    // const { name: groupName } = applyGroupDetail;
    return (
      <Modal
        className={styles.applyConfirm}
        title={`入群申請`}
        visible={showApplyConfirm}
        onCancel={this.cancelModal}
        destroyOnClose={true}
        maskStyle={{
          WebkitBackdropFilter: 'blur(10px)',
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
        }}
        footer={null}
      >
        <div className={styles.confirm}>
          <div className={styles.confirContent}>
            是否同意<span className={styles.applyName}>&nbsp;{name}&nbsp;</span>
            加入
            {!!applyGroupDetail && (
              <span className={styles.applyName}>
                &nbsp;
                {applyGroupDetail.name
                  ? applyGroupDetail.name.substr(0, 10)
                  : ''}
                &nbsp;
              </span>
            )}
            ？
          </div>
          <div className={styles.confirBtn}>
            <div className={styles.confirmCancel} onClick={this.applyRefuse}>
              拒絕
            </div>
            <div className={styles.confirmOk} onClick={this.applyOk}>
              同意
            </div>
          </div>
        </div>
      </Modal>
    );
  }
}

function mapStateToProps(state) {
  const applyMessage = state.groupOption.get('applyMessage');
  const applyGroupDetail = state.groupInfo.get('applyGroupDetail');
  return {
    showApplyConfirm: state.groupOption.get('showApplyConfirm'),
    applyMessage,
    applyGroupDetail,
  };
}
export default connect(mapStateToProps)(ApplyConfirm);
