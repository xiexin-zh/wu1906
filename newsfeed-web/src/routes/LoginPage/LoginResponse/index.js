import React from 'react';
import { connect } from 'dva';
import styles from './index.css';

//登入 login
import LoadingIcon from 'components/common/LoadingIcon/index.js';

import { FormattedMessage } from 'react-intl';
class Load extends React.Component {
  render() {
    return (
      <div className={styles.Load}>
        <div className={styles.membersLoading}>
          <LoadingIcon />
        </div>
        <p className={styles.later}>
          <FormattedMessage id="Login.PleaseWait" />
        </p>
      </div>
    );
  }
}

Load.propTypes = {};
export default connect()(Load);
