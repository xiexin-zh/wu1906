import React from 'react';
import { connect } from 'dva';
import styles from './Album.css';
import { getUrl } from '../../../utils/utils';
class Album extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  showDetails = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'updatePersonalGroupInfo/controlAlbumDetails',
      payload: true,
    });
  };

  render() {
    const { albumInfo, albumCount } = this.props;
    return (
      <div
        className={styles.AlbumBox}
        onClick={this.showDetails}
        style={{
          justifyContent: `${
            albumInfo.length < 5 ? 'normal' : 'space-between'
          }`,
        }}
      >
        {albumInfo.map((item, index) => {
          return (
            <div
              key={item.originUrl}
              className={styles.albumImgsBox}
              style={{ marginRight: `${albumInfo.length < 5 ? '10px' : '0'}` }}
            >
              {index === 0 && <span className={styles.albumTitle}>相冊</span>}
              <img
                src={
                  item.type === 2
                    ? getUrl(item.thumbnailUrl)
                    : getUrl(item.originUrl)
                }
                alt=""
                className={styles.albumImg}
              />
              {albumCount > 5 && index === albumInfo.length - 1 && (
                <span className={styles.albumNum}>...</span>
              )}
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
    );
  }
}

Album.propTypes = {};

function mapStateToProps(state) {
  return {};
}
export default connect(mapStateToProps)(Album);
