import React from 'react';
import { Input } from 'antd';
import PropTypes from 'prop-types';
import FlexWrapper from '../FlexWrapper';
import styles from './index.css';

const { TextArea } = Input;
const TextInputBox = ({ defaultValue, setRef, title, onlyShow }) => {
  return (
    <FlexWrapper
      Component={() =>
        onlyShow ? (
          <div className={styles.showDataBox}>{defaultValue}</div>
        ) : (
          <TextArea
            className={styles.input}
            maxLength={300}
            defaultValue={defaultValue}
            placeholder="请输入"
            ref={setRef}
          />
        )
      }
      isInput={!onlyShow}
      title={title}
    />
  );
};

TextInputBox.defaultProps = {
  onlyShow: false,
};

TextInputBox.propTypes = {
  defaultValue: PropTypes.string.isRequired,
  setRef: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  onlyShow: PropTypes.bool,
};

export default TextInputBox;
