import React, { useState, useRef, useEffect } from 'react';
import { addWaterMaskForMask } from 'utils/watermark';
import { connect } from 'dva';
import styles from './waterMark.css';
import PropTypes from 'prop-types';
const WaterMark = ({ employee_id, url, nowItem }) => {
  const imgWrapper = useRef(null);
  const [waterMarkUrl, setUrl] = useState(url);
  useEffect(() => {
    const currentWrapper = imgWrapper.current;
    const markUrl = addWaterMaskForMask(currentWrapper, employee_id);
    const dealUrl =
      url.indexOf('http://') === 0 ||
      url.indexOf('https://') === 0 ||
      url.indexOf('/storage/emulated/') === 0 //移动端发的图片怎么会有这个开头的地址？
        ? url
        : markUrl
        ? markUrl
        : url;
    setUrl(dealUrl);
  });

  return (
    <div className={styles.box}>
      <img
        src={waterMarkUrl}
        className={styles.imgWrapper}
        style={{ backgroundImage: `url(${url})` }}
        alt="waterMarkImg"
        ref={imgWrapper}
      />
      <div className={styles.mask}></div>
    </div>
  );
};

WaterMark.propTypes = {
  url: PropTypes.string.isRequired,
  employee_id: PropTypes.string.isRequired,
};

function mapStateToProps(state) {
  return {
    employee_id: state.session.getIn(['user', 'employee_id']),
  };
}

export default connect(mapStateToProps)(WaterMark);
