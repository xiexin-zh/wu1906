import React from 'react';
import propTypes from 'prop-types';
import { matchPostTop } from '../../../utils/utils';
import MDLinkItem from './MDLinkItem';

import styles from './index.css';

class MDLink extends React.PureComponent {
  static propTypes = {
    disableClick: propTypes.bool,
    subStrLength: propTypes.number,
  };

  static defaultProps = {
    disableClick: false,
    subStrLength: 50,
  };

  render() {
    const { text, disableClick, markList, subStrLength } = this.props;
    const arr = matchPostTop(text);
    return (
      <>
        {arr.map((item, i) => {
          switch (item.type) {
            case 'normal':
              return item.text;
            case 'link':
              const { protocol, text, url } = item.data;
              return (
                <MDLinkItem
                  disableClick={disableClick}
                  className={styles.mdLink}
                  key={i}
                  url={url}
                  text={
                    text.length > subStrLength
                      ? text.substr(0, subStrLength) + '...'
                      : text
                  }
                  protocol={protocol}
                  markList={markList}
                  index={i}
                />
              );
            default:
              return null;
          }
        })}
      </>
    );
  }
}
export default MDLink;
