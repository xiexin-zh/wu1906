import React, { Component } from 'react';
import { connect } from 'dva';
import { withRouter } from 'dva/router';
import styles from './index.scss';
import { injectIntl } from 'react-intl';
import { Modal, Button, Switch, message, Select } from 'antd';
import { throttle } from 'lodash';
import {
  getAdminGroupList,
  getMemberGroupList,
} from '../../../../models/groupInfo/selectors';
import { sortGroupByIndexSymbol } from '../../../../utils/sort';
import UserAvatar from '../../UserAvatar';
import TargetSelect from '../../CreatePost/TargetSelect';

const { confirm } = Modal;

const getInitialData = (props) => {
  const { groupType } = props;
  return {
    CheckboxList: [0, 1],
    inputList: [],
    endDays: '請選擇天數',
    voteTitle: '',
    subTitle: '',
    content: '',
    isMultipleSelection: false,
    groupId: groupType ? groupType : null,
    isLoading: false,
    canSubmit: true,
    defaultValue: '',
    groupPostType: 0, //个人投票
    isPublicGroup: false,
  };
};

const { Option } = Select;
class SendVote extends Component {
  constructor(props) {
    super(props);
    this.state = getInitialData(props);
  }
  // 調用父組件的方法改變值
  enfn = (e) => {
    if (e) {
      const tagName = e.currentTarget.tagName;
      if (tagName === 'DIV') {
        confirm({
          title: '是否關閉?',
          okText: '確定',
          cancelText: '取消',
          onOk: () => {
            this.closeFn();
          },
        });
      } else {
        this.closeFn();
      }
    } else {
      this.closeFn();
    }
  };
  // 关闭模态框的时候回调
  closeFn = () => {
    this.props.closeModal();
    this.setState(getInitialData(this.props));
  };
  // 添加選項
  addCheckbox = () => {
    let CheckboxList = this.state.CheckboxList,
      inputList = this.state.inputList;
    if (this.state.CheckboxList.length >= 20) {
      message.error('投票最多選擇二十項！');
      return;
    }
    let addlist = CheckboxList[CheckboxList.length - 1] + 1;
    let obj = {
      index: addlist.toString(),
      value: '',
    };
    this.setState({
      CheckboxList: [...CheckboxList, addlist],
      inputList: [...inputList, obj],
    });
  };
  // 刪除選項
  delCheckbox = (index) => {
    if (this.state.CheckboxList.length <= 2) {
      message.error('投票最少選擇兩項！');
      return;
    }

    this.state.inputList.splice(index, 1);
    this.state.CheckboxList.splice(index, 1);
    this.setState({
      CheckboxList: this.state.CheckboxList,
      inputList: this.state.inputList,
    });
  };

  // 獲取所有的input的值
  onInputChange = (event) => {
    const index = event.target.getAttribute('data-input');
    let obj = {
      index: index,
      value: event.target,
    };

    let flag = this.state.inputList.some((item) => {
      return obj.index === item.index;
    });
    if (flag) {
      this.state.inputList.map((item) => {
        if (index === item.index) {
          item.value = obj.value;
        }
        return item;
      });
    } else {
      this.state.inputList.push(obj);
      this.setState({
        inputList: this.state.inputList,
      });
    }
  };
  getValue = (value) => {
    this.setState({
      days: value,
      endDays: value,
    });
  };

  onChangeSwitch = (value) => {
    this.setState({
      isMultipleSelection: value,
    });
  };

