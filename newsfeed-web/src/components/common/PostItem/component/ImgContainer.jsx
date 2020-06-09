import React, { Component } from 'react';
import { connect } from 'dva';
import styles from './index.scss';
import classNames from 'classnames';
import { getUrl } from '../../../../utils/utils';

class ImgContainer extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.contextmenuHandle = this.contextmenuHandle.bind(this);
  }
  contextmenuHandle(e) {
    e.preventDefault();
  }

  handleClick = (msg) => {
    // this.props.clickFunc(msg);
    const { files, dispatch, clickFunc } = this.props;
    dispatch({
      type: 'postsPopup/saveFileItem',
      payload: {
        fileItem: msg,
        files,
      },
    });
    clickFunc();
  };
  renderImg = (item) => {
    const { type } = item;
    switch (type) {
      case 1:
        return getUrl(item.originUrl);
      case 2:
        return getUrl(item.thumbnailUrl);
      case 3:
        return getUrl(item.originUrl);
      default:
        return;
    }
  };

  render() {
    const { files } = this.props;

    const length = files.length;
    let className = classNames({
      [`${styles.imgBox}`]: true,
      [`${styles[`imgBox${length}`]}`]: length <= 5,
      [`${styles.imgBoxMore}`]: this.props.files.length > 5,
    });

    return (
      <div className={styles.modalContainer}>
        <div className={className} onContextMenu={this.contextmenuHandle}>
          {files.slice(0, 5).map((item, index) => {
            const { type } = item;
            return (
              <div
                className={
                  item.type === 2 && length !== 1
                    ? `${styles.videoContainer}`
                    : ''
                }
                data-content={`+${length - 5}`}
                onClick={() => this.handleClick(item)}
                key={index}
                // style={{ height: Object.is(files.length, 1) ? '350px' : '' }}  需要对视频做处理  图片不需要
                style={{
                  height:
                    Object.is(files.length, 1) && item.type === 2
                      ? '350px'
                      : '',
                }}
              >
                {length === 1 && type === 2 ? (
                  <video
                    controls="controls"
                    // autoPlay="autoplay"
                    src={getUrl(item.originUrl)}
                    width={'100%'}
                    height={'100%'}
                    muted
                    ref={(ref) => {
                      this.videoDom = ref;
                    }}
                  ></video>
                ) : (
                  <img
                    style={{ width: '100%', height: '100%' }}
                    src={this.renderImg(item)}
                    alt=""
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {};
}
export default connect(mapStateToProps)(ImgContainer);
