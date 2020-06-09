import React from 'react';
import { connect } from 'dva';
import styles from './AlbumDetails.scss';
import { Modal, Pagination } from 'antd';
import { getUrl } from '../../../utils/utils';

const modalTitle = {
  user: '個人相冊',
  group: '群组相册',
};

class AlbumDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userAlbumSet: [],
      userAlbumCount: 0,
      showCurrentImgUrl: {},
      visible: false,
    };
  }
  componentDidMount() {
    this.albumPagination();
  }
  hideDetails = (e) => {
    e.stopPropagation();
    const { dispatch } = this.props;
    dispatch({
      type: 'updatePersonalGroupInfo/controlAlbumDetails',
      payload: false,
    });
  };
  albumPagination = async ({ page = 1 } = {}) => {
    const { dispatch, userId, seeUserId, groupId, type } = this.props;
    if (type === 'user') {
      const { data } = await dispatch({
        type: 'updatePersonalGroupInfo/getAlbumInfo',
        payload: {
          page,
          userId,
          seeUserId,
        },
      });
      this.setState({
        userAlbumSet: data.userAlbum,
        userAlbumCount: data.count,
      });
    } else if (type === 'group') {
      const { data } = await dispatch({
        type: 'updatePersonalGroupInfo/getGroupAlbumInfo',
        payload: {
          groupId,
          page,
        },
      });
      this.setState({
        userAlbumSet: data.groupAlbum,
        userAlbumCount: data.count,
      });
    }
  };

  showImg = (item) => {
    this.setState({
      showCurrentImgUrl: item,
      visible: true,
    });
  };
  hideHeadImg = () => {
    this.setState({
      visible: false,
      showCurrentImgUrl: {},
    });
  };
  //渲染图像大图
  renderHeadImg = () => {
    const {
      showCurrentImgUrl: {
        type,
        originUrl,
        // thumbnailUrl
      },
      visible,
    } = this.state;
    return (
      <Modal
        visible={visible}
        destroyOnClose={true}
        className={styles.bigImg}
        maskStyle={{
          WebkitBackdropFilter: 'blur(10px)',
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
        }}
        footer={null}
        onCancel={this.hideHeadImg}
      >
        {type === 2 ? (
          <video
            controls="controls"
            autoPlay="autoplay"
            src={getUrl(originUrl)}
            width="100%"
            height="540px"
            muted
          ></video>
        ) : (
          <img
            alt="圖像"
            style={{ width: '100%', maxHeight: '540px', objectFit: 'contain' }}
            src={getUrl(originUrl)}
          />
        )}
      </Modal>
    );
  };
  render() {
    const { albumVisible, type } = this.props;
    const { userAlbumSet, userAlbumCount } = this.state;
    return (
      <>
        <Modal
          className={styles.albumDetailsBox}
          visible={albumVisible}
          destroyOnClose={true}
          title={modalTitle[type]}
          maskStyle={{
            WebkitBackdropFilter: 'blur(10px)',
            backdropFilter: 'blur(10px)',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
          }}
          footer={
            <Pagination
              total={userAlbumCount}
              pageSize={9}
              onChange={(page) => this.albumPagination({ page })}
            />
          }
          onCancel={this.hideDetails}
        >
          <div className={styles.imgsContents}>
            {userAlbumSet &&
              userAlbumSet.map((item) => {
                return (
                  <div
                    className={styles.albumDetailsImg}
                    key={item.originUrl}
                    onClick={() => this.showImg(item)}
                  >
                    <img
                      src={
                        item.type === 2
                          ? getUrl(item.thumbnailUrl)
                          : getUrl(item.originUrl)
                      }
                      alt=""
                      className={styles.imgItem}
                    />
                    {item.type === 2 && (
                      <div className={styles.imgShadow}>
                        <img
                          src={require('../../../assets/images/video.png')}
                          alt=""
                        />
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </Modal>
        {this.renderHeadImg()}
      </>
    );
  }
}

AlbumDetails.propTypes = {};

function mapStateToProps(state) {
  return {
    albumVisible: state.updatePersonalGroupInfo.get('albumVisible'),
  };
}
export default connect(mapStateToProps)(AlbumDetails);
