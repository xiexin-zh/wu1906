// import React from 'react';
import moment from 'moment';
// import { injectI  } from 'react-intl';
// import { connect } from 'dva';
// import styles from './FormattedDate.css';

function FormattedDate({ ts, intl }) {
  switch (true) {
    case moment(ts).isSame(Date.now(), 'day'):
      return moment(ts).format('l');
    case moment(ts).isSame(Date.now(), 'year'):
      return moment(ts).format('ll');
    default:
      return moment(ts).format('lll');
  }
}
export default FormattedDate;
