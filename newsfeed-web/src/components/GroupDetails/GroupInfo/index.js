import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Modal, Dropdown, Button, Menu, message, Collapse } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
import Member from 'components/common/Contacts/Member';
import UpdateCheckProfile from 'components/common/UpdateCheckProfile';
import styles from './index.scss';
import animationStyle from '../../../animation.css';
import { withRouter } from 'dva/router';
import MemberAndFans from '../MemberAndFans';
import GroupButton from './GroupButton';
import InviteMember from '../InviteMember';
import GroupOption from './GroupOption';
import FormattedText from '../../common/FormattedText';
import { Set } from 'immutable';
import {
  getGroupDetail,
  // getMemberGroupList,
  // getAdminGroupList,
} from '../../../models/groupInfo/selectors';
import { leaveGroup } from '../../../models/groupInfo/actions';
import { findDOMNode } from 'react-dom';
const { confirm } = Modal;
const { Panel } = Collapse;
/**
 *
 * @param {string} url 頭像url地址
 * @param {function} onClick 點擊事件綁定的處理函數
 * @param {string} index_symbol 個人用戶無圖片時顯示的字母索引
 * @param {number} width(size) 頭像寬高
 * @param {boolean} channel 是否是群組
 * @param {boolean} board 是否是公告板
 * @param {string} id 加載頭像失敗時 log 的 ID
 */

