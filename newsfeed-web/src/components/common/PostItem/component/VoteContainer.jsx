import React, { PureComponent } from 'react';
import styles from './index.scss';
import moment from 'moment';
import { connect } from 'dva';
import { Radio, Checkbox, Button, Progress, message, Modal } from 'antd';
// import FormattedDate from '../../FormattedDate';
import UserAvatar from '../../UserAvatar';
// import { getUserDataFromStore } from '../../../../models/users/selectors';
// import { AddressBook } from '../../Address/AddressBook';

class VoteContainer extends PureComponent {
  state = {
    value: '',
    cvalue: [],
    showVote: false,
    voteList: [],
  };

  handlePostVote = async () => {
    const {
      votes: { multipleSelection, voteId },
      dispatch,
    } = this.props;
    const { value, cvalue } = this.state;
    if (cvalue.length === 0 && !value) {
      message.warning('還沒有選擇投票選項哦');
      return;
    }
    let payload = multipleSelection
      ? { voteId: voteId, optionIds: cvalue }
      : { optionIds: [value], voteId: voteId };

    const { code, data } = await dispatch({
      type: 'userInfo/postVote',
      payload,
    });
    if (code === '200') {
      dispatch({
        type: 'posts/editPostUpdatePostList',
        payload: {
          editedPost: data,
        },
      });
    }
  };
  onChange = (e) => {
    this.setState({
      value: e.target.value,
    });
  };
  onCheckChange = (checkedValues) => {
    this.setState({
      cvalue: checkedValues,
    });
  };
  //展示投票成員列表
  showVoteList = (userAvatarUrls) => {
    const { members } = this.props;
    const voteList = userAvatarUrls.map((item) => {
      return members.get(item.userId);
    });
    this.setState({
      showVote: true,
      voteList,
    });
  };
  //隱藏投票列表
  handleCancel = () => {
    this.setState({
      showVote: false,
    });
  };

  render() {
    const {
      title,
      content,
      endTs,
      multipleSelection,
      optionResultBeans,
      submitVote,
      isVoteExpired,
    } = this.props.votes;

    const { showVote, voteList } = this.state;

    const formatRes = optionResultBeans.map((item) => {
      return { label: item.optionContent, value: item.optionId };
    });

    const canVote = submitVote && !isVoteExpired;
    return (
      <div className={styles.voteContainer}>
        <h4 className={styles.voteTitle}>
          <i className={styles.voteIcon}></i>
          {title}
        </h4>
        <p>{content}</p>
        <p className={styles.endTime}>
          <span>
            截止日期：
            {endTs ? moment(endTs).format('YYYY-MM-DD HH:mm') : '永久'}
          </span>
          {canVote && <span>[{multipleSelection ? '可多選' : '單選'}]</span>}
        </p>
        {canVote ? (
          <div className={styles.votesRes}>
            {multipleSelection ? (
              <div>
                <Checkbox.Group onChange={this.onCheckChange}>
                  {formatRes.map((item) => {
                    return (
                      <div key={item.value}>
                        <Checkbox value={item.value}>{item.label}</Checkbox>
                        <br />
                      </div>
                    );
                  })}
                </Checkbox.Group>
                <br />
              </div>
            ) : (
              <div>
                <Radio.Group onChange={this.onChange} value={this.state.value}>
                  {optionResultBeans.map((item) => {
                    return (
                      <div key={item.optionId}>
                        <Radio value={item.optionId}>
                          {item.optionContent}
                        </Radio>
                        <br />
                      </div>
                    );
                  })}
                </Radio.Group>
              </div>
            )}
            <Button className={styles.submitVote} onClick={this.handlePostVote}>
              提交投票
            </Button>
          </div>
        ) : (
          <div className={styles.votesRes}>
            {optionResultBeans.map((item, index) => {
              const { userAvatarUrls, ownVoteStatus } = item;
              return (
                <div className={styles.voteItem} key={index}>
                  <div className={styles.voteResContent}>
                    <div className={styles.voteResCount}>
                      <div className={styles.voteCountBox}>
                        <img
                          className={styles.voteSelectImg}
                          src={
                            ownVoteStatus
                              ? require('./icons/selected.png')
                              : require('./icons/noSelect.png')
                          }
                          alt=""
                        />
                        <span>{item.optionContent}</span>
                      </div>
                      <span>{item.voteCount}票</span>
                    </div>
                    <div className={styles.voteProgress}>
                      <Progress
                        format={(percent) => ''}
                        percent={item.votePercentage * 100}
                        strokeColor={'#4184b1'}
                      />
                    </div>
                  </div>
                  {userAvatarUrls &&
                    userAvatarUrls.slice(0, 3).map(({ userId }) => {
                      return <UserAvatar key={userId} userId={userId} />;
                    })}
                  {userAvatarUrls && userAvatarUrls.length > 3 && (
                    <div
                      className={styles.voteMember}
                      onClick={() => this.showVoteList(userAvatarUrls)}
                    >
                      +{userAvatarUrls.length - 3}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
        {/* 投票成員列表 */}
        {
          <Modal
            className={styles.voteMemberBox}
            title="投票列表"
            visible={showVote}
            onCancel={this.handleCancel}
            maskStyle={{
              WebkitBackdropFilter: 'blur(10px)',
              backdropFilter: 'blur(10px)',
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
            }}
            footer={null}
          >
            <div className={styles.voteList}>
              {voteList &&
                voteList.map((item) => {
                  return (
                    <div className={styles.voteMembers} key={item.id}>
                      <UserAvatar userId={item.id} />
                      <span className={styles.memberName}>
                        {item['full_name'] + ' ' + item['given_name']}
                      </span>
                    </div>
                  );
                })}
              {/* <AddressBook memberList={voteList}/> */}
            </div>
          </Modal>
        }
        <div></div>
      </div>
    );
  }
}
function mapStateToProps(state, ownstate) {
  return {
    members: state.members.get('memberMap'),
  };
}
export default connect(mapStateToProps)(VoteContainer);