  componentDidMount() {
    const { groupType, ownGroups, currentGroup } = this.props;
    // console.log(currentGroup.postByAdmin)
    if (groupType) {
      //isPublicGroup  是否為公開群組
      const isPublicGroup = !!ownGroups.getIn([groupType, 'isPublic']);
      this.setState({
        isPublicGroup,
        isDisabled: true,
        groupId: groupType,
        defaultValue: isPublicGroup ? 'public' : 'private',
      });
    }
    if (currentGroup && currentGroup.postByAdmin) {
      this.groupPostTypeChange(1);
    }
  }
  // 點擊發佈
  handleOk = throttle(
    () => {
      let flag = false;
      const { dispatch, id } = this.props;
      const {
        groupId,
        isMultipleSelection,
        content,
        voteTitle,
        endDays,
        canSubmit,
        defaultValue,
        groupPostType,
      } = this.state;
      const isLoading = this.state.isLoading,
        inputList = this.state.inputList,
        days = this.state.days;
      if (isLoading) {
        return false;
      }
      if (groupId === '群組') {
        message.error('請選擇群組後再發投票!');
        return;
      }
      if (voteTitle.trim().length === 0) {
        message.error('請輸入標題!');
        return;
      }
      if (content.trim().length === 0) {
        message.error('請輸入內容!');
        return;
      }
      if (inputList.length < 2) {
        message.error('請至少選擇二項');
        return;
      }
      inputList.forEach((item) => {
        // if (item.value.value === '' || item.value.value === undefined) {
        //   flag = true;
        // }
        // if (item.value.value !== undefined) {
        //   flag = item.value.value.trim().length === 0 ? true : false;
        // }
        if (
          item.value.value === undefined ||
          item.value.value.trim().length === 0
        ) {
          flag = true;
        }
      });
      if (flag) {
        message.error('請輸入投票內容!');
        return;
      }
      if (endDays === '請選擇天數') {
        message.error('請選擇結束天數');
        return;
      }

      const options = inputList.map((item) => {
        return item.value.value;
      });

      if (!isLoading) {
        this.setState({
          isLoading: true,
        });
      }
      if (!canSubmit) {
        return;
      }
      this.setState({
        canSubmit: false,
      });
      dispatch({
        type: 'sendVote/createVote',
        payload: {
          userId: id,
          groupId: groupId,
          isMultipleSelection,
          content,
          subTitle: voteTitle,
          title: voteTitle,
          endDays: days,
          options,
          isPublic: defaultValue === 'private' ? 0 : 1,
          isAdminVote: groupPostType,
        },
      }).then((res) => {
        if (res) {
          this.enfn();
        }
        this.setState({
          canSubmit: true,
        });
      });
    },
    5000,
    { trailing: false }
  );

  groupChange = (value) => {
    const { ownGroups } = this.props;
    // const { groupPostType } = this.state;
    const postByAdmin = ownGroups.getIn([value, 'postByAdmin']);
    const isPublicGroup = !!ownGroups.getIn([value, 'isPublic']);
    let defaultValue = isPublicGroup ? 'public' : 'private';
    let newGroupPostType = null;
    if (value) {
      newGroupPostType = postByAdmin ? 1 : 0;
    }
    this.setState({
      groupId: value,
      defaultValue,
      isPublicGroup,
      groupPostType: newGroupPostType,
    });
  };
  groupPostTypeChange = (value) => {
    this.setState({
      groupPostType: Number(value),
    });
  };
  changePostType = (value) => {
    this.setState({
      defaultValue: value,
    });
  };

  setTitle = (event) => {
    this.setState({
      voteTitle: event.target.value,
    });
  };
  setContent = (event) => {
    let value = event.target.value;
    this.setState({
      content: value,
    });
  };

  toSendPost = () => {
    this.enfn();
    this.props.openModal();
  };

