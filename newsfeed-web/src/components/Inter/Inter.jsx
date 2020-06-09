import React from 'react';
import moment from 'moment';
import { IntlProvider } from 'react-intl';
import {
  LANGUAGE_MAP,
  LANGUAGE_LIST,
  DEFAULT_LANGUAGE,
} from '../../utils/language.js';

export const LanguageContext = React.createContext({
  language: DEFAULT_LANGUAGE,
  setLanguage: (language) => {
    this.language = language;
  },
});

function intlMoment(language) {
  if (language === 'zh') {
    moment.locale('zh', {
      longDateFormat: {
        l: '[今天] HH:mm',
        ll: 'M月D日 HH:mm',
        lll: 'YYYY年M月D日 HH:mm',
      },
      meridiem: function(hour, minute, isLower) {
        const hm = hour * 100 + minute;
        if (hm < 1200) {
          return '上午';
        } else {
          return '下午';
        }
      },
    });
  } else if (language === 'en') {
    moment.locale('en', {
      longDateFormat: {
        l: '[today] HH:mm',
        ll: 'M-D HH:mm',
        lll: 'YYYY-M-D HH:mm',
      },
    });
  }
}

class Inter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      language:
        window.localStorage.getItem('currentLanguage') || DEFAULT_LANGUAGE,
      setLanguage: this.setLanguage,
    };
  }
  setLanguage = (language) => {
    if (!LANGUAGE_LIST.includes(language)) {
      language = DEFAULT_LANGUAGE;
    }
    this.setState({
      language,
    });
  };
  render() {
    const { children } = this.props;
    let { language } = this.state;
    const languageMessages = LANGUAGE_MAP.get(language);
    intlMoment(language);
    return (
      <LanguageContext.Provider value={this.state}>
        <IntlProvider
          locale={language}
          key={language}
          messages={languageMessages}
        >
          {children}
        </IntlProvider>
      </LanguageContext.Provider>
    );
  }
}

export default Inter;
