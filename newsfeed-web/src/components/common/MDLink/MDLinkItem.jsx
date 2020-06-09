import React from 'react';
import { withRouter } from 'dva/router';
import propTypes from 'prop-types';
import queryString from 'query-string';
import last from 'lodash/last';

export class MDLinkItem extends React.PureComponent {
  static propTypes = {
    url: propTypes.string.isRequired,
    text: propTypes.string.isRequired,
    protocol: propTypes.oneOf(['newsfeed']).isRequired,
    disableClick: propTypes.bool,
  };

  static defaultProps = {
    disableClick: false,
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  get params() {
    const { url } = this.props;
    return queryString.parse(last(url.split('?')));
  }

  openLink = (e) => {
    const { disableClick, protocol } = this.props;
    if (disableClick) {
      return false;
    }

    if (protocol === 'newsfeed') {
      this.newsfeedHandle();
    }
  };

  newsfeedHandle = () => {
    const { history, markList } = this.props;
    if (this.getType() === 'group') {
      history.push(`/groups/${this.getId()}`);
    } else if (['user', 'seeUser'].includes(this.getType())) {
      history.push(`/user/${this.getId()}`);
    } else if (this.getType() === 'mentionUsers') {
      markList && markList();
    }
  };

  getType() {
    return this.params.type;
  }

  getId() {
    return this.params.id;
  }

  render() {
    const { text, className } = this.props;
    return (
      <span className={className} onClick={this.openLink}>
        {text}
      </span>
    );
  }
}

export default withRouter(MDLinkItem);