class GroupInfo extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      showSymbol: false,
      GroupMembers: [],
      openMoald: false,
      showMemberFans: false,
      showInviteMember: false,
      isNotice: null,
      setGroup: false,
    };
    this.lodeMore = this.lodeMore.bind(this);
  }

  openMemberFans = () => {
    this.setState({
      showMemberFans: true,
    });
  };

  closeMemberFans = () => {
    this.setState({
      showMemberFans: false,
    });
  };

  openInviteMember = () => {
    this.setState({
      showInviteMember: true,
    });
  };

  closeInviteMember = () => {
    this.setState({
      showInviteMember: false,
    });
  };

  openMemberDetail = (userId) => {
    const { history } = this.props;
    history.push(`/user/${userId}`);
    this.closeMemberFans();
  };

  renderGroupType(isPublic) {
    return (
      <FormattedMessage
        id={`Group.${isPublic ? 'PublicGroup' : 'SecretGroup'}`}
      >
        {(text) => text}
      </FormattedMessage>
    );
  }
  lodeMore() {
    this.setState({
      openMoald: true,
    });
  }
  hank = () => {
    this.setState({
      openMoald: false,
    });
  };
  renderMemberCount(groupMemberCount = 0) {
    return (
      <FormattedMessage
        id="Group.MemberCount"
        values={{ count: groupMemberCount }}
      >
        {(text) => text}
      </FormattedMessage>
    );
  }
  renderFansCount(groupFollowCount = 0) {
    return groupFollowCount > 0 ? (
      <>
        |{' '}
        <FormattedMessage
          id="Group.FansCount"
          values={{ count: groupFollowCount }}
        >
          {(text) => text}
        </FormattedMessage>
      </>
    ) : (
      ''
    );
  }
  quitGroup = () => {
    const {
      joinGroup,
      groupId,
      groupDetails,
      history,
      intl,
      delGroup,
      groupAdminList,
    } = this.props;
    const { name } = groupDetails;
    const groupMemberCount = this.getGroupMember().size;
    if (
      groupDetails.isGroupAdmin &&
      groupAdminList.length === 1 &&
      groupMemberCount > 1
    ) {
      message.info('你是群組唯一管理員無法退出群組');
      return;
    }
    confirm({
      okText: '確定退出',
      cancelText: '取消',
      title: '退出群組',
      content:
        groupMemberCount <= 1
          ? intl.formatMessage({ id: 'Group.content' })
          : intl.formatMessage({ id: 'Group.exitGroupConfirm' }, { name }),
      onOk() {
        // 退出群組
        joinGroup(groupId).then((res) => {
          // 成功以後才能進行後續
          if (res) {
            // 自己是管理員和群組只有1個人的時候才能刪除群組
            if (groupDetails.isGroupAdmin && groupMemberCount === 1) {
              delGroup(groupId);
            }
            // 退出以後跳到群組主頁
            history.push('/groups');
          }
        });
      },
      onCancel() {},
    });
  };
  // 修改通知
  onNotice = () => {
    const { groupNotice, groupId, groupDetails } = this.props;

    let { isNotice } = groupDetails;
    groupNotice({
      groupId,
      notice: !isNotice,
    }).then((res) => {
      message.success('修改成功');
    });
  };
  setGroup = () => {
    this.setState({
      setGroup: true,
    });
  };

  cancelModal = () => {
    this.setState({
      setGroup: false,
    });
  };
  getGroupMember = () => {
    const { groupMember, groupId } = this.props;
    // console.log(groupMember,groupId)
    return groupMember.get(groupId);
  };

  render() {
    const {
      groupDetails,
      memberMap,
      groupFollows,
      // disableButton,
      leaveGroup,
      groupId,
      groupUsers,
      // isInvited,
      intl,
      getGroupDetails,
      groupMember,
      startAnimation,
      scrollState,
    } = this.props;
    const { showMemberFans, showInviteMember, setGroup } = this.state;
    const {
      avatarUrl,
      name,
      indexSymbol,

      groupFollowCount,
      // memberAvatarUrls = [],
      isPublic,
      identity,
    } = groupDetails;

    let groupUserList = groupUsers[groupId];

    /**群組
     * /// 用戶在該群組的身份 欄位：identity
     * 1:普通用戶
     * 2:群組粉絲
     * 3:群組普通成員
     * 4:群組管理員
     * 5:群組高級管理員（可將添加群組管理員）
     */
    const menu = (
      <Menu>
        {groupDetails.isGroupAdmin && (
          <Menu.Item onClick={this.setGroup}>
            <FormattedText id="Group.groupSetup" defaultMessage="群組設置" />
          </Menu.Item>
        )}

        <Menu.Item onClick={this.onNotice}>
          <div className={styles.notice}>
            <span>
              <FormattedText id="Group.notice" defaultMessage="通知" />
            </span>
            <span>{groupDetails.isNotice ? 'ON' : 'OFF'}</span>

            {/* {randerIcon(groupDetails.isNotice)} */}
          </div>
        </Menu.Item>
        {groupDetails.groupId &&
          groupDetails.isGroupMember &&
          !groupDetails.isPreset && (
            <Menu.Item onClick={this.quitGroup}>
              <FormattedText id="Group.exitGroup" defaultMessage="退出群組" />
            </Menu.Item>
          )}
      </Menu>
    );
    return (
      <div
        className={`${styles.wrapper} ${
          startAnimation ? animationStyle.cancelGroupAvatarPadding : ''
        }`}
      >
        {/* 更换群图像 */}
        <UpdateCheckProfile
          scrollState={scrollState}
          alt={indexSymbol ? indexSymbol : name}
          size={190}
          src={avatarUrl}
          cover={{ group_avatarUrl: avatarUrl }}
          showImageType={'head'}
          isUpdateUrl={Object.is(identity, 4) || Object.is(identity, 5)}
          isGroupOrUser="group"
          currentGroupInfo={groupDetails}
        />

        <div className={styles.InfoBox}>
          {/* 群名 */}
          <h4>{name}</h4>
          <p style={{ margin: 0 }}>
            {/* 公开或者私有 */}
            {this.renderGroupType(isPublic)} | {/* 成员数 */}
            {this.renderMemberCount(
              (groupMember.get(groupId) && groupMember.get(groupId).size) ||
                groupDetails.groupMemberCount
            )}
            {isPublic && this.renderFansCount(groupFollowCount)}
          </p>
          {/* 追踪btn */}
          {
            // !isInvited &&
            <GroupButton
              group={groupDetails}
              leaveGroup={leaveGroup}
              openInviteMember={this.openInviteMember}
              isGroupDetails={true}
              getGroupDetails={getGroupDetails}
            />
          }

          {/* 邀请群组 */}
          <InviteMember
            group={groupDetails}
            onClick={this.openMemberDetail}
            visible={showInviteMember}
            footer={null}
            onCancel={this.closeInviteMember}
          />

          {/* 群組設置菜单*/}
          {
            <Dropdown
              trigger={['click']}
              overlay={menu}
              placement="bottomLeft"
              getPopupContainer={() => findDOMNode(this.dropdown)}
            >
              <Button
                ref={(element) => {
                  this.dropdown = element;
                }}
              >
                <FormattedText
                  id="Group.groupSetup"
                  defaultMessage="群組設置"
                />
              </Button>
            </Dropdown>
          }

          {/* 群組設置弹出层*/}
          <GroupOption
            dispatch={this.props.dispatch}
            all={this.props}
            groupId={groupId}
            openInviteMember={this.openInviteMember}
            groupUserList={groupUserList}
            setGroup={setGroup}
            cancelModal={this.cancelModal}
          ></GroupOption>

          <div className={styles.groupItemContainer}>
            {/* 群组成员 */}
            <Collapse
              accordion
              defaultActiveKey={1}
              expandIconPosition={'right'}
            >
              <Panel
                header={
                  <h4 className={styles.groupMember}>
                    <FormattedMessage id="Group.GroupMember">
                      {(text) => text}
                    </FormattedMessage>
                    (
                    {(this.getGroupMember() && this.getGroupMember().size) ||
                      groupDetails.groupMemberCount}
                    )
                  </h4>
                }
                key="1"
              >
                <div>
                  <div>
                    {this.getGroupMember() &&
                      this.getGroupMember()
                        .slice(0, 5)
                        .map((avatar) => {
                          const { userId } = avatar;
                          const member = memberMap.get(userId);
                          if (!member) {
                            return null;
                          }
                          return (
                            <Member
                              key={userId}
                              itemHeight={42}
                              member={member}
                              id={userId}
                              memberType={'group'}
                            />
                          );
                        })}
                  </div>
                  <div className={styles.groupMemberTitle}>
                    {/* 群组成员查看更多 */}
                    {this.getGroupMember() && this.getGroupMember().size > 5 ? (
                      <div
                        className={styles.loadMore}
                        onClick={this.openMemberFans}
                      >
                        {/* <Icon style={{ width: 10, height: 6 }} type="down" /> */}
                        <span style={{ marginLeft: 10 }}>
                          <FormattedText
                            id="Group.seeMore"
                            defaultMessage="查看更多…"
                          />
                        </span>
                      </div>
                    ) : (
                      ''
                    )}
                  </div>
                </div>
              </Panel>

              {groupFollows.size > 0 && (
                <Panel
                  header={
                    groupFollows.size > 0 && (
                      <h4 className={styles.groupMember}>
                        <FormattedMessage id="Group.GroupFan">
                          {(text) => text}
                        </FormattedMessage>
                        ({groupFollows.size})
                      </h4>
                    )
                  }
                  key="2"
                >
                  {/* 群组粉丝 */}
                  {groupDetails && groupDetails.isPublic && (
                    <div>
                      {/* 群组粉丝现实，超过5个才会显示更多 */}
                      {groupFollows.size > 0 &&
                        [...groupFollows.slice(0, 5)].map((userId) => {
                          const member = memberMap.get(userId);
                          if (!member) {
                            return null;
                          }
                          return (
                            <Member
                              key={userId}
                              itemHeight={42}
                              member={member}
                              id={userId}
                              memberType={'group'}
                            />
                          );
                        })}
                      <div className={styles.groupFollowsTitle}>
                        {/* 粉絲查看更多 */}
                        {groupFollows.size > 5 ? (
                          <div
                            className={styles.loadMore}
                            onClick={this.openMemberFans}
                          >
                            <span style={{ marginLeft: 10 }}>
                              <FormattedText
                                id="Group.seeMore"
                                defaultMessage="查看更多…"
                              />
                            </span>
                          </div>
                        ) : (
                          ''
                        )}
                      </div>
                    </div>
                  )}
                </Panel>
              )}
            </Collapse>

            {/* 查看更多弹出框 */}
            <Modal
              visible={showMemberFans}
              footer={null}
              onCancel={this.closeMemberFans}
              // className="modal-wrapper"
              className={styles.groupSet}
              title={intl.formatMessage({
                id: 'Group.groupSetup',
                defaultMessage: '群組設置',
              })}
            >
              <MemberAndFans
                group={groupDetails}
                onClick={this.openMemberDetail}
              />
            </Modal>
            <InviteMember
              group={groupDetails}
              onClick={this.openMemberDetail}
              visible={showInviteMember}
              footer={null}
              onCancel={this.closeInviteMember}
            />
            {/* <Modal
              visible={showMemberFans}
              footer={null}
              onCancel={this.closeMemberFans}
              // className="modal-wrapper"
              className={styles.groupSet}
              title={intl.formatMessage({
                id: 'Group.groupSetup',
                defaultMessage: '群組設置',
              })}
            >
              <div>
                {memberAvatarUrls.slice(0, 5).map((avatar) => {
                  const { userId } = avatar;
                  const member = memberMap.get(userId);
                  if (!member) {
                    return null;
                  }
                  return (
                    <Member
                      key={userId}
                      id={userId}
                      itemHeight={42}
                      member={member}
                    />
                  );
                })}
              </div>
              {memberAvatarUrls.size > 5 ? (
                <div className={styles.loadMore} onClick={this.openMemberFans}>
                  <Icon style={{ width: 10, height: 6 }} type="down" />
                  <span style={{ marginLeft: 10 }}>
                    <FormattedText
                      id="Group.seeMore"
                      defaultMessage="查看更多…"
                    />
                  </span>
                </div>
              ) : (
                ''
              )}
              {isPublic && (
                <h4 className={styles.groupMember}>
                  <FormattedMessage id="Group.GroupFan">
                    {(text) => text}
                  </FormattedMessage>
                  ({groupFollows.size})
                </h4>
              )}
              {groupFollows.size > 0 &&
                [...groupFollows.slice(0, 5)].map((userId) => {
                  const member = memberMap.get(userId);
                  if (!member) {
                    return null;
                  }
                  return (
                    // <Link to={`/user/${userId}`} key={userId}>
                    <Member
                      id={userId}
                      key={userId}
                      itemHeight={42}
                      member={member}
                    />
                    // </Link>
                  );
                })}
              {groupFollows.size >= 5 ? (
                <FormattedText id="base.loadMore" defaultMessage="加載更多" />
              ) : (
                ''
              )}
              <Modal
                visible={showMemberFans}
                footer={null}
                onCancel={this.closeMemberFans}
                // className="modal-wrapper"
                className={styles.groupSet}
                title={intl.formatMessage({
                  id: 'Group.groupSetup',
                  defaultMessage: '群組設置',
                })}
              >
                <MemberAndFans
                  group={groupDetails}
                  onClick={this.openMemberDetail}
                />
              </Modal>
              <InviteMember
                group={groupDetails}
                onClick={this.openMemberDetail}
                visible={showInviteMember}
                footer={null}
                onCancel={this.closeInviteMember}
              />
            </Modal> */}
          </div>
        </div>
      </div>
    );
  }
}
function mapStateToProps(state, ownProps) {
  const { groupId } = ownProps;
  let groupAdmin = state.groupInfo.get('groupAdmin').toJS();
  let groupAdminList = groupAdmin[groupId];
  return {
    groupAdminList,
    memberMap: state.members.get('memberMap'),
    groupFollows: state.groupInfo.getIn(['groupFans', groupId], Set([])),
    groupUsers: state.groupInfo.get('groupUsers').toJS(),
    groupDetails: getGroupDetail(state, groupId),
    groupMember: state.groupInfo.get('groupMember'),
    startAnimation: state.posts.get('startAnimation'),
  };
}
function mapDispatchToProps(dispatch, props) {
  return {
    groupNotice: (payload) => {
      return dispatch({
        type: 'groupOption/groupNotice',
        payload: {
          ...payload,
        },
      });
    },
    joinGroup: (groupId) => dispatch(leaveGroup(groupId)),
    delGroup: (groupId) =>
      dispatch({
        type: 'groupInfo/delGroup',
        payload: {
          groupId,
        },
      }),
  };
}

export default withRouter(
  injectIntl(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(GroupInfo)
  )
);
