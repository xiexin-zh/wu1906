import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

function FormattedText(props) {
  return <FormattedMessage {...props}>{(text) => text}</FormattedMessage>;
}

FormattedText.propTypes = {
  id: PropTypes.string.isRequired,
  defaultMessage: PropTypes.string,
  value: PropTypes.object,
};
export default FormattedText;
