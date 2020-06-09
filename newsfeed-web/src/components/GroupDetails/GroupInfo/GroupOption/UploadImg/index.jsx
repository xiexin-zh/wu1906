import React, { Component } from 'react';
import { connect } from 'dva';
import { Avatar, Modal } from 'antd';
import styles from './index.scss';
import { getUrl } from '../../../../../utils/utils';
import ModalLoading from '../../../../common/UpdateCheckProfile/ModalLoading';
class UploadImg extends Component {
  constructor() {
    super();
    this.state = {
      avatarUrl: '',
      showHeadImg: false,
    };
  }
  upLaod = (event) => {
    const { dispatch, groupDetails } = this.props;
    if (groupDetails.groupId) {
      const target = event.target;
      const fileObj = target.files[0];

      dispatch({
        type: 'updatePersonalGroupInfo/uploadImagesUrlDate',
        payload: { fileObj },
      }).then((res) => {
        const { url } = res;
        this.setState({
          avatarUrl: url,
        });
        dispatch({
          type: 'groupOption/saveUrl',
          payload: res,
        });
      });
    }
  };

  //渲染图像大图
  renderHeadImg = () => {
    const { showHeadImg, avatarUrl } = this.state;
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
        <img alt="圖像" style={{ width: '100%' }} src={getUrl(avatarUrl)} />
      </Modal>
    );
  };

  //隐藏图像大图
  hideHeadImg = () => {
    this.setState({
      showHeadImg: false,
    });
  };

  showHeadImg = () => {
    this.setState({
      showHeadImg: true,
    });
  };

  componentDidMount() {
    const { groupDetails } = this.props;
    this.setState({
      avatarUrl: groupDetails.avatarUrl,
    });
  }

  render() {
    const { groupDetails, loading } = this.props;
    const { avatarUrl } = this.state;

    return (
      <div style={{ overflow: 'hidden', width: '100%', height: '100%' }}>
        <div className={styles.uploddBox}>
          <div className={styles.groupAvatar}>群組頭像</div>
          <div className={styles.UploadImg}>
            <div
              onClick={() => this.updatefileInput.click()}
              style={{ cursor: 'pointer' }}
            >
              <svg
                t="1572066410424"
                className="icon"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="2320"
                width="40"
                height="40"
              >
                <path
                  d="M512.140705 379.234207c-82.390475 0-149.126412 66.734914-149.126412 149.127436s66.735937 149.127436 149.126412 149.127436c82.392522 0 149.128459-66.735937 149.128459-149.127436S594.532203 379.234207 512.140705 379.234207z"
                  p-id="2321"
                ></path>
                <path
                  d="M874.146529 304.669978 766.396479 304.669978c-14.907525 0-30.944779-28.708855-35.789111-42.87039l-32.057113-68.975954c-4.843308-14.161534-22.372543-37.282115-37.282115-37.282115L363.014292 155.541519c-14.908548 0-32.803103 23.119557-37.282115 37.282115l-27.578102 71.960938c-4.861728 13.780865-20.518313 39.885406-35.426861 39.885406L154.594449 304.669978c-49.185212 0-89.836051 14.909571-89.836051 64.496943l0 404.877237c0 49.223075 40.650839 89.855494 89.836051 89.855494l719.553103 0c49.589418 0 85.378529-40.632419 85.378529-89.855494L959.526081 369.166921C959.525058 319.579549 923.735947 304.669978 874.146529 304.669978zM512.140705 752.053308c-123.402541 0-223.689618-100.285031-223.689618-223.691665 0-123.404588 100.287077-223.691665 223.689618-223.691665 123.408681 0 223.692688 100.287077 223.692688 223.691665C735.83237 651.768277 635.548362 752.053308 512.140705 752.053308z"
                  p-id="2322"
                ></path>
              </svg>
            </div>
            <Avatar
              shape="square"
              alt={'.....'}
              className={styles.groupImg}
              size={30}
              src={getUrl(avatarUrl)}
              onClick={getUrl(avatarUrl) ? this.showHeadImg : null}
            >
              {groupDetails.indexSybmol}
            </Avatar>
            <input
              type="file"
              id="fileInput"
              accept="image/jpeg,image/jpg,image/png,"
              ref={(ref) => (this.updatefileInput = ref)}
              onChange={this.upLaod}
              className={styles.uploadInput}
            />
          </div>
        </div>
        {loading && <ModalLoading />}
        {this.renderHeadImg()}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    loading: state.updatePersonalGroupInfo.get('loading'),
  };
}

export default connect(mapStateToProps)(UploadImg);
