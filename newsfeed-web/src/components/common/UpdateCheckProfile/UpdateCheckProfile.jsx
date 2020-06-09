import React from 'react';
import { connect } from 'dva';
// import get from 'lodash/get';
import { Modal, message } from 'antd';
import styles from './UpdateCheckProfile.css';
// import animationStyle from '../../../animation.css';
import { getUrl } from '../../../utils/utils';
import AccordingOriginal from '../AccordingOriginal';
import { editUser, setAvatar } from '../../../models/users/actions';
import ModalLoading from './ModalLoading';
import GroupAvatar from '../GroupAvatar';
import UserAvatar from '../UserAvatar';

// import { addWaterMaskForMask } fort ReactDOM from 'react-dom'rom 'utils/watermark';
const MAX_SIZE = 1024 * 1024 * 5;
const updatePrompt = {
  background: '確認更新背景？',
  head: '確認更新頭像？',
};
const { confirm } = Modal;
/**
 *  showImageType: 傳“background”則是個人中的大背景展示，傳“head”則是個人中的左側頭像展示
 * alt: 頭像 alt
 * size: 頭像 展示的自定義 大小
 * src: 頭像的 url
 * cover:大背景的資訊包括 url
 * isUpdateUrl: 是否顯示更新 button 按鈕
 * isGroupOrUser: 如果是 群組 傳 'group', 如果是個人 傳 'personal' ，來判斷是個人還是群組
 * currentGroupInfo : 當前群組的資訊
 */
class UpdateCheckProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      originalUrl: '',
      showOriginal: false,
    };
  }
  // 判斷是群組還是個人 如果是群組 就是 true 個人 就是 false
  isGroup = () => {
    const { isGroupOrUser } = this.props;
    return Object.is(isGroupOrUser, 'group') ? true : false;
  };
  // 展示大圖
  enlargeImages_fun = () => {
    const { src, showImageType, cover } = this.props;
    if (showImageType === 'background') {
      if (!cover['group_avatarUrl']) {
        message.warning(
          this.isGroup() ? '該群組未上傳圖片' : '該用戶未上傳圖片',
          1
        );
        return;
      }
    }
    if (showImageType === 'head') {
      if (!src) {
        message.warning(
          this.isGroup() ? '該群組未上傳圖片' : '該用戶未上傳圖片',
          1
        );
        return;
      }
    }
    const bg_show_img =
      getUrl((cover || {}).url) || getUrl((cover || {}).group_avatarUrl);
    const originalUrl = {
      background: bg_show_img,
      head: getUrl(src),
    };
    this.setState({
      showOriginal: true,
      originalUrl: originalUrl[showImageType],
    });
  };
  // 隱藏大圖
  hideLargeImages_fun = () => {
    this.setState({
      showOriginal: false,
    });
  };
  // 渲染查看大圖 button
  renderCheckHeadBtn = () => {
    return (
      <div className={styles.updateHeadBox} onClick={this.enlargeImages_fun}>
        <label className={styles.mouseHover}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 42 33"
          >
            <g fill="#FFF" fillRule="evenodd">
              <path d="M27.134 0c1.142-.02 2.032.382 2.465 1.428.784 1.891 2.085 2.321 3.899 2.153 1.815-.17 3.656-.045 5.485-.035 2.03.01 3.014 1.049 3.015 3.175.002 7.714.003 15.428 0 23.142-.001 2.102-.973 3.133-2.95 3.135-6.032.004-12.064.001-18.096.001H3.115c-2.211 0-3.114-.965-3.114-3.326V6.803c0-2.215.953-3.248 3.021-3.257 2.401-.01 4.803-.024 7.204.013.587.01.966-.18 1.268-.697C13.52-.594 13.338.068 16.673.032 20.16-.008 23.648.061 27.134 0zM21.26 5.308l-.546.002c-5.709.172-10.62 5.19-10.66 11.535-.04 6.456 4.824 11.683 10.943 11.71 6.03.026 10.904-5.145 10.946-11.61.04-6.272-4.852-11.496-10.683-11.637l-.273-.002zM7.145 7.946c-1.14-.01-1.881.492-2.084 1.454-.175.83.096 1.522.783 1.925.378.221.859.245 1.293.358 1.46-.08 2.345-1.011 2.083-2.251-.199-.937-.952-1.476-2.075-1.486z" />
              <path d="M21.05 7c4.944.015 8.94 4.463 8.95 9.96.01 5.596-4.002 10.043-9.055 10.04-4.93-.003-8.93-4.463-8.945-9.969-.014-5.59 4.007-10.046 9.05-10.031zm-.078 1.724c-4.093.035-7.419 3.8-7.402 8.378.015 4.43 3.397 8.158 7.416 8.175 4.075.017 7.46-3.773 7.444-8.335-.017-4.487-3.435-8.253-7.458-8.218zm5.767 8.287c0 3.444-2.603 6.348-5.712 6.373-3.134.024-5.767-2.897-5.767-6.4 0-3.447 2.574-6.32 5.709-6.375 3.097-.053 5.77 2.912 5.77 6.402z" />
            </g>
          </svg>
          <p>查看</p>
        </label>
      </div>
    );
  };

  upLaod = (event) => {
    event.persist();
    const {
      showImageType,
      dispatch,
      currentGroupInfo,
      changeLoading,
    } = this.props;
    const _this = this;
    const target = event.target;
    const fileObj = target.files[0];
    if (fileObj.size > MAX_SIZE) {
      message.error('不能上傳超過5M的圖片!');
      return false;
    }
    confirm({
      title: updatePrompt[showImageType],
      okText: '確定',
      cancelText: '取消',
      onOk() {
        target.value = '';
        if (_this.isGroup()) {
          //群組修改資料調用的介面  edit_group
          dispatch({
            type: 'updatePersonalGroupInfo/editGroup',
            payload: {
              fileObj,
              currentGroupInfo: currentGroupInfo.toJS(),
            },
          });
        } else {
          //個人修改資料調用的介面  edit_user
          changeLoading(true);
          if (Object.is(showImageType, 'background')) {
            //修改個人背景
            dispatch(editUser(fileObj)).then((res) => {
              changeLoading(false);
            });
          } else {
            //修改個人頭像
            dispatch(setAvatar(fileObj)).then((res) => {
              changeLoading(false);
            });
          }
        }
      },
      onCancel() {
        console.info('Cancel');
      },
    });
  };
  // 渲染更新頭像 button
  renderUpdateHeadBtn = (_) => {
    return (
      <div
        className={styles.updateHeadBox}
        onClick={() => this.updatefileInput.click()}
      >
        <label className={styles.mouseHover}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 42 33"
          >
            <g fill="#FFF" fillRule="evenodd">
              <path d="M27.134 0c1.142-.02 2.032.382 2.465 1.428.784 1.891 2.085 2.321 3.899 2.153 1.815-.17 3.656-.045 5.485-.035 2.03.01 3.014 1.049 3.015 3.175.002 7.714.003 15.428 0 23.142-.001 2.102-.973 3.133-2.95 3.135-6.032.004-12.064.001-18.096.001H3.115c-2.211 0-3.114-.965-3.114-3.326V6.803c0-2.215.953-3.248 3.021-3.257 2.401-.01 4.803-.024 7.204.013.587.01.966-.18 1.268-.697C13.52-.594 13.338.068 16.673.032 20.16-.008 23.648.061 27.134 0zM21.26 5.308l-.546.002c-5.709.172-10.62 5.19-10.66 11.535-.04 6.456 4.824 11.683 10.943 11.71 6.03.026 10.904-5.145 10.946-11.61.04-6.272-4.852-11.496-10.683-11.637l-.273-.002zM7.145 7.946c-1.14-.01-1.881.492-2.084 1.454-.175.83.096 1.522.783 1.925.378.221.859.245 1.293.358 1.46-.08 2.345-1.011 2.083-2.251-.199-.937-.952-1.476-2.075-1.486z" />
              <path d="M21.05 7c4.944.015 8.94 4.463 8.95 9.96.01 5.596-4.002 10.043-9.055 10.04-4.93-.003-8.93-4.463-8.945-9.969-.014-5.59 4.007-10.046 9.05-10.031zm-.078 1.724c-4.093.035-7.419 3.8-7.402 8.378.015 4.43 3.397 8.158 7.416 8.175 4.075.017 7.46-3.773 7.444-8.335-.017-4.487-3.435-8.253-7.458-8.218zm5.767 8.287c0 3.444-2.603 6.348-5.712 6.373-3.134.024-5.767-2.897-5.767-6.4 0-3.447 2.574-6.32 5.709-6.375 3.097-.053 5.77 2.912 5.77 6.402z" />
            </g>
          </svg>
          <p>更新</p>
        </label>
        <input
          type="file"
          id="fileInput"
          accept="image/jpeg,image/jpg,image/png,"
          ref={(ref) => (this.updatefileInput = ref)}
          onChange={this.upLaod}
          className={styles.uploadInput}
        />
      </div>
    );
  };

  render() {
    const {
      // alt,
      size,
      // src,
      showImageType,
      cover,
      isUpdateUrl,
      loading,
      // startAnimation,
      headId,
      scrollState,
      currentGroupInfo,
    } = this.props;
    const { showOriginal } = this.state;
    const showBg = Object.is(showImageType, 'background');
    const showHead = Object.is(showImageType, 'head');
    const bg_show_img =
      getUrl((cover || {}).url) || getUrl((cover || {}).group_avatarUrl);
    return (
      <div
        className={`
          ${showHead ? styles.avatarBox : styles.bgBox}`}
          style={scrollState?{top:0}:{}}
      >
         {/* ${
            startAnimation && this.isGroup()
              ? animationStyle.hideGroupAvatarBox
              : startAnimation && !this.isGroup()
              ? animationStyle.hidePersonalAvatarBox
              : ''
          } */}
        {showHead &&
          (this.isGroup() ? (
            <GroupAvatar
              groupId={headId || currentGroupInfo.groupId}
              size={size}
            />
          ) : (
            <UserAvatar userId={headId} size={size} />
          ))}
        {showBg && <img src={bg_show_img} alt="" className={styles.img} />}
        <div className={`${showHead ? styles.avatarLayer : styles.bgStyle}`}>
          {isUpdateUrl && this.renderUpdateHeadBtn()}
          {this.renderCheckHeadBtn()}
        </div>
        {/* 渲染图片弹出层 */}

        <Modal visible={showOriginal} footer={null} onCancel={this.hideLargeImages_fun}>
          <AccordingOriginal
            // previewVisible={showOriginal}
            previewImage={cover.group_avatarUrl}
            // handleCancel={this.hideLargeImages_fun}
          />
        </Modal>
        {loading && <ModalLoading />}
      </div>
    );
  }
}

UpdateCheckProfile.propTypes = {};

function mapStateToProps(state) {
  return {
    loading: state.updatePersonalGroupInfo.get('loading'),
    startAnimation: state.posts.get('startAnimation'),
    avatarState:state.posts.get('avatarState'),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    changeLoading: (bool) => {
      dispatch({
        type: 'updatePersonalGroupInfo/changeLoading',
        payload: bool,
      });
    },
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UpdateCheckProfile);
