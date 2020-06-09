import React, { useRef, useState, useEffect } from 'react';
// import { Modal } from 'antd';
import { addWaterMaskForMask } from 'utils/watermark';
import { connect } from 'dva';
import styles from './index.scss';
import PropTypes from 'prop-types';

function AccordingOriginal({
  // previewVisible,
  previewImage,
  // handleCancel,
  employee_id,
}) {
  const imgWrapper = useRef(null);
  const [waterMarkUrl, setUrl] = useState(previewImage);
  useEffect(() => {
    const currentWrapper = imgWrapper.current;
    const dealUrl = currentWrapper
      ? addWaterMaskForMask(currentWrapper, employee_id)
      : previewImage;
    setUrl(dealUrl);
  });
  return (
    // <Modal visible={previewVisible} footer={null} onCancel={handleCancel}>
    <div>
      <img
        src={waterMarkUrl}
        style={{
          width: '100%',
          height: '70vh',
          objectFit: 'contain',
          backgroundImage: `url(${previewImage})`,
        }}
        alt=""
        className={styles.imgWrapper}
        ref={imgWrapper}
      />
      <div className={styles.mask}></div>
    </div>

    // </Modal>
  );
}

function mapStateToProps(state) {
  return {
    employee_id: state.session.getIn(['user', 'employee_id']),
  };
}
AccordingOriginal.propTypes = {
  previewImage: PropTypes.string.isRequired,
  employee_id: PropTypes.string.isRequired,
};

export default connect(mapStateToProps)(AccordingOriginal);
