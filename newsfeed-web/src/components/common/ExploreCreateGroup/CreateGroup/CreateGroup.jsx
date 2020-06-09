import React from 'react';
import { connect } from 'dva';
import { FormattedMessage, injectIntl } from 'react-intl';

import styles from './CreateGroup.scss';
import { getImgSize } from '../../../../utils/utils';
import CreatGroupAddMember from '../CreatGroupAddMember';
import { message, Modal } from 'antd';
import { throttle } from 'lodash';
// 是否公開（1：公開/0：私密）
const isPublic = {
  public: 1,
  secret: 0,
};
class CreateGroup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      settings: 'public',
      groupHeadDataUrl: null,
      groupHeadFileInfo: null,
      addMemberModal: false, // 添加成員彈出框
      membersList: [], //被添加的成員 list
      showHeadImg: false,
    };
  }

  // 渲染底線
  renderDivider = () => {
    return <div className={styles.divider}></div>;
  };
  // 渲染相機圖片
  renderCameraImg = () => {
    return <i className={styles.camera}></i>;
  };
  // 渲染勾選 icon
  renderCheckIcon = () => {
    return <div className={styles.checkIcon}></div>;
  };
  // 渲染箭頭圖片
  renderArrowIcon = (showType) => {
    const { groupHeadDataUrl, membersList } = this.state;
    const showMumber = Object.is(showType, 'member');
    const showImage = Object.is(showType, 'image');
    return (
      <div className={styles.arrow}>
        {showImage && groupHeadDataUrl && (
          <img
            src={groupHeadDataUrl.showUrl}
            alt=""
            className={styles.showHead}
            width="24px"
            onClick={this.clickHeadImg}
          />
        )}
        {showMumber && !Object.is(membersList.length, 0) && (
          <p className={styles.memberNum}>{membersList.length}</p>
        )}
        <div className={styles.arrowIcon}></div>
      </div>
    );
  };
  //点击已上传的图像
  clickHeadImg = () => {
    this.setState({
      showHeadImg: true,
    });
  };

  //隐藏图像大图
  hideHeadImg = () => {
    this.setState({
      showHeadImg: false,
    });
  };

  //渲染图像大图
  renderHeadImg = () => {
    const { showHeadImg, groupHeadDataUrl } = this.state;
    return (
      <Modal
        className={styles.showHeadImg}
        visible={showHeadImg}
        maskStyle={{
          WebkitBackdropFilter: 'blur(10px)',
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
        }}
        footer={null}
        onCancel={this.hideHeadImg}
      >
        <img
          alt="圖像"
          style={{ width: '100%' }}
          src={groupHeadDataUrl ? groupHeadDataUrl.showUrl : ''}
        />
      </Modal>
    );
  };

  // 渲染群組名稱 input
  renderGroupNameInput = () => {
    const { intl } = this.props;
    const placeholder = intl.formatMessage({
      id: 'Group.GroupNamePlaceholder',
    });

    return (
      <label htmlFor="group_name">
        <input
          type="text"
          id="group_name"
          className={`${styles.groupNameInput} ${styles.styles_BG}`}
          placeholder={placeholder}
          ref={(el) => (this.groupNameElement = el)}
        />
      </label>
    );
  };

  // 上傳群組頭像
  uploadGroupHead = async (event) => {
    const { dispatch } = this.props;
    const target = event.target;
    const fileObj = target.files[0];
    target.value = '';
    const { size } = fileObj;
    const fileWidthHeight = await getImgSize(fileObj);
    const fileInfo = {
      size,
      ...fileWidthHeight,
    };

    dispatch({
      type: 'updatePersonalGroupInfo/uploadGroupHead',
      payload: fileObj,
    }).then((ref) => {
      this.setState({
        groupHeadFileInfo: fileInfo,
        groupHeadDataUrl: ref,
      });
    });
  };
  // 渲染群組頭像
  renderGroupHeadPortrait = () => {
    const { groupHeadDataUrl } = this.state;
    return (
      <div className={`${styles.groupHeadPortrait} ${styles.styles_BG}`}>
        {/* 上傳頭像 input */}
        <input
          type="file"
          accept="image/jpeg,image/jpg,image/png,"
          className={styles.groupHeadFile}
          onChange={this.uploadGroupHead}
          title={groupHeadDataUrl ? '已上傳頭像' : '未上傳頭像'}
        />
        <p>
          <FormattedMessage id="Group.HeadPortrait" defaultMessage="群組頭像" />
        </p>
        {Object.is(groupHeadDataUrl, null)
          ? this.renderCameraImg()
          : this.renderArrowIcon('image')}
      </div>
    );
  };

  // 選擇隱私設置方法
  settingsFun = (event) => {
    const currentSet = event.target.getAttribute('setparameter');
    this.setState({
      settings: currentSet,
    });
  };
  // 隱私設置
  renderPrivacySettings = () => {
    const { settings } = this.state;
    const isPublics = Object.is(settings, 'public');
    const isSecret = Object.is(settings, 'secret');
    return (
      <div className={styles.privacySettingsBoxs}>
        <p className={styles.settingFont}>
          <FormattedMessage
            id="Group.PrivacySettings"
            defaultMessage="私隱設定"
          />
        </p>
        <div
          className={`${styles.selectSetting}`}
          style={{ backgroundColor: isPublics ? '#dae2ed' : '#fff' }}
          setparameter="public"
          onClick={this.settingsFun}
        >
          <div className={`${styles.Icon} ${styles.publicIcon}`}>
            <FormattedMessage id="Group.Public" defaultMessage="公開" />
          </div>
          {isPublics && this.renderCheckIcon()}
        </div>
        <div className={styles.dividerBox}>{this.renderDivider()}</div>
        <div
          className={`${styles.selectSetting}`}
          style={{ backgroundColor: isSecret ? '#dae2ed' : '#fff' }}
          setparameter="secret"
          onClick={this.settingsFun}
        >
          <div className={`${styles.Icon} ${styles.secretIcon}`}>
            <FormattedMessage id="Group.Secret" defaultMessage="秘密" />
          </div>
          {isSecret && this.renderCheckIcon()}
        </div>
      </div>
    );
  };

  // 顯示添加成員
  showAddMembersBoxs = () => {
    this.setState({
      addMemberModal: true,
    });
  };
  hideAddMembersBoxs = () => {
    this.setState({
      addMemberModal: false,
    });
  };
  // 獲取選中的 members
  obtainCheckedMemberList = (membersList) => {
    this.setState({
      membersList,
    });
  };
  // 渲染 新增成員
  renderMembers = () => {
    return (
      <div
        className={styles.privacySettingsBoxs}
        onClick={this.showAddMembersBoxs}
      >
        <p className={styles.settingFont}>
          <FormattedMessage id="Group.NewsMembers" defaultMessage="成員" />
        </p>
        <div className={`${styles.selectSetting}`}>
          <div className={`${styles.Icon} ${styles.addMembers}`}>
            <FormattedMessage
              id="Group.NewsAddMembers"
              defaultMessage="新增成員"
            />
          </div>
          {this.renderArrowIcon('member')}
        </div>
      </div>
    );
  };

  // 創建群 事件
  createFun = throttle(
    () => {
      const groupName = this.groupNameElement.value;
      if (Object.is(groupName.trim().length, 0)) {
        // alert('群組名字不能為空');
        message.error('群組名字不能為空');
        return false;
      }
      if (groupName.trim().length > 50) {
        // alert('群組名稱不得大於50字');
        message.error('群組名稱不得大於50字');
        return false;
      }

      const {
        settings,
        groupHeadDataUrl,
        groupHeadFileInfo,
        membersList,
      } = this.state;

      if (membersList.length > 100) {
        alert('新增群組成員不得大於100位');
        return false;
      }

      const { dispatch } = this.props;
      const avatarUrl = groupHeadDataUrl
        ? {
            url: groupHeadDataUrl.backSaveUrl.originUrl,
            ...groupHeadFileInfo,
          }
        : null;
      const newGroupName = groupName.trim();
      if (!newGroupName) {
        message.error('请输入群组名称群組名稱');
        return false;
      }
      dispatch({
        type: 'updatePersonalGroupInfo/createGroup',
        payload: {
          groupName: newGroupName,
          avatarUrl,
          isPublic: isPublic[settings],
          members: membersList,
        },
      }).then((_) => {
        dispatch({
          type: 'updatePersonalGroupInfo/hideExploreCreateGroupActive',
        });
        dispatch({
          type: 'groupInfo/getAllGroups',
        });
      });
    },
    5000,
    { trailing: false }
  );

  // 渲染創建群組確定按鈕
  renderCreateGroupButton = () => {
    const { intl } = this.props;
    const createGroupFont = intl.formatMessage({ id: 'Group.CreateGroupFont' });
    return (
      <div className={styles.create}>
        <button onClick={this.createFun}>{createGroupFont}</button>
      </div>
    );
  };

  renderCurrentComponent = () => {
    return (
      <div className={styles.createGroupBox}>
        {// 群組名稱
        this.renderGroupNameInput()}

        {// 群組頭像
        this.renderGroupHeadPortrait()}
        {// 隱私設置
        this.renderPrivacySettings()}
        {// 新增成員
        this.renderMembers()}
        {// 確定按鈕
        this.renderCreateGroupButton()}

        {//图像大图
        this.renderHeadImg()}
      </div>
    );
  };
  render() {
    const { addMemberModal } = this.state;
    return (
      <>
        {this.renderCurrentComponent()}
        <CreatGroupAddMember
          addMemberModal={addMemberModal}
          hideAddMembersBoxs={this.hideAddMembersBoxs}
          obtainCheckedMemberList={this.obtainCheckedMemberList}
        />
      </>
    );
  }
}

CreateGroup.propTypes = {};

function mapStateToProps(state) {
  return {};
}
export default connect(mapStateToProps)(injectIntl(CreateGroup));
