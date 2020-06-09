import React from 'react';
import PropTypes from 'prop-types';
import styles from './index.less';

const FlexWrapper = ({ title, Component, isInput, wrapperClass, noBorder }) => (
  <div className={styles.box}>
    {title && <div className={styles.title}>{title}：</div>}
    {isInput ? (
      <Component />
    ) : (
      <div
        className={`${styles.wrapper} ${wrapperClass}`}
        style={noBorder ? { border: '0', flex: 'auto' } : {}}
      >
        <Component />
      </div>
    )}
  </div>
);

FlexWrapper.defaultProps = {
  isInput: false,
  wrapperClass: '',
  noBorder: false,
};

FlexWrapper.propTypes = {
  title: PropTypes.string.isRequired,
  Component: PropTypes.element.isRequired,
  isInput: PropTypes.bool,
  wrapperClass: PropTypes.string,
  noBorder: PropTypes.bool,
};

export default FlexWrapper;