  render() {
    const { id, ownGroups, ownInfo, groupType, isOpenVote } = this.props;
    const {
      groupId,
      isDisabled,
      endDays,
      CheckboxList,
      content,
      voteTitle,
      defaultValue,
      groupPostType,
      isPublicGroup,
    } = this.state;
    console.log(groupPostType);
    const { title, username } = ownInfo;
    return (
      <>
        <Modal
          maskStyle={{
            WebkitBackdropFilter: 'blur(10px)',
            backdropFilter: 'blur(10px)',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
          }}
          // closable={false}
          className={styles.sendvote}
          visible={isOpenVote}
          title="提交投票"
          onCancel={this.enfn}
          footer={[
            <Button key="submit" type="primary" onClick={this.handleOk}>
              發佈
            </Button>,
          ]}
          destroyOnClose={true}
          bodyStyle={{
            padding: 0,
          }}
          // afterClose={this.afterClose}
        >
          <div className={styles.userinfo}>
            <div className={styles.box}>
              <UserAvatar size={30} userId={id} />
              <div className={styles.userAvatarAndSelect}>
                <div className={styles.closeBox}>
                  <div className={styles.avatarName}>
                    {username && <span>{username}</span>}
                    {title && <span>{title}</span>}
                  </div>
                  <button
                    onClick={this.toSendPost}
                    className={styles.closeVote}
                  >
                    關閉投票
                  </button>
                </div>
                <div className={styles.status}>
                  <TargetSelect
                    groupId={groupType || groupId}
                    groupPostType={groupPostType}
                    typeDisabled={isDisabled}
                    postTypeDisabled={false}
                    groups={[...ownGroups.values()].sort(
                      sortGroupByIndexSymbol
                    )}
                    checkedGroup={ownGroups.get(groupType || groupId)}
                    typeChange={this.groupChange}
                    isPublicGroup={isPublicGroup}
                    groupPostTypeChange={this.groupPostTypeChange}
                    defaultValue={defaultValue}
                    changePostType={this.changePostType}
                    targetSelectType="vote"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className={styles.content}>
            <input
              maxLength={20}
              className={styles.votetitle}
              onChange={this.setTitle}
              value={voteTitle}
              placeholder={'投票標題'}
              type="text"
            />
            <input
              maxLength={100}
              className={styles.votetitle}
              onChange={this.setContent}
              value={content}
              placeholder={'投票內容'}
              type="text"
            />
          </div>

          <div className={styles.option}>
            {CheckboxList &&
              CheckboxList.map((item, index) => {
                return (
                  <div key={item} className={styles.item}>
                    <img
                      onClick={() => this.delCheckbox(index)}
                      src={require('assets/images/icon/rec.png')}
                      alt=""
                    />
                    <input
                      maxLength={15}
                      data-input={item}
                      onChange={this.onInputChange}
                      placeholder={'選項' + (index + 1)}
                      type="text"
                    />
                  </div>
                );
              })}
          </div>

          <div>
            <div onClick={this.addCheckbox} className={styles.addoption}>
              <img
                className={styles.addIcon}
                src={require('assets/images/icon/add.png')}
                alt=""
              />
              <span className={styles.addSpan}>添加選項</span>
            </div>
            <div className={styles.checkbox}>
              <span>可多選</span>

              <Switch
                checked={this.state.isMultipleSelection}
                onChange={this.onChangeSwitch}
              />
            </div>
            <div className={styles.addoption}>
              <span>投票結束時間</span>
              <Select
                value={endDays}
                className={styles.endDays}
                showArrow={false}
                onChange={this.getValue}
                style={{ width: 300, marginLeft: 20 }}
              >
                <Option value="1">1天</Option>
                <Option value="3">3天</Option>
                <Option value="5">5天</Option>
                <Option value="7">7天</Option>
                <Option value="30">30天</Option>
                <Option value="0">永久</Option>
              </Select>
            </div>
          </div>

          <div className={styles.icon}>
            <span className={styles.addtext}>添加更多元素</span>
            <div className={`${styles.icons} ${styles.disable}`}>
              <img src={require('assets/images/icon/group-3.png')} alt="" />
              <span>照片/影片</span>
            </div>

            <div onClick={this.toSendPost} className={styles.icons}>
              <img src={require('assets/images/icon/group.png')} alt="" />
              <span>建立貼文</span>
            </div>
            <div className={`${styles.icons} ${styles.disable}`}>
              <img src={require('assets/images/icon/group-2.png')} alt="" />
              <span>標註人名</span>
            </div>
          </div>
        </Modal>
      </>
    );
  }
}
function mapSatatToProps(state) {
  const adminGroupList = getAdminGroupList(state);
  const memberGroupList = getMemberGroupList(state);
  return {
    ownGroups: adminGroupList.merge(memberGroupList),
    ownInfo: state.users.get('ownInfo'),
  };
}

export default withRouter(connect(mapSatatToProps)(injectIntl(SendVote)));
